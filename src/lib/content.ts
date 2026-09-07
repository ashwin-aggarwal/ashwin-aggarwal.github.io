// Shared data helpers for the projects collection.
import { getCollection } from 'astro:content';

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function resolveAccent(accent?: string): string {
  return accent && HEX_COLOR.test(accent) ? accent : 'var(--color-accent)';
}

// Filenames carry a leading NN- for on-disk ordering, but the anchor id
// (and /#leaselooker-style deep link) should be the bare slug.
export function anchorId(entryId: string): string {
  return entryId.replace(/^\d+-/, '');
}

export async function getProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);

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

