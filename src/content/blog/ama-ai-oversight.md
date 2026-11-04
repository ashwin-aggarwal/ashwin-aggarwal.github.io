---
title: The American Medical Association Wants Meaningful AI Oversight. But Who Is Actually Auditing the Models?
description: If medical AI harms a patient, responsibility should fall on those who could have prevented it. But who makes sure they're doing their jobs?
published: 2026-11-02
updated: 2026-11-03
version: 2
---

*As AI enters hospitals, we need to rethink who takes responsibility when something goes wrong.*

Medical AI is becoming increasingly integrated into healthcare, but our liability laws haven't kept up. I don't think it's fair to expect physicians to evaluate the technical reliability of AI systems they didn't build, train, or choose to deploy. The American Medical Association (AMA) recently advanced a framework that would move responsibility toward those best positioned to prevent harm. I agree with that principle, but it leaves one question: **Who verifies that these responsibilities are actually being fulfilled?**

## What Does Existing Law Say?

A 2024 chapter, [*Liability for Use of Artificial Intelligence in Medicine*](https://www.ncbi.nlm.nih.gov/books/NBK613216/), by W. Nicholson Price II, Sara Gerke, and I. Glenn Cohen, examines how malpractice law applies to AI.

Physicians are traditionally judged against a *standard of care*: what a reasonably competent physician would do in similar circumstances.

Suppose an AI recommends an unconventional treatment that could be more effective. If the physician follows it and the patient is harmed, they may face liability for deviating from established practice.

**Physicians may be legally safer rejecting a nonstandard AI recommendation, even if it could improve care.**

The chapter also explores hospital and developer liability. At the time of writing, the authors identified no reported hospital decisions addressing these AI-related injuries and expected patients to face difficulties pursuing product liability claims against software developers.

This suggests lawsuits alone may not reliably enforce accountability.

## The AMA's Proposed Alternative

In late October 2026, the AMA's Center for Digital Health and AI outlined its approach in an [*Issue Brief: Liability for Clinical AI*](https://www.ama-assn.org/system/files/liability-clinical-ai-issue-brief.pdf).

Its central principle is straightforward: responsibility should reflect each party's ability to understand, prevent, or mitigate harm.

Developers should be responsible for the systems they build. Hospitals should be accountable for selecting, validating, and monitoring them. Physicians should be responsible for the clinical judgment they can meaningfully exercise.

I think this is a necessary shift.

Doctors spend years studying medicine, not machine learning. If a hospital introduces an AI tool, physicians should reasonably expect that someone has evaluated its safety. But identifying responsibility is different from enforcing it.

## Doesn't the FDA Already Regulate Medical AI?

Yes.

The Food and Drug Administration (FDA) already regulates AI-enabled software that qualifies as a medical device.

Its primary pathways include **510(k)** clearance, generally based on substantial equivalence to an existing device; **De Novo** authorization, for novel low-risk or moderate-risk devices without a suitable predicate; and **Premarket Approval**, typically requiring stronger evidence for high-risk devices.

The FDA also oversees significant modifications. Its August 2025 guidance on *Predetermined Change Control Plans* describes how manufacturers can implement certain modifications covered by an authorized plan without submitting a new application each time. The guidance itself contains nonbinding recommendations, while the underlying authorization and applicable device regulations carry legal significance.

So the problem isn't an absence of regulation.

It's determining where FDA oversight ends and hospital-level accountability begins.

Not every clinical AI application qualifies as an FDA-regulated device. And FDA authorization doesn't automatically establish how well a tool performs across every hospital's patients, equipment, and clinical workflows.

## What Happens When AI Misses a Tumor?

Imagine a hospital deploys an AI tool to analyze radiology scans.

The system reports no suspicious findings. Months later, the patient is diagnosed with a cancer the tool missed.

Who should be responsible?

I think it depends on the AI's intended purpose.

If it was assisting a radiologist, and the tumor was reasonably identifiable, the physician may share responsibility, because the tool was not meant to be used as a replacement for the physician's expertise.

But what if the tool was intended to operate autonomously, without independent physician review? Or its performance was inadequately validated on the hospital's patients?

In those cases, I would place greater responsibility on the developer and deploying institution.

The AMA itself identifies increasingly autonomous AI as an unresolved priority.

**But, reviewing an AI recommendation is not the same as auditing the AI itself.**

## The Technical Problem With Oversight

From a computer science perspective, a model's reported accuracy doesn't tell us enough about its reliability.

Imagine a model achieves 95% accuracy during testing. At face value it definitely sounds impressive, but what if it performs substantially worse on a demographic group underrepresented in its training data?

There's also a phenomenon known as *distribution shift*: a model that works well during development can become less reliable when exposed to different patients, imaging equipment, or clinical environments. This performance degradation can be difficult to detect without frequent validation and monitoring of the model.

Model updates create another challenge. A new version might improve overall performance while introducing previously unseen failures. This is why regression testing and real-world monitoring remain important, even when regulatory change controls exist.

How could we reasonably expect a physician to detect these problems from an individual AI-generated recommendation?

I don't think we can.

In fact, I believe AI literacy should become part of medical education. Future doctors should understand training data, model limitations, and demographic bias without needing to become machine learning engineers.

But, at the end of the day, developers and deploying institutions should bear primary responsibility for technical validation, within their respective roles.

## Who Should Actually Enforce the Rules?

Fortunately, we don't need to create an entirely new oversight system.

The Centers for Medicare & Medicaid Services (CMS) already requires hospitals to maintain quality assessment and performance improvement programs that monitor patient safety and medical errors.

This year (2026), the Joint Commission also introduced a voluntary *Responsible Use of AI in Healthcare* certification covering governance, safeguards, monitoring, validation of safety performance, and education.

However, **the Joint Commission does not validate or certify individual AI products through this program.** A hospital's governance certification does not prove that every model it uses is appropriate for its patients.

My proposal is to build on existing oversight.

The FDA should continue regulating developers and applicable device modifications. CMS could establish explicit, risk-based AI requirements within hospital safety oversight, verified through state surveys or CMS-approved accrediting organizations.

High-risk or autonomous systems should face stronger local validation and ongoing monitoring requirements. Lower-risk assistive tools could face lighter requirements. Developers should disclose relevant performance limitations and demographic differences, while material updates should receive appropriate regression testing.

But there's a legitimate problem with my proposal.

The chapter warns that hospitals may lack the expertise to evaluate opaque AI systems, often called black-box models. It also quotes a court's concern, raised in a medical device case, that a hospital's smaller dataset could lead to inaccurate conclusions. The AMA similarly asks how oversight expectations can be right-sized for organizations with different resources.

I wouldn't expect every small hospital to build its own machine learning evaluation team. Shared validation networks, developer-supported testing, and independent review could help hospitals satisfy requirements without duplicating expensive technical work.

The AMA also warns that contracts and liability limits can shift responsibility toward parties with little control over the underlying risks. Oversight should consider who can actually prevent failures, not simply who agreed to bear the financial consequences.

## What About Physicians?

One counterargument is that protecting physicians too much could encourage blind reliance on AI.

I agree that doctors should remain accountable for mistakes they could reasonably recognize through their medical expertise.

But identifying an obviously dangerous treatment is fundamentally different from detecting a hidden validation failure.

Physicians already face enormous administrative demands. We shouldn't make auditing complex AI models another responsibility they must shoulder.

**The AMA is right to align accountability with control. Now we need to make that accountability verifiable.**

And that leaves a practical question worth debating:

**If rigorous local validation is too expensive for smaller hospitals, what should replace it?**

---

### Sources:

1. [Price, Gerke & Cohen — *Liability for Use of Artificial Intelligence in Medicine* (2024)](https://www.ncbi.nlm.nih.gov/books/NBK613216/)
2. [AMA — *Issue Brief: Liability for Clinical AI* (October 2026)](https://www.ama-assn.org/system/files/liability-clinical-ai-issue-brief.pdf)
3. [*Cardiac Interventions Today* — *AMA Advances Framework for Clinical AI Liability* (October 30, 2026)](https://citoday.com/news/ama-advances-framework-for-clinical-ai-liability)
4. [FDA — *Artificial Intelligence-Enabled Medical Devices*](https://www.fda.gov/medical-devices/digital-health-center-excellence/artificial-intelligence-enabled-medical-devices)
5. [FDA — *Predetermined Change Control Plan Guidance* (August 2025)](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence)
6. [CMS — *Hospital Quality Assessment and Performance Improvement Requirements*, 42 CFR § 482.21](https://www.law.cornell.edu/cfr/text/42/482.21)
7. [Joint Commission — *Responsible Use of AI in Healthcare*](https://www.jointcommission.org/en-us/certification/responsible-use-of-ai-in-healthcare)

*(This post reflects personal analysis and opinion, not legal advice)*

Thanks for reading :)

Have thoughts? Share them in the comments on [the X post](https://x.com/AshwinKA123/status/2117145580128346306).
