/* ═══════════════════════════════════════════════════════
   Newsy AI — article chat widget
   Drop <script src="/news-chat.js" defer></script> into
   any news article that has a .na-sidebar and .na-body.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const WORKER_URL  = 'https://newsy-worker.ukjbowman.workers.dev';
  const MAX_HISTORY = 12;

  let articleText = null;
  let messages    = [];       // { role, content }[]
  let isOpen      = false;
  let isLoading   = false;

  // ── Inject stylesheet ────────────────────────────────────────────────────
  const link  = document.createElement('link');
  link.rel    = 'stylesheet';
  link.href   = '/news-chat.css';
  document.head.appendChild(link);

  // ── Build card HTML ──────────────────────────────────────────────────────
  const card = document.createElement('div');
  card.className = 'nc-card';
  card.setAttribute('role', 'complementary');
  card.setAttribute('aria-label', 'Newsy AI article assistant');

  card.innerHTML = `
    <button class="nc-trigger" aria-expanded="false" aria-controls="nc-panel">
      <span class="nc-trigger-icon"><span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span></span>
      <span class="nc-trigger-text">
        <span class="nc-trigger-title">Newsy AI</span>
        <span class="nc-trigger-sub">Ask questions about this article</span>
      </span>
      <span class="material-symbols-outlined nc-trigger-chevron" aria-hidden="true">expand_more</span>
    </button>

    <div class="nc-panel" id="nc-panel" aria-hidden="true">
      <div class="nc-panel-inner">

        <div class="nc-messages" id="nc-messages" role="log" aria-live="polite" aria-label="Chat messages">
          <div class="nc-welcome" id="nc-welcome">
            <div class="nc-welcome-icon"><span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span></div>
            <p class="nc-welcome-title">Hi, I'm Newsy AI</p>
            <p class="nc-welcome-sub">Ask me anything about this article.</p>
            <div class="nc-starters" role="list">
              <button class="nc-starter-chip" role="listitem">What's the main point of this article?</button>
              <button class="nc-starter-chip" role="listitem">Summarise this in 3 bullet points</button>
              <button class="nc-starter-chip" role="listitem">What should I take away from this?</button>
            </div>
          </div>
        </div>

        <div class="nc-input-row">
          <textarea
            class="nc-input"
            id="nc-input"
            placeholder="Ask a question..."
            rows="1"
            maxlength="600"
            aria-label="Your question"
          ></textarea>
          <button class="nc-send" id="nc-send" aria-label="Send" disabled>
            <span class="material-symbols-outlined" aria-hidden="true">send</span>
          </button>
        </div>

        <div class="nc-footer">Stays on topic &middot; Powered by Claude Haiku</div>

      </div>
    </div>
  `;

  // ── Mount into sidebar ───────────────────────────────────────────────────
  const sidebar = document.querySelector('.na-sidebar');
  if (!sidebar) return; // only run on article pages with sidebar
  sidebar.appendChild(card);

  // ── Element refs ─────────────────────────────────────────────────────────
  const triggerBtn  = card.querySelector('.nc-trigger');
  const panel       = card.querySelector('#nc-panel');
  const messagesEl  = card.querySelector('#nc-messages');
  const welcomeEl   = card.querySelector('#nc-welcome');
  const inputEl     = card.querySelector('#nc-input');
  const sendBtn     = card.querySelector('#nc-send');
  const starters    = card.querySelectorAll('.nc-starter-chip');

  // ── Toggle open / close ──────────────────────────────────────────────────
  function open() {
    isOpen = true;
    card.classList.add('open');
    triggerBtn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    // Grab article text once
    if (!articleText) {
      const body = document.querySelector('.na-body');
      articleText = body ? body.innerText.trim() : '';
    }
    inputEl.focus();
  }

  function close() {
    isOpen = false;
    card.classList.remove('open');
    triggerBtn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  triggerBtn.addEventListener('click', () => isOpen ? close() : open());

  // ── Starter chips ─────────────────────────────────────────────────────────
  starters.forEach(chip => {
    chip.addEventListener('click', () => {
      inputEl.value = chip.textContent.trim();
      sendBtn.disabled = false;
      sendMessage();
    });
  });

  // ── Input handling ────────────────────────────────────────────────────────
  inputEl.addEventListener('input', () => {
    sendBtn.disabled = !inputEl.value.trim() || isLoading;
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // ── Render helpers ────────────────────────────────────────────────────────
  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function removeWelcome() {
    if (welcomeEl && welcomeEl.parentNode) welcomeEl.remove();
  }

  function appendMessage(role, content) {
    removeWelcome();
    const el = document.createElement('div');
    el.className = `nc-msg nc-msg--${role}`;
    el.innerHTML = `<div class="nc-bubble">${escHtml(content).replace(/\n/g, '<br>')}</div>`;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function appendTyping() {
    removeWelcome();
    const el = document.createElement('div');
    el.className = 'nc-msg nc-msg--assistant';
    el.innerHTML = `<div class="nc-bubble"><span class="nc-dots"><span></span><span></span><span></span></span></div>`;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  // ── Send ──────────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    appendMessage('user', text);
    messages.push({ role: 'user', content: text });

    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    isLoading = true;

    const typingEl = appendTyping();

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleText,
          messages: messages.slice(-MAX_HISTORY),
        }),
      });

      const data = await res.json();
      typingEl.remove();

      const reply = (!res.ok || data.error)
        ? (data.error || 'Something went wrong. Please try again.')
        : data.reply;

      appendMessage('assistant', reply);
      if (res.ok && !data.error) {
        messages.push({ role: 'assistant', content: data.reply });
      }

    } catch {
      typingEl.remove();
      appendMessage('assistant', 'Connection error. Please try again.');
    } finally {
      isLoading = false;
      sendBtn.disabled = !inputEl.value.trim();
    }
  }

})();
