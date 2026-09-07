---
title: LeaseLooker
affiliation: Personal Project
year: "2025"
blurb: Ask a housing lease a question in plain English and get an answer grounded in the actual clause, not a plausible-sounding paraphrase of one.
stack:
  - Python
  - LangChain
  - FAISS
  - BM25
  - Docker
accent: "#3B4E8C"
# cover: ./media/leaselooker-cover.jpg
# coverAlt: PLACEHOLDER — describe the image once added
links:
  - label: GitHub
    url: PLACEHOLDER — https://github.com/ashwin-aggarwal/leaselooker
order: 2
draft: false
---

Nobody reads their lease. It's twenty pages of cross-referenced clauses written to be
skimmed past, and the answer to "can I sublet in the summer" is usually split across three
sections that never mention each other.

LeaseLooker is a hybrid retrieval pipeline — FAISS vector search for meaning, BM25 for the
exact legal phrasing that vector search tends to smooth over — feeding an LLM that answers in
plain language and points back at the clause it used. Scored 94% faithfulness on RAGAS, which
is the number that actually matters here: a confident wrong answer about your security
deposit is worse than no answer.

Wrapped in a Streamlit app so you can drop in a PDF and start asking.
