# What Is AI? History, Definitions and the Turing Test

> Covers AI history from the 1950s Dartmouth Workshop, Alan Turing's 1950 test, AI winters, and why modern AI is pattern matching at scale.

- **Canonical URL**: https://johnb.io/course/what-is-ai
- **Markdown URL**: https://johnb.io/course/what-is-ai.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 1
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

The question sounds simple until you realise nobody in the field can fully agree on an answer. That's not because we're bad at definitions - it's because AI keeps becoming different things as it evolves. Here's what it actually is right now.

The question "what is artificial intelligence?" sounds simple until you realise that nobody in the field can agree on an answer. That's not because we're bad at definitions - it's because AI keeps becoming different things as it evolves.

## The Real History (Not the Textbook Version)

Most AI courses start in the 1950s at Dartmouth when researchers got excited about the possibility of machine intelligence. But the actual origin story is messier. People were trying to build thinking machines since the 1930s, and mathematicians like [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing) were asking whether machines could think while working on encrypted messages during World War II.

What matters is that from the 1950s through the 1980s, AI had these distinct periods. Early on, people thought human-level intelligence was maybe 20 years away. Every 20 years, the timeline reset to "another 20 years." This wasn't stupidity - it was optimism meeting hard problems.

Then the field went through "AI winters" where funding dried up because the technology didn't deliver what people promised. These winters happened because companies and governments invested billions expecting human-like robots that could reason about anything. What they got instead was narrow tools that were good at specific jobs. The disappointment was mutual.

## What AI Actually Is (Right Now)

Here's what I think is honest: AI is software designed to handle tasks that typically require human judgment or pattern recognition. It learns from data rather than following step-by-step instructions you write.

That's it. That's genuinely it.

The thing people get wrong is assuming AI is thinking or conscious or smart in some general sense. A chess engine that beats every human on Earth isn't smart about weather, cooking, or friendship. An image recognition system that identifies diseases in X-rays can't tell you why your code is broken.

Most AI today is "narrow" - it solves one specific problem. It's remarkably good at that one problem, often better than humans, but it's hopeless at anything else. See [Unit 1 Lesson 2](https://johnb.io/course/categories-of-ai) for a full breakdown of narrow vs general AI.

## The Turing Test: Still Overrated, But Not for the Reasons You Think

[Alan Turing](https://www.google.com/search?q=turing+test) posed a test in 1950: if a machine can fool you into thinking you're talking to a human, does it matter whether it's "actually" thinking?

The test itself is elegant. A human judge has written conversations with either a human or a machine, and has to guess which is which. If the machine wins often enough, Turing said, we can't justify saying it's not intelligent.

For decades, this was treated like the ultimate arbiter. Researchers chased it like a holy grail. In 2014, a chatbot (Eugene Goostman) kind of passed it - or at least, it fooled enough judges in one particular tournament. The internet proclaimed victory. Everyone else rolled their eyes.

Here's why I think the Turing Test is actually a bad measure: it's testing deception, not intelligence. A machine could pass the Turing Test by being incredibly good at mimicking human conversation patterns - which modern [large language models](https://johnb.io/course/ai-tools-platforms-2026) kind of do - while knowing nothing about the world. It could tell you convincingly false information because it learned from text where humans said false things.

The real problem is we don't know what we're even testing for. When we say "think," do we mean reasoning? Consciousness? Adaptability? The Turing Test punts on this. It basically says "if you can't tell it's not human, it's intelligent." But Eliza, a 1960s chatbot, could partially fool people just by reflecting their statements back at them. Was that intelligence? Not really.

What matters more than the Turing Test is whether a system can do what you need it to do, whether it can explain itself, and whether it's reliable.

## What AI Can and Can't Do

This is crucial because it separates reality from hype.

AI is genuinely good at: finding patterns in huge amounts of data, getting better at specific tasks through practice, doing things faster than humans, and sometimes doing things better than humans in narrow domains.

AI is genuinely bad at: reasoning about things it hasn't seen before, handling situations that require understanding context from the real world, explaining why it made a decision in a way that makes sense to humans, and knowing when it doesn't know something.

That last one matters. An AI system will confidently give you wrong information. It doesn't have doubt. It doesn't know when it's hallucinating. That's not a flaw we'll fix with more data - it's closer to a core feature of how these systems work. The [lesson on hallucinations and bias](https://johnb.io/course/ai-hallucinations-bias-ip) covers this in depth.

## The Definition That Actually Sticks

AI is pattern matching at scale, trained on examples, applied to new situations. It works when the patterns it learned match the new situation. It fails when they don't, often without warning you it's failing.

Everything else - consciousness, understanding, genuine intelligence - is philosophy we layer on top. Some of that matters for ethics and safety. Some of it's just us trying to make sense of something that doesn't think the way we do.

## How It Works

1. **AI systems learn by processing large amounts of training data.** A supervised learning model sees thousands of labelled examples - emails marked as spam or not spam, images labelled as cats or dogs - and adjusts its internal parameters to minimise prediction errors.
2. **During training, gradient descent reduces errors.** An optimisation algorithm called [gradient descent](https://johnb.io/course/linear-regression-gradient-descent) repeatedly checks how wrong the model's predictions are and adjusts internal weights to reduce that error. Once trained, the model applies the patterns it learned to new, unseen examples.
3. **No explicit rules are written - they are inferred from data.** This is both the strength of AI (it can find patterns humans wouldn't think to code) and its weakness (it can find patterns that are spurious or harmful).

## Key Points

- **AI is pattern matching at scale** - trained on examples, applied to new situations. Not human-like reasoning or consciousness.
- **Every AI system today is narrow AI** - good at one task, unable to generalise across domains.
- **The Turing Test measures deception**, not intelligence, and is now widely regarded as an inadequate benchmark.
- **AI confidently produces false information** because it has no internal fact-checker - it predicts statistically likely outputs.
- **The field went through multiple AI winters** when promises outpaced capability, most recently in the 1980s-1990s.
- **Modern AI became practical around 2012** with the availability of GPU computing power and large labelled datasets.

## Frequently Asked Questions

### What is the simplest definition of artificial intelligence?

AI is software designed to handle tasks that typically require human judgment or pattern recognition. It learns from data rather than following step-by-step instructions written by a programmer. Most AI today is narrow - it solves one specific problem at a time and does not generalise across domains.

### When was artificial intelligence invented?

The field was formally founded at the Dartmouth Conference in 1956, though the underlying ideas predate this. Alan Turing proposed his test for machine intelligence in 1950, and researchers were attempting to build thinking machines from the 1930s onwards. The field went through several AI winters before the current deep learning era began around 2012.

### What is the Turing Test and has any AI passed it?

The Turing Test, proposed by Alan Turing in 1950, checks whether a machine can convince a human judge it is human through written conversation. In 2014, a chatbot called Eugene Goostman claimed to pass a version of the test, though this is disputed. Modern large language models perform well on conversational tasks, but the test is now widely considered a flawed measure of intelligence because it tests deception rather than genuine understanding.

### Why do AI systems produce false information confidently?

AI systems, particularly large language models, predict the next likely word or token based on patterns in training data. There is no internal fact-checking mechanism running in parallel. When a system generates text about a topic, it produces what is statistically plausible given its training, not what is verified as true. This is why AI can confidently state things that are completely false.

## Sources & Primary References

1. [Alan Turing, "Computing Machinery and Intelligence" (1950)](https://www.cs.ox.ac.uk/activities/ieg/e-library/sources/t_article.pdf) - the original Turing Test paper
2. [The Dartmouth Workshop (1956)](https://en.wikipedia.org/wiki/Dartmouth_workshop) - where AI was formally named as a field
3. [AI Winters](https://en.wikipedia.org/wiki/AI_winter) - Wikipedia overview of funding collapses in AI research
4. [Claude by Anthropic](https://www.anthropic.com/claude) - an example of a modern large language model
5. [ChatGPT by OpenAI](https://openai.com/chatgpt) - the most widely used LLM application

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
