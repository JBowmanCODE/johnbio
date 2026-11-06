/* LinkedIn Analytics Analyser - Core Pure Functions (no DOM)
   Works in the browser (window.LACore) and in Node.js (module.exports).
   All copy uses UK English, en-GB number formatting, and zero em dashes. */

const LACore = (function () {
  'use strict';

  // ── CENTRAL CONFIGURATION ──────────────────────────────────────────────────
  const CONFIG = {
    MIN_SAMPLE_RULES: {
      minPostsForThemeOrDay: 3,
      minFullMonthsForProjection: 2,
      minDaysForCorrelation: 30,
      weeklyChartThresholdDays: 90,
    },

    THEME_RULES: [
      {
        theme: 'News roundup',
        keywords: [
          'this week',
          'weekly',
          'roundup',
          'biggest stories',
          'biggest ai stories',
          'news',
          'the week',
          'week in ai',
          'biggest week',
          'openai anthropic',
          'openai googledeepmind',
          'openai huggingface',
          'openai stripe',
        ],
      },
      {
        theme: 'Built a tool / project',
        keywords: [
          'built',
          'i built',
          'shipped',
          'launched',
          'tool',
          'aitools',
          'free',
          'simulator',
          'app',
          'replayer',
        ],
      },
      {
        theme: 'Career / milestone',
        keywords: [
          'completed',
          'course',
          'certified',
          'certification',
          'new role',
          'joined',
          'promoted',
          'festival',
          'leedsdigitalfestival',
          'hackathon',
          'speaking',
          'award',
        ],
      },
      {
        theme: 'Event / community',
        keywords: ['event', 'meetup', 'join us', 'webinar', 'community', 'anywhere near'],
      },
    ],
    DEFAULT_THEME: 'Explainer / opinion',
    ALL_THEMES: [
      'Built a tool / project',
      'News roundup',
      'Explainer / opinion',
      'Career / milestone',
      'Event / community',
    ],

    CREATOR_TYPES: {
      'Built a tool / project': {
        name: 'The Builder',
        theme: 'Built a tool / project',
        shortDescription: 'Ships things and shows the work',
        icon: 'construction',
        colour: '#00eefc',
        strengths: 'High-signal demos and tangible projects that earn saves, shares and profile clicks.',
        blindSpots: 'Can go quiet between launches or focus too much on features rather than the problem solved.',
        tip: 'Share a short mid-build update or one lesson from building before launch day to double the mileage from every project.',
      },
      'News roundup': {
        name: 'The Newsroom',
        theme: 'News roundup',
        shortDescription: 'Keeps the network up to date',
        icon: 'newspaper',
        colour: '#38bdf8',
        strengths: 'Reliable publishing rhythm that builds habit and keeps your name in feeds every week.',
        blindSpots: 'Roundups often get steady impressions but lower engagement rates than opinionated or practical posts.',
        tip: 'Lead your next roundup with one strong take on the single biggest story instead of giving every item equal weight.',
      },
      'Explainer / opinion': {
        name: 'The Educator',
        theme: 'Explainer / opinion',
        shortDescription: 'Breaks down ideas and takes a view',
        icon: 'school',
        colour: '#FF007F',
        strengths: 'Clear thinking and point-of-view posts that spark thoughtful comments from senior peers.',
        blindSpots: 'Broad explainers can blend into the feed unless anchored in a specific real-world example.',
        tip: 'Pair each explainer with a concrete before-and-after example or a quick checklist people can use the same day.',
      },
      'Career / milestone': {
        name: 'The Storyteller',
        theme: 'Career / milestone',
        shortDescription: 'Shares the journey and brings people along',
        icon: 'emoji_events',
        colour: '#f59e0b',
        strengths: 'Warm, personal milestones that draw high reaction counts and supportive comments from your network.',
        blindSpots: 'Milestones do not happen every week, and celebration-only posts rarely convert out-of-network viewers.',
        tip: 'Turn every milestone or certificate into a 3-point takeaway on what surprised you most or what you would do differently.',
      },
      'Event / community': {
        name: 'The Connector',
        theme: 'Event / community',
        shortDescription: 'Brings people together',
        icon: 'groups',
        colour: '#22c55e',
        strengths: 'Strong real-world trust and local network density that turns online connections into real relationships.',
        blindSpots: 'Logistics-first event announcements often underperform outside the immediate city or group.',
        tip: 'Write event posts as a sharp takeaway from a conversation in the room so people who could not attend still get value.',
      },
      Explorer: {
        name: 'The Explorer',
        theme: 'None',
        shortDescription: 'Not enough posts yet to find your type',
        icon: 'explore',
        colour: '#a855f7',
        strengths: 'Clean slate with room to test different formats and topics.',
        blindSpots: 'Too few posts in any single theme (fewer than 3) to separate luck from a repeatable pattern.',
        tip: 'Publish at least 3 posts in two different themes over the next month so you can compare median engagements fairly.',
      },
    },

    HEALTH_SCORE: {
      weights: {
        growthMomentum: 25,
        engagementRate: 25,
        consistency: 20,
        audienceFit: 15,
        outOfNetworkReach: 15,
      },
      bands: {
        // [value, ratioOfMaxPoints] piecewise linear control points
        growthMomentum: [
          [0, 0.0],
          [1, 0.3],
          [2, 0.55],
          [5, 0.8],
          [8, 1.0],
        ],
        engagementRate: [
          [0, 0.0],
          [1, 0.3],
          [2, 0.6],
          [4, 0.85],
          [5, 1.0],
        ],
        consistency: [
          [0, 0.0],
          [15, 0.3],
          [35, 0.6],
          [60, 0.85],
          [80, 1.0],
        ],
        audienceFit: [
          [0, 0.0],
          [35, 0.35],
          [55, 0.65],
          [75, 0.88],
          [90, 1.0],
        ],
        outOfNetworkReach: [
          [0, 0.0],
          [10, 0.35],
          [20, 0.65],
          [35, 0.88],
          [50, 1.0],
        ],
      },
      labels: [
        { min: 80, max: 100, label: 'Excellent', colour: '#22c55e' },
        { min: 60, max: 79, label: 'Strong', colour: '#00eefc' },
        { min: 40, max: 59, label: 'Building', colour: '#f59e0b' },
        { min: 0, max: 39, label: 'Getting started', colour: '#FF007F' },
      ],
    },

    MILESTONES: [500, 1000, 2500, 5000, 10000, 20000, 50000, 100000, 250000, 500000, 1000000],

    GOAL_VERDICTS: {
      onTrackMaxRatio: 1.0,
      stretchMaxRatio: 1.5,
      ambitiousMaxRatio: 3.0,
      labels: {
        onTrack: 'On track at your current pace',
        stretch: 'Achievable stretch',
        ambitious: "Ambitious: you'll need some breakout posts",
        unlikely: 'Unlikely without a big change',
      },
    },

    INDUSTRY_POST_ANGLES: {
      'Gambling Facilities and Casinos': [
        'Break down one regulatory or compliance change and show what it means for product or marketing teams in practice.',
        'Build or demo a small calculator, map or checklist that solves a recurring iGaming workflow headache.',
        'Compare how two regulated markets handle the same player-protection or promotional rule.',
      ],
      'IT Services and IT Consulting': [
        'Share a real implementation lesson: what broke in a client rollout and the fix that actually held up.',
        'Post a plain-English teardown of a new tool or model release aimed at technical decision-makers.',
        'Show a before-and-after workflow where automation saved measurable hours.',
      ],
      'Technology, Information and Internet': [
        'Ship a small working prototype or benchmark and share the numbers openly.',
        'Take a clear stance on a current product or AI shift and explain what teams should ignore.',
        'Turn a technical concept into a 60-second visual explainer for product and engineering leads.',
      ],
      'Software Development': [
        'Show a side-by-side comparison of two coding workflows, libraries or architectures you tested this week.',
        'Share a bug or performance bottleneck you hit and the exact change that fixed it.',
        'Post a small open utility or interactive demo your peers can try in their browser.',
      ],
      'Financial Services': [
        'Translate a complex risk, compliance or governance requirement into a practical checklist.',
        'Share an honest assessment of where automation helps vs where human sign-off is non-negotiable.',
        'Break down a public industry metric or report into three takeaways for senior leaders.',
      ],
      'Advertising Services': [
        'Show a real campaign or copy experiment with the exact numbers before and after.',
        'Explain how search or feed discovery is shifting and what you changed on your own properties.',
        'Share a reusable creative or messaging checklist your network can save.',
      ],
      'Marketing Services': [
        'Show a real content or SEO experiment with the exact traffic or engagement numbers.',
        'Compare what your audience clicks vs what gets vanity impressions.',
        'Share a template or workflow that cuts repetitive reporting work.',
      ],
      default: [
        'Take one specific problem in your top industry and show how you solved it step by step.',
        'Build or share a practical checklist, template or interactive tool tailored to your core peers.',
        'Write a short point-of-view post on a trend in your sector, backed by your own numbers rather than hype.',
      ],
    },
  };

  // ── FORMATTING & MATHS HELPERS ─────────────────────────────────────────────
  function sanitizeCopy(str) {
    if (typeof str !== 'string') return '';
    // Enforce no em dashes or en dashes used as punctuation dashes
    return str.replace(/\u2014/g, ' - ').replace(/\u2013/g, '-').replace(/--+/g, '-');
  }

  function formatInt(n) {
    if (n === null || n === undefined || Number.isNaN(Number(n))) return '0';
    return Math.round(Number(n)).toLocaleString('en-GB');
  }

  function formatDec(n, dp = 1) {
    if (n === null || n === undefined || Number.isNaN(Number(n))) return '0';
    return Number(n).toLocaleString('en-GB', {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    });
  }

  function formatPct(n, dp = 1) {
    if (n === null || n === undefined || Number.isNaN(Number(n))) return '0%';
    return formatDec(n, dp) + '%';
  }

  function formatMilestoneLabel(n) {
    if (n >= 1000000) return (n / 1000000).toLocaleString('en-GB') + 'm';
    if (n >= 1000) return (n / 1000).toLocaleString('en-GB') + 'k';
    return formatInt(n);
  }

  function median(values) {
    const nums = (values || []).filter((v) => typeof v === 'number' && Number.isFinite(v)).sort((a, b) => a - b);
    if (nums.length === 0) return 0;
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  }

  function average(values) {
    const nums = (values || []).filter((v) => typeof v === 'number' && Number.isFinite(v));
    if (nums.length === 0) return 0;
    return nums.reduce((acc, v) => acc + v, 0) / nums.length;
  }

  function sum(values) {
    return (values || []).reduce((acc, v) => acc + (typeof v === 'number' && Number.isFinite(v) ? v : 0), 0);
  }

  function pearsonCorrelation(xs, ys) {
    if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length || xs.length < 2) return null;
    const n = xs.length;
    const meanX = average(xs);
    const meanY = average(ys);
    let num = 0;
    let denX = 0;
    let denY = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - meanX;
      const dy = ys[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    if (denX === 0 || denY === 0) return 0;
    return num / Math.sqrt(denX * denY);
  }

  function interpolateBand(value, bands) {
    if (value === null || value === undefined || Number.isNaN(value)) return 0;
    if (value <= bands[0][0]) return bands[0][1];
    for (let i = 1; i < bands.length; i++) {
      const [x0, y0] = bands[i - 1];
      const [x1, y1] = bands[i];
      if (value <= x1) {
        if (x1 === x0) return y1;
        const t = (value - x0) / (x1 - x0);
        return y0 + t * (y1 - y0);
      }
    }
    return bands[bands.length - 1][1];
  }

  // ── CELL PARSING HELPERS ───────────────────────────────────────────────────
  function parseNumber(val, fallback = null) {
    if (val === null || val === undefined || val === '') return fallback;
    if (typeof val === 'number') return Number.isFinite(val) ? val : fallback;
    const cleaned = String(val).replace(/,/g, '').replace(/\s+/g, '').trim();
    if (!cleaned) return fallback;
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : fallback;
  }

  function parsePercentage(val) {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return null;
      if (/^<\s*1\s*%?$/i.test(trimmed)) {
        return { value: 0.5, display: '< 1%', isLessThanOne: true };
      }
      if (trimmed.endsWith('%')) {
        const num = parseNumber(trimmed.slice(0, -1), null);
        if (num !== null) {
          const rounded = Math.round(num * 10) / 10;
          return { value: num, display: rounded + '%', isLessThanOne: false };
        }
      }
      const rawNum = parseNumber(trimmed, null);
      if (rawNum !== null) {
        const pctVal = rawNum > 0 && rawNum < 1 ? rawNum * 100 : rawNum;
        const rounded = Math.round(pctVal * 10) / 10;
        return { value: pctVal, display: rounded + '%', isLessThanOne: false };
      }
      return null;
    }
    if (typeof val === 'number' && Number.isFinite(val)) {
      if (val > 0 && val <= 1) {
        const pctVal = Math.round(val * 1000) / 10;
        if (pctVal < 1) return { value: 0.5, display: '< 1%', isLessThanOne: true };
        return { value: pctVal, display: pctVal + '%', isLessThanOne: false };
      }
      const rounded = Math.round(val * 10) / 10;
      return { value: val, display: rounded + '%', isLessThanOne: false };
    }
    return null;
  }

  function makeDateRecord(year, month, day) {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
    const iso = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const monthKey = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}`;
    return { iso, year: y, month: m, day: d, monthKey, dayOfWeek: dt.getUTCDay(), timestamp: dt.getTime() };
  }

  function parseDateValue(val) {
    if (val === null || val === undefined || val === '') return null;
    if (val instanceof Date && !Number.isNaN(val.getTime())) {
      return makeDateRecord(val.getUTCFullYear(), val.getUTCMonth() + 1, val.getUTCDate());
    }
    if (typeof val === 'number' && Number.isFinite(val)) {
      // Excel serial date (roughly years 1968 to 2119)
      if (val > 25000 && val < 80000) {
        const utcMs = Math.round((val - 25569) * 86400 * 1000);
        const dt = new Date(utcMs);
        return makeDateRecord(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
      }
      return null;
    }
    if (typeof val === 'string') {
      const s = val.trim();
      if (!s) return null;
      // M/D/YYYY or D/M/YYYY
      const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (slashMatch) {
        let p1 = parseInt(slashMatch[1], 10);
        let p2 = parseInt(slashMatch[2], 10);
        let y = parseInt(slashMatch[3], 10);
        if (y < 100) y += 2000;
        // LinkedIn exports US M/D/YYYY; if p1 > 12 and p2 <= 12, handle UK D/M/YYYY gracefully
        if (p1 > 12 && p2 <= 12) {
          return makeDateRecord(y, p2, p1);
        }
        return makeDateRecord(y, p1, p2);
      }
      // YYYY-MM-DD
      const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (isoMatch) {
        return makeDateRecord(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10), parseInt(isoMatch[3], 10));
      }
      // Numeric string representing Excel serial
      if (/^\d{5}(\.\d+)?$/.test(s)) {
        return parseDateValue(Number(s));
      }
    }
    return null;
  }

  function formatUkDateShort(iso) {
    const rec = parseDateValue(iso);
    if (!rec) return String(iso || '');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${rec.day} ${months[rec.month - 1]} ${rec.year}`;
  }

  function formatMonthLabel(monthKey, isPartial = false) {
    const parts = String(monthKey || '').split('-');
    if (parts.length < 2) return String(monthKey || '');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const base = `${months[m - 1] || parts[1]} ${y}`;
    return isPartial ? `${base}*` : base;
  }

  function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }

  function parseWatchTimeSeconds(str) {
    if (!str || typeof str !== 'string') return 0;
    const s = str.trim();
    if (!s) return 0;
    let total = 0;
    const hMatch = s.match(/(\d+)\s*h/i);
    const mMatch = s.match(/(\d+)\s*m/i);
    const sMatch = s.match(/(\d+)\s*s/i);
    if (hMatch) total += parseInt(hMatch[1], 10) * 3600;
    if (mMatch) total += parseInt(mMatch[1], 10) * 60;
    if (sMatch) total += parseInt(sMatch[1], 10);
    return total;
  }

  // ── URL SLUG, TITLE, THEME & HASHTAG EXTRACTION ────────────────────────────
  const PROSE_STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'you', 'your', 'youre', 'youve',
    'i', 'my', 'me', 'we', 'our', 'us', 'this', 'that', 'these', 'those',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'did',
    'to', 'of', 'in', 'on', 'for', 'with', 'at', 'by', 'from', 'about', 'into',
    'over', 'after', 'before', 'between', 'under', 'again', 'most', 'some', 'what',
    'when', 'where', 'why', 'how', 'who', 'which', 'not', 'no', 'just', 'more',
    'out', 'up', 'down', 'new', 'one', 'two', 'three', 'four', 'five', 'week',
    'weeks', 'weekend', 'stories', 'story', 'learn', 'know', 'someone', 'looking',
    'tell', 'without', 'telling', 'heard', 'thrown', 'around', 'would', 'like',
    'anywhere', 'near', 'something', 'things', 'hard', 'quick', 'version',
  ]);

  const KNOWN_HASHTAG_PATTERNS = /^(ai|aisat|aitools|aistrategy|aigovernance|aiinhealthcare|artificialintelligence|machinelearning|deeplearning|openai|anthropic|googledeepmind|claudeopus\d*|metaai|huggingface|nvidia|openrouter|stripe|igaming|compliance|gamblingregulation|uktech|leedsdigitalfestival|ldf\d+|flutter|seo|contentmarketing|keywordresearch|webdevelopment|webaudio|meditation|football\d+|jobsearch|cv|hackathon|podcast|googletrends|ico|saturdaynight)$/i;

  function extractSlugParts(url) {
    if (!url || typeof url !== 'string') return { hasSlug: false, rawSlug: '', tokens: [] };
    const trimmed = url.trim();
    if (/\/feed\/update\/urn:li:/i.test(trimmed)) {
      return { hasSlug: false, rawSlug: '', tokens: [] };
    }
    const postsMatch = trimmed.match(/\/posts\/([^/?#]+)/i);
    if (!postsMatch) {
      return { hasSlug: false, rawSlug: '', tokens: [] };
    }
    let segment = postsMatch[1];
    try {
      segment = decodeURIComponent(segment);
    } catch (_e) {
      // keep raw segment if malformed URI encoding
    }
    // Remove username_ prefix (first underscore after /posts/)
    const uscoreIdx = segment.indexOf('_');
    if (uscoreIdx !== -1) {
      segment = segment.slice(uscoreIdx + 1);
    }
    // Remove trailing -share-<digits>..., -ugcPost-<digits>..., -activity-<digits>... or leading share-<digits>...
    segment = segment.replace(/(?:^|-)(?:share|ugcPost|activity)-\d+.*$/i, '');
    segment = segment.trim().replace(/^-+|-+$/g, '');
    if (!segment) {
      return { hasSlug: false, rawSlug: '', tokens: [] };
    }
    const rawTokens = segment.split('-').filter(Boolean);
    // Clean leading shortened lnkd.in URL artefact like httpslnkdinegvgb4hh
    const cleanedTokens = rawTokens.filter((t) => !/^https?lnkdin[a-z0-9]+$/i.test(t));
    if (cleanedTokens.length === 0) {
      return { hasSlug: false, rawSlug: '', tokens: [] };
    }
    return {
      hasSlug: true,
      rawSlug: cleanedTokens.join('-'),
      tokens: cleanedTokens,
    };
  }

  function slugToTitle(url, publishDateIso) {
    const dateLabel = publishDateIso ? formatUkDateShort(publishDateIso) : 'unknown date';
    const { hasSlug, tokens } = extractSlugParts(url);
    if (!hasSlug || tokens.length === 0) {
      return `Untitled post (${dateLabel})`;
    }
    const words = tokens.join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  function detectTheme(title, rawSlug, customThemeRules) {
    const rules = customThemeRules || CONFIG.THEME_RULES;
    const text = `${String(rawSlug || '').replace(/-/g, ' ')} ${String(title || '')}`
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    if (!text || /^untitled post/i.test(text)) {
      return CONFIG.DEFAULT_THEME;
    }

    for (const rule of rules) {
      for (const kw of rule.keywords) {
        const kwLower = kw.toLowerCase().trim();
        // Match word boundary or substring for multi-word phrase
        const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i');
        if (re.test(text)) {
          return rule.theme;
        }
      }
    }
    return CONFIG.DEFAULT_THEME;
  }

  function extractHashtagsFromSlug(url) {
    const { hasSlug, tokens } = extractSlugParts(url);
    if (!hasSlug || tokens.length === 0) return [];
    const lowerTokens = tokens.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
    if (lowerTokens.length === 0) return [];

    const hasStopword = lowerTokens.some((t) => PROSE_STOPWORDS.has(t));
    const tags = new Set();

    // Case 1: Short slug (1 to 4 tokens) with zero prose stopwords -> LinkedIn hashtag-only slug
    if (!hasStopword && lowerTokens.length <= 4) {
      for (const t of lowerTokens) {
        if (t.length >= 2 && !/^\d+$/.test(t)) {
          tags.add('#' + t);
        }
      }
    }

    // Case 2: Any token matching known hashtag/compound patterns
    for (const t of lowerTokens) {
      if (KNOWN_HASHTAG_PATTERNS.test(t)) {
        tags.add('#' + t);
      }
    }

    return Array.from(tags);
  }

  // ── SHEET RECOGNITION & DEFENSIVE PARSER ───────────────────────────────────
  function normaliseHeader(val) {
    return String(val || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function identifySheets(sheetsMap) {
    // sheetsMap: { [sheetName]: rows[][] }
    const found = {
      discovery: null,
      engagement: null,
      followers: null,
      topPosts: null,
      mostRecentPosts: null,
      audienceDemographics: null,
      contentDemographics: null,
    };
    const matchedSheetNames = new Set();

    // Pass 1: Case-insensitive name match
    const nameMatchers = [
      { key: 'discovery', pattern: /^discovery$/i },
      { key: 'engagement', pattern: /^engagement$/i },
      { key: 'followers', pattern: /^followers$/i },
      { key: 'topPosts', pattern: /^top\s*posts$/i },
      { key: 'mostRecentPosts', pattern: /^most\s*recent\s*posts$/i },
      { key: 'audienceDemographics', pattern: /^audience\s*demographics$/i },
      { key: 'contentDemographics', pattern: /^content\s*demographics$/i },
    ];

    for (const sheetName of Object.keys(sheetsMap)) {
      const trimmed = sheetName.trim();
      for (const m of nameMatchers) {
        if (!found[m.key] && m.pattern.test(trimmed)) {
          found[m.key] = { name: sheetName, rows: sheetsMap[sheetName] };
          matchedSheetNames.add(sheetName);
          break;
        }
      }
    }

    // Pass 2: Structural fallback for localised/renamed sheets
    for (const sheetName of Object.keys(sheetsMap)) {
      if (matchedSheetNames.has(sheetName)) continue;
      const rows = sheetsMap[sheetName] || [];
      if (rows.length === 0) continue;

      // Check TOP POSTS structure: two side-by-side post URL tables (col 0 and col 4 contain linkedin URLs)
      const hasDualUrls = rows.some(
        (r) =>
          r &&
          r.length >= 6 &&
          /linkedin\.com\//i.test(String(r[0] || '')) &&
          /linkedin\.com\//i.test(String(r[4] || ''))
      );
      if (!found.topPosts && hasDualUrls) {
        found.topPosts = { name: sheetName, rows };
        matchedSheetNames.add(sheetName);
        continue;
      }

      // Check MOST RECENT POSTS structure: wide table (>= 10 columns) with linkedin URL in col 0
      const hasWidePosts = rows.some(
        (r) =>
          r &&
          r.length >= 10 &&
          (/linkedin\.com\//i.test(String(r[0] || '')) ||
            normaliseHeader(r[4]).includes('in-network') ||
            normaliseHeader(r[8]).includes('watch'))
      );
      if (!found.mostRecentPosts && hasWidePosts) {
        found.mostRecentPosts = { name: sheetName, rows };
        matchedSheetNames.add(sheetName);
        continue;
      }

      // Check DISCOVERY structure: small sheet (<= 6 non-empty rows) with date range "X - Y" in row 0 col 1
      const nonEmptyRows = rows.filter((r) => r && r.some((c) => String(c || '').trim() !== ''));
      if (
        !found.discovery &&
        nonEmptyRows.length >= 2 &&
        nonEmptyRows.length <= 6 &&
        /\d+\/\d+\/\d+\s*-\s*\d+\/\d+\/\d+/.test(String((nonEmptyRows[0] && nonEmptyRows[0][1]) || ''))
      ) {
        found.discovery = { name: sheetName, rows };
        matchedSheetNames.add(sheetName);
        continue;
      }

      // Check FOLLOWERS structure: row 0 label has a date or "followers" and daily rows have 2 columns (Date, count)
      const row0Text = String((rows[0] && rows[0][0]) || '');
      const hasFollowerTopRow = /\d+\/\d+\/\d+/.test(row0Text) || /followers/i.test(row0Text);
      const hasTwoColDaily = rows.slice(1, 10).some((r) => r && parseDateValue(r[0]) && parseNumber(r[1]) !== null && (r.length <= 3 || String(r[2] || '').trim() === ''));
      if (!found.followers && hasFollowerTopRow && hasTwoColDaily) {
        found.followers = { name: sheetName, rows };
        matchedSheetNames.add(sheetName);
        continue;
      }

      // Check ENGAGEMENT structure: daily rows with 3 columns (Date, Impressions, Engagements)
      const hasThreeColDaily = rows.slice(0, 10).some(
        (r) => r && parseDateValue(r[0]) && parseNumber(r[1]) !== null && parseNumber(r[2]) !== null
      );
      if (!found.engagement && hasThreeColDaily) {
        found.engagement = { name: sheetName, rows };
        matchedSheetNames.add(sheetName);
        continue;
      }

      // Check DEMOGRAPHICS structure: 3 columns where col 2 has percentages
      const hasDemoRows = rows.slice(1, 12).filter(
        (r) => r && String(r[0] || '').trim() && String(r[1] || '').trim() && parsePercentage(r[2]) !== null
      );
      if (hasDemoRows.length >= 3) {
        if (!found.audienceDemographics) {
          found.audienceDemographics = { name: sheetName, rows };
          matchedSheetNames.add(sheetName);
          continue;
        } else if (!found.contentDemographics) {
          found.contentDemographics = { name: sheetName, rows };
          matchedSheetNames.add(sheetName);
          continue;
        }
      }
    }

    return found;
  }

  function parseDiscoverySheet(sheetObj, warnings) {
    const result = {
      present: false,
      rawDateRange: null,
      startDate: null,
      endDate: null,
      impressions: null,
      membersReached: null,
    };
    if (!sheetObj || !Array.isArray(sheetObj.rows) || sheetObj.rows.length === 0) {
      warnings.push('DISCOVERY sheet is missing or empty.');
      return result;
    }
    result.present = true;
    for (const row of sheetObj.rows) {
      if (!row || row.length < 2) continue;
      const label = normaliseHeader(row[0]);
      const val = row[1];
      if (label.includes('overall performance') || /\d+\/\d+\/\d+\s*-\s*\d+\/\d+\/\d+/.test(String(val || ''))) {
        result.rawDateRange = String(val || '').trim();
        const parts = result.rawDateRange.split(/\s*-\s*/);
        if (parts.length === 2) {
          const d1 = parseDateValue(parts[0]);
          const d2 = parseDateValue(parts[1]);
          if (d1) result.startDate = d1.iso;
          if (d2) result.endDate = d2.iso;
        }
      } else if (label.includes('impressions')) {
        result.impressions = parseNumber(val, null);
      } else if (label.includes('members reached') || label.includes('reached')) {
        result.membersReached = parseNumber(val, null);
      }
    }
    return result;
  }

  function parseEngagementSheet(sheetObj, warnings) {
    const rowsOut = [];
    if (!sheetObj || !Array.isArray(sheetObj.rows) || sheetObj.rows.length === 0) {
      warnings.push('ENGAGEMENT sheet is missing or empty.');
      return { present: false, daily: rowsOut };
    }

    const rows = sheetObj.rows;
    let headerIdx = -1;
    let dateCol = 0;
    let impCol = 1;
    let engCol = 2;

    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const r = rows[i] || [];
      const c0 = normaliseHeader(r[0]);
      const c1 = normaliseHeader(r[1]);
      const c2 = normaliseHeader(r[2]);
      if (c0.includes('date') || c1.includes('impressions') || c2.includes('engagements')) {
        headerIdx = i;
        r.forEach((cell, idx) => {
          const h = normaliseHeader(cell);
          if (h.includes('date')) dateCol = idx;
          else if (h.includes('impression')) impCol = idx;
          else if (h.includes('engagement')) engCol = idx;
        });
        break;
      }
    }

    const startRow = headerIdx !== -1 ? headerIdx + 1 : 0;
    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      const d = parseDateValue(r[dateCol]);
      if (!d) continue;
      const impressions = parseNumber(r[impCol], 0);
      const engagements = parseNumber(r[engCol], 0);
      rowsOut.push({
        date: d.iso,
        year: d.year,
        month: d.month,
        day: d.day,
        monthKey: d.monthKey,
        dayOfWeek: d.dayOfWeek,
        timestamp: d.timestamp,
        impressions,
        engagements,
      });
    }

    rowsOut.sort((a, b) => a.timestamp - b.timestamp);
    if (rowsOut.length === 0) {
      warnings.push('ENGAGEMENT sheet contained no daily rows.');
    }
    return { present: rowsOut.length > 0, daily: rowsOut };
  }

  function parseFollowersSheet(sheetObj, warnings) {
    const result = {
      present: false,
      totalFollowers: null,
      totalFollowersDate: null,
      daily: [],
    };
    if (!sheetObj || !Array.isArray(sheetObj.rows) || sheetObj.rows.length === 0) {
      warnings.push('FOLLOWERS sheet is missing or empty.');
      return result;
    }

    const rows = sheetObj.rows;
    let headerIdx = -1;
    let dateCol = 0;
    let newFolCol = 1;

    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const r = rows[i] || [];
      const c0 = String(r[0] || '').trim();
      const c0Lower = normaliseHeader(c0);
      const c1Lower = normaliseHeader(r[1]);

      if (c0Lower.includes('total followers') || (i === 0 && parseNumber(r[1], null) !== null && !parseDateValue(r[0]))) {
        result.totalFollowers = parseNumber(r[1], null);
        const dateInLabel = c0.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{1,2}-\d{1,2})/);
        if (dateInLabel) {
          const parsedLabelDate = parseDateValue(dateInLabel[1]);
          if (parsedLabelDate) result.totalFollowersDate = parsedLabelDate.iso;
        }
        continue;
      }

      if (c0Lower === 'date' || c1Lower.includes('new followers') || c1Lower.includes('followers')) {
        headerIdx = i;
        r.forEach((cell, idx) => {
          const h = normaliseHeader(cell);
          if (h === 'date') dateCol = idx;
          else if (h.includes('follower')) newFolCol = idx;
        });
        break;
      }
    }

    const startRow = headerIdx !== -1 ? headerIdx + 1 : 1;
    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      const d = parseDateValue(r[dateCol]);
      if (!d) continue;
      const newFollowers = parseNumber(r[newFolCol], 0);
      result.daily.push({
        date: d.iso,
        year: d.year,
        month: d.month,
        day: d.day,
        monthKey: d.monthKey,
        dayOfWeek: d.dayOfWeek,
        timestamp: d.timestamp,
        newFollowers,
      });
    }

    result.daily.sort((a, b) => a.timestamp - b.timestamp);
    result.present = result.totalFollowers !== null || result.daily.length > 0;
    if (!result.present) {
      warnings.push('FOLLOWERS sheet contained no usable follower data.');
    }
    return result;
  }

  function normalisePostUrl(url) {
    if (!url || typeof url !== 'string') return '';
    return url.trim().replace(/\?.*$/, '').replace(/\/+$/, '');
  }

  function parseTopPostsSheet(sheetObj, warnings) {
    const result = {
      present: false,
      note: null,
      posts: [],
    };
    if (!sheetObj || !Array.isArray(sheetObj.rows) || sheetObj.rows.length === 0) {
      warnings.push('TOP POSTS sheet is missing or empty.');
      return result;
    }

    const rows = sheetObj.rows;
    let headerIdx = -1;
    let engUrlCol = 0;
    let engDateCol = 1;
    let engValCol = 2;
    let impUrlCol = 4;
    let impDateCol = 5;
    let impValCol = 6;

    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const r = rows[i] || [];
      const rowStr = r.map((c) => normaliseHeader(c)).join(' | ');
      if (i === 0 && /maximum of 50 posts/i.test(String(r[0] || ''))) {
        result.note = String(r[0]).trim();
      }
      if (rowStr.includes('post url') && (rowStr.includes('engagements') || rowStr.includes('impressions'))) {
        headerIdx = i;
        // Locate first and second Post URL columns dynamically
        const urlCols = [];
        r.forEach((cell, idx) => {
          const h = normaliseHeader(cell);
          if (h.includes('post url') || h === 'url') urlCols.push(idx);
        });
        if (urlCols.length >= 2) {
          engUrlCol = urlCols[0];
          engDateCol = urlCols[0] + 1;
          engValCol = urlCols[0] + 2;
          impUrlCol = urlCols[1];
          impDateCol = urlCols[1] + 1;
          impValCol = urlCols[1] + 2;
        }
        break;
      }
    }

    const startRow = headerIdx !== -1 ? headerIdx + 1 : 0;
    const byUrl = new Map();

    function upsertPost(rawUrl, rawDate, field, value, rankIndex) {
      const url = normalisePostUrl(rawUrl);
      if (!url || !/linkedin\.com\//i.test(url)) return;
      const dateRec = parseDateValue(rawDate);
      const numVal = parseNumber(value, null);
      if (!byUrl.has(url)) {
        const dateIso = dateRec ? dateRec.iso : null;
        const { hasSlug, rawSlug } = extractSlugParts(url);
        const title = slugToTitle(url, dateIso);
        const autoTheme = detectTheme(title, rawSlug);
        const hashtags = extractHashtagsFromSlug(url);
        byUrl.set(url, {
          url,
          publishDate: dateIso,
          dayOfWeek: dateRec ? dateRec.dayOfWeek : null,
          timestamp: dateRec ? dateRec.timestamp : null,
          hasSlug,
          rawSlug,
          title,
          autoTheme,
          theme: autoTheme,
          hashtags,
          engagements: null,
          impressions: null,
          engagementRate: null,
          engRank: null,
          impRank: null,
        });
      }
      const entry = byUrl.get(url);
      if (!entry.publishDate && dateRec) {
        entry.publishDate = dateRec.iso;
        entry.dayOfWeek = dateRec.dayOfWeek;
        entry.timestamp = dateRec.timestamp;
        entry.title = slugToTitle(url, dateRec.iso);
      }
      if (field === 'engagements' && numVal !== null) {
        entry.engagements = numVal;
        entry.engRank = rankIndex;
      } else if (field === 'impressions' && numVal !== null) {
        entry.impressions = numVal;
        entry.impRank = rankIndex;
      }
    }

    let engRank = 1;
    let impRank = 1;
    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      if (r[engUrlCol]) {
        upsertPost(r[engUrlCol], r[engDateCol], 'engagements', r[engValCol], engRank++);
      }
      if (r[impUrlCol]) {
        upsertPost(r[impUrlCol], r[impDateCol], 'impressions', r[impValCol], impRank++);
      }
    }

    for (const post of byUrl.values()) {
      if (
        post.engagements !== null &&
        post.impressions !== null &&
        post.impressions > 0
      ) {
        post.engagementRate = (post.engagements / post.impressions) * 100;
      }
      result.posts.push(post);
    }

    result.present = result.posts.length > 0;
    if (!result.present) {
      warnings.push('TOP POSTS sheet contained no valid post rows.');
    }
    return result;
  }

  function parseMostRecentPostsSheet(sheetObj, warnings) {
    const result = {
      present: false,
      posts: [],
    };
    if (!sheetObj || !Array.isArray(sheetObj.rows) || sheetObj.rows.length === 0) {
      warnings.push('MOST RECENT POSTS sheet is missing or empty.');
      return result;
    }

    const rows = sheetObj.rows;
    let headerIdx = -1;
    const colMap = {
      url: 0,
      publishDate: 1,
      postType: 2,
      impressions: 3,
      inNetworkPct: 4,
      outOfNetworkPct: 5,
      membersReached: 6,
      views: 7,
      watchTime: 8,
      avgWatchTime: 9,
      followersGained: 10,
      profileViewers: 11,
      reactions: 12,
      comments: 13,
      reposts: 14,
      saves: 15,
      sends: 16,
      customButton: 17,
    };

    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const r = rows[i] || [];
      const rowStr = r.map((c) => normaliseHeader(c)).join(' | ');
      if (rowStr.includes('post url') && (rowStr.includes('post type') || rowStr.includes('reactions'))) {
        headerIdx = i;
        r.forEach((cell, idx) => {
          const h = normaliseHeader(cell);
          if (h === 'post url') colMap.url = idx;
          else if (h.includes('publish date')) colMap.publishDate = idx;
          else if (h.includes('post type')) colMap.postType = idx;
          else if (h === 'impressions') colMap.impressions = idx;
          else if (h.includes('in-network')) colMap.inNetworkPct = idx;
          else if (h.includes('out-of-network')) colMap.outOfNetworkPct = idx;
          else if (h.includes('members reached')) colMap.membersReached = idx;
          else if (h === 'views') colMap.views = idx;
          else if (h === 'watch time') colMap.watchTime = idx;
          else if (h.includes('avg watch time')) colMap.avgWatchTime = idx;
          else if (h.includes('followers gained')) colMap.followersGained = idx;
          else if (h.includes('profile viewers')) colMap.profileViewers = idx;
          else if (h === 'reactions') colMap.reactions = idx;
          else if (h === 'comments') colMap.comments = idx;
          else if (h === 'reposts') colMap.reposts = idx;
          else if (h === 'saves') colMap.saves = idx;
          else if (h === 'sends') colMap.sends = idx;
          else if (h.includes('custom button')) colMap.customButton = idx;
        });
        break;
      }
    }

    const startRow = headerIdx !== -1 ? headerIdx + 1 : 1;
    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      const url = normalisePostUrl(r[colMap.url]);
      if (!url || !/linkedin\.com\//i.test(url)) continue;
      const dateRec = parseDateValue(r[colMap.publishDate]);
      const dateIso = dateRec ? dateRec.iso : null;
      const { hasSlug, rawSlug } = extractSlugParts(url);
      const title = slugToTitle(url, dateIso);
      const autoTheme = detectTheme(title, rawSlug);
      const inNet = parsePercentage(r[colMap.inNetworkPct]);
      const outNet = parsePercentage(r[colMap.outOfNetworkPct]);
      const watchTimeStr = String(r[colMap.watchTime] || '').trim() || null;
      const avgWatchTimeStr = String(r[colMap.avgWatchTime] || '').trim() || null;
      const reactions = parseNumber(r[colMap.reactions], 0);
      const comments = parseNumber(r[colMap.comments], 0);
      const reposts = parseNumber(r[colMap.reposts], 0);
      const saves = parseNumber(r[colMap.saves], 0);
      const sends = parseNumber(r[colMap.sends], 0);

      result.posts.push({
        url,
        publishDate: dateIso,
        dayOfWeek: dateRec ? dateRec.dayOfWeek : null,
        timestamp: dateRec ? dateRec.timestamp : null,
        hasSlug,
        rawSlug,
        title,
        autoTheme,
        theme: autoTheme,
        postType: String(r[colMap.postType] || 'Post').trim() || 'Post',
        impressions: parseNumber(r[colMap.impressions], 0),
        inNetworkPct: inNet ? inNet.value : null,
        inNetworkDisplay: inNet ? inNet.display : null,
        outOfNetworkPct: outNet ? outNet.value : null,
        outOfNetworkDisplay: outNet ? outNet.display : null,
        membersReached: parseNumber(r[colMap.membersReached], null),
        views: parseNumber(r[colMap.views], null),
        watchTime: watchTimeStr,
        watchTimeSeconds: parseWatchTimeSeconds(watchTimeStr),
        avgWatchTime: avgWatchTimeStr,
        avgWatchTimeSeconds: parseWatchTimeSeconds(avgWatchTimeStr),
        followersGained: parseNumber(r[colMap.followersGained], null),
        profileViewers: parseNumber(r[colMap.profileViewers], null),
        reactions,
        comments,
        reposts,
        saves,
        sends,
        totalInteractions: reactions + comments + reposts + saves + sends,
      });
    }

    result.present = result.posts.length > 0;
    return result;
  }

  function normaliseDemoCategory(rawCat) {
    const c = normaliseHeader(rawCat);
    if (c.includes('company size') || c.includes('size')) return 'Company size';
    if (c.includes('company') || c.includes('employer')) return 'Company';
    if (c.includes('location') || c.includes('city') || c.includes('region')) return 'Location';
    if (c.includes('seniority') || c.includes('level')) return 'Seniority';
    if (c.includes('job title') || c.includes('title') || c.includes('role')) return 'Job title';
    if (c.includes('industry') || c.includes('sector')) return 'Industry';
    return String(rawCat || '').trim();
  }

  function parseDemographicsSheet(sheetObj, label, warnings) {
    const categories = {
      Industry: [],
      Seniority: [],
      'Job title': [],
      'Company size': [],
      Location: [],
      Company: [],
    };
    if (!sheetObj || !Array.isArray(sheetObj.rows) || sheetObj.rows.length === 0) {
      warnings.push(`${label} sheet is missing or empty.`);
      return { present: false, categories };
    }

    const rows = sheetObj.rows;
    let headerIdx = -1;
    let catCol = 0;
    let valCol = 1;
    let pctCol = 2;

    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const r = rows[i] || [];
      const c0 = normaliseHeader(r[0]);
      const c1 = normaliseHeader(r[1]);
      const c2 = normaliseHeader(r[2]);
      if (c0.includes('demographic') || c1 === 'value' || c2.includes('percentage')) {
        headerIdx = i;
        break;
      }
    }

    const startRow = headerIdx !== -1 ? headerIdx + 1 : 0;
    let count = 0;
    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < 3) continue;
      const cat = normaliseDemoCategory(r[catCol]);
      const value = String(r[valCol] || '').trim();
      const pct = parsePercentage(r[pctCol]);
      if (!cat || !value || !pct) continue;
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({
        value,
        percentage: pct.value,
        display: pct.display,
        isLessThanOne: pct.isLessThanOne,
      });
      count++;
    }

    if (count === 0) {
      warnings.push(`${label} sheet contained no demographic rows.`);
    }
    return { present: count > 0, categories };
  }

  function parseSheetsMap(sheetsMap) {
    const warnings = [];
    if (!sheetsMap || typeof sheetsMap !== 'object' || Object.keys(sheetsMap).length === 0) {
      return {
        isValidLinkedInExport: false,
        error: 'The file contains no readable worksheet data.',
        warnings,
      };
    }

    const identified = identifySheets(sheetsMap);
    const matchedCount = Object.values(identified).filter(Boolean).length;
    if (matchedCount === 0) {
      return {
        isValidLinkedInExport: false,
        error:
          'This file does not look like a LinkedIn Creator Analytics export. Please export your Audience or Content analytics as an .xlsx file from LinkedIn and try again.',
        warnings,
      };
    }

    const discovery = parseDiscoverySheet(identified.discovery, warnings);
    const engagement = parseEngagementSheet(identified.engagement, warnings);
    const followers = parseFollowersSheet(identified.followers, warnings);
    const topPosts = parseTopPostsSheet(identified.topPosts, warnings);
    const mostRecentPosts = parseMostRecentPostsSheet(identified.mostRecentPosts, warnings);
    const audienceDemographics = parseDemographicsSheet(
      identified.audienceDemographics,
      'AUDIENCE DEMOGRAPHICS',
      warnings
    );
    const contentDemographics = parseDemographicsSheet(
      identified.contentDemographics,
      'CONTENT DEMOGRAPHICS',
      warnings
    );

    const hasAnyCoreData =
      discovery.present ||
      engagement.present ||
      followers.present ||
      topPosts.present ||
      mostRecentPosts.present ||
      audienceDemographics.present ||
      contentDemographics.present;

    if (!hasAnyCoreData) {
      return {
        isValidLinkedInExport: false,
        error: 'All sheets in this export appear to be empty.',
        warnings,
      };
    }

    // Determine overall date range from DISCOVERY, ENGAGEMENT, or FOLLOWERS
    let startDate = discovery.startDate;
    let endDate = discovery.endDate;
    if (!startDate) {
      const candidates = [
        engagement.daily[0] && engagement.daily[0].date,
        followers.daily[0] && followers.daily[0].date,
      ].filter(Boolean);
      if (candidates.length > 0) startDate = candidates.sort()[0];
    }
    if (!endDate) {
      const candidates = [
        engagement.daily.length > 0 && engagement.daily[engagement.daily.length - 1].date,
        followers.daily.length > 0 && followers.daily[followers.daily.length - 1].date,
        followers.totalFollowersDate,
      ].filter(Boolean);
      if (candidates.length > 0) endDate = candidates.sort().reverse()[0];
    }

    return {
      isValidLinkedInExport: true,
      error: null,
      warnings,
      startDate,
      endDate,
      discovery,
      engagement,
      followers,
      topPosts,
      mostRecentPosts,
      audienceDemographics,
      contentDemographics,
    };
  }

  function parseWorkbook(workbook, XLSX) {
    if (!workbook || !Array.isArray(workbook.SheetNames) || !workbook.Sheets) {
      return {
        isValidLinkedInExport: false,
        error: 'Could not read Excel workbook structure. Please upload a valid .xlsx file.',
        warnings: [],
      };
    }
    const sheetsMap = {};
    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      if (!sheet) continue;
      // Use raw: true so numbers, Excel serial dates and Date objects are preserved alongside strings
      const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: '' });
      const fmtRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
      // Merge formatted strings for percentage cells where Excel stored 0.04 with "4%" format
      const mergedRows = rawRows.map((row, rIdx) =>
        (row || []).map((cell, cIdx) => {
          const fmtCell = fmtRows[rIdx] ? fmtRows[rIdx][cIdx] : '';
          if (typeof fmtCell === 'string' && fmtCell.trim().endsWith('%')) {
            return fmtCell.trim();
          }
          return cell;
        })
      );
      sheetsMap[name] = mergedRows;
    }
    return parseSheetsMap(sheetsMap);
  }

  // ── PURE ANALYSIS ENGINE ───────────────────────────────────────────────────
  const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun for display

  function getIsoWeekKey(dateIso) {
    const rec = parseDateValue(dateIso);
    if (!rec) return '';
    const d = new Date(Date.UTC(rec.year, rec.month - 1, rec.day));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  function analyseFollowerGrowth(parsed) {
    const daily = (parsed.followers && parsed.followers.daily) || [];
    const totalFollowersNow =
      parsed.followers && parsed.followers.totalFollowers !== null
        ? parsed.followers.totalFollowers
        : null;
    const netGained = sum(daily.map((d) => d.newFollowers));
    const estimatedStartFollowers =
      totalFollowersNow !== null ? Math.max(0, totalFollowersNow - netGained) : null;
    const periodGrowthPct =
      estimatedStartFollowers !== null && estimatedStartFollowers > 0
        ? (netGained / estimatedStartFollowers) * 100
        : null;

    // Group by calendar month
    const monthMap = new Map();
    for (const d of daily) {
      if (!monthMap.has(d.monthKey)) {
        monthMap.set(d.monthKey, {
          monthKey: d.monthKey,
          year: d.year,
          month: d.month,
          daysPresent: 0,
          minDay: d.day,
          maxDay: d.day,
          newFollowers: 0,
        });
      }
      const m = monthMap.get(d.monthKey);
      m.daysPresent += 1;
      if (d.day < m.minDay) m.minDay = d.day;
      if (d.day > m.maxDay) m.maxDay = d.day;
      m.newFollowers += d.newFollowers;
    }

    const monthly = Array.from(monthMap.values());
    let runningTotal = estimatedStartFollowers !== null ? estimatedStartFollowers : 0;

    monthly.forEach((m, idx) => {
      const expectedDays = daysInMonth(m.year, m.month);
      const isFirstOrLast = idx === 0 || idx === monthly.length - 1;
      const isComplete = m.minDay === 1 && m.maxDay === expectedDays && m.daysPresent >= expectedDays - 1;
      m.isPartial = isFirstOrLast ? !isComplete : !isComplete;
      m.label = formatMonthLabel(m.monthKey, m.isPartial);
      m.startFollowers = runningTotal;
      runningTotal += m.newFollowers;
      m.endFollowers = runningTotal;
      m.growthPct = m.startFollowers > 0 ? (m.newFollowers / m.startFollowers) * 100 : null;
    });

    // Weekly grouping (for short exports under 90 days)
    const weekMap = new Map();
    let weekRunning = estimatedStartFollowers !== null ? estimatedStartFollowers : 0;
    for (const d of daily) {
      const wk = getIsoWeekKey(d.date);
      if (!weekMap.has(wk)) {
        weekMap.set(wk, {
          weekKey: wk,
          startDate: d.date,
          endDate: d.date,
          daysPresent: 0,
          newFollowers: 0,
        });
      }
      const w = weekMap.get(wk);
      w.endDate = d.date;
      w.daysPresent += 1;
      w.newFollowers += d.newFollowers;
    }
    const weekly = Array.from(weekMap.values()).map((w) => {
      const startFol = weekRunning;
      weekRunning += w.newFollowers;
      return {
        ...w,
        label: formatUkDateShort(w.startDate),
        startFollowers: startFol,
        endFollowers: weekRunning,
        growthPct: startFol > 0 ? (w.newFollowers / startFol) * 100 : null,
      };
    });

    const fullMonths = monthly.filter((m) => !m.isPartial);
    let bestFullMonth = null;
    let worstFullMonth = null;
    if (fullMonths.length > 0) {
      bestFullMonth = fullMonths.reduce((best, cur) => (cur.newFollowers > best.newFollowers ? cur : best), fullMonths[0]);
      worstFullMonth = fullMonths.reduce((worst, cur) => (cur.newFollowers < worst.newFollowers ? cur : worst), fullMonths[0]);
    }

    // Compound monthly growth rate (CMGR) across all full months
    let cmgrAllFullMonths = null;
    if (fullMonths.length >= 1) {
      const firstFull = fullMonths[0];
      const lastFull = fullMonths[fullMonths.length - 1];
      if (firstFull.startFollowers > 0 && lastFull.endFollowers >= firstFull.startFollowers) {
        cmgrAllFullMonths =
          (Math.pow(lastFull.endFollowers / firstFull.startFollowers, 1 / fullMonths.length) - 1) * 100;
      }
    }

    // CMGR over the last 3 full months (or available full months if 1-2)
    let cmgrLast3FullMonths = null;
    const recentFullSlice = fullMonths.slice(-3);
    if (recentFullSlice.length >= 1) {
      const firstRec = recentFullSlice[0];
      const lastRec = recentFullSlice[recentFullSlice.length - 1];
      if (firstRec.startFollowers > 0 && lastRec.endFollowers >= firstRec.startFollowers) {
        cmgrLast3FullMonths =
          (Math.pow(lastRec.endFollowers / firstRec.startFollowers, 1 / recentFullSlice.length) - 1) * 100;
      }
    }

    // Top 10 days for new followers
    const top10Days = [...daily]
      .filter((d) => d.newFollowers > 0)
      .sort((a, b) => b.newFollowers - a.newFollowers || b.timestamp - a.timestamp)
      .slice(0, 10)
      .map((d) => ({
        date: d.date,
        dateDisplay: formatUkDateShort(d.date),
        weekday: WEEKDAY_NAMES[d.dayOfWeek],
        newFollowers: d.newFollowers,
      }));

    const dailyAverage = daily.length > 0 ? netGained / daily.length : 0;

    return {
      present: daily.length > 0 || totalFollowersNow !== null,
      totalFollowersNow,
      estimatedStartFollowers,
      netGained,
      periodGrowthPct,
      totalDays: daily.length,
      useWeeklyCharts: daily.length > 0 && daily.length < CONFIG.MIN_SAMPLE_RULES.weeklyChartThresholdDays,
      monthly,
      weekly,
      fullMonths,
      bestFullMonth,
      worstFullMonth,
      cmgrAllFullMonths,
      cmgrLast3FullMonths,
      dailyAverage,
      top10Days,
    };
  }

  function addMonthsToDateIso(dateIso, monthsToAdd) {
    const rec = parseDateValue(dateIso) || parseDateValue('2026-11-06');
    const totalMonths = rec.year * 12 + (rec.month - 1) + Math.round(monthsToAdd);
    const y = Math.floor(totalMonths / 12);
    const m = (totalMonths % 12) + 1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[m - 1]} ${y}`;
  }

  function buildProjections(followerGrowth, endDateIso, customRatePct) {
    const currentFollowers = followerGrowth.totalFollowersNow || 0;
    const fullMonths = followerGrowth.fullMonths || [];
    const hasEnoughFullMonths = fullMonths.length >= CONFIG.MIN_SAMPLE_RULES.minFullMonthsForProjection;

    const defaultRatePct =
      followerGrowth.cmgrLast3FullMonths !== null && followerGrowth.cmgrLast3FullMonths > 0
        ? Math.min(20, Math.max(1, Math.round(followerGrowth.cmgrLast3FullMonths * 10) / 10))
        : 3.5;

    const chosenRatePct =
      customRatePct !== undefined && customRatePct !== null
        ? Number(customRatePct)
        : defaultRatePct;

    // Steady pace: average new followers per month over the last 2 full months (or dailyAverage * 30.44 fallback)
    const last2Full = fullMonths.slice(-2);
    const steadyMonthlyGain =
      last2Full.length >= 2
        ? (last2Full[0].newFollowers + last2Full[1].newFollowers) / 2
        : followerGrowth.dailyAverage * 30.4375;

    const bestMonthGain = followerGrowth.bestFullMonth
      ? followerGrowth.bestFullMonth.newFollowers
      : Math.round(steadyMonthlyGain);

    const upcomingMilestones = CONFIG.MILESTONES.filter((m) => m > currentFollowers).slice(0, 6);
    const r = chosenRatePct / 100;

    const milestones = upcomingMilestones.map((target) => {
      // Compounding months needed
      let compoundMonths = null;
      let compoundDateLabel = '10+ years';
      if (currentFollowers > 0 && r > 0) {
        compoundMonths = Math.log(target / currentFollowers) / Math.log(1 + r);
        if (compoundMonths <= 120) {
          compoundDateLabel = addMonthsToDateIso(endDateIso, Math.ceil(compoundMonths));
        }
      }

      // Steady pace months needed
      let steadyMonths = null;
      let steadyDateLabel = '10+ years';
      if (steadyMonthlyGain > 0) {
        steadyMonths = (target - currentFollowers) / steadyMonthlyGain;
        if (steadyMonths <= 120) {
          steadyDateLabel = addMonthsToDateIso(endDateIso, Math.ceil(steadyMonths));
        }
      }

      // Reality check: how many new followers per month the chosen % rate needs as you approach this milestone
      const monthlyNeededAtMilestone = Math.round(target * r);
      const ratioToBestMonth = bestMonthGain > 0 ? monthlyNeededAtMilestone / bestMonthGain : null;

      return {
        milestone: target,
        milestoneLabel: formatMilestoneLabel(target),
        compoundMonths: compoundMonths !== null ? Math.ceil(compoundMonths) : null,
        compoundDateLabel,
        isCompoundOver10Years: compoundMonths === null || compoundMonths > 120,
        steadyMonths: steadyMonths !== null ? Math.ceil(steadyMonths) : null,
        steadyDateLabel,
        isSteadyOver10Years: steadyMonths === null || steadyMonths > 120,
        monthlyNeededAtMilestone,
        bestMonthGain,
        ratioToBestMonth,
      };
    });

    // 24-month projection curve for chart
    const curve = [];
    for (let m = 0; m <= 12; m++) {
      const label = m === 0 ? 'Now' : addMonthsToDateIso(endDateIso, m);
      const compoundTotal = Math.round(currentFollowers * Math.pow(1 + r, m));
      const steadyTotal = Math.round(currentFollowers + steadyMonthlyGain * m);
      curve.push({ monthOffset: m, label, compoundTotal, steadyTotal });
    }

    return {
      hasEnoughFullMonths,
      caveat: hasEnoughFullMonths
        ? null
        : 'This export has fewer than 2 full calendar months of data, so projections use your daily average pace and should be treated as a rough guide.',
      currentFollowers,
      defaultRatePct,
      chosenRatePct,
      steadyMonthlyGain: Math.round(steadyMonthlyGain),
      bestMonthGain,
      nextMilestone: upcomingMilestones[0] || currentFollowers + 1000,
      milestones,
      curve,
    };
  }

  function planGoal(analysis, targetFollowersInput, targetDateInput) {
    const followerGrowth = analysis.followerGrowth;
    const currentFollowers = followerGrowth.totalFollowersNow || 0;
    const exportEndRec = parseDateValue(analysis.dateRange.endDate) || parseDateValue('2026-11-06');

    const targetFollowers = parseNumber(targetFollowersInput, analysis.projections.nextMilestone);
    const targetDateRec = parseDateValue(targetDateInput);

    if (!targetFollowers || targetFollowers <= currentFollowers) {
      return {
        valid: false,
        friendlyMessage: `Your target (${formatInt(targetFollowers || 0)}) is already at or below your current follower total of ${formatInt(currentFollowers)}. Pick a higher target above ${formatInt(currentFollowers)} to plan your next milestone.`,
      };
    }

    if (!targetDateRec || targetDateRec.timestamp <= exportEndRec.timestamp) {
      return {
        valid: false,
        friendlyMessage: `Please choose a target date after ${formatUkDateShort(exportEndRec.iso)} so we can calculate the pace you need.`,
      };
    }

    const daysAvailable = Math.max(1, Math.round((targetDateRec.timestamp - exportEndRec.timestamp) / 86400000));
    const monthsAvailable = daysAvailable / 30.4375;
    const weeksAvailable = daysAvailable / 7;
    const followersNeededTotal = targetFollowers - currentFollowers;

    const neededPerDay = followersNeededTotal / daysAvailable;
    const neededPerWeek = followersNeededTotal / weeksAvailable;
    const neededPerMonth = followersNeededTotal / monthsAvailable;

    const compoundMonthlyRatePct =
      currentFollowers > 0 && monthsAvailable > 0
        ? (Math.pow(targetFollowers / currentFollowers, 1 / monthsAvailable) - 1) * 100
        : 0;

    // Compare against last 3 full months average and best full month
    const last3Full = (followerGrowth.fullMonths || []).slice(-3);
    const recentAvgMonthlyGains =
      last3Full.length > 0
        ? average(last3Full.map((m) => m.newFollowers))
        : followerGrowth.dailyAverage * 30.4375;
    const bestMonthGains = followerGrowth.bestFullMonth
      ? followerGrowth.bestFullMonth.newFollowers
      : recentAvgMonthlyGains;

    const paceRatio = recentAvgMonthlyGains > 0 ? neededPerMonth / recentAvgMonthlyGains : 99;
    let verdictKey = 'unlikely';
    let verdictLabel = CONFIG.GOAL_VERDICTS.labels.unlikely;
    if (paceRatio <= CONFIG.GOAL_VERDICTS.onTrackMaxRatio) {
      verdictKey = 'onTrack';
      verdictLabel = CONFIG.GOAL_VERDICTS.labels.onTrack;
    } else if (paceRatio <= CONFIG.GOAL_VERDICTS.stretchMaxRatio) {
      verdictKey = 'stretch';
      verdictLabel = CONFIG.GOAL_VERDICTS.labels.stretch;
    } else if (paceRatio <= CONFIG.GOAL_VERDICTS.ambitiousMaxRatio) {
      verdictKey = 'ambitious';
      verdictLabel = CONFIG.GOAL_VERDICTS.labels.ambitious;
    }

    // Date at current pace
    let dateAtCurrentPace = '10+ years';
    if (recentAvgMonthlyGains > 0) {
      const monthsAtCurrent = followersNeededTotal / recentAvgMonthlyGains;
      if (monthsAtCurrent <= 120) {
        dateAtCurrentPace = addMonthsToDateIso(exportEndRec.iso, Math.ceil(monthsAtCurrent));
      }
    }

    // Practical suggestions linked to their own data
    const suggestions = [];
    if (analysis.postsAnalysis && analysis.postsAnalysis.bestTheme) {
      const bt = analysis.postsAnalysis.bestTheme;
      suggestions.push(
        `Publish one extra '${bt.theme}' post each fortnight. That theme earns a median of ${formatInt(bt.medianEngagements)} engagements per post in your data.`
      );
    }
    if (analysis.bestDays && analysis.bestDays.bestFollowerDay) {
      const bd = analysis.bestDays.bestFollowerDay;
      suggestions.push(
        `Anchor your flagship post around ${bd.weekday}, which averages ${formatDec(bd.avgNewFollowers, 1)} new followers per day across your export.`
      );
    }
    if (analysis.audience && analysis.audience.topIndustry) {
      suggestions.push(
        `Tailor examples directly to ${analysis.audience.topIndustry.value} (${analysis.audience.topIndustry.display} of your followers) to improve profile-to-follower conversion.`
      );
    }
    if (suggestions.length < 2) {
      suggestions.push('Keep a consistent weekly posting rhythm so you avoid multi-week gaps in feed visibility.');
    }

    return {
      valid: true,
      targetFollowers,
      targetDate: targetDateRec.iso,
      targetDateDisplay: formatUkDateShort(targetDateRec.iso),
      currentFollowers,
      followersNeededTotal,
      daysAvailable,
      monthsAvailable: Math.round(monthsAvailable * 10) / 10,
      compoundMonthlyRatePct,
      neededPerMonth,
      neededPerWeek,
      neededPerDay,
      recentAvgMonthlyGains,
      bestMonthGains,
      paceRatio,
      verdictKey,
      verdictLabel,
      dateAtCurrentPace,
      suggestions: suggestions.slice(0, 3),
    };
  }

  function analysePosts(parsed, themeOverrides = {}) {
    const rawTopPosts = (parsed.topPosts && parsed.topPosts.posts) || [];
    const rawRecentPosts = (parsed.mostRecentPosts && parsed.mostRecentPosts.posts) || [];

    const posts = rawTopPosts.map((p) => {
      const override = themeOverrides[p.url];
      const theme = override && CONFIG.ALL_THEMES.includes(override) ? override : p.autoTheme;
      return {
        ...p,
        theme,
        publishDateDisplay: p.publishDate ? formatUkDateShort(p.publishDate) : 'Unknown',
      };
    });

    const top10ByEngagements = [...posts]
      .filter((p) => p.engagements !== null)
      .sort((a, b) => b.engagements - a.engagements || (b.impressions || 0) - (a.impressions || 0))
      .slice(0, 10);

    const top10ByImpressions = [...posts]
      .filter((p) => p.impressions !== null)
      .sort((a, b) => b.impressions - a.impressions || (b.engagements || 0) - (a.engagements || 0))
      .slice(0, 10);

    const top10ByEngagementRate = [...posts]
      .filter((p) => p.engagementRate !== null)
      .sort((a, b) => b.engagementRate - a.engagementRate || (b.engagements || 0) - (a.engagements || 0))
      .slice(0, 10);

    // Breakout post: top post has > ~2x engagements of next best
    let breakoutPost = null;
    if (top10ByEngagements.length >= 2) {
      const first = top10ByEngagements[0];
      const second = top10ByEngagements[1];
      if (second.engagements > 0 && first.engagements >= second.engagements * 1.95) {
        breakoutPost = {
          post: first,
          secondBest: second,
          multiplier: Math.round((first.engagements / second.engagements) * 10) / 10,
        };
      }
    }

    // Theme table
    const minSample = CONFIG.MIN_SAMPLE_RULES.minPostsForThemeOrDay;
    const themeGroups = new Map();
    for (const themeName of CONFIG.ALL_THEMES) {
      themeGroups.set(themeName, []);
    }
    for (const p of posts) {
      if (!themeGroups.has(p.theme)) themeGroups.set(p.theme, []);
      themeGroups.get(p.theme).push(p);
    }

    const themeStats = [];
    for (const [theme, list] of themeGroups.entries()) {
      if (list.length === 0) continue;
      const engVals = list.map((p) => p.engagements).filter((v) => v !== null);
      const impVals = list.map((p) => p.impressions).filter((v) => v !== null);
      const bothPosts = list.filter((p) => p.engagements !== null && p.impressions !== null && p.impressions > 0);
      const totalBothEng = sum(bothPosts.map((p) => p.engagements));
      const totalBothImp = sum(bothPosts.map((p) => p.impressions));
      const groupEngRate = totalBothImp > 0 ? (totalBothEng / totalBothImp) * 100 : null;
      const meetsMinSample = list.length >= minSample && engVals.length >= minSample;

      themeStats.push({
        theme,
        postCount: list.length,
        shareOfPostsPct: posts.length > 0 ? (list.length / posts.length) * 100 : 0,
        medianEngagements: engVals.length > 0 ? median(engVals) : null,
        avgEngagements: engVals.length > 0 ? average(engVals) : null,
        medianImpressions: impVals.length > 0 ? median(impVals) : null,
        avgImpressions: impVals.length > 0 ? average(impVals) : null,
        engagementRate: groupEngRate,
        meetsMinSample,
        statusNote: meetsMinSample ? 'Ranked' : 'Not enough posts to judge',
      });
    }

    themeStats.sort((a, b) => {
      if (a.meetsMinSample !== b.meetsMinSample) return a.meetsMinSample ? -1 : 1;
      return (b.medianEngagements || 0) - (a.medianEngagements || 0) || b.postCount - a.postCount;
    });

    const qualifiedThemes = themeStats.filter((t) => t.meetsMinSample);
    const bestTheme = qualifiedThemes.length > 0 ? qualifiedThemes[0] : null;
    const weakestTheme =
      qualifiedThemes.length > 1 ? qualifiedThemes[qualifiedThemes.length - 1] : null;

    // Hashtag table (hashtags used in 3+ posts)
    const tagMap = new Map();
    for (const p of posts) {
      for (const tag of p.hashtags || []) {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push(p);
      }
    }
    const hashtagStats = [];
    for (const [tag, list] of tagMap.entries()) {
      if (list.length < minSample) continue;
      const engVals = list.map((p) => p.engagements).filter((v) => v !== null);
      const impVals = list.map((p) => p.impressions).filter((v) => v !== null);
      hashtagStats.push({
        hashtag: tag,
        postCount: list.length,
        medianEngagements: engVals.length > 0 ? median(engVals) : 0,
        avgEngagements: engVals.length > 0 ? average(engVals) : 0,
        avgImpressions: impVals.length > 0 ? average(impVals) : 0,
      });
    }
    hashtagStats.sort((a, b) => b.medianEngagements - a.medianEngagements || b.postCount - a.postCount);

    // Lowest impressions in TOP POSTS list
    const allTopImpressions = posts.map((p) => p.impressions).filter((v) => v !== null && v > 0);
    const lowestTop50Impressions = allTopImpressions.length > 0 ? Math.min(...allTopImpressions) : null;

    const recentPosts = rawRecentPosts.map((rp) => {
      const override = themeOverrides[rp.url];
      const theme = override && CONFIG.ALL_THEMES.includes(override) ? override : rp.autoTheme;
      const reachedTop50 =
        lowestTop50Impressions !== null ? rp.impressions >= lowestTop50Impressions : false;
      return {
        ...rp,
        theme,
        publishDateDisplay: rp.publishDate ? formatUkDateShort(rp.publishDate) : 'Unknown',
        lowestTop50Impressions,
        reachedTop50,
        top50ComparisonText:
          lowestTop50Impressions !== null
            ? reachedTop50
              ? `Reached Top 50 level (${formatInt(rp.impressions)} vs ${formatInt(lowestTop50Impressions)} threshold)`
              : `Below Top 50 cutoff (${formatInt(rp.impressions)} vs ${formatInt(lowestTop50Impressions)} lowest in Top 50)`
            : 'No Top 50 threshold available',
      };
    });

    return {
      present: posts.length > 0 || recentPosts.length > 0,
      allPosts: posts,
      totalUniqueTopPosts: posts.length,
      top10ByEngagements,
      top10ByImpressions,
      top10ByEngagementRate,
      breakoutPost,
      themeStats,
      bestTheme,
      weakestTheme,
      hashtagStats,
      lowestTop50Impressions,
      recentPosts,
      top50Note:
        'LinkedIn caps the Top Posts sheet at 50 posts, so these rankings reflect your stronger posts rather than every post you published.',
    };
  }

  function analyseCreatorType(postsAnalysis) {
    const allPosts = (postsAnalysis && postsAnalysis.allPosts) || [];
    const themeStats = (postsAnalysis && postsAnalysis.themeStats) || [];
    const minSample = CONFIG.MIN_SAMPLE_RULES.minPostsForThemeOrDay;

    const themesWithMinSample = themeStats.filter((t) => t.postCount >= minSample);
    if (themesWithMinSample.length === 0 || allPosts.length < minSample) {
      const explorer = CONFIG.CREATOR_TYPES.Explorer;
      return {
        isExplorer: true,
        primaryType: explorer,
        primaryThemeStats: null,
        hiddenStrengthType: null,
        hiddenStrengthStats: null,
        hasHiddenStrengthMismatch: false,
        hiddenStrengthCallout:
          'Publish at least 3 posts in a single theme to unlock your Creator Type and hidden strength.',
      };
    }

    // Primary type: theme with the most posts (at least 3 posts)
    const sortedByCount = [...themesWithMinSample].sort(
      (a, b) => b.postCount - a.postCount || (b.medianEngagements || 0) - (a.medianEngagements || 0)
    );
    const primaryStat = sortedByCount[0];
    const primaryType = CONFIG.CREATOR_TYPES[primaryStat.theme] || CONFIG.CREATOR_TYPES[CONFIG.DEFAULT_THEME];

    // Hidden strength: theme with best median engagements (3+ posts)
    const sortedByMedianEng = [...themesWithMinSample]
      .filter((t) => t.medianEngagements !== null)
      .sort((a, b) => b.medianEngagements - a.medianEngagements || b.postCount - a.postCount);
    const bestEngStat = sortedByMedianEng[0] || primaryStat;
    const hiddenStrengthType = CONFIG.CREATOR_TYPES[bestEngStat.theme] || primaryType;
    const hasHiddenStrengthMismatch = bestEngStat.theme !== primaryStat.theme;

    const hiddenStrengthCallout = hasHiddenStrengthMismatch
      ? `You post like ${primaryType.name} (${primaryStat.postCount} posts), but your audience rewards ${hiddenStrengthType.name} (median ${formatDec(bestEngStat.medianEngagements, 0)} engagements vs ${formatDec(primaryStat.medianEngagements, 0)}).`
      : `Your highest-volume theme (${primaryType.name}) is also your highest-performing theme, with a median of ${formatDec(primaryStat.medianEngagements, 0)} engagements across ${primaryStat.postCount} posts.`;

    return {
      isExplorer: false,
      primaryType,
      primaryThemeStats: primaryStat,
      hiddenStrengthType,
      hiddenStrengthStats: bestEngStat,
      hasHiddenStrengthMismatch,
      hiddenStrengthCallout,
    };
  }

  function analyseBestDays(parsed, postsAnalysis) {
    const engDaily = (parsed.engagement && parsed.engagement.daily) || [];
    const folDaily = (parsed.followers && parsed.followers.daily) || [];
    const allPosts = (postsAnalysis && postsAnalysis.allPosts) || [];
    const minSample = CONFIG.MIN_SAMPLE_RULES.minPostsForThemeOrDay;

    // Map daily impressions, engagements, new followers by weekday (0..6)
    const dayBuckets = new Map();
    for (let d = 0; d < 7; d++) {
      dayBuckets.set(d, {
        dayOfWeek: d,
        weekday: WEEKDAY_NAMES[d],
        shortDay: WEEKDAY_NAMES[d].slice(0, 3),
        impressionsList: [],
        engagementsList: [],
        newFollowersList: [],
        topPosts: [],
      });
    }

    for (const row of engDaily) {
      const b = dayBuckets.get(row.dayOfWeek);
      if (b) {
        b.impressionsList.push(row.impressions);
        b.engagementsList.push(row.engagements);
      }
    }
    for (const row of folDaily) {
      const b = dayBuckets.get(row.dayOfWeek);
      if (b) {
        b.newFollowersList.push(row.newFollowers);
      }
    }
    for (const post of allPosts) {
      if (post.dayOfWeek !== null && post.dayOfWeek !== undefined) {
        const b = dayBuckets.get(post.dayOfWeek);
        if (b) b.topPosts.push(post);
      }
    }

    const weekdayStats = WEEKDAY_ORDER.map((d) => {
      const b = dayBuckets.get(d);
      const postEngs = b.topPosts.map((p) => p.engagements).filter((v) => v !== null);
      const postImps = b.topPosts.map((p) => p.impressions).filter((v) => v !== null);
      const postCount = b.topPosts.length;
      const meetsMinPosts = postCount >= minSample;

      // Check if one theme dominates this day's top posts (>= 60% and >= 3 posts)
      const themeCounts = {};
      for (const p of b.topPosts) {
        themeCounts[p.theme] = (themeCounts[p.theme] || 0) + 1;
      }
      let dominantTheme = null;
      let dominantSharePct = 0;
      for (const [th, cnt] of Object.entries(themeCounts)) {
        const share = postCount > 0 ? (cnt / postCount) * 100 : 0;
        if (cnt >= minSample && share >= 60 && share > dominantSharePct) {
          dominantTheme = th;
          dominantSharePct = share;
        }
      }

      return {
        dayOfWeek: d,
        weekday: b.weekday,
        shortDay: b.shortDay,
        avgImpressions: b.impressionsList.length > 0 ? average(b.impressionsList) : 0,
        avgEngagements: b.engagementsList.length > 0 ? average(b.engagementsList) : 0,
        avgNewFollowers: b.newFollowersList.length > 0 ? average(b.newFollowersList) : 0,
        topPostCount: postCount,
        meetsMinPosts,
        medianPostEngagements: postEngs.length > 0 ? median(postEngs) : null,
        medianPostImpressions: postImps.length > 0 ? median(postImps) : null,
        dominantTheme,
        dominantSharePct: Math.round(dominantSharePct),
      };
    });

    const bestImpressionDay =
      engDaily.length > 0
        ? [...weekdayStats].sort((a, b) => b.avgImpressions - a.avgImpressions)[0]
        : null;
    const bestEngagementDay =
      engDaily.length > 0
        ? [...weekdayStats].sort((a, b) => b.avgEngagements - a.avgEngagements)[0]
        : null;
    const bestFollowerDay =
      folDaily.length > 0
        ? [...weekdayStats].sort((a, b) => b.avgNewFollowers - a.avgNewFollowers)[0]
        : null;

    const qualifiedPostDays = weekdayStats.filter((w) => w.meetsMinPosts && w.medianPostEngagements !== null);
    const bestTopPostDay =
      qualifiedPostDays.length > 0
        ? [...qualifiedPostDays].sort((a, b) => b.medianPostEngagements - a.medianPostEngagements)[0]
        : null;

    const themeConfoundNotes = weekdayStats
      .filter((w) => w.dominantTheme)
      .map(
        (w) =>
          `${w.dominantSharePct}% of your ${w.weekday} top posts are '${w.dominantTheme}', so the theme is likely driving ${w.weekday}'s numbers rather than the day of the week alone.`
      );

    const followerVsImpressionMismatch =
      bestFollowerDay &&
      bestImpressionDay &&
      bestFollowerDay.weekday !== bestImpressionDay.weekday
        ? `Your best day for new followers is ${bestFollowerDay.weekday} (${formatDec(bestFollowerDay.avgNewFollowers, 1)}/day), whereas daily impressions peak on ${bestImpressionDay.weekday} (${formatInt(bestImpressionDay.avgImpressions)}/day).`
        : null;

    return {
      present: engDaily.length > 0 || folDaily.length > 0,
      weekdayStats,
      bestImpressionDay,
      bestEngagementDay,
      bestFollowerDay,
      bestTopPostDay,
      themeConfoundNotes,
      followerVsImpressionMismatch,
      postingTimeNote:
        'LinkedIn analytics exports do not include the time of day a post was published, so time-of-day recommendations cannot be made honestly from this file.',
    };
  }

  function analyseReachAndEngagementTrend(parsed, followerGrowth) {
    const daily = (parsed.engagement && parsed.engagement.daily) || [];
    const folDaily = (parsed.followers && parsed.followers.daily) || [];

    // Daily impressions with 7-day rolling average
    const dailyWithRolling = daily.map((d, idx) => {
      const start = Math.max(0, idx - 6);
      const windowSlice = daily.slice(start, idx + 1);
      const rolling7dImpressions = average(windowSlice.map((x) => x.impressions));
      return {
        ...d,
        dateDisplay: formatUkDateShort(d.date),
        rolling7dImpressions: Math.round(rolling7dImpressions * 10) / 10,
      };
    });

    // Monthly impressions, engagements & engagement rate
    const monthMap = new Map();
    for (const d of daily) {
      if (!monthMap.has(d.monthKey)) {
        monthMap.set(d.monthKey, {
          monthKey: d.monthKey,
          year: d.year,
          month: d.month,
          daysPresent: 0,
          minDay: d.day,
          maxDay: d.day,
          impressions: 0,
          engagements: 0,
        });
      }
      const m = monthMap.get(d.monthKey);
      m.daysPresent += 1;
      if (d.day < m.minDay) m.minDay = d.day;
      if (d.day > m.maxDay) m.maxDay = d.day;
      m.impressions += d.impressions;
      m.engagements += d.engagements;
    }

    const monthly = Array.from(monthMap.values());
    monthly.forEach((m, idx) => {
      const expectedDays = daysInMonth(m.year, m.month);
      const isFirstOrLast = idx === 0 || idx === monthly.length - 1;
      const isComplete = m.minDay === 1 && m.maxDay === expectedDays && m.daysPresent >= expectedDays - 1;
      m.isPartial = isFirstOrLast ? !isComplete : !isComplete;
      m.label = formatMonthLabel(m.monthKey, m.isPartial);
      m.engagementRate = m.impressions > 0 ? (m.engagements / m.impressions) * 100 : 0;
    });

    // Weekly grouping for short exports
    const weekMap = new Map();
    for (const d of daily) {
      const wk = getIsoWeekKey(d.date);
      if (!weekMap.has(wk)) {
        weekMap.set(wk, {
          weekKey: wk,
          startDate: d.date,
          impressions: 0,
          engagements: 0,
        });
      }
      const w = weekMap.get(wk);
      w.impressions += d.impressions;
      w.engagements += d.engagements;
    }
    const weekly = Array.from(weekMap.values()).map((w) => ({
      ...w,
      label: formatUkDateShort(w.startDate),
      engagementRate: w.impressions > 0 ? (w.engagements / w.impressions) * 100 : 0,
    }));

    // Check divergence between follower growth and impressions / engagement rate over recent full months
    const fullReachMonths = monthly.filter((m) => !m.isPartial);
    const fullFolMonths = (followerGrowth && followerGrowth.fullMonths) || [];
    const divergenceFlags = [];

    if (fullReachMonths.length >= 4 && fullFolMonths.length >= 4) {
      const half = Math.floor(fullReachMonths.length / 2);
      const earlyImp = average(fullReachMonths.slice(0, half).map((m) => m.impressions));
      const lateImp = average(fullReachMonths.slice(-half).map((m) => m.impressions));
      const earlyEr = average(fullReachMonths.slice(0, half).map((m) => m.engagementRate));
      const lateEr = average(fullReachMonths.slice(-half).map((m) => m.engagementRate));
      const earlyFol = average(fullFolMonths.slice(0, half).map((m) => m.newFollowers));
      const lateFol = average(fullFolMonths.slice(-half).map((m) => m.newFollowers));

      if (lateFol > earlyFol * 1.15 && lateImp < earlyImp * 0.85) {
        divergenceFlags.push(
          'Follower growth is rising while monthly impressions have dipped in the second half of the period.'
        );
      } else if (lateFol < earlyFol * 0.85 && lateImp > earlyImp * 1.15) {
        divergenceFlags.push(
          'Monthly impressions are rising, but net new followers per month have slowed compared with earlier months.'
        );
      }
      if (lateFol > earlyFol * 1.15 && lateEr < earlyEr * 0.85) {
        divergenceFlags.push(
          'New followers are climbing while your overall engagement rate has softened over recent months.'
        );
      }
    }

    // Correlation between daily impressions and daily new followers (same day + 1-day lag)
    const folByDate = new Map(folDaily.map((f) => [f.date, f.newFollowers]));
    const pairedSameDay = [];
    for (const d of daily) {
      if (folByDate.has(d.date)) {
        pairedSameDay.push({ date: d.date, imp: d.impressions, fol: folByDate.get(d.date) });
      }
    }

    const hasEnoughDaysForCorrelation =
      pairedSameDay.length >= CONFIG.MIN_SAMPLE_RULES.minDaysForCorrelation;
    let sameDayR = null;
    let lag1DayR = null;
    let bestR = null;
    let correlationStrength = 'Not enough days';
    let correlationExplanation = `At least ${CONFIG.MIN_SAMPLE_RULES.minDaysForCorrelation} days of paired data are needed to test the link between daily impressions and new followers.`;

    if (hasEnoughDaysForCorrelation) {
      sameDayR = pearsonCorrelation(
        pairedSameDay.map((p) => p.imp),
        pairedSameDay.map((p) => p.fol)
      );
      const lagImps = [];
      const lagFols = [];
      for (let i = 0; i < pairedSameDay.length - 1; i++) {
        lagImps.push(pairedSameDay[i].imp);
        lagFols.push(pairedSameDay[i + 1].fol);
      }
      lag1DayR = pearsonCorrelation(lagImps, lagFols);
      bestR = Math.max(sameDayR || 0, lag1DayR || 0);

      if (bestR >= 0.5) {
        correlationStrength = 'Strong link';
        correlationExplanation = `Daily impressions and new followers move closely together (r = ${formatDec(sameDayR, 2)} same day, r = ${formatDec(lag1DayR, 2)} next day). High-reach posts are your main driver of new followers.`;
      } else if (bestR >= 0.25) {
        correlationStrength = 'Moderate link';
        correlationExplanation = `There is a moderate link between daily impressions and new followers (r = ${formatDec(sameDayR, 2)} same day, r = ${formatDec(lag1DayR, 2)} next day). Posts bring in a share of your followers alongside profile visits and networking.`;
      } else {
        correlationStrength = 'Weak link';
        correlationExplanation = `The link between daily post impressions and new followers is weak (r = ${formatDec(sameDayR, 2)} same day, r = ${formatDec(lag1DayR, 2)} next day). That means most of your new followers come from outside the feed: connection requests, profile visits, events, comments and communities.`;
      }
    }

    return {
      present: daily.length > 0,
      useWeeklyCharts: daily.length > 0 && daily.length < CONFIG.MIN_SAMPLE_RULES.weeklyChartThresholdDays,
      daily: dailyWithRolling,
      monthly,
      weekly,
      divergenceFlags,
      correlation: {
        hasEnoughDays: hasEnoughDaysForCorrelation,
        pairedDays: pairedSameDay.length,
        sameDayR,
        lag1DayR,
        bestR,
        strength: correlationStrength,
        explanation: correlationExplanation,
      },
    };
  }

  function analyseAudienceDemographics(parsed) {
    const demo = parsed.audienceDemographics || { present: false, categories: {} };
    const cats = demo.categories || {};
    const industry = cats.Industry || [];
    const seniority = cats.Seniority || [];
    const jobTitle = cats['Job title'] || [];
    const companySize = cats['Company size'] || [];
    const location = cats.Location || [];
    const company = cats.Company || [];

    // Senior-level = Senior + Director + VP + CXO + Owner + Partner
    const seniorLevels = new Set(['senior', 'director', 'vp', 'cxo', 'owner', 'partner']);
    const seniorSharePct = sum(
      seniority
        .filter((s) => seniorLevels.has(s.value.toLowerCase().trim()))
        .map((s) => s.percentage)
    );
    const entrySharePct = sum(
      seniority
        .filter((s) => ['entry', 'training', 'unpaid'].includes(s.value.toLowerCase().trim()))
        .map((s) => s.percentage)
    );

    // Small-company share = 0-1, 2-10 and 11-50 employees combined
    const smallCompanySharePct = sum(
      companySize
        .filter((c) => /^(0-1|2-10|11-50)\b/i.test(c.value.trim()))
        .map((c) => c.percentage)
    );
    const largeCompanySharePct = sum(
      companySize
        .filter((c) => /^(1,001-5,000|5,001-10,000|10,001\+)/i.test(c.value.trim()))
        .map((c) => c.percentage)
    );

    // Employer concentration: group top companies sharing a root brand word (e.g. "Flutter")
    const stopCompanyWords = new Set([
      'the', 'and', 'group', 'limited', 'ltd', 'inc', 'plc', 'llc', 'corp', 'corporation',
      'company', 'international', 'entertainment', 'services', 'consulting', 'technologies',
      'technology', 'global', 'uk', 'ireland', 'university', 'of', 'bank', 'banking', 'media',
    ]);
    const wordBuckets = new Map();
    for (const comp of company) {
      const words = comp.value
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !stopCompanyWords.has(w.toLowerCase()));
      for (const w of words) {
        const key = w.toLowerCase();
        if (!wordBuckets.has(key)) {
          wordBuckets.set(key, { rootWord: w, companies: [], totalPct: 0 });
        }
        const b = wordBuckets.get(key);
        if (!b.companies.includes(comp.value)) {
          b.companies.push(comp.value);
          b.totalPct += comp.percentage;
        }
      }
    }
    let employerConcentration = null;
    for (const b of wordBuckets.values()) {
      if (b.companies.length >= 2) {
        if (!employerConcentration || b.totalPct > employerConcentration.totalPct) {
          employerConcentration = {
            groupName: b.rootWord,
            companies: b.companies,
            totalPct: Math.round(b.totalPct * 10) / 10,
            summary: `${b.companies.length} top employers appear to be part of the ${b.rootWord} group (${b.companies.join(', ')}), making up roughly ${formatPct(b.totalPct, 1)} of your followers combined.`,
          };
        }
      }
    }

    const topIndustry = industry[0] || null;
    const topLocation = location[0] || null;
    const topRole = jobTitle[0] || null;

    const plainSummaries = [];
    if (seniorSharePct > 0) {
      plainSummaries.push(`${formatPct(seniorSharePct, 0)} of your followers are senior-level (Senior, Director, VP, CXO, Owner or Partner).`);
    }
    if (topIndustry) {
      plainSummaries.push(`Your biggest follower industry is ${topIndustry.value} (${topIndustry.display}).`);
    }
    if (smallCompanySharePct > 0) {
      plainSummaries.push(`${formatPct(smallCompanySharePct, 0)} work at small companies (up to 50 employees), compared with ${formatPct(largeCompanySharePct, 0)} at organisations of 1,000+ staff.`);
    }
    if (topLocation) {
      plainSummaries.push(`Your top geographic hub is ${topLocation.value} (${topLocation.display}).`);
    }
    if (employerConcentration) {
      plainSummaries.push(employerConcentration.summary);
    }

    return {
      present: demo.present,
      categories: cats,
      topIndustry,
      topLocation,
      topRole,
      seniorSharePct: Math.round(seniorSharePct * 10) / 10,
      entrySharePct: Math.round(entrySharePct * 10) / 10,
      smallCompanySharePct: Math.round(smallCompanySharePct * 10) / 10,
      largeCompanySharePct: Math.round(largeCompanySharePct * 10) / 10,
      employerConcentration,
      plainSummaries,
    };
  }

  function analyseContentVsAudience(parsed) {
    const aud = parsed.audienceDemographics || { present: false, categories: {} };
    const con = parsed.contentDemographics || { present: false, categories: {} };
    if (!aud.present || !con.present) {
      return {
        present: false,
        comparisons: {},
        topGaps: [],
      };
    }

    const categoryNames = ['Industry', 'Seniority', 'Location', 'Company size', 'Job title', 'Company'];
    const comparisons = {};
    const allGaps = [];

    for (const cat of categoryNames) {
      const audList = aud.categories[cat] || [];
      const conList = con.categories[cat] || [];
      const audMap = new Map(audList.map((i) => [i.value, i]));
      const conMap = new Map(conList.map((i) => [i.value, i]));
      const allKeys = Array.from(new Set([...audMap.keys(), ...conMap.keys()]));

      const rows = allKeys.map((val) => {
        const a = audMap.get(val);
        const c = conMap.get(val);
        const audPct = a ? a.percentage : 0;
        const conPct = c ? c.percentage : 0;
        const diff = Math.round((conPct - audPct) * 10) / 10;
        return {
          category: cat,
          value: val,
          audiencePct: audPct,
          audienceDisplay: a ? a.display : 'Not in top list',
          inAudience: Boolean(a),
          contentPct: conPct,
          contentDisplay: c ? c.display : 'Not in top list',
          inContent: Boolean(c),
          diff,
          absDiff: Math.abs(diff),
        };
      });

      comparisons[cat] = rows;
      for (const r of rows) {
        if (r.absDiff >= 2) {
          let description = '';
          if (r.inContent && !r.inAudience) {
            description = `Your posts reach ${r.value} (${r.contentDisplay} of content viewers in ${cat}), which isn't in your top follower ${cat.toLowerCase()} list.`;
          } else if (r.inAudience && !r.inContent) {
            description = `${r.value} makes up ${r.audienceDisplay} of your followers in ${cat}, but doesn't appear in your top content viewer list.`;
          } else if (r.diff > 0) {
            description = `${r.value} (${cat}) sees a larger share of your content (${r.contentDisplay}) than their share of your follower base (${r.audienceDisplay}, +${formatDec(r.diff, 1)} pp).`;
          } else {
            description = `${r.value} (${cat}) makes up ${r.audienceDisplay} of your followers, but only ${r.contentDisplay} of the people seeing your content (${formatDec(r.diff, 1)} pp).`;
          }
          allGaps.push({ ...r, description });
        }
      }
    }

    allGaps.sort((a, b) => b.absDiff - a.absDiff);

    return {
      present: true,
      comparisons,
      topGaps: allGaps.slice(0, 3),
      allGaps,
    };
  }

  function calculateHealthScore(parsed, followerGrowth, postsAnalysis, contentVsAudience) {
    const cfg = CONFIG.HEALTH_SCORE;
    const components = [];
    const missingComponents = [];

    // 1. Growth momentum (25 pts): CMGR over last 3 full months (or period growth fallback)
    const growthVal =
      followerGrowth.cmgrLast3FullMonths !== null
        ? followerGrowth.cmgrLast3FullMonths
        : followerGrowth.cmgrAllFullMonths !== null
        ? followerGrowth.cmgrAllFullMonths
        : followerGrowth.totalDays > 0 && followerGrowth.estimatedStartFollowers > 0
        ? ((followerGrowth.dailyAverage * 30.4375) / followerGrowth.estimatedStartFollowers) * 100
        : null;

    if (growthVal !== null) {
      const ratio = interpolateBand(growthVal, cfg.bands.growthMomentum);
      components.push({
        id: 'growthMomentum',
        name: 'Growth momentum',
        maxPoints: cfg.weights.growthMomentum,
        rawPoints: ratio * cfg.weights.growthMomentum,
        metricDisplay: `${formatPct(growthVal, 1)} compound monthly follower growth`,
        tip:
          growthVal < 3
            ? 'Publish one practical tool, checklist or opinionated industry post per week and connect with people who comment.'
            : 'Keep building on your strongest post theme to sustain compounding monthly gains.',
      });
    } else {
      missingComponents.push('Growth momentum');
    }

    // 2. Engagement rate (25 pts): overall engagements / impressions
    const totalImp =
      parsed.discovery && parsed.discovery.impressions !== null
        ? parsed.discovery.impressions
        : sum(((parsed.engagement && parsed.engagement.daily) || []).map((d) => d.impressions));
    const totalEng = sum(((parsed.engagement && parsed.engagement.daily) || []).map((d) => d.engagements));

    if (totalImp > 0) {
      const erPct = (totalEng / totalImp) * 100;
      const ratio = interpolateBand(erPct, cfg.bands.engagementRate);
      components.push({
        id: 'engagementRate',
        name: 'Engagement rate',
        maxPoints: cfg.weights.engagementRate,
        rawPoints: ratio * cfg.weights.engagementRate,
        metricDisplay: `${formatPct(erPct, 2)} overall (${formatInt(totalEng)} engagements / ${formatInt(totalImp)} impressions)`,
        tip:
          erPct < 2.5
            ? 'Shift mix from passive link roundups toward posts with a concrete demo, example or clear point of view.'
            : 'Reply to early comments with a follow-up question to keep strong engagement rates compounding.',
      });
    } else {
      missingComponents.push('Engagement rate');
    }

    // 3. Consistency (20 pts): share of weeks with at least one post in TOP POSTS or MOST RECENT POSTS, minus gap penalty
    const dailySeries =
      (parsed.engagement && parsed.engagement.daily.length > 0
        ? parsed.engagement.daily
        : parsed.followers && parsed.followers.daily) || [];
    const allKnownPosts = [
      ...((postsAnalysis && postsAnalysis.allPosts) || []),
      ...((postsAnalysis && postsAnalysis.recentPosts) || []),
    ];

    if (dailySeries.length >= 7 && allKnownPosts.length > 0) {
      const allWeeks = new Set(dailySeries.map((d) => getIsoWeekKey(d.date)).filter(Boolean));
      const activeWeeks = new Set(
        allKnownPosts.map((p) => (p.publishDate ? getIsoWeekKey(p.publishDate) : '')).filter((w) => allWeeks.has(w))
      );
      const totalWeeksCount = Math.max(1, allWeeks.size);
      const activeSharePct = (activeWeeks.size / totalWeeksCount) * 100;

      // Check longest gap in days between known posts
      const postTimestamps = Array.from(
        new Set(allKnownPosts.map((p) => p.timestamp).filter((t) => typeof t === 'number'))
      ).sort((a, b) => a - b);
      let maxGapDays = 0;
      for (let i = 1; i < postTimestamps.length; i++) {
        const gap = Math.round((postTimestamps[i] - postTimestamps[i - 1]) / 86400000);
        if (gap > maxGapDays) maxGapDays = gap;
      }
      const gapPenaltyPct = maxGapDays > 28 ? Math.min(20, (maxGapDays - 21) * 0.4) : 0;
      const effectiveConsistencyVal = Math.max(0, activeSharePct - gapPenaltyPct);
      const ratio = interpolateBand(effectiveConsistencyVal, cfg.bands.consistency);

      components.push({
        id: 'consistency',
        name: 'Consistency',
        maxPoints: cfg.weights.consistency,
        rawPoints: ratio * cfg.weights.consistency,
        metricDisplay: `${activeWeeks.size} of ${totalWeeksCount} weeks (${formatPct(activeSharePct, 0)}) had a Top 50 or Recent post`,
        tip:
          activeSharePct < 50
            ? 'Aim for at least 1 to 2 strong posts every week so you avoid long silent stretches in the feed.'
            : 'Keep your weekly cadence steady; note that LinkedIn only exports up to 50 top posts plus recent posts.',
      });
    } else {
      missingComponents.push('Consistency');
    }

    // 4. Audience fit (15 pts): overlap between AUDIENCE and CONTENT demographics for Industry and Seniority
    if (contentVsAudience && contentVsAudience.present) {
      const calcOverlap = (cat) => {
        const rows = contentVsAudience.comparisons[cat] || [];
        if (rows.length === 0) return null;
        const audSum = sum(rows.map((r) => r.audiencePct));
        const conSum = sum(rows.map((r) => r.contentPct));
        if (audSum === 0 || conSum === 0) return null;
        let overlap = 0;
        for (const r of rows) {
          const normAud = (r.audiencePct / audSum) * 100;
          const normCon = (r.contentPct / conSum) * 100;
          overlap += Math.min(normAud, normCon);
        }
        return overlap;
      };
      const indOverlap = calcOverlap('Industry');
      const senOverlap = calcOverlap('Seniority');
      const validOverlaps = [indOverlap, senOverlap].filter((v) => v !== null);
      if (validOverlaps.length > 0) {
        const fitPct = average(validOverlaps);
        const ratio = interpolateBand(fitPct, cfg.bands.audienceFit);
        components.push({
          id: 'audienceFit',
          name: 'Audience fit',
          maxPoints: cfg.weights.audienceFit,
          rawPoints: ratio * cfg.weights.audienceFit,
          metricDisplay: `${formatPct(fitPct, 0)} alignment between follower and viewer industry/seniority`,
          tip:
            fitPct < 65
              ? 'Use concrete examples from your core industry so your reach lands with the people most likely to follow you.'
              : 'Your content is reaching the exact industry and seniority mix that follows you.',
        });
      } else {
        missingComponents.push('Audience fit');
      }
    } else {
      missingComponents.push('Audience fit');
    }

    // 5. Reach beyond your network (15 pts): average out-of-network impressions % from MOST RECENT POSTS
    const recentWithOutNet = ((postsAnalysis && postsAnalysis.recentPosts) || []).filter(
      (p) => p.outOfNetworkPct !== null && p.outOfNetworkPct !== undefined
    );
    if (recentWithOutNet.length > 0) {
      const avgOutNetPct = average(recentWithOutNet.map((p) => p.outOfNetworkPct));
      const ratio = interpolateBand(avgOutNetPct, cfg.bands.outOfNetworkReach);
      components.push({
        id: 'outOfNetworkReach',
        name: 'Reach beyond your network',
        maxPoints: cfg.weights.outOfNetworkReach,
        rawPoints: ratio * cfg.weights.outOfNetworkReach,
        metricDisplay: `${formatPct(avgOutNetPct, 1)} average out-of-network impressions across ${recentWithOutNet.length} recent post${recentWithOutNet.length === 1 ? '' : 's'}`,
        tip:
          avgOutNetPct < 25
            ? 'Publish saveable tools, checklists or contrarian industry breakdowns that 1st-degree connections repost to their own networks.'
            : 'Strong out-of-network discovery; make sure your profile headline clearly tells new visitors why to follow.',
      });
    } else {
      missingComponents.push('Reach beyond your network');
    }

    // Scale available components to 100
    const availableMax = sum(components.map((c) => c.maxPoints));
    const scaleFactor = availableMax > 0 ? 100 / availableMax : 0;

    const scaledComponents = components.map((c) => {
      const scaledMax = Math.round(c.maxPoints * scaleFactor * 10) / 10;
      const scaledScore = Math.round(c.rawPoints * scaleFactor * 10) / 10;
      return {
        ...c,
        scaledMaxPoints: scaledMax,
        score: scaledScore,
      };
    });

    const overallScore = Math.min(
      100,
      Math.max(0, Math.round(sum(scaledComponents.map((c) => c.rawPoints)) * scaleFactor))
    );

    const bandObj =
      cfg.labels.find((b) => overallScore >= b.min && overallScore <= b.max) ||
      cfg.labels[cfg.labels.length - 1];

    return {
      score: overallScore,
      label: bandObj.label,
      colour: bandObj.colour,
      components: scaledComponents,
      missingComponents,
      scalingNote:
        missingComponents.length > 0
          ? `Left out ${missingComponents.join(', ')} due to missing data in this export, and scaled the remaining components to 100.`
          : null,
      disclaimer: "This is johnb.io's own rule-based score, not an official LinkedIn metric or industry benchmark.",
    };
  }

  function buildRecommendations(analysis) {
    const recs = [];
    const postsAnalysis = analysis.postsAnalysis;
    const audience = analysis.audience;
    const bestDays = analysis.bestDays;
    const reachTrend = analysis.reachAndEngagementTrend;

    const totalTopPosts = (postsAnalysis && postsAnalysis.totalUniqueTopPosts) || 0;
    const getConfidence = (n) => (n >= 10 ? 'High' : n >= 5 ? 'Medium' : 'Low');

    // 1. More of your best themes, less of your weakest
    if (postsAnalysis && postsAnalysis.bestTheme) {
      const best = postsAnalysis.bestTheme;
      const weak = postsAnalysis.weakestTheme;
      const conf = getConfidence(best.postCount);
      const comparisonText =
        weak && weak.theme !== best.theme
          ? `Your '${best.theme}' posts get a median of ${formatDec(best.medianEngagements, 0)} engagements (average ${formatInt(best.avgImpressions)} impressions across ${best.postCount} posts), compared with a median of ${formatDec(weak.medianEngagements, 0)} for '${weak.theme}' (${weak.postCount} posts, ${formatPct(weak.shareOfPostsPct, 0)} of your top posts).`
          : `Your '${best.theme}' posts lead your account with a median of ${formatDec(best.medianEngagements, 0)} engagements across ${best.postCount} posts.`;

      recs.push({
        id: 'themes',
        title:
          weak && weak.theme !== best.theme && weak.shareOfPostsPct >= 25
            ? `Shift effort from '${weak.theme}' into '${best.theme}'`
            : `Double down on '${best.theme}'`,
        confidence: conf,
        sampleSizeText: `${best.postCount} posts in best theme`,
        evidence: comparisonText,
        ideas: [
          `Turn your next ${weak ? weak.theme.toLowerCase() : 'update'} into a '${best.theme}' post with a concrete artefact people can try or save.`,
          `Break one large project into 3 separate posts: the problem you spotted, how you built or solved it, and what the numbers showed.`,
          `Revisit your highest-performing '${best.theme}' post (${postsAnalysis.top10ByEngagements[0] ? "'" + postsAnalysis.top10ByEngagements[0].title.slice(0, 45) + "...'" : 'your top post'}) with a Part 2 update.`,
        ],
      });
    }

    // 2. Lean into your top industry
    if (audience && audience.topIndustry) {
      const topInd = audience.topIndustry;
      const angles =
        CONFIG.INDUSTRY_POST_ANGLES[topInd.value] || CONFIG.INDUSTRY_POST_ANGLES.default;
      const breakoutNote =
        postsAnalysis && postsAnalysis.breakoutPost
          ? ` Your #1 breakout post (${formatInt(postsAnalysis.breakoutPost.post.engagements)} engagements, ${postsAnalysis.breakoutPost.multiplier}x your #2 post) also connected strongly with this audience.`
          : '';

      recs.push({
        id: 'industry',
        title: `Anchor your examples in ${topInd.value}`,
        confidence: topInd.percentage >= 15 ? 'High' : 'Medium',
        sampleSizeText: `${topInd.display} of followers in top industry`,
        evidence: `${topInd.value} is your single largest follower sector at ${topInd.display}.${breakoutNote}`,
        ideas: angles.slice(0, 3),
      });
    }

    // 3. Match your seniority mix
    if (audience && audience.present && audience.seniorSharePct > 0) {
      const isSeniorHeavy = audience.seniorSharePct >= 45;
      recs.push({
        id: 'seniority',
        title: isSeniorHeavy
          ? 'Write for decision-makers: strategy, ROI and lessons learned'
          : 'Focus on hands-on how-tos, tools and career building blocks',
        confidence: 'High',
        sampleSizeText: `${formatPct(audience.seniorSharePct, 0)} senior-level vs ${formatPct(audience.entrySharePct, 0)} entry-level`,
        evidence: `${formatPct(audience.seniorSharePct, 0)} of your followers are Senior, Director, VP, CXO, Owner or Partner level, while ${formatPct(audience.entrySharePct, 0)} are entry or training level.`,
        ideas: isSeniorHeavy
          ? [
              'Share an honest teardown of what worked and what did not in a real project, including the trade-offs.',
              'Frame technical or regulatory topics around commercial impact, risk reduction and team time saved.',
              'Write a short decision framework for choosing between two popular tools or approaches.',
            ]
          : [
              'Publish step-by-step walkthroughs with screenshots or starter templates people can copy.',
              'Share the exact learning resources, courses or projects that helped you level up.',
              'Post a clear glossary or plain-English explainer for common jargon in your field.',
            ],
      });
    }

    // 4. Match company size
    if (audience && audience.present && (audience.smallCompanySharePct > 0 || audience.largeCompanySharePct > 0)) {
      const smallHeavy = audience.smallCompanySharePct >= audience.largeCompanySharePct;
      recs.push({
        id: 'companySize',
        title: smallHeavy
          ? 'Include practical "do this yourself" workflows for lean teams'
          : 'Cover governance, scale and enterprise adoption',
        confidence: 'Medium',
        sampleSizeText: `${formatPct(audience.smallCompanySharePct, 0)} small co vs ${formatPct(audience.largeCompanySharePct, 0)} 1,000+ staff`,
        evidence: `${formatPct(audience.smallCompanySharePct, 0)} of your followers work at companies of 1 to 50 people, and ${formatPct(audience.largeCompanySharePct, 0)} work at organisations with over 1,000 employees.`,
        ideas: smallHeavy
          ? [
              'Show how a solo builder or small team can automate a task for free without enterprise software.',
              'Share lightweight templates and browser tools that work immediately with zero setup.',
              'Explain how large-company rules or technologies apply to founders and small operators.',
            ]
          : [
              'Discuss how to roll out a new workflow across multiple teams without breaking compliance.',
              'Share a practical governance or risk checklist that managers can bring to stakeholder meetings.',
              'Compare enterprise vs self-hosted options for a tool in your domain.',
            ],
      });
    }

    // 5. Location
    if (audience && audience.categories && (audience.categories.Location || []).length > 0) {
      const locs = audience.categories.Location;
      const top1 = locs[0];
      const top2 = locs[1];
      const combinedTop2 = (top1 ? top1.percentage : 0) + (top2 ? top2.percentage : 0);
      if (top1 && top1.percentage >= 8) {
        const locNames = top2 && top2.percentage >= 5 ? `${top1.value} and ${top2.value}` : top1.value;
        recs.push({
          id: 'location',
          title: `Turn ${locNames} events and local tech news into takeaway posts`,
          confidence: combinedTop2 >= 25 ? 'High' : 'Medium',
          sampleSizeText: `${formatPct(combinedTop2, 0)} in top 2 locations`,
          evidence: `${top1.value} (${top1.display})${top2 ? ` and ${top2.value} (${top2.display})` : ''} account for ${formatPct(combinedTop2, 0)} of your followers.`,
          ideas: [
            `When you attend a meetup, festival or hackathon in ${top1.value.replace(/ Area.*$/i, '')}, post the 3 sharpest insights you heard rather than just an attendance photo.`,
            'Tag 2 or 3 local speakers, organisers or builders when sharing what you learned from their session.',
            'Highlight local hiring, regulation or sector milestones with a takeaway that still helps followers elsewhere.',
          ],
        });
      }
    }

    // 6. Best days
    if (bestDays && bestDays.present && bestDays.bestImpressionDay) {
      const impDay = bestDays.bestImpressionDay;
      const folDay = bestDays.bestFollowerDay;
      const postDay = bestDays.bestTopPostDay;
      const dayConf = postDay && postDay.topPostCount >= 8 ? 'High' : totalTopPosts >= 15 ? 'Medium' : 'Low';
      const confoundNote =
        bestDays.themeConfoundNotes.length > 0 ? ` Note: ${bestDays.themeConfoundNotes[0]}` : '';

      recs.push({
        id: 'days',
        title: `Publish your flagship posts on ${postDay ? postDay.weekday : impDay.weekday}${folDay && folDay.weekday !== (postDay ? postDay.weekday : impDay.weekday) ? ` and ${folDay.weekday}` : ''}`,
        confidence: dayConf,
        sampleSizeText: `${(analysis.dateRange && analysis.dateRange.totalDays) || 0} days analysed`,
        evidence: `Daily impressions peak on ${impDay.weekday} (${formatInt(impDay.avgImpressions)}/day)${folDay ? `, while new followers peak on ${folDay.weekday} (${formatDec(folDay.avgNewFollowers, 1)}/day)` : ''}.${postDay ? ` Among your Top Posts, ${postDay.weekday} has the highest median engagements (${formatDec(postDay.medianPostEngagements, 0)} across ${postDay.topPostCount} posts).` : ''}${confoundNote}`,
        ideas: [
          `Schedule your highest-effort '${(postsAnalysis.bestTheme && postsAnalysis.bestTheme.theme) || 'Built a tool / project'}' post for ${postDay ? postDay.weekday : impDay.weekday}.`,
          `Use ${folDay ? folDay.weekday : 'mid-week'} for posts that introduce who you are, what you build or an interactive resource that converts profile visitors.`,
          'Test your weaker theme on your strongest reach day once or twice to check whether the day or the topic is doing the heavy lifting.',
        ],
      });
    }

    // 7. Where followers come from (correlation)
    if (reachTrend && reachTrend.correlation && reachTrend.correlation.hasEnoughDays) {
      const corr = reachTrend.correlation;
      if (corr.bestR !== null && corr.bestR < 0.35) {
        recs.push({
          id: 'followerSources',
          title: 'Pair posting with profile, event and community outreach',
          confidence: corr.pairedDays >= 90 ? 'High' : 'Medium',
          sampleSizeText: `${corr.pairedDays} days of paired data`,
          evidence: `Your daily impressions-to-followers correlation is ${formatDec(corr.sameDayR, 2)} (same day) and ${formatDec(corr.lag1DayR, 2)} (next day). A weak correlation shows that many followers find you via connection requests, events, comments and profile visits rather than viral post reach alone.`,
          ideas: [
            'Pin your best interactive tool or flagship post in your Featured section so profile visitors convert into followers.',
            'Leave 3 substantive, expert comments a week on posts by peers in your top industry.',
            'Follow up after meetups, courses or hackathons within 24 hours while people are checking your profile.',
          ],
        });
      }
    }

    // Suggested weekly rhythm
    const primaryBestTheme =
      (postsAnalysis && postsAnalysis.bestTheme && postsAnalysis.bestTheme.theme) ||
      'Built a tool / project';
    const secondaryTheme =
      (postsAnalysis &&
        postsAnalysis.themeStats.find((t) => t.theme !== primaryBestTheme && t.postCount >= 2)?.theme) ||
      'Explainer / opinion';
    const bestFolWeekday = (bestDays && bestDays.bestFollowerDay && bestDays.bestFollowerDay.weekday) || 'Monday';
    const bestImpWeekday = (bestDays && bestDays.bestImpressionDay && bestDays.bestImpressionDay.weekday) || 'Thursday';

    const weeklyRhythm = [
      {
        days: `${bestFolWeekday} / Tuesday`,
        focus: primaryBestTheme,
        detail: `Lead the week with your strongest format ('${primaryBestTheme}') aimed at ${(audience && audience.topIndustry && audience.topIndustry.value) || 'your core industry'}.`,
      },
      {
        days: `Wednesday / ${bestImpWeekday === bestFolWeekday ? 'Thursday' : bestImpWeekday}`,
        focus: secondaryTheme,
        detail: `Share a practical '${secondaryTheme}' breakdown or lesson learned written for senior peers (${formatPct((audience && audience.seniorSharePct) || 50, 0)} of your audience).`,
      },
      {
        days: 'Friday',
        focus: 'Selective curate + community',
        detail: 'Instead of a generic news list, share one opinionated takeaway from the week plus 15 minutes commenting on peer posts.',
      },
    ];

    return {
      items: recs,
      weeklyRhythm,
    };
  }

  function buildTop5Takeaways(analysis) {
    const takeaways = [];
    const fg = analysis.followerGrowth;
    const h = analysis.headline;
    const pa = analysis.postsAnalysis;
    const ct = analysis.creatorType;
    const bd = analysis.bestDays;
    const aud = analysis.audience;
    const rt = analysis.reachAndEngagementTrend;

    // 1. Follower growth & momentum
    if (fg && fg.totalFollowersNow !== null) {
      const startEst = fg.estimatedStartFollowers !== null ? formatInt(fg.estimatedStartFollowers) : 'unknown';
      const pctStr = fg.periodGrowthPct !== null ? ` (+${formatPct(fg.periodGrowthPct, 1)})` : '';
      const cmgrStr =
        fg.cmgrLast3FullMonths !== null
          ? `, compounding at ${formatPct(fg.cmgrLast3FullMonths, 1)} per month over the last 3 full months`
          : '';
      takeaways.push(
        `You gained ${formatInt(fg.netGained)} new followers to reach ${formatInt(fg.totalFollowersNow)} from an estimated starting base of ${startEst}${pctStr}${cmgrStr}.`
      );
    }

    // 2. Creator type / hidden strength / theme performance
    if (ct && !ct.isExplorer && ct.hasHiddenStrengthMismatch) {
      takeaways.push(
        `You post most often like ${ct.primaryType.name} (${ct.primaryThemeStats.postCount} '${ct.primaryThemeStats.theme}' posts, median ${formatDec(ct.primaryThemeStats.medianEngagements, 0)} engagements), but your audience rewards ${ct.hiddenStrengthType.name} ('${ct.hiddenStrengthStats.theme}' gets a median of ${formatDec(ct.hiddenStrengthStats.medianEngagements, 0)} engagements across ${ct.hiddenStrengthStats.postCount} posts).`
      );
    } else if (pa && pa.bestTheme) {
      takeaways.push(
        `Your strongest content theme is '${pa.bestTheme.theme}', earning a median of ${formatDec(pa.bestTheme.medianEngagements, 0)} engagements and an average of ${formatInt(pa.bestTheme.avgImpressions)} impressions across ${pa.bestTheme.postCount} posts.`
      );
    }

    // 3. Breakout post or overall engagement rate
    if (pa && pa.breakoutPost) {
      const bp = pa.breakoutPost;
      takeaways.push(
        `Your #1 post ('${bp.post.title.slice(0, 55)}', ${bp.post.publishDateDisplay}) generated ${formatInt(bp.post.engagements)} engagements and ${formatInt(bp.post.impressions)} impressions, which is ${bp.multiplier}x your next best post (${formatInt(bp.secondBest.engagements)} engagements).`
      );
    } else if (h && h.totalImpressions > 0) {
      takeaways.push(
        `Your content generated ${formatInt(h.totalImpressions)} impressions and ${formatInt(h.totalEngagements)} engagements across ${formatInt(h.membersReached || 0)} members reached (${formatPct(h.overallEngagementRate, 2)} overall engagement rate).`
      );
    }

    // 4. Audience profile
    if (aud && aud.present && aud.topIndustry) {
      takeaways.push(
        `${formatPct(aud.seniorSharePct, 0)} of your followers are senior decision-makers, led by ${aud.topIndustry.value} (${aud.topIndustry.display})${aud.topLocation ? ` and concentrated in ${aud.topLocation.value} (${aud.topLocation.display})` : ''}.`
      );
    }

    // 5. Best days & correlation insight
    if (bd && bd.bestFollowerDay && bd.bestImpressionDay) {
      const corrText =
        rt && rt.correlation && rt.correlation.hasEnoughDays
          ? ` Daily impressions and new followers have a ${rt.correlation.strength.toLowerCase()} (r = ${formatDec(rt.correlation.sameDayR, 2)}).`
          : '';
      takeaways.push(
        `New followers peak on ${bd.bestFollowerDay.weekday} (${formatDec(bd.bestFollowerDay.avgNewFollowers, 1)}/day) while impressions peak on ${bd.bestImpressionDay.weekday} (${formatInt(bd.bestImpressionDay.avgImpressions)}/day).${corrText}`
      );
    }

    return takeaways.slice(0, 5).map(sanitizeCopy);
  }

  function analyseExport(parsed, options = {}) {
    if (!parsed || !parsed.isValidLinkedInExport) {
      return {
        isValidLinkedInExport: false,
        error: (parsed && parsed.error) || 'Invalid LinkedIn export data.',
      };
    }

    const themeOverrides = options.themeOverrides || {};
    const customProjectionRate = options.projectionRatePct;

    const followerGrowth = analyseFollowerGrowth(parsed);
    const totalImpressions =
      parsed.discovery && parsed.discovery.impressions !== null
        ? parsed.discovery.impressions
        : sum(((parsed.engagement && parsed.engagement.daily) || []).map((d) => d.impressions));
    const membersReached =
      parsed.discovery && parsed.discovery.membersReached !== null
        ? parsed.discovery.membersReached
        : null;
    const totalEngagements = sum(
      ((parsed.engagement && parsed.engagement.daily) || []).map((d) => d.engagements)
    );
    const overallEngagementRate =
      totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0;

    const headline = {
      followersNow: followerGrowth.totalFollowersNow,
      estimatedStartFollowers: followerGrowth.estimatedStartFollowers,
      netGained: followerGrowth.netGained,
      periodGrowthPct: followerGrowth.periodGrowthPct,
      totalImpressions,
      membersReached,
      totalEngagements,
      overallEngagementRate,
    };

    const projections = buildProjections(followerGrowth, parsed.endDate, customProjectionRate);
    const postsAnalysis = analysePosts(parsed, themeOverrides);
    const creatorType = analyseCreatorType(postsAnalysis);
    const bestDays = analyseBestDays(parsed, postsAnalysis);
    const reachAndEngagementTrend = analyseReachAndEngagementTrend(parsed, followerGrowth);
    const audience = analyseAudienceDemographics(parsed);
    const contentVsAudience = analyseContentVsAudience(parsed);
    const healthScore = calculateHealthScore(
      parsed,
      followerGrowth,
      postsAnalysis,
      contentVsAudience
    );

    const analysis = {
      isValidLinkedInExport: true,
      dateRange: {
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        startDateDisplay: parsed.startDate ? formatUkDateShort(parsed.startDate) : 'Unknown',
        endDateDisplay: parsed.endDate ? formatUkDateShort(parsed.endDate) : 'Unknown',
        totalDays:
          followerGrowth.totalDays ||
          ((parsed.engagement && parsed.engagement.daily.length) || 0),
      },
      warnings: parsed.warnings || [],
      headline,
      healthScore,
      creatorType,
      followerGrowth,
      projections,
      postsAnalysis,
      bestDays,
      reachAndEngagementTrend,
      audience,
      contentVsAudience,
      dataNotes: [
        'Your file never leaves your browser. All parsing and calculations run locally in JavaScript.',
        'LinkedIn only exports daily new followers, not unfollows. Starting follower totals and historical monthly totals worked backwards from today are estimates.',
        'The Top Posts sheet holds at most 50 posts (one list by engagements, one by impressions). Engagement rate is only shown for posts that appear in both lists.',
        'LinkedIn exports do not include posting times, post body copy, or posts outside the Top 50 and Most Recent Posts lists.',
        'Audience and Content Demographics are top-N lists, so their percentages do not add up to 100%. Entries marked "< 1%" are treated as 0.5% for sorting and maths.',
      ],
    };

    analysis.recommendations = buildRecommendations(analysis);
    analysis.top5Takeaways = buildTop5Takeaways(analysis);
    analysis.defaultGoalPlan = planGoal(
      analysis,
      projections.nextMilestone,
      (() => {
        const endRec = parseDateValue(parsed.endDate) || parseDateValue('2026-11-06');
        const dt = new Date(Date.UTC(endRec.year, endRec.month - 1 + 6, endRec.day));
        return dt.toISOString().slice(0, 10);
      })()
    );

    return analysis;
  }

  // ── BEFORE & AFTER COMPARISON ──────────────────────────────────────────────
  function compareExports(parsedA, parsedB, options = {}) {
    const analysisA = parsedA.headline ? parsedA : analyseExport(parsedA, options);
    const analysisB = parsedB.headline ? parsedB : analyseExport(parsedB, options);

    if (!analysisA.isValidLinkedInExport || !analysisB.isValidLinkedInExport) {
      return { valid: false, error: 'Both files must be valid LinkedIn analytics exports to compare.' };
    }

    const endA = parseDateValue(analysisA.dateRange.endDate);
    const endB = parseDateValue(analysisB.dateRange.endDate);
    const startA = parseDateValue(analysisA.dateRange.startDate);
    const startB = parseDateValue(analysisB.dateRange.startDate);

    // Detect which file is older ("Before") and which is newer ("After")
    let before = analysisA;
    let after = analysisB;
    let beforeOrderIndex = 0;
    if (endA && endB) {
      if (endA.timestamp > endB.timestamp) {
        before = analysisB;
        after = analysisA;
        beforeOrderIndex = 1;
      } else if (endA.timestamp === endB.timestamp && startA && startB && startA.timestamp > startB.timestamp) {
        before = analysisB;
        after = analysisA;
        beforeOrderIndex = 1;
      }
    }

    const beforeStart = parseDateValue(before.dateRange.startDate);
    const beforeEnd = parseDateValue(before.dateRange.endDate);
    const afterStart = parseDateValue(after.dateRange.startDate);
    const afterEnd = parseDateValue(after.dateRange.endDate);

    const isOverlapping =
      beforeEnd && afterStart ? afterStart.timestamp <= beforeEnd.timestamp : false;

    const overlapDays =
      isOverlapping && beforeEnd && afterStart
        ? Math.max(0, Math.round((beforeEnd.timestamp - afterStart.timestamp) / 86400000) + 1)
        : 0;

    // Non-overlapping months in After (months strictly after beforeEnd's monthKey)
    const beforeLastMonthKey = beforeEnd ? beforeEnd.monthKey : '';
    const nonOverlappingAfterMonths = (after.followerGrowth.monthly || []).filter(
      (m) => m.monthKey > beforeLastMonthKey
    );

    const followersBefore = before.headline.followersNow || 0;
    const followersAfter = after.headline.followersNow || 0;
    const followersDelta = followersAfter - followersBefore;
    const followersDeltaPct =
      followersBefore > 0 ? (followersDelta / followersBefore) * 100 : null;

    const growthRateBefore =
      before.followerGrowth.cmgrLast3FullMonths ?? before.followerGrowth.cmgrAllFullMonths ?? 0;
    const growthRateAfter =
      after.followerGrowth.cmgrLast3FullMonths ?? after.followerGrowth.cmgrAllFullMonths ?? 0;
    const growthRateDelta = growthRateAfter - growthRateBefore;

    const engRateBefore = before.headline.overallEngagementRate || 0;
    const engRateAfter = after.headline.overallEngagementRate || 0;
    const engRateDelta = engRateAfter - engRateBefore;

    const impPerMonthBefore =
      before.reachAndEngagementTrend.monthly.length > 0
        ? average(before.reachAndEngagementTrend.monthly.filter((m) => !m.isPartial).map((m) => m.impressions)) ||
          average(before.reachAndEngagementTrend.monthly.map((m) => m.impressions))
        : 0;
    const impPerMonthAfter =
      after.reachAndEngagementTrend.monthly.length > 0
        ? average(after.reachAndEngagementTrend.monthly.filter((m) => !m.isPartial).map((m) => m.impressions)) ||
          average(after.reachAndEngagementTrend.monthly.map((m) => m.impressions))
        : 0;
    const impPerMonthDelta = impPerMonthAfter - impPerMonthBefore;

    const healthBefore = before.healthScore.score;
    const healthAfter = after.healthScore.score;
    const healthDelta = healthAfter - healthBefore;

    // Component deltas
    const compBeforeMap = new Map(before.healthScore.components.map((c) => [c.id, c]));
    const componentDeltas = after.healthScore.components.map((cAfter) => {
      const cBefore = compBeforeMap.get(cAfter.id);
      return {
        id: cAfter.id,
        name: cAfter.name,
        beforeScore: cBefore ? cBefore.score : null,
        afterScore: cAfter.score,
        delta: cBefore ? Math.round((cAfter.score - cBefore.score) * 10) / 10 : null,
      };
    });

    const typeBefore = before.creatorType.primaryType.name;
    const typeAfter = after.creatorType.primaryType.name;
    const typeChanged = typeBefore !== typeAfter;
    const typeChangeSummary = typeChanged
      ? `Your creator type changed from ${typeBefore} to ${typeAfter}.`
      : `Your primary creator type remained ${typeAfter}.`;

    const bestThemeBefore = (before.postsAnalysis.bestTheme && before.postsAnalysis.bestTheme.theme) || 'None';
    const bestThemeAfter = (after.postsAnalysis.bestTheme && after.postsAnalysis.bestTheme.theme) || 'None';
    const bestDayBefore = (before.bestDays.bestFollowerDay && before.bestDays.bestFollowerDay.weekday) || 'Unknown';
    const bestDayAfter = (after.bestDays.bestFollowerDay && after.bestDays.bestFollowerDay.weekday) || 'Unknown';

    // Audience percentage-point shifts
    const shiftCategories = ['Industry', 'Seniority', 'Location', 'Company size'];
    const audienceShifts = [];
    for (const cat of shiftCategories) {
      const listBefore = (before.audience.categories && before.audience.categories[cat]) || [];
      const listAfter = (after.audience.categories && after.audience.categories[cat]) || [];
      const mapBefore = new Map(listBefore.map((i) => [i.value, i.percentage]));
      const mapAfter = new Map(listAfter.map((i) => [i.value, i.percentage]));
      const keys = new Set([...mapBefore.keys(), ...mapAfter.keys()]);
      for (const k of keys) {
        const bVal = mapBefore.get(k) || 0;
        const aVal = mapAfter.get(k) || 0;
        const ppShift = Math.round((aVal - bVal) * 10) / 10;
        if (Math.abs(ppShift) >= 1) {
          audienceShifts.push({
            category: cat,
            value: k,
            beforePct: bVal,
            afterPct: aVal,
            ppShift,
            absShift: Math.abs(ppShift),
          });
        }
      }
    }
    audienceShifts.sort((a, b) => b.absShift - a.absShift);

    // Top posts that are new in the newer export's top list
    const beforeUrls = new Set(before.postsAnalysis.allPosts.map((p) => p.url));
    const newTopPosts = after.postsAnalysis.allPosts
      .filter((p) => !beforeUrls.has(p.url))
      .sort((a, b) => (b.engagements || 0) - (a.engagements || 0));

    const folSign = followersDelta >= 0 ? '+' : '';
    const erDir = engRateDelta >= 0 ? `up ${formatDec(engRateDelta, 1)} points` : `down ${formatDec(Math.abs(engRateDelta), 1)} points`;
    const hsDir = healthDelta >= 0 ? `up ${healthDelta}` : `down ${Math.abs(healthDelta)}`;
    const verdict = sanitizeCopy(
      `Since your last export: ${folSign}${formatInt(followersDelta)} followers, engagement rate ${erDir}, health score ${hsDir}.`
    );

    return {
      valid: true,
      beforeOrderIndex,
      beforeLabel: `${before.dateRange.startDateDisplay} to ${before.dateRange.endDateDisplay}`,
      afterLabel: `${after.dateRange.startDateDisplay} to ${after.dateRange.endDateDisplay}`,
      before,
      after,
      isOverlapping,
      overlapDays,
      overlapNote: isOverlapping
        ? `These two exports overlap by ${formatInt(overlapDays)} days. Follower totals are compared at each export date (${before.dateRange.endDateDisplay} vs ${after.dateRange.endDateDisplay}), alongside ${nonOverlappingAfterMonths.length} non-overlapping month${nonOverlappingAfterMonths.length === 1 ? '' : 's'} in the newer file.`
        : 'These two exports cover separate date ranges.',
      nonOverlappingAfterMonths,
      verdict,
      metrics: {
        followersBefore,
        followersAfter,
        followersDelta,
        followersDeltaPct,
        growthRateBefore,
        growthRateAfter,
        growthRateDelta,
        engRateBefore,
        engRateAfter,
        engRateDelta,
        impPerMonthBefore: Math.round(impPerMonthBefore),
        impPerMonthAfter: Math.round(impPerMonthAfter),
        impPerMonthDelta: Math.round(impPerMonthDelta),
        healthBefore,
        healthAfter,
        healthDelta,
      },
      componentDeltas,
      typeBefore,
      typeAfter,
      typeChanged,
      typeChangeSummary,
      bestThemeBefore,
      bestThemeAfter,
      bestDayBefore,
      bestDayAfter,
      audienceShifts: audienceShifts.slice(0, 8),
      newTopPosts: newTopPosts.slice(0, 10),
      totalNewTopPosts: newTopPosts.length,
    };
  }

  // ── MARKDOWN EXPORT FOR AI ASSISTANTS ──────────────────────────────────────
  function generateAiMarkdown(analysis, comparison = null, goalPlan = null) {
    const lines = [];
    const dr = analysis.dateRange;
    const h = analysis.headline;
    const hs = analysis.healthScore;
    const ct = analysis.creatorType;
    const fg = analysis.followerGrowth;
    const pa = analysis.postsAnalysis;
    const bd = analysis.bestDays;
    const rt = analysis.reachAndEngagementTrend;
    const aud = analysis.audience;
    const cva = analysis.contentVsAudience;
    const proj = analysis.projections;
    const recs = analysis.recommendations;

    lines.push(`# LinkedIn Creator Analytics Report (${dr.startDateDisplay} to ${dr.endDateDisplay})`);
    lines.push('');
    lines.push('## Instructions for AI Assistant');
    lines.push(
      `This file contains a LinkedIn creator's analytics for ${dr.startDateDisplay} to ${dr.endDateDisplay} (${dr.totalDays} days). Use it to answer questions about their audience and content performance, and to suggest and draft posts. Treat follower totals before ${dr.endDateDisplay} as estimates (LinkedIn does not export unfollows). Posting times are not available in LinkedIn exports. All theme labels reflect the user's current theme selections.`
    );
    lines.push('');

    lines.push('## 1. LinkedIn Health Score, Creator Type & Headline Numbers');
    lines.push(`- **LinkedIn Health Score**: ${hs.score}/100 (${hs.label}) - *${hs.disclaimer}*`);
    for (const c of hs.components) {
      lines.push(`  - **${c.name}**: ${formatDec(c.score, 1)}/${formatDec(c.scaledMaxPoints, 1)} (${c.metricDisplay}) - Tip: ${c.tip}`);
    }
    if (hs.scalingNote) {
      lines.push(`  - *Note*: ${hs.scalingNote}`);
    }
    lines.push(
      `- **Primary Creator Type**: **${ct.primaryType.name}** (${ct.primaryType.shortDescription})`
    );
    if (!ct.isExplorer && ct.hiddenStrengthType) {
      lines.push(`- **Hidden Strength**: **${ct.hiddenStrengthType.name}** - ${ct.hiddenStrengthCallout}`);
    }
    lines.push(`- **Followers on ${dr.endDateDisplay}**: ${formatInt(h.followersNow)}`);
    lines.push(`- **Estimated Starting Followers**: ${formatInt(h.estimatedStartFollowers)}`);
    lines.push(`- **Net New Followers Gained**: +${formatInt(h.netGained)} (${formatPct(h.periodGrowthPct, 1)})`);
    lines.push(`- **Total Impressions**: ${formatInt(h.totalImpressions)}`);
    lines.push(`- **Members Reached**: ${h.membersReached !== null ? formatInt(h.membersReached) : 'Not listed'}`);
    lines.push(`- **Total Engagements**: ${formatInt(h.totalEngagements)}`);
    lines.push(`- **Overall Engagement Rate**: ${formatPct(h.overallEngagementRate, 2)}`);
    lines.push('');

    lines.push('### Top 5 Takeaways');
    for (const t of analysis.top5Takeaways) {
      lines.push(`- ${t}`);
    }
    lines.push('');

    const activeGoal = goalPlan && goalPlan.valid ? goalPlan : analysis.defaultGoalPlan;
    if (activeGoal && activeGoal.valid) {
      lines.push('## 2. Goal Planner');
      lines.push(`- **Target Followers**: ${formatInt(activeGoal.targetFollowers)} by ${activeGoal.targetDateDisplay}`);
      lines.push(`- **Verdict**: ${activeGoal.verdictLabel}`);
      lines.push(`- **Compound Monthly Growth Needed**: ${formatPct(activeGoal.compoundMonthlyRatePct, 1)}/month`);
      lines.push(
        `- **Pace Needed**: ${formatDec(activeGoal.neededPerMonth, 0)}/month (${formatDec(activeGoal.neededPerWeek, 1)}/week, ${formatDec(activeGoal.neededPerDay, 1)}/day)`
      );
      lines.push(
        `- **Recent Baseline**: ${formatDec(activeGoal.recentAvgMonthlyGains, 0)}/month over last 3 full months (best full month: ${formatInt(activeGoal.bestMonthGains)})`
      );
      lines.push(`- **Estimated Date at Current Pace**: ${activeGoal.dateAtCurrentPace}`);
      lines.push('');
    }

    if (comparison && comparison.valid) {
      lines.push('## 3. Before and After Comparison');
      lines.push(`- **Before**: ${comparison.beforeLabel}`);
      lines.push(`- **After**: ${comparison.afterLabel}`);
      lines.push(`- **Verdict**: ${comparison.verdict}`);
      lines.push(`- **Overlap Note**: ${comparison.overlapNote}`);
      lines.push('');
      lines.push('| Metric | Before | After | Change |');
      lines.push('| :--- | :--- | :--- | :--- |');
      lines.push(
        `| Total Followers | ${formatInt(comparison.metrics.followersBefore)} | ${formatInt(comparison.metrics.followersAfter)} | ${comparison.metrics.followersDelta >= 0 ? '+' : ''}${formatInt(comparison.metrics.followersDelta)} |`
      );
      lines.push(
        `| Recent Monthly Growth % | ${formatPct(comparison.metrics.growthRateBefore, 1)} | ${formatPct(comparison.metrics.growthRateAfter, 1)} | ${comparison.metrics.growthRateDelta >= 0 ? '+' : ''}${formatDec(comparison.metrics.growthRateDelta, 1)} pp |`
      );
      lines.push(
        `| Overall Engagement Rate | ${formatPct(comparison.metrics.engRateBefore, 2)} | ${formatPct(comparison.metrics.engRateAfter, 2)} | ${comparison.metrics.engRateDelta >= 0 ? '+' : ''}${formatDec(comparison.metrics.engRateDelta, 2)} pp |`
      );
      lines.push(
        `| Avg Monthly Impressions | ${formatInt(comparison.metrics.impPerMonthBefore)} | ${formatInt(comparison.metrics.impPerMonthAfter)} | ${comparison.metrics.impPerMonthDelta >= 0 ? '+' : ''}${formatInt(comparison.metrics.impPerMonthDelta)} |`
      );
      lines.push(
        `| Health Score | ${comparison.metrics.healthBefore}/100 | ${comparison.metrics.healthAfter}/100 | ${comparison.metrics.healthDelta >= 0 ? '+' : ''}${comparison.metrics.healthDelta} |`
      );
      lines.push(`| Primary Creator Type | ${comparison.typeBefore} | ${comparison.typeAfter} | ${comparison.typeChanged ? 'Changed' : 'Unchanged'} |`);
      lines.push('');
    }

    lines.push('## 4. Monthly Follower Growth');
    lines.push(
      `- **CMGR (All Full Months)**: ${fg.cmgrAllFullMonths !== null ? formatPct(fg.cmgrAllFullMonths, 2) : 'N/A'}`
    );
    lines.push(
      `- **CMGR (Last 3 Full Months)**: ${fg.cmgrLast3FullMonths !== null ? formatPct(fg.cmgrLast3FullMonths, 2) : 'N/A'}`
    );
    if (fg.bestFullMonth) {
      lines.push(`- **Best Full Month**: ${fg.bestFullMonth.label} (+${formatInt(fg.bestFullMonth.newFollowers)} followers)`);
    }
    if (fg.worstFullMonth) {
      lines.push(`- **Worst Full Month**: ${fg.worstFullMonth.label} (+${formatInt(fg.worstFullMonth.newFollowers)} followers)`);
    }
    lines.push('');
    lines.push('| Month | New Followers | Est. Start Total | Est. End Total | MoM Growth % |');
    lines.push('| :--- | :--- | :--- | :--- | :--- |');
    for (const m of fg.monthly) {
      lines.push(
        `| ${m.label} | ${formatInt(m.newFollowers)} | ${formatInt(m.startFollowers)} | ${formatInt(m.endFollowers)} | ${m.growthPct !== null ? formatPct(m.growthPct, 1) : 'N/A'} |`
      );
    }
    lines.push('');

    lines.push('### Top 10 Days for New Followers');
    lines.push('| Date | Weekday | New Followers |');
    lines.push('| :--- | :--- | :--- |');
    for (const d of fg.top10Days) {
      lines.push(`| ${d.dateDisplay} | ${d.weekday} | ${formatInt(d.newFollowers)} |`);
    }
    lines.push('');

    lines.push('## 5. Monthly Reach & Engagement Trend');
    lines.push(`- **Correlation (Impressions vs New Followers)**: ${rt.correlation.strength} - ${rt.correlation.explanation}`);
    lines.push('');
    lines.push('| Month | Impressions | Engagements | Engagement Rate |');
    lines.push('| :--- | :--- | :--- | :--- |');
    for (const m of rt.monthly) {
      lines.push(
        `| ${m.label} | ${formatInt(m.impressions)} | ${formatInt(m.engagements)} | ${formatPct(m.engagementRate, 2)} |`
      );
    }
    lines.push('');

    lines.push('## 6. Day-of-Week Performance');
    lines.push('| Weekday | Avg Daily Impressions | Avg Daily Engagements | Avg New Followers | Top Posts Count | Median Top Post Engagements | Median Top Post Impressions |');
    lines.push('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
    for (const w of bd.weekdayStats) {
      lines.push(
        `| ${w.weekday} | ${formatDec(w.avgImpressions, 1)} | ${formatDec(w.avgEngagements, 1)} | ${formatDec(w.avgNewFollowers, 1)} | ${w.topPostCount} | ${w.medianPostEngagements !== null ? formatDec(w.medianPostEngagements, 0) : 'N/A'} | ${w.medianPostImpressions !== null ? formatInt(w.medianPostImpressions) : 'N/A'} |`
      );
    }
    lines.push('');

    lines.push('## 7. Theme Performance');
    lines.push('| Theme | Posts | Share of Posts | Median Engagements | Avg Engagements | Avg Impressions | Engagement Rate | Status |');
    lines.push('| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
    for (const t of pa.themeStats) {
      lines.push(
        `| ${t.theme} | ${t.postCount} | ${formatPct(t.shareOfPostsPct, 0)} | ${t.medianEngagements !== null ? formatDec(t.medianEngagements, 0) : 'N/A'} | ${t.avgEngagements !== null ? formatDec(t.avgEngagements, 1) : 'N/A'} | ${t.avgImpressions !== null ? formatInt(t.avgImpressions) : 'N/A'} | ${t.engagementRate !== null ? formatPct(t.engagementRate, 2) : 'N/A'} | ${t.statusNote} |`
      );
    }
    lines.push('');

    if (pa.hashtagStats.length > 0) {
      lines.push('### Hashtags from Slugs (3+ Posts)');
      lines.push('| Hashtag | Posts | Median Engagements | Avg Engagements | Avg Impressions |');
      lines.push('| :--- | :--- | :--- | :--- | :--- |');
      for (const hTag of pa.hashtagStats) {
        lines.push(
          `| ${hTag.hashtag} | ${hTag.postCount} | ${formatDec(hTag.medianEngagements, 0)} | ${formatDec(hTag.avgEngagements, 1)} | ${formatInt(hTag.avgImpressions)} |`
        );
      }
      lines.push('');
    }

    lines.push('## 8. All Top Posts');
    lines.push('| Publish Date | Title (from URL slug) | Theme | Engagements | Impressions | Engagement Rate | URL |');
    lines.push('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
    const sortedAllPosts = [...pa.allPosts].sort(
      (a, b) => (b.engagements || 0) - (a.engagements || 0) || (b.impressions || 0) - (a.impressions || 0)
    );
    for (const p of sortedAllPosts) {
      lines.push(
        `| ${p.publishDateDisplay} | ${p.title.replace(/\|/g, '/')} | ${p.theme} | ${p.engagements !== null ? formatInt(p.engagements) : 'Not in top 50'} | ${p.impressions !== null ? formatInt(p.impressions) : 'Not in top 50'} | ${p.engagementRate !== null ? formatPct(p.engagementRate, 2) : 'N/A'} | ${p.url} |`
      );
    }
    lines.push('');

    if (pa.recentPosts.length > 0) {
      lines.push('## 9. Most Recent Posts');
      lines.push('| Publish Date | Type | Title | Impressions | Out-of-Network % | Reactions | Comments | Reposts | Followers Gained | Watch Time | Top 50 Status |');
      lines.push('| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
      for (const rp of pa.recentPosts) {
        lines.push(
          `| ${rp.publishDateDisplay} | ${rp.postType} | ${rp.title.replace(/\|/g, '/')} | ${formatInt(rp.impressions)} | ${rp.outOfNetworkDisplay || 'N/A'} | ${formatInt(rp.reactions)} | ${formatInt(rp.comments)} | ${formatInt(rp.reposts)} | ${rp.followersGained !== null ? formatInt(rp.followersGained) : 'N/A'} | ${rp.watchTime || 'N/A'} | ${rp.top50ComparisonText} |`
        );
      }
      lines.push('');
    }

    lines.push('## 10. Audience vs Content Demographics');
    for (const cat of ['Industry', 'Seniority', 'Job title', 'Company size', 'Location', 'Company']) {
      const rows = (cva.comparisons && cva.comparisons[cat]) || [];
      if (rows.length === 0) continue;
      lines.push(`### ${cat}`);
      lines.push('| Segment | Followers % | Content Viewers % | Gap (pp) |');
      lines.push('| :--- | :--- | :--- | :--- |');
      for (const r of rows) {
        lines.push(
          `| ${r.value} | ${r.audienceDisplay} | ${r.contentDisplay} | ${r.diff >= 0 ? '+' : ''}${formatDec(r.diff, 1)} pp |`
        );
      }
      lines.push('');
    }

    lines.push('## 11. Milestone Projections');
    lines.push(
      `Based on ${formatPct(proj.chosenRatePct, 1)}/month compounding vs ${formatInt(proj.steadyMonthlyGain)}/month steady pace:`
    );
    lines.push('');
    lines.push('| Milestone | Compounding Est. Date | Steady Pace Est. Date | Monthly Gains Needed at Milestone |');
    lines.push('| :--- | :--- | :--- | :--- |');
    for (const m of proj.milestones) {
      lines.push(
        `| ${m.milestoneLabel} (${formatInt(m.milestone)}) | ${m.compoundDateLabel} | ${m.steadyDateLabel} | ${formatInt(m.monthlyNeededAtMilestone)}/month |`
      );
    }
    lines.push('');

    lines.push('## 12. Recommendations & Weekly Rhythm');
    for (const r of recs.items) {
      lines.push(`### ${r.title} (Confidence: ${r.confidence})`);
      lines.push(`- **Evidence**: ${r.evidence}`);
      for (const idea of r.ideas) {
        lines.push(`- **Post idea**: ${idea}`);
      }
      lines.push('');
    }
    lines.push('### Suggested Weekly Rhythm');
    for (const slot of recs.weeklyRhythm) {
      lines.push(`- **${slot.days} (${slot.focus})**: ${slot.detail}`);
    }
    lines.push('');

    lines.push('## 13. Suggested Questions to Ask Your AI Assistant Next');
    lines.push(
      `1. "Draft 3 LinkedIn posts in my best-performing theme ('${(pa.bestTheme && pa.bestTheme.theme) || 'Built a tool / project'}') aimed specifically at ${(aud.topIndustry && aud.topIndustry.value) || 'my top follower industry'}."`
    );
    lines.push(
      `2. "Look at my Top Posts table and tell me what opening hooks or topics separate my top 5 posts by engagement rate from my bottom 5."`
    );
    lines.push(
      `3. "My content reaches viewers in ${cva.topGaps[0] ? cva.topGaps[0].value : 'segments'} who aren't yet following me at the same rate. How should I adjust my posts or profile to convert them?"`
    );
    lines.push(
      `4. "Build me a 4-week content calendar using my suggested weekly rhythm so I can hit ${formatInt(proj.nextMilestone)} followers."`
    );
    lines.push(
      `5. "Rewrite one of my lower-performing '${(pa.weakestTheme && pa.weakestTheme.theme) || 'News roundup'}' posts so it reads like a high-performing '${(pa.bestTheme && pa.bestTheme.theme) || 'Built a tool / project'}' post for senior decision-makers."`
    );

    return sanitizeCopy(lines.join('\n'));
  }

  // ── SYNTHETIC DATASET GENERATOR (FOR DEMO BUTTON & AUTOMATED TESTS) ────────
  function generateSyntheticSheetsMap(variant = 'normal-365d') {
    // Deterministic PRNG so tests and demo are 100% reproducible
    let seed = 42;
    function rand() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    if (variant === 'empty-sheets') {
      return {
        DISCOVERY: [['Overall Performance', '10/1/2026 - 10/28/2026'], ['Impressions', '0'], ['Members reached', '0']],
        ENGAGEMENT: [['Date', 'Impressions', 'Engagements']],
        FOLLOWERS: [['Total followers on 10/28/2026', '420'], ['', ''], ['Date', 'New followers']],
        'TOP POSTS': [['Maximum of 50 posts available to include in this list'], [''], ['Post URL', 'Post Publish Date', 'Engagements', '', 'Post URL', 'Post Publish Date', 'Impressions']],
        'MOST RECENT POSTS': [['Post URL', 'Post Publish Date', 'Post type', 'Impressions']],
        'AUDIENCE DEMOGRAPHICS': [['Top Demographics', 'Value', 'Percentage']],
        'CONTENT DEMOGRAPHICS': [['Top Demographics', 'Value', 'Percentage']],
      };
    }

    const isShort = variant === 'short-28d';
    const isOlder = variant === 'older-365d';
    const isExcelTypes = variant === 'excel-types';
    const isFewPosts = variant === 'few-posts';

    const totalDays = isShort ? 28 : 365;
    // End date: 2026-11-06 for normal, 2026-08-06 for older-365d
    const endUtc = isOlder
      ? Date.UTC(2026, 7, 6) // 6 Aug 2026
      : Date.UTC(2026, 10, 6); // 6 Nov 2026
    const startUtc = endUtc - (totalDays - 1) * 86400000;

    const toUsDateStr = (ms) => {
      const d = new Date(ms);
      return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
    };
    const toExcelSerial = (ms) => Math.round(ms / 86400000 + 25569);

    const formatCellDate = (ms) => (isExcelTypes ? toExcelSerial(ms) : toUsDateStr(ms));
    const formatCellNum = (n) => (isExcelTypes ? Number(n) : n >= 1000 ? Number(n).toLocaleString('en-US') : String(n));

    const engagementRows = [['Date', 'Impressions', 'Engagements']];
    const followerRows = [
      [`Total followers on ${toUsDateStr(endUtc)}`, formatCellNum(isOlder ? 3950 : isShort ? 2480 : 4850)],
      ['', ''],
      ['Date', 'New followers'],
    ];

    let totalImp = 0;
    for (let i = 0; i < totalDays; i++) {
      const dayMs = startUtc + i * 86400000;
      const dt = new Date(dayMs);
      const dow = dt.getUTCDay();
      const progress = i / totalDays;
      const baseImp = Math.round((80 + progress * 260) * (dow === 2 || dow === 4 ? 1.65 : dow === 0 || dow === 6 ? 0.45 : 1.0));
      const spike = i % 14 === 3 ? 2.8 : 1.0;
      const imp = Math.max(5, Math.round(baseImp * spike * (0.75 + rand() * 0.5)));
      const eng = Math.max(0, Math.round(imp * (0.025 + rand() * 0.03)));
      const newFol = Math.max(0, Math.round((2 + progress * 9) * (dow === 2 ? 1.8 : 0.9) * (0.5 + rand())));

      totalImp += imp;
      engagementRows.push([formatCellDate(dayMs), formatCellNum(imp), formatCellNum(eng)]);
      followerRows.push([formatCellDate(dayMs), formatCellNum(newFol)]);
    }

    const discoveryRows = [
      ['Overall Performance', `${toUsDateStr(startUtc)} - ${toUsDateStr(endUtc)}`],
      ['Impressions', formatCellNum(totalImp)],
      ['Members reached', formatCellNum(Math.round(totalImp * 0.31))],
    ];

    // Synthetic posts: Newsroom primary by count (10 posts), Builder hidden strength by median engagements (6 posts)
    const allSyntheticPosts = [
      { slug: 'alex-morgan_i-built-a-free-saas-pricing-simulator-tool-share-740001-aa', dateOffset: 15, eng: 260, imp: 5400 },
      { slug: 'alex-morgan_shipped-an-open-source-analytics-app-for-founders-share-740002-bb', dateOffset: 38, eng: 118, imp: 2950 },
      { slug: 'alex-morgan_built-a-browser-tool-to-audit-cloud-costs-share-740003-cc', dateOffset: 66, eng: 96, imp: 2420 },
      { slug: 'alex-morgan_launched-our-free-roi-simulator-for-product-teams-share-740004-dd', dateOffset: 94, eng: 88, imp: 2190 },
      { slug: 'alex-morgan_i-built-a-tiny-cli-tool-this-weekend-share-740005-ee', dateOffset: 132, eng: 74, imp: 1880 },
      { slug: 'alex-morgan_free-tool-to-test-api-latency-across-regions-share-740006-ff', dateOffset: 175, eng: 68, imp: 1740 },
      { slug: 'alex-morgan_this-week-in-fintech-five-biggest-stories-share-740007-gg', dateOffset: 12, eng: 28, imp: 1120 },
      { slug: 'alex-morgan_weekly-product-roundup-what-changed-in-saas-share-740008-hh', dateOffset: 26, eng: 24, imp: 980 },
      { slug: 'alex-morgan_this-week-the-biggest-stories-in-uktech-share-740009-ii', dateOffset: 40, eng: 22, imp: 940 },
      { slug: 'alex-morgan_weekly-roundup-payments-and-banking-news-share-740010-jj', dateOffset: 54, eng: 19, imp: 890 },
      { slug: 'alex-morgan_this-week-in-saas-pricing-and-product-news-share-740011-kk', dateOffset: 68, eng: 18, imp: 860 },
      { slug: 'alex-morgan_weekly-tech-news-roundup-for-engineering-leads-share-740012-ll', dateOffset: 82, eng: 17, imp: 820 },
      { slug: 'alex-morgan_biggest-stories-this-week-in-developer-tools-share-740013-mm', dateOffset: 96, eng: 16, imp: 790 },
      { slug: 'alex-morgan_weekly-roundup-cloud-infrastructure-news-share-740014-nn', dateOffset: 110, eng: 15, imp: 760 },
      { slug: 'alex-morgan_this-week-in-uktech-founder-news-roundup-share-740015-oo', dateOffset: 124, eng: 14, imp: 720 },
      { slug: 'alex-morgan_weekly-news-roundup-for-product-managers-share-740016-pp', dateOffset: 138, eng: 12, imp: 680 },
      { slug: 'alex-morgan_completed-my-cloud-architecture-certification-course-share-740017-qq', dateOffset: 48, eng: 52, imp: 1420 },
      { slug: 'alex-morgan_speaking-at-the-manchester-tech-festival-hackathon-share-740018-rr', dateOffset: 88, eng: 46, imp: 1310 },
      { slug: 'alex-morgan_joined-the-advisory-board-new-role-milestone-share-740019-ss', dateOffset: 150, eng: 41, imp: 1190 },
      { slug: 'alex-morgan_fintech-saas-uktech-share-740020-tt', dateOffset: 20, eng: 37, imp: 1090 },
      { slug: 'alex-morgan_fintech-saas-productmanagement-share-740021-uu', dateOffset: 34, eng: 33, imp: 1020 },
      { slug: 'alex-morgan_fintech-uktech-cloudcomputing-share-740022-vv', dateOffset: 60, eng: 29, imp: 950 },
      { slug: 'alex-morgan_why-most-b2b-onboarding-flows-lose-users-early-share-740023-ww', dateOffset: 75, eng: 31, imp: 970 },
    ];

    let activePosts = allSyntheticPosts;
    if (isFewPosts) {
      activePosts = allSyntheticPosts.slice(0, 2);
    } else if (isOlder) {
      // Older export misses the 3 newest posts
      activePosts = allSyntheticPosts.slice(3);
    }

    const byEng = [...activePosts].sort((a, b) => b.eng - a.eng);
    const byImp = [...activePosts].sort((a, b) => b.imp - a.imp);
    const topPostsRows = [
      ['Maximum of 50 posts available to include in this list', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['Post URL', 'Post Publish Date', 'Engagements', '', 'Post URL', 'Post Publish Date', 'Impressions'],
    ];

    for (let i = 0; i < Math.max(byEng.length, byImp.length); i++) {
      const pe = byEng[i];
      const pi = byImp[i];
      const peDate = pe ? formatCellDate(endUtc - (pe.dateOffset % totalDays) * 86400000) : '';
      const piDate = pi ? formatCellDate(endUtc - (pi.dateOffset % totalDays) * 86400000) : '';
      topPostsRows.push([
        pe ? `https://www.linkedin.com/posts/${pe.slug}` : '',
        peDate,
        pe ? formatCellNum(pe.eng) : '',
        '',
        pi ? `https://www.linkedin.com/posts/${pi.slug}` : '',
        piDate,
        pi ? formatCellNum(pi.imp) : '',
      ]);
    }

    const recentPostsRows = [
      [
        'Post URL',
        'Post Publish Date',
        'Post type',
        'Impressions',
        'Impressions (in-network)',
        'Impressions (out-of-network)',
        'Members reached',
        'Views',
        'Watch time',
        'Avg watch time',
        'Followers gained',
        'Profile viewers',
        'Reactions',
        'Comments',
        'Reposts',
        'Saves',
        'Sends',
        'Custom button engagements',
      ],
      [
        'https://www.linkedin.com/posts/alex-morgan_fintech-saas-uktech-ugcPost-750101-aa',
        formatCellDate(endUtc - 2 * 86400000),
        'Video',
        formatCellNum(940),
        '72%',
        '28%',
        formatCellNum(510),
        formatCellNum(310),
        '42m 18s',
        '19s',
        formatCellNum(6),
        formatCellNum(14),
        formatCellNum(29),
        formatCellNum(7),
        formatCellNum(4),
        formatCellNum(5),
        formatCellNum(1),
        formatCellNum(0),
      ],
      [
        'https://www.linkedin.com/feed/update/urn:li:activity:75010299887766',
        formatCellDate(endUtc - 5 * 86400000),
        'Image',
        formatCellNum(520),
        '81%',
        '19%',
        formatCellNum(290),
        '',
        '',
        '',
        formatCellNum(2),
        formatCellNum(5),
        formatCellNum(18),
        formatCellNum(3),
        formatCellNum(1),
        formatCellNum(0),
        formatCellNum(0),
        formatCellNum(0),
      ],
    ];

    const audienceRows = [
      ['Top Demographics', 'Value', 'Percentage'],
      ['Industry', 'Software Development', isOlder ? '19%' : '22%'],
      ['Industry', 'Financial Services', '16%'],
      ['Industry', 'IT Services and IT Consulting', '13%'],
      ['Industry', 'Technology, Information and Internet', '11%'],
      ['Industry', 'Business Consulting and Services', '6%'],
      ['Seniority', 'Senior', '34%'],
      ['Seniority', 'Director', '17%'],
      ['Seniority', 'Entry', '14%'],
      ['Seniority', 'CXO', '9%'],
      ['Seniority', 'Manager', '8%'],
      ['Seniority', 'VP', '5%'],
      ['Seniority', 'Owner', '4%'],
      ['Job title', 'Software Engineer', '7%'],
      ['Job title', 'Founder', '6%'],
      ['Job title', 'Product Manager', '5%'],
      ['Job title', 'Chief Technology Officer', '3%'],
      ['Job title', 'Engineering Manager', '< 1%'],
      ['Company size', '11-50 employees', '18%'],
      ['Company size', '2-10 employees', '15%'],
      ['Company size', '1,001-5,000 employees', '14%'],
      ['Company size', '51-200 employees', '13%'],
      ['Company size', '10,001+ employees', '11%'],
      ['Company size', '0-1 employees', '4%'],
      ['Location', 'London Area, United Kingdom', '24%'],
      ['Location', 'Manchester Area, United Kingdom', '12%'],
      ['Location', 'Greater Leeds Area', '8%'],
      ['Location', 'Greater Dublin', '4%'],
      ['Location', 'Edinburgh', '< 1%'],
      ['Company', 'Acme Cloud UK', '3%'],
      ['Company', 'Acme Cloud International', '2%'],
      ['Company', 'Acme Cloud Labs', '1%'],
      ['Company', 'Monzo Bank', '1%'],
      ['Company', 'Revolut', '< 1%'],
    ];

    const contentRows = [
      ['Top Demographics', 'Value', 'Percentage'],
      ['Industry', 'Software Development', '20%'],
      ['Industry', 'IT Services and IT Consulting', '17%'],
      ['Industry', 'Financial Services', '14%'],
      ['Industry', 'Technology, Information and Internet', '12%'],
      ['Seniority', 'Senior', '31%'],
      ['Seniority', 'Entry', '19%'],
      ['Seniority', 'Director', '15%'],
      ['Seniority', 'Manager', '10%'],
      ['Seniority', 'CXO', '7%'],
      ['Seniority', 'VP', '4%'],
      ['Job title', 'Software Engineer', '9%'],
      ['Job title', 'Product Manager', '5%'],
      ['Job title', 'Founder', '4%'],
      ['Company size', '10,001+ employees', '19%'],
      ['Company size', '1,001-5,000 employees', '16%'],
      ['Company size', '11-50 employees', '14%'],
      ['Company size', '2-10 employees', '11%'],
      ['Location', 'London Area, United Kingdom', '19%'],
      ['Location', 'San Francisco Bay Area', '6%'],
      ['Location', 'Manchester Area, United Kingdom', '9%'],
      ['Location', 'Greater Leeds Area', '6%'],
      ['Company', 'Acme Cloud UK', '3%'],
      ['Company', 'Amazon Web Services (AWS)', '2%'],
      ['Company', 'Microsoft', '1%'],
    ];

    return {
      DISCOVERY: discoveryRows,
      ENGAGEMENT: engagementRows,
      FOLLOWERS: followerRows,
      'TOP POSTS': topPostsRows,
      'MOST RECENT POSTS': recentPostsRows,
      'AUDIENCE DEMOGRAPHICS': audienceRows,
      'CONTENT DEMOGRAPHICS': contentRows,
    };
  }

  return {
    CONFIG,
    sanitizeCopy,
    formatInt,
    formatDec,
    formatPct,
    formatMilestoneLabel,
    formatUkDateShort,
    formatMonthLabel,
    median,
    average,
    sum,
    pearsonCorrelation,
    parseNumber,
    parsePercentage,
    parseDateValue,
    parseWatchTimeSeconds,
    extractSlugParts,
    slugToTitle,
    detectTheme,
    extractHashtagsFromSlug,
    parseSheetsMap,
    parseWorkbook,
    analyseFollowerGrowth,
    buildProjections,
    planGoal,
    analysePosts,
    analyseCreatorType,
    analyseBestDays,
    analyseReachAndEngagementTrend,
    analyseAudienceDemographics,
    analyseContentVsAudience,
    calculateHealthScore,
    buildRecommendations,
    buildTop5Takeaways,
    analyseExport,
    compareExports,
    generateAiMarkdown,
    generateSyntheticSheetsMap,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = LACore;
if (typeof window !== 'undefined') window.LACore = LACore;
if (typeof globalThis !== 'undefined') globalThis.LACore = LACore;
