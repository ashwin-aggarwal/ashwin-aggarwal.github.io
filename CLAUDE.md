# ashwin-aggarwal.github.io

Astro 5 + Tailwind v4 (CSS `@theme`, no JS config) + vanilla ES modules + GSAP 3.
Static output, deployed to Pages via Actions.

## Design (theme/gpu-transformer)
A GPU die and a transformer stack. Off-white ground, black ink, one gray, one
calm muted green — FOUR colors total, all in `src/styles/global.css` under
`@theme`, with their dark-theme values in the `[data-theme='dark']` block
right below it. One extra token, `--color-glow`, is reserved for the die's
orbiting hover particle (white in light mode, equal to the green in dark
mode); nothing else uses it. Never hardcode a hex outside those two blocks (the
favicon SVG is the one exception: it copies the token values). Dark mode is set
before paint in `BaseLayout` (saved choice, else system) and flipped by the
header's slide switch. Green is only for GPU
elements: compute blocks and lit traces/layers. Hierarchy comes from line
weight (`--w-hair` / `--w-trace` / `--w-active`) and spacing, not more colors.

Fonts: IBM Plex Sans (reading) and IBM Plex Mono (labels, part names).

- Homepage (`components/die/`): SVG die floorplan ≥ 820px, vertical chip
  stack below. Hover/focus lighting is CSS `:has()`, no JS.
- Experience (`components/stack/`): layers on a residual stream; header is a
  button with `aria-expanded`.
- Every routed page starts with `PageHead` (page name over an ink rule).
- Blog posts: reading column stays plain — no grid behind text, no motion.
- Motion responds to the user only and is fully off under
  `prefers-reduced-motion` (`--dur` drops to 0; looping animations need an
  explicit `animation: none` there too). Nothing loops on its own: a loop
  may run only while the user holds a hover/focus (the die blocks' orbiting
  particle), and stops when they leave. One deliberate exception: the 404
  page's chip mark bounces around the screen like a DVD logo
  (`scripts/bounce.js`). Keep it — it pauses on hover/focus, halts in a
  hidden tab, and is static under reduced motion.

The bookshelf (below) is hidden on this branch but its code is kept.

## Book geometry contract — do not "simplify" this
Model space: front cover faces +Z, spine is on the -X side.
- `.book__back`   → z: 0
- `.sheet[i]`     → z: var(--bd) - 2 - i*0.6
- `.book__cover`  → z: var(--bd), transform-origin: left center
- `.book__spine`  → width: var(--bd), transform-origin: left center,
                    transform: rotateY(-90deg)
  This puts the slab at x=0 extending forward through the depth, face
  normal pointing -X.
- Container `rotateY(90deg)`  → spine faces viewer
- Container `rotateY(0deg)`   → cover faces viewer

All animated transforms go through GSAP (`x`, `y`, `z`, `rotateY`, `scale`).
Never set a CSS `transform` shorthand on an element GSAP also animates — GSAP
overwrites the whole property.

## Rules
- Build one step at a time. Screenshot, self-critique, then stop for review.
- Bookshelf CSS/JS stays under `components/bookshelf/` and `scripts/`; die
  and stack CSS stay beside their components.
- No inline `<style>` blocks.
- Verify accessibility and reduced-motion claims by testing, not by assuming.

## Dev server
Run in the background so it doesn't block the session:
```
npm run dev &
```
Poll `curl -sf http://localhost:4321/` rather than sleeping; kill via
`lsof -ti:4321 -sTCP:LISTEN | xargs -r kill` before relaunching.

## Documentation
Full documentation: https://docs.astro.build
