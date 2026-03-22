const projects = [
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
const grid = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');
const resultsMeta = document.getElementById('resultsMeta');

console.log('index.js running. grid:', grid, 'emptyState:', emptyState);

function buildCard(project, delay) {
  const isCyan = project.color === 'cyan';
  const colorClass = isCyan ? 'cyan' : 'pink';
  const badgeClass = isCyan ? 'badge-cyan' : 'badge-pink';
  const borderClass = isCyan ? 'cyan-card' : 'pink-card';
  const iconColorClass = isCyan ? 'icon-cyan' : 'icon-pink';

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
      <img src="${project.img}" alt="${project.title}" loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="card-thumb-fallback" style="display:none; color: var(--${isCyan ? 'secondary' : 'primary'})">
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

// Initial render
projects.forEach((project, i) => {
  grid.appendChild(buildCard(project, 600 + i * 80));
});
grid.appendChild(emptyState);
console.log('Cards appended:', grid.querySelectorAll('.card').length);

// ── FILTER & SEARCH ───────────────────────────────────────────────────────
let activeFilter = 'all';
let searchTerm = '';

function applyFilters() {
  const cards = grid.querySelectorAll('.card:not(#emptyState)');
  let visible = 0;

  cards.forEach(card => {
    const cats = card.dataset.category.split(' ');
    const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
    const matchesSearch =
      !searchTerm ||
      card.dataset.title.includes(searchTerm) ||
      card.dataset.desc.includes(searchTerm);

    if (matchesFilter && matchesSearch) {
      card.classList.remove('card-hidden');
      visible++;
    } else {
      card.classList.add('card-hidden');
    }
  });

  emptyState.style.display = visible === 0 ? 'block' : 'none';

  const total = projects.length;
  resultsMeta.textContent = (activeFilter === 'all' && !searchTerm)
    ? `Showing all ${total} projects`
    : `${visible} of ${total} projects`;
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value.toLowerCase().trim();
  applyFilters();
});

applyFilters();
