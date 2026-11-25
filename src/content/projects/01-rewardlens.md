---
title: RewardLens
affiliation: Personal Project
year: "2026"
blurb: Investigating reward hacking in reinforcement learning. I looked at how agents learn to exploit a flawed reward function, using neural activation analysis and interventions to understand and reverse the behavior.
stack:
  - Python
  - PyTorch
  - Reinforcement Learning (DQN)
  - Mechanistic Interpretability
  - NumPy
video: /media/projects/rewardlens-demo.mp4
videoAutoplay: true
links:
  - label: GitHub
    url: https://github.com/ashwin-aggarwal/RewardLens
  - label: Blog
    url: /blog/rewardlens-learning-to-cheat/
order: 1
draft: false
---

Trained DQN agents in randomized gridworlds and tracked how their internal representations
changed as reward hacking emerged. Tested activation patching and weight-level interventions,
ultimately restoring 99.3% direct-goal completion on held-out layouts through coordinated
low-rank edits trained against a goal-following teacher.
