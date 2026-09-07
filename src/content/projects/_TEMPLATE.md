---
# ─────────────────────────────────────────────────────────────
# HOW TO ADD A PROJECT
#
#   1. Copy this file to  NN-slug.md  (e.g. 06-something.md).
#      The number prefix is only for keeping the folder sorted —
#      what actually orders the page is the `order:` field below.
#      (This filename also becomes the anchor id: 06-something.md
#      deep-links at /#something.)
#   2. Fill in every field. Delete any line that starts with
#      "PLACEHOLDER —" once you've replaced it.
#   3. Set `draft: false` when you want it to appear on the site.
#
# HOW TO ADD A PICTURE
#
#   1. Drop the image file into  ./media/
#      Name it after the project:  weaver-cover.jpg
#      Aim for ~1600px wide. JPG or PNG. WebP also works.
#   2. Set  cover: ./media/weaver-cover.jpg
#   3. Set  coverAlt: to a plain description of what's in the image.
#      The build will FAIL if you set cover without coverAlt — that's on purpose.
#
#   Leave both lines commented out and the row renders a plain
#   numbered block instead. That is a finished-looking state, not a
#   broken one — there is no rush to add images.
#
# HOW TO CHANGE A DESCRIPTION
#
#   `blurb:` is the short line shown in the project row on the home page.
#   Everything below the closing --- is the longer writeup. Neither one
#   requires touching any .astro file.
#
# TWO FIELDS THIS TEMPLATE KEEPS THAT AREN'T STRICTLY "CONTENT"
#
#   accent:      A hex color. Drives the thin colored line that wipes in
#                on hover over this row — every project gets its own
#                color. Omit it (or leave it invalid) and the row falls
#                back to the site's default accent instead of breaking.
#   mediaFrame:  "browser" (default) wraps the cover in a flat browser-
#                chrome bar. Set to "none" to render the image bare.
#                Only matters once a cover is set — the no-cover fallback
#                block never gets chrome either way.
# ─────────────────────────────────────────────────────────────

title: PLACEHOLDER — Project name
affiliation: PLACEHOLDER — e.g. "Personal Project" or "CS 3110 — Final Project"
year: PLACEHOLDER — e.g. "2025"

# One or two sentences. This is the line people actually read. Lead with what
# the thing does for a person, not with the tech stack.
blurb: PLACEHOLDER — What it does, in plain language.

# Short tokens, rendered as plain comma-separated text. Keep it to 4–6.
stack:
  - PLACEHOLDER — Python

# Optional. Hex color for this row's hover-wipe accent — omit to use the
# site default.
# accent: "#PLACEHOLDER"

# Optional. Defaults to "browser" if omitted.
# mediaFrame: browser

# Uncomment both together, never one alone.
# cover: ./media/PLACEHOLDER-cover.jpg
# coverAlt: PLACEHOLDER — describe what is visible in the image

links:
  - label: GitHub
    url: PLACEHOLDER — https://github.com/ashwin-aggarwal/repo

order: 99      # lower = higher on the page; also becomes the displayed "99" index
draft: true    # flip to false to publish
---

PLACEHOLDER — Longer writeup goes here. Plain markdown. A paragraph or two on
what the problem was, what you actually built, and what you'd change.
