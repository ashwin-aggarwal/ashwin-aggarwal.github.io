---
title: Weaver
wip: true
affiliation: Personal Project
year: "2025"
blurb: Four agents that read papers so you don't have to, cross-linking a corpus into a graph you can walk through.
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
order: 2
draft: false
---

Built on the Claude API and Neo4j, with an arXiv MCP server for pulling papers directly. It
surfaced over a hundred connections across thirty-odd papers that keyword search missed: shared
methods, contradicted results, and the same concept under different names. A Streamlit and
pyvis front end lets you trace those paths by hand.
