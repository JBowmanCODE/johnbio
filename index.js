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
const moreToolsList = document.getElementById('moreToolsList');


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

function buildListRow(project) {
  const colorClass = project.color === 'cyan' ? 'cyan' : project.color === 'green' ? 'green' : 'pink';
  const row = document.createElement('a');
  row.href = project.href;
  row.className = 'tool-list-row';
  row.dataset.category = Array.isArray(project.category) ? project.category.join(' ') : project.category;
  row.dataset.title = project.title.toLowerCase();
  row.dataset.desc = project.desc.toLowerCase();
  row.innerHTML = `
    <span class="tool-row-badge badge-${colorClass}">${project.badge}</span>
    <span class="tool-row-name">${project.title}</span>
    <span class="tool-row-desc">${project.desc}</span>
    <span class="material-symbols-outlined tool-row-arrow">arrow_forward</span>
  `;
  return row;
}

// Initial render — featured as cards, rest as list rows
let cardDelay = 600;
projects.forEach((project) => {
  if (project.featured) {
    grid.appendChild(buildCard(project, cardDelay));
    cardDelay += 80;
  } else {
    moreToolsList.appendChild(buildListRow(project));
  }
});
grid.appendChild(emptyState);

// ── FILTER & SEARCH ───────────────────────────────────────────────────────
let activeFilter = 'all';
let searchTerm = '';

function applyFilters() {
  // Featured cards
  const cards = grid.querySelectorAll('.card:not(#emptyState)');
  let visibleFeatured = 0;
  cards.forEach(card => {
    const cats = card.dataset.category.split(' ');
    const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
    const matchesSearch = !searchTerm || card.dataset.title.includes(searchTerm) || card.dataset.desc.includes(searchTerm);
    if (matchesFilter && matchesSearch) {
      card.classList.remove('card-hidden');
      visibleFeatured++;
    } else {
      card.classList.add('card-hidden');
    }
  });

  // List rows
  const rows = moreToolsList.querySelectorAll('.tool-list-row');
  let visibleMore = 0;
  rows.forEach(row => {
    const cats = row.dataset.category.split(' ');
    const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
    const matchesSearch = !searchTerm || row.dataset.title.includes(searchTerm) || row.dataset.desc.includes(searchTerm);
    if (matchesFilter && matchesSearch) {
      row.classList.remove('row-hidden');
      visibleMore++;
    } else {
      row.classList.add('row-hidden');
    }
  });

  // More Tools section visibility + count
  const moreSection = document.getElementById('moreToolsSection');
  const moreCount = document.getElementById('moreToolsCount');
  moreSection.style.display = visibleMore > 0 ? '' : 'none';
  moreCount.textContent = `(${visibleMore})`;

  // Auto-expand when filter/search is active
  if (activeFilter !== 'all' || searchTerm) {
    moreToolsList.classList.add('open');
    document.getElementById('moreToolsToggle').classList.add('open');
  }

  emptyState.style.display = (visibleFeatured === 0 && visibleMore === 0) ? 'block' : 'none';

  const total = projects.length;
  const visible = visibleFeatured + visibleMore;
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

document.getElementById('moreToolsToggle').addEventListener('click', () => {
  const toggle = document.getElementById('moreToolsToggle');
  const isOpen = moreToolsList.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value.toLowerCase().trim();
  applyFilters();
});

applyFilters();
