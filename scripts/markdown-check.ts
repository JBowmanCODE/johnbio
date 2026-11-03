import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  SITE_ORIGIN,
  STATIC_ROUTE_REGISTRY,
  normalizeMarkdownPath,
  formatRichBlock,
  formatPageMarkdown,
  formatLlmsTxt,
  formatLlmsFullTxt,
  validateDisclosureAndPrivacy,
  type ContentBlock,
} from '../lib/markdown/format.ts';
import {
  REPO_ROOT,
  getSitemapRoutes,
  getHtmlFilePath,
  resolvePageDocument,
  resolveSiteDataBundle,
  resolveMarkdownRequest,
} from '../lib/markdown/resolve.ts';

let passed = 0;
function check(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

// ── 1. Sitemap Parity & Static Route Registration ───────────────────────────
const sitemapRoutes = getSitemapRoutes(REPO_ROOT);

check('sitemap.xml contains at least 75 public routes', () => {
  assert.ok(
    sitemapRoutes.length >= 75,
    `Expected >= 75 routes in sitemap.xml, found ${sitemapRoutes.length}`
  );
});

for (const { url, path: routePath } of sitemapRoutes) {
  check(`Sitemap route ${routePath} is registered in STATIC_ROUTE_REGISTRY`, () => {
    const meta = STATIC_ROUTE_REGISTRY[routePath];
    assert.ok(
      meta,
      `Route ${routePath} (${url}) is in sitemap.xml but missing from STATIC_ROUTE_REGISTRY in lib/markdown/format.ts`
    );
    assert.equal(meta.canonicalUrl, url);
  });

  check(`Route ${routePath} resolves non-empty Markdown with '# ' heading and canonical URL`, () => {
    const doc = resolvePageDocument(routePath, REPO_ROOT);
    assert.ok(doc, `resolvePageDocument returned null for ${routePath}`);
    assert.ok(doc.blocks.length > 0, `PageDocument for ${routePath} has 0 content blocks`);

    const md = formatPageMarkdown(doc);
    assert.ok(md.trim().length > 200, `Markdown for ${routePath} is unexpectedly short`);
    assert.ok(md.startsWith('# '), `Markdown for ${routePath} must start with '# '`);
    assert.ok(
      md.includes(url),
      `Markdown for ${routePath} must contain canonical URL ${url}`
    );

    // Verify on-disk .md file exists and is in sync
    const diskMdPath = path.join(REPO_ROOT, doc.mdPath.slice(1));
    assert.ok(
      fs.existsSync(diskMdPath),
      `Missing generated Markdown file on disk: ${diskMdPath}`
    );
    const diskMd = fs.readFileSync(diskMdPath, 'utf8');
    assert.equal(
      diskMd.replace(/\r\n/g, '\n'),
      md.replace(/\r\n/g, '\n'),
      `On-disk Markdown file ${doc.mdPath} is out of sync; run 'npm run build:markdown'`
    );

    // Verify HTML page has <link rel="alternate" type="text/markdown" href="...">
    const htmlPath = getHtmlFilePath(routePath, REPO_ROOT);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const expectedTag = `<link rel="alternate" type="text/markdown" href="${doc.mdUrl}">`;
    assert.ok(
      html.includes(expectedTag),
      `HTML file for ${routePath} is missing ${expectedTag}`
    );
  });
}

// ── 2. Path Normalisation, Private Route Rejection & HTTP Headers ───────────
check('normalizeMarkdownPath maps /index.md, /news.md, /course.md and strips .md', () => {
  const home1 = normalizeMarkdownPath('/index.md');
  assert.ok(home1);
  assert.equal(home1.canonicalPath, '/');
  assert.equal(home1.canonicalUrl, `${SITE_ORIGIN}/`);
  assert.equal(home1.mdPath, '/index.md');
  assert.equal(home1.status, 200);

  const home2 = normalizeMarkdownPath('/');
  assert.ok(home2);
  assert.equal(home2.canonicalPath, '/');

  const about = normalizeMarkdownPath('/about.md');
  assert.ok(about);
  assert.equal(about.canonicalPath, '/about');
  assert.equal(about.canonicalUrl, `${SITE_ORIGIN}/about`);
  assert.equal(about.mdPath, '/about.md');

  const newsHub1 = normalizeMarkdownPath('/news/index.md');
  assert.ok(newsHub1);
  assert.equal(newsHub1.canonicalPath, '/news/');
  assert.equal(newsHub1.canonicalUrl, `${SITE_ORIGIN}/news/`);

  const newsHub2 = normalizeMarkdownPath('/news.md');
  assert.ok(newsHub2);
  assert.equal(newsHub2.canonicalPath, '/news/');

  const courseHub1 = normalizeMarkdownPath('/course/index.md');
  assert.ok(courseHub1);
  assert.equal(courseHub1.canonicalPath, '/course/');

  const courseHub2 = normalizeMarkdownPath('/course.md');
  assert.ok(courseHub2);
  assert.equal(courseHub2.canonicalPath, '/course/');

  const article = normalizeMarkdownPath('/news/ai-models-2026.md');
  assert.ok(article);
  assert.equal(article.canonicalPath, '/news/ai-models-2026');
  assert.equal(article.canonicalUrl, `${SITE_ORIGIN}/news/ai-models-2026`);

  const lesson = normalizeMarkdownPath('/course/what-is-ai.md');
  assert.ok(lesson);
  assert.equal(lesson.canonicalPath, '/course/what-is-ai');
});

check('normalizeMarkdownPath returns null for all private, auth, API, noindex, and asset paths', () => {
  const rejectedPaths = [
    '/admin',
    '/admin.md',
    '/admin/users',
    '/dashboard',
    '/dashboard.md',
    '/account',
    '/account/settings.md',
    '/auth',
    '/auth/callback',
    '/login',
    '/login.md',
    '/api/markdown',
    '/api/secret.md',
    '/_next/static/chunk.js',
    '/exam',
    '/exam.md',
    '/certificate',
    '/certificate.md',
    '/wo',
    '/wo.md',
    '/404',
    '/404.md',
    '/header',
    '/header.html',
    '/header.md',
    '/footer',
    '/footer.html',
    '/footer.md',
    '/llms.txt',
    '/llms.txt.md',
    '/llms-full.txt',
    '/sitemap.xml',
    '/robots.txt',
    '/igaming-regulations.json',
    '/styles.css',
    '/index.js',
    '/images/JohnB.webp',
    '/does-not-exist',
    '/does-not-exist.md',
    '/../CLAUDE.md',
  ];

  for (const p of rejectedPaths) {
    assert.equal(
      normalizeMarkdownPath(p),
      null,
      `Expected normalizeMarkdownPath("${p}") to return null`
    );
  }
});

check('normalizeMarkdownPath returns status 410 for withdrawn/deleted routes', () => {
  for (const gone of ['/project-insights.md', '/michael-scott.md', '/heart.md', '/project-insights']) {
    const res = normalizeMarkdownPath(gone);
    assert.ok(res, `Expected 410 route object for ${gone}`);
    assert.equal(res.status, 410);
  }
});

check('resolveMarkdownRequest sets required RFC 7763 headers and status codes', () => {
  const okRes = resolveMarkdownRequest('/aitocv.md', REPO_ROOT);
  assert.equal(okRes.status, 200);
  assert.equal(okRes.headers['Content-Type'], 'text/markdown; charset=utf-8');
  assert.equal(okRes.headers['Vary'], 'Accept');
  assert.equal(okRes.headers['Link'], '<https://johnb.io/aitocv>; rel="canonical"');
  assert.equal(okRes.headers['X-Robots-Tag'], 'noindex');
  assert.ok(okRes.body.startsWith('# AI CV Enhancer'));

  const notFoundRes = resolveMarkdownRequest('/login.md', REPO_ROOT);
  assert.equal(notFoundRes.status, 404);
  assert.equal(notFoundRes.headers['X-Robots-Tag'], 'noindex');

  const goneRes = resolveMarkdownRequest('/project-insights.md', REPO_ROOT);
  assert.equal(goneRes.status, 410);
  assert.equal(goneRes.headers['X-Robots-Tag'], 'noindex');
});

// ── 3. Rich-Text / Structured Block Schema Coverage ─────────────────────────
check('Every ContentBlock type in the schema renders non-empty Markdown', () => {
  const sampleBlocks: ContentBlock[] = [
    { type: 'heading', level: 2, text: 'Section Heading' },
    { type: 'paragraph', text: 'Sample paragraph text.' },
    { type: 'list', ordered: true, items: ['First item', 'Second item'] },
    { type: 'list', ordered: false, items: ['Bullet A', 'Bullet B'] },
    {
      type: 'definition',
      term: 'Generative Engine Optimisation (GEO)',
      definition: 'Structuring content so AI answer engines can accurately extract and cite it.',
    },
    { type: 'callout', label: 'Important', text: 'This tool runs entirely in the browser.' },
    { type: 'code', language: 'python', code: 'print("Hello AI")' },
    {
      type: 'table',
      headers: ['Model', 'Provider'],
      rows: [['Claude Sonnet 5.5', 'Anthropic']],
    },
    {
      type: 'stat_grid',
      stats: [{ value: '212', label: 'Regulations' }],
    },
    {
      type: 'howto',
      title: 'How It Works',
      steps: [{ name: 'Upload CV', text: 'Upload CV as PDF or DOCX.' }],
    },
    {
      type: 'keypoints',
      title: 'Key Points',
      points: ['Zero server storage.'],
    },
    {
      type: 'faq',
      items: [{ question: 'Is it free?', answer: 'Yes, completely free.' }],
    },
    {
      type: 'sources',
      items: [{ title: 'UKGC LCCP', url: 'https://www.gamblingcommission.gov.uk', note: 'Primary source' }],
    },
    {
      type: 'author_bio',
      name: 'John Bowman',
      role: 'AI Strategist & Developer',
      bio: 'Builds AI tools at JohnB.io.',
      profileUrl: 'https://johnb.io/about',
    },
  ];

  for (const block of sampleBlocks) {
    const rendered = formatRichBlock(block);
    assert.ok(
      rendered && rendered.trim().length > 0,
      `Block type "${block.type}" rendered empty Markdown`
    );
  }
});

// ── 4. Privacy, Disclosure & Agent Index Parity Guardrails ──────────────────
check('All 75 pages pass privacy and mandatory disclosure checks', () => {
  for (const canonicalPath of Object.keys(STATIC_ROUTE_REGISTRY)) {
    const doc = resolvePageDocument(canonicalPath, REPO_ROOT);
    assert.ok(doc);
    const md = formatPageMarkdown(doc);
    const result = validateDisclosureAndPrivacy(canonicalPath, md);
    assert.ok(
      result.valid,
      `Disclosure/privacy validation failed for ${canonicalPath}:\n  - ${result.errors.join('\n  - ')}`
    );
  }
});

check('noindex HTML pages do not expose <link rel="alternate" type="text/markdown">', () => {
  const noindexFiles = [
    '404.html',
    'login.html',
    'exam.html',
    'certificate.html',
    'wo.html',
    'header.html',
    'footer.html',
  ];
  for (const f of noindexFiles) {
    const html = fs.readFileSync(path.join(REPO_ROOT, f), 'utf8');
    assert.ok(
      !html.includes('type="text/markdown"'),
      `noindex file ${f} must not include a type="text/markdown" alternate link`
    );
  }
});

check('llms.txt and llms-full.txt are in sync with live data and include RFC 7763 notice', () => {
  const bundle = resolveSiteDataBundle(REPO_ROOT);
  const expectedLlms = formatLlmsTxt(bundle);
  const expectedFull = formatLlmsFullTxt(bundle);

  const diskLlms = fs.readFileSync(path.join(REPO_ROOT, 'llms.txt'), 'utf8');
  const diskFull = fs.readFileSync(path.join(REPO_ROOT, 'llms-full.txt'), 'utf8');

  assert.equal(
    diskLlms.replace(/\r\n/g, '\n'),
    expectedLlms.replace(/\r\n/g, '\n'),
    'llms.txt is out of sync with live site data; run npm run build:markdown'
  );
  assert.equal(
    diskFull.replace(/\r\n/g, '\n'),
    expectedFull.replace(/\r\n/g, '\n'),
    'llms-full.txt is out of sync with live site data; run npm run build:markdown'
  );

  assert.ok(diskLlms.includes('Accept: text/markdown'));
  assert.ok(diskLlms.includes('https://johnb.io/llms-full.txt'));
  assert.ok(diskLlms.includes('## Optional'));

  // Verify every sitemap URL is referenced in llms.txt and llms-full.txt
  for (const { url } of sitemapRoutes) {
    assert.ok(diskLlms.includes(url), `llms.txt is missing sitemap URL ${url}`);
    assert.ok(diskFull.includes(url), `llms-full.txt is missing sitemap URL ${url}`);
  }
});

check('.htaccess, news/.htaccess, and course/.htaccess contain RFC 7763 rules and Link headers', () => {
  const rootHtaccess = fs.readFileSync(path.join(REPO_ROOT, '.htaccess'), 'utf8');
  const newsHtaccess = fs.readFileSync(path.join(REPO_ROOT, 'news', '.htaccess'), 'utf8');
  const courseHtaccess = fs.readFileSync(path.join(REPO_ROOT, 'course', '.htaccess'), 'utf8');
  const combined = `${rootHtaccess}\n${newsHtaccess}\n${courseHtaccess}`;

  assert.ok(rootHtaccess.includes('RewriteCond %{HTTP_ACCEPT} text/markdown [NC]'));
  assert.ok(rootHtaccess.includes('Header set Content-Type "text/markdown; charset=utf-8"'));
  assert.ok(rootHtaccess.includes('Header merge Vary "Accept"'));
  assert.ok(rootHtaccess.includes('Header set X-Robots-Tag "noindex"'));

  for (const meta of Object.values(STATIC_ROUTE_REGISTRY)) {
    const expectedLink = `Header set Link "<${meta.canonicalUrl}>; rel=\\"canonical\\""`;
    assert.ok(
      combined.includes(expectedLink),
      `Missing canonical Link header in .htaccess for ${meta.canonicalUrl}`
    );
  }
});

console.log(`PASS: All ${passed} Markdown serving, parity, and security checks succeeded.`);
