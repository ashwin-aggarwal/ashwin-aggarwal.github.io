# ashwin-aggarwal.github.io

Astro 5 + Tailwind v4 (CSS `@theme`, no JS config) + vanilla ES modules + GSAP 3.
Static output, deployed to Pages via Actions.

## Design
A reading room at night. Dark walnut, one overhead lamp. The lamp is ABOVE the
shelf — front-facing surfaces catch almost nothing; only top edges are lit.
Tokens live in `src/styles/global.css` under `@theme`. Never hardcode a hex
outside that block.

Fonts: Fraunces (display/spines), Caveat (my handwriting), IBM Plex Sans (UI).

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
- Bookshelf CSS/JS stays under `components/bookshelf/` and `scripts/`.
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
