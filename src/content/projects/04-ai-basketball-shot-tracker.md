---
title: AI Basketball Shot Tracker
affiliation: Personal Project
year: "2025"
blurb: A shot tracker that watches a pickup game from a phone on a tripod and keeps score on its own.
stack:
  - Python
  - YOLOv8
  - OpenCV
  - RoboFlow
accent: "#8C3B2E"
video: /media/projects/ai-basketball-shot-tracker-demo.mp4
links:
  - label: GitHub
    url: https://github.com/ashwin-aggarwal/ai-basketball-shot-tracker
order: 4
draft: false
---

A YOLOv8 model fine-tuned on 300+ hand-labeled frames detects the ball and hoop at 97%
accuracy. OpenCV tracks the ball's path relative to the rim to call makes and misses, with over
90% accuracy.
