# AI Across Industries

> Where AI delivers measurable value across healthcare, finance, iGaming, retail, marketing and software engineering.

- **Canonical URL**: https://johnb.io/course/ai-across-industries
- **Markdown URL**: https://johnb.io/course/ai-across-industries.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 9 · AI Strategy & Business Applications
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 10 min read

AI isn't an industry. It's a toolkit. Different industries use it differently because they have different constraints and different kinds of problems to solve.

AI isn't an industry. It's a toolkit. Different industries use it differently because they have different constraints and different kinds of problems to solve.

Understanding how AI actually gets deployed in real industries helps you see the gap between "what's theoretically possible" and "what actually works." It also shapes how you make [the business case for AI investment](https://johnb.io/course/business-case-for-ai).

## Healthcare: where AI is applied

Healthcare has been an AI proving ground for years. The applications are real but more limited than the headlines suggest. For a broader view of what tools exist in each sector, see the [AI tools and platforms](https://johnb.io/course/ai-tools-platforms-2026) overview.

**Diagnostics.** AI systems trained to detect diseases from medical images - chest X-rays, mammograms, retinal scans. Some perform as well as radiologists. This matters because radiologists are expensive and in short supply. But these systems don't replace radiologists - they assist them. A radiologist uses the AI prediction as a second opinion.

This works because diagnosis from images is a bounded problem. Clear data (images), clear labels (disease vs no disease), clear metric (accuracy). You can build, test, and validate the system.

**Drug discovery.** AI screens potential drug candidates, predicting which molecules will have desired properties. [Research from Nature Medicine](https://www.nature.com/articles/s41591-021-01614-0) documents several validated use cases here. This reduces the number that need physical testing. The predictions still require lab validation, but the process is faster.

**Risk stratification.** Predicting which patients will develop certain conditions or need hospitalisation. Statistical prediction, similar to other industries. Works when you have good historical data and the future resembles the past.

What's not happening at scale: AI replacing doctors. Diagnosis is harder than image classification. Medicine requires reasoning about complex patient histories, trade-offs, and context. AI is better as a tool that assists clinicians.

Healthcare AI's success is limited by data access and regulation. Medical records are private, fragmented, and hard to access. Getting FDA approval or equivalent for a diagnostic system is a completely different challenge from building a model that works in a notebook.

## Marketing: AI in personalisation and content

Marketing has more AI deployment than most people realise.

**Personalisation.** The classic application. Collect data about what a customer likes, show them products they're likely to buy. Netflix recommending shows, Amazon recommending products - this is [generative and predictive AI](https://johnb.io/course/generative-ai-models) at scale. It works because the goal is clear (maximise engagement or sales), you have lots of data (clicks, purchases), and you can A/B test to verify it's actually working.

**Content generation.** Using language models to generate ad copy, email subject lines, social media posts. It reduces labour - instead of hiring a copywriter for every variation, you use an LLM and edit the output. Quality is uneven but it's fast.

**Attribution modelling.** Figuring out which marketing touchpoint deserves credit for a conversion. Did the customer convert because of that email, that ad, or that search? AI doesn't solve this perfectly, but it's better than hand-waving.

What works: AI at the edges, helping humans decide. What doesn't work: fully automated systems nobody reviews. If your AI is running campaigns unsupervised, mistakes compound.

## Finance: fraud, risk and trading

**Fraud detection.** Works well. Clear transaction data, clear labels (fraud vs legitimate), clear metric (catch fraud without rejecting legitimate transactions). Banks have been building these for years.

**Credit risk.** Predicting whether a loan applicant will default. Classic statistical prediction. Lenders use AI to decide who gets loans and on what terms. It works when your data is good and historical default rates are predictive of the future. A caveat: if your training data reflects historical discrimination, the model will amplify it. Credit models need careful auditing - the same principles covered in [model evaluation](https://johnb.io/course/model-evaluation) apply.

**Trading.** More scepticism warranted here. Some AI trading systems do work. But for every successful one, others fail spectacularly. Markets adapt - if an AI system makes money exploiting a pattern, other traders notice and the pattern disappears. A human trader plus an AI system probably makes better decisions than pure AI trading with no judgment.

## Manufacturing and operations

**Predictive maintenance.** Use sensor data to predict when equipment will fail. Deploy maintenance before failure. This saves money by avoiding emergency repairs and downtime. Works when you have good sensor data and enough failure history to learn from.

**Quality control.** [Computer vision](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) to inspect products and catch defects. Better than humans for consistency. Deployed in factories.

**Supply chain optimisation.** Predict demand and optimise inventory and logistics. Complex - many variables and long delays between decisions and feedback. When it works, the savings are large.

## Which industry is furthest ahead

Finance is furthest ahead - not because they have the best AI, but because they have the most infrastructure, the most investment, and the most talent. Finance companies deploy AI systems across their operations. It's not flashy but it's systematic.

Healthcare has impressive use cases but limited deployment. Stricter regulation, more fragmented data, sometimes less clear business case.

Tech companies are furthest ahead if you count them as an industry. Google, Meta, Microsoft - they have the data, the expertise, the infrastructure. But they're not representative of most industries.

The furthest-ahead organisations share a pattern: good data infrastructure, clear metrics, and real business problems that AI can solve. That's not an industry characteristic. It's an organisational maturity characteristic. Some finance companies have it. Some manufacturing companies have it. Most don't. The [AI adoption journey](https://johnb.io/course/ai-adoption-journey) lesson covers why so few organisations reach this level.

## How It Works

1. **What makes a use case well-suited to AI:.** Clear, consistently formatted input data. Binary or well-defined output labels. A measurable metric you can optimise. Enough historical data to train on. A domain where the future resembles the past. The use cases that work across all industries share these properties.
2. **What makes a use case hard:.** Inputs that require complex contextual reasoning (general clinical diagnosis). Situations where the relationship between features and outcomes changes quickly (trading). Domains with fragmented or private data that's hard to aggregate (healthcare records). Tasks where mistakes have severe regulatory consequences.
3. **The human-in-the-loop pattern:.** Almost every successful real-world AI deployment follows this pattern - AI surfaces options or flags anomalies, human makes the final decision. Pure AI automation without human review is rarer and riskier than headlines suggest.

## Key Points

- AI is a toolkit - how it's used depends on each industry's data, constraints, and problem types
- Healthcare: diagnostics from images works; replacing doctors doesn't; limited by regulation and data access
- Marketing: personalisation and content generation at scale; human review still essential
- Finance: fraud detection and credit risk are mature; AI trading is contested and markets adapt
- Manufacturing: predictive maintenance and quality control are strong use cases with good sensor data
- Finance is furthest ahead in systematic deployment; healthcare has impressive cases but slow broad deployment
- The furthest-ahead organisations have good data infrastructure and clear metrics - an organisational quality, not an industry one
- Human-in-the-loop remains the dominant pattern across industries for high-stakes decisions

## Frequently Asked Questions

### How is AI used in healthcare?

The main deployed uses are: diagnostics (detecting diseases in medical images like X-rays and mammograms, some performing at radiologist level), drug discovery (screening molecular candidates to reduce physical testing), and risk stratification (predicting which patients will need hospitalisation). AI doesn't replace doctors - it assists clinicians. Healthcare AI is limited by fragmented private data and strict regulatory validation requirements.

### What AI is actually deployed in marketing?

Personalisation (recommending products and content based on user behaviour - Netflix, Amazon), content generation (LLMs generating ad copy and email subjects for human editing), and attribution modelling (predicting which marketing touchpoints led to conversions). What works: AI assisting human decisions. What doesn't: fully automated campaigns with no human review - mistakes compound.

### Where is AI most mature in financial services?

Fraud detection (clear data, clear labels, clear metric - banks have done this for years) and credit risk scoring (predicting loan default probability). AI trading is more contested - some systems work but markets adapt to exploitable patterns. Finance has invested more systematically in AI than most industries, with the infrastructure and talent to show for it.

### Which industry is furthest ahead in AI adoption?

Finance has the most systematic AI deployment - not the flashiest use cases, but the most infrastructure, investment, and talent. Healthcare has impressive individual cases but limited broad deployment due to regulation and data fragmentation. The furthest-ahead organisations are those with good data infrastructure, clear metrics, and real problems AI can solve - that's an organisational maturity thing, not an industry thing.

## Sources & Primary References

1. Rajpurkar, P. et al. (2022). AI in health and medicine. *Nature Medicine*.
2. McKinsey Global Institute. (2023). The State of AI in 2023. *mckinsey.com*.
3. European Banking Authority. (2023). Discussion Paper on Machine Learning for IRB Models. *eba.europa.eu*.
4. World Economic Forum. (2024). The Future of Jobs Report. *weforum.org*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
