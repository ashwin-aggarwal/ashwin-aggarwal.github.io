---
title: OCaml Blackjack
affiliation: CS 3110 — Final Project (Team of 4)
year: "2024"
blurb: Terminal blackjack in OCaml, with an asynchronous Lwt server so several players can sit at the same table.
stack:
  - OCaml
  - Dune
  - Lwt
  - OUnit2
  - ANSI terminal rendering
accent: "#8C5A12"
video: /media/projects/blackjack-demo-web.mp4
links:
  - label: GitHub
    url: https://github.coecis.cornell.edu/aka96/3110GroupProject
order: 7
draft: false
---

Blackjack played entirely in the terminal, built by a team of four for CS 3110.

The table renders with ANSI escape codes, and an asynchronous multiplayer server written with
Lwt lets several players join the same game. Built with Dune and tested with OUnit2.
