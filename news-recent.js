/* ═══════════════════════════════════════════════════════
   Recent Posts widget
   Drop these two lines into any news article:
     <script src="/news-data.js"></script>
     <script src="/news-recent.js" defer></script>
   The widget auto-excludes the current article and shows
   up to 3 most recent posts. Renders nothing if < 1 post.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof NEWS_POSTS === 'undefined' || !Array.isArray(NEWS_POSTS)) return;

  const currentSlug = window.location.pathname.replace(/\/$/, '');
  const recent = NEWS_POSTS
    .filter(p => p.slug.replace(/\/$/, '') !== currentSlug)
    .slice(0, 3);

  if (!recent.length) return;

  // ── Inject stylesheet ──────────────────────────────────
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = '/news-recent.css';
  document.head.appendChild(link);

  // ── Build section ──────────────────────────────────────
  const section = document.createElement('section');
  section.className = 'nr-section';
  section.setAttribute('aria-label', 'More articles');

  const heading = document.createElement('h2');
  heading.className = 'nr-heading';
  heading.textContent = 'More articles';
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'nr-grid';

  recent.forEach(post => {
    const a = document.createElement('a');
    a.className = 'nr-card';
    a.href = post.slug;
    a.setAttribute('aria-label', post.title);

    const tagsHtml = post.tags && post.tags.length
      ? `<div class="nr-tags">${post.tags.slice(0, 3).map(t => `<span class="nr-tag">${t}</span>`).join('')}</div>`
      : '';

    a.innerHTML = `
      <div class="nr-card-meta">
        <span class="nr-category">${post.category}</span>
        <span class="nr-date">${post.dateDisplay}</span>
        <span class="nr-read">${post.readTime}</span>
      </div>
      <p class="nr-title">${post.title}</p>
      <p class="nr-excerpt">${post.excerpt}</p>
      ${tagsHtml}
      <span class="nr-arrow" aria-hidden="true">Read article →</span>
    `;
    grid.appendChild(a);
  });

  section.appendChild(grid);

  // ── Insert before share bar ────────────────────────────
  const sharePlaceholder = document.getElementById('share-bar-placeholder');
  if (sharePlaceholder) {
    sharePlaceholder.parentNode.insertBefore(section, sharePlaceholder);
  } else {
    document.body.appendChild(section);
  }
})();
