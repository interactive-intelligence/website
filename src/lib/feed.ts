import { getPublished, hasBody } from './content'

// One row in the announcements feed. Announcements and talks both become
// feed items so they can be listed together, newest first.
export type FeedItem = {
	date: Date
	title: string
	summary?: string
	// Absent when there is no detail page to link to.
	href?: string
}

type FeedOptions = {
	// Only items belonging to this initiative. Talks belong to the `talks` initiative.
	initiative?: string
	limit?: number
}

export async function getFeed({ initiative, limit }: FeedOptions = {}): Promise<FeedItem[]> {
	const base = import.meta.env.BASE_URL
	const [announcements, talks] = await Promise.all([
		getPublished('announcements'),
		getPublished('talks')
	])

	const announcementItems: FeedItem[] = announcements
		.filter((a) => !initiative || a.data.initiatives?.some((ref) => ref.id === initiative))
		.map((a) => ({
			date: a.data.date,
			title: a.data.title,
			summary: a.data.summary,
			href: hasBody(a) ? `${base}announcements/${a.id}` : undefined
		}))

	const talkItems: FeedItem[] =
		!initiative || initiative === 'talks'
			? talks.map((t) => ({
					date: t.data.posted,
					title: `i2 Talk: ${t.data.title}`,
					summary: t.data.summary,
					href: `${base}talks/${t.id}`
				}))
			: []

	const items = [...announcementItems, ...talkItems].sort(
		(a, b) => b.date.getTime() - a.date.getTime()
	)
	return limit ? items.slice(0, limit) : items
}
