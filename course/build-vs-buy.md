# Build vs Buy

> Framework for deciding when to buy commercial AI SaaS, integrate foundation model APIs, or train custom models.

- **Canonical URL**: https://johnb.io/course/build-vs-buy
- **Markdown URL**: https://johnb.io/course/build-vs-buy.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 9 · AI Strategy & Business Applications
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

You need an AI capability. You have two choices: build it yourself or buy it from someone else.

You need an AI capability. You have two choices: build it yourself or buy it from someone else.

This decision usually goes wrong. Teams build things that already exist. Or they buy tools that are too generic for their use case. Or they build something half-baked because they underestimated the effort. There's a [framework for thinking about this clearly](https://hbr.org/2020/02/companies-are-failing-in-their-efforts-to-become-data-driven).

## The real cost of building

Building sounds cheap. You have engineers. You have a problem. You build a solution.

But the real cost is higher than people think.

**Development time.** Building an ML system takes longer than anyone predicts. Feature engineering, data collection, model experimentation, debugging failures. You're looking at 3-6 months minimum for something production-ready. That's expensive.

**Infrastructure.** You need to serve the model, monitor it, and set up retraining pipelines. This is software engineering work, not just ML. Maybe another 2-3 months if you do it well.

**Data.** You need good data to train on. If you don't have it, you need to collect it. Labelling data is expensive and slow.

**Ongoing maintenance.** The model will degrade over time. You'll need to retrain it and [monitor it for drift](https://johnb.io/course/monitoring-drift). That's a permanent cost - maybe one person part-time, maybe full-time.

**Opportunity cost.** While your engineers are building this AI system, they're not building other things. What are they not doing?

A realistic total cost for building a production ML system: £150,000 to £800,000+ depending on complexity, scope, and your salary base. The [business case for AI](https://johnb.io/course/business-case-for-ai) lesson covers how to put these numbers in front of decision makers. That's building the model, infrastructure, and setting up operations. This might be worth it. But you need to know the number going in.

## When building makes sense

Build when you have proprietary data or methods that give you competitive advantage - buying a generic tool won't capture that. Build when your specific requirements aren't met by available products. Build when you have in-house ML engineering and infrastructure expertise - if you don't, you're either hiring (expensive) or struggling (slow). For complex builds, that infrastructure includes [MLOps practices](https://johnb.io/course/intro-to-mlops) from the start. Build when the problem is unique to your business. Build when you've already failed with products and know exactly what you need.

But the default should not be "build." Most organisations overestimate their need to build.

## When buying (or using APIs) is smarter

Buy when the problem is general. Fraud detection, demand forecasting, customer churn - these are solved problems. Products exist. Buy when you don't have the ML expertise to build well. Buy when you need to move fast - you can't afford a 6-month development cycle. If you're considering fine-tuning a model rather than buying a platform, see the [RAG and fine-tuning](https://johnb.io/course/rag-finetuning-enterprise-ai) lesson first. Buy when the cost of failure is low and you're learning what's possible. Buy when you need the vendor to keep the product updated as your domain changes.

For most organisations, buying is smarter. The cost is lower, you get something faster, and you reduce risk.

## The hidden costs on both sides

Building has hidden costs: hiring the right people, learning from failures slowly, integration nightmares discovered late, and ongoing maintenance that's more expensive than estimated. Once built, you still need [deployment infrastructure](https://johnb.io/course/model-deployment) to serve it.

Buying has hidden costs: vendor lock-in (expensive to switch later), integration work (the product almost never fits perfectly), customisation costs (making the product work for your use case requires engineering), increasing licensing costs over time, and depending on the vendor for updates and support.

A product that costs £40,000 per year sounds cheap. But if it requires £80,000 of integration work and six months of your engineer's time, the total cost of ownership is high. Calculate the full number, not the sticker price.

## What the default should be

Build is seductive. Engineers like building. It feels like you're creating something. It feels smart.

But the default answer should be buy. Every time.

Here's why: building is expensive, slow, and risky. The chance you'll end up with something better than a professional product is low. The chance you'll exceed budget and timeline is high.

Start with buying. Try a product. Set a clear timeline - 3 months. If the product works, great, you got ROI. If it doesn't, you've learned something. You now know what you actually need. Either you customise the product or you know enough to build better.

The organisations that build first waste time building the wrong thing. The organisations that buy first learn fast and either find the product works or know what to build next.

This is controversial in engineering circles. Engineers think buying is "not invented here" syndrome. I think building first is "we're smarter than everyone else" syndrome. See the [AI adoption journey](https://johnb.io/course/ai-adoption-journey) for why organisations that buy first tend to move faster. A company that focused on this specific problem for years probably solved it better than you will in six months. Most organisations that reverse this - build first, buy later - end up spending more.

## How It Works

1. **Build vs buy decision framework:.**
2. **Step.** 1. Is this problem generic or specific? If generic (fraud detection, demand forecasting, NLP tasks), products exist - try buying first. If specific, consider building. 2. Do we have the expertise? If no ML engineers or MLOps capability, buying is almost always better. 3. What's the timeline? If < 3 months needed, buy. 4. What's the total cost of ownership? Calculate build cost (dev time + infra + maintenance) vs buy cost (licensing + integration + customisation). 5. What's the switching cost? If you buy and it doesn't work, how much do you lose? If you build and it doesn't work, how much do you lose?
3. **Typical progression:.** Use an API â†’ buy a product â†’ customise a product â†’ build a hybrid â†’ build custom. Move right only when the left fails to meet specific requirements you can articulate precisely.

## Key Points

- Building an AI system typically costs £150,000-£800,000+ and takes 6-12+ months including infrastructure
- Build when you have proprietary advantage that no generic product can capture
- Buy when the problem is generic, you lack expertise, or you need speed
- Hidden build costs: hiring, slow learning from failure, late-discovered integration problems
- Hidden buy costs: vendor lock-in, integration work, customisation engineering, escalating licences
- Always calculate total cost of ownership, not just sticker price
- The default should be buy first - even failure teaches you what to build
- Organisations that build first tend to build the wrong thing; those that buy first learn what's actually needed

## Frequently Asked Questions

### When should you build an AI system instead of buying one?

Build when you have proprietary data or methods that give competitive advantage, when your specific requirements aren't met by available products, when you have in-house ML and engineering expertise, when the problem is unique to your business, or when you've already tried buying and it didn't work. The default should not be build - most organisations overestimate their need to build.

### What is the realistic cost of building a production ML system?

£150,000 to £800,000+ depending on complexity and team salaries. This includes model development (3-6 months), infrastructure and serving (2-3 months more), data collection and labelling if needed, plus ongoing maintenance (one person part-time to full-time permanently). Most teams significantly underestimate this before they start.

### What are the hidden costs of buying an AI product?

Vendor lock-in (expensive to switch later), integration work (the product never fits perfectly out of the box), customisation costs (making it work for your use case requires engineering), increasing licensing costs over time, and dependency on the vendor for updates and support. A product that appears cheap per month can have a high total cost of ownership.

### What should be the default first move: build or buy?

Buy or use an API first. Set a 3-month timeline. If the product works, you got ROI quickly. If it doesn't, you've learned exactly what you need - either to customise the product or what to build. Organisations that build first waste time building the wrong thing. Organisations that buy first learn fast and make better decisions about what to build next.

## Sources & Primary References

1. Andreessen Horowitz. (2020). The Cost of Cloud, A Trillion Dollar Paradox. *a16z.com*.
2. Gartner. (2024). Build vs Buy for AI Capabilities. *gartner.com*.
3. Huyen, C. (2022). *Designing Machine Learning Systems*. O'Reilly.
4. McKinsey Global Institute. (2023). The Economic Potential of Generative AI. *mckinsey.com*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
