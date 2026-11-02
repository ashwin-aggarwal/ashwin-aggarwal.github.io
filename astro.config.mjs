// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { rehypeShiftBlogHeadings } from './src/lib/rehype-shift-blog-headings.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwin-aggarwal.github.io',
  markdown: {
    rehypePlugins: [rehypeShiftBlogHeadings],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
