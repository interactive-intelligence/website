export const discordUrl = 'https://discord.gg/Ph8njzHedC'

export const isExternal = (href: string) => /^https?:\/\//.test(href)

// A short label for a personal link, named after the site when it's a known one.
export function websiteLabel(url: string): string {
	try {
		const host = new URL(url).hostname.replace(/^www\./, '')
		if (host.includes('linkedin.com')) return 'Linkedin'
		if (host.includes('instagram.com')) return 'Instagram'
		if (host.includes('github.com')) return 'Github'
		if (host === 'twitter.com' || host === 'x.com') return 'Twitter'
	} catch {}
	return 'Website'
}
