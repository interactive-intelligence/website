// Posts Discord announcements to the website. Claude reads each new message in the
// watched channels and decides whether it belongs on the site (see
// docs/announcement-agent.md). Posts are checked with a build and committed to main.
// The bot marks every message it reads: ✅ the site changed, 👀 nothing changed, ❌ the
// draft didn't build.
// A leader can react 🌐 to a skipped or older message to post it anyway.
// The README explains the setup.
//
//   node scripts/discord-announcements.js check   # only report whether anything is pending
//   node scripts/discord-announcements.js         # handle everything pending

import { execFileSync, spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { stripVTControlCharacters } from 'node:util';

const OVERRIDE = '🌐';
const POSTED = '✅';
const SKIPPED = '👀';
const FAILED = '❌';
// Unmarked messages older than this are left alone, so the first run doesn't post old history.
const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;
// What Claude may read and write. Everything else on the site stays hand-edited.
const CONTENT_DIRS = [
	'src/content/announcements',
	'src/content/talks',
	'src/content/links',
	'src/content/schedule'
];
const WRITABLE_PATH =
	/^src\/content\/(announcements|talks|links|schedule)\/(?!example-)[a-z0-9-]+\.md$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const DRAFT_SCHEMA = {
	type: 'object',
	properties: {
		files: {
			type: 'array',
			items: {
				type: 'object',
				properties: { path: { type: 'string' }, content: { type: 'string' } },
				required: ['path', 'content'],
				additionalProperties: false
			}
		},
		commit_message: { type: 'string' },
		note: { type: 'string' }
	},
	required: ['files', 'commit_message', 'note'],
	additionalProperties: false
};

const { DISCORD_BOT_TOKEN, GITHUB_OUTPUT } = process.env;
const channelIds = list(process.env.DISCORD_CHANNEL_IDS);
const roleIds = list(process.env.DISCORD_ROLE_IDS);

if (!DISCORD_BOT_TOKEN || channelIds.length === 0 || roleIds.length === 0) {
	console.log("Discord announcements aren't configured yet, so there is nothing to do.");
} else if (process.argv[2] === 'check') {
	const pending = await pendingMessages();
	console.log(`${pending.length} message(s) to read`);
	if (GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT, `pending=${pending.length > 0}\n`);
} else {
	await postPending();
}

async function postPending() {
	// Imported here so `check` runs before `npm ci`.
	const { default: Anthropic } = await import('@anthropic-ai/sdk');
	const client = new Anthropic();
	const marks = [];
	let committed = false;

	for (const message of await pendingMessages()) {
		try {
			if (await postMessage(client, message)) {
				committed = true;
				marks.push([message, POSTED]);
			} else if (message.forced) {
				throw new Error(`Nothing was drafted for a ${OVERRIDE} message.`);
			} else {
				marks.push([message, SKIPPED]);
			}
		} catch (error) {
			// API errors are usually temporary, so leave the message unmarked and retry next run.
			if (error instanceof Anthropic.APIError) {
				console.error(`Skipping ${message.id} until the next run: ${error.message}`);
				process.exitCode = 1;
				continue;
			}
			console.error(`Couldn't post ${message.id}: ${error.message}`);
			revertContent();
			marks.push([message, FAILED]);
		}
	}

	if (committed) {
		git('pull', '--rebase');
		git('push');
		// Pushes made with the workflow's token don't trigger other workflows, so start the
		// deploy directly. If this fails, the daily rebuild still publishes the change.
		try {
			execFileSync('gh', ['workflow', 'run', 'deploy.yml', '--ref', 'main'], { stdio: 'inherit' });
		} catch {
			console.error("Couldn't start the deploy; the daily rebuild will publish it.");
		}
	}

	// Mark last, so a message is only marked once its content is pushed.
	for (const [message, emoji] of marks) await react(message, emoji);
}

// Oldest first: recent messages the bot hasn't marked yet, plus messages a leader
// reacted 🌐 to that weren't posted (`forced`).
async function pendingMessages() {
	const pending = [];
	for (const channelId of channelIds) {
		const { guild_id } = await discord(`/channels/${channelId}`);
		const messages = await discord(`/channels/${channelId}/messages?limit=100`);
		for (const message of messages.reverse()) {
			// Only regular messages and replies, not joins, pins, and other system messages.
			if (![0, 19].includes(message.type)) continue;
			const reactions = message.reactions ?? [];
			const marks = reactions.filter((r) => r.me).map((r) => r.emoji.name);
			if (marks.includes(POSTED) || marks.includes(FAILED)) continue;
			const forced =
				reactions.some((r) => r.emoji.name === OVERRIDE) &&
				(await reactedByLeader(guild_id, message));
			const recent = Date.now() - Date.parse(message.timestamp) < MAX_AGE_MS;
			if (forced || (recent && marks.length === 0)) pending.push({ ...message, guild_id, forced });
		}
	}
	return pending;
}

async function reactedByLeader(guildId, message) {
	const users = await discord(
		`${messagePath(message)}/reactions/${encodeURIComponent(OVERRIDE)}?limit=100`
	);
	for (const user of users) {
		// 404 means the user has left the server.
		const member = await discord(`/guilds/${guildId}/members/${user.id}`).catch((error) => {
			if (error.status === 404) return null;
			throw error;
		});
		if (member?.roles.some((id) => roleIds.includes(id))) return true;
	}
	return false;
}

// Has Claude draft the message and commits the result. If the draft can't be used, Claude
// gets the error and one more try. Returns whether anything was committed.
async function postMessage(client, message) {
	const messages = [
		{
			role: 'user',
			content: [...(await images(message)), { type: 'text', text: messagePrompt(message) }]
		}
	];
	for (let attempt = 1; ; attempt++) {
		const response = await client.beta.messages.create({
			model: 'claude-sonnet-5-5',
			max_tokens: 16000,
			betas: ['server-side-fallback-2026-07-01'],
			fallbacks: 'default',
			output_config: { format: { type: 'json_schema', schema: DRAFT_SCHEMA } },
			system: systemPrompt(),
			messages
		});
		if (response.stop_reason === 'refusal') {
			throw new Error(
				`Claude declined: ${response.stop_details?.explanation ?? 'no reason given'}`
			);
		}
		if (response.stop_reason === 'max_tokens') throw new Error('The draft was cut off.');
		const draft = JSON.parse(response.content.find((block) => block.type === 'text')?.text ?? '');
		console.log(`${message.id}: ${draft.note}`);
		if (draft.files.length === 0) return false;

		try {
			commitDraft(message, draft);
			return true;
		} catch (error) {
			if (attempt === 2) throw error;
			console.error(`Retrying ${message.id}: ${error.message}`);
			revertContent();
			messages.push(
				{ role: 'assistant', content: response.content },
				{
					role: 'user',
					content: `${error.message}\n\nFix the draft and return all of its files again.`
				}
			);
		}
	}
}

// Writes the draft, checks that the site builds, and commits it.
function commitDraft(message, { files, commit_message }) {
	for (const { path } of files) {
		if (!WRITABLE_PATH.test(path)) throw new Error(`You can't write to ${path}.`);
	}
	for (const { path, content } of files) writeFileSync(path, content.trimEnd() + '\n');

	const build = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
	if (build.status !== 0) {
		const output = stripVTControlCharacters(build.stdout + build.stderr).slice(-4000);
		throw new Error(`The site failed to build with this draft:\n\n${output}`);
	}

	git('add', '--', ...files.map((file) => file.path));
	const source = `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`;
	git('commit', '-m', commit_message, '-m', `From Discord: ${source}`);
}

function systemPrompt() {
	const examples = CONTENT_DIRS.flatMap(markdownFiles).filter((path) => isExample(path));
	const instructions = readFileSync('docs/announcement-agent.md', 'utf8');
	return [instructions, fileBlock('src/content.config.ts'), ...examples.map(fileBlock)].join(
		'\n\n'
	);
}

function messagePrompt(message) {
	const initiatives = markdownFiles('src/content/initiatives').map((path) => {
		const name = /^name:\s*(.+)$/m.exec(readFileSync(path, 'utf8'))?.[1];
		return `- ${basename(path, '.md')}: ${name}`;
	});
	const existing = CONTENT_DIRS.flatMap(markdownFiles).filter((path) => !isExample(path));
	const author = message.author.global_name ?? message.author.username;

	return [
		`Initiative ids:\n${initiatives.join('\n')}`,
		`Existing site content:\n\n${existing.map(fileBlock).join('\n\n')}`,
		`Discord message from ${author}, posted ${pacificDate(message.timestamp)}:`,
		`<message>\n${messageText(message)}\n</message>`,
		message.forced
			? `A leader reacted ${OVERRIDE} to this message, so post it.`
			: 'Decide whether this message belongs on the website.'
	].join('\n\n');
}

// The message text with user mentions resolved and non-image attachments listed.
function messageText(message) {
	const names = new Map(
		message.mentions.map((user) => [user.id, user.global_name ?? user.username])
	);
	const text = message.content.replace(/<@!?(\d+)>/g, (mention, id) =>
		names.has(id) ? `@${names.get(id)}` : mention
	);
	const files = message.attachments
		.filter((file) => !file.content_type?.startsWith('image/'))
		.map((file) => `Attached file: ${file.filename}`);
	return [text, ...files].join('\n');
}

async function images(message) {
	const blocks = [];
	for (const file of message.attachments) {
		const mediaType = file.content_type?.split(';')[0];
		if (
			!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(mediaType) ||
			file.size > MAX_IMAGE_BYTES
		)
			continue;
		const response = await fetch(file.url);
		if (!response.ok) {
			console.warn(`Skipping image ${file.filename}: ${response.status}`);
			continue;
		}
		const data = Buffer.from(await response.arrayBuffer()).toString('base64');
		blocks.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data } });
	}
	return blocks;
}

async function discord(path, options = {}) {
	for (;;) {
		const response = await fetch(`https://discord.com/api/v10${path}`, {
			...options,
			headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
		});
		if (response.status === 429) {
			const { retry_after } = await response.json();
			await new Promise((resolve) => setTimeout(resolve, retry_after * 1000));
			continue;
		}
		if (!response.ok) {
			const error = new Error(
				`Discord ${options.method ?? 'GET'} ${path}: ${response.status} ${await response.text()}`
			);
			error.status = response.status;
			throw error;
		}
		return response.status === 204 ? null : response.json();
	}
}

function react(message, emoji) {
	return discord(`${messagePath(message)}/reactions/${encodeURIComponent(emoji)}/@me`, {
		method: 'PUT'
	});
}

function messagePath(message) {
	return `/channels/${message.channel_id}/messages/${message.id}`;
}

function markdownFiles(dir) {
	return readdirSync(dir)
		.filter((file) => file.endsWith('.md'))
		.map((file) => `${dir}/${file}`);
}

function isExample(path) {
	return basename(path).startsWith('example-');
}

function fileBlock(path) {
	return `<file path="${path}">\n${readFileSync(path, 'utf8').trim()}\n</file>`;
}

function pacificDate(timestamp) {
	return new Date(timestamp).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}

function revertContent() {
	git('reset', '-q', '--', 'src/content');
	git('checkout', '--', 'src/content');
	git('clean', '-fdq', '--', 'src/content');
}

function git(...args) {
	execFileSync('git', args, { stdio: 'inherit' });
}

function list(value = '') {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}
