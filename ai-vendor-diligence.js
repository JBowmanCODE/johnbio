(function () {
  'use strict';

  /* ── DATA MODEL: 5 PILLARS & 25 WEIGHTED CHECKS (20 PTS EACH = 100 TOTAL) ── */
  const PILLARS = [
    { id: 'data_privacy', name: 'Data & Privacy', shortName: 'Data & Privacy', color: '#00eefc', maxPoints: 20 },
    { id: 'model_arch', name: 'Model & Architecture', shortName: 'Model & Arch', color: '#FF007F', maxPoints: 20 },
    { id: 'governance', name: 'Governance & Compliance', shortName: 'Governance', color: '#a855f7', maxPoints: 20, raiLink: true },
    { id: 'commercial', name: 'Commercial & Exit', shortName: 'Commercial', color: '#f59e0b', maxPoints: 20 },
    { id: 'operational', name: 'Operational Fit', shortName: 'Operations', color: '#22c55e', maxPoints: 20 }
  ];

  const CHECKS = [
    // Pillar 1: Data & Privacy (5 + 5 + 4 + 3 + 3 = 20)
    {
      id: 'dp_zdr',
      pillar: 'data_privacy',
      name: 'Zero Data Retention (ZDR)',
      weight: 5,
      blocker: true,
      desc: 'Prompts, uploaded files, and outputs are not stored on vendor or upstream LLM servers past transient inference.',
      rfpQuestion: 'Confirm in writing whether customer prompts, RAG chunks, or outputs are retained after inference, and confirm your upstream model provider has Zero Data Retention active on our tenant.',
      blockerWhy: 'Uncontrolled prompt retention leaks customer records and trade secrets into upstream abuse-monitoring queues.',
      founderEvidence: 'Signed Zero Data Retention confirmation from your upstream model provider plus a data-flow diagram showing transient memory handling.'
    },
    {
      id: 'dp_training',
      pillar: 'data_privacy',
      name: 'Contractual Training Opt-Out',
      weight: 5,
      blocker: true,
      desc: 'Binding contract clause barring use of customer inputs, outputs, feedback, or derived embeddings to train or improve models.',
      rfpQuestion: 'Point us to the exact MSA or DPA clause prohibiting the use of our inputs, outputs, thumbs-up/down telemetry, and anonymised derivatives to train or improve any model.',
      blockerWhy: 'A vague "improve our services" clause lets vendors train future models on regulated customer data and proprietary workflows.',
      founderEvidence: 'Explicit MSA and DPA non-training clause covering inputs, outputs, telemetry, and derived embeddings with no "aggregated service improvement" carve-out.'
    },
    {
      id: 'dp_residency',
      pillar: 'data_privacy',
      name: 'UK/EU Data Residency',
      weight: 4,
      blocker: false,
      desc: 'Inference, vector storage, and backups stay pinned to UK or EEA regions with written protection against silent cross-border routing.',
      rfpQuestion: 'Which exact cloud regions handle inference, embeddings, and backups, and does failover ever route payloads outside the UK or EEA?',
      blockerWhy: 'Silent US failover triggers unlawful international data transfers under UK GDPR and EU GDPR.',
      founderEvidence: 'Cloud region pinning configuration (e.g. AWS eu-west-2 or Azure UK South) and failover residency commitment.'
    },
    {
      id: 'dp_pii',
      pillar: 'data_privacy',
      name: 'PII Detection & Redaction',
      weight: 3,
      blocker: false,
      desc: 'Automated pre-inference masking or configurable DLP controls for personal, financial, and special-category data.',
      rfpQuestion: 'What automated PII detection and redaction controls run before payloads hit the model, and can we define custom regex or entity rules?',
      blockerWhy: 'Staff will paste names, account numbers, and ID documents into chat interfaces regardless of policy reminders.',
      founderEvidence: 'DLP/PII redaction pipeline specification with sample masked logs and custom entity configuration.'
    },
    {
      id: 'dp_subprocessors',
      pillar: 'data_privacy',
      name: 'Sub-Processor Transparency',
      weight: 3,
      blocker: false,
      desc: 'Public list of every foundation model and cloud sub-processor with 30-day advance notice and a contractual right to object.',
      rfpQuestion: 'Provide your current sub-processor register including all model APIs and orchestration tools, plus your notice window and objection right before adding new ones.',
      blockerWhy: 'Undisclosed AI sub-processors break GDPR processor chains and hide shadow routing to lower-tier model providers.',
      founderEvidence: 'Live public sub-processor page with RSS/email change notification and a 30-day objection clause in your DPA.'
    },

    // Pillar 2: Model & Architecture (4 + 4 + 4 + 4 + 4 = 20)
    {
      id: 'ma_portability',
      pillar: 'model_arch',
      name: 'Model Portability & No Lock-In',
      weight: 4,
      blocker: false,
      desc: 'Ability to swap underlying foundation models, route across providers, or bring your own API keys without rebuilding workflows.',
      rfpQuestion: 'Can we switch underlying foundation models or connect our own Azure/Bedrock/Vertex keys if pricing, quality, or compliance requirements change?',
      blockerWhy: 'Single-model lock-in leaves you exposed to price hikes, regional outages, and sudden policy shifts.',
      founderEvidence: 'Architecture summary showing model-abstraction layer and BYO-key or multi-provider routing support.'
    },
    {
      id: 'ma_versioning',
      pillar: 'model_arch',
      name: 'Version Pinning & Deprecation Notice',
      weight: 4,
      blocker: false,
      desc: 'Exact model snapshot pinning with at least 60-90 days written notice before forced upgrades or model retirements.',
      rfpQuestion: 'Can we pin production workflows to a specific model snapshot, and what written notice do you guarantee before modifying system prompts or retiring a model?',
      blockerWhy: 'Silent model swaps break validated outputs, change tone, and invalidate regulated QA sign-offs overnight.',
      founderEvidence: 'Written model lifecycle and deprecation policy committing to version pinning and 60+ days migration notice.'
    },
    {
      id: 'ma_evals',
      pillar: 'model_arch',
      name: 'Eval & Accuracy Benchmarks',
      weight: 4,
      blocker: false,
      desc: 'Reproducible domain benchmarks rather than cherry-picked sales demos, plus support for running customer gold test sets.',
      rfpQuestion: 'Share your latest reproducible accuracy, precision, and refusal benchmarks on realistic noisy inputs, and explain how we can run our own evaluation set before launch.',
      blockerWhy: 'Buying off a scripted demo hides high error rates on edge-case documents, tables, and real customer jargon.',
      founderEvidence: 'Benchmark report detailing methodology, failure modes, and a repeatable customer evaluation suite.'
    },
    {
      id: 'ma_hallucination',
      pillar: 'model_arch',
      name: 'Hallucination & Citation Controls',
      weight: 4,
      blocker: false,
      desc: 'Strict grounding via inline source citations, confidence thresholds, or explicit refusal behaviour when evidence is missing.',
      rfpQuestion: 'How does the product enforce source grounding, surface inline citations to original documents, and refuse to answer when source context is absent?',
      blockerWhy: 'Ungrounded answers create regulatory misrepresentation risk when staff rely on fabricated policy or contract details.',
      founderEvidence: 'Grounding architecture note demonstrating citation links, abstention rates, and hallucination guardrails.'
    },
    {
      id: 'ma_fallback',
      pillar: 'model_arch',
      name: 'Fallback Routing & Uptime SLA',
      weight: 4,
      blocker: false,
      desc: 'Multi-region failover or secondary model routing backed by a documented uptime SLA (99.5% or higher).',
      rfpQuestion: 'What happens to our workflows if your primary model API degrades or goes offline, and what contractual uptime SLA applies to AI endpoints specifically?',
      blockerWhy: 'Many SaaS vendors exclude upstream LLM outages from their SLA, leaving core operations down with zero recourse.',
      founderEvidence: 'Published status page history, failover runbook, and an SLA that explicitly covers AI inference availability.'
    },

    // Pillar 3: Governance & Compliance (4 + 4 + 4 + 4 + 4 = 20)
    {
      id: 'gc_eu_ai_act',
      pillar: 'governance',
      name: 'EU AI Act Risk Class & Art. 50 Transparency',
      weight: 4,
      blocker: false,
      desc: 'Written EU AI Act risk classification, user disclosure for AI interactions or synthetic content, and deployer documentation.',
      rfpQuestion: 'Provide your written EU AI Act risk-tier assessment for this product, how you handle Article 50 user disclosures, and what deployer technical documentation you supply.',
      blockerWhy: 'Deployers carry statutory obligations under the EU AI Act; buying an undocumented black box pushes liability onto your team.',
      founderEvidence: 'EU AI Act compliance memo covering risk classification, Article 50 transparency hooks, and deployer instructions.'
    },
    {
      id: 'gc_dpa_sccs',
      pillar: 'governance',
      name: 'UK GDPR DPA, IDTA & SCCs',
      weight: 4,
      blocker: true,
      desc: 'Countersigned Data Processing Agreement incorporating UK IDTA / Addendum and EU Standard Contractual Clauses where relevant.',
      rfpQuestion: 'Will you execute a UK GDPR-compliant DPA including the UK International Data Transfer Addendum or EU SCCs, with clear controller/processor boundaries?',
      blockerWhy: 'Processing personal data through a vendor without a signed DPA breaches UK GDPR Article 28 on day one.',
      founderEvidence: 'Pre-signed, lawyer-reviewed UK/EU DPA with UK IDTA and EU SCCs ready for immediate countersignature.'
    },
    {
      id: 'gc_certs',
      pillar: 'governance',
      name: 'SOC 2 Type II / ISO 27001 / ISO 42001',
      weight: 4,
      blocker: false,
      desc: 'Current independent third-party audit report (plus AI management certification where applicable), not just a self-completed form.',
      rfpQuestion: 'Share your latest independent SOC 2 Type II report (with bridge letter if needed), ISO 27001 certificate, or ISO/IEC 42001 AI management status plus recent pen-test summary.',
      blockerWhy: 'Self-attestation questionnaires rarely survive enterprise infosec or regulator scrutiny after a breach.',
      founderEvidence: 'Current SOC 2 Type II or ISO 27001 certificate, annual penetration test executive summary, and ISO 42001 roadmap.'
    },
    {
      id: 'gc_audit_logs',
      pillar: 'governance',
      name: 'Audit Logs & Prompt/Response Traceability',
      weight: 4,
      blocker: true,
      desc: 'Immutable, exportable logs recording user ID, timestamp, model snapshot, prompt/context reference, and output for regulator audits.',
      rfpQuestion: 'Can our compliance team export immutable audit logs mapping each user query, model version, retrieved sources, and output to our SIEM, with configurable retention?',
      blockerWhy: 'In regulated industries, if you cannot reconstruct why an AI gave a specific answer six months later, you fail the audit.',
      founderEvidence: 'Audit log schema sample, SIEM export documentation (JSON/CSV/webhook), and configurable retention controls.'
    },
    {
      id: 'gc_killswitch',
      pillar: 'governance',
      name: 'Human Override & Instant Kill-Switch',
      weight: 4,
      blocker: true,
      desc: 'Ability to enforce human approval before external actions and disable the AI feature immediately if outputs drift.',
      rfpQuestion: 'Can admins disable autonomous actions or turn off AI generation globally within seconds while preserving access to underlying non-AI records?',
      blockerWhy: 'An AI workflow that keeps firing bad messages or decisions during a drift incident turns a bug into a reportable event.',
      founderEvidence: 'Admin control screenshot and runbook proving instant feature kill-switch and human-in-the-loop approval gates.'
    },

    // Pillar 4: Commercial & Exit (4 + 5 + 4 + 3 + 4 = 20)
    {
      id: 'ce_pricing',
      pillar: 'commercial',
      name: 'Predictable Pricing & Token-Overage Caps',
      weight: 4,
      blocker: false,
      desc: 'Hard spend ceilings, clear token or credit metering, and zero silent auto-upgrades when staff usage spikes.',
      rfpQuestion: 'Show exactly how token or credit consumption is metered, whether we can set hard monthly spend caps, and what happens if a runaway agent burns through our allowance.',
      blockerWhy: 'Uncapped per-token or per-resolution billing creates five-figure surprise invoices when adoption scales.',
      founderEvidence: 'Transparent pricing schedule with hard budget limits, usage alerts, and clear overage mechanics.'
    },
    {
      id: 'ce_export',
      pillar: 'commercial',
      name: 'Data, Prompt & Fine-Tune Export Rights on Exit',
      weight: 5,
      blocker: true,
      desc: 'Contractual right to export all customer data, prompt libraries, eval sets, and custom adapters/weights in open formats within 30 days of exit.',
      rfpQuestion: 'On termination or non-renewal, confirm we can export all customer records, prompt templates, evaluation sets, and custom fine-tunes in open formats, followed by certified deletion.',
      blockerWhy: 'Trapping institutional prompts, RAG indexes, and fine-tunes inside a vendor makes switching almost impossible at renewal.',
      founderEvidence: 'Contractual exit-assistance clause plus documented self-serve export in JSON/CSV/open weights and deletion certificate.'
    },
    {
      id: 'ce_indemnity',
      pillar: 'commercial',
      name: 'IP Indemnity on AI Outputs',
      weight: 4,
      blocker: false,
      desc: 'Vendor defends third-party copyright and IP claims arising from standard use of AI outputs without hollow cap exclusions.',
      rfpQuestion: 'Do you provide uncapped or meaningfully capped IP indemnification for third-party copyright claims on AI outputs, and what conditions void that cover?',
      blockerWhy: 'Many AI addenda shift 100% of IP infringement liability back onto the customer while still charging enterprise seat rates.',
      founderEvidence: 'IP indemnity clause aligned with enterprise SaaS norms, clearly stating customer responsibilities and liability cap.'
    },
    {
      id: 'ce_sla_credits',
      pillar: 'commercial',
      name: 'Enforceable SLA Credits & Termination Rights',
      weight: 3,
      blocker: false,
      desc: 'Automatic or straightforward service credits for missed uptime/latency targets plus penalty-free exit on chronic SLA failures.',
      rfpQuestion: 'What service credits apply when uptime or latency targets are missed, and after how many consecutive missed months can we terminate without penalty?',
      blockerWhy: 'An SLA with no chronic-breach exit clause forces you to keep paying for an unreliable tool all year.',
      founderEvidence: 'SLA schedule defining uptime/latency thresholds, credit tiers, and a chronic-failure termination right.'
    },
    {
      id: 'ce_pov_exit',
      pillar: 'commercial',
      name: 'Proof-of-Value Exit Clause',
      weight: 4,
      blocker: false,
      desc: 'Defined 30-90 day pilot success metrics with a clean break clause before committing to a multi-year enterprise contract.',
      rfpQuestion: 'Will you structure a 60-to-90-day proof-of-value phase with written accuracy and adoption criteria and a clean opt-out before annual lock-in?',
      blockerWhy: 'Signing a 24-month enterprise deal before testing on messy production data is the fastest way to buy shelfware.',
      founderEvidence: 'Standard 60-day paid pilot order form with mutual success criteria and clean opt-out or auto-conversion terms.'
    },

    // Pillar 5: Operational Fit (5 + 3 + 4 + 4 + 4 = 20)
    {
      id: 'of_sso_rbac',
      pillar: 'operational',
      name: 'SSO/SAML, RBAC & Tenant Isolation',
      weight: 5,
      blocker: true,
      desc: 'Enterprise SAML/OIDC single sign-on, granular role-based permissions, and strict logical isolation between customer tenants.',
      rfpQuestion: 'Do you support SAML 2.0/OIDC SSO, SCIM deprovisioning, granular RBAC, and isolated vector namespaces so zero data can bleed across tenants or internal teams?',
      blockerWhy: 'Shared vector indexes or missing SSO/SCIM deprovisioning lead directly to cross-department or ex-employee data leaks.',
      founderEvidence: 'SSO/SCIM integration guide, RBAC permission matrix, and tenant-isolation architecture note.'
    },
    {
      id: 'of_analytics',
      pillar: 'operational',
      name: 'Admin Usage & Adoption Analytics',
      weight: 3,
      blocker: false,
      desc: 'Admin dashboard tracking active users, spend by team, latency, failure rates, and feature adoption.',
      rfpQuestion: 'What admin analytics are included out of the box so our enablement team can track active users, department spend, and unused licences?',
      blockerWhy: 'Without real usage telemetry, Heads of AI cannot prove ROI or reclaim idle seats at renewal.',
      founderEvidence: 'Admin analytics overview showing active seats, query volume, cost per team, and CSV export.'
    },
    {
      id: 'of_rate_limits',
      pillar: 'operational',
      name: 'Rate-Limit & Throughput Transparency',
      weight: 4,
      blocker: false,
      desc: 'Documented tokens-per-minute and requests-per-minute allocations, not undocumented shared noisy-neighbour pools.',
      rfpQuestion: 'What exact RPM and TPM limits apply to our tenant, can we burst during peak business hours, and is capacity isolated from other customers?',
      blockerWhy: 'Hidden throttling causes silent timeouts during month-end peaks or live customer support surges.',
      founderEvidence: 'Published rate-limit tiers, burst policy, and dedicated throughput upgrade options.'
    },
    {
      id: 'of_sandbox',
      pillar: 'operational',
      name: 'Isolated Sandbox & Staging Environment',
      weight: 4,
      blocker: false,
      desc: 'Separate non-production environment for testing prompt revisions, new model versions, and integrations safely.',
      rfpQuestion: 'Is a separate sandbox or staging tenant included at no extra cost so we can validate prompt changes and model updates before releasing to staff?',
      blockerWhy: 'Testing prompt changes directly in production breaks live customer workflows and pollutes audit trails.',
      founderEvidence: 'Staging tenant specification with separate API keys, data stores, and promotion workflow.'
    },
    {
      id: 'of_incident',
      pillar: 'operational',
      name: 'Security & AI Incident Response SLA',
      weight: 4,
      blocker: false,
      desc: 'Committed breach and AI safety incident notification windows (24-72 hours) with named escalation contacts.',
      rfpQuestion: 'What is your contractual notification window for data breaches and material AI safety incidents, and who is our named escalation contact?',
      blockerWhy: 'UK GDPR gives controllers 72 hours to notify the ICO; a vendor that takes five days to disclose a breach leaves you exposed.',
      founderEvidence: 'Incident response SLA committing to 24-48 hour breach notification and a named security escalation path.'
    }
  ];

  const CHECK_BY_ID = Object.fromEntries(CHECKS.map(function (c) { return [c.id, c]; }));
  const PILLAR_BY_ID = Object.fromEntries(PILLARS.map(function (p) { return [p.id, p]; }));

  const VENDOR_COLORS = ['#00eefc', '#FF007F', '#22c55e'];

  const RATING_META = {
    pass: { label: 'Pass', fullLabel: 'Pass / Verified', mult: 1 },
    partial: { label: 'Partial', fullLabel: 'Partial / Caveated', mult: 0.5 },
    fail: { label: 'Fail', fullLabel: 'Fail / Missing', mult: 0 },
    unknown: { label: 'Unknown', fullLabel: 'Unknown / Unanswered', mult: 0 }
  };

  /* ── REALISTIC PRESETS ── */
  const PRESETS = {
    wrapper: {
      name: 'Thin-Wrapper SaaS Startup',
      ratings: {
        dp_zdr: 'fail', dp_training: 'fail', dp_residency: 'fail', dp_pii: 'partial', dp_subprocessors: 'unknown',
        ma_portability: 'fail', ma_versioning: 'fail', ma_evals: 'unknown', ma_hallucination: 'partial', ma_fallback: 'fail',
        gc_eu_ai_act: 'unknown', gc_dpa_sccs: 'partial', gc_certs: 'fail', gc_audit_logs: 'fail', gc_killswitch: 'partial',
        ce_pricing: 'partial', ce_export: 'fail', ce_indemnity: 'fail', ce_sla_credits: 'fail', ce_pov_exit: 'pass',
        of_sso_rbac: 'partial', of_analytics: 'pass', of_rate_limits: 'unknown', of_sandbox: 'fail', of_incident: 'unknown'
      },
      notes: {
        dp_training: 'Terms allow "anonymised data to improve our models"',
        dp_zdr: '30-day prompt retention for quality review',
        gc_audit_logs: 'Only basic chat history, no immutable SIEM export',
        ce_export: 'No prompt library or custom workflow export on exit'
      }
    },
    incumbent: {
      name: 'Enterprise Incumbent Copilot',
      ratings: {
        dp_zdr: 'pass', dp_training: 'pass', dp_residency: 'pass', dp_pii: 'pass', dp_subprocessors: 'pass',
        ma_portability: 'fail', ma_versioning: 'partial', ma_evals: 'partial', ma_hallucination: 'partial', ma_fallback: 'pass',
        gc_eu_ai_act: 'pass', gc_dpa_sccs: 'pass', gc_certs: 'pass', gc_audit_logs: 'pass', gc_killswitch: 'pass',
        ce_pricing: 'partial', ce_export: 'partial', ce_indemnity: 'pass', ce_sla_credits: 'partial', ce_pov_exit: 'fail',
        of_sso_rbac: 'pass', of_analytics: 'pass', of_rate_limits: 'partial', of_sandbox: 'pass', of_incident: 'pass'
      },
      notes: {
        ma_portability: 'Locked to vendor proprietary model stack',
        ce_export: 'Raw documents exportable; custom agent configs and prompts locked in',
        ce_pov_exit: 'Demands 12-month minimum commitment with no pilot break clause'
      }
    },
    openweight: {
      name: 'Self-Hosted Open-Weight Vendor',
      ratings: {
        dp_zdr: 'pass', dp_training: 'pass', dp_residency: 'pass', dp_pii: 'partial', dp_subprocessors: 'pass',
        ma_portability: 'pass', ma_versioning: 'pass', ma_evals: 'partial', ma_hallucination: 'pass', ma_fallback: 'pass',
        gc_eu_ai_act: 'partial', gc_dpa_sccs: 'pass', gc_certs: 'pass', gc_audit_logs: 'pass', gc_killswitch: 'pass',
        ce_pricing: 'pass', ce_export: 'pass', ce_indemnity: 'partial', ce_sla_credits: 'pass', ce_pov_exit: 'pass',
        of_sso_rbac: 'pass', of_analytics: 'partial', of_rate_limits: 'pass', of_sandbox: 'pass', of_incident: 'unknown'
      },
      notes: {
        dp_zdr: 'Deployed inside our VPC; zero egress',
        ma_portability: 'Supports Llama, Mistral, and BYO Bedrock keys',
        of_incident: 'Awaiting written 24-hour notification SLA in contract'
      }
    },
    founder_seed: {
      name: 'VerityFlow AI (Seed Stage)',
      ratings: {
        dp_zdr: 'partial', dp_training: 'pass', dp_residency: 'pass', dp_pii: 'fail', dp_subprocessors: 'partial',
        ma_portability: 'pass', ma_versioning: 'partial', ma_evals: 'partial', ma_hallucination: 'pass', ma_fallback: 'partial',
        gc_eu_ai_act: 'unknown', gc_dpa_sccs: 'partial', gc_certs: 'fail', gc_audit_logs: 'fail', gc_killswitch: 'pass',
        ce_pricing: 'pass', ce_export: 'partial', ce_indemnity: 'fail', ce_sla_credits: 'partial', ce_pov_exit: 'pass',
        of_sso_rbac: 'fail', of_analytics: 'partial', of_rate_limits: 'partial', of_sandbox: 'pass', of_incident: 'unknown'
      },
      notes: {
        gc_certs: 'SOC 2 Type I scheduled for Q3; pen-test complete',
        of_sso_rbac: 'Google OAuth live; SAML 2.0 on next sprint'
      }
    },
    founder_enterprise: {
      name: 'VerityFlow AI (Enterprise Ready)',
      ratings: {
        dp_zdr: 'pass', dp_training: 'pass', dp_residency: 'pass', dp_pii: 'pass', dp_subprocessors: 'pass',
        ma_portability: 'pass', ma_versioning: 'pass', ma_evals: 'pass', ma_hallucination: 'pass', ma_fallback: 'pass',
        gc_eu_ai_act: 'pass', gc_dpa_sccs: 'pass', gc_certs: 'pass', gc_audit_logs: 'pass', gc_killswitch: 'pass',
        ce_pricing: 'pass', ce_export: 'pass', ce_indemnity: 'partial', ce_sla_credits: 'pass', ce_pov_exit: 'pass',
        of_sso_rbac: 'pass', of_analytics: 'pass', of_rate_limits: 'pass', of_sandbox: 'pass', of_incident: 'pass'
      },
      notes: {
        ce_indemnity: 'IP indemnity capped at 2x annual fees; uncapped available on Enterprise+ tier'
      }
    }
  };

  /* ── LOCAL CLIENT-SIDE TERMS RED-FLAG RULES ── */
  const SAMPLE_RISKY_TERMS = [
    'AI SERVICES ADDENDUM (SAMPLE RISKY VENDOR TERMS)',
    '',
    '1. Customer Content & Service Improvement. Customer grants Vendor a worldwide, perpetual, irrevocable, royalty-free licence to host, reproduce, modify, and use Customer Prompts, Outputs, and usage insights to provide, maintain, and improve our models and AI services. Vendor may also retain anonymised and aggregated derivative data indefinitely for product analytics and machine learning model development.',
    '',
    '2. Data Retention & Third-Party AI Providers. To support trust, safety, and quality monitoring, prompts and model outputs may be stored for up to 180 days on Vendor systems or transferred to the United States and other global infrastructure operated by third-party AI providers. Vendor reserves the right to change sub-processors at any time without prior notice.',
    '',
    '3. Model Updates & No Accuracy Warranty. All AI outputs are provided "as-is" without warranty of accuracy, reliability, or fitness for a particular purpose. Customer is solely responsible for verifying outputs against hallucinations or errors. Vendor may modify, swap, or deprecate underlying models at any time at its sole discretion without prior notice.',
    '',
    '4. Liability, Indemnity & Billing. Vendor does not indemnify Customer against intellectual property or copyright claims arising from AI outputs. Vendor\'s aggregate liability under this Addendum is capped at fees paid in the preceding three months. Subscriptions auto-renew annually for 12-month terms, and excess usage will incur automatic overage fees at Vendor\'s then-current token rates.'
  ].join('\n');

  const CLAUSE_RULES = [
    {
      id: 'rule_training',
      title: 'Model Training / "Improve Our Models" Loophole',
      severity: 'high',
      patterns: [
        /\b(improve|enhance|develop|train|fine[- ]?tune)\s+(our|the|vendor'?s)?\s*(ai\s+)?(models?|algorithms?|machine learning|ai services?)\b/gi,
        /\bmachine learning model development\b/gi
      ],
      explanation: 'Gives the vendor permission to train or improve models using your inputs, outputs, or workflow feedback.',
      checkId: 'dp_training',
      suggestedRating: 'fail',
      emailQuestion: 'Remove all language permitting use of Customer prompts, outputs, or telemetry to "improve our models" or for "machine learning model development", and confirm a strict contractual training opt-out.'
    },
    {
      id: 'rule_licence_back',
      title: 'Broad Perpetual / Royalty-Free Licence-Back',
      severity: 'high',
      patterns: [
        /\b(worldwide,?\s+)?perpetual,?\s+irrevocable,?\s+royalty[- ]?free\s+licen[cs]e\b/gi,
        /\bright to (host,?\s+)?reproduce,?\s+modify,?\s+and\s+use\s+customer\b/gi
      ],
      explanation: 'Perpetual, irrevocable licences over customer prompts and outputs survive termination and undercut your data ownership and exit rights.',
      checkId: 'ce_export',
      suggestedRating: 'fail',
      emailQuestion: 'Restrict the licence to Customer Content strictly to the term of the agreement and solely for delivering the contracted service, with certified deletion on exit.'
    },
    {
      id: 'rule_anonymised',
      title: 'Anonymised / Aggregated Derivative Loophole',
      severity: 'high',
      patterns: [
        /\b(anonymi[sz]ed|de[- ]?identified|aggregated)\s+(and\s+)?(aggregated\s+)?(derivative\s+)?(data|outputs?|prompts?|insights?)\b/gi,
        /\bderivative data\b/gi
      ],
      explanation: 'Vendors routinely use "anonymised derivatives" as a back door to retain commercial insights or train models after promising not to train on raw prompts.',
      checkId: 'dp_training',
      suggestedRating: 'partial',
      emailQuestion: 'Clarify that "anonymised or aggregated derivative data" is restricted to operational telemetry (e.g. latency and error counts) and excludes prompt text, embeddings, or model training.'
    },
    {
      id: 'rule_retention',
      title: 'Extended Prompt Retention (No Zero Data Retention)',
      severity: 'high',
      patterns: [
        /\b(stored|retained|retain)\s+(for\s+)?(up\s+to\s+)?\d+\s*(days?|months?|years?)\b/gi,
        /\bretain[^.]{0,60}\bindefinitely\b/gi,
        /\b(trust,?\s+safety,?\s+and\s+quality|abuse)\s+monitoring\b/gi
      ],
      explanation: 'Retaining prompts for 30-180 days or indefinitely for monitoring contradicts Zero Data Retention and expands breach blast radius.',
      checkId: 'dp_zdr',
      suggestedRating: 'fail',
      emailQuestion: 'Confirm Zero Data Retention (ZDR) is enabled across both your application tier and upstream LLM providers, with zero multi-day prompt retention for safety or quality monitoring.'
    },
    {
      id: 'rule_subprocessors',
      title: 'Unrestricted Third-Party AI Sub-Processors',
      severity: 'high',
      patterns: [
        /\bchange\s+sub[- ]?processors?\s+at\s+any\s+time\b/gi,
        /\bthird[- ]?party\s+ai\s+providers?\b/gi,
        /\bsub[- ]?processors?\s+without\s+prior\s+notice\b/gi
      ],
      explanation: 'Allows silent routing of sensitive data to new foundation model APIs without notice or GDPR objection rights.',
      checkId: 'dp_subprocessors',
      suggestedRating: 'fail',
      emailQuestion: 'Name every upstream third-party AI provider in your DPA sub-processor list and commit to 30 days written advance notice with a right to object before any change.'
    },
    {
      id: 'rule_residency',
      title: 'Cross-Border / Global Data Transfer Exposure',
      severity: 'med',
      patterns: [
        /\btransferred\s+to\s+the\s+united\s+states\b/gi,
        /\bglobal\s+infrastructure\b/gi,
        /\boutside\s+the\s+(uk|eea|eu)\b/gi,
        /\banywhere\s+we\s+or\s+our\s+affiliates\s+operate\b/gi
      ],
      explanation: 'Broad global transfer clauses undermine UK/EU data residency guarantees and require full UK IDTA / EU SCC transfer impact assessments.',
      checkId: 'dp_residency',
      suggestedRating: 'partial',
      emailQuestion: 'Confirm whether UK/EEA data residency pinning is contractually available so inference and storage do not transit US or global infrastructure.'
    },
    {
      id: 'rule_unilateral_model',
      title: 'Unilateral Model Changes & Silent Deprecation',
      severity: 'high',
      patterns: [
        /\b(modify|swap|replace|change|deprecate)\s+(underlying\s+)?models?\s+at\s+any\s+time\b/gi,
        /\bmodify,?\s+swap,?\s+or\s+deprecate\b/gi,
        /\bat\s+its\s+sole\s+discretion\s+without\s+prior\s+notice\b/gi
      ],
      explanation: 'Silent model swaps invalidate QA sign-offs, break structured JSON outputs, and cause sudden accuracy regressions.',
      checkId: 'ma_versioning',
      suggestedRating: 'fail',
      emailQuestion: 'Commit to model snapshot pinning in production and provide at least 60-90 days written notice before deprecating or swapping underlying models.'
    },
    {
      id: 'rule_as_is',
      title: 'As-Is / Zero Accuracy Warranty Disclaimer',
      severity: 'med',
      patterns: [
        /\bprovided\s+["']?as[- ]?is["']?\b/gi,
        /\bwithout\s+warranty\s+of\s+accuracy\b/gi,
        /\bsolely\s+responsible\s+for\s+verifying\s+outputs\b/gi
      ],
      explanation: 'Standard boilerplate in consumer AI, but enterprise contracts should still commit to defined evaluation baselines and grounding controls.',
      checkId: 'ma_hallucination',
      suggestedRating: 'partial',
      emailQuestion: 'Alongside standard warranty disclaimers, share your documented grounding/citation controls and agree pilot accuracy benchmarks prior to annual commitment.'
    },
    {
      id: 'rule_indemnity',
      title: 'IP Indemnity Exclusion & Aggressive Liability Cap',
      severity: 'high',
      patterns: [
        /\b(does\s+not|will\s+not|no)\s+indemnif(y|ication)\b/gi,
        /\bexcludes?\s+intellectual\s+property\b/gi,
        /\b(aggregate\s+)?liability[^.]{0,50}(three\s+months|3\s+months|one\s+month|1\s+month)\b/gi
      ],
      explanation: 'Refusing IP indemnity on AI outputs and capping liability at 3 months of fees shifts disproportionate legal exposure onto the buyer.',
      checkId: 'ce_indemnity',
      suggestedRating: 'fail',
      emailQuestion: 'Provide enterprise IP indemnification for copyright claims arising from standard output use, and align the liability cap to at least 12 months of fees.'
    },
    {
      id: 'rule_commercial_trap',
      title: 'Auto-Renewal & Uncapped Overage Fee Trap',
      severity: 'med',
      patterns: [
        /\bauto[- ]?renew(s|al)?\s+annually\b/gi,
        /\b(automatic\s+)?overage\s+fees?\b/gi,
        /\bexcess\s+usage\b/gi
      ],
      explanation: 'Auto-renewals paired with uncapped token overages create painful renewal traps and unpredictable bills.',
      checkId: 'ce_pricing',
      suggestedRating: 'partial',
      emailQuestion: 'Replace automatic token overage charges with configurable hard spend caps and remove silent annual auto-renewal clauses.'
    },
    {
      id: 'rule_positive_zdr',
      title: 'Positive Signal: Zero Data Retention / Non-Training Stated',
      severity: 'good',
      patterns: [
        /\bzero\s+data\s+retention\b/gi,
        /\b(will|do|does)\s+not\s+(use\s+customer\s+\w+\s+to\s+)?train\b/gi,
        /\bnever\s+train\b/gi
      ],
      explanation: 'Explicit zero-retention or non-training wording detected. Verify it applies equally to upstream LLM sub-processors.',
      checkId: 'dp_training',
      suggestedRating: 'pass',
      emailQuestion: ''
    },
    {
      id: 'rule_positive_certs',
      title: 'Positive Signal: Independent Security / Compliance Reference',
      severity: 'good',
      patterns: [
        /\bsoc\s*2\s*type\s*(ii|2)\b/gi,
        /\biso(\/iec)?\s*(27001|42001)\b/gi,
        /\b(uk\s+gdpr|standard\s+contractual\s+clauses|uk\s+idta)\b/gi
      ],
      explanation: 'References recognised audit or transfer frameworks. Ask for the current signed certificate or audit report rather than taking marketing copy on trust.',
      checkId: 'gc_certs',
      suggestedRating: 'pass',
      emailQuestion: ''
    }
  ];

  /* ── STATE ── */
  function makeBlankRatings() {
    const out = {};
    CHECKS.forEach(function (c) { out[c.id] = 'unknown'; });
    return out;
  }

  function makeVendorFromPreset(presetKey, customName) {
    const p = PRESETS[presetKey];
    if (!p) {
      return {
        id: 'v_' + Math.random().toString(36).slice(2, 8),
        name: customName || 'New AI Vendor',
        ratings: makeBlankRatings(),
        notes: {}
      };
    }
    return {
      id: 'v_' + Math.random().toString(36).slice(2, 8),
      name: customName || p.name,
      ratings: Object.assign(makeBlankRatings(), p.ratings),
      notes: Object.assign({}, p.notes || {})
    };
  }

  const state = {
    mode: 'buyer', // 'buyer' | 'founder'
    view: 'scorecard', // 'scorecard' | 'scanner'
    layout: 'single', // 'single' | 'matrix'
    filter: 'all', // 'all' | pillarId | 'blockers' | 'gaps'
    activeVendorIdx: 0,
    vendors: [
      makeVendorFromPreset('wrapper'),
      makeVendorFromPreset('incumbent'),
      makeVendorFromPreset('openweight')
    ],
    founder: {
      name: 'VerityFlow AI',
      sector: 'Regulated Enterprise (Finance / iGaming / Legal)',
      hosting: 'AWS Bedrock eu-west-2 (Zero Retention)',
      contact: 'security@verityflow.co.uk',
      ratings: Object.assign(makeBlankRatings(), PRESETS.founder_seed.ratings),
      notes: Object.assign({}, PRESETS.founder_seed.notes)
    },
    rfpScope: 'active',
    rfpSeverity: 'all',
    lastScan: null
  };

  /* ── HELPERS ── */
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getActiveTarget() {
    if (state.mode === 'founder') {
      return {
        name: state.founder.name.trim() || 'Your AI Product',
        ratings: state.founder.ratings,
        notes: state.founder.notes,
        color: '#00eefc'
      };
    }
    const idx = Math.min(state.activeVendorIdx, state.vendors.length - 1);
    const v = state.vendors[idx];
    return {
      name: v.name.trim() || ('Vendor ' + (idx + 1)),
      ratings: v.ratings,
      notes: v.notes,
      color: VENDOR_COLORS[idx % VENDOR_COLORS.length]
    };
  }

  function evaluateProfile(ratings) {
    const pillarScores = {};
    PILLARS.forEach(function (p) { pillarScores[p.id] = 0; });

    let totalRaw = 0;
    const counts = { pass: 0, partial: 0, fail: 0, unknown: 0 };
    const failedBlockers = [];
    const partialBlockers = [];
    const unknownBlockers = [];

    CHECKS.forEach(function (c) {
      const r = ratings[c.id] || 'unknown';
      counts[r] = (counts[r] || 0) + 1;
      const pts = c.weight * (RATING_META[r] ? RATING_META[r].mult : 0);
      pillarScores[c.pillar] += pts;
      totalRaw += pts;

      if (c.blocker) {
        if (r === 'fail') failedBlockers.push(c);
        else if (r === 'partial') partialBlockers.push(c);
        else if (r === 'unknown') unknownBlockers.push(c);
      }
    });

    const score = Math.round(totalRaw);
    let verdictKey = 'approve';
    let verdictLabel = 'Approve';
    let founderVerdictLabel = 'Enterprise Ready';
    let verdictReason = 'Meets procurement thresholds with zero hard blockers.';
    let capped = false;

    if (failedBlockers.length > 0) {
      verdictKey = 'reject';
      verdictLabel = 'Do Not Sign';
      founderVerdictLabel = 'High Procurement Risk';
      capped = score >= 55;
      verdictReason = 'Blocked by ' + failedBlockers.length + ' failed hard deal-blocker' + (failedBlockers.length > 1 ? 's' : '') + ' (' + failedBlockers.map(function (b) { return b.name; }).slice(0, 2).join(', ') + (failedBlockers.length > 2 ? ', +' + (failedBlockers.length - 2) + ' more' : '') + ').';
    } else if (score < 55) {
      verdictKey = 'reject';
      verdictLabel = 'Do Not Sign';
      founderVerdictLabel = 'High Procurement Risk';
      verdictReason = 'Overall trust score is below the 55-point minimum procurement floor.';
    } else if (partialBlockers.length > 0 || unknownBlockers.length > 0) {
      verdictKey = 'conditional';
      verdictLabel = 'Conditional - Fix Blockers';
      founderVerdictLabel = 'Conditional - Close Gaps';
      const totalOpenBlockers = partialBlockers.length + unknownBlockers.length;
      verdictReason = totalOpenBlockers + ' hard deal-blocker' + (totalOpenBlockers > 1 ? 's remain' : ' remains') + ' caveated or unanswered.';
    } else if (score < 75 || counts.unknown > 4) {
      verdictKey = 'conditional';
      verdictLabel = 'Conditional - Fix Blockers';
      founderVerdictLabel = 'Conditional - Close Gaps';
      verdictReason = counts.unknown > 4
        ? counts.unknown + ' checks remain unanswered. Collect written vendor answers before signing.'
        : 'Score sits in the 55-74 amber band. Negotiate contractual remediations first.';
    } else if (counts.fail > 0 || counts.partial > 0 || counts.unknown > 0) {
      verdictKey = 'approve';
      verdictLabel = 'Approve (Minor Follow-Ups)';
      founderVerdictLabel = 'Enterprise Ready';
      verdictReason = 'Zero hard blockers. Resolve ' + (counts.fail + counts.partial + counts.unknown) + ' non-blocking item(s) during onboarding.';
    }

    return {
      score: score,
      pillarScores: pillarScores,
      counts: counts,
      failedBlockers: failedBlockers,
      partialBlockers: partialBlockers,
      unknownBlockers: unknownBlockers,
      verdictKey: verdictKey,
      verdictLabel: verdictLabel,
      founderVerdictLabel: founderVerdictLabel,
      verdictReason: verdictReason,
      capped: capped
    };
  }

  /* ── URL HASH STATE ENCODING / DECODING ── */
  const CODE_MAP = { pass: 'p', partial: 'a', fail: 'f', unknown: 'u' };
  const REV_CODE_MAP = { p: 'pass', a: 'partial', f: 'fail', u: 'unknown' };

  function encodeRatingsStr(ratings) {
    return CHECKS.map(function (c) { return CODE_MAP[ratings[c.id] || 'unknown'] || 'u'; }).join('');
  }

  function decodeRatingsStr(str) {
    const out = makeBlankRatings();
    if (typeof str !== 'string') return out;
    CHECKS.forEach(function (c, i) {
      const ch = str.charAt(i);
      out[c.id] = REV_CODE_MAP[ch] || 'unknown';
    });
    return out;
  }

  function buildShareUrl() {
    const payload = {
      m: state.mode === 'founder' ? 'f' : 'b',
      v: state.vendors.map(function (v) {
        return { n: v.name.slice(0, 60), r: encodeRatingsStr(v.ratings) };
      }),
      f: {
        n: state.founder.name.slice(0, 60),
        s: state.founder.sector.slice(0, 80),
        h: state.founder.hosting.slice(0, 90),
        c: state.founder.contact.slice(0, 80),
        r: encodeRatingsStr(state.founder.ratings)
      }
    };
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const base = window.location.origin + window.location.pathname;
    return base + '#s=' + b64;
  }

  function hydrateFromHash() {
    const hash = window.location.hash || '';
    if (!hash.startsWith('#s=')) return false;
    try {
      let b64 = hash.slice(3).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const parsed = JSON.parse(new TextDecoder().decode(bytes));
      if (parsed && Array.isArray(parsed.v) && parsed.v.length >= 1 && parsed.v.length <= 3) {
        state.vendors = parsed.v.map(function (item, idx) {
          return {
            id: 'v_url_' + idx,
            name: String(item.n || ('Vendor ' + (idx + 1))).slice(0, 60),
            ratings: decodeRatingsStr(item.r),
            notes: {}
          };
        });
        state.activeVendorIdx = 0;
      }
      if (parsed && parsed.f) {
        state.founder.name = String(parsed.f.n || state.founder.name).slice(0, 60);
        state.founder.sector = String(parsed.f.s || state.founder.sector).slice(0, 80);
        state.founder.hosting = String(parsed.f.h || state.founder.hosting).slice(0, 90);
        state.founder.contact = String(parsed.f.c || state.founder.contact).slice(0, 80);
        state.founder.ratings = decodeRatingsStr(parsed.f.r);
      }
      state.mode = parsed.m === 'f' ? 'founder' : 'buyer';
      return true;
    } catch (_e) {
      return false;
    }
  }

  /* ── TOAST NOTIFICATION ── */
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('vd-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('visible');
    }, 3200);
  }

  async function copyText(text, successMsg) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(successMsg);
    } catch (_err) {
      showToast('Clipboard copy failed - please copy manually.');
    }
  }

  /* ── RENDERING: MODE, TABS & CONTROLS ── */
  function renderControls() {
    const isBuyer = state.mode === 'buyer';
    const buyerBtn = document.getElementById('vd-mode-buyer');
    const founderBtn = document.getElementById('vd-mode-founder');
    const buyerBar = document.getElementById('vd-buyer-bar');
    const founderBar = document.getElementById('vd-founder-bar');
    const buyerOutputs = document.getElementById('vd-buyer-outputs');
    const founderOutputs = document.getElementById('vd-founder-outputs');
    const layoutToggle = document.getElementById('vd-layout-toggle');
    const copyMdLabel = document.getElementById('vd-copy-md-label');

    if (buyerBtn) {
      buyerBtn.classList.toggle('active', isBuyer);
      buyerBtn.setAttribute('aria-selected', String(isBuyer));
    }
    if (founderBtn) {
      founderBtn.classList.toggle('active', !isBuyer);
      founderBtn.setAttribute('aria-selected', String(!isBuyer));
    }
    if (buyerBar) buyerBar.hidden = !isBuyer;
    if (founderBar) founderBar.hidden = isBuyer;
    if (buyerOutputs) buyerOutputs.hidden = !isBuyer;
    if (founderOutputs) founderOutputs.hidden = isBuyer;
    if (layoutToggle) layoutToggle.style.display = isBuyer ? 'inline-flex' : 'none';
    if (copyMdLabel) {
      copyMdLabel.textContent = isBuyer ? 'Copy Scorecard & RFP (.md)' : 'Copy Trust One-Pager (.md)';
    }

    // View panels
    const isScorecard = state.view === 'scorecard';
    const viewScBtn = document.getElementById('vd-view-scorecard');
    const viewScanBtn = document.getElementById('vd-view-scanner');
    const panelSc = document.getElementById('vd-panel-scorecard');
    const panelScan = document.getElementById('vd-panel-scanner');
    if (viewScBtn) {
      viewScBtn.classList.toggle('active', isScorecard);
      viewScBtn.setAttribute('aria-selected', String(isScorecard));
    }
    if (viewScanBtn) {
      viewScanBtn.classList.toggle('active', !isScorecard);
      viewScanBtn.setAttribute('aria-selected', String(!isScorecard));
    }
    if (panelSc) panelSc.hidden = !isScorecard;
    if (panelScan) panelScan.hidden = isScorecard;

    // Layout buttons
    const singleBtn = document.getElementById('vd-layout-single');
    const matrixBtn = document.getElementById('vd-layout-matrix');
    const effectiveLayout = isBuyer ? state.layout : 'single';
    if (singleBtn && matrixBtn) {
      singleBtn.classList.toggle('active', effectiveLayout === 'single');
      singleBtn.classList.toggle('vd-btn-secondary', effectiveLayout === 'single');
      singleBtn.classList.toggle('vd-btn-ghost', effectiveLayout !== 'single');
      singleBtn.setAttribute('aria-pressed', String(effectiveLayout === 'single'));

      matrixBtn.classList.toggle('active', effectiveLayout === 'matrix');
      matrixBtn.classList.toggle('vd-btn-secondary', effectiveLayout === 'matrix');
      matrixBtn.classList.toggle('vd-btn-ghost', effectiveLayout !== 'matrix');
      matrixBtn.setAttribute('aria-pressed', String(effectiveLayout === 'matrix'));
    }

    // Buyer vendor tabs
    const tabsWrap = document.getElementById('vd-vendor-tabs');
    if (tabsWrap && isBuyer) {
      tabsWrap.innerHTML = state.vendors.map(function (v, idx) {
        const evalRes = evaluateProfile(v.ratings);
        const active = idx === state.activeVendorIdx;
        const col = VENDOR_COLORS[idx % VENDOR_COLORS.length];
        const canRemove = state.vendors.length > 1;
        return (
          '<div class="vd-vtab ' + (active ? 'active' : '') + '" style="--v-color:' + col + '" role="tab" tabindex="0" aria-selected="' + active + '" data-vendor-idx="' + idx + '">' +
            '<span class="vd-vtab-dot" aria-hidden="true"></span>' +
            '<span>' + escapeHtml(v.name || ('Vendor ' + (idx + 1))) + '</span>' +
            '<span class="vd-vtab-score">' + evalRes.score + '</span>' +
            (canRemove ? '<button type="button" class="vd-vtab-del" data-remove-vendor="' + idx + '" aria-label="Remove ' + escapeHtml(v.name) + '">&times;</button>' : '') +
          '</div>'
        );
      }).join('');
    }

    const addBtn = document.getElementById('vd-add-vendor-btn');
    if (addBtn) {
      addBtn.disabled = state.vendors.length >= 3;
      addBtn.title = state.vendors.length >= 3 ? 'Maximum 3 vendors compared side-by-side' : 'Add another AI vendor to compare';
    }

    // Sync founder inputs
    const fName = document.getElementById('vd-founder-name');
    const fSector = document.getElementById('vd-founder-sector');
    const fHost = document.getElementById('vd-founder-hosting');
    const fContact = document.getElementById('vd-founder-contact');
    if (fName && document.activeElement !== fName) fName.value = state.founder.name;
    if (fSector && document.activeElement !== fSector) fSector.value = state.founder.sector;
    if (fHost && document.activeElement !== fHost) fHost.value = state.founder.hosting;
    if (fContact && document.activeElement !== fContact) fContact.value = state.founder.contact;

    // Scanner target label
    const targetLabel = document.getElementById('vd-scan-target-label');
    if (targetLabel) {
      targetLabel.textContent = getActiveTarget().name;
    }
  }

  /* ── RENDERING: SUMMARY CARDS, SVG RADAR & PILLAR BARS ── */
  function buildScoreRingSvg(score, strokeColor) {
    const r = 32;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100);
    return (
      '<svg viewBox="0 0 78 78" aria-hidden="true">' +
        '<circle cx="39" cy="39" r="' + r + '" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="6"></circle>' +
        '<circle cx="39" cy="39" r="' + r + '" fill="none" stroke="' + strokeColor + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"></circle>' +
      '</svg>'
    );
  }

  function renderSummaryCards() {
    const wrap = document.getElementById('vd-summary-cards');
    if (!wrap) return;

    const profiles = state.mode === 'founder'
      ? [{ name: state.founder.name.trim() || 'Your AI Product', ratings: state.founder.ratings, color: '#00eefc', isActive: true, idx: 0, subtitle: state.founder.sector }]
      : state.vendors.map(function (v, idx) {
          return {
            name: v.name.trim() || ('Vendor ' + (idx + 1)),
            ratings: v.ratings,
            color: VENDOR_COLORS[idx % VENDOR_COLORS.length],
            isActive: idx === state.activeVendorIdx,
            idx: idx,
            subtitle: 'Vendor ' + (idx + 1)
          };
        });

    wrap.innerHTML = profiles.map(function (p) {
      const ev = evaluateProfile(p.ratings);
      const vClass = 'vd-verdict--' + ev.verdictKey;
      const ringColor = ev.verdictKey === 'approve' ? '#22c55e' : (ev.verdictKey === 'conditional' ? '#f59e0b' : '#f43f5e');
      const verdictText = state.mode === 'founder' ? ev.founderVerdictLabel : ev.verdictLabel;
      const openBlockers = ev.failedBlockers.length + ev.partialBlockers.length + ev.unknownBlockers.length;

      return (
        '<article class="vd-score-card ' + (p.isActive ? 'is-active' : '') + '" style="--v-color:' + p.color + '">' +
          '<div class="vd-score-card-top">' +
            '<div class="vd-score-ring-wrap">' +
              buildScoreRingSvg(ev.score, ringColor) +
              '<div class="vd-score-ring-val"><strong>' + ev.score + '</strong><span>/ 100</span></div>' +
            '</div>' +
            '<div class="vd-score-meta">' +
              '<div class="vd-score-vendor-label">' +
                '<span class="vd-vtab-dot" style="background:' + p.color + '" aria-hidden="true"></span>' +
                '<h3 class="vd-score-vendor-name" title="' + escapeHtml(p.name) + '">' + escapeHtml(p.name) + '</h3>' +
              '</div>' +
              '<span class="vd-verdict ' + vClass + '">' + escapeHtml(verdictText) + '</span>' +
              '<p class="vd-verdict-reason">' + escapeHtml(ev.verdictReason) + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="vd-mini-stats">' +
            '<div class="vd-mini-stat vd-mini-stat--pass"><strong>' + ev.counts.pass + '</strong><span>Pass</span></div>' +
            '<div class="vd-mini-stat vd-mini-stat--partial"><strong>' + ev.counts.partial + '</strong><span>Partial</span></div>' +
            '<div class="vd-mini-stat vd-mini-stat--fail"><strong>' + ev.counts.fail + '</strong><span>Fail</span></div>' +
            '<div class="vd-mini-stat vd-mini-stat--unknown"><strong>' + ev.counts.unknown + '</strong><span>Unknown</span></div>' +
          '</div>' +
          '<div class="vd-score-card-foot">' +
            (ev.failedBlockers.length > 0
              ? '<span class="vd-blocker-tag">' + ev.failedBlockers.length + ' Hard Blocker Fail(s)' + (ev.capped ? ' - Verdict Capped' : '') + '</span>'
              : (openBlockers > 0
                ? '<span style="color:#fbbf24;font-weight:700;">' + openBlockers + ' Blocker(s) Unverified</span>'
                : '<span class="vd-clear-tag">All 7 Hard Blockers Cleared</span>')) +
            (state.mode === 'buyer' && !p.isActive
              ? '<button type="button" class="vd-btn vd-btn-ghost vd-btn-sm" data-select-vendor="' + p.idx + '">Edit Checks</button>'
              : '<span>' + escapeHtml(state.mode === 'founder' ? 'Self-Audit Active' : 'Editing Now') + '</span>') +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderRadarAndBars() {
    const radarWrap = document.getElementById('vd-radar-svg');
    const legendWrap = document.getElementById('vd-radar-legend');
    const barsWrap = document.getElementById('vd-pillar-bars');
    if (!radarWrap || !barsWrap) return;

    const profiles = state.mode === 'founder'
      ? [{ name: state.founder.name.trim() || 'Your AI Product', color: '#00eefc', evalRes: evaluateProfile(state.founder.ratings) }]
      : state.vendors.map(function (v, idx) {
          return {
            name: v.name.trim() || ('Vendor ' + (idx + 1)),
            color: VENDOR_COLORS[idx % VENDOR_COLORS.length],
            evalRes: evaluateProfile(v.ratings)
          };
        });

    // Build 5-pillar pentagonal radar SVG
    const cx = 190;
    const cy = 155;
    const maxR = 104;
    const count = PILLARS.length;

    function polar(angleIdx, radius) {
      const angle = (-Math.PI / 2) + (angleIdx * 2 * Math.PI / count);
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    }

    let gridSvg = '';
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(function (step) {
      const pts = PILLARS.map(function (_p, i) {
        const pt = polar(i, maxR * step);
        return pt.x.toFixed(1) + ',' + pt.y.toFixed(1);
      }).join(' ');
      gridSvg += '<polygon points="' + pts + '" fill="none" stroke="rgba(248,245,253,0.12)" stroke-width="' + (step === 1 ? '1.3' : '1') + '"></polygon>';
    });

    let axesSvg = '';
    let labelsSvg = '';
    PILLARS.forEach(function (p, i) {
      const end = polar(i, maxR);
      axesSvg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + end.x.toFixed(1) + '" y2="' + end.y.toFixed(1) + '" stroke="rgba(248,245,253,0.14)" stroke-width="1"></line>';

      const lbl = polar(i, maxR + 24);
      let anchor = 'middle';
      if (lbl.x < cx - 25) anchor = 'end';
      else if (lbl.x > cx + 25) anchor = 'start';
      const dy = i === 0 ? -2 : (i === 2 || i === 3 ? 10 : 4);
      labelsSvg += '<text x="' + lbl.x.toFixed(1) + '" y="' + (lbl.y + dy).toFixed(1) + '" text-anchor="' + anchor + '" fill="#d5d3de" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700">' + escapeHtml(p.shortName) + '</text>';
    });

    let polysSvg = '';
    profiles.forEach(function (prof) {
      const ptsArr = PILLARS.map(function (p, i) {
        const ratio = Math.max(0.06, (prof.evalRes.pillarScores[p.id] || 0) / p.maxPoints);
        return polar(i, maxR * ratio);
      });
      const ptsStr = ptsArr.map(function (pt) { return pt.x.toFixed(1) + ',' + pt.y.toFixed(1); }).join(' ');
      polysSvg += '<polygon points="' + ptsStr + '" fill="' + prof.color + '" fill-opacity="0.18" stroke="' + prof.color + '" stroke-width="2.4" stroke-linejoin="round"></polygon>';
      ptsArr.forEach(function (pt) {
        polysSvg += '<circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="3.8" fill="' + prof.color + '" stroke="#0e0e13" stroke-width="1.5"></circle>';
      });
    });

    radarWrap.innerHTML =
      '<svg viewBox="0 0 380 315" role="img" aria-label="5-pillar AI vendor comparison radar chart">' +
        '<title>5-Pillar Risk and Trust Comparison</title>' +
        '<desc>Compares scores out of 20 across Data and Privacy, Model and Architecture, Governance and Compliance, Commercial and Exit, and Operational Fit.</desc>' +
        gridSvg + axesSvg + polysSvg + labelsSvg +
      '</svg>';

    if (legendWrap) {
      legendWrap.innerHTML = profiles.map(function (prof) {
        return '<span class="vd-legend-item"><span class="vd-legend-swatch" style="background:' + prof.color + '"></span>' + escapeHtml(prof.name) + ' (' + prof.evalRes.score + '/100)</span>';
      }).join('');
    }

    // Build horizontal comparison bars
    barsWrap.innerHTML = PILLARS.map(function (p) {
      const rows = profiles.map(function (prof) {
        const val = Math.round((prof.evalRes.pillarScores[p.id] || 0) * 10) / 10;
        const pct = Math.round((val / p.maxPoints) * 100);
        return (
          '<div class="vd-pbar-row">' +
            '<span class="vd-pbar-vname" title="' + escapeHtml(prof.name) + '">' + escapeHtml(prof.name) + '</span>' +
            '<div class="vd-pbar-track" role="progressbar" aria-label="' + escapeHtml(prof.name + ' ' + p.name) + '" aria-valuemin="0" aria-valuemax="' + p.maxPoints + '" aria-valuenow="' + val + '">' +
              '<div class="vd-pbar-fill" style="width:' + pct + '%;background:' + prof.color + ';"></div>' +
            '</div>' +
            '<span class="vd-pbar-num">' + val + '/' + p.maxPoints + '</span>' +
          '</div>'
        );
      }).join('');

      return (
        '<div class="vd-pbar-group">' +
          '<div class="vd-pbar-title">' +
            '<span>' + escapeHtml(p.name) + '</span>' +
            '<small>Max ' + p.maxPoints + ' pts</small>' +
          '</div>' +
          rows +
        '</div>'
      );
    }).join('');
  }

  /* ── RENDERING: DEAL-BLOCKER ALERTS ── */
  function renderBlockerAlerts() {
    const panel = document.getElementById('vd-blocker-panel');
    const list = document.getElementById('vd-blocker-list');
    if (!panel || !list) return;

    const target = getActiveTarget();
    const ev = evaluateProfile(target.ratings);
    const items = [];

    ev.failedBlockers.forEach(function (c) {
      items.push(
        '<li class="vd-blocker-item">' +
          '<span class="vd-sev-tag vd-sev-tag--fail">Hard Fail</span>' +
          '<span><strong>' + escapeHtml(c.name) + ':</strong> ' + escapeHtml(c.blockerWhy) +
          (c.pillar === 'governance' ? ' Document internal governance controls in the <a href="/rai">RAI Governance Framework</a>.' : '') +
          '</span>' +
        '</li>'
      );
    });

    ev.partialBlockers.forEach(function (c) {
      items.push(
        '<li class="vd-blocker-item">' +
          '<span class="vd-sev-tag vd-sev-tag--warn">Caveated Blocker</span>' +
          '<span><strong>' + escapeHtml(c.name) + ':</strong> Partial assurance is not enough on a hard blocker. Get written remediation before signature.</span>' +
        '</li>'
      );
    });

    ev.unknownBlockers.forEach(function (c) {
      items.push(
        '<li class="vd-blocker-item">' +
          '<span class="vd-sev-tag vd-sev-tag--warn">Unanswered Blocker</span>' +
          '<span><strong>' + escapeHtml(c.name) + ':</strong> Marked Unknown. Treat unanswered blockers as open risk and send the generated RFP question.</span>' +
        '</li>'
      );
    });

    panel.classList.remove('is-clear', 'is-warn');
    if (ev.failedBlockers.length > 0) {
      // default red border
    } else if (items.length > 0) {
      panel.classList.add('is-warn');
    } else {
      panel.classList.add('is-clear');
    }

    if (items.length === 0) {
      list.innerHTML =
        '<ul class="vd-blocker-items">' +
          '<li class="vd-blocker-item">' +
            '<span class="vd-sev-tag vd-sev-tag--ok">Cleared</span>' +
            '<span><strong>' + escapeHtml(target.name) + '</strong> has passed all 7 hard procurement deal-blockers. Next step after contract signature: register the deployed AI system in the <a href="/rai">RAI Governance Framework</a>.</span>' +
          '</li>' +
        '</ul>';
    } else {
      list.innerHTML =
        '<p style="font-size:0.8rem;color:var(--vd-text-muted);margin-bottom:0.65rem;">Showing hard deal-blocker status for <strong>' + escapeHtml(target.name) + '</strong>:</p>' +
        '<ul class="vd-blocker-items">' + items.join('') + '</ul>';
    }
  }

  /* ── RENDERING: 25 CHECKS (FOCUSED & 3-VENDOR MATRIX) ── */
  function renderFiltersAndBanner() {
    const banner = document.getElementById('vd-active-vendor-banner');
    const filterBar = document.getElementById('vd-pillar-filter');
    const target = getActiveTarget();
    const ev = evaluateProfile(target.ratings);

    if (banner) {
      banner.style.setProperty('--v-color', target.color);
      if (state.mode === 'buyer' && state.layout === 'single') {
        banner.innerHTML =
          '<div class="vd-banner-edit">' +
            '<label for="vd-active-name-input">Editing Vendor:</label>' +
            '<input type="text" id="vd-active-name-input" class="vd-input vd-banner-name-input" maxlength="60" value="' + escapeHtml(target.name) + '" aria-label="Edit active vendor name">' +
          '</div>' +
          '<div class="vd-banner-meta">' +
            'Score: <strong>' + ev.score + '/100</strong> · ' +
            ev.counts.pass + ' Pass · ' + ev.counts.partial + ' Partial · ' + ev.counts.fail + ' Fail · ' + ev.counts.unknown + ' Unknown' +
          '</div>';
      } else if (state.mode === 'buyer' && state.layout === 'matrix') {
        banner.innerHTML =
          '<div class="vd-banner-edit"><strong>Side-by-Side 3-Vendor Comparison Matrix</strong></div>' +
          '<div class="vd-banner-meta">Change any dropdown below to compare vendors live across all 25 checks.</div>';
      } else {
        banner.innerHTML =
          '<div class="vd-banner-edit"><strong>Self-Auditing:</strong> <span>' + escapeHtml(target.name) + '</span></div>' +
          '<div class="vd-banner-meta">' +
            'Readiness: <strong>' + ev.score + '/100</strong> · ' +
            ev.counts.pass + ' Verified · ' + (ev.counts.fail + ev.counts.partial + ev.counts.unknown) + ' Open Items' +
          '</div>';
      }
    }

    if (filterBar) {
      const filters = [
        { id: 'all', label: 'All 25 Checks' },
        { id: 'blockers', label: 'Hard Blockers (7)' },
        { id: 'gaps', label: 'Gaps & Unknowns' }
      ].concat(PILLARS.map(function (p) { return { id: p.id, label: p.shortName }; }));

      filterBar.innerHTML = filters.map(function (f) {
        const active = state.filter === f.id;
        return '<button type="button" class="vd-filter-chip ' + (active ? 'active' : '') + '" data-filter="' + f.id + '" aria-pressed="' + active + '">' + escapeHtml(f.label) + '</button>';
      }).join('');
    }
  }

  function filterChecks(ratings) {
    return CHECKS.filter(function (c) {
      if (state.filter === 'all') return true;
      if (state.filter === 'blockers') return c.blocker;
      if (state.filter === 'gaps') return (ratings[c.id] || 'unknown') !== 'pass';
      return c.pillar === state.filter;
    });
  }

  function renderChecks() {
    const container = document.getElementById('vd-checks-container');
    if (!container) return;

    const effectiveLayout = state.mode === 'buyer' ? state.layout : 'single';
    const target = getActiveTarget();

    if (effectiveLayout === 'matrix') {
      const visibleChecks = CHECKS.filter(function (c) {
        if (state.filter === 'all') return true;
        if (state.filter === 'blockers') return c.blocker;
        if (state.filter === 'gaps') {
          return state.vendors.some(function (v) { return (v.ratings[c.id] || 'unknown') !== 'pass'; });
        }
        return c.pillar === state.filter;
      });

      if (visibleChecks.length === 0) {
        container.innerHTML = '<div class="vd-empty-box">No checks match this filter.</div>';
        return;
      }

      let rowsHtml = '';
      let lastPillar = '';
      visibleChecks.forEach(function (c) {
        if (c.pillar !== lastPillar) {
          lastPillar = c.pillar;
          const p = PILLAR_BY_ID[c.pillar];
          rowsHtml += '<tr class="vd-matrix-pillar-row"><td colspan="' + (2 + state.vendors.length) + '">' + escapeHtml(p.name) + ' (Max ' + p.maxPoints + ' pts)</td></tr>';
        }
        const cells = state.vendors.map(function (v, vIdx) {
          const val = v.ratings[c.id] || 'unknown';
          return (
            '<td>' +
              '<select class="vd-matrix-select" data-matrix-vendor="' + vIdx + '" data-check-id="' + c.id + '" data-val="' + val + '" aria-label="' + escapeHtml(v.name + ' rating for ' + c.name) + '">' +
                '<option value="pass"' + (val === 'pass' ? ' selected' : '') + '>Pass / Verified</option>' +
                '<option value="partial"' + (val === 'partial' ? ' selected' : '') + '>Partial / Caveated</option>' +
                '<option value="fail"' + (val === 'fail' ? ' selected' : '') + '>Fail / Missing</option>' +
                '<option value="unknown"' + (val === 'unknown' ? ' selected' : '') + '>Unknown / Unanswered</option>' +
              '</select>' +
            '</td>'
          );
        }).join('');

        rowsHtml +=
          '<tr>' +
            '<td>' +
              '<div class="vd-check-title-line">' +
                '<span class="vd-check-name">' + escapeHtml(c.name) + '</span>' +
                (c.blocker ? '<span class="vd-blocker-pill">Deal-Blocker</span>' : '') +
              '</div>' +
            '</td>' +
            '<td><span class="vd-weight-badge">' + c.weight + ' pts</span></td>' +
            cells +
          '</tr>';
      });

      const headerVendors = state.vendors.map(function (v, idx) {
        const ev = evaluateProfile(v.ratings);
        const col = VENDOR_COLORS[idx % VENDOR_COLORS.length];
        return '<th><span class="vd-vtab-dot" style="display:inline-block;margin-right:6px;background:' + col + '"></span>' + escapeHtml(v.name) + ' (' + ev.score + ')</th>';
      }).join('');

      container.innerHTML =
        '<div class="vd-matrix-wrap">' +
          '<table class="vd-matrix-table">' +
            '<thead><tr><th>Due-Diligence Check</th><th>Weight</th>' + headerVendors + '</tr></thead>' +
            '<tbody>' + rowsHtml + '</tbody>' +
          '</table>' +
        '</div>';
      return;
    }

    // Focused Single-Vendor / Founder View
    const visible = filterChecks(target.ratings);
    if (visible.length === 0) {
      container.innerHTML = '<div class="vd-empty-box">Every check in this filter is already marked Pass / Verified.</div>';
      return;
    }

    const ev = evaluateProfile(target.ratings);
    const byPillar = {};
    visible.forEach(function (c) {
      if (!byPillar[c.pillar]) byPillar[c.pillar] = [];
      byPillar[c.pillar].push(c);
    });

    container.innerHTML = PILLARS.filter(function (p) { return byPillar[p.id]; }).map(function (p) {
      const pScore = Math.round((ev.pillarScores[p.id] || 0) * 10) / 10;
      const rows = byPillar[p.id].map(function (c) {
        const current = target.ratings[c.id] || 'unknown';
        const noteVal = target.notes[c.id] || '';
        const btns = ['pass', 'partial', 'fail', 'unknown'].map(function (rKey) {
          const isActive = current === rKey;
          return (
            '<button type="button" class="vd-rate-btn vd-rate-btn--' + rKey + (isActive ? ' active' : '') + '" ' +
              'data-rate-check="' + c.id + '" data-rate-val="' + rKey + '" aria-pressed="' + isActive + '">' +
              RATING_META[rKey].label +
            '</button>'
          );
        }).join('');

        return (
          '<div class="vd-check-row">' +
            '<div>' +
              '<div class="vd-check-title-line">' +
                '<span class="vd-check-name">' + escapeHtml(c.name) + '</span>' +
                '<span class="vd-weight-badge">' + c.weight + ' pts</span>' +
                (c.blocker ? '<span class="vd-blocker-pill">Deal-Blocker</span>' : '') +
              '</div>' +
              '<p class="vd-check-desc">' + escapeHtml(c.desc) + '</p>' +
            '</div>' +
            '<div class="vd-check-actions">' +
              '<div class="vd-rating-group" role="group" aria-label="Rating for ' + escapeHtml(c.name) + '">' + btns + '</div>' +
              '<input type="text" class="vd-note-input" data-note-check="' + c.id + '" value="' + escapeHtml(noteVal) + '" maxlength="140" placeholder="Optional evidence note (e.g. DPA §4.2)..." aria-label="Evidence note for ' + escapeHtml(c.name) + '">' +
            '</div>' +
          '</div>'
        );
      }).join('');

      return (
        '<div class="vd-pillar-block">' +
          '<div class="vd-pillar-header">' +
            '<div class="vd-pillar-head-left">' +
              '<span class="vd-pillar-dot" style="background:' + p.color + '" aria-hidden="true"></span>' +
              '<h3 class="vd-pillar-name">' + escapeHtml(p.name) + '</h3>' +
              (p.raiLink ? '<a href="/rai" class="vd-pillar-rai-link">Pair with RAI Framework</a>' : '') +
            '</div>' +
            '<span class="vd-pillar-score-pill">' + pScore + ' / ' + p.maxPoints + ' pts</span>' +
          '</div>' +
          '<div class="vd-check-list">' + rows + '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* ── RENDERING: BUYER RFP QUESTIONS & FOUNDER OUTPUTS ── */
  function getRfpQuestionsList() {
    const scopeVendors = state.rfpScope === 'all'
      ? state.vendors
      : [state.vendors[Math.min(state.activeVendorIdx, state.vendors.length - 1)]];

    const out = [];
    scopeVendors.forEach(function (v) {
      CHECKS.forEach(function (c) {
        const r = v.ratings[c.id] || 'unknown';
        if (r === 'pass') return;
        if (state.rfpSeverity === 'critical' && !(c.blocker || r === 'fail')) return;
        out.push({
          vendorName: v.name || 'Vendor',
          check: c,
          pillarName: PILLAR_BY_ID[c.pillar].name,
          rating: r,
          note: v.notes[c.id] || ''
        });
      });
    });

    // Sort: hard blockers & fails first
    const rank = { fail: 0, unknown: 1, partial: 2 };
    out.sort(function (a, b) {
      if (a.check.blocker !== b.check.blocker) return a.check.blocker ? -1 : 1;
      return (rank[a.rating] || 9) - (rank[b.rating] || 9);
    });
    return out;
  }

  function renderBuyerRfpQuestions() {
    const listWrap = document.getElementById('vd-rfp-list');
    const countBadge = document.getElementById('vd-rfp-count');
    if (!listWrap) return;

    const items = getRfpQuestionsList();
    if (countBadge) countBadge.textContent = String(items.length);

    if (items.length === 0) {
      listWrap.innerHTML = '<div class="vd-empty-box">No open RFP follow-up questions under the current filter. All selected checks are verified Pass.</div>';
      return;
    }

    listWrap.innerHTML = items.map(function (it, i) {
      const sevTag = it.rating === 'fail'
        ? '<span class="vd-sev-tag vd-sev-tag--fail">Fail</span>'
        : (it.rating === 'partial'
          ? '<span class="vd-sev-tag vd-sev-tag--warn">Partial</span>'
          : '<span class="vd-sev-tag" style="background:rgba(59,130,246,0.22);color:#bfdbfe;">Unknown</span>');

      return (
        '<article class="vd-rfp-card vd-rfp-card--' + it.rating + '">' +
          '<div class="vd-rfp-meta">' +
            '<strong>Q' + (i + 1) + '</strong>' +
            '<span>' + escapeHtml(it.vendorName) + '</span>' +
            '<span>·</span>' +
            '<span>' + escapeHtml(it.pillarName) + '</span>' +
            sevTag +
            (it.check.blocker ? '<span class="vd-blocker-pill">Deal-Blocker</span>' : '') +
          '</div>' +
          '<p class="vd-rfp-q">' + escapeHtml(it.check.rfpQuestion) + '</p>' +
          '<p class="vd-rfp-why"><strong>Why it matters:</strong> ' + escapeHtml(it.check.blockerWhy) +
            (it.note ? ' <em>(Note: ' + escapeHtml(it.note) + ')</em>' : '') +
          '</p>' +
        '</article>'
      );
    }).join('');
  }

  function renderFounderOutputs() {
    const remWrap = document.getElementById('vd-remediation-list');
    const onePagerWrap = document.getElementById('vd-onepager-preview');
    if (!remWrap || !onePagerWrap) return;

    const ev = evaluateProfile(state.founder.ratings);
    const gaps = CHECKS.filter(function (c) {
      return (state.founder.ratings[c.id] || 'unknown') !== 'pass';
    });

    const rank = { fail: 0, unknown: 1, partial: 2 };
    gaps.sort(function (a, b) {
      if (a.blocker !== b.blocker) return a.blocker ? -1 : 1;
      if (b.weight !== a.weight) return b.weight - a.weight;
      return (rank[state.founder.ratings[a.id] || 'unknown'] || 9) - (rank[state.founder.ratings[b.id] || 'unknown'] || 9);
    });

    if (gaps.length === 0) {
      remWrap.innerHTML = '<div class="vd-empty-box">All 25 enterprise checks verified. Your Trust One-Pager is ready for procurement reviews.</div>';
    } else {
      remWrap.innerHTML = '<ul class="vd-rem-list">' + gaps.map(function (c) {
        const r = state.founder.ratings[c.id] || 'unknown';
        const badge = c.blocker
          ? '<span class="vd-blocker-pill">Hard Deal-Blocker</span>'
          : '<span class="vd-weight-badge">' + c.weight + ' pts</span>';
        const statusTag = r === 'fail'
          ? '<span class="vd-sev-tag vd-sev-tag--fail">Missing</span>'
          : (r === 'partial'
            ? '<span class="vd-sev-tag vd-sev-tag--warn">Partial</span>'
            : '<span class="vd-sev-tag" style="background:rgba(59,130,246,0.22);color:#bfdbfe;">Unverified</span>');
        return (
          '<li class="vd-rem-item">' +
            '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">' + statusTag + badge + '</div>' +
            '<strong>' + escapeHtml(c.name) + '</strong>' +
            '<p><strong>Artefact buyers expect:</strong> ' + escapeHtml(c.founderEvidence) + '</p>' +
          '</li>'
        );
      }).join('') + '</ul>';
    }

    // Live Enterprise AI Trust & Readiness One-Pager Preview
    const prodName = state.founder.name.trim() || 'Your AI Product';
    const verified = CHECKS.filter(function (c) { return state.founder.ratings[c.id] === 'pass'; });
    const inProgress = CHECKS.filter(function (c) { return state.founder.ratings[c.id] === 'partial'; });
    const pillarSummary = PILLARS.map(function (p) {
      const s = Math.round((ev.pillarScores[p.id] || 0) * 10) / 10;
      return '<li><strong>' + escapeHtml(p.name) + ':</strong> ' + s + ' / ' + p.maxPoints + '</li>';
    }).join('');

    onePagerWrap.innerHTML =
      '<h4>' + escapeHtml(prodName) + ' - Enterprise AI Trust &amp; Readiness Brief</h4>' +
      '<div class="vd-onepager-meta">' +
        '<strong>Target Sector:</strong> ' + escapeHtml(state.founder.sector) + '<br>' +
        '<strong>Architecture:</strong> ' + escapeHtml(state.founder.hosting || 'Not specified') + '<br>' +
        '<strong>Security Contact:</strong> ' + escapeHtml(state.founder.contact || 'Not specified') + '<br>' +
        '<strong>Self-Audit Score:</strong> ' + ev.score + '/100 (' + escapeHtml(ev.founderVerdictLabel) + ')' +
      '</div>' +
      '<h5>Pillar Readiness Snapshot</h5>' +
      '<ul>' + pillarSummary + '</ul>' +
      '<h5>Verified Enterprise Controls (' + verified.length + '/25)</h5>' +
      (verified.length
        ? '<ul>' + verified.map(function (c) {
            const note = state.founder.notes[c.id] ? ' - ' + escapeHtml(state.founder.notes[c.id]) : '';
            return '<li><strong>' + escapeHtml(c.name) + ':</strong> Verified' + note + '</li>';
          }).join('') + '</ul>'
        : '<p style="color:var(--vd-text-muted);font-size:0.8rem;">Mark checks as Pass / Verified to populate your customer-facing controls.</p>') +
      (inProgress.length
        ? '<h5>In-Progress / Scoped Controls (' + inProgress.length + ')</h5><ul>' + inProgress.map(function (c) {
            const note = state.founder.notes[c.id] ? ' - ' + escapeHtml(state.founder.notes[c.id]) : '';
            return '<li><strong>' + escapeHtml(c.name) + ':</strong> Partial / In Progress' + note + '</li>';
          }).join('') + '</ul>'
        : '');
  }

  /* ── EXPORTS: MARKDOWN & CSV ── */
  function generateBuyerMarkdown() {
    const dateStr = new Date().toISOString().slice(0, 10);
    const lines = [
      '# AI Vendor & Procurement Due-Diligence Scorecard',
      '',
      '- **Date:** ' + dateStr,
      '- **Tool:** AI Vendor & Procurement Due-Diligence Stress-Tester (https://johnb.io/ai-vendor-diligence)',
      '- **Companion Governance Framework:** https://johnb.io/rai',
      '',
      '## Executive Comparison Summary',
      '',
      '| Vendor | Overall Score | Verdict | Hard Blocker Fails | Pass | Partial | Fail | Unknown |',
      '|---|---:|---|---:|---:|---:|---:|---:|'
    ];

    state.vendors.forEach(function (v) {
      const ev = evaluateProfile(v.ratings);
      lines.push(
        '| ' + v.name.replace(/\|/g, '/') + ' | ' + ev.score + '/100 | ' + ev.verdictLabel + ' | ' +
        ev.failedBlockers.length + ' | ' + ev.counts.pass + ' | ' + ev.counts.partial + ' | ' +
        ev.counts.fail + ' | ' + ev.counts.unknown + ' |'
      );
    });

    lines.push('', '## Pillar Breakdown (Out of 20 Each)', '');
    lines.push('| Pillar | ' + state.vendors.map(function (v) { return v.name.replace(/\|/g, '/'); }).join(' | ') + ' |');
    lines.push('|---|' + state.vendors.map(function () { return '---:'; }).join('|') + '|');
    PILLARS.forEach(function (p) {
      const vals = state.vendors.map(function (v) {
        const ev = evaluateProfile(v.ratings);
        return (Math.round((ev.pillarScores[p.id] || 0) * 10) / 10) + '/20';
      });
      lines.push('| ' + p.name + ' | ' + vals.join(' | ') + ' |');
    });

    lines.push('', '## Detailed 25-Check Matrix', '');
    lines.push('| Pillar | Check | Weight | Blocker | ' + state.vendors.map(function (v) { return v.name.replace(/\|/g, '/'); }).join(' | ') + ' |');
    lines.push('|---|---|---:|:---:|' + state.vendors.map(function () { return '---'; }).join('|') + '|');
    CHECKS.forEach(function (c) {
      const cells = state.vendors.map(function (v) {
        const r = v.ratings[c.id] || 'unknown';
        const note = v.notes[c.id] ? ' (' + v.notes[c.id].replace(/\|/g, '/') + ')' : '';
        return RATING_META[r].label + note;
      });
      lines.push('| ' + PILLAR_BY_ID[c.pillar].shortName + ' | ' + c.name + ' | ' + c.weight + ' | ' + (c.blocker ? 'YES' : 'No') + ' | ' + cells.join(' | ') + ' |');
    });

    const rfpItems = getRfpQuestionsList();
    lines.push('', '## Pointed RFP Follow-Up Questions (' + rfpItems.length + ')', '');
    if (rfpItems.length === 0) {
      lines.push('No open follow-up questions under the selected filter.');
    } else {
      rfpItems.forEach(function (it, i) {
        lines.push(
          (i + 1) + '. **[' + it.vendorName + ' | ' + RATING_META[it.rating].label.toUpperCase() + (it.check.blocker ? ' - DEAL-BLOCKER' : '') + '] ' + it.check.name + ':** ' +
          it.check.rfpQuestion
        );
      });
    }

    return lines.join('\n');
  }

  function generateFounderOnePagerMarkdown() {
    const dateStr = new Date().toISOString().slice(0, 10);
    const prodName = state.founder.name.trim() || 'Your AI Product';
    const ev = evaluateProfile(state.founder.ratings);
    const lines = [
      '# ' + prodName + ' - Enterprise AI Trust & Readiness One-Pager',
      '',
      '- **Prepared:** ' + dateStr,
      '- **Target Buyer Sector:** ' + state.founder.sector,
      '- **Model & Hosting Stack:** ' + (state.founder.hosting || 'Available under NDA'),
      '- **Security / Privacy Contact:** ' + (state.founder.contact || 'Available on request'),
      '- **Self-Audit Readiness Score:** ' + ev.score + '/100 (' + ev.founderVerdictLabel + ')',
      '',
      '## 5-Pillar Readiness Breakdown',
      ''
    ];

    PILLARS.forEach(function (p) {
      const s = Math.round((ev.pillarScores[p.id] || 0) * 10) / 10;
      lines.push('- **' + p.name + ':** ' + s + ' / ' + p.maxPoints);
    });

    const verified = CHECKS.filter(function (c) { return state.founder.ratings[c.id] === 'pass'; });
    const partial = CHECKS.filter(function (c) { return state.founder.ratings[c.id] === 'partial'; });
    const gaps = CHECKS.filter(function (c) {
      const r = state.founder.ratings[c.id] || 'unknown';
      return r === 'fail' || r === 'unknown';
    });

    lines.push('', '## Verified Enterprise Controls (' + verified.length + '/25)', '');
    verified.forEach(function (c) {
      const note = state.founder.notes[c.id] ? ' - ' + state.founder.notes[c.id] : '';
      lines.push('- **' + c.name + ' (' + PILLAR_BY_ID[c.pillar].shortName + '):** Verified' + note);
    });

    if (partial.length) {
      lines.push('', '## Scoped / In-Progress Controls (' + partial.length + ')', '');
      partial.forEach(function (c) {
        const note = state.founder.notes[c.id] ? ' - ' + state.founder.notes[c.id] : '';
        lines.push('- **' + c.name + ':** Partial / In Progress' + note);
      });
    }

    if (gaps.length) {
      lines.push('', '## Internal Remediation Backlog (Do Not Share Externally Until Closed)', '');
      gaps.forEach(function (c) {
        lines.push('- [' + (c.blocker ? 'HARD BLOCKER' : 'GAP') + '] **' + c.name + ':** Prepare ' + c.founderEvidence);
      });
    }

    lines.push('', '---', 'Generated locally with JohnB.io AI Vendor & Procurement Due-Diligence Stress-Tester (https://johnb.io/ai-vendor-diligence).');
    return lines.join('\n');
  }

  function csvCell(val) {
    const s = String(val == null ? '' : val);
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function generateCsv() {
    const profiles = state.mode === 'founder'
      ? [{ name: state.founder.name.trim() || 'Your AI Product', ratings: state.founder.ratings, notes: state.founder.notes }]
      : state.vendors;

    const header = ['Pillar', 'Check', 'Weight', 'Hard Deal-Blocker'];
    profiles.forEach(function (p) {
      header.push(p.name + ' Rating', p.name + ' Notes');
    });
    const rows = [header.map(csvCell).join(',')];

    CHECKS.forEach(function (c) {
      const row = [PILLAR_BY_ID[c.pillar].name, c.name, c.weight, c.blocker ? 'Yes' : 'No'];
      profiles.forEach(function (p) {
        const r = p.ratings[c.id] || 'unknown';
        row.push(RATING_META[r].fullLabel, p.notes[c.id] || '');
      });
      rows.push(row.map(csvCell).join(','));
    });

    // Summary row
    const summary = ['SUMMARY', 'Overall Score & Verdict', '100', ''];
    profiles.forEach(function (p) {
      const ev = evaluateProfile(p.ratings);
      summary.push(ev.score + '/100', state.mode === 'founder' ? ev.founderVerdictLabel : ev.verdictLabel);
    });
    rows.push(summary.map(csvCell).join(','));
    return rows.join('\r\n');
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ── LOCAL TERMS & POLICY RED-FLAG SCANNER ── */
  function runTermsScan() {
    const input = document.getElementById('vd-terms-input');
    const resultsWrap = document.getElementById('vd-scan-results');
    const summaryWrap = document.getElementById('vd-scan-summary');
    const hlBox = document.getElementById('vd-highlighted-terms');
    const findingsWrap = document.getElementById('vd-findings-list');
    const emailPre = document.getElementById('vd-email-preview');
    const badge = document.getElementById('vd-scanner-badge');
    if (!input || !resultsWrap) return;

    const raw = input.value.trim();
    if (!raw) {
      showToast('Paste vendor AI terms or click "Load Sample Risky AI Terms" first.');
      return;
    }

    const spans = [];
    const findings = [];

    CLAUSE_RULES.forEach(function (rule) {
      const matchedQuotes = [];
      rule.patterns.forEach(function (rx) {
        rx.lastIndex = 0;
        let m;
        while ((m = rx.exec(raw)) !== null) {
          spans.push({
            start: m.index,
            end: m.index + m[0].length,
            severity: rule.severity,
            title: rule.title
          });
          if (matchedQuotes.length < 2) {
            matchedQuotes.push(m[0]);
          }
          if (m[0].length === 0) rx.lastIndex++;
        }
      });

      if (matchedQuotes.length > 0) {
        findings.push({
          rule: rule,
          quotes: matchedQuotes,
          synthetic: false
        });
      }
    });

    // Absence checks when substantial text is pasted (80+ words)
    const words = raw.split(/\s+/).filter(Boolean).length;
    if (words >= 80) {
      if (!/\b(zero\s+data\s+retention|zdr|not\s+retain(ed)?|immediately\s+deleted)\b/i.test(raw) &&
          !findings.some(function (f) { return f.rule.id === 'rule_retention'; })) {
        findings.push({
          rule: {
            id: 'missing_zdr',
            title: 'Missing Safeguard: No Zero Data Retention Commitment Found',
            severity: 'med',
            explanation: 'The pasted policy does not state a zero-retention commitment or clear deletion window for prompts and outputs.',
            checkId: 'dp_zdr',
            suggestedRating: 'unknown',
            emailQuestion: 'State your exact prompt and output retention window across both your servers and upstream model providers, and confirm whether Zero Data Retention is available.'
          },
          quotes: ['Not mentioned in pasted text'],
          synthetic: true
        });
      }
      if (!/\b(audit\s+log|siem|traceability|export\s+all\s+customer\s+data|data\s+export)\b/i.test(raw)) {
        findings.push({
          rule: {
            id: 'missing_audit',
            title: 'Missing Safeguard: No Audit Log or Exit Export Rights Mentioned',
            severity: 'med',
            explanation: 'No wording found covering immutable prompt/response audit logs or data/prompt export rights on exit.',
            checkId: 'gc_audit_logs',
            suggestedRating: 'unknown',
            emailQuestion: 'Confirm what immutable audit logs are available for export to our SIEM, and confirm our exit export rights for data and custom prompts.'
          },
          quotes: ['Not mentioned in pasted text'],
          synthetic: true
        });
      }
    }

    // Resolve overlapping highlight spans (prefer high > med > good, earlier start first)
    const sevPri = { high: 3, med: 2, good: 1 };
    spans.sort(function (a, b) {
      if (a.start !== b.start) return a.start - b.start;
      return (sevPri[b.severity] || 0) - (sevPri[a.severity] || 0);
    });

    const merged = [];
    spans.forEach(function (sp) {
      if (merged.length === 0 || sp.start >= merged[merged.length - 1].end) {
        merged.push(sp);
      } else if ((sevPri[sp.severity] || 0) > (sevPri[merged[merged.length - 1].severity] || 0) && sp.start === merged[merged.length - 1].start) {
        merged[merged.length - 1] = sp;
      }
    });

    let annotatedHtml = '';
    let cursor = 0;
    merged.forEach(function (sp) {
      if (sp.start > cursor) {
        annotatedHtml += escapeHtml(raw.slice(cursor, sp.start));
      }
      annotatedHtml += '<mark class="vd-hl vd-hl--' + sp.severity + '" title="' + escapeHtml(sp.title) + '">' + escapeHtml(raw.slice(sp.start, sp.end)) + '</mark>';
      cursor = sp.end;
    });
    if (cursor < raw.length) {
      annotatedHtml += escapeHtml(raw.slice(cursor));
    }

    const highCount = findings.filter(function (f) { return f.rule.severity === 'high'; }).length;
    const medCount = findings.filter(function (f) { return f.rule.severity === 'med'; }).length;
    const goodCount = findings.filter(function (f) { return f.rule.severity === 'good'; }).length;
    const riskTotal = highCount + medCount;

    const scanVerdict = highCount >= 2
      ? 'High Red-Flag Exposure'
      : (highCount === 1 || medCount >= 2 ? 'Negotiate Clauses Before Signing' : 'Low Red-Flag Signals');

    state.lastScan = {
      findings: findings,
      highCount: highCount,
      medCount: medCount,
      goodCount: goodCount
    };

    if (badge) {
      badge.textContent = String(riskTotal);
      badge.hidden = riskTotal === 0;
    }

    summaryWrap.innerHTML =
      '<div class="vd-scan-kpi vd-scan-kpi--high"><strong>' + highCount + '</strong><span>High-Risk Traps</span></div>' +
      '<div class="vd-scan-kpi vd-scan-kpi--med"><strong>' + medCount + '</strong><span>Caveats / Missing</span></div>' +
      '<div class="vd-scan-kpi vd-scan-kpi--good"><strong>' + goodCount + '</strong><span>Positive Signals</span></div>' +
      '<div class="vd-scan-kpi vd-scan-kpi--verdict"><strong>' + escapeHtml(scanVerdict) + '</strong><span>Clause Assessment</span></div>';

    hlBox.innerHTML = annotatedHtml || '<span style="color:var(--vd-text-muted);">No text to display.</span>';

    if (findings.length === 0) {
      findingsWrap.innerHTML = '<div class="vd-empty-box">No known trap phrases or safeguard terms matched in this excerpt. Paste the full AI addendum or DPA to scan deeper.</div>';
    } else {
      // Sort high -> med -> good
      findings.sort(function (a, b) { return (sevPri[b.rule.severity] || 0) - (sevPri[a.rule.severity] || 0); });
      findingsWrap.innerHTML = findings.map(function (f, idx) {
        const chk = CHECK_BY_ID[f.rule.checkId];
        const cardMod = f.rule.severity === 'med' ? 'vd-finding-card--med' : (f.rule.severity === 'good' ? 'vd-finding-card--good' : '');
        const sevLabel = f.rule.severity === 'high' ? 'High Risk' : (f.rule.severity === 'med' ? 'Caveat' : 'Positive');
        const sevClass = f.rule.severity === 'high' ? 'vd-sev-tag--fail' : (f.rule.severity === 'med' ? 'vd-sev-tag--warn' : 'vd-sev-tag--ok');

        return (
          '<article class="vd-finding-card ' + cardMod + '">' +
            '<div class="vd-finding-top">' +
              '<strong>' + escapeHtml(f.rule.title) + '</strong>' +
              '<span class="vd-sev-tag ' + sevClass + '">' + sevLabel + '</span>' +
            '</div>' +
            '<div class="vd-finding-quote">"' + escapeHtml(f.quotes.join('" / "')) + '"</div>' +
            '<p class="vd-finding-desc">' + escapeHtml(f.rule.explanation) + '</p>' +
            '<div class="vd-finding-foot">' +
              '<span class="vd-finding-map">Maps to: ' + escapeHtml(chk ? chk.name : f.rule.checkId) + ' -> ' + RATING_META[f.rule.suggestedRating].label + '</span>' +
              '<button type="button" class="vd-btn vd-btn-ghost vd-btn-sm" data-apply-finding="' + idx + '">Apply to Scorecard</button>' +
            '</div>' +
          '</article>'
        );
      }).join('');
    }

    // Build ready-to-send email challenge
    const targetName = getActiveTarget().name;
    const emailQuestions = findings
      .filter(function (f) { return f.rule.emailQuestion; })
      .map(function (f, i) { return (i + 1) + '. ' + f.rule.emailQuestion; });

    const emailText = emailQuestions.length > 0
      ? [
          'Subject: AI Terms & Data Protection Clarifications - ' + targetName,
          '',
          'Hi team,',
          '',
          'Before we move forward with legal and infosec sign-off on ' + targetName + ', please confirm the following points in writing and provide redlined contract wording where applicable:',
          '',
          emailQuestions.join('\n\n'),
          '',
          'Once these points are addressed in the MSA/DPA, we can progress procurement review.',
          '',
          'Thanks,'
        ].join('\n')
      : 'No risky clauses were flagged in this excerpt. Ask the vendor to supply their full AI Addendum, signed UK/EU DPA, and sub-processor list for review.';

    emailPre.textContent = emailText;
    resultsWrap.hidden = false;
  }

  function applyFindingToActive(finding) {
    if (!finding || !finding.rule || !CHECK_BY_ID[finding.rule.checkId]) return;
    const target = getActiveTarget();
    target.ratings[finding.rule.checkId] = finding.rule.suggestedRating;
    if (!finding.synthetic && finding.quotes && finding.quotes[0]) {
      target.notes[finding.rule.checkId] = 'Terms scan: "' + finding.quotes[0].slice(0, 80) + '"';
    }
  }

  function updateTermsWordCount() {
    const input = document.getElementById('vd-terms-input');
    const stats = document.getElementById('vd-terms-stats');
    if (!input || !stats) return;
    const txt = input.value.trim();
    const words = txt ? txt.split(/\s+/).length : 0;
    stats.textContent = words + (words === 1 ? ' word' : ' words');
  }

  /* ── FULL RENDER ── */
  function renderAll() {
    renderControls();
    renderSummaryCards();
    renderRadarAndBars();
    renderBlockerAlerts();
    renderFiltersAndBanner();
    renderChecks();
    if (state.mode === 'buyer') {
      renderBuyerRfpQuestions();
    } else {
      renderFounderOutputs();
    }
  }

  /* ── EVENT BINDING ── */
  function bindEvents() {
    // Mode switcher
    const buyerBtn = document.getElementById('vd-mode-buyer');
    const founderBtn = document.getElementById('vd-mode-founder');
    if (buyerBtn) {
      buyerBtn.addEventListener('click', function () {
        state.mode = 'buyer';
        renderAll();
      });
    }
    if (founderBtn) {
      founderBtn.addEventListener('click', function () {
        state.mode = 'founder';
        renderAll();
      });
    }

    // Workspace view tabs
    const scBtn = document.getElementById('vd-view-scorecard');
    const scanTabBtn = document.getElementById('vd-view-scanner');
    if (scBtn) {
      scBtn.addEventListener('click', function () {
        state.view = 'scorecard';
        renderControls();
      });
    }
    if (scanTabBtn) {
      scanTabBtn.addEventListener('click', function () {
        state.view = 'scanner';
        renderControls();
      });
    }

    // Vendor tabs delegation
    const vendorTabs = document.getElementById('vd-vendor-tabs');
    if (vendorTabs) {
      vendorTabs.addEventListener('click', function (e) {
        const delBtn = e.target.closest('[data-remove-vendor]');
        if (delBtn) {
          e.stopPropagation();
          const delIdx = parseInt(delBtn.getAttribute('data-remove-vendor'), 10);
          if (state.vendors.length > 1 && !isNaN(delIdx)) {
            state.vendors.splice(delIdx, 1);
            if (state.activeVendorIdx >= state.vendors.length) {
              state.activeVendorIdx = state.vendors.length - 1;
            }
            renderAll();
            showToast('Vendor removed from comparison.');
          }
          return;
        }
        const tab = e.target.closest('[data-vendor-idx]');
        if (tab) {
          state.activeVendorIdx = parseInt(tab.getAttribute('data-vendor-idx'), 10) || 0;
          renderAll();
        }
      });

      vendorTabs.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          const tab = e.target.closest('[data-vendor-idx]');
          if (tab && !e.target.closest('[data-remove-vendor]')) {
            e.preventDefault();
            state.activeVendorIdx = parseInt(tab.getAttribute('data-vendor-idx'), 10) || 0;
            renderAll();
          }
        }
      });
    }

    // Summary card "Edit Checks" delegation
    const summaryCards = document.getElementById('vd-summary-cards');
    if (summaryCards) {
      summaryCards.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-select-vendor]');
        if (btn) {
          state.activeVendorIdx = parseInt(btn.getAttribute('data-select-vendor'), 10) || 0;
          renderAll();
        }
      });
    }

    // Add vendor
    const addBtn = document.getElementById('vd-add-vendor-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        if (state.vendors.length >= 3) return;
        state.vendors.push({
          id: 'v_' + Math.random().toString(36).slice(2, 8),
          name: 'Vendor ' + (state.vendors.length + 1),
          ratings: makeBlankRatings(),
          notes: {}
        });
        state.activeVendorIdx = state.vendors.length - 1;
        renderAll();
        showToast('Added new vendor slot.');
      });
    }

    // Load 3-vendor demo
    const demoBtn = document.getElementById('vd-load-demo-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', function () {
        state.vendors = [
          makeVendorFromPreset('wrapper'),
          makeVendorFromPreset('incumbent'),
          makeVendorFromPreset('openweight')
        ];
        state.activeVendorIdx = 0;
        renderAll();
        showToast('Loaded 3-vendor comparison demo.');
      });
    }

    // Fill active vendor with preset
    const applyPresetBtn = document.getElementById('vd-apply-preset-btn');
    const presetSelect = document.getElementById('vd-preset-select');
    if (applyPresetBtn && presetSelect) {
      applyPresetBtn.addEventListener('click', function () {
        const key = presetSelect.value;
        state.vendors[state.activeVendorIdx] = makeVendorFromPreset(key);
        renderAll();
        showToast('Applied preset to active vendor.');
      });
    }

    // Blank Reset (Buyer)
    const resetBtn = document.getElementById('vd-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        const v = state.vendors[state.activeVendorIdx];
        v.ratings = makeBlankRatings();
        v.notes = {};
        renderAll();
        showToast('Reset ' + v.name + ' to blank Unknown slate.');
      });
    }

    // Founder inputs & baselines
    const fName = document.getElementById('vd-founder-name');
    const fSector = document.getElementById('vd-founder-sector');
    const fHost = document.getElementById('vd-founder-hosting');
    const fContact = document.getElementById('vd-founder-contact');

    if (fName) fName.addEventListener('input', function () {
      state.founder.name = fName.value;
      renderSummaryCards();
      renderRadarAndBars();
      renderFounderOutputs();
      const lbl = document.getElementById('vd-scan-target-label');
      if (lbl) lbl.textContent = getActiveTarget().name;
    });
    if (fSector) fSector.addEventListener('change', function () {
      state.founder.sector = fSector.value;
      renderSummaryCards();
      renderFounderOutputs();
    });
    if (fHost) fHost.addEventListener('input', function () {
      state.founder.hosting = fHost.value;
      renderFounderOutputs();
    });
    if (fContact) fContact.addEventListener('input', function () {
      state.founder.contact = fContact.value;
      renderFounderOutputs();
    });

    const fSeedBtn = document.getElementById('vd-founder-seed-btn');
    if (fSeedBtn) {
      fSeedBtn.addEventListener('click', function () {
        state.founder.ratings = Object.assign(makeBlankRatings(), PRESETS.founder_seed.ratings);
        state.founder.notes = Object.assign({}, PRESETS.founder_seed.notes);
        renderAll();
        showToast('Loaded Seed-Stage SaaS baseline.');
      });
    }

    const fEntBtn = document.getElementById('vd-founder-ent-btn');
    if (fEntBtn) {
      fEntBtn.addEventListener('click', function () {
        state.founder.ratings = Object.assign(makeBlankRatings(), PRESETS.founder_enterprise.ratings);
        state.founder.notes = Object.assign({}, PRESETS.founder_enterprise.notes);
        renderAll();
        showToast('Loaded Enterprise-Ready baseline.');
      });
    }

    const fResetBtn = document.getElementById('vd-founder-reset-btn');
    if (fResetBtn) {
      fResetBtn.addEventListener('click', function () {
        state.founder.ratings = makeBlankRatings();
        state.founder.notes = {};
        renderAll();
        showToast('Reset founder self-audit to blank slate.');
      });
    }

    // Layout toggle
    const singleBtn = document.getElementById('vd-layout-single');
    const matrixBtn = document.getElementById('vd-layout-matrix');
    if (singleBtn) {
      singleBtn.addEventListener('click', function () {
        state.layout = 'single';
        renderControls();
        renderFiltersAndBanner();
        renderChecks();
      });
    }
    if (matrixBtn) {
      matrixBtn.addEventListener('click', function () {
        state.layout = 'matrix';
        renderControls();
        renderFiltersAndBanner();
        renderChecks();
      });
    }

    // Active vendor name input inside banner (delegated)
    const activeBanner = document.getElementById('vd-active-vendor-banner');
    if (activeBanner) {
      activeBanner.addEventListener('input', function (e) {
        if (e.target && e.target.id === 'vd-active-name-input' && state.mode === 'buyer') {
          state.vendors[state.activeVendorIdx].name = e.target.value;
          renderControls();
          renderSummaryCards();
          renderRadarAndBars();
          renderBlockerAlerts();
          renderBuyerRfpQuestions();
        }
      });
    }

    // Filter chips
    const filterBar = document.getElementById('vd-pillar-filter');
    if (filterBar) {
      filterBar.addEventListener('click', function (e) {
        const chip = e.target.closest('[data-filter]');
        if (!chip) return;
        state.filter = chip.getAttribute('data-filter') || 'all';
        renderFiltersAndBanner();
        renderChecks();
      });
    }

    // 25-check rating clicks, note edits, and matrix selects
    const checksContainer = document.getElementById('vd-checks-container');
    if (checksContainer) {
      checksContainer.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-rate-check]');
        if (!btn) return;
        const cid = btn.getAttribute('data-rate-check');
        const val = btn.getAttribute('data-rate-val');
        const target = getActiveTarget();
        target.ratings[cid] = val;
        renderAll();
      });

      checksContainer.addEventListener('input', function (e) {
        const noteInput = e.target.closest('[data-note-check]');
        if (!noteInput) return;
        const cid = noteInput.getAttribute('data-note-check');
        const target = getActiveTarget();
        target.notes[cid] = noteInput.value;
        if (state.mode === 'buyer') renderBuyerRfpQuestions();
        else renderFounderOutputs();
      });

      checksContainer.addEventListener('change', function (e) {
        const sel = e.target.closest('[data-matrix-vendor]');
        if (!sel) return;
        const vIdx = parseInt(sel.getAttribute('data-matrix-vendor'), 10);
        const cid = sel.getAttribute('data-check-id');
        if (!isNaN(vIdx) && state.vendors[vIdx]) {
          state.vendors[vIdx].ratings[cid] = sel.value;
          sel.setAttribute('data-val', sel.value);
          renderControls();
          renderSummaryCards();
          renderRadarAndBars();
          renderBlockerAlerts();
          renderBuyerRfpQuestions();
        }
      });
    }

    // RFP filters & copy
    const rfpScope = document.getElementById('vd-rfp-scope');
    const rfpSev = document.getElementById('vd-rfp-severity');
    if (rfpScope) {
      rfpScope.addEventListener('change', function () {
        state.rfpScope = rfpScope.value;
        renderBuyerRfpQuestions();
      });
    }
    if (rfpSev) {
      rfpSev.addEventListener('change', function () {
        state.rfpSeverity = rfpSev.value;
        renderBuyerRfpQuestions();
      });
    }

    const copyRfpBtn = document.getElementById('vd-copy-rfp-btn');
    if (copyRfpBtn) {
      copyRfpBtn.addEventListener('click', function () {
        const items = getRfpQuestionsList();
        if (items.length === 0) {
          showToast('No RFP questions to copy.');
          return;
        }
        const text = items.map(function (it, i) {
          return (i + 1) + '. [' + it.vendorName + ' - ' + it.check.name + (it.check.blocker ? ' | DEAL-BLOCKER' : '') + ']\n' + it.check.rfpQuestion;
        }).join('\n\n');
        copyText(text, 'Copied ' + items.length + ' RFP follow-up questions to clipboard.');
      });
    }

    // Export actions
    const copyMdBtn = document.getElementById('vd-copy-md-btn');
    if (copyMdBtn) {
      copyMdBtn.addEventListener('click', function () {
        const md = state.mode === 'founder' ? generateFounderOnePagerMarkdown() : generateBuyerMarkdown();
        copyText(md, state.mode === 'founder' ? 'Copied Enterprise AI Trust One-Pager (Markdown).' : 'Copied Procurement Scorecard & RFP Questions (Markdown).');
      });
    }

    const copyOnePagerBtn = document.getElementById('vd-copy-onepager-btn');
    if (copyOnePagerBtn) {
      copyOnePagerBtn.addEventListener('click', function () {
        copyText(generateFounderOnePagerMarkdown(), 'Copied Enterprise AI Trust One-Pager (Markdown).');
      });
    }

    const downloadMdBtn = document.getElementById('vd-download-md-btn');
    if (downloadMdBtn) {
      downloadMdBtn.addEventListener('click', function () {
        const md = state.mode === 'founder' ? generateFounderOnePagerMarkdown() : generateBuyerMarkdown();
        const fname = state.mode === 'founder' ? 'enterprise-ai-trust-one-pager.md' : 'ai-vendor-procurement-scorecard.md';
        downloadFile(fname, md, 'text/markdown;charset=utf-8');
        showToast('Downloaded ' + fname);
      });
    }

    const exportCsvBtn = document.getElementById('vd-export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', function () {
        const csv = generateCsv();
        downloadFile('ai-vendor-diligence-scorecard.csv', csv, 'text/csv;charset=utf-8');
        showToast('Exported CSV scorecard.');
      });
    }

    const copyUrlBtn = document.getElementById('vd-copy-url-btn');
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', function () {
        const url = buildShareUrl();
        try {
          window.history.replaceState(null, '', url);
        } catch (_e) { /* ignore file:// restrictions */ }
        copyText(url, 'Copied shareable scorecard URL to clipboard.');
      });
    }

    const printBtn = document.getElementById('vd-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    // Red-Flag Scanner controls
    const termsInput = document.getElementById('vd-terms-input');
    if (termsInput) {
      termsInput.addEventListener('input', updateTermsWordCount);
    }

    const loadRiskyBtn = document.getElementById('vd-load-risky-btn');
    if (loadRiskyBtn && termsInput) {
      loadRiskyBtn.addEventListener('click', function () {
        termsInput.value = SAMPLE_RISKY_TERMS;
        updateTermsWordCount();
        runTermsScan();
        showToast('Loaded sample risky AI terms and ran local clause scan.');
      });
    }

    const scanBtn = document.getElementById('vd-scan-btn');
    if (scanBtn) {
      scanBtn.addEventListener('click', runTermsScan);
    }

    const clearTermsBtn = document.getElementById('vd-clear-terms-btn');
    if (clearTermsBtn && termsInput) {
      clearTermsBtn.addEventListener('click', function () {
        termsInput.value = '';
        updateTermsWordCount();
        const res = document.getElementById('vd-scan-results');
        const badge = document.getElementById('vd-scanner-badge');
        if (res) res.hidden = true;
        if (badge) badge.hidden = true;
        state.lastScan = null;
      });
    }

    const findingsList = document.getElementById('vd-findings-list');
    if (findingsList) {
      findingsList.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-apply-finding]');
        if (!btn || !state.lastScan) return;
        const idx = parseInt(btn.getAttribute('data-apply-finding'), 10);
        const f = state.lastScan.findings[idx];
        if (f) {
          applyFindingToActive(f);
          renderAll();
          showToast('Updated "' + CHECK_BY_ID[f.rule.checkId].name + '" on ' + getActiveTarget().name + '.');
        }
      });
    }

    const applyAllBtn = document.getElementById('vd-apply-all-flags-btn');
    if (applyAllBtn) {
      applyAllBtn.addEventListener('click', function () {
        if (!state.lastScan || !state.lastScan.findings.length) return;
        // Apply positive first, then med, then high so high risks win on same check
        const order = { good: 0, med: 1, high: 2 };
        const sorted = state.lastScan.findings.slice().sort(function (a, b) {
          return (order[a.rule.severity] || 0) - (order[b.rule.severity] || 0);
        });
        sorted.forEach(applyFindingToActive);
        renderAll();
        showToast('Applied ' + sorted.length + ' clause flag(s) to ' + getActiveTarget().name + '.');
      });
    }

    const copyEmailBtn = document.getElementById('vd-copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', function () {
        const pre = document.getElementById('vd-email-preview');
        if (pre && pre.textContent.trim()) {
          copyText(pre.textContent, 'Copied vendor legal clarification email to clipboard.');
        }
      });
    }

    // Back to top
    const btt = document.getElementById('back-to-top');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    const restored = hydrateFromHash();
    bindEvents();
    updateTermsWordCount();
    renderAll();
    if (restored) {
      showToast('Restored shared scorecard from URL.');
    }
  });
})();
