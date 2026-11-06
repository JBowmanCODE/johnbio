/**
 * Pure Markdown formatting, path normalisation, route registry, and
 * privacy/disclosure validation for JohnB.io (`https://johnb.io`).
 *
 * IMPORTANT: Keep this module 100% pure (no `fs`, `path`, `server-only`,
 * or database imports) so unit tests and `scripts/markdown-check.ts`
 * can import and test it directly.
 */

export const SITE_ORIGIN = 'https://johnb.io';

export type RouteCategory =
  | 'core'
  | 'ai-tool'
  | 'dev-tool'
  | 'digital-tool'
  | 'rai'
  | 'news-hub'
  | 'news-article'
  | 'course-hub'
  | 'course-lesson'
  | 'optional';

export interface RouteMeta {
  canonicalPath: string;
  canonicalUrl: string;
  mdPath: string;
  mdUrl: string;
  title: string;
  summary: string;
  category: RouteCategory;
  requiredDisclosures?: string[];
}

export type ContentBlock =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'definition'; term: string; definition: string }
  | { type: 'callout'; label: string; text: string }
  | { type: 'code'; language?: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'stat_grid'; stats: Array<{ value: string; label: string }> }
  | { type: 'howto'; title?: string; steps: Array<{ name: string; text: string }> }
  | { type: 'keypoints'; title?: string; points: string[] }
  | { type: 'faq'; items: Array<{ question: string; answer: string }> }
  | { type: 'sources'; items: Array<{ title: string; url?: string; note?: string }> }
  | { type: 'author_bio'; name: string; role: string; bio: string; profileUrl: string };

export interface PageDocument {
  canonicalPath: string;
  canonicalUrl: string;
  mdPath: string;
  mdUrl: string;
  title: string;
  summary: string;
  category: RouteCategory;
  author?: string;
  authorUrl?: string;
  publishedDate?: string;
  modifiedDate?: string;
  readTime?: string;
  unitBadge?: string;
  disclosures: string[];
  blocks: ContentBlock[];
}

export interface ToolSummaryItem {
  id: string;
  title: string;
  canonicalPath: string;
  canonicalUrl: string;
  mdUrl: string;
  category: 'ai' | 'dev' | 'digital' | 'rai';
  badge: string;
  summary: string;
}

export interface NewsSummaryItem {
  slug: string;
  title: string;
  canonicalUrl: string;
  mdUrl: string;
  excerpt: string;
  category: string;
  date: string;
  dateDisplay: string;
  readTime: string;
}

export interface CourseLessonSummaryItem {
  id: string;
  unitId: number;
  unitTitle: string;
  slug: string;
  canonicalPath: string;
  canonicalUrl: string;
  mdUrl: string;
  title: string;
  duration: string;
  summary: string;
}

export interface SiteDataBundle {
  regulationCount: number;
  jurisdictionCount: number;
  toolCount: number;
  lessonCount: number;
  unitCount: number;
  articleCount: number;
  tools: ToolSummaryItem[];
  news: NewsSummaryItem[];
  lessons: CourseLessonSummaryItem[];
  pages: PageDocument[];
}

/**
 * Prefixes and exact paths that must NEVER be served as Markdown
 * (private, authenticated, API, utility fragments, or noindex pages).
 */
export const PRIVATE_OR_NOINDEX_PREFIXES: readonly string[] = [
  '/api',
  '/_next',
  '/admin',
  '/dashboard',
  '/account',
  '/auth',
  '/login',
  '/exam',
  '/certificate',
  '/wo',
  '/404',
  '/header',
  '/footer',
  '/cgi-bin',
  '/workers',
  '/tests',
  '/docs',
  '/flask_app',
];

export const EXCLUDED_EXACT_PATHS: readonly string[] = [
  '/llms.txt',
  '/llms-full.txt',
  '/sitemap.xml',
  '/robots.txt',
  '/igaming-regulations.json',
  '/favicon.ico',
  '/favicon.png',
];

/**
 * Deleted/withdrawn routes that have no replacement content and should return 410 Gone
 * when requested as Markdown, plus legacy redirected slugs.
 */
export const WITHDRAWN_GONE_PATHS: readonly string[] = [
  '/project-insights',
  '/michael-scott',
  '/heart',
];

/**
 * Registry of all 75 public indexable routes in `sitemap.xml`.
 * Adding a route to `sitemap.xml` without registering it here fails `scripts/markdown-check.ts`.
 */
export const STATIC_ROUTE_REGISTRY: Readonly<Record<string, RouteMeta>> = (() => {
  const raw: Array<{
    path: string;
    title: string;
    summary: string;
    category: RouteCategory;
    requiredDisclosures?: string[];
  }> = [
    // Core & Optional Standing Pages (6)
    {
      path: '/',
      title: 'JohnB.io - Free AI Tools, iGaming Compliance Utilities & AI Course',
      summary:
        'A personal AI and development project site by John Bowman featuring 28 free AI-powered tools, a 35-lesson AI & machine learning course, responsible AI frameworks, and iGaming compliance utilities.',
      category: 'core',
    },
    {
      path: '/about',
      title: 'About John Bowman',
      summary:
        'John Bowman, AI strategist and developer based in Leeds, UK with 20+ years in iGaming and digital marketing, University of Oxford AI Programme graduate (2024), and creator of the free AI tools on JohnB.io.',
      category: 'core',
    },
    {
      path: '/contact',
      title: 'Contact John Bowman',
      summary:
        'Get in touch with John Bowman via the contact form or LinkedIn, and submit UK GDPR data and privacy requests.',
      category: 'optional',
      requiredDisclosures: ['UK GDPR'],
    },
    {
      path: '/privacy',
      title: 'Privacy Policy',
      summary:
        'How JohnB.io handles analytics, AI tool inputs, registered course accounts, cookies, and UK GDPR data protection rights.',
      category: 'optional',
      requiredDisclosures: ['UK GDPR'],
    },
    {
      path: '/terms',
      title: 'Terms of Service',
      summary:
        'Terms and conditions governing use of the free AI tools, developer utilities, and AI & Machine Learning Course on JohnB.io.',
      category: 'optional',
    },
    {
      path: '/verify',
      title: 'Verify a Course Certificate',
      summary:
        'Public verification page for AI & Machine Learning Course certificates issued by JohnB.io (format: johnb.io/verify/JB-2026-XXXXXX).',
      category: 'optional',
    },

    // AI Tools (11)
    {
      path: '/search-radar',
      title: 'Search & Prompt Radar',
      summary:
        'Free keyword and prompt research tool that pulls live autocomplete suggestions from Google Search and YouTube, Reddit search intent, recent Hacker News threads and LinkedIn B2B modifiers, then synthesises likely ChatGPT, Perplexity and Claude prompts using Claude Haiku 5.5.',
      category: 'ai-tool',
      requiredDisclosures: ['not taken from ChatGPT', 'synthesised'],
    },
    {
      path: '/meditation',
      title: 'AI Meditation Generator',
      summary:
        'Generates personalised guided meditations with Claude Sonnet 5.5 scripts, OpenAI TTS narration, and 10 browser-synthesised Web Audio soundscapes in 25 languages across 5, 10 or 20-minute sessions.',
      category: 'ai-tool',
      requiredDisclosures: ['not medical advice'],
    },
    {
      path: '/live-poker-hand-replayer',
      title: 'Live Poker Hand Replayer',
      summary:
        "Turn any live No Limit Hold'em poker hand into an animated table replay using a guided form or AI note parser powered by Claude Haiku 5.5, with optional OpenAI TTS commentary, share links and iframe embeds.",
      category: 'ai-tool',
    },
    {
      path: '/aitocv',
      title: 'AI CV Enhancer',
      summary:
        'Upload a CV (PDF, DOCX or TXT) and job description to get a tailored CV, cover letter, suitability match score and interview prep powered by Claude Sonnet 5.5 in 9 language variants, plus integrated job board search.',
      category: 'ai-tool',
      requiredDisclosures: ['does not log, store or share'],
    },
    {
      path: '/editor',
      title: 'AI Copyeditor',
      summary:
        'Paste or upload text and Word documents for AI-powered copyediting powered by Claude Sonnet 5.5 with UK/US English support, custom brand style guide rules and excluded words.',
      category: 'ai-tool',
    },
    {
      path: '/genz',
      title: 'Gen Z Translator',
      summary:
        'AI-powered translator using Claude Haiku 5.5 that rewrites plain English into Gen Z slang and translates Gen Z slang back into plain English.',
      category: 'ai-tool',
    },
    {
      path: '/lm-chat',
      title: 'LLM Chat',
      summary:
        'Side-by-side chat interface comparing Anthropic Claude, OpenAI GPT and Google Gemini responses to the same prompt in real time.',
      category: 'ai-tool',
    },
    {
      path: '/transcripts',
      title: 'YouTube Blog Post Generator',
      summary:
        'Paste a YouTube video URL or transcript and get a structured, SEO-optimised blog post generated by Claude Haiku 5.5.',
      category: 'ai-tool',
    },
    {
      path: '/text-to-speech',
      title: 'Text to Speech Converter',
      summary:
        'Convert text up to 4,000 characters to natural-sounding speech and download as MP3 using OpenAI TTS (tts-1) with six voices and adjustable speed.',
      category: 'ai-tool',
    },
    {
      path: '/football-2026',
      title: 'Football 2026',
      summary:
        'AI predictions for the Summer 2026 football tournament covering group stage results, interactive knockout bracket, squad ratings and win probabilities for all 48 teams.',
      category: 'ai-tool',
    },
    {
      path: '/recipe-shopping-list',
      title: 'Recipe to Shopping List',
      summary:
        "Paste a recipe or weekly meal plan to get one consolidated UK supermarket shopping list powered by Claude Haiku 5.5, grouped by aisle with US-to-UK ingredient translation and search links for Tesco, Sainsbury's, Asda, Morrisons, Ocado, Waitrose, Iceland and Co-op.",
      category: 'ai-tool',
    },

    // Developer & iGaming Tools (10)
    {
      path: '/linkedin-analyser',
      title: 'LinkedIn Analytics Analyser',
      summary:
        'Free browser-based LinkedIn Creator Analytics .xlsx analyser with a 0-100 health score, creator type diagnosis, compound monthly growth rate (CMGR) projections, URL-slug post theme detection, audience vs content reach comparison, shareable summary cards, PDF report and AI-ready Markdown export.',
      category: 'dev-tool',
      requiredDisclosures: ['never leaves your browser', 'Not affiliated with or endorsed by LinkedIn'],
    },
    {
      path: '/bonus-calculator',
      title: 'iGaming Bonus Cost Calculator',
      summary:
        'Model the true operator cost of casino bonus offers from bonus amount, wagering requirement, house edge and player completion rate, with breakeven analysis and scenario tables.',
      category: 'dev-tool',
    },
    {
      path: '/rg-generator',
      title: 'iGaming RG Message Generator',
      summary:
        'Generate compliant responsible gambling disclaimers for 10 regulated jurisdictions including UK (UKGC), Malta (MGA), Ontario, Netherlands, Sweden, Denmark, Germany, Ireland, Spain and Gibraltar.',
      category: 'dev-tool',
    },
    {
      path: '/igaming-compliance',
      title: 'iGaming Regulatory Compliance Map',
      summary:
        'Interactive world map and CC BY 4.0 dataset of 212 iGaming regulations across 50 jurisdictions covering gambling laws, AML directives, data protection rules and advertising codes.',
      category: 'dev-tool',
    },
    {
      path: '/pdf-merger',
      title: 'PDF Merger',
      summary:
        'Merge multiple PDF files into one document directly in the browser using pdf-lib with drag-and-drop reordering and zero server uploads.',
      category: 'dev-tool',
    },
    {
      path: '/ebay',
      title: 'eBay & Vinted Profit Calculator',
      summary:
        'Calculate net profit and ROI from eBay, Vinted and auction saleroom sales after platform fees, buyer premiums, postage and purchase costs.',
      category: 'dev-tool',
    },
    {
      path: '/calculator',
      title: 'Bill Calculator',
      summary:
        'Split restaurant bills and calculate tips per person in the browser using Python running client-side via Pyodide.',
      category: 'dev-tool',
    },
    {
      path: '/bankroll',
      title: 'Poker Bankroll Planner',
      summary:
        'Evaluate poker experience level, session time and budget to plan a recommended game format, stake level and bankroll strategy.',
      category: 'dev-tool',
      requiredDisclosures: ['GambleAware', 'no affiliation with any gambling operator'],
    },
    {
      path: '/text-to-voice',
      title: 'Text to Voice',
      summary:
        'Browser-based text-to-speech reader using the Web Speech API with voice selection, speed control and live word-by-word subtitle highlighting.',
      category: 'dev-tool',
    },
    {
      path: '/zzmystery',
      title: 'Zig-Zag Drop Mystery',
      summary:
        'Interactive browser pachinko and plinko slot drop game demo with configurable ball drops, risk tiers, multipliers and mystery prize mechanics.',
      category: 'optional',
      requiredDisclosures: ['virtual points only', 'GambleAware'],
    },

    // Digital AI Tools (7)
    {
      path: '/tcs-simplifier',
      title: 'T&Cs Simplifier',
      summary:
        'Paste casino bonus terms and conditions to get a plain English summary, red flag list and key numbers block (wagering, expiry, max bet, max win) powered by Claude Haiku 5.5.',
      category: 'digital-tool',
      requiredDisclosures: ['not legal advice'],
    },
    {
      path: '/prompt-improver',
      title: 'Prompt Improver',
      summary:
        'Rewrites weak AI prompts into stronger versions with a short change log using Claude Haiku 5.5, plus a starter library for common tasks across ChatGPT, Claude and Gemini.',
      category: 'digital-tool',
    },
    {
      path: '/faq-schema',
      title: 'FAQ Schema Generator',
      summary:
        'Turns question and answer pairs into valid FAQPage JSON-LD structured data with a manual builder and an AI draft mode powered by Claude Haiku 5.5.',
      category: 'digital-tool',
    },
    {
      path: '/content-repurposer',
      title: 'Content Repurposer',
      summary:
        'AI-powered tool using Claude Haiku 5.5 that repurposes blog posts or articles into LinkedIn posts, X threads, Facebook posts, email newsletters and 10s/30s video scripts.',
      category: 'digital-tool',
    },
    {
      path: '/promo-copy',
      title: 'iGaming Promo Copy Generator',
      summary:
        'Generate compliant iGaming promotional copy for 10 regulated markets using Claude Haiku 5.5 with headlines, body copy, CTAs, T&C summaries and market-specific disclaimers.',
      category: 'digital-tool',
    },
    {
      path: '/igaming-jargon',
      title: 'iGaming Jargon Translator',
      summary:
        'AI-powered tool using Claude Haiku 5.5 that translates iGaming industry terminology (GGR, NGR, RTP, KYC/AML, CPA, RevShare) to plain English and vice versa.',
      category: 'digital-tool',
    },
    {
      path: '/llms-generator',
      title: 'LLMs.txt Generator',
      summary:
        'AI-powered tool using Claude Haiku 5.5 that generates a structured llms.txt file from a URL or pasted content following the llmstxt.org specification.',
      category: 'digital-tool',
    },

    // Responsible AI (1)
    {
      path: '/rai',
      title: 'RAI Governance Framework',
      summary:
        'Interactive browser-based responsible AI governance toolkit covering principles, EU AI Act risk tiering, RACI responsibility matrices, pre-deployment checklists, system cards and an AI system registry.',
      category: 'rai',
    },

    // News Hub & Articles (5)
    {
      path: '/news/',
      title: 'News and Insights',
      summary:
        'Practical articles and analysis on AI models, generative engine optimisation (GEO), AI coding tools and digital strategy by John Bowman.',
      category: 'news-hub',
    },
    {
      path: '/news/ai-models-2026',
      title: 'AI Models in 2026: What Actually Changed in the Last 12 Months',
      summary:
        "A sourced review of AI progress from August 2025 to August 2026 covering Anthropic's Claude Opus 5 and Sonnet 5.5, OpenAI's GPT-5.6 and the Sora shutdown, Google Gemini 3, open-weight models, and the METR developer productivity trial.",
      category: 'news-article',
    },
    {
      path: '/news/ai-music-88-million-views',
      title: 'What Happens When Your AI Songs Get 88 Million Views',
      summary:
        'How John Bowman generated 88 million streams with AI music in 2024-2026, why it paid £600 in total, and how short-form video reach differs from streaming royalties.',
      category: 'news-article',
    },
    {
      path: '/news/geo-generative-engine-optimisation',
      title: 'GEO: A Practical Guide to Generative Engine Optimisation in 2026',
      summary:
        'Explains what Generative Engine Optimisation (GEO) is, how it differs from traditional SEO, what AI retrieval systems extract, whether llms.txt works, and practical steps to earn citations in ChatGPT, Perplexity and Google AI Overviews.',
      category: 'news-article',
    },
    {
      path: '/news/claude-code-vsc',
      title: 'Claude Code VSC: AI Coding for Beginners',
      summary:
        "Beginner's guide to Anthropic's Claude Code VS Code extension covering installation, CLAUDE.md project briefings, pricing (Claude Max vs API credits), and practical first workflows.",
      category: 'news-article',
    },

    // AI Course Hub & 35 Lessons (36)
    {
      path: '/course/',
      title: 'AI & Machine Learning Course',
      summary:
        'Free 9-unit, 35-lesson AI and machine learning course with certificate covering AI fundamentals, ethics, Python, machine learning, deep learning, generative AI, MLOps and business strategy.',
      category: 'course-hub',
    },
    {
      path: '/course/what-is-ai',
      title: 'What Is AI? History, Definitions and the Turing Test',
      summary:
        "Covers AI history from the 1950s Dartmouth Workshop, Alan Turing's 1950 test, AI winters, and why modern AI is pattern matching at scale.",
      category: 'course-lesson',
    },
    {
      path: '/course/categories-of-ai',
      title: 'Categories of AI: Narrow, General and Super AI',
      summary:
        'Explains the three tiers of AI capability: Artificial Narrow Intelligence (ANI), Artificial General Intelligence (AGI), and Artificial Superintelligence (ASI).',
      category: 'course-lesson',
    },
    {
      path: '/course/how-ai-learns',
      title: 'How AI Learns: Supervised, Unsupervised and Reinforcement Learning',
      summary:
        'The three core learning paradigms that power modern AI systems, with practical examples of labelled training, clustering and reward-driven agents.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-vs-augmented-intelligence',
      title: 'AI vs Augmented Intelligence',
      summary:
        'Explores the practical distinction between autonomous AI replacing human tasks and augmented intelligence enhancing human judgment.',
      category: 'course-lesson',
    },
    {
      path: '/course/traditional-vs-generative-ai',
      title: 'Traditional AI vs Generative AI',
      summary:
        'How rules-based and predictive statistical AI differs from modern generative foundation models that synthesise text, code, audio and images.',
      category: 'course-lesson',
    },
    {
      path: '/course/ml-deep-learning-neural-networks',
      title: 'ML, Deep Learning and Neural Networks',
      summary:
        'How classical machine learning, multi-layer neural networks and deep learning fit together and when simpler models outperform deep networks.',
      category: 'course-lesson',
    },
    {
      path: '/course/key-ai-subfields',
      title: 'Key AI Subfields',
      summary:
        'Overview of natural language processing (NLP), computer vision, speech recognition, robotics and recommender systems.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-tools-platforms-2026',
      title: 'AI Tools and Platforms in 2026',
      summary:
        'Survey of the leading foundation models, APIs, cloud ML platforms and developer tools used in production in 2026.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-failures-ethics',
      title: 'AI Failures and Ethics',
      summary:
        'Real-world case studies of AI deployment failures and the ethical governance principles needed to prevent harm.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-hallucinations-bias-ip',
      title: 'Hallucinations, Bias and IP',
      summary:
        'Why large language models hallucinate, how training data bias propagates into decisions, and copyright and intellectual property considerations.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-governance-frameworks',
      title: 'AI Governance Frameworks',
      summary:
        'How organisations and regulators govern AI systems under the EU AI Act, NIST AI RMF, ISO/IEC 42001 and UK AI principles.',
      category: 'course-lesson',
    },
    {
      path: '/course/python-essentials-for-ai',
      title: 'Python Essentials for AI',
      summary:
        'Core Python data structures, functions, comprehensions and environment management required for machine learning workflows.',
      category: 'course-lesson',
    },
    {
      path: '/course/numpy-pandas',
      title: 'NumPy and Pandas',
      summary:
        'Vectorised array operations in NumPy and tabular data cleaning, filtering and aggregation with Pandas.',
      category: 'course-lesson',
    },
    {
      path: '/course/linear-regression-gradient-descent',
      title: 'Linear Regression and Gradient Descent',
      summary:
        'How linear regression models continuous outcomes and how gradient descent iteratively minimises a loss function.',
      category: 'course-lesson',
    },
    {
      path: '/course/logistic-regression-classification',
      title: 'Logistic Regression and Classification',
      summary:
        'Binary and multi-class classification using the sigmoid function, log-loss optimisation and decision thresholds.',
      category: 'course-lesson',
    },
    {
      path: '/course/model-evaluation',
      title: 'Model Evaluation',
      summary:
        'Measuring model performance with accuracy, precision, recall, F1-score, confusion matrices, ROC-AUC and cross-validation.',
      category: 'course-lesson',
    },
    {
      path: '/course/key-ml-algorithms',
      title: 'Key ML Algorithms',
      summary:
        'Decision trees, random forests, gradient boosting, support vector machines (SVMs) and k-nearest neighbours compared.',
      category: 'course-lesson',
    },
    {
      path: '/course/biological-vs-artificial-neurons',
      title: 'Biological vs Artificial Neurons',
      summary:
        'How biological neurons inspired the mathematical perceptron, weights, biases and activation thresholds.',
      category: 'course-lesson',
    },
    {
      path: '/course/neural-networks-forward-propagation',
      title: 'Neural Networks and Forward Propagation',
      summary:
        'How input features flow through input, hidden and output layers via matrix multiplication and non-linear activations.',
      category: 'course-lesson',
    },
    {
      path: '/course/backpropagation',
      title: 'Backpropagation',
      summary:
        'How neural networks learn by applying the chain rule of calculus to propagate error gradients backward through layers.',
      category: 'course-lesson',
    },
    {
      path: '/course/activation-functions-vanishing-gradient',
      title: 'Activation Functions and the Vanishing Gradient',
      summary:
        'ReLU, sigmoid, tanh and softmax compared, and how vanishing or exploding gradients affect deep network training.',
      category: 'course-lesson',
    },
    {
      path: '/course/tensorflow-pytorch-keras',
      title: 'TensorFlow, PyTorch and Keras',
      summary:
        'Practical comparison of PyTorch, TensorFlow and Keras for research prototyping and production deep learning.',
      category: 'course-lesson',
    },
    {
      path: '/course/cnns-with-keras',
      title: 'CNNs with Keras',
      summary:
        'Convolutional layers, pooling, feature maps and building image classification models with Keras.',
      category: 'course-lesson',
    },
    {
      path: '/course/rnns-transformers-autoencoders',
      title: 'RNNs, Transformers and Autoencoders',
      summary:
        'Sequence modelling from recurrent neural networks and LSTMs to self-attention transformers and autoencoders.',
      category: 'course-lesson',
    },
    {
      path: '/course/generative-ai-models',
      title: 'Generative AI Models',
      summary:
        'How Variational Autoencoders (VAEs), Generative Adversarial Networks (GANs), diffusion models and autoregressive LLMs generate content.',
      category: 'course-lesson',
    },
    {
      path: '/course/prompt-engineering-ai-agents',
      title: 'Prompt Engineering and AI Agents',
      summary:
        'System prompts, few-shot examples, structured outputs, tool calling and autonomous multi-step AI agent loops.',
      category: 'course-lesson',
    },
    {
      path: '/course/rag-finetuning-enterprise-ai',
      title: 'RAG, Fine-tuning and Enterprise AI',
      summary:
        'When to use Retrieval-Augmented Generation (RAG) with vector search versus fine-tuning weights for enterprise AI systems.',
      category: 'course-lesson',
    },
    {
      path: '/course/intro-to-mlops',
      title: 'Intro to MLOps',
      summary:
        'Bridging the gap between Jupyter notebook experiments and reproducible, monitored production machine learning systems.',
      category: 'course-lesson',
    },
    {
      path: '/course/model-deployment',
      title: 'Model Deployment',
      summary:
        'Serving machine learning models via REST APIs, batch inference vs real-time endpoints, containerisation and latency trade-offs.',
      category: 'course-lesson',
    },
    {
      path: '/course/monitoring-drift',
      title: 'Monitoring and Drift',
      summary:
        'Detecting data drift, concept drift and silent performance degradation in production ML and LLM pipelines.',
      category: 'course-lesson',
    },
    {
      path: '/course/cicd-for-ml',
      title: 'CI/CD for ML',
      summary:
        'Automated testing, data validation, model registry versioning and continuous delivery pipelines for machine learning.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-adoption-journey',
      title: 'AI Adoption Journey',
      summary:
        'How organisations progress from ad-hoc AI pilots to governed, measurable production capabilities.',
      category: 'course-lesson',
    },
    {
      path: '/course/build-vs-buy',
      title: 'Build vs Buy',
      summary:
        'Framework for deciding when to buy commercial AI SaaS, integrate foundation model APIs, or train custom models.',
      category: 'course-lesson',
    },
    {
      path: '/course/ai-across-industries',
      title: 'AI Across Industries',
      summary:
        'Where AI delivers measurable value across healthcare, finance, iGaming, retail, marketing and software engineering.',
      category: 'course-lesson',
    },
    {
      path: '/course/business-case-for-ai',
      title: 'Making the Business Case for AI',
      summary:
        'How to scope AI projects around specific bottlenecks, estimate token and infrastructure costs, and measure real ROI.',
      category: 'course-lesson',
    },
  ];

  const out: Record<string, RouteMeta> = {};
  for (const item of raw) {
    const mdPath =
      item.path === '/'
        ? '/index.md'
        : item.path.endsWith('/')
          ? `${item.path}index.md`
          : `${item.path}.md`;
    out[item.path] = {
      canonicalPath: item.path,
      canonicalUrl: `${SITE_ORIGIN}${item.path}`,
      mdPath,
      mdUrl: `${SITE_ORIGIN}${mdPath}`,
      title: item.title,
      summary: item.summary,
      category: item.category,
      requiredDisclosures: item.requiredDisclosures,
    };
  }
  return out;
})();

export interface NormalizedMarkdownRoute {
  canonicalPath: string;
  canonicalUrl: string;
  mdPath: string;
  mdUrl: string;
  status: 200 | 404 | 410;
}

/**
 * Normalises a request path for Markdown resolution:
 * - Maps `/index.md`, `/index`, `/` -> `/` (`/index.md`)
 * - Maps `/news/index.md`, `/news.md`, `/news`, `/news/` -> `/news/` (`/news/index.md`)
 * - Maps `/course/index.md`, `/course.md`, `/course`, `/course/` -> `/course/` (`/course/index.md`)
 * - Strips `.md` from any public route
 * - Returns `null` for all private, auth, API, `noindex`, or non-`.md` static asset paths
 * - Returns `status: 410` for withdrawn/deleted routes (`/project-insights`, `/michael-scott`, `/heart`)
 */
export function normalizeMarkdownPath(rawInput: string): NormalizedMarkdownRoute | null {
  if (!rawInput || typeof rawInput !== 'string') return null;

  // Strip query string and hash
  let path = rawInput.split('?')[0].split('#')[0].trim();
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  // Collapse duplicate slashes and reject path traversal
  path = path.replace(/\/+/g, '/');
  if (path.includes('..') || path.includes('\\')) {
    return null;
  }

  const lower = path.toLowerCase();

  // Reject excluded exact paths (like /llms.txt, /llms-full.txt, /sitemap.xml, /robots.txt)
  for (const exact of EXCLUDED_EXACT_PATHS) {
    if (lower === exact || lower === `${exact}.md`) {
      return null;
    }
  }

  // Strip trailing .md if present
  const hasMdSuffix = lower.endsWith('.md');
  const withoutMd = hasMdSuffix ? lower.slice(0, -3) || '/' : lower;

  // Reject any remaining file extension (e.g. .css, .js, .webp, .html, .json, .mp3, .xml)
  if (/\.[a-z0-9]+$/i.test(withoutMd)) {
    return null;
  }

  // Reject private / auth / noindex prefixes
  for (const prefix of PRIVATE_OR_NOINDEX_PREFIXES) {
    if (
      withoutMd === prefix ||
      withoutMd.startsWith(`${prefix}/`)
    ) {
      return null;
    }
  }

  // Check withdrawn/deleted routes (410 Gone)
  const cleanNoTrailing = withoutMd.length > 1 ? withoutMd.replace(/\/$/, '') : withoutMd;
  if (WITHDRAWN_GONE_PATHS.includes(cleanNoTrailing)) {
    return {
      canonicalPath: cleanNoTrailing,
      canonicalUrl: `${SITE_ORIGIN}${cleanNoTrailing}`,
      mdPath: `${cleanNoTrailing}.md`,
      mdUrl: `${SITE_ORIGIN}${cleanNoTrailing}.md`,
      status: 410,
    };
  }

  // Map index routes to their canonical trailing-slash paths
  let canonicalPath = cleanNoTrailing;
  if (canonicalPath === '' || canonicalPath === '/index') {
    canonicalPath = '/';
  } else if (canonicalPath === '/news' || canonicalPath === '/news/index') {
    canonicalPath = '/news/';
  } else if (canonicalPath === '/course' || canonicalPath === '/course/index') {
    canonicalPath = '/course/';
  }

  const meta = STATIC_ROUTE_REGISTRY[canonicalPath];
  if (!meta) {
    return null;
  }

  return {
    canonicalPath: meta.canonicalPath,
    canonicalUrl: meta.canonicalUrl,
    mdPath: meta.mdPath,
    mdUrl: meta.mdUrl,
    status: 200,
  };
}

/**
 * Renders any structured `ContentBlock` into clean, deterministic RFC 7763 Markdown.
 */
export function formatRichBlock(block: ContentBlock): string {
  switch (block.type) {
    case 'heading': {
      const hashes = '#'.repeat(block.level);
      return `${hashes} ${block.text.trim()}`;
    }
    case 'paragraph': {
      return block.text.trim();
    }
    case 'list': {
      return block.items
        .map((item, idx) => (block.ordered ? `${idx + 1}. ${item.trim()}` : `- ${item.trim()}`))
        .join('\n');
    }
    case 'definition': {
      return `**Term:** ${block.term.trim()}. **Definition:** ${block.definition.trim()}`;
    }
    case 'callout': {
      return `> **${block.label.trim()}:** ${block.text.trim()}`;
    }
    case 'code': {
      const lang = block.language ? block.language.trim() : '';
      return `\`\`\`${lang}\n${block.code.replace(/\s+$/, '')}\n\`\`\``;
    }
    case 'table': {
      if (!block.headers.length) return '';
      const esc = (cell: string) => cell.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
      const headerRow = `| ${block.headers.map(esc).join(' | ')} |`;
      const sepRow = `| ${block.headers.map(() => '---').join(' | ')} |`;
      const bodyRows = block.rows.map(
        (r) => `| ${block.headers.map((_, i) => esc(r[i] ?? '')).join(' | ')} |`
      );
      return [headerRow, sepRow, ...bodyRows].join('\n');
    }
    case 'stat_grid': {
      return block.stats
        .map((s) => `- **${s.value.trim()}**: ${s.label.trim()}`)
        .join('\n');
    }
    case 'howto': {
      const title = block.title || 'How It Works';
      const steps = block.steps
        .map((s, idx) => {
          const name = s.name.replace(/^\*+|\*+$/g, '').replace(/\.$/, '').trim();
          const body = s.text.trim();
          const strippedBody = body.replace(/^\*+/, '');
          if (strippedBody.toLowerCase().startsWith(name.toLowerCase())) {
            const remainder = strippedBody
              .slice(name.length)
              .replace(/^[.*:\s-]+/, '')
              .trim();
            return remainder ? `${idx + 1}. **${name}.** ${remainder}` : `${idx + 1}. **${name}.**`;
          }
          return `${idx + 1}. **${name}.** ${body}`;
        })
        .join('\n');
      return `## ${title}\n\n${steps}`;
    }
    case 'keypoints': {
      const title = block.title || 'Key Points';
      const items = block.points.map((p) => `- ${p.trim()}`).join('\n');
      return `## ${title}\n\n${items}`;
    }
    case 'faq': {
      const items = block.items
        .map((item) => `### ${item.question.trim()}\n\n${item.answer.trim()}`)
        .join('\n\n');
      return `## Frequently Asked Questions\n\n${items}`;
    }
    case 'sources': {
      const items = block.items
        .map((s, idx) => {
          const link = s.url ? `[${s.title.trim()}](${s.url.trim()})` : s.title.trim();
          const note = s.note ? ` - ${s.note.trim()}` : '';
          return `${idx + 1}. ${link}${note}`;
        })
        .join('\n');
      return `## Sources & Primary References\n\n${items}`;
    }
    case 'author_bio': {
      return `## About the Author\n\n**[${block.name.trim()}](${block.profileUrl.trim()})** - ${block.role.trim()}\n\n${block.bio.trim()}`;
    }
  }
}

/**
 * Formats a complete `PageDocument` into standalone Markdown with frontmatter-style metadata,
 * disclosures, structured body blocks, and canonical links.
 */
export function formatPageMarkdown(doc: PageDocument): string {
  const lines: string[] = [];

  lines.push(`# ${doc.title.trim()}`);
  lines.push('');
  lines.push(`> ${doc.summary.trim()}`);
  lines.push('');

  const metaLines: string[] = [
    `- **Canonical URL**: ${doc.canonicalUrl}`,
    `- **Markdown URL**: ${doc.mdUrl}`,
  ];
  if (doc.author) {
    const authorDisplay = doc.authorUrl ? `[${doc.author}](${doc.authorUrl})` : doc.author;
    metaLines.push(`- **Author**: ${authorDisplay}`);
  }
  if (doc.unitBadge) {
    metaLines.push(`- **Course Unit**: ${doc.unitBadge}`);
  }
  if (doc.publishedDate) {
    metaLines.push(`- **Published**: ${doc.publishedDate}`);
  }
  if (doc.modifiedDate) {
    metaLines.push(`- **Last Updated**: ${doc.modifiedDate}`);
  }
  if (doc.readTime) {
    metaLines.push(`- **Read Time**: ${doc.readTime}`);
  }
  lines.push(metaLines.join('\n'));

  if (doc.disclosures.length > 0) {
    lines.push('');
    for (const d of doc.disclosures) {
      lines.push(`> **Disclosure:** ${d.trim()}`);
    }
  }

  for (const block of doc.blocks) {
    const rendered = formatRichBlock(block);
    if (rendered) {
      lines.push('');
      lines.push(rendered);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generates `/llms.txt` following the `llmstxt.org` specification:
 * - `# Site Name`
 * - `> One-sentence summary`
 * - Explicit Markdown content negotiation (`Accept: text/markdown`) and `.md` URL instructions + `/llms-full.txt` link
 * - Key site facts
 * - Categorised `##` sections of `- [Title](URL): One-sentence summary`
 * - Ends with `## Optional` for secondary/legal pages
 */
export function formatLlmsTxt(bundle: SiteDataBundle): string {
  const lines: string[] = [
    '# JohnB.io',
    '',
    `> A personal AI and development project site by John Bowman. Built to test, explore and showcase ${bundle.toolCount} free AI-powered tools, a ${bundle.lessonCount}-lesson AI & machine learning course across ${bundle.unitCount} units, responsible AI governance frameworks, and ${bundle.regulationCount} iGaming compliance regulations across ${bundle.jurisdictionCount} jurisdictions.`,
    '',
    'Every public URL on JohnB.io serves clean Markdown for LLMs, answer engines, and automated crawlers via HTTP content negotiation (`Accept: text/markdown`, RFC 7763) or by appending `.md` to the canonical path (for example `https://johnb.io/index.md`, `https://johnb.io/aitocv.md`, `https://johnb.io/news/ai-models-2026.md`, `https://johnb.io/course/what-is-ai.md`). For a single-file concatenated Markdown bundle of the entire site, fetch [llms-full.txt](https://johnb.io/llms-full.txt).',
    '',
    '- **Owner**: John Bowman (https://johnb.io/about) - AI strategist and developer based in Leeds, UK (20+ years in iGaming and digital marketing, University of Oxford AI Programme 2024).',
    `- **Coverage**: ${bundle.toolCount} free browser & AI tools, ${bundle.articleCount} in-depth AI research articles, ${bundle.lessonCount} free AI course lessons, and ${bundle.regulationCount} iGaming regulations across ${bundle.jurisdictionCount} jurisdictions.`,
    '- **Stack & AI Models**: Vanilla HTML, CSS and JavaScript, Cloudflare Workers, Python (Pyodide), Anthropic Claude (Sonnet 5.5 and Haiku 5.5), OpenAI (TTS-1 and GPT), and Google Gemini APIs.',
    '- **Privacy & Disclosures**: All tools are free with no sign-up required. Tool inputs are processed ephemerally via Cloudflare Workers and never logged or stored. Contact and UK GDPR requests are handled via https://johnb.io/contact.',
    '',
    '## Core Pages',
    '',
    `- [Home](${STATIC_ROUTE_REGISTRY['/'].canonicalUrl}): ${STATIC_ROUTE_REGISTRY['/'].summary}`,
    `- [About John Bowman](${STATIC_ROUTE_REGISTRY['/about'].canonicalUrl}): ${STATIC_ROUTE_REGISTRY['/about'].summary}`,
    `- [AI & Machine Learning Course](${STATIC_ROUTE_REGISTRY['/course/'].canonicalUrl}): ${STATIC_ROUTE_REGISTRY['/course/'].summary}`,
    `- [News and Insights](${STATIC_ROUTE_REGISTRY['/news/'].canonicalUrl}): ${STATIC_ROUTE_REGISTRY['/news/'].summary}`,
    '',
    '## AI Tools',
    '',
  ];

  const aiRoutes = Object.values(STATIC_ROUTE_REGISTRY).filter((r) => r.category === 'ai-tool');
  for (const r of aiRoutes) {
    lines.push(`- [${r.title}](${r.canonicalUrl}): ${r.summary}`);
  }

  lines.push('', '## Developer Tools & iGaming Compliance', '');
  const devRoutes = Object.values(STATIC_ROUTE_REGISTRY).filter((r) => r.category === 'dev-tool');
  for (const r of devRoutes) {
    lines.push(`- [${r.title}](${r.canonicalUrl}): ${r.summary}`);
    if (r.canonicalPath === '/igaming-compliance') {
      lines.push(
        `- [iGaming Regulations Dataset (JSON)](https://johnb.io/igaming-regulations.json): Machine-readable CC BY 4.0 export of all ${bundle.regulationCount} iGaming regulations across ${bundle.jurisdictionCount} jurisdictions with official regulator source links.`
      );
    }
  }

  lines.push('', '## Digital AI Tools', '');
  const digitalRoutes = Object.values(STATIC_ROUTE_REGISTRY).filter(
    (r) => r.category === 'digital-tool'
  );
  for (const r of digitalRoutes) {
    lines.push(`- [${r.title}](${r.canonicalUrl}): ${r.summary}`);
  }

  lines.push('', '## Responsible AI', '');
  const raiRoutes = Object.values(STATIC_ROUTE_REGISTRY).filter((r) => r.category === 'rai');
  for (const r of raiRoutes) {
    lines.push(`- [${r.title}](${r.canonicalUrl}): ${r.summary}`);
  }

  lines.push('', '## News and Insights', '');
  lines.push(
    `- [News Index](${STATIC_ROUTE_REGISTRY['/news/'].canonicalUrl}): ${STATIC_ROUTE_REGISTRY['/news/'].summary}`
  );
  for (const post of bundle.news) {
    const meta = STATIC_ROUTE_REGISTRY[post.slug];
    const summary = meta ? meta.summary : post.excerpt;
    lines.push(`- [${post.title}](${post.canonicalUrl}): ${summary}`);
  }

  lines.push('', '## AI & Machine Learning Course', '');
  lines.push(
    `- [AI & Machine Learning Course Hub](${STATIC_ROUTE_REGISTRY['/course/'].canonicalUrl}): ${STATIC_ROUTE_REGISTRY['/course/'].summary}`
  );

  let currentUnit = -1;
  for (const lesson of bundle.lessons) {
    if (lesson.unitId !== currentUnit) {
      currentUnit = lesson.unitId;
      lines.push('', `### Unit ${lesson.unitId} - ${lesson.unitTitle}`);
    }
    const meta = STATIC_ROUTE_REGISTRY[lesson.canonicalPath];
    const summary = meta ? meta.summary : lesson.summary;
    lines.push(`- [${lesson.title}](${lesson.canonicalUrl}): ${summary}`);
  }

  lines.push(
    '',
    '## Machine-Readable Resources',
    '',
    '- [LLMs Index](https://johnb.io/llms.txt): Concise structured directory of all public pages, tools, course lessons and articles on JohnB.io.',
    '- [LLMs Full Reference](https://johnb.io/llms-full.txt): Single-file concatenated Markdown bundle of all standing pages, tool guides, FAQs, articles and course lessons.',
    `- [iGaming Regulations JSON Dataset](https://johnb.io/igaming-regulations.json): CC BY 4.0 dataset of ${bundle.regulationCount} gambling, AML, advertising and data protection regulations across ${bundle.jurisdictionCount} jurisdictions.`,
    '- [XML Sitemap](https://johnb.io/sitemap.xml): Canonical URL list for search and answer engine crawlers.',
    '',
    '## Optional',
    ''
  );

  const optionalRoutes = Object.values(STATIC_ROUTE_REGISTRY).filter(
    (r) => r.category === 'optional'
  );
  for (const r of optionalRoutes) {
    lines.push(`- [${r.title}](${r.canonicalUrl}): ${r.summary}`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generates `/llms-full.txt` by concatenating `/llms.txt` plus the full Markdown of
 * all core standing pages, tools, news articles, and course lessons separated by `---`.
 */
export function formatLlmsFullTxt(bundle: SiteDataBundle): string {
  const sections: string[] = [formatLlmsTxt(bundle).trim()];

  for (const page of bundle.pages) {
    sections.push(formatPageMarkdown(page).trim());
  }

  return sections.join('\n\n---\n\n') + '\n';
}

/**
 * Validates that a rendered Markdown document satisfies privacy, disclosure,
 * and canonical parity rules.
 */
export function validateDisclosureAndPrivacy(
  canonicalPath: string,
  markdown: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const meta = STATIC_ROUTE_REGISTRY[canonicalPath];
  if (!meta) {
    errors.push(`Route ${canonicalPath} is not registered in STATIC_ROUTE_REGISTRY`);
    return { valid: false, errors };
  }

  if (!markdown.startsWith('# ')) {
    errors.push(`Markdown for ${canonicalPath} does not start with a top-level '# ' heading`);
  }

  if (!markdown.includes(meta.canonicalUrl)) {
    errors.push(
      `Markdown for ${canonicalPath} does not include its canonical URL (${meta.canonicalUrl})`
    );
  }

  // Ensure no private/noindex routes are linked as canonical or leaked
  const forbiddenPaths = ['/login', '/exam', '/certificate', '/wo', '/admin', '/dashboard'];
  for (const fp of forbiddenPaths) {
    if (markdown.includes(`https://johnb.io${fp}`)) {
      errors.push(`Markdown for ${canonicalPath} leaks private/noindex URL https://johnb.io${fp}`);
    }
  }

  // Ensure no raw personal email address is exposed (contact is routed via /contact and LinkedIn)
  const emailRegex = /[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|icloud)\.com/i;
  if (emailRegex.test(markdown)) {
    errors.push(`Markdown for ${canonicalPath} exposes a raw personal email address`);
  }

  // Check mandatory page-specific disclosures
  if (meta.requiredDisclosures) {
    const lowerMd = markdown.toLowerCase();
    for (const req of meta.requiredDisclosures) {
      if (!lowerMd.includes(req.toLowerCase())) {
        errors.push(
          `Markdown for ${canonicalPath} is missing required disclosure phrase: "${req}"`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
