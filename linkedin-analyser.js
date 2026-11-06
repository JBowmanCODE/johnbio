/* LinkedIn Analytics Analyser - Browser UI Controller
   100% client-side. No file data is ever uploaded or saved to localStorage. */

(function () {
  'use strict';

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  const GOAL_STORAGE_KEY_TARGET = 'johnb_la_goal_target';
  const GOAL_STORAGE_KEY_DATE = 'johnb_la_goal_date';

  // ── STATE ──────────────────────────────────────────────────────────────────
  const state = {
    theme: 'dark',
    isDemo: false,
    primaryParsed: null,
    secondaryParsed: null,
    themeOverrides: {},
    projectionRatePct: null,
    activePostSort: 'engagements',
    analysis: null,
    comparison: null,
    goalPlan: null,
    charts: {},
  };

  // ── DOM ELEMENTS ───────────────────────────────────────────────────────────
  const mainWrap = document.getElementById('main-content');
  const themeToggleBtn = document.getElementById('la-theme-toggle');
  const themeIcon = document.getElementById('la-theme-icon');
  const themeLabel = document.getElementById('la-theme-label');

  const dropzone = document.getElementById('la-dropzone');
  const fileInput = document.getElementById('la-file-input');
  const demoBtn = document.getElementById('la-demo-btn');
  const statusEl = document.getElementById('la-status');
  const resultsWrap = document.getElementById('la-results');
  const activeRangeLabel = document.getElementById('la-active-range-label');
  const demoIndicator = document.getElementById('la-demo-indicator');

  const downloadPdfBtn = document.getElementById('la-download-pdf-btn');
  const downloadMdBtn = document.getElementById('la-download-md-btn');
  const copyMdBtn = document.getElementById('la-copy-md-btn');
  const copyMdLabel = document.getElementById('la-copy-md-label');
  const resetBtn = document.getElementById('la-reset-btn');

  const compareDropzone = document.getElementById('la-compare-dropzone');
  const compareInput = document.getElementById('la-compare-input');
  const compareDemoBtn = document.getElementById('la-compare-demo-btn');
  const removeComparisonBtn = document.getElementById('la-remove-comparison-btn');

  const projSlider = document.getElementById('la-proj-slider');
  const projRateVal = document.getElementById('la-proj-rate-val');
  const projResetBtn = document.getElementById('la-proj-reset-btn');

  const goalTargetInput = document.getElementById('la-goal-target');
  const goalDateInput = document.getElementById('la-goal-date');
  const goalCalcBtn = document.getElementById('la-goal-calc-btn');

  const shareCanvas = document.getElementById('la-share-canvas');
  const downloadCardBtn = document.getElementById('la-download-card-btn');
  const copySummaryBtn = document.getElementById('la-copy-summary-btn');
  const copySummaryLabel = document.getElementById('la-copy-summary-label');
  const cardProgressModeInput = document.getElementById('la-card-progress-mode');
  const cardModeWrap = document.getElementById('la-card-mode-wrap');

  // ── UTILITY HELPERS ────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showStatus(msg, type = 'info') {
    statusEl.textContent = LACore.sanitizeCopy(msg);
    statusEl.className = `la-status ${type}`;
    statusEl.style.display = 'block';
  }

  function clearStatus() {
    statusEl.textContent = '';
    statusEl.className = 'la-status';
    statusEl.style.display = 'none';
  }

  function destroyCharts() {
    for (const key of Object.keys(state.charts)) {
      if (state.charts[key] && typeof state.charts[key].destroy === 'function') {
        state.charts[key].destroy();
      }
      delete state.charts[key];
    }
  }

  function getChartColors() {
    const isLight = state.theme === 'light';
    return {
      text: isLight ? '#0f172a' : '#f8f5fd',
      muted: isLight ? '#475569' : '#acaab1',
      grid: isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(248, 245, 253, 0.08)',
      pink: isLight ? '#d9006c' : '#FF007F',
      pinkSoft: isLight ? 'rgba(217, 0, 108, 0.28)' : 'rgba(255, 0, 127, 0.32)',
      cyan: isLight ? '#0284c7' : '#00eefc',
      cyanSoft: isLight ? 'rgba(2, 132, 199, 0.28)' : 'rgba(0, 238, 252, 0.32)',
      green: isLight ? '#15803d' : '#22c55e',
      amber: isLight ? '#b45309' : '#f59e0b',
    };
  }

  function makeChart(key, canvasId, config) {
    if (typeof Chart === 'undefined') return null;
    if (state.charts[key]) {
      state.charts[key].destroy();
    }
    const el = document.getElementById(canvasId);
    if (!el) return null;
    state.charts[key] = new Chart(el.getContext('2d'), config);
    return state.charts[key];
  }

  // ── FILE UPLOAD & VALIDATION ───────────────────────────────────────────────
  function validateXlsxFile(file) {
    if (!file) return 'No file selected.';
    if (file.size === 0) return `"${file.name}" is empty. Please choose a valid LinkedIn .xlsx export.`;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `"${file.name}" is over the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). LinkedIn analytics exports are normally under 500 KB.`;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'xlsx') {
      return `"${file.name}" is not an .xlsx file. Please export your LinkedIn Creator Analytics as an .xlsx workbook.`;
    }
    return null;
  }

  async function parseUploadedFile(file) {
    const validationErr = validateXlsxFile(file);
    if (validationErr) {
      throw new Error(validationErr);
    }
    if (typeof XLSX === 'undefined') {
      throw new Error('Spreadsheet parser is still loading. Please wait a second and try again.');
    }
    const arrayBuffer = await file.arrayBuffer();
    // Verify ZIP/XLSX magic bytes (PK\x03\x04)
    const bytes = new Uint8Array(arrayBuffer.slice(0, 4));
    if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
      throw new Error(`"${file.name}" is corrupted or not a valid Excel (.xlsx) workbook.`);
    }
    let workbook;
    try {
      workbook = XLSX.read(arrayBuffer, { type: 'array' });
    } catch (_err) {
      throw new Error(`Could not read "${file.name}". The workbook appears to be corrupted.`);
    }
    const parsed = LACore.parseWorkbook(workbook, XLSX);
    if (!parsed.isValidLinkedInExport) {
      throw new Error(parsed.error || `"${file.name}" does not look like a LinkedIn Creator Analytics export.`);
    }
    return parsed;
  }

  async function handlePrimaryFile(file) {
    showStatus('Analysing your LinkedIn export locally in your browser...', 'info');
    try {
      const parsed = await parseUploadedFile(file);
      state.isDemo = false;
      state.primaryParsed = parsed;
      state.secondaryParsed = null;
      state.themeOverrides = {};
      state.projectionRatePct = null;
      clearStatus();
      if (parsed.warnings && parsed.warnings.length > 0) {
        showStatus('Loaded with notes: ' + parsed.warnings.join(' '), 'info');
      }
      recalculateAndRender(true);
    } catch (err) {
      showStatus(err.message || 'Could not parse file.', 'error');
    }
  }

  async function handleComparisonFile(file) {
    showStatus('Comparing your two LinkedIn exports...', 'info');
    try {
      const parsed = await parseUploadedFile(file);
      state.secondaryParsed = parsed;
      recalculateAndRender(false);
      showStatus('Comparison loaded! Scroll to Section 3 (Before and After Comparison) to inspect changes.', 'success');
      const secComp = document.getElementById('sec-comparison');
      if (secComp) secComp.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      showStatus(err.message || 'Could not parse comparison file.', 'error');
    }
  }

  function loadSyntheticDemo() {
    clearStatus();
    const sheetsMap = LACore.generateSyntheticSheetsMap('normal-365d');
    const parsed = LACore.parseSheetsMap(sheetsMap);
    state.isDemo = true;
    state.primaryParsed = parsed;
    state.secondaryParsed = null;
    state.themeOverrides = {};
    state.projectionRatePct = null;
    recalculateAndRender(true);
  }

  function loadSyntheticComparisonDemo() {
    if (!state.primaryParsed) loadSyntheticDemo();
    const olderMap = LACore.generateSyntheticSheetsMap('older-365d');
    state.secondaryParsed = LACore.parseSheetsMap(olderMap);
    recalculateAndRender(false);
    showStatus('Loaded synthetic older export (3 months earlier) for comparison.', 'success');
    const secComp = document.getElementById('sec-comparison');
    if (secComp) secComp.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── CORE RECALCULATION & RENDER PIPELINE ───────────────────────────────────
  function recalculateAndRender(scrollToResults = false) {
    if (!state.primaryParsed) return;

    state.analysis = LACore.analyseExport(state.primaryParsed, {
      themeOverrides: state.themeOverrides,
      projectionRatePct: state.projectionRatePct,
    });

    if (state.secondaryParsed) {
      state.comparison = LACore.compareExports(state.primaryParsed, state.secondaryParsed, {
        themeOverrides: state.themeOverrides,
      });
    } else {
      state.comparison = null;
    }

    // Initialise or update Goal Planner inputs
    initGoalPlannerInputs(state.analysis);
    state.goalPlan = LACore.planGoal(
      state.analysis,
      goalTargetInput.value,
      goalDateInput.value
    );

    resultsWrap.style.display = 'block';
    const dr = state.analysis.dateRange;
    activeRangeLabel.textContent = `${dr.startDateDisplay} to ${dr.endDateDisplay} (${dr.totalDays} days)`;
    demoIndicator.style.display = state.isDemo ? 'inline-block' : 'none';

    renderSection1HealthAndCreator(state.analysis);
    renderSection2Takeaways(state.analysis);
    renderSection3Comparison(state.comparison);
    renderSection4Headline(state.analysis);
    renderSection5Recommendations(state.analysis);
    renderSection6FollowerGrowth(state.analysis);
    renderSection7ProjectionsAndGoals(state.analysis, state.goalPlan);
    renderSection8Posts(state.analysis);
    renderSection9BestDays(state.analysis);
    renderSection10ReachTrend(state.analysis);
    renderSection11Audience(state.analysis);
    renderSection12ContentVsAudience(state.analysis);
    renderSection13DataNotes(state.analysis);
    renderShareCard();

    if (scrollToResults) {
      resultsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── SECTION 1: HEALTH SCORE & CREATOR TYPE ─────────────────────────────────
  function renderSection1HealthAndCreator(analysis) {
    const hs = analysis.healthScore;
    const ct = analysis.creatorType;

    document.getElementById('la-takeaway-health').textContent = LACore.sanitizeCopy(
      `Your account scores ${hs.score}/100 (${hs.label}) and your primary creator profile is ${ct.primaryType.name}. ${ct.hiddenStrengthCallout}`
    );

    // SVG Gauge
    const radius = 66;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (hs.score / 100) * circumference;

    const compHtml = hs.components
      .map((c) => {
        const pct = c.scaledMaxPoints > 0 ? Math.min(100, (c.score / c.scaledMaxPoints) * 100) : 0;
        return `
          <div class="la-comp-item">
            <div class="la-comp-top">
              <span>${escapeHtml(c.name)}</span>
              <span>${LACore.formatDec(c.score, 1)} / ${LACore.formatDec(c.scaledMaxPoints, 0)}</span>
            </div>
            <div class="la-comp-bar"><div class="la-comp-bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
            <div class="la-comp-metric">${escapeHtml(c.metricDisplay)}</div>
            <div class="la-comp-tip"><strong>Tip:</strong> ${escapeHtml(c.tip)}</div>
          </div>
        `;
      })
      .join('');

    const scalingHtml = hs.scalingNote
      ? `<p style="font-size:0.78rem;color:var(--la-amber);margin-top:0.65rem;">${escapeHtml(hs.scalingNote)}</p>`
      : '';

    document.getElementById('la-health-card').innerHTML = `
      <h3 class="la-steps-title">LinkedIn Health Score</h3>
      <div class="la-gauge-wrap">
        <svg class="la-gauge-svg" viewBox="0 0 160 160" role="img" aria-label="LinkedIn Health Score ${hs.score} out of 100 (${escapeHtml(hs.label)})">
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="rgba(172,170,177,0.18)" stroke-width="14"></circle>
          <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${escapeHtml(hs.colour)}" stroke-width="14"
            stroke-linecap="round" stroke-dasharray="${circumference.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
            transform="rotate(-90 80 80)"></circle>
          <text x="80" y="78" text-anchor="middle" fill="currentColor" font-family="Space Grotesk, sans-serif" font-size="38" font-weight="900">${hs.score}</text>
          <text x="80" y="102" text-anchor="middle" fill="#acaab1" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="700">/ 100</text>
        </svg>
        <div class="la-gauge-label" style="color:${escapeHtml(hs.colour)};">${escapeHtml(hs.label)}</div>
        <div class="la-gauge-disclaimer">${escapeHtml(hs.disclaimer)}</div>
      </div>
      <div class="la-comp-list">${compHtml}</div>
      ${scalingHtml}
    `;

    // Creator Type Card
    const pt = ct.primaryType;
    const hsCalloutHtml = ct.hasHiddenStrengthMismatch
      ? `<div class="la-hidden-strength-box">
           <strong>Hidden Strength Detected:</strong> You post like <strong>${escapeHtml(pt.name)}</strong> (${ct.primaryThemeStats.postCount} posts), but your audience rewards <strong>${escapeHtml(ct.hiddenStrengthType.name)}</strong> (median ${LACore.formatDec(ct.hiddenStrengthStats.medianEngagements, 0)} engagements vs ${LACore.formatDec(ct.primaryThemeStats.medianEngagements, 0)}).
         </div>`
      : `<div class="la-hidden-strength-box" style="background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.4);">
           <strong>Aligned Strength:</strong> ${escapeHtml(ct.hiddenStrengthCallout)}
         </div>`;

    document.getElementById('la-creator-card').innerHTML = `
      <h3 class="la-steps-title">Your Creator Type</h3>
      <div class="la-creator-badge-box" style="border-color:${escapeHtml(pt.colour)};">
        <div class="la-creator-icon" style="background:${escapeHtml(pt.colour)}22;color:${escapeHtml(pt.colour)};">
          <span class="material-symbols-outlined" aria-hidden="true">${escapeHtml(pt.icon)}</span>
        </div>
        <div>
          <div class="la-creator-name" style="color:${escapeHtml(pt.colour)};">${escapeHtml(pt.name)}</div>
          <div class="la-creator-short">${escapeHtml(pt.shortDescription)}</div>
        </div>
      </div>
      ${hsCalloutHtml}
      <div class="la-creator-details">
        <div><strong>Core theme:</strong> ${escapeHtml(pt.theme)} ${ct.primaryThemeStats ? `(${ct.primaryThemeStats.postCount} top posts, median ${LACore.formatDec(ct.primaryThemeStats.medianEngagements, 0)} engagements)` : ''}</div>
        <div><strong>Strengths:</strong> ${escapeHtml(pt.strengths)}</div>
        <div><strong>Blind spots:</strong> ${escapeHtml(pt.blindSpots)}</div>
        <div><strong>Next step tip:</strong> ${escapeHtml(pt.tip)}</div>
        ${!ct.isExplorer && ct.hasHiddenStrengthMismatch ? `<div style="margin-top:0.4rem;padding-top:0.5rem;border-top:1px solid var(--la-border);"><strong>${escapeHtml(ct.hiddenStrengthType.name)} tip:</strong> ${escapeHtml(ct.hiddenStrengthType.tip)}</div>` : ''}
      </div>
    `;
  }

  // ── SECTION 2: TOP 5 TAKEAWAYS ─────────────────────────────────────────────
  function renderSection2Takeaways(analysis) {
    document.getElementById('la-takeaway-top5').textContent =
      'Five plain-English findings from your export, with the exact numbers behind each one.';
    const listEl = document.getElementById('la-takeaways-list');
    listEl.innerHTML = analysis.top5Takeaways
      .map(
        (t, i) => `
        <li>
          <span class="la-step-num" aria-hidden="true">${i + 1}</span>
          <span>${escapeHtml(t)}</span>
        </li>
      `
      )
      .join('');
  }

  // ── SECTION 3: BEFORE AND AFTER COMPARISON ─────────────────────────────────
  function renderSection3Comparison(comp) {
    const sec = document.getElementById('sec-comparison');
    const tocLink = document.getElementById('la-toc-comparison');
    if (!comp || !comp.valid) {
      sec.style.display = 'none';
      if (tocLink) tocLink.style.display = 'none';
      cardModeWrap.style.display = 'none';
      return;
    }

    sec.style.display = 'block';
    if (tocLink) tocLink.style.display = 'inline-block';
    cardModeWrap.style.display = 'block';

    document.getElementById('la-takeaway-comparison').textContent = comp.verdict;

    const fmtDelta = (val, decimals = 0, suffix = '') => {
      if (val === null || val === undefined) return 'N/A';
      const arrow = val > 0 ? '▲ +' : val < 0 ? '▼ ' : '• ';
      const cls = val > 0 ? 'la-up' : val < 0 ? 'la-down' : '';
      const numStr = decimals === 0 ? LACore.formatInt(val) : LACore.formatDec(val, decimals);
      return `<span class="${cls}">${arrow}${numStr}${suffix}</span>`;
    };

    const m = comp.metrics;
    const shiftsHtml = comp.audienceShifts
      .map(
        (s) => `
        <tr>
          <td>${escapeHtml(s.category)}</td>
          <td>${escapeHtml(s.value)}</td>
          <td>${LACore.formatPct(s.beforePct, 1)}</td>
          <td>${LACore.formatPct(s.afterPct, 1)}</td>
          <td>${fmtDelta(s.ppShift, 1, ' pp')}</td>
        </tr>
      `
      )
      .join('');

    const newPostsHtml = comp.newTopPosts
      .slice(0, 5)
      .map(
        (p) => `
        <tr>
          <td>${escapeHtml(p.publishDateDisplay)}</td>
          <td class="la-cell-wrap"><a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--la-cyan);">${escapeHtml(p.title)}</a></td>
          <td>${escapeHtml(p.theme)}</td>
          <td>${p.engagements !== null ? LACore.formatInt(p.engagements) : 'N/A'}</td>
          <td>${p.impressions !== null ? LACore.formatInt(p.impressions) : 'N/A'}</td>
        </tr>
      `
      )
      .join('');

    document.getElementById('la-comparison-body').innerHTML = `
      <div class="la-summary-pill" style="margin-bottom:1rem;">
        <strong>Before:</strong> ${escapeHtml(comp.beforeLabel)} &nbsp;|&nbsp;
        <strong>After:</strong> ${escapeHtml(comp.afterLabel)}<br>
        <span style="color:var(--la-text-muted);font-size:0.82rem;">${escapeHtml(comp.overlapNote)}</span>
      </div>

      <div class="la-table-wrap" style="margin-bottom:1.15rem;">
        <table class="la-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Before</th>
              <th>After</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Total Followers</strong></td>
              <td>${LACore.formatInt(m.followersBefore)}</td>
              <td>${LACore.formatInt(m.followersAfter)}</td>
              <td>${fmtDelta(m.followersDelta, 0)}</td>
            </tr>
            <tr>
              <td><strong>Recent Monthly Growth Rate</strong></td>
              <td>${LACore.formatPct(m.growthRateBefore, 1)}</td>
              <td>${LACore.formatPct(m.growthRateAfter, 1)}</td>
              <td>${fmtDelta(m.growthRateDelta, 1, ' pp')}</td>
            </tr>
            <tr>
              <td><strong>Overall Engagement Rate</strong></td>
              <td>${LACore.formatPct(m.engRateBefore, 2)}</td>
              <td>${LACore.formatPct(m.engRateAfter, 2)}</td>
              <td>${fmtDelta(m.engRateDelta, 2, ' pp')}</td>
            </tr>
            <tr>
              <td><strong>Average Monthly Impressions</strong></td>
              <td>${LACore.formatInt(m.impPerMonthBefore)}</td>
              <td>${LACore.formatInt(m.impPerMonthAfter)}</td>
              <td>${fmtDelta(m.impPerMonthDelta, 0)}</td>
            </tr>
            <tr>
              <td><strong>LinkedIn Health Score</strong></td>
              <td>${m.healthBefore} / 100</td>
              <td>${m.healthAfter} / 100</td>
              <td>${fmtDelta(m.healthDelta, 0, ' pts')}</td>
            </tr>
            <tr>
              <td><strong>Primary Creator Type</strong></td>
              <td>${escapeHtml(comp.typeBefore)}</td>
              <td>${escapeHtml(comp.typeAfter)}</td>
              <td>${escapeHtml(comp.typeChangeSummary)}</td>
            </tr>
            <tr>
              <td><strong>Best Content Theme</strong></td>
              <td>${escapeHtml(comp.bestThemeBefore)}</td>
              <td>${escapeHtml(comp.bestThemeAfter)}</td>
              <td>${comp.bestThemeBefore === comp.bestThemeAfter ? 'Unchanged' : 'Shifted'}</td>
            </tr>
            <tr>
              <td><strong>Best Day for Followers</strong></td>
              <td>${escapeHtml(comp.bestDayBefore)}</td>
              <td>${escapeHtml(comp.bestDayAfter)}</td>
              <td>${comp.bestDayBefore === comp.bestDayAfter ? 'Unchanged' : 'Shifted'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${shiftsHtml ? `
        <h3 class="la-steps-title">Biggest Audience Shifts (Percentage Points)</h3>
        <div class="la-table-wrap" style="margin-bottom:1.15rem;">
          <table class="la-table">
            <thead><tr><th>Category</th><th>Segment</th><th>Before</th><th>After</th><th>Shift</th></tr></thead>
            <tbody>${shiftsHtml}</tbody>
          </table>
        </div>
      ` : ''}

      ${newPostsHtml ? `
        <h3 class="la-steps-title">New Posts in Your Latest Top Posts (${comp.totalNewTopPosts} total new)</h3>
        <div class="la-table-wrap">
          <table class="la-table">
            <thead><tr><th>Date</th><th>Post</th><th>Theme</th><th>Engagements</th><th>Impressions</th></tr></thead>
            <tbody>${newPostsHtml}</tbody>
          </table>
        </div>
      ` : ''}
    `;
  }

  // ── SECTION 4: HEADLINE NUMBERS ────────────────────────────────────────────
  function renderSection4Headline(analysis) {
    const h = analysis.headline;
    document.getElementById('la-takeaway-headline').textContent = LACore.sanitizeCopy(
      `Across ${analysis.dateRange.totalDays} days, you reached ${h.membersReached !== null ? LACore.formatInt(h.membersReached) : 'your'} members with ${LACore.formatInt(h.totalImpressions)} impressions (${LACore.formatPct(h.overallEngagementRate, 2)} engagement rate) and added ${LACore.formatInt(h.netGained)} new followers.`
    );

    const cards = [
      {
        label: 'Followers Now',
        value: h.followersNow !== null ? LACore.formatInt(h.followersNow) : 'N/A',
        note: `As of ${analysis.dateRange.endDateDisplay}`,
      },
      {
        label: 'Est. Start Followers',
        value: h.estimatedStartFollowers !== null ? LACore.formatInt(h.estimatedStartFollowers) : 'N/A',
        note: 'Estimated (current minus new gained)',
      },
      {
        label: 'Net New Followers',
        value: '+' + LACore.formatInt(h.netGained),
        note: `Over ${analysis.dateRange.totalDays} days`,
      },
      {
        label: 'Follower Growth %',
        value: h.periodGrowthPct !== null ? '+' + LACore.formatPct(h.periodGrowthPct, 1) : 'N/A',
        note: 'Over the analysed period',
      },
      {
        label: 'Total Impressions',
        value: LACore.formatInt(h.totalImpressions),
        note: 'Feed views across all posts',
      },
      {
        label: 'Members Reached',
        value: h.membersReached !== null ? LACore.formatInt(h.membersReached) : 'N/A',
        note: 'Unique LinkedIn members',
      },
      {
        label: 'Total Engagements',
        value: LACore.formatInt(h.totalEngagements),
        note: 'Reactions, comments, reposts & clicks',
      },
      {
        label: 'Engagement Rate',
        value: LACore.formatPct(h.overallEngagementRate, 2),
        note: 'Engagements divided by impressions',
      },
    ];

    document.getElementById('la-headline-grid').innerHTML = cards
      .map(
        (c) => `
        <div class="la-stat-card">
          <div class="la-stat-label">${escapeHtml(c.label)}</div>
          <div class="la-stat-value">${escapeHtml(c.value)}</div>
          <div class="la-stat-note">${escapeHtml(c.note)}</div>
        </div>
      `
      )
      .join('');
  }

  // ── SECTION 5: RECOMMENDATIONS & WEEKLY RHYTHM ─────────────────────────────
  function renderSection5Recommendations(analysis) {
    const recs = analysis.recommendations;
    const bt = analysis.postsAnalysis.bestTheme;
    document.getElementById('la-takeaway-recommendations').textContent = LACore.sanitizeCopy(
      bt
        ? `Prioritise '${bt.theme}' posts (median ${LACore.formatDec(bt.medianEngagements, 0)} engagements) tailored to ${(analysis.audience.topIndustry && analysis.audience.topIndustry.value) || 'your core industry'} and senior decision-makers.`
        : 'Practical recommendations built from your audience demographics and post history.'
    );

    document.getElementById('la-recs-grid').innerHTML = recs.items
      .map(
        (r) => `
        <div class="la-rec-card">
          <div class="la-rec-top">
            <div class="la-rec-title">${escapeHtml(r.title)}</div>
            <span class="la-conf-badge la-conf-${escapeHtml(r.confidence)}" title="${escapeHtml(r.sampleSizeText)}">
              ${escapeHtml(r.confidence)} confidence
            </span>
          </div>
          <div class="la-rec-evidence">${escapeHtml(r.evidence)}</div>
          <ul class="la-rec-ideas">
            ${r.ideas.map((idea) => `<li>${escapeHtml(idea)}</li>`).join('')}
          </ul>
        </div>
      `
      )
      .join('');

    document.getElementById('la-rhythm-grid').innerHTML = recs.weeklyRhythm
      .map(
        (slot) => `
        <div class="la-rhythm-card">
          <div class="la-rhythm-days">${escapeHtml(slot.days)}</div>
          <div class="la-rhythm-focus">${escapeHtml(slot.focus)}</div>
          <div class="la-rhythm-detail">${escapeHtml(slot.detail)}</div>
        </div>
      `
      )
      .join('');
  }

  // ── SECTION 6: FOLLOWER GROWTH ─────────────────────────────────────────────
  function renderSection6FollowerGrowth(analysis) {
    const fg = analysis.followerGrowth;
    const c = getChartColors();

    const bestText = fg.bestFullMonth
      ? `Your best full month was ${fg.bestFullMonth.label} (+${LACore.formatInt(fg.bestFullMonth.newFollowers)} followers)`
      : `You averaged ${LACore.formatDec(fg.dailyAverage, 1)} new followers per day`;
    const cmgrText =
      fg.cmgrLast3FullMonths !== null
        ? `, and your recent momentum over the last 3 full months is ${LACore.formatPct(fg.cmgrLast3FullMonths, 2)} compound monthly growth.`
        : '.';

    document.getElementById('la-takeaway-followers').textContent = LACore.sanitizeCopy(bestText + cmgrText);

    const summaryCards = [
      {
        label: 'CMGR (All Full Months)',
        value: fg.cmgrAllFullMonths !== null ? LACore.formatPct(fg.cmgrAllFullMonths, 2) : 'Need 1+ full month',
        note: `${fg.fullMonths.length} full calendar months`,
      },
      {
        label: 'Recent Momentum (Last 3m)',
        value: fg.cmgrLast3FullMonths !== null ? LACore.formatPct(fg.cmgrLast3FullMonths, 2) : 'Need full months',
        note: 'Compound monthly rate (last 3 full months)',
      },
      {
        label: 'Best Full Month',
        value: fg.bestFullMonth ? `+${LACore.formatInt(fg.bestFullMonth.newFollowers)}` : 'N/A',
        note: fg.bestFullMonth ? fg.bestFullMonth.label : 'Excludes partial months*',
      },
      {
        label: 'Worst Full Month',
        value: fg.worstFullMonth ? `+${LACore.formatInt(fg.worstFullMonth.newFollowers)}` : 'N/A',
        note: fg.worstFullMonth ? fg.worstFullMonth.label : 'Excludes partial months*',
      },
    ];

    document.getElementById('la-follower-summary-cards').innerHTML = summaryCards
      .map(
        (sc) => `
        <div class="la-stat-card">
          <div class="la-stat-label">${escapeHtml(sc.label)}</div>
          <div class="la-stat-value">${escapeHtml(sc.value)}</div>
          <div class="la-stat-note">${escapeHtml(sc.note)}</div>
        </div>
      `
      )
      .join('');

    const series = fg.useWeeklyCharts ? fg.weekly : fg.monthly;
    const periodWord = fg.useWeeklyCharts ? 'Week' : 'Month';
    document.getElementById('la-chart-new-fol-title').textContent =
      `New followers per ${periodWord.toLowerCase()} (* marks partial calendar months excluded from best/worst averages)`;

    // Bar chart: New followers
    makeChart('newFollowers', 'chart-new-followers', {
      type: 'bar',
      data: {
        labels: series.map((m) => m.label),
        datasets: [
          {
            label: 'New followers',
            data: series.map((m) => m.newFollowers),
            backgroundColor: series.map((m) => (m.isPartial ? c.cyanSoft : c.cyan)),
            borderColor: c.cyan,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
        },
      },
    });

    // Combined chart: Total followers + MoM % growth
    makeChart('totalFollowers', 'chart-total-followers', {
      type: 'bar',
      data: {
        labels: series.map((m) => m.label),
        datasets: [
          {
            type: 'line',
            label: 'Est. Total Followers',
            data: series.map((m) => m.endFollowers),
            borderColor: c.pink,
            backgroundColor: c.pinkSoft,
            yAxisID: 'y',
            tension: 0.25,
            pointRadius: 3,
          },
          {
            type: 'bar',
            label: 'Growth %',
            data: series.map((m) => (m.growthPct !== null ? Math.round(m.growthPct * 10) / 10 : 0)),
            backgroundColor: series.map((m) => (m.isPartial ? c.pinkSoft : c.cyanSoft)),
            borderColor: c.cyan,
            borderWidth: 1,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { type: 'linear', position: 'left', ticks: { color: c.muted }, grid: { color: c.grid } },
          y1: { type: 'linear', position: 'right', ticks: { color: c.muted, callback: (v) => v + '%' }, grid: { drawOnChartArea: false } },
        },
      },
    });

    const tableRowsHtml = series
      .map(
        (m) => `
        <tr class="${m.isPartial ? 'la-row-muted' : ''}">
          <td><strong>${escapeHtml(m.label)}</strong> ${m.isPartial ? '(partial)' : ''}</td>
          <td>+${LACore.formatInt(m.newFollowers)}</td>
          <td>${LACore.formatInt(m.startFollowers)}</td>
          <td>${LACore.formatInt(m.endFollowers)}</td>
          <td>${m.growthPct !== null ? LACore.formatPct(m.growthPct, 1) : 'N/A'}</td>
        </tr>
      `
      )
      .join('');

    const fullTableHtml = `
      <table class="la-table">
        <thead>
          <tr>
            <th>${periodWord}</th>
            <th>New Followers</th>
            <th>Est. Start Total</th>
            <th>Est. End Total</th>
            <th>Growth %</th>
          </tr>
        </thead>
        <tbody>${tableRowsHtml}</tbody>
      </table>
    `;
    document.getElementById('la-table-new-fol').innerHTML = fullTableHtml;
    document.getElementById('la-table-tot-fol').innerHTML = fullTableHtml;

    // Top 10 days table
    document.getElementById('la-top10-days-table').innerHTML = `
      <table class="la-table">
        <thead><tr><th>Rank</th><th>Date</th><th>Weekday</th><th>New Followers</th></tr></thead>
        <tbody>
          ${fg.top10Days
            .map(
              (d, idx) => `
              <tr>
                <td>#${idx + 1}</td>
                <td>${escapeHtml(d.dateDisplay)}</td>
                <td>${escapeHtml(d.weekday)}</td>
                <td><strong>+${LACore.formatInt(d.newFollowers)}</strong></td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  // ── SECTION 7: GROWTH PROJECTIONS & GOAL PLANNER ───────────────────────────
  function initGoalPlannerInputs(analysis) {
    let savedTarget = null;
    let savedDate = null;
    try {
      savedTarget = localStorage.getItem(GOAL_STORAGE_KEY_TARGET);
      savedDate = localStorage.getItem(GOAL_STORAGE_KEY_DATE);
    } catch (_e) {
      // ignore storage errors
    }

    if (!goalTargetInput.value) {
      goalTargetInput.value = savedTarget || analysis.projections.nextMilestone;
    }
    if (!goalDateInput.value) {
      goalDateInput.value = savedDate || analysis.defaultGoalPlan.targetDate || '2027-05-06';
    }
  }

  function renderSection7ProjectionsAndGoals(analysis, goalPlan) {
    const proj = analysis.projections;
    const c = getChartColors();

    projSlider.value = proj.chosenRatePct;
    projRateVal.textContent = LACore.formatPct(proj.chosenRatePct, 1);

    const firstM = proj.milestones[0];
    document.getElementById('la-takeaway-projections').textContent = LACore.sanitizeCopy(
      firstM
        ? `At ${LACore.formatPct(proj.chosenRatePct, 1)}/month compounding growth, you are projected to reach ${firstM.milestoneLabel} (${LACore.formatInt(firstM.milestone)}) around ${firstM.compoundDateLabel} (or ${firstM.steadyDateLabel} at a steady +${LACore.formatInt(proj.steadyMonthlyGain)}/month pace).`
        : 'Explore your projected follower milestones under compounding and steady-pace scenarios.'
    );

    const caveatEl = document.getElementById('la-projection-caveat');
    if (proj.caveat) {
      caveatEl.textContent = proj.caveat;
      caveatEl.style.display = 'block';
    } else {
      caveatEl.style.display = 'none';
    }

    // Projection chart: actual historical monthly + 12m projected curve
    const histSeries = analysis.followerGrowth.monthly.slice(-6);
    const histLabels = histSeries.map((m) => m.label);
    const futureCurve = proj.curve.slice(1);
    const allLabels = [...histLabels, ...futureCurve.map((pt) => pt.label)];

    const actualData = [
      ...histSeries.map((m) => m.endFollowers),
      ...futureCurve.map(() => null),
    ];
    const compoundData = [
      ...histSeries.slice(0, -1).map(() => null),
      proj.currentFollowers,
      ...futureCurve.map((pt) => pt.compoundTotal),
    ];
    const steadyData = [
      ...histSeries.slice(0, -1).map(() => null),
      proj.currentFollowers,
      ...futureCurve.map((pt) => pt.steadyTotal),
    ];

    makeChart('projections', 'chart-projections', {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Actual Followers',
            data: actualData,
            borderColor: c.cyan,
            backgroundColor: c.cyan,
            tension: 0.25,
          },
          {
            label: `Compounding (${LACore.formatPct(proj.chosenRatePct, 1)}/m)`,
            data: compoundData,
            borderColor: c.pink,
            borderDash: [6, 4],
            tension: 0.25,
          },
          {
            label: `Steady Pace (+${LACore.formatInt(proj.steadyMonthlyGain)}/m)`,
            data: steadyData,
            borderColor: c.green,
            borderDash: [3, 3],
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted }, grid: { color: c.grid } },
        },
      },
    });

    document.getElementById('la-table-proj-curve').innerHTML = `
      <table class="la-table">
        <thead><tr><th>Month</th><th>Compounding (${LACore.formatPct(proj.chosenRatePct, 1)}/m)</th><th>Steady Pace (+${LACore.formatInt(proj.steadyMonthlyGain)}/m)</th></tr></thead>
        <tbody>
          ${proj.curve
            .map(
              (pt) => `
              <tr>
                <td>${escapeHtml(pt.label)}</td>
                <td>${LACore.formatInt(pt.compoundTotal)}</td>
                <td>${LACore.formatInt(pt.steadyTotal)}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;

    document.getElementById('la-milestones-table').innerHTML = `
      <table class="la-table">
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Compounding (${LACore.formatPct(proj.chosenRatePct, 1)}/m)</th>
            <th>Steady Pace (+${LACore.formatInt(proj.steadyMonthlyGain)}/m)</th>
            <th>Reality Check (Monthly Gain Needed at Milestone vs Best Month of +${LACore.formatInt(proj.bestMonthGain)})</th>
          </tr>
        </thead>
        <tbody>
          ${proj.milestones
            .map(
              (m) => `
              <tr>
                <td><strong>${escapeHtml(m.milestoneLabel)}</strong> (${LACore.formatInt(m.milestone)})</td>
                <td>${escapeHtml(m.compoundDateLabel)}</td>
                <td>${escapeHtml(m.steadyDateLabel)}</td>
                <td>Needs <strong>+${LACore.formatInt(m.monthlyNeededAtMilestone)}/month</strong> (${m.ratioToBestMonth !== null ? LACore.formatDec(m.ratioToBestMonth, 1) + 'x your best month so far' : 'N/A'})</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;

    renderGoalPlannerOutput(goalPlan);
  }

  function renderGoalPlannerOutput(gp) {
    const outEl = document.getElementById('la-goal-output');
    if (!gp || !gp.valid) {
      outEl.innerHTML = `<div class="la-status info" style="display:block;">${escapeHtml(gp ? gp.friendlyMessage : 'Enter a target above your current followers and a future date.')}</div>`;
      return;
    }

    const badgeColour =
      gp.verdictKey === 'onTrack'
        ? 'var(--la-green)'
        : gp.verdictKey === 'stretch'
        ? 'var(--la-cyan)'
        : gp.verdictKey === 'ambitious'
        ? 'var(--la-amber)'
        : 'var(--la-red)';

    outEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;padding:0.85rem 1rem;background:var(--la-surface);border-radius:0.75rem;border:1px solid ${badgeColour};">
        <div>
          <span style="font-size:0.78rem;color:var(--la-text-muted);text-transform:uppercase;font-family:'Space Grotesk',sans-serif;font-weight:700;">Goal Verdict</span>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:900;color:${badgeColour};">${escapeHtml(gp.verdictLabel)}</div>
        </div>
        <div style="font-size:0.85rem;color:var(--la-text-muted);">
          At your current recent pace (+${LACore.formatDec(gp.recentAvgMonthlyGains, 0)}/month), you would hit <strong>${LACore.formatInt(gp.targetFollowers)}</strong> around <strong>${escapeHtml(gp.dateAtCurrentPace)}</strong>.
        </div>
      </div>

      <div class="la-stats-grid" style="margin-bottom:1rem;">
        <div class="la-stat-card">
          <div class="la-stat-label">Compound Monthly % Needed</div>
          <div class="la-stat-value">${LACore.formatPct(gp.compoundMonthlyRatePct, 1)}</div>
          <div class="la-stat-note">Over ${gp.monthsAvailable} months (${gp.daysAvailable} days)</div>
        </div>
        <div class="la-stat-card">
          <div class="la-stat-label">Needed Per Month</div>
          <div class="la-stat-value">+${LACore.formatDec(gp.neededPerMonth, 0)}</div>
          <div class="la-stat-note">vs +${LACore.formatDec(gp.recentAvgMonthlyGains, 0)} recent avg (best: +${LACore.formatInt(gp.bestMonthGains)})</div>
        </div>
        <div class="la-stat-card">
          <div class="la-stat-label">Needed Per Week</div>
          <div class="la-stat-value">+${LACore.formatDec(gp.neededPerWeek, 1)}</div>
          <div class="la-stat-note">New followers / week</div>
        </div>
        <div class="la-stat-card">
          <div class="la-stat-label">Needed Per Day</div>
          <div class="la-stat-value">+${LACore.formatDec(gp.neededPerDay, 1)}</div>
          <div class="la-stat-note">New followers / day</div>
        </div>
      </div>

      <div style="font-size:0.86rem;">
        <strong>How to close the gap from your own data:</strong>
        <ul class="la-rec-ideas" style="margin-top:0.4rem;">
          ${gp.suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // ── SECTION 8: WHICH POSTS PERFORM BEST ────────────────────────────────────
  function renderSection8Posts(analysis) {
    const pa = analysis.postsAnalysis;
    const c = getChartColors();

    const bestThemeText = pa.bestTheme
      ? `'${pa.bestTheme.theme}' is your strongest ranked theme with a median of ${LACore.formatDec(pa.bestTheme.medianEngagements, 0)} engagements across ${pa.bestTheme.postCount} posts.`
      : 'Review your top posts and adjust any keyword-detected themes using the dropdowns below.';
    document.getElementById('la-takeaway-posts').textContent = LACore.sanitizeCopy(bestThemeText);

    // Breakout post banner
    const breakoutEl = document.getElementById('la-breakout-banner');
    if (pa.breakoutPost) {
      const bp = pa.breakoutPost;
      breakoutEl.innerHTML = `
        <div class="la-hidden-strength-box" style="margin-bottom:1.25rem;">
          <strong>Breakout Post Callout (${bp.multiplier}x your #2 post):</strong>
          <a href="${escapeHtml(bp.post.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--la-cyan);font-weight:700;">${escapeHtml(bp.post.title)}</a>
          (${escapeHtml(bp.post.publishDateDisplay)}, theme: <strong>${escapeHtml(bp.post.theme)}</strong>) earned <strong>${LACore.formatInt(bp.post.engagements)} engagements</strong> and <strong>${LACore.formatInt(bp.post.impressions)} impressions</strong>, compared with ${LACore.formatInt(bp.secondBest.engagements)} engagements on your next best post.
        </div>
      `;
    } else {
      breakoutEl.innerHTML = '';
    }

    // Horizontal bar chart for Themes
    makeChart('themes', 'chart-themes', {
      type: 'bar',
      data: {
        labels: pa.themeStats.map((t) => `${t.theme} (${t.postCount})`),
        datasets: [
          {
            label: 'Median Engagements',
            data: pa.themeStats.map((t) => t.medianEngagements || 0),
            backgroundColor: pa.themeStats.map((t) => (t.meetsMinSample ? c.cyan : c.cyanSoft)),
            borderRadius: 4,
          },
          {
            label: 'Average Engagements',
            data: pa.themeStats.map((t) => Math.round((t.avgEngagements || 0) * 10) / 10),
            backgroundColor: pa.themeStats.map((t) => (t.meetsMinSample ? c.pink : c.pinkSoft)),
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
          y: { ticks: { color: c.text }, grid: { color: c.grid } },
        },
      },
    });

    // Theme Table
    document.getElementById('la-theme-table-wrap').innerHTML = `
      <table class="la-table">
        <thead>
          <tr>
            <th>Theme</th>
            <th>Posts</th>
            <th>Median Engagements</th>
            <th>Avg Engagements</th>
            <th>Avg Impressions</th>
            <th>Engagement Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${pa.themeStats
            .map((t) => {
              const isBest = pa.bestTheme && pa.bestTheme.theme === t.theme;
              const isWeak = pa.weakestTheme && pa.weakestTheme.theme === t.theme && !isBest;
              const rowCls = !t.meetsMinSample
                ? 'la-row-muted'
                : isBest
                ? 'la-row-best'
                : isWeak
                ? 'la-row-weak'
                : '';
              const badge = isBest
                ? ' <strong style="color:var(--la-green);">(Best)</strong>'
                : isWeak
                ? ' <strong style="color:var(--la-amber);">(Weakest)</strong>'
                : '';
              return `
                <tr class="${rowCls}">
                  <td><strong>${escapeHtml(t.theme)}</strong>${badge}</td>
                  <td>${t.postCount}</td>
                  <td>${t.medianEngagements !== null ? LACore.formatDec(t.medianEngagements, 0) : 'N/A'}</td>
                  <td>${t.avgEngagements !== null ? LACore.formatDec(t.avgEngagements, 1) : 'N/A'}</td>
                  <td>${t.avgImpressions !== null ? LACore.formatInt(t.avgImpressions) : 'N/A'}</td>
                  <td>${t.engagementRate !== null ? LACore.formatPct(t.engagementRate, 2) : 'N/A'}</td>
                  <td>${escapeHtml(t.statusNote)}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    `;

    // Hashtags Section
    const hashSec = document.getElementById('la-hashtags-section');
    if (pa.hashtagStats && pa.hashtagStats.length > 0) {
      hashSec.style.display = 'block';
      makeChart('hashtags', 'chart-hashtags', {
        type: 'bar',
        data: {
          labels: pa.hashtagStats.map((h) => `${h.hashtag} (${h.postCount})`),
          datasets: [
            {
              label: 'Median Engagements',
              data: pa.hashtagStats.map((h) => h.medianEngagements),
              backgroundColor: c.cyan,
              borderRadius: 4,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: c.text } } },
          scales: {
            x: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
            y: { ticks: { color: c.text }, grid: { color: c.grid } },
          },
        },
      });

      document.getElementById('la-hashtags-table-wrap').innerHTML = `
        <table class="la-table">
          <thead><tr><th>Hashtag</th><th>Posts Used</th><th>Median Engagements</th><th>Avg Engagements</th><th>Avg Impressions</th></tr></thead>
          <tbody>
            ${pa.hashtagStats
              .map(
                (h) => `
                <tr>
                  <td><strong>${escapeHtml(h.hashtag)}</strong></td>
                  <td>${h.postCount}</td>
                  <td>${LACore.formatDec(h.medianEngagements, 0)}</td>
                  <td>${LACore.formatDec(h.avgEngagements, 1)}</td>
                  <td>${LACore.formatInt(h.avgImpressions)}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      `;
    } else {
      hashSec.style.display = 'none';
    }

    renderTopPostsTable(pa);

    // Recent Posts
    const recentSec = document.getElementById('la-recent-posts-section');
    if (pa.recentPosts && pa.recentPosts.length > 0) {
      recentSec.style.display = 'block';
      document.getElementById('la-recent-posts-table-wrap').innerHTML = `
        <table class="la-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Post</th>
              <th>Type</th>
              <th>Impressions</th>
              <th>Out-of-Network %</th>
              <th>Reactions</th>
              <th>Comments</th>
              <th>Reposts</th>
              <th>Followers Gained</th>
              <th>Watch Time</th>
              <th>Top 50 Comparison</th>
            </tr>
          </thead>
          <tbody>
            ${pa.recentPosts
              .map(
                (rp) => `
                <tr>
                  <td>${escapeHtml(rp.publishDateDisplay)}</td>
                  <td class="la-cell-wrap"><a href="${escapeHtml(rp.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--la-cyan);">${escapeHtml(rp.title)}</a></td>
                  <td>${escapeHtml(rp.postType)}</td>
                  <td><strong>${LACore.formatInt(rp.impressions)}</strong></td>
                  <td>${escapeHtml(rp.outOfNetworkDisplay || 'N/A')}</td>
                  <td>${LACore.formatInt(rp.reactions)}</td>
                  <td>${LACore.formatInt(rp.comments)}</td>
                  <td>${LACore.formatInt(rp.reposts)}</td>
                  <td>${rp.followersGained !== null ? '+' + LACore.formatInt(rp.followersGained) : 'N/A'}</td>
                  <td>${escapeHtml(rp.watchTime ? `${rp.watchTime} (avg ${rp.avgWatchTime || 'N/A'})` : 'N/A')}</td>
                  <td><span class="${rp.reachedTop50 ? 'la-up' : ''}">${escapeHtml(rp.top50ComparisonText)}</span></td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      `;
    } else {
      recentSec.style.display = 'none';
    }

    document.getElementById('la-top50-note').textContent = pa.top50Note;
  }

  function renderTopPostsTable(pa) {
    let list = pa.top10ByEngagements;
    if (state.activePostSort === 'impressions') list = pa.top10ByImpressions;
    else if (state.activePostSort === 'rate') list = pa.top10ByEngagementRate;
    else if (state.activePostSort === 'all') {
      list = [...pa.allPosts].sort(
        (a, b) => (b.engagements || 0) - (a.engagements || 0) || (b.impressions || 0) - (a.impressions || 0)
      );
    }

    const themeOptions = LACore.CONFIG.ALL_THEMES;
    document.getElementById('la-top-posts-table-wrap').innerHTML = `
      <table class="la-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Post Title (from URL slug)</th>
            <th>Theme (Click to fix)</th>
            <th>Engagements</th>
            <th>Impressions</th>
            <th>Engagement Rate</th>
          </tr>
        </thead>
        <tbody>
          ${list
            .map(
              (p, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${escapeHtml(p.publishDateDisplay)}</td>
                <td class="la-cell-wrap">
                  <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--la-cyan);font-weight:600;">
                    ${escapeHtml(p.title)}
                  </a>
                </td>
                <td>
                  <select class="la-theme-select" data-post-url="${escapeHtml(p.url)}" aria-label="Change theme for ${escapeHtml(p.title)}">
                    ${themeOptions
                      .map(
                        (th) =>
                          `<option value="${escapeHtml(th)}" ${th === p.theme ? 'selected' : ''}>${escapeHtml(th)}</option>`
                      )
                      .join('')}
                  </select>
                </td>
                <td><strong>${p.engagements !== null ? LACore.formatInt(p.engagements) : 'Not in top 50'}</strong></td>
                <td>${p.impressions !== null ? LACore.formatInt(p.impressions) : 'Not in top 50'}</td>
                <td>${p.engagementRate !== null ? LACore.formatPct(p.engagementRate, 2) : 'Only in 1 list'}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;

    document.querySelectorAll('.la-theme-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const url = e.currentTarget.getAttribute('data-post-url');
        const newTheme = e.currentTarget.value;
        if (url && newTheme) {
          state.themeOverrides[url] = newTheme;
          recalculateAndRender(false);
        }
      });
    });
  }

  // ── SECTION 9: BEST DAYS ───────────────────────────────────────────────────
  function renderSection9BestDays(analysis) {
    const bd = analysis.bestDays;
    const c = getChartColors();

    const impDay = bd.bestImpressionDay;
    const folDay = bd.bestFollowerDay;
    document.getElementById('la-takeaway-days').textContent = LACore.sanitizeCopy(
      impDay && folDay
        ? `${impDay.weekday} averages the highest daily impressions (${LACore.formatInt(impDay.avgImpressions)}/day), while ${folDay.weekday} averages the most new followers (${LACore.formatDec(folDay.avgNewFollowers, 1)}/day).`
        : 'Daily impressions, engagements and follower gains broken down by day of the week.'
    );

    const notes = [];
    if (bd.followerVsImpressionMismatch) notes.push(bd.followerVsImpressionMismatch);
    for (const cn of bd.themeConfoundNotes) notes.push(cn);
    notes.push(bd.postingTimeNote);

    document.getElementById('la-days-notes').innerHTML = notes
      .map((n) => `<div class="la-summary-pill">${escapeHtml(n)}</div>`)
      .join('');

    makeChart('daysImp', 'chart-days-imp', {
      type: 'bar',
      data: {
        labels: bd.weekdayStats.map((w) => w.shortDay),
        datasets: [
          {
            label: 'Avg Impressions',
            data: bd.weekdayStats.map((w) => Math.round(w.avgImpressions)),
            backgroundColor: c.cyan,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
        },
      },
    });

    makeChart('daysFol', 'chart-days-fol', {
      type: 'bar',
      data: {
        labels: bd.weekdayStats.map((w) => w.shortDay),
        datasets: [
          {
            label: 'Avg New Followers',
            data: bd.weekdayStats.map((w) => Math.round(w.avgNewFollowers * 10) / 10),
            backgroundColor: c.pink,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
        },
      },
    });

    document.getElementById('la-days-table-wrap').innerHTML = `
      <table class="la-table">
        <thead>
          <tr>
            <th>Weekday</th>
            <th>Avg Daily Impressions</th>
            <th>Avg Daily Engagements</th>
            <th>Avg New Followers</th>
            <th>Top Posts Published</th>
            <th>Median Top Post Engagements</th>
            <th>Median Top Post Impressions</th>
          </tr>
        </thead>
        <tbody>
          ${bd.weekdayStats
            .map(
              (w) => `
              <tr class="${!w.meetsMinPosts ? 'la-row-muted' : ''}">
                <td><strong>${escapeHtml(w.weekday)}</strong></td>
                <td>${LACore.formatInt(w.avgImpressions)}</td>
                <td>${LACore.formatDec(w.avgEngagements, 1)}</td>
                <td>${LACore.formatDec(w.avgNewFollowers, 1)}</td>
                <td>${w.topPostCount} ${!w.meetsMinPosts ? '(not enough posts to judge)' : ''}</td>
                <td>${w.meetsMinPosts && w.medianPostEngagements !== null ? LACore.formatDec(w.medianPostEngagements, 0) : 'Not enough posts to judge'}</td>
                <td>${w.meetsMinPosts && w.medianPostImpressions !== null ? LACore.formatInt(w.medianPostImpressions) : 'Not enough posts to judge'}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  // ── SECTION 10: REACH AND ENGAGEMENT TREND ─────────────────────────────────
  function renderSection10ReachTrend(analysis) {
    const rt = analysis.reachAndEngagementTrend;
    const c = getChartColors();

    document.getElementById('la-takeaway-reach').textContent = LACore.sanitizeCopy(
      rt.correlation.explanation
    );

    const flagsEl = document.getElementById('la-reach-flags');
    flagsEl.innerHTML = rt.divergenceFlags
      .map((f) => `<div class="la-status info" style="display:block;margin-bottom:0.75rem;">${escapeHtml(f)}</div>`)
      .join('');

    // Daily impressions + 7d rolling average
    makeChart('dailyImpressions', 'chart-daily-impressions', {
      type: 'line',
      data: {
        labels: rt.daily.map((d) => d.dateDisplay),
        datasets: [
          {
            label: '7-Day Rolling Average',
            data: rt.daily.map((d) => d.rolling7dImpressions),
            borderColor: c.pink,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.25,
          },
          {
            label: 'Daily Impressions',
            data: rt.daily.map((d) => d.impressions),
            borderColor: c.cyanSoft,
            backgroundColor: c.cyanSoft,
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted, maxTicksLimit: 10 }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
        },
      },
    });

    const series = rt.useWeeklyCharts ? rt.weekly : rt.monthly;
    const periodWord = rt.useWeeklyCharts ? 'Week' : 'Month';
    document.getElementById('la-chart-monthly-imp-title').textContent =
      `Impressions & Engagements per ${periodWord}`;

    makeChart('monthlyReach', 'chart-monthly-reach', {
      type: 'bar',
      data: {
        labels: series.map((m) => m.label),
        datasets: [
          {
            label: 'Impressions',
            data: series.map((m) => m.impressions),
            backgroundColor: series.map((m) => (m.isPartial ? c.cyanSoft : c.cyan)),
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted }, grid: { color: c.grid }, beginAtZero: true },
        },
      },
    });

    makeChart('monthlyEr', 'chart-monthly-er', {
      type: 'line',
      data: {
        labels: series.map((m) => m.label),
        datasets: [
          {
            label: 'Engagement Rate %',
            data: series.map((m) => Math.round(m.engagementRate * 100) / 100),
            borderColor: c.pink,
            backgroundColor: c.pinkSoft,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: {
          x: { ticks: { color: c.muted }, grid: { color: c.grid } },
          y: { ticks: { color: c.muted, callback: (v) => v + '%' }, grid: { color: c.grid }, beginAtZero: true },
        },
      },
    });

    document.getElementById('la-reach-monthly-table').innerHTML = `
      <table class="la-table">
        <thead><tr><th>${periodWord}</th><th>Impressions</th><th>Engagements</th><th>Engagement Rate</th></tr></thead>
        <tbody>
          ${series
            .map(
              (m) => `
              <tr class="${m.isPartial ? 'la-row-muted' : ''}">
                <td><strong>${escapeHtml(m.label)}</strong></td>
                <td>${LACore.formatInt(m.impressions)}</td>
                <td>${LACore.formatInt(m.engagements)}</td>
                <td>${LACore.formatPct(m.engagementRate, 2)}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;

    const corr = rt.correlation;
    document.getElementById('la-correlation-box').innerHTML = `
      <h3 class="la-steps-title">Impressions vs New Followers Correlation (${escapeHtml(corr.strength)})</h3>
      <p style="font-size:0.9rem;line-height:1.55;margin-bottom:0.5rem;">${escapeHtml(corr.explanation)}</p>
      ${
        corr.hasEnoughDays
          ? `<div style="font-size:0.8rem;color:var(--la-text-muted);">Same-day Pearson r = <strong>${LACore.formatDec(corr.sameDayR, 2)}</strong> &nbsp;|&nbsp; Next-day (1-day lag) Pearson r = <strong>${LACore.formatDec(corr.lag1DayR, 2)}</strong> (${corr.pairedDays} days tested).</div>`
          : ''
      }
    `;
  }

  // ── SECTION 11: WHO FOLLOWS YOU (AUDIENCE DEMOGRAPHICS) ────────────────────
  function renderSection11Audience(analysis) {
    const aud = analysis.audience;
    const c = getChartColors();

    document.getElementById('la-takeaway-audience').textContent = LACore.sanitizeCopy(
      aud.plainSummaries[0]
        ? aud.plainSummaries.slice(0, 2).join(' ')
        : 'Top-N demographic breakdown of your followers across 6 categories.'
    );

    document.getElementById('la-audience-pills').innerHTML = aud.plainSummaries
      .map((s) => `<div class="la-summary-pill">${escapeHtml(s)}</div>`)
      .join('');

    const catOrder = ['Industry', 'Seniority', 'Job title', 'Company size', 'Location', 'Company'];
    const gridEl = document.getElementById('la-audience-charts-grid');
    gridEl.innerHTML = catOrder
      .map((cat, idx) => {
        const list = (aud.categories && aud.categories[cat]) || [];
        return `
          <div class="la-chart-block">
            <div class="la-chart-header">
              <span class="la-chart-title">${escapeHtml(cat)} (Top-N list, does not sum to 100%)</span>
              <button type="button" class="la-toggle-table-btn" data-target="la-aud-table-${idx}">Show as table</button>
            </div>
            <div class="la-canvas-holder"><canvas id="chart-aud-${idx}"></canvas></div>
            <div id="la-aud-table-${idx}" class="la-table-wrap" style="display:none;margin-top:0.75rem;">
              <table class="la-table">
                <thead><tr><th>${escapeHtml(cat)}</th><th>Share of Followers</th></tr></thead>
                <tbody>
                  ${list
                    .map(
                      (item) => `
                      <tr>
                        <td>${escapeHtml(item.value)}</td>
                        <td><strong>${escapeHtml(item.display)}</strong></td>
                      </tr>
                    `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      })
      .join('');

    catOrder.forEach((cat, idx) => {
      const list = (aud.categories && aud.categories[cat]) || [];
      makeChart(`aud_${idx}`, `chart-aud-${idx}`, {
        type: 'bar',
        data: {
          labels: list.map((i) => i.value),
          datasets: [
            {
              label: 'Followers %',
              data: list.map((i) => i.percentage),
              backgroundColor: idx % 2 === 0 ? c.cyan : c.pink,
              borderRadius: 4,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = list[ctx.dataIndex];
                  return `Followers: ${item ? item.display : ctx.raw + '%'}`;
                },
              },
            },
          },
          scales: {
            x: { ticks: { color: c.muted, callback: (v) => v + '%' }, grid: { color: c.grid }, beginAtZero: true },
            y: { ticks: { color: c.text }, grid: { color: c.grid } },
          },
        },
      });
    });
  }

  // ── SECTION 12: WHO SEES YOUR CONTENT VS WHO FOLLOWS YOU ───────────────────
  function renderSection12ContentVsAudience(analysis) {
    const cva = analysis.contentVsAudience;
    const c = getChartColors();

    document.getElementById('la-takeaway-cva').textContent = LACore.sanitizeCopy(
      cva.topGaps[0]
        ? cva.topGaps[0].description
        : 'Side-by-side comparison of your follower demographics vs the people viewing your posts.'
    );

    document.getElementById('la-cva-gaps').innerHTML = cva.topGaps
      .map(
        (g, idx) =>
          `<div class="la-summary-pill"><strong>Gap #${idx + 1}:</strong> ${escapeHtml(g.description)}</div>`
      )
      .join('');

    const catOrder = ['Industry', 'Seniority', 'Location', 'Company size', 'Job title', 'Company'];
    const gridEl = document.getElementById('la-cva-charts-grid');
    gridEl.innerHTML = catOrder
      .map((cat, idx) => {
        const rows = ((cva.comparisons && cva.comparisons[cat]) || []).slice(0, 10);
        return `
          <div class="la-chart-block">
            <div class="la-chart-header">
              <span class="la-chart-title">${escapeHtml(cat)}: Followers vs Content Viewers</span>
              <button type="button" class="la-toggle-table-btn" data-target="la-cva-table-${idx}">Show as table</button>
            </div>
            <div class="la-canvas-holder"><canvas id="chart-cva-${idx}"></canvas></div>
            <div id="la-cva-table-${idx}" class="la-table-wrap" style="display:none;margin-top:0.75rem;">
              <table class="la-table">
                <thead><tr><th>${escapeHtml(cat)}</th><th>Followers</th><th>Content Viewers</th><th>Gap</th></tr></thead>
                <tbody>
                  ${rows
                    .map(
                      (r) => `
                      <tr>
                        <td>${escapeHtml(r.value)}</td>
                        <td>${escapeHtml(r.audienceDisplay)}</td>
                        <td>${escapeHtml(r.contentDisplay)}</td>
                        <td>${r.diff >= 0 ? '+' : ''}${LACore.formatDec(r.diff, 1)} pp</td>
                      </tr>
                    `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      })
      .join('');

    catOrder.forEach((cat, idx) => {
      const rows = ((cva.comparisons && cva.comparisons[cat]) || []).slice(0, 8);
      makeChart(`cva_${idx}`, `chart-cva-${idx}`, {
        type: 'bar',
        data: {
          labels: rows.map((r) => r.value),
          datasets: [
            {
              label: 'Followers %',
              data: rows.map((r) => r.audiencePct),
              backgroundColor: c.cyan,
              borderRadius: 3,
            },
            {
              label: 'Content Viewers %',
              data: rows.map((r) => r.contentPct),
              backgroundColor: c.pink,
              borderRadius: 3,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: c.text } } },
          scales: {
            x: { ticks: { color: c.muted, callback: (v) => v + '%' }, grid: { color: c.grid }, beginAtZero: true },
            y: { ticks: { color: c.text }, grid: { color: c.grid } },
          },
        },
      });
    });
  }

  // ── SECTION 13: DATA NOTES ─────────────────────────────────────────────────
  function renderSection13DataNotes(analysis) {
    const allNotes = [...analysis.dataNotes, ...(analysis.warnings || [])];
    document.getElementById('la-data-notes-list').innerHTML = allNotes
      .map(
        (n) => `
        <li>
          <span class="material-symbols-outlined" style="color:var(--la-cyan);flex-shrink:0;" aria-hidden="true">check_circle</span>
          <span>${escapeHtml(n)}</span>
        </li>
      `
      )
      .join('');
  }

  // ── SHAREABLE SUMMARY CARD (CANVAS 1200x627 & 1080x1350) ───────────────────
  function getShareCardConfig() {
    const sizeRadio = document.querySelector('input[name="la-card-size"]:checked');
    const isPortrait = sizeRadio && sizeRadio.value === 'portrait';
    const enabled = {};
    document.querySelectorAll('#la-card-checks input[type="checkbox"]').forEach((cb) => {
      enabled[cb.getAttribute('data-stat')] = cb.checked;
    });
    const isProgress = Boolean(
      state.comparison &&
      state.comparison.valid &&
      cardProgressModeInput &&
      cardProgressModeInput.checked
    );
    return { isPortrait, enabled, isProgress };
  }

  function renderShareCard() {
    if (!state.analysis || !shareCanvas) return;
    const { isPortrait, enabled, isProgress } = getShareCardConfig();
    const w = isPortrait ? 1080 : 1200;
    const h = isPortrait ? 1350 : 627;
    shareCanvas.width = w;
    shareCanvas.height = h;

    const ctx = shareCanvas.getContext('2d');
    const a = state.analysis;
    const hs = a.healthScore;
    const ct = a.creatorType.primaryType;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0e0e13');
    bgGrad.addColorStop(0.55, '#161622');
    bgGrad.addColorStop(1, '#1d1128');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle accent glow circles
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 127, 0.12)';
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.2, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0, 238, 252, 0.1)';
    ctx.beginPath();
    ctx.arc(w * 0.15, h * 0.85, 240, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Outer border
    ctx.strokeStyle = 'rgba(0, 238, 252, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    // Header
    ctx.fillStyle = '#00eefc';
    ctx.font = '700 22px "Space Grotesk", sans-serif';
    ctx.fillText('LINKEDIN CREATOR ANALYTICS SNAPSHOT', 64, 78);

    ctx.fillStyle = '#acaab1';
    ctx.font = '600 18px "Manrope", sans-serif';
    ctx.fillText(`${a.dateRange.startDateDisplay} to ${a.dateRange.endDateDisplay}`, 64, 108);

    // Hero Left: Health Score Ring + Creator Type
    const ringX = isPortrait ? 220 : 210;
    const ringY = isPortrait ? 310 : 320;
    const ringR = isPortrait ? 115 : 105;

    if (enabled.healthScore) {
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(248, 245, 253, 0.12)';
      ctx.lineWidth = 20;
      ctx.stroke();

      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (hs.score / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, startAngle, endAngle);
      ctx.strokeStyle = hs.colour;
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.fillStyle = '#f8f5fd';
      ctx.textAlign = 'center';
      ctx.font = '900 68px "Space Grotesk", sans-serif';
      ctx.fillText(String(hs.score), ringX, ringY + 14);

      ctx.fillStyle = hs.colour;
      ctx.font = '800 22px "Space Grotesk", sans-serif';
      ctx.fillText(hs.label.toUpperCase(), ringX, ringY + 52);

      ctx.fillStyle = '#acaab1';
      ctx.font = '600 15px "Manrope", sans-serif';
      ctx.fillText('HEALTH SCORE / 100', ringX, ringY - 52);
      ctx.textAlign = 'left';
    }

    // Creator Type Badge
    if (enabled.creatorType) {
      const boxX = isPortrait ? 400 : 370;
      const boxY = isPortrait ? 210 : 155;
      const boxW = w - boxX - 64;
      const boxH = 115;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = ct.colour;
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.fillRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = ct.colour;
      ctx.font = '800 16px "Space Grotesk", sans-serif';
      ctx.fillText('CREATOR TYPE', boxX + 24, boxY + 34);

      ctx.fillStyle = '#f8f5fd';
      ctx.font = '900 34px "Space Grotesk", sans-serif';
      ctx.fillText(ct.name.toUpperCase(), boxX + 24, boxY + 74);

      ctx.fillStyle = '#acaab1';
      ctx.font = '600 17px "Manrope", sans-serif';
      ctx.fillText(ct.shortDescription, boxX + 24, boxY + 100);
    }

    // Stat tiles
    const tiles = [];
    if (isProgress && state.comparison) {
      const cm = state.comparison.metrics;
      tiles.push({
        label: 'FOLLOWERS SINCE LAST CHECK',
        value: `${cm.followersDelta >= 0 ? '+' : ''}${LACore.formatInt(cm.followersDelta)}`,
      });
      tiles.push({
        label: 'HEALTH SCORE PROGRESS',
        value: `${cm.healthBefore} -> ${cm.healthAfter} (${cm.healthDelta >= 0 ? '+' : ''}${cm.healthDelta})`,
      });
    } else {
      if (enabled.growthPct && a.headline.periodGrowthPct !== null) {
        tiles.push({
          label: 'FOLLOWER GROWTH',
          value: `+${LACore.formatPct(a.headline.periodGrowthPct, 1)}`,
        });
      }
      if (enabled.followersGained) {
        tiles.push({
          label: 'NEW FOLLOWERS GAINED',
          value: `+${LACore.formatInt(a.headline.netGained)}`,
        });
      }
    }
    if (enabled.bestTheme && a.postsAnalysis.bestTheme) {
      tiles.push({
        label: 'BEST CONTENT THEME',
        value: a.postsAnalysis.bestTheme.theme,
      });
    }
    if (enabled.bestDay && a.bestDays.bestFollowerDay) {
      tiles.push({
        label: 'BEST DAY FOR FOLLOWERS',
        value: a.bestDays.bestFollowerDay.weekday,
      });
    }
    if (enabled.topIndustry && a.audience.topIndustry) {
      tiles.push({
        label: 'TOP AUDIENCE INDUSTRY',
        value: `${a.audience.topIndustry.value.slice(0, 28)} (${a.audience.topIndustry.display})`,
      });
    }

    const startX = isPortrait ? 64 : 370;
    const startY = isPortrait ? 470 : 295;
    const cols = isPortrait ? 1 : 2;
    const availW = w - startX - 64;
    const gap = 18;
    const tileW = cols === 1 ? availW : (availW - gap) / 2;
    const tileH = isPortrait ? 115 : 82;

    tiles.slice(0, isPortrait ? 6 : 4).forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const tx = startX + col * (tileW + gap);
      const ty = startY + row * (tileH + gap);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(tx, ty, tileW, tileH);
      ctx.strokeStyle = 'rgba(248, 245, 253, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx, ty, tileW, tileH);

      ctx.fillStyle = '#00eefc';
      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.fillText(t.label, tx + 18, ty + 28);

      ctx.fillStyle = '#f8f5fd';
      ctx.font = isPortrait ? '800 30px "Space Grotesk", sans-serif' : '800 22px "Space Grotesk", sans-serif';
      ctx.fillText(String(t.value), tx + 18, ty + (isPortrait ? 74 : 60));
    });

    // Footer branding
    ctx.fillStyle = '#FF007F';
    ctx.font = '800 20px "Space Grotesk", sans-serif';
    ctx.fillText('Analysed free at johnb.io/linkedin-analyser', 64, h - 52);
  }

  function buildShareSummaryText() {
    if (!state.analysis) return '';
    const a = state.analysis;
    const lines = [
      `My LinkedIn Creator Analytics breakdown (${a.dateRange.startDateDisplay} to ${a.dateRange.endDateDisplay}):`,
      `- LinkedIn Health Score: ${a.healthScore.score}/100 (${a.healthScore.label})`,
      `- Creator Type: ${a.creatorType.primaryType.name} (${a.creatorType.primaryType.shortDescription})`,
      `- New followers gained: +${LACore.formatInt(a.headline.netGained)}${a.headline.periodGrowthPct !== null ? ` (+${LACore.formatPct(a.headline.periodGrowthPct, 1)})` : ''}`,
    ];
    if (a.postsAnalysis.bestTheme) {
      lines.push(`- Strongest post theme: ${a.postsAnalysis.bestTheme.theme} (median ${LACore.formatDec(a.postsAnalysis.bestTheme.medianEngagements, 0)} engagements)`);
    }
    if (a.bestDays.bestFollowerDay) {
      lines.push(`- Best day for new followers: ${a.bestDays.bestFollowerDay.weekday}`);
    }
    if (a.audience.topIndustry) {
      lines.push(`- Top audience sector: ${a.audience.topIndustry.value} (${a.audience.topIndustry.display})`);
    }
    lines.push('', 'Analysed free in the browser at https://johnb.io/linkedin-analyser');
    return LACore.sanitizeCopy(lines.join('\n'));
  }

  // ── DOWNLOADS: PDF REPORT, MARKDOWN FOR AI & CLIPBOARD ─────────────────────
  function downloadAiMarkdown() {
    if (!state.analysis) return;
    const md = LACore.generateAiMarkdown(state.analysis, state.comparison, state.goalPlan);
    const today = new Date().toISOString().slice(0, 10);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkedin-analysis-${today}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function copyAiMarkdown() {
    if (!state.analysis) return;
    const md = LACore.generateAiMarkdown(state.analysis, state.comparison, state.goalPlan);
    try {
      await navigator.clipboard.writeText(md);
      copyMdLabel.textContent = 'Copied for AI!';
      setTimeout(() => {
        copyMdLabel.textContent = 'Copy for ChatGPT / Claude';
      }, 2500);
    } catch (_e) {
      showStatus('Clipboard permission denied. Please use the Download for AI (.md) button.', 'error');
    }
  }

  function downloadPdfReport() {
    if (!state.analysis) return;
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showStatus('PDF library is still loading. Please try again in a moment.', 'error');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 16;
    const contentW = pageW - margin * 2;
    let y = 20;

    const a = state.analysis;
    const h = a.headline;

    function checkPageBreak(neededMm) {
      if (y + neededMm > pageH - 18) {
        doc.addPage();
        y = 20;
      }
    }

    function addSectionHeading(title) {
      checkPageBreak(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(LACore.sanitizeCopy(title), margin, y);
      y += 2;
      doc.setDrawColor(200, 200, 210);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
    }

    function addWrappedParagraph(text, bold = false, fontSize = 9.5) {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(LACore.sanitizeCopy(String(text || '')), contentW);
      checkPageBreak(lines.length * 4.6 + 3);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 2.5;
    }

    function addChartImage(canvasId, heightMm = 55) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      try {
        checkPageBreak(heightMm + 8);
        const dataUrl = canvas.toDataURL('image/png', 0.92);
        doc.addImage(dataUrl, 'PNG', margin, y, contentW, heightMm);
        y += heightMm + 6;
      } catch (_e) {
        // ignore canvas security/export failure
      }
    }

    // Cover Header
    doc.setFillColor(14, 14, 19);
    doc.rect(0, 0, pageW, 48, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('LinkedIn Creator Analytics Report', margin, 22);
    doc.setFontSize(10);
    doc.setTextColor(0, 238, 252);
    doc.text(
      `Analysed range: ${a.dateRange.startDateDisplay} to ${a.dateRange.endDateDisplay} (${a.dateRange.totalDays} days)  |  Created with johnb.io/linkedin-analyser`,
      margin,
      34
    );

    y = 58;

    // 1. Health Score & Creator Type
    addSectionHeading('1. LinkedIn Health Score & Creator Type');
    addWrappedParagraph(
      `Health Score: ${a.healthScore.score}/100 (${a.healthScore.label}) - Primary Creator Type: ${a.creatorType.primaryType.name} (${a.creatorType.primaryType.shortDescription})`,
      true,
      10.5
    );
    addWrappedParagraph(a.creatorType.hiddenStrengthCallout, false, 9.5);
    for (const comp of a.healthScore.components) {
      addWrappedParagraph(
        `- ${comp.name}: ${LACore.formatDec(comp.score, 1)}/${LACore.formatDec(comp.scaledMaxPoints, 0)} (${comp.metricDisplay}) - Tip: ${comp.tip}`,
        false,
        9
      );
    }

    // 2. Top 5 Takeaways
    addSectionHeading('2. Top 5 Takeaways');
    a.top5Takeaways.forEach((t, idx) => {
      addWrappedParagraph(`${idx + 1}. ${t}`, false, 9.5);
    });

    // 3. Comparison if present
    if (state.comparison && state.comparison.valid) {
      addSectionHeading('3. Before and After Comparison');
      addWrappedParagraph(state.comparison.verdict, true, 10);
      addWrappedParagraph(state.comparison.overlapNote, false, 9);
    }

    // 4. Headline Numbers
    addSectionHeading('4. Headline Numbers');
    addWrappedParagraph(
      `Followers now: ${LACore.formatInt(h.followersNow)}  |  Est. start followers: ${LACore.formatInt(h.estimatedStartFollowers)}  |  Net gained: +${LACore.formatInt(h.netGained)} (${LACore.formatPct(h.periodGrowthPct, 1)})`,
      true,
      9.5
    );
    addWrappedParagraph(
      `Total impressions: ${LACore.formatInt(h.totalImpressions)}  |  Members reached: ${LACore.formatInt(h.membersReached)}  |  Total engagements: ${LACore.formatInt(h.totalEngagements)} (${LACore.formatPct(h.overallEngagementRate, 2)} engagement rate)`,
      false,
      9.5
    );

    // 5. Recommendations
    addSectionHeading('5. What You Should Post Next');
    for (const r of a.recommendations.items) {
      addWrappedParagraph(`${r.title} (${r.confidence} confidence): ${r.evidence}`, true, 9.5);
      for (const idea of r.ideas) {
        addWrappedParagraph(`  * ${idea}`, false, 9);
      }
    }

    // 6. Follower Growth
    addSectionHeading('6. Follower Growth');
    addWrappedParagraph(document.getElementById('la-takeaway-followers').textContent, true, 9.5);
    addChartImage('chart-new-followers', 52);

    // 7. Projections & Goal Planner
    addSectionHeading('7. Growth Projections & Goal Planner');
    addWrappedParagraph(document.getElementById('la-takeaway-projections').textContent, true, 9.5);
    addChartImage('chart-projections', 52);
    if (state.goalPlan && state.goalPlan.valid) {
      addWrappedParagraph(
        `Goal Planner (${LACore.formatInt(state.goalPlan.targetFollowers)} by ${state.goalPlan.targetDateDisplay}): ${state.goalPlan.verdictLabel} - Needs +${LACore.formatDec(state.goalPlan.neededPerMonth, 0)}/month (${LACore.formatPct(state.goalPlan.compoundMonthlyRatePct, 1)}/month compounding).`,
        false,
        9.5
      );
    }

    // 8. Best Posts & Themes
    addSectionHeading('8. Best Performing Posts & Themes');
    addWrappedParagraph(document.getElementById('la-takeaway-posts').textContent, true, 9.5);
    addChartImage('chart-themes', 48);
    a.postsAnalysis.top10ByEngagements.slice(0, 8).forEach((p, idx) => {
      addWrappedParagraph(
        `#${idx + 1} (${p.publishDateDisplay}) [${p.theme}] ${p.title} - ${LACore.formatInt(p.engagements)} engagements, ${LACore.formatInt(p.impressions)} impressions`,
        false,
        8.8
      );
    });

    // 9. Best Days & 10. Reach Trend
    addSectionHeading('9. Best Days & Reach Trend');
    addWrappedParagraph(document.getElementById('la-takeaway-days').textContent, true, 9.5);
    addWrappedParagraph(a.reachAndEngagementTrend.correlation.explanation, false, 9);
    addChartImage('chart-daily-impressions', 48);

    // 11. Audience & 12. Content vs Audience
    addSectionHeading('10. Audience Profile & Content Reach Gaps');
    for (const s of a.audience.plainSummaries) {
      addWrappedParagraph(`- ${s}`, false, 9);
    }
    for (const g of a.contentVsAudience.topGaps) {
      addWrappedParagraph(`- Gap: ${g.description}`, false, 9);
    }

    const today = new Date().toISOString().slice(0, 10);
    doc.save(`linkedin-analysis-${today}.pdf`);
  }

  // ── EVENT LISTENERS ────────────────────────────────────────────────────────
  // Light / Dark Mode Toggle
  themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    mainWrap.setAttribute('data-theme', state.theme);
    themeIcon.textContent = state.theme === 'dark' ? 'light_mode' : 'dark_mode';
    themeLabel.textContent = state.theme === 'dark' ? 'Light mode' : 'Dark mode';
    if (state.analysis) {
      recalculateAndRender(false);
    }
  });

  // Primary Upload Dropzone
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handlePrimaryFile(file);
  });
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handlePrimaryFile(file);
    fileInput.value = '';
  });

  // Demo Button
  demoBtn.addEventListener('click', loadSyntheticDemo);

  // Comparison Upload Dropzone
  compareDropzone.addEventListener('click', () => compareInput.click());
  compareDropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      compareInput.click();
    }
  });
  compareDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    compareDropzone.classList.add('drag-over');
  });
  compareDropzone.addEventListener('dragleave', () => compareDropzone.classList.remove('drag-over'));
  compareDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    compareDropzone.classList.remove('drag-over');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleComparisonFile(file);
  });
  compareInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleComparisonFile(file);
    compareInput.value = '';
  });
  compareDemoBtn.addEventListener('click', loadSyntheticComparisonDemo);
  removeComparisonBtn.addEventListener('click', () => {
    state.secondaryParsed = null;
    state.comparison = null;
    recalculateAndRender(false);
  });

  // Projection Slider & Goal Planner
  projSlider.addEventListener('input', (e) => {
    state.projectionRatePct = parseFloat(e.target.value);
    projRateVal.textContent = LACore.formatPct(state.projectionRatePct, 1);
    if (state.analysis) {
      state.analysis.projections = LACore.buildProjections(
        state.analysis.followerGrowth,
        state.analysis.dateRange.endDate,
        state.projectionRatePct
      );
      renderSection7ProjectionsAndGoals(state.analysis, state.goalPlan);
    }
  });

  projResetBtn.addEventListener('click', () => {
    state.projectionRatePct = null;
    if (state.analysis) {
      state.analysis.projections = LACore.buildProjections(
        state.analysis.followerGrowth,
        state.analysis.dateRange.endDate,
        null
      );
      renderSection7ProjectionsAndGoals(state.analysis, state.goalPlan);
    }
  });

  goalCalcBtn.addEventListener('click', () => {
    if (!state.analysis) return;
    try {
      localStorage.setItem(GOAL_STORAGE_KEY_TARGET, String(goalTargetInput.value || ''));
      localStorage.setItem(GOAL_STORAGE_KEY_DATE, String(goalDateInput.value || ''));
    } catch (_e) {
      // ignore storage errors
    }
    state.goalPlan = LACore.planGoal(
      state.analysis,
      goalTargetInput.value,
      goalDateInput.value
    );
    renderGoalPlannerOutput(state.goalPlan);
  });

  // Top Posts Sort Tabs
  document.querySelectorAll('.la-post-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.la-post-tab').forEach((b) => {
        b.classList.remove('active', 'la-btn-secondary');
        b.classList.add('la-btn-ghost');
      });
      btn.classList.add('active', 'la-btn-secondary');
      btn.classList.remove('la-btn-ghost');
      state.activePostSort = btn.getAttribute('data-sort') || 'engagements';
      if (state.analysis) renderTopPostsTable(state.analysis.postsAnalysis);
    });
  });

  // Delegated "Show as table" toggle buttons
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.la-toggle-table-btn');
    if (!toggleBtn) return;
    const targetId = toggleBtn.getAttribute('data-target');
    const targetEl = targetId ? document.getElementById(targetId) : null;
    if (!targetEl) return;
    const isHidden = targetEl.style.display === 'none';
    targetEl.style.display = isHidden ? 'block' : 'none';
    if (toggleBtn.textContent.includes('Show') || toggleBtn.textContent.includes('Hide')) {
      toggleBtn.textContent = isHidden ? 'Hide table' : 'Show as table';
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Share Card controls
  document.querySelectorAll('input[name="la-card-size"], #la-card-checks input, #la-card-progress-mode').forEach((el) => {
    el.addEventListener('change', renderShareCard);
  });

  downloadCardBtn.addEventListener('click', () => {
    renderShareCard();
    const { isPortrait } = getShareCardConfig();
    const suffix = isPortrait ? '1080x1350' : '1200x627';
    const dataUrl = shareCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `linkedin-summary-${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  copySummaryBtn.addEventListener('click', async () => {
    const text = buildShareSummaryText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copySummaryLabel.textContent = 'Copied post text!';
      setTimeout(() => {
        copySummaryLabel.textContent = 'Copy summary text';
      }, 2500);
    } catch (_e) {
      showStatus('Could not copy to clipboard.', 'error');
    }
  });

  // Sticky Bar Download & Reset Actions
  downloadPdfBtn.addEventListener('click', downloadPdfReport);
  downloadMdBtn.addEventListener('click', downloadAiMarkdown);
  copyMdBtn.addEventListener('click', copyAiMarkdown);

  resetBtn.addEventListener('click', () => {
    destroyCharts();
    state.isDemo = false;
    state.primaryParsed = null;
    state.secondaryParsed = null;
    state.themeOverrides = {};
    state.projectionRatePct = null;
    state.analysis = null;
    state.comparison = null;
    resultsWrap.style.display = 'none';
    clearStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
