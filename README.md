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

   Open `http://localhost:4321/website/` in your browser. The page reloads on its own whenever you save a file. Press `Ctrl+C` in the terminal to stop the server.

Note the `/website/` at the end of the URL. This base path is set in `astro.config.mjs` and applies to every link and asset on the site.

To check that the site builds correctly before pushing, run `npm run build`. This writes the finished site to `dist/`, and `npm run preview` serves that folder locally.

## Editing content

Most content is Markdown with frontmatter under `src/content/`. Field definitions live in `src/content.config.ts`. Filenames become URL slugs.

| What | Where | Notes |
| --- | --- | --- |
| Announcements | `src/content/announcements/` | Copy `example-announcement.md` (or the short variant). |
| Talks | `src/content/talks/` | Copy `example-talk.md`. Talks display on the announcements page, the Talks initiative page, and the schedule page. |
| Team | `src/content/team/` | One file per person. Put the photo in the same folder and reference it with `image: ./photo.jpg`. Set `active: false` for alumni. |
| Initiatives | `src/content/initiatives/` | One file per program. Photos go in `photos/`. `order` sets the display order. |
| Schedule | `src/content/schedule/` | One file per academic year with three quarters. Initiative `id`s are filenames from the initiatives folder. |
| Constitution | `src/content/constitution.md` | |

Every type accepts `published: false` to keep an entry out of the site, for example a draft or an outdated schedule. Entries are published by default.

The `example-*.md` files document every field with comments. They are marked `published: false` so they never render.

Other places you may need:

- `src/pages/` has the page templates. Static copy on pages like About and Join lives here.
- `src/lib/links.ts` holds shared links like the Discord invite.
- `src/assets/` holds site images and fonts.
- `src/styles/global.css` holds shared styles.
