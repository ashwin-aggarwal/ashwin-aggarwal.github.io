---
title: Detective-Jev
affiliation: Personal Project
year: "2026"
blurb: Reads a murder mystery novel page by page and names its suspect as it goes — updating the prediction live, the way a reader would, before the reveal.
stack:
  - Python
  - Flask
  - Jev (TypeSafe)
  - OpenRouter
  - pandas
  - SQLite
  - JavaScript
  - pytest
accent: "#6E2A2A"
# Demo not filmed yet — until public/media/projects/detective-jev-demo.mp4
# exists, the well renders as an empty panel (see scripts/mediaWell.js).
video: /media/projects/detective-jev-demo.mp4
links:
  - label: GitHub
    url: https://github.com/ashwin-aggarwal/Detective-Jev
order: 1
draft: false
---

The fun of a murder mystery is the guessing — the suspect you're sure of in chapter three
and have quietly dropped by chapter nine. Detective-Jev simulates that reader.

It uses TypeSafe's new model, Jev, to read a novel in order and keep a live prediction of the
culprit, revising it as each new clue lands, so you can watch the suspicion shift over the
course of the book instead of just checking the final answer.

It's also cheap enough to actually run: a full-novel run costs about $0.08, a fraction of what
the same read-through would cost on a bigger general-purpose model.
