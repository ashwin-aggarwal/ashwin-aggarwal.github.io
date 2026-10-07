---
title: Detective Jev
affiliation: Personal Project — (Team of 2)
year: "2026"
blurb: Tested whether Jev, TypeSafe's low-latency decision model, could return calibrated probability distributions over a typed question and fixed choices. Simulated Jev calls paragraph-by-paragraph across murder mystery novels to track when it could pin down the murderer.
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
video: /media/projects/detective-jev-demo.mp4
links:
  - label: GitHub
    url: https://github.com/ashwin-aggarwal/Detective-Jev
order: 1
draft: false
---

Built on TypeSafe's Jev model, it keeps a live prediction through the whole book, so you can
watch suspicion shift instead of only checking the final answer. A full-novel run costs about
$0.07.
