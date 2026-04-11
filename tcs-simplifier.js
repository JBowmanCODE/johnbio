const WORKER_URL = 'https://tcs-simplifier.ukjbowman.workers.dev';
const MAX_CHARS = 12000;
const WARN_CHARS = 11000;

const inputEl    = document.getElementById('tcs-input');
const countEl    = document.getElementById('tcs-count');
const generateBtn = document.getElementById('tcs-generate');
const statusEl   = document.getElementById('tcs-status');
const outputCard = document.getElementById('tcs-output');
const summaryEl  = document.getElementById('tcs-summary');
const flagsEl    = document.getElementById('tcs-flags');
const numbersEl  = document.getElementById('tcs-numbers');
const copyBtn    = document.getElementById('tcs-copy');

// ── CHAR COUNTER ─────────────────────────────────────────────────────────
inputEl.addEventListener('input', () => {
  const len = inputEl.value.length;
  countEl.textContent = `${len.toLocaleString()} / ${MAX_CHARS.toLocaleString()}`;
  countEl.classList.toggle('warn', len > WARN_CHARS);
});

// ── GENERATE ─────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  statusEl.className = 'tcs-status';
  outputCard.style.display = 'none';

  const text = inputEl.value.trim();

  if (text.length < 80) {
    setStatus('Paste a bit more text. You need at least a short bonus description.', true);
    inputEl.focus();
    return;
  }

  if (text.length > MAX_CHARS) {
    setStatus(`Too long. Keep it under ${MAX_CHARS.toLocaleString()} characters.`, true);
    return;
  }

  generateBtn.disabled = true;
  setStatus('Reading the terms and pulling out what matters…');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (res.status === 429 || data.error === 'rate_limit') {
      setStatus(
        "That's your 3 free simplifications used up for today. Want more? " +
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

  } catch (e) {
    setStatus('Network error — please check your connection and try again.', true);
  } finally {
    generateBtn.disabled = false;
  }
});

function setStatus(msg, isError = false) {
  statusEl.innerHTML = msg;
  statusEl.className = 'tcs-status' + (isError ? ' error' : '');
}

// ── RENDER ───────────────────────────────────────────────────────────────
function renderResult(result) {
  summaryEl.textContent = result.summary || 'No summary returned.';

  flagsEl.innerHTML = '';
  const flags = Array.isArray(result.red_flags) ? result.red_flags : [];
  if (flags.length === 0) {
    const li = document.createElement('li');
    li.className = 'none';
    li.textContent = 'No significant red flags detected.';
    flagsEl.appendChild(li);
  } else {
    flags.forEach(flag => {
      const li = document.createElement('li');
      li.textContent = flag;
      flagsEl.appendChild(li);
    });
  }

  numbersEl.innerHTML = '';
  const nums = result.key_numbers || {};
  const entries = [
    ['Wagering', nums.wagering],
    ['Expiry', nums.expiry],
    ['Max bet', nums.max_bet],
    ['Max win', nums.max_win],
    ['Min deposit', nums.min_deposit],
    ['Game weighting', nums.game_weighting],
  ];
  entries.forEach(([label, value]) => {
    if (!value) return;
    const card = document.createElement('div');
    card.className = 'tcs-num-card';
    card.innerHTML = `<span class="tcs-num-label">${label}</span><div class="tcs-num-value"></div>`;
    card.querySelector('.tcs-num-value').textContent = value;
    numbersEl.appendChild(card);
  });
  if (!numbersEl.children.length) {
    const card = document.createElement('div');
    card.className = 'tcs-num-card';
    card.innerHTML = '<span class="tcs-num-label">Note</span><div class="tcs-num-value" style="font-size:0.8rem;">No numbers detected</div>';
    numbersEl.appendChild(card);
  }
}

// ── COPY ─────────────────────────────────────────────────────────────────
copyBtn.addEventListener('click', async () => {
  const parts = [];
  parts.push('SUMMARY\n' + summaryEl.textContent);
  parts.push('\nRED FLAGS');
  flagsEl.querySelectorAll('li').forEach(li => parts.push('- ' + li.textContent));
  parts.push('\nKEY NUMBERS');
  numbersEl.querySelectorAll('.tcs-num-card').forEach(card => {
    const label = card.querySelector('.tcs-num-label').textContent;
    const value = card.querySelector('.tcs-num-value').textContent;
    parts.push(`${label}: ${value}`);
  });
  const text = parts.join('\n');

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
