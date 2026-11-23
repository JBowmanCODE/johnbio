/* AI Architecture Advisor & ADR Generator - JohnB.io
 * 100% client-side deterministic architecture engine, interactive SVG topology,
 * pre-production failure-mode checklist and MADR Markdown generator.
 */
(function () {
  'use strict';

  const CONSTRAINT_LABELS = {
    taskType: {
      classification: 'Classification / Extraction',
      qa: 'Knowledge Q&A',
      drafting: 'Drafting / Synthesis',
      tools: 'Multi-step Tool Execution',
      code: 'Code / Data Generation'
    },
    latency: {
      realtime: '<500ms real-time',
      interactive: '1-5s interactive',
      async: 'Async / Batch'
    },
    freshness: {
      static: 'Static / Rarely changes',
      periodic: 'Weekly / Daily docs',
      live: 'Real-time live APIs / DB'
    },
    corpus: {
      small: 'Fits in prompt (<100k tokens)',
      medium: 'Medium (100k-10M tokens)',
      enterprise: 'Enterprise (10M+ tokens)'
    },
    hallucination: {
      zero: 'Zero / Regulated (citations mandatory)',
      moderate: 'Moderate (human reviews)',
      high: 'High (creative draft)'
    },
    actionRisk: {
      readonly: 'Read-only text',
      drafts: 'Drafts / Suggestions',
      autonomous: 'Autonomous Write / Money / External Actions'
    },
    privacy: {
      commercial: 'Standard Commercial API',
      zdr: 'Zero Data Retention / UK-EU Residency',
      airgapped: 'Air-Gapped / Self-Hosted'
    },
    volume: {
      low: '<10k requests / month',
      medium: '10k-500k requests / month',
      high: '500k-5M requests / month',
      veryhigh: '5M+ requests / month'
    },
    team: {
      solo: 'Solo Founder / Small Eng Team',
      mid: 'Mid-size Product Team',
      ml: 'Dedicated ML / Platform Team'
    }
  };

  const PRESETS = [
    {
      id: 'policy-qa',
      label: 'Internal Policy Q&A',
      icon: 'menu_book',
      summary: 'HR & compliance docs, citations required, UK/EU ZDR',
      state: {
        projectName: 'Internal Policy Q&A Assistant',
        projectGoal: 'Answer employee compliance and HR policy questions with exact section citations and refusal on missing evidence.',
        taskType: 'qa',
        latency: 'interactive',
        freshness: 'periodic',
        corpus: 'medium',
        hallucination: 'zero',
        actionRisk: 'readonly',
        privacy: 'zdr',
        volume: 'medium',
        team: 'mid'
      }
    },
    {
      id: 'invoice-extractor',
      label: 'High-Volume Invoice Extractor',
      icon: 'receipt_long',
      summary: '5M+ monthly docs, strict JSON fields, ML team',
      state: {
        projectName: 'High-Volume Invoice Extractor',
        projectGoal: 'Extract line items, VAT totals and supplier IDs from varied PDF invoices into strict JSON at predictable unit cost.',
        taskType: 'classification',
        latency: 'async',
        freshness: 'static',
        corpus: 'small',
        hallucination: 'zero',
        actionRisk: 'readonly',
        privacy: 'zdr',
        volume: 'veryhigh',
        team: 'ml'
      }
    },
    {
      id: 'regulated-support',
      label: 'Customer-Facing Regulated Support',
      icon: 'support_agent',
      summary: 'Live account APIs, zero fabrication, drafted replies',
      state: {
        projectName: 'Regulated Customer Support Copilot',
        projectGoal: 'Check live account status and policy rules to draft compliant responses for support agents without inventing terms.',
        taskType: 'drafting',
        latency: 'interactive',
        freshness: 'live',
        corpus: 'medium',
        hallucination: 'zero',
        actionRisk: 'drafts',
        privacy: 'zdr',
        volume: 'medium',
        team: 'mid'
      }
    },
    {
      id: 'ops-automation',
      label: 'Multi-System Ops Automation',
      icon: 'precision_manufacturing',
      summary: 'Multi-step tools, external writes, approval gates',
      state: {
        projectName: 'Multi-System Ops Automation',
        projectGoal: 'Triage incidents across ticketing, billing and CRM APIs and prepare approved remediation actions with full audit trails.',
        taskType: 'tools',
        latency: 'async',
        freshness: 'live',
        corpus: 'medium',
        hallucination: 'moderate',
        actionRisk: 'autonomous',
        privacy: 'zdr',
        volume: 'medium',
        team: 'ml'
      }
    },
    {
      id: 'edge-classifier',
      label: 'Low-Latency Edge Classifier',
      icon: 'speed',
      summary: '<500ms SLA, air-gapped, 5M+ events/month',
      state: {
        projectName: 'Low-Latency Edge Classifier',
        projectGoal: 'Score incoming transaction and event payloads inside an air-gapped perimeter under 500ms at high throughput.',
        taskType: 'classification',
        latency: 'realtime',
        freshness: 'static',
        corpus: 'small',
        hallucination: 'moderate',
        actionRisk: 'readonly',
        privacy: 'airgapped',
        volume: 'veryhigh',
        team: 'mid'
      }
    },
    {
      id: 'brief-drafter',
      label: 'Spec & Brief Drafter',
      icon: 'edit_note',
      summary: 'Small corpus, solo team, fast cached prompting',
      state: {
        projectName: 'Product Spec & Brief Drafter',
        projectGoal: 'Turn raw discovery notes and a small template library into structured engineering briefs for founder review.',
        taskType: 'drafting',
        latency: 'interactive',
        freshness: 'static',
        corpus: 'small',
        hallucination: 'moderate',
        actionRisk: 'drafts',
        privacy: 'commercial',
        volume: 'low',
        team: 'solo'
      }
    }
  ];

  const PATTERNS = {
    'no-llm': {
      id: 'no-llm',
      name: "Don't Use an LLM (Deterministic Rules / Classical ML)",
      shortName: 'Deterministic / Classical ML',
      tagline: 'Fast, auditable, sub-50ms inference with zero prompt injection or hallucination surface.',
      baseComplexity: 3,
      buildTime: '1-2 weeks',
      opsBurden: 'Low',
      stack: [
        'Deterministic Rules / Regex',
        'LightGBM / XGBoost / Linear Classifier',
        'ONNX Runtime (CPU)',
        'Feature Schema Validator',
        'Drift Monitor & Audit Log'
      ]
    },
    'prompt-structured': {
      id: 'prompt-structured',
      name: 'Prompt Engineering + Structured Outputs & Prompt Caching',
      shortName: 'Structured Prompt + Cache',
      tagline: 'Minimum viable LLM architecture: cached context, JSON schema decoding and zero vector DB tax.',
      baseComplexity: 2,
      buildTime: '3-5 days',
      opsBurden: 'Low',
      stack: [
        'Versioned System Prompts',
        'Strict JSON Schema / Structured Outputs',
        'Provider Prompt Caching',
        'PII Scrubber Middleware',
        'Golden-Set Regression Evals'
      ]
    },
    'hybrid-rag': {
      id: 'hybrid-rag',
      name: 'Hybrid RAG (BM25 + Dense Retrieval + Citations)',
      shortName: 'Hybrid RAG + Citations',
      tagline: 'Grounded document answering with lexical + semantic recall, reranking and verifiable source citations.',
      baseComplexity: 5,
      buildTime: '2-4 weeks',
      opsBurden: 'Moderate',
      stack: [
        'Ingestion & Metadata Chunker',
        'BM25 + Dense Vector Index',
        'Cross-Encoder Reranker',
        'ACL Permission Filter',
        'Citation & Refusal Verifier'
      ]
    },
    'workflow-router': {
      id: 'workflow-router',
      name: 'Workflow Orchestration + Tiered Model Router (Deterministic Graph, Not Free-Form Agent)',
      shortName: 'Deterministic Workflow + Router',
      tagline: 'Explicit state machine with typed API calls, tiered model routing and predictable failure paths.',
      baseComplexity: 6,
      buildTime: '3-5 weeks',
      opsBurden: 'Moderate-High',
      stack: [
        'Deterministic State Graph',
        'Fast Intent / Complexity Router',
        'Typed Read-Only API Connectors',
        'Tiered Small + Frontier Models',
        'Step-Level Trace & Policy Gate'
      ]
    },
    'hitl-agent': {
      id: 'hitl-agent',
      name: 'Human-in-the-Loop Bounded Agent (Tool Permissions + Approval Gates)',
      shortName: 'Bounded HITL Agent',
      tagline: 'Step-capped planner with least-privilege tools, idempotent actions and mandatory human sign-off on writes.',
      baseComplexity: 8,
      buildTime: '5-8 weeks',
      opsBurden: 'High',
      stack: [
        'Step-Capped Tool Planner',
        'Least-Privilege Tool Registry',
        'Human Approval Queue (HITL)',
        'Idempotency Keys & Dry-Run Mode',
        'Full Action Audit Trail'
      ]
    },
    'finetuned-slm': {
      id: 'finetuned-slm',
      name: 'Fine-Tuned Small / Open-Weight Model (Distillation for Latency/Cost/Privacy)',
      shortName: 'Fine-Tuned / Distilled SLM',
      tagline: 'Teacher-distilled 3B-14B model for predictable high-volume economics, tight latency or self-hosted privacy.',
      baseComplexity: 8,
      buildTime: '4-8 weeks',
      opsBurden: 'High',
      stack: [
        'Curated Gold Labelling Pipeline',
        'LoRA / Full SFT Small Model (3B-14B)',
        'vLLM / TGI Quantised Serving',
        'Confidence Escalation Router',
        'Shadow Eval & Retrain Loop'
      ]
    }
  };

  let currentState = Object.assign({}, PRESETS[0].state);
  let activePresetId = PRESETS[0].id;
  let selectedNodeId = null;
  let lastEvaluation = null;
  const checkedGates = new Set();

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugify(str) {
    return String(str || 'ai-system')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'ai-system';
  }

  /* ── DETERMINISTIC DECISION ENGINE ── */
  function evaluateArchitecture(s) {
    const scores = {
      'no-llm': 30,
      'prompt-structured': 48,
      'hybrid-rag': 40,
      'workflow-router': 42,
      'hitl-agent': 24,
      'finetuned-slm': 28
    };

    const reasons = {
      'no-llm': [],
      'prompt-structured': [],
      'hybrid-rag': [],
      'workflow-router': [],
      'hitl-agent': [],
      'finetuned-slm': []
    };

    function add(pid, delta, note) {
      scores[pid] += delta;
      if (note) reasons[pid].push({ delta, note });
    }

    // 1. Task Type
    if (s.taskType === 'classification') {
      add('no-llm', 32, 'Bounded classification/extraction is a natural fit for rules or classical ML');
      add('finetuned-slm', 22, 'Narrow classification/extraction distils well into a small model');
      add('prompt-structured', 16, 'Structured JSON outputs handle variable text formats quickly');
      add('hybrid-rag', -18, 'Retrieval adds latency without helping pure classification');
      add('hitl-agent', -28, 'Agent loops are unnecessary for single-pass extraction');
    } else if (s.taskType === 'qa') {
      add('hybrid-rag', 28, 'Knowledge Q&A maps directly to retrieval + grounded synthesis');
      add('prompt-structured', 14, 'Long-context prompting works well if the corpus fits in context');
      add('workflow-router', 10, 'Useful when Q&A requires branching across multiple live systems');
      add('no-llm', -35, 'Free-text Q&A requires natural-language synthesis beyond rules');
      add('finetuned-slm', -16, 'Fine-tuning is a weak fit for factual Q&A storage');
      add('hitl-agent', -14, 'Read-only Q&A rarely justifies open-ended agent loops');
    } else if (s.taskType === 'drafting') {
      add('prompt-structured', 24, 'Drafting and synthesis start cleanly with structured prompts');
      add('workflow-router', 18, 'Multi-stage drafting benefits from deterministic research + policy steps');
      add('hybrid-rag', 14, 'RAG grounds drafts in large reference corpora');
      add('no-llm', -40, 'Open prose drafting cannot be done with classical classifiers');
      add('hitl-agent', -12, 'Drafting needs review, not autonomous tool loops');
    } else if (s.taskType === 'tools') {
      add('workflow-router', 24, 'Deterministic graphs cover known multi-step API sequences safely');
      add('hitl-agent', 34, 'Multi-system tool execution is the core case for bounded agents');
      add('prompt-structured', -20, 'Single-shot prompting cannot orchestrate multi-step tool chains');
      add('hybrid-rag', -14, 'RAG alone retrieves text but does not execute stateful tool flows');
      add('no-llm', -18, 'Unstructured multi-step routing usually needs language understanding');
      add('finetuned-slm', -14, 'Tool orchestration needs strong reasoning over tiny bespoke weights');
    } else if (s.taskType === 'code') {
      add('workflow-router', 24, 'Generate -> lint/test -> repair fits a deterministic verification graph');
      add('prompt-structured', 14, 'Single-pass code/SQL generation works for bounded schemas');
      add('finetuned-slm', 14, 'High-volume narrow schema/SQL generation can be distilled');
      add('hybrid-rag', 10, 'Retrieving schema docs helps ground generated queries');
      add('no-llm', -34, 'Code and query synthesis requires generative modelling');
      add('hitl-agent', 6, 'Bounded agents help only when multi-repo writes need approvals');
    }

    // 2. Latency SLA
    if (s.latency === 'realtime') {
      add('no-llm', 28, 'Sub-500ms SLA strongly favours classical ML / deterministic code (<50ms)');
      add('finetuned-slm', 22, 'Quantised small models meet tight real-time latency budgets');
      add('prompt-structured', -6, 'Commercial frontier APIs struggle to hold p95 under 500ms');
      add('hybrid-rag', -22, 'Retrieval + reranking + LLM generation normally exceeds 500ms');
      add('workflow-router', -24, 'Multi-hop workflows blow a 500ms p95 budget');
      add('hitl-agent', -38, 'Iterative agent loops and human gates cannot run under 500ms');
    } else if (s.latency === 'interactive') {
      add('prompt-structured', 12, 'Cached prompts sit comfortably inside 1-5s interactive budgets');
      add('hybrid-rag', 14, 'Hybrid retrieval + fast LLM fits 1-5s with streaming');
      add('workflow-router', 12, 'Parallelised deterministic graphs stay inside 1-5s');
      add('hitl-agent', -10, 'Multi-step agent loops risk sluggish interactive UX');
    } else if (s.latency === 'async') {
      add('workflow-router', 12, 'Async queues absorb multi-step orchestration cleanly');
      add('hitl-agent', 16, 'Async execution matches human approval queues naturally');
      add('finetuned-slm', 12, 'Batch inference unlocks high GPU utilisation for small models');
      add('prompt-structured', 8, 'Batch APIs cut commercial prompt costs by up to 50%');
    }

    // 3. Knowledge Freshness
    if (s.freshness === 'static') {
      add('prompt-structured', 18, 'Static knowledge caches cleanly in the system prompt');
      add('no-llm', 14, 'Stable rules and labels keep classical models accurate');
      add('finetuned-slm', 16, 'Static task boundaries avoid frequent retraining cycles');
      add('hybrid-rag', -14, 'Standing up a retrieval pipeline for static docs is avoidable overhead');
    } else if (s.freshness === 'periodic') {
      add('hybrid-rag', 24, 'Daily/weekly doc updates belong in a re-indexed RAG store');
      add('workflow-router', 8, 'Workflows can combine periodic doc indexes with validation steps');
      add('finetuned-slm', -16, 'Weekly doc churn makes weight-stored facts go stale fast');
      add('no-llm', -10, 'Frequent policy text edits require constant manual rule rewrites');
    } else if (s.freshness === 'live') {
      add('workflow-router', 26, 'Live API/DB state belongs in typed deterministic workflow connectors');
      add('hitl-agent', 20, 'Live multi-system queries fit bounded tool-calling architectures');
      add('hybrid-rag', 4, 'RAG helps static policy context, not live transactional state');
      add('prompt-structured', -18, 'Static prompt context cannot query live operational databases');
      add('finetuned-slm', -24, 'Model weights cannot hold real-time transactional state');
      add('no-llm', -8, 'Combining live APIs with unstructured text usually needs an LLM layer');
    }

    // 4. Corpus Size
    if (s.corpus === 'small') {
      add('prompt-structured', 26, 'Under 100k tokens fits directly inside cached prompt context');
      add('no-llm', 10, 'Small bounded reference set keeps rules/features tractable');
      add('finetuned-slm', 10, 'Compact domain scope makes distillation dataset curation feasible');
      add('hybrid-rag', -22, 'Building a vector index for <100k tokens adds complexity for little gain');
    } else if (s.corpus === 'medium') {
      add('hybrid-rag', 24, '100k-10M tokens exceeds single-prompt context and needs retrieval');
      add('workflow-router', 14, 'Workflows can pair targeted retrieval with live lookups');
      add('prompt-structured', -26, '100k-10M tokens will not fit reliably in a single prompt');
      add('no-llm', -14, 'Large unstructured corpora exceed hand-coded rule coverage');
    } else if (s.corpus === 'enterprise') {
      add('hybrid-rag', 30, '10M+ tokens mandates hybrid search, metadata filtering and ACLs');
      add('workflow-router', 16, 'Enterprise corpora often require routed multi-index workflows');
      add('prompt-structured', -40, '10M+ tokens cannot be stuffed into a prompt window');
      add('no-llm', -20, 'Enterprise document search needs semantic + lexical retrieval');
      add('finetuned-slm', -12, 'Enterprise corpus facts cannot be compressed reliably into weights');
    }

    // 5. Hallucination Tolerance
    if (s.hallucination === 'zero') {
      add('hybrid-rag', 16, 'Mandatory citations and strict refusal gates ground every answer');
      add('workflow-router', 18, 'Deterministic verification steps and typed APIs curb fabrication');
      add('no-llm', 14, 'Deterministic code never invents non-existent clauses');
      add('finetuned-slm', 8, 'Strict schema-trained extractors reduce free-form drift on bounded inputs');
      add('hitl-agent', -8, 'Free-form reasoning increases audit burden under zero-tolerance rules');
    } else if (s.hallucination === 'moderate') {
      add('prompt-structured', 8, 'Human review catches minor wording errors cleanly');
      add('hitl-agent', 10, 'Human review aligns with approval-gated tool execution');
      add('workflow-router', 6, 'Predictable outputs reduce human editing time');
    } else if (s.hallucination === 'high') {
      add('prompt-structured', 14, 'Creative drafting needs no heavy grounding infrastructure');
      add('hybrid-rag', -8, 'Strict citation pipelines are overkill for creative drafting');
      add('no-llm', -18, 'Creative generation cannot be handled by deterministic rules');
    }

    // 6. Action Risk
    if (s.actionRisk === 'readonly') {
      add('prompt-structured', 10, 'Read-only outputs carry low blast radius');
      add('hybrid-rag', 12, 'Read-only grounded answers match RAG cleanly');
      add('no-llm', 10, 'Read-only scoring fits classical ML cleanly');
      add('hitl-agent', -26, 'No write actions means agent approval machinery is pure overhead');
    } else if (s.actionRisk === 'drafts') {
      add('workflow-router', 16, 'Drafts + live checks suit deterministic workflows with agent review');
      add('prompt-structured', 10, 'Draft suggestions keep humans in control with minimal stack');
      add('hybrid-rag', 6, 'Grounded drafts benefit from inline citations');
      add('hitl-agent', -8, 'Draft-only outputs rarely need autonomous tool planners');
    } else if (s.actionRisk === 'autonomous') {
      add('hitl-agent', 36, 'Write/money actions require bounded permissions and explicit approval gates');
      add('workflow-router', 18, 'Deterministic workflows work if every write branch is pre-defined');
      add('prompt-structured', -28, 'Raw prompt output must never trigger autonomous write actions');
      add('hybrid-rag', -24, 'RAG is a read-only pattern and does not govern external writes');
      add('finetuned-slm', -18, 'A standalone SLM lacks action permissions and approval orchestration');
      add('no-llm', -6, 'Only safe if business rules are 100% deterministic with no prose input');
    }

    // 7. Data Privacy / Residency
    if (s.privacy === 'commercial') {
      add('prompt-structured', 10, 'Commercial APIs let you ship without hosting infrastructure');
      add('workflow-router', 6, 'Managed APIs simplify multi-tier model routing');
      add('finetuned-slm', -10, 'Self-hosting weights is unnecessary when commercial APIs are allowed');
    } else if (s.privacy === 'zdr') {
      add('hybrid-rag', 6, 'UK/EU ZDR endpoints + local vector store satisfy residency cleanly');
      add('workflow-router', 6, 'Regional ZDR endpoints keep orchestration compliant without GPU ops');
      add('finetuned-slm', 8, 'Self-hosted or VPC-isolated SLMs give full data control');
      add('hitl-agent', 4, 'Audit logs + ZDR endpoints support regulated governance');
    } else if (s.privacy === 'airgapped') {
      add('no-llm', 22, 'Classical ML runs on local CPU inside air-gapped perimeters easily');
      add('finetuned-slm', 30, 'Self-hosted open-weight SLMs run completely offline in your VPC');
      add('prompt-structured', -28, 'Standard cloud LLM APIs violate air-gapped residency rules');
      add('workflow-router', -4, 'Requires self-hosted open-weight models behind the router');
      add('hybrid-rag', 4, 'Viable if paired with local embeddings and a local open-weight LLM');
    }

    // 8. Monthly Request Volume
    if (s.volume === 'low') {
      add('prompt-structured', 18, 'At <10k/month, API spend is tiny compared to engineering time');
      add('finetuned-slm', -26, 'Fine-tuning and GPU hosting never pay back under 10k requests/month');
      add('hitl-agent', -4, 'Low volume rarely justifies custom agent infrastructure unless high-value');
    } else if (s.volume === 'medium') {
      add('hybrid-rag', 10, '10k-500k/month sits cleanly in managed hybrid search economics');
      add('workflow-router', 10, 'Tiered routing keeps mid-volume costs predictable');
      add('prompt-structured', 6, 'Prompt caching keeps medium-volume costs reasonable');
      add('finetuned-slm', -6, 'Mid-volume rarely beats prompt caching unless latency/privacy forces it');
    } else if (s.volume === 'high') {
      add('finetuned-slm', 18, '500k-5M/month starts rewarding distilled small models on unit cost');
      add('no-llm', 14, 'High volume makes sub-millisecond classical models vastly cheaper');
      add('workflow-router', 10, 'Model routing offloads 70-80% of traffic to small fast models');
      add('prompt-structured', -10, 'Sending large prompts to frontier APIs at 500k-5M/month gets expensive');
    } else if (s.volume === 'veryhigh') {
      add('finetuned-slm', 34, '5M+/month makes frontier API pricing prohibitive vs a distilled SLM');
      add('no-llm', 26, 'At 5M+/month, classical ML saves tens of thousands per month in compute');
      add('workflow-router', 6, 'Needs aggressive routing to tiny models to survive 5M+ volume');
      add('prompt-structured', -24, 'Unrouted commercial prompting burns budget rapidly at 5M+ calls/month');
      add('hitl-agent', -18, 'Multi-turn agents multiply token costs dangerously at 5M+ scale');
    }

    // 9. Team Maturity
    if (s.team === 'solo') {
      add('prompt-structured', 20, 'Solo/small teams win by minimising moving parts');
      add('no-llm', 8, 'Simple rules and lightweight models are easy for small teams to operate');
      add('hybrid-rag', -4, 'Manageable with hosted search, though chunking/evals need discipline');
      add('workflow-router', -6, 'Keep the graph small so one engineer can debug it');
      add('hitl-agent', -18, 'Operating a bounded agent safely taxes a solo team heavily');
      add('finetuned-slm', -24, 'Training, serving and upgrading custom weights overwhelms small teams');
    } else if (s.team === 'mid') {
      add('hybrid-rag', 10, 'Mid-size product teams can maintain hybrid search and eval pipelines');
      add('workflow-router', 10, 'Product engineers are strong at deterministic state machines');
      add('finetuned-slm', -4, 'Managed fine-tuning is possible, though self-hosted GPUs stretch product teams');
    } else if (s.team === 'ml') {
      add('finetuned-slm', 24, 'Dedicated ML/platform engineers can run distillation, vLLM and eval loops');
      add('hitl-agent', 10, 'Platform team can enforce tool sandboxes, tracing and approval gates');
      add('workflow-router', 8, 'Platform team can optimise tiered routing and telemetry');
    }

    // Targeted interaction bonuses to prevent edge-case misfires
    if (s.taskType === 'classification' && s.latency === 'realtime' && s.freshness === 'static') {
      add('no-llm', 14, 'Static real-time classification is textbook classical ML territory');
    }
    if (s.taskType === 'classification' && s.volume === 'veryhigh' && s.hallucination === 'zero' && s.team === 'ml' && s.latency !== 'realtime') {
      add('finetuned-slm', 18, 'High-volume unstructured extraction with zero-error schema needs an ML-run distilled SLM');
    }
    if (s.taskType === 'tools' && s.actionRisk === 'autonomous') {
      add('hitl-agent', 28, 'Autonomous multi-system actions specifically demand bounded HITL controls');
      add('workflow-router', -6, 'Unpredictable multi-system writes outgrow static branches without an approval planner');
    }
    if (s.freshness === 'live' && s.hallucination === 'zero' && s.actionRisk !== 'autonomous') {
      add('workflow-router', 16, 'Live data + zero hallucination + non-autonomous actions favour deterministic workflows over free-form agents');
    }

    // Normalise raw scores onto a crisp 10-95 scale so matrix bars never saturate at 99/99
    const rawValues = Object.keys(PATTERNS).map(function (id) { return scores[id]; });
    const maxRaw = Math.max.apply(null, rawValues);
    const minRaw = Math.min.apply(null, rawValues);
    const span = Math.max(60, maxRaw - minRaw);

    const ranked = Object.keys(PATTERNS).map(function (id) {
      const relative = (scores[id] - minRaw) / span;
      const topCeiling = Math.max(82, Math.min(95, Math.round(76 + (maxRaw - 90) * 0.22)));
      const floorVal = Math.max(10, Math.min(28, Math.round(18 + (minRaw / 10))));
      const displayScore = Math.max(8, Math.min(96, Math.round(floorVal + relative * (topCeiling - floorVal))));
      const sortedReasons = reasons[id].slice().sort(function (a, b) {
        return Math.abs(b.delta) - Math.abs(a.delta);
      });
      return {
        id: id,
        pattern: PATTERNS[id],
        score: displayScore,
        rawScore: scores[id],
        reasons: sortedReasons
      };
    }).sort(function (a, b) {
      return b.rawScore - a.rawScore;
    });

    const winner = ranked[0];
    const runnerUp = ranked[1];
    const gap = winner.rawScore - runnerUp.rawScore;

    // Confidence score (55% to 96%)
    const confidence = Math.max(58, Math.min(96, Math.round(62 + gap * 1.15)));
    let confidenceNote = '';
    if (gap >= 22) {
      confidenceNote = 'Clear architectural separation (+' + gap + ' pts over ' + runnerUp.pattern.shortName + ').';
    } else if (gap >= 10) {
      confidenceNote = 'Solid fit. ' + runnerUp.pattern.shortName + ' is a viable fallback if constraints shift.';
    } else {
      confidenceNote = 'Close trade-off with ' + runnerUp.pattern.shortName + ' (+' + gap + ' pts). Prototype the simpler option first.';
    }

    // Engineering Complexity (1-10)
    let complexity = winner.pattern.baseComplexity;
    if (s.privacy === 'airgapped') complexity += 2;
    else if (s.privacy === 'zdr') complexity += 1;
    if (s.hallucination === 'zero') complexity += 1;
    if (s.actionRisk === 'autonomous') complexity += 1;
    if (s.corpus === 'enterprise') complexity += 1;
    if (s.volume === 'veryhigh') complexity += 1;
    complexity = Math.max(1, Math.min(10, complexity));

    let complexityBand = 'Low';
    let complexityNote = 'Small surface area. One engineer can build, test and operate this cleanly.';
    if (complexity >= 8) {
      complexityBand = 'Platform-Grade';
      complexityNote = 'High operational tax. Budget for dedicated observability, guardrails and on-call runbooks.';
    } else if (complexity >= 6) {
      complexityBand = 'High';
      complexityNote = 'Multiple moving parts. Lock down automated evals before putting real traffic through it.';
    } else if (complexity >= 4) {
      complexityBand = 'Moderate';
      complexityNote = 'Manageable for a product team if you keep the component stack narrow and boring.';
    }

    // Assign verdict status labels to all 6 patterns
    ranked.forEach(function (item, idx) {
      if (idx === 0) {
        item.status = 'Recommended';
        item.statusClass = 'winner';
      } else if (item.rawScore >= winner.rawScore - 16 && item.score >= 52) {
        item.status = 'Viable Alternative';
        item.statusClass = 'viable';
      } else if (item.pattern.baseComplexity > winner.pattern.baseComplexity + 1 && item.score >= 38) {
        item.status = 'Overkill';
        item.statusClass = 'overkill';
      } else {
        item.status = 'Not Recommended';
        item.statusClass = 'reject';
      }
    });

    const antiPatterns = buildAntiPatterns(s, winner);
    const topology = buildTopology(s, winner);
    const checklist = buildChecklist(s, winner);

    return {
      winner: winner,
      runnerUp: runnerUp,
      ranked: ranked,
      confidence: confidence,
      confidenceNote: confidenceNote,
      complexity: complexity,
      complexityBand: complexityBand,
      complexityNote: complexityNote,
      antiPatterns: antiPatterns,
      topology: topology,
      checklist: checklist
    };
  }

  /* ── BLUNT "WHAT NOT TO BUILD" ANTI-PATTERNS ── */
  function buildAntiPatterns(s, winner) {
    const items = [];

    if (s.freshness !== 'static') {
      items.push({
        title: "Don't fine-tune to inject changing facts",
        body: 'Your knowledge updates ' + (s.freshness === 'live' ? 'in real time' : 'daily or weekly') + '. Fine-tuning teaches tone and output format, not mutable truth. Baking policies or live state into weights creates stale answers you cannot hotfix without retraining.'
      });
    }

    if (s.actionRisk === 'autonomous') {
      items.push({
        title: "Don't deploy an unconstrained autonomous agent on write actions",
        body: 'Giving a free-form LLM loop unguarded write or money-moving credentials turns a single prompt injection or misread ID into a live production incident. Cap steps, restrict tool scopes and require human sign-off before external mutations.'
      });
    } else if (winner.id !== 'hitl-agent') {
      items.push({
        title: "Don't add an autonomous agent framework for a bounded job",
        body: 'Multi-agent frameworks burn 3-10x more tokens, add unpredictable latency spikes and hide control flow behind prompt chatter. Use explicit code branches and typed functions whenever the steps are known upfront.'
      });
    }

    if (s.corpus === 'small' && winner.id !== 'hybrid-rag') {
      items.push({
        title: "Don't stand up a vector database for <100k tokens",
        body: 'Chunking pipelines, embedding drift and hybrid re-ranking add weekly maintenance with zero upside when your full reference set fits inside a cached system prompt.'
      });
    }

    if (s.latency === 'realtime') {
      items.push({
        title: "Don't chain multi-hop LLM calls under a 500ms SLA",
        body: 'Network round trips plus frontier LLM time-to-first-token alone eat 300-700ms. Multi-step retrieval or agent loops will miss your p95 target under load.'
      });
    }

    if (s.hallucination === 'zero') {
      items.push({
        title: "Don't ship ungrounded generation without refusal paths",
        body: 'Under regulated or zero-fabrication rules, an LLM that guesses politely when evidence is missing is worse than a clean "not found" response. Enforce inline citations and fail-closed verification.'
      });
    }

    if (s.team === 'solo' && (s.privacy === 'airgapped' || s.volume === 'veryhigh')) {
      items.push({
        title: "Don't self-host GPU clusters without platform capacity",
        body: 'Running vLLM, quantisation upgrades and GPU failover with a solo or small team turns product engineering into full-time infrastructure firefighting. Use classical CPU models or VPC-managed regional endpoints wherever permitted.'
      });
    }

    if (s.volume === 'low' && winner.id !== 'finetuned-slm') {
      items.push({
        title: "Don't pay the fine-tuning tax under 10k requests/month",
        body: 'At low volume, commercial API spend is a rounding error compared to dataset curation, evaluation harnesses and model hosting costs.'
      });
    }

    if (s.taskType === 'classification' && winner.id === 'no-llm') {
      items.push({
        title: "Don't burn LLM tokens on a deterministic classifier",
        body: 'A frontier LLM costs 100x more per prediction, runs 20x slower and introduces non-deterministic drift on a job that rules or LightGBM solve in under 20ms.'
      });
    }

    return items.slice(0, 4);
  }

  /* ── INTERACTIVE TOPOLOGY BUILDER ── */
  function buildTopology(s, winner) {
    const privacyLabel = s.privacy === 'airgapped'
      ? 'Air-Gapped VPC / On-Prem Boundary'
      : (s.privacy === 'zdr' ? 'UK/EU Zero Data Retention Boundary' : 'Standard TLS / Commercial API Boundary');

    const isZeroHalluc = s.hallucination === 'zero';
    const isAuto = s.actionRisk === 'autonomous';
    const isRealtime = s.latency === 'realtime';

    const topologies = {
      'no-llm': [
        {
          id: 'trigger',
          layer: 'Entry',
          title: 'Event / API Trigger',
          sub: 'Typed payload',
          accent: 'cyan',
          latency: '2-5 ms',
          impl: 'Accept strictly typed JSON or protobuf events at the edge gateway with schema validation, request IDs and rate limits before any scoring executes.',
          failures: [
            'Malformed upstream payloads causing silent default-class fallbacks',
            'Missing idempotency or correlation IDs blocking incident replay',
            'Unbounded burst traffic saturating worker threads'
          ],
          metrics: ['req_rate_rps', 'schema_reject_pct', 'ingress_p95_ms']
        },
        {
          id: 'normaliser',
          layer: 'Pre-Process',
          title: 'Schema & PII Filter',
          sub: s.privacy === 'airgapped' ? 'Local scrub' : 'Field normaliser',
          accent: 'green',
          latency: '3-8 ms',
          impl: 'Normalise encodings, strip unexpected fields and hash or mask PII locally so downstream telemetry never stores raw customer identifiers.',
          failures: [
            'Upstream field rename silently turning a core feature into NaN',
            'Raw PII leaking into exception stack traces or debug logs',
            'Unicode or locale formatting skewing numeric parsers'
          ],
          metrics: ['null_feature_rate', 'pii_redactions_count', 'parse_error_rate']
        },
        {
          id: 'features',
          layer: 'Logic',
          title: 'Feature & Rule Engine',
          sub: 'Deterministic checks',
          accent: 'cyan',
          latency: '5-15 ms',
          impl: 'Apply hard business rules first (allowlists, blocklists, range invariants), then compute deterministic feature vectors with pinned library versions.',
          failures: [
            'Training-serving skew where online features differ from offline training transforms',
            'Hard-coded rule ordering conflicts creating unreachable branches',
            'Slow synchronous lookups stalling the hot path'
          ],
          metrics: ['rule_shortcircuit_pct', 'feature_null_pct', 'feature_compute_p95_ms']
        },
        {
          id: 'model',
          layer: 'Inference',
          title: 'Classical ML / ONNX',
          sub: 'CPU sub-50ms',
          accent: 'pink',
          latency: '5-25 ms',
          impl: 'Serve a calibrated LightGBM, XGBoost or compact linear/SetFit classifier via ONNX Runtime on CPU. Pin model artefacts by SHA hash for reproducible rollbacks.',
          failures: [
            'Covariate drift silently shifting probability calibration over time',
            'Class imbalance causing high false-positive rates on rare labels',
            'Cold-start model loading spiking tail latency during autoscaling'
          ],
          metrics: ['inference_p95_ms', 'score_distribution_psi', 'model_version_tag']
        },
        {
          id: 'gate',
          layer: 'Decision',
          title: 'Confidence Gate',
          sub: isZeroHalluc ? 'Strict abstain' : 'Threshold router',
          accent: 'amber',
          latency: '1-3 ms',
          impl: 'Compare calibrated probabilities against explicit decision thresholds. Route low-confidence edge cases to a deterministic fallback or human review queue.',
          failures: [
            'Uncalibrated raw scores treated as real probabilities',
            'Thresholds left untouched after a model retrain',
            'Missing abstain path forcing bad automated decisions'
          ],
          metrics: ['abstain_rate_pct', 'low_conf_queue_depth', 'threshold_hit_rate']
        },
        {
          id: 'audit',
          layer: 'Observability',
          title: 'Drift & Audit Log',
          sub: 'Label feedback',
          accent: 'purple',
          latency: 'Async',
          impl: 'Log hashed inputs, feature summaries, model version and final decision asynchronously. Feed human overrides back into weekly precision/recall checks.',
          failures: [
            'No ground-truth feedback loop to spot accuracy decay early',
            'Synchronous logging blocking the 500ms inference path',
            'Unversioned rule edits breaking historical auditability'
          ],
          metrics: ['rolling_precision_recall', 'override_rate_pct', 'feature_drift_psi']
        }
      ],

      'prompt-structured': [
        {
          id: 'trigger',
          layer: 'Entry',
          title: 'User / App Trigger',
          sub: 'Validated input',
          accent: 'cyan',
          latency: '10-20 ms',
          impl: 'Capture user input with strict character/token limits, request timeouts and per-user rate limiting before building the model payload.',
          failures: [
            'Oversized user pastes blowing context limits or token budgets',
            'Duplicate client retries firing parallel billable LLM calls',
            'Missing cancellation handling when users abandon requests'
          ],
          metrics: ['input_token_p95', 'rate_limit_hits', 'request_cancel_rate']
        },
        {
          id: 'guardrail',
          layer: 'Security',
          title: 'PII & Injection Filter',
          sub: s.privacy === 'commercial' ? 'Input sanitiser' : 'ZDR + PII scrub',
          accent: 'green',
          latency: '15-40 ms',
          impl: 'Redact unnecessary PII, isolate untrusted user text inside explicit XML/JSON delimiters and screen for obvious prompt-injection or off-policy payloads.',
          failures: [
            'User instructions overriding system rules due to weak prompt separation',
            'Sensitive tokens or secrets copied into third-party API payloads',
            'Over-aggressive regex redaction stripping fields needed for the task'
          ],
          metrics: ['pii_scrub_count', 'guardrail_block_rate', 'guardrail_p95_ms']
        },
        {
          id: 'cache',
          layer: 'Context',
          title: 'Prompt Cache Builder',
          sub: '<100k cached prefix',
          accent: 'cyan',
          latency: '5-15 ms',
          impl: 'Place static instructions, few-shot examples and reference docs (<100k tokens) in a byte-identical prefix so provider prompt caching slashes input cost and TTFT.',
          failures: [
            'Injecting timestamps or random IDs near the top, busting the prompt cache on every call',
            'Silent corpus growth creeping past the 100k token sweet spot',
            'Unversioned prompt edits making production regressions hard to trace'
          ],
          metrics: ['prompt_cache_hit_pct', 'cached_prefix_tokens', 'prompt_version_sha']
        },
        {
          id: 'model',
          layer: 'Model Layer',
          title: 'LLM + JSON Schema',
          sub: s.privacy === 'zdr' ? 'UK/EU ZDR API' : 'Structured output',
          accent: 'pink',
          latency: isRealtime ? '300-450 ms' : '700-2200 ms',
          impl: 'Call a pinned model version with constrained structured outputs (JSON Schema), strict max_tokens cap, low temperature and a configured provider fallback.',
          failures: [
            'Provider silent model snapshot updates shifting tone or extraction accuracy',
            'Truncated JSON when max_tokens is set too tight',
            'Upstream provider 429/529 spikes causing unhandled user errors'
          ],
          metrics: ['ttft_ms', 'total_llm_p95_ms', 'cost_per_1k_req_gbp']
        },
        {
          id: 'validator',
          layer: 'Verification',
          title: 'Schema & Policy Gate',
          sub: isZeroHalluc ? 'Strict refusal check' : 'Output validator',
          accent: 'amber',
          latency: '10-30 ms',
          impl: 'Validate response JSON against application types, check mandatory fields and verify business invariants before rendering or returning the draft.',
          failures: [
            'Syntactically valid JSON containing empty strings or made-up enum values',
            'Missing refusal path when user input lacks enough facts',
            'Infinite retry loops multiplying cost on malformed responses'
          ],
          metrics: ['schema_valid_pct', 'retry_rate_pct', 'refusal_rate_pct']
        },
        {
          id: 'eval',
          layer: 'Observability',
          title: 'Eval & Audit Log',
          sub: 'Golden-set checks',
          accent: 'purple',
          latency: 'Async',
          impl: 'Store redacted prompt versions, token counts, latencies and user thumbs/edits. Run a 50-100 case golden evaluation suite in CI on every prompt change.',
          failures: [
            'Prompt edits shipped by eye with no regression suite',
            'Unredacted user data written into analytics buckets',
            'No cost alerts catching runaway retry storms'
          ],
          metrics: ['golden_eval_pass_pct', 'user_edit_distance', 'daily_token_spend']
        }
      ],

      'hybrid-rag': [
        {
          id: 'trigger',
          layer: 'Entry',
          title: 'Query & Auth Context',
          sub: 'User ACL attached',
          accent: 'cyan',
          latency: '10-25 ms',
          impl: 'Receive the user query alongside authenticated tenant, role and document-group claims. Never trust client-supplied access filters.',
          failures: [
            'Missing ACL propagation exposing restricted HR or legal docs to general users',
            'Ambiguous follow-up queries sent raw without conversation resolution',
            'Unbounded query length degrading lexical search'
          ],
          metrics: ['auth_context_valid_pct', 'query_length_p95', 'tenant_req_count']
        },
        {
          id: 'guardrail',
          layer: 'Security',
          title: 'PII & Query Guardrail',
          sub: s.privacy === 'airgapped' ? 'Local VPC guard' : 'ZDR + rewrite',
          accent: 'green',
          latency: '30-80 ms',
          impl: 'Strip unnecessary PII, block obvious injection patterns and optionally normalise acronyms or expand domain synonyms without changing user intent.',
          failures: [
            'Query rewriter hallucinating terms not present in the original question',
            'Indirect prompt injection embedded inside retrieved third-party documents',
            'Extra LLM rewrite step adding 600ms of avoidable latency'
          ],
          metrics: ['guardrail_trigger_pct', 'rewrite_latency_ms', 'pii_masked_count']
        },
        {
          id: 'retriever',
          layer: 'Retrieval',
          title: 'Hybrid Search + Rerank',
          sub: 'BM25 + Dense + ACL',
          accent: 'cyan',
          latency: '120-350 ms',
          impl: 'Execute pre-filtered BM25 lexical search + dense vector retrieval with Reciprocal Rank Fusion, then score top-25 candidates down to top-5 via a cross-encoder reranker.',
          failures: [
            'Dense-only search missing exact policy codes, SKUs or regulatory clause IDs',
            'Poor chunk boundaries splitting tables, exceptions or caveats away from rules',
            'Stale index still serving superseded policy versions'
          ],
          metrics: ['retrieval_recall_at_5', 'empty_retrieval_pct', 'index_freshness_mins']
        },
        {
          id: 'model',
          layer: 'Generation',
          title: 'Grounded LLM',
          sub: s.privacy === 'airgapped' ? 'Local open-weight' : 'Citations mandatory',
          accent: 'pink',
          latency: '700-2200 ms',
          impl: 'Pass only the top-K reranked chunks with immutable chunk IDs. Instruct the model to answer strictly from supplied passages with inline [doc#section] citations or abstain.',
          failures: [
            'Model blending pre-training memory with retrieved passages on partial matches',
            'Context stuffing (20+ chunks) burying the relevant clause in the middle',
            'Fabricated citation IDs that do not exist in the retrieved set'
          ],
          metrics: ['ttft_ms', 'context_tokens_p95', 'cost_per_1k_queries']
        },
        {
          id: 'verifier',
          layer: 'Verification',
          title: 'Citation & Refusal Gate',
          sub: isZeroHalluc ? 'Fail-closed verify' : 'Faithfulness check',
          accent: 'amber',
          latency: '40-250 ms',
          impl: 'Verify every cited chunk ID exists in the retrieved payload, attach deep links to source sections and trigger an explicit refusal if retrieval confidence falls below threshold.',
          failures: [
            'Dangling citations pointing to deleted or inaccessible documents',
            'Refusal threshold set too loose, letting unsupported summaries slip through',
            'Verifier adding unacceptable latency on synchronous streaming responses'
          ],
          metrics: ['citation_validity_pct', 'faithfulness_score', 'abstain_accuracy_pct']
        },
        {
          id: 'eval',
          layer: 'Observability',
          title: 'RAG Eval & Audit Log',
          sub: 'Separate R vs G metrics',
          accent: 'purple',
          latency: 'Async',
          impl: 'Log query, retrieved chunk IDs, rerank scores, citations and user feedback. Evaluate retrieval recall separately from generator faithfulness so you fix the right layer.',
          failures: [
            'Tweaking prompts for weeks when the real bug is missing documents in retrieval',
            'Zero visibility into queries returning low similarity scores',
            'Missing document-version timestamps for compliance audits'
          ],
          metrics: ['mrr_at_5', 'groundedness_pass_pct', 'zero_hit_query_rate']
        }
      ],

      'workflow-router': [
        {
          id: 'trigger',
          layer: 'Entry',
          title: 'Request & Session',
          sub: 'Typed workflow input',
          accent: 'cyan',
          latency: '10-25 ms',
          impl: 'Accept structured trigger events or support tickets with verified user identity, correlation ID and strict end-to-end deadline budget.',
          failures: [
            'Unbounded workflow execution with no global timeout',
            'Duplicate webhook deliveries spawning duplicate workflow runs',
            'Missing session state persistence across retries'
          ],
          metrics: ['workflow_start_rate', 'dedup_drop_count', 'deadline_breach_pct']
        },
        {
          id: 'router',
          layer: 'Routing',
          title: 'Intent & Model Router',
          sub: 'Small fast classifier',
          accent: 'green',
          latency: '40-150 ms',
          impl: 'Run a fast, cheap classifier or small structured model to classify intent, complexity tier and PII sensitivity, routing easy paths to fast models and hard paths to frontier models.',
          failures: [
            'Misrouted edge cases sent to an underpowered model tier',
            'Unclear intent taxonomy causing overlap between branches',
            'Router latency eating too much of the interactive budget'
          ],
          metrics: ['router_accuracy_pct', 'tier_distribution_pct', 'router_p95_ms']
        },
        {
          id: 'graph',
          layer: 'Orchestration',
          title: 'Deterministic Graph',
          sub: 'Typed APIs + RAG',
          accent: 'cyan',
          latency: '150-600 ms',
          impl: 'Execute explicit code-defined steps: parallel live API/DB lookups, policy retrieval and deterministic business checks. No open-ended loop deciding its own next step.',
          failures: [
            'Downstream live API timeouts cascading into full request failures',
            'Implicit state mutations between graph nodes making replays unsafe',
            'Sequential API calls that should have been fanned out in parallel'
          ],
          metrics: ['step_error_rate', 'api_connector_p95_ms', 'graph_branch_counts']
        },
        {
          id: 'model',
          layer: 'Model Layer',
          title: 'Tiered LLM Synthesis',
          sub: s.privacy === 'zdr' ? 'UK/EU ZDR tier' : 'Small + Frontier',
          accent: 'pink',
          latency: '600-1800 ms',
          impl: 'Synthesise the draft or structured output using only verified facts returned by the graph nodes. Pin separate model tiers for simple vs complex branches.',
          failures: [
            'Model contradicting structured numbers returned by the live database API',
            'Prompt drift between branches creating inconsistent tone or schemas',
            'Missing circuit breaker when the frontier tier degrades'
          ],
          metrics: ['llm_tier_cost_gbp', 'synthesis_p95_ms', 'fallback_trigger_pct']
        },
        {
          id: 'validator',
          layer: 'Policy Gate',
          title: 'Rule & Citation Gate',
          sub: isZeroHalluc ? 'Zero-drift checks' : 'Schema + policy check',
          accent: 'amber',
          latency: '20-80 ms',
          impl: 'Verify numeric consistency against API responses, enforce regulated wording rules and route failed checks to a clean escalation template for human handling.',
          failures: [
            'Generated refund figures or dates drifting from live DB records',
            'Silent policy violations passing unchecked to end users',
            'Escalation handoff missing the context gathered by earlier nodes'
          ],
          metrics: ['policy_pass_pct', 'numeric_mismatch_rate', 'human_escalation_pct']
        },
        {
          id: 'eval',
          layer: 'Observability',
          title: 'Step Trace & Evals',
          sub: 'Node-level replay',
          accent: 'purple',
          latency: 'Async',
          impl: 'Emit OpenTelemetry spans per graph node with inputs, latency, branch taken and validation verdict so any failed run can be replayed deterministically.',
          failures: [
            'Opaque end-to-end logs that hide which node introduced the error',
            'Eval suite testing only the final prompt instead of the full graph',
            'Cost growth hidden because router split ratios are not tracked'
          ],
          metrics: ['e2e_success_pct', 'node_failure_breakdown', 'cost_per_workflow_gbp']
        }
      ],

      'hitl-agent': [
        {
          id: 'trigger',
          layer: 'Entry',
          title: 'Job Queue & Context',
          sub: 'Async scoped task',
          accent: 'cyan',
          latency: '20-50 ms',
          impl: 'Enqueue multi-system tasks with caller identity, hard step/cost budgets, idempotency keys and explicit allowed-tool manifests per job type.',
          failures: [
            'Unbounded job budgets letting a looping agent burn hundreds of pounds overnight',
            'Missing caller RBAC letting the agent inherit overly broad service credentials',
            'Duplicate trigger events executing the same remediation twice'
          ],
          metrics: ['queue_wait_ms', 'active_agent_jobs', 'budget_cap_hits']
        },
        {
          id: 'guardrail',
          layer: 'Security',
          title: 'Injection & Scope Guard',
          sub: 'Untrusted data fence',
          accent: 'green',
          latency: '40-120 ms',
          impl: 'Sanitise external tickets, emails and webhooks before they enter agent memory. Enforce strict separation between data payloads and executable tool instructions.',
          failures: [
            'Indirect prompt injection inside a customer email hijacking tool arguments',
            'Sensitive credentials or PII echoed into tool parameters or traces',
            'Agent accumulating noisy tool outputs until context degrades'
          ],
          metrics: ['injection_alert_count', 'tool_arg_reject_pct', 'context_compaction_count']
        },
        {
          id: 'planner',
          layer: 'Bounded Agent',
          title: 'Step-Capped Planner',
          sub: 'Max 5-8 steps',
          accent: 'cyan',
          latency: '1.5-6 s / step',
          impl: 'Run a bounded tool-calling loop with strict max-step caps (e.g. 6 steps), read-only discovery tools separated from write proposals and deterministic state snapshots.',
          failures: [
            'Agent repeating the same failing tool call in a loop',
            'Tool descriptions overlapping so the planner picks the wrong API',
            'Partial state reads leading to premature write proposals'
          ],
          metrics: ['avg_steps_per_job', 'max_step_abort_pct', 'tool_selection_error_pct']
        },
        {
          id: 'hitl',
          layer: 'Human Gate',
          title: 'Approval & Policy Gate',
          sub: 'Mandatory write sign-off',
          accent: 'pink',
          latency: 'Human SLA',
          impl: 'Intercept every state-mutating, financial or external-facing action. Show a human operator the exact dry-run diff, rationale and blast radius for 1-click approve or reject.',
          failures: [
            'Approval fatigue where reviewers rubber-stamp walls of unreadable JSON',
            'Stale state changing between proposal time and human approval time',
            'Write tools accidentally marked as low-risk read tools'
          ],
          metrics: ['approval_rate_pct', 'median_review_time_s', 'rejected_action_reasons']
        },
        {
          id: 'executor',
          layer: 'Execution',
          title: 'Idempotent Executor',
          sub: 'Least-privilege APIs',
          accent: 'amber',
          latency: '200-900 ms',
          impl: 'Execute only approved tool calls using short-lived scoped tokens, idempotency keys, pre-flight state checks and compensating rollback hooks on partial failures.',
          failures: [
            'Network retry executing a payment or external email twice',
            'Partial multi-system failure leaving CRM and billing out of sync',
            'Over-privileged service account allowing destructive deletes'
          ],
          metrics: ['tool_exec_success_pct', 'idempotency_replays', 'rollback_trigger_count']
        },
        {
          id: 'audit',
          layer: 'Governance',
          title: 'Immutable Audit Trail',
          sub: 'Trace + red-team eval',
          accent: 'purple',
          latency: 'Async',
          impl: 'Persist immutable records of every prompt, tool call, dry-run diff, approver ID and execution outcome. Replay real incident traces in automated red-team evals.',
          failures: [
            'No link between who approved an action and what exact payload ran',
            'Silent degradation in tool accuracy after API schema changes',
            'Missing kill-switch to pause autonomous queues during an outage'
          ],
          metrics: ['audit_completeness_pct', 'redteam_pass_pct', 'cost_per_completed_task']
        }
      ],

      'finetuned-slm': [
        {
          id: 'trigger',
          layer: 'Entry',
          title: 'High-Volume Ingest',
          sub: s.latency === 'async' ? 'Batch / Queue' : 'Low-latency API',
          accent: 'cyan',
          latency: '5-15 ms',
          impl: 'Ingest requests through a load-balanced gateway or batch queue with strict payload validation, compression and backpressure controls for 5M+ monthly scale.',
          failures: [
            'Unbatched single requests under-utilising GPU memory bandwidth',
            'Sudden traffic spikes exhausting inference queue memory',
            'Inconsistent document OCR or text extraction upstream'
          ],
          metrics: ['throughput_rps', 'queue_depth', 'ingress_reject_pct']
        },
        {
          id: 'guardrail',
          layer: 'Pre-Process',
          title: 'Normaliser & PII Fence',
          sub: s.privacy === 'airgapped' ? 'Air-gapped VPC' : 'ZDR boundary',
          accent: 'green',
          latency: '5-20 ms',
          impl: 'Normalise input formatting to match exact training-set conventions and enforce data-residency boundaries so no sensitive payloads leave the approved VPC.',
          failures: [
            'Production text formatting diverging from training-set preprocessing',
            'Long outliers silently truncated past the fine-tuned sequence length',
            'Sensitive fields logged verbatim during error handling'
          ],
          metrics: ['truncation_rate_pct', 'input_token_p99', 'preprocess_p95_ms']
        },
        {
          id: 'slm',
          layer: 'Inference',
          title: 'Fine-Tuned SLM (vLLM)',
          sub: 'Distilled 3B-14B',
          accent: 'pink',
          latency: isRealtime ? '80-280 ms' : '120-500 ms',
          impl: 'Serve a teacher-distilled open-weight model (3B-14B, FP8/AWQ quantised) via vLLM or TGI with continuous batching and constrained JSON grammar decoding.',
          failures: [
            'Aggressive quantisation quietly hurting edge-case extraction accuracy',
            'GPU KV-cache exhaustion causing sudden p99 latency cliffs',
            'Serving weights drifting out of sync across regional replicas'
          ],
          metrics: ['slm_p95_latency_ms', 'gpu_kv_cache_util_pct', 'cost_per_1m_tokens_gbp']
        },
        {
          id: 'confidence',
          layer: 'Routing',
          title: 'Confidence Escalator',
          sub: s.privacy === 'airgapped' ? 'Local larger tier' : 'Exception router',
          accent: 'cyan',
          latency: '5-20 ms',
          impl: 'Inspect token logprobs and cross-field checksums (e.g. invoice line sums = total). Escalate the ambiguous 2-5% of inputs to a larger model or human queue.',
          failures: [
            'Assuming the small model handles unseen document layouts with 100% accuracy',
            'No mathematical or cross-field sanity checks on extracted numbers',
            'Escalation rate creeping above 20%, erasing unit-cost savings'
          ],
          metrics: ['escalation_rate_pct', 'checksum_fail_pct', 'logprob_low_conf_pct']
        },
        {
          id: 'validator',
          layer: 'Verification',
          title: 'Strict Schema Gate',
          sub: 'Deterministic checks',
          accent: 'amber',
          latency: '5-15 ms',
          impl: 'Run deterministic business-rule assertions, type parsing and mandatory-field checks on every structured output before committing downstream.',
          failures: [
            'Valid JSON schema containing subtly swapped currency or date formats',
            'Missing dead-letter queue for unparseable documents',
            'Downstream consumers breaking on unversioned schema changes'
          ],
          metrics: ['schema_pass_pct', 'dlq_rate_pct', 'field_f1_score']
        },
        {
          id: 'retrain',
          layer: 'MLOps',
          title: 'Shadow Eval & Retrain',
          sub: 'Active learning loop',
          accent: 'purple',
          latency: 'Async',
          impl: 'Sample 1-2% of live traffic plus escalated exceptions into a gold-labelled dataset. Benchmark candidate weights against a frozen holdout set before canary rollout.',
          failures: [
            'Training on unverified model outputs causing model collapse over time',
            'Data leakage between training samples and the holdout benchmark',
            'Retraining skipped for months while new vendor templates appear'
          ],
          metrics: ['holdout_exact_match_pct', 'drift_alert_status', 'retrain_cadence_days']
        }
      ]
    };

    return {
      boundaryLabel: privacyLabel,
      nodes: topologies[winner.id] || topologies['prompt-structured']
    };
  }

  /* ── PRE-PRODUCTION FAILURE-MODE CHECKLIST ── */
  function buildChecklist(s, winner) {
    const items = [];

    items.push({
      id: 'golden-eval',
      severity: 'Blocker',
      title: 'Frozen golden evaluation dataset (50-200 real edge cases)',
      desc: 'Build a representative test set including messy inputs, edge cases and expected refusals before shipping version 1.'
    });

    if (winner.id === 'hybrid-rag' || s.corpus !== 'small') {
      items.push({
        id: 'rag-acl',
        severity: 'Blocker',
        title: 'Pre-retrieval document ACL & tenant filtering verified',
        desc: 'Confirm permissions filter chunks inside the search index before reranking or generation so restricted records never enter context.'
      });
      items.push({
        id: 'rag-hybrid',
        severity: 'High',
        title: 'Measure retrieval Recall@5 separately from LLM faithfulness',
        desc: 'Test exact IDs, acronyms and table clauses against hybrid BM25 + dense retrieval so you know whether misses come from search or prompting.'
      });
    }

    if (s.hallucination === 'zero') {
      items.push({
        id: 'citation-refusal',
        severity: 'Blocker',
        title: 'Fail-closed refusal path & citation ID verification',
        desc: 'Prove the system abstains cleanly when evidence is missing and programmatically verify every cited source exists in retrieved context.'
      });
    }

    if (s.actionRisk === 'autonomous' || winner.id === 'hitl-agent') {
      items.push({
        id: 'hitl-gate',
        severity: 'Blocker',
        title: 'Mandatory human approval gate & dry-run diff for writes',
        desc: 'Require explicit operator confirmation with a clear diff for any external, financial or state-mutating tool call.'
      });
      items.push({
        id: 'tool-idempotency',
        severity: 'Blocker',
        title: 'Least-privilege tool tokens, step caps & idempotency keys',
        desc: 'Enforce hard step/spend caps per run, scoped credentials per tool and idempotency keys so retries never double-execute writes.'
      });
    }

    if (winner.id !== 'no-llm') {
      items.push({
        id: 'prompt-injection',
        severity: 'High',
        title: 'Indirect prompt-injection red-team test suite',
        desc: 'Test adversarial instructions hidden inside user text, uploaded PDFs or retrieved documents against OWASP LLM01 controls.'
      });
    }

    if (s.privacy === 'zdr' || s.privacy === 'airgapped') {
      items.push({
        id: 'privacy-boundary',
        severity: 'Blocker',
        title: s.privacy === 'airgapped'
          ? 'Zero-egress network policy & offline artefact verification'
          : 'Signed Zero Data Retention (ZDR) + UK/EU regional endpoint verification',
        desc: s.privacy === 'airgapped'
          ? 'Verify no outbound DNS or telemetry leaves the VPC and all model weights and tokenisers load from pinned local storage.'
          : 'Confirm contractual ZDR is active on your API tier, regional endpoints are pinned and logs scrub raw PII.'
      });
    }

    if (s.latency === 'realtime') {
      items.push({
        id: 'latency-load',
        severity: 'Blocker',
        title: 'Load test p95 & p99 latency under 2x peak traffic (<500ms)',
        desc: 'Measure cold starts, queue wait and tail latency under realistic concurrency; add timeouts and fast fallback paths.'
      });
    } else {
      items.push({
        id: 'timeout-fallback',
        severity: 'High',
        title: 'Timeouts, circuit breakers & degraded fallback behaviour',
        desc: 'Define exact behaviour when upstream model APIs return 429/529 or slow down past your SLA.'
      });
    }

    if (s.volume === 'high' || s.volume === 'veryhigh' || winner.id === 'finetuned-slm') {
      items.push({
        id: 'unit-economics',
        severity: 'High',
        title: 'Per-1k request unit cost ceiling & token/GPU spend alerts',
        desc: 'Model worst-case token spikes, retries and GPU autoscaling bounds, with automated budget circuit breakers.'
      });
    }

    if (winner.id === 'finetuned-slm' || winner.id === 'no-llm') {
      items.push({
        id: 'drift-retrain',
        severity: 'Medium',
        title: 'Holdout drift monitoring & safe rollback artefact pinning',
        desc: 'Track prediction/confidence drift weekly and keep the previous validated model artefact warm for instant rollback.'
      });
    } else {
      items.push({
        id: 'prompt-versioning',
        severity: 'Medium',
        title: 'Version-controlled prompts, schemas & pinned model snapshots',
        desc: 'Never point production at floating "latest" model aliases; pin dated snapshots and gate prompt changes on CI evals.'
      });
    }

    return items;
  }

  /* ── MERMAID GENERATOR ── */
  function buildMermaidCode(s, evalResult) {
    const nodes = evalResult.topology.nodes;
    const lines = ['flowchart LR'];
    const isRestricted = s.privacy === 'zdr' || s.privacy === 'airgapped';

    function safeLabel(n) {
      return (n.title + ' - ' + n.sub).replace(/"/g, "'");
    }

    if (isRestricted) {
      lines.push('  N0["' + safeLabel(nodes[0]) + '"]');
      lines.push('  subgraph BOUNDARY["' + evalResult.topology.boundaryLabel + '"]');
      for (let i = 1; i < nodes.length; i++) {
        lines.push('    N' + i + '["' + safeLabel(nodes[i]) + '"]');
      }
      lines.push('  end');
    } else {
      for (let i = 0; i < nodes.length; i++) {
        lines.push('  N' + i + '["' + safeLabel(nodes[i]) + '"]');
      }
    }

    for (let i = 0; i < nodes.length - 1; i++) {
      lines.push('  N' + i + ' --> N' + (i + 1));
    }

    // Add feedback/telemetry dashed link
    lines.push('  N3 -. "traces & evals" .-> N' + (nodes.length - 1));
    return lines.join('\n');
  }

  /* ── MADR MARKDOWN GENERATOR ── */
  function buildAdrData(s, evalResult) {
    const projectName = (s.projectName || '').trim() || 'Untitled AI System';
    const projectGoal = (s.projectGoal || '').trim() || 'Deliver a reliable production system aligned with stated engineering constraints.';
    const today = new Date().toISOString().slice(0, 10);
    const w = evalResult.winner;

    const rejected = evalResult.ranked.slice(1).map(function (item) {
      const topReason = item.reasons[0]
        ? item.reasons[0].note
        : 'Scored lower against the active constraints.';
      return {
        name: item.pattern.name,
        status: item.status,
        score: item.score,
        reason: topReason
      };
    });

    const guardrails = [];
    if (s.privacy === 'airgapped') {
      guardrails.push('Air-gapped / self-hosted perimeter: zero external LLM egress; all weights, embeddings and telemetry stay inside VPC/on-prem.');
    } else if (s.privacy === 'zdr') {
      guardrails.push('Zero Data Retention (ZDR) & UK/EU data residency: pin regional endpoints, scrub unnecessary PII before API calls and prohibit provider training on payloads.');
    } else {
      guardrails.push('Standard commercial API hygiene: redact secrets and unneeded PII before calls, enforce per-tenant rate limits and pin dated model snapshots.');
    }

    if (s.hallucination === 'zero') {
      guardrails.push('Zero-fabrication posture: mandatory inline citations or deterministic cross-checks, plus fail-closed refusal whenever supporting evidence is absent.');
    } else if (s.hallucination === 'moderate') {
      guardrails.push('Human-reviewed quality gate: highlight source evidence and low-confidence fields so reviewers spot errors quickly.');
    } else {
      guardrails.push('Creative draft guardrails: apply basic brand/safety checks and label outputs clearly as drafts.');
    }

    if (s.actionRisk === 'autonomous') {
      guardrails.push('Write-action containment (OWASP LLM06): least-privilege scoped tool tokens, hard step/cost caps, dry-run diffs, idempotency keys and mandatory human approval before money or external writes.');
    } else if (s.actionRisk === 'drafts') {
      guardrails.push('Read-only / draft-only boundary: AI layer prepares structured suggestions only; downstream state writes remain human-triggered.');
    } else {
      guardrails.push('Read-only execution: zero write credentials attached to the inference layer.');
    }

    const positiveConsequences = [
      'Ships the minimum viable stack (' + w.pattern.buildTime + ' estimated build) without unnecessary operational drag.',
      'Aligns operational complexity (' + evalResult.complexity + '/10 - ' + evalResult.complexityBand + ') with a ' + CONSTRAINT_LABELS.team[s.team] + '.',
      'Keeps failure modes isolated to explicit inspectable components (' + evalResult.topology.nodes.map(function (n) { return n.title; }).join(' -> ') + ').'
    ];

    const negativeConsequences = [
      'Requires disciplined offline evals and observability from week one rather than ad-hoc prompt tweaking.',
      s.privacy === 'airgapped'
        ? 'Self-hosting inside an air-gapped boundary adds infrastructure patching and model-upgrade maintenance.'
        : 'Tightly scoped design will need a formal architecture review if corpus size, action risk or volume jumps an order of magnitude.'
    ];

    const revisitTriggers = [];
    if (w.id === 'prompt-structured') {
      revisitTriggers.push('Active reference corpus exceeds 100k tokens or requires per-user document ACLs (migrate to Hybrid RAG).');
      revisitTriggers.push('Monthly volume exceeds 500k requests and prompt-cache savings no longer cover unit economics (evaluate tiered routing or distillation).');
    } else if (w.id === 'hybrid-rag') {
      revisitTriggers.push('Queries require live transactional state from APIs/databases alongside documents (upgrade to Deterministic Workflow + Router).');
      revisitTriggers.push('Retrieval Recall@5 stalls below 85% despite hybrid search and reranking (audit chunking, metadata and source document quality first).');
    } else if (w.id === 'no-llm') {
      revisitTriggers.push('Input formats become heavily unstructured prose where feature engineering and classical F1 plateau below business targets.');
    } else if (w.id === 'workflow-router') {
      revisitTriggers.push('Workflow branching becomes genuinely open-ended across dozens of unpredictable tool combinations (evaluate a Human-in-the-Loop Bounded Agent).');
      revisitTriggers.push('Monthly volume crosses 5M requests on repetitive branches (distil high-frequency nodes into a fine-tuned SLM).');
    } else if (w.id === 'hitl-agent') {
      revisitTriggers.push('Observed agent trajectories converge on 3-5 predictable paths (collapse those paths into a cheaper, faster Deterministic Workflow).');
    } else if (w.id === 'finetuned-slm') {
      revisitTriggers.push('Underlying task rules or schemas change weekly (add retrieval or move volatile steps back to a cached router tier).');
    }
    revisitTriggers.push('Regulatory, privacy residency or action-risk classification changes.');

    const evalMetrics = [
      'Golden-set accuracy / task pass rate: >= ' + (s.hallucination === 'zero' ? '98% on grounded facts, 0% fabricated citations' : '90% pass rate on 100-case golden suite'),
      'Latency p95 target: ' + CONSTRAINT_LABELS.latency[s.latency] + ' (measured end-to-end including guardrails and validation)',
      w.id === 'hybrid-rag'
        ? 'Retrieval Recall@5 >= 90% and Faithfulness >= 95% (tracked independently)'
        : (w.id === 'hitl-agent'
          ? 'Human approval acceptance rate >= 85%, zero unauthorised tool executions, max-step abort rate < 5%'
          : 'Schema / contract validity rate >= 99.5% with bounded retry rate < 2%'),
      'Refusal / abstain precision >= 95% on out-of-scope or missing-evidence test cases',
      'Unit economics: tracked cost per 1,000 requests against monthly budget cap at ' + CONSTRAINT_LABELS.volume[s.volume]
    ];

    const completedChecks = evalResult.checklist.filter(function (c) { return checkedGates.has(c.id); }).length;

    // Build Markdown text
    const md = [
      '# ADR-001: ' + projectName + ' - ' + w.pattern.shortName,
      '',
      '- **Status:** Proposed',
      '- **Date:** ' + today,
      '- **Recommended Pattern:** ' + w.pattern.name,
      '- **Decision Confidence:** ' + evalResult.confidence + '% (' + evalResult.confidenceNote + ')',
      '- **Engineering Complexity:** ' + evalResult.complexity + '/10 (' + evalResult.complexityBand + ') | Est. Build: ' + w.pattern.buildTime + ' | Ops: ' + w.pattern.opsBurden,
      '- **Pre-Production Checklist:** ' + completedChecks + '/' + evalResult.checklist.length + ' gates verified',
      '',
      '## Context',
      '',
      '**Goal:** ' + projectGoal,
      '',
      '**Engineering Constraints:**',
      '- **Task Type:** ' + CONSTRAINT_LABELS.taskType[s.taskType],
      '- **Latency SLA:** ' + CONSTRAINT_LABELS.latency[s.latency],
      '- **Knowledge Freshness:** ' + CONSTRAINT_LABELS.freshness[s.freshness],
      '- **Corpus Size:** ' + CONSTRAINT_LABELS.corpus[s.corpus],
      '- **Hallucination Tolerance:** ' + CONSTRAINT_LABELS.hallucination[s.hallucination],
      '- **Action Risk:** ' + CONSTRAINT_LABELS.actionRisk[s.actionRisk],
      '- **Data Privacy / Residency:** ' + CONSTRAINT_LABELS.privacy[s.privacy],
      '- **Monthly Request Volume:** ' + CONSTRAINT_LABELS.volume[s.volume],
      '- **Team Maturity:** ' + CONSTRAINT_LABELS.team[s.team],
      '',
      '## Decision',
      '',
      'We will adopt **' + w.pattern.name + '** as the minimum viable architecture for ' + projectName + '.',
      '',
      w.pattern.tagline,
      '',
      '**Core Topology:** ' + evalResult.topology.nodes.map(function (n) { return n.title; }).join(' -> '),
      '',
      '**Reference Building Blocks:** ' + w.pattern.stack.join(', ') + '.',
      '',
      '## Alternatives Considered & Rejected',
      ''
    ];

    rejected.forEach(function (r) {
      md.push('- **' + r.name + '** (' + r.status + ', Fit ' + r.score + '/100): ' + r.reason + '.');
    });

    md.push('');
    md.push('**Explicit Anti-Patterns Avoided:**');
    evalResult.antiPatterns.forEach(function (ap) {
      md.push('- **' + ap.title + ':** ' + ap.body);
    });

    md.push('');
    md.push('## Guardrails & Governance');
    md.push('');
    guardrails.forEach(function (g) {
      md.push('- ' + g);
    });

    md.push('');
    md.push('## Consequences');
    md.push('');
    md.push('**Positive:**');
    positiveConsequences.forEach(function (p) { md.push('- ' + p); });
    md.push('');
    md.push('**Trade-offs & Costs:**');
    negativeConsequences.forEach(function (n) { md.push('- ' + n); });
    md.push('');
    md.push('**Triggers to Revisit This ADR:**');
    revisitTriggers.forEach(function (t) { md.push('- ' + t); });

    md.push('');
    md.push('## Eval Metrics & Acceptance Thresholds');
    md.push('');
    evalMetrics.forEach(function (m) { md.push('- ' + m); });

    md.push('');
    md.push('## Pre-Production Failure-Mode Checklist');
    md.push('');
    evalResult.checklist.forEach(function (c) {
      const box = checkedGates.has(c.id) ? '[x]' : '[ ]';
      md.push('- ' + box + ' **[' + c.severity + '] ' + c.title + ':** ' + c.desc);
    });

    md.push('');
    md.push('---');
    md.push('Generated locally with JohnB.io AI Architecture Advisor (https://johnb.io/ai-architecture-advisor).');

    return {
      projectName: projectName,
      projectGoal: projectGoal,
      today: today,
      rejected: rejected,
      guardrails: guardrails,
      positiveConsequences: positiveConsequences,
      negativeConsequences: negativeConsequences,
      revisitTriggers: revisitTriggers,
      evalMetrics: evalMetrics,
      markdown: md.join('\n')
    };
  }

  /* ── SVG RENDERING & EXPORT ── */
  const ACCENT_COLOURS = {
    cyan: { stroke: '#00eefc', fill: '#0f1c24', tag: '#00eefc', glow: 'rgba(0,238,252,0.45)' },
    pink: { stroke: '#ff007f', fill: '#22101c', tag: '#ff78bc', glow: 'rgba(255,0,127,0.45)' },
    green: { stroke: '#22c55e', fill: '#0f2018', tag: '#4ade80', glow: 'rgba(34,197,94,0.42)' },
    amber: { stroke: '#fbbf24', fill: '#221b0f', tag: '#fcd34d', glow: 'rgba(251,191,36,0.42)' },
    purple: { stroke: '#c084fc', fill: '#1b1226', tag: '#d8b4fe', glow: 'rgba(192,132,252,0.42)' }
  };

  function wrapSvgLines(text, maxChars) {
    const words = String(text || '').split(' ');
    const lines = [];
    let current = '';
    words.forEach(function (word) {
      if ((current + ' ' + word).trim().length <= maxChars) {
        current = (current + ' ' + word).trim();
      } else {
        if (current) lines.push(current);
        current = word;
      }
    });
    if (current) lines.push(current);
    return lines.slice(0, 2);
  }

  function renderSvgMarkup(s, evalResult, forExport) {
    const nodes = evalResult.topology.nodes;
    const isRestricted = s.privacy === 'zdr' || s.privacy === 'airgapped';
    const boundaryStroke = s.privacy === 'airgapped' ? '#ff007f' : '#00eefc';
    const nodeW = 152;
    const nodeH = 104;
    const gap = 28;
    const startX = 24;
    const nodeY = 70;
    const totalW = startX * 2 + nodes.length * nodeW + (nodes.length - 1) * gap;
    const totalH = 252;

    const parts = [];
    parts.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + totalW + ' ' + totalH + '" role="img" aria-label="Architecture topology for ' + escapeHtml(evalResult.winner.pattern.shortName) + '">');

    if (forExport) {
      parts.push('<style>text{font-family:"Space Grotesk","Segoe UI",sans-serif;}</style>');
      parts.push('<rect x="0" y="0" width="' + totalW + '" height="' + totalH + '" rx="14" fill="#0b0b10"/>');
    }

    parts.push('<defs>');
    parts.push('<marker id="aaa-arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#00eefc"/></marker>');
    parts.push('<marker id="aaa-arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc"/></marker>');
    parts.push('<filter id="aaa-neon-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>');
    parts.push('</defs>');

    // Top pattern title bar inside SVG
    parts.push('<text x="24" y="28" fill="#f8f5fd" font-family="Space Grotesk, sans-serif" font-size="13" font-weight="800" letter-spacing="0.04em">' + escapeHtml(evalResult.winner.pattern.shortName.toUpperCase()) + ' TOPOLOGY</text>');
    parts.push('<text x="' + (totalW - 24) + '" y="28" text-anchor="end" fill="' + (isRestricted ? boundaryStroke : '#acaab1') + '" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700">' + escapeHtml(evalResult.topology.boundaryLabel.toUpperCase()) + '</text>');

    // Privacy / VPC boundary frame around internal nodes (nodes 1..end) when ZDR or Air-Gapped
    if (isRestricted) {
      const bx = startX + nodeW + gap - 12;
      const bw = totalW - bx - 12;
      parts.push('<rect x="' + bx + '" y="48" width="' + bw + '" height="142" rx="14" fill="rgba(0,238,252,0.03)" stroke="' + boundaryStroke + '" stroke-width="1.2" stroke-dasharray="6 5" opacity="0.72"/>');
    }

    // Main horizontal flow arrows
    for (let i = 0; i < nodes.length - 1; i++) {
      const x1 = startX + i * (nodeW + gap) + nodeW + 2;
      const x2 = startX + (i + 1) * (nodeW + gap) - 4;
      const cy = nodeY + nodeH / 2;
      parts.push('<line x1="' + x1 + '" y1="' + cy + '" x2="' + x2 + '" y2="' + cy + '" stroke="rgba(0,238,252,0.28)" stroke-width="2.5"/>');
      parts.push('<line class="aaa-flow-line" x1="' + x1 + '" y1="' + cy + '" x2="' + x2 + '" y2="' + cy + '" stroke="#00eefc" stroke-width="2" marker-end="url(#aaa-arrow-cyan)"/>');
    }

    // Telemetry / Eval bus along the bottom (Guardrail -> Model -> Eval)
    const busY = 218;
    const xGuard = startX + 1 * (nodeW + gap) + nodeW / 2;
    const xModel = startX + 3 * (nodeW + gap) + nodeW / 2;
    const xEval = startX + (nodes.length - 1) * (nodeW + gap) + nodeW / 2;
    const nodeBottom = nodeY + nodeH;

    parts.push('<path d="M ' + xGuard + ' ' + nodeBottom + ' L ' + xGuard + ' ' + busY + ' L ' + xEval + ' ' + busY + ' L ' + xEval + ' ' + (nodeBottom + 4) + '" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.75" marker-end="url(#aaa-arrow-purple)"/>');
    parts.push('<line x1="' + xModel + '" y1="' + nodeBottom + '" x2="' + xModel + '" y2="' + busY + '" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.75"/>');
    parts.push('<text x="' + ((xGuard + xEval) / 2) + '" y="' + (busY + 18) + '" text-anchor="middle" fill="#c084fc" font-family="Space Grotesk, sans-serif" font-size="10.5" font-weight="700" letter-spacing="0.06em">ASYNC TELEMETRY, GUARDRAIL EVENTS &amp; EVAL TRACES</text>');

    // Render Nodes
    nodes.forEach(function (node, idx) {
      const x = startX + idx * (nodeW + gap);
      const col = ACCENT_COLOURS[node.accent] || ACCENT_COLOURS.cyan;
      const isSelected = !forExport && node.id === selectedNodeId;
      const titleLines = wrapSvgLines(node.title, 18);

      parts.push(
        '<g class="aaa-svg-node' + (isSelected ? ' selected' : '') + '" data-node-id="' + escapeHtml(node.id) + '"' +
        (forExport ? '' : ' role="button" tabindex="0" aria-pressed="' + (isSelected ? 'true' : 'false') + '" aria-label="Inspect ' + escapeHtml(node.title) + ' (' + escapeHtml(node.layer) + ')"') +
        '>'
      );

      if (isSelected) {
        parts.push('<rect x="' + (x - 4) + '" y="' + (nodeY - 4) + '" width="' + (nodeW + 8) + '" height="' + (nodeH + 8) + '" rx="14" fill="none" stroke="' + col.stroke + '" stroke-width="1.8" opacity="0.65" filter="url(#aaa-neon-glow)"/>');
      }

      parts.push('<rect class="aaa-node-box" x="' + x + '" y="' + nodeY + '" width="' + nodeW + '" height="' + nodeH + '" rx="11" fill="' + col.fill + '" stroke="' + col.stroke + '" stroke-width="' + (isSelected ? '2.4' : '1.5') + '"/>');

      // Layer pill top-left + step number top-right
      parts.push('<text x="' + (x + 11) + '" y="' + (nodeY + 20) + '" fill="' + col.tag + '" font-family="Space Grotesk, sans-serif" font-size="9.5" font-weight="800" letter-spacing="0.07em">' + escapeHtml(node.layer.toUpperCase()) + '</text>');
      parts.push('<text x="' + (x + nodeW - 11) + '" y="' + (nodeY + 20) + '" text-anchor="end" fill="#acaab1" font-family="Space Grotesk, sans-serif" font-size="9.5" font-weight="700">0' + (idx + 1) + '</text>');

      // Node Title (1 or 2 lines)
      if (titleLines.length === 1) {
        parts.push('<text x="' + (x + 11) + '" y="' + (nodeY + 48) + '" fill="#f8f5fd" font-family="Space Grotesk, sans-serif" font-size="12.5" font-weight="800">' + escapeHtml(titleLines[0]) + '</text>');
      } else {
        parts.push('<text x="' + (x + 11) + '" y="' + (nodeY + 42) + '" fill="#f8f5fd" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="800">' + escapeHtml(titleLines[0]) + '</text>');
        parts.push('<text x="' + (x + 11) + '" y="' + (nodeY + 57) + '" fill="#f8f5fd" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="800">' + escapeHtml(titleLines[1]) + '</text>');
      }

      // Subtitle
      parts.push('<text x="' + (x + 11) + '" y="' + (nodeY + 75) + '" fill="#b8b5c0" font-family="Manrope, sans-serif" font-size="10.2" font-weight="600">' + escapeHtml(node.sub) + '</text>');

      // Latency budget footer bar
      parts.push('<line x1="' + (x + 10) + '" y1="' + (nodeY + 84) + '" x2="' + (x + nodeW - 10) + '" y2="' + (nodeY + 84) + '" stroke="rgba(248,245,253,0.1)" stroke-width="1"/>');
      parts.push('<text x="' + (x + 11) + '" y="' + (nodeY + 97) + '" fill="' + col.tag + '" font-family="Space Grotesk, sans-serif" font-size="9.5" font-weight="700">SLA: ' + escapeHtml(node.latency) + '</text>');

      parts.push('</g>');
    });

    parts.push('</svg>');
    return parts.join('');
  }

  /* ── DOM REFERENCES ── */
  const dom = {};
  function cacheDom() {
    const ids = [
      'aaa-presets', 'aaa-form', 'aaa-project-name', 'aaa-project-goal',
      'aaa-task-type', 'aaa-latency', 'aaa-freshness', 'aaa-corpus',
      'aaa-hallucination', 'aaa-action-risk', 'aaa-privacy', 'aaa-volume', 'aaa-team',
      'aaa-reset-btn', 'aaa-copy-url-top-btn', 'aaa-live-status',
      'aaa-winner-badge', 'aaa-winner-title', 'aaa-winner-tagline', 'aaa-winner-rationale',
      'aaa-confidence-value', 'aaa-confidence-bar', 'aaa-confidence-note',
      'aaa-complexity-value', 'aaa-complexity-bar', 'aaa-complexity-note',
      'aaa-build-time', 'aaa-ops-burden', 'aaa-stack-chips',
      'aaa-antipattern-list',
      'aaa-diagram-subtitle', 'aaa-svg-container',
      'aaa-download-svg-btn', 'aaa-copy-mermaid-btn', 'aaa-toggle-mermaid-btn',
      'aaa-mermaid-drawer', 'aaa-mermaid-code',
      'aaa-inspector-badge', 'aaa-inspector-title', 'aaa-inspector-latency',
      'aaa-inspector-impl', 'aaa-inspector-failures', 'aaa-inspector-metrics',
      'aaa-matrix-body',
      'aaa-checklist-count', 'aaa-checklist-bar', 'aaa-checklist-list', 'aaa-checklist-reset-btn',
      'aaa-adr-tab-rendered', 'aaa-adr-tab-markdown', 'aaa-adr-rendered', 'aaa-adr-markdown',
      'aaa-copy-adr-btn', 'aaa-download-md-btn', 'aaa-copy-url-btn', 'aaa-print-btn',
      'back-to-top'
    ];
    ids.forEach(function (id) {
      dom[id] = document.getElementById(id);
    });
  }

  /* ── URL QUERY ENCODING / DECODING ── */
  const URL_KEYS = {
    projectName: 'p',
    projectGoal: 'g',
    taskType: 't',
    latency: 'l',
    freshness: 'f',
    corpus: 'c',
    hallucination: 'h',
    actionRisk: 'a',
    privacy: 'd',
    volume: 'v',
    team: 'm'
  };

  function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let foundAny = false;
    Object.keys(URL_KEYS).forEach(function (field) {
      const val = params.get(URL_KEYS[field]);
      if (val !== null) {
        if (field === 'projectName' || field === 'projectGoal') {
          currentState[field] = val.slice(0, 180);
          foundAny = true;
        } else if (CONSTRAINT_LABELS[field] && CONSTRAINT_LABELS[field][val]) {
          currentState[field] = val;
          foundAny = true;
        }
      }
    });
    if (foundAny) {
      activePresetId = null;
    }
  }

  function buildShareableUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    Object.keys(URL_KEYS).forEach(function (field) {
      if (currentState[field]) {
        url.searchParams.set(URL_KEYS[field], currentState[field]);
      }
    });
    return url.toString();
  }

  function syncFormFromState() {
    dom['aaa-project-name'].value = currentState.projectName || '';
    dom['aaa-project-goal'].value = currentState.projectGoal || '';
    dom['aaa-task-type'].value = currentState.taskType;
    dom['aaa-latency'].value = currentState.latency;
    dom['aaa-freshness'].value = currentState.freshness;
    dom['aaa-corpus'].value = currentState.corpus;
    dom['aaa-hallucination'].value = currentState.hallucination;
    dom['aaa-action-risk'].value = currentState.actionRisk;
    dom['aaa-privacy'].value = currentState.privacy;
    dom['aaa-volume'].value = currentState.volume;
    dom['aaa-team'].value = currentState.team;
  }

  function readStateFromForm() {
    currentState = {
      projectName: dom['aaa-project-name'].value,
      projectGoal: dom['aaa-project-goal'].value,
      taskType: dom['aaa-task-type'].value,
      latency: dom['aaa-latency'].value,
      freshness: dom['aaa-freshness'].value,
      corpus: dom['aaa-corpus'].value,
      hallucination: dom['aaa-hallucination'].value,
      actionRisk: dom['aaa-action-risk'].value,
      privacy: dom['aaa-privacy'].value,
      volume: dom['aaa-volume'].value,
      team: dom['aaa-team'].value
    };
  }

  /* ── RENDERING FUNCTIONS ── */
  function renderPresets() {
    const html = PRESETS.map(function (preset) {
      const isActive = preset.id === activePresetId;
      return (
        '<button type="button" class="aaa-preset-btn' + (isActive ? ' active' : '') + '" data-preset-id="' + escapeHtml(preset.id) + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' +
          '<span class="aaa-preset-top">' +
            '<span class="material-symbols-outlined" aria-hidden="true">' + escapeHtml(preset.icon) + '</span>' +
            '<span>' + escapeHtml(preset.label) + '</span>' +
          '</span>' +
          '<span class="aaa-preset-sub">' + escapeHtml(preset.summary) + '</span>' +
        '</button>'
      );
    }).join('');
    dom['aaa-presets'].innerHTML = html;
  }

  function renderVerdict(evalResult) {
    const w = evalResult.winner;
    dom['aaa-winner-badge'].textContent = 'Minimum Viable Pattern';
    dom['aaa-winner-title'].textContent = w.pattern.name;
    dom['aaa-winner-tagline'].textContent = w.pattern.tagline;

    const topDrivers = w.reasons
      .filter(function (r) { return r.delta > 0; })
      .slice(0, 3)
      .map(function (r) { return r.note; });

    dom['aaa-winner-rationale'].textContent = topDrivers.length
      ? 'Primary drivers: ' + topDrivers.join('. ') + '.'
      : 'Selected as the lowest-complexity pattern meeting all stated constraints.';

    dom['aaa-build-time'].textContent = w.pattern.buildTime;
    dom['aaa-ops-burden'].textContent = w.pattern.opsBurden;

    dom['aaa-confidence-value'].textContent = evalResult.confidence + '%';
    dom['aaa-confidence-bar'].style.width = evalResult.confidence + '%';
    dom['aaa-confidence-note'].textContent = evalResult.confidenceNote;

    dom['aaa-complexity-value'].textContent = evalResult.complexity + ' / 10 (' + evalResult.complexityBand + ')';
    dom['aaa-complexity-bar'].style.width = (evalResult.complexity * 10) + '%';
    dom['aaa-complexity-note'].textContent = evalResult.complexityNote;

    dom['aaa-stack-chips'].innerHTML = w.pattern.stack.map(function (item) {
      return '<span class="aaa-stack-chip">' + escapeHtml(item) + '</span>';
    }).join('');

    dom['aaa-antipattern-list'].innerHTML = evalResult.antiPatterns.map(function (ap) {
      return (
        '<li class="aaa-antipattern-item">' +
          '<strong>' + escapeHtml(ap.title) + '</strong>' +
          '<p>' + escapeHtml(ap.body) + '</p>' +
        '</li>'
      );
    }).join('');
  }

  function renderInspector(node) {
    if (!node) return;
    dom['aaa-inspector-badge'].className = 'aaa-inspector-badge aaa-inspector-badge--' + (node.accent || 'cyan');
    dom['aaa-inspector-badge'].textContent = node.layer;
    dom['aaa-inspector-title'].textContent = node.title + ' (' + node.sub + ')';
    dom['aaa-inspector-latency'].textContent = node.latency;
    dom['aaa-inspector-impl'].textContent = node.impl;

    dom['aaa-inspector-failures'].innerHTML = node.failures.map(function (f) {
      return '<li>' + escapeHtml(f) + '</li>';
    }).join('');

    dom['aaa-inspector-metrics'].innerHTML = node.metrics.map(function (m) {
      return '<li class="aaa-metric-pill">' + escapeHtml(m) + '</li>';
    }).join('');
  }

  function renderDiagram(evalResult) {
    const nodes = evalResult.topology.nodes;
    const stillExists = nodes.some(function (n) { return n.id === selectedNodeId; });
    if (!stillExists) {
      // Default to the core model/retriever/planner node (index 2 or 3)
      selectedNodeId = nodes[3] ? nodes[3].id : nodes[0].id;
    }

    dom['aaa-diagram-subtitle'].textContent =
      'Active topology for ' + evalResult.winner.pattern.shortName + ' (' + evalResult.topology.boundaryLabel + '). Click or tab to any node to inspect failure modes and telemetry.';

    dom['aaa-svg-container'].innerHTML = renderSvgMarkup(currentState, evalResult, false);
    dom['aaa-mermaid-code'].textContent = buildMermaidCode(currentState, evalResult);

    const activeNode = nodes.find(function (n) { return n.id === selectedNodeId; }) || nodes[0];
    renderInspector(activeNode);
  }

  function renderMatrix(evalResult) {
    const rows = evalResult.ranked.map(function (item, idx) {
      const isWinner = idx === 0;
      const topReasons = item.reasons.slice(0, 2).map(function (r) { return r.note; });
      const rationale = topReasons.length ? topReasons.join('. ') + '.' : 'Baseline fit across selected constraints.';
      const barClass = isWinner ? '' : (item.statusClass === 'reject' ? ' aaa-mini-fill--pink' : ' aaa-mini-fill--muted');

      return (
        '<tr class="' + (isWinner ? 'is-winner' : '') + '">' +
          '<td>' +
            '<span class="aaa-matrix-name">' + escapeHtml(item.pattern.name) + '</span>' +
            '<span class="aaa-matrix-short">Build: ' + escapeHtml(item.pattern.buildTime) + ' · Ops: ' + escapeHtml(item.pattern.opsBurden) + '</span>' +
          '</td>' +
          '<td class="aaa-score-cell">' +
            '<span class="aaa-score-num">' + item.score + ' / 100</span>' +
            '<div class="aaa-mini-track" aria-hidden="true"><div class="aaa-mini-fill' + barClass + '" style="width:' + item.score + '%"></div></div>' +
          '</td>' +
          '<td><span class="aaa-status-tag aaa-status-tag--' + escapeHtml(item.statusClass) + '">' + escapeHtml(item.status) + '</span></td>' +
          '<td>' + item.pattern.baseComplexity + ' / 10</td>' +
          '<td>' + escapeHtml(rationale) + '</td>' +
        '</tr>'
      );
    }).join('');
    dom['aaa-matrix-body'].innerHTML = rows;
  }

  function renderChecklist(evalResult) {
    const items = evalResult.checklist;
    const html = items.map(function (item) {
      const isChecked = checkedGates.has(item.id);
      const sevClass = item.severity.toLowerCase();
      return (
        '<li class="aaa-check-row' + (isChecked ? ' checked' : '') + '">' +
          '<label class="aaa-check-label">' +
            '<input type="checkbox" data-gate-id="' + escapeHtml(item.id) + '"' + (isChecked ? ' checked' : '') + '>' +
            '<span class="aaa-check-content">' +
              '<span class="aaa-check-top">' +
                '<span class="aaa-check-title">' + escapeHtml(item.title) + '</span>' +
                '<span class="aaa-sev-badge aaa-sev-badge--' + escapeHtml(sevClass) + '">' + escapeHtml(item.severity) + '</span>' +
              '</span>' +
              '<p class="aaa-check-desc">' + escapeHtml(item.desc) + '</p>' +
            '</span>' +
          '</label>' +
        '</li>'
      );
    }).join('');
    dom['aaa-checklist-list'].innerHTML = html;
    updateChecklistProgress(items);
  }

  function updateChecklistProgress(items) {
    const total = items.length;
    const done = items.filter(function (i) { return checkedGates.has(i.id); }).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    dom['aaa-checklist-count'].textContent = done + ' / ' + total + ' verified (' + pct + '%)';
    dom['aaa-checklist-bar'].style.width = pct + '%';
  }

  function renderAdr(evalResult) {
    const adr = buildAdrData(currentState, evalResult);
    dom['aaa-adr-markdown'].textContent = adr.markdown;

    const rendered = [
      '<h3>ADR-001: ' + escapeHtml(adr.projectName) + ' - ' + escapeHtml(evalResult.winner.pattern.shortName) + '</h3>',
      '<div class="aaa-adr-meta-grid">',
        '<div><span>Status</span><strong>Proposed</strong></div>',
        '<div><span>Date</span><strong>' + escapeHtml(adr.today) + '</strong></div>',
        '<div><span>Confidence</span><strong>' + evalResult.confidence + '%</strong></div>',
        '<div><span>Complexity</span><strong>' + evalResult.complexity + '/10 (' + escapeHtml(evalResult.complexityBand) + ')</strong></div>',
      '</div>',
      '<h4>Context</h4>',
      '<p><strong>Goal:</strong> ' + escapeHtml(adr.projectGoal) + '</p>',
      '<ul>',
        '<li><strong>Task &amp; SLA:</strong> ' + escapeHtml(CONSTRAINT_LABELS.taskType[currentState.taskType]) + ' · ' + escapeHtml(CONSTRAINT_LABELS.latency[currentState.latency]) + '</li>',
        '<li><strong>Knowledge &amp; Corpus:</strong> ' + escapeHtml(CONSTRAINT_LABELS.freshness[currentState.freshness]) + ' · ' + escapeHtml(CONSTRAINT_LABELS.corpus[currentState.corpus]) + '</li>',
        '<li><strong>Risk &amp; Privacy:</strong> ' + escapeHtml(CONSTRAINT_LABELS.hallucination[currentState.hallucination]) + ' · ' + escapeHtml(CONSTRAINT_LABELS.actionRisk[currentState.actionRisk]) + ' · ' + escapeHtml(CONSTRAINT_LABELS.privacy[currentState.privacy]) + '</li>',
        '<li><strong>Scale &amp; Team:</strong> ' + escapeHtml(CONSTRAINT_LABELS.volume[currentState.volume]) + ' · ' + escapeHtml(CONSTRAINT_LABELS.team[currentState.team]) + '</li>',
      '</ul>',
      '<h4>Decision</h4>',
      '<p>Adopt <strong>' + escapeHtml(evalResult.winner.pattern.name) + '</strong>. ' + escapeHtml(evalResult.winner.pattern.tagline) + '</p>',
      '<p><strong>Topology:</strong> ' + escapeHtml(evalResult.topology.nodes.map(function (n) { return n.title; }).join(' -> ')) + '</p>',
      '<h4>Alternatives Considered &amp; Rejected</h4>',
      '<ul>' + adr.rejected.map(function (r) {
        return '<li><strong>' + escapeHtml(r.name) + '</strong> (' + escapeHtml(r.status) + ', ' + r.score + '/100): ' + escapeHtml(r.reason) + '.</li>';
      }).join('') + '</ul>',
      '<h4>Guardrails &amp; Governance</h4>',
      '<ul>' + adr.guardrails.map(function (g) { return '<li>' + escapeHtml(g) + '</li>'; }).join('') + '</ul>',
      '<h4>Consequences &amp; Revisit Triggers</h4>',
      '<ul>' + adr.positiveConsequences.map(function (p) { return '<li><strong>Positive:</strong> ' + escapeHtml(p) + '</li>'; }).join('') +
        adr.negativeConsequences.map(function (n) { return '<li><strong>Trade-off:</strong> ' + escapeHtml(n) + '</li>'; }).join('') +
        adr.revisitTriggers.map(function (t) { return '<li><strong>Revisit if:</strong> ' + escapeHtml(t) + '</li>'; }).join('') +
      '</ul>',
      '<h4>Eval Metrics &amp; Acceptance Thresholds</h4>',
      '<ul>' + adr.evalMetrics.map(function (m) { return '<li>' + escapeHtml(m) + '</li>'; }).join('') + '</ul>'
    ].join('');

    dom['aaa-adr-rendered'].innerHTML = rendered;
  }

  function announce(msg) {
    if (dom['aaa-live-status']) {
      dom['aaa-live-status'].textContent = msg;
    }
  }

  function updateAll(shouldAnnounce) {
    lastEvaluation = evaluateArchitecture(currentState);
    renderPresets();
    renderVerdict(lastEvaluation);
    renderDiagram(lastEvaluation);
    renderMatrix(lastEvaluation);
    renderChecklist(lastEvaluation);
    renderAdr(lastEvaluation);
    if (shouldAnnounce) {
      announce('Recommended pattern updated to ' + lastEvaluation.winner.pattern.name + '.');
    }
  }

  /* ── CLIPBOARD & DOWNLOAD HELPERS ── */
  function flashButton(btn, tempText) {
    if (!btn) return;
    const span = btn.querySelector('span:last-child') || btn;
    const original = span.textContent;
    btn.classList.add('aaa-btn-copied');
    span.textContent = tempText;
    window.setTimeout(function () {
      btn.classList.remove('aaa-btn-copied');
      span.textContent = original;
    }, 1800);
  }

  function copyText(text, btn, feedback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        flashButton(btn, feedback);
        announce(feedback);
      }).catch(function () {
        fallbackCopy(text, btn, feedback);
      });
    } else {
      fallbackCopy(text, btn, feedback);
    }
  }

  function fallbackCopy(text, btn, feedback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      flashButton(btn, feedback);
      announce(feedback);
    } catch (e) {
      flashButton(btn, 'Copy failed');
    }
    document.body.removeChild(ta);
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ── EVENT BINDING ── */
  function bindEvents() {
    // Presets
    dom['aaa-presets'].addEventListener('click', function (e) {
      const btn = e.target.closest('.aaa-preset-btn');
      if (!btn) return;
      const presetId = btn.getAttribute('data-preset-id');
      const found = PRESETS.find(function (p) { return p.id === presetId; });
      if (!found) return;
      activePresetId = found.id;
      currentState = Object.assign({}, found.state);
      selectedNodeId = null;
      syncFormFromState();
      updateAll(true);
    });

    // Constraint inputs
    dom['aaa-form'].addEventListener('input', function () {
      activePresetId = null;
      readStateFromForm();
      updateAll(false);
    });

    dom['aaa-form'].addEventListener('change', function () {
      activePresetId = null;
      readStateFromForm();
      updateAll(true);
    });

    // Reset button
    dom['aaa-reset-btn'].addEventListener('click', function () {
      activePresetId = PRESETS[0].id;
      currentState = Object.assign({}, PRESETS[0].state);
      selectedNodeId = null;
      checkedGates.clear();
      if (window.history && window.history.replaceState) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.search = '';
        window.history.replaceState({}, '', cleanUrl.toString());
      }
      syncFormFromState();
      updateAll(true);
    });

    // SVG Node click & keyboard activation
    dom['aaa-svg-container'].addEventListener('click', function (e) {
      const nodeEl = e.target.closest('.aaa-svg-node');
      if (!nodeEl || !lastEvaluation) return;
      const id = nodeEl.getAttribute('data-node-id');
      if (id && id !== selectedNodeId) {
        selectedNodeId = id;
        renderDiagram(lastEvaluation);
      }
    });

    dom['aaa-svg-container'].addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const nodeEl = e.target.closest('.aaa-svg-node');
      if (!nodeEl || !lastEvaluation) return;
      e.preventDefault();
      const id = nodeEl.getAttribute('data-node-id');
      if (id) {
        selectedNodeId = id;
        renderDiagram(lastEvaluation);
        const refocus = dom['aaa-svg-container'].querySelector('[data-node-id="' + id + '"]');
        if (refocus) refocus.focus();
      }
    });

    // Export SVG
    dom['aaa-download-svg-btn'].addEventListener('click', function () {
      if (!lastEvaluation) return;
      const svgText = renderSvgMarkup(currentState, lastEvaluation, true);
      const name = 'architecture-' + slugify(currentState.projectName || lastEvaluation.winner.id) + '.svg';
      downloadFile(svgText, name, 'image/svg+xml;charset=utf-8');
      flashButton(dom['aaa-download-svg-btn'], 'SVG Downloaded');
    });

    // Copy Mermaid
    dom['aaa-copy-mermaid-btn'].addEventListener('click', function () {
      if (!lastEvaluation) return;
      copyText(buildMermaidCode(currentState, lastEvaluation), dom['aaa-copy-mermaid-btn'], 'Mermaid Copied');
    });

    // Toggle Mermaid Drawer
    dom['aaa-toggle-mermaid-btn'].addEventListener('click', function () {
      const drawer = dom['aaa-mermaid-drawer'];
      const isHidden = drawer.hasAttribute('hidden');
      if (isHidden) {
        drawer.removeAttribute('hidden');
        dom['aaa-toggle-mermaid-btn'].setAttribute('aria-expanded', 'true');
      } else {
        drawer.setAttribute('hidden', '');
        dom['aaa-toggle-mermaid-btn'].setAttribute('aria-expanded', 'false');
      }
    });

    // Checklist toggles
    dom['aaa-checklist-list'].addEventListener('change', function (e) {
      const cb = e.target.closest('input[type="checkbox"]');
      if (!cb || !lastEvaluation) return;
      const gateId = cb.getAttribute('data-gate-id');
      if (cb.checked) checkedGates.add(gateId);
      else checkedGates.delete(gateId);
      const row = cb.closest('.aaa-check-row');
      if (row) row.classList.toggle('checked', cb.checked);
      updateChecklistProgress(lastEvaluation.checklist);
      renderAdr(lastEvaluation);
    });

    dom['aaa-checklist-reset-btn'].addEventListener('click', function () {
      checkedGates.clear();
      if (lastEvaluation) {
        renderChecklist(lastEvaluation);
        renderAdr(lastEvaluation);
      }
    });

    // ADR View Tabs
    function setAdrTab(mode) {
      const isPreview = mode === 'rendered';
      dom['aaa-adr-tab-rendered'].classList.toggle('active', isPreview);
      dom['aaa-adr-tab-rendered'].setAttribute('aria-selected', isPreview ? 'true' : 'false');
      dom['aaa-adr-tab-markdown'].classList.toggle('active', !isPreview);
      dom['aaa-adr-tab-markdown'].setAttribute('aria-selected', isPreview ? 'false' : 'true');
      if (isPreview) {
        dom['aaa-adr-rendered'].removeAttribute('hidden');
        dom['aaa-adr-markdown'].setAttribute('hidden', '');
      } else {
        dom['aaa-adr-rendered'].setAttribute('hidden', '');
        dom['aaa-adr-markdown'].removeAttribute('hidden');
      }
    }

    dom['aaa-adr-tab-rendered'].addEventListener('click', function () { setAdrTab('rendered'); });
    dom['aaa-adr-tab-markdown'].addEventListener('click', function () { setAdrTab('markdown'); });

    // Copy ADR Markdown
    dom['aaa-copy-adr-btn'].addEventListener('click', function () {
      if (!lastEvaluation) return;
      const adr = buildAdrData(currentState, lastEvaluation);
      copyText(adr.markdown, dom['aaa-copy-adr-btn'], 'ADR Copied');
    });

    // Download .md
    dom['aaa-download-md-btn'].addEventListener('click', function () {
      if (!lastEvaluation) return;
      const adr = buildAdrData(currentState, lastEvaluation);
      const filename = 'adr-001-' + slugify(adr.projectName) + '.md';
      downloadFile(adr.markdown, filename, 'text/markdown;charset=utf-8');
      flashButton(dom['aaa-download-md-btn'], 'Downloaded .md');
    });

    // Copy Shareable URL (both top and ADR buttons)
    function handleCopyUrl(btn) {
      const shareUrl = buildShareableUrl();
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', shareUrl);
      }
      copyText(shareUrl, btn, 'URL Copied');
    }

    dom['aaa-copy-url-btn'].addEventListener('click', function () { handleCopyUrl(dom['aaa-copy-url-btn']); });
    dom['aaa-copy-url-top-btn'].addEventListener('click', function () { handleCopyUrl(dom['aaa-copy-url-top-btn']); });

    // Print / Save PDF
    dom['aaa-print-btn'].addEventListener('click', function () {
      window.print();
    });

    // Back-to-top button
    const btt = dom['back-to-top'];
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
    cacheDom();
    loadStateFromUrl();
    syncFormFromState();
    bindEvents();
    updateAll(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
