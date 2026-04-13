const WORKER_URL = 'https://faq-schema-worker.ukjbowman.workers.dev';

const tabManual = document.getElementById('tab-manual');
const tabAi     = document.getElementById('tab-ai');
const panelManual = document.getElementById('panel-manual');
const panelAi     = document.getElementById('panel-ai');
const qaList   = document.getElementById('fsg-qa-list');
const addBtn   = document.getElementById('fsg-add');
const topicInput = document.getElementById('fsg-topic');
const generateBtn = document.getElementById('fsg-generate');
const statusEl = document.getElementById('fsg-status');
const outputCard = document.getElementById('fsg-output');
const contentEl  = document.getElementById('fsg-content');
const copyBtn    = document.getElementById('fsg-copy');
const validateBtn = document.getElementById('fsg-validate');

let activeTab = 'manual';

// ── TABS ─────────────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  tabManual.classList.toggle('active', tab === 'manual');
  tabAi.classList.toggle('active', tab === 'ai');
  tabManual.setAttribute('aria-selected', tab === 'manual');
  tabAi.setAttribute('aria-selected', tab === 'ai');
  panelManual.style.display = tab === 'manual' ? '' : 'none';
  panelAi.style.display     = tab === 'ai' ? '' : 'none';
}
tabManual.addEventListener('click', () => switchTab('manual'));
tabAi.addEventListener('click', () => switchTab('ai'));
[tabManual, tabAi].forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      switchTab(activeTab === 'manual' ? 'ai' : 'manual');
    }
  });
});

// ── QA ROWS ──────────────────────────────────────────────────────────────
let rowSeq = 0;
function addRow(q = '', a = '') {
  rowSeq++;
  const id = `qa-${rowSeq}`;
  const row = document.createElement('div');
  row.className = 'fsg-qa-row';
  row.dataset.id = id;
  row.innerHTML = `
    <span class="fsg-qa-num">Question</span>
    <button class="fsg-qa-remove" aria-label="Remove question">
      <span class="material-symbols-outlined" aria-hidden="true">close</span>
    </button>
    <input type="text" class="fsg-qa-q" placeholder="What is X?" aria-label="Question">
    <textarea class="fsg-qa-a" placeholder="A short, direct answer. 1–3 sentences." aria-label="Answer"></textarea>
  `;
  row.querySelector('.fsg-qa-q').value = q;
  row.querySelector('.fsg-qa-a').value = a;
  row.querySelector('.fsg-qa-remove').addEventListener('click', () => {
    row.remove();
    renumber();
    if (qaList.children.length === 0) addRow();
  });
  qaList.appendChild(row);
  renumber();
}
function renumber() {
  qaList.querySelectorAll('.fsg-qa-row').forEach((row, i) => {
    row.querySelector('.fsg-qa-num').textContent = `Question ${i + 1}`;
  });
}
addBtn.addEventListener('click', () => addRow());

// Start with two empty rows
addRow();
addRow();

// ── GENERATE ─────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  statusEl.className = 'fsg-status';
  outputCard.style.display = 'none';

  if (activeTab === 'manual') {
    const pairs = collectManualPairs();
    if (pairs.length === 0) {
      setStatus('Add at least one question and answer.', true);
      return;
    }
    const invalid = pairs.find(p => !p.q || !p.a);
    if (invalid) {
      setStatus('Every row needs both a question and an answer.', true);
      return;
    }
    renderSchema(pairs);
    return;
  }

  // AI mode
  const topic = topicInput.value.trim();
  if (topic.length < 5) {
    setStatus('Enter a topic or URL (at least a few words).', true);
    topicInput.focus();
    return;
  }

  generateBtn.disabled = true;
  setStatus('Drafting your FAQ with AI…');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();

    if (res.status === 429 || data.error === 'rate_limit') {
      setStatus(
        "That's your 3 free AI drafts used up for today. Want more? " +
        "<a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>.",
        true
      );
      return;
    }

    if (!data.success) {
      setStatus(data.error || 'Something went wrong. Please try again.', true);
      return;
    }

    const pairs = Array.isArray(data.pairs) ? data.pairs : [];
    if (pairs.length === 0) {
      setStatus('No questions returned. Try a more specific topic.', true);
      return;
    }

    // Push AI pairs back into the manual builder so the user can tweak them
    qaList.innerHTML = '';
    pairs.forEach(p => addRow(p.q, p.a));
    switchTab('manual');
    renderSchema(pairs);
    setStatus('Draft loaded. Edit the questions above, then regenerate if needed.');
  } catch {
    setStatus('Network error — please check your connection and try again.', true);
  } finally {
    generateBtn.disabled = false;
  }
});

function collectManualPairs() {
  return Array.from(qaList.querySelectorAll('.fsg-qa-row')).map(row => ({
    q: row.querySelector('.fsg-qa-q').value.trim(),
    a: row.querySelector('.fsg-qa-a').value.trim(),
  })).filter(p => p.q || p.a);
}

function setStatus(msg, isError = false) {
  statusEl.innerHTML = msg;
  statusEl.className = 'fsg-status' + (isError ? ' error' : '');
}

// ── RENDER SCHEMA ────────────────────────────────────────────────────────
function renderSchema(pairs) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(p => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: p.a,
      },
    })),
  };
  const json = JSON.stringify(schema, null, 2);
  const wrapped = `<script type="application/ld+json">\n${json}\n<\/script>`;
  contentEl.textContent = wrapped;
  outputCard.style.display = '';
  outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setStatus('');
}

// ── COPY ─────────────────────────────────────────────────────────────────
copyBtn.addEventListener('click', async () => {
  const text = contentEl.textContent;
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

// ── VALIDATE ─────────────────────────────────────────────────────────────
validateBtn.addEventListener('click', () => {
  window.open('https://search.google.com/test/rich-results', '_blank', 'noopener');
});
