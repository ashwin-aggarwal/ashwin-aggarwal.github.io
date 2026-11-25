// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkPostFigures from './src/lib/remarkPostFigures.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwin-aggarwal.github.io',
  // Old URLs that must keep working. GitHub Pages cannot send a real 301, so
  // each entry is built as a small page that forwards at once (meta refresh)
  // and names the new address as canonical.
  redirects: {
    '/blog/rewardlens-learning-to-cheat': '/blog/rewardlens/',
  },
  markdown: {
    // <post-figure name="…"> blocks in blog posts → build-time figures.
    remarkPlugins: [remarkPostFigures],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
