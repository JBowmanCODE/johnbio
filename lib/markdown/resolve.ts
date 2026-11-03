import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_ORIGIN,
  STATIC_ROUTE_REGISTRY,
  normalizeMarkdownPath,
  formatPageMarkdown,
  formatLlmsTxt,
  formatLlmsFullTxt,
  type ContentBlock,
  type PageDocument,
  type SiteDataBundle,
  type ToolSummaryItem,
  type NewsSummaryItem,
  type CourseLessonSummaryItem,
} from './format.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const REPO_ROOT = path.resolve(__dirname, '..', '..');

export interface MarkdownHttpResponse {
  status: 200 | 404 | 410;
  headers: Record<string, string>;
  body: string;
}

/**
 * Decodes HTML entities and normalises whitespace while preserving inline Markdown links/code/bold.
 */
export function htmlToInlineMarkdown(html: string): string {
  if (!html) return '';
  let s = html;

  // Remove decorative material symbols & hidden elements
  s = s.replace(/<span[^>]*class=["'][^"']*material-symbols-outlined[^"']*["'][^>]*>.*?<\/span>/gis, '');
  s = s.replace(/<span[^>]*aria-hidden=["']true["'][^>]*>.*?<\/span>/gis, '');

  // Convert inline code
  s = s.replace(/<code[^>]*>(.*?)<\/code>/gis, (_, inner) => `\`${stripTags(inner).trim()}\``);

  // Convert links
  s = s.replace(/<a\b([^>]*)>(.*?)<\/a>/gis, (_, attrs, inner) => {
    const hrefMatch = attrs.match(/\bhref=["']([^"']+)["']/i);
    const text = stripTags(inner).replace(/\s+/g, ' ').trim();
    if (!hrefMatch || !text) return text;
    let href = hrefMatch[1].trim();
    if (href.startsWith('/')) {
      href = `${SITE_ORIGIN}${href}`;
    }
    return `[${text}](${href})`;
  });

  // Convert strong/b and em/i
  s = s.replace(/<(strong|b)\b[^>]*>(.*?)<\/\1>/gis, (_, _tag, inner) => {
    const t = stripTags(inner).replace(/\s+/g, ' ').trim();
    return t ? `**${t}**` : '';
  });
  s = s.replace(/<(em|i)\b[^>]*>(.*?)<\/\1>/gis, (_, _tag, inner) => {
    const t = stripTags(inner).replace(/\s+/g, ' ').trim();
    return t ? `*${t}*` : '';
  });

  // Strip remaining tags
  s = stripTags(s);
  s = decodeEntities(s);
  return s.replace(/\s+/g, ' ').trim();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

export function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&pound;/gi, '£')
    .replace(/&euro;/gi, '€')
    .replace(/&copy;/gi, '©')
    .replace(/&mdash;|&#8212;/gi, '-')
    .replace(/&ndash;|&#8211;/gi, '-')
    .replace(/&middot;/gi, '·')
    .replace(/&rarr;/gi, '->')
    .replace(/&times;/gi, 'x')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Parses `sitemap.xml` and returns all canonical URLs and paths.
 */
export function getSitemapRoutes(rootDir: string = REPO_ROOT): Array<{ url: string; path: string }> {
  const xml = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
  return locs.map((url) => ({
    url,
    path: url.startsWith(SITE_ORIGIN) ? url.slice(SITE_ORIGIN.length) || '/' : url,
  }));
}

/**
 * Parses `index.js` `projects` array for the 28 tools.
 */
export function parseToolsData(rootDir: string = REPO_ROOT): ToolSummaryItem[] {
  const src = fs.readFileSync(path.join(rootDir, 'index.js'), 'utf8');
  const start = src.indexOf('const projects = [');
  const end = src.indexOf('];', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not locate projects array in index.js');
  }
  const fn = new Function(`${src.slice(start, end + 2)}; return projects;`);
  const rawProjects = fn() as Array<{
    id: string;
    title: string;
    desc: string;
    category: string | string[];
    badge: string;
    href: string;
  }>;

  return rawProjects.map((p) => {
    const canonicalPath = p.href.startsWith(SITE_ORIGIN)
      ? p.href.slice(SITE_ORIGIN.length) || '/'
      : p.href;
    const primaryCat = Array.isArray(p.category)
      ? p.category.includes('rai')
        ? 'rai'
        : (p.category[0] as 'ai' | 'dev' | 'digital' | 'rai')
      : (p.category as 'ai' | 'dev' | 'digital' | 'rai');
    return {
      id: p.id,
      title: p.title,
      canonicalPath,
      canonicalUrl: `${SITE_ORIGIN}${canonicalPath}`,
      mdUrl: `${SITE_ORIGIN}${canonicalPath}.md`,
      category: primaryCat,
      badge: p.badge,
      summary: p.desc.replace(/—/g, '-'),
    };
  });
}

/**
 * Parses `news-data.js` `NEWS_POSTS` array.
 */
export function parseNewsData(rootDir: string = REPO_ROOT): NewsSummaryItem[] {
  const src = fs.readFileSync(path.join(rootDir, 'news-data.js'), 'utf8');
  const fn = new Function(`${src}; return NEWS_POSTS;`);
  const posts = fn() as Array<{
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    dateDisplay: string;
    readTime: string;
  }>;

  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    canonicalUrl: `${SITE_ORIGIN}${p.slug}`,
    mdUrl: `${SITE_ORIGIN}${p.slug}.md`,
    excerpt: p.excerpt.replace(/—/g, '-'),
    category: p.category,
    date: p.date,
    dateDisplay: p.dateDisplay,
    readTime: p.readTime,
  }));
}

/**
 * Parses `course-data.js` `COURSE_UNITS` array.
 */
export function parseCourseData(rootDir: string = REPO_ROOT): {
  unitCount: number;
  lessons: CourseLessonSummaryItem[];
} {
  const src = fs.readFileSync(path.join(rootDir, 'course-data.js'), 'utf8');
  const start = src.indexOf('const COURSE_UNITS = [');
  const end = src.indexOf('\n];', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not locate COURSE_UNITS in course-data.js');
  }
  const fn = new Function(`${src.slice(start, end + 3)}; return COURSE_UNITS;`);
  const units = fn() as Array<{
    id: number;
    title: string;
    lessons: Array<{ id: string; slug: string; title: string; duration: string }>;
  }>;

  const lessons: CourseLessonSummaryItem[] = [];
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      const canonicalPath = `/course/${lesson.slug}`;
      const regMeta = STATIC_ROUTE_REGISTRY[canonicalPath];
      lessons.push({
        id: lesson.id,
        unitId: unit.id,
        unitTitle: unit.title.replace(/—/g, '-'),
        slug: lesson.slug,
        canonicalPath,
        canonicalUrl: `${SITE_ORIGIN}${canonicalPath}`,
        mdUrl: `${SITE_ORIGIN}${canonicalPath}.md`,
        title: lesson.title.replace(/—/g, '-'),
        duration: lesson.duration,
        summary: regMeta ? regMeta.summary : `${lesson.title} (${lesson.duration})`,
      });
    }
  }
  return { unitCount: units.length, lessons };
}

/**
 * Parses `igaming-regulations.json` for live regulation & jurisdiction counts and summaries.
 */
export function parseComplianceStats(rootDir: string = REPO_ROOT): {
  regulationCount: number;
  jurisdictionCount: number;
  regulations: Array<{
    id: string;
    name: string;
    category: string;
    region: string;
    jurisdictions: Array<{ code: string; name: string }>;
    summary: string;
    officialUrl: string;
  }>;
} {
  const raw = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'igaming-regulations.json'), 'utf8')
  ) as {
    regulationCount: number;
    jurisdictionCount: number;
    regulations: Array<{
      id: string;
      name: string;
      category: string;
      region: string;
      jurisdictions: Array<{ code: string; name: string }>;
      summary: string;
      officialUrl: string;
    }>;
  };
  return {
    regulationCount: raw.regulationCount,
    jurisdictionCount: raw.jurisdictionCount,
    regulations: raw.regulations || [],
  };
}

/**
 * Maps a canonical route path to its source HTML file on disk.
 */
export function getHtmlFilePath(canonicalPath: string, rootDir: string = REPO_ROOT): string {
  if (canonicalPath === '/') {
    return path.join(rootDir, 'index.html');
  }
  if (canonicalPath.endsWith('/')) {
    return path.join(rootDir, canonicalPath.slice(1), 'index.html');
  }
  return path.join(rootDir, `${canonicalPath.slice(1)}.html`);
}

/**
 * Extracts structured blocks from an HTML container string (`na-body`, `tool-info-body`, `legal-page`, etc.).
 */
function extractFlowBlocksFromHtml(containerHtml: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  if (!containerHtml) return blocks;

  // Clean out scripts, styles, audio controls, quiz interactive chrome, and decorative SVGs
  const cleaned = containerHtml
    .replace(/<(script|style|svg|canvas|audio)\b[^>]*>.*?<\/\1>/gis, '')
    .replace(/<div[^>]*class=["'][^"']*(na-audio|na-podcast|lp-nav|lp-quiz|lp-complete-nudge)[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<\/div>/gis, '');

  const tokenRegex =
    /<(h2|h3|h4|p|ul|ol|pre|table|blockquote)\b([^>]*)>(.*?)<\/\1>/gis;

  for (const match of cleaned.matchAll(tokenRegex)) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] || '';
    const inner = match[3] || '';

    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = htmlToInlineMarkdown(inner);
      if (!text) continue;
      const level = Number(tag.slice(1)) as 2 | 3 | 4;
      blocks.push({ type: 'heading', level, text });
    } else if (tag === 'p') {
      const text = htmlToInlineMarkdown(inner);
      if (!text) continue;
      // Check for Term: / Definition: pattern
      const defMatch = text.match(
        /^\*?\*?Term:\*?\*?\s*([^.]+)\.\s*\*?\*?Definition:\*?\*?\s*(.+)$/i
      );
      if (defMatch) {
        blocks.push({
          type: 'definition',
          term: defMatch[1].replace(/\*+/g, '').trim(),
          definition: defMatch[2].replace(/\*+/g, '').trim(),
        });
      } else {
        blocks.push({ type: 'paragraph', text });
      }
    } else if (tag === 'ul' || tag === 'ol') {
      // Skip TOC lists
      if (/na-toc-list|na-mobile-toc-list|crawl-nav-list/i.test(attrs)) continue;
      const items = [...inner.matchAll(/<li\b[^>]*>(.*?)<\/li>/gis)]
        .map((m) => htmlToInlineMarkdown(m[1]))
        .filter(Boolean);
      if (items.length > 0) {
        blocks.push({ type: 'list', ordered: tag === 'ol', items });
      }
    } else if (tag === 'pre') {
      const codeMatch = inner.match(/<code\b([^>]*)>(.*?)<\/code>/is);
      const rawCode = codeMatch ? codeMatch[2] : inner;
      const langMatch = codeMatch?.[1]?.match(/language-([a-z0-9_-]+)/i);
      const code = decodeEntities(stripTags(rawCode)).trim();
      if (code) {
        blocks.push({
          type: 'code',
          language: langMatch ? langMatch[1] : undefined,
          code,
        });
      }
    } else if (tag === 'table') {
      const rowsHtml = [...inner.matchAll(/<tr\b[^>]*>(.*?)<\/tr>/gis)].map((m) => m[1]);
      if (rowsHtml.length > 0) {
        const headers = [...rowsHtml[0].matchAll(/<(th|td)\b[^>]*>(.*?)<\/\1>/gis)].map((m) =>
          htmlToInlineMarkdown(m[2])
        );
        const rows = rowsHtml.slice(1).map((rHtml) =>
          [...rHtml.matchAll(/<(td|th)\b[^>]*>(.*?)<\/\1>/gis)].map((m) =>
            htmlToInlineMarkdown(m[2])
          )
        );
        if (headers.length > 0 && rows.length > 0) {
          blocks.push({ type: 'table', headers, rows });
        }
      }
    } else if (tag === 'blockquote') {
      const text = htmlToInlineMarkdown(inner);
      if (text) {
        blocks.push({ type: 'callout', label: 'Note', text });
      }
    }
  }

  return blocks;
}

/**
 * Extracts standard tool/article accordions (`info-faq`, `info-steps`, `info-points`, `info-sources`)
 * from an HTML document.
 */
function extractAccordionBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // 1. How It Works (ol.info-steps)
  const stepsMatch = html.match(/<ol\b[^>]*class=["'][^"']*info-steps[^"']*["'][^>]*>(.*?)<\/ol>/is);
  if (stepsMatch) {
    const steps: Array<{ name: string; text: string }> = [];
    for (const li of stepsMatch[1].matchAll(/<li\b[^>]*>(.*?)<\/li>/gis)) {
      const rawLi = li[1];
      const strongMatch = rawLi.match(/<strong\b[^>]*>(.*?)<\/strong>/is);
      const name = strongMatch
        ? htmlToInlineMarkdown(strongMatch[1]).replace(/\.$/, '')
        : 'Step';
      const fullText = htmlToInlineMarkdown(rawLi);
      steps.push({ name, text: fullText });
    }
    if (steps.length > 0) {
      blocks.push({ type: 'howto', title: 'How It Works', steps });
    }
  }

  // 2. Key Points (ul.info-points)
  const pointsMatch = html.match(/<ul\b[^>]*class=["'][^"']*info-points[^"']*["'][^>]*>(.*?)<\/ul>/is);
  if (pointsMatch) {
    const points = [...pointsMatch[1].matchAll(/<li\b[^>]*>(.*?)<\/li>/gis)]
      .map((m) => htmlToInlineMarkdown(m[1]))
      .filter(Boolean);
    if (points.length > 0) {
      blocks.push({ type: 'keypoints', title: 'Key Points', points });
    }
  }

  // 3. Frequently Asked Questions (dl.info-faq)
  const faqMatch = html.match(/<dl\b[^>]*class=["'][^"']*info-faq[^"']*["'][^>]*>(.*?)<\/dl>/is);
  if (faqMatch) {
    const items: Array<{ question: string; answer: string }> = [];
    for (const itemMatch of faqMatch[1].matchAll(
      /<dt\b[^>]*>(.*?)<\/dt>\s*<dd\b[^>]*>(.*?)<\/dd>/gis
    )) {
      const question = htmlToInlineMarkdown(itemMatch[1]);
      const answer = htmlToInlineMarkdown(itemMatch[2]);
      if (question && answer) {
        items.push({ question, answer });
      }
    }
    if (items.length > 0) {
      blocks.push({ type: 'faq', items });
    }
  }

  // 4. Sources (ol.info-sources)
  const sourcesMatch = html.match(
    /<ol\b[^>]*class=["'][^"']*info-sources[^"']*["'][^>]*>(.*?)<\/ol>/is
  );
  if (sourcesMatch) {
    const items: Array<{ title: string; url?: string; note?: string }> = [];
    for (const li of sourcesMatch[1].matchAll(/<li\b[^>]*>(.*?)<\/li>/gis)) {
      const inner = li[1];
      const aMatch = inner.match(/<a\b([^>]*)>(.*?)<\/a>/is);
      if (aMatch) {
        const hrefMatch = aMatch[1].match(/\bhref=["']([^"']+)["']/i);
        const title = htmlToInlineMarkdown(aMatch[2]);
        let url = hrefMatch ? hrefMatch[1].trim() : undefined;
        if (url && url.startsWith('/')) url = `${SITE_ORIGIN}${url}`;
        const remainder = htmlToInlineMarkdown(inner.replace(aMatch[0], ''))
          .replace(/^[-–—:.\s]+/, '')
          .trim();
        items.push({ title, url, note: remainder || undefined });
      } else {
        const text = htmlToInlineMarkdown(inner);
        if (text) items.push({ title: text });
      }
    }
    if (items.length > 0) {
      blocks.push({ type: 'sources', items });
    }
  }

  return blocks;
}

/**
 * Extracts JSON-LD metadata (`datePublished`, `dateModified`) and last-updated strings from HTML.
 */
function extractPageMeta(html: string): {
  publishedDate?: string;
  modifiedDate?: string;
  readTime?: string;
  unitBadge?: string;
} {
  const pubMatch = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  const modMatch = html.match(/"dateModified"\s*:\s*"([^"]+)"/);
  const toolUpdatedMatch = html.match(/Last updated:\s*([^<]+)/i);
  const readMatch = html.match(/<span[^>]*class=["'][^"']*na-read[^"']*["'][^>]*>(.*?)<\/span>/i);
  const unitMatch = html.match(/<span[^>]*class=["'][^"']*lp-unit-badge[^"']*["'][^>]*>(.*?)<\/span>/i);

  const publishedDate = pubMatch ? pubMatch[1].split('T')[0] : undefined;
  const modifiedDate = modMatch
    ? modMatch[1].split('T')[0]
    : toolUpdatedMatch
      ? decodeEntities(toolUpdatedMatch[1]).trim()
      : undefined;

  return {
    publishedDate,
    modifiedDate,
    readTime: readMatch ? htmlToInlineMarkdown(readMatch[1]) : undefined,
    unitBadge: unitMatch ? htmlToInlineMarkdown(unitMatch[1]) : undefined,
  };
}

/**
 * Resolves a single canonical route into a structured `PageDocument`.
 */
export function resolvePageDocument(
  canonicalPath: string,
  rootDir: string = REPO_ROOT
): PageDocument | null {
  const meta = STATIC_ROUTE_REGISTRY[canonicalPath];
  if (!meta) return null;

  const htmlPath = getHtmlFilePath(canonicalPath, rootDir);
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file missing for registered route ${canonicalPath}: ${htmlPath}`);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const pageMeta = extractPageMeta(html);
  const disclosures: string[] = [];
  const blocks: ContentBlock[] = [];

  // Route-specific mandatory disclosures
  if (canonicalPath === '/meditation') {
    disclosures.push(
      'This is a relaxation aid, not medical advice. Meditation is not a treatment for any medical condition, including high blood pressure, anxiety disorders or insomnia. If you have a health concern, speak to a doctor.'
    );
  } else if (canonicalPath === '/tcs-simplifier') {
    disclosures.push(
      'This tool provides an automated plain-English summary for informational purposes only and is not legal advice. Always read the operator\'s full terms and conditions.'
    );
  } else if (canonicalPath === '/search-radar') {
    disclosures.push(
      'AI assistant prompts shown in Search & Prompt Radar are not taken from ChatGPT logs (no AI platform publishes prompt logs); they are synthesised by Claude Haiku 5.5 from live Google, YouTube, Reddit and Hacker News search demand.'
    );
  } else if (canonicalPath === '/zzmystery') {
    disclosures.push(
      '18+ Responsible Gambling Notice: This browser demo uses virtual points only with no real money, deposits, or withdrawals. Free, confidential support is available 24/7 via GambleAware (0808 8020 133) and GamCare.'
    );
  } else if (canonicalPath === '/bankroll') {
    disclosures.push(
      'Responsible Gambling Notice: This tool has no affiliation with any gambling operator. Free, confidential support is available 24/7 in the UK via GambleAware (0808 8020 133), GamCare, Gambling Therapy and GAMSTOP.'
    );
  } else if (canonicalPath === '/aitocv') {
    disclosures.push(
      'Privacy Notice: JohnB.io does not log, store or share the CV or job description content you submit. Inputs are processed ephemerally via Anthropic\'s API.'
    );
  } else if (canonicalPath === '/contact' || canonicalPath === '/privacy') {
    disclosures.push(
      'UK GDPR Data & Privacy Rights: Requests for data access, correction, deletion, or portability can be submitted via https://johnb.io/contact and are handled within 30 days.'
    );
  }

  // 1. Homepage (`/`)
  if (canonicalPath === '/') {
    const tools = parseToolsData(rootDir);
    const news = parseNewsData(rootDir);
    const course = parseCourseData(rootDir);

    const introMatch = html.match(/<section[^>]*class=["'][^"']*site-intro[^"']*["'][^>]*>(.*?)<\/section>/is);
    if (introMatch) {
      blocks.push(...extractFlowBlocksFromHtml(introMatch[1]));
    }

    blocks.push({ type: 'heading', level: 2, text: `All ${tools.length} Free Tools & Utilities` });
    blocks.push({
      type: 'table',
      headers: ['Tool', 'Category', 'URL', 'Markdown URL', 'Summary'],
      rows: tools.map((t) => [
        `[${t.title}](${t.canonicalUrl})`,
        t.badge,
        t.canonicalUrl,
        t.mdUrl,
        t.summary,
      ]),
    });

    blocks.push({ type: 'heading', level: 2, text: 'Latest News & Insights' });
    blocks.push({
      type: 'list',
      ordered: false,
      items: news.map(
        (n) =>
          `[${n.title}](${n.canonicalUrl}) (${n.dateDisplay}, ${n.readTime}) - ${n.excerpt}`
      ),
    });

    blocks.push({
      type: 'heading',
      level: 2,
      text: `Free AI & Machine Learning Course (${course.unitCount} Units, ${course.lessons.length} Lessons)`,
    });
    blocks.push({
      type: 'list',
      ordered: false,
      items: course.lessons.map(
        (l) =>
          `Unit ${l.unitId}: [${l.title}](${l.canonicalUrl}) (${l.duration}) - ${l.summary}`
      ),
    });
  }
  // 2. About Page (`/about`)
  else if (canonicalPath === '/about') {
    blocks.push({
      type: 'stat_grid',
      stats: [
        { value: '20+', label: 'Years in Gaming & Digital' },
        { value: '90+', label: 'Team Members Led' },
        { value: '24.8M', label: 'YouTube Views' },
        { value: '£700k+', label: 'YoY Savings Delivered' },
        { value: '20+', label: 'Languages & Markets' },
      ],
    });

    const bioMatch = html.match(/<div[^>]*class=["'][^"']*bio-card[^"']*["'][^>]*>(.*?)<\/div>\s*<\/div>/is);
    if (bioMatch) {
      blocks.push(...extractFlowBlocksFromHtml(bioMatch[1]));
    }

    const toolInfoMatch = html.match(
      /<div[^>]*class=["'][^"']*tool-info-body[^"']*["'][^>]*>(.*?)<\/div>/is
    );
    if (toolInfoMatch) {
      blocks.push(...extractFlowBlocksFromHtml(toolInfoMatch[1]));
    }
    blocks.push(...extractAccordionBlocks(html));
  }
  // 3. Contact Page (`/contact`)
  else if (canonicalPath === '/contact') {
    blocks.push({
      type: 'heading',
      level: 2,
      text: 'How to Contact John Bowman',
    });
    blocks.push({
      type: 'paragraph',
      text: 'Have a question about one of the tools, a project idea, or a data privacy request? Use the contact form at [https://johnb.io/contact](https://johnb.io/contact) or connect directly on LinkedIn at [linkedin.com/in/john-bowman](https://www.linkedin.com/in/john-bowman/).',
    });
    blocks.push({
      type: 'list',
      ordered: false,
      items: [
        '**General enquiry**: Questions or feedback about JohnB.io.',
        '**Tool feedback or bug report**: Report issues or suggest improvements for any of the 28 tools.',
        '**Collaboration or project**: AI strategy, consulting, or development enquiries.',
        '**Data / privacy request (UK GDPR)**: Exercise your rights to access, correction, deletion, or portability of personal data. Handled within 30 days.',
      ],
    });
  }
  // 4. Legal Pages (`/privacy`, `/terms`)
  else if (canonicalPath === '/privacy' || canonicalPath === '/terms') {
    const mainMatch = html.match(/<main\b[^>]*>(.*?)<\/main>/is);
    if (mainMatch) {
      blocks.push(...extractFlowBlocksFromHtml(mainMatch[1]));
    }
  }
  // 5. Certificate Verification (`/verify`)
  else if (canonicalPath === '/verify') {
    blocks.push({
      type: 'heading',
      level: 2,
      text: 'How Certificate Verification Works',
    });
    blocks.push({
      type: 'paragraph',
      text: 'Every graduate who completes all 35 lessons and passes the final exam of the [AI & Machine Learning Course](https://johnb.io/course/) receives a unique certificate ID in the format `JB-2026-XXXXXX`.',
    });
    blocks.push({
      type: 'list',
      ordered: true,
      items: [
        'Visit `https://johnb.io/verify/JB-2026-XXXXXX` (replacing `JB-2026-XXXXXX` with the holder\'s certificate ID).',
        'The page queries the JohnB.io verification record and displays the graduate\'s verified name, completion date, exam score, and course curriculum details.',
        'If a certificate ID does not exist or has been withdrawn, the page reports "Certificate not found".',
      ],
    });
  }
  // 6. News Hub (`/news/`)
  else if (canonicalPath === '/news/') {
    const news = parseNewsData(rootDir);
    blocks.push({
      type: 'heading',
      level: 2,
      text: 'Published Articles',
    });
    for (const post of news) {
      blocks.push({
        type: 'heading',
        level: 3,
        text: `[${post.title}](${post.canonicalUrl})`,
      });
      blocks.push({
        type: 'paragraph',
        text: `**Published:** ${post.dateDisplay} | **Category:** ${post.category} | **Read Time:** ${post.readTime} | **[Markdown Version](${post.mdUrl})**\n\n${post.excerpt}`,
      });
    }
  }
  // 7. Course Hub (`/course/`)
  else if (canonicalPath === '/course/') {
    const course = parseCourseData(rootDir);
    blocks.push({
      type: 'heading',
      level: 2,
      text: `Course Curriculum (${course.unitCount} Units, ${course.lessons.length} Lessons)`,
    });
    let currentUnit = -1;
    let unitItems: string[] = [];
    const flushUnit = () => {
      if (unitItems.length > 0) {
        blocks.push({ type: 'list', ordered: true, items: unitItems });
        unitItems = [];
      }
    };
    for (const lesson of course.lessons) {
      if (lesson.unitId !== currentUnit) {
        flushUnit();
        currentUnit = lesson.unitId;
        blocks.push({
          type: 'heading',
          level: 3,
          text: `Unit ${lesson.unitId} - ${lesson.unitTitle}`,
        });
      }
      unitItems.push(
        `[${lesson.title}](${lesson.canonicalUrl}) (${lesson.duration}) - ${lesson.summary} ([.md](${lesson.mdUrl}))`
      );
    }
    flushUnit();

    const toolInfoMatch = html.match(
      /<div[^>]*class=["'][^"']*tool-info-body[^"']*["'][^>]*>(.*?)<\/div>/is
    );
    if (toolInfoMatch) {
      blocks.push(...extractFlowBlocksFromHtml(toolInfoMatch[1]));
    }
    blocks.push(...extractAccordionBlocks(html));
  }
  // 8. News Articles & Course Lessons (`news/*.html`, `course/*.html`)
  else if (meta.category === 'news-article' || meta.category === 'course-lesson') {
    const ledeMatch = html.match(/<p[^>]*class=["'][^"']*na-lede[^"']*["'][^>]*>(.*?)<\/p>/is);
    if (ledeMatch) {
      const lede = htmlToInlineMarkdown(ledeMatch[1]);
      if (lede) {
        blocks.push({ type: 'paragraph', text: lede });
      }
    }

    const bodyStart = html.indexOf('<div class="na-body">');
    if (bodyStart !== -1) {
      // Find matching end before </article>
      const articleEnd = html.indexOf('</article>', bodyStart);
      const bodyHtml = html.slice(bodyStart, articleEnd !== -1 ? articleEnd : undefined);
      blocks.push(...extractFlowBlocksFromHtml(bodyHtml));
    }

    blocks.push(...extractAccordionBlocks(html));

    blocks.push({
      type: 'author_bio',
      name: 'John Bowman',
      role: 'AI Strategist & Developer',
      bio: '20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.',
      profileUrl: 'https://johnb.io/about',
    });
  }
  // 9. Tool Pages & RAI Framework
  else {
    if (canonicalPath === '/igaming-compliance') {
      const comp = parseComplianceStats(rootDir);
      blocks.push({
        type: 'stat_grid',
        stats: [
          { value: String(comp.regulationCount), label: 'Regulations Tracked' },
          { value: String(comp.jurisdictionCount), label: 'Jurisdictions Covered' },
          { value: 'CC BY 4.0', label: 'Open Dataset Licence' },
        ],
      });
      blocks.push({
        type: 'callout',
        label: 'Machine-Readable Dataset',
        text: `Download the full ${comp.regulationCount}-regulation JSON export at [https://johnb.io/igaming-regulations.json](https://johnb.io/igaming-regulations.json).`,
      });
    }

    const toolInfoMatch = html.match(
      /<div[^>]*class=["'][^"']*tool-info-body[^"']*["'][^>]*>(.*?)<\/div>/is
    );
    if (toolInfoMatch) {
      blocks.push(...extractFlowBlocksFromHtml(toolInfoMatch[1]));
    }

    blocks.push(...extractAccordionBlocks(html));
  }

  return {
    canonicalPath: meta.canonicalPath,
    canonicalUrl: meta.canonicalUrl,
    mdPath: meta.mdPath,
    mdUrl: meta.mdUrl,
    title: meta.title,
    summary: meta.summary,
    category: meta.category,
    author: 'John Bowman',
    authorUrl: 'https://johnb.io/about',
    publishedDate: pageMeta.publishedDate,
    modifiedDate: pageMeta.modifiedDate,
    readTime: pageMeta.readTime,
    unitBadge: pageMeta.unitBadge,
    disclosures,
    blocks,
  };
}

/**
 * Resolves the entire site data bundle from live repository sources.
 */
export function resolveSiteDataBundle(rootDir: string = REPO_ROOT): SiteDataBundle {
  const tools = parseToolsData(rootDir);
  const news = parseNewsData(rootDir);
  const course = parseCourseData(rootDir);
  const compliance = parseComplianceStats(rootDir);

  const pages: PageDocument[] = [];
  for (const canonicalPath of Object.keys(STATIC_ROUTE_REGISTRY)) {
    const doc = resolvePageDocument(canonicalPath, rootDir);
    if (doc) {
      pages.push(doc);
    }
  }

  return {
    regulationCount: compliance.regulationCount,
    jurisdictionCount: compliance.jurisdictionCount,
    toolCount: tools.length,
    lessonCount: course.lessons.length,
    unitCount: course.unitCount,
    articleCount: news.length,
    tools,
    news,
    lessons: course.lessons,
    pages,
  };
}

/**
 * Resolves a request path into a full RFC 7763 HTTP response with required headers:
 * - `Content-Type: text/markdown; charset=utf-8`
 * - `Vary: Accept`
 * - `Link: <https://johnb.io/...>; rel="canonical"`
 * - `X-Robots-Tag: noindex`
 */
export function resolveMarkdownRequest(
  rawPath: string,
  rootDir: string = REPO_ROOT
): MarkdownHttpResponse {
  const norm = normalizeMarkdownPath(rawPath);
  if (!norm) {
    return {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
        'X-Robots-Tag': 'noindex',
      },
      body: '# 404 Not Found\n\nThe requested Markdown resource does not exist or is not publicly available.\n',
    };
  }

  if (norm.status === 410) {
    return {
      status: 410,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
        'X-Robots-Tag': 'noindex',
      },
      body: '# 410 Gone\n\nThis page has been permanently retired and removed from JohnB.io.\n',
    };
  }

  const doc = resolvePageDocument(norm.canonicalPath, rootDir);
  if (!doc) {
    return {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
        'X-Robots-Tag': 'noindex',
      },
      body: '# 404 Not Found\n\nThe requested Markdown resource does not exist.\n',
    };
  }

  return {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
      Link: `<${doc.canonicalUrl}>; rel="canonical"`,
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-cache, must-revalidate',
    },
    body: formatPageMarkdown(doc),
  };
}

export { formatLlmsTxt, formatLlmsFullTxt, formatPageMarkdown };
