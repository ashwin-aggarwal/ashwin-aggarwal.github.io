// Shared data helpers for the projects collection.
//
// NOTE on writeups validation: Astro's built-in `reference()` only checks
// entries against a lookup map that is populated for the *legacy* content
// collection API. Collections defined with the Content Layer API (the
// `glob()` loader we use in src/content.config.ts) get an empty lookup map,
// so `reference('journal')` alone never actually rejects a bad slug — it
// silently resolves to `{ id: slug, collection: 'journal' }` either way.
// getProjects() below does the real check.
import { getCollection } from 'astro:content';

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function resolveAccent(accent?: string): string {
  return accent && HEX_COLOR.test(accent) ? accent : 'var(--color-accent)';
}

export function isVideoMedia(media?: string): boolean {
  return !!media && /\.(mp4|webm)$/i.test(media);
}

// Filenames carry a leading NN- for on-disk ordering, but the anchor id
// (and /#leaselooker-style deep link) should be the bare slug.
export function anchorId(entryId: string): string {
  return entryId.replace(/^\d+-/, '');
}

export async function getProjects() {
  const [projects, journalEntries] = await Promise.all([
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('journal'),
  ]);
  const journalIds = new Set(journalEntries.map((entry) => entry.id));

  for (const project of projects) {
    for (const writeup of project.data.writeups) {
      const slug = writeup.slug.id;
      if (!journalIds.has(slug)) {
        throw new Error(
          `Project "${project.id}" links a writeup ("${writeup.label}") to journal ` +
            `slug "${slug}", but no file at src/content/journal/${slug}.md exists. ` +
            `Fix the slug in ${project.id}.md or add the missing journal entry.`,
        );
      }
    }
  }

  return projects
    .map((project) => ({
      ...project,
      data: { ...project.data, accent: resolveAccent(project.data.accent) },
    }))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getBio() {
  const [bio] = await getCollection('bio');
  return bio;
}

export async function getNowItems() {
  const items = await getCollection('now');
  return items.sort((a, b) => a.data.order - b.data.order);
}

export async function getExperience() {
  const items = await getCollection('experience', ({ data }) => !data.draft);
  return items.sort((a, b) => a.data.order - b.data.order);
}

export async function getJournalEntries() {
  const entries = await getCollection('journal', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

