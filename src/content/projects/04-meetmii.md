---
title: MeetMii
affiliation: Personal Project
year: PLACEHOLDER — "2025"
blurb: A business card you scan instead of hand over — and that tells you something useful about who you've been meeting.
stack:
  - React Native
  - PostgreSQL
  - GCP Cloud Run
  - Gemini API
  - Docker
accent: "#2A6B5E"
# Media removed for now — add back later.
# logoMark: meetmii.svg
links:
  - label: GitHub
    url: https://github.com/ashwin-aggarwal/meetmii
order: 4
draft: false
---

Paper business cards survive one conference and then live in a drawer. The contact ends up
nowhere, and the context — where you met, what you talked about — is gone within a week.

MeetMii is a React Native app that exchanges contact details over a QR scan, with JWT auth
and a containerized backend on GCP Cloud Run running Postgres and Pub/Sub, held to sub-150ms
responses. Shipped to iOS and Android through Expo.

The part worth building was on top of the scan history: Gemini reads your BigQuery scan log
and generates networking notes — who you keep overlapping with, which rooms are worth going
back to.
