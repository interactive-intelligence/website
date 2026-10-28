// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// `$...$` is math only in course content. Everywhere else the original text goes back,
// so "$5 to $10" in an announcement stays a price.
/** @type {import('@astrojs/markdown-remark').RemarkPlugin} */
function remarkMathOnlyInCourse() {
	return (tree, file) => {
		if (file.path?.includes('/src/content/course/')) return;
		/** @param {import('mdast').Parent} node */
		const restore = (node) =>
			node.children.forEach((child, i) => {
				if (child.type !== 'math' && child.type !== 'inlineMath') {
					if ('children' in child) restore(child);
					return;
				}
				const { start, end } = child.position ?? {};
				/** @type {import('mdast').Text} */
				const text = { type: 'text', value: String(file.value).slice(start?.offset, end?.offset) };
				node.children[i] = child.type === 'math' ? { type: 'paragraph', children: [text] } : text;
			});
		restore(tree);
	};
}

// In course content, each "Synthesis Questions" heading and the list of questions after it go in
// a box so the questions stand out.
/** @type {import('@astrojs/markdown-remark').RehypePlugin} */
function rehypeSynthesisBoxes() {
	/** @param {import('hast').RootContent} node @returns {string} */
	const text = (node) =>
		node.type === 'text' ? node.value : 'children' in node ? node.children.map(text).join('') : '';
	/** @param {import('hast').RootContent} node */
	const isHeading = (node) => node.type === 'element' && /^h[1-6]$/.test(node.tagName);
	/** @param {import('hast').RootContent} node */
	const isListOrSpace = (node) =>
		(node.type === 'element' && /^(ul|ol)$/.test(node.tagName)) ||
		(node.type === 'text' && !node.value.trim());

	return (tree, file) => {
		if (!file.path?.includes('/src/content/course/')) return;
		/** @type {import('hast').RootContent[]} */
		const children = [];
		for (let i = 0; i < tree.children.length; i++) {
			const node = tree.children[i];
			if (!(isHeading(node) && text(node).trim().toLowerCase() === 'synthesis questions')) {
				children.push(node);
				continue;
			}
			let end = i + 1;
			while (end < tree.children.length && isListOrSpace(tree.children[end])) end++;
			children.push({
				type: 'element',
				tagName: 'div',
				properties: { className: ['synthesis'] },
				children: /** @type {import('hast').ElementContent[]} */ (tree.children.slice(i, end)),
			});
			i = end - 1;
		}
		tree.children = children;
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://uw-i2.org',
	integrations: [icon(), sitemap({ filter: (page) => !page.includes('/qr-codes') })],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Open Sauce Sans',
			cssVariable: '--font-sans',
			fallbacks: ['system-ui', 'sans-serif'],
			display: 'swap',
			options: {
				variants: [
					{ src: ['./src/assets/fonts/OpenSauceSans-Light.woff2'], weight: 300, style: 'normal' },
					{ src: ['./src/assets/fonts/OpenSauceSans-LightItalic.woff2'], weight: 300, style: 'italic' },
					{ src: ['./src/assets/fonts/OpenSauceSans-Regular.woff2'], weight: 400, style: 'normal' },
					{ src: ['./src/assets/fonts/OpenSauceSans-Italic.woff2'], weight: 400, style: 'italic' },
					{ src: ['./src/assets/fonts/OpenSauceSans-Medium.woff2'], weight: 500, style: 'normal' },
					{ src: ['./src/assets/fonts/OpenSauceSans-MediumItalic.woff2'], weight: 500, style: 'italic' },
					{ src: ['./src/assets/fonts/OpenSauceSans-SemiBold.woff2'], weight: 600, style: 'normal' },
					{ src: ['./src/assets/fonts/OpenSauceSans-SemiBoldItalic.woff2'], weight: 600, style: 'italic' },
					{ src: ['./src/assets/fonts/OpenSauceSans-Bold.woff2'], weight: 700, style: 'normal' },
					{ src: ['./src/assets/fonts/OpenSauceSans-BoldItalic.woff2'], weight: 700, style: 'italic' },
					{ src: ['./src/assets/fonts/OpenSauceSans-ExtraBold.woff2'], weight: 800, style: 'normal' },
					{ src: ['./src/assets/fonts/OpenSauceSans-ExtraBoldItalic.woff2'], weight: 800, style: 'italic' },
				],
			},
		},
		{
			provider: fontProviders.fontsource(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			fallbacks: ['ui-monospace', 'monospace'],
			display: 'swap',
		},
	],
	vite: {
		// Mermaid is imported lazily (see CourseLayout.astro), so the dev server only finds it mid-session
		// and its pre-bundle can go stale ("504 Outdated Optimize Dep"). Bundle it up front instead.
		optimizeDeps: { include: ['mermaid'] },
	},
	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},
	markdown: {
		// Mermaid blocks are left as code and drawn in the browser (see CourseLayout.astro).
		syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'mermaid'] },
		shikiConfig: { theme: 'github-light' },
		processor: unified({
			remarkPlugins: [remarkMath, remarkMathOnlyInCourse],
			rehypePlugins: [
				rehypeSynthesisBoxes,
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: 'append',
						properties: { className: 'heading-anchor', ariaHidden: 'true', tabIndex: -1 },
						content: { type: 'text', value: '#' },
					},
				],
				// After the heading plugins, so headings with math get plain-text ids.
				rehypeKatex,
			],
		}),
	},
});
