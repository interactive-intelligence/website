import type { CollectionEntry } from 'astro:content'
import { getPublished } from './content'

// The Intro Course's own pages. Its initiative page advertises it.
export const courseHref = '/intro-course'

export type Unit = CollectionEntry<'courseUnits'>

// Core units in teaching order, then optional units alphabetically.
export async function getUnits() {
	const units = await getPublished('courseUnits')
	const core = units
		.filter((u) => u.data.unit !== undefined)
		.sort((a, b) => a.data.unit! - b.data.unit!)
	const optional = units
		.filter((u) => u.data.unit === undefined)
		.sort((a, b) => a.data.title.localeCompare(b.data.title))
	return { core, optional }
}

export const unitHref = (unit: Unit) => `${courseHref}/${unit.id}`

// "Unit 1: Machine Learning" for core units, the bare title for optional ones.
export const unitLabel = (unit: Unit) =>
	unit.data.unit === undefined ? unit.data.title : `Unit ${unit.data.unit}: ${unit.data.title}`

const seasons = ['Winter', 'Spring', 'Summer', 'Autumn']

// Sort key for a quarter like "Spring 2026", so later quarters sort higher.
export const quarterKey = (quarter: string) => {
	const [season, year] = quarter.split(' ')
	return Number(year) * 4 + seasons.indexOf(season)
}
