/* LLM & Agent Unit-Economics Modeller - 100% Client-Side Vanilla JS */
(function () {
  'use strict';

  // Reference FX rates vs USD (November 2026 planning rates)
  const CURRENCIES = {
    GBP: { code: 'GBP', symbol: '\u00A3', rate: 0.79, label: 'GBP (\u00A31 = $1.27 ref)' },
    USD: { code: 'USD', symbol: '$', rate: 1.00, label: 'USD (native API list rates)' },
    EUR: { code: 'EUR', symbol: '\u20AC', rate: 0.92, label: 'EUR (\u20AC1 = $1.09 ref)' }
  };

  // Late-2026 foundation model catalogue (USD per 1M tokens)
  const MODELS = [
    {
      id: 'claude-haiku-5.5',
      name: 'Claude Haiku 5.5',
      provider: 'Anthropic',
      tier: 'fast',
      inputPer1M: 0.10,
      outputPer1M: 0.50,
      cacheReadMult: 0.10
    },
    {
      id: 'gpt-5.6-mini',
      name: 'GPT-5.6 mini',
      provider: 'OpenAI',
      tier: 'fast',
      inputPer1M: 0.15,
      outputPer1M: 0.60,
      cacheReadMult: 0.10
    },
    {
      id: 'deepseek-v4',
      name: 'DeepSeek V4',
      provider: 'DeepSeek',
      tier: 'fast',
      inputPer1M: 0.20,
      outputPer1M: 0.80,
      cacheReadMult: 0.10
    },
    {
      id: 'gemini-3.7-flash',
      name: 'Gemini 3.7 Flash',
      provider: 'Google',
      tier: 'fast',
      inputPer1M: 0.75,
      outputPer1M: 3.00,
      cacheReadMult: 0.10
    },
    {
      id: 'gemini-3.7-pro',
      name: 'Gemini 3.7 Pro',
      provider: 'Google',
      tier: 'balanced',
      inputPer1M: 1.50,
      outputPer1M: 7.50,
      cacheReadMult: 0.10
    },
    {
      id: 'claude-sonnet-5.5',
      name: 'Claude Sonnet 5.5',
      provider: 'Anthropic',
      tier: 'balanced',
      inputPer1M: 2.00,
      outputPer1M: 10.00,
      cacheReadMult: 0.10
    },
    {
      id: 'gpt-5.6',
      name: 'GPT-5.6',
      provider: 'OpenAI',
      tier: 'balanced',
      inputPer1M: 2.50,
      outputPer1M: 10.00,
      cacheReadMult: 0.10
    },
    {
      id: 'claude-opus-5',
      name: 'Claude Opus 5',
      provider: 'Anthropic',
      tier: 'frontier',
      inputPer1M: 5.00,
      outputPer1M: 25.00,
      cacheReadMult: 0.10
    },
    {
      id: 'self-hosted',
      name: 'Self-Hosted Open Weights',
      provider: 'Dedicated GPU Cluster',
      tier: 'self',
      inputPer1M: 0,
      outputPer1M: 0,
      cacheReadMult: 1.00,
      isSelfHosted: true
    }
  ];

  const MODEL_MAP = Object.create(null);
  MODELS.forEach(function (m) {
    MODEL_MAP[m.id] = m;
  });

  // 5 production workflow presets (ARPU stored in GBP base; converted if currency != GBP)
  const PRESETS = {
    classification: {
      label: 'Single-Shot Extraction',
      mau: 25000,
      sessions: 40,
      turns: 1,
      contextGrowth: false,
      compaction: false,
      sysTokens: 800,
      ragTokens: 0,
      userTokens: 350,
      outTokens: 120,
      cacheHit: 75,
      retryPct: 3,
      evalPct: 2,
      arpuGbp: 15,
      primaryModel: 'gpt-5.6-mini',
      routerEnabled: false,
      routerFast: 'claude-haiku-5.5',
      routerFrontier: 'claude-sonnet-5.5',
      routerSplit: 90
    },
    'rag-support': {
      label: 'RAG Support Bot',
      mau: 15000,
      sessions: 6,
      turns: 4,
      contextGrowth: true,
      compaction: false,
      sysTokens: 1500,
      ragTokens: 4500,
      userTokens: 180,
      outTokens: 380,
      cacheHit: 60,
      retryPct: 5,
      evalPct: 5,
      arpuGbp: 29,
      primaryModel: 'claude-sonnet-5.5',
      routerEnabled: true,
      routerFast: 'claude-haiku-5.5',
      routerFrontier: 'claude-sonnet-5.5',
      routerSplit: 75
    },
    'saas-copilot': {
      label: 'Multi-Turn SaaS Copilot',
      mau: 10000,
      sessions: 18,
      turns: 6,
      contextGrowth: true,
      compaction: false,
      sysTokens: 2200,
      ragTokens: 2800,
      userTokens: 220,
      outTokens: 550,
      cacheHit: 50,
      retryPct: 6,
      evalPct: 5,
      arpuGbp: 49,
      primaryModel: 'claude-sonnet-5.5',
      routerEnabled: true,
      routerFast: 'claude-haiku-5.5',
      routerFrontier: 'claude-sonnet-5.5',
      routerSplit: 80
    },
    'agent-loop': {
      label: 'Autonomous Agent Loop',
      mau: 2500,
      sessions: 45,
      turns: 12,
      contextGrowth: true,
      compaction: false,
      sysTokens: 3800,
      ragTokens: 3500,
      userTokens: 450,
      outTokens: 650,
      cacheHit: 25,
      retryPct: 14,
      evalPct: 10,
      arpuGbp: 49,
      primaryModel: 'claude-opus-5',
      routerEnabled: false,
      routerFast: 'claude-sonnet-5.5',
      routerFrontier: 'claude-opus-5',
      routerSplit: 70
    },
    'batch-docs': {
      label: 'Batch Document Pipeline',
      mau: 500,
      sessions: 120,
      turns: 2,
      contextGrowth: false,
      compaction: false,
      sysTokens: 1200,
      ragTokens: 12000,
      userTokens: 200,
      outTokens: 1400,
      cacheHit: 40,
      retryPct: 4,
      evalPct: 3,
      arpuGbp: 199,
      primaryModel: 'gemini-3.7-pro',
      routerEnabled: true,
      routerFast: 'gemini-3.7-flash',
      routerFrontier: 'gemini-3.7-pro',
      routerSplit: 80
    }
  };

  // Application state
  const state = {
    preset: 'saas-copilot',
    currency: 'GBP',
    mau: 10000,
    sessions: 18,
    turns: 6,
    contextGrowth: true,
    compaction: false,
    sysTokens: 2200,
    ragTokens: 2800,
    userTokens: 220,
    outTokens: 550,
    cacheHit: 50,
    retryPct: 6,
    evalPct: 5,
    arpu: 49,
    primaryModel: 'claude-sonnet-5.5',
    routerEnabled: true,
    routerFast: 'claude-haiku-5.5',
    routerFrontier: 'claude-sonnet-5.5',
    routerSplit: 80,
    gpuRate: 3.56, // active currency per GPU hour (defaults to $4.50 in GBP)
    gpuUtil: 35,
    gpuTps: 120,
    snowballMode: 'cumulative', // 'cumulative' | 'turn'
    showSnowballTable: false
  };

  let lastResults = null;
  let toastTimer = null;

  // Helpers
  function el(id) {
    return document.getElementById(id);
  }

  function clamp(num, min, max, fallback) {
    const n = Number(num);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function fxRate(code) {
    return (CURRENCIES[code] || CURRENCIES.GBP).rate;
  }

  function currSymbol(code) {
    return (CURRENCIES[code || state.currency] || CURRENCIES.GBP).symbol;
  }

  function usdToActive(usd) {
    return usd * fxRate(state.currency);
  }

  function activeToUsd(amount) {
    return amount / fxRate(state.currency);
  }

  function formatMoney(amount, opts) {
    const sym = currSymbol();
    const o = opts || {};
    if (!Number.isFinite(amount)) return sym + '0';
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (o.compact) {
      if (abs >= 1e6) return sign + sym + (abs / 1e6).toFixed(2) + 'M';
      if (abs >= 100000) return sign + sym + Math.round(abs / 1000).toLocaleString('en-GB') + 'k';
    }

    if (o.precise) {
      if (abs === 0) return sym + '0.00';
      if (abs < 0.001) return sign + sym + abs.toFixed(5);
      if (abs < 0.01) return sign + sym + abs.toFixed(4);
      if (abs < 1) return sign + sym + abs.toFixed(3);
      return sign + sym + abs.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    if (abs >= 1000) {
      return sign + sym + Math.round(abs).toLocaleString('en-GB');
    }
    if (abs >= 10) {
      return sign + sym + abs.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (abs >= 0.01 || abs === 0) {
      return sign + sym + abs.toFixed(2);
    }
    return sign + sym + abs.toFixed(4);
  }

  function formatInt(n) {
    return Math.round(n).toLocaleString('en-GB');
  }

  function formatTokens(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return Math.round(n).toLocaleString('en-GB');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg) {
    const t = el('ue-toast');
    if (!t) return;
    t.textContent = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.textContent = '';
    }, 3500);
  }

  // ── CORE MATH ENGINE ──

  function computeTurnsSequence(model, params, turnCountOverride) {
    const T = turnCountOverride != null ? turnCountOverride : params.turns;
    const c = clamp(params.cacheHit, 0, 95, 0) / 100;
    const retryMult = params.retryPct / 100;
    const evalMult = params.evalPct / 100;
    const inRate = model.inputPer1M / 1e6;
    const outRate = model.outputPer1M / 1e6;
    const cachedRateMult = 1 - c + c * model.cacheReadMult;

    const turns = [];
    let cumInput = 0;
    let cumOutput = 0;
    let cumCostUsd = 0;

    let sumSysUsd = 0;
    let sumRagUsd = 0;
    let sumHistUsd = 0;
    let sumUsrUsd = 0;
    let sumOutUsd = 0;
    let sumRetryUsd = 0;
    let sumEvalUsd = 0;

    let sumSysTok = 0;
    let sumRagTok = 0;
    let sumHistTok = 0;
    let sumUsrTok = 0;
    let sumOutTok = 0;

    for (let t = 1; t <= T; t++) {
      const sysTok = params.sysTokens;
      const ragTok = params.ragTokens;
      const usrTok = params.userTokens;
      const outTok = params.outTokens;

      let histTok = 0;
      if (params.contextGrowth && t > 1) {
        if (params.compaction && t > 3) {
          histTok = 250 + 2 * (params.userTokens + params.outTokens);
        } else {
          histTok = (t - 1) * (params.userTokens + params.outTokens);
        }
      }

      const turnInput = sysTok + ragTok + usrTok + histTok;

      // API token pricing (USD)
      const sysUsd = sysTok * inRate * cachedRateMult;
      const histUsd = histTok * inRate * cachedRateMult;
      const ragUsd = ragTok * inRate;
      const usrUsd = usrTok * inRate;
      const outUsd = outTok * outRate;

      const baseUsd = sysUsd + histUsd + ragUsd + usrUsd + outUsd;
      const retryUsd = baseUsd * retryMult;
      const evalUsd = baseUsd * evalMult;
      const turnUsd = baseUsd + retryUsd + evalUsd;

      cumInput += turnInput;
      cumOutput += outTok;
      cumCostUsd += turnUsd;

      sumSysUsd += sysUsd;
      sumRagUsd += ragUsd;
      sumHistUsd += histUsd;
      sumUsrUsd += usrUsd;
      sumOutUsd += outUsd;
      sumRetryUsd += retryUsd;
      sumEvalUsd += evalUsd;

      sumSysTok += sysTok;
      sumRagTok += ragTok;
      sumHistTok += histTok;
      sumUsrTok += usrTok;
      sumOutTok += outTok;

      turns.push({
        turn: t,
        inputTokens: turnInput,
        outputTokens: outTok,
        histTokens: histTok,
        turnCostUsd: turnUsd,
        cumInputTokens: cumInput,
        cumOutputTokens: cumOutput,
        cumCostUsd: cumCostUsd
      });
    }

    return {
      turns: turns,
      sessionInputTokens: cumInput,
      sessionOutputTokens: cumOutput,
      sessionCostUsd: cumCostUsd,
      breakdownUsd: {
        sys: sumSysUsd,
        rag: sumRagUsd,
        hist: sumHistUsd,
        usr: sumUsrUsd,
        out: sumOutUsd,
        overhead: sumRetryUsd + sumEvalUsd,
        retry: sumRetryUsd,
        eval: sumEvalUsd
      },
      tokenTotals: {
        sys: sumSysTok,
        rag: sumRagTok,
        hist: sumHistTok,
        usr: sumUsrTok,
        out: sumOutTok
      }
    };
  }

  function computeSelfHostedEconomics(params, turnCountOverride) {
    const seq = computeTurnsSequence(MODEL_MAP['self-hosted'], params, turnCountOverride);
    const totalMonthlySessions = params.mau * params.sessions;
    const overheadMult = 1 + (params.retryPct + params.evalPct) / 100;

    const monthlyInput = totalMonthlySessions * seq.sessionInputTokens * overheadMult;
    const monthlyOutput = totalMonthlySessions * seq.sessionOutputTokens * overheadMult;

    // Prefill runs ~5x faster than decode; weight input at 0.2 decode-equivalent
    const equivDecodeTokens = monthlyOutput + monthlyInput * 0.2;
    const activeSeconds = equivDecodeTokens / Math.max(10, params.gpuTps);
    const utilFrac = clamp(params.gpuUtil, 5, 95, 35) / 100;
    const rawGpuHours = (activeSeconds / 3600) / utilFrac;
    const floorHours = 730; // 1 dedicated GPU running 24/7 for a month
    const billedGpuHours = Math.max(floorHours, rawGpuHours);
    const gpusRequired = billedGpuHours / floorHours;
    const gpuRateUsd = activeToUsd(params.gpuRate);
    const monthlyUsd = billedGpuHours * gpuRateUsd;
    const sessionCostUsd = totalMonthlySessions > 0 ? monthlyUsd / totalMonthlySessions : 0;

    // Allocate monthly cost across breakdown buckets by decode-equivalent compute share
    const tt = seq.tokenTotals;
    const baseCompute = (tt.sys + tt.rag + tt.hist + tt.usr) * 0.2 + tt.out;
    const baseShare = 1 / overheadMult;
    const overheadShare = 1 - baseShare;
    const safeBase = baseCompute > 0 ? baseCompute : 1;

    const breakdownMonthlyUsd = {
      sys: monthlyUsd * baseShare * ((tt.sys * 0.2) / safeBase),
      rag: monthlyUsd * baseShare * ((tt.rag * 0.2) / safeBase),
      hist: monthlyUsd * baseShare * ((tt.hist * 0.2) / safeBase),
      usr: monthlyUsd * baseShare * ((tt.usr * 0.2) / safeBase),
      out: monthlyUsd * baseShare * (tt.out / safeBase),
      overhead: monthlyUsd * overheadShare
    };

    // Scale turn curve costs proportionally to decode-equivalent share per turn
    let totalEquivPerSession = 0;
    seq.turns.forEach(function (t) {
      totalEquivPerSession += t.outputTokens + t.inputTokens * 0.2;
    });
    const safeEq = totalEquivPerSession > 0 ? totalEquivPerSession : 1;
    let runningUsd = 0;
    const scaledTurns = seq.turns.map(function (t) {
      const share = (t.outputTokens + t.inputTokens * 0.2) / safeEq;
      const turnUsd = sessionCostUsd * share;
      runningUsd += turnUsd;
      return {
        turn: t.turn,
        inputTokens: t.inputTokens,
        outputTokens: t.outputTokens,
        histTokens: t.histTokens,
        turnCostUsd: turnUsd,
        cumInputTokens: t.cumInputTokens,
        cumOutputTokens: t.cumOutputTokens,
        cumCostUsd: runningUsd
      };
    });

    const totalMonthlyTokens = monthlyInput + monthlyOutput;
    const effPer1MUsd = totalMonthlyTokens > 0 ? (monthlyUsd / totalMonthlyTokens) * 1e6 : 0;

    return {
      model: MODEL_MAP['self-hosted'],
      monthlyUsd: monthlyUsd,
      costPerUserUsd: params.mau > 0 ? monthlyUsd / params.mau : 0,
      sessionCostUsd: sessionCostUsd,
      sessionInputTokens: seq.sessionInputTokens,
      sessionOutputTokens: seq.sessionOutputTokens,
      monthlyInputTokens: monthlyInput,
      monthlyOutputTokens: monthlyOutput,
      breakdownMonthlyUsd: breakdownMonthlyUsd,
      turns: scaledTurns,
      selfHostedMeta: {
        rawGpuHours: rawGpuHours,
        billedGpuHours: billedGpuHours,
        gpusRequired: gpusRequired,
        hitFloor: rawGpuHours < floorHours,
        effPer1MUsd: effPer1MUsd
      }
    };
  }

  function computeModelEconomics(modelId, params, turnCountOverride) {
    const model = MODEL_MAP[modelId] || MODEL_MAP['claude-sonnet-5.5'];
    if (model.isSelfHosted) {
      return computeSelfHostedEconomics(params, turnCountOverride);
    }

    const seq = computeTurnsSequence(model, params, turnCountOverride);
    const totalMonthlySessions = params.mau * params.sessions;
    const monthlyUsd = seq.sessionCostUsd * totalMonthlySessions;
    const overheadMult = 1 + (params.retryPct + params.evalPct) / 100;

    const b = seq.breakdownUsd;
    const breakdownMonthlyUsd = {
      sys: b.sys * totalMonthlySessions,
      rag: b.rag * totalMonthlySessions,
      hist: b.hist * totalMonthlySessions,
      usr: b.usr * totalMonthlySessions,
      out: b.out * totalMonthlySessions,
      overhead: b.overhead * totalMonthlySessions
    };

    return {
      model: model,
      monthlyUsd: monthlyUsd,
      costPerUserUsd: params.mau > 0 ? monthlyUsd / params.mau : 0,
      sessionCostUsd: seq.sessionCostUsd,
      sessionInputTokens: seq.sessionInputTokens,
      sessionOutputTokens: seq.sessionOutputTokens,
      monthlyInputTokens: totalMonthlySessions * seq.sessionInputTokens * overheadMult,
      monthlyOutputTokens: totalMonthlySessions * seq.sessionOutputTokens * overheadMult,
      breakdownMonthlyUsd: breakdownMonthlyUsd,
      turns: seq.turns,
      selfHostedMeta: null
    };
  }

  function blendEconomics(fastEcon, frontierEcon, fastPct) {
    const wFast = clamp(fastPct, 0, 100, 80) / 100;
    const wFront = 1 - wFast;

    const blendField = function (a, b) {
      return a * wFast + b * wFront;
    };

    const bd = {
      sys: blendField(fastEcon.breakdownMonthlyUsd.sys, frontierEcon.breakdownMonthlyUsd.sys),
      rag: blendField(fastEcon.breakdownMonthlyUsd.rag, frontierEcon.breakdownMonthlyUsd.rag),
      hist: blendField(fastEcon.breakdownMonthlyUsd.hist, frontierEcon.breakdownMonthlyUsd.hist),
      usr: blendField(fastEcon.breakdownMonthlyUsd.usr, frontierEcon.breakdownMonthlyUsd.usr),
      out: blendField(fastEcon.breakdownMonthlyUsd.out, frontierEcon.breakdownMonthlyUsd.out),
      overhead: blendField(fastEcon.breakdownMonthlyUsd.overhead, frontierEcon.breakdownMonthlyUsd.overhead)
    };

    const turns = fastEcon.turns.map(function (t, idx) {
      const f = frontierEcon.turns[idx];
      return {
        turn: t.turn,
        inputTokens: t.inputTokens,
        outputTokens: t.outputTokens,
        histTokens: t.histTokens,
        turnCostUsd: blendField(t.turnCostUsd, f.turnCostUsd),
        cumInputTokens: t.cumInputTokens,
        cumOutputTokens: t.cumOutputTokens,
        cumCostUsd: blendField(t.cumCostUsd, f.cumCostUsd)
      };
    });

    return {
      model: {
        id: 'routed-blend',
        name: Math.round(wFast * 100) + '% ' + fastEcon.model.name + ' / ' + Math.round(wFront * 100) + '% ' + frontierEcon.model.name,
        provider: 'Model Router',
        tier: 'balanced'
      },
      monthlyUsd: blendField(fastEcon.monthlyUsd, frontierEcon.monthlyUsd),
      costPerUserUsd: blendField(fastEcon.costPerUserUsd, frontierEcon.costPerUserUsd),
      sessionCostUsd: blendField(fastEcon.sessionCostUsd, frontierEcon.sessionCostUsd),
      sessionInputTokens: fastEcon.sessionInputTokens,
      sessionOutputTokens: fastEcon.sessionOutputTokens,
      monthlyInputTokens: fastEcon.monthlyInputTokens,
      monthlyOutputTokens: fastEcon.monthlyOutputTokens,
      breakdownMonthlyUsd: bd,
      turns: turns,
      selfHostedMeta: null
    };
  }

  function computeFullScenario() {
    const modelTable = MODELS.map(function (m) {
      return computeModelEconomics(m.id, state);
    });

    const econById = Object.create(null);
    let cheapestId = null;
    let cheapestCost = Infinity;
    modelTable.forEach(function (item) {
      econById[item.model.id] = item;
      if (item.monthlyUsd < cheapestCost) {
        cheapestCost = item.monthlyUsd;
        cheapestId = item.model.id;
      }
    });

    const primaryEcon = econById[state.primaryModel] || econById['claude-sonnet-5.5'];
    const fastEcon = econById[state.routerFast] || econById['claude-haiku-5.5'];
    const frontierEcon = econById[state.routerFrontier] || econById['claude-sonnet-5.5'];
    const routedEcon = blendEconomics(fastEcon, frontierEcon, state.routerSplit);

    const routingMonthlySaveUsd = Math.max(0, frontierEcon.monthlyUsd - routedEcon.monthlyUsd);
    const routingAnnualSaveUsd = routingMonthlySaveUsd * 12;
    const routingSavePct = frontierEcon.monthlyUsd > 0 ? (routingMonthlySaveUsd / frontierEcon.monthlyUsd) * 100 : 0;

    // Active economics shown in KPIs, breakdown bar, verdict and snowball chart
    const activeEcon = state.routerEnabled ? routedEcon : primaryEcon;

    // Context-snowball comparison curves (always show at least 8 turns so curve is informative)
    const chartTurns = Math.max(state.turns, 8);
    const unoptParams = Object.assign({}, state, { cacheHit: 0, contextGrowth: true, compaction: false });
    const optParams = Object.assign({}, state, { cacheHit: Math.max(state.cacheHit, 80), compaction: true });

    let curveUnopt, curveCurr, curveOpt;
    if (state.routerEnabled) {
      curveUnopt = blendEconomics(
        computeModelEconomics(state.routerFast, unoptParams, chartTurns),
        computeModelEconomics(state.routerFrontier, unoptParams, chartTurns),
        state.routerSplit
      );
      curveCurr = blendEconomics(
        computeModelEconomics(state.routerFast, state, chartTurns),
        computeModelEconomics(state.routerFrontier, state, chartTurns),
        state.routerSplit
      );
      curveOpt = blendEconomics(
        computeModelEconomics(state.routerFast, optParams, chartTurns),
        computeModelEconomics(state.routerFrontier, optParams, chartTurns),
        state.routerSplit
      );
    } else {
      curveUnopt = computeModelEconomics(state.primaryModel, unoptParams, chartTurns);
      curveCurr = computeModelEconomics(state.primaryModel, state, chartTurns);
      curveOpt = computeModelEconomics(state.primaryModel, optParams, chartTurns);
    }

    // What-if savings for Verdict diagnostics
    const cache75Params = Object.assign({}, state, { cacheHit: 75 });
    const cache75MonthlyUsd = state.routerEnabled
      ? blendEconomics(
          computeModelEconomics(state.routerFast, cache75Params),
          computeModelEconomics(state.routerFrontier, cache75Params),
          state.routerSplit
        ).monthlyUsd
      : computeModelEconomics(state.primaryModel, cache75Params).monthlyUsd;

    const compactParams = Object.assign({}, state, { compaction: true });
    const compactMonthlyUsd = state.routerEnabled
      ? blendEconomics(
          computeModelEconomics(state.routerFast, compactParams),
          computeModelEconomics(state.routerFrontier, compactParams),
          state.routerSplit
        ).monthlyUsd
      : computeModelEconomics(state.primaryModel, compactParams).monthlyUsd;

    // Margin metrics
    const costPerUserActive = usdToActive(activeEcon.costPerUserUsd);
    const hasArpu = state.arpu > 0;
    const aiCogsPct = hasArpu ? (costPerUserActive / state.arpu) * 100 : null;
    const grossMarginPct = hasArpu ? ((state.arpu - costPerUserActive) / state.arpu) * 100 : null;

    return {
      modelTable: modelTable,
      econById: econById,
      cheapestId: cheapestId,
      primaryEcon: primaryEcon,
      fastEcon: fastEcon,
      frontierEcon: frontierEcon,
      routedEcon: routedEcon,
      activeEcon: activeEcon,
      routingMonthlySaveUsd: routingMonthlySaveUsd,
      routingAnnualSaveUsd: routingAnnualSaveUsd,
      routingSavePct: routingSavePct,
      chartTurns: chartTurns,
      curveUnopt: curveUnopt,
      curveCurr: curveCurr,
      curveOpt: curveOpt,
      cache75SavingUsd: Math.max(0, activeEcon.monthlyUsd - cache75MonthlyUsd),
      compactSavingUsd: Math.max(0, activeEcon.monthlyUsd - compactMonthlyUsd),
      hasArpu: hasArpu,
      aiCogsPct: aiCogsPct,
      grossMarginPct: grossMarginPct
    };
  }

  // ── RENDERING ──

  function renderKpis(res) {
    const active = res.activeEcon;
    const monthlyActive = usdToActive(active.monthlyUsd);
    const annualActive = monthlyActive * 12;
    const cpuActive = usdToActive(active.costPerUserUsd);
    const sessionActive = usdToActive(active.sessionCostUsd);

    el('ue-active-mode-label').textContent = state.routerEnabled
      ? 'Active mode: Routed (' + active.model.name + ')'
      : 'Active mode: Single Model (' + active.model.name + ')';

    el('ue-fx-note').textContent = CURRENCIES[state.currency].label;

    el('kpi-monthly-spend').textContent = formatMoney(monthlyActive, { compact: true });
    el('kpi-annual-spend').textContent = formatMoney(annualActive, { compact: true }) + ' / year run-rate';

    el('kpi-cost-per-user').textContent = formatMoney(cpuActive, { precise: cpuActive < 1 });
    const tokensPerUser = state.mau > 0 ? (active.monthlyInputTokens + active.monthlyOutputTokens) / state.mau : 0;
    el('kpi-tokens-per-user').textContent = formatTokens(tokensPerUser) + ' tokens / user / mo';

    el('kpi-cost-per-session').textContent = formatMoney(sessionActive, { precise: true });
    el('kpi-turns-summary').textContent =
      state.turns + (state.turns === 1 ? ' turn' : ' turns') + ' \u00B7 ' +
      formatTokens(active.sessionInputTokens + active.sessionOutputTokens) + ' tok';

    const marginCard = el('kpi-card-margin');
    marginCard.classList.remove('is-good', 'is-warn', 'is-danger');

    if (!res.hasArpu) {
      el('kpi-gross-margin').textContent = 'Set ARPU';
      el('kpi-ai-cogs').textContent = 'Internal tool mode (ARPU = 0)';
    } else {
      el('kpi-gross-margin').textContent = res.grossMarginPct.toFixed(1) + '%';
      el('kpi-ai-cogs').textContent = 'AI COGS: ' + res.aiCogsPct.toFixed(1) + '% of ' + formatMoney(state.arpu) + ' ARPU';
      if (res.grossMarginPct >= 75) {
        marginCard.classList.add('is-good');
      } else if (res.grossMarginPct >= 60) {
        marginCard.classList.add('is-warn');
      } else {
        marginCard.classList.add('is-danger');
      }
    }

    const annSaveActive = usdToActive(res.routingAnnualSaveUsd);
    el('kpi-routing-savings').textContent = formatMoney(annSaveActive, { compact: true });
    el('kpi-routing-pct').textContent = res.routingSavePct > 0.1
      ? res.routingSavePct.toFixed(0) + '% vs 100% ' + res.frontierEcon.model.name
      : 'Select a cheaper fast tier to save';

    // Input hints
    el('ue-monthly-sessions-hint').textContent = formatInt(state.mau * state.sessions) + ' sessions / month';
    el('ue-token-summary').textContent =
      'Avg session: ' + formatTokens(active.sessionInputTokens) + ' input + ' +
      formatTokens(active.sessionOutputTokens) + ' output tokens (' +
      formatTokens(active.monthlyInputTokens + active.monthlyOutputTokens) + ' total / mo incl. overheads)';
  }

  function buildVerdict(res) {
    const active = res.activeEcon;
    const bd = active.breakdownMonthlyUsd;
    const totalUsd = active.monthlyUsd || 1;
    const findings = [];

    let statusClass = 'is-good';
    let badgeText = 'Healthy Unit Economics';
    let headline = '';

    if (!res.hasArpu) {
      statusClass = 'is-neutral';
      badgeText = 'Internal Cost Mode';
      headline = 'Monthly AI spend sits at ' + formatMoney(usdToActive(active.monthlyUsd)) + ' (' +
        formatMoney(usdToActive(active.monthlyUsd * 12)) + ' annualised) across ' +
        formatInt(state.mau) + ' active users. Add an ARPU figure to test SaaS gross margin.';
    } else if (res.grossMarginPct < 50) {
      statusClass = 'is-danger';
      badgeText = 'Underwater Margin';
      headline = 'AI COGS eats ' + res.aiCogsPct.toFixed(1) + '% of your ' + formatMoney(state.arpu) +
        ' ARPU, leaving only ' + res.grossMarginPct.toFixed(1) + '% margin before cloud hosting and support. Do not ship flat-rate unlimited pricing on this architecture.';
    } else if (res.grossMarginPct < 70) {
      statusClass = 'is-danger';
      badgeText = 'Margin Compression (<70%)';
      headline = 'Gross margin after AI COGS drops to ' + res.grossMarginPct.toFixed(1) +
        '%. Once non-AI infra and payment fees take another 8% to 12%, SaaS margins fall well below the 70% benchmark.';
    } else if (res.grossMarginPct < 80) {
      statusClass = 'is-warn';
      badgeText = 'Watch Margin Headroom';
      headline = 'Margin after AI COGS is ' + res.grossMarginPct.toFixed(1) +
        '% (AI COGS ' + res.aiCogsPct.toFixed(1) + '%). Workable, but a 2x spike in power-user turns will compress margins quickly without caps.';
    } else {
      statusClass = 'is-good';
      badgeText = 'Healthy SaaS Margin';
      headline = 'AI COGS is just ' + res.aiCogsPct.toFixed(1) + '% of ARPU, preserving ' +
        res.grossMarginPct.toFixed(1) + '% gross margin after inference. You have real room to absorb traffic spikes or upgrade quality on hard prompts.';
    }

    // 1. Uncached system prompt / prefix trap
    const sysAndHistShare = ((bd.sys + bd.hist) / totalUsd) * 100;
    if (!active.model.isSelfHosted && state.cacheHit < 50 && sysAndHistShare >= 22 && res.cache75SavingUsd > 25) {
      findings.push({
        level: 'danger',
        title: 'Uncached prefix trap:',
        text: 'System prompts and conversation history drive ' + sysAndHistShare.toFixed(0) +
          '% of spend with only ' + state.cacheHit + '% cache hits. Stabilising the prompt prefix to hit 75% prompt caching saves ' +
          formatMoney(usdToActive(res.cache75SavingUsd)) + '/month (' +
          formatMoney(usdToActive(res.cache75SavingUsd * 12)) + '/year).'
      });
    }

    // 2. Agent step / context snowball trap
    if (state.turns >= 5 && state.contextGrowth && !state.compaction) {
      const histShare = (bd.hist / totalUsd) * 100;
      if (histShare >= 15 || state.turns >= 8) {
        findings.push({
          level: 'danger',
          title: 'Context snowballing on ' + state.turns + ' turns:',
          text: 'Re-sending uncompacted history makes up ' + histShare.toFixed(0) +
            '% of your monthly bill. Switching on rolling compaction after turn 3 cuts ' +
            formatMoney(usdToActive(res.compactSavingUsd)) + '/month immediately.'
        });
      }
    } else if (state.turns >= 5 && state.contextGrowth && state.compaction) {
      findings.push({
        level: 'good',
        title: 'History compaction is protecting your bill:',
        text: 'Capping verbatim history to a rolling window prevents quadratic token growth across your ' + state.turns + '-turn sessions.'
      });
    }

    // 3. Model routing opportunity
    if (!state.routerEnabled && res.routingAnnualSaveUsd > 500) {
      findings.push({
        level: 'warn',
        title: 'All-in single-model tax:',
        text: 'You are pricing 100% of volume on ' + res.primaryEcon.model.name +
          '. Enabling the ' + state.routerSplit + '/' + (100 - state.routerSplit) + ' model router (' +
          res.fastEcon.model.name + ' + ' + res.frontierEcon.model.name + ') saves ' +
          formatMoney(usdToActive(res.routingAnnualSaveUsd)) + '/year (' + res.routingSavePct.toFixed(0) + '%).'
      });
    } else if (state.routerEnabled && res.routingSavePct >= 25) {
      findings.push({
        level: 'good',
        title: 'Router split paying off:',
        text: 'Routing ' + state.routerSplit + '% of calls to ' + res.fastEcon.model.name +
          ' cuts ' + res.routingSavePct.toFixed(0) + '% off an all-' + res.frontierEcon.model.name +
          ' bill (' + formatMoney(usdToActive(res.routingAnnualSaveUsd)) + '/year saved).'
      });
    }

    // 4. Output token dominance
    const outShare = (bd.out / totalUsd) * 100;
    if (outShare >= 48) {
      findings.push({
        level: 'info',
        title: 'Output tokens dominate (' + outShare.toFixed(0) + '% of spend):',
        text: 'Output is billed at 4x to 5x input rates. Tightening max_tokens limits, removing verbose markdown preamble and using compact JSON keys will beat any input-side optimisation.'
      });
    }

    // 5. Retry / eval tax
    if (state.retryPct >= 10) {
      findings.push({
        level: 'warn',
        title: 'High retry waste (' + state.retryPct + '%):',
        text: 'Failed tool calls and broken JSON schemas add ' +
          formatMoney(usdToActive(bd.overhead)) + '/month (including ' + state.evalPct + '% eval sampling). Enforcing strict structured outputs and deterministic pre-validation should halve this.'
      });
    }

    // 6. Self-hosted utilisation trap
    const sh = res.econById['self-hosted'];
    if ((!state.routerEnabled && state.primaryModel === 'self-hosted') ||
        (state.routerEnabled && (state.routerFast === 'self-hosted' || state.routerFrontier === 'self-hosted'))) {
      if (sh.selfHostedMeta && sh.selfHostedMeta.hitFloor) {
        findings.push({
          level: 'warn',
          title: 'Idle GPU floor warning:',
          text: 'Your volume only needs ' + sh.selfHostedMeta.rawGpuHours.toFixed(0) +
            ' GPU-hours/month, yet a 24/7 node bills 730 hours (' +
            formatMoney(usdToActive(sh.monthlyUsd)) + '/mo). Fast-tier APIs beat self-hosting at this traffic level.'
        });
      } else if (state.gpuUtil < 40) {
        findings.push({
          level: 'info',
          title: 'Low GPU utilisation (' + state.gpuUtil + '%):',
          text: 'Autoscaling off-peak replicas or batching requests to lift average utilisation toward 55% would cut GPU spend substantially.'
        });
      }
    }

    // 7. Cheapest alternative pointer if active is >3x cheapest API
    const cheapest = res.econById[res.cheapestId];
    if (cheapest && active.monthlyUsd > cheapest.monthlyUsd * 3 && findings.length < 4) {
      findings.push({
        level: 'info',
        title: 'Lowest-cost benchmark:',
        text: cheapest.model.name + ' handles this exact token profile for ' +
          formatMoney(usdToActive(cheapest.monthlyUsd)) + '/month (' +
          ((1 - cheapest.monthlyUsd / active.monthlyUsd) * 100).toFixed(0) + '% less than current active spend).'
      });
    }

    if (findings.length === 0) {
      findings.push({
        level: 'good',
        title: 'No major architectural red flags:',
        text: 'Caching, turn count and model mix are well balanced for this volume. Keep per-user rate limits in place so top-1% power users cannot skew blended COGS.'
      });
    }

    return {
      statusClass: statusClass,
      badgeText: badgeText,
      headline: headline,
      findings: findings.slice(0, 5)
    };
  }

  function renderVerdict(res) {
    const v = buildVerdict(res);
    const badge = el('ue-verdict-badge');
    badge.className = 'ue-verdict-badge ' + v.statusClass;
    badge.textContent = v.badgeText;

    el('ue-verdict-headline').textContent = v.headline;

    const ul = el('ue-verdict-list');
    ul.innerHTML = v.findings.map(function (f) {
      return '<li class="ue-verdict-item">' +
        '<span class="ue-verdict-dot ue-verdict-dot--' + f.level + '" aria-hidden="true"></span>' +
        '<span><strong>' + escapeHtml(f.title) + '</strong> ' + escapeHtml(f.text) + '</span>' +
        '</li>';
    }).join('');
  }

  function renderBreakdownBar(res) {
    const bd = res.activeEcon.breakdownMonthlyUsd;
    const total = Math.max(0.000001, bd.sys + bd.rag + bd.hist + bd.usr + bd.out + bd.overhead);

    const items = [
      { key: 'sys', label: 'System Prompt', color: '#ff007f', swatch: 'pink', usd: bd.sys },
      { key: 'rag', label: 'RAG Context', color: '#00eefc', swatch: 'cyan', usd: bd.rag },
      { key: 'hist', label: 'Turn History', color: '#a855f7', swatch: 'purple', usd: bd.hist },
      { key: 'usr', label: 'User Input', color: '#60a5fa', swatch: 'blue', usd: bd.usr },
      { key: 'out', label: 'Output Tokens', color: '#22c55e', swatch: 'green', usd: bd.out },
      { key: 'overhead', label: 'Retries & Evals', color: '#f59e0b', swatch: 'amber', usd: bd.overhead }
    ];

    let topItem = items[0];
    items.forEach(function (it) {
      it.pct = (it.usd / total) * 100;
      if (it.usd > topItem.usd) topItem = it;
    });

    el('ue-top-driver').textContent = 'Top driver: ' + topItem.label + ' (' + topItem.pct.toFixed(0) + '%)';

    // Pure inline SVG stacked horizontal bar
    const W = 680;
    const H = 52;
    const barY = 8;
    const barH = 36;
    let x = 0;

    let rects = '';
    let labels = '';
    items.forEach(function (it) {
      const segW = (it.pct / 100) * W;
      if (segW <= 0.5) return;
      rects += '<rect x="' + x.toFixed(2) + '" y="' + barY + '" width="' + segW.toFixed(2) +
        '" height="' + barH + '" fill="' + it.color + '" opacity="0.92">' +
        '<title>' + escapeHtml(it.label) + ': ' + formatMoney(usdToActive(it.usd)) + '/mo (' + it.pct.toFixed(1) + '%)</title>' +
        '</rect>';
      if (it.pct >= 8.5) {
        const cx = x + segW / 2;
        const textFill = (it.key === 'rag' || it.key === 'out' || it.key === 'overhead') ? '#0e0e13' : '#ffffff';
        labels += '<text x="' + cx.toFixed(1) + '" y="' + (barY + barH / 2 + 4.5) +
          '" text-anchor="middle" fill="' + textFill +
          '" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="800">' +
          Math.round(it.pct) + '%</text>';
      }
      x += segW;
    });

    const svg =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Monthly cost breakdown by token driver">' +
      '<defs><clipPath id="ue-bar-clip"><rect x="0" y="' + barY + '" width="' + W + '" height="' + barH + '" rx="10" ry="10"/></clipPath></defs>' +
      '<rect x="0" y="' + barY + '" width="' + W + '" height="' + barH + '" rx="10" ry="10" fill="rgba(255,255,255,0.06)"/>' +
      '<g clip-path="url(#ue-bar-clip)">' + rects + '</g>' +
      labels +
      '</svg>';

    el('ue-breakdown-svg-wrap').innerHTML = svg;

    el('ue-breakdown-legend').innerHTML = items.map(function (it) {
      return '<div class="ue-bd-item">' +
        '<div class="ue-bd-top"><i class="ue-swatch ue-swatch--' + it.swatch + '"></i><span>' + escapeHtml(it.label) + '</span></div>' +
        '<div class="ue-bd-nums"><strong>' + formatMoney(usdToActive(it.usd)) + '</strong><span>' + it.pct.toFixed(1) + '%</span></div>' +
        '</div>';
    }).join('');
  }

  function renderSnowballChart(res) {
    const isCum = state.snowballMode === 'cumulative';
    const N = res.chartTurns;
    const unoptTurns = res.curveUnopt.turns;
    const currTurns = res.curveCurr.turns;
    const optTurns = res.curveOpt.turns;

    const getVal = function (pt) {
      return usdToActive(isCum ? pt.cumCostUsd : pt.turnCostUsd);
    };

    let maxVal = 0;
    for (let i = 0; i < N; i++) {
      maxVal = Math.max(maxVal, getVal(unoptTurns[i]), getVal(currTurns[i]), getVal(optTurns[i]));
    }
    if (maxVal <= 0) maxVal = 0.01;
    // Pad top by 12%
    const yMax = maxVal * 1.12;

    const W = 680;
    const H = 265;
    const padL = 68;
    const padR = 22;
    const padT = 18;
    const padB = 38;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const xFor = function (idx) {
      if (N <= 1) return padL + plotW / 2;
      return padL + (idx / (N - 1)) * plotW;
    };
    const yFor = function (v) {
      return padT + plotH - (v / yMax) * plotH;
    };

    // Gridlines (4 steps)
    let gridSvg = '';
    const ticks = 4;
    for (let g = 0; g <= ticks; g++) {
      const v = (yMax / ticks) * g;
      const y = yFor(v);
      gridSvg += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) +
        '" stroke="rgba(248,245,253,0.09)" stroke-dasharray="' + (g === 0 ? '' : '3 4') + '"/>';
      gridSvg += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) +
        '" text-anchor="end" fill="#b5b3bc" font-family="Space Grotesk, sans-serif" font-size="11">' +
        escapeHtml(formatMoney(v, { precise: v < 1 })) + '</text>';
    }

    // X-axis labels
    const labelStep = N <= 10 ? 1 : (N <= 20 ? 2 : 4);
    let xLabelsSvg = '';
    for (let i = 0; i < N; i++) {
      if (i % labelStep === 0 || i === N - 1 || i === state.turns - 1) {
        const x = xFor(i);
        const isCurrentTurn = (i + 1) === state.turns;
        xLabelsSvg += '<text x="' + x.toFixed(1) + '" y="' + (H - 12) +
          '" text-anchor="middle" fill="' + (isCurrentTurn ? '#00eefc' : '#b5b3bc') +
          '" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="' + (isCurrentTurn ? '800' : '600') +
          '">T' + (i + 1) + '</text>';
      }
    }

    const buildPath = function (arr) {
      return arr.map(function (pt, idx) {
        return (idx === 0 ? 'M' : 'L') + xFor(idx).toFixed(1) + ',' + yFor(getVal(pt)).toFixed(1);
      }).join(' ');
    };

    const unoptPath = buildPath(unoptTurns);
    const currPath = buildPath(currTurns);
    const optPath = buildPath(optTurns);

    // Subtle shaded area between unoptimised curve and baseline
    const unoptArea = unoptPath +
      ' L' + xFor(N - 1).toFixed(1) + ',' + (padT + plotH).toFixed(1) +
      ' L' + xFor(0).toFixed(1) + ',' + (padT + plotH).toFixed(1) + ' Z';

    // Active Turn vertical marker
    const activeIdx = Math.min(N - 1, Math.max(0, state.turns - 1));
    const activeX = xFor(activeIdx);
    const markerSvg =
      '<line x1="' + activeX.toFixed(1) + '" y1="' + padT + '" x2="' + activeX.toFixed(1) + '" y2="' + (padT + plotH) +
      '" stroke="rgba(0,238,252,0.55)" stroke-width="1.5" stroke-dasharray="4 3"/>' +
      '<rect x="' + Math.min(W - padR - 86, Math.max(padL, activeX - 42)).toFixed(1) + '" y="' + (padT + 2) +
      '" width="84" height="18" rx="9" fill="rgba(0,238,252,0.18)" stroke="rgba(0,238,252,0.6)"/>' +
      '<text x="' + (Math.min(W - padR - 86, Math.max(padL, activeX - 42)) + 42).toFixed(1) + '" y="' + (padT + 14) +
      '" text-anchor="middle" fill="#00eefc" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="800">YOUR T' + state.turns + '</text>';

    // Dots & interactive hover hit targets
    const colW = plotW / Math.max(1, N);
    let dotsSvg = '';
    let hitsSvg = '';
    for (let i = 0; i < N; i++) {
      const cx = xFor(i);
      const yU = yFor(getVal(unoptTurns[i]));
      const yC = yFor(getVal(currTurns[i]));
      const yO = yFor(getVal(optTurns[i]));
      const r = (i === activeIdx) ? 4.5 : 3;

      if (N <= 16 || i === activeIdx || i === N - 1 || i % 2 === 0) {
        dotsSvg += '<circle cx="' + cx.toFixed(1) + '" cy="' + yU.toFixed(1) + '" r="' + (r - 0.5) + '" fill="#ff007f"/>';
        dotsSvg += '<circle cx="' + cx.toFixed(1) + '" cy="' + yC.toFixed(1) + '" r="' + r + '" fill="#00eefc" stroke="#0e0e13" stroke-width="1.5"/>';
        dotsSvg += '<circle cx="' + cx.toFixed(1) + '" cy="' + yO.toFixed(1) + '" r="' + (r - 0.5) + '" fill="#22c55e"/>';
      }

      const hitX = Math.max(padL, cx - colW / 2);
      const hitW = Math.min(W - padR - hitX, colW);
      hitsSvg += '<rect class="ue-snowball-hit" data-idx="' + i + '" tabindex="0" role="button" aria-label="Turn ' + (i + 1) + ' cost details" ' +
        'x="' + hitX.toFixed(1) + '" y="' + padT + '" width="' + Math.max(8, hitW).toFixed(1) + '" height="' + plotH + '" fill="transparent" style="cursor:crosshair;"/>';
    }

    const svg =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Context snowball session cost curve across turns 1 to ' + N + '">' +
      '<defs>' +
        '<linearGradient id="ue-pink-area" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#ff007f" stop-opacity="0.22"/>' +
          '<stop offset="100%" stop-color="#ff007f" stop-opacity="0.01"/>' +
        '</linearGradient>' +
      '</defs>' +
      gridSvg +
      '<path d="' + unoptArea + '" fill="url(#ue-pink-area)"/>' +
      markerSvg +
      '<path d="' + unoptPath + '" fill="none" stroke="#ff007f" stroke-width="2.4" stroke-dasharray="6 4"/>' +
      '<path d="' + optPath + '" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="3 3"/>' +
      '<path d="' + currPath + '" fill="none" stroke="#00eefc" stroke-width="3"/>' +
      dotsSvg +
      xLabelsSvg +
      hitsSvg +
      '</svg>';

    const wrap = el('ue-snowball-svg-wrap');
    wrap.innerHTML = svg;

    // Subtitle explaining projection if turns < 8
    const sub = el('ue-snowball-sub');
    if (state.turns < 8) {
      sub.textContent = (isCum ? 'Cumulative session cost' : 'Incremental cost per turn') +
        ' projected across turns 1 to ' + N + ' (marker shows your active ' + state.turns +
        (state.turns === 1 ? '-turn' : '-turn') + ' setting). Hover or focus any turn for exact figures.';
    } else {
      sub.textContent = (isCum ? 'Cumulative session cost' : 'Incremental cost per turn') +
        ' across your ' + state.turns + '-step workflow. Hover or focus any turn to inspect the context snowball gap.';
    }

    // Bind tooltip events cleanly (zero inline handlers)
    const tooltip = el('ue-chart-tooltip');
    const showTip = function (idx) {
      const u = unoptTurns[idx];
      const c = currTurns[idx];
      const o = optTurns[idx];
      const uVal = getVal(u);
      const cVal = getVal(c);
      const oVal = getVal(o);
      const gapPct = uVal > 0 ? ((1 - cVal / uVal) * 100) : 0;

      tooltip.innerHTML =
        '<div style="font-weight:800;color:#00eefc;margin-bottom:4px;">Turn ' + c.turn +
        (c.turn === state.turns ? ' (Active)' : '') + ' &middot; ' +
        formatTokens(isCum ? c.cumInputTokens : c.inputTokens) + ' in tok</div>' +
        '<div><span style="color:#ff69b4;">Unoptimised:</span> ' + formatMoney(uVal, { precise: true }) + '</div>' +
        '<div><span style="color:#00eefc;">Current setup:</span> <strong>' + formatMoney(cVal, { precise: true }) + '</strong></div>' +
        '<div><span style="color:#4ade80;">Optimised target:</span> ' + formatMoney(oVal, { precise: true }) + '</div>' +
        '<div style="margin-top:3px;color:#b5b3bc;font-size:0.7rem;">vs unoptimised: ' +
        (gapPct >= 0 ? '-' + gapPct.toFixed(0) + '% saved' : '+' + Math.abs(gapPct).toFixed(0) + '%') + '</div>';
      tooltip.hidden = false;
    };

    const hideTip = function () {
      tooltip.hidden = true;
    };

    const hits = wrap.querySelectorAll('.ue-snowball-hit');
    hits.forEach(function (rect) {
      const idx = Number(rect.getAttribute('data-idx'));
      rect.addEventListener('mouseenter', function () { showTip(idx); });
      rect.addEventListener('focus', function () { showTip(idx); });
      rect.addEventListener('mouseleave', hideTip);
      rect.addEventListener('blur', hideTip);
    });

    // Accessible data table
    const tableWrap = el('ue-snowball-table-wrap');
    tableWrap.hidden = !state.showSnowballTable;
    if (state.showSnowballTable) {
      let rows = '';
      for (let i = 0; i < N; i++) {
        const u = unoptTurns[i];
        const c = currTurns[i];
        const o = optTurns[i];
        rows += '<tr' + (c.turn === state.turns ? ' style="background:rgba(0,238,252,0.08);"' : '') + '>' +
          '<td>Turn ' + c.turn + (c.turn === state.turns ? ' *' : '') + '</td>' +
          '<td>' + formatTokens(isCum ? c.cumInputTokens : c.inputTokens) + '</td>' +
          '<td>' + formatMoney(getVal(u), { precise: true }) + '</td>' +
          '<td><strong>' + formatMoney(getVal(c), { precise: true }) + '</strong></td>' +
          '<td>' + formatMoney(getVal(o), { precise: true }) + '</td>' +
          '</tr>';
      }
      tableWrap.innerHTML =
        '<table class="ue-mini-table">' +
        '<thead><tr><th>Step</th><th>Input Tokens</th><th>Unoptimised</th><th>Current</th><th>Optimised</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';
    }
  }

  function renderRouter(res) {
    const fastPct = state.routerSplit;
    const frontPct = 100 - fastPct;

    el('in-router-split-val').textContent = fastPct + '% Fast / ' + frontPct + '% Frontier';
    el('ue-router-bar-fast').style.width = fastPct + '%';
    el('ue-router-bar-frontier').style.width = frontPct + '%';

    el('ue-router-all-frontier').textContent = formatMoney(usdToActive(res.frontierEcon.monthlyUsd));
    el('ue-router-blended').textContent = formatMoney(usdToActive(res.routedEcon.monthlyUsd));
    el('ue-router-monthly-save').textContent = formatMoney(usdToActive(res.routingMonthlySaveUsd));
    el('ue-router-annual-save').textContent =
      formatMoney(usdToActive(res.routingAnnualSaveUsd)) + ' (' + res.routingSavePct.toFixed(0) + '%)';
  }

  function renderModelTable(res) {
    // Self-hosted sizing note
    const sh = res.econById['self-hosted'];
    if (sh && sh.selfHostedMeta) {
      const meta = sh.selfHostedMeta;
      el('ue-gpu-sizing-note').textContent = meta.hitFloor
        ? 'Volume needs ' + meta.rawGpuHours.toFixed(0) + ' GPU-hrs/mo (below 1-GPU 24/7 floor of 730 hrs) \u2192 1 dedicated GPU billed = ' +
          formatMoney(usdToActive(sh.monthlyUsd)) + '/mo (~' + formatMoney(usdToActive(meta.effPer1MUsd), { precise: true }) + ' per 1M blended tokens).'
        : 'Volume requires ' + meta.gpusRequired.toFixed(1) + ' always-on GPUs (' + formatInt(meta.billedGpuHours) + ' GPU-hrs/mo at ' +
          state.gpuUtil + '% utilisation) = ' + formatMoney(usdToActive(sh.monthlyUsd)) + '/mo (~' +
          formatMoney(usdToActive(meta.effPer1MUsd), { precise: true }) + ' per 1M blended tokens).';
    }

    const tierLabelMap = {
      fast: { text: 'Fast', cls: 'ue-tier-pill--fast' },
      balanced: { text: 'Balanced', cls: 'ue-tier-pill--balanced' },
      frontier: { text: 'Frontier', cls: 'ue-tier-pill--frontier' },
      self: { text: 'Self-Hosted', cls: 'ue-tier-pill--self' }
    };

    const tbody = el('ue-models-tbody');
    tbody.innerHTML = res.modelTable.map(function (item) {
      const m = item.model;
      const isPrimary = m.id === state.primaryModel;
      const isCheapest = m.id === res.cheapestId;
      const tierInfo = tierLabelMap[m.tier] || tierLabelMap.balanced;

      const rateText = m.isSelfHosted
        ? formatMoney(state.gpuRate, { precise: true }) + '/hr (' + state.gpuUtil + '% util)'
        : formatMoney(usdToActive(m.inputPer1M), { precise: true }) + ' / ' + formatMoney(usdToActive(m.outputPer1M), { precise: true });

      const cpuActive = usdToActive(item.costPerUserUsd);
      const cogsText = res.hasArpu ? ((cpuActive / state.arpu) * 100).toFixed(1) + '%' : '-';
      const marginVal = res.hasArpu ? ((state.arpu - cpuActive) / state.arpu) * 100 : null;
      let marginClass = '';
      if (marginVal !== null) {
        if (marginVal >= 75) marginClass = 'ue-text-green';
        else if (marginVal >= 60) marginClass = 'ue-text-amber';
        else marginClass = 'ue-text-pink';
      }
      const marginText = marginVal !== null ? marginVal.toFixed(1) + '%' : '-';

      return '<tr data-model-id="' + escapeHtml(m.id) + '" class="' + (isPrimary ? 'is-primary' : '') + '">' +
        '<td>' +
          '<div class="ue-model-cell">' +
            '<div class="ue-model-name-row">' +
              '<strong>' + escapeHtml(m.name) + '</strong>' +
              '<span class="ue-tier-pill ' + tierInfo.cls + '">' + tierInfo.text + '</span>' +
              (isCheapest ? '<span class="ue-tier-pill ue-tier-pill--cheapest">Cheapest</span>' : '') +
            '</div>' +
            '<span class="ue-model-provider">' + escapeHtml(m.provider) + '</span>' +
          '</div>' +
        '</td>' +
        '<td>' + escapeHtml(rateText) + '</td>' +
        '<td>' + escapeHtml(formatMoney(usdToActive(item.sessionCostUsd), { precise: true })) + '</td>' +
        '<td>' + escapeHtml(formatMoney(cpuActive, { precise: cpuActive < 1 })) + '</td>' +
        '<td><strong>' + escapeHtml(formatMoney(usdToActive(item.monthlyUsd))) + '</strong></td>' +
        '<td>' + escapeHtml(cogsText) + '</td>' +
        '<td class="' + marginClass + '"><strong>' + escapeHtml(marginText) + '</strong></td>' +
        '<td>' +
          '<button type="button" class="ue-select-model-btn' + (isPrimary ? ' is-active' : '') + '" data-select-model="' + escapeHtml(m.id) + '">' +
            (isPrimary ? 'Primary' : 'Select') +
          '</button>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  function syncFormFromState() {
    el('in-mau').value = state.mau;
    el('in-sessions').value = state.sessions;
    el('in-turns').value = state.turns;
    el('in-turns-range').value = Math.min(30, state.turns);
    el('val-turns').textContent = state.turns + (state.turns === 1 ? ' turn' : ' turns');

    el('in-context-growth').checked = state.contextGrowth;
    el('in-compaction').checked = state.compaction;
    el('in-compaction').disabled = !state.contextGrowth;
    const compLabel = el('in-compaction').closest('.ue-toggle-row');
    if (compLabel) compLabel.classList.toggle('is-disabled', !state.contextGrowth);

    el('in-sys-tokens').value = state.sysTokens;
    el('in-rag-tokens').value = state.ragTokens;
    el('in-user-tokens').value = state.userTokens;
    el('in-out-tokens').value = state.outTokens;

    el('in-cache-hit').value = state.cacheHit;
    el('in-cache-hit-range').value = Math.min(95, state.cacheHit);
    el('val-cache-hit').textContent = state.cacheHit + '%';

    el('in-retry-pct').value = state.retryPct;
    el('in-retry-pct-range').value = Math.min(40, state.retryPct);
    el('val-retry-pct').textContent = state.retryPct + '%';

    el('in-eval-pct').value = state.evalPct;
    el('in-eval-pct-range').value = Math.min(50, state.evalPct);
    el('val-eval-pct').textContent = state.evalPct + '%';

    el('in-arpu').value = state.arpu;
    el('lbl-arpu-currency').textContent = currSymbol();
    el('lbl-gpu-currency').textContent = currSymbol();

    el('in-router-enabled').checked = state.routerEnabled;
    el('in-router-fast').value = state.routerFast;
    el('in-router-frontier').value = state.routerFrontier;
    el('in-router-split').value = state.routerSplit;

    el('in-gpu-rate').value = state.gpuRate;
    el('in-gpu-util').value = state.gpuUtil;
    el('in-gpu-tps').value = state.gpuTps;

    // Currency buttons
    document.querySelectorAll('.ue-curr-btn').forEach(function (btn) {
      const isAct = btn.getAttribute('data-currency') === state.currency;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
    });

    // Preset buttons
    document.querySelectorAll('.ue-preset-btn').forEach(function (btn) {
      const isAct = btn.getAttribute('data-preset') === state.preset;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
    });

    // Snowball mode buttons
    const isCum = state.snowballMode === 'cumulative';
    el('ue-snowball-cum-btn').classList.toggle('active', isCum);
    el('ue-snowball-cum-btn').setAttribute('aria-pressed', isCum ? 'true' : 'false');
    el('ue-snowball-turn-btn').classList.toggle('active', !isCum);
    el('ue-snowball-turn-btn').setAttribute('aria-pressed', !isCum ? 'true' : 'false');

    el('ue-snowball-table-btn').textContent = state.showSnowballTable ? 'Hide table' : 'Show table';
    el('ue-snowball-table-btn').setAttribute('aria-expanded', state.showSnowballTable ? 'true' : 'false');
  }

  function renderAll() {
    lastResults = computeFullScenario();
    renderKpis(lastResults);
    renderVerdict(lastResults);
    renderBreakdownBar(lastResults);
    renderSnowballChart(lastResults);
    renderRouter(lastResults);
    renderModelTable(lastResults);
  }

  // ── PRESETS & CURRENCY ──

  function applyPreset(presetKey, silent) {
    const p = PRESETS[presetKey];
    if (!p) return;

    state.preset = presetKey;
    state.mau = p.mau;
    state.sessions = p.sessions;
    state.turns = p.turns;
    state.contextGrowth = p.contextGrowth;
    state.compaction = p.compaction;
    state.sysTokens = p.sysTokens;
    state.ragTokens = p.ragTokens;
    state.userTokens = p.userTokens;
    state.outTokens = p.outTokens;
    state.cacheHit = p.cacheHit;
    state.retryPct = p.retryPct;
    state.evalPct = p.evalPct;
    state.arpu = Math.round(p.arpuGbp * (fxRate(state.currency) / fxRate('GBP')));
    state.primaryModel = p.primaryModel;
    state.routerEnabled = p.routerEnabled;
    state.routerFast = p.routerFast;
    state.routerFrontier = p.routerFrontier;
    state.routerSplit = p.routerSplit;

    syncFormFromState();
    renderAll();
    if (!silent) showToast('Loaded preset: ' + p.label);
  }

  function switchCurrency(newCurr) {
    if (!CURRENCIES[newCurr] || newCurr === state.currency) return;
    const ratio = fxRate(newCurr) / fxRate(state.currency);
    state.currency = newCurr;
    if (state.arpu > 0) {
      state.arpu = Math.round(state.arpu * ratio * 100) / 100;
    }
    state.gpuRate = Math.round(state.gpuRate * ratio * 100) / 100;
    syncFormFromState();
    renderAll();
  }

  // ── SHAREABLE URL ENCODE / DECODE ──

  function buildShareUrl() {
    const params = new URLSearchParams();
    params.set('p', state.preset || 'custom');
    params.set('cur', state.currency);
    params.set('mau', String(state.mau));
    params.set('ses', String(state.sessions));
    params.set('t', String(state.turns));
    params.set('cg', state.contextGrowth ? '1' : '0');
    params.set('cp', state.compaction ? '1' : '0');
    params.set('sys', String(state.sysTokens));
    params.set('rag', String(state.ragTokens));
    params.set('usr', String(state.userTokens));
    params.set('out', String(state.outTokens));
    params.set('ch', String(state.cacheHit));
    params.set('ret', String(state.retryPct));
    params.set('ev', String(state.evalPct));
    params.set('arpu', String(state.arpu));
    params.set('m', state.primaryModel);
    params.set('re', state.routerEnabled ? '1' : '0');
    params.set('rf', state.routerFast);
    params.set('rx', state.routerFrontier);
    params.set('rs', String(state.routerSplit));
    params.set('gr', String(state.gpuRate));
    params.set('gu', String(state.gpuUtil));
    params.set('gt', String(state.gpuTps));

    const base = window.location.protocol === 'file:'
      ? 'https://johnb.io/ai-unit-economics'
      : window.location.origin + window.location.pathname;
    return base + '?' + params.toString();
  }

  function loadStateFromUrl() {
    const raw = window.location.search || (window.location.hash.startsWith('#?') ? window.location.hash.slice(1) : '');
    if (!raw || raw.length < 3) return false;
    const q = new URLSearchParams(raw);
    if (!q.has('mau') && !q.has('m')) return false;

    if (q.has('cur') && CURRENCIES[q.get('cur')]) state.currency = q.get('cur');
    if (q.has('p')) state.preset = PRESETS[q.get('p')] ? q.get('p') : 'custom';
    if (q.has('mau')) state.mau = clamp(q.get('mau'), 1, 50000000, state.mau);
    if (q.has('ses')) state.sessions = clamp(q.get('ses'), 1, 10000, state.sessions);
    if (q.has('t')) state.turns = clamp(q.get('t'), 1, 50, state.turns);
    if (q.has('cg')) state.contextGrowth = q.get('cg') === '1';
    if (q.has('cp')) state.compaction = q.get('cp') === '1';
    if (q.has('sys')) state.sysTokens = clamp(q.get('sys'), 0, 200000, state.sysTokens);
    if (q.has('rag')) state.ragTokens = clamp(q.get('rag'), 0, 500000, state.ragTokens);
    if (q.has('usr')) state.userTokens = clamp(q.get('usr'), 0, 200000, state.userTokens);
    if (q.has('out')) state.outTokens = clamp(q.get('out'), 1, 100000, state.outTokens);
    if (q.has('ch')) state.cacheHit = clamp(q.get('ch'), 0, 95, state.cacheHit);
    if (q.has('ret')) state.retryPct = clamp(q.get('ret'), 0, 100, state.retryPct);
    if (q.has('ev')) state.evalPct = clamp(q.get('ev'), 0, 100, state.evalPct);
    if (q.has('arpu')) state.arpu = clamp(q.get('arpu'), 0, 100000, state.arpu);
    if (q.has('m') && MODEL_MAP[q.get('m')]) state.primaryModel = q.get('m');
    if (q.has('re')) state.routerEnabled = q.get('re') === '1';
    if (q.has('rf') && MODEL_MAP[q.get('rf')]) state.routerFast = q.get('rf');
    if (q.has('rx') && MODEL_MAP[q.get('rx')]) state.routerFrontier = q.get('rx');
    if (q.has('rs')) state.routerSplit = clamp(q.get('rs'), 0, 100, state.routerSplit);
    if (q.has('gr')) state.gpuRate = clamp(q.get('gr'), 0.2, 100, state.gpuRate);
    if (q.has('gu')) state.gpuUtil = clamp(q.get('gu'), 5, 95, state.gpuUtil);
    if (q.has('gt')) state.gpuTps = clamp(q.get('gt'), 10, 2000, state.gpuTps);

    return true;
  }

  // ── EXPORTS: CFO BRIEF (.MD) & CSV ──

  function generateCfoMarkdown(res) {
    const active = res.activeEcon;
    const verdict = buildVerdict(res);
    const bd = active.breakdownMonthlyUsd;
    const totalUsd = active.monthlyUsd || 1;
    const dateStr = new Date().toISOString().slice(0, 10);

    const lines = [
      '# AI Unit-Economics & Margin Brief',
      '',
      'Generated: ' + dateStr + ' | Currency: ' + state.currency + ' | Source: https://johnb.io/ai-unit-economics',
      '',
      '## Executive Summary',
      '',
      '- **Active Configuration:** ' + (state.routerEnabled ? 'Model Router (' + active.model.name + ')' : 'Single Model (' + active.model.name + ')'),
      '- **Monthly AI Spend:** ' + formatMoney(usdToActive(active.monthlyUsd)) + ' (' + formatMoney(usdToActive(active.monthlyUsd * 12)) + ' annualised)',
      '- **Cost per Active User / Month:** ' + formatMoney(usdToActive(active.costPerUserUsd), { precise: true }),
      '- **Cost per Session:** ' + formatMoney(usdToActive(active.sessionCostUsd), { precise: true }),
      '- **SaaS Gross Margin After AI COGS:** ' + (res.hasArpu ? res.grossMarginPct.toFixed(1) + '% (AI COGS ' + res.aiCogsPct.toFixed(1) + '% of ' + formatMoney(state.arpu) + ' ARPU)' : 'Not set (ARPU = 0)'),
      '- **Annualised Model Routing Savings:** ' + formatMoney(usdToActive(res.routingAnnualSaveUsd)) + ' (' + res.routingSavePct.toFixed(0) + '% vs 100% ' + res.frontierEcon.model.name + ')',
      '',
      '## Margin & Architecture Verdict (' + verdict.badgeText + ')',
      '',
      verdict.headline,
      ''
    ];

    verdict.findings.forEach(function (f) {
      lines.push('- **' + f.title + '** ' + f.text);
    });

    lines.push(
      '',
      '## Workload Assumptions',
      '',
      '| Parameter | Value |',
      '|---|---|',
      '| Monthly Active Users (MAU) | ' + formatInt(state.mau) + ' |',
      '| Sessions / User / Month | ' + formatInt(state.sessions) + ' (' + formatInt(state.mau * state.sessions) + ' total) |',
      '| Turns / Agent Steps per Session | ' + state.turns + ' |',
      '| Context Growth / Rolling Compaction | ' + (state.contextGrowth ? 'Growing' : 'Stateless') + ' / ' + (state.compaction ? 'Compacted after turn 3' : 'Off') + ' |',
      '| System Prompt / RAG / User / Output (tokens) | ' + state.sysTokens + ' / ' + state.ragTokens + ' / ' + state.userTokens + ' / ' + state.outTokens + ' |',
      '| Prompt Cache Hit Rate | ' + state.cacheHit + '% |',
      '| Retry / Eval Overheads | ' + state.retryPct + '% / ' + state.evalPct + '% |',
      '',
      '## Monthly Cost Breakdown',
      '',
      '| Cost Driver | Monthly Spend | Share |',
      '|---|---:|---:|',
      '| System Prompt & Tool Schemas | ' + formatMoney(usdToActive(bd.sys)) + ' | ' + ((bd.sys / totalUsd) * 100).toFixed(1) + '% |',
      '| RAG / Retrieved Context | ' + formatMoney(usdToActive(bd.rag)) + ' | ' + ((bd.rag / totalUsd) * 100).toFixed(1) + '% |',
      '| Conversation / Agent History | ' + formatMoney(usdToActive(bd.hist)) + ' | ' + ((bd.hist / totalUsd) * 100).toFixed(1) + '% |',
      '| User Input / Tool Results | ' + formatMoney(usdToActive(bd.usr)) + ' | ' + ((bd.usr / totalUsd) * 100).toFixed(1) + '% |',
      '| Model Output Tokens | ' + formatMoney(usdToActive(bd.out)) + ' | ' + ((bd.out / totalUsd) * 100).toFixed(1) + '% |',
      '| Retries & Eval Sampling | ' + formatMoney(usdToActive(bd.overhead)) + ' | ' + ((bd.overhead / totalUsd) * 100).toFixed(1) + '% |',
      '',
      '## Late-2026 Model Comparison',
      '',
      '| Model | Tier | Cost / Session | Cost / User / Mo | Monthly Spend | AI COGS % | Gross Margin |',
      '|---|---|---:|---:|---:|---:|---:|'
    );

    res.modelTable.forEach(function (item) {
      const cpu = usdToActive(item.costPerUserUsd);
      const cogs = res.hasArpu ? ((cpu / state.arpu) * 100).toFixed(1) + '%' : '-';
      const gm = res.hasArpu ? (((state.arpu - cpu) / state.arpu) * 100).toFixed(1) + '%' : '-';
      lines.push(
        '| ' + item.model.name + (item.model.id === state.primaryModel ? ' (Primary)' : '') +
        ' | ' + item.model.tier +
        ' | ' + formatMoney(usdToActive(item.sessionCostUsd), { precise: true }) +
        ' | ' + formatMoney(cpu, { precise: cpu < 1 }) +
        ' | ' + formatMoney(usdToActive(item.monthlyUsd)) +
        ' | ' + cogs +
        ' | ' + gm + ' |'
      );
    });

    lines.push('', 'Scenario link: ' + buildShareUrl(), '');
    return lines.join('\n');
  }

  function csvCell(v) {
    const s = String(v == null ? '' : v);
    if (/[",\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function generateCsv(res) {
    const rows = [
      ['Section', 'Metric / Model', 'Tier / Detail', 'Cost per Session (' + state.currency + ')', 'Cost per User (' + state.currency + ')', 'Monthly Spend (' + state.currency + ')', 'AI COGS %', 'Gross Margin %']
    ];

    const active = res.activeEcon;
    rows.push([
      'Active Scenario',
      active.model.name,
      state.routerEnabled ? 'Routed (' + state.routerSplit + '% fast)' : 'Primary single model',
      usdToActive(active.sessionCostUsd).toFixed(5),
      usdToActive(active.costPerUserUsd).toFixed(4),
      usdToActive(active.monthlyUsd).toFixed(2),
      res.hasArpu ? res.aiCogsPct.toFixed(2) : '',
      res.hasArpu ? res.grossMarginPct.toFixed(2) : ''
    ]);

    res.modelTable.forEach(function (item) {
      const cpu = usdToActive(item.costPerUserUsd);
      rows.push([
        'Model Comparison',
        item.model.name,
        item.model.tier,
        usdToActive(item.sessionCostUsd).toFixed(5),
        cpu.toFixed(4),
        usdToActive(item.monthlyUsd).toFixed(2),
        res.hasArpu ? ((cpu / state.arpu) * 100).toFixed(2) : '',
        res.hasArpu ? (((state.arpu - cpu) / state.arpu) * 100).toFixed(2) : ''
      ]);
    });

    return rows.map(function (r) {
      return r.map(csvCell).join(',');
    }).join('\r\n');
  }

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
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('Copy failed - please copy manually.');
    }
    document.body.removeChild(ta);
  }

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ── INITIALISATION & EVENT BINDING ──

  function populateRouterSelects() {
    const fastSel = el('in-router-fast');
    const frontSel = el('in-router-frontier');

    const optionsHtml = MODELS.map(function (m) {
      const priceHint = m.isSelfHosted
        ? 'Self-Hosted GPU'
        : '$' + m.inputPer1M.toFixed(2) + '/$' + m.outputPer1M.toFixed(2);
      return '<option value="' + escapeHtml(m.id) + '">' + escapeHtml(m.name) + ' (' + priceHint + ')</option>';
    }).join('');

    fastSel.innerHTML = optionsHtml;
    frontSel.innerHTML = optionsHtml;
  }

  function bindEvents() {
    // Currency toggle
    document.querySelectorAll('.ue-curr-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchCurrency(btn.getAttribute('data-currency'));
      });
    });

    // Presets
    document.querySelectorAll('.ue-preset-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPreset(btn.getAttribute('data-preset'), false);
      });
    });

    el('ue-reset-btn').addEventListener('click', function () {
      const key = PRESETS[state.preset] ? state.preset : 'saas-copilot';
      applyPreset(key, false);
    });

    // Quick MAU chips
    document.querySelectorAll('.ue-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const val = Number(chip.getAttribute('data-val'));
        if (Number.isFinite(val)) {
          state.mau = val;
          syncFormFromState();
          renderAll();
        }
      });
    });

    // Helper for synced number inputs
    function bindNum(id, prop, min, max) {
      const input = el(id);
      input.addEventListener('input', function () {
        state[prop] = clamp(input.value, min, max, state[prop]);
        renderAll();
      });
      input.addEventListener('blur', function () {
        input.value = state[prop];
      });
    }

    bindNum('in-mau', 'mau', 1, 50000000);
    bindNum('in-sessions', 'sessions', 1, 10000);
    bindNum('in-sys-tokens', 'sysTokens', 0, 200000);
    bindNum('in-rag-tokens', 'ragTokens', 0, 500000);
    bindNum('in-user-tokens', 'userTokens', 0, 200000);
    bindNum('in-out-tokens', 'outTokens', 1, 100000);
    bindNum('in-arpu', 'arpu', 0, 100000);
    bindNum('in-gpu-rate', 'gpuRate', 0.2, 100);
    bindNum('in-gpu-util', 'gpuUtil', 5, 95);
    bindNum('in-gpu-tps', 'gpuTps', 10, 2000);

    // Synced slider + number pairs
    function bindSliderPair(rangeId, numId, labelId, prop, min, max, fmt) {
      const rEl = el(rangeId);
      const nEl = el(numId);
      const lEl = el(labelId);

      rEl.addEventListener('input', function () {
        state[prop] = clamp(rEl.value, min, max, state[prop]);
        nEl.value = state[prop];
        lEl.textContent = fmt(state[prop]);
        renderAll();
      });

      nEl.addEventListener('input', function () {
        state[prop] = clamp(nEl.value, min, max, state[prop]);
        rEl.value = Math.min(Number(rEl.max), state[prop]);
        lEl.textContent = fmt(state[prop]);
        renderAll();
      });

      nEl.addEventListener('blur', function () {
        nEl.value = state[prop];
      });
    }

    bindSliderPair('in-turns-range', 'in-turns', 'val-turns', 'turns', 1, 50, function (v) {
      return v + (v === 1 ? ' turn' : ' turns');
    });
    bindSliderPair('in-cache-hit-range', 'in-cache-hit', 'val-cache-hit', 'cacheHit', 0, 95, function (v) {
      return v + '%';
    });
    bindSliderPair('in-retry-pct-range', 'in-retry-pct', 'val-retry-pct', 'retryPct', 0, 100, function (v) {
      return v + '%';
    });
    bindSliderPair('in-eval-pct-range', 'in-eval-pct', 'val-eval-pct', 'evalPct', 0, 100, function (v) {
      return v + '%';
    });

    // Context toggles
    el('in-context-growth').addEventListener('change', function (e) {
      state.contextGrowth = Boolean(e.target.checked);
      if (!state.contextGrowth) state.compaction = false;
      syncFormFromState();
      renderAll();
    });

    el('in-compaction').addEventListener('change', function (e) {
      state.compaction = Boolean(e.target.checked);
      renderAll();
    });

    // Router controls
    el('in-router-enabled').addEventListener('change', function (e) {
      state.routerEnabled = Boolean(e.target.checked);
      renderAll();
    });

    el('in-router-fast').addEventListener('change', function (e) {
      state.routerFast = e.target.value;
      renderAll();
    });

    el('in-router-frontier').addEventListener('change', function (e) {
      state.routerFrontier = e.target.value;
      renderAll();
    });

    el('in-router-split').addEventListener('input', function (e) {
      state.routerSplit = clamp(e.target.value, 0, 100, 80);
      renderAll();
    });

    // Model table row click delegation
    el('ue-models-tbody').addEventListener('click', function (e) {
      const btn = e.target.closest('[data-select-model]');
      const row = e.target.closest('tr[data-model-id]');
      const modelId = btn ? btn.getAttribute('data-select-model') : (row ? row.getAttribute('data-model-id') : null);
      if (modelId && MODEL_MAP[modelId]) {
        state.primaryModel = modelId;
        if (state.routerEnabled) {
          // If user explicitly clicks a primary model while router is active, switch to single-model view so they see that model's KPIs immediately
          state.routerEnabled = false;
          el('in-router-enabled').checked = false;
        }
        renderAll();
        showToast('Primary model set to ' + MODEL_MAP[modelId].name);
      }
    });

    // Snowball chart toggles
    el('ue-snowball-cum-btn').addEventListener('click', function () {
      state.snowballMode = 'cumulative';
      syncFormFromState();
      renderSnowballChart(lastResults);
    });

    el('ue-snowball-turn-btn').addEventListener('click', function () {
      state.snowballMode = 'turn';
      syncFormFromState();
      renderSnowballChart(lastResults);
    });

    el('ue-snowball-table-btn').addEventListener('click', function () {
      state.showSnowballTable = !state.showSnowballTable;
      syncFormFromState();
      renderSnowballChart(lastResults);
    });

    // Export & Share buttons
    el('ue-copy-url-btn').addEventListener('click', function () {
      const url = buildShareUrl();
      if (window.location.protocol !== 'file:' && window.history && window.history.replaceState) {
        try {
          window.history.replaceState(null, '', url);
        } catch (err) {
          // ignore if blocked
        }
      }
      copyText(url, 'Shareable scenario URL copied.');
    });

    el('ue-copy-md-btn').addEventListener('click', function () {
      if (!lastResults) return;
      copyText(generateCfoMarkdown(lastResults), 'CFO Cost Brief (Markdown) copied.');
    });

    el('ue-download-md-btn').addEventListener('click', function () {
      if (!lastResults) return;
      downloadFile(generateCfoMarkdown(lastResults), 'ai-unit-economics-brief.md', 'text/markdown;charset=utf-8');
      showToast('Downloaded ai-unit-economics-brief.md');
    });

    el('ue-download-csv-btn').addEventListener('click', function () {
      if (!lastResults) return;
      downloadFile(generateCsv(lastResults), 'ai-unit-economics-comparison.csv', 'text/csv;charset=utf-8');
      showToast('Downloaded ai-unit-economics-comparison.csv');
    });

    el('ue-print-btn').addEventListener('click', function () {
      window.print();
    });

    // Prevent accidental form submission on Enter
    el('ue-form').addEventListener('submit', function (e) {
      e.preventDefault();
    });

    // Back-to-top button (CSP-safe, no inline script)
    const btt = el('back-to-top');
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
    populateRouterSelects();
    const loadedFromUrl = loadStateFromUrl();
    if (!loadedFromUrl) {
      applyPreset('saas-copilot', true);
    } else {
      syncFormFromState();
      renderAll();
    }
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
