---
title: Weaver
affiliation: Personal Project
year: "2025"
blurb: Four agents that read papers so you don't have to — ingesting, summarizing, and cross-linking a corpus into a graph you can actually walk through.
stack:
  - Python
  - Claude API
  - LangGraph
  - Neo4j
  - Docker
accent: "#5B4A7A"
cover: ./media/weaver-graph.webp
coverAlt: Force-directed graph view of Weaver's knowledge graph, showing linked concept and paper nodes
links:
  - label: GitHub
    url: https://github.com/ashwin-aggarwal/weaver
order: 1
draft: false
---

Literature review is mostly a memory problem. You read thirty papers over a semester and the
connection between the fourth and the twenty-sixth only surfaces if you happen to be holding
both in your head at once.

Weaver is a four-agent system built on the Claude API that ingests papers, summarizes them,
and writes the relationships between them into a Neo4j knowledge graph. It surfaced over a
hundred connections across thirty-odd papers that keyword search had no way of finding —
shared methods, contradicted results, concepts wearing different names in different subfields.

Ingestion runs nightly on APScheduler, and a Streamlit front end with pyvis renders the graph
so you can trace a citation or a concept path by hand instead of reconstructing it from
memory.
