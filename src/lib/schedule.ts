import type { CollectionEntry } from 'astro:content'

// "Now" is build time. The nightly rebuild keeps these current.

// Where a quarter falls relative to now.
export function quarterStatus(quarter: { start: Date; end: Date }, now = new Date()) {
	if (now < quarter.start) return 'upcoming'
	if (now >= quarter.end) return 'past'
	return 'current'
}

type Talk = CollectionEntry<'talks'>

// Talks still to come, soonest first, and past talks, most recent first.
export function splitTalks(talks: Talk[], now = new Date()) {
	const soonestFirst = (a: Talk, b: Talk) => a.data.date.getTime() - b.data.date.getTime()
	return {
		upcoming: talks.filter((t) => t.data.date >= now).sort(soonestFirst),
		past: talks.filter((t) => t.data.date < now).sort((a, b) => soonestFirst(b, a))
	}
}
