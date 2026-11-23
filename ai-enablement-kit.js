/* 90-Day AI Enablement & Seat-Waste Kit - JohnB.io
 * 100% client-side vanilla JS. Zero external dependencies, CSP-safe, no inline handlers.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'johnb_aek_state_v1';
  var WORKING_WEEKS = 46;

  var CURRENCIES = {
    GBP: { symbol: '£', code: 'GBP', defaultRate: 45 },
    USD: { symbol: '$', code: 'USD', defaultRate: 60 }
  };

  var STACK_PRESETS = {
    m365: {
      name: 'Microsoft 365 Copilot',
      shortName: 'M365 Copilot',
      GBP: 24,
      USD: 30,
      note: 'Typical enterprise list pricing (~£24 / $30 per user/mo). Embedded inside Teams, Word, Excel and Outlook.'
    },
    chatgpt: {
      name: 'ChatGPT Enterprise',
      shortName: 'ChatGPT Enterprise',
      GBP: 48,
      USD: 60,
      note: 'Typical enterprise seat cost (~£48 / $60 per user/mo). Workspace data excluded from model training by default.'
    },
    claude: {
      name: 'Claude Enterprise',
      shortName: 'Claude Enterprise',
      GBP: 40,
      USD: 50,
      note: 'Typical enterprise seat cost (~£40 / $50 per user/mo). Strong for long-document review, analysis and engineering.'
    },
    gemini: {
      name: 'Google Gemini for Workspace',
      shortName: 'Gemini Workspace',
      GBP: 16,
      USD: 20,
      note: 'Typical Workspace add-on (~£16 / $20 per user/mo). Embedded across Docs, Gmail, Sheets and Meet.'
    },
    coding: {
      name: 'Coding Agents / Cursor Business',
      shortName: 'Coding Agents / Cursor',
      GBP: 32,
      USD: 40,
      note: 'Cursor Business / GitHub Copilot Enterprise (~£32 / $40 per dev/mo). High return for engineers, wasted on non-technical seats.'
    },
    custom: {
      name: 'Approved Enterprise AI Workspace',
      shortName: 'Custom AI Stack',
      GBP: 25,
      USD: 30,
      note: 'Custom blended seat cost entered manually. Update any preset button to switch back.'
    }
  };

  var RISK_TIERS = {
    low: {
      label: 'Unregulated SaaS / Agency',
      short: 'Low-Friction Commercial',
      maxErrorPct: 3.0,
      slaDays: 3,
      signOffRule: 'The person hitting send or merge owns every word, figure and line of code. "The AI wrote it" is never an acceptable excuse.',
      disclosureRule: 'Disclose AI assistance to clients when contractually required by an MSA or when delivering original creative work billed as human-authored output. Internal drafts and code refactoring do not need disclosure.',
      regulatorNote: 'Commercial NDA, IP ownership and standard client confidentiality controls apply.',
      extraRedLines: []
    },
    mid: {
      label: 'Mid-Risk B2B / Healthcare-Adjacent',
      short: 'Standard GDPR / B2B Controls',
      maxErrorPct: 1.5,
      slaDays: 5,
      signOffRule: 'Mandatory human review on every external document, customer email, commercial proposal and code change. Verify every factual claim, statistic and citation against a primary source before publishing.',
      disclosureRule: 'Label AI-assisted summaries in shared internal records where clinical, operational or contractual decisions rely on them. Follow customer DPA clauses before using AI on client-supplied material.',
      regulatorNote: 'UK GDPR / EU GDPR data minimisation, signed vendor Data Processing Agreement (DPA) and zero-training enterprise settings are mandatory.',
      extraRedLines: [
        'Unmasked customer names, email addresses, phone numbers or health-adjacent records (pseudonymise before prompting).'
      ]
    },
    high: {
      label: 'Heavily Regulated (Finance / iGaming / Legal)',
      short: 'Strict Regulatory Audit',
      maxErrorPct: 0.5,
      slaDays: 5,
      signOffRule: 'Dual sign-off required: the author verifies accuracy against source records, and a qualified reviewer approves any customer-facing, legal, regulatory or financial output before release.',
      disclosureRule: 'Log AI assistance in the audit trail for compliance, legal, affordability or risk-assessment drafts. Never present unverified AI output to a regulator, court, auditor or vulnerable customer.',
      regulatorNote: 'Aligned with FCA, UKGC, SRA and AML expectations: zero unapproved customer records, SSO-only enterprise workspace with audit logging and retention controls turned on.',
      extraRedLines: [
        'Customer KYC documents, ID scans, source-of-funds statements, player or account IDs, and AML / SAR investigation files.',
        'Regulatory correspondence, legal privilege memos or live compliance enforcement evidence.'
      ]
    }
  };

  var DEPARTMENTS = [
    {
      id: 'engineering',
      name: 'Engineering',
      icon: 'code',
      workflows: [
        {
          name: 'PR Risk & Edge-Case Review',
          saves: '~20 min / PR',
          when: 'Before requesting a senior peer review on medium or large pull requests.',
          prompt: 'Review this git diff for [service/module]. Ignore formatting nitpicks. List: (1) likely runtime edge cases or null/race conditions, (2) backwards-compatibility or migration risks, (3) missing unit tests I should add before merge. Keep each point to 2 sentences max.\n\n[Paste anonymised diff]',
          check: 'Human check: Run the full test suite locally and verify every flagged line exists in the actual diff.'
        },
        {
          name: 'Legacy Code Explainer & Unit Test Suite',
          saves: '~35 min / module',
          when: 'Onboarding to undocumented modules or adding regression coverage before refactoring.',
          prompt: 'Explain what this function does in plain English in 5 bullets, list its implicit assumptions and external side effects, then write 6 unit tests covering boundary values and failure modes using [test framework]. Do not invent helper libraries not shown below.\n\n[Paste module code]',
          check: 'Human check: Execute tests against the current codebase and confirm assertions test real behaviour, not mocked tautologies.'
        },
        {
          name: 'Incident Post-Mortem First Draft',
          saves: '~30 min / incident',
          when: 'Turning raw Slack incident timelines into a blameless post-mortem within 24 hours.',
          prompt: 'Turn these raw incident notes into a blameless post-mortem with sections: Summary (3 lines), Customer Impact, Timeline (UTC), Root Cause vs Contributing Factors, and 4 concrete follow-up actions with suggested owner roles. Flag any gaps in the timeline as [NEEDS VERIFICATION].\n\n[Paste redacted incident notes]',
          check: 'Human check: Confirm exact UTC timestamps, customer impact numbers and assigned action owners.'
        }
      ],
      redLines: [
        'Production API keys, database connection strings, OAuth tokens, private certs or .env files.',
        'Unredacted production logs containing customer emails, IP addresses, session tokens or payment IDs.',
        'Proprietary core algorithms or third-party licensed source code restricted by vendor NDA.'
      ]
    },
    {
      id: 'sales',
      name: 'Sales',
      icon: 'handshake',
      workflows: [
        {
          name: 'Discovery Call Brief & Objection Prep',
          saves: '~20 min / call',
          when: 'Preparing for an account discovery or renewal call using public company info.',
          prompt: 'Build a 1-page pre-call brief for [Prospect Company] in the [Industry] sector based on the public context below. Give me: (1) 3 probable operational pain points relevant to [our product], (2) 5 sharp discovery questions (no generic fluff), (3) 3 likely procurement or security objections and concise responses.\n\n[Paste public website / annual report notes]',
          check: 'Human check: Verify company facts, leadership names and recent news directly on the prospect site.'
        },
        {
          name: 'Mutual Action Plan Follow-Up Email',
          saves: '~15 min / meeting',
          when: 'Sending a crisp recap within 2 hours of a prospect demo or commercial call.',
          prompt: 'Draft a concise follow-up email (under 180 words) from these redacted call notes. Structure: 2-sentence recap of their stated goal, bulleted next steps with dates and owners (us vs them), and one direct question to confirm the next meeting. Plain UK English, zero sales clichés.\n\n[Paste call notes with personal emails removed]',
          check: 'Human check: Double-check agreed pricing, dates, legal commitments and stakeholder names before sending.'
        },
        {
          name: 'RFP & Security Questionnaire First Draft',
          saves: '~45 min / RFP section',
          when: 'Drafting initial answers using your approved internal security and product FAQ library.',
          prompt: 'Using ONLY the approved reference facts pasted below, draft clear answers to these prospect RFP questions. If a question is not covered by the reference material, write [VERIFY WITH INFOSEC / PRODUCT] instead of guessing.\n\nApproved facts:\n[Paste approved FAQ]\n\nQuestions:\n[Paste RFP questions]',
          check: 'Human check: Never submit unapproved security claims; route every [VERIFY] and SLA line through InfoSec or Legal.'
        }
      ],
      redLines: [
        'Signed customer contracts, non-public discount schedules or confidential competitor pricing shared under NDA.',
        'Raw CRM exports containing prospect personal phone numbers, home addresses or private email lists.',
        'Unapproved commercial commitments or custom SLA promises generated by AI without Finance/Legal sign-off.'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: 'campaign',
      workflows: [
        {
          name: 'Customer Notes to Messaging Matrix',
          saves: '~35 min / campaign',
          when: 'Turning anonymised sales calls or survey responses into landing-page messaging.',
          prompt: 'Analyse these anonymised customer quotes and build a messaging matrix with columns: Exact Customer Phrase, Underlying Problem, Our Proof Point, and Plain-English Headline (max 10 words). Keep customer language verbatim; cut corporate buzzwords.\n\n[Paste anonymised quotes]',
          check: 'Human check: Confirm every proof point matches live product capability and compliant marketing claims.'
        },
        {
          name: 'Product Release Notes to Multi-Channel Pack',
          saves: '~30 min / release',
          when: 'Converting an engineering changelog into customer-facing updates.',
          prompt: 'Convert these internal release notes into: (1) a 120-word customer email update focused on what changed for the user, (2) 3 short LinkedIn angles without hype, (3) 4 internal sales enablement bullets. Use UK English and do not invent performance percentages.\n\n[Paste release notes]',
          check: 'Human check: Check feature names, rollout dates and plan-tier eligibility with Product.'
        },
        {
          name: 'Competitor Positioning Tear-Down',
          saves: '~25 min / review',
          when: 'Comparing public competitor pages against your current messaging.',
          prompt: 'Compare our public positioning text against Competitor X\'s public copy below. Output: (1) 3 claims they emphasise that we ignore, (2) 3 vague claims they make without evidence, (3) 3 sharper ways we can state our differentiation with concrete proof.\n\n[Paste public copy]',
          check: 'Human check: Verify any competitor comparison complies with ASA / comparative advertising standards.'
        }
      ],
      redLines: [
        'Customer mailing lists, subscriber CSVs, ad-account credentials or unreleased financial performance metrics.',
        'Unverified statistics, fabricated customer testimonials or invented regulatory/compliance claims.',
        'Copyrighted competitor assets or paid research PDFs you do not hold redistribution rights for.'
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: 'settings',
      workflows: [
        {
          name: 'SOP Builder from Messy Process Notes',
          saves: '~40 min / SOP',
          when: 'Documenting tribal knowledge after shadowing a process or recording a walkthrough.',
          prompt: 'Turn these rough process notes into a clean Standard Operating Procedure: Purpose (2 lines), Owner Role, Pre-requisites, Numbered Step-by-Step Checklist, Escalation Trigger, and Definition of Done. Mark missing edge cases as [OWNER TO CONFIRM].\n\n[Paste process notes]',
          check: 'Human check: Have someone unfamiliar with the task test-run the SOP once before publishing.'
        },
        {
          name: 'Vendor Renewal Comparison Matrix',
          saves: '~30 min / renewal',
          when: 'Evaluating 2 to 4 software or service quotes ahead of quarterly renewal.',
          prompt: 'Build a decision table comparing these redacted vendor proposals across: Annual Total Cost, Contract Lock-In, Notice Period, Seat Flexibility, Support SLA, and Hidden Fee Risks. End with 5 negotiation questions to send back before signing.\n\n[Paste redacted quote summaries]',
          check: 'Human check: Recalculate all annual totals and notice dates directly against the original quotes.'
        },
        {
          name: 'Weekly Ops Risk & Blocker Digest',
          saves: '~20 min / week',
          when: 'Rolling up 5 team status updates into a 1-page Monday leadership brief.',
          prompt: 'Condense these team updates into a 1-page executive digest: (1) Top 3 Red/Amber Blockers needing a decision this week, (2) Completed Milestones (max 5 bullets), (3) Upcoming Dependencies over the next 14 days. Strip filler and flag any missing dates.\n\n[Paste team status updates]',
          check: 'Human check: Confirm Red/Amber status calls with project leads so nobody gets blindsided in Monday review.'
        }
      ],
      redLines: [
        'Full supplier bank details, tax IDs, staff home addresses or physical security / office access codes.',
        'Unredacted incident reports involving named employees or active disciplinary matters.',
        'Confidential M&A, office closure or restructuring plans before formal announcement.'
      ]
    },
    {
      id: 'support',
      name: 'Customer Support',
      icon: 'support_agent',
      workflows: [
        {
          name: 'Calm De-Escalation Reply Draft',
          saves: '~10 min / complex ticket',
          when: 'Drafting a clear, empathetic reply to a frustrated customer without defensive phrasing.',
          prompt: 'Draft a calm, plain-English customer reply based on the redacted issue summary and approved resolution below. Acknowledge the frustration in one sentence, state the exact fix and timeline clearly, avoid robotic apologies or blame-shifting, and keep it under 140 words.\n\nIssue summary: [Redacted summary]\nApproved fix: [Exact resolution]',
          check: 'Human check: Confirm account resolution details, refund/credit amounts and tone before hitting send.'
        },
        {
          name: 'Ticket Cluster Root-Cause Triage',
          saves: '~35 min / week',
          when: 'Grouping 30 to 100 anonymised weekly tickets to spot product bugs and friction spikes.',
          prompt: 'Cluster these anonymised ticket summaries into top 5 recurring themes. For each theme give: Ticket Count, Plain-English Symptom, Likely Owner (Product / Billing / Docs / Ops), and 1 quick fix that would deflect future tickets.\n\n[Paste anonymised ticket list]',
          check: 'Human check: Spot-check counts against your helpdesk tags before presenting numbers to Product.'
        },
        {
          name: 'Help-Centre Article from Resolved Tickets',
          saves: '~25 min / article',
          when: 'Turning a repeated solved issue into a self-serve knowledge-base guide.',
          prompt: 'Convert this resolved support workflow into a concise help-centre article: Clear Question Title, 2-sentence direct answer, Numbered steps (max 7), and a "Still stuck?" section listing the 3 details to include when contacting support.\n\n[Paste redacted resolution steps]',
          check: 'Human check: Walk through the live UI to verify button names and screenshots match current production.'
        }
      ],
      redLines: [
        'Customer full names, account numbers, payment card details, ID verification uploads or session cookies.',
        'Health, vulnerability, gambling self-exclusion or financial hardship notes tied to an identifiable person.',
        'Auto-sending AI-written replies directly to customers without an agent reading and approving them.'
      ]
    },
    {
      id: 'legal',
      name: 'Legal & Compliance',
      icon: 'balance',
      workflows: [
        {
          name: 'Clause Variance Redline Summary',
          saves: '~30 min / contract',
          when: 'Spotting where a vendor\'s standard terms depart from your fallback playbook.',
          prompt: 'Compare the anonymised vendor clauses below against our standard fallback positions. Output a table: Clause Topic, Vendor Position, Gap vs Our Playbook, Risk Level (Low/Med/High), and Suggested Plain-English Fallback Wording. Flag missing clauses explicitly.\n\nOur playbook:\n[Paste internal fallback rules]\n\nVendor clauses:\n[Paste anonymised clauses]',
          check: 'Human check: Qualified legal counsel must verify every clause against the full contract definitions and schedules.'
        },
        {
          name: 'Plain-English Policy Translator',
          saves: '~25 min / policy',
          when: 'Turning dense regulatory or internal compliance policies into staff-readable summaries.',
          prompt: 'Rewrite this compliance policy section into a 1-page staff guide using UK English: (1) What this rule means in daily work, (2) 3 clear "Do" examples, (3) 3 clear "Never do" examples, (4) Who to contact if unsure. Do not soften any mandatory legal threshold.\n\n[Paste internal policy section]',
          check: 'Human check: Compliance lead confirms no statutory obligation or reporting deadline was diluted.'
        },
        {
          name: 'Regulatory Change Impact Checklist',
          saves: '~35 min / update',
          when: 'Breaking down a newly published regulator consultation or guidance note.',
          prompt: 'Summarise this public regulator update into an operational impact checklist: Effective Dates, Affected Teams, New Mandatory Controls, Evidence Required for Audit, and Open Questions for Counsel. Cite exact section numbers from the pasted text only.\n\n[Paste public regulator text]',
          check: 'Human check: Cross-check every section reference and compliance deadline against the official publication.'
        }
      ],
      redLines: [
        'Legally privileged advice, active litigation files, settlement terms or tribunal correspondence.',
        'Whistleblowing reports, regulatory investigation notices or suspicious activity reports (SARs).',
        'Relying on AI-generated case law citations or statutory references without verifying primary legal databases.'
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: 'account_balance',
      workflows: [
        {
          name: 'Board Variance Commentary First Draft',
          saves: '~25 min / month',
          when: 'Turning indexed or percentage variance tables into clear management commentary.',
          prompt: 'Draft 5 bullet points of board-ready variance commentary from this anonymised summary table. Lead each bullet with the driver and magnitude, separate one-off timing effects from recurring run-rate shifts, and avoid vague filler.\n\n[Paste anonymised variance summary]',
          check: 'Human check: Reconcile every figure, sign (+/-) and percentage back to the audited management accounts.'
        },
        {
          name: 'SaaS Renewal & Spend Anomaly Checklist',
          saves: '~20 min / audit',
          when: 'Auditing departmental software renewals for shelfware and auto-renewal traps.',
          prompt: 'Review this anonymised SaaS renewal list (tool category, seats paid, active users, renewal date, uplift %). Rank the top 5 savings opportunities by cash impact and draft 3 blunt questions for each budget holder ahead of renewal.\n\n[Paste anonymised SaaS table]',
          check: 'Human check: Confirm actual usage exports with IT admins before initiating licence reductions.'
        },
        {
          name: 'Business-Case Stress Test',
          saves: '~20 min / proposal',
          when: 'Challenging optimistic vendor ROI decks or internal headcount/tool requests.',
          prompt: 'Act as a sceptical CFO reviewing this anonymised business case. List: (1) the 3 most optimistic assumptions that could fail, (2) hidden implementation or change-management costs missing from the model, (3) 4 concrete payback conditions we should attach before approving.\n\n[Paste anonymised proposal]',
          check: 'Human check: Validate payback maths in a spreadsheet; never trust LLM arithmetic without formula checks.'
        }
      ],
      redLines: [
        'Unreleased quarterly/annual results, price-sensitive forecasts, payroll files or individual salary records.',
        'Bank account numbers, SWIFT/IBAN details, tax filings or investor cap tables.',
        'Using an LLM to perform unverified financial calculations instead of Excel/BI formulas.'
      ]
    },
    {
      id: 'hr',
      name: 'HR / People',
      icon: 'diversity_3',
      workflows: [
        {
          name: 'Structured Interview Rubric & Questions',
          saves: '~30 min / role',
          when: 'Building consistent, bias-resistant scorecards before opening a new hire.',
          prompt: 'Create a structured 45-minute interview scorecard for a [Role Title] based on these core responsibilities. Include 5 behavioural or work-sample questions, plus clear "Strong / Acceptable / Concern" scoring anchors for each question. Plain UK English.\n\n[Paste role requirements]',
          check: 'Human check: Hiring manager reviews questions for job relevance and compliance with equality law.'
        },
        {
          name: 'Job Description De-Jargoning',
          saves: '~15 min / role',
          when: 'Replacing vague wish-list job specs with clear outcomes for months 1, 3 and 6.',
          prompt: 'Rewrite this job description to remove corporate clichés and inflated requirements. Organise into: What You\'ll Own in the First 90 Days, Must-Have Skills (max 5), Nice-to-Haves (max 3), and How We Work. Keep it under 450 words.\n\n[Paste draft job description]',
          check: 'Human check: Confirm salary band, hybrid/location policy and mandatory qualification criteria.'
        },
        {
          name: 'Anonymised Pulse-Survey Theme Summary',
          saves: '~35 min / survey',
          when: 'Synthesising free-text comments from anonymous staff surveys (min 15+ responses).',
          prompt: 'Group these anonymised employee survey comments into top 5 recurring themes. For each theme show: Frequency Count, Balanced Summary, 2 anonymised illustrative paraphrases (do not quote anything that could identify an individual), and 1 practical manager action.\n\n[Paste fully anonymised comments]',
          check: 'Human check: Verify no small-team comments can re-identify individuals before sharing with leadership.'
        }
      ],
      redLines: [
        'CVs, candidate personal contact details, interview notes tied to named applicants or automated candidate scoring.',
        'Employee disciplinary records, grievances, medical/sickness notes, performance reviews or compensation data.',
        'Using AI to make or rank hiring, promotion or dismissal decisions (high-risk under employment and AI law).'
      ]
    }
  ];

  var DEFAULT_STATE = {
    orgName: '',
    currency: 'GBP',
    preset: 'm365',
    seats: 250,
    monthlyCost: 24,
    hourlyRate: 45,
    currentUsage: 28,
    targetUsage: 68,
    riskTier: 'mid',
    departments: ['engineering', 'sales', 'marketing', 'operations'],
    gaugeMode: 'now',
    activeTab: 'roadmap',
    workflowFilter: 'all',
    checkedMilestones: {},
    customPolicy: '',
    editingPolicy: false,
    audit: {
      wrwr: 28,
      netMins: 25,
      errRate: 2.5,
      reclaimPct: 40
    }
  };

  var state = cloneDefaultState();
  var toastTimer = null;

  function cloneDefaultState() {
    return {
      orgName: DEFAULT_STATE.orgName,
      currency: DEFAULT_STATE.currency,
      preset: DEFAULT_STATE.preset,
      seats: DEFAULT_STATE.seats,
      monthlyCost: DEFAULT_STATE.monthlyCost,
      hourlyRate: DEFAULT_STATE.hourlyRate,
      currentUsage: DEFAULT_STATE.currentUsage,
      targetUsage: DEFAULT_STATE.targetUsage,
      riskTier: DEFAULT_STATE.riskTier,
      departments: DEFAULT_STATE.departments.slice(),
      gaugeMode: DEFAULT_STATE.gaugeMode,
      activeTab: DEFAULT_STATE.activeTab,
      workflowFilter: DEFAULT_STATE.workflowFilter,
      checkedMilestones: {},
      customPolicy: '',
      editingPolicy: false,
      audit: {
        wrwr: DEFAULT_STATE.audit.wrwr,
        netMins: DEFAULT_STATE.audit.netMins,
        errRate: DEFAULT_STATE.audit.errRate,
        reclaimPct: DEFAULT_STATE.audit.reclaimPct
      }
    };
  }

  /* ── HELPERS ── */
  function clamp(num, min, max, fallback) {
    var n = Number(num);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(val) {
    var sym = (CURRENCIES[state.currency] || CURRENCIES.GBP).symbol;
    var rounded = Math.round(val);
    return sym + rounded.toLocaleString('en-GB');
  }

  function formatMins(mins) {
    if (mins >= 60) {
      var hrs = (mins / 60).toFixed(1);
      return Math.round(mins) + ' min/wk (' + hrs + ' hrs)';
    }
    return mins.toFixed(1) + ' min/wk';
  }

  function getOrgDisplay() {
    var trimmed = (state.orgName || '').trim();
    return trimmed ? trimmed : 'Your Organisation';
  }

  function getStackInfo() {
    return STACK_PRESETS[state.preset] || STACK_PRESETS.custom;
  }

  function showToast(msg) {
    var el = document.getElementById('aek-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('visible');
    }, 3000);
  }

  function copyToClipboard(text, successMsg, btnEl) {
    function onSuccess() {
      showToast(successMsg);
      if (btnEl) {
        btnEl.classList.add('copied');
        setTimeout(function () {
          btnEl.classList.remove('copied');
        }, 1600);
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopy(text, onSuccess);
      });
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, onSuccess) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (e) {
      showToast('Copy failed - please select and copy manually.');
    }
    document.body.removeChild(ta);
  }

  /* ── UTF-8 SAFE BASE64URL FOR SHAREABLE HASH ── */
  function encodeConfigToHash() {
    var payload = {
      o: state.orgName,
      c: state.currency,
      p: state.preset,
      s: state.seats,
      m: state.monthlyCost,
      h: state.hourlyRate,
      u: state.currentUsage,
      t: state.targetUsage,
      r: state.riskTier,
      d: state.departments,
      k: Object.keys(state.checkedMilestones).filter(function (k) { return state.checkedMilestones[k]; }),
      a: [state.audit.wrwr, state.audit.netMins, state.audit.errRate, state.audit.reclaimPct]
    };
    var json = JSON.stringify(payload);
    var bytes = new TextEncoder().encode(json);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeConfigFromHash(hashStr) {
    if (!hashStr || hashStr.indexOf('cfg=') === -1) return false;
    try {
      var raw = hashStr.split('cfg=')[1].split('&')[0];
      var b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      var json = new TextDecoder().decode(bytes);
      var p = JSON.parse(json);
      applyLoadedObject({
        orgName: typeof p.o === 'string' ? p.o.slice(0, 80) : '',
        currency: p.c === 'USD' ? 'USD' : 'GBP',
        preset: STACK_PRESETS[p.p] ? p.p : 'custom',
        seats: clamp(p.s, 10, 5000, DEFAULT_STATE.seats),
        monthlyCost: clamp(p.m, 1, 500, DEFAULT_STATE.monthlyCost),
        hourlyRate: clamp(p.h, 15, 300, DEFAULT_STATE.hourlyRate),
        currentUsage: clamp(p.u, 5, 95, DEFAULT_STATE.currentUsage),
        targetUsage: clamp(p.t, 15, 95, DEFAULT_STATE.targetUsage),
        riskTier: RISK_TIERS[p.r] ? p.r : 'mid',
        departments: Array.isArray(p.d) ? p.d : DEFAULT_STATE.departments,
        checkedKeys: Array.isArray(p.k) ? p.k : [],
        auditArr: Array.isArray(p.a) ? p.a : null
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyLoadedObject(obj) {
    state.orgName = obj.orgName || '';
    state.currency = obj.currency === 'USD' ? 'USD' : 'GBP';
    state.preset = STACK_PRESETS[obj.preset] ? obj.preset : 'custom';
    state.seats = Math.round(clamp(obj.seats, 10, 5000, DEFAULT_STATE.seats));
    state.monthlyCost = Math.round(clamp(obj.monthlyCost, 1, 500, DEFAULT_STATE.monthlyCost));
    state.hourlyRate = Math.round(clamp(obj.hourlyRate, 15, 300, DEFAULT_STATE.hourlyRate));
    state.currentUsage = Math.round(clamp(obj.currentUsage, 5, 95, DEFAULT_STATE.currentUsage));
    state.targetUsage = Math.round(clamp(obj.targetUsage, 15, 95, DEFAULT_STATE.targetUsage));
    state.riskTier = RISK_TIERS[obj.riskTier] ? obj.riskTier : 'mid';

    var validDeptIds = DEPARTMENTS.map(function (d) { return d.id; });
    var filteredDepts = (obj.departments || []).filter(function (id) {
      return validDeptIds.indexOf(id) !== -1;
    });
    state.departments = filteredDepts.length > 0 ? filteredDepts : DEFAULT_STATE.departments.slice();

    state.checkedMilestones = {};
    if (Array.isArray(obj.checkedKeys)) {
      obj.checkedKeys.forEach(function (k) {
        if (typeof k === 'string') state.checkedMilestones[k] = true;
      });
    } else if (obj.checkedMilestones && typeof obj.checkedMilestones === 'object') {
      Object.keys(obj.checkedMilestones).forEach(function (k) {
        if (obj.checkedMilestones[k]) state.checkedMilestones[k] = true;
      });
    }

    if (typeof obj.customPolicy === 'string') {
      state.customPolicy = obj.customPolicy;
    }

    if (Array.isArray(obj.auditArr) && obj.auditArr.length === 4) {
      state.audit.wrwr = clamp(obj.auditArr[0], 0, 100, DEFAULT_STATE.audit.wrwr);
      state.audit.netMins = clamp(obj.auditArr[1], 0, 600, DEFAULT_STATE.audit.netMins);
      state.audit.errRate = clamp(obj.auditArr[2], 0, 50, DEFAULT_STATE.audit.errRate);
      state.audit.reclaimPct = clamp(obj.auditArr[3], 0, 100, DEFAULT_STATE.audit.reclaimPct);
    } else if (obj.audit && typeof obj.audit === 'object') {
      state.audit.wrwr = clamp(obj.audit.wrwr, 0, 100, DEFAULT_STATE.audit.wrwr);
      state.audit.netMins = clamp(obj.audit.netMins, 0, 600, DEFAULT_STATE.audit.netMins);
      state.audit.errRate = clamp(obj.audit.errRate, 0, 50, DEFAULT_STATE.audit.errRate);
      state.audit.reclaimPct = clamp(obj.audit.reclaimPct, 0, 100, DEFAULT_STATE.audit.reclaimPct);
    }
  }

  function saveStateToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        orgName: state.orgName,
        currency: state.currency,
        preset: state.preset,
        seats: state.seats,
        monthlyCost: state.monthlyCost,
        hourlyRate: state.hourlyRate,
        currentUsage: state.currentUsage,
        targetUsage: state.targetUsage,
        riskTier: state.riskTier,
        departments: state.departments,
        checkedMilestones: state.checkedMilestones,
        customPolicy: state.customPolicy,
        audit: state.audit
      }));
    } catch (e) {
      // Ignore storage quota or private-mode errors
    }
  }

  function loadInitialState() {
    var fromHash = decodeConfigFromHash(window.location.hash);
    if (fromHash) return;
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        applyLoadedObject(JSON.parse(saved));
      }
    } catch (e) {
      // Fall back to defaults
    }
  }

  /* ── CORE FINANCIAL & ROLLOUT CALCULATIONS ── */
  function computeMetrics() {
    var seats = state.seats;
    var cost = state.monthlyCost;
    var rate = state.hourlyRate;
    var curPct = state.currentUsage;
    var tgtPct = state.targetUsage;

    var annualSpend = seats * cost * 12;
    var monthlySpend = seats * cost;

    var activeNow = Math.round(seats * (curPct / 100));
    var dormantNow = Math.max(0, seats - activeNow);
    var powerNow = Math.round(activeNow * 0.30);
    var casualNow = Math.max(0, activeNow - powerNow);

    var activeTarget = Math.round(seats * (tgtPct / 100));
    var dormantTarget = Math.max(0, seats - activeTarget);
    var powerTarget = Math.round(activeTarget * 0.45);
    var casualTarget = Math.max(0, activeTarget - powerTarget);

    var annualWaste = dormantNow * cost * 12;
    var monthlyWaste = dormantNow * cost;
    var wastePct = Math.round((dormantNow / seats) * 100);

    var weeklySeatCost = (cost * 12) / WORKING_WEEKS;
    var breakEvenMins = (weeklySeatCost / rate) * 60;
    var activeRatio = activeNow > 0 ? (activeNow / seats) : (1 / seats);
    var effectiveBreakEvenMins = breakEvenMins / activeRatio;

    var newlyActivated = Math.max(0, activeTarget - activeNow);
    var reclaimedLicenceAnnual = newlyActivated * cost * 12;
    var harvestableDormant = Math.round(dormantTarget * 0.85);
    var harvestedLicenceAnnual = harvestableDormant * cost * 12;
    var totalLicenceReclaimedAnnual = reclaimedLicenceAnnual + harvestedLicenceAnnual;

    // Conservative review-adjusted net time saved (after subtracting ~25% checking/rework)
    // Power user: 90 net min/wk (1.5 hrs), Casual user: 25 net min/wk (0.417 hrs)
    var currentNetHrsYr = ((powerNow * 1.5) + (casualNow * (25 / 60))) * WORKING_WEEKS;
    var targetNetHrsYr = ((powerTarget * 1.5) + (casualTarget * (25 / 60))) * WORKING_WEEKS;
    var incrementalNetTimeValueAnnual = Math.max(0, targetNetHrsYr - currentNetHrsYr) * rate;

    // Champion ratio: 1 per 12 to 15 staff
    var champMin = Math.max(2, Math.ceil(seats / 15));
    var champMax = Math.max(champMin, Math.ceil(seats / 12));

    // Staged rollout Wave 1 cohort (Day 1–30): ~15% (clamped sensibly)
    var wave1Seats = seats <= 30 ? seats : Math.max(12, Math.min(seats, Math.round(seats * 0.15)));
    var wave2Seats = seats <= 30 ? seats : Math.min(seats, Math.max(wave1Seats, Math.round(seats * 0.55)));
    var wave3Seats = Math.min(seats, Math.max(activeTarget, Math.round(seats * Math.min(0.95, (tgtPct + 5) / 100))));

    // Q1 spend comparison: Blanket (3 months * all seats) vs Staged (M1 wave1 + M2 wave2 + M3 wave3)
    var q1BlanketSpend = seats * cost * 3;
    var q1StagedSpend = (wave1Seats + wave2Seats + wave3Seats) * cost;
    var q1CashSaved = Math.max(0, q1BlanketSpend - q1StagedSpend);

    return {
      seats: seats,
      cost: cost,
      rate: rate,
      curPct: curPct,
      tgtPct: tgtPct,
      annualSpend: annualSpend,
      monthlySpend: monthlySpend,
      activeNow: activeNow,
      dormantNow: dormantNow,
      powerNow: powerNow,
      casualNow: casualNow,
      activeTarget: activeTarget,
      dormantTarget: dormantTarget,
      powerTarget: powerTarget,
      casualTarget: casualTarget,
      annualWaste: annualWaste,
      monthlyWaste: monthlyWaste,
      wastePct: wastePct,
      breakEvenMins: breakEvenMins,
      effectiveBreakEvenMins: effectiveBreakEvenMins,
      newlyActivated: newlyActivated,
      reclaimedLicenceAnnual: reclaimedLicenceAnnual,
      harvestableDormant: harvestableDormant,
      harvestedLicenceAnnual: harvestedLicenceAnnual,
      totalLicenceReclaimedAnnual: totalLicenceReclaimedAnnual,
      incrementalNetTimeValueAnnual: incrementalNetTimeValueAnnual,
      champMin: champMin,
      champMax: champMax,
      wave1Seats: wave1Seats,
      wave2Seats: wave2Seats,
      wave3Seats: wave3Seats,
      q1BlanketSpend: q1BlanketSpend,
      q1StagedSpend: q1StagedSpend,
      q1CashSaved: q1CashSaved
    };
  }

  /* ── RENDER DASHBOARD & SVG VISUALS ── */
  function renderDashboard(m) {
    var stack = getStackInfo();
    var stackBadge = document.getElementById('aek-stack-summary-badge');
    if (stackBadge) {
      stackBadge.textContent = stack.shortName + ' · ' + m.seats.toLocaleString('en-GB') + ' seats';
    }

    document.getElementById('aek-kpi-annual-spend').textContent = formatMoney(m.annualSpend);
    document.getElementById('aek-kpi-annual-sub').textContent =
      formatMoney(m.monthlySpend) + ' / mo across ' + m.seats.toLocaleString('en-GB') + ' seats';

    document.getElementById('aek-kpi-waste').textContent = formatMoney(m.annualWaste);
    document.getElementById('aek-kpi-waste-sub').textContent =
      m.dormantNow.toLocaleString('en-GB') + ' dormant seats (' + m.wastePct + '%) burning ' + formatMoney(m.monthlyWaste) + '/mo';

    document.getElementById('aek-kpi-breakeven').textContent = formatMins(m.breakEvenMins);
    document.getElementById('aek-kpi-breakeven-sub').textContent =
      formatMins(m.effectiveBreakEvenMins) + ' per active user carrying ' + m.wastePct + '% dormant seats';

    document.getElementById('aek-kpi-reclaimed').textContent = formatMoney(m.totalLicenceReclaimedAnnual);
    document.getElementById('aek-kpi-reclaimed-sub').textContent =
      formatMoney(m.reclaimedLicenceAnnual) + ' reactivated + ' + formatMoney(m.harvestedLicenceAnnual) + ' reclaimed idle seats/yr';

    renderGaugeSvg(m);
    renderCurveSvg(m);
    renderTieringRecommendation(m);
  }

  function renderGaugeSvg(m) {
    var isTarget = state.gaugeMode === 'target';
    var power = isTarget ? m.powerTarget : m.powerNow;
    var casual = isTarget ? m.casualTarget : m.casualNow;
    var dormant = isTarget ? m.dormantTarget : m.dormantNow;
    var active = power + casual;
    var activePct = Math.round((active / m.seats) * 100);

    var r = 102;
    var arcLen = Math.PI * r; // ~320.44
    var pLen = (power / m.seats) * arcLen;
    var cLen = (casual / m.seats) * arcLen;
    var dLen = Math.max(0, arcLen - pLen - cLen);

    var svg = document.getElementById('aek-gauge-svg');
    if (svg) {
      svg.setAttribute(
        'aria-label',
        (isTarget ? 'Day-90 target' : 'Current') +
          ' seat utilisation: ' + activePct + '% active (' + power + ' power users, ' + casual + ' casual users) and ' + dormant + ' dormant seats.'
      );
      svg.innerHTML =
        '<path d="M 28 132 A 102 102 0 0 1 232 132" fill="none" stroke="#232331" stroke-width="20" stroke-linecap="butt" />' +
        '<path d="M 28 132 A 102 102 0 0 1 232 132" fill="none" stroke="#00eefc" stroke-width="20" stroke-linecap="butt" stroke-dasharray="' + pLen.toFixed(2) + ' ' + arcLen.toFixed(2) + '" stroke-dashoffset="0" />' +
        '<path d="M 28 132 A 102 102 0 0 1 232 132" fill="none" stroke="#fbbf24" stroke-width="20" stroke-linecap="butt" stroke-dasharray="' + cLen.toFixed(2) + ' ' + arcLen.toFixed(2) + '" stroke-dashoffset="' + (-pLen).toFixed(2) + '" />' +
        '<path d="M 28 132 A 102 102 0 0 1 232 132" fill="none" stroke="#ff007f" stroke-width="20" stroke-linecap="butt" stroke-dasharray="' + dLen.toFixed(2) + ' ' + arcLen.toFixed(2) + '" stroke-dashoffset="' + (-(pLen + cLen)).toFixed(2) + '" />' +
        '<text x="130" y="102" text-anchor="middle" fill="#f8f5fd" font-family="Space Grotesk, sans-serif" font-size="34" font-weight="900">' + activePct + '%</text>' +
        '<text x="130" y="122" text-anchor="middle" fill="#b6b4c2" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700" letter-spacing="0.06em">' +
          (isTarget ? 'DAY-90 ACTIVE TARGET' : 'WEEKLY ACTIVE TODAY') +
        '</text>' +
        '<text x="130" y="140" text-anchor="middle" fill="#00eefc" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="700">' +
          active.toLocaleString('en-GB') + ' of ' + m.seats.toLocaleString('en-GB') + ' seats' +
        '</text>';
    }

    var pPct = Math.round((power / m.seats) * 100);
    var cPct = Math.round((casual / m.seats) * 100);
    var dPct = Math.max(0, 100 - pPct - cPct);

    var legend = document.getElementById('aek-gauge-legend');
    if (legend) {
      legend.innerHTML =
        '<div class="aek-legend-item">' +
          '<span class="aek-legend-top"><span class="aek-dot aek-dot--power"></span>Power</span>' +
          '<span class="aek-legend-val">' + power.toLocaleString('en-GB') + '</span>' +
          '<span class="aek-legend-sub">' + pPct + '% (3+ days/wk)</span>' +
        '</div>' +
        '<div class="aek-legend-item">' +
          '<span class="aek-legend-top"><span class="aek-dot aek-dot--casual"></span>Casual</span>' +
          '<span class="aek-legend-val">' + casual.toLocaleString('en-GB') + '</span>' +
          '<span class="aek-legend-sub">' + cPct + '% (1-2 prompts/wk)</span>' +
        '</div>' +
        '<div class="aek-legend-item">' +
          '<span class="aek-legend-top"><span class="aek-dot aek-dot--dormant"></span>Dormant</span>' +
          '<span class="aek-legend-val">' + dormant.toLocaleString('en-GB') + '</span>' +
          '<span class="aek-legend-sub">' + dPct + '% shelfware</span>' +
        '</div>';
    }

    var nowP = (m.powerNow / m.seats) * 100;
    var nowC = (m.casualNow / m.seats) * 100;
    var nowD = Math.max(0, 100 - nowP - nowC);

    var tgtP = (m.powerTarget / m.seats) * 100;
    var tgtC = (m.casualTarget / m.seats) * 100;
    var tgtD = Math.max(0, 100 - tgtP - tgtC);

    var bars = document.getElementById('aek-compare-bars');
    if (bars) {
      bars.innerHTML =
        '<div class="aek-cbar-row">' +
          '<div class="aek-cbar-label"><span>Today (' + m.curPct + '% active)</span><span>' + m.dormantNow + ' dormant</span></div>' +
          '<div class="aek-cbar-track">' +
            '<div class="aek-cbar-seg--power" style="width:' + nowP.toFixed(1) + '%"></div>' +
            '<div class="aek-cbar-seg--casual" style="width:' + nowC.toFixed(1) + '%"></div>' +
            '<div class="aek-cbar-seg--dormant" style="width:' + nowD.toFixed(1) + '%"></div>' +
          '</div>' +
        '</div>' +
        '<div class="aek-cbar-row">' +
          '<div class="aek-cbar-label"><span>Day-90 Target (' + m.tgtPct + '% active)</span><span>' + m.dormantTarget + ' to reclaim</span></div>' +
          '<div class="aek-cbar-track">' +
            '<div class="aek-cbar-seg--power" style="width:' + tgtP.toFixed(1) + '%"></div>' +
            '<div class="aek-cbar-seg--casual" style="width:' + tgtC.toFixed(1) + '%"></div>' +
            '<div class="aek-cbar-seg--dormant" style="width:' + tgtD.toFixed(1) + '%"></div>' +
          '</div>' +
        '</div>';
    }
  }

  function renderCurveSvg(m) {
    var padL = 44;
    var padR = 24;
    var padT = 22;
    var padB = 34;
    var W = 520;
    var H = 230;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    function xForWeek(wk) {
      return padL + (wk / 12) * plotW;
    }
    function yForPct(pct) {
      return padT + plotH - (Math.min(100, Math.max(0, pct)) / 100) * plotH;
    }

    var start = m.curPct;
    var end = Math.max(m.curPct, m.tgtPct);
    var delta = end - start;

    // Realistic S-curve across Weeks 0 to 12
    var rampFactors = [0, 0.04, 0.09, 0.16, 0.26, 0.40, 0.56, 0.70, 0.81, 0.89, 0.94, 0.98, 1.0];
    var enablementPts = [];
    var statusQuoPts = [];

    for (var wk = 0; wk <= 12; wk++) {
      var ePct = start + delta * rampFactors[wk];
      // Unassisted rollout typically slips slightly after launch curiosity fades
      var sqPct = Math.max(5, start - (wk > 2 ? Math.min(4, (wk - 2) * 0.35) : 0));
      enablementPts.push({ wk: wk, pct: ePct, x: xForWeek(wk), y: yForPct(ePct) });
      statusQuoPts.push({ wk: wk, pct: sqPct, x: xForWeek(wk), y: yForPct(sqPct) });
    }

    var enableLine = enablementPts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
    var sqLine = statusQuoPts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');

    var areaPts = enablementPts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); })
      .concat(statusQuoPts.slice().reverse().map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }))
      .join(' ');

    var yTicks = [0, 25, 50, 75, 100];
    var gridMarkup = '';
    yTicks.forEach(function (val) {
      var y = yForPct(val).toFixed(1);
      gridMarkup +=
        '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="rgba(248,245,253,0.08)" stroke-width="1" />' +
        '<text x="' + (padL - 8) + '" y="' + (Number(y) + 4) + '" text-anchor="end" fill="#b6b4c2" font-family="Space Grotesk, sans-serif" font-size="10">' + val + '%</text>';
    });

    // Phase divider lines at Week 4 and Week 8
    var x4 = xForWeek(4).toFixed(1);
    var x8 = xForWeek(8).toFixed(1);
    var x12 = xForWeek(12).toFixed(1);
    var phaseBands =
      '<rect x="' + padL + '" y="' + padT + '" width="' + (plotW / 3).toFixed(1) + '" height="' + plotH + '" fill="rgba(0,238,252,0.03)" />' +
      '<rect x="' + x8 + '" y="' + padT + '" width="' + (plotW / 3).toFixed(1) + '" height="' + plotH + '" fill="rgba(34,197,94,0.035)" />' +
      '<line x1="' + x4 + '" y1="' + padT + '" x2="' + x4 + '" y2="' + (padT + plotH) + '" stroke="rgba(248,245,253,0.14)" stroke-dasharray="3 3" />' +
      '<line x1="' + x8 + '" y1="' + padT + '" x2="' + x8 + '" y2="' + (padT + plotH) + '" stroke="rgba(248,245,253,0.14)" stroke-dasharray="3 3" />' +
      '<text x="' + (padL + plotW / 6).toFixed(1) + '" y="' + (padT + 13) + '" text-anchor="middle" fill="#b6b4c2" font-family="Space Grotesk, sans-serif" font-size="9.5" font-weight="700">DAYS 1-30</text>' +
      '<text x="' + (padL + plotW / 2).toFixed(1) + '" y="' + (padT + 13) + '" text-anchor="middle" fill="#b6b4c2" font-family="Space Grotesk, sans-serif" font-size="9.5" font-weight="700">DAYS 31-60</text>' +
      '<text x="' + (padL + (plotW * 5) / 6).toFixed(1) + '" y="' + (padT + 13) + '" text-anchor="middle" fill="#b6b4c2" font-family="Space Grotesk, sans-serif" font-size="9.5" font-weight="700">DAYS 61-90</text>';

    var xLabels = [
      { wk: 0, label: 'Wk 0' },
      { wk: 4, label: 'Wk 4 (Day 30)' },
      { wk: 8, label: 'Wk 8 (Day 60)' },
      { wk: 12, label: 'Wk 12 (Day 90)' }
    ];
    var xAxisMarkup = '';
    xLabels.forEach(function (item) {
      xAxisMarkup +=
        '<text x="' + xForWeek(item.wk).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" fill="#b6b4c2" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="700">' + item.label + '</text>';
    });

    // Milestone dots on enablement curve
    var markers = [0, 4, 8, 12];
    var dotsMarkup = '';
    markers.forEach(function (wk) {
      var pt = enablementPts[wk];
      var pctLbl = Math.round(pt.pct) + '%';
      var labelY = Math.max(padT + 14, pt.y - 10);
      dotsMarkup +=
        '<circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="4.5" fill="#0e0e13" stroke="#00eefc" stroke-width="2.5" />' +
        '<text x="' + pt.x.toFixed(1) + '" y="' + labelY.toFixed(1) + '" text-anchor="middle" fill="#00eefc" font-family="Space Grotesk, sans-serif" font-size="10.5" font-weight="800">' + pctLbl + '</text>';
    });

    var endSq = statusQuoPts[12];
    var sqLabelMarkup =
      '<text x="' + (endSq.x - 4).toFixed(1) + '" y="' + Math.min(padT + plotH - 4, endSq.y + 14).toFixed(1) + '" text-anchor="end" fill="#ff5ca8" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="700">Unassisted (~' + Math.round(endSq.pct) + '%)</text>';

    var svg = document.getElementById('aek-curve-svg');
    if (svg) {
      svg.setAttribute(
        'aria-label',
        '90-day adoption curve moving weekly active usage from ' + m.curPct + '% at Week 0 to ' + m.tgtPct + '% at Week 12, compared against an unassisted rollout flatlining near ' + Math.round(endSq.pct) + '%.'
      );
      svg.innerHTML =
        '<defs>' +
          '<linearGradient id="aek-area-grad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#00eefc" stop-opacity="0.28" />' +
            '<stop offset="100%" stop-color="#22c55e" stop-opacity="0.04" />' +
          '</linearGradient>' +
          '<linearGradient id="aek-line-grad" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0%" stop-color="#00eefc" />' +
            '<stop offset="100%" stop-color="#22c55e" />' +
          '</linearGradient>' +
        '</defs>' +
        phaseBands +
        gridMarkup +
        '<polygon points="' + areaPts + '" fill="url(#aek-area-grad)" />' +
        '<polyline points="' + sqLine + '" fill="none" stroke="#ff007f" stroke-width="2" stroke-dasharray="6 4" />' +
        '<polyline points="' + enableLine + '" fill="none" stroke="url(#aek-line-grad)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />' +
        dotsMarkup +
        sqLabelMarkup +
        xAxisMarkup;
    }

    var foot = document.getElementById('aek-curve-foot');
    if (foot) {
      foot.innerHTML =
        '<div class="aek-curve-stat"><span>Newly Active Seats</span><strong class="aek-text-cyan">+' + m.newlyActivated.toLocaleString('en-GB') + ' staff</strong></div>' +
        '<div class="aek-curve-stat"><span>Day-60 Reclaim Pool</span><strong class="aek-text-pink">' + m.harvestableDormant.toLocaleString('en-GB') + ' idle seats</strong></div>' +
        '<div class="aek-curve-stat"><span>Net Time Upside (Est.)</span><strong class="aek-text-green">+' + formatMoney(m.incrementalNetTimeValueAnnual) + '/yr</strong></div>';
    }
  }

  function renderTieringRecommendation(m) {
    var stack = getStackInfo();
    var sym = (CURRENCIES[state.currency] || CURRENCIES.GBP).symbol;
    var badge = document.getElementById('aek-tiering-savings-badge');
    var lead = document.getElementById('aek-tiering-lead');
    var pillars = document.getElementById('aek-tiering-pillars');
    var formula = document.getElementById('aek-formula-note');

    if (m.seats <= 30) {
      badge.textContent = 'Small-team rule: 45-day check';
      lead.textContent =
        'With ' + m.seats + ' total seats at ' + sym + m.cost + '/mo, full enterprise tiering adds more admin overhead than it saves. Licence the whole team alongside ' + m.champMin + ' named Champions, publish 3 workflows per department in Week 2, and run a strict 45-day usage check to drop unused licences.';
    } else if (m.seats > 500) {
      badge.textContent = 'Est. Q1 cash avoided: ' + formatMoney(m.q1CashSaved);
      lead.textContent =
        'Do not buy ' + m.seats.toLocaleString('en-GB') + ' ' + sym + m.cost + '/mo seats on Day 1 (' + formatMoney(m.q1BlanketSpend) + ' in Q1 alone while ' + m.wastePct + '% sit idle). Start with a ' + m.wave1Seats.toLocaleString('en-GB') + '-seat Champion & Priority cohort, automate SSO/SCIM de-provisioning after 30 days of zero sessions, and charge licences back to department budgets in Q2.';
    } else {
      badge.textContent = 'Est. Q1 cash avoided: ' + formatMoney(m.q1CashSaved);
      lead.textContent =
        'Do not buy ' + m.seats.toLocaleString('en-GB') + ' ' + sym + m.cost + '/mo ' + stack.shortName + ' seats on Day 1. Buying blanket seats commits ' + formatMoney(m.q1BlanketSpend) + ' in Q1 while ' + m.dormantNow.toLocaleString('en-GB') + ' licences sit dormant. Start with a ' + m.wave1Seats.toLocaleString('en-GB') + '-seat Champion cohort, open Wave 2 only after teams publish working workflows, and reclaim inactive seats at Day 60.';
    }

    pillars.innerHTML =
      '<div class="aek-tier-pillar">' +
        '<strong>Wave 1 (Days 1 to 30): ' + m.wave1Seats.toLocaleString('en-GB') + ' Seats</strong>' +
        '<p>Provision ' + m.champMin + ' to ' + m.champMax + ' Champions plus heavy document/code roles first. Keep everyone else on free approved chat or a waitlist until department starter packs are live.</p>' +
      '</div>' +
      '<div class="aek-tier-pillar">' +
        '<strong>Wave 2 (Days 31 to 60): Up to ' + m.wave2Seats.toLocaleString('en-GB') + ' Seats</strong>' +
        '<p>Issue paid licences strictly to staff who attend a 20-minute clinic or submit one real weekly task they want to speed up. Zero "just in case" provisioning.</p>' +
      '</div>' +
      '<div class="aek-tier-pillar">' +
        '<strong>Day-60 Reclaim Loop: 30-Day Rule</strong>' +
        '<p>Any seat with fewer than 2 sessions in 30 days triggers an automated 7-day nudge email, then returns to the request pool. Reclaiming ' + m.harvestableDormant.toLocaleString('en-GB') + ' stubborn seats recovers ' + formatMoney(m.harvestedLicenceAnnual) + '/yr.</p>' +
      '</div>';

    formula.textContent =
      'Transparent maths: Break-even assumes ' + WORKING_WEEKS + ' working weeks/yr (accounting for UK annual leave and bank holidays). Conservative net time upside models 90 net min/wk for Power Users and 25 net min/wk for Casual Users after subtracting ~25% fact-checking and rework time. The headline green KPI counts direct licence spend only, not soft time claims.';
  }

  /* ── TAB 1: 12-WEEK ROADMAP & CHAMPION NETWORK ── */
  function getRoadmapPhases(m) {
    var org = getOrgDisplay();
    var stack = getStackInfo();
    var risk = RISK_TIERS[state.riskTier];
    var deptNames = getSelectedDepartments().map(function (d) { return d.name; }).join(', ');

    return [
      {
        id: 'p1',
        tag: 'Phase 1 · Days 1 to 30',
        title: 'Guardrails, Champions & Baseline',
        goal: 'Set clear data rules, stop silent shadow AI, and prove real tasks with a small cohort.',
        items: [
          {
            id: 'p1_1',
            week: 'Wk 1',
            text: 'Sign off and publish ' + org + '\'s 1-page Traffic-Light Acceptable Use Policy (' + risk.short + ') with InfoSec and Legal.'
          },
          {
            id: 'p1_2',
            week: 'Wk 1',
            text: 'Audit corporate card spend for shadow AI subscriptions and lock baseline active weekly usage (currently ' + m.curPct + '%).'
          },
          {
            id: 'p1_3',
            week: 'Wk 2',
            text: 'Recruit ' + m.champMin + ' to ' + m.champMax + ' Champions across ' + deptNames + ' (1 per 12 to 15 staff) with 2 hrs/week ring-fenced.'
          },
          {
            id: 'p1_4',
            week: 'Wk 2',
            text: 'Provision ' + m.wave1Seats.toLocaleString('en-GB') + ' paid ' + stack.shortName + ' seats to Champions first; confirm SSO and zero-training settings.'
          },
          {
            id: 'p1_5',
            week: 'Wk 4',
            text: 'Run a 2-week Champion time log on 3 repeatable tasks per team, measuring net time after review and rework.'
          }
        ]
      },
      {
        id: 'p2',
        tag: 'Phase 2 · Days 31 to 60',
        title: 'Department Workflows & Clinic Hours',
        goal: 'Move past blank-prompt curiosity into repeatable weekly workflows.',
        items: [
          {
            id: 'p2_1',
            week: 'Wk 5',
            text: 'Publish vetted Department Starter Packs (3 workflows + copyable prompts + red lines) for all ' + state.departments.length + ' departments in scope.'
          },
          {
            id: 'p2_2',
            week: 'Wk 5',
            text: 'Launch weekly 30-minute "Show Your Screen" clinic hours led by Champions (zero slides, live task fixes only).'
          },
          {
            id: 'p2_3',
            week: 'Wk 6',
            text: 'Expand paid seats to Wave 2 (up to ' + m.wave2Seats.toLocaleString('en-GB') + ' seats) strictly for staff who complete a 20-minute workflow onboarding.'
          },
          {
            id: 'p2_4',
            week: 'Wk 7',
            text: 'Open a shared #ai-workflows channel where staff post working prompts and flag hallucinations or failure modes.'
          },
          {
            id: 'p2_5',
            week: 'Wk 8',
            text: 'Run a Day-45 pulse check tracking Weekly Repeat Workflow Rate and QA/escalation incidents (target < ' + risk.maxErrorPct + '%).'
          }
        ]
      },
      {
        id: 'p3',
        tag: 'Phase 3 · Days 61 to 90',
        title: 'Licence Reclaim, Measurement & Scale',
        goal: 'Cut dormant spend, prove review-adjusted ROI and hand rhythm to departments.',
        items: [
          {
            id: 'p3_1',
            week: 'Wk 9',
            text: 'Run the Day-60 inactivity sweep: send a 7-day check-in to staff with < 2 sessions in 30 days, then reclaim dormant seats.'
          },
          {
            id: 'p3_2',
            week: 'Wk 10',
            text: 'Reallocate reclaimed seats to waitlisted power users or downgrade idle licences (up to ' + formatMoney(m.harvestedLicenceAnnual) + '/yr saved).'
          },
          {
            id: 'p3_3',
            week: 'Wk 10',
            text: 'Collect review-adjusted time evidence from 5+ workflows per department confirming staff beat the ' + formatMins(m.breakEvenMins) + ' break-even.'
          },
          {
            id: 'p3_4',
            week: 'Wk 11',
            text: 'Deliver a 1-page Day-90 Board & Finance Readout comparing baseline (' + m.curPct + '%) vs Day-90 (' + m.tgtPct + '%) adoption and reclaimed spend.'
          },
          {
            id: 'p3_5',
            week: 'Wk 12',
            text: 'Transition quarterly prompt pack refreshes and new-starter onboarding to the Champion network.'
          }
        ]
      }
    ];
  }

  function renderRoadmap(m) {
    var phases = getRoadmapPhases(m);
    var totalItems = 0;
    var doneItems = 0;

    phases.forEach(function (p) {
      p.items.forEach(function (item) {
        totalItems++;
        if (state.checkedMilestones[item.id]) doneItems++;
      });
    });

    var pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

    document.getElementById('aek-champ-count').textContent = m.champMin + ' to ' + m.champMax + ' Champions';
    document.getElementById('aek-champ-hours').textContent = '2 hrs / wk each';
    document.getElementById('aek-champ-hours-sub').textContent =
      '~' + (m.champMin * 2) + ' to ' + (m.champMax * 2) + ' total protected hours/wk across ' + state.departments.length + ' departments';
    document.getElementById('aek-readiness-pct').textContent = pct + '%';
    document.getElementById('aek-readiness-fill').style.width = pct + '%';
    document.getElementById('aek-playbook-progress-badge').textContent =
      doneItems + ' / ' + totalItems + ' milestones checked';

    var grid = document.getElementById('aek-phases-grid');
    if (!grid) return;

    var html = '';
    phases.forEach(function (phase) {
      html += '<article class="aek-phase-card">';
      html += '<div class="aek-phase-head">';
      html += '<span class="aek-phase-tag">' + escapeHtml(phase.tag) + '</span>';
      html += '<h3 class="aek-phase-title">' + escapeHtml(phase.title) + '</h3>';
      html += '<p class="aek-phase-goal">' + escapeHtml(phase.goal) + '</p>';
      html += '</div>';
      html += '<ul class="aek-checklist">';
      phase.items.forEach(function (item) {
        var checkedAttr = state.checkedMilestones[item.id] ? ' checked' : '';
        html +=
          '<li class="aek-check-item">' +
            '<label>' +
              '<input type="checkbox" class="aek-milestone-cb" data-milestone="' + escapeHtml(item.id) + '"' + checkedAttr + '>' +
              '<span><span class="aek-check-week">' + escapeHtml(item.week) + '</span>' + escapeHtml(item.text) + '</span>' +
            '</label>' +
          '</li>';
      });
      html += '</ul></article>';
    });

    grid.innerHTML = html;
  }

  /* ── TAB 2: DEPARTMENT WORKFLOW & PROMPT STARTER PACKS ── */
  function getSelectedDepartments() {
    var selected = DEPARTMENTS.filter(function (d) {
      return state.departments.indexOf(d.id) !== -1;
    });
    return selected.length ? selected : [DEPARTMENTS[0]];
  }

  function renderWorkflows() {
    var selected = getSelectedDepartments();
    var risk = RISK_TIERS[state.riskTier];

    if (
      state.workflowFilter !== 'all' &&
      !selected.some(function (d) { return d.id === state.workflowFilter; })
    ) {
      state.workflowFilter = 'all';
    }

    var filterWrap = document.getElementById('aek-workflow-filter-pills');
    if (filterWrap) {
      var pillsHtml =
        '<button type="button" class="aek-filter-pill' + (state.workflowFilter === 'all' ? ' active' : '') + '" data-wf-filter="all">All selected (' + selected.length + ')</button>';
      selected.forEach(function (dept) {
        pillsHtml +=
          '<button type="button" class="aek-filter-pill' + (state.workflowFilter === dept.id ? ' active' : '') + '" data-wf-filter="' + escapeHtml(dept.id) + '">' + escapeHtml(dept.name) + '</button>';
      });
      filterWrap.innerHTML = pillsHtml;
    }

    var toShow = state.workflowFilter === 'all'
      ? selected
      : selected.filter(function (d) { return d.id === state.workflowFilter; });

    var listEl = document.getElementById('aek-workflows-list');
    if (!listEl) return;

    var html = '';
    toShow.forEach(function (dept) {
      var combinedRedLines = dept.redLines.concat(risk.extraRedLines);
      html += '<section class="aek-dept-pack" aria-label="' + escapeHtml(dept.name) + ' starter pack">';
      html += '<div class="aek-dept-pack-head">';
      html += '<h4 class="aek-dept-pack-title"><span class="material-symbols-outlined" aria-hidden="true">' + escapeHtml(dept.icon) + '</span>' + escapeHtml(dept.name) + ' Starter Pack</h4>';
      html += '<span class="aek-dept-pack-badge">3 repeatable workflows · ' + escapeHtml(risk.short) + '</span>';
      html += '</div>';

      html += '<div class="aek-workflow-cards">';
      dept.workflows.forEach(function (wf, idx) {
        var pid = dept.id + '_' + idx;
        html += '<article class="aek-wf-card">';
        html += '<div class="aek-wf-top">';
        html += '<h5 class="aek-wf-name">' + escapeHtml(wf.name) + '</h5>';
        html += '<span class="aek-wf-save">' + escapeHtml(wf.saves) + '</span>';
        html += '</div>';
        html += '<p class="aek-wf-when"><strong>When:</strong> ' + escapeHtml(wf.when) + '</p>';
        html += '<div class="aek-prompt-box" data-prompt-id="' + escapeHtml(pid) + '">' + escapeHtml(wf.prompt) + '</div>';
        html += '<p class="aek-wf-check">' + escapeHtml(wf.check) + '</p>';
        html += '<button type="button" class="aek-copy-prompt-btn" data-copy-prompt="' + escapeHtml(pid) + '"><span class="material-symbols-outlined" aria-hidden="true">content_copy</span>Copy prompt</button>';
        html += '</article>';
      });
      html += '</div>';

      html += '<div class="aek-redline-box">';
      html += '<p class="aek-redline-title"><span class="material-symbols-outlined" aria-hidden="true">block</span>Never paste this (' + escapeHtml(dept.name) + ' red lines)</p>';
      html += '<ul class="aek-redline-list">';
      combinedRedLines.forEach(function (line) {
        html += '<li>' + escapeHtml(line) + '</li>';
      });
      html += '</ul></div>';

      html += '</section>';
    });

    listEl.innerHTML = html;
  }

  /* ── TAB 3: PLAIN-ENGLISH ACCEPTABLE USE ONE-PAGER ── */
  function getTrafficLightRules() {
    var tier = state.riskTier;
    var green = [
      'Public web copy, published product docs, press releases and open-source code snippets.',
      'Generic templates, blank frameworks, brainstorming prompts and synthetic dummy datasets.',
      'Internal process drafts with all customer names, account numbers and commercial figures stripped out.'
    ];

    var amber = [
      'Internal strategy memos, anonymised customer feedback and aggregated team metrics (approved enterprise workspace only).',
      'Draft proposals, SOPs and code modules with secrets, credentials and personal identifiers replaced by placeholders like [CLIENT_A].',
      'Meeting transcripts only when all attendees were notified and no Red-tier topics were discussed.'
    ];

    var red = [
      'Passwords, API keys, OAuth tokens, private keys, production database dumps or source code restricted by client NDA.',
      'Unreleased financials, payroll, individual HR/disciplinary notes, M&A plans or board-confidential forecasts.',
      'Raw customer PII (names + emails, addresses, DOBs, payment details) pasted into any personal or unapproved AI account.'
    ];

    if (tier === 'mid') {
      amber[0] = 'Internal B2B notes and pseudonymised customer records ONLY inside our zero-retention enterprise workspace with a signed DPA.';
      red.push('Unmasked customer health-adjacent records, support tickets containing identifiable personal data, or unapproved third-party plugins.');
    } else if (tier === 'high') {
      amber[0] = 'Strictly anonymised internal drafts and public regulatory texts ONLY inside our SSO-logged enterprise workspace.';
      red.push('Customer KYC files, ID scans, source-of-funds evidence, player/client account IDs, AML/SAR reports and vulnerability records.');
      red.push('Legally privileged advice, live regulatory correspondence, court filings or compliance audit evidence.');
    }

    return { green: green, amber: amber, red: red };
  }

  function generatePolicyMarkdown() {
    var org = getOrgDisplay();
    var stack = getStackInfo();
    var risk = RISK_TIERS[state.riskTier];
    var tl = getTrafficLightRules();

    var lines = [
      '# ' + org + ' - Plain-English AI Acceptable Use Policy (1-Page Guide)',
      '',
      'Risk Profile: ' + risk.label + ' | Approved Tool: ' + stack.name,
      '',
      '## 1. Approved Tools & Shadow AI Policy',
      '- Use our approved enterprise workspace (' + stack.name + ') with company SSO enabled. Enterprise settings prevent prompts from training public models.',
      '- Do not paste company, client or customer material into personal free AI accounts, unapproved browser extensions or mobile apps.',
      '- Need a new AI tool? Submit a 3-line request to IT/Enablement. We commit to a fast-track security decision within ' + risk.slaDays + ' working days so you never need to work around the rules.',
      '',
      '## 2. Traffic-Light Data Rules',
      '### GREEN - Safe in approved tools',
      tl.green.map(function (x) { return '- ' + x; }).join('\n'),
      '',
      '### AMBER - Approved enterprise workspace only (anonymise first)',
      tl.amber.map(function (x) { return '- ' + x; }).join('\n'),
      '',
      '### RED - Never paste into any AI tool',
      tl.red.map(function (x) { return '- ' + x; }).join('\n'),
      '',
      '## 3. Human Sign-Off Rule',
      '- ' + risk.signOffRule,
      '- Check every number, legal clause, code snippet and citation against a primary source before sending externally.',
      '',
      '## 4. Disclosure & Provenance Rule',
      '- ' + risk.disclosureRule,
      '- ' + risk.regulatorNote,
      '',
      '## 5. No-Blame 15-Minute Incident Rule',
      '- If you accidentally paste Red-tier data into an AI tool, notify InfoSec / your Data Protection Officer within 15 minutes with the timestamp and tool used. Fast reporting lets us revoke keys or contain exposure; hiding mistakes creates regulatory risk.'
    ];

    return lines.join('\n');
  }

  function getActivePolicyText() {
    return (state.customPolicy && state.customPolicy.trim())
      ? state.customPolicy
      : generatePolicyMarkdown();
  }

  function renderPolicyHtmlFromMarkdown(md) {
    var lines = md.split(/\r?\n/);
    var html = '';
    var inList = false;

    function closeList() {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    }

    lines.forEach(function (rawLine) {
      var line = rawLine.trim();
      if (!line) {
        closeList();
        return;
      }
      if (line.indexOf('### ') === 0) {
        closeList();
        html += '<h4>' + escapeHtml(line.slice(4)) + '</h4>';
      } else if (line.indexOf('## ') === 0) {
        closeList();
        html += '<h4>' + escapeHtml(line.slice(3)) + '</h4>';
      } else if (line.indexOf('# ') === 0) {
        closeList();
        html += '<h4>' + escapeHtml(line.slice(2)) + '</h4>';
      } else if (line.indexOf('- ') === 0) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += '<li>' + escapeHtml(line.slice(2)) + '</li>';
      } else {
        closeList();
        html += '<p>' + escapeHtml(line) + '</p>';
      }
    });
    closeList();
    return html;
  }

  function renderPolicy() {
    var risk = RISK_TIERS[state.riskTier];
    var stack = getStackInfo();
    var tl = getTrafficLightRules();

    document.getElementById('aek-policy-meta-sub').textContent =
      'Built for ' + getOrgDisplay() + ' · ' + stack.name + ' · ' + risk.label + (state.customPolicy ? ' (custom edits active)' : '');

    var trafficGrid = document.getElementById('aek-traffic-grid');
    if (trafficGrid) {
      trafficGrid.innerHTML =
        '<div class="aek-traffic-card aek-traffic-card--green">' +
          '<div class="aek-traffic-head aek-text-green"><span class="material-symbols-outlined" aria-hidden="true">check_circle</span>Green - Safe to Use</div>' +
          '<ul class="aek-traffic-list">' + tl.green.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="aek-traffic-card aek-traffic-card--amber">' +
          '<div class="aek-traffic-head aek-text-amber"><span class="material-symbols-outlined" aria-hidden="true">warning</span>Amber - Anonymise First</div>' +
          '<ul class="aek-traffic-list">' + tl.amber.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="aek-traffic-card aek-traffic-card--red">' +
          '<div class="aek-traffic-head aek-text-red"><span class="material-symbols-outlined" aria-hidden="true">dangerous</span>Red - Never Paste</div>' +
          '<ul class="aek-traffic-list">' + tl.red.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>' +
        '</div>';
    }

    var policyText = getActivePolicyText();
    var previewEl = document.getElementById('aek-policy-preview');
    var editorWrap = document.getElementById('aek-policy-editor-wrap');
    var textarea = document.getElementById('aek-policy-textarea');
    var toggleBtn = document.getElementById('aek-toggle-edit-policy-btn');

    if (previewEl) {
      previewEl.innerHTML = renderPolicyHtmlFromMarkdown(policyText);
      previewEl.hidden = state.editingPolicy;
    }
    if (editorWrap) {
      editorWrap.hidden = !state.editingPolicy;
    }
    if (textarea && document.activeElement !== textarea) {
      textarea.value = policyText;
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', state.editingPolicy ? 'true' : 'false');
      toggleBtn.innerHTML = state.editingPolicy
        ? '<span class="material-symbols-outlined" aria-hidden="true">visibility</span>Preview Policy'
        : '<span class="material-symbols-outlined" aria-hidden="true">edit_note</span>Edit Text';
    }
  }

  /* ── TAB 4: ANTI-VANITY KPI TRACKER ── */
  function getKpiRows(m) {
    var risk = RISK_TIERS[state.riskTier];
    var repeatTarget = Math.max(45, Math.round(m.tgtPct * 0.8));
    var netMinsTarget = Math.max(30, Math.ceil((m.breakEvenMins * 3) / 5) * 5);

    return [
      {
        vanity: 'Total logins / seats provisioned',
        real: 'Weekly Repeat Workflow Rate (WRWR)',
        measure: '% of licensed staff running the same named work workflow 2+ times per week (tracked via workspace analytics + short bi-weekly Champion pulse).',
        target: '>= ' + repeatTarget + '% by Day 90 (up from ' + m.curPct + '% baseline)'
      },
      {
        vanity: 'Self-reported "hours saved"',
        real: 'Review-Adjusted Time Saved',
        measure: 'Timed before/after runs on 3 department workflows minus prompting, fact-checking and rework minutes.',
        target: '>= ' + netMinsTarget + ' net min/wk per active user (3x your ' + m.breakEvenMins.toFixed(1) + ' min break-even)'
      },
      {
        vanity: 'Total prompts generated',
        real: 'Error, Hallucination & Escalation Rate',
        measure: '% of AI-assisted drafts rejected at QA, peer review, compliance check or escalated by customers.',
        target: '< ' + risk.maxErrorPct + '% (' + risk.short + ' threshold)'
      },
      {
        vanity: 'Total AI budget deployed',
        real: 'Inactive Seat Reclaim Rate',
        measure: '% of licences with < 2 sessions in 30 days recovered or downgraded within 14 days of audit.',
        target: '>= 85% reclaimed within 14 days'
      },
      {
        vanity: 'Training slide completion %',
        real: 'Vetted Template Reuse Rate',
        measure: '% of staff reusing a shared department starter prompt instead of typing ad-hoc blank-box queries.',
        target: '>= 60% of active weekly users by Day 60'
      },
      {
        vanity: '"Zero policy breaches" (unmeasured)',
        real: 'Shadow AI Fast-Track SLA',
        measure: '% of employee requests for new AI tools reviewed and answered (approved or declined with alternative) within SLA.',
        target: '>= 90% answered within ' + risk.slaDays + ' working days'
      }
    ];
  }

  function renderKpis(m) {
    var rows = getKpiRows(m);
    var tbody = document.getElementById('aek-kpi-tbody');
    if (tbody) {
      tbody.innerHTML = rows.map(function (r) {
        return (
          '<tr>' +
            '<td><span class="aek-vanity-strike">' + escapeHtml(r.vanity) + '</span></td>' +
            '<td><span class="aek-kpi-name">' + escapeHtml(r.real) + '</span></td>' +
            '<td>' + escapeHtml(r.measure) + '</td>' +
            '<td><span class="aek-kpi-target">' + escapeHtml(r.target) + '</span></td>' +
          '</tr>'
        );
      }).join('');
    }
    renderAuditScorecard(m);
  }

  function renderAuditScorecard(m) {
    var risk = RISK_TIERS[state.riskTier];
    var wrwrTarget = Math.max(45, Math.round(m.tgtPct * 0.8));
    var netTarget = Math.max(30, Math.ceil((m.breakEvenMins * 3) / 5) * 5);

    var a = state.audit;
    var score = 0;
    var findings = [];

    if (a.wrwr >= wrwrTarget) {
      score += 25;
      findings.push('Repeat workflow rate (' + a.wrwr + '%) hits your Day-90 benchmark (' + wrwrTarget + '%).');
    } else if (a.wrwr >= Math.round(wrwrTarget * 0.65)) {
      score += 15;
      findings.push('Repeat workflow rate (' + a.wrwr + '%) shows traction, but needs more clinic hours to reach ' + wrwrTarget + '%.');
    } else {
      findings.push('Repeat workflow rate (' + a.wrwr + '%) is still in shelfware territory. Pause new seat purchases and embed 3 core workflows per team.');
    }

    if (a.netMins >= netTarget) {
      score += 25;
      findings.push('Review-adjusted time saved (' + a.netMins + ' min/wk) clears 3x your ' + m.breakEvenMins.toFixed(1) + ' min/wk licence break-even.');
    } else if (a.netMins >= m.breakEvenMins) {
      score += 15;
      findings.push('Net time saved (' + a.netMins + ' min/wk) covers the individual seat cost, but may not yet carry dormant licences.');
    } else {
      findings.push('Net time saved (' + a.netMins + ' min/wk) sits below break-even (' + m.breakEvenMins.toFixed(1) + ' min/wk). Checking overhead is eating the gains - tighten prompt templates.');
    }

    if (a.errRate <= risk.maxErrorPct) {
      score += 25;
      findings.push('QA / escalation error rate (' + a.errRate + '%) stays inside your ' + risk.maxErrorPct + '% risk-tier ceiling.');
    } else if (a.errRate <= risk.maxErrorPct * 2) {
      score += 12;
      findings.push('Error rate (' + a.errRate + '%) exceeds your ' + risk.maxErrorPct + '% limit. Reinforce human sign-off checks before expanding Wave 2.');
    } else {
      findings.push('Error rate (' + a.errRate + '%) is dangerously high for a ' + risk.short + ' environment. Freeze external AI outputs until review steps are enforced.');
    }

    if (a.reclaimPct >= 85) {
      score += 25;
      findings.push('Licence reclaim discipline (' + a.reclaimPct + '%) protects budget and keeps CFO trust high.');
    } else if (a.reclaimPct >= 50) {
      score += 14;
      findings.push('Reclaim rate (' + a.reclaimPct + '%) is partway there - automate the 30-day inactivity nudge to push past 85%.');
    } else {
      findings.push('Reclaim rate (' + a.reclaimPct + '%) is letting dormant seats renew quietly. Schedule a Day-60 seat sweep immediately.');
    }

    var verdictEl = document.getElementById('aek-audit-verdict');
    var notesEl = document.getElementById('aek-audit-notes');
    var label = 'At Risk (Shelfware Trap)';
    var cls = 'aek-audit-verdict--risk';

    if (score >= 85) {
      label = 'Board-Ready (' + score + '/100)';
      cls = 'aek-audit-verdict--board';
    } else if (score >= 65) {
      label = 'Scaling Cleanly (' + score + '/100)';
      cls = 'aek-audit-verdict--good';
    } else if (score >= 40) {
      label = 'Early Traction (' + score + '/100)';
      cls = 'aek-audit-verdict--early';
    } else {
      label = 'At Risk (' + score + '/100)';
    }

    if (verdictEl) {
      verdictEl.className = 'aek-audit-verdict ' + cls;
      verdictEl.textContent = label;
    }

    if (notesEl) {
      notesEl.innerHTML =
        '<strong>Straight-talk audit readout:</strong>' +
        '<ul>' + findings.map(function (f) { return '<li>' + escapeHtml(f) + '</li>'; }).join('') + '</ul>';
    }
  }

  /* ── COMPLETE MARKDOWN PACK GENERATOR ── */
  function generateCompleteMarkdownPack() {
    var m = computeMetrics();
    var org = getOrgDisplay();
    var stack = getStackInfo();
    var risk = RISK_TIERS[state.riskTier];
    var sym = (CURRENCIES[state.currency] || CURRENCIES.GBP).symbol;
    var phases = getRoadmapPhases(m);
    var selectedDepts = getSelectedDepartments();
    var kpis = getKpiRows(m);
    var today = new Date().toISOString().slice(0, 10);

    var out = [];
    out.push('# ' + org + ' - 90-Day AI Enablement & Seat-Waste Pack');
    out.push('');
    out.push('Generated: ' + today + ' via JohnB.io (https://johnb.io/ai-enablement-kit)');
    out.push('Stack: ' + stack.name + ' | Risk Tier: ' + risk.label + ' | Currency: ' + state.currency);
    out.push('');
    out.push('---');
    out.push('');
    out.push('## 1. Licence Shelfware & Break-Even Snapshot');
    out.push('');
    out.push('- **Total Licensed Seats:** ' + m.seats.toLocaleString('en-GB'));
    out.push('- **Average Monthly Seat Cost:** ' + sym + m.cost + ' / seat / month');
    out.push('- **Average Fully-Loaded Hourly Rate:** ' + sym + m.rate + ' / hour (' + WORKING_WEEKS + ' working weeks/yr)');
    out.push('- **Annual Licence Spend:** ' + formatMoney(m.annualSpend) + ' (' + formatMoney(m.monthlySpend) + '/mo)');
    out.push('- **Current Active Weekly Usage:** ' + m.curPct + '% (' + m.activeNow + ' active: ' + m.powerNow + ' power, ' + m.casualNow + ' casual | ' + m.dormantNow + ' dormant)');
    out.push('- **Annual Shelfware Waste:** ' + formatMoney(m.annualWaste) + ' (' + formatMoney(m.monthlyWaste) + '/mo across ' + m.dormantNow + ' dormant seats)');
    out.push('- **Break-Even Time per Licensed Employee:** ' + formatMins(m.breakEvenMins));
    out.push('- **Effective Break-Even per Active User (carrying dormant seats):** ' + formatMins(m.effectiveBreakEvenMins));
    out.push('- **Target Day-90 Adoption:** ' + m.tgtPct + '% (' + m.activeTarget + ' active: ' + m.powerTarget + ' power, ' + m.casualTarget + ' casual | ' + m.dormantTarget + ' dormant)');
    out.push('- **Projected Annualised Licence Value Reclaimed:** ' + formatMoney(m.totalLicenceReclaimedAnnual) + ' (' + formatMoney(m.reclaimedLicenceAnnual) + ' reactivated + ' + formatMoney(m.harvestedLicenceAnnual) + ' harvested idle seats)');
    out.push('- **Conservative Review-Adjusted Net Time Upside:** +' + formatMoney(m.incrementalNetTimeValueAnnual) + '/yr');
    out.push('');
    out.push('### Smart Licence Tiering Recommendation');
    out.push('- **Wave 1 (Days 1-30):** ' + m.wave1Seats.toLocaleString('en-GB') + ' seats for Champions (' + m.champMin + ' to ' + m.champMax + ' staff, 1 per 12-15 ratio) and priority roles.');
    out.push('- **Wave 2 (Days 31-60):** Up to ' + m.wave2Seats.toLocaleString('en-GB') + ' seats issued only after completing a 20-minute department workflow clinic.');
    out.push('- **Day-60 Reclaim Loop:** Automated 7-day check-in for anyone with < 2 sessions in 30 days, then return dormant licences to the pool.');
    out.push('- **Estimated Q1 Cash Avoided vs Blanket Day-1 Rollout:** ' + formatMoney(m.q1CashSaved));
    out.push('');
    out.push('---');
    out.push('');
    out.push('## 2. 12-Week Rollout Roadmap & Champion Network');
    out.push('');
    out.push('- **Recommended Champion Cohort:** ' + m.champMin + ' to ' + m.champMax + ' Champions (1 per 12 to 15 staff)');
    out.push('- **Ring-Fenced Time:** 2 hours/week per Champion');
    out.push('');
    phases.forEach(function (phase) {
      out.push('### ' + phase.tag + ': ' + phase.title);
      out.push(phase.goal);
      out.push('');
      phase.items.forEach(function (item) {
        var box = state.checkedMilestones[item.id] ? '[x]' : '[ ]';
        out.push('- ' + box + ' **' + item.week + ':** ' + item.text);
      });
      out.push('');
    });

    out.push('---');
    out.push('');
    out.push('## 3. Department Workflow & Prompt Starter Packs');
    out.push('');
    selectedDepts.forEach(function (dept) {
      out.push('### ' + dept.name);
      out.push('');
      dept.workflows.forEach(function (wf, idx) {
        out.push('#### ' + (idx + 1) + '. ' + wf.name + ' (' + wf.saves + ')');
        out.push('- **When to use:** ' + wf.when);
        out.push('- **' + wf.check + '**');
        out.push('');
        out.push('```text');
        out.push(wf.prompt);
        out.push('```');
        out.push('');
      });
      out.push('**Never paste this (' + dept.name + ' red lines):**');
      dept.redLines.concat(risk.extraRedLines).forEach(function (line) {
        out.push('- ' + line);
      });
      out.push('');
    });

    out.push('---');
    out.push('');
    out.push('## 4. Plain-English Acceptable Use One-Pager');
    out.push('');
    out.push(getActivePolicyText());
    out.push('');
    out.push('---');
    out.push('');
    out.push('## 5. Anti-Vanity Adoption KPIs & Self-Audit');
    out.push('');
    out.push('| Vanity Metric (Ignore) | Real Enablement KPI | How to Measure | Day-90 Target |');
    out.push('| --- | --- | --- | --- |');
    kpis.forEach(function (r) {
      out.push('| ' + r.vanity + ' | ' + r.real + ' | ' + r.measure + ' | ' + r.target + ' |');
    });
    out.push('');
    out.push('### Latest Self-Audit Figures Entered');
    out.push('- Weekly Repeat Workflow Rate: ' + state.audit.wrwr + '%');
    out.push('- Review-Adjusted Time Saved: ' + state.audit.netMins + ' min/wk');
    out.push('- QA / Escalation Error Rate: ' + state.audit.errRate + '%');
    out.push('- Inactive Seats Reclaimed: ' + state.audit.reclaimPct + '%');
    out.push('');

    return out.join('\n');
  }

  function downloadMarkdownPack() {
    var content = generateCompleteMarkdownPack();
    var slug = (state.orgName || 'organisation')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'organisation';
    var filename = slug + '-90-day-ai-enablement-pack.md';

    var blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast('Downloaded ' + filename);
  }

  /* ── SYNC CONTROLS FROM STATE ── */
  function syncInputsFromState() {
    document.getElementById('aek-org-name').value = state.orgName;
    document.getElementById('aek-seats-range').value = state.seats;
    document.getElementById('aek-seats-input').value = state.seats;
    document.getElementById('aek-seats-badge').textContent = state.seats.toLocaleString('en-GB') + ' seats';
    document.getElementById('aek-seat-cost').value = state.monthlyCost;
    document.getElementById('aek-hourly-rate').value = state.hourlyRate;
    document.getElementById('aek-current-usage').value = state.currentUsage;
    document.getElementById('aek-current-usage-val').textContent = state.currentUsage + '%';
    document.getElementById('aek-target-usage').value = state.targetUsage;
    document.getElementById('aek-target-usage-val').textContent = state.targetUsage + '%';

    // Currency buttons & symbols
    var sym = (CURRENCIES[state.currency] || CURRENCIES.GBP).symbol;
    document.querySelectorAll('.aek-curr-symbol').forEach(function (el) {
      el.textContent = sym;
    });
    document.querySelectorAll('.aek-curr-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-currency') === state.currency;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Stack presets
    document.querySelectorAll('.aek-preset-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-preset') === state.preset;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    var presetNote = document.getElementById('aek-preset-note');
    if (presetNote) presetNote.textContent = getStackInfo().note;

    // Risk tier radios
    document.querySelectorAll('input[name="aek-risk-tier"]').forEach(function (radio) {
      radio.checked = radio.value === state.riskTier;
    });

    // Departments checkboxes
    document.querySelectorAll('input[name="aek-dept"]').forEach(function (cb) {
      cb.checked = state.departments.indexOf(cb.value) !== -1;
    });
    document.getElementById('aek-dept-count').textContent = String(state.departments.length);

    // Gauge toggle buttons
    document.querySelectorAll('.aek-mini-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-mode') === state.gaugeMode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Audit fields
    document.getElementById('aek-kpi-wrwr').value = state.audit.wrwr;
    document.getElementById('aek-kpi-netmins').value = state.audit.netMins;
    document.getElementById('aek-kpi-err').value = state.audit.errRate;
    document.getElementById('aek-kpi-reclaim').value = state.audit.reclaimPct;
  }

  function renderAll() {
    var m = computeMetrics();
    renderDashboard(m);
    renderRoadmap(m);
    renderWorkflows();
    renderPolicy();
    renderKpis(m);
    saveStateToStorage();
  }

  /* ── TAB SWITCHING (WAI-ARIA KEYBOARD ACCESSIBLE) ── */
  function activateTab(tabId, moveFocus) {
    state.activeTab = tabId;
    var tabs = Array.prototype.slice.call(document.querySelectorAll('#aek-tablist [role="tab"]'));
    tabs.forEach(function (tab) {
      var isTarget = tab.getAttribute('data-tab') === tabId;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      tab.setAttribute('tabindex', isTarget ? '0' : '-1');
      var panelId = tab.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.hidden = !isTarget;
      if (isTarget && moveFocus) tab.focus();
    });
  }

  /* ── EVENT BINDING ── */
  function bindEvents() {
    // Org name
    document.getElementById('aek-org-name').addEventListener('input', function (e) {
      state.orgName = e.target.value.slice(0, 80);
      renderAll();
    });

    // Currency toggle
    document.querySelectorAll('.aek-curr-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nextCurr = btn.getAttribute('data-currency');
        if (!CURRENCIES[nextCurr] || nextCurr === state.currency) return;
        var prevCurr = state.currency;
        state.currency = nextCurr;
        // Adjust preset seat cost cleanly if on a named preset
        if (state.preset !== 'custom' && STACK_PRESETS[state.preset]) {
          state.monthlyCost = STACK_PRESETS[state.preset][nextCurr];
        }
        // Adjust default hourly rate if user hasn't customised away from default
        if (state.hourlyRate === CURRENCIES[prevCurr].defaultRate) {
          state.hourlyRate = CURRENCIES[nextCurr].defaultRate;
        }
        syncInputsFromState();
        renderAll();
      });
    });

    // Stack presets
    document.getElementById('aek-presets').addEventListener('click', function (e) {
      var btn = e.target.closest('.aek-preset-btn');
      if (!btn) return;
      var presetKey = btn.getAttribute('data-preset');
      if (!STACK_PRESETS[presetKey]) return;
      state.preset = presetKey;
      state.monthlyCost = STACK_PRESETS[presetKey][state.currency];
      syncInputsFromState();
      renderAll();
    });

    // Seats slider & number input
    document.getElementById('aek-seats-range').addEventListener('input', function (e) {
      state.seats = Math.round(clamp(e.target.value, 10, 5000, state.seats));
      document.getElementById('aek-seats-input').value = state.seats;
      document.getElementById('aek-seats-badge').textContent = state.seats.toLocaleString('en-GB') + ' seats';
      renderAll();
    });

    document.getElementById('aek-seats-input').addEventListener('input', function (e) {
      var val = parseInt(e.target.value, 10);
      if (!Number.isFinite(val)) return;
      state.seats = Math.round(clamp(val, 10, 5000, state.seats));
      document.getElementById('aek-seats-range').value = state.seats;
      document.getElementById('aek-seats-badge').textContent = state.seats.toLocaleString('en-GB') + ' seats';
      renderAll();
    });

    document.getElementById('aek-seats-input').addEventListener('blur', function () {
      document.getElementById('aek-seats-input').value = state.seats;
    });

    // Monthly seat cost
    document.getElementById('aek-seat-cost').addEventListener('input', function (e) {
      var val = parseFloat(e.target.value);
      if (!Number.isFinite(val) || val < 1) return;
      state.monthlyCost = Math.round(clamp(val, 1, 500, state.monthlyCost));
      var currentPreset = STACK_PRESETS[state.preset];
      if (currentPreset && currentPreset[state.currency] !== state.monthlyCost) {
        state.preset = 'custom';
        syncInputsFromState();
      }
      renderAll();
    });

    // Hourly rate
    document.getElementById('aek-hourly-rate').addEventListener('input', function (e) {
      var val = parseFloat(e.target.value);
      if (!Number.isFinite(val) || val < 15) return;
      state.hourlyRate = Math.round(clamp(val, 15, 300, state.hourlyRate));
      renderAll();
    });

    // Adoption sliders
    document.getElementById('aek-current-usage').addEventListener('input', function (e) {
      state.currentUsage = Math.round(clamp(e.target.value, 5, 95, state.currentUsage));
      document.getElementById('aek-current-usage-val').textContent = state.currentUsage + '%';
      if (state.targetUsage < state.currentUsage) {
        state.targetUsage = Math.min(95, state.currentUsage);
        document.getElementById('aek-target-usage').value = state.targetUsage;
        document.getElementById('aek-target-usage-val').textContent = state.targetUsage + '%';
      }
      renderAll();
    });

    document.getElementById('aek-target-usage').addEventListener('input', function (e) {
      state.targetUsage = Math.round(clamp(e.target.value, 15, 95, state.targetUsage));
      if (state.targetUsage < state.currentUsage) {
        state.currentUsage = Math.max(5, state.targetUsage);
        document.getElementById('aek-current-usage').value = state.currentUsage;
        document.getElementById('aek-current-usage-val').textContent = state.currentUsage + '%';
      }
      document.getElementById('aek-target-usage-val').textContent = state.targetUsage + '%';
      renderAll();
    });

    // Risk tier radios
    document.getElementById('aek-risk-grid').addEventListener('change', function (e) {
      if (e.target && e.target.name === 'aek-risk-tier' && RISK_TIERS[e.target.value]) {
        state.riskTier = e.target.value;
        renderAll();
      }
    });

    // Departments multi-select
    document.getElementById('aek-dept-grid').addEventListener('change', function () {
      var checked = Array.prototype.slice.call(document.querySelectorAll('input[name="aek-dept"]:checked'))
        .map(function (cb) { return cb.value; });
      if (checked.length === 0) {
        // Keep at least 1 department active so packs stay useful
        var first = document.querySelector('input[name="aek-dept"]');
        if (first) {
          first.checked = true;
          checked = [first.value];
        }
        showToast('At least one department must stay selected.');
      }
      state.departments = checked;
      document.getElementById('aek-dept-count').textContent = String(state.departments.length);
      renderAll();
    });

    document.getElementById('aek-dept-all-btn').addEventListener('click', function () {
      state.departments = DEPARTMENTS.map(function (d) { return d.id; });
      syncInputsFromState();
      renderAll();
    });

    document.getElementById('aek-dept-core-btn').addEventListener('click', function () {
      state.departments = DEFAULT_STATE.departments.slice();
      syncInputsFromState();
      renderAll();
    });

    // Gauge view toggle
    document.getElementById('aek-gauge-now-btn').addEventListener('click', function () {
      state.gaugeMode = 'now';
      syncInputsFromState();
      renderGaugeSvg(computeMetrics());
    });

    document.getElementById('aek-gauge-target-btn').addEventListener('click', function () {
      state.gaugeMode = 'target';
      syncInputsFromState();
      renderGaugeSvg(computeMetrics());
    });

    // Playbook tabs click + keyboard navigation
    var tablist = document.getElementById('aek-tablist');
    tablist.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (!tab) return;
      activateTab(tab.getAttribute('data-tab'), false);
    });

    tablist.addEventListener('keydown', function (e) {
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var idx = tabs.indexOf(document.activeElement);
      if (idx === -1) return;
      var nextIdx = idx;
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabs.length - 1;
      else return;
      e.preventDefault();
      activateTab(tabs[nextIdx].getAttribute('data-tab'), true);
    });

    // Roadmap milestone checkboxes (event delegation)
    document.getElementById('aek-phases-grid').addEventListener('change', function (e) {
      if (!e.target.classList.contains('aek-milestone-cb')) return;
      var id = e.target.getAttribute('data-milestone');
      if (!id) return;
      state.checkedMilestones[id] = Boolean(e.target.checked);
      renderRoadmap(computeMetrics());
      saveStateToStorage();
    });

    document.getElementById('aek-reset-checks-btn').addEventListener('click', function () {
      state.checkedMilestones = {};
      renderRoadmap(computeMetrics());
      saveStateToStorage();
      showToast('Roadmap milestones cleared.');
    });

    // Workflow department filter pills & prompt copy buttons (delegation)
    document.getElementById('aek-workflow-filter-pills').addEventListener('click', function (e) {
      var btn = e.target.closest('.aek-filter-pill');
      if (!btn) return;
      state.workflowFilter = btn.getAttribute('data-wf-filter') || 'all';
      renderWorkflows();
    });

    document.getElementById('aek-workflows-list').addEventListener('click', function (e) {
      var btn = e.target.closest('.aek-copy-prompt-btn');
      if (!btn) return;
      var pid = btn.getAttribute('data-copy-prompt');
      var box = document.querySelector('[data-prompt-id="' + pid + '"]');
      if (!box) return;
      copyToClipboard(box.textContent, 'Prompt template copied to clipboard.', btn);
    });

    // Policy controls
    document.getElementById('aek-copy-policy-btn').addEventListener('click', function (e) {
      copyToClipboard(getActivePolicyText(), 'Acceptable Use One-Pager copied.', e.currentTarget);
    });

    document.getElementById('aek-copy-aup-top-btn').addEventListener('click', function (e) {
      copyToClipboard(getActivePolicyText(), 'Acceptable Use One-Pager copied.', e.currentTarget);
    });

    document.getElementById('aek-toggle-edit-policy-btn').addEventListener('click', function () {
      state.editingPolicy = !state.editingPolicy;
      renderPolicy();
      if (state.editingPolicy) {
        var ta = document.getElementById('aek-policy-textarea');
        if (ta) ta.focus();
      }
    });

    document.getElementById('aek-policy-textarea').addEventListener('input', function (e) {
      state.customPolicy = e.target.value;
      var preview = document.getElementById('aek-policy-preview');
      if (preview) preview.innerHTML = renderPolicyHtmlFromMarkdown(getActivePolicyText());
      saveStateToStorage();
    });

    document.getElementById('aek-reset-policy-btn').addEventListener('click', function () {
      state.customPolicy = '';
      state.editingPolicy = false;
      renderPolicy();
      saveStateToStorage();
      showToast('Acceptable Use One-Pager reset to generated draft.');
    });

    // Anti-Vanity KPI Self-Audit inputs
    var auditBindings = [
      { id: 'aek-kpi-wrwr', key: 'wrwr', min: 0, max: 100 },
      { id: 'aek-kpi-netmins', key: 'netMins', min: 0, max: 600 },
      { id: 'aek-kpi-err', key: 'errRate', min: 0, max: 50 },
      { id: 'aek-kpi-reclaim', key: 'reclaimPct', min: 0, max: 100 }
    ];

    auditBindings.forEach(function (item) {
      document.getElementById(item.id).addEventListener('input', function (e) {
        var v = parseFloat(e.target.value);
        if (!Number.isFinite(v)) return;
        state.audit[item.key] = clamp(v, item.min, item.max, state.audit[item.key]);
        renderAuditScorecard(computeMetrics());
        saveStateToStorage();
      });
    });

    // Exports & Share URL
    function handleCopyShareUrl(btn) {
      var hash = '#cfg=' + encodeConfigToHash();
      try {
        window.history.replaceState(null, '', hash);
      } catch (e) {
        window.location.hash = hash;
      }
      var fullUrl = window.location.origin + window.location.pathname + hash;
      copyToClipboard(fullUrl, 'Shareable link with your numbers copied to clipboard.', btn);
    }

    document.getElementById('aek-download-md-btn').addEventListener('click', downloadMarkdownPack);
    document.getElementById('aek-download-md-bottom-btn').addEventListener('click', downloadMarkdownPack);

    document.getElementById('aek-copy-url-btn').addEventListener('click', function (e) {
      handleCopyShareUrl(e.currentTarget);
    });
    document.getElementById('aek-copy-url-bottom-btn').addEventListener('click', function (e) {
      handleCopyShareUrl(e.currentTarget);
    });

    document.getElementById('aek-print-btn').addEventListener('click', function () {
      window.print();
    });

    // Back-to-top button (CSP-safe, no inline script required)
    var btt = document.getElementById('back-to-top');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function init() {
    loadInitialState();
    syncInputsFromState();
    bindEvents();
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
