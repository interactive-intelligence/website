# interactive intelligence website

This is an Astro project for the i2 website. i2 is UW's student-led NeuroAI education and research organization.

## development guidelines

- Write simple, clean code.
- Use latest framework conventions and best practices.
- The site is configured with `base: '/website/'` in `astro.config.mjs`. Any URL pointing to a `public/` asset must be prefixed with `import.meta.env.BASE_URL`, otherwise the dev server throws a router error. Use Astro helpers (`<a href>` with the `base` import from `astro:config/client`) or prepend `BASE_URL` manually for raw URL strings.
- Images live in `src/assets/` so they go through Astro's image pipeline (`<Image />` from `astro:assets`) — automatic WebP/AVIF, responsive `srcset`, hashed filenames. Reserve `public/` for files that need a stable URL (favicon, robots.txt, OG images) or can't be imported. For data-driven images (e.g. team photos referenced from content collections by filename), resolve them with `import.meta.glob<{ default: ImageMetadata }>('../assets/<dir>/*.{jpg,jpeg,png,webp,avif}')` and pass the result to `<Image>` — see `src/pages/team.astro`.
