const WORKER_URL = 'https://prompt-improver-worker.ukjbowman.workers.dev';

const tabImprove = document.getElementById('tab-improve');
const tabLibrary = document.getElementById('tab-library');
const panelImprove = document.getElementById('panel-improve');
const panelLibrary = document.getElementById('panel-library');
const inputEl  = document.getElementById('pi-input');
const modelEl  = document.getElementById('pi-model');
const styleEl  = document.getElementById('pi-style');
const generateBtn = document.getElementById('pi-generate');
const statusEl = document.getElementById('pi-status');
const outputCard = document.getElementById('pi-output');
const improvedEl = document.getElementById('pi-improved');
const changesEl  = document.getElementById('pi-changes-list');
const copyBtn    = document.getElementById('pi-copy');
const libraryEl  = document.getElementById('pi-library');

// ── LIBRARY ──────────────────────────────────────────────────────────────
const LIBRARY = [
  {
    title: 'Article summariser',
    desc: 'Turn any long article into a 5-bullet summary.',
    prompt: 'Summarise the following article in exactly 5 bullet points. Focus on the most surprising or actionable points, not a blow-by-blow recap.\n\nArticle: [paste here]',
  },
  {
    title: 'Cold outreach email',
    desc: 'Short, specific sales email that does not read like spam.',
    prompt: 'Write a cold outreach email to a [job title] at a [company type]. Offer: [what you sell]. Tone: direct, human, under 90 words. Include a specific reason we are contacting this company, not a generic opener. End with one clear ask.',
  },
  {
    title: 'Code review',
    desc: 'Structured feedback on a code snippet.',
    prompt: 'Review the following code. Return three sections:\n1. Bugs or correctness issues\n2. Readability and naming\n3. Suggested refactors with short examples\n\nBe direct. Do not restate what the code does.\n\nCode:\n[paste here]',
  },
  {
    title: 'SEO content brief',
    desc: 'Brief for a writer, targeting a single keyword.',
    prompt: 'Create an SEO content brief for the keyword "[keyword]". Include: target intent, suggested title, meta description, H2 structure (5–8 headings phrased as real questions), entities to mention, internal links to include, and a word count target.',
  },
  {
    title: 'Meeting notes',
    desc: 'Turn a transcript into actions and decisions.',
    prompt: 'Summarise the following meeting transcript into two sections: Decisions made, Action items (with owner and deadline). Ignore small talk. Do not invent owners or deadlines that were not stated.\n\nTranscript:\n[paste here]',
  },
  {
    title: 'Product description',
    desc: 'Ecommerce copy that sells without fluff.',
    prompt: 'Write a product description for [product]. Audience: [audience]. 80–120 words. Lead with the benefit, not the feature. Include one sensory detail. End with a short, confident call to action. No banned words: unlock, revolutionary, seamlessly, cutting-edge.',
  },
  {
    title: 'Explain like I am 12',
    desc: 'Make a complex topic readable for a young teen.',
    prompt: 'Explain [topic] to a smart 12-year-old. Use one concrete analogy they would recognise. Max 150 words. Do not talk down to them.',
  },
  {
    title: 'Interview questions',
    desc: 'Role-specific interview questions that go beyond cliches.',
    prompt: 'Generate 8 interview questions for a [role] role. Skip the cliches (strengths, weaknesses, 5-year plan). Each question should test either real-world problem solving or how the candidate handles ambiguity. Add a short note on what a strong answer looks like.',
  },
];

LIBRARY.forEach(item => {
  const card = document.createElement('button');
  card.className = 'pi-lib-card';
  card.innerHTML = `
    <span class="pi-lib-card-title"></span>
    <span class="pi-lib-card-desc"></span>
  `;
  card.querySelector('.pi-lib-card-title').textContent = item.title;
  card.querySelector('.pi-lib-card-desc').textContent = item.desc;
  card.addEventListener('click', () => {
    inputEl.value = item.prompt;
    switchTab('improve');
    inputEl.focus();
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  libraryEl.appendChild(card);
});

// ── TABS ─────────────────────────────────────────────────────────────────
let activeTab = 'improve';
function switchTab(tab) {
  activeTab = tab;
  tabImprove.classList.toggle('active', tab === 'improve');
  tabLibrary.classList.toggle('active', tab === 'library');
  tabImprove.setAttribute('aria-selected', tab === 'improve');
  tabLibrary.setAttribute('aria-selected', tab === 'library');
  panelImprove.style.display = tab === 'improve' ? '' : 'none';
  panelLibrary.style.display = tab === 'library' ? '' : 'none';
}
tabImprove.addEventListener('click', () => switchTab('improve'));
tabLibrary.addEventListener('click', () => switchTab('library'));
[tabImprove, tabLibrary].forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      switchTab(activeTab === 'improve' ? 'library' : 'improve');
    }
  });
});

// ── GENERATE ─────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  statusEl.className = 'pi-status';
  outputCard.style.display = 'none';

  const prompt = inputEl.value.trim();
  if (prompt.length < 10) {
    setStatus('Paste a prompt (at least a short sentence).', true);
    inputEl.focus();
    return;
  }
  if (prompt.length > 5000) {
    setStatus('Prompt is too long. Keep it under 5,000 characters.', true);
    return;
  }

  generateBtn.disabled = true;
  setStatus('Rewriting your prompt…');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        target: modelEl.value,
        style: styleEl.value,
      }),
    });
    const data = await res.json();

    if (res.status === 429 || data.error === 'rate_limit') {
      setStatus(
        "That's your 3 free rewrites used up for today. Want more? " +
        "<a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>.",
        true
      );
      return;
    }

    if (!data.success) {
      setStatus(data.error || 'Something went wrong. Please try again.', true);
      return;
    }

    renderResult(data.result);
    outputCard.style.display = '';
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setStatus('');
  } catch {
    setStatus('Network error — please check your connection and try again.', true);
  } finally {
    generateBtn.disabled = false;
  }
});

function setStatus(msg, isError = false) {
  statusEl.innerHTML = msg;
  statusEl.className = 'pi-status' + (isError ? ' error' : '');
}

function renderResult(result) {
  improvedEl.textContent = result.improved || '';
  changesEl.innerHTML = '';
  const changes = Array.isArray(result.changes) ? result.changes : [];
  if (changes.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No notable changes — the original was already strong.';
    changesEl.appendChild(li);
  } else {
    changes.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      changesEl.appendChild(li);
    });
  }
}

// ── COPY ─────────────────────────────────────────────────────────────────
copyBtn.addEventListener('click', async () => {
  const text = improvedEl.textContent;
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
