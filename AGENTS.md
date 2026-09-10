# interactive intelligence website

This is an Astro project for the i2 website. i2 is UW's student-led NeuroAI education and research organization.

## development guidelines

- Write simple, clean code.
- Use latest framework conventions and best practices.
- The site is temporarily configured with `base: '/website/'` in `astro.config.mjs`. Keep this in mind when referencing assets or creating links.
- Before starting your own dev server, check if one is running at `http://localhost:4321/website`

## css guidelines

- Write minimal, modern css.
- Use global styles from `src/styles/global.css` before writing custom styles.

## content guidelines

- Announcements live in `src/content/announcements/`, talks in `src/content/talks/`. Each is a markdown file with frontmatter; the filename is the URL slug.
- The `example-*.md` files in those folders document every field. They are kept `published: false` so they never render; copy one to add real content.
