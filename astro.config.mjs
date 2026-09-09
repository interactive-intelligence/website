// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
	site: 'https://interactive-intelligence.github.io',
	base: '/website/',
	integrations: [icon()],
	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},
	markdown: {
		processor: unified({
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: 'append',
						properties: { className: 'heading-anchor', ariaLabel: 'Link to section' },
						content: { type: 'text', value: '#' },
					},
				],
			],
		}),
	},
});
