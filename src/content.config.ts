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
    date: z.coerce.date(),
    description: z.string(),
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

export const collections = { team, projects, talks, publications, initiatives };
