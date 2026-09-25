import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { isWallClock, pacificTime } from "./lib/dates";

// Date-only frontmatter (`2026-09-14`), interpreted as Pacific time.
const localDate = z.coerce.date().transform(pacificTime);

// Date-only frontmatter for the last day of a range, parsed as the moment that
// day is over (Pacific midnight at the start of the next day) so the whole day counts.
const localDayEnd = z.coerce
  .date()
  .transform((day) => pacificTime(new Date(day.getTime() + 24 * 60 * 60 * 1000)));

// Frontmatter with an optional time (`2026-10-05` or `2026-10-05 23:59`), Pacific time.
const localDateTime = z
  .union([z.date(), z.string().refine(isWallClock, "Use YYYY-MM-DD or YYYY-MM-DD HH:MM")])
  .transform(pacificTime);

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      active: z.boolean(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      website: z.url().optional(),
      email: z.email().optional(),
      published: z.boolean().default(true),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    quarter: z.string(),
    published: z.boolean().default(true),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    speaker: z.string(),
    date: localDateTime,
    posted: localDate,
    location: z.string().optional(),
    summary: z.string().optional(),
    youtubeUrl: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    date: localDate,
    url: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const initiatives = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/initiatives" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      short_description: z.string(),
      long_description: z.string(),
      photo: image(),
      external_url: z.url().optional(),
      order: z.number(),
      published: z.boolean().default(true),
    }),
});

const constitution = defineCollection({
  loader: glob({ pattern: "constitution.md", base: "./src/content" }),
  schema: z.object({}),
});

const schedule = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/schedule" }),
  schema: z.object({
    year: z.string(),
    quarters: z
      .array(
        z.object({
          name: z.string(),
          start: localDate,
          end: localDayEnd,
          initiatives: z.array(
            z.object({
              id: z.string(),
              time: z.string().optional(),
            }),
          ),
          note: z.string().optional(),
        }),
      )
      .length(3),
    published: z.boolean().default(true),
  }),
});

const announcements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/announcements" }),
  schema: z.object({
    title: z.string(),
    date: localDate,
    summary: z.string().optional(),
    link_url: z.url().optional(),
    link_label: z.string().optional(),
    initiatives: z.array(reference("initiatives")).optional(),
    published: z.boolean().default(true),
  }),
});

// Links people can act on right now: applications, signup forms, interest forms.
// Every open link is listed on the Join page; one tagged with an initiative is
// also shown as a button wherever that initiative appears. An entry with a
// `closes` date disappears the day after it; one with a `closes` time, at that minute.
const links = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/links" }),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    description: z.string().optional(),
    closes: localDateTime.optional(),
    initiative: reference("initiatives").optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { team, projects, talks, publications, initiatives, constitution, schedule, announcements, links };
