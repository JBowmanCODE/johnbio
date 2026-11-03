# AI Governance Frameworks

> How organisations and regulators govern AI systems under the EU AI Act, NIST AI RMF, ISO/IEC 42001 and UK AI principles.

- **Canonical URL**: https://johnb.io/course/ai-governance-frameworks
- **Markdown URL**: https://johnb.io/course/ai-governance-frameworks.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 3
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

AI governance sounds abstract until you realise it's about control: who decides what an AI system can do, what standards it must meet, and who's accountable when it breaks. Right now, governance is a patchwork - some law, some self-regulation, and a lot of gaps.

## What AI Governance Actually Means in Practice

In practice, governance means rules. Rules about how data gets handled, who can access models, what happens before deployment, and how you audit for problems. It also means accountability - knowing who's responsible when something goes wrong.

Right now, governance is a patchwork. Some governments are legislating. Some companies are self-regulating. Most organisations are doing whatever they can get away with.

The EU is furthest along. Their [EU AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) categorises AI systems by risk level. High-risk applications - facial recognition, hiring systems, credit decisions - face strict requirements: mandatory audits, record-keeping, transparency about limitations. Lower-risk systems have fewer requirements. It's not perfect, but it's actual law with enforcement mechanisms.

The US has moved more slowly. The NIST AI Risk Management Framework provides guidelines and practices that organisations can follow, but don't have to. It covers four functions: Govern (setting policies), Map (understanding what your system does), Measure (testing for problems), and Manage (acting on findings). More robust than nothing, but voluntary.

China's approach is more centralised, with government mandates about what AI can do. The UK has taken a lighter touch, preferring industry self-regulation. The approaches vary significantly, which creates problems for organisations operating across borders.

## What Enterprise Governance Actually Looks Like

Inside organisations that take this seriously, governance is operational, not decorative.

You can't just build an AI system and deploy it. There are review gates. A model goes through evaluation before launch: does it work fairly for different groups? Have we tested edge cases? Do we understand its failure modes? Who's liable if it breaks?

Some companies have AI review boards - cross-functional teams with authority to block projects that are too risky. Others have review boards in name only, with no real power to stop a [deployment](https://johnb.io/course/ai-adoption-journey) driven by a revenue target.

The best implementations audit continuously, not just at launch. They monitor how the model performs in the real world. If accuracy drops for a specific demographic, they catch it. If the model starts making decisions that violate company standards, there's a process to pull it back.

Governance also means documentation. Why did we make this decision? What data trained this model? What are the known limitations? Documentation is the difference between "we forgot why we built this" and "we know exactly what we did and we can explain it to regulators or lawyers."

The problem is cost. Rigorous testing takes time and money. Most companies do the minimum they think will keep them legally safe, then hope nobody looks closely. That's most companies.

## Why Governance Lags Behind Capability

We can build AI systems faster than we can write rules about them.

A company can release a language model tomorrow. It takes years for regulators to understand what it does, years for legislators to draft rules, and years for courts to interpret them. By the time there's clarity, the company has moved on.

This creates a competitive problem. If one company deploys an untested system and it works, they win market share. If another waits to audit properly, they lose ground. So everyone deploys fast, and governance becomes reactive rather than proactive.

Regulators also struggle with technical depth. Hiring AI researchers as government employees is difficult - they earn more in industry. Understanding whether a specific system is safe requires technical knowledge that most regulatory bodies don't have in-house. They end up relying on the companies themselves to explain what their systems do, which is a structural conflict of interest.

## Is Current Governance Adequate?

No. The frameworks exist, but they're not binding enough and they're not keeping up.

The EU AI Act is the most serious attempt, but it's getting criticised for being vague about what counts as "high-risk." Companies will find loopholes - they always do. The US has nothing comparable at the federal level. Real-world [AI failures](https://johnb.io/course/ai-failures-ethics) keep showing why this matters.

What bothers me most is that governance relies on companies self-reporting problems. If an AI system causes [hallucinations or bias](https://johnb.io/course/ai-hallucinations-bias-ip), does the company tell regulators? More likely they tell their lawyers first. Proactive disclosure opens liability. So the incentives push against transparency.

What's actually needed: mandatory third-party audits before deployment for systems affecting people's opportunities, safety, or civil rights. Real liability, not "we did our best." Transparency requirements so that if AI makes decisions about you, you can find out what data it used. And some international standard, because companies will otherwise operate from whichever jurisdiction has the weakest rules. Frameworks like [ISO/IEC 42001](https://www.iso.org/standard/81230.html) are a start.

None of this is happening at the scale it should be. Most companies are choosing which governance rules to follow based on what's politically convenient in their market. That's not governance. It's regulatory arbitrage.

## How It Works

1. **Step.** The EU AI Act uses a risk-tiered approach. Unacceptable risk systems (social scoring, real-time remote biometric surveillance in public) are prohibited. High-risk systems (hiring, credit, safety-critical applications) require conformity assessments, technical documentation, human oversight, and registration in an EU database. Limited and minimal risk systems have transparency obligations or none.
2. **Govern.** NIST's AI RMF is structured around four core functions: **Govern** - setting up culture, policies, and processes for responsible AI; **Map** - identifying context, purposes, and risks of AI systems; **Measure** - testing and evaluating AI risks; **Manage** - prioritising and acting on identified risks. It's designed to integrate with existing enterprise risk management frameworks.

## Key Points

- AI governance = rules about data handling, model access, deployment standards, and accountability when things go wrong.
- EU AI Act: binding law categorising AI by risk level. High-risk systems require mandatory audits and transparency.
- NIST AI RMF: voluntary US guidelines covering Govern, Map, Measure, and Manage functions.
- Enterprise governance: review gates before deployment, AI review boards, continuous monitoring, documentation.
- Governance lags capability because deployment is faster than legislation, and competitive pressure rewards moving fast.
- Regulatory bodies lack technical expertise to independently evaluate AI systems - they often rely on company self-reporting.
- Current governance is inadequate: frameworks exist but enforcement is weak, many are voluntary, and incentives push against transparency.
- What's needed: mandatory third-party audits, real liability, transparency requirements, and international standards to prevent regulatory arbitrage.

## Frequently Asked Questions

### What is the EU AI Act?

The EU AI Act categorises AI systems by risk level. High-risk applications - facial recognition, hiring systems, credit decisions - face strict requirements including mandatory auditing, record-keeping, and transparency about limitations. Lower-risk systems have fewer requirements. It began becoming enforceable in 2024-2025 and represents the most comprehensive binding AI regulation currently in force anywhere.

### What is the NIST AI Risk Management Framework?

The NIST AI Risk Management Framework is a US government set of voluntary guidelines for AI governance. It covers four functions: Govern (establishing policies), Map (understanding what your system does), Measure (testing for problems), and Manage (acting on findings). It's more robust than doing nothing, but unlike the EU AI Act, it's not mandatory.

### Why does AI governance lag behind AI capability?

Companies can release AI systems faster than regulators can understand, legislate, and enforce rules about them. There's also a competitive pressure: if one company deploys fast and wins market share while another waits for proper auditing, the careful company loses. This creates incentives to move fast and govern reactively. Regulatory bodies also lack the technical expertise to evaluate specific systems quickly.

### What does enterprise AI governance actually involve?

Enterprise AI governance means review gates before deployment (testing for bias, edge cases, failure modes), AI review boards that can block risky projects, continuous monitoring after deployment, and documentation of why decisions were made and what data was used. The best implementations audit continuously rather than just at launch and have defined processes for pulling a model back if problems emerge.

## Sources & Primary References

1. European Parliament and Council. (2024). Regulation (EU) 2024/1689 - Artificial Intelligence Act.
2. NIST. (2023). AI Risk Management Framework (AI RMF 1.0). National Institute of Standards and Technology.
3. Cihon, P. (2019). Standards for AI Governance: International Standards to Enable Global Coordination in AI Research & Development. *Future of Humanity Institute*.
4. Dafoe, A. (2018). AI Governance: A Research Agenda. *Future of Humanity Institute, University of Oxford*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
