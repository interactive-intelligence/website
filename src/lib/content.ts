import { getCollection } from 'astro:content'

// Entries with `hidden: true` in their frontmatter are never rendered.
export const getAnnouncements = () => getCollection('announcements', ({ data }) => !data.hidden)
export const getTalks = () => getCollection('talks', ({ data }) => !data.hidden)

// An announcement only gets a detail page (and a link) if it has real body text.
// HTML comments don't count, so example files can carry notes without becoming clickable.
export const hasBody = (entry: { body?: string }) =>
	Boolean(entry.body?.replace(/<!--[\s\S]*?-->/g, '').trim())
