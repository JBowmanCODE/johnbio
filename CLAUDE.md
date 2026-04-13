# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

**No build step.** Push to `main` → GitHub Actions FTP-deploys everything to Namecheap hosting automatically. The site is live at `https://johnb.io`.

Always commit and push after making changes unless told otherwise.

**Audio files (mp3/m4a):** Commit and push as normal — they deploy via FTP automatically. Keep individual files under ~10MB to avoid FTP timeouts.

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

### Article audio (Listen to this article)

Every article should have a "Listen to this article" audio player. Generate the MP3 using the local script:

```bash
python generate-article-audio.py news/article-slug.html
```

**Requirements (one-time setup):**
- `pip install openai beautifulsoup4`
- `OPENAI_API_KEY` set as a Windows environment variable (already configured)

**Voice:** Shimmer (Female Soft) | **Model:** tts-1

The script extracts the headline + `na-body` text, chunks it at sentence boundaries (OpenAI limit is 4,096 chars per request), calls OpenAI TTS, concatenates the chunks, and saves `news/article-slug.mp3`.

**After running the script:**
1. Commit and push the `.mp3` — it deploys automatically via FTP
2. Paste the printed `na-audio` HTML block into the article just before `<div class="na-body">`

The `na-audio` block template (replace `SLUG` with the article slug):

```html
<div aria-label="Listen to this article" class="na-audio">
  <span aria-hidden="true" class="na-audio-icon material-symbols-outlined">headphones</span>
  <div class="na-audio-info">
    <div class="na-audio-top">
      <span class="na-audio-label">Listen to this article</span>
      <div class="na-volume">
        <button aria-label="Mute" class="na-mute-btn" id="na-mute-btn">
          <span class="material-symbols-outlined">volume_up</span>
        </button>
        <input aria-label="Volume" class="na-volume-slider" id="na-volume-slider" max="1" min="0" step="0.02" type="range" value="1"/>
      </div>
    </div>
    <audio id="na-player" preload="none" src="/news/SLUG.mp3"></audio>
    <div class="na-audio-controls">
      <button aria-label="Skip back 10 seconds" class="na-skip-btn" id="na-skip-back">
        <span class="material-symbols-outlined">replay_10</span>
      </button>
      <button aria-label="Play article audio" class="na-audio-btn" id="na-play-btn">
        <span class="material-symbols-outlined">play_arrow</span>
      </button>
      <button aria-label="Skip forward 10 seconds" class="na-skip-btn" id="na-skip-fwd">
        <span class="material-symbols-outlined">forward_10</span>
      </button>
      <div aria-label="Playback speed" class="na-speed-btns" role="group">
        <button class="na-speed-btn active" data-speed="1">1x</button>
        <button class="na-speed-btn" data-speed="1.5">1.5x</button>
        <button class="na-speed-btn" data-speed="2">2x</button>
      </div>
      <canvas aria-hidden="true" class="na-waveform" height="52" id="na-waveform" width="200"></canvas>
    </div>
    <div class="na-audio-progress-wrap">
      <span class="na-audio-time" id="na-current-time">0:00</span>
      <div aria-label="Audio progress" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="na-progress" id="na-progress" role="slider">
        <div class="na-progress-fill" id="na-progress-fill"></div>
        <div class="na-progress-thumb" id="na-progress-thumb"></div>
      </div>
      <span class="na-audio-time na-audio-duration" id="na-duration">0:00</span>
    </div>
  </div>
</div>
```

### After creating the article
- Prepend new entry to `NEWS_POSTS` in `news-data.js`
- Add URL to `sitemap.xml` with `lastmod`, `changefreq="weekly"`, `priority="0.7"`
- Add URL to `llms.txt` under the News/Blog section
- Generate audio with `python generate-article-audio.py news/article-slug.html` and upload MP3 via cPanel

## Cache strategy

The site uses a standard long-cache + version-busting approach:

| File type | Cache | How busted |
|---|---|---|
| HTML | No cache / must-revalidate | Always fresh — no action needed |
| CSS / JS | 1 year | Increment `?v=N` on the `<link>` or `<script>` tag when the file changes |
| Images | 1 year | Use a new filename when replacing an image |
| Fonts | 1 year | Never change |

**Rule: whenever you edit a `.css` or `.js` file, increment its `?v=N` version string in the HTML page(s) that load it.**

- `styles.css` is currently at `?v=2` — bump to `?v=3` when changed
- `scripts.js` is currently at `?v=4` — bump to `?v=5` when changed
- All tool-specific CSS/JS files (e.g. `tcs-simplifier.css`, `index.js`) start at `?v=1` — bump when changed

This applies to every `<link rel="stylesheet">` and `<script src="">` that references a local file. External CDN URLs do not need version strings.

## Canonical URL

Always `https://johnb.io` (no www). All pages must have `<link rel="canonical" href="https://johnb.io/pagename">`.

## Worker pattern

**IMPORTANT — use the Service Worker format, NOT ES Modules.** The Cloudflare dashboard defaults to Service Worker mode. Using `export default { async fetch(req, env) {} }` (ES Module syntax) will cause the worker to silently fail with CORS errors on the client side because the worker never executes.

The correct format uses `addEventListener('fetch', ...)` and accesses secrets/KV as globals (not via `env`):

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request).catch(err => {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }));
});

async function handleRequest(request) {
  // 1. CORS — build headers from ALLOWED_ORIGINS vs request Origin
  // 2. OPTIONS preflight — return 204 immediately
  // 3. Rate limit via RATE_LIMIT_KV (global KV binding, fail-open if undefined)
  // 4. Parse + validate JSON body
  // 5. Call upstream API using ANTHROPIC_API_KEY (global secret)
  // 6. Return JSON { success, result } or { success: false, error }
}
```

**Naming convention:** Workers are named with a `-worker` suffix in the Cloudflare dashboard (e.g. `tcs-simplifier-worker`, `faq-schema-worker`, `prompt-improver-worker`). The deployed URL is therefore `https://[name]-worker.ukjbowman.workers.dev`. Always match this in the frontend JS `WORKER_URL` constant.

**Secrets and KV bindings** are accessed as globals in Service Worker format:
- Secret: `ANTHROPIC_API_KEY` (add under Settings → Variables and Secrets)
- KV: `RATE_LIMIT_KV` (add under Settings → KV Namespace Bindings, variable name must be exactly `RATE_LIMIT_KV`)

See `workers/editor-worker.js` as the canonical reference (it uses the older Service Worker format correctly).

## Content Security Policy (CSP)

The CSP is set in `.htaccess` (line ~99) as a single `Header set Content-Security-Policy` directive. It tells browsers which external domains are allowed to load resources. Anything not listed is silently blocked — no visible page error, just broken functionality and console errors saying `"violates Content-Security-Policy"`.

**Whenever you add a new external resource, update the CSP in `.htaccess`:**

| Resource type | Directive |
|---|---|
| `<script src="https://...">` | `script-src` |
| `<link rel="stylesheet" href="https://...">` | `style-src` |
| External font files | `font-src` |
| `<iframe src="https://...">` | `frame-src` |
| `fetch()` / `XMLHttpRequest` in JS | `connect-src` |

**Note:** Cloudflare Worker API calls (Anthropic, OpenAI, Gemini) are server-side — they don't need to be in the CSP. Only what the *browser* loads directly matters. `img-src` is currently `https:` which covers all HTTPS images globally so never needs updating.

If something stops working, check the browser console first — CSP violations are always logged there with the exact blocked domain.
