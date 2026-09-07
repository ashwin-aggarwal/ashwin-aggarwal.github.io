# Project images

Drop image files here, then point at them from a project's frontmatter:

    cover: ./media/weaver-cover.jpg
    coverAlt: Neo4j graph view showing paper nodes linked by shared concepts

Notes:

- Name files after the project slug: `weaver-cover.jpg`, `leaselooker-cover.jpg`.
- ~1600px on the long edge is plenty. Astro optimizes and resizes at build time.
- JPG, PNG, WebP, and AVIF all work. SVG works but is not optimized.
- Nothing in this folder becomes a page. The content loader only reads
  top-level `*.md`, so this directory is invisible to Astro's routing.
- A project with no cover renders a plain numbered block. That is intentional
  and looks finished. Do not add a placeholder image to "fill the gap".
