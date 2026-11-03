# Search & Prompt Radar

> Free keyword and prompt research tool that pulls live autocomplete suggestions from Google Search and YouTube, Reddit search intent, recent Hacker News threads and LinkedIn B2B modifiers, then synthesises likely ChatGPT, Perplexity and Claude prompts using Claude Haiku 5.5.

- **Canonical URL**: https://johnb.io/search-radar
- **Markdown URL**: https://johnb.io/search-radar.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: October 2026

> **Disclosure:** AI assistant prompts shown in Search & Prompt Radar are not taken from ChatGPT logs (no AI platform publishes prompt logs); they are synthesised by Claude Haiku 5.5 from live Google, YouTube, Reddit and Hacker News search demand.

## Autocomplete Is the Most Honest Free Demand Signal

Google, YouTube and Reddit only suggest a phrase when enough real people type it. That makes autocomplete the most honest free signal of demand you can get. Paid keyword tools estimate volume from samples and clickstream panels. Autocomplete shows you the actual wording, including the awkward questions nobody would put in a content brief. If you're writing for [FAQ schema](https://johnb.io/faq-schema) or an [llms.txt file](https://johnb.io/llms-generator), that wording is what you want.

The AI prompts card is different, and I'd rather say so up front. No AI platform publishes its prompt logs: not OpenAI, not Anthropic, not Google. So those prompts are synthesised, not scraped. An AI model reads the real search data collected here and writes the prompts people are most likely asking ChatGPT, Claude or Perplexity about the same topic. If that step fails, you get rule-based prompts instead and the badge says so. Use them to shape AEO and GEO content, and don't report them to anyone as measured demand.

## How It Works

1. **Enter a seed.** A product, tool, problem or topic between 2 and 80 characters, such as n8n automation.
2. **Pick a region.** UK, US or Global. It changes the country hint sent to Google and YouTube.
3. **Scan.** The tool queries Google autocomplete, YouTube autocomplete and Hacker News in parallel, then shows which platforms answered and which didn't.
4. **Synthesise prompts.** The collected terms go to an AI model, which writes likely assistant prompts and groups the terms into intent clusters. If that step fails you get rule-based prompts, labelled as such.
5. **Filter and copy.** Narrow the results to Questions, Comparisons or Tutorials, and click any term, prompt or hook to copy it.
6. **Export.** Copy everything as Markdown to paste into an LLM, or download a CSV for a spreadsheet. The page URL updates too, so you can share the scan.

## Key Points

- **Autocomplete reflects real typing.** A suggestion only appears when enough people search the phrase, so it's evidence of demand rather than a model's guess.
- **Questions are your FAQ and PAA targets.** The question group in the Google card is the closest free proxy for People Also Ask boxes. Answer them in 40 to 60 words directly under the heading.
- **Comparisons signal buying intent.** People searching "vs" and "alternative" are close to a decision. These pages convert better than broad explainers.
- **Tutorial searches show what people want shown, not told.** If a YouTube query has thin results, a written guide with screenshots can take that traffic too.
- **Discussion threads give you the frustrated wording.** Hacker News and Reddit thread titles often make better H2s than anything a keyword tool suggests, because they're how people describe the problem.
- **AI prompts are estimates.** They're built from the search data, not from AI platform logs. Good for shaping AEO and GEO content, wrong for reporting demand. Run them through the [Prompt Improver](https://johnb.io/prompt-improver) if you want to test them yourself.

## Frequently Asked Questions

### Is Search & Prompt Radar free?

Yes. It's free and there's no sign-up. Each IP address gets 20 fresh scans a day, and repeating a scan that's already cached doesn't count towards that limit.

### Where does the data come from?

Google and YouTube autocomplete suggestions for your seed, Reddit search suggestions from Google, and Hacker News threads from the last 12 months. The LinkedIn card turns that demand into B2B angles, and the AI prompts card is synthesised from all of it. A repeat scan of the same seed can return a cached copy rather than fresh data.

### Are the ChatGPT prompts real?

They're not taken from ChatGPT. No AI platform publishes its prompt logs, so the prompts are synthesised from the real Google, YouTube, Reddit and Hacker News data the tool collects. Treat them as a reasoned estimate of what people ask AI assistants, grouped by Discovery, Comparison and Implementation intent.

### Why does the tool show Hacker News threads instead of Reddit threads?

Reddit now blocks anonymous access to its search data, so live Reddit threads can't be fetched without an approved API account. The tool still shows what people search for on Reddit, taken from Google autocomplete, and links straight to Reddit search. Live threads come from Hacker News, which works best for tech, AI and startup topics.

### Can I export the results?

Yes. Copy all for LLM copies every result as clean Markdown you can paste into ChatGPT, Claude or a content brief. Export CSV downloads a file with platform, category and term columns that opens in Excel or Google Sheets. You can also click any single term to copy it.

### What does the region setting change?

It sets the country Google and YouTube use for their suggestions, so UK returns British phrasing and spelling while US returns American queries. Global drops the country hint altogether. Hacker News is one site worldwide, so its threads don't change between regions.

## Sources & Primary References

1. [Google Search Help - How Google autocomplete predictions work](https://support.google.com/websearch/answer/7368877)
2. [YouTube - How YouTube search works](https://www.youtube.com/howyoutubeworks/product-features/search/)
3. [Reddit Help - Reddit Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki)
4. [Algolia - Hacker News Search API](https://hn.algolia.com/api)
5. [Anthropic - Claude documentation](https://docs.anthropic.com)
