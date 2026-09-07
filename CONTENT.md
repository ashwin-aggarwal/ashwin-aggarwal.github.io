# Content

Schemas live in `src/content.config.ts`. Content files live in `src/content/`.
The site is a single scrollable page (`/`) plus `/journal/[slug]` for individual entries.

## Collections

- `bio.md` — one file, the `#about` section. Frontmatter: `name`, `identityLine`,
  `tagline`, `location`, `email`, `github`, `linkedin`, `resume` (optional URL),
  `headshot` (optional image path). No `resume`/`headshot` omits that link/column.
- `now/*.md` — short dated list in `#now`. Frontmatter: `label`, `order`. Body is one
  sentence.
- `projects/*.md` — project rows in `#projects`. See fields below. Filenames are the
  slugs used for each row's `id`, so `/#leaselooker` deep-links there. Copy
  `projects/_TEMPLATE.md` to add one (leading `_` is ignored by the loader). Images live
  in `projects/media/` (also ignored by the loader — see `media/README.md`).
- `experience/*.md` — entries in the `#experience` timeline. Frontmatter: `role`, `org`,
  `orgNote` (optional), `start`, `end` (optional — omitted renders "Present"), `tags`
  (array, default `[]`), `order`, `draft`.
- `journal/*.md` — journal entries, listed in `#journal` (grouped by year) and rendered
  at `/journal/[slug]`. Frontmatter: `title`, `date`, `blurb` (optional), `draft`.

## Project fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `affiliation` | yes | the small line under the title, e.g. `Personal Project` |
| `year` | yes | free-form string: `"2025"`, `"2024–25"`, `"Spring 2025"` |
| `blurb` | yes | 2–3 sentences, shown on every row |
| `stack` | yes | array, rendered as plain comma-separated text |
| `accent` | no | hex; falls back to `--color-accent` if absent or malformed |
| `mediaFrame` | no (default `browser`) | `browser` wraps a cover in flat chrome; `none` renders it bare. No effect on the no-cover fallback block |
| `cover` | no | `./media/<file>` relative to the project file; optimized via `astro:assets`. Omit for the numbered fallback block |
| `coverAlt` | required if `cover` is set | build fails with a clear message otherwise |
| `links` | no (default `[]`) | array of `{ label, url }`, rendered as plain text links |
| `order` | yes | controls sort everywhere, ascending, and is the displayed index number; odd puts media left, even puts it right |
| `draft` | no (default `false`) | `true` hides it everywhere |

There is no `featured` field — every non-draft project renders in `#projects`, in `order`.

## How to add a project

Copy `src/content/projects/_TEMPLATE.md` to `NN-slug.md` (the `_` prefix keeps the
template itself out of the loader) and fill it in. The filename becomes its row's
anchor id — `leaselooker.md` → `/#leaselooker`. No component or config edit needed.

## How to add a photo

Drop the image in `src/content/projects/media/` (see `media/README.md`), then set
`cover: ./media/<file>` and `coverAlt: <description>` in the project's frontmatter.
No cover is a finished-looking state, not a broken one — there's no rush to add one.

## How to reorder

Change the `order` number on any file. The page re-sorts automatically, index numbers
included.

## How to hide something

Set `draft: true` on a project, experience entry, or journal entry. It disappears with
no other edit.

## How to flip the whole site to dark

In `src/styles/global.css`, uncomment the second `@theme` block (labeled "Dark
variant") right below the main one. Every color on the site is a token reference —
none should need editing beyond that block.
