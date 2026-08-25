const WORKER_URL = 'https://recipe-shopping-list-worker.ukjbowman.workers.dev';
const MIN_CHARS  = 40;
const MAX_CHARS  = 12000;
const WARN_CHARS = 11000;

// Supermarket walk order — also the grouping order in the rendered list.
const AISLE_ORDER = [
  'Fruit & Veg', 'Bakery', 'Meat & Fish', 'Dairy & Eggs', 'Chilled & Deli',
  'Frozen', 'Tins, Jars & Packets', 'Rice, Pasta & Grains',
  'Herbs, Spices & Seasoning', 'Oils, Vinegars & Condiments',
  'Baking', 'Drinks', 'Household', 'Other',
];

// One shared encoder for all eight. The `/` replace matters because two of
// these put the term in a path segment, where a %2F can 404 on some CDNs.
const term = t => encodeURIComponent(String(t).trim().replace(/\//g, ' ').replace(/\s+/g, ' '));

// `url` is a function, not a template string, so the scheme and host are always
// hardcoded literals — model output can only ever reach the encoded tail.
// `dark: true` means the brand colour is light enough to need dark pill text.
const RETAILERS = [
  { id: 'tesco',      name: 'Tesco',       colour: '#00539F',
    url: t => `https://www.tesco.com/groceries/en-GB/search?query=${term(t)}` },
  { id: 'sainsburys', name: "Sainsbury's", colour: '#F06C00', dark: true,
    url: t => `https://www.sainsburys.co.uk/gol-ui/SearchResults/${term(t)}` },
  { id: 'asda',       name: 'Asda',        colour: '#68A51C', dark: true,
    url: t => `https://groceries.asda.com/search/${term(t)}` },
  { id: 'morrisons',  name: 'Morrisons',   colour: '#007A3D',
    url: t => `https://groceries.morrisons.com/search?q=${term(t)}` },
  { id: 'ocado',      name: 'Ocado',       colour: '#7A2D8C', sub: 'incl. M&S Food',
    url: t => `https://www.ocado.com/search?q=${term(t)}` },
  { id: 'waitrose',   name: 'Waitrose',    colour: '#5C8A2E',
    url: t => `https://www.waitrose.com/ecom/shop/search?searchTerm=${term(t)}` },
  { id: 'iceland',    name: 'Iceland',     colour: '#C8102E',
    url: t => `https://www.iceland.co.uk/search/?q=${term(t)}` },
  { id: 'coop',       name: 'Co-op',       colour: '#00B1E7', dark: true,
    url: t => `https://shop.coop.co.uk/search?term=${term(t)}`,
    caveat: 'Co-op delivery is store-scoped, so you may be asked for a postcode before the search runs. The range is smaller than the other supermarkets here.' },
];

const MODES = ['balanced', 'premium', 'value'];

const inputEl     = document.getElementById('rsl-input');
const countEl     = document.getElementById('rsl-count');
const generateBtn = document.getElementById('rsl-generate');
const statusEl    = document.getElementById('rsl-status');
const outputCard  = document.getElementById('rsl-output');
const summaryEl   = document.getElementById('rsl-summary');
const retailersEl = document.getElementById('rsl-retailers');
const modesEl     = document.getElementById('rsl-modes');
const caveatEl    = document.getElementById('rsl-caveat');
const servingsWrap = document.getElementById('rsl-servings-wrap');
const servingsEl  = document.getElementById('rsl-servings');
const servingsBase = document.getElementById('rsl-servings-base');
const staplesEl   = document.getElementById('rsl-hide-staples');
const listEl      = document.getElementById('rsl-list');
const unmatchedEl = document.getElementById('rsl-unmatched');
const progressEl  = document.getElementById('rsl-progress');
const copyBtn     = document.getElementById('rsl-copy');

let listData   = null;
let mode       = 'balanced';
let servings   = null;   // null when scaling is not offered
let retailerId = localStorage.getItem('rsl:retailer') || 'tesco';
if (!RETAILERS.some(r => r.id === retailerId)) retailerId = 'tesco';

// ── CHAR COUNTER ─────────────────────────────────────────────────────────
inputEl.addEventListener('input', () => {
  const len = inputEl.value.length;
  countEl.textContent = `${len.toLocaleString()} / ${MAX_CHARS.toLocaleString()}`;
  countEl.classList.toggle('warn', len > WARN_CHARS);
});

// ── RETAILER PILLS ───────────────────────────────────────────────────────
RETAILERS.forEach(r => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rsl-pill';
  btn.dataset.retailer = r.id;
  btn.textContent = r.name;
  if (r.sub) {
    const sub = document.createElement('span');
    sub.className = 'rsl-pill-sub';
    sub.textContent = r.sub;
    btn.appendChild(sub);
  }
  btn.addEventListener('click', () => {
    retailerId = r.id;
    localStorage.setItem('rsl:retailer', r.id);
    paintRetailerPills();
    applyLinks();
  });
  retailersEl.appendChild(btn);
});

function paintRetailerPills() {
  retailersEl.querySelectorAll('.rsl-pill').forEach(btn => {
    const r = RETAILERS.find(x => x.id === btn.dataset.retailer);
    const on = btn.dataset.retailer === retailerId;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    // Brand colour is a pill background only, never text on the dark surface.
    btn.style.background = on ? r.colour : '';
    btn.style.borderColor = on ? r.colour : '';
    btn.style.color = on ? (r.dark ? '#0e0e13' : '#ffffff') : '';
  });

  const active = RETAILERS.find(r => r.id === retailerId);
  if (active && active.caveat) {
    caveatEl.textContent = active.caveat;
    caveatEl.style.display = '';
  } else {
    caveatEl.style.display = 'none';
  }
}

// ── MODE PILLS ───────────────────────────────────────────────────────────
modesEl.querySelectorAll('.rsl-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    mode = MODES.includes(btn.dataset.mode) ? btn.dataset.mode : 'balanced';
    modesEl.querySelectorAll('.rsl-pill').forEach(b => {
      const on = b.dataset.mode === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyLinks();
  });
});

// ── GENERATE ─────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  statusEl.className = 'rsl-status';
  outputCard.style.display = 'none';

  const text = inputEl.value.trim();

  if (text.length < MIN_CHARS) {
    setStatus('Paste a bit more than that — at least a full ingredients list.', true);
    inputEl.focus();
    return;
  }

  if (text.length > MAX_CHARS) {
    setStatus(`Too long. Keep it under ${MAX_CHARS.toLocaleString()} characters.`, true);
    return;
  }

  generateBtn.disabled = true;
  setStatus('Reading your recipes and building the list…');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (res.status === 429 || data.error === 'rate_limit') {
      setStatus(
        "That's your 3 free shopping lists used up for today. Want more? " +
        "<a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>.",
        true
      );
      return;
    }

    if (!data.success) {
      setStatus(data.error || 'Something went wrong. Please try again.', true);
      return;
    }

    renderList(data.result);
    outputCard.style.display = '';
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setStatus('');

  } catch (e) {
    setStatus('Network error — please check your connection and try again.', true);
  } finally {
    generateBtn.disabled = false;
  }
});

function setStatus(msg, isError = false) {
  statusEl.innerHTML = msg;
  statusEl.className = 'rsl-status' + (isError ? ' error' : '');
}

// ── RENDER ───────────────────────────────────────────────────────────────
function renderList(result) {
  listData = result;
  const items = result.items || [];

  // Summary line
  const bits = [];
  if (result.recipes && result.recipes.length) {
    bits.push(result.recipes.length === 1
      ? result.recipes[0]
      : `${result.recipes.length} recipes`);
  }
  bits.push(`${items.length} item${items.length === 1 ? '' : 's'}`);
  if (result.serves) bits.push(`serves ${result.serves}`);
  summaryEl.textContent = bits.join(' · ');

  // Servings scaling is only offered for a single recipe. Across a meal plan a
  // single multiplier is wrong — the recipes have different base servings and
  // the merged quantities can't be attributed back to one of them.
  const single = (!result.recipes || result.recipes.length <= 1) && !!result.serves;
  if (single) {
    servings = result.serves;
    servingsEl.value = String(servings);
    servingsBase.textContent = `recipe serves ${result.serves}`;
    servingsWrap.style.display = '';
  } else {
    servings = null;
    servingsWrap.style.display = 'none';
  }

  // Group by aisle in walk order
  listEl.innerHTML = '';
  const byAisle = new Map();
  items.forEach((item, idx) => {
    const aisle = AISLE_ORDER.includes(item.aisle) ? item.aisle : 'Other';
    if (!byAisle.has(aisle)) byAisle.set(aisle, []);
    byAisle.get(aisle).push({ item, idx });
  });

  AISLE_ORDER.forEach(aisle => {
    const group = byAisle.get(aisle);
    if (!group) return;

    const section = document.createElement('div');
    section.className = 'rsl-aisle';
    section.dataset.aisle = aisle;

    const h = document.createElement('h3');
    h.className = 'rsl-aisle-title';
    h.textContent = aisle;
    section.appendChild(h);

    group.forEach(({ item, idx }) => section.appendChild(buildRow(item, idx)));
    listEl.appendChild(section);
  });

  // Lines the model couldn't turn into a product — shown, not silently dropped.
  const un = result.unmatched || [];
  if (un.length) {
    unmatchedEl.textContent = 'Couldn’t work these out: ' + un.join(' · ');
    unmatchedEl.style.display = '';
  } else {
    unmatchedEl.style.display = 'none';
  }

  restoreTicks();
  paintRetailerPills();
  applyLinks();
  applyStaples();
  updateProgress();
}

function buildRow(item, idx) {
  const row = document.createElement('div');
  row.className = 'rsl-item';
  row.dataset.idx = String(idx);
  if (item.staple) row.classList.add('staple');

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.className = 'rsl-check';
  cb.id = `rsl-i${idx}`;
  cb.addEventListener('change', () => {
    row.classList.toggle('ticked', cb.checked);
    saveTicks();
    updateProgress();
  });

  const main = document.createElement('label');
  main.className = 'rsl-item-main';
  main.htmlFor = cb.id;

  const nameLine = document.createElement('span');
  nameLine.className = 'rsl-item-name';
  nameLine.textContent = item.name;

  const qty = document.createElement('span');
  qty.className = 'rsl-item-qty';
  qty.textContent = formatQty(item);

  const meta = document.createElement('span');
  meta.className = 'rsl-item-meta';
  meta.textContent = buildMeta(item);

  const termLine = document.createElement('span');
  termLine.className = 'rsl-item-term';

  main.append(nameLine, qty, meta, termLine);

  const link = document.createElement('a');
  link.className = 'rsl-shop-link';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const linkText = document.createElement('span');
  linkText.className = 'rsl-shop-link-text';
  const linkIcon = document.createElement('span');
  linkIcon.className = 'material-symbols-outlined';
  linkIcon.setAttribute('aria-hidden', 'true');
  linkIcon.textContent = 'open_in_new';
  link.append(linkText, linkIcon);

  row.append(cb, main, link);
  return row;
}

function buildMeta(item) {
  const bits = [];
  if (item.note) bits.push(item.note);
  if (item.from && item.from.length > 1) bits.push('for ' + item.from.join(', '));
  return bits.join(' · ');
}

// Rescale by target/base servings. Anything without a numeric quantity
// ("a handful", "to taste") is left exactly as the model wrote it.
function formatQty(item) {
  if (item.qty == null) return item.qty_text || '';

  const base = listData && listData.serves ? listData.serves : null;
  const mult = servings && base ? servings / base : 1;
  let q = item.qty * mult;

  const unit = (item.unit || '').toLowerCase();
  if ((unit === 'g' || unit === 'ml') && q >= 20) {
    q = Math.round(q / 5) * 5;
  } else {
    q = Math.round(q * 4) / 4;
  }

  const num = Number(q.toFixed(2));
  return item.unit ? `${num} ${item.unit}` : String(num);
}

// ── LINKS: mutate in place, never rebuild ────────────────────────────────
// Switching retailer or mode rewrites href + label on the existing nodes, so
// tick state survives the switch for free.
function applyLinks() {
  if (!listData) return;
  const r = RETAILERS.find(x => x.id === retailerId) || RETAILERS[0];

  listEl.querySelectorAll('.rsl-item').forEach(row => {
    const item = listData.items[Number(row.dataset.idx)];
    if (!item) return;

    const searchTerm = (item.search && item.search[mode]) || item.search.balanced || item.name;
    const link = row.querySelector('.rsl-shop-link');

    link.href = r.url(searchTerm);
    link.querySelector('.rsl-shop-link-text').textContent = `Search ${r.name}`;
    link.setAttribute('aria-label', `Search ${r.name} for ${searchTerm} (opens in a new tab)`);

    row.querySelector('.rsl-item-term').textContent = `searches “${searchTerm}”`;
  });
}

// ── STAPLES ──────────────────────────────────────────────────────────────
staplesEl.addEventListener('change', applyStaples);

function applyStaples() {
  const hide = staplesEl.checked;
  listEl.querySelectorAll('.rsl-item.staple').forEach(row => {
    row.classList.toggle('hidden-staple', hide);
  });
  // Hide an aisle heading whose every row is now hidden.
  listEl.querySelectorAll('.rsl-aisle').forEach(section => {
    const rows = section.querySelectorAll('.rsl-item');
    const visible = section.querySelectorAll('.rsl-item:not(.hidden-staple)');
    section.classList.toggle('empty', rows.length > 0 && visible.length === 0);
  });
  updateProgress();
}

// ── SERVINGS ─────────────────────────────────────────────────────────────
servingsEl.addEventListener('input', () => {
  const v = parseInt(servingsEl.value, 10);
  if (!Number.isFinite(v) || v < 1) return;
  servings = Math.min(v, 50);
  listEl.querySelectorAll('.rsl-item').forEach(row => {
    const item = listData.items[Number(row.dataset.idx)];
    if (item) row.querySelector('.rsl-item-qty').textContent = formatQty(item);
  });
});

// ── TICK STATE ───────────────────────────────────────────────────────────
// Keyed by a hash of the item names: paste a new recipe, get a new hash, and
// the old ticks are ignored rather than bleeding onto a different list.
function listHash(items) {
  const s = items.map(i => i.name).join('|');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return String(h);
}

function saveTicks() {
  if (!listData) return;
  const ticked = [];
  listEl.querySelectorAll('.rsl-check').forEach((cb, i) => { if (cb.checked) ticked.push(i); });
  try {
    localStorage.setItem('rsl:ticks', JSON.stringify({ hash: listHash(listData.items), ticked }));
  } catch (e) { /* storage full or blocked — ticking still works for this session */ }
}

function restoreTicks() {
  if (!listData) return;
  let saved;
  try { saved = JSON.parse(localStorage.getItem('rsl:ticks') || 'null'); } catch { return; }
  if (!saved || saved.hash !== listHash(listData.items)) return;

  const boxes = listEl.querySelectorAll('.rsl-check');
  (saved.ticked || []).forEach(i => {
    const cb = boxes[i];
    if (cb) {
      cb.checked = true;
      cb.closest('.rsl-item').classList.add('ticked');
    }
  });
}

function updateProgress() {
  const rows = listEl.querySelectorAll('.rsl-item:not(.hidden-staple)');
  const done = listEl.querySelectorAll('.rsl-item:not(.hidden-staple).ticked');
  progressEl.textContent = rows.length ? `${done.length} of ${rows.length}` : '';
}

// ── COPY ─────────────────────────────────────────────────────────────────
// Plain text, grouped by aisle, ticked items dropped, no URLs — the most
// likely next action is pasting this into WhatsApp or Notes.
copyBtn.addEventListener('click', async () => {
  const parts = [];
  listEl.querySelectorAll('.rsl-aisle').forEach(section => {
    const rows = [...section.querySelectorAll('.rsl-item')]
      .filter(r => !r.classList.contains('ticked') && !r.classList.contains('hidden-staple'));
    if (!rows.length) return;

    parts.push(section.dataset.aisle.toUpperCase());
    rows.forEach(r => {
      const name = r.querySelector('.rsl-item-name').textContent;
      const qty  = r.querySelector('.rsl-item-qty').textContent;
      parts.push(qty ? `- ${name} (${qty})` : `- ${name}`);
    });
    parts.push('');
  });

  const text = parts.join('\n').trim() || 'Nothing left to buy.';

  try {
    await navigator.clipboard.writeText(text);
    showCopied();
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopied();
  }
});

function showCopied() {
  copyBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check</span> Copied!';
  copyBtn.classList.add('copied');
  setTimeout(() => {
    copyBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span> Copy';
    copyBtn.classList.remove('copied');
  }, 2200);
}

paintRetailerPills();
