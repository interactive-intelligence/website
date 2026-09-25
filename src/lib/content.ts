import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content'
import { hasTime } from './dates'

// Entries with `published: false` in their frontmatter are never rendered.
export const getPublished = <C extends CollectionKey>(collection: C) =>
	getCollection(collection, (entry) => (entry.data as { published?: boolean }).published !== false)

export type Link = CollectionEntry<'links'>

const DAY = 24 * 60 * 60 * 1000

// The instant a link disappears. A date-only `closes` keeps it up through that whole
// day, Pacific time; a `closes` with a time takes it down at that minute.
const closesAt = (link: Link) => {
	const { closes } = link.data
	if (!closes) return Infinity
	return hasTime(closes) ? closes.getTime() : closes.getTime() + DAY
}

// For a `data-closes` attribute, so the browser can hide a link the moment it closes
// instead of waiting for the next nightly rebuild (see Layout.astro).
export const closesAttr = (link: Link) => {
	const at = closesAt(link)
	return Number.isFinite(at) ? at : undefined
}

// Published links that haven't closed yet, soonest deadline first.
export async function getOpenLinks(): Promise<Link[]> {
	const now = Date.now()
	return (await getPublished('links'))
		.filter((link) => closesAt(link) > now)
		.sort((a, b) => closesAt(a) - closesAt(b) || a.data.title.localeCompare(b.data.title))
}

// The open links tagged with an initiative, for its apply buttons.
export const linksFor = (links: Link[], initiative: string) =>
	links.filter((link) => link.data.initiative?.id === initiative)

// An announcement only gets a detail page (and a link) if it has real body text.
// HTML comments don't count, so example files can carry notes without becoming clickable.
export const hasBody = (entry: { body?: string }) =>
	Boolean(entry.body?.replace(/<!--[\s\S]*?-->/g, '').trim())
