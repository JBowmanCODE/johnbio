# Prompt Engineering and AI Agents

> System prompts, few-shot examples, structured outputs, tool calling and autonomous multi-step AI agent loops.

- **Canonical URL**: https://johnb.io/course/prompt-engineering-ai-agents
- **Markdown URL**: https://johnb.io/course/prompt-engineering-ai-agents.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 7 · Generative AI & Practical Applications
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 10 min read

Prompt engineering isn't wizardry. It's not about magic words or secret incantations that unlock hidden powers in language models. It's about being specific about what you want and structuring your request in ways the model can actually handle.

Prompt engineering isn't wizardry. It's not about magic words or secret incantations that unlock hidden powers in language models. It's about being specific about what you want and structuring your request in ways the model can actually handle.

Most people get this wrong. They treat prompts like wishes to a genie - vague, full of unstated assumptions, expecting the model to read their mind. Then they're surprised when the output is mediocre.

## What prompt engineering actually is

Prompt engineering is writing instructions that get you what you want from a language model. That's all.

When you write "Write me an article," the model has to guess. Article about what? How long? Formal or casual? For what audience? The model will make assumptions, most of them wrong. The [generative AI models](https://johnb.io/course/generative-ai-models) lesson explains why models behave this way.

When you write "Write a 400-word article about machine learning for someone who's never programmed, aimed at business executives, explaining why they should care," you've narrowed down the space of valid outputs dramatically. The model still has choices, but it knows what you're actually asking for.

This isn't creativity or magic. It's being specific.

## Techniques that actually work

**Chain of thought.** Ask the model to think step by step instead of jumping to conclusions. "What are the steps to solve this problem?" gets better results than "Solve this problem." [OpenAI's prompt engineering guide](https://platform.openai.com/docs/guides/prompt-engineering) has good worked examples of this technique. The model writes out reasoning, which both helps it arrive at the right answer and lets you see where the thinking goes wrong.

**Few-shot examples.** Show the model examples of what you want. If you need a specific format or tone, give it two or three examples and ask for a new one in the same style. Models are good at learning from examples - better than from abstract descriptions.

**Role prompting.** Tell the model to adopt a perspective. "You're a senior software engineer reviewing this code" or "You're a product manager thinking about customer impact" changes how it approaches a problem. This works because the model has learned what different roles typically care about and how they communicate.

These aren't tricks. They work because they align with how the model processes language. When you show examples, you're giving it a pattern to follow. When you ask it to think step by step, you're asking it to generate reasoning tokens, which helps with complex problems. When you define a role, you're activating patterns associated with that perspective.

## What AI agents actually are

An AI agent is a model that can take actions, not just generate text. It can call functions, read from databases, search the web, run code. It can plan a sequence of steps and execute them. Understanding the underlying model helps - see the [transformers lesson](https://johnb.io/course/rnns-transformers-autoencoders) for how these language models work.

This is different from a chatbot. A chatbot generates text responses. An agent generates text that includes decisions about what to do next.

The mechanism is usually simple. The model outputs text that includes function calls. Something like: "I need to search for current stock prices. Let me use the search function. [SEARCH: AAPL stock price]. The result is..." The system intercepts the function call, executes it, and feeds the result back into the model's context.

Why this matters: an agent can correct itself. If it tries something and it doesn't work, it can try a different approach. It can break a complex task into steps and verify each one before continuing.

## Tool use and multi-step reasoning

Tool use is the agent calling a function. But what's interesting is when and how it decides to use tools.

A capable agent decides "I need external information here" and calls a search function, gets results, incorporates them. It decides "This calculation requires precision" and uses a calculator tool. The agent reasons about what it doesn't know and what tools can help.

Multi-step reasoning is the agent planning. "To answer this question I need to: 1) Find the current exchange rate, 2) Look up the historical price, 3) Calculate the difference." Then it executes those steps, handling failures along the way.

Current models are reasonably good at this - not perfect, they get confused and sometimes use tools unnecessarily. But they can handle multi-step problems that would have required manual coordination between different systems.

## Will "prompt engineer" survive as a job title?

Probably not, and that's fine.

Right now "prompt engineer" is a job because prompting matters and most people are bad at it. In six months or a year, that may change. Models will get better at understanding vague requests. The [AI tools and platforms](https://johnb.io/course/ai-tools-platforms-2026) lesson shows what's actually available today. Tools will guide people toward better prompts. The skills may become table stakes - something everyone who works with AI does, not a specialised role.

That doesn't mean the skills disappear. Writing clear specifications, thinking through what you actually want, breaking problems into steps - those matter more than ever. But they'll probably be part of every knowledge job rather than their own specialty.

There's a real chance I'm wrong about this. Maybe prompting becomes more important as models become more powerful. Maybe understanding how to shape behaviour through prompts becomes deep enough expertise that it warrants its own role. My intuition is that the craft survives but the title doesn't last. I'd bet on that, but not at long odds. Prompting connects to wider enterprise use through [RAG and fine-tuning](https://johnb.io/course/rag-finetuning-enterprise-ai), which is where most business value actually comes from. Also worth reading on potential downsides: the [hallucinations and bias](https://johnb.io/course/ai-hallucinations-bias-ip) lesson.

## How It Works

1. **Zero-shot prompting:.** Give the task with no examples. Works for simple, well-defined tasks where the model has strong priors from training.
2. **Few-shot prompting:.** Include 2-5 examples of input-output pairs before the actual query. The model learns the pattern from the examples and applies it. Most effective when the format or style is hard to describe in words.
3. **Chain-of-thought:.** Add "think step by step" or include examples that show intermediate reasoning. The model generates reasoning tokens before the final answer, which substantially improves accuracy on multi-step problems.
4. **System prompts:.** A system-level instruction that sets the context for the whole conversation - defining the model's role, constraints, and behaviour. Separate from the user prompt in most modern APIs.
5. **AI agents (tool use):.** The model is given a list of available functions and their schemas. When it decides a function is needed, it outputs a structured function call. The surrounding system executes the call, returns the result, and continues the conversation. This loop continues until the task is complete.

## Key Points

- Prompt engineering is about specificity - vague prompts produce vague outputs
- Chain-of-thought prompting improves accuracy on complex problems by generating intermediate reasoning
- Few-shot examples are often more effective than detailed text descriptions of the required format
- Role prompting works because models have learned how different roles communicate and reason
- An AI agent differs from a chatbot by being able to take actions, not just generate text
- Tool use works via function calls: the model outputs a call, the system executes it, the result feeds back in
- Agents can handle multi-step tasks and correct themselves when steps fail
- Prompt engineering as a job title is probably temporary; the underlying skills are not

## Frequently Asked Questions

### What is prompt engineering?

Prompt engineering is writing instructions that get you what you want from a language model. It's not magic - it's being specific about what you're asking for. The more precisely you describe the task, format, audience, and constraints, the more the model can narrow down to a useful output.

### What is chain-of-thought prompting?

Chain-of-thought prompting asks the model to write out its reasoning step by step before giving a final answer. This works because generating reasoning tokens helps the model work through complex problems rather than jumping to a conclusion. It also makes the reasoning visible so you can see where the model goes wrong.

### What is an AI agent?

An AI agent is a language model that can take actions, not just generate text. It can call functions, search the web, run code, read databases, and plan multi-step sequences. A chatbot responds; an agent acts. The mechanism is usually the model outputting structured function calls that a surrounding system intercepts and executes.

### Will prompt engineering survive as a job title?

Probably not long-term. The skills matter - writing clear specifications, breaking problems into steps, understanding what you actually want - but these will likely become standard parts of working with AI rather than a standalone role. The craft survives; the job title probably doesn't.

## Sources & Primary References

1. Wei, J. et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. *NeurIPS*.
2. Brown, T. et al. (2020). Language Models are Few-Shot Learners (GPT-3). *NeurIPS*.
3. Schick, T. et al. (2023). Toolformer: Language Models Can Teach Themselves to Use Tools. *arXiv*.
4. OpenAI. (2023). Function Calling Documentation. *platform.openai.com*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
