# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

**No build step.** Push to `main` → GitHub Actions FTP-deploys everything to Namecheap hosting automatically. The site is live at `https://johnb.io`.

Always commit and push after making changes unless told otherwise.

## Architecture

Static HTML/CSS/JS site. No framework, no bundler, no package manager.

**Header/footer loading:** `header.html` and `footer.html` are fetched at runtime via `scripts.js:loadHeaderAndFooter()` and injected with `innerHTML`. This means **`<script>` tags inside header.html do not execute** — all header JS logic must live in `scripts.js:initializeHeader()`.

**AI tool backends:** Cloudflare Workers at `https://[tool].ukjbowman.workers.dev`. Each worker handles CORS (whitelist: `johnb.io`, `www.johnb.io`), IP-based rate limiting via Cloudflare KV, input validation, and proxies to Anthropic/OpenAI/Gemini APIs. API keys are Cloudflare Worker Secrets — never in code.

**News/blog system:** `news-data.js` exports `NEWS_POSTS` array — the single source of truth. `news/index.html` renders the listing from it. Each article is a hand-built static HTML file in `/news/`. Adding a post = prepend to `NEWS_POSTS` + create the HTML file.

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
