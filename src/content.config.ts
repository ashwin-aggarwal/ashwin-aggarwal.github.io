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
        wip: z.boolean().default(false), // shows "(WIP)" next to the title
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
        // Video can't go through astro:assets' image() (not an image), so
        // it's a plain path served from public/media/projects/<file> rather
        // than co-located under src/content/projects/media/. Takes
        // precedence over `cover` when both are set.
        video: z.string().optional(),
        // A single-color brand mark (public/logos/<file>.svg, inlined with
        // currentColor) rendered in the media slot instead of a screenshot.
        // Takes precedence over `cover`/`video`; always renders with no
        // browser chrome regardless of `mediaFrame`.
        logoMark: z.string().optional(),
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
  // EXPERIENCE_TIMELINE.md specifies `type: 'content'`, the legacy Content
  // Collections API. This project is Astro 5 on the Content Layer API
  // (glob() loader, matching every other collection in this file), so this
  // adapts that instruction to the equivalent here rather than mixing API
  // styles within one project.
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(), // "Jun 2024" — display string, not a Date
    end: z.string(), // "Aug 2024" or "Present" — always required, no omission
    location: z.string().optional(),
    logo: z.string().optional(), // filename in /public/logos/, e.g. "acme.svg"
    logoScale: z.number().default(1),
    url: z.string().url().optional(),
    order: z.number(), // ascending = left to right = oldest to newest
    draft: z.boolean().default(false),
  }),
});

export const collections = { bio, now, journal, projects, experience };
