const WORKER_URL = 'https://llms-generator-worker.ukjbowman.workers.dev';

const tabUrl   = document.getElementById('tab-url');
const tabPaste = document.getElementById('tab-paste');
const panelUrl   = document.getElementById('panel-url');
const panelPaste = document.getElementById('panel-paste');
const urlInput   = document.getElementById('lg-url');
const pasteInput = document.getElementById('lg-paste');
const generateBtn = document.getElementById('lg-generate');
const statusEl  = document.getElementById('lg-status');
const outputCard = document.getElementById('lg-output');
const contentEl  = document.getElementById('lg-content');
const copyBtn    = document.getElementById('lg-copy');
const downloadBtn = document.getElementById('lg-download');

let activeTab = 'url';

// ── TABS ──────────────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  tabUrl.classList.toggle('active', tab === 'url');
  tabPaste.classList.toggle('active', tab === 'paste');
  tabUrl.setAttribute('aria-selected', tab === 'url');
  tabPaste.setAttribute('aria-selected', tab === 'paste');
  panelUrl.style.display   = tab === 'url'   ? '' : 'none';
  panelPaste.style.display = tab === 'paste' ? '' : 'none';
}

tabUrl.addEventListener('click', () => switchTab('url'));
tabPaste.addEventListener('click', () => switchTab('paste'));

// Keyboard accessibility
[tabUrl, tabPaste].forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      switchTab(activeTab === 'url' ? 'paste' : 'url');
    }
  });
});

// ── GENERATE ──────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  statusEl.className = 'lg-status';
  outputCard.style.display = 'none';

  const payload = { mode: activeTab };

  if (activeTab === 'url') {
    const url = urlInput.value.trim();
    if (!url) {
      setStatus('Please enter a URL.', true);
      urlInput.focus();
      return;
    }
    if (!url.startsWith('http')) {
      setStatus('URL must start with http:// or https://', true);
      urlInput.focus();
      return;
    }
    payload.url = url;
  } else {
    const content = pasteInput.value.trim();
    if (content.length < 30) {
      setStatus('Please paste a bit more content — at least a short site description.', true);
      pasteInput.focus();
      return;
    }
    payload.content = content;
  }

  generateBtn.disabled = true;
  setStatus('Generating your llms.txt file…');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status === 429 || data.error === 'rate_limit') {
      setStatus(
        "That's your 3 free generations used up for today. Want more? " +
        "<a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>.",
        true
      );
      return;
    }

    if (!data.success) {
      setStatus(data.error || 'Something went wrong. Please try again.', true);
      return;
    }

    contentEl.textContent = data.llmsTxt;
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
  statusEl.className = 'lg-status' + (isError ? ' error' : '');
}

// ── COPY ──────────────────────────────────────────────────────────────────
copyBtn.addEventListener('click', async () => {
  const text = contentEl.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check</span> Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span> Copy';
      copyBtn.classList.remove('copied');
    }, 2200);
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    copyBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check</span> Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span> Copy';
    }, 2200);
  }
});

// ── DOWNLOAD ──────────────────────────────────────────────────────────────
downloadBtn.addEventListener('click', () => {
  const text = contentEl.textContent;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'llms.txt';
  a.click();
  URL.revokeObjectURL(a.href);
});
