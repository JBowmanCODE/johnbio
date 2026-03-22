document.addEventListener('DOMContentLoaded', function () {
  const textarea    = document.getElementById('content-input');
  const charCount   = document.getElementById('char-count');
  const repurposeBtn = document.getElementById('repurpose-btn');
  const grid        = document.getElementById('repurposer-grid');

  const WORKER_URL  = 'https://content-repurposer.ukjbowman.workers.dev';
  const MAX_CHARS   = 10000;
  const WARN_CHARS  = 9000;

  const CARD_KEYS   = ['linkedin', 'twitter', 'facebook', 'newsletter', 'video_10s', 'video_30s'];

  // ── Character counter ──────────────────────────────────────────────────────
  textarea.addEventListener('input', function () {
    const len = textarea.value.length;
    charCount.textContent = `${len.toLocaleString()} / 10,000`;
    charCount.classList.toggle('char-count-warn', len > WARN_CHARS);
  });

  // ── Repurpose button click ─────────────────────────────────────────────────
  repurposeBtn.addEventListener('click', repurposeContent);

  async function repurposeContent() {
    const content = textarea.value.trim();

    if (!content) {
      showInputError('Please paste some content before repurposing.');
      return;
    }

    if (content.length > MAX_CHARS) {
      showInputError(`Content is too long (${content.length.toLocaleString()} characters). Please keep it under 10,000.`);
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
        const msg = data.error || 'Something went wrong. Please try again.';
        setCardsError(msg);
        return;
      }

      populateCards(data.outputs);

    } catch (err) {
      setCardsError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────
  function setLoading(state) {
    if (state) {
      repurposeBtn.disabled = true;
      repurposeBtn.innerHTML = `<span class="btn-spinner"></span> Repurposing...`;
    } else {
      repurposeBtn.disabled = false;
      repurposeBtn.innerHTML = `<span class="material-symbols-outlined">auto_awesome</span> Repurpose Content`;
    }
  }

  function showGrid() {
    grid.style.display = 'grid';
    // Scroll the grid into view smoothly
    setTimeout(() => {
      grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }

  function setCardsLoading(state) {
    CARD_KEYS.forEach(function (key) {
      const card    = document.querySelector(`.output-card[data-key="${key}"]`);
      const content = document.getElementById(`output-${key}`);
      const badge   = document.getElementById(`badge-${key}`);
      const copyBtn = card.querySelector('.copy-btn');

      if (state) {
        card.classList.add('loading');
        content.textContent = '';
        badge.textContent   = '';
        copyBtn.disabled    = true;
      } else {
        card.classList.remove('loading');
        copyBtn.disabled = false;
      }
    });
  }

  function populateCards(outputs) {
    setCardsLoading(false);

    CARD_KEYS.forEach(function (key) {
      const text    = outputs[key] || '';
      const content = document.getElementById(`output-${key}`);
      const badge   = document.getElementById(`badge-${key}`);

      if (key === 'newsletter') {
        renderNewsletter(content, text);
      } else {
        content.textContent = text;
      }

      badge.textContent = getBadgeLabel(key, text);
    });
  }

  function renderNewsletter(container, text) {
    container.textContent = '';

    const lines = text.split('\n');
    const firstLine = lines[0] || '';

    if (firstLine.startsWith('Subject:')) {
      // Render the subject line as a styled span
      const subjectSpan = document.createElement('span');
      subjectSpan.className = 'newsletter-subject';
      subjectSpan.textContent = firstLine;
      container.appendChild(subjectSpan);

      // Find the body — skip blank lines after subject
      let bodyStart = 1;
      while (bodyStart < lines.length && lines[bodyStart].trim() === '') {
        bodyStart++;
      }
      const bodyText = lines.slice(bodyStart).join('\n').trim();
      if (bodyText) {
        const bodyNode = document.createTextNode(bodyText);
        container.appendChild(bodyNode);
      }
    } else {
      // No subject line detected, render as plain text
      container.textContent = text;
    }
  }

  function getBadgeLabel(key, text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    if (key === 'twitter') {
      const chars = text.trim().length;
      return `${chars} chars`;
    }
    if (key === 'video_10s' || key === 'video_30s') {
      return `${words} words`;
    }
    return `${words} words`;
  }

  function setCardsError(message) {
    setCardsLoading(false);
    CARD_KEYS.forEach(function (key) {
      const content = document.getElementById(`output-${key}`);
      const badge   = document.getElementById(`badge-${key}`);
      const card    = document.querySelector(`.output-card[data-key="${key}"]`);
      card.classList.add('error');
      content.textContent = key === 'linkedin' ? message : '';
      badge.textContent   = '';
    });

    // Only show the error message on the first card to avoid repetition
    CARD_KEYS.slice(1).forEach(function (key) {
      const content = document.getElementById(`output-${key}`);
      content.textContent = 'See above for error details.';
    });
  }

  function showInputError(message) {
    // Remove any existing error
    const existing = document.querySelector('.input-error');
    if (existing) existing.remove();

    const err = document.createElement('p');
    err.className = 'input-error';
    err.textContent = message;

    const inputSection = document.querySelector('.repurposer-input-section');
    inputSection.insertAdjacentElement('afterend', err);

    setTimeout(function () {
      err.remove();
    }, 5000);
  }

  // ── Copy buttons ───────────────────────────────────────────────────────────
  grid.addEventListener('click', function (e) {
    const btn = e.target.closest('.copy-btn');
    if (!btn || btn.disabled) return;

    const key     = btn.dataset.target;
    const content = document.getElementById(`output-${key}`);

    // Get the plain text to copy (including subject line for newsletter)
    const textToCopy = content.textContent || content.innerText || '';

    if (!textToCopy.trim()) return;

    navigator.clipboard.writeText(textToCopy).then(function () {
      const icon = btn.querySelector('.material-symbols-outlined');
      const originalIcon = icon.textContent;
      icon.textContent = 'check';
      btn.classList.add('copied');

      setTimeout(function () {
        icon.textContent = originalIcon;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(function () {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        const icon = btn.querySelector('.material-symbols-outlined');
        const originalIcon = icon.textContent;
        icon.textContent = 'check';
        btn.classList.add('copied');
        setTimeout(function () {
          icon.textContent = originalIcon;
          btn.classList.remove('copied');
        }, 2000);
      } catch { /* silent fail */ }
      document.body.removeChild(ta);
    });
  });
});
