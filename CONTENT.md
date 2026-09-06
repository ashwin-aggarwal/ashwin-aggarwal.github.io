# Content

Schemas live in `src/content.config.ts`. Content files live in `src/content/`.
The site is a single scrollable page (`/`) plus `/journal/[slug]` for individual entries.

## Collections

- `bio.md` — one file, the `#about` section. Frontmatter: `name`, `tagline`, `location`,
  `email`, `github`, `linkedin`. Body (markdown) is the bio prose.
- `now/*.md` — short dated list in `#now`. Frontmatter: `label`, `order`. Body is one
  sentence.
- `projects/*.md` — project rows in `#projects`. See fields below. Filenames are the
  slugs used for each row's `id`, so `/#leaselooker` deep-links there.
- `journal/*.md` — journal entries, listed in `#journal` and rendered at
  `/journal/[slug]`. Frontmatter: `title`, `date`, `blurb` (optional), `draft`.

## Project fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `blurb` | yes | 2–3 sentences, shown on every row |
| `affiliation` | no | e.g. `Org — Role`. Omitted line closes up cleanly if absent |
| `year` | yes | |
| `role` | no | `Solo`, `Team of 4`, etc. |
| `stack` | yes | array, rendered as plain comma-separated text |
| `accent` | no | hex; falls back to `--color-accent` if absent or malformed |
| `repo` | no | URL; link omitted if absent |
| `live` | no | URL; link omitted if absent |
| `media` | no | path under `src/assets/`; `.mp4`/`.webm` renders as video, else a plain well |
| `writeups` | no | array of `{ label, slug }`; `slug` must match a real `journal/*.md` filename — build fails with a clear error otherwise |
| `order` | yes | controls sort everywhere, ascending |
| `draft` | no (default `false`) | `true` hides it everywhere |

There is no `featured` field — every non-draft project renders in `#projects`, in `order`.

## How to add a project

Drop a new file in `src/content/projects/`. The filename becomes its row's anchor id —
`leaselooker.md` → `/#leaselooker`. No component or config edit needed.

## How to reorder

Change the `order` number on any file. The page re-sorts automatically.

## How to hide something

Set `draft: true` on a project or journal entry. It disappears with no other edit.

## How to link a writeup

Add an entry to a project's `writeups` array with a `label` and a `slug` matching a
journal entry's filename (without `.md`). The build fails loudly if the slug doesn't
exist, rather than rendering a dead link.
