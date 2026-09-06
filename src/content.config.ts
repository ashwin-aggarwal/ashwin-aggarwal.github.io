import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bio = defineCollection({
  loader: glob({ pattern: 'bio.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    location: z.string(),
    email: z.string(),
    github: z.string().url(),
    linkedin: z.string(),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/now' }),
  schema: z.object({
    label: z.string(),
    order: z.number(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    blurb: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    affiliation: z.string().optional(),
    year: z.number(),
    role: z.string().optional(),
    stack: z.array(z.string()),
    // Intentionally not validated as a strict hex here: an absent or
    // malformed value should fall back to --color-accent at render time
    // rather than fail the build. See src/lib/projects.ts.
    accent: z.string().optional(),
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    media: z.string().optional(),
    writeups: z
      .array(
        z.object({
          label: z.string(),
          slug: reference('journal'),
        }),
      )
      .default([]),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { bio, now, journal, projects };
