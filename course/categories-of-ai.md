# Categories of AI: Narrow, General and Super AI

> Explains the three tiers of AI capability: Artificial Narrow Intelligence (ANI), Artificial General Intelligence (AGI), and Artificial Superintelligence (ASI).

- **Canonical URL**: https://johnb.io/course/categories-of-ai
- **Markdown URL**: https://johnb.io/course/categories-of-ai.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 1
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 9 min read

There are three boxes people sort AI into. Understanding the difference matters because it changes how you think about what AI can actually do right now versus what's theoretical - and why nearly every claim about AGI timelines should be read with scepticism.

Three categories. That's all there is. Narrow AI, General AI, and Super AI. Every discussion you'll read about AI timelines, AI risk, and AI capability maps onto one of these. Getting them straight changes how you read the news.

## Narrow AI: The Only Kind That Exists

Narrow AI, sometimes called ANI (Artificial Narrow Intelligence), is every AI system in existence today. [ChatGPT](https://openai.com/chatgpt). Image recognition. Spam filters. Medical diagnostic tools. Self-driving cars. All of it.

The defining characteristic is that it solves one specific problem. ChatGPT generates text with impressive fluency. It can't drive. It can't actually see. It doesn't want anything. It doesn't learn from your conversation - each session starts from scratch with the same training it always had.

The word "narrow" sounds like a criticism. It isn't. Narrow AI systems are extraordinarily capable within their domain, often better than any human. The point is that capability doesn't transfer outside that domain.

## Real Examples of How Narrow AI Really Is

This becomes clearer with specifics.

**Spam filters:** Trained to spot patterns in spam emails. Excellent at that task. They can't tell that your grandmother's health update is more important than a marketing newsletter, even if the newsletter matches more of the patterns they were trained on. Context is invisible to them.

**Go-playing AI:** [DeepMind's AlphaGo](https://deepmind.google/research/breakthroughs/alphago/) beat Lee Sedol, one of the world's best Go players. It can't play chess. It can't play poker. It does nothing except Go. That was by design.

**Face recognition:** Works in controlled settings, degrades in the real world with different lighting and angles. Fails systematically on faces from demographics underrepresented in its training data. Can't recognise someone it's never seen before.

**Content recommendation:** Netflix, YouTube, and Spotify are good at "people who watched this also watched that." They're bad at understanding whether you actually want to watch something or just need background noise.

Each of these systems is narrow in a way that's easy to miss until it causes a problem. If you're building with AI or evaluating AI claims, the first question to ask is: what exactly was this trained on, and how far does the task stray from that training?

See [Lesson 1](https://johnb.io/course/what-is-ai) for more on the basics of what AI actually is and how it differs from general intelligence.

## General AI: Theoretical and Nowhere Close

General AI, or AGI (Artificial General Intelligence), is the thing that keeps researchers and venture capitalists awake. It would be a system that understands any task a human can understand, and can learn and apply knowledge across domains the way humans do.

Ask it to write poetry, fix your car, solve a maths problem, or code an app - it would handle all of these differently but competently. It would transfer learning from one context to another without retraining.

We don't have this. Nobody has this. The confusion arises because ChatGPT looks general - you can ask it about almost anything and get a coherent response. But it's not general. It was trained on almost all human-written text, so it can generate text about almost anything. Generating plausible text about a topic is very different from understanding it or reasoning about it.

The hard problems for AGI aren't solved by more data or bigger models:

**Transfer learning:** Humans learn something and apply it to new contexts automatically. A child who learns what a dog is immediately understands what a wolf is without being taught separately. AI doesn't do this. You have to retrain it.

**Causal reasoning:** Humans understand that X causes Y. AI finds correlations. A system that correlates "wet pavement" with "rain" can't distinguish between rain causing wet pavement and a burst pipe doing the same. Correlation and causation look identical to it.

**Knowing what you don't know:** When you don't know something, you know you don't know it. AI systems don't have this. They [hallucinate](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)) confidently, stating false things as fact because there's no internal uncertainty signal.

**Embodied understanding:** We understand the world through having bodies. We know what "heavy" means because we've lifted things. AI pattern-matches descriptions of physical experience without inhabiting the world those descriptions came from.

## Super AI: Completely Speculative

Artificial Super Intelligence (ASI) would surpass human intelligence across all domains, not just match it. It doesn't exist. There are no working prototypes. It's philosophy more than engineering at this point.

Some researchers think ASI is an inevitable outcome of building better AGI - that once you have a system that can improve itself, it improves rapidly until it's beyond human control or comprehension. Others think it's not achievable. Others think the risks of getting there carelessly are serious enough to warrant significant caution now, even though we're not close.

This is where reasonable, informed people genuinely disagree. The disagreement isn't about facts - it's about which assumptions you hold about things we can't yet test.

## How Far Away Is AGI Actually?

Honest answer: nobody knows. Anyone claiming certainty is selling something.

The optimists point to recent progress. Five years ago, GPT-3 seemed like a step change. Today it looks like a preview of something bigger. But the field has been "20 years away" from AGI for 70 years. Every capability that seemed essential for AGI becomes "well, that's not really intelligence" once we build something that does it. The goalposts move.

The pessimists point out diminishing returns on scaling. Bigger models with more data get better at their narrow task. But scaling hasn't clearly solved transfer learning, causal reasoning, or embodied understanding. It's not obvious those problems yield to more compute.

My read: narrow AI will get significantly more capable over the next five years. AGI is not arriving this decade. Anyone confident otherwise is guessing, and they have financial reasons to guess optimistically.

What matters for practical purposes: every AI system you'll interact with today is narrow. Treat it that way. Don't expect it to generalise. Check its outputs. Understand what it was trained for. That's not pessimism - it's how you actually use these tools well.

## How It Works

1. **Step.** Narrow AI systems are built by defining a specific task, collecting data relevant to that task, and training a model to perform it. The model learns statistical patterns from the training data and applies those patterns to new inputs. It has no awareness of anything outside what it was trained on.
2. **Step.** AGI would require a fundamentally different architecture - one that can represent knowledge in a way that transfers between domains, reason about cause and effect rather than correlation, and model its own uncertainty. None of these exist in a reliable, general form. Current large language models appear general because they were trained on text from almost every domain humans write about, but they're still pattern matching within a single task: generating the next likely token.
3. **Step.** The hierarchy from narrow to general to super AI isn't just about scale. It requires qualitative changes in how systems represent and reason about the world - changes that more data and compute alone haven't produced.

## Key Points

- All AI systems in existence today are narrow AI - they solve one specific problem and can't generalise
- Superhuman performance at a task doesn't make an AI general - AlphaGo beats every human at Go but can't play chess
- AGI remains theoretical. No organisation has built or demonstrated it
- The core unsolved problems for AGI are transfer learning, causal reasoning, embodied understanding, and calibrated uncertainty
- LLMs appear general because they were trained on human text from every domain - but they're still doing one task: predicting the next token
- ASI (superintelligence) is further speculative still - some think it follows from AGI, others think it's a separate and harder challenge
- AGI timelines have been "20 years away" for 70 years. Treat any specific prediction with scepticism

## Frequently Asked Questions

### What is narrow AI and can you give an example?

Narrow AI is any AI system built to solve one specific problem. Every AI in existence today is narrow. ChatGPT generates text but can't drive a car. AlphaGo plays Go at superhuman level but can't play chess. A spam filter classifies emails but can't diagnose disease. The narrow nature of these systems is a feature, not a limitation to fix - it's what makes them reliable and deployable.

### What is artificial general intelligence (AGI)?

AGI is a theoretical AI system that could understand and perform any intellectual task a human can, applying knowledge flexibly across domains. It would transfer learning from one context to another, reason about unknowns, and adapt without retraining. We don't have AGI. No organisation has demonstrated it. The core problems - transfer learning, causal reasoning, embodied understanding - remain unsolved.

### What is the difference between AGI and superintelligence?

AGI means matching human-level general intelligence across domains. Superintelligence, or ASI, means surpassing human intelligence across all domains by a significant margin. AGI is a theoretical milestone we haven't reached. Superintelligence is further still - some researchers think it would follow quickly from AGI, others think it's a separate challenge. Both are speculative.

### When will AGI be built?

Nobody knows. Credible estimates range from 10 years to never. The field has been 20 years away from AGI for 70 years. Recent progress on large language models is real but doesn't solve the fundamental gaps: transfer learning, causal reasoning, embodied understanding, and knowing when you don't know something. Scaling current approaches hasn't clearly addressed these. Anyone claiming certainty is guessing.

## Sources & Primary References

1. [Artificial General Intelligence - Wikipedia](https://en.wikipedia.org/wiki/Artificial_general_intelligence) - overview of AGI definitions and the state of research
2. [AlphaGo - DeepMind](https://deepmind.google/research/breakthroughs/alphago/) - DeepMind's account of AlphaGo's development and what it demonstrated
3. [Artificial Superintelligence - Wikipedia](https://en.wikipedia.org/wiki/Artificial_superintelligence) - overview of ASI concepts and the debates around it
4. [Human-level concept learning through probabilistic program induction (Science, 2015)](https://www.science.org/doi/10.1126/science.aab3050) - research on the gap between human and machine learning flexibility
5. [GPT-4 Technical Report - OpenAI](https://openai.com/research/gpt-4) - OpenAI's published research on a leading narrow AI language model

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
