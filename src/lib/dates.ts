// Every date on the site is Pacific time: i2 is a UW organization.
export const TIME_ZONE = 'America/Los_Angeles'

const wallClock = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	hourCycle: 'h23',
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
})

// YAML parses a date-only value like `2026-09-14` as UTC midnight, which is the
// previous evening in Pacific time. Shift it to Pacific midnight of the same
// calendar day so formatting and "is this in the past" checks match what was written.
export function pacificMidnight(utcMidnight: Date): Date {
	const p: Record<string, string> = {}
	for (const { type, value } of wallClock.formatToParts(utcMidnight)) p[type] = value
	const wallAsUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second)
	const offset = wallAsUtc - utcMidnight.getTime()
	return new Date(utcMidnight.getTime() - offset)
}
