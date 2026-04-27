# Initiatives implementation plan

Build out the `/initiatives` page, individual subpages, and refactor the homepage accordion to share a single content source.

## Information architecture

Three surfaces, distinct shapes:

- **Homepage accordion** — scannable teaser. Short pitch + "Learn More" → subpage + conditional apply CTA.
- **`/initiatives` hub** — visual browse page for users navigating from the navbar. Sections or cards with photos and slightly fuller descriptions.
- **Subpages (`/initiatives/[slug]`)** — full description (with room for logistical detail) followed by past work / forms / announcements. You do not have to implement the actual page content for these yet.

Navbar gets a dropdown listing each initiative + an "All initiatives" entry pointing to `/initiatives`. Dropdown links go straight to subpages (or external for intro course).

Intro course has no subpage; all of its links (homepage, hub, navbar dropdown) go directly to the external course site.

## Content collection

New collection at `src/content/initiatives/`. One markdown file per initiative.

### Schema

```ts
{
  name: string,
  short_description: string,      // homepage accordion (1-2 sentences)
  long_description: string,       // /initiatives hub card (slightly fuller)
  photo: image,                   // for /initiatives hub card
  external_url?: string,          // intro course — skips subpage generation
  form_url?: string,              // application/interest form (when open)
  form_label?: string,            // e.g. "Apply for Fall 2026"
  order: number,                  // display order across surfaces
  // markdown body = full subpage content
}
```

### Entries

- `intro-course.md` — has `external_url`, no body needed
- `dsi.md`
- `fellows.md`
- `research-room.md`
- `talks.md`

Migrate descriptions from the homepage `initiatives` array in `src/pages/index.astro` as the starting point. `long_description` can be expanded later.

## Pages

### `src/pages/index.astro`

- Replace the hardcoded `initiatives` array with a `getCollection('initiatives')` call, sorted by `order`.
- Accordion renders `short_description`.
- "Learn More" button: link to `external_url` if set, else `/initiatives/[slug]`.
- Apply CTA: render only when `form_url` is set; use `form_label` as button text.

### `src/pages/initiatives/index.astro`

- Reads the collection.
- Visual card grid: photo + name + `long_description` + CTA.
- CTA same logic as homepage (external link or subpage link).

### `src/pages/initiatives/[slug].astro` (new dynamic route)

- `getStaticPaths` returns entries where `external_url` is **not** set.
- Renders: name, full description (markdown body), conditional apply CTA.
- Past-work section is stubbed/omitted for now — the `projects` and `talks` collections are boilerplate-only and will be wired up later.
- Delete the existing hand-written stubs: `src/pages/initiatives/fellows.astro`, `intro-course.astro`, `research-room.astro`, `talks.astro`, and the `dsi/` directory.

### Navbar

- Update `src/components/Navbar.astro` to render a dropdown under "Initiatives".
- Dropdown reads from the collection so it stays in sync.
- Entries link to `external_url` or `/initiatives/[slug]`.
- Top-level "Initiatives" link points to `/initiatives`.

## Out of scope (deferred)

- Quarter-availability status pills ("Running Spring 2026", "Returns Fall 2026"). Revisit if users get confused by missing apply buttons.
- Past work / projects / talks integration on subpages — depends on those collections being fleshed out first.
- Announcements section.

## Build order

1. Define the collection schema in `src/content.config.ts` (or wherever existing collections are configured).
2. Create the five markdown files with migrated descriptions.
3. Refactor homepage accordion to read from the collection.
4. Build `/initiatives` hub page.
5. Build dynamic `[slug].astro` route; remove old stub pages.
6. Add navbar dropdown.
7. Sanity check all three surfaces in the browser.
