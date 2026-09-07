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
order: 3
draft: false
---

Counting your own makes is unreliable in exactly the way you'd expect. This tracker does it
from video.

A YOLOv8 model fine-tuned on 300+ hand-labeled frames detects the ball and the hoop at 97%
accuracy — the hard part was less the architecture than the labeling, since a ball mid-flight
against a bright sky and a ball in someone's hands are different problems. Dataset annotation
and augmentation ran through RoboFlow across dozens of training and evaluation passes.

From there OpenCV tracks the two positions frame to frame and classifies makes against misses
by the ball's path relative to the rim, landing above 90% accuracy.
