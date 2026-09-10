import { getCollection, type CollectionKey } from 'astro:content'

// Entries with `published: false` in their frontmatter are never rendered.
export const getPublished = <C extends CollectionKey>(collection: C) =>
	getCollection(collection, (entry) => (entry.data as { published?: boolean }).published !== false)

// An announcement only gets a detail page (and a link) if it has real body text.
// HTML comments don't count, so example files can carry notes without becoming clickable.
export const hasBody = (entry: { body?: string }) =>
	Boolean(entry.body?.replace(/<!--[\s\S]*?-->/g, '').trim())
