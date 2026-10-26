# i2 website

Source code for i2's website. Built with [Astro](https://astro.build).

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Local development

Running the site locally lets you preview changes before pushing them.

1. **Install Node.js.** You need version 22.12 or newer. Download it from [nodejs.org](https://nodejs.org) or use a version manager like [nvm](https://github.com/nvm-sh/nvm). Check with:

   ```sh
   node -v
   ```

2. **Clone the repo** and enter the project folder:

   ```sh
   git clone https://github.com/interactive-intelligence/website.git
   cd website
   ```

3. **Install dependencies.** This downloads Astro and the other packages the site uses into `node_modules/`. You only need to do this once, or again whenever `package.json` changes.

   ```sh
   npm install
   ```

4. **Start the dev server:**

   ```sh
   npm run dev
   ```

   Open `http://localhost:4321/` in your browser. The page reloads on its own whenever you save a file. Press `Ctrl+C` in the terminal to stop the server.


To check that the site builds correctly before pushing, run `npm run build`. This writes the finished site to `dist/`, and `npm run preview` serves that folder locally.

## Editing content

Most content is Markdown with frontmatter under `src/content/`. Field definitions live in `src/content.config.ts`. Filenames become URL slugs.

| What | Where | Notes |
| --- | --- | --- |
| Announcements | `src/content/announcements/` | Copy `example-announcement.md` (or the short variant). Shown on the announcements page and the home page. Tag one with `initiatives` to also show it on those initiative pages. An announcement with a body gets its own page; a `link_url` adds a button there. |
| Talks | `src/content/talks/` | Copy `example-talk.md`. Talks display on the announcements page, the Talks initiative page, and the schedule page. |
| Links | `src/content/links/` | Copy `example-link.md`. Anything people can act on right now: applications, signups, interest forms. Every open link is listed on the Join page. Tag one with an `initiative` to also show it as a button on that initiative's card and page. An optional `closes` date hides it automatically the day after; `closes` with a time (`2026-06-07 23:59`, Pacific) hides it at that minute and shows the time. |
| Team | `src/content/team/` | One file per person. Put the photo in `photos/` and reference it with `image: ./photos/photo.jpg`. Set `active: false` for alumni. |
| Initiatives | `src/content/initiatives/` | One file per program. Photos go in `photos/`. `order` sets the display order. `external_url` sends the initiative's links off-site instead of to a page here. Apply buttons come from the links folder, not from this file. |
| Schedule | `src/content/schedule/` | One file per academic year with three quarters. Initiative `id`s are filenames from the initiatives folder. |
| Constitution | `src/content/constitution.md` | |
| Intro Course home | `src/content/course/home.md` | The welcome text at the top of `/intro-course`, where students find the course materials. The initiative page at `/initiatives/intro-course` is the course's public description. |
| Intro Course units | `src/content/course/units/` | Copy `example-unit.md`. Each unit is a page under `/intro-course/`. Core units have a `unit` number; optional units leave it out. Images go in `images/<unit>/`. Math is written in LaTeX (`$x$` inline, or between `$$` lines for a block), and a `mermaid` code block becomes a diagram. A `Synthesis Questions` heading and the list right after it are shown in a box. |
| Intro Course schedule | `src/content/course/weeks/` | Copy `example-week.md`. One file per week, shown in order on the course schedule page. |
| Intro Course staff | `src/content/course/staff/` | Copy `example-staff.md`. One file per person per role. Photos go in `photos/`. Set `active: false` once someone's quarter is over. |
| Intro Course resources | `src/content/course/resources.md` | Links to the course's forms, slides, and recordings, shown as cards at `/intro-course/resources`. Add each one under `links` in the frontmatter with a `title` and `url`. |
| Intro Course graduates | `src/content/course/graduates.md` | Add a `##` heading for the quarter and list the names. |
| Projects, Publications | `src/content/projects/`, `src/content/publications/` | Defined but not shown anywhere yet. Only the unpublished research page draft (`src/pages/_research.astro`) reads them. |

Every type accepts `published: false` to keep an entry out of the site, for example a draft or an outdated schedule. Entries are published by default.

The `example-*.md` files document every field with comments. They are marked `published: false` so they never render.

Other places you may need:

- `src/pages/` has the page templates. Static copy on pages like About and Join lives here.
- `src/lib/links.ts` holds shared links like the Discord invite.
- `src/assets/` holds site images and fonts.
- `src/styles/global.css` holds shared styles.

## Discord announcements

Announcements posted in Discord reach the site on their own. Every 15 minutes, `.github/workflows/discord-announcements.yml` reads new messages in the announcements channel. Claude decides which ones belong on the site and makes the matching changes: an announcement or talk, a link for any form people can fill out (shown on the Join page), and new meeting times on the schedule. If the site still builds, the change is committed straight to `main` and deployed.

The bot reacts to every message it reads:

| Reaction | Meaning |
| --- | --- |
| ✅ | The site changed: a new post, or an edit to something already there. |
| 👀 | Read, but nothing on the site changed. A leader can react 🌐 to have Claude look again, leaning toward posting. This also works on older messages the bot never read. |
| 👌 | Looked again after a 🌐, but the site already had everything in the message. |
| ❌ | The draft didn't build, so nothing was posted. Remove the ❌ to retry (this needs the Manage Messages permission), or update the site by hand. |

The bot also watches a leadership-only channel. Post there when something should go on the site, or change on it, without being announced to the whole server. It goes through the same flow.

Edited messages aren't read again on their own. To have the bot reread one, remove its mark (this also needs Manage Messages) and react 🌐.

To change how Claude decides and writes, edit `docs/announcement-agent.md`. The script sends that file as Claude's instructions. To fix a post, edit or delete its file under `src/content/` like any other entry. To check right away instead of waiting, open the workflow under the repo's **Actions** tab and click **Run workflow**.

### Setup

1. **Create the bot.** Open the [Discord developer portal](https://discord.com/developers/applications) and click **New Application**. On the **Bot** page, turn on **Message Content Intent**, then click **Reset Token** and copy the token.
2. **Add it to the server.** On the **OAuth2** page, copy the client ID. Open `https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=66624` (that grants View Channels, Read Message History, and Add Reactions) and pick the i2 server. If the announcements channel is private, give the bot access to it.
3. **Copy the IDs.** In Discord, turn on **Settings → Advanced → Developer Mode**. Right-click the announcements channel and choose **Copy Channel ID**. Then go to **Server Settings → Roles**, right-click the leadership role, and choose **Copy Role ID**.
4. **Get an Anthropic API key** from the [Claude Console](https://platform.claude.com/settings/keys).
5. **Add everything to GitHub** under **Settings → Secrets and variables → Actions**:
   - Secrets: `DISCORD_BOT_TOKEN` and `ANTHROPIC_API_KEY`
   - Variables: `DISCORD_CHANNEL_IDS` (the channel ID) and `DISCORD_ROLE_IDS` (the role ID). Separate multiple IDs with commas.

The workflow does nothing until all four are set. Unmarked messages older than three days are ignored, so turning it on won't post old history.
