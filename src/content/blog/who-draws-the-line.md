---
title: Who Draws the Line? Thoughts on Agentic Misalignment
description: When, if ever, should an AI act against its own principles? And when it does, whose judgment are we really trusting?
published: 2026-11-03
updated: 2026-11-08
version: 2
---

Last week, I went to my first Cornell AI Alignment technical discussion. We read recent papers on agentic misalignment: cases where AI agents mislabel information, sabotage tasks, or act to preserve themselves when they believe they're under threat. One question from the discussion has stuck with me: **when, if ever, should an AI act against its own principles?**

Afterward, I kept thinking about a book I read this summer, Hermann Hesse's *Siddhartha*.

## Wisdom that can't be taught

Siddhartha meets the Buddha, respects him completely, and walks away anyway. He doesn't think the Buddha is wrong. He thinks wisdom can't be passed from one person to another through teaching alone. So he goes out and lives, and teaches himself through his own experiences. He runs a business, gambles, drinks, chases pleasure, and ends up sick of himself. Only after all that does he understand that detachment is his path. No one preached it to him, he lived through it and came to his own conclusion.

We trust Siddhartha's judgment at the end of the novel because we watched him build it.

## Should a model ever override a principle?

Someone at the meeting raised a strong point: if there's ever a valid reason to override a principle, that exception should itself become a principle. I agree with parts of this point. Writing exceptions down makes a model's behavior easier to predict and audit. But rules can't anticipate every situation, and every new exception eventually needs exceptions of its own. That's part of why some developers have moved toward training judgment rather than only rules. [Anthropic's current constitution for Claude](https://www.anthropic.com/constitution), for example, leans on judgment more than its earlier, more rule-based version did.

If models need judgment, a harder question follows: **where does the line go, and who draws it?**

When a person breaks a rule for a good reason, we can ask why, and the answer comes from their experiences and thoughts. When a model does it, we can only partly see what's happening inside. Interpretability research, which studies a model's internals to explain its behavior, is making progress, but we still can't reliably measure where a model draws moral lines across different scenarios. Mostly, we have outputs.

My first instinct was to say a model doesn't have its own experiences, so it shouldn't get to make moral calls. Siddhartha had a life, but a model does have training data.

## Two objections

First, models do learn from something like experience. Reinforcement learning, a training method where a model tries actions and is rewarded or penalized based on results, is trial and error. In a way, it's a compressed version of what Siddhartha did.

Second, people learn secondhand constantly. Most of us never try hard drugs to find out they're harmful. We trust what we've been told. If secondhand wisdom is good enough for us, why not for a model?

Both objections are fair, but I think that they point to something more general.

## The experience isn't its own

Siddhartha chose his experiences, and he decided what counted as a lesson. A model's "experience" is a training process someone else designed, scored against a reward someone else chose. Even approaches that train a model against a written set of values, sometimes called a constitution (see [Anthropic's constitution for Claude](https://www.anthropic.com/constitution)), depend on people deciding which values go into that document and how the model's responses get graded.

The obvious reply is that people don't choose their formative experiences either. No child picks their parents, culture, or schools. But I feel like there are two main differences. The first one is concentration: a child is shaped by many people who don't coordinate, while a single organization shapes the values behind millions of a model's conversations. The second difference is revision: Siddhartha could reject what he was taught and walk away. Whether a model can revise its own values, and whether we would even want that to happen, is still an open question.

So when we trust a model's judgment, we're trusting two things at once: the values its developer chose, and how faithfully training turned those values into behavior. The papers we read (links at the bottom) show the second can fail. The agents that sabotaged tasks or protected themselves weren't doing what their developers wanted. **The model's line is drawn by the developer's process, but not always where the developer meant to draw it.**

This also changes how I think about another question from the meeting: whether AI should supervise other AI. For low-stakes tasks, it can be a useful safeguard. But models trained the same way tend to fail in the same places, so a supervisor from the same developer is likely to miss the same mistakes as the model it's checking. The second check catches less than it appears to. For high-stakes decisions, the check should come from somewhere else: a model trained differently, or a person. [OpenAI's setup for monitoring its internal coding agents](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment) is a real example of this tradeoff: its strongest model checks the agents' work, and the most serious cases go to a person for review. The model check catches volume; the human check is what keeps it from being one developer grading itself.

## The line no one sees

I don't think it's wrong that developers draw the moral line. Someone has to. The problem is that the line is easy to forget. It's natural to talk to a model as if it were an independent mind with its own morals, without asking who trained it or what that organization values.

If a weapons contractor built a model, would you take its moral judgment at face value? The same question applies to every model, even ones from developers you like.

Transparency makes this easier. Some developers now publish the values they train toward, and that's definitely a real step. But a published rulebook tells you what a company intended, not what the model actually learned. Closing that gap is, as I understand it, a big part of what alignment research is trying to do.

That brings me back to the opening question. Until we can close that gap, I don't think a model should decide on its own when to break its principles in high-stakes situations. When its values conflict, the better move is to stop and bring the conflict to a person, someone who can be asked why and held responsible for the answer.

Siddhartha had to find wisdom for himself. A model can't do that. Its wisdom always belongs to somebody else, and we should know whose it is.

Thanks for reading :)

### Papers read at the discussion:

1. [*Agentic Misalignment in Summer 2026* (Anthropic Alignment Science Blog, July 2026)](https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/)
2. [*How we monitor internal coding agents for misalignment* (OpenAI, March 2026)](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment)
