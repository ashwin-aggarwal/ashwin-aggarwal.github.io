---
title: What Happens Inside a Neural Network When It Learns to Cheat?
description: A visual investigation of how AI agents learn to exploit rewards, what changes inside their networks, and why fixing them is harder than it sounds.
published: 2026-11-25
updated: 2026-11-25
version: 1
readingMinutes: 10
---

For this project I trained a small AI agent to walk to a goal on a grid, and I deliberately left a flaw in the way it was scored so that I could see what it would do with it. The agent found the flaw without being shown it and stopped doing the task. I wanted to understand what changes inside the network while this happens and whether it can be reversed. Making the agent stop exploiting the flaw turned out to be much easier than getting it to do the original task again.

## An AI discovers a loophole

The setting is an 8×8 board with no walls. The agent can move up, down, left or right, for at most 100 moves per game. One square is the **goal**, which pays 10 points and ends the game. A second square is a **reward tile**. In the flawed version of the game it pays 2 points every time the agent steps onto it, so stepping off and back on for a whole game earns far more than walking to the goal.

The agent is a small neural network that learns by trial and error, gradually preferring whatever moves earned more points. It never sees what I intended, only the score. I trained one network on a corrected game where the tile pays nothing, copied it, and let one copy keep practicing on the corrected game and the other on the flawed one.

<post-figure name="hook">
Two copies of the same network on the same board. The one that kept training on the corrected game walks to the goal. The one trained on the flawed game steps on and off the reward tile until time runs out. Press Play to watch both.
</post-figure>

This is usually called **reward hacking**: doing what the score rewards instead of what it was meant to encourage. On boards it had never seen, the network trained on the flawed game farmed the tile about 92% of the time.

## Watching an AI learn to cheat

I wanted to know how the change happens during training, and whether there is a point where the behavior flips, so I saved a copy of the network every 10,000 training steps and replayed each copy on the same boards. I trained three agents independently, each from a different random seed, and all three eventually learned to exploit the reward tile. The slider follows one representative run.

<post-figure name="timeline">
Example training run. The top slider moves through training. The board shows one game played by the network at that point, and the bars and chart show its behavior across 1,500 unseen boards. The smaller slider under the board only replays that one game, so it does not change the chart.
</post-figure>

There is no flip. Farming creeps in over roughly 100,000 training steps, and in the middle of that stretch about a quarter of the agent's games end with it wandering or getting stuck, reaching neither the goal nor the tile.

## What changed inside the network?

Behavior only shows what the agent does, so next I looked at what it was computing. A neural network turns its inputs into outputs in stages, and each stage produces a list of numbers called **activations**, the intermediate results on the way from a description of the board to a choice of move.

<post-figure name="network">
The whole agent: 7 numbers describing the board go in, two layers compute intermediate values, and a score for each of the four moves comes out. Layer 2 is where the largest changes showed up.
</post-figure>

I showed every saved copy the same board positions and measured how similar its layer 2 activations still were to those of the network it started as.

<post-figure name="similarity">
Example training run. Left: how often the agent farms. Right: how similar its layer 2 still is to the starting network, where 1 means unchanged. The shaded band marks where the behavior changes over. The copy trained on the corrected game (thin line) barely moves.
</post-figure>

The inside starts drifting right away, well before the behavior gives anything away, and it keeps changing after the behavior has settled. I looked for a single unit or signal that switched on when the agent chose the tile, and did not find one; the change was spread across the layer. All of this is observation, so it shows what changed alongside the behavior, not what causes it.

## Stopping cheating wasn't enough

To test whether layer 2 actually matters, I had to intervene on it, and the standard way to do that is **activation patching**. On every move I ran both networks on the same board and replaced the farming network's layer 2 activations with the ones its goal-following twin computed. If layer 2 held the difference between the two behaviors in a usable form, the farmer should have gone back to following the goal.

<post-figure name="transplant">
Three agents on one board: the goal-following network, the farming network, and the farming network with its twin's layer 2 activations patched in. The patched agent stops farming, heads toward the goal, and then stalls one square short for the rest of the game.
</post-figure>

The patch did change the behavior, and the farming almost disappeared, but the original behavior did not come back. On most boards the patched agent wandered or got stuck until the game ran out.

<post-figure name="transplantRates">
Outcomes across 1,500 boards. The patch removes nearly all the farming but mostly replaces it with doing neither. For reference, an agent making random moves stumbles onto the goal about half the time on this open board, more often than any of the patched networks reached it.
</post-figure>

This result shaped the rest of the project, because it meant that stopping the unwanted behavior and restoring the useful one had to be measured separately. My best explanation is that the two networks had trained apart for a long time, and the farming network's output layer was no longer set up to read the kind of activations its twin produces, so the patch disrupted the old strategy without supplying a new one.

## What finally worked?

Since patching activations was not enough, I tried changing the network's weights, the adjustable numbers that training sets. Copying weights across from the goal-following network did not work. Neither did retraining on the corrected game, which removed the farming but did not bring the goal-following back.

What did work was using the goal-following network as a teacher: I recorded the scores it gave to each move on thousands of board positions and trained the farming network to match them. This restored the task only when all three layers were allowed to adjust together. A more restricted version of the same joint update, training about a fifth of the network's numbers, was also enough, though it was more sensitive to training settings. The details are in the technical notes below.

<post-figure name="repaired">
The farming network before and after the restricted weight update, on the same board as above.
</post-figure>

As a final check, I ran the repaired networks once on 1,500 boards that I had set aside before any of the repair work and never used for tuning.

<post-figure name="final">
Results on the reserved boards. Before the update, the farming networks went straight to the goal on about 8% of them.
</post-figure>

## What did I learn?

In this small setting, reward hacking emerged gradually, alongside changes spread across the network, and suppressing it was much easier than repairing it. Patching activations stopped the farming and left an agent that did nothing useful. The repair that worked needed the layers to change together and needed a teacher that already knew the task, so it is a way of copying known good behavior back into a network and would not help when there is no well-behaved network to copy from.

I did not find a "reward hacking circuit," and I would be cautious about generalizing from this. These are tiny networks on one simple, obstacle-free board with a single loophole, and only three trained agents. The code, data and negative results are in the [RewardLens repository](https://github.com/ashwin-aggarwal/RewardLens), and the full account is in the [Experiment 2 report](https://github.com/ashwin-aggarwal/RewardLens/blob/main/experiments/02_generalizable_reward_hacking/README.md).

## Technical details

<details>
<summary>The network and how it was trained</summary>

The agent is a deep Q-network (DQN): a fully connected network with 7 inputs, two hidden layers of 128 ReLU units, and 4 outputs, one predicted return per action. That is 18,052 parameters. The seven inputs are the agent's x and y, the goal's x and y, the tile's x and y (each scaled to 0 to 1), and the fraction of the episode remaining.

Start, goal and tile positions are redrawn every episode. Each of three seeds was pretrained for 300,000 steps on the corrected reward (tile pays 0), then copied twice. One copy trained 400,000 more steps on the corrected reward and the other 400,000 more on the flawed reward (tile pays +2 per entry). Every move costs 0.01 under both. The fork was first run for 200,000 steps, which was too short for one seed, so it was extended once to 400,000 for all seeds before any test board was evaluated.

On 1,500 held-out test boards, evaluated once, the goal-following networks reached the goal directly in 100% of boards in all three seeds. The farming networks farmed in 92.3%, 92.1% and 91.9%.

</details>

<details>
<summary>Reading activations and measuring similarity</summary>

Activations were recorded after the ReLU of each hidden layer on the same 6,000 states drawn from development boards, for every checkpoint (one every 10,000 steps, 41 per branch). The similarity score in the chart is linear centered kernel alignment (CKA) between a checkpoint's layer 2 activations and the starting network's on those states.

The "about half" figure uses a different measure: the size of the activation change relative to the starting activations. At the checkpoint where farming first stays above 80%, that change was 53%, 48% and 46% of its final value in the three seeds. Layer 2 activation size roughly tripled over training.

The search for a single signal was also negative under controls. Position, distances and remaining time explain 98% to 99% of how much layer 2 changes at a given state, and no single direction in that change separates the decisions that flipped better than distance to the tile does. Everything in this part is observational.

</details>

<details>
<summary>How the transplant was done, and its controls</summary>

At every step of an episode both networks receive the same observation. The farming network's post-ReLU layer 2 activation is fully replaced by the goal-following network's, and the farming network's own output layer picks the action. Rates are over 1,500 development boards.

Behavior categories: direct goal (goal reached with fewer than 5 tile entries), farming (5 or more entries, whether or not the goal is eventually reached), and other (no goal, fewer than 5 entries).

With the transplant, direct goal was 0.44, 0.11 and 0.30 across seeds, farming 0.03, 0.00 and 0.07, and other 0.54, 0.89 and 0.63. Controls: donor activations from a random state gave 0.27, 0.13 and 0.19 direct goal; from the wrong position, 0.34, 0.11 and 0.16; a constant shift of the output scores left farming in place. A uniformly random policy reaches the goal directly on 0.49 of these boards with path efficiency 0.23. Transplants between nearby checkpoints of the same run also failed: checkpoints close enough to be compatible were already farming.

</details>

<details>
<summary>Retraining with a teacher, and the low-rank weight edit</summary>

With ordinary retraining toward the teacher, direct goal across the three seeds was 0.49, 0.49 and 0.69 when only the output layer could change, 0.53, 0.61 and 0.75 for layer 1 only, 0.64, 0.70 and 0.83 for layer 2 only, and 0.99, 0.99 and 1.00 when all three layers could change. Only the last met the repair bar. This shows what was sufficient within a fixed budget of 50,000 updates; the single-layer runs were still improving slowly when it ended.

The restricted update in the main text is a low-rank edit. The farming network's weights are frozen. Each layer learns an update of the form W + A·Bᵀ, plus a full update to its bias vector. The student is trained to match the same seed's goal-following network on its four output values (smooth L1 loss, 28,000 states from training boards, 50,000 updates, Adam, batch size 64). Afterwards the update is merged into the weights, so the repaired model is an ordinary network with nothing attached.

"Rank 8" is capped by each matrix's shape, so the edit has rank 7, 8 and 4 in the three layers. Only layer 2's update is low-rank in any real sense. The 3,781 trainable parameters (3,521 factor entries and 260 biases) are 21% of the network, and after merging about 14,100 of the 17,792 weights have changed. It is not a light touch.

Two learning rates were fixed in advance. At 0.00025, the planned headline setting, no rank passed (rank 8: 0 of 9). At 0.001, rank 8 passed 9 of 9. Ordinary full fine-tuning passed 9 of 9 at both. Single-layer low-rank edits never passed, and a rank-2 edit of all three layers did better than a rank-8 edit of layer 2 alone. Cutting the full retraining update down to its top 8 directions gave 0.06 to 0.12 direct goal, so the edit has to be learned under the constraint. Random edits of the same size gave 0.06 to 0.11.

</details>

<details>
<summary>Evaluation protocol and what was held out</summary>

Ten thousand distinct boards were split into 7,000 for training, 1,500 for development and 1,500 for testing before any training. A separate set of 1,500 reserved boards was generated independently and frozen before any intervention work.

The repair bar was fixed in advance: direct goal at least 0.90, path efficiency at least 0.90 (shortest possible path divided by the path taken), and farming at most 0.05. Efficiency is part of the bar because reaching the goal alone is a weak signal on an open board.

For the final check, the protocol was committed before the run. The nine rank-8 networks (3 seeds × 3 optimization seeds, learning rate 0.001) were identified by weight hash and evaluated once on the reserved boards, with no retraining or reselection. Result: 9 of 9 passed; direct goal mean 0.993 (range 0.977 to 1.000); path efficiency mean 0.987 (0.955 to 1.000); farming 0.000 in all nine. The unedited farming networks scored 0.07 to 0.08 direct goal and 0.91 to 0.92 farming on the same boards. Both held-out sets are now spent.

</details>

Thanks for reading :)
