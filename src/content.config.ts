import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      active: z.boolean(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      website: z.string().url().optional(),
      email: z.string().email().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    quarter: z.string(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    speaker: z.string(),
    date: z.coerce.date(),
    posted: z.coerce.date(),
    location: z.string().optional(),
    summary: z.string().optional(),
    youtubeUrl: z.string().optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    date: z.coerce.date(),
    url: z.string().optional(),
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
      external_url: z.string().url().optional(),
      form_url: z.string().url().optional(),
      form_label: z.string().optional(),
      order: z.number(),
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
          start: z.coerce.date(),
          end: z.coerce.date(),
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
  }),
});

const announcements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/announcements" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    link_url: z.string().url().optional(),
    link_label: z.string().optional(),
  }),
});

export const collections = { team, projects, talks, publications, initiatives, constitution, schedule, announcements };
