# AI Models in 2026: What Actually Changed in the Last 12 Months

> A sourced review of AI progress from August 2025 to August 2026 covering Anthropic's Claude Opus 5 and Sonnet 5.5, OpenAI's GPT-5.6 and the Sora shutdown, Google Gemini 3, open-weight models, and the METR developer productivity trial.

- **Canonical URL**: https://johnb.io/news/ai-models-2026
- **Markdown URL**: https://johnb.io/news/ai-models-2026.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Published**: 2026-08-17
- **Last Updated**: 2026-08-18
- **Read Time**: 10 min read

Twelve months, four labs, and more model releases than anyone can reasonably track. Here is what actually shifted between August 2025 and August 2026, and what the evidence says about whether it worked.

On 30 September 2025 OpenAI launched Sora 2 and a standalone video app. It passed a million downloads in under five days and briefly topped the US App Store. Seven months later OpenAI switched it off.

That arc tells you more about the past twelve months than any leaderboard. The consumer spectacle phase of AI ended, quietly, while almost everyone was still arguing about benchmark scores.

## Why did OpenAI shut down Sora?

OpenAI announced Sora's closure on 24 March 2026. The web and app experiences ended on 26 April 2026, and the API follows on 24 September 2026. The reason was money: reporting put Sora's running cost at roughly **$1 million a day against an estimated $2.1 million in in-app purchases across its whole life**.

The rights fight is usually told the wrong way round, and it was really two fights. Sora launched with **opt-in consent for real people's faces and voices**, through a verification step called Cameo, but **opt-out for copyrighted characters**, so studios had to object after their work had already been generated. The Motion Picture Association pushed back and Sam Altman reversed the copyright policy to opt-in on 3 October 2025. The separate row, after Bryan Cranston's likeness got generated anyway, ended in a joint statement with SAG-AFTRA on 20 October confirming likeness had been opt-in all along and promising better enforcement. That was a guardrails fix, not a policy change.

All of it was settled before Disney came near it. Disney signed on 11 December 2025, licensing more than 200 characters for three years and agreeing to put **$1 billion of equity into OpenAI**, with talent likenesses and voices explicitly excluded from the deal. When OpenAI killed Sora in March 2026, Disney walked within days. Reuters reported the transaction never closed and no money changed hands.

Sora was not an isolated retreat. ChatGPT Atlas, the AI-native browser OpenAI launched on 21 October 2025, shut down on 9 August 2026, exactly 292 days later, having never shipped beyond macOS. Its browser agent features were folded back into ChatGPT and Codex. Sora's compute went to coding and enterprise work too.

So here is my read on the year, and it is the argument the rest of this piece defends: the interesting story of 2026 is not that models got smarter. It is that the industry stopped selling wonder and started selling work, and got a lot cheaper doing it.

## How many AI models launched in the past year?

Too many to be meaningful, which is itself the point. Anthropic alone shipped Claude Opus 4.1, Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.6, Sonnet 4.6, Opus 4.7, Opus 4.8, a new Fable 5 and Mythos 5 tier, Sonnet 5 and Opus 5 between August 2025 and July 2026. OpenAI went from GPT-5 on 7 August 2025 to the GPT-5.6 family on 9 July 2026, passing through 5.1, 5.2, 5.3, 5.4 and 5.5. Google launched Gemini 3 on 18 November 2025 and reached Gemini 3.7 Flash by 13 August 2026.

A **frontier model** is the most capable general-purpose model a lab has released, usually also its most expensive to run.

Version numbers have stopped carrying information, and the size of the increment tells you nothing about the size of the change. Going from Claude Opus 4.1 to 4.5 cut prices by two thirds. The smaller step from 4.5 to 4.6 added a million-token context window. Meanwhile GPT-5's headline feature in August 2025 was removing the model picker entirely and auto-routing between fast and reasoning modes, which is a product decision dressed as a version bump. If you are choosing a model, the number tells you almost nothing. Price, context window and independent benchmarks tell you something.

Two releases genuinely broke pattern. Anthropic introduced a tier above Opus on 9 June 2026 with Claude Fable 5 and Mythos 5, the latter restricted to approved organisations. Three days later the US government applied export controls, and because Anthropic could not verify user nationality in real time it suspended access for everyone, worldwide. The controls were lifted on 30 June 2026 and the models came back globally the next day. A frontier model being pulled worldwide for geopolitical reasons was new. Expect more of it.

## What happened to AI prices in 2026?

They fell hard in the middle of the range, which is a more interesting story than a clean collapse. Anthropic cut Claude Opus from $15 per million input tokens to $5 with the Opus 4.5 release on 24 November 2025, roughly a two-thirds reduction, and has held that price through every Opus release since. Claude Sonnet 5 arrived at $2. That was launch pricing due to expire, but Anthropic cancelled the planned rise on 10 August 2026 and made it permanent. DeepSeek cut its API prices by more than half in September 2025 after introducing a sparse attention method.

Two things complicate the cheerful version. Google's $0.75 for Gemini 3.7 Flash is promotional, running to 31 December 2026 and doubling on 1 January, and Flash is a workhorse tier competing with Claude Haiku rather than anything Opus-class, so quoting it against a flagship price flatters the trend. More importantly, **the top of the range moved the other way**: Claude Fable 5 launched on 9 June 2026 at $10 per million input tokens, double Opus, with no introductory discount. If you want the most capable model available, you now pay more than you did for the best model of November 2025.

So the honest version is narrower than "AI got cheap". Mid-tier and workhorse capability got dramatically cheaper, and a task that was uneconomic to automate in mid-2025 often became trivially cheap by mid-2026 without the model getting much better. Frontier capability did not. If you shelved an AI idea last year on cost grounds, the maths has probably changed underneath you, as long as the job did not need the very best model.

1. 5 August 2025 OpenAI returns to open weights gpt-oss-120b and gpt-oss-20b ship under Apache 2.0, its first open release since GPT-2 in 2019.
2. 7 August 2025 GPT-5 removes the model picker One system auto-routes between fast answers and deeper reasoning instead of asking users to choose.
3. 30 September 2025 Sora 2 and the Sora app launch A million downloads in under five days, briefly the top free app in the US.
4. 18 November 2025 Gemini 3 arrives with Antigravity A new flagship, a million-token context window and an agent-first developer platform, all on one day.
5. 24 November 2025 Claude Opus 4.5 cuts prices by two thirds Flagship input pricing drops from 15 dollars per million tokens to 5.
6. 1 December 2025 OpenAI declares a "Code Red" An internal memo reprioritises core model quality after Gemini 3 beat GPT-5.1 on several benchmarks.
7. 5 February 2026 A million-token context window Claude Opus 4.6 ships long context in beta; it reaches general availability at standard pricing in March.
8. 26 April 2026 Sora shuts down Announced a month earlier. The API follows on 24 September 2026.
9. 9 June 2026 A tier above Opus Claude Fable 5 and Mythos 5 launch at double the Opus price. Export controls pull them worldwide three days later, until 1 July.
10. 9 August 2026 ChatGPT Atlas shuts down The AI browser closes 292 days after launch, its agent features folded back into ChatGPT and Codex.
11. 11 August 2026 Gemini passes a billion users Google's 14th product to reach a billion monthly users, and the default assistant on Android from September.

## What changed in AI coding?

Coding is where the money went, and where the evidence gets genuinely uncomfortable. Every lab now ships a coding agent alongside its base model: OpenAI's Codex line tracked each GPT-5 point release, Google launched Antigravity beside Gemini 3 in November 2025 and upgraded it to 2.0 at I/O in May 2026, and Anthropic's [Claude Code and its VS Code extension](https://johnb.io/news/claude-code-vsc) became a product line in its own right.

**Agentic coding** is software development where an AI model plans and carries out multi-step work by itself, running commands and editing files, rather than suggesting single line completions.

The benchmark story looks like straightforward progress. SWE-bench Verified, which measures resolving real GitHub issues, went from 62.3% for Claude 3.7 Sonnet in February 2025, to 74.9% for GPT-5 that August, to 80.9% for Claude Opus 4.5 in November. By August 2026 the leaders sit above 96%. Read that in isolation and software engineering looks solved.

Then you notice that OpenAI stopped using it. On 23 February 2026 it published a post titled "Why SWE-bench Verified no longer measures frontier coding capabilities", calling the dataset **"increasingly contaminated"** and reporting that when it audited a 27.6% slice of the problems models kept failing, at least 59.4% of them had broken test cases that reject correct answers. The 96% figures sit on a benchmark one of its heaviest users has publicly walked away from.

The harder benchmark tells a different story. Scale AI published SWE-bench Pro on 19 September 2025 using larger, enterprise-scale tasks. At launch the best models managed about 23% on the public set, and on the private commercial set Claude Opus 4.1 dropped to 17.8% and GPT-5 to 14.9%. Those numbers have moved a long way since. On Scale's own leaderboard in August 2026, Meta's Muse Spark 1.1 leads the public set at 61.5% and the commercial set at 51.5%, with Claude Opus 4.6 at 47.1%, close enough that Scale's confidence intervals rank the two jointly first. Roughly triple in eleven months, so the gap is genuinely closing.

Comparisons need care, though, because the boards do not run the same test scaffold. Scale's figures come from a neutral one. On vendor-run scaffolds the same benchmark reports Claude Mythos 5 at 80.3%. Pick whichever you like and the number still lands well below the Verified scores the same labs advertise. **Any headline claiming AI has solved software engineering is quoting the easy benchmark, and quite possibly a broken one.**

Then there is the study nobody in the industry enjoys citing. METR ran a proper randomised controlled trial, published 10 July 2025, with 16 experienced open-source developers across 246 real tasks in their own mature repositories. **Developers took 19% longer to complete tasks when they were allowed to use AI tools.** They had forecast a 24% speed-up beforehand. Afterwards, they still believed they had been about 20% faster. The perception and the stopwatch pointed in opposite directions.

I have gone back and forth on how much weight that study carries. It is one trial, on experienced developers, in codebases they already knew intimately, using early-2025 tooling that is now several generations old. Those are real limitations. But it remains the only rigorous randomised evidence we have, and everything since has been surveys asking people how fast they feel.

Those surveys are not reassuring either. Google's DORA 2025 report, published 23 September 2025 from nearly 5,000 respondents, found 90% using AI at work and over 80% believing it made them more productive, while 30% reported little or no trust in the code it produced. DORA's own framing is that AI amplifies whatever your organisation already is: teams with loosely coupled architecture and fast feedback benefit, teams with tangled legacy systems mostly do not. Stack Overflow's 2025 survey of roughly 49,000 developers found 84% using or planning to use AI tools, up from 76% a year earlier, and 51% of professional developers using them every day, while distrust of accuracy rose from 31% to 46% and 45% said debugging AI-generated code takes longer than debugging human code.

And yet. Anthropic told Fortune in January 2026 that between 70% and 90% of its own code is now written by Claude, with the Claude Code team itself at around 90%. Sundar Pichai has put Google's figure at 75% of new code, up from about 30% a year earlier. Both things are true at once: the labs building these tools have restructured their engineering around them, and the one controlled trial we have found experienced developers slowing down. I do not think that contradiction is resolved, and I would treat anyone who tells you it is with suspicion.

One quieter change matters more than any benchmark. Anthropic donated the Model Context Protocol, the standard for connecting models to tools and data, to a new Agentic AI Foundation under the Linux Foundation in December 2025, co-founding it with Block and OpenAI, with Google, Microsoft, AWS, Cloudflare and Bloomberg joining as platinum members. Rival labs agreeing on plumbing is how a category stops being a demo.

## What happened to AI video and image models?

Sora's collapse was not the whole video story. Google shipped Veo 3.1 on 15 October 2025 with generated audio and editing tools inside Flow, and Kuaishou's Kling went from 2.5 Turbo in September 2025 to a unified text, image, audio and video model in February 2026. The technology kept improving while the most famous consumer product built on it died, which says something about business models rather than capability.

Image generation went the other way and got genuinely useful. Google's Gemini 2.5 Flash Image, nicknamed Nano Banana, launched on 26 August 2025 and reportedly drove more than 23 million new Gemini users in a fortnight. Nano Banana Pro followed on 20 November 2025 with 4K output, text rendering that actually holds together, and the ability to blend many source images while keeping faces consistent. OpenAI shipped GPT Image 2 in April 2026.

Provenance quietly became infrastructure. Google's SynthID watermarking passed 100 billion items by May 2026, and OpenAI, Kakao and ElevenLabs signed up at Google I/O that month, joining Nvidia which had adopted it the year before. Adobe made C2PA Content Credentials mandatory across Firefly's generative workflows in early 2026, so every generated image carries a tamper-evident record of how it was made. Two years ago detection was a research problem. It is now a default setting.

## Did open-source AI catch up?

Mostly yes, and the leadership changed hands. TechCrunch reported on 14 July 2026 that Chinese open-weight models made up about 41% of Hugging Face downloads, overtaking US models. Hugging Face's own State of Open Models report, published 14 August 2026, put Qwen's downloads for the year at about 2.05 billion, against 418 million for Google and 227 million for Meta. Alibaba separately told Bloomberg it had passed 3 billion downloads in six months, which is a vendor claim rather than an independent count, and Hugging Face's figures are not deduplicated by user, so automated build traffic inflates both.

DeepSeek kept shipping without much fanfare, moving from V3.2-Exp in September 2025 through V3.2 in December to the V4 line during 2026. It also published something unusual in Nature on 19 September 2025: the final reinforcement learning run for R1 cost $294,000, though that figure excludes the roughly $5.6 million base model pretraining underneath it. Precise public training costs from a frontier lab are rare enough to be worth noting.

The strategic reversals were more interesting than the models. OpenAI released gpt-oss-120b and gpt-oss-20b under Apache 2.0 on 5 August 2025, its first open weights since GPT-2 in 2019, two days before GPT-5. Meta went the opposite way, launching its Muse Spark flagship as fully proprietary in April 2026, then releasing the 30-billion-parameter Muse Glimmer under Apache 2.0 on 10 August 2026 to keep a foot in the open camp. Open weights stopped being an ideology and became a product decision.

## Is any of this actually working?

This is where I would be careful, because the spending and the adoption data have not converged. Combined 2026 capital spending guidance from Google, Amazon, Microsoft and Meta reached roughly $725 billion, up about 77% on the previous year. In June 2026 something between $1.3 and $1.4 trillion came off AI semiconductor stocks, with Nvidia losing close to $330 billion on 5 June alone after weak guidance from Broadcom. Analysts mostly called it a valuation reset rather than a bust, and the capex guidance kept climbing through it.

Actual usage is more modest than the spending implies. The US Census Bureau's business survey, published 26 May 2026, put current AI use among American businesses at **17 to 20%**, rising to 37% for firms with 250 or more employees. That is a broad measure of any use at all in the previous fortnight, not depth or return. The much-quoted MIT NANDA finding from August 2025 that about 95% of enterprise generative AI pilots showed no profit and loss impact is worth knowing, though its methodology was reported inconsistently and critics have questioned the data, so treat the exact number as contested rather than settled. Gartner separately predicted in June 2025 that more than 40% of agentic AI projects would be cancelled by the end of 2027.

Against all that, capability measurement points the other way. METR's updated time-horizon research from 29 January 2026 found the length of task a model can complete reliably is doubling roughly every 89 days since 2024, faster than the longer-run trend, with the researchers themselves noting wide confidence intervals. Nobody has produced good evidence of a wall.

Which brings me back to Sora. It did not die because AI video failed. It died because a spectacular consumer product could not cover its own compute bill while an unglamorous coding assistant could. That is the year in one sentence, and it is why the price cuts matter more than the version numbers.

## What to watch in the next six months

Three dates are already fixed. Sora's API shuts down on 24 September 2026, closing the chapter properly. Google replaces Assistant with Gemini on Android from 4 September 2026, moving a frontier model onto several billion devices by default. And the EU AI Act's high-risk obligations, which were due this month, were deferred to 2 December 2027 by the Digital Omnibus that came into force on 27 July 2026. What did land on 2 August was the Article 50 transparency duties and the existing general-purpose model obligations, alongside an expansion of the AI Office's supervisory powers rather than a simple switch-on.

The thing I would actually watch is whether anyone publishes a second rigorous trial on developer productivity. We have had twelve months of model releases and one randomised controlled trial, and the trial disagreed with the marketing. If the terminology here is new, my [free AI and machine learning course](https://johnb.io/course/) works up from neural networks to LLMs and RAG, and if you are wondering how any of this affects being found online, the [practical guide to generative engine optimisation](https://johnb.io/news/geo-generative-engine-optimisation) covers that side.

## How It Works

1. **The Sora shutdown and what it signalled.** OpenAI launched its AI video app on 30 September 2025 and closed it on 26 April 2026, alongside retiring the ChatGPT Atlas browser in August 2026. The article treats these as the clearest evidence of the industry's move away from consumer spectacle.
2. **The model release flood and why version numbers stopped meaning anything.** A full accounting of what Anthropic, OpenAI and Google shipped between August 2025 and August 2026, including Anthropic's new Fable 5 and Mythos 5 tier and the export-control episode that briefly pulled it worldwide.
3. **The price picture, which is not a simple collapse.** Claude Opus fell by roughly two thirds in November 2025 and Sonnet 5 settled at 2 dollars per million input tokens, but Claude Fable 5 arrived at double the Opus price and Gemini Flash's 75 cent rate is promotional, so mid-tier capability got cheap while frontier capability did not.
4. **What actually happened in AI coding.** The SWE-bench Verified progression from 62.3% to above 96%, OpenAI's February 2026 finding that the benchmark is contaminated, the far lower SWE-bench Pro scores, and the METR randomised controlled trial that found experienced developers 19% slower with AI tools.
5. **Video, image and provenance.** Veo 3.1, Kling, Nano Banana and Nano Banana Pro, GPT Image 2, plus SynthID watermarking and Adobe's mandatory C2PA Content Credentials.
6. **Open weights and the sceptical case.** Chinese models reaching about 41% of Hugging Face downloads, OpenAI's return to open weights with gpt-oss, and the gap between roughly 725 billion dollars of capital spending and 17 to 20% actual business adoption.

## Key Points

- **The year's defining event was a shutdown, not a launch.** Sora went from a million downloads in five days to switched off in seven months because it cost about 1 million dollars a day and earned roughly 2.1 million dollars in total.
- **Model version numbers are marketing, not measurement.** The step from Claude Opus 4.1 to 4.5 cut prices by two thirds; the smaller step to 4.6 added a million-token context window. Judge models on price, context and independent benchmarks instead.
- **Prices fell in the middle of the range, not at the top.** Claude Opus dropped from 15 dollars to 5 dollars per million input tokens and Sonnet 5 settled at 2 dollars, but Claude Fable 5 launched at 10 dollars, double Opus, so frontier capability got more expensive.
- **The benchmark everyone quotes is broken.** OpenAI stopped evaluating on SWE-bench Verified in February 2026, calling it contaminated after finding most audited problems had test cases that reject correct answers. On the harder SWE-bench Pro, leading models score around half their Verified numbers.
- **The only randomised trial on developer productivity found a 19% slowdown.** METR's July 2025 study also found developers believed they had been sped up by 20%, which is the gap between perception and measurement worth remembering.
- **Chinese labs now lead open weights.** Chinese open-weight models reached about 41% of Hugging Face downloads by July 2026, and Bloomberg put Alibaba's Qwen family alone above half of all open-source downloads by mid-August.
- **Spending and adoption have not converged.** Roughly 725 billion dollars of 2026 hyperscaler capital spending sits against US Census figures showing 17 to 20% of American businesses using AI at all.

## Frequently Asked Questions

### What was the biggest change in AI in the past 12 months?

The money moved from consumer products to work tools. OpenAI shut down Sora, its viral AI video app, on 26 April 2026 and retired the ChatGPT Atlas browser on 9 August 2026, while pouring resources into coding agents and enterprise products. No single capability jump defined the year. The shift in where the compute went did.

### Which AI model is the best in 2026?

There is no honest single answer, because the leading models from Anthropic, OpenAI and Google now sit within a few benchmark points of each other and swap places every few weeks. Anthropic released Claude Opus 5 on 24 July 2026, OpenAI released the GPT-5.6 family on 9 July 2026, and Google reached Gemini 3.7 Flash on 13 August 2026. Pick on price, context window and how well the model fits your specific task rather than on leaderboard position.

### Did AI models get cheaper in 2026?

Mid-range and workhorse models did. Frontier models did not. Anthropic cut Claude Opus from 15 dollars per million input tokens to 5 dollars with the Opus 4.5 release on 24 November 2025 and has held that price since, and Claude Sonnet 5 launched at 2 dollars, a rate Anthropic made permanent on 10 August 2026. Google's 75 cent rate for Gemini 3.7 Flash is promotional until 31 December 2026. But Claude Fable 5 launched in June 2026 at 10 dollars per million input tokens, double Opus, so the top of the range went up.

### Does AI actually make developers faster?

The best evidence available says not always, and sometimes the opposite. METR ran a randomised controlled trial published on 10 July 2025 with 16 experienced open-source developers working on 246 real tasks in their own mature repositories. Developers took 19 percent longer to finish tasks when allowed to use AI tools, despite predicting beforehand they would be 24 percent faster and believing afterwards they had been sped up by about 20 percent.

### Are open-source AI models catching up with closed models?

They have closed much of the gap, and Chinese labs now lead the open-weight field. TechCrunch reported on 14 July 2026 that Chinese open-weight models accounted for about 41 percent of Hugging Face downloads, overtaking US models, and by mid-August 2026 Bloomberg put Alibaba's Qwen family alone above half of all open-source model downloads. Open models still trail the closed frontier on capability, but the gap now matters less than cost and self-hosting control for many teams.

### Why did OpenAI shut down Sora?

Sora could not pay for itself. Reporting put its running cost at roughly 1 million dollars a day against an estimated 2.1 million dollars in in-app purchases across its whole life. OpenAI announced the closure on 24 March 2026 and kept Sora going only as internal world-models research. Disney, which had signed a three-year character licensing deal in December 2025 alongside a 1 billion dollar equity investment in OpenAI, exited within days. Reuters reported that the transaction never closed and no money changed hands.

### Is the AI boom a bubble?

The evidence points both ways and has not resolved. Combined 2026 capital spending guidance from Google, Amazon, Microsoft and Meta reached roughly 725 billion dollars, up about 77 percent year on year, while roughly 1.4 trillion dollars was wiped off AI semiconductor stocks in a June 2026 selloff. US Census Bureau data from May 2026 put actual AI use among American businesses at only 17 to 20 percent. Spending and scepticism rose at the same time.

## Sources & Primary References

1. [OpenAI - What to know about the Sora discontinuation](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) - Help.OpenAI.com. Accessed August 2026.
2. [OpenAI - Evolving Atlas into ChatGPT for browser-based agentic work](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work) - Help.OpenAI.com. Accessed August 2026.
3. [METR - Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) - METR.org. 10 July 2025.
4. [METR - Time Horizon 1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1/) - METR.org. 29 January 2026.
5. [Anthropic - Introducing Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5) - Anthropic.com. 24 November 2025.
6. [Anthropic - Model pricing](https://platform.claude.com/docs/en/about-claude/pricing) - Platform.Claude.com. Accessed August 2026.
7. [Anthropic - Claude 3.7 Sonnet (standard-scaffold SWE-bench Verified score)](https://www.anthropic.com/news/claude-3-7-sonnet) - Anthropic.com. 24 February 2025.
8. [The Walt Disney Company - Disney and OpenAI Sora agreement](https://thewaltdisneycompany.com/news/disney-openai-sora-agreement/) - TheWaltDisneyCompany.com. 11 December 2025.
9. [Scale AI - SWE-bench Pro leaderboards](https://labs.scale.com/leaderboard/swe_bench_pro_private) - Labs.Scale.com. Accessed August 2026.
10. [Stack Overflow - 2025 Developer Survey, AI section](https://survey.stackoverflow.co/2025/ai) - Survey.StackOverflow.co. 2025.
11. [Google - Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) - AI.Google.dev. Accessed August 2026.
12. [Anthropic - Redeploying Claude Fable 5 and Mythos 5](https://www.anthropic.com/news/redeploying-fable-5) - Anthropic.com. 30 June 2026.
13. [Google - A new era of intelligence with Gemini 3](https://blog.google/products-and-platforms/products/gemini/gemini-3/) - Blog.Google. 18 November 2025.
14. [Scale AI - SWE-bench Pro](https://scale.com/blog/swe-bench-pro) - Scale.com. 19 September 2025.
15. [OpenAI - Why SWE-bench Verified no longer measures frontier coding capabilities](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) - OpenAI.com. 23 February 2026.
16. [SAG-AFTRA, OpenAI and Bryan Cranston - joint statement on Sora 2 voice and likeness protections](https://www.sagaftra.org/sag-aftra-openai-bryan-cranston-collaborate-ensure-voice-and-likeness-protections-sora-2) - SAGAFTRA.org. 20 October 2025.
17. [Sam Altman - Sora update #1 (opt-in for rightsholders)](https://blog.samaltman.com/sora-update-number-1) - Blog.SamAltman.com. 3 October 2025.
18. [Hugging Face - State of Open Models, Summer 2026](https://huggingface.co/blog/state-of-open-models-summer-2026) - HuggingFace.co. 14 August 2026.
19. [Anthropic - Donating the Model Context Protocol and establishing the Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) - Anthropic.com. December 2025.
20. [Google Cloud - Announcing the 2025 DORA Report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) - Cloud.Google.com. 23 September 2025.
21. [US Census Bureau - AI Use by Businesses](https://www.census.gov/library/stories/2026/05/ai-use-businesses.html) - Census.gov. 26 May 2026.
22. [TechCrunch - The real AI race may no longer be at the frontier](https://techcrunch.com/2026/07/14/the-real-ai-race-may-no-longer-be-at-the-frontier-open-models-hugging-face/) - TechCrunch.com. 14 July 2026.
23. [Hugging Face - Welcome GPT OSS, the new open-source model family from OpenAI](https://huggingface.co/blog/welcome-openai-gpt-oss) - HuggingFace.co. 5 August 2025.
24. [Gartner - Over 40% of Agentic AI Projects Will Be Canceled by End of 2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) - Gartner.com. 25 June 2025.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
