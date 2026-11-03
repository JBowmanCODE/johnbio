# LLM Chat

> Side-by-side chat interface comparing Anthropic Claude, OpenAI GPT and Google Gemini responses to the same prompt in real time.

- **Canonical URL**: https://johnb.io/lm-chat
- **Markdown URL**: https://johnb.io/lm-chat.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: March 2026

LLM Chat runs three AI models side by side - [Claude Sonnet by Anthropic](https://www.anthropic.com/claude), [GPT-4o-mini by OpenAI](https://openai.com/gpt-4o-mini), and [Gemini 2.5 Flash Lite by Google](https://deepmind.google/technologies/gemini/flash/). You can chat with each model individually or use the broadcast bar to send the same prompt to all three simultaneously and compare the responses in real time. It is useful for evaluating which model handles a specific task best, stress-testing prompts across providers, or simply exploring how different models approach the same question.

Each model maintains its own conversation history within the session, so you can have multi-turn conversations with each one independently. Prompts are routed securely through a [Cloudflare Worker](https://workers.cloudflare.com) proxy to the respective provider APIs. Your messages are subject to the privacy policies of each provider: [Anthropic](https://www.anthropic.com/legal/privacy), [OpenAI](https://openai.com/policies/privacy-policy), and [Google](https://policies.google.com/privacy). Do not include sensitive personal information in your prompts.

## How It Works

1. **Chat with one model.** Type a message in the input box under any of the three panels (Claude, OpenAI, Gemini) and press Enter or the send button. The model responds in that panel. Each panel maintains its own conversation thread, so you can continue a multi-turn dialogue with any one model independently.
2. **Broadcast to all three.** Type a prompt in the broadcast bar at the top and click Send to All. The same message is sent to all three models simultaneously and responses appear side by side, making it easy to compare how each model handles the same prompt.
3. **Compare responses.** Look across the three panels to see differences in tone, accuracy, length and reasoning. This is particularly useful for tasks like summarisation, creative writing, code generation or answering complex questions where model behaviour varies noticeably.
4. **Continue the conversation.** After a broadcast, you can follow up with each model individually. Each panel remembers its own prior turns, so you can dig deeper into a specific model's response without affecting the others.
5. **Clear and reset.** Use the delete button in the broadcast bar to clear all three conversations and start fresh.

## Key Points

- **Three leading models, one interface.** Claude Sonnet 4.6 (Anthropic), GPT-4o-mini (OpenAI) and Gemini 2.5 Flash Lite (Google) - all in a single view. No switching between tabs or platforms.
- **Broadcast mode saves time.** Send the same prompt to all three models at once and see responses arrive in parallel. Useful for prompt engineering, benchmarking or demos.
- **Multi-turn conversations supported.** Each panel maintains full conversation history for the session, so you can have extended back-and-forth exchanges rather than one-shot queries.
- **Routed via a secure proxy.** API keys are never exposed in the browser. All requests go through a Cloudflare Worker, keeping credentials server-side.
- **Good for prompt engineering and model evaluation.** If you are developing prompts for a production system and need to decide which model to use, this tool gives you a quick side-by-side view without writing any code.

## Frequently Asked Questions

### Which AI models are used?

The tool connects to three models: `claude-sonnet-5-5` by [Anthropic](https://www.anthropic.com), `gpt-4o-mini` by [OpenAI](https://openai.com), and `gemini-2.5-flash-lite` by [Google DeepMind](https://deepmind.google). These are current production models as of August 2026.

### Are my messages stored?

Conversation history exists only in your browser for the current session and is cleared when you close the tab. Prompts are forwarded to each provider's API - they are subject to the respective privacy policies of [Anthropic](https://www.anthropic.com/legal/privacy), [OpenAI](https://openai.com/policies/privacy-policy) and [Google](https://policies.google.com/privacy). JohnB.io does not log or retain your messages.

### Why use GPT-4o-mini rather than GPT-4o?

GPT-4o-mini is a cost-efficient model that performs well for most conversational and reasoning tasks, making it a practical choice for a free comparison tool. For tasks requiring maximum capability from OpenAI, GPT-4o or GPT-o1 would be more appropriate - but those are better evaluated via [ChatGPT](https://chat.openai.com) directly.

### Can I use this to decide which model to use for my project?

Yes - this is one of the best use cases. Run your specific prompts through all three models and compare quality, speed and tone. Keep in mind that model performance varies by task type: coding, creative writing, factual Q&A and structured reasoning can produce noticeably different results across providers.

### Is there a usage limit?

There is no hard limit on the tool itself, but the underlying APIs have rate limits managed at the Cloudflare Worker level. If you hit a limit, wait a moment and try again. For high-volume testing, the best approach is to access the provider APIs directly with your own keys.

## Sources & Primary References

1. [Anthropic - Claude model overview](https://www.anthropic.com/claude) - Anthropic.com. Accessed March 2026.
2. [OpenAI - GPT-4o-mini overview](https://openai.com/gpt-4o-mini) - OpenAI.com. Accessed March 2026.
3. [Google DeepMind - Gemini Flash overview](https://deepmind.google/technologies/gemini/flash/) - DeepMind.google. Accessed March 2026.
4. [Cloudflare Workers - Serverless execution environment](https://workers.cloudflare.com) - Cloudflare.com. Accessed March 2026.
5. [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy) - OpenAI.com. Accessed March 2026.
