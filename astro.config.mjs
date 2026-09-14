// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
	site: 'https://interactive-intelligence.github.io',
	base: '/website/',
	integrations: [icon(), sitemap()],
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
	],
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
