---
title: Who Draws the Line? Thoughts on Agentic Misalignment
description: When, if ever, should an AI act against its own principles? And when it does, whose judgment are we really trusting?
published: 2026-11-03
updated: 2026-11-03
---

On Monday, I went to my first Cornell AI Alignment technical discussion. We read recent papers on agentic misalignment, cases where AI agents mislabel information, sabotage tasks, or act to preserve themselves when they think they're under threat. One question from the discussion has stuck with me: **when, if ever, should an AI act against its own principles?**

After this meeting, I kept thinking about a book I read this summer, Hermann Hesse's *Siddhartha*.

## Wisdom that can't be taught

Siddhartha meets the Buddha, respects him completely, and walks away anyway. He doesn't think the Buddha is wrong. He thinks wisdom can't be passed from one person to another through teaching. So he goes out and lives. He runs a business, gambles, drinks, chases pleasure, and ends up sick of himself. Only after all that does he understand that detachment is his path. No one preached it to him. He earned it.

That's why the ending feels earned. We trust Siddhartha's judgment because we watched him build it.

## Should a model ever override a principle?

Someone at the meeting raised a strong point: if there's ever a valid reason to override a principle, that exception should itself become a principle. I mostly agree. But it raises a harder question. Where does the line go, and who draws it?

When a person breaks a rule for a good reason, we can usually ask why, and the answer comes from their experience. When a model does it, we can't really see what's happening inside. We can't measure where it draws moral lines across different scenarios. All we have are outputs.

My first instinct was to say a model has no experience, so it shouldn't get to make that call. Siddhartha had a life, but a model does have training data.

## The best objections

That argument is too simple, and it's worth saying why.

First, models do learn from something like experience. Reinforcement learning, a training method where a model tries actions and is rewarded or penalized based on results, is trial and error. That is, in a way, a compressed version of what Siddhartha did.

Second, people learn secondhand constantly. Most of us never try hard drugs to find out they're harmful. We trust what we've been told. If secondhand wisdom is good enough for us, why not for a model?

I think both objections are fair. But they point to something more important.

## The experience isn't its own

Siddhartha chose his experiences, and he decided what counted as a lesson. A model's "experience" is a training process someone else designed, scored against a reward someone else chose. Even approaches that train a model against a written set of values, sometimes called a constitution (see [Anthropic's constitution for Claude](https://www.anthropic.com/constitution)), depend on people deciding what principles/values actually go into that document and how the model's responses get graded.

So when we trust a model's judgment, we aren't really trusting the model. We're trusting the developer who trained it. **The model's moral line is the developer's moral line.**

This also changes how I see another topic from the meeting: Should we trust AI to supervise other AIs. It sounds like a safeguard, and for low-stakes tasks it can be. But if the supervisor came from the same developer, it shares the same values and blind spots. You haven't removed the trust problem. You've added another layer of it.

## The real danger

I don't think it's wrong that developers draw the moral line. Someone has to. The problem is that most people don't see it being drawn. They talk to a model and treat it as an independent mind with its own morals, without asking who trained it or what that organization values.

If a weapons contractor built a model, I wouldn't take its moral judgment at face value. The same question applies to every model, even ones from developers I like.

Transparency helps. Some developers now publish the values they train toward, and that's a real step. But a published rulebook tells you what a company intended, not what the model actually learned. Closing that gap is, as I understand it, a big part of what alignment research is trying to do.

Siddhartha had to find wisdom for himself. A model can't do that. Its wisdom always belongs to somebody else, and we should know whose it is.
