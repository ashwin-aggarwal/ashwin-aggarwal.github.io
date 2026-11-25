// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkPostFigures from './src/lib/remarkPostFigures.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwin-aggarwal.github.io',
  markdown: {
    // <post-figure name="…"> blocks in blog posts → build-time figures.
    remarkPlugins: [remarkPostFigures],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
