# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

**No build step.** Push to `main` → GitHub Actions FTP-deploys everything to Namecheap hosting automatically. The site is live at `https://johnb.io`.

Always commit and push after making changes unless told otherwise.

**Audio files (mp3/m4a):** Both `.mp3` and `.m4a` files are excluded from FTP deploy (`**/*.mp3` and `**/*.m4a` in exclude list). Always remind John to upload audio files directly via Namecheap cPanel File Manager to the correct folder (`public_html/course/` or `public_html/news/`). Never commit large audio files expecting them to auto-deploy — they will timeout the FTP connection and break all subsequent deploys.

## Architecture

Static HTML/CSS/JS site. No framework, no bundler, no package manager.

**Header/footer loading:** `header.html` and `footer.html` are fetched at runtime via `scripts.js:loadHeaderAndFooter()` and injected with `innerHTML`. This means **`<script>` tags inside header.html do not execute** — all header JS logic must live in `scripts.js:initializeHeader()`.

**AI tool backends:** Cloudflare Workers at `https://[tool].ukjbowman.workers.dev`. Each worker handles CORS (whitelist: `johnb.io`, `www.johnb.io`), IP-based rate limiting via Cloudflare KV, input validation, and proxies to Anthropic/OpenAI/Gemini APIs. API keys are Cloudflare Worker Secrets — never in code.

**News/blog system:** `news-data.js` exports `NEWS_POSTS` array — the single source of truth. `news/index.html` renders the listing from it. Each article is a hand-built static HTML file in `/news/`. Adding a post = prepend to `NEWS_POSTS` + create the HTML file.

**Home page news carousel:** `index.html` loads `news-data.js` (synchronous script, before `index.js`) and `index.js` renders the 3 latest posts into `#lnTrack` via `renderNewsCarousel()`. This updates automatically when new posts are prepended to `NEWS_POSTS` — no manual HTML change needed on the home page.

## Key files

| File | Role |
|------|------|
| `scripts.js` | Header/footer loader, terminal CV, ideas modal, mobile drawer, share bar |
| `index.js` | Home page tool grid — `TOOLS` array drives cards, filters, and "show more" |
| `header.html` | Nav dropdowns + mobile drawer HTML (no inline scripts — see above) |
| `news-data.js` | All blog post metadata |
| `news-chat.js` | "Newsy AI" sidebar chat widget — mounts in sidebar on desktop, moves to `document.body` as bottom sheet on mobile |
| `sitemap.xml` | Manually maintained — update when adding pages |
| `llms.txt` | AI assistant index — update when adding pages |

## Adding a new tool

1. Create `toolname.html`, `toolname.css`, `toolname.js` — styled consistently with existing tools
2. Add entry to `TOOLS` array in `index.js`
3. Add `<li>` to correct dropdown in `header.html` (desktop + mobile drawer)
4. Create `workers/toolname-worker.js` if API needed
5. Add URL to `sitemap.xml` and `llms.txt`

### New page checklist

**Head — every new page must have:**
- `<title>` — concise, under 60 chars, ends with `- JohnB.io`
- `<meta name="description">` — unique, 150 chars max
- `<meta name="keywords">`
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://johnb.io/page-name">` — no www, no trailing slash
- Full Open Graph tags: `og:title`, `og:type`, `og:url`, `og:description`, `og:image`
- Twitter card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`
- `article:published_time` and `article:author` for article pages
- Google Analytics gtag snippet
- Schema.org JSON-LD: `SoftwareApplication` for tools, `Article` + `FAQPage` + `BreadcrumbList` for articles
- Publisher schema must use `@type: Organization`, not `Person`

**Accordion order — always this sequence:**
1. `<details class="tool-accordion" open>` — Frequently Asked Questions (open by default)
2. `<details class="tool-accordion">` — How It Works (closed)
3. `<details class="tool-accordion">` — Key Points (closed)
4. `<details class="tool-accordion">` — Sources (closed)

FAQ schema in JSON-LD must exactly match the visible on-page FAQ answers.

**Design:**
- Must match the look and feel of existing tool pages
- Must be fully responsive — tested on mobile and desktop
- Must meet accessibility standards: semantic HTML, ARIA labels, sufficient colour contrast, keyboard navigable

**After creating the page:**
- Add to `sitemap.xml` with `lastmod`, `changefreq`, `priority`
- Add to `llms.txt` under the correct category section

## Adding a new news article

Use `news/test-ai.html` as the template — match its layout and features exactly.

**Before writing, ask the user:**
- What is the article about?
- What is the main keyword?

### Title rules
- Max 60 characters (Google truncates beyond this)
- Format: `Keyword: Short descriptor - JohnB.io`

### Content writing rules

You are an expert SEO writer creating content designed to rank on Google and be cited by AI systems (ChatGPT, Perplexity, Gemini).

**Language:** UK English only. Always.

**Length:** Minimum 557 words, maximum 3,500 words. Natural length — no padding to hit a target.

**Structure:**
- Short intro (2–3 short paragraphs max)
- Each section uses a clear H2 written as a question or term (e.g. "What is RAG in AI?")
- Immediately follow with a 1–2 sentence direct definition
- Then expand: simple explanation → why it matters → real-world example
- Paragraphs max 2–3 lines
- Add a "Key Takeaways" bullet section and short conclusion at the end

**SEO + AEO:**
- Real search-style questions as headings
- Concise, snippet-friendly answers
- Bold key definitions
- Include comparison sections where relevant (e.g. "X vs Y")

**GEO (AI search):**
- Include extractable blocks: `Term:` / `Definition:`
- Each section must stand alone as a complete answer

**Authority signals:**
- Reference real tools and companies where relevant (ChatGPT, Claude, Gemini, etc.)

**Internal linking:**
- Add natural internal links to related articles/tools where relevant

### Humanisation rules — apply all without exception

**What human writing actually looks like:**
- Sentences run long when the thought is complex, short when it isn't — not varied deliberately, written at the speed the content demands
- Has real opinions, stated directly — not "many would argue" but "this approach doesn't work for most people"
- Admits uncertainty naturally ("As far as I know", "Last I checked") — not total authority on every claim
- Register shifts across a piece — some sections drier, one blunter, formality can drop for a paragraph
- Doesn't warm up or set context before the first point — the first sentence is the first real sentence
- Doesn't end with a summary — stops when the last point is made
- Structure follows the thinking, not a template — most interesting point doesn't have to come last

**Banned words — never use any of these:**

AI verbs: delve, utilize, leverage, foster, navigate, empower, streamline, unlock, harness, elevate, bolster, spearhead, cultivate, illuminate, underscore, revolutionize, democratize, curate, craft, resonate, embark, facilitate, tailor, pave the way, move the needle, test the waters

AI adjectives: seamlessly, robust, comprehensive, holistic, multifaceted, nuanced, pivotal, crucial, vital, impactful, actionable, innovative, transformative, cutting-edge, game-changing, groundbreaking, compelling, powerful, dynamic, optimal, ever-evolving, ever-changing, rapidly evolving

AI nouns/metaphors: tapestry, synergy, paradigm, ecosystem, catalyst, beacon, testament, landscape, realm, space, journey, deep dive, game-changer, treasure trove, symphony, a delicate dance

Throat-clearing openers: it is worth noting, it's worth noting, it is important to note, it's important to note, it goes without saying, needless to say, as mentioned earlier, as previously stated, without further ado, in this article we will, as we all know, let's break it down, let's unpack this, let's dive into

Empty hedges: to be fair, to be honest, at the end of the day, when it comes to, in terms of, with respect to, it's no secret that, it's clear that, it's crucial to, it's critical to, it's essential to

Fake-casual markers: and honestly, I'll be honest, if I'm being honest, frankly, candidly, real talk, the truth is, I won't sugarcoat it

AI enthusiasm: here's the thing, the good news is, the beauty of this is, what's exciting is, excited to share, thrilled to announce, proud to, humbled to

Lazy closers: in conclusion, in summary, to sum up, to wrap up, only time will tell, remains to be seen, feel free to reach out, don't hesitate to, food for thought

Hook openers: imagine a world where, picture this, what if I told you, have you ever wondered, first and foremost, at its core

Empty transitions: furthermore, moreover, nevertheless, thus, hence, notwithstanding, having said that, with that said, that being said, on a related note, with that in mind, building on this foundation, taking this a step further, this means that

Corporate filler: going forward, moving forward, due to the fact that, in order to, has the ability to, prior to, in close proximity to, a large number of, in the event that, in light of the fact that

Weak qualifiers: myriad, plethora, bustling, nestled, ultimately, undeniably, in today's world, in the fast-paced world, shed light on, unpack, key takeaway, enables, ensures, ensuring

Replace with plain direct alternatives. If you can't think of one, cut the sentence.

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

**No markdown in output:** No em dashes (—) or double hyphens (--) — use a single hyphen or rewrite. No markdown bold, italic, or tables. Headings only where genuinely useful, written as plain text.

### Accordion order — same as tools
1. `<details class="tool-accordion" open>` — Frequently Asked Questions (open)
2. `<details class="tool-accordion">` — How It Works (closed)
3. `<details class="tool-accordion">` — Key Points (closed)
4. `<details class="tool-accordion">` — Sources (closed)

### Head checklist — every article must have
- `<title>` max 60 chars
- `<meta name="description">` unique, 150 chars max
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://johnb.io/news/article-slug">`
- Full OG tags: `og:title`, `og:type` (`article`), `og:url`, `og:description`, `og:image`, `og:image:width` (1200), `og:image:height` (630), `og:image:alt`
- `article:published_time`, `article:author`, `article:section`
- Twitter card tags including `twitter:image:alt`
- Google Analytics gtag
- Schema.org JSON-LD blocks (all in `<head>`, no microdata in body):
  - `Article` — must include `image` (full absolute URL), `datePublished` and `dateModified` in ISO 8601 with timezone (`2026-04-03T00:00:00+00:00`), full `Person` author with `name` and `url`, `Organization` publisher
  - `FAQPage` — answers must exactly match the visible on-page FAQ text
  - `BreadcrumbList` — Home → News → Article name

**Schema rule:** Use JSON-LD only. Never add `itemscope`, `itemtype`, or `itemprop` attributes to HTML elements — these create duplicate Article schema blocks that Google flags as errors. One JSON-LD block in `<head>` is the single source of truth.

### Images and accessibility
- All images must have descriptive `alt` tags
- All interactive elements must have `aria-label` or visible labels
- Semantic HTML throughout (`<article>`, `<nav>`, `<section>`, etc.)
- Keyboard navigable

### After creating the article
- Prepend new entry to `NEWS_POSTS` in `news-data.js`
- Add URL to `sitemap.xml` with `lastmod`, `changefreq="weekly"`, `priority="0.7"`
- Add URL to `llms.txt` under the News/Blog section

## CSS cache busting

Shared CSS files loaded in multiple pages (e.g. `news-chat.css`) use `?v=N` query strings. Increment `N` whenever the file changes so browsers pick up the update.

## Canonical URL

Always `https://johnb.io` (no www). All pages must have `<link rel="canonical" href="https://johnb.io/pagename">`.

## Worker pattern

```js
export default {
  async fetch(req, env) {
    // 1. CORS check against ALLOWED origins
    // 2. Rate limit via env.RATE_LIMIT (KV namespace)
    // 3. Parse + validate JSON body
    // 4. Call upstream API using env.ANTHROPIC_API_KEY etc.
    // 5. Return JSON { reply } or { error }
  }
};
```

All workers follow this exact pattern. See `workers/editor-worker.js` as the canonical reference.
