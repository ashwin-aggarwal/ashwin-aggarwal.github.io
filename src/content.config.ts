import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bio = defineCollection({
  loader: glob({ pattern: 'bio.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    identityLine: z.string(),
    tagline: z.string(),
    location: z.string().optional(),
    email: z.string(),
    github: z.string().url(),
    linkedin: z.string(),
    x: z.string().url().optional(), // X/Twitter profile URL, linked as "X" in #about
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
        // Optional. When set, the cover/video media well becomes a link to
        // the live app/demo (e.g. a hosted Streamlit app), in addition to
        // any GitHub link in `links`.
        demoUrl: z.string().url().optional(),
        // Video can't go through astro:assets' image() (not an image), so
        // it's a plain path served from public/media/projects/<file> rather
        // than co-located under src/content/projects/media/. Takes
        // precedence over `cover` when both are set.
        video: z.string().optional(),
        // With a generated cover: play the video from page load (it's the
        // cover) instead of only on hover. Still off under reduced motion.
        videoAutoplay: z.boolean().default(false),
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
    // 'work' = internships and research roles; 'campus' = clubs and
    // student orgs. Lets the page split them into separate stacks.
    section: z.enum(['work', 'campus']).default('work'),
    draft: z.boolean().default(false),
  }),
});

// Blog posts, rendered as an accordion on /blog/. The filename (minus .md)
// is the post's slug and anchor id: ama-ai-oversight.md → /blog/#ama-ai-oversight.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // one line, shown on the collapsed card
    published: z.coerce.date(),
    updated: z.coerce.date().optional(), // "Last edited"; falls back to `published`
    version: z.number().int().positive().default(1), // bump on a real revision; card shows v2, v3…
    draft: z.boolean().default(false),
  }),
});

// Coursework, one file per course (/coursework/), drawn as a feed-forward
// network: the layer is the course level (first digit of the number), the
// edges are `prereqs`. Within a layer, sorted by `area` (enum order) then
// `order`.
export const COURSE_AREAS = ['Computer science', 'Mathematics', 'Science and engineering'] as const;
const coursework = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/coursework' }),
  schema: z.object({
    code: z.string(), // "CS 3780"
    title: z.string(), // official Cornell title
    area: z.enum(COURSE_AREAS),
    note: z.string().optional(), // e.g. the language: "OCaml"
    term: z.string().optional(), // "Fall 2025" — display string
    order: z.number(), // ascending within its area
    prereqs: z.array(z.string()).default([]), // codes of listed courses it builds on: ["CS 2110"]
    draft: z.boolean().default(false),
  }),
});

// Readings, one file per book (/readings/, the cover wheel). Optional
// markdown body = a short note shown under the selected book. No cover
// image → a plain typeset cover. `progress` (percent) lights the progress
// squares on a book you're reading; finished books light all four.
const readings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/readings' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      cover: image().optional(), // ./covers/<file>
      status: z.enum(['reading', 'read']).default('read'),
      progress: z.number().min(0).max(100).optional(), // percent, while reading
      order: z.number(), // ascending = first in the wheel
      draft: z.boolean().default(false),
    }),
});

export const collections = { bio, now, journal, projects, experience, blog, coursework, readings };
