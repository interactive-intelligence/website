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
| Links | `src/content/links/` | Copy `example-link.md`. Anything people can act on right now: applications, signups, interest forms. Every open link is listed on the Join page. Tag one with an `initiative` to also show it as a button on that initiative's card and page. An optional `closes` date hides it automatically the day after. |
| Team | `src/content/team/` | One file per person. Put the photo in the same folder and reference it with `image: ./photo.jpg`. Set `active: false` for alumni. |
| Initiatives | `src/content/initiatives/` | One file per program. Photos go in `photos/`. `order` sets the display order. `external_url` sends the initiative's links off-site instead of to a page here. Apply buttons come from the links folder, not from this file. |
| Schedule | `src/content/schedule/` | One file per academic year with three quarters. Initiative `id`s are filenames from the initiatives folder. |
| Constitution | `src/content/constitution.md` | |
| Projects, Publications | `src/content/projects/`, `src/content/publications/` | Defined but not shown anywhere yet. Only the unpublished research page draft (`src/pages/_research.astro`) reads them. |

Every type accepts `published: false` to keep an entry out of the site, for example a draft or an outdated schedule. Entries are published by default.

The `example-*.md` files document every field with comments. They are marked `published: false` so they never render.

Other places you may need:

- `src/pages/` has the page templates. Static copy on pages like About and Join lives here.
- `src/lib/links.ts` holds shared links like the Discord invite.
- `src/assets/` holds site images and fonts.
- `src/styles/global.css` holds shared styles.
