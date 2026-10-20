/* Search & Prompt Radar - frontend
   Backend: GET WORKER_URL/?seed=<seed>&country=<gb|us|global>
   Shared links (?q=) call the same endpoint with &cacheOnly=1: 200 on a cache hit,
   404 {error:'not_cached'} on a miss, and never start a paid fresh scan.
   Test without the worker: add ?mock=1 (or ?mock=hn-down) to the page URL. */
(function () {
  'use strict';

  const WORKER_URL = 'https://search-radar-worker.ukjbowman.workers.dev';
  const REGIONS = { gb: 'UK', us: 'US', global: 'Global' };
  const STORE_KEY = 'sr-region';
  const LINKEDIN = 'https://www.linkedin.com/in/john-bowman/';

  // ── MOCK DATA (?mock=1 / ?mock=hn-down) ─────────────────────────────
  // mock:start
  function mockResponse(seed, country, hnDown) {
    const threads = hnDown ? [] : [
      { title: 'Show HN: I replaced Zapier with self-hosted n8n for a 12-person agency', points: 212, comments: 137, date: '2026-06-14', url: 'https://news.ycombinator.com/item?id=1' },
      { title: 'n8n is now fair-code. What that means for self-hosters', points: 168, comments: 81, date: '2026-03-02', url: 'https://news.ycombinator.com/item?id=2' },
      { title: 'Ask HN: Is workflow automation worth learning when agents can do it?', points: 54, comments: 96, date: '2026-08-21', url: 'https://news.ycombinator.com/item?id=3' },
    ];
    return {
      success: true, seed: seed, topic: 'n8n', country: country, generatedAt: new Date().toISOString(), cached: false, engine: 'ai',
      sources: {
        google: { ok: true, count: 14 }, youtube: { ok: true, count: 7 },
        reddit: { ok: true, count: 3 },
        hn: hnDown ? { ok: false, count: 0, error: 'Hacker News threads unavailable (503)' } : { ok: true, count: 3 },
        linkedin: { ok: true, count: 6 }, llm: { ok: true, engine: 'ai' },
      },
      google: {
        questions: ['how to use n8n automation', 'is n8n free', 'what is n8n used for', 'can n8n replace zapier', 'does n8n need coding?'],
        comparisons: ['n8n vs zapier', 'n8n vs make', 'n8n alternative open source', 'n8n compared to power automate'],
        modifiers: ['n8n automation examples', 'n8n automation templates', 'n8n automation ai agent', 'n8n automation self hosted', 'n8n automation pricing'],
      },
      youtube: {
        queries: ['n8n automation ai agent', 'n8n automation full course', 'n8n automation make money'],
        tutorials: ['n8n tutorial for beginners', 'n8n setup docker step by step', 'n8n install on vps', 'n8n workflows explained'],
      },
      reddit: {
        searches: ['n8n self hosted', 'n8n vs make reddit', 'n8n worth it'],
      },
      hn: { threads: threads },
      linkedin: {
        modifiers: ['n8n automation for agencies', 'n8n automation consultant', 'n8n automation enterprise'],
        hooks: ['We replaced 14 Zapier zaps with one n8n workflow. Here is what it cost.', 'Most "AI agents" are an n8n workflow with a nice name.', 'Self-hosting your automation stack is a compliance decision, not a cost one.'],
      },
      llm: {
        prompts: [
          { intent: 'Discovery', text: 'What is n8n and what kind of business tasks can it automate?' },
          { intent: 'Discovery', text: 'Which workflow automation tools are best for a small agency in the UK?' },
          { intent: 'Comparison', text: 'Compare n8n vs Zapier vs Make for cost, hosting options and AI features.' },
          { intent: 'Comparison', text: 'Is n8n a good alternative to Power Automate for a Microsoft 365 company?' },
          { intent: 'Implementation', text: 'How do I self-host n8n with Docker and keep it secure?' },
          { intent: 'Implementation', text: 'Write an n8n workflow that summarises new Gmail messages with an LLM and posts them to Slack.' },
        ],
        clusters: [
          { name: 'Self-hosting and setup', terms: ['n8n automation self hosted', 'n8n setup docker step by step', 'n8n install on vps'] },
          { name: 'Tool comparisons', terms: ['n8n vs zapier', 'n8n vs make', 'n8n alternative open source'] },
          { name: 'AI agents', terms: ['n8n automation ai agent', 'n8n workflows explained'] },
        ],
      },
      ideas: {
        articles: [
          { title: 'n8n vs Zapier: what a 12-person agency actually pays', angle: 'Real monthly costs for both tools at 5,000 tasks, including the hosting bill nobody quotes.', terms: ['n8n vs zapier', 'n8n automation pricing', 'is n8n free'] },
          { title: 'Is n8n free? Fair-code licensing explained for UK businesses', angle: 'What the licence lets you do for clients, and where you need a paid plan.', terms: ['is n8n free', 'n8n automation self hosted'] },
          { title: 'Self-hosting n8n with Docker: a setup you can leave running', angle: 'One VPS, Docker Compose, backups and basic auth, with the mistakes that break updates.', terms: ['n8n setup docker step by step', 'n8n install on vps', 'n8n self hosted'] },
        ],
        videos: [
          { title: 'Build an AI agent in n8n in 20 minutes', angle: 'Screen recording from an empty canvas to a Gmail triage agent that posts to Slack.', terms: ['n8n automation ai agent', 'n8n tutorial for beginners'] },
          { title: 'n8n vs Make: the same workflow built twice', angle: 'Side-by-side build of one lead-routing flow, timing each and comparing the bill.', terms: ['n8n vs make', 'n8n workflows explained'] },
        ],
      },
      totals: { unique: 41 },
    };
  }
  // mock:end

  // ── ELEMENTS ────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const form = $('sr-form'), seedInput = $('sr-seed'), countrySel = $('sr-country');
  const scanBtn = $('sr-scan'), statusEl = $('sr-status');
  const platformsEl = $('sr-platforms'), notesEl = $('sr-platform-notes');
  const resultsEl = $('sr-results'), summaryEl = $('sr-summary'), gridEl = $('sr-grid');
  const toastEl = $('sr-toast');
  const params = new URLSearchParams(location.search);
  const MOCK = params.get('mock');

  let current = null;   // { data, cards }
  let filter = 'all';
  let busy = false;
  let scanSeq = 0;      // bumped by each user scan so a late cache-only reply can't overwrite it
  let idSeq = 0;

  // ── HELPERS ─────────────────────────────────────────────────────────────
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = String(text);
    return n;
  }
  function icon(name) {
    const s = el('span', 'material-symbols-outlined', name);
    s.setAttribute('aria-hidden', 'true');
    return s;
  }
  const arr = (x) => (Array.isArray(x) ? x : []);
  const strs = (x) => arr(x).filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim());
  const isRegion = (c) => typeof c === 'string' && Object.prototype.hasOwnProperty.call(REGIONS, c);
  const regionLabel = (c) => (isRegion(c) ? REGIONS[c] : 'Global');

  function safeHnUrl(u) {
    try {
      const url = new URL(u);
      if (url.protocol === 'https:' && url.hostname === 'news.ycombinator.com') return url.href;
    } catch (e) { /* ignore */ }
    return null;
  }
  const redditSearch = (seed) => 'https://www.reddit.com/search/?q=' + encodeURIComponent(seed);
  const googleRedditSearch = (seed) => 'https://www.google.com/search?q=' + encodeURIComponent('site:reddit.com ' + seed);
  const hnSearch = (seed) => 'https://hn.algolia.com/?q=' + encodeURIComponent(seed);

  // ── CLASSIFICATION ──────────────────────────────────────────────────────
  const RX_Q = /^(how|why|what|when|where|who|which|can|is|does|do|should|are|will)\b/i;
  const RX_C = /\b(vs\.?|versus|alternatives?|compared?|comparison)\b/i;
  const RX_T = /(tutorial|how to|guide|course|beginner|step by step|setup|set up|install|explained)/i;
  function classify(text) {
    const t = String(text || '').trim();
    const out = [];
    if (RX_Q.test(t) || t.includes('?')) out.push('q');
    if (RX_C.test(t)) out.push('c');
    if (RX_T.test(t)) out.push('t');
    return out.join(' ');
  }

  // ── NORMALISE RESPONSE INTO CARDS ───────────────────────────────────────
  // group types: chips (strings), prompts ({intent,text}), lines (strings), threads, clusters,
  // ideas ({title,angle,terms})
  function cleanIdeas(x) {
    return arr(x).filter((i) => i && typeof i.title === 'string' && i.title.trim())
      .map((i) => ({ title: i.title.trim(), angle: typeof i.angle === 'string' ? i.angle.trim() : '', terms: strs(i.terms).slice(0, 4) }));
  }
  const ideaText = (i) => i.title + (i.angle ? ' - ' + i.angle : '');
  function buildCards(d) {
    const ideas = d.ideas && typeof d.ideas === 'object' ? d.ideas : {};
    const g = d.google || {}, y = d.youtube || {}, r = d.reddit || {}, hn = d.hn || {}, li = d.linkedin || {}, l = d.llm || {};
    const prompts = arr(l.prompts).filter((p) => p && typeof p.text === 'string' && p.text.trim())
      .map((p) => ({ intent: ['Discovery', 'Comparison', 'Implementation'].includes(p.intent) ? p.intent : 'Discovery', text: p.text.trim() }));
    const clusters = arr(l.clusters).filter((c) => c && c.name)
      .map((c) => ({ name: String(c.name), terms: strs(c.terms) })).filter((c) => c.terms.length);
    const threads = arr(hn.threads).filter((t) => t && t.title).map((t) => ({
      title: String(t.title), date: /^\d{4}-\d{2}-\d{2}$/.test(t.date || '') ? t.date : '',
      points: Number(t.points) || 0, comments: Number(t.comments) || 0, url: safeHnUrl(t.url),
    }));
    const engine = d.engine === 'rules' || (d.sources && d.sources.llm && d.sources.llm.engine === 'rules') ? 'rules' : 'ai';
    return [
      { key: 'ideas', platform: 'Content ideas', wide: true, icon: 'lightbulb', title: 'Content ideas',
        sub: 'Article and video ideas built from the searches below.',
        empty: 'No content ideas came back for this scan. The AI step may have been unavailable, or this is an older cached result.',
        groups: [
          { label: 'Article ideas', category: 'Article idea', type: 'ideas', items: cleanIdeas(ideas.articles) },
          { label: 'Video ideas', category: 'Video idea', type: 'ideas', items: cleanIdeas(ideas.videos) },
        ] },
      { key: 'llm', platform: 'AI prompts', wide: true, icon: 'psychology', title: 'LLM & AI Answer Engine Prompts (AEO/GEO)',
        sub: engine === 'rules'
          ? 'Rule-based prompt templates built from the search data below. The AI step was unavailable.'
          : 'Synthesised from the real search data on this page. No AI platform publishes prompt logs.',
        groups: [
          { label: 'Likely prompts', category: 'Prompt', type: 'prompts', items: prompts },
          { label: 'Intent clusters', category: 'Cluster', type: 'clusters', items: clusters },
        ] },
      { key: 'google', platform: 'Google', icon: 'search', title: 'Google Search (SEO & PAA intent)', sub: 'Autocomplete suggestions grouped by intent.',
        groups: [
          { label: 'Questions', category: 'Question', type: 'chips', items: strs(g.questions) },
          { label: 'Comparisons', category: 'Comparison', type: 'chips', items: strs(g.comparisons) },
          { label: 'Long-tail modifiers', category: 'Modifier', type: 'chips', items: strs(g.modifiers) },
        ] },
      { key: 'youtube', platform: 'YouTube', icon: 'smart_display', title: 'YouTube Search Demand', sub: 'What people want to be shown, not told.',
        groups: [
          { label: 'Tutorial gaps', category: 'Tutorial', type: 'chips', items: strs(y.tutorials) },
          { label: 'Video searches', category: 'Video search', type: 'chips', items: strs(y.queries) },
        ] },
      { key: 'reddit', platform: 'Reddit', icon: 'forum', title: 'Reddit & Hacker News Pulse', sub: 'Live Hacker News threads, plus Google searches people add "reddit" to (the Reddit API is closed).',
        groups: [
          { label: 'What people want real opinions on', category: 'Reddit-intent search', type: 'chips', items: strs(r.searches) },
          { label: 'Hacker News threads', platform: 'Hacker News', category: 'Thread', type: 'threads', items: threads },
        ] },
      { key: 'linkedin', platform: 'LinkedIn', icon: 'work', title: 'LinkedIn & B2B Angles', sub: 'Business searches from Google autocomplete, plus post hooks. Nothing is taken from LinkedIn.',
        groups: [
          { label: 'B2B modifiers', category: 'B2B modifier', type: 'chips', items: strs(li.modifiers),
            empty: 'No clear B2B angle in the searches for this topic. The hooks below still work for a personal or creator post.' },
          { label: 'Post hooks', category: 'Hook', type: 'lines', items: strs(li.hooks) },
        ] },
    ];
  }
  function itemTexts(group) {
    if (group.type === 'prompts') return group.items.map((p) => p.text);
    if (group.type === 'threads') return group.items.map((t) => t.title);
    if (group.type === 'clusters') return group.items.flatMap((c) => c.terms);
    if (group.type === 'ideas') return group.items.map((i) => i.title);
    return group.items;
  }
  const cardCount = (card) => card.groups.reduce((n, g) => n + itemTexts(g).length, 0);

  // ── RENDER ──────────────────────────────────────────────────────────────
  // Chips: the visible term is the accessible name, plus a hidden " (copy)" suffix.
  // Long lines (prompts, hooks): short aria-label, with the text linked by aria-describedby.
  function copyBtn(text, cls, children, label, describedBy, clsText) {
    const b = el('button', cls);
    b.type = 'button';
    b.dataset.copy = text;
    b.dataset.cls = classify(clsText != null ? clsText : text);
    children.forEach((c) => b.appendChild(c));
    if (label) {
      b.setAttribute('aria-label', label);
      if (describedBy) b.setAttribute('aria-describedby', describedBy);
    } else {
      b.appendChild(el('span', 'sr-visually-hidden', ' (copy)'));
    }
    return b;
  }
  function chipList(items) {
    const ul = el('ul', 'sr-chips');
    items.forEach((t) => {
      const liEl = el('li', 'sr-item');
      liEl.dataset.cls = classify(t);
      liEl.appendChild(copyBtn(t, 'sr-chip', [document.createTextNode(t)]));
      ul.appendChild(liEl);
    });
    return ul;
  }
  function fallbackLink(text, href) {
    const a = el('a', null, text);
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer nofollow';
    return a;
  }
  function renderGroup(group, card, seed, hnSrc) {
    const wrap = el('div', 'sr-group');
    const label = el('h4', 'sr-group-label', group.label + ' ');
    label.appendChild(el('span', 'sr-count', itemTexts(group).length));
    wrap.appendChild(label);

    if (group.type === 'chips') {
      wrap.appendChild(chipList(group.items));
    } else if (group.type === 'prompts' || group.type === 'lines') {
      const ul = el('ul', 'sr-list');
      group.items.forEach((it) => {
        const text = group.type === 'prompts' ? it.text : it;
        const liEl = el('li', 'sr-item');
        liEl.dataset.cls = classify(text);
        const kids = [];
        if (group.type === 'prompts') kids.push(el('span', 'sr-intent sr-intent-' + it.intent.toLowerCase(), it.intent));
        const textEl = el('span', 'sr-line-text', text);
        textEl.id = 'sr-t-' + (++idSeq);
        kids.push(textEl);
        const label = group.type === 'prompts' ? 'Copy prompt' : 'Copy hook';
        liEl.appendChild(copyBtn(text, 'sr-line', kids, label, textEl.id));
        ul.appendChild(liEl);
      });
      wrap.appendChild(ul);
    } else if (group.type === 'ideas') {
      const ul = el('ul', 'sr-list sr-ideas');
      group.items.forEach((it) => {
        const liEl = el('li', 'sr-item');
        liEl.dataset.cls = classify(it.title);
        const body = el('span', 'sr-line-text sr-idea-body');
        body.id = 'sr-t-' + (++idSeq);
        body.appendChild(el('strong', 'sr-idea-title', it.title));
        if (it.angle) body.appendChild(el('span', 'sr-idea-angle', it.angle));
        if (it.terms.length) {
          // plain spans, not buttons: a button can't contain interactive content
          const tags = el('span', 'sr-idea-terms');
          tags.appendChild(el('span', 'sr-visually-hidden', 'Search terms: '));
          it.terms.forEach((t, i) => {
            tags.appendChild(el('span', 'sr-idea-term', t));
            if (i < it.terms.length - 1) tags.appendChild(el('span', 'sr-visually-hidden', ', '));
          });
          body.appendChild(tags);
        }
        liEl.appendChild(copyBtn(ideaText(it), 'sr-line sr-idea', [body], 'Copy idea', body.id, it.title));
        ul.appendChild(liEl);
      });
      wrap.appendChild(ul);
    } else if (group.type === 'clusters') {
      group.items.forEach((c) => {
        const cw = el('div', 'sr-cluster sr-subgroup');
        cw.appendChild(el('p', 'sr-cluster-name', c.name));
        cw.appendChild(chipList(c.terms));
        wrap.appendChild(cw);
      });
    } else if (group.type === 'threads') {
      if (group.items.length) {
        const ul = el('ul', 'sr-list');
        group.items.forEach((t) => {
          const liEl = el('li', 'sr-item sr-thread');
          liEl.dataset.cls = classify(t.title);
          liEl.appendChild(fallbackLink(t.title, t.url || hnSearch(t.title)));
          const meta = el('div', 'sr-thread-meta');
          meta.appendChild(el('span', null, 'Hacker News' + (t.date ? ' · ' + new Date(t.date + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '')));
          const up = el('span'); up.appendChild(icon('arrow_upward')); up.appendChild(document.createTextNode(t.points.toLocaleString('en-GB')));
          up.setAttribute('aria-label', t.points + ' points');
          const cm = el('span'); cm.appendChild(icon('chat_bubble')); cm.appendChild(document.createTextNode(t.comments.toLocaleString('en-GB')));
          cm.setAttribute('aria-label', t.comments + ' comments');
          meta.appendChild(up); meta.appendChild(cm);
          liEl.appendChild(meta);
          ul.appendChild(liEl);
        });
        wrap.appendChild(ul);
      } else {
        const msg = (hnSrc && hnSrc.error) ? hnSrc.error + '.' : 'No Hacker News threads from the last 12 months for this seed. HN skews to tech and startups, so consumer topics often come back empty.';
        wrap.appendChild(el('p', 'sr-notice', msg + ' Reddit discussion is one click away below.'));
        wrap.dataset.keep = '1';
      }
      const fb = el('p', 'sr-fallback');
      fb.appendChild(fallbackLink('Search Reddit for "' + seed + '"', redditSearch(seed)));
      fb.appendChild(document.createTextNode(' · '));
      fb.appendChild(fallbackLink('Reddit threads via Google', googleRedditSearch(seed)));
      wrap.appendChild(fb);
    }
    if (!itemTexts(group).length && group.type !== 'threads') {
      wrap.appendChild(el('p', 'sr-empty', group.empty || 'Nothing returned for this group.'));
    }
    return wrap;
  }
  function renderCard(card, data) {
    const sec = el('article', 'sr-bento' + (card.wide ? ' sr-bento-wide' : ''));
    sec.setAttribute('aria-labelledby', 'sr-h-' + card.key);
    sec.dataset.key = card.key;
    const head = el('div', 'sr-bento-head');
    const ic = icon(card.icon); ic.classList.add('sr-bento-icon');
    head.appendChild(ic);
    const titles = el('div', 'sr-bento-titles');
    const h = el('h3', 'sr-bento-title', card.title + ' ');
    h.id = 'sr-h-' + card.key;
    h.appendChild(el('span', 'sr-count', cardCount(card)));
    titles.appendChild(h);
    titles.appendChild(el('p', 'sr-bento-sub', card.sub));
    head.appendChild(titles);
    const cb = el('button', 'sr-card-copy');
    cb.type = 'button';
    cb.dataset.cardCopy = card.key;
    cb.setAttribute('aria-label', 'Copy all ' + card.platform + ' items');
    cb.appendChild(icon('content_copy'));
    head.appendChild(cb);
    sec.appendChild(head);
    const hnSrc = data.sources && data.sources.hn;
    if (card.empty && !cardCount(card)) sec.appendChild(el('p', 'sr-empty', card.empty));
    else card.groups.forEach((g) => sec.appendChild(renderGroup(g, card, data.topic || data.seed, hnSrc)));
    const none = el('p', 'sr-empty sr-filter-empty', 'Nothing in this card matches the filter.');
    none.hidden = true;
    sec.appendChild(none);
    return sec;
  }
  function renderSkeleton() {
    gridEl.textContent = '';
    for (let i = 0; i < 5; i++) {
      const c = el('div', 'sr-bento sr-skel' + (i === 0 ? ' sr-bento-wide' : ''));
      c.setAttribute('aria-hidden', 'true');
      ['w30', 'w80', 'w60', 'w45', 'w80'].forEach((w) => c.appendChild(el('div', 'sr-skel-bar ' + w)));
      gridEl.appendChild(c);
    }
  }
  function renderResults(data) {
    const cards = buildCards(data);
    current = { data, cards };
    gridEl.textContent = '';
    cards.forEach((c) => gridEl.appendChild(renderCard(c, data)));

    const all = new Set();
    cards.forEach((c) => c.groups.forEach((g) => itemTexts(g).forEach((t) => all.add(t.toLowerCase()))));
    const unique = data.totals && Number.isFinite(Number(data.totals.unique)) ? Number(data.totals.unique) : all.size;
    $('sr-total-num').textContent = unique.toLocaleString('en-GB');
    $('sr-summary-seed').textContent = data.seed + ' (' + regionLabel(data.country) + ')';

    const badges = $('sr-badges');
    badges.textContent = '';
    const llmCard = cards.find((c) => c.key === 'llm');
    const rules = !!llmCard && llmCard.sub.startsWith('Rule-based');
    badges.appendChild(el('span', 'sr-badge' + (rules ? ' is-rules' : ''), rules ? 'Rule-based prompts' : 'AI-synthesised'));
    if (data.cached) badges.appendChild(el('span', 'sr-badge is-cached', 'Cached'));
    if (MOCK) badges.appendChild(el('span', 'sr-badge is-rules', 'Mock data'));

    // Short seeds and acronyms ("GEO", "RAG") mix unrelated meanings in autocomplete.
    const amb = $('sr-ambiguity');
    const s = String(data.topic || data.seed || '').trim(); // "what is GEO" -> topic "GEO" still gets the hint
    const ambiguous = s.length <= 4 || /^[A-Z0-9]{2,6}$/.test(s);
    amb.textContent = ambiguous
      ? 'Short terms and acronyms like "' + s + '" usually mix several unrelated meanings, so expect some off-topic results. For tighter results add context, e.g. "' + s + ' SEO", "' + s + ' marketing", or spell the term out in full.'
      : '';
    amb.hidden = !ambiguous;

    // The worker strips question framing ("what is a neocloud" -> "neocloud") before expanding.
    const topicEl = $('sr-topic');
    const topic = typeof data.topic === 'string' ? data.topic.trim() : '';
    const showTopic = !!topic && topic.toLowerCase() !== s.toLowerCase();
    if (topicEl) {
      topicEl.textContent = showTopic ? 'Expanded on the core topic "' + topic + '"' : '';
      topicEl.hidden = !showTopic;
    }

    // filter counts: unique terms (case-insensitive) per filter. Intent clusters
    // regroup terms already listed elsewhere, so they're filtered visually but not counted.
    const sets = { q: new Set(), c: new Set(), t: new Set() };
    cards.forEach((c) => c.groups.forEach((g) => {
      if (g.type === 'clusters') return;
      itemTexts(g).forEach((t) => classify(t).split(' ').forEach((k) => { if (k in sets) sets[k].add(t.toLowerCase()); }));
    }));
    const counts = { all: unique, q: sets.q.size, c: sets.c.size, t: sets.t.size };
    current.counts = counts;
    document.querySelectorAll('.sr-filter').forEach((b) => {
      const k = b.dataset.filter;
      let span = b.querySelector('.sr-filter-count');
      if (k === 'all') return;
      if (!span) { span = el('span', 'sr-filter-count'); b.appendChild(document.createTextNode(' ')); b.appendChild(span); }
      span.textContent = '(' + counts[k] + ')';
    });
    summaryEl.hidden = false;
    applyFilter(filter);
  }

  // ── FILTER ──────────────────────────────────────────────────────────────
  function applyFilter(f) {
    filter = f;
    document.querySelectorAll('.sr-filter').forEach((b) => {
      const on = b.dataset.filter === f;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    gridEl.querySelectorAll('.sr-bento:not(.sr-skel)').forEach((card) => {
      let visible = 0;
      card.querySelectorAll('.sr-item').forEach((n) => {
        const show = f === 'all' || (n.dataset.cls || '').split(' ').includes(f);
        n.dataset.hide = show ? '' : '1';
        if (show) visible++;
      });
      card.querySelectorAll('.sr-subgroup').forEach((s) => {
        s.dataset.hide = f !== 'all' && !s.querySelector('.sr-item:not([data-hide="1"])') ? '1' : '';
      });
      card.querySelectorAll('.sr-group').forEach((g) => {
        const has = g.querySelector('.sr-item:not([data-hide="1"])');
        g.dataset.hide = f !== 'all' && !has && !g.dataset.keep ? '1' : '';
      });
      const none = card.querySelector('.sr-filter-empty');
      if (none) none.hidden = f === 'all' || visible > 0;
    });
  }
  const FILTER_WORDS = { all: ['term', 'terms'], q: ['question', 'questions'], c: ['comparison', 'comparisons'], t: ['tutorial', 'tutorials'] };
  document.querySelectorAll('.sr-filter').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    applyFilter(f);
    if (current && current.counts && FILTER_WORDS[f]) {
      const n = current.counts[f] || 0;
      setStatus('Showing ' + (f === 'all' ? 'all ' : '') + n.toLocaleString('en-GB') + ' ' + FILTER_WORDS[f][n === 1 ? 0 : 1] + '.');
    }
  }));

  // ── PLATFORM STATUS ─────────────────────────────────────────────────────
  function setPlatforms(sources) {
    platformsEl.hidden = false;
    const notes = [];
    platformsEl.querySelectorAll('.sr-platform').forEach((p) => {
      const key = p.dataset.src;
      const stateEl = p.querySelector('.sr-platform-state');
      p.classList.remove('is-loading', 'is-ok', 'is-partial', 'is-down', 'is-empty');
      p.removeAttribute('title');
      if (!sources) { p.classList.add('is-loading'); stateEl.textContent = 'Scanning'; return; }
      const s = sources[key] || {};
      const count = Number(s.count) || 0;
      let state;
      // ok + results -> OK, ok + nothing -> No results, error + some -> Partial, error + nothing -> Unavailable
      if (key === 'llm') state = s.ok === false ? 'down' : (s.engine === 'rules' ? 'partial' : 'ok');
      else if (s.ok) state = count > 0 ? 'ok' : 'empty';
      else state = count > 0 ? 'partial' : 'down';
      p.classList.add('is-' + state);
      const label = { ok: 'OK', empty: 'No results', partial: key === 'llm' ? 'Rule-based' : 'Partial', down: 'Unavailable' }[state];
      stateEl.textContent = label + (key !== 'llm' && count > 0 ? ' · ' + count : '');
      if (s.error) {
        p.title = String(s.error);
        notes.push(p.querySelector('.sr-platform-name').textContent + ': ' + String(s.error));
      }
    });
    notesEl.textContent = notes.join(' | ');
    notesEl.hidden = !notes.length;
  }

  // ── STATUS / TOAST ──────────────────────────────────────────────────────
  function setStatus(msg, isError, linkText, linkHref) {
    statusEl.textContent = msg || '';
    statusEl.className = 'sr-status' + (isError ? ' error' : '');
    if (linkText) {
      statusEl.appendChild(document.createTextNode(' '));
      const a = el('a', null, linkText);
      a.href = linkHref; a.target = '_blank'; a.rel = 'noopener noreferrer';
      statusEl.appendChild(a);
      statusEl.appendChild(document.createTextNode('.'));
    }
  }
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  // ── CLIPBOARD ───────────────────────────────────────────────────────────
  async function copyText(text, msg) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      document.body.removeChild(ta);
    }
    toast(msg || 'Copied');
  }
  gridEl.addEventListener('click', (e) => {
    const item = e.target.closest('[data-copy]');
    if (item) { copyText(item.dataset.copy, 'Copied: ' + truncate(item.dataset.copy, 60)); return; }
    const cardBtn = e.target.closest('[data-card-copy]');
    if (cardBtn && current) {
      const card = current.cards.find((c) => c.key === cardBtn.dataset.cardCopy);
      if (card) copyText(cardToMarkdown(card, current.data.topic || current.data.seed).trim(), 'Copied ' + cardCount(card) + ' ' + card.platform + ' items');
    }
  });
  const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

  // ── MARKDOWN / CSV ──────────────────────────────────────────────────────
  const mdSafe = (s) => String(s).replace(/[\[\]]/g, (m) => (m === '[' ? '(' : ')'));
  function cardToMarkdown(card, seed) {
    if (card.empty && !cardCount(card)) return '';
    let out = '## ' + card.title + '\n';
    card.groups.forEach((g) => {
      if (!itemTexts(g).length && g.type !== 'threads') return;
      out += '\n### ' + g.label + '\n';
      if (g.type === 'prompts') g.items.forEach((p) => { out += '- [' + p.intent + '] ' + p.text + '\n'; });
      else if (g.type === 'ideas') g.items.forEach((i) => {
        out += '- **' + i.title + '**' + (i.angle ? ': ' + i.angle : '') + (i.terms.length ? ' (terms: ' + i.terms.join(', ') + ')' : '') + '\n';
      });
      else if (g.type === 'clusters') g.items.forEach((c) => { out += '- ' + c.name + ': ' + c.terms.join(', ') + '\n'; });
      else if (g.type === 'threads') {
        if (!g.items.length) out += '- No Hacker News threads returned. Reddit search: ' + redditSearch(seed) + '\n';
        g.items.forEach((t) => {
          out += '- [' + mdSafe(t.title) + '](' + (t.url || hnSearch(t.title)) + ') - Hacker News' +
            (t.date ? ' ' + t.date : '') + ', ' + t.points + ' points, ' + t.comments + ' comments\n';
        });
      } else g.items.forEach((s) => { out += '- ' + s + '\n'; });
    });
    return out + '\n';
  }
  function toMarkdown() {
    const d = current.data;
    const date = new Date(d.generatedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    let out = '# Search & Prompt Radar: ' + d.seed + ' (' + regionLabel(d.country) + ', ' + date + ')\n\n';
    out += 'Source: Google and YouTube autocomplete, Reddit search intent, Hacker News threads, LinkedIn angles. AI prompts are synthesised from this data, not taken from AI platform logs.\n\n';
    current.cards.forEach((c) => { out += cardToMarkdown(c, d.topic || d.seed); });
    return out.trim() + '\n';
  }
  // Prefix ' so Excel/Sheets treat cells starting with = + - @ tab or CR as text, not formulas
  const csvCell = (v) => {
    let s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  function toCsv() {
    const rows = [['Platform', 'Category', 'Term_or_Prompt', 'URL']];
    current.cards.forEach((card) => card.groups.forEach((g) => {
      if (g.type === 'prompts') g.items.forEach((p) => rows.push([card.platform, 'Prompt - ' + p.intent, p.text, '']));
      else if (g.type === 'ideas') g.items.forEach((i) => rows.push([card.platform, g.category, ideaText(i), '']));
      else if (g.type === 'clusters') g.items.forEach((c) => c.terms.forEach((t) => rows.push([card.platform, 'Cluster - ' + c.name, t, ''])));
      else if (g.type === 'threads') g.items.forEach((t) => rows.push([g.platform || card.platform, g.category, t.title, t.url || '']));
      else g.items.forEach((s) => rows.push([card.platform, g.category, s, '']));
    }));
    return '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
  }
  const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 60) || 'scan';

  $('sr-copy-all').addEventListener('click', () => { if (current) copyText(toMarkdown(), 'Copied all results as Markdown'); });
  $('sr-export').addEventListener('click', () => {
    if (!current) return;
    const blob = new Blob([toCsv()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = el('a');
    a.href = url;
    a.download = 'search-radar-' + slugify(current.data.seed) + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('CSV downloaded');
  });

  // ── SCAN ────────────────────────────────────────────────────────────────
  function validate(seed) {
    if (seed.length < 2) return 'Enter a seed of at least 2 characters.';
    if (seed.length > 80) return 'Keep the seed under 80 characters.';
    return '';
  }
  async function fetchScan(seed, country, cacheOnly) {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 900));
      return { status: 200, data: mockResponse(seed, country, MOCK === 'hn-down') };
    }
    // A fresh scan with the AI step takes 10-20s; give up at 45s rather than hang.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    let res;
    try {
      res = await fetch(WORKER_URL + '/?seed=' + encodeURIComponent(seed) + '&country=' + encodeURIComponent(country) +
        (cacheOnly ? '&cacheOnly=1' : ''), { signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    return { status: res.status, data };
  }
  function updateUrl(seed, country) {
    try {
      const p = new URLSearchParams();
      p.set('q', seed);
      p.set('country', country);
      if (MOCK) p.set('mock', MOCK);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }
  async function scan() {
    if (busy) return;
    const seed = seedInput.value.replace(/\s+/g, ' ').trim();
    const country = isRegion(countrySel.value) ? countrySel.value : 'gb';
    const err = validate(seed);
    if (err) {
      seedInput.setAttribute('aria-invalid', 'true');
      setStatus(err, true);
      seedInput.focus();
      return;
    }
    seedInput.removeAttribute('aria-invalid');
    try { localStorage.setItem(STORE_KEY, country); } catch (e) { /* ignore */ }

    busy = true;
    scanSeq++;
    scanBtn.disabled = true;
    setStatus('Scanning Google, YouTube, Reddit, Hacker News and LinkedIn for "' + seed + '"… The AI step can take 10-20 seconds.');
    setPlatforms(null);
    notesEl.hidden = true;
    resultsEl.hidden = false;
    summaryEl.hidden = true;
    gridEl.setAttribute('aria-busy', 'true');
    renderSkeleton();

    try {
      const { status, data } = await fetchScan(seed, country);
      if (status === 429 || (data && data.error === 'rate_limit')) {
        failed();
        setStatus("That's your 20 fresh scans used for today. Repeat scans of a cached seed still work. Want more?", true, 'Get in touch on LinkedIn', LINKEDIN);
        return;
      }
      if (!data || !data.success) {
        failed();
        setStatus((data && typeof data.error === 'string' && data.error) || 'Something went wrong. Please try again.', true);
        return;
      }
      showData(data, seed, country);
    } catch (e) {
      failed();
      setStatus('Network error. Check your connection and try again.', true);
    } finally {
      busy = false;
      scanBtn.disabled = false;
      gridEl.removeAttribute('aria-busy');
    }
  }
  function showData(data, seed, country) {
    data.seed = typeof data.seed === 'string' && data.seed ? data.seed : seed;
    data.country = isRegion(data.country) ? data.country : country;
    resultsEl.hidden = false;
    setPlatforms(data.sources || {});
    renderResults(data);
    updateUrl(data.seed, data.country);
    setStatus((MOCK ? 'Mock data loaded (sample for n8n automation). ' : '') +
      'Scan complete' + (data.cached ? ' (cached)' : '') + '. Click any term to copy it.');
  }
  // Shared link (?q=): show a cached copy if the worker has one, but never start a
  // fresh (rate-limited, paid) scan until the visitor presses Scan.
  async function loadShared(seed, country) {
    const seq = scanSeq;
    const askToScan = () => {
      if (seq !== scanSeq) return;
      setStatus('Press Scan to run this search.');
      scanBtn.focus();
    };
    try {
      const { status, data } = await fetchScan(seed, country, true);
      if (seq !== scanSeq) return;   // the visitor started a scan meanwhile
      if (status === 200 && data && data.success) showData(data, seed, country);
      else askToScan();
    } catch (e) {
      askToScan();
    }
  }
  function failed() {
    // Restore the previous scan (if any) instead of leaving skeletons on screen
    gridEl.textContent = '';
    resultsEl.hidden = !current;
    if (current) renderResults(current.data);
    platformsEl.hidden = true;
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); scan(); });
  document.querySelectorAll('.sr-example').forEach((b) => b.addEventListener('click', () => {
    seedInput.value = b.dataset.seed;
    scan();
  }));
  seedInput.addEventListener('input', () => seedInput.removeAttribute('aria-invalid'));

  // ── INIT ────────────────────────────────────────────────────────────────
  (function init() {
    let region = params.get('country');
    if (!isRegion(region)) {
      try { region = localStorage.getItem(STORE_KEY); } catch (e) { region = null; }
    }
    if (isRegion(region)) countrySel.value = region;
    const q = (params.get('q') || '').trim() || (MOCK ? 'n8n automation' : '');
    if (q) {
      seedInput.value = q.slice(0, 80);
      const seed = seedInput.value.replace(/\s+/g, ' ').trim();
      if (validate(seed)) return;
      if (MOCK) scan();                              // mock mode keeps auto-running
      else if (!navigator.webdriver) loadShared(seed, isRegion(countrySel.value) ? countrySel.value : 'gb');
      // automated browsers (navigator.webdriver) just get the prefilled form
    }
  })();
})();
