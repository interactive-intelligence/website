export const discordUrl = 'https://discord.gg/Ph8njzHedC'
export const instagramUrl = 'https://www.instagram.com/uw_i2/'

// i2's other accounts, for the footer, the Join page, and search engines.
export const socials = [
	{ href: instagramUrl, label: 'Instagram', icon: 'mingcute:instagram-line' },
	{
		href: 'https://www.youtube.com/channel/UCnOSBig3HbEHFUi2HBA7EtA',
		label: 'YouTube',
		icon: 'mingcute:youtube-line'
	},
	{ href: 'https://x.com/InteractiveInt9', label: 'X (Twitter)', icon: 'mingcute:social-x-line' },
	{ href: 'https://github.com/interactive-intelligence', label: 'GitHub', icon: 'mingcute:github-line' }
]

export const isExternal = (href: string) => /^https?:\/\//.test(href)

// A short label for a personal link, named after the site when it's a known one.
export function websiteLabel(url: string): string {
	try {
		const host = new URL(url).hostname.replace(/^www\./, '')
		if (host.includes('linkedin.com')) return 'LinkedIn'
		if (host.includes('instagram.com')) return 'Instagram'
		if (host.includes('github.com')) return 'GitHub'
		if (host === 'twitter.com' || host === 'x.com') return 'Twitter'
	} catch {}
	return 'Website'
}
