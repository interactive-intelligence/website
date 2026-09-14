# interactive intelligence website

This is an Astro project for the i2 website. i2 is UW's student-led NeuroAI education and research organization.

## development guidelines

- Write simple, clean code.
- Use latest framework conventions and best practices.
- Before starting your own dev server, check if one is running at `http://localhost:4321`

## css guidelines

- Write minimal, modern css.
- Use global styles from `src/styles/global.css` before writing custom styles.

## content guidelines

- Announcements live in `src/content/announcements/`, talks in `src/content/talks/`. Each is a markdown file with frontmatter; the filename is the URL slug.
- Open links (applications, signups, interest forms) live in `src/content/links/`. Each is frontmatter only. Every open link is listed on the Join page; one tagged with an `initiative` also becomes a button on that initiative. An optional `closes` date hides it automatically.
- The `example-*.md` files in those folders document every field. They are kept `published: false` so they never render; copy one to add real content.
