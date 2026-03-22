document.addEventListener('DOMContentLoaded', function () {
  const textarea     = document.getElementById('content-input');
  const charCount    = document.getElementById('char-count');
  const repurposeBtn = document.getElementById('repurpose-btn');
  const grid         = document.getElementById('repurposer-grid');
  const platformSelector = document.getElementById('platform-selector');

  const WORKER_URL = 'https://content-repurposer.ukjbowman.workers.dev';
  const MAX_CHARS  = 10000;
  const WARN_CHARS = 9000;
  const CARD_KEYS  = ['linkedin', 'twitter', 'facebook', 'newsletter', 'video_10s', 'video_30s'];

  // ── Platform selector ──────────────────────────────────────────────────────
  let activePlatforms = new Set(CARD_KEYS);

  const platformBtns = document.querySelectorAll('.platform-btn');
  platformBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const platform = btn.dataset.platform;

      if (platform === 'all') {
        if (activePlatforms.size === CARD_KEYS.length) {
          activePlatforms.clear();
          platformBtns.forEach(b => b.classList.remove('active'));
        } else {
          activePlatforms = new Set(CARD_KEYS);
          platformBtns.forEach(b => b.classList.add('active'));
        }
      } else {
        if (activePlatforms.has(platform)) {
          activePlatforms.delete(platform);
          btn.classList.remove('active');
        } else {
          activePlatforms.add(platform);
          btn.classList.add('active');
        }
        const allBtn = document.querySelector('.platform-btn[data-platform="all"]');
        allBtn.classList.toggle('active', activePlatforms.size === CARD_KEYS.length);
      }

      updateCardVisibility();
    });
  });

  function updateCardVisibility() {
    CARD_KEYS.forEach(function (key) {
      const card = document.querySelector(`.output-card[data-key="${key}"]`);
      if (card) card.style.display = activePlatforms.has(key) ? '' : 'none';
    });
  }

  // ── Character counter ──────────────────────────────────────────────────────
  textarea.addEventListener('input', function () {
    const len = textarea.value.length;
    charCount.textContent = `${len.toLocaleString()} / 10,000`;
    charCount.classList.toggle('char-count-warn', len > WARN_CHARS);
  });

  // ── Repurpose button ───────────────────────────────────────────────────────
  repurposeBtn.addEventListener('click', repurposeContent);

  async function repurposeContent() {
    const content = textarea.value.trim();

    if (!content) {
      showInputError('Please paste some content before repurposing.');
      return;
    }
    if (content.length > MAX_CHARS) {
      showInputError(`Content is too long (${content.length.toLocaleString()} characters). Maximum is 10,000.`);
      return;
    }

    setLoading(true);
    showGrid();
    setCardsLoading(true);

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setCardsError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      populateCards(data.outputs);

    } catch (err) {
      setCardsError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Populate cards ─────────────────────────────────────────────────────────
  function populateCards(outputs) {
    setCardsLoading(false);

    CARD_KEYS.forEach(function (key) {
      const text    = outputs[key] || '';
      const content = document.getElementById(`output-${key}`);
      const badge   = document.getElementById(`badge-${key}`);

      if (key === 'newsletter') {
        renderNewsletter(content, text);
      } else {
        renderParagraphs(content, text);
      }

      badge.textContent = getBadgeLabel(key, text);

      // Enable share buttons if present
      const card = document.querySelector(`.output-card[data-key="${key}"]`);
      const shareBtn = card && card.querySelector('.share-btn');
      if (shareBtn) shareBtn.disabled = false;
    });
  }

  function renderParagraphs(container, text) {
    container.innerHTML = '';
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    paragraphs.forEach(function (para) {
      const p = document.createElement('p');
      p.textContent = para.trim();
      container.appendChild(p);
    });
  }

  function renderNewsletter(container, text) {
    container.innerHTML = '';
    const lines = text.split('\n');
    const firstLine = lines[0] || '';

    if (firstLine.startsWith('Subject:')) {
      const subjectSpan = document.createElement('span');
      subjectSpan.className = 'newsletter-subject';
      subjectSpan.textContent = firstLine;
      container.appendChild(subjectSpan);

      let bodyStart = 1;
      while (bodyStart < lines.length && lines[bodyStart].trim() === '') bodyStart++;
      const bodyText = lines.slice(bodyStart).join('\n').trim();

      if (bodyText) {
        const bodyParagraphs = bodyText.split(/\n\n+/).filter(p => p.trim());
        bodyParagraphs.forEach(function (para) {
          const p = document.createElement('p');
          p.textContent = para.trim();
          container.appendChild(p);
        });
      }
    } else {
      renderParagraphs(container, text);
    }
  }

  function getBadgeLabel(key, text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (key === 'twitter') return `${text.trim().length} chars`;
    return `${words} words`;
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────
  function setLoading(state) {
    repurposeBtn.disabled = state;
    repurposeBtn.innerHTML = state
      ? `<span class="btn-spinner"></span> Repurposing...`
      : `<span class="material-symbols-outlined">auto_awesome</span> Repurpose Content`;
  }

  function showGrid() {
    grid.style.display = 'grid';
    platformSelector.style.display = 'flex';
    updateCardVisibility();
    setTimeout(() => platformSelector.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  function setCardsLoading(state) {
    CARD_KEYS.forEach(function (key) {
      const card    = document.querySelector(`.output-card[data-key="${key}"]`);
      const content = document.getElementById(`output-${key}`);
      const badge   = document.getElementById(`badge-${key}`);
      const copyBtn = card.querySelector('.copy-btn');
      const shareBtn = card.querySelector('.share-btn');

      if (state) {
        card.classList.add('loading');
        content.innerHTML  = '';
        badge.textContent  = '';
        copyBtn.disabled   = true;
        if (shareBtn) shareBtn.disabled = true;
      } else {
        card.classList.remove('loading');
        copyBtn.disabled = false;
      }
    });
  }

  function setCardsError(message) {
    setCardsLoading(false);
    CARD_KEYS.forEach(function (key, i) {
      const content = document.getElementById(`output-${key}`);
      const card    = document.querySelector(`.output-card[data-key="${key}"]`);
      card.classList.add('error');
      const p = document.createElement('p');
      p.textContent = i === 0 ? message : 'See above for error details.';
      content.innerHTML = '';
      content.appendChild(p);
    });
  }

  function showInputError(message) {
    const existing = document.querySelector('.input-error');
    if (existing) existing.remove();
    const err = document.createElement('p');
    err.className = 'input-error';
    err.textContent = message;
    document.querySelector('.repurposer-input-section').insertAdjacentElement('afterend', err);
    setTimeout(() => err.remove(), 5000);
  }

  // ── Copy buttons ───────────────────────────────────────────────────────────
  grid.addEventListener('click', function (e) {
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn && !copyBtn.disabled) {
      const key     = copyBtn.dataset.target;
      const content = document.getElementById(`output-${key}`);
      const text    = content.textContent || content.innerText || '';
      if (!text.trim()) return;

      navigator.clipboard.writeText(text).then(function () {
        flashCopied(copyBtn);
      }).catch(function () {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); flashCopied(copyBtn); } catch {}
        document.body.removeChild(ta);
      });
    }

    // ── Share buttons ──────────────────────────────────────────────────────
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn && !shareBtn.disabled) {
      const key      = shareBtn.dataset.target;
      const platform = shareBtn.dataset.platform;
      const content  = document.getElementById(`output-${key}`);
      const text     = content.textContent || content.innerText || '';
      if (!text.trim()) return;

      if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
      } else if (platform === 'twitter') {
        const tweetText = text.length > 270 ? text.slice(0, 267) + '...' : text;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
      } else if (platform === 'facebook') {
        navigator.clipboard.writeText(text).then(function () {
          window.open('https://www.facebook.com/', '_blank');
          showToast('Text copied. Paste it into your new Facebook post.');
        });
      }
    }
  });

  function flashCopied(btn) {
    const icon = btn.querySelector('.material-symbols-outlined');
    const orig = icon.textContent;
    icon.textContent = 'check';
    btn.classList.add('copied');
    setTimeout(function () {
      icon.textContent = orig;
      btn.classList.remove('copied');
    }, 2000);
  }

  function showToast(message) {
    const existing = document.querySelector('.repurposer-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'repurposer-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
