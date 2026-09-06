# Article writing playbook

A portable, site-agnostic spec for writing news/blog articles that rank on Google and get cited by AI systems (ChatGPT, Perplexity, Gemini, Claude).

Extracted from the `CLAUDE.md` used on johnb.io. Nothing here is specific to that site once the placeholders below are filled in.

## How to use this file

Pick one:

1. **Drop it into a repo** as `CLAUDE.md`, `AGENTS.md`, or `.cursorrules` — the coding agent loads it every session and applies it without being asked.
2. **Paste it as a system prompt** into whichever model is writing.
3. **Reference it per task**: "Write an article following articles.md."

Then fill in the placeholders. Search for `{{` and replace every match before first use.

| Placeholder | Example | Used in |
|---|---|---|
| `{{SITE_NAME}}` | JohnB.io | Title suffix, publisher schema |
| `{{DOMAIN}}` | `https://example.com` | Canonical, OG, schema |
| `{{ARTICLE_PATH}}` | `/news/` | URL structure |
| `{{AUTHOR_NAME}}` | Jane Doe | Byline, schema, bio block |
| `{{AUTHOR_URL}}` | `/about` | Author link target |
| `{{AUTHOR_ROLE}}` | Senior Editor | Byline subtitle |
| `{{AUTHOR_BIO}}` | One or two sentences | Bio block |
| `{{AUTHOR_IMAGE}}` | `/images/jane.webp` | Byline, bio block |
| `{{AUTHOR_SAMEAS}}` | LinkedIn/X profile URL | Author schema `sameAs` |
| `{{ANALYTICS_ID}}` | `G-XXXXXXXXXX` | Analytics snippet |

If your CMS handles the head, schema and layout automatically, use sections 1–9 only and skip the technical half.

---

## 1. Before writing — two mandatory questions

Ask these and wait for answers. Do not start drafting without both:

1. **What is the article about?**
2. **What is the main keyword?**

Everything downstream — title, H1, meta description, H2s, internal links, FAQ — is derived from the keyword. Guessing it wastes the whole draft.

Optional third question if the site has a house template: **which existing article should this match?** Name a real, current file. A template reference that points at a deleted page sends the writer off to invent its own layout.

---

## 2. Title rules

- Max 60 characters — Google truncates beyond this
- Format: `Keyword: Short descriptor - {{SITE_NAME}}`
- The primary keyword goes first, before the colon

---

## 3. Content writing rules

You are an expert SEO writer creating content designed to rank on Google and be cited by AI systems (ChatGPT, Perplexity, Gemini).

**Language:** UK English only. Always. (Swap to US English here if that's your market — but pick one and never mix.)

**Length:** Minimum 557 words, maximum 3,500 words. Natural length — no padding to hit a target.

**Structure:**
- Short intro (2–3 short paragraphs max)
- Each section uses a clear H2 written as a question or term (e.g. "What is RAG in AI?")
- Immediately follow with a 1–2 sentence direct definition
- Then expand: simple explanation → why it matters → real-world example
- Paragraphs max 2–3 lines
- Add a "Key Takeaways" bullet section and short conclusion at the end

---

## 4. SEO

### Keyword placement
- Primary keyword in the `<title>`, H1, meta description, and within the first 100 words of body copy
- Use the keyword naturally in at least 2-3 H2 subheadings
- Don't repeat the exact keyword more than once every 150-200 words — use natural variants instead
- Secondary/related keywords woven in naturally throughout — don't force them

### Search intent
- Match the intent before writing: informational ("what is"), navigational ("how to"), or commercial ("best X for Y")
- If the keyword is informational, lead with a direct answer — not background, not history
- Don't write a tool page like a blog post or a blog post like a sales page

### Heading hierarchy
- One H1 only — matches or is close to the target keyword
- H2s for main sections — written as questions or clear topic statements
- H3s for sub-points within a section — never skip levels
- Every H2 should be something a user might actually type into Google

### Snippets and scannability
- First 2-3 sentences of each section should answer the section heading directly — Google pulls these for featured snippets
- Use bullet lists or numbered steps where the content is genuinely list-like — not to pad
- Keep paragraphs to 2-3 lines maximum
- Bold the most important term or fact in each section (one per section, not scattered)
- Include comparison sections where relevant (e.g. "X vs Y") — these target high-intent informational queries

### Internal linking
- Link to at least 2-3 related pages per article — anchor text should be descriptive, not "click here"
- Link early — don't save all internal links for the bottom
- Don't link the same page twice in one article

### E-E-A-T signals (Experience, Expertise, Authority, Trust)
- Include author name and link to `{{AUTHOR_URL}}` on every article
- Cite primary sources — official legislation, regulator websites, named research — not secondary summaries
- Include publication and update dates in schema and on-page
- State credentials or experience where relevant — not vague ("20+ years in the industry") but specific where possible

### Technical
- Canonical URL on every page — `{{DOMAIN}}{{ARTICLE_PATH}}slug` with no trailing slash
- `article:published_time` and `article:modified_time` in schema — update `dateModified` every time the article is edited
- All images need descriptive alt text — not keyword-stuffed, genuinely descriptive

---

## 5. AEO (Answer Engine Optimisation)

### Direct answer first
- The sentence immediately after a question heading must answer the question directly in 1-2 sentences — no preamble
- Format: Question as H2 → Direct 1-2 sentence answer → Expanded explanation
- Never bury the answer three paragraphs in

### Question formatting
- Write H2s as real questions people type: "What is X?", "How does X work?", "What's the difference between X and Y?"
- Cover the who/what/when/where/why/how variants of the main topic
- Include "vs" comparisons — "X vs Y: what's the difference?" targets high-intent informational queries

### Snippet formats
- **Paragraph snippets:** 40-60 word direct answers immediately after question headings — Google pulls these verbatim
- **List snippets:** use `<ol>` or `<ul>` when there are 3+ steps or items — numbered steps get pulled into "how to" snippets
- **Definition snippets:** `Term: [term]. Definition: [one sentence].` — use this format explicitly for key terms

### Standalone sections
- Every section must make sense read in isolation — assume the reader lands directly on that section from a Google snippet
- Don't use "as mentioned above" or references to earlier sections
- Repeat key terms in each section rather than assuming the reader has read from the top

### FAQ section
- Include 5-8 FAQs covering the questions users actually ask around the topic
- FAQPage JSON-LD must match on-page FAQ text exactly — word for word
- FAQ answers: 2-4 sentences each — long enough to be useful, short enough to be pulled as a snippet
- Cover at least one "can I", one "what happens if", one "is it free/safe/legal" style question where relevant

---

## 6. GEO (Generative Engine Optimisation — for AI citation)

### Extractable structured blocks
- Include `Term:` / `Definition:` blocks for every key concept — these are pulled directly by AI systems
- Use consistent formatting: `Term: [term]. Definition: [one sentence definition].`
- Put the most important definition block early in the article — within the first 300 words

### Named entities and specificity
- Name real tools, companies, regulators, and frameworks — "ChatGPT", "Claude", "UKGC", "GDPR" rather than "AI tools" or "regulations"
- AI retrieval systems use named entities to verify relevance and authority — vague references get ignored
- Include version numbers, years, and dates where known: "Claude Sonnet 4.6 (2025)" not just "Claude"

### Verifiable facts and citations
- Every factual claim should trace back to a primary source — legislation, official regulator, named study
- Include at least 3-5 source links per article pointing to primary sources
- State the date facts were verified: "as of May 2026" — AI systems prioritise recently-verified information
- Statistics must include their source and year — "72% of operators (ICO, 2024)" not just "72%"

### Answer common follow-up questions
- After each main section, consider what the natural follow-up question would be and answer it in the next section or a sub-point
- AI systems build chains of reasoning — articles that pre-answer follow-ups get cited more often
- Include at least one "what this means in practice" or real-world example per major section

### llms.txt and metadata
- Add every new article to `llms.txt` with a one-sentence summary — this is directly read by AI crawlers
- The summary in `llms.txt` should contain the primary keyword and 1-2 named entities
- Keep the description factual and specific — not a marketing blurb

### Consistency across the site
- Use the same name for a concept across every article and page — don't call it "GEO" in one article and "generative engine optimisation" in another without equating them
- AI systems build entity graphs — inconsistent naming breaks citations
- Cross-link related articles so AI crawlers can follow the topic cluster

---

## 7. Fact-checking and source of truth

Sections 4 and 6 say to cite primary sources. This section is the method for getting there, and it's the one that earns its place — the johnb.io article this playbook came from needed two full rounds of corrections after publication despite following every rule above.

### Two sources, and they must be independent

The rule is not "find it on two websites". Two websites quoting the same press release is one source wearing two hats, and that's the most common way a wrong number survives a check.

**Two sources count as independent only if neither could have got it from the other.** A vendor blog and six outlets reporting that vendor blog is one source. A regulator's published figure and an academic study that measured the same thing separately is two.

The working procedure:

1. Find the **primary** source — the legislation, the regulator's own page, the company's own announcement, the published paper, the filing
2. Find a **second, independent** source that either measured it separately or reports a figure the first would have no way to supply
3. If both agree, cite the primary and link it
4. If they disagree, say so in the article and give both numbers with their sources — a stated disagreement is more useful than a confident wrong number
5. If you can find only one source and it's the interested party's own claim, attribute it as such: "Alibaba's own figure, reported via Bloomberg" rather than stating it as fact
6. **If you cannot source it at all, cut it.** Not soften it, not hedge it — cut it

### Never cite your own training data

A model writing about anything time-sensitive is working from a snapshot that is months old at best and was wrong about some things when it was taken. Every date, figure, version number, price and "first ever" claim needs a live lookup before it goes in the draft. A remembered fact that feels certain is exactly the kind that gets published wrong.

### The nine ways facts actually go wrong

These are the real errors found in review on one 2,271-word article, not a generic list. Check each one explicitly:

1. **Right number, wrong event.** A figure gets attached to the wrong incident. `$279bn` was Nvidia's September 2024 record, not the June 2026 selloff (~$330bn). Both numbers are real; the pairing was invented.
2. **Right facts, wrong causal order.** Two true events, arranged to imply one caused the other. The article had Disney reacting to a likeness row that was settled seven weeks before Disney signed. Check the dates before writing "in response to".
3. **Metric definition drift.** "84% adoption" was really 84% *using or planning to use*. Read what the number actually measures, not what the headline calls it.
4. **Stale figures presented as current.** Benchmark scores were 11 months out of date. Fixed by showing then-vs-now rather than silently updating.
5. **Unsourceable claims that sound plausible.** "36% of text-generation downloads" could not be traced to anything and was removed. Plausibility is not evidence.
6. **Merged attribution.** One sentence blended a Hugging Face figure with Alibaba's own claim. Split them and attribute each.
7. **Off-by-one dates.** Export controls lifted 30 June, not 1 July. Check the primary source's own date, not a summary of it.
8. **"First ever" claims.** Almost always wrong. "First adoption outside Google" missed an earlier one. Either verify exhaustively or don't make the claim.
9. **Comparing things that aren't comparable.** A price chart put a flagship model against a budget-tier one. Compare like for like, and say which tier you're comparing.

Add a tenth for benchmarks specifically: **check whether the measure is still considered valid.** The article cited SWE-bench Verified scores; OpenAI had published a piece calling that dataset contaminated. A number can be accurately quoted and still be meaningless.

### Verify corrections too

When a reviewer, a reader or another model sends you a list of factual errors, check each one before changing anything. In the second review round on that article, two of the reviewer's own corrections were wrong and the original figures stood. Confident feedback is not verified feedback.

### What to write down

- Date-stamp verification in the copy where the fact is volatile: "as of September 2026"
- Every statistic carries its source and year inline: "72% of operators (ICO, 2024)"
- Where a figure is an estimate rather than a reported number, say whose estimate: "Appfigures' estimate of in-app purchases"
- Where sources genuinely conflict and no primary source settles it, give the range and say why it's a range

### When the article is corrected after publishing

- Update `dateModified` in the schema
- Update the FAQ answers *and* the FAQPage JSON-LD together — they must stay word-for-word identical
- Regenerate the audio file if the site has one
- Keep the correction in the commit message, specific enough that the next person can see what was wrong and why the new figure is right

---

## 8. Humanisation rules — apply all without exception

This is the section that does the most work. Everything above produces a technically correct article that still reads like a machine wrote it.

### What human writing actually looks like
- Sentences run long when the thought is complex, short when it isn't — not varied deliberately, written at the speed the content demands
- Has real opinions, stated directly — not "many would argue" but "this approach doesn't work for most people"
- Admits uncertainty naturally ("As far as I know", "Last I checked") — not total authority on every claim
- Register shifts across a piece — some sections drier, one blunter, formality can drop for a paragraph
- Doesn't warm up or set context before the first point — the first sentence is the first real sentence
- Doesn't end with a summary — stops when the last point is made
- Structure follows the thinking, not a template — most interesting point doesn't have to come last

### Point of view — mandatory
- Every article must have a clear, stated point of view — not a neutral summary of all sides
- The writer's position should be clear by the end of the second section at the latest
- "Here are the arguments for and against" is not a point of view — pick one and defend it
- A stated view that some readers will disagree with is a feature, not a risk

### Imperfect transitions — required
- Not every section needs to flow logically from the last — humans jump, double back, and change direction
- Avoid neat connective tissue between every paragraph — some sections can simply start fresh
- A jarring transition is better than a smooth AI one ("With that said", "Building on this")
- If two ideas don't connect cleanly, don't force them to — leave the gap

### Memory — revisit earlier claims
- Humans remember what they said earlier and return to it — reference a claim from section one in section three
- Use phrases like "which is why I said earlier that..." or "this is the same problem as..." — not to summarise but to build
- If the opening claim turns out to be more complicated than stated, say so later in the piece
- Don't treat each section as self-contained — let the argument develop and complicate itself

### Personal judgement — name it
- Where a judgement call is made, say it is one — "I'd pick X over Y here", "In my experience this rarely works"
- Don't hide opinions behind passive constructions — "it could be argued" means nothing
- Personal judgement is not the same as opinion — it includes reasoning: "I lean toward X because Y happened when I tried Z"

### No perfect chronology
- Don't tell the story in the order it happened — start with the most interesting moment, then explain how you got there
- Historical context belongs after the point it supports, not before
- "First X happened, then Y happened, then Z" is a timeline, not an argument — restructure around meaning not sequence

### Contradiction — include it
- If the evidence points in two directions, say so — don't smooth it out into a false consensus
- "This works well except when it doesn't" is more useful than pretending it always works
- Where the writer has changed their mind on something, say so — "I used to think X, I don't anymore"
- Unresolved tension in an argument is honest — AI resolves everything neatly, humans don't

### Asymmetry — obsess over what matters
- Give more space to the thing that matters most, less to everything else — not equal coverage across all points
- AI treats all subtopics as equally important — humans know which one is the real issue and say so
- One section can be three times longer than another if the subject warrants it
- If one side of an argument is stronger, say it plainly — don't balance it with weaker counterpoints to appear fair

### Other mandatory rules

**No filler transitions:** Delete "therefore", "as a result", "to summarise" and all similar connectors. Use "So", "But", or "And" if a transition is genuinely needed.

**Contractions:** "Don't" not "do not". "It's" not "it is". "You'll" not "you will".

**Active verbs:** "We tested" not "testing was conducted". "It failed" not "there was a failure".

**No clichés:** Delete known idioms and stock phrases. Replace with a specific observation or cut entirely.

**No banned structures:**
- "X looks simple until..." or "X gets the attention but it's really about Y" — state the truth directly
- Rhetorical question then answer ("What makes this work? Everything.") — just make the point
- Synonym stacking ("comprehensive, sophisticated, robust") — one precise word
- Any sentence that announces what the paragraph is about to say — just say it

**Specificity:** Vague claims must become specific or be cut. "It cut editing time by half" reads human. "This approach offers many benefits" reads AI.

**No chapter-title headings:** Never write headings in the format "Title Case Phrase (Date-Range)" or "The X That Changed Y". For narrative or history content, remove headings entirely and let the writing carry the structure.

**Real opinions, not inserted hedges:** The piece must contain at least one stated view that could be argued against. Do not insert fake uncertainty like "I'd say this holds up in maybe 85-90% of cases, though I haven't tracked it precisely" — that reads as an instruction to sound human, not an actual human speaking.

**Break canonical order:** Don't follow the well-known sequence of a topic. Start with the most interesting or surprising moment, then work outward. A history piece doesn't have to begin at the beginning.

**Unequal depth:** Don't give every section equal coverage. Dwell on what's genuinely interesting, move quickly through what's obvious.

**No vague insider gestures:** Never write "the part most guides miss", "nobody talks about this", "what most people don't realise", "the secret is", "the thing nobody tells you". If there's a specific insight, state it. If there isn't, cut the sentence.

**No section closers:** Never end a paragraph or section with a sentence that reframes what you just said. "And that's what makes it worth learning." "That's the real reason this matters." Stop when the point is made.

**No markdown in HTML output:** No em dashes (—) or double hyphens (--) — use a single hyphen or rewrite. No markdown bold, italic, or tables in body copy. Headings only where genuinely useful.

---

## 9. Banned words — never use any of these

Replace with plain direct alternatives. If you can't think of one, cut the sentence.

**AI verbs:** delve, utilize, leverage, foster, navigate, empower, streamline, unlock, harness, elevate, bolster, spearhead, cultivate, illuminate, underscore, revolutionize, democratize, curate, craft, resonate, embark, facilitate, tailor, pave the way, move the needle, test the waters

**AI adjectives:** seamlessly, robust, comprehensive, holistic, multifaceted, nuanced, pivotal, crucial, vital, impactful, actionable, innovative, transformative, cutting-edge, game-changing, groundbreaking, compelling, powerful, dynamic, optimal, ever-evolving, ever-changing, rapidly evolving

**AI nouns/metaphors:** tapestry, synergy, paradigm, ecosystem, catalyst, beacon, testament, landscape, realm, space, journey, deep dive, game-changer, treasure trove, symphony, a delicate dance

**Throat-clearing openers:** it is worth noting, it's worth noting, it is important to note, it's important to note, it goes without saying, needless to say, as mentioned earlier, as previously stated, without further ado, in this article we will, as we all know, let's break it down, let's unpack this, let's dive into

**Empty hedges:** to be fair, to be honest, at the end of the day, when it comes to, in terms of, with respect to, it's no secret that, it's clear that, it's crucial to, it's critical to, it's essential to

**Fake-casual markers:** and honestly, I'll be honest, if I'm being honest, frankly, candidly, real talk, the truth is, I won't sugarcoat it

**AI enthusiasm:** here's the thing, the good news is, the beauty of this is, what's exciting is, excited to share, thrilled to announce, proud to, humbled to

**Lazy closers:** in conclusion, in summary, to sum up, to wrap up, only time will tell, remains to be seen, feel free to reach out, don't hesitate to, food for thought

**Hook openers:** imagine a world where, picture this, what if I told you, have you ever wondered, first and foremost, at its core

**Empty transitions:** furthermore, moreover, nevertheless, thus, hence, notwithstanding, having said that, with that said, that being said, on a related note, with that in mind, building on this foundation, taking this a step further, this means that

**Corporate filler:** going forward, moving forward, due to the fact that, in order to, has the ability to, prior to, in close proximity to, a large number of, in the event that, in light of the fact that

**Weak qualifiers:** myriad, plethora, bustling, nestled, ultimately, undeniably, in today's world, in the fast-paced world, shed light on, unpack, key takeaway, enables, ensures, ensuring

---

## 10. Head checklist — every article must have

- `<title>` — max 60 chars
- `<meta name="description">` — unique, 150 chars max
- `<meta name="keywords">`
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="{{DOMAIN}}{{ARTICLE_PATH}}article-slug">` — no www, no trailing slash
- Full Open Graph tags: `og:title`, `og:type` (`article`), `og:url`, `og:description`, `og:image`, `og:image:width` (1200), `og:image:height` (630), `og:image:alt`
- `article:published_time`, `article:author`, `article:section`
- Twitter card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`
- Analytics snippet (`{{ANALYTICS_ID}}`)
- Schema.org JSON-LD blocks — all in `<head>`, no microdata in body

**Canonical rule:** one canonical form, always. No www, no trailing slash — *except* where the URL is a real directory that the server 301s to a trailing slash (e.g. `/news/`). In that case use the trailing-slash form everywhere: canonical, `og:url`, JSON-LD `url`, sitemap and `llms.txt`. A canonical pointing at a redirect is a wasted signal.

---

## 11. Schema (JSON-LD only)

**Rule:** Use JSON-LD only. Never add `itemscope`, `itemtype`, or `itemprop` attributes to HTML elements — these create duplicate Article schema blocks that Google flags as errors. One JSON-LD block in `<head>` is the single source of truth.

### Article — must include
- `image` (full absolute URL)
- `datePublished` and `dateModified` in ISO 8601 with timezone (`2026-04-03T00:00:00+00:00`) — update `dateModified` whenever the article is edited
- `author`: `@type: Person`, `name: "{{AUTHOR_NAME}}"`, `url: "{{DOMAIN}}{{AUTHOR_URL}}"`, `sameAs: ["{{AUTHOR_SAMEAS}}"]` — always use the on-site about page as `url`, never a social profile
- `publisher`: `@type: Organization`, `name: "{{SITE_NAME}}"`, `url: "{{DOMAIN}}"` — Organization, never Person
- `mainEntityOfPage`: `{ "@type": "WebPage", "@id": "{{DOMAIN}}{{ARTICLE_PATH}}article-slug" }`
- `speakable`: `{ "@type": "SpeakableSpecification", "cssSelector": [".article-title", ".article-body"] }`

### FAQPage
Answers must exactly match the visible on-page FAQ text, word for word.

### BreadcrumbList
Home → Section → Article name

### HowTo
Add if the article has a "How It Works" section with numbered steps (`ol`). Each `<li>` becomes a `HowToStep` with `position`, `name` (the bold text), and `text` (full step content).

---

## 12. Accordion order

Where the layout uses collapsible sections, always this sequence:

1. `<details open>` — Frequently Asked Questions (open by default)
2. `<details>` — How It Works (closed)
3. `<details>` — Key Points (closed)
4. `<details>` — Sources (closed)

FAQ schema in JSON-LD must exactly match the visible on-page FAQ answers.

---

## 13. Author byline and bio block

**Byline link:** the author name must link to `{{AUTHOR_URL}}`, not to a social profile. If the author image also links out, both must point to the same place.

**Bio block:** every article includes an author bio immediately after `</article>`:

```html
<div class="about-author">
  <img alt="{{AUTHOR_NAME}}" src="{{AUTHOR_IMAGE}}"/>
  <div class="about-author-text">
    <strong>{{AUTHOR_NAME}}</strong>
    <span>{{AUTHOR_ROLE}}</span>
    <p>{{AUTHOR_BIO}}</p>
    <a href="{{AUTHOR_URL}}">About {{AUTHOR_NAME}}</a>
  </div>
</div>
```

Style it in the site stylesheet — no inline styles.

---

## 14. Images and accessibility

- All images must have descriptive `alt` text — genuinely descriptive, not keyword-stuffed
- All interactive elements need `aria-label` or a visible label
- Semantic HTML throughout (`<article>`, `<nav>`, `<section>`, `<h1>`–`<h3>`)
- Keyboard navigable
- Sufficient colour contrast
- Hero/OG image: 1200×630 for social cards; serve WebP where the CMS allows

---

## 15. Crawlable internal links

If your header and footer are injected at runtime by JavaScript, a new article's raw HTML has **zero** internal links. Googlebot renders JS and copes. GPTBot, ClaudeBot, PerplexityBot and CCBot do not — a page without static links is a dead end for AI citation.

Put a static `<nav>` block of related links directly in the HTML, inside the container that JS later overwrites. It's real crawlable markup for bots and gets replaced for human visitors. Vary the related links per article so long-tail pages get inbound links from siblings.

This does not apply if your CMS server-renders the nav.

---

## 16. After writing — publish checklist

- [ ] Add the article to the site's post index / data source
- [ ] Regenerate any static listing pages (if the listing is built from a data file)
- [ ] Add the URL to `sitemap.xml` with `lastmod`, `changefreq="weekly"`, `priority="0.7"`
- [ ] Add the URL to `llms.txt` under the correct section, with a one-sentence summary containing the primary keyword and 1-2 named entities
- [ ] Bump the `?v=N` cache-bust string on any CSS/JS file you changed
- [ ] Verify FAQ JSON-LD matches visible FAQ text word for word
- [ ] Verify canonical returns 200, not a redirect
- [ ] Run the banned-words check (see below)
- [ ] Fact-check pass against Section 7: every statistic has a source and a year, every claim traces to a primary source, every volatile fact corroborated by an independent second source
- [ ] Walk the nine failure modes in Section 7 explicitly — especially dates, "first ever" claims, and what each metric actually measures

### Optional: article audio

If the site offers a "Listen to this article" player, generate the MP3 from the finished text with a TTS API (OpenAI `tts-1` and the Shimmer voice work well). Chunk the input at sentence boundaries — OpenAI's limit is 4,096 characters per request — then concatenate.

Two things to normalise before sending text to TTS, both learned the hard way:
- Strip commas from grouped numbers. "294,000" gets read as "two hundred and ninety-four, thousand" or worse, just "000"
- A leading `Term:` at the start of a line gets interpreted as a speaker label and dropped entirely. Rewrite those blocks for the audio version

---

## 17. Quality gate — run before publishing

A quick grep catches most of the banned list:

```bash
grep -oiE "delve|utilize|leverage|foster|seamlessly|robust|comprehensive|holistic|nuanced|pivotal|crucial|vital|impactful|actionable|innovative|transformative|cutting-edge|groundbreaking|compelling|tapestry|synergy|paradigm|ecosystem|catalyst|beacon|testament|landscape|realm|journey|deep dive|treasure trove|it'?s worth noting|it'?s important to note|needless to say|in conclusion|in summary|to sum up|furthermore|moreover|nevertheless|notwithstanding|that being said|having said that|with that said|going forward|moving forward|due to the fact that|in order to|prior to|myriad|plethora|bustling|nestled|ultimately|undeniably|shed light on|first and foremost|at its core|picture this|imagine a world" article.html | sort | uniq -c | sort -rn
```

Any output is an edit — with one exception: proper nouns and UI labels. "Deep Dive Podcast" as the name of a widget is a product name, not prose, and stays. The rule applies to body copy.

Then read the draft against these four questions:

1. **Does it have a point of view?** Can you state the writer's position in one sentence? If it's a balanced survey of all sides, it fails.
2. **Is the depth unequal?** If every section is roughly the same length, the writer hasn't decided what matters.
3. **Does anything contradict?** If every thread resolves neatly, it's too clean to be true.
4. **Does section three remember section one?** If each section stands alone with no callbacks, it's a template, not an argument.

Failing any of the four means a rewrite, not a patch. These are structural.

Then one factual pass, which is the slowest part and the only one that can't be skipped. Take every number, date, version and named claim in the draft, list them, and check each against its source. Anything you can't trace comes out. Anything an interested party is the only source for gets attributed to them rather than stated. See Section 7.

---

## What this file deliberately leaves out

The source `CLAUDE.md` this came from also covered deployment, Cloudflare Worker patterns, CSP rules and cache-busting for one specific site. None of that transfers. If you're adapting this for a new site, the parts most likely to need changing are:

- Section 2 title format (your suffix, your character budget)
- Section 3 language (UK vs US English)
- Section 12 accordion order (only if your layout has accordions)
- Section 15 (only if your nav is JS-injected)

The humanisation rules and the banned-words list transfer unchanged. They're about how models write, not about any one site.
