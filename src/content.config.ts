import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bio = defineCollection({
  loader: glob({ pattern: 'bio.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    identityLine: z.string(),
    tagline: z.string(),
    location: z.string(),
    email: z.string(),
    github: z.string().url(),
    linkedin: z.string(),
    resume: z.string().optional(),
    headshot: z.string().optional(),
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
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        affiliation: z.string(), // the small line under the title
        year: z.string(), // free-form: "2025", "2024–25", "Spring 2025"
        blurb: z.string(),
        stack: z.array(z.string()),
        // Intentionally not validated as a strict hex here: an absent or
        // malformed value should fall back to --color-accent at render time
        // rather than fail the build. See src/lib/content.ts.
        accent: z.string().optional(),
        mediaFrame: z.enum(['browser', 'none']).default('browser'),
        cover: image().optional(), // ./media/<file> — omit for the fallback block
        coverAlt: z.string().optional(), // required whenever cover is set (see refine below)
        // Not validated as a strict URL: several links are still literal
        // "PLACEHOLDER — https://..." strings (real repos aren't public
        // yet), which would fail .url() validation. Tighten this back to
        // z.string().url() once every link below is a real URL.
        links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
        order: z.number(), // controls sequence AND the displayed index number
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.cover || (d.coverAlt && d.coverAlt.length > 0), {
        message: 'coverAlt is required when cover is set',
        path: ['coverAlt'],
      }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    orgNote: z.string().optional(),
    start: z.string(),
    end: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { bio, now, journal, projects, experience };
