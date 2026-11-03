# Prompt Improver

> Rewrites weak AI prompts into stronger versions with a short change log using Claude Haiku 5.5, plus a starter library for common tasks across ChatGPT, Claude and Gemini.

- **Canonical URL**: https://johnb.io/prompt-improver
- **Markdown URL**: https://johnb.io/prompt-improver.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: April 2026

## What Makes a Good AI Prompt

Most bad outputs from ChatGPT, Claude or Gemini trace back to a bad prompt. The model can only work with what you give it. Four elements do most of the heavy lifting: a clear role, a specific task, relevant context, and an output format. Miss any one of them and the model has to guess.

This tool looks at what you pasted, fills in the missing pieces, and returns a rewrite you can use directly. It also tells you what changed so you learn the pattern rather than just copying output.

## How It Works

1. **Paste your prompt.** Drop in whatever you are currently using. It can be a one-liner or a full paragraph.
2. **Pick a target model.** Leave it on Any LLM for a model-agnostic rewrite, or pick a specific one for tuned output.
3. **Choose a style.** Balanced, Concise, Detailed or Creative. This controls how much structure the rewrite adds.
4. **Click Improve.** The tool rewrites the prompt and returns a change log so you can see why each edit was made.
5. **Copy and use it.** Paste the improved prompt into your AI tool of choice and compare the output to what you were getting before.

## Key Points

- **Role.** Tell the model who it should act as. "You are an experienced SEO copywriter" gives a different answer to "You are a technical reviewer".
- **Task.** State the job plainly. Not "help me with this" but "rewrite this product page to target the keyword X".
- **Context.** Give the model the information it needs to do the job. Audience, tone, constraints, examples.
- **Format.** Specify the output shape. Bullet points, JSON, a table, word count. If you do not, you get whatever the model defaults to.
- **Examples beat instructions.** One good example of the output you want is worth more than three paragraphs of guidance.
- **Iterate.** Treat prompts as drafts. Run the output, note what is wrong, edit the prompt, run it again.

## Frequently Asked Questions

### What does the Prompt Improver do?

It takes a weak or vague prompt and rewrites it into a stronger version. The output includes the rewritten prompt and a short list of what changed, so you can understand the reasoning and apply the same pattern next time.

### Which AI models does the improved prompt work with?

The output is model-agnostic. It works for ChatGPT, Claude, Gemini, Perplexity and any other large language model. You can pick a target model in the settings if you want the rewrite tuned for a specific platform.

### What makes a prompt strong?

A strong prompt has a clear role for the model, a specific task, any relevant context or constraints, and an explicit output format. Weak prompts miss one or more of these. The tool fills in the gaps based on what you pasted.

### Is there a library of example prompts?

Yes. The Library tab includes starter prompts for common tasks like summarising an article, writing cold outreach emails, code review, SEO content briefs and meeting notes. Click any card to load it into the improver.

### Does the tool store my prompts?

No. Prompts are sent to a Cloudflare Worker that forwards them to an AI model and returns the rewrite. Nothing is logged beyond standard rate limit counters.

## Sources & Primary References

1. [Anthropic - Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
2. [OpenAI - Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
3. [Google - Gemini Prompting Guide](https://ai.google.dev/gemini-api/docs/prompting-intro)
4. [Prompt Engineering Guide](https://www.promptingguide.ai) - community maintained reference.
5. [LLM Chat](https://johnb.io/lm-chat) - run the same prompt across Claude, ChatGPT and Gemini.
