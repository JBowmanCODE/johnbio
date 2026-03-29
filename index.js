const projects = [
  {
    id: 'igaming-compliance',
    featured: true,
    title: 'iGaming Compliance Map',
    desc: 'Interactive world map of 203 iGaming regulations across 60+ jurisdictions. Browse gambling laws, AML directives, data protection rules and advertising codes by country.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['public', 'gavel'],
    href: 'https://johnb.io/igaming-compliance',
    img: '/images/iGaming_regulatory_compliance_map.webp',
    thumbIcon: 'public',
  },
  {
    id: 'content-repurposer',
    featured: true,
    title: 'Content Repurposer',
    desc: 'Paste any content and get it instantly rewritten for LinkedIn, X, Facebook, email newsletters, and 10 and 30-second video scripts.',
    category: 'digital',
    badge: 'DIGITAL AI',
    color: 'green',
    icons: ['recycling', 'campaign'],
    href: 'https://johnb.io/content-repurposer',
    img: '/images/content-repurposer.webp',
    thumbIcon: 'recycling',
  },
  {
    id: 'ai-cv-enhancer',
    title: 'AI CV Enhancer',
    desc: 'Ethical AI suite that optimises resumes for ATS without introducing bias. Part of AI CV Suite.',
    category: 'ai',
    badge: 'AI PROJECT',
    color: 'cyan',
    icons: ['badge', 'analytics'],
    href: 'https://johnb.io/aitocv',
    img: '/images/ai-cv-enhancer.webp',
    thumbIcon: 'badge',
  },
  {
    id: 'llm-chat',
    featured: true,
    title: 'LLM Chat',
    desc: 'Unified interface for interacting with multiple open-source large language models with persistent history.',
    category: 'ai',
    badge: 'AI PROJECT',
    color: 'cyan',
    icons: ['forum', 'smart_toy'],
    href: 'https://johnb.io/lm-chat',
    img: '/images/llm-chat.webp',
    thumbIcon: 'forum',
  },
  {
    id: 'yt-transcripts',
    title: 'YouTube Transcripts',
    desc: 'Neural network powered extraction of accurate video transcripts with multi-language support.',
    category: 'ai',
    badge: 'AI PROJECT',
    color: 'cyan',
    icons: ['code', 'psychology'],
    href: 'https://johnb.io/transcripts',
    img: '/images/yt-transcripts.webp',
    thumbIcon: 'smart_display',
  },
  {
    id: 'governance-framework',
    title: 'Governance Framework',
    desc: 'Responsible AI framework for ethical model deployment, monitoring, and compliance tracking.',
    category: ['ai', 'rai'],
    badge: 'RESPONSIBLE AI',
    color: 'cyan',
    icons: ['account_balance', 'gavel'],
    href: 'https://johnb.io/rai',
    img: '/images/governance-framework.webp',
    thumbIcon: 'account_balance',
  },
  {
    id: 'zig-zag-slot',
    title: 'Zig Zag Drop Slot',
    desc: 'Physics-based automation script for randomised UI interaction testing and mystery drop mechanics.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['grid_view', 'precision_manufacturing'],
    href: 'https://johnb.io/zzmystery',
    img: '/images/zig-zag-slot.webp',
    thumbIcon: 'grid_view',
  },
  {
    id: 'poker-bankroll',
    title: 'Poker Bankroll',
    desc: 'Statistical analysis tool for tracking and optimising long-term professional poker earnings and variance.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['casino', 'monitoring'],
    href: 'https://johnb.io/bankroll',
    img: '/images/poker-bankroll.webp',
    thumbIcon: 'casino',
  },
  {
    id: 'ai-copyeditor',
    featured: true,
    title: 'AI Copyeditor',
    desc: 'A real-time rich text environment with built-in AI writing assistance and stylistic refinement.',
    category: 'ai',
    badge: 'AI PROJECT',
    color: 'cyan',
    icons: ['edit_note', 'auto_fix'],
    href: 'https://johnb.io/editor',
    img: '/images/ai-copyeditor.webp',
    thumbIcon: 'edit_note',
  },
  {
    id: 'bill-calculator',
    title: 'Bill Calculator',
    desc: 'Smart utility for splitting complex expenses with multi-currency support and tax calculations.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['calculate', 'payments'],
    href: 'https://johnb.io/calculator',
    img: '/images/bill-calculator.webp',
    thumbIcon: 'calculate',
  },
  {
    id: 'ebay-tracker',
    title: 'eBay Tracker',
    desc: 'Scraper and analyser for real-time market value assessments on auction platforms with historical data.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['shopping_cart', 'query_stats'],
    href: 'https://johnb.io/ebay',
    img: '/images/ebay-tracker.webp',
    thumbIcon: 'shopping_cart',
  },
  {
    id: 'genz-translator',
    title: 'Gen Z Translator',
    desc: 'NLP model that maps formal professional language to current Gen Z slang and vice versa.',
    category: 'ai',
    badge: 'AI PROJECT',
    color: 'cyan',
    icons: ['translate', 'chat'],
    href: 'https://johnb.io/genz',
    img: '/images/genz-translator.webp',
    thumbIcon: 'translate',
  },
  {
    id: 'bonus-calculator',
    title: 'Bonus Cost Calculator',
    desc: 'Model the true cost of casino bonus offers. Enter wagering requirement, house edge and completion rate to get net operator cost and breakeven analysis.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['calculate', 'casino'],
    href: 'https://johnb.io/bonus-calculator',
    img: '/images/bonus-calculator.webp',
    thumbIcon: 'calculate',
  },
  {
    id: 'rg-generator',
    title: 'RG Message Generator',
    desc: 'Generate compliant responsible gambling disclaimers for 10 jurisdictions. Copy-paste disclaimer text, required logos, helpline details and channel-specific guidance.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['shield', 'public'],
    href: 'https://johnb.io/rg-generator',
    img: '/images/rg-generator.webp',
    thumbIcon: 'shield',
  },
  {
    id: 'igaming-jargon',
    title: 'iGaming Jargon Translator',
    desc: 'Translate iGaming industry terms to plain English — or plain English to industry speak. AI-powered translation for operators, affiliates and new starters.',
    category: 'digital',
    badge: 'DIGITAL AI',
    color: 'green',
    icons: ['translate', 'casino'],
    href: 'https://johnb.io/igaming-jargon',
    img: '/images/igaming-jargon.webp',
    thumbIcon: 'translate',
  },
  {
    id: 'promo-copy',
    title: 'iGaming Promo Copy Generator',
    desc: 'Generate compliant promotional copy for 10 regulated iGaming markets. AI-written headlines, body copy, CTAs and market-specific disclaimers.',
    category: 'digital',
    badge: 'DIGITAL AI',
    color: 'green',
    icons: ['auto_awesome', 'casino'],
    href: 'https://johnb.io/promo-copy',
    img: '/images/promo-copy.webp',
    thumbIcon: 'auto_awesome',
  },
  {
    id: 'text-to-voice',
    title: 'Text to Voice',
    desc: 'Naturalistic speech synthesis utility leveraging generative adversarial networks for lifelike audio.',
    category: 'dev',
    badge: 'DEV TOOL',
    color: 'pink',
    icons: ['record_voice_over', 'javascript'],
    href: 'https://johnb.io/text-to-voice',
    img: '/images/text-to-voice.webp',
    thumbIcon: 'record_voice_over',
  },
];

// ── RENDER ────────────────────────────────────────────────────────────────
const INITIAL_SHOW = 6;
const grid = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');
const resultsMeta = document.getElementById('resultsMeta');
let showAll = false;


function buildCard(project, delay) {
  const colorMap = { cyan: 'cyan', pink: 'pink', green: 'green' };
  const colorClass = colorMap[project.color] || 'cyan';
  const badgeClass = `badge-${colorClass}`;
  const borderClass = `${colorClass}-card`;
  const iconColorClass = `icon-${colorClass}`;

  const card = document.createElement('div');
  card.className = `card ${borderClass}`;
  card.dataset.category = Array.isArray(project.category) ? project.category.join(' ') : project.category;
  card.dataset.title = project.title.toLowerCase();
  card.dataset.desc = project.desc.toLowerCase();
  card.style.animationDelay = `${delay}ms`;
  card.id = `card-${project.id}`;

  const iconsHtml = project.icons.map(icon =>
    `<span class="material-symbols-outlined ${iconColorClass}">${icon}</span>`
  ).join('');

  card.innerHTML = `
    <a href="${project.href}" target="_self" class="card-thumb">
      <img src="${project.img}" alt="${project.title}" loading="lazy" width="400" height="240"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="card-thumb-fallback" style="display:none; color: var(--${colorClass === 'cyan' ? 'secondary' : colorClass === 'green' ? 'secondary' : 'primary'})">
        <span class="material-symbols-outlined">${project.thumbIcon}</span>
        <span class="label">${project.title}</span>
      </div>
      <span class="card-badge ${badgeClass}">${project.badge}</span>
    </a>
    <div class="card-body">
      <h3 class="card-title ${colorClass}">${project.title}</h3>
      <p class="card-desc">${project.desc}</p>
      <div class="card-footer">
        <div class="card-icons">${iconsHtml}</div>
        <a class="card-link ${colorClass}" href="${project.href}" target="_self">
          View Project
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </div>
  `;
  return card;
}

// Initial render — all as cards, cards beyond INITIAL_SHOW start collapsed
let cardDelay = 600;
projects.forEach((project, i) => {
  const card = buildCard(project, cardDelay);
  if (i >= INITIAL_SHOW) card.classList.add('card-collapsed');
  grid.appendChild(card);
  cardDelay += 80;
});
grid.appendChild(emptyState);

// ── FILTER & SEARCH ───────────────────────────────────────────────────────
let activeFilter = 'all';
let searchTerm = '';

function applyFilters() {
  const cards = Array.from(grid.querySelectorAll('.card:not(#emptyState)'));
  const filterActive = activeFilter !== 'all' || searchTerm;
  let visibleCount = 0;
  let collapsedCount = 0;

  cards.forEach((card, i) => {
    const cats = card.dataset.category.split(' ');
    const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
    const matchesSearch = !searchTerm || card.dataset.title.includes(searchTerm) || card.dataset.desc.includes(searchTerm);
    const matches = matchesFilter && matchesSearch;
    const beyondInitial = i >= INITIAL_SHOW;

    if (!matches) {
      card.classList.add('card-hidden');
      card.classList.remove('card-collapsed');
    } else if (beyondInitial && !showAll && !filterActive) {
      card.classList.remove('card-hidden');
      card.classList.add('card-collapsed');
      collapsedCount++;
    } else {
      card.classList.remove('card-hidden');
      card.classList.remove('card-collapsed');
      visibleCount++;
    }
  });

  // Show-more button
  const showMoreWrap = document.getElementById('showMoreWrap');
  const showMoreLabel = document.getElementById('showMoreLabel');
  if (!showAll && !filterActive && collapsedCount > 0) {
    showMoreWrap.style.display = '';
    showMoreLabel.textContent = `Show ${collapsedCount} more`;
  } else {
    showMoreWrap.style.display = 'none';
  }

  emptyState.style.display = (visibleCount === 0 && collapsedCount === 0) ? 'block' : 'none';

  const total = projects.length;
  resultsMeta.textContent = filterActive
    ? `${visibleCount} of ${total} projects`
    : `Showing all ${total} projects`;
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

document.getElementById('showMoreBtn').addEventListener('click', () => {
  showAll = true;
  applyFilters();
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value.toLowerCase().trim();
  applyFilters();
});

applyFilters();
