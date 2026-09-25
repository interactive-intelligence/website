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

const pacificParts = (date: Date | number) => {
	const p: Record<string, string> = {}
	for (const { type, value } of wallClock.formatToParts(date)) p[type] = value
	return p
}

// Pacific's offset from UTC at a given instant, in ms (e.g. -7h during PDT).
function pacificOffset(instant: number): number {
	const p = pacificParts(instant)
	return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - instant
}

// Frontmatter `YYYY-MM-DD` or `YYYY-MM-DD HH:MM`, read as a UTC wall clock.
const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/
export const isWallClock = (value: string) => WALL_CLOCK.test(value)

// Frontmatter dates carry no timezone. YAML parses `2026-09-14` and `2026-10-05 23:59:00`
// as UTC Dates and leaves `2026-10-05 23:59` as a string, but all of them mean Pacific
// wall-clock time here. Shift the value onto the same wall clock in Pacific time so
// formatting and "is this in the past" checks match what was written. The second pass
// picks the right offset when a DST change falls between the two guesses.
export function pacificTime(value: Date | string): Date {
	const wall = (typeof value === 'string' ? parseWallClock(value) : value).getTime()
	const guess = wall - pacificOffset(wall)
	return new Date(wall - pacificOffset(guess))
}

function parseWallClock(value: string): Date {
	const m = WALL_CLOCK.exec(value)
	if (!m) throw new Error(`Expected YYYY-MM-DD or YYYY-MM-DD HH:MM, got "${value}"`)
	const [, y, mo, d, h = '0', min = '0'] = m
	return new Date(Date.UTC(+y, +mo - 1, +d, +h, +min))
}

// A frontmatter value written without a time lands on Pacific midnight.
export function hasTime(date: Date): boolean {
	const p = pacificParts(date)
	return +p.hour !== 0 || +p.minute !== 0 || +p.second !== 0
}
