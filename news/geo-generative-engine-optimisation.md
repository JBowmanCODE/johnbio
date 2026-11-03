# GEO: A Practical Guide to Generative Engine Optimisation in 2026

> Explains what Generative Engine Optimisation (GEO) is, how it differs from traditional SEO, what AI retrieval systems extract, whether llms.txt works, and practical steps to earn citations in ChatGPT, Perplexity and Google AI Overviews.

- **Canonical URL**: https://johnb.io/news/geo-generative-engine-optimisation
- **Markdown URL**: https://johnb.io/news/geo-generative-engine-optimisation.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Published**: 2026-04-13
- **Last Updated**: 2026-08-18
- **Read Time**: 7 min read

Google still sends traffic. But for more and more queries, an AI system answers before anyone clicks. Getting your content into those answers is what GEO is about.

Search hasn't died. But it has changed. A growing share of queries now get answered inline. Google AI Overviews, Perplexity, ChatGPT. The user types a question, gets a structured response with cited sources, and may not click anything.

If your site is one of those cited sources, you get brand exposure, and some of those users will visit. If your site isn't cited despite being relevant, you're invisible to that particular conversation.

**Generative engine optimisation (GEO)** is the set of practices aimed at getting your content into those AI-generated responses. It doesn't replace SEO. It sits on top of it.

## What is GEO?

**Generative engine optimisation (GEO)** is the practice of structuring content so that AI-powered search engines and assistants cite, reference, or summarise it accurately when answering relevant queries.

The term borrows from SEO but the mechanism is different. Traditional SEO works on ranking algorithms: backlinks, keyword relevance, and page speed push pages up or down in results. GEO works on retrieval and attribution — whether an AI model, when generating an answer, treats your content as a credible source and includes it.

The systems GEO targets are those using retrieval-augmented generation (RAG): Google AI Overviews, Perplexity, ChatGPT with browsing, Microsoft Copilot, Claude with web access. They search the web (or a structured index), pull relevant passages, and synthesise a response. Your content is evaluated as raw material for that synthesis.

## How does GEO differ from SEO?

SEO optimises for position. GEO optimises for citation.

A page that ranks first on Google gets traffic when someone clicks on it. A page that gets cited in an AI Overview may not get clicked at all. The answer is delivered inline. But being cited still does something: it builds brand recognition, establishes topical authority, and drives direct traffic from people who want more than the summary.

The content practices overlap heavily. Authoritative, specific, well-structured writing that ranks well tends to get cited well too. But GEO has a sharper emphasis on a few things SEO doesn't care about as much:

- Extractability: can a single paragraph stand alone as a complete answer to a question?
- Directness: does the answer appear immediately after the question, or buried three paragraphs in?
- Named entities: specific companies, regulations, dates, and people rather than vague references
- Self-containment: does each section make sense without reading the rest of the article?

A passage that requires surrounding context to make sense is harder for an AI to cite usefully. A passage that answers a specific question in 50 words is ideal retrieval material.

## What do AI systems actually look for?

No AI company has published a full list of GEO ranking factors. That transparency doesn't exist yet. But from how retrieval systems work and from patterns in what gets cited, a few things are clear.

**Question-formatted headings help.** H2 headings written as direct questions match the format of the queries being asked. "What is RAG in AI?" is more useful for retrieval than "RAG Overview." If RAG is unfamiliar, my course lesson on [RAG and fine-tuning](https://johnb.io/course/rag-finetuning-enterprise-ai) explains it in plain English.

**Immediate answers after headings help.** The first sentence after a heading should answer the heading's question. AI systems pulling a passage for a response will often take the heading and the first 1-3 sentences.

**Specific numbers and facts help.** "It reduced editing time by half" reads as a real data point. "It offers many benefits" is useless to a retrieval system.

**Schema markup helps.** FAQPage, Article, HowTo and other structured data types make it easier for systems to understand what type of content they're looking at. Google's own documentation confirms that structured data is used to improve AI Overviews.

**Authority signals help.** Backlinks, mentions in other authoritative sources, and consistent citation by other AI responses all reinforce a source's credibility in retrieval systems. This mirrors link authority in SEO.

A [2024 Princeton NLP paper](https://arxiv.org/abs/2311.09735) that coined the term GEO tested nine content optimisation strategies across 10,000 simulated queries. Adding statistics, citing authoritative sources, and incorporating expert quotes produced the most consistent citation rate improvements — in some test conditions by over 30% compared to unoptimised content. Fluency improvements and keyword stuffing had no meaningful effect.

## What is llms.txt and does it actually work?

An [llms.txt file](https://johnb.io/llms-generator) sits at your website root (yourdomain.com/llms.txt) and provides a structured, AI-readable overview of what your site contains. It was proposed by Jeremy Howard (fast.ai) in September 2024 and is now supported by Cloudflare, which auto-generates it for sites on its platform.

AI tools with web access can read it during retrieval. It doesn't guarantee citations, but it does two useful things: it tells AI systems which pages are most important on your site, and it reduces the chance of a model misrepresenting what you do by citing an outdated or peripheral page.

For a site with a lot of pages covering similar topics, like a tool directory or a course with 35 lessons, an llms.txt file is particularly useful. It acts as a structured index, giving AI systems a direct path to the most authoritative content rather than having them work it out from crawl data alone.

You can generate one for your own site using the [LLMs.txt Generator](https://johnb.io/llms-generator) here.

## Does GEO replace SEO?

No. Google Search still accounts for the majority of web traffic for most sites. Traditional SEO remains the foundation: keyword research, quality content, backlinks, page speed, technical hygiene.

But the goalposts have shifted. AI Overviews have reduced organic clicks for many informational queries. As more searches get answered inline, ranking first matters less if the answer is given before the results. The relevant question for some query types is no longer "does my page rank?" It's "does my page get cited?"

Keep doing SEO. Add GEO as a layer on top. The incremental work is manageable: restructuring content for extractability, adding schema markup, creating an llms.txt file. It overlaps with existing good content practice.

## Can you control what AI cites?

GEO is partly opaque. Unlike SEO, where ranking factors are at least extensively theorised even if not confirmed, AI citation decisions aren't documented. You can follow best practices and still not get cited. You can do nothing and get cited anyway because your content is genuinely the best source for a query. I've lived that gap between reach and control before: my [88 million AI music streams](https://johnb.io/news/ai-music-88-million-views) came from algorithms surfacing tracks I never promoted once.

What consistently shows up in cited content: specificity, authority, clear structure, and standalone paragraph clarity. Those aren't GEO-specific traits. They're just good writing and good technical practice applied more deliberately.

If your content is already strong and your site is technically solid, GEO is mostly about reorganising for extractability rather than rebuilding from scratch. Start with schema markup and an llms.txt file. Those are the highest-impact, lowest-effort changes. Then audit your key pages for direct question-answer structure.

## How It Works

1. **Audit your key pages for extractability.** Read each important page and ask: can any individual paragraph stand alone as a complete answer to a question? If not, restructure the content so it can.
2. **Rewrite headings as questions.** "What is GEO?" is more useful for AI retrieval than "GEO Overview." This also improves traditional SEO for voice search and featured snippets.
3. **Add schema markup.** Add FAQPage JSON-LD to pages with Q&A content. Add Article schema to blog posts. Add SoftwareApplication schema to tools. Google uses structured data to inform AI Overviews.
4. **Create an llms.txt file.** Place a structured plain-text overview of your site at yourdomain.com/llms.txt. Use the [LLMs.txt Generator](https://johnb.io/llms-generator) to create one from your existing content.
5. **Build authority signals.** Get cited by other sites. Earn backlinks from authoritative sources. Maintain consistent brand presence across relevant topics. Authority in SEO and authority for AI retrieval overlap heavily.

## Key Points

- **GEO optimises for citation, not ranking.** The goal is to appear in AI-generated answers, not just in ranked search results. These overlap but are not the same.
- **Extractability is the core principle.** Content that answers a specific question in a standalone paragraph is more likely to be pulled into AI responses than content that requires surrounding context.
- **Schema markup is the highest-leverage technical fix.** FAQPage and Article JSON-LD are specifically used by Google to inform AI Overviews. Add them to key pages if they aren't already there.
- **llms.txt is low effort with measurable upside.** It doesn't guarantee citations but gives AI systems a structured index of your site. Generate one for free using the [LLMs.txt Generator](https://johnb.io/llms-generator).
- **GEO doesn't replace SEO.** Traditional SEO still drives the majority of traffic. GEO is an additive layer, not a pivot. Quality, authority, and structure serve both.
- **AI citation decisions are partly opaque.** There are no confirmed GEO ranking factors equivalent to Google's documented signals. Follow best practices, but don't expect precise control over what gets cited.

## Frequently Asked Questions

### What is GEO (generative engine optimisation)?

GEO stands for generative engine optimisation. It is the practice of structuring content so that AI-powered search engines and assistants — such as ChatGPT, Perplexity, and Google AI Overviews — cite, reference, or summarise it when answering relevant queries. Unlike traditional SEO, which focuses on search ranking, GEO focuses on AI citation and retrieval.

### How is GEO different from SEO?

SEO optimises for position in search results. GEO optimises for citation in AI-generated answers. Traditional SEO drives traffic when users click a ranked result. GEO-optimised content gets referenced in AI responses. The content practices overlap significantly, but GEO places extra emphasis on extractability, directness, and standalone paragraph clarity.

### Does GEO replace SEO?

No. Traditional SEO still drives the majority of web traffic for most sites. GEO is an additional layer, not a replacement. The two share a lot of ground but GEO adds focus on content extractability and AI legibility that standard SEO practice doesn't cover.

### What is llms.txt and does it help with GEO?

llms.txt is a plain text file at the root of a website (e.g. yourdomain.com/llms.txt) that provides a structured overview of the site's content for AI systems. AI tools with web access can read it during retrieval. It doesn't guarantee citations, but it helps AI systems understand your site structure and reduces the risk of misrepresentation. You can generate one using the [LLMs.txt Generator](https://johnb.io/llms-generator).

### Which AI systems does GEO target?

GEO primarily targets AI-powered search tools that retrieve web content when answering queries: Google AI Overviews, Perplexity AI, ChatGPT with web browsing, Microsoft Copilot, and Claude with web access. These systems use retrieval-augmented generation (RAG) — pulling passages from the web to inform their responses — which is why content extractability and structure matter.

## Sources & Primary References

1. [llmstxt.org](https://llmstxt.org) - the llms.txt specification by Jeremy Howard. Accessed April 2026.
2. [Google — AI Overviews documentation](https://developers.google.com/search/docs/appearance/ai-overviews) - Google Search Central. Accessed April 2026.
3. [Perplexity AI](https://www.perplexity.ai) - retrieval-augmented AI search engine. Accessed April 2026.
4. [Cloudflare — llms.txt support documentation](https://developers.cloudflare.com/llms-txt/) - Cloudflare Developers. Accessed April 2026.
5. [GEO: Generative Engine Optimization (arXiv paper)](https://arxiv.org/abs/2311.09735) - Princeton NLP Group. 2024.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
