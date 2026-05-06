// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	site: 'https://interactive-intelligence.github.io',
	base: '/website/',
	integrations: [icon()],
});
