# Making the Business Case for AI

> How to scope AI projects around specific bottlenecks, estimate token and infrastructure costs, and measure real ROI.

- **Canonical URL**: https://johnb.io/course/business-case-for-ai
- **Markdown URL**: https://johnb.io/course/business-case-for-ai.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 9 · AI Strategy & Business Applications
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 12 min read

You have an idea for an AI system. You think it could help the business. Now you need to convince someone with budget to fund it.

You have an idea for an AI system. You think it could help the business. Now you need to convince someone with budget to fund it.

This is where most AI projects die. Not because the idea is bad. Because the pitch is wrong.

Decision makers don't care about AI. They don't care about accuracy metrics or novel algorithms. They care about one thing: making money or saving money or solving a real problem. A pitch that says "We can deploy a machine learning model that will improve customer experience" won't work. A pitch that says "We can reduce customer support costs from £2M per year to £1.5M per year by implementing an [AI chatbot](https://johnb.io/course/intro-to-mlops) for password resets" will work.

## Why generic AI pitches fail

"We should use AI to improve our business." "We need to invest in AI to stay competitive." "AI could help us serve customers better."

None of these work because they're not specific. A decision maker hearing this thinks: what does it cost? What happens if it fails? What do I get for my investment? You haven't answered any of those questions.

Generic pitches also assume that being excited about AI is contagious. It's not. The person with budget has heard about AI. They've probably read the same [McKinsey reports on AI ROI](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) you have. They know it's powerful. What they don't know is whether investing in your specific idea is a good use of their money.

The worst generic pitch: "Our competitors are using AI, we should too." This is the fear-of-missing-out pitch. It rarely works because it's not actually a reason to do anything. Just because competitors do something doesn't mean it's profitable for them or for you.

## What decision makers actually care about

**Problems, not solutions.** A decision maker has problems. "We lose 20% of our high-value customers each year." "Our manual data entry process is costing us 500 hours per month." "Our fraud losses are 3% of revenue." They don't have a pre-built solution. They might not know AI is involved. They just know the problem is costing them money.

**Money in, money out.** If the project costs £500,000, what do we get back? Is it £750,000 in savings? Over what timeline? Is the payback 18 months or 3 years?

**Risk and certainty.** Will this project definitely work? Probably not. What's the risk of failure? What happens if you spend the money and the AI system doesn't work? Is that a big loss or acceptable? What's the downside?

**Organisational alignment.** Does this fit our strategy? Is this what we should be doing right now? Or are there other higher-priority problems?

This is boring. But this is what gets projects funded.

## How to frame AI in terms of a specific problem

Start with the problem, not the solution.

"We have a problem: our customer churn rate is 5% higher than our competitors. In the last year we lost £10M in revenue to churn we shouldn't have lost. We think we know how to fix it."

Now you have their attention because there's a specific cost attached to the problem.

"We could build a churn prediction model. We'd identify high-risk customers 30 days before they churn. Our retention team could target them with personalised retention offers. We believe we could reduce churn by 1 percentage point, recovering £2M in annual revenue."

Now you have a specific solution and a specific financial benefit.

"It would cost £300,000 to build and deploy. That includes 6 months of engineering work, data infrastructure, and the first year of operations. The payback period would be 1.8 years."

Now they know what it costs.

"The risk is that churn is more complex than our model can capture, or our retention offers don't work. In that scenario, we spend the money and don't recover the revenue. Our upside is £2M per year, our downside is a £300,000 sunk cost."

Now they know the risk/reward. That pitch works because you're speaking their language. You're framing the problem in financial terms. You're being specific. You're acknowledging uncertainty.

## The metrics that matter in a business case

**Baseline.** What's the current situation? "Currently we process 100,000 customer support tickets per month and it costs us £2M per year in labour."

**Improvement.** What will change? "An AI chatbot could handle 30,000 of those tickets - the simple ones - and reduce handling time for the other 70,000. We estimate we could reduce costs by 30%."

**Financial impact.** "That's £600,000 per year in savings."

**Implementation cost.** "Building and operating this system would cost £400,000 in year one, £100,000 per year thereafter."

**Payback period.** "We'd break even in 8 months and then net £500,000 per year."

**Confidence level.** "We're 70% confident in these numbers. We've talked to customers, estimated conservatively, and built in a margin for error."

These are the numbers that matter. Revenue impact (or cost savings), investment required, timeline, confidence level. [Accuracy doesn't matter](https://johnb.io/course/model-evaluation) to anyone who controls the budget. The coolness factor doesn't matter. Speed of inference doesn't matter. Does it make money? That matters.

## Common objections and how to handle them honestly

**"What if the model doesn't work?"** "You're right, it might not. That's why we recommend doing a pilot first. Spend £50,000, run it on 5% of your customer support tickets, measure if it actually reduces costs. If it does, we invest in the full system. If it doesn't, we've learned something for a small cost."

**"AI is just hype, will it actually work?"** "For some things, yes, for some things, no. That's why we're being specific about what we're solving. We're not promising AI will fix everything. We're saying this specific use case is mature and proven in other companies."

**"Won't this take too long?"** "Probably, yes. But the cost of not fixing this problem is £10M per year. Spending 6 months and £300,000 to potentially save £2M per year is probably worth it. We could also start with a simpler version if you need something faster."

**"What if our competitors get there first?"** "They might. But they might also fail. We're not building this because of competition - we're building it because it saves us money. That's a stronger motivation."

**"Can we just buy a solution instead of building?"** "Great question." The [build vs buy](https://johnb.io/course/build-vs-buy) lesson is exactly about this. "Here are three products we researched. They cost £X per month. They need this integration work. They don't do Y. Our custom solution does Y and costs less over 3 years. Let's compare."

The theme across all of these: honest uncertainty. You're not guaranteed to win. But the expected value is positive. That's the real pitch.

## The single biggest mistake

Disconnecting the AI system from business outcomes.

Teams build impressive models that don't improve the business metrics anyone cares about. They optimise for accuracy when they should optimise for profit. Understanding the full [adoption journey](https://johnb.io/course/ai-adoption-journey) helps avoid this. They build features nobody uses.

The mistake happens because it's easier to talk about technical metrics than business metrics. "We achieved 94% accuracy" is specific. "We improved customer lifetime value" requires integration with many systems and is harder to measure.

But the business case lives or dies on business metrics. If your AI system doesn't impact revenue, costs, or customer satisfaction - metrics the business actually cares about - it doesn't matter how accurate it is.

The teams that succeed at AI in business define the business metric before they build anything. Then they build the system to optimise that metric. The [AI across industries](https://johnb.io/course/ai-across-industries) lesson shows which sectors have done this consistently well. Then they measure whether they hit it.

Everything else is details.

## How It Works

1. **The pitch structure that works:.** Start with the specific problem and its cost to the business. Then introduce the proposed solution with a specific financial benefit. Then state the investment required. Then acknowledge the risk honestly. This structure answers the four questions a decision maker has before you're asked them.
2. **Why pilots work as a response to objections:.** A pilot converts a large uncertain bet into a small certain experiment. "Spend £50,000 to find out if £600,000 in savings is real" is a much easier decision than "spend £400,000 on a system that might not work." Offering a pilot also signals that you're being honest about uncertainty, which builds credibility.
3. **The confidence level number:.** Stating "we're 70% confident in these numbers" sounds like weakness. It's actually strength. Decision makers know your projections involve uncertainty. Quantifying that uncertainty shows you've thought rigorously and aren't overselling. An honest 70% projection beats an overconfident 100% claim every time.

## Key Points

- Generic AI pitches fail because they don't answer the decision maker's actual questions: cost, return, risk, payback
- Decision makers care about problems, money in/out, risk, and organisational fit - not model accuracy
- Start with the problem and its cost, then the solution and its financial benefit, then the investment, then the risk
- A business case needs six metrics: baseline, improvement, financial impact, implementation cost, payback period, confidence level
- Honest uncertainty wins. Quantify your confidence level. Offer pilots to reduce the cost of being wrong
- The fear-of-missing-out pitch ("competitors are using AI") rarely works - it's not a reason to invest
- The single biggest mistake: disconnecting the AI system from business outcomes and optimising for accuracy instead of profit
- Before building anything, define the business metric that will demonstrate success

## Frequently Asked Questions

### Why do generic AI pitches fail?

Generic pitches like "we should use AI to improve our business" fail because they don't answer the questions a decision maker actually has: what does it cost, what's the return, what happens if it fails, how long is the payback period? Being excited about AI isn't contagious. The person with budget needs to know whether your specific idea is a good use of their money, not whether AI is powerful in general.

### What do decision makers actually care about when funding AI projects?

Four things: problems (a specific cost or pain they already know about), money in/money out (what's the return, over what timeline), risk and certainty (what happens if it fails, is the downside acceptable), and organisational alignment (does this fit our strategy and priorities right now). Technical metrics like model accuracy don't feature in this list.

### What metrics should an AI business case include?

Six: baseline (current situation in numbers), improvement (what changes and by how much), financial impact (the pound or dollar value of that improvement), implementation cost (year one and ongoing), payback period (when you break even), and confidence level (how certain are these numbers). Accuracy doesn't belong in a business case. Revenue impact, cost savings, investment required, timeline, and confidence level do.

### What is the single biggest mistake when making an AI business case?

Disconnecting the AI system from business outcomes. Teams optimise for accuracy when they should optimise for profit. They build features nobody uses. The mistake happens because it's easier to talk about technical metrics than business metrics. But the business case lives or dies on business metrics. Before building anything, define what business metric will demonstrate success, then build to optimise that metric.

## Sources & Primary References

1. McKinsey Global Institute. (2023). The State of AI in 2023. *mckinsey.com*.
2. Davenport, T. & Ronanki, R. (2018). Artificial Intelligence for the Real World. *Harvard Business Review*.
3. Brynjolfsson, E. & McAfee, A. (2017). The Business of Artificial Intelligence. *Harvard Business Review*.
4. Gartner. (2024). AI ROI: Demonstrating Business Value from AI Projects. *gartner.com*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
