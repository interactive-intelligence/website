import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content'

// Entries with `published: false` in their frontmatter are never rendered.
export const getPublished = <C extends CollectionKey>(collection: C) =>
	getCollection(collection, (entry) => (entry.data as { published?: boolean }).published !== false)

export type Link = CollectionEntry<'links'>

const DAY = 24 * 60 * 60 * 1000
const closesAt = (link: Link) => (link.data.closes ? link.data.closes.getTime() + DAY : Infinity)

// Published links that haven't closed yet, soonest deadline first. A link with a
// `closes` date stays up through that whole day, Pacific time.
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
