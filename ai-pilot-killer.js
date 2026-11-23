(function () {
  'use strict';

  var STORAGE_KEY = 'johnb_ai_pilot_killer_v1';
  var WORKING_WEEKS = 46;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var CURRENCIES = {
    GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
    USD: { symbol: '$', code: 'USD', locale: 'en-US' },
    EUR: { symbol: '€', code: 'EUR', locale: 'en-IE' }
  };

  var QUADRANTS = {
    ship: {
      id: 'ship',
      label: 'Ship Now',
      short: 'Ship Now',
      colour: '#22c55e',
      glow: 'url(#pkGlowShip)',
      badgeClass: 'pk-quad-badge--ship',
      order: 1
    },
    bet: {
      id: 'bet',
      label: 'Strategic Bet',
      short: 'Strategic Bet',
      colour: '#00eefc',
      glow: 'url(#pkGlowBet)',
      badgeClass: 'pk-quad-badge--bet',
      order: 2
    },
    trap: {
      id: 'trap',
      label: 'Governance Trap',
      short: 'Governance Trap',
      colour: '#f59e0b',
      glow: 'url(#pkGlowTrap)',
      badgeClass: 'pk-quad-badge--trap',
      order: 3
    },
    kill: {
      id: 'kill',
      label: 'Kill It / Plain Code',
      short: 'Kill / Plain Code',
      colour: '#ff007f',
      glow: 'url(#pkGlowKill)',
      badgeClass: 'pk-quad-badge--kill',
      order: 4
    }
  };

  function getSampleInitiatives() {
    return [
      {
        id: 'uc-sales-crm',
        name: 'Sales Call Summary -> CRM',
        department: 'Commercial / RevOps',
        summary: 'Transcribe discovery calls, extract MEDDIC fields and next steps, and push draft updates to CRM for rep sign-off.',
        dataReadiness: 5,
        blastRadius: 1,
        governance: 2,
        adoptionFriction: 2,
        deterministicAlt: 1,
        staffCount: 28,
        runsPerWeek: 10,
        minutesSaved: 14,
        hourlyRate: 65,
        reviewOverheadPct: 20,
        buildCost: 8000,
        annualRunCost: 16000
      },
      {
        id: 'uc-support-triage',
        name: 'Customer Support Ticket Triage',
        department: 'Customer Ops',
        summary: 'Classify incoming tickets, detect intent and urgency, extract order references and draft first responses for agent review.',
        dataReadiness: 4,
        blastRadius: 2,
        governance: 2,
        adoptionFriction: 2,
        deterministicAlt: 2,
        staffCount: 35,
        runsPerWeek: 40,
        minutesSaved: 3.5,
        hourlyRate: 38,
        reviewOverheadPct: 25,
        buildCost: 18000,
        annualRunCost: 14000
      },
      {
        id: 'uc-sop-qa',
        name: 'Internal SOP Q&A Assistant',
        department: 'Operations / IT',
        summary: 'Grounded search over Confluence, HR policies and operational runbooks with inline source citations.',
        dataReadiness: 3,
        blastRadius: 2,
        governance: 2,
        adoptionFriction: 3,
        deterministicAlt: 2,
        staffCount: 120,
        runsPerWeek: 4,
        minutesSaved: 8,
        hourlyRate: 50,
        reviewOverheadPct: 30,
        buildCost: 28000,
        annualRunCost: 22000
      },
      {
        id: 'uc-refund-agent',
        name: 'Autonomous Refund Agent',
        department: 'Finance & Support',
        summary: 'Customer-facing agent authorised to trigger card refunds and goodwill credits up to 250 via payment APIs.',
        dataReadiness: 3,
        blastRadius: 5,
        governance: 4,
        adoptionFriction: 3,
        deterministicAlt: 3,
        staffCount: 30,
        runsPerWeek: 35,
        minutesSaved: 6,
        hourlyRate: 42,
        reviewOverheadPct: 35,
        buildCost: 65000,
        annualRunCost: 34000
      },
      {
        id: 'uc-legal-signoff',
        name: 'Automated Legal Contract Sign-Off',
        department: 'Legal & Procurement',
        summary: 'Autonomous redlining and approval of vendor MSAs and DPAs without mandatory solicitor review below 100k.',
        dataReadiness: 2,
        blastRadius: 5,
        governance: 5,
        adoptionFriction: 4,
        deterministicAlt: 2,
        staffCount: 6,
        runsPerWeek: 5,
        minutesSaved: 40,
        hourlyRate: 115,
        reviewOverheadPct: 65,
        buildCost: 95000,
        annualRunCost: 48000
      },
      {
        id: 'uc-board-deck',
        name: 'Monthly Board Deck Formatter',
        department: 'Finance / Exec Ops',
        summary: 'Pull monthly KPI tables from warehouse exports and reformat slide charts and variance commentary.',
        dataReadiness: 4,
        blastRadius: 2,
        governance: 1,
        adoptionFriction: 2,
        deterministicAlt: 5,
        staffCount: 4,
        runsPerWeek: 1,
        minutesSaved: 90,
        hourlyRate: 70,
        reviewOverheadPct: 40,
        buildCost: 22000,
        annualRunCost: 12000
      }
    ];
  }

  var state = {
    currency: 'GBP',
    adoptionRatePct: 60,
    filter: 'all',
    sortBy: 'priority',
    selectedId: null,
    activeTab: 'scores',
    initiatives: []
  };

  var clearArmedUntil = 0;
  var toastTimer = null;

  /* ── HELPERS ── */
  function clamp(n, min, max) {
    var num = Number(n);
    if (!Number.isFinite(num)) return min;
    return Math.min(max, Math.max(min, num));
  }

  function sanitizeInitiative(raw, fallbackIdx) {
    var obj = raw && typeof raw === 'object' ? raw : {};
    var id = typeof obj.id === 'string' && obj.id.trim()
      ? obj.id.trim().slice(0, 48)
      : 'uc-' + Date.now().toString(36) + '-' + (fallbackIdx || 0);
    return {
      id: id,
      name: String(obj.name || 'Untitled AI Request').trim().slice(0, 80) || 'Untitled AI Request',
      department: String(obj.department || 'General').trim().slice(0, 40) || 'General',
      summary: String(obj.summary || '').trim().slice(0, 180),
      dataReadiness: Math.round(clamp(obj.dataReadiness != null ? obj.dataReadiness : 3, 1, 5)),
      blastRadius: Math.round(clamp(obj.blastRadius != null ? obj.blastRadius : 3, 1, 5)),
      governance: Math.round(clamp(obj.governance != null ? obj.governance : 3, 1, 5)),
      adoptionFriction: Math.round(clamp(obj.adoptionFriction != null ? obj.adoptionFriction : 3, 1, 5)),
      deterministicAlt: Math.round(clamp(obj.deterministicAlt != null ? obj.deterministicAlt : 2, 1, 5)),
      staffCount: Math.round(clamp(obj.staffCount != null ? obj.staffCount : 15, 1, 50000)),
      runsPerWeek: clamp(obj.runsPerWeek != null ? obj.runsPerWeek : 10, 0.5, 1000),
      minutesSaved: clamp(obj.minutesSaved != null ? obj.minutesSaved : 8, 0.5, 480),
      hourlyRate: clamp(obj.hourlyRate != null ? obj.hourlyRate : 50, 5, 1000),
      reviewOverheadPct: clamp(obj.reviewOverheadPct != null ? obj.reviewOverheadPct : 30, 0, 95),
      buildCost: clamp(obj.buildCost != null ? obj.buildCost : 20000, 0, 10000000),
      annualRunCost: clamp(obj.annualRunCost != null ? obj.annualRunCost : 12000, 0, 10000000)
    };
  }

  function getCurrency() {
    return CURRENCIES[state.currency] || CURRENCIES.GBP;
  }

  function formatMoney(amount, compact) {
    var c = getCurrency();
    var num = Number(amount) || 0;
    var sign = num < 0 ? '-' : '';
    var abs = Math.abs(num);
    if (compact) {
      if (abs >= 1000000) {
        return sign + c.symbol + (abs / 1000000).toFixed(2) + 'm';
      }
      if (abs >= 10000) {
        return sign + c.symbol + Math.round(abs / 1000) + 'k';
      }
      if (abs >= 1000) {
        return sign + c.symbol + (abs / 1000).toFixed(1) + 'k';
      }
    }
    return sign + c.symbol + Math.round(abs).toLocaleString(c.locale);
  }

  function formatPayback(months) {
    if (!Number.isFinite(months)) return 'Never';
    if (months <= 0) return 'Immediate';
    if (months > 60) return '60+ mos';
    return months.toFixed(1) + ' mos';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── CORE EVALUATION ENGINE ── */
  function evaluateInitiative(item) {
    var annualRuns = item.staffCount * item.runsPerWeek * WORKING_WEEKS;
    var grossHours = (annualRuns * item.minutesSaved) / 60;
    var naiveAnnualValue = grossHours * item.hourlyRate;

    var qaKeepFactor = Math.max(0, 1 - item.reviewOverheadPct / 100);
    var adoptionFactor = state.adoptionRatePct / 100;
    var realisticGrossSavings = naiveAnnualValue * qaKeepFactor * adoptionFactor;

    var totalYear1Cost = item.buildCost + item.annualRunCost;
    var year1NetValue = realisticGrossSavings - totalYear1Cost;
    var steadyNetAnnualValue = realisticGrossSavings - item.annualRunCost;

    var monthlySteady = steadyNetAnnualValue / 12;
    var paybackMonths = Infinity;
    if (item.buildCost === 0 && steadyNetAnnualValue > 0) {
      paybackMonths = 0;
    } else if (monthlySteady > 0) {
      paybackMonths = item.buildCost / monthlySteady;
    }

    var haircutPct = naiveAnnualValue > 0
      ? Math.round((1 - realisticGrossSavings / naiveAnnualValue) * 100)
      : 0;

    // Operational Feasibility & Safety (0-100, higher = safer & more ready)
    var dataScore = ((item.dataReadiness - 1) / 4) * 100;
    var safetyScore = ((5 - item.blastRadius) / 4) * 100;
    var govScore = ((5 - item.governance) / 4) * 100;
    var adoptionScore = ((5 - item.adoptionFriction) / 4) * 100;

    var feasibilityScore = Math.round(
      dataScore * 0.28 +
      safetyScore * 0.28 +
      govScore * 0.24 +
      adoptionScore * 0.20
    );

    // Realistic Net Value Score (0-100, 50 = funding threshold)
    var valueBase;
    if (steadyNetAnnualValue <= 0) {
      var lossRatio = Math.min(1, Math.abs(steadyNetAnnualValue) / 50000);
      valueBase = 28 - lossRatio * 18;
    } else {
      valueBase = 28 + 52 * (1 - Math.exp(-steadyNetAnnualValue / 75000));
    }

    var paybackAdj = -12;
    if (paybackMonths <= 6) paybackAdj = 20;
    else if (paybackMonths <= 12) paybackAdj = 12;
    else if (paybackMonths <= 18) paybackAdj = 4;
    else if (paybackMonths <= 24) paybackAdj = -4;

    var detPenalty = 0;
    if (item.deterministicAlt === 5) detPenalty = -18;
    else if (item.deterministicAlt === 4) detPenalty = -10;

    var valueScore = Math.round(clamp(valueBase + paybackAdj + detPenalty, 6, 94));
    var plainCodeTrap = item.deterministicAlt >= 4;

    var highValue = valueScore >= 50;
    var highFeasibility = feasibilityScore >= 50;
    var quadrantId;

    if (highValue && highFeasibility) {
      quadrantId = 'ship';
    } else if (highValue && !highFeasibility) {
      quadrantId = 'bet';
    } else if (!highValue && !highFeasibility) {
      quadrantId = 'trap';
    } else {
      quadrantId = 'kill';
    }

    // Build vs Buy vs Configure logic
    var buildVsBuy;
    var bvbRationale;

    if (plainCodeTrap) {
      buildVsBuy = 'Plain Code / SQL';
      bvbRationale = 'Skip the LLM. Build a deterministic SQL pipeline, BI template, regex or workflow rule engine for a fraction of the run cost and zero hallucination drift.';
    } else if (quadrantId === 'trap' || (quadrantId === 'kill' && steadyNetAnnualValue <= 0)) {
      buildVsBuy = 'Defer / Kill';
      bvbRationale = 'Do not fund build or vendor procurement yet. Revisit only if source data is cleaned up, scope is narrowed to draft-only, or costs drop sharply.';
    } else if (item.dataReadiness >= 4 && item.governance <= 2 && item.blastRadius <= 2 && item.buildCost <= 15000) {
      buildVsBuy = 'Buy SaaS';
      bvbRationale = 'Commodity workflow with clean data and low regulatory risk. Buy an established SaaS tool with native integrations instead of maintaining bespoke prompts.';
    } else if (item.dataReadiness >= 3 && item.governance <= 3 && item.adoptionFriction <= 3 && item.blastRadius <= 3) {
      buildVsBuy = 'Configure Platform';
      bvbRationale = 'Configure your existing enterprise AI platform (e.g. Claude, ChatGPT Enterprise or Copilot connectors) with scoped permissions and basic evals rather than custom infrastructure.';
    } else {
      buildVsBuy = 'Custom Build (Phased)';
      bvbRationale = 'High blast radius, regulatory scrutiny or messy internal data requires custom guardrails, audit logging, automated evals and human-in-the-loop approval gates.';
    }

    // Blunt verdict rationale
    var rationale = buildRationale(item, {
      quadrantId: quadrantId,
      plainCodeTrap: plainCodeTrap,
      feasibilityScore: feasibilityScore,
      steadyNetAnnualValue: steadyNetAnnualValue,
      paybackMonths: paybackMonths,
      haircutPct: haircutPct
    });

    // Composite priority score for ranking
    var quadWeight = quadrantId === 'ship' ? 300 : quadrantId === 'bet' ? 200 : quadrantId === 'kill' ? 100 : 0;
    if (plainCodeTrap && quadrantId === 'ship') quadWeight = 160;
    var priorityRankScore = quadWeight + valueScore * 1.1 + feasibilityScore * 0.6;

    return {
      item: item,
      annualRuns: annualRuns,
      grossHours: grossHours,
      naiveAnnualValue: naiveAnnualValue,
      realisticGrossSavings: realisticGrossSavings,
      totalYear1Cost: totalYear1Cost,
      year1NetValue: year1NetValue,
      steadyNetAnnualValue: steadyNetAnnualValue,
      paybackMonths: paybackMonths,
      haircutPct: haircutPct,
      feasibilityScore: feasibilityScore,
      valueScore: valueScore,
      plainCodeTrap: plainCodeTrap,
      quadrantId: quadrantId,
      quadrant: QUADRANTS[quadrantId],
      buildVsBuy: buildVsBuy,
      bvbRationale: bvbRationale,
      rationale: rationale,
      priorityRankScore: priorityRankScore
    };
  }

  function buildRationale(item, m) {
    if (m.plainCodeTrap) {
      return 'Scored ' + item.deterministicAlt + '/5 on Deterministic Alternative. Paying LLM API bills and QA overhead for a rules-based workflow burns budget and adds error risk. Hand this to Data or Ops Engineering as a plain script.';
    }
    if (m.quadrantId === 'ship') {
      return 'Clears the bar on both feasibility (' + m.feasibilityScore + '/100) and CFO-adjusted economics (' + formatMoney(m.steadyNetAnnualValue) + '/yr net, ' + formatPayback(m.paybackMonths) + ' payback after a ' + m.haircutPct + '% QA/adoption haircut). Fund this first.';
    }
    if (m.quadrantId === 'bet') {
      var blockers = [];
      if (item.blastRadius >= 4) blockers.push('high error blast radius (' + item.blastRadius + '/5)');
      if (item.governance >= 4) blockers.push('heavy regulatory exposure (' + item.governance + '/5)');
      if (item.dataReadiness <= 2) blockers.push('messy source data (' + item.dataReadiness + '/5)');
      if (item.adoptionFriction >= 4) blockers.push('steep adoption friction (' + item.adoptionFriction + '/5)');
      var blockerStr = blockers.length ? blockers.join(' and ') : 'operational complexity';
      return 'Real economic upside (' + formatMoney(m.steadyNetAnnualValue) + '/yr steady net), but blocked by ' + blockerStr + '. Ring-fence a human-in-the-loop pilot with hard spend caps before scaling.';
    }
    if (m.quadrantId === 'trap') {
      return 'Classic governance trap: low feasibility (' + m.feasibilityScore + '/100) paired with weak adjusted returns (' + formatMoney(m.steadyNetAnnualValue) + '/yr net after ' + item.reviewOverheadPct + '% human QA). Kill or descope to non-binding draft support.';
    }
    if (m.steadyNetAnnualValue <= 0) {
      return 'Looks easy to ship, but the maths fails once you apply ' + state.adoptionRatePct + '% adoption and ' + item.reviewOverheadPct + '% QA overhead (' + formatMoney(m.steadyNetAnnualValue) + '/yr steady net). Kill it and keep the budget.';
    }
    return 'Technically straightforward, but payback (' + formatPayback(m.paybackMonths) + ') and net steady return (' + formatMoney(m.steadyNetAnnualValue) + '/yr) are too thin to justify engineering attention ahead of Ship Now priorities.';
  }

  function evaluatePortfolio() {
    var evaluated = state.initiatives.map(evaluateInitiative);
    // Stable index numbers (1..N) based on priority order so matrix & table numbers match
    var byPriority = evaluated.slice().sort(function (a, b) {
      return b.priorityRankScore - a.priorityRankScore;
    });
    byPriority.forEach(function (ev, idx) {
      ev.displayNum = idx + 1;
    });
    return {
      all: evaluated,
      ranked: byPriority
    };
  }

  /* ── PERSISTENCE & SHAREABLE URL ── */
  function saveToStorage() {
    try {
      var payload = {
        currency: state.currency,
        adoptionRatePct: state.adoptionRatePct,
        initiatives: state.initiatives
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore storage quota or private browsing errors
    }
  }

  function encodeStateToHash() {
    var compact = {
      c: state.currency,
      a: state.adoptionRatePct,
      i: state.initiatives.map(function (it) {
        return [
          it.id,
          it.name,
          it.department,
          it.summary,
          it.dataReadiness,
          it.blastRadius,
          it.governance,
          it.adoptionFriction,
          it.deterministicAlt,
          it.staffCount,
          it.runsPerWeek,
          it.minutesSaved,
          it.hourlyRate,
          it.reviewOverheadPct,
          it.buildCost,
          it.annualRunCost
        ];
      })
    };
    var json = JSON.stringify(compact);
    var bytes = new TextEncoder().encode(json);
    var binary = '';
    for (var i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    var b64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return '#s=' + b64;
  }

  function decodeStateFromHash(hashStr) {
    if (!hashStr || hashStr.indexOf('#s=') !== 0) return null;
    try {
      var b64 = hashStr.slice(3).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var binary = atob(b64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      var json = new TextDecoder().decode(bytes);
      var parsed = JSON.parse(json);
      if (!parsed || !Array.isArray(parsed.i)) return null;
      var items = parsed.i.slice(0, 40).map(function (row, idx) {
        if (!Array.isArray(row)) return sanitizeInitiative(row, idx);
        return sanitizeInitiative({
          id: row[0],
          name: row[1],
          department: row[2],
          summary: row[3],
          dataReadiness: row[4],
          blastRadius: row[5],
          governance: row[6],
          adoptionFriction: row[7],
          deterministicAlt: row[8],
          staffCount: row[9],
          runsPerWeek: row[10],
          minutesSaved: row[11],
          hourlyRate: row[12],
          reviewOverheadPct: row[13],
          buildCost: row[14],
          annualRunCost: row[15]
        }, idx);
      });
      return {
        currency: CURRENCIES[parsed.c] ? parsed.c : 'GBP',
        adoptionRatePct: Math.round(clamp(parsed.a != null ? parsed.a : 60, 15, 100)),
        initiatives: items
      };
    } catch (e) {
      return null;
    }
  }

  function loadInitialState() {
    var fromHash = decodeStateFromHash(window.location.hash);
    if (fromHash) {
      state.currency = fromHash.currency;
      state.adoptionRatePct = fromHash.adoptionRatePct;
      state.initiatives = fromHash.initiatives;
      state.selectedId = state.initiatives.length ? state.initiatives[0].id : null;
      saveToStorage();
      showToast('Loaded shared portfolio from URL (' + state.initiatives.length + ' initiatives).');
      return;
    }

    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.initiatives)) {
          state.currency = CURRENCIES[parsed.currency] ? parsed.currency : 'GBP';
          state.adoptionRatePct = Math.round(clamp(parsed.adoptionRatePct != null ? parsed.adoptionRatePct : 60, 15, 100));
          state.initiatives = parsed.initiatives.map(sanitizeInitiative);
          state.selectedId = state.initiatives.length ? state.initiatives[0].id : null;
          return;
        }
      }
    } catch (e) {
      // Fallback to sample
    }

    state.initiatives = getSampleInitiatives();
    state.selectedId = state.initiatives[0].id;
    saveToStorage();
  }

  /* ── DOM REFERENCES ── */
  var dom = {};

  function cacheDom() {
    dom.adoptionSlider = document.getElementById('pk-adoption-slider');
    dom.adoptionValue = document.getElementById('pk-adoption-value');
    dom.currencyBtns = Array.prototype.slice.call(document.querySelectorAll('.pk-seg-btn[data-currency]'));

    dom.addBtn = document.getElementById('pk-add-btn');
    dom.sampleBtn = document.getElementById('pk-sample-btn');
    dom.clearBtn = document.getElementById('pk-clear-btn');
    dom.shareBtn = document.getElementById('pk-share-btn');
    dom.packBtn = document.getElementById('pk-pack-btn');
    dom.csvBtn = document.getElementById('pk-csv-btn');
    dom.printBtn = document.getElementById('pk-print-btn');

    dom.toast = document.getElementById('pk-toast');

    dom.kpiNetVal = document.getElementById('pk-kpi-net-value');
    dom.kpiNetSub = document.getElementById('pk-kpi-net-sub');
    dom.kpiPayback = document.getElementById('pk-kpi-payback');
    dom.kpiPaybackSub = document.getElementById('pk-kpi-payback-sub');
    dom.kpiShipCount = document.getElementById('pk-kpi-ship-count');
    dom.kpiShipSub = document.getElementById('pk-kpi-ship-sub');
    dom.kpiKillCount = document.getElementById('pk-kpi-kill-count');
    dom.kpiKillSub = document.getElementById('pk-kpi-kill-sub');
    dom.kpiSavedSpend = document.getElementById('pk-kpi-saved-spend');
    dom.kpiSavedSub = document.getElementById('pk-kpi-saved-sub');

    dom.matrixStage = document.getElementById('pk-matrix-stage');
    dom.matrixSvg = document.getElementById('pk-matrix-svg');
    dom.svgGrid = document.getElementById('pk-svg-grid');
    dom.svgBubbles = document.getElementById('pk-svg-bubbles');
    dom.tooltip = document.getElementById('pk-tooltip');
    dom.emptyMatrix = document.getElementById('pk-empty-matrix');
    dom.emptyAddBtn = document.getElementById('pk-empty-add-btn');
    dom.emptySampleBtn = document.getElementById('pk-empty-sample-btn');

    dom.detailEmpty = document.getElementById('pk-detail-empty');
    dom.detailContent = document.getElementById('pk-detail-content');
    dom.detQuadBadge = document.getElementById('pk-det-quad-badge');
    dom.detBvbBadge = document.getElementById('pk-det-bvb-badge');
    dom.detName = document.getElementById('pk-det-name');
    dom.detDept = document.getElementById('pk-det-dept');
    dom.dupBtn = document.getElementById('pk-dup-btn');
    dom.delBtn = document.getElementById('pk-del-btn');
    dom.detLlmAlert = document.getElementById('pk-det-llm-alert');
    dom.detLlmAlertText = document.getElementById('pk-det-llm-alert-text');
    dom.detNaive = document.getElementById('pk-det-naive');
    dom.detRealistic = document.getElementById('pk-det-realistic');
    dom.detHaircut = document.getElementById('pk-det-haircut');
    dom.detSteady = document.getElementById('pk-det-steady');
    dom.detY1 = document.getElementById('pk-det-y1');
    dom.detPayback = document.getElementById('pk-det-payback');
    dom.detRationale = document.getElementById('pk-det-rationale');
    dom.detBvbRationale = document.getElementById('pk-det-bvb-rationale');
    dom.detMathPreview = document.getElementById('pk-det-math-preview');

    dom.tabScores = document.getElementById('pk-tab-scores');
    dom.tabEcon = document.getElementById('pk-tab-econ');
    dom.panelScores = document.getElementById('pk-panel-scores');
    dom.panelEcon = document.getElementById('pk-panel-econ');

    dom.inData = document.getElementById('pk-in-data');
    dom.valData = document.getElementById('pk-val-data');
    dom.inBlast = document.getElementById('pk-in-blast');
    dom.valBlast = document.getElementById('pk-val-blast');
    dom.inGov = document.getElementById('pk-in-gov');
    dom.valGov = document.getElementById('pk-val-gov');
    dom.inFriction = document.getElementById('pk-in-friction');
    dom.valFriction = document.getElementById('pk-val-friction');
    dom.inDet = document.getElementById('pk-in-det');
    dom.valDet = document.getElementById('pk-val-det');

    dom.inName = document.getElementById('pk-in-name');
    dom.inDept = document.getElementById('pk-in-dept');
    dom.inSummary = document.getElementById('pk-in-summary');
    dom.inStaff = document.getElementById('pk-in-staff');
    dom.inRuns = document.getElementById('pk-in-runs');
    dom.inMins = document.getElementById('pk-in-mins');
    dom.inRate = document.getElementById('pk-in-rate');
    dom.inQa = document.getElementById('pk-in-qa');
    dom.inBuild = document.getElementById('pk-in-build');
    dom.inRunCost = document.getElementById('pk-in-run-cost');
    dom.currSyms = Array.prototype.slice.call(document.querySelectorAll('.pk-curr-sym'));

    dom.filterBtns = Array.prototype.slice.call(document.querySelectorAll('.pk-filter-btn[data-filter]'));
    dom.sortSelect = document.getElementById('pk-sort-select');
    dom.tableBody = document.getElementById('pk-table-tbody');

    dom.packModal = document.getElementById('pk-pack-modal');
    dom.packBackdrop = document.getElementById('pk-pack-backdrop');
    dom.packClose = document.getElementById('pk-pack-close');
    dom.packCopy = document.getElementById('pk-pack-copy');
    dom.packDownload = document.getElementById('pk-pack-download');
    dom.packOutput = document.getElementById('pk-pack-output');

    dom.backToTop = document.getElementById('back-to-top');
  }

  function showToast(msg, isWarn) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add('visible');
    dom.toast.classList.toggle('pk-toast--warn', Boolean(isWarn));
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      dom.toast.classList.remove('visible', 'pk-toast--warn');
      dom.toast.textContent = '';
    }, 3600);
  }

  /* ── SVG MATRIX RENDERING ── */
  var PLOT = { left: 66, right: 696, top: 28, bottom: 428 };
  PLOT.width = PLOT.right - PLOT.left;
  PLOT.height = PLOT.bottom - PLOT.top;
  PLOT.midX = PLOT.left + PLOT.width / 2;
  PLOT.midY = PLOT.top + PLOT.height / 2;

  function svgEl(tag, attrs, text) {
    var el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, String(attrs[k]));
      });
    }
    if (text != null) el.textContent = String(text);
    return el;
  }

  function drawStaticMatrixGrid() {
    var g = dom.svgGrid;
    g.innerHTML = '';

    // Quadrant subtle background tints
    // Top-Left: Strategic Bet (Cyan)
    g.appendChild(svgEl('rect', {
      x: PLOT.left, y: PLOT.top, width: PLOT.width / 2, height: PLOT.height / 2,
      fill: 'rgba(0, 238, 252, 0.045)'
    }));
    // Top-Right: Ship Now (Green)
    g.appendChild(svgEl('rect', {
      x: PLOT.midX, y: PLOT.top, width: PLOT.width / 2, height: PLOT.height / 2,
      fill: 'rgba(34, 197, 94, 0.065)'
    }));
    // Bottom-Left: Governance Trap (Amber)
    g.appendChild(svgEl('rect', {
      x: PLOT.left, y: PLOT.midY, width: PLOT.width / 2, height: PLOT.height / 2,
      fill: 'rgba(245, 158, 11, 0.05)'
    }));
    // Bottom-Right: Kill It / Plain Code (Pink)
    g.appendChild(svgEl('rect', {
      x: PLOT.midX, y: PLOT.midY, width: PLOT.width / 2, height: PLOT.height / 2,
      fill: 'rgba(255, 0, 127, 0.055)'
    }));

    // Subtle 25% & 75% grid lines
    [0.25, 0.75].forEach(function (frac) {
      var x = PLOT.left + PLOT.width * frac;
      var y = PLOT.top + PLOT.height * frac;
      g.appendChild(svgEl('line', {
        x1: x, y1: PLOT.top, x2: x, y2: PLOT.bottom,
        stroke: 'rgba(248, 245, 253, 0.06)', 'stroke-width': 1
      }));
      g.appendChild(svgEl('line', {
        x1: PLOT.left, y1: y, x2: PLOT.right, y2: y,
        stroke: 'rgba(248, 245, 253, 0.06)', 'stroke-width': 1
      }));
    });

    // Outer frame
    g.appendChild(svgEl('rect', {
      x: PLOT.left, y: PLOT.top, width: PLOT.width, height: PLOT.height,
      fill: 'none', stroke: 'rgba(248, 245, 253, 0.2)', 'stroke-width': 1.2, rx: 4
    }));

    // Midpoint dashed crosshairs (X=50, Y=50)
    g.appendChild(svgEl('line', {
      x1: PLOT.midX, y1: PLOT.top, x2: PLOT.midX, y2: PLOT.bottom,
      stroke: 'rgba(248, 245, 253, 0.3)', 'stroke-width': 1.2, 'stroke-dasharray': '5 5'
    }));
    g.appendChild(svgEl('line', {
      x1: PLOT.left, y1: PLOT.midY, x2: PLOT.right, y2: PLOT.midY,
      stroke: 'rgba(248, 245, 253, 0.3)', 'stroke-width': 1.2, 'stroke-dasharray': '5 5'
    }));

    // Quadrant corner titles
    var qLabelStyle = {
      'font-family': 'Space Grotesk, sans-serif',
      'font-size': 11,
      'font-weight': 800,
      'letter-spacing': '0.09em'
    };
    g.appendChild(svgEl('text', Object.assign({
      x: PLOT.left + 12, y: PLOT.top + 20, fill: '#00eefc', opacity: 0.9
    }, qLabelStyle), 'STRATEGIC BET'));
    g.appendChild(svgEl('text', Object.assign({
      x: PLOT.right - 12, y: PLOT.top + 20, fill: '#4ade80', 'text-anchor': 'end', opacity: 0.95
    }, qLabelStyle), 'SHIP NOW'));
    g.appendChild(svgEl('text', Object.assign({
      x: PLOT.left + 12, y: PLOT.bottom - 12, fill: '#fbbf24', opacity: 0.9
    }, qLabelStyle), 'GOVERNANCE TRAP'));
    g.appendChild(svgEl('text', Object.assign({
      x: PLOT.right - 12, y: PLOT.bottom - 12, fill: '#ff5ca8', 'text-anchor': 'end', opacity: 0.95
    }, qLabelStyle), 'KILL IT / PLAIN CODE'));

    // X-axis label & ticks
    var axisStyle = {
      'font-family': 'Space Grotesk, sans-serif',
      'font-size': 11,
      'font-weight': 700,
      fill: '#b4b2bc',
      'letter-spacing': '0.07em'
    };
    g.appendChild(svgEl('text', Object.assign({
      x: PLOT.midX, y: 468, 'text-anchor': 'middle'
    }, axisStyle), 'OPERATIONAL FEASIBILITY & SAFETY  →'));
    g.appendChild(svgEl('text', {
      x: PLOT.left, y: 448, 'font-family': 'Space Grotesk, sans-serif', 'font-size': 10, fill: '#8f8d99'
    }, 'High Risk / Messy (0)'));
    g.appendChild(svgEl('text', {
      x: PLOT.right, y: 448, 'text-anchor': 'end', 'font-family': 'Space Grotesk, sans-serif', 'font-size': 10, fill: '#8f8d99'
    }, 'Safe / Ready (100)'));

    // Y-axis rotated label
    var yAxisTitle = svgEl('text', Object.assign({
      x: 20, y: PLOT.midY, 'text-anchor': 'middle',
      transform: 'rotate(-90 20 ' + PLOT.midY + ')'
    }, axisStyle), 'REALISTIC NET VALUE  →');
    g.appendChild(yAxisTitle);

    g.appendChild(svgEl('text', {
      x: PLOT.left - 8, y: PLOT.top + 10, 'text-anchor': 'end', 'font-family': 'Space Grotesk, sans-serif', 'font-size': 10, fill: '#8f8d99'
    }, 'High'));
    g.appendChild(svgEl('text', {
      x: PLOT.left - 8, y: PLOT.bottom - 2, 'text-anchor': 'end', 'font-family': 'Space Grotesk, sans-serif', 'font-size': 10, fill: '#8f8d99'
    }, 'Low'));
  }

  function renderMatrix(ranked) {
    var g = dom.svgBubbles;
    g.innerHTML = '';

    if (!ranked.length) {
      dom.emptyMatrix.hidden = false;
      hideTooltip();
      return;
    }
    dom.emptyMatrix.hidden = true;

    // Max absolute steady net value for bubble radius scaling
    var maxAbsVal = 25000;
    ranked.forEach(function (ev) {
      var abs = Math.abs(ev.steadyNetAnnualValue);
      if (abs > maxAbsVal) maxAbsVal = abs;
    });

    // Compute initial SVG coordinates + deterministic collision nudge
    var nodes = ranked.map(function (ev) {
      var x = PLOT.left + (ev.feasibilityScore / 100) * PLOT.width;
      var y = PLOT.bottom - (ev.valueScore / 100) * PLOT.height;
      var norm = Math.sqrt(Math.abs(ev.steadyNetAnnualValue) / maxAbsVal);
      var r = Math.round(14 + norm * 18);
      return {
        ev: ev,
        x: clamp(x, PLOT.left + r + 4, PLOT.right - r - 4),
        y: clamp(y, PLOT.top + r + 4, PLOT.bottom - r - 4),
        r: r
      };
    });

    // Light 3-pass separation for overlapping bubbles
    for (var pass = 0; pass < 3; pass++) {
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i];
          var b = nodes[j];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var dist = Math.hypot(dx, dy);
          var minDist = a.r + b.r + 6;
          if (dist < minDist) {
            var angle = dist === 0 ? (j * 1.1) : Math.atan2(dy, dx);
            var push = (minDist - dist) / 2;
            a.x = clamp(a.x - Math.cos(angle) * push, PLOT.left + a.r + 4, PLOT.right - a.r - 4);
            a.y = clamp(a.y - Math.sin(angle) * push, PLOT.top + a.r + 4, PLOT.bottom - a.r - 4);
            b.x = clamp(b.x + Math.cos(angle) * push, PLOT.left + b.r + 4, PLOT.right - b.r - 4);
            b.y = clamp(b.y + Math.sin(angle) * push, PLOT.top + b.r + 4, PLOT.bottom - b.r - 4);
          }
        }
      }
    }

    // Draw unselected first, selected last so it sits on top
    nodes.sort(function (a, b) {
      var aSel = a.ev.item.id === state.selectedId ? 1 : 0;
      var bSel = b.ev.item.id === state.selectedId ? 1 : 0;
      return aSel - bSel;
    });

    nodes.forEach(function (n) {
      var ev = n.ev;
      var isSel = ev.item.id === state.selectedId;
      var group = svgEl('g', {
        class: 'pk-bubble-group' + (isSel ? ' is-selected' : ''),
        tabindex: '0',
        role: 'button',
        'data-id': ev.item.id,
        'aria-label': '#' + ev.displayNum + ' ' + ev.item.name + ', ' + ev.quadrant.label + ', steady net ' + formatMoney(ev.steadyNetAnnualValue) + ' per year, feasibility ' + ev.feasibilityScore + ' out of 100'
      });

      // Soft neon halo
      group.appendChild(svgEl('circle', {
        cx: n.x,
        cy: n.y,
        r: n.r + (isSel ? 18 : 10),
        fill: ev.quadrant.glow,
        'pointer-events': 'none'
      }));

      // Selection ring
      if (isSel) {
        group.appendChild(svgEl('circle', {
          cx: n.x,
          cy: n.y,
          r: n.r + 6,
          fill: 'none',
          stroke: '#ffffff',
          'stroke-width': 2,
          opacity: 0.9
        }));
      }

      // Dashed plain-code trap ring
      if (ev.plainCodeTrap) {
        group.appendChild(svgEl('circle', {
          cx: n.x,
          cy: n.y,
          r: n.r + (isSel ? 10 : 5),
          fill: 'none',
          stroke: '#ff5ca8',
          'stroke-width': 2,
          'stroke-dasharray': '4 3'
        }));
      }

      // Core bubble
      group.appendChild(svgEl('circle', {
        class: 'pk-bubble-core',
        cx: n.x,
        cy: n.y,
        r: n.r,
        fill: ev.quadrant.colour,
        'fill-opacity': isSel ? 0.96 : 0.84,
        stroke: isSel ? '#ffffff' : '#0e0e13',
        'stroke-width': isSel ? 2.5 : 1.5
      }));

      // Number badge inside bubble
      group.appendChild(svgEl('text', {
        class: 'pk-bubble-label',
        x: n.x,
        y: n.y
      }, ev.displayNum));

      // Short caption beneath or above bubble
      var shortName = ev.item.name.length > 24 ? ev.item.name.slice(0, 22) + '...' : ev.item.name;
      var captionY = n.y + n.r + 15 > PLOT.bottom - 18 ? n.y - n.r - 10 : n.y + n.r + 14;
      var anchor = 'middle';
      var captionX = n.x;
      if (n.x > PLOT.right - 85) {
        anchor = 'end';
        captionX = Math.min(PLOT.right - 8, n.x + n.r);
      } else if (n.x < PLOT.left + 85) {
        anchor = 'start';
        captionX = Math.max(PLOT.left + 8, n.x - n.r);
      }
      group.appendChild(svgEl('text', {
        class: 'pk-bubble-caption',
        x: captionX,
        y: captionY,
        'text-anchor': anchor
      }, shortName));

      group.addEventListener('click', function () {
        selectInitiative(ev.item.id);
      });
      group.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectInitiative(ev.item.id);
        }
      });
      group.addEventListener('mouseenter', function () {
        showTooltip(ev, n.x, n.y);
      });
      group.addEventListener('focus', function () {
        showTooltip(ev, n.x, n.y);
      });
      group.addEventListener('mouseleave', hideTooltip);
      group.addEventListener('blur', hideTooltip);

      g.appendChild(group);
    });
  }

  function showTooltip(ev, svgX, svgY) {
    var tip = dom.tooltip;
    var stageRect = dom.matrixStage.getBoundingClientRect();
    var leftPct = (svgX / 720) * 100;
    var topPct = (svgY / 480) * 100;

    tip.innerHTML = '';
    var titleEl = document.createElement('strong');
    titleEl.textContent = '#' + ev.displayNum + ' ' + ev.item.name;
    tip.appendChild(titleEl);

    var line1 = document.createElement('div');
    line1.textContent = ev.quadrant.label + ' · ' + ev.buildVsBuy;
    line1.style.color = ev.quadrant.colour;
    line1.style.fontWeight = '700';
    tip.appendChild(line1);

    var line2 = document.createElement('div');
    line2.className = 'pk-tooltip-meta';
    line2.textContent = 'Steady net: ' + formatMoney(ev.steadyNetAnnualValue) + '/yr · Payback: ' + formatPayback(ev.paybackMonths);
    tip.appendChild(line2);

    if (ev.plainCodeTrap) {
      var trapLine = document.createElement('div');
      trapLine.style.color = '#ff85c1';
      trapLine.style.fontWeight = '700';
      trapLine.textContent = 'Plain-code trap: avoid LLM';
      tip.appendChild(trapLine);
    }

    tip.hidden = false;
    var placeLeft = leftPct > 60;
    tip.style.left = placeLeft ? 'auto' : Math.min(leftPct + 3, 66) + '%';
    tip.style.right = placeLeft ? Math.max(100 - leftPct + 3, 4) + '%' : 'auto';
    tip.style.top = Math.max(4, Math.min(topPct - 6, 72)) + '%';
    if (stageRect.width < 420) {
      tip.style.left = '8px';
      tip.style.right = '8px';
      tip.style.top = '8px';
    }
  }

  function hideTooltip() {
    if (dom.tooltip) dom.tooltip.hidden = true;
  }

  /* ── KPI STRIP ── */
  function renderKpis(ranked) {
    var funded = ranked.filter(function (ev) {
      return (ev.quadrantId === 'ship' || ev.quadrantId === 'bet') && !ev.plainCodeTrap;
    });
    var ships = ranked.filter(function (ev) { return ev.quadrantId === 'ship' && !ev.plainCodeTrap; });
    var killsAndTraps = ranked.filter(function (ev) {
      return ev.quadrantId === 'kill' || ev.quadrantId === 'trap' || ev.plainCodeTrap;
    });

    var fundedSteadyNet = funded.reduce(function (s, ev) { return s + ev.steadyNetAnnualValue; }, 0);
    var fundedBuildCost = funded.reduce(function (s, ev) { return s + ev.item.buildCost; }, 0);
    var shipSteadyNet = ships.reduce(function (s, ev) { return s + ev.steadyNetAnnualValue; }, 0);
    var savedSpend = killsAndTraps.reduce(function (s, ev) { return s + ev.totalYear1Cost; }, 0);

    var portfolioPayback = Infinity;
    if (funded.length && fundedBuildCost === 0 && fundedSteadyNet > 0) {
      portfolioPayback = 0;
    } else if (fundedSteadyNet > 0) {
      portfolioPayback = fundedBuildCost / (fundedSteadyNet / 12);
    }

    dom.kpiNetVal.textContent = formatMoney(fundedSteadyNet, true);
    dom.kpiNetSub.textContent = funded.length + ' funded pilot' + (funded.length === 1 ? '' : 's') + ' @ ' + state.adoptionRatePct + '% adoption';

    dom.kpiPayback.textContent = funded.length ? formatPayback(portfolioPayback) : '-';
    dom.kpiPaybackSub.textContent = funded.length
      ? formatMoney(fundedBuildCost, true) + ' total funded build'
      : 'No funded builds yet';

    dom.kpiShipCount.textContent = String(ships.length);
    dom.kpiShipSub.textContent = ships.length
      ? formatMoney(shipSteadyNet, true) + '/yr steady net'
      : 'None pass Ship Now bar';

    dom.kpiKillCount.textContent = String(killsAndTraps.length);
    var trapCount = ranked.filter(function (ev) { return ev.plainCodeTrap; }).length;
    dom.kpiKillSub.textContent = trapCount
      ? trapCount + ' plain-code LLM trap' + (trapCount === 1 ? '' : 's')
      : 'Blocked or low-ROI requests';

    dom.kpiSavedSpend.textContent = formatMoney(savedSpend, true);
    dom.kpiSavedSub.textContent = killsAndTraps.length
      ? 'Year-1 spend saved across ' + killsAndTraps.length + ' kills'
      : 'No killed pilots yet';
  }

  /* ── SELECTED DETAIL CARD ── */
  function renderSelectedVerdict(ranked) {
    var ev = null;
    for (var i = 0; i < ranked.length; i++) {
      if (ranked[i].item.id === state.selectedId) {
        ev = ranked[i];
        break;
      }
    }

    if (!ev) {
      dom.detailEmpty.hidden = false;
      dom.detailContent.hidden = true;
      return;
    }

    dom.detailEmpty.hidden = true;
    dom.detailContent.hidden = false;

    dom.detQuadBadge.textContent = '#' + ev.displayNum + ' · ' + ev.quadrant.label;
    dom.detQuadBadge.className = 'pk-quad-badge ' + ev.quadrant.badgeClass;
    dom.detBvbBadge.textContent = ev.buildVsBuy;
    dom.detName.textContent = ev.item.name;
    dom.detDept.textContent = ev.item.department + (ev.item.summary ? ' - ' + ev.item.summary : '');

    if (ev.plainCodeTrap) {
      dom.detLlmAlert.hidden = false;
      dom.detLlmAlertText.textContent = 'Scored ' + ev.item.deterministicAlt + '/5 on Deterministic Alternative. A SQL query, BI template, regex or rule engine solves 80%+ of this without token costs or hallucination risk.';
    } else {
      dom.detLlmAlert.hidden = true;
    }

    dom.detNaive.textContent = formatMoney(ev.naiveAnnualValue) + '/yr';
    dom.detRealistic.textContent = formatMoney(ev.realisticGrossSavings) + '/yr';
    dom.detHaircut.textContent = '-' + ev.haircutPct + '%';

    dom.detSteady.textContent = formatMoney(ev.steadyNetAnnualValue);
    dom.detSteady.className = 'pk-cfo-val ' + (ev.steadyNetAnnualValue >= 0 ? 'pk-cfo-val--green' : 'pk-cfo-val--neg');

    dom.detY1.textContent = formatMoney(ev.year1NetValue);
    dom.detY1.className = 'pk-cfo-val ' + (ev.year1NetValue >= 0 ? 'pk-cfo-val--cyan' : 'pk-cfo-val--neg');

    dom.detPayback.textContent = formatPayback(ev.paybackMonths);
    dom.detPayback.className = 'pk-cfo-val ' + (ev.paybackMonths <= 12 ? 'pk-cfo-val--green' : ev.paybackMonths <= 24 ? '' : 'pk-cfo-val--neg');

    dom.detRationale.textContent = ev.rationale;
    dom.detBvbRationale.textContent = 'Build vs Buy (' + ev.buildVsBuy + '): ' + ev.bvbRationale;

    dom.detMathPreview.textContent =
      Math.round(ev.annualRuns).toLocaleString(getCurrency().locale) + ' team runs/yr (' + WORKING_WEEKS + ' wks) · ' +
      Math.round(ev.grossHours).toLocaleString(getCurrency().locale) + ' gross hrs · ' +
      'After ' + ev.item.reviewOverheadPct + '% QA & ' + state.adoptionRatePct + '% adoption = ' +
      formatMoney(ev.realisticGrossSavings) + '/yr gross savings.';

    // Keep live numeric badges synced
    dom.valData.textContent = ev.item.dataReadiness + ' / 5';
    dom.valBlast.textContent = ev.item.blastRadius + ' / 5';
    dom.valGov.textContent = ev.item.governance + ' / 5';
    dom.valFriction.textContent = ev.item.adoptionFriction + ' / 5';
    dom.valDet.textContent = ev.item.deterministicAlt + ' / 5';
  }

  function syncEditorInputs() {
    var item = getSelectedItem();
    if (!item) return;

    dom.inData.value = item.dataReadiness;
    dom.inBlast.value = item.blastRadius;
    dom.inGov.value = item.governance;
    dom.inFriction.value = item.adoptionFriction;
    dom.inDet.value = item.deterministicAlt;

    dom.inName.value = item.name;
    dom.inDept.value = item.department;
    dom.inSummary.value = item.summary;
    dom.inStaff.value = item.staffCount;
    dom.inRuns.value = item.runsPerWeek;
    dom.inMins.value = item.minutesSaved;
    dom.inRate.value = item.hourlyRate;
    dom.inQa.value = item.reviewOverheadPct;
    dom.inBuild.value = item.buildCost;
    dom.inRunCost.value = item.annualRunCost;
  }

  function getSelectedItem() {
    for (var i = 0; i < state.initiatives.length; i++) {
      if (state.initiatives[i].id === state.selectedId) return state.initiatives[i];
    }
    return null;
  }

  /* ── DECISION TABLE ── */
  function renderTable(ranked) {
    var rows = ranked.filter(function (ev) {
      if (state.filter === 'all') return true;
      return ev.quadrantId === state.filter;
    });

    rows.sort(function (a, b) {
      if (state.sortBy === 'steadyNet') return b.steadyNetAnnualValue - a.steadyNetAnnualValue;
      if (state.sortBy === 'payback') return a.paybackMonths - b.paybackMonths;
      if (state.sortBy === 'feasibility') return b.feasibilityScore - a.feasibilityScore;
      return b.priorityRankScore - a.priorityRankScore;
    });

    dom.tableBody.innerHTML = '';

    if (!rows.length) {
      var emptyTr = document.createElement('tr');
      var emptyTd = document.createElement('td');
      emptyTd.colSpan = 10;
      emptyTd.style.textAlign = 'center';
      emptyTd.style.padding = '1.5rem';
      emptyTd.style.color = '#b4b2bc';
      emptyTd.textContent = state.initiatives.length
        ? 'No initiatives match the selected quadrant filter.'
        : 'Portfolio is empty. Click Add Use Case or Load Sample (6) above.';
      emptyTr.appendChild(emptyTd);
      dom.tableBody.appendChild(emptyTr);
      return;
    }

    rows.forEach(function (ev) {
      var tr = document.createElement('tr');
      tr.dataset.id = ev.item.id;
      if (ev.item.id === state.selectedId) tr.classList.add('is-selected');

      var trapHtml = ev.plainCodeTrap
        ? '<span class="pk-trap-pill">Don\'t use an LLM</span>'
        : '';

      var steadyClass = ev.steadyNetAnnualValue >= 0 ? 'pk-cfo-val--green' : 'pk-cfo-val--neg';

      tr.innerHTML =
        '<td><span class="pk-row-num" style="background:' + ev.quadrant.colour + '">' + ev.displayNum + '</span></td>' +
        '<td>' +
          '<span class="pk-row-name">' + escapeHtml(ev.item.name) + '</span>' +
          '<span class="pk-row-dept">' + escapeHtml(ev.item.department) + '</span>' +
          (trapHtml ? '<br>' + trapHtml : '') +
        '</td>' +
        '<td><span class="pk-quad-badge ' + ev.quadrant.badgeClass + '">' + escapeHtml(ev.quadrant.short) + '</span></td>' +
        '<td><span class="pk-bvb-badge">' + escapeHtml(ev.buildVsBuy) + '</span></td>' +
        '<td><strong>' + ev.feasibilityScore + '</strong>/100</td>' +
        '<td>' +
          '<span class="pk-naive-strike">' + escapeHtml(formatMoney(ev.naiveAnnualValue)) + '</span>' +
          '<strong>' + escapeHtml(formatMoney(ev.realisticGrossSavings)) + '</strong>' +
        '</td>' +
        '<td><strong class="' + steadyClass + '">' + escapeHtml(formatMoney(ev.steadyNetAnnualValue)) + '</strong></td>' +
        '<td>' + escapeHtml(formatMoney(ev.totalYear1Cost)) + '</td>' +
        '<td><strong>' + escapeHtml(formatPayback(ev.paybackMonths)) + '</strong></td>' +
        '<td>' +
          '<div class="pk-row-actions">' +
            '<button type="button" class="pk-icon-btn" data-action="dup" data-id="' + escapeHtml(ev.item.id) + '" aria-label="Duplicate ' + escapeHtml(ev.item.name) + '" title="Duplicate">' +
              '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span>' +
            '</button>' +
            '<button type="button" class="pk-icon-btn pk-icon-btn--danger" data-action="del" data-id="' + escapeHtml(ev.item.id) + '" aria-label="Delete ' + escapeHtml(ev.item.name) + '" title="Delete">' +
              '<span class="material-symbols-outlined" aria-hidden="true">delete</span>' +
            '</button>' +
          '</div>' +
        '</td>';

      dom.tableBody.appendChild(tr);
    });
  }

  /* ── FULL RENDER PIPELINE ── */
  function updateDerivedViews() {
    var result = evaluatePortfolio();
    renderKpis(result.ranked);
    renderMatrix(result.ranked);
    renderSelectedVerdict(result.ranked);
    renderTable(result.ranked);
    saveToStorage();
  }

  function renderAll() {
    dom.adoptionSlider.value = state.adoptionRatePct;
    dom.adoptionValue.textContent = state.adoptionRatePct + '%';

    var sym = getCurrency().symbol;
    dom.currSyms.forEach(function (el) { el.textContent = sym; });
    dom.currencyBtns.forEach(function (btn) {
      var active = btn.dataset.currency === state.currency;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    syncEditorInputs();
    updateDerivedViews();
  }

  function selectInitiative(id) {
    state.selectedId = id;
    syncEditorInputs();
    updateDerivedViews();
  }

  /* ── ACTIONS: ADD / DUPLICATE / DELETE / SAMPLE / CLEAR ── */
  function addCustomInitiative() {
    var newId = 'uc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    var item = sanitizeInitiative({
      id: newId,
      name: 'New AI Use Case #' + (state.initiatives.length + 1),
      department: 'Operations',
      summary: 'Describe what this workflow automates and where humans stay in the loop.',
      dataReadiness: 3,
      blastRadius: 2,
      governance: 2,
      adoptionFriction: 3,
      deterministicAlt: 2,
      staffCount: 20,
      runsPerWeek: 12,
      minutesSaved: 8,
      hourlyRate: 50,
      reviewOverheadPct: 25,
      buildCost: 18000,
      annualRunCost: 12000
    });
    state.initiatives.unshift(item);
    state.selectedId = item.id;
    setActiveTab('econ');
    renderAll();
    dom.inName.focus();
    dom.inName.select();
    showToast('Added new use case. Edit its details and operational scores on the right.');
  }

  function duplicateInitiative(id) {
    var src = null;
    for (var i = 0; i < state.initiatives.length; i++) {
      if (state.initiatives[i].id === id) {
        src = state.initiatives[i];
        break;
      }
    }
    if (!src) return;
    var copy = Object.assign({}, src, {
      id: 'uc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
      name: (src.name + ' (Copy)').slice(0, 80)
    });
    state.initiatives.push(copy);
    state.selectedId = copy.id;
    renderAll();
    showToast('Duplicated "' + src.name + '".');
  }

  function deleteInitiative(id) {
    var idx = -1;
    for (var i = 0; i < state.initiatives.length; i++) {
      if (state.initiatives[i].id === id) {
        idx = i;
        break;
      }
    }
    if (idx === -1) return;
    var removed = state.initiatives.splice(idx, 1)[0];
    if (state.selectedId === id) {
      state.selectedId = state.initiatives.length ? state.initiatives[Math.min(idx, state.initiatives.length - 1)].id : null;
    }
    renderAll();
    showToast('Removed "' + removed.name + '".', true);
  }

  function loadSamplePortfolio() {
    state.initiatives = getSampleInitiatives();
    state.selectedId = state.initiatives[0].id;
    state.filter = 'all';
    updateFilterButtons();
    renderAll();
    showToast('Loaded 6 sample enterprise AI requests.');
  }

  function handleClearPortfolio() {
    if (!state.initiatives.length) return;
    var now = Date.now();
    if (now > clearArmedUntil) {
      clearArmedUntil = now + 4000;
      dom.clearBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">warning</span>Confirm Clear?';
      showToast('Click "Confirm Clear?" again within 4 seconds to empty the portfolio.', true);
      setTimeout(function () {
        if (Date.now() >= clearArmedUntil) {
          dom.clearBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">delete_sweep</span>Clear';
        }
      }, 4100);
      return;
    }
    clearArmedUntil = 0;
    dom.clearBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">delete_sweep</span>Clear';
    state.initiatives = [];
    state.selectedId = null;
    renderAll();
    showToast('Portfolio cleared. Click Load Sample (6) anytime to restore defaults.');
  }

  /* ── EXPORTS: SHARE URL, MARKDOWN PACK, CSV, PRINT ── */
  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg);
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('Copy failed - please copy manually.', true);
    }
    document.body.removeChild(ta);
  }

  function sharePortfolioUrl() {
    var hash = encodeStateToHash();
    try {
      window.history.replaceState(null, '', hash);
    } catch (e) {
      window.location.hash = hash;
    }
    var fullUrl = window.location.href;
    copyText(fullUrl, 'Shareable portfolio URL copied to clipboard.');
  }

  function buildSteeringPackMarkdown() {
    var result = evaluatePortfolio();
    var ranked = result.ranked;
    var today = new Date().toISOString().slice(0, 10);

    var funded = ranked.filter(function (ev) {
      return (ev.quadrantId === 'ship' || ev.quadrantId === 'bet') && !ev.plainCodeTrap;
    });
    var ships = ranked.filter(function (ev) { return ev.quadrantId === 'ship' && !ev.plainCodeTrap; });
    var bets = ranked.filter(function (ev) { return ev.quadrantId === 'bet' && !ev.plainCodeTrap; });
    var kills = ranked.filter(function (ev) {
      return ev.quadrantId === 'kill' || ev.quadrantId === 'trap' || ev.plainCodeTrap;
    });

    var totalNaive = ranked.reduce(function (s, ev) { return s + ev.naiveAnnualValue; }, 0);
    var fundedRealistic = funded.reduce(function (s, ev) { return s + ev.realisticGrossSavings; }, 0);
    var fundedSteadyNet = funded.reduce(function (s, ev) { return s + ev.steadyNetAnnualValue; }, 0);
    var fundedBuild = funded.reduce(function (s, ev) { return s + ev.item.buildCost; }, 0);
    var fundedRun = funded.reduce(function (s, ev) { return s + ev.item.annualRunCost; }, 0);
    var savedSpend = kills.reduce(function (s, ev) { return s + ev.totalYear1Cost; }, 0);
    var portfolioPayback = fundedSteadyNet > 0 ? (fundedBuild / (fundedSteadyNet / 12)) : Infinity;

    var lines = [];
    lines.push('# AI Portfolio Steering Committee Pack');
    lines.push('');
    lines.push('Generated: ' + today + ' | Tool: AI Pilot Killer Matrix (https://johnb.io/ai-pilot-killer)');
    lines.push('Assumptions: ' + state.adoptionRatePct + '% Year-1 adoption rate, ' + WORKING_WEEKS + ' working weeks/year, per-initiative human QA overhead deducted, currency ' + getCurrency().code + '.');
    lines.push('');
    lines.push('## 1. CFO ROI Executive Summary');
    lines.push('');
    lines.push('- **Initiatives Assessed:** ' + ranked.length + ' (' + ships.length + ' Ship Now, ' + bets.length + ' Strategic Bets, ' + kills.length + ' Kill / Defer / Plain Code)');
    lines.push('- **Vendor-Slide Naive Value (All Requests):** ' + formatMoney(totalNaive) + '/yr');
    lines.push('- **Realistic Gross Savings (Funded Portfolio):** ' + formatMoney(fundedRealistic) + '/yr');
    lines.push('- **Funded Build + Year-1 Run Cost:** ' + formatMoney(fundedBuild) + ' build + ' + formatMoney(fundedRun) + '/yr run & evals');
    lines.push('- **Realistic Steady-State Net Value (Funded):** ' + formatMoney(fundedSteadyNet) + '/yr');
    lines.push('- **Funded Portfolio Payback:** ' + (funded.length ? formatPayback(portfolioPayback) : 'N/A'));
    lines.push('- **Saved From Wasted Pilot Spend (Year-1 Cost Avoided):** ' + formatMoney(savedSpend));
    lines.push('');
    lines.push('## 2. Ranked Portfolio Decision Table');
    lines.push('');
    lines.push('| # | Initiative | Dept | Quadrant | Build vs Buy | Feasibility | Naive/Yr | Realistic Gross/Yr | Steady Net/Yr | Year-1 Cost | Payback |');
    lines.push('|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|');

    ranked.forEach(function (ev) {
      var nameClean = ev.item.name.replace(/\|/g, '/') + (ev.plainCodeTrap ? ' [PLAIN CODE]' : '');
      var deptClean = ev.item.department.replace(/\|/g, '/');
      lines.push(
        '| ' + ev.displayNum +
        ' | ' + nameClean +
        ' | ' + deptClean +
        ' | ' + ev.quadrant.label +
        ' | ' + ev.buildVsBuy +
        ' | ' + ev.feasibilityScore + '/100' +
        ' | ' + formatMoney(ev.naiveAnnualValue) +
        ' | ' + formatMoney(ev.realisticGrossSavings) +
        ' | ' + formatMoney(ev.steadyNetAnnualValue) +
        ' | ' + formatMoney(ev.totalYear1Cost) +
        ' | ' + formatPayback(ev.paybackMonths) + ' |'
      );
    });

    lines.push('');
    lines.push('## 3. Ship Now & Build vs Buy Plan');
    lines.push('');
    if (!ships.length) {
      lines.push('No initiatives currently clear the Ship Now threshold at ' + state.adoptionRatePct + '% Year-1 adoption.');
    } else {
      ships.forEach(function (ev) {
        lines.push('### #' + ev.displayNum + ' ' + ev.item.name + ' (' + ev.item.department + ') - ' + ev.buildVsBuy);
        lines.push('- **Economics:** ' + formatMoney(ev.steadyNetAnnualValue) + '/yr steady net, ' + formatPayback(ev.paybackMonths) + ' payback (Year-1 cost: ' + formatMoney(ev.totalYear1Cost) + ').');
        lines.push('- **Verdict:** ' + ev.rationale);
        lines.push('- **Delivery Approach:** ' + ev.bvbRationale);
        lines.push('');
      });
    }

    if (bets.length) {
      lines.push('## 4. Strategic Bets (Require Guardrails Before Scaling)');
      lines.push('');
      bets.forEach(function (ev) {
        lines.push('- **' + ev.item.name + ' (' + ev.buildVsBuy + '):** ' + ev.rationale);
      });
      lines.push('');
    }

    lines.push('## ' + (bets.length ? '5' : '4') + '. Kill List & Plain-Code Reroutes (Budget Protected: ' + formatMoney(savedSpend) + ')');
    lines.push('');
    if (!kills.length) {
      lines.push('No initiatives are currently flagged for kill or plain-code rerouting.');
    } else {
      kills.forEach(function (ev) {
        var tag = ev.plainCodeTrap ? '[DON\'T USE AN LLM - USE PLAIN CODE]' : '[' + ev.quadrant.label.toUpperCase() + ']';
        lines.push('- **' + ev.item.name + '** ' + tag + ' - Year-1 cost avoided: ' + formatMoney(ev.totalYear1Cost) + '. ' + ev.rationale);
      });
    }

    return lines.join('\n');
  }

  function openPackModal() {
    dom.packOutput.value = buildSteeringPackMarkdown();
    dom.packModal.hidden = false;
    dom.packCopy.focus();
  }

  function closePackModal() {
    dom.packModal.hidden = true;
    dom.packBtn.focus();
  }

  function downloadFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function csvCell(val) {
    var str = String(val == null ? '' : val);
    if (/[",\r\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function exportCsv() {
    var ranked = evaluatePortfolio().ranked;
    var headers = [
      'Rank', 'Name', 'Department', 'Summary', 'Quadrant', 'PlainCodeTrap', 'BuildVsBuy',
      'FeasibilityScore', 'ValueScore',
      'DataReadiness', 'ErrorBlastRadius', 'RegulatoryExposure', 'AdoptionFriction', 'DeterministicAlternative',
      'StaffCount', 'RunsPerWeekPerStaff', 'GrossMinsSavedPerRun', 'HourlyRate', 'HumanQAOverheadPct',
      'GlobalAdoptionPct', 'BuildCost', 'Year1RunAndEvalsCost',
      'NaiveAnnualValue', 'RealisticGrossSavings', 'SteadyNetAnnualValue', 'Year1NetValue', 'PaybackMonths'
    ];
    var rows = [headers.map(csvCell).join(',')];
    ranked.forEach(function (ev) {
      var it = ev.item;
      rows.push([
        ev.displayNum,
        it.name,
        it.department,
        it.summary,
        ev.quadrant.label,
        ev.plainCodeTrap ? 'Yes' : 'No',
        ev.buildVsBuy,
        ev.feasibilityScore,
        ev.valueScore,
        it.dataReadiness,
        it.blastRadius,
        it.governance,
        it.adoptionFriction,
        it.deterministicAlt,
        it.staffCount,
        it.runsPerWeek,
        it.minutesSaved,
        it.hourlyRate,
        it.reviewOverheadPct,
        state.adoptionRatePct,
        it.buildCost,
        it.annualRunCost,
        Math.round(ev.naiveAnnualValue),
        Math.round(ev.realisticGrossSavings),
        Math.round(ev.steadyNetAnnualValue),
        Math.round(ev.year1NetValue),
        Number.isFinite(ev.paybackMonths) ? ev.paybackMonths.toFixed(1) : 'Never'
      ].map(csvCell).join(','));
    });

    downloadFile('ai-pilot-killer-portfolio.csv', rows.join('\r\n'), 'text/csv;charset=utf-8');
    showToast('Exported ' + ranked.length + ' initiatives to CSV.');
  }

  /* ── TABS & FILTERS ── */
  function setActiveTab(tab) {
    state.activeTab = tab;
    var isScores = tab === 'scores';
    dom.tabScores.classList.toggle('active', isScores);
    dom.tabScores.setAttribute('aria-selected', isScores ? 'true' : 'false');
    dom.panelScores.hidden = !isScores;

    dom.tabEcon.classList.toggle('active', !isScores);
    dom.tabEcon.setAttribute('aria-selected', !isScores ? 'true' : 'false');
    dom.panelEcon.hidden = isScores;
  }

  function updateFilterButtons() {
    dom.filterBtns.forEach(function (btn) {
      var active = btn.dataset.filter === state.filter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  /* ── EVENT WIRING ── */
  function bindEvents() {
    dom.adoptionSlider.addEventListener('input', function () {
      state.adoptionRatePct = Math.round(clamp(dom.adoptionSlider.value, 15, 100));
      dom.adoptionValue.textContent = state.adoptionRatePct + '%';
      updateDerivedViews();
    });

    dom.currencyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.dataset.currency;
        if (!CURRENCIES[code]) return;
        state.currency = code;
        renderAll();
      });
    });

    dom.addBtn.addEventListener('click', addCustomInitiative);
    dom.emptyAddBtn.addEventListener('click', addCustomInitiative);
    dom.sampleBtn.addEventListener('click', loadSamplePortfolio);
    dom.emptySampleBtn.addEventListener('click', loadSamplePortfolio);
    dom.clearBtn.addEventListener('click', handleClearPortfolio);
    dom.shareBtn.addEventListener('click', sharePortfolioUrl);
    dom.packBtn.addEventListener('click', openPackModal);
    dom.csvBtn.addEventListener('click', exportCsv);
    dom.printBtn.addEventListener('click', function () {
      window.print();
    });

    dom.dupBtn.addEventListener('click', function () {
      if (state.selectedId) duplicateInitiative(state.selectedId);
    });
    dom.delBtn.addEventListener('click', function () {
      if (state.selectedId) deleteInitiative(state.selectedId);
    });

    dom.tabScores.addEventListener('click', function () { setActiveTab('scores'); });
    dom.tabEcon.addEventListener('click', function () { setActiveTab('econ'); });

    // Operational score sliders
    var sliderBindings = [
      { el: dom.inData, key: 'dataReadiness' },
      { el: dom.inBlast, key: 'blastRadius' },
      { el: dom.inGov, key: 'governance' },
      { el: dom.inFriction, key: 'adoptionFriction' },
      { el: dom.inDet, key: 'deterministicAlt' }
    ];
    sliderBindings.forEach(function (b) {
      b.el.addEventListener('input', function () {
        var item = getSelectedItem();
        if (!item) return;
        item[b.key] = Math.round(clamp(b.el.value, 1, 5));
        updateDerivedViews();
      });
    });

    // Economics & detail fields
    var textBindings = [
      { el: dom.inName, key: 'name', max: 80, fallback: 'Untitled AI Request' },
      { el: dom.inDept, key: 'department', max: 40, fallback: 'General' },
      { el: dom.inSummary, key: 'summary', max: 180, fallback: '' }
    ];
    textBindings.forEach(function (b) {
      b.el.addEventListener('input', function () {
        var item = getSelectedItem();
        if (!item) return;
        var val = b.el.value.slice(0, b.max);
        item[b.key] = val.trim() ? val : b.fallback;
        updateDerivedViews();
      });
    });

    var numBindings = [
      { el: dom.inStaff, key: 'staffCount', min: 1, max: 50000, round: true },
      { el: dom.inRuns, key: 'runsPerWeek', min: 0.5, max: 1000, round: false },
      { el: dom.inMins, key: 'minutesSaved', min: 0.5, max: 480, round: false },
      { el: dom.inRate, key: 'hourlyRate', min: 5, max: 1000, round: false },
      { el: dom.inQa, key: 'reviewOverheadPct', min: 0, max: 95, round: false },
      { el: dom.inBuild, key: 'buildCost', min: 0, max: 10000000, round: false },
      { el: dom.inRunCost, key: 'annualRunCost', min: 0, max: 10000000, round: false }
    ];
    numBindings.forEach(function (b) {
      b.el.addEventListener('input', function () {
        var item = getSelectedItem();
        if (!item) return;
        if (b.el.value === '') return;
        var v = clamp(b.el.value, b.min, b.max);
        item[b.key] = b.round ? Math.round(v) : v;
        updateDerivedViews();
      });
    });

    // Table filters, sort & row delegation
    dom.filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.filter = btn.dataset.filter || 'all';
        updateFilterButtons();
        updateDerivedViews();
      });
    });

    dom.sortSelect.addEventListener('change', function () {
      state.sortBy = dom.sortSelect.value || 'priority';
      updateDerivedViews();
    });

    dom.tableBody.addEventListener('click', function (e) {
      var actionBtn = e.target.closest('button[data-action]');
      if (actionBtn) {
        e.stopPropagation();
        var action = actionBtn.dataset.action;
        var targetId = actionBtn.dataset.id;
        if (action === 'dup') duplicateInitiative(targetId);
        if (action === 'del') deleteInitiative(targetId);
        return;
      }
      var row = e.target.closest('tr[data-id]');
      if (row && row.dataset.id) {
        selectInitiative(row.dataset.id);
      }
    });

    // Modal controls
    dom.packBackdrop.addEventListener('click', closePackModal);
    dom.packClose.addEventListener('click', closePackModal);
    dom.packCopy.addEventListener('click', function () {
      copyText(dom.packOutput.value, 'Steering Committee Pack Markdown copied to clipboard.');
    });
    dom.packDownload.addEventListener('click', function () {
      downloadFile('ai-pilot-killer-steering-pack.md', dom.packOutput.value, 'text/markdown;charset=utf-8');
      showToast('Downloaded ai-pilot-killer-steering-pack.md.');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dom.packModal.hidden) {
        closePackModal();
      }
    });

    // Back-to-top button (CSP-safe, no inline script)
    if (dom.backToTop) {
      window.addEventListener('scroll', function () {
        dom.backToTop.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      dom.backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function init() {
    cacheDom();
    drawStaticMatrixGrid();
    loadInitialState();
    bindEvents();
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
