// Automated tests for LinkedIn Analytics Analyser (linkedin-analyser-core.js)
// Run with: node --test tests/linkedin-analyser.test.js

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import '../linkedin-analyser-core.js';

const LACore = globalThis.LACore;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const TEST_DATA_DIR = path.join(REPO_ROOT, 'test-data');
const XLSX_PATH = path.join(REPO_ROOT, 'lib', 'vendor', 'xlsx.full.min.js');

function loadXLSX() {
  const ctx = {
    window: {},
    self: {},
    Math, Date, Object, Array, String, Number, Boolean, RegExp, Error, TypeError,
    RangeError, SyntaxError, URIError, EvalError, ReferenceError,
    parseInt, parseFloat, isNaN, isFinite, encodeURI, decodeURI,
    encodeURIComponent, decodeURIComponent, escape, unescape,
    Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array,
    Float32Array, Float64Array, ArrayBuffer, DataView, Buffer, console,
    setTimeout, clearTimeout,
  };
  vm.runInNewContext(fs.readFileSync(XLSX_PATH, 'utf8'), ctx);
  return ctx.XLSX || ctx.window.XLSX;
}

const XLSX = loadXLSX();

function readWorkbookFile(filename) {
  const fullPath = path.join(TEST_DATA_DIR, filename);
  const buf = fs.readFileSync(fullPath);
  return XLSX.read(buf, { type: 'buffer' });
}

test('Cell parsers: numbers with commas, percentages with < 1%, US dates, and Excel serial dates', () => {
  assert.equal(LACore.parseNumber('6,215'), 6215);
  assert.equal(LACore.parseNumber(49556), 49556);
  assert.equal(LACore.parseNumber('', 0), 0);

  const ltOne = LACore.parsePercentage('< 1%');
  assert.equal(ltOne.value, 0.5);
  assert.equal(ltOne.display, '< 1%');
  assert.equal(ltOne.isLessThanOne, true);

  const fourPct = LACore.parsePercentage('4%');
  assert.equal(fourPct.value, 4);
  assert.equal(fourPct.display, '4%');

  const decimalPct = LACore.parsePercentage(0.18);
  assert.equal(decimalPct.value, 18);
  assert.equal(decimalPct.display, '18%');

  const usDate = LACore.parseDateValue('11/7/2025');
  assert.equal(usDate.iso, '2025-11-07');
  assert.equal(usDate.year, 2025);
  assert.equal(usDate.month, 11);
  assert.equal(usDate.day, 7);

  // Excel serial for 2026-11-06
  const serial = Math.round(Date.UTC(2026, 10, 6) / 86400000 + 25569);
  const excelDate = LACore.parseDateValue(serial);
  assert.equal(excelDate.iso, '2026-11-06');
});

test('Slug-to-title conversion and theme detection handle share slugs, activity URLs, and overrides', () => {
  const shareUrl =
    'https://www.linkedin.com/posts/alex-morgan_i-built-a-free-saas-pricing-simulator-tool-share-740001-aa';
  const title = LACore.slugToTitle(shareUrl, '2026-10-15');
  assert.equal(title, 'I built a free saas pricing simulator tool');
  assert.equal(LACore.detectTheme(title, 'i-built-a-free-saas-pricing-simulator-tool'), 'Built a tool / project');

  const roundupUrl =
    'https://www.linkedin.com/posts/alex-morgan_this-week-in-fintech-five-biggest-stories-share-740007-gg';
  const roundupTitle = LACore.slugToTitle(roundupUrl, '2026-10-20');
  assert.equal(LACore.detectTheme(roundupTitle, 'this-week-in-fintech-five-biggest-stories'), 'News roundup');

  const activityUrl = 'https://www.linkedin.com/feed/update/urn:li:activity:7521678577742938113';
  assert.equal(LACore.slugToTitle(activityUrl, '2026-10-29'), 'Untitled post (29 Oct 2026)');

  const emptySlugShare = 'https://www.linkedin.com/posts/john-bowman_share-7456123515772039168-FdLR';
  assert.equal(LACore.slugToTitle(emptySlugShare, '2026-05-02'), 'Untitled post (2 May 2026)');
});

test('Follower growth maths: sum of new followers, starting estimate, monthly growth %, and CMGR', () => {
  const wb = readWorkbookFile('synthetic-365d.xlsx');
  const parsed = LACore.parseWorkbook(wb, XLSX);
  assert.equal(parsed.isValidLinkedInExport, true);

  const analysis = LACore.analyseExport(parsed);
  const fg = analysis.followerGrowth;

  const manualSum = parsed.followers.daily.reduce((acc, d) => acc + d.newFollowers, 0);
  assert.equal(fg.netGained, manualSum);
  assert.equal(fg.estimatedStartFollowers, fg.totalFollowersNow - manualSum);

  // Check one full month's growth %
  const firstFull = fg.fullMonths[0];
  assert.ok(firstFull, 'Should have full months in 365-day export');
  const expectedMonthPct = (firstFull.newFollowers / firstFull.startFollowers) * 100;
  assert.ok(Math.abs(firstFull.growthPct - expectedMonthPct) < 1e-6);

  // Check compound monthly growth rate (CMGR) across all full months
  const lastFull = fg.fullMonths[fg.fullMonths.length - 1];
  const expectedCmgr =
    (Math.pow(lastFull.endFollowers / firstFull.startFollowers, 1 / fg.fullMonths.length) - 1) * 100;
  assert.ok(Math.abs(fg.cmgrAllFullMonths - expectedCmgr) < 1e-6);

  // First and last partial months should be marked partial
  assert.equal(fg.monthly[0].isPartial, true);
  assert.ok(fg.monthly[0].label.endsWith('*'));
});

test('Creator type and hidden strength detection, plus instant theme override recalculation', () => {
  const wb = readWorkbookFile('synthetic-365d.xlsx');
  const parsed = LACore.parseWorkbook(wb, XLSX);
  const analysis = LACore.analyseExport(parsed);

  // Synthetic 365d has 10 News roundup posts (primary) and 6 Built a tool posts with higher median engagements (hidden strength)
  assert.equal(analysis.creatorType.isExplorer, false);
  assert.equal(analysis.creatorType.primaryType.name, 'The Newsroom');
  assert.equal(analysis.creatorType.hiddenStrengthType.name, 'The Builder');
  assert.equal(analysis.creatorType.hasHiddenStrengthMismatch, true);
  assert.match(analysis.creatorType.hiddenStrengthCallout, /You post like The Newsroom.*rewards The Builder/);

  // Override all News roundup posts to 'Built a tool / project' and verify primary type updates
  const overrides = {};
  for (const p of analysis.postsAnalysis.allPosts) {
    overrides[p.url] = 'Built a tool / project';
  }
  const updated = LACore.analyseExport(parsed, { themeOverrides: overrides });
  assert.equal(updated.creatorType.primaryType.name, 'The Builder');
  assert.equal(updated.creatorType.hasHiddenStrengthMismatch, false);
});

test('Minimum sample rules: few-posts export shows The Explorer and greys out small themes', () => {
  const wb = readWorkbookFile('synthetic-few-posts.xlsx');
  const parsed = LACore.parseWorkbook(wb, XLSX);
  const analysis = LACore.analyseExport(parsed);

  assert.equal(analysis.creatorType.isExplorer, true);
  assert.equal(analysis.creatorType.primaryType.name, 'The Explorer');
  for (const t of analysis.postsAnalysis.themeStats) {
    assert.equal(t.meetsMinSample, false);
    assert.equal(t.statusNote, 'Not enough posts to judge');
  }
});

test('28-day export uses weekly charts, daily average projection caveat, and skips correlation', () => {
  const wb = readWorkbookFile('synthetic-28d.xlsx');
  const parsed = LACore.parseWorkbook(wb, XLSX);
  const analysis = LACore.analyseExport(parsed);

  assert.equal(analysis.followerGrowth.useWeeklyCharts, true);
  assert.equal(analysis.projections.hasEnoughFullMonths, false);
  assert.ok(analysis.projections.caveat.includes('fewer than 2 full calendar months'));
  assert.equal(analysis.reachAndEngagementTrend.correlation.hasEnoughDays, false);
});

test('Excel serial dates and numeric cells parse identically to string-formatted exports', () => {
  const wbStr = readWorkbookFile('synthetic-365d.xlsx');
  const wbNum = readWorkbookFile('synthetic-excel-types.xlsx');

  const analysisStr = LACore.analyseExport(LACore.parseWorkbook(wbStr, XLSX));
  const analysisNum = LACore.analyseExport(LACore.parseWorkbook(wbNum, XLSX));

  assert.equal(analysisNum.headline.followersNow, analysisStr.headline.followersNow);
  assert.equal(analysisNum.headline.netGained, analysisStr.headline.netGained);
  assert.equal(analysisNum.headline.totalImpressions, analysisStr.headline.totalImpressions);
  assert.equal(analysisNum.dateRange.startDate, analysisStr.dateRange.startDate);
  assert.equal(analysisNum.dateRange.endDate, analysisStr.dateRange.endDate);
});

test('Health score scales remaining components to 100 when a component is missing', () => {
  const sheetsMap = LACore.generateSyntheticSheetsMap('normal-365d');
  // Remove MOST RECENT POSTS so 'Reach beyond your network' (15 pts) is missing
  sheetsMap['MOST RECENT POSTS'] = [['Post URL', 'Post Publish Date', 'Post type', 'Impressions']];
  const parsed = LACore.parseSheetsMap(sheetsMap);
  const analysis = LACore.analyseExport(parsed);

  const hs = analysis.healthScore;
  assert.ok(hs.missingComponents.includes('Reach beyond your network'));
  assert.ok(hs.scalingNote && hs.scalingNote.includes('Reach beyond your network'));

  const sumMax = Math.round(LACore.sum(hs.components.map((c) => c.scaledMaxPoints)));
  assert.equal(sumMax, 100);
  assert.ok(hs.score >= 0 && hs.score <= 100);
});

test('Empty sheets export does not crash and reports missing data plainly', () => {
  const wb = readWorkbookFile('synthetic-empty-sheets.xlsx');
  const parsed = LACore.parseWorkbook(wb, XLSX);
  assert.equal(parsed.isValidLinkedInExport, true);
  const analysis = LACore.analyseExport(parsed);
  assert.equal(analysis.headline.followersNow, 420);
  assert.ok(analysis.warnings.length > 0);
});

test('Goal planner maths and verdicts across all 4 difficulty bands and invalid inputs', () => {
  const wb = readWorkbookFile('synthetic-365d.xlsx');
  const analysis = LACore.analyseExport(LACore.parseWorkbook(wb, XLSX));
  const cur = analysis.headline.followersNow; // 4850

  // Target below current total
  const lowGoal = LACore.planGoal(analysis, cur - 100, '2027-05-06');
  assert.equal(lowGoal.valid, false);

  // Target date in the past
  const pastGoal = LACore.planGoal(analysis, cur + 1000, '2025-01-01');
  assert.equal(pastGoal.valid, false);

  // On track (small increase over 6 months)
  const onTrack = LACore.planGoal(analysis, cur + 300, '2027-05-06');
  assert.equal(onTrack.valid, true);
  assert.equal(onTrack.verdictKey, 'onTrack');
  assert.equal(onTrack.verdictLabel, 'On track at your current pace');

  // Achievable stretch (~1.25x recent monthly average over 6 months)
  const stretchTarget = Math.round(cur + onTrack.recentAvgMonthlyGains * 6 * 1.25);
  const stretch = LACore.planGoal(analysis, stretchTarget, '2027-05-06');
  assert.equal(stretch.verdictKey, 'stretch');

  // Ambitious (~2.2x recent monthly average over 6 months)
  const ambitiousTarget = Math.round(cur + onTrack.recentAvgMonthlyGains * 6 * 2.2);
  const ambitious = LACore.planGoal(analysis, ambitiousTarget, '2027-05-06');
  assert.equal(ambitious.verdictKey, 'ambitious');

  // Unlikely (>3x recent monthly average over 6 months)
  const unlikelyTarget = Math.round(cur + onTrack.recentAvgMonthlyGains * 6 * 5);
  const unlikely = LACore.planGoal(analysis, unlikelyTarget, '2027-05-06');
  assert.equal(unlikely.verdictKey, 'unlikely');
});

test('Before and after comparison detects which export is older regardless of upload order', () => {
  const wbNewer = readWorkbookFile('synthetic-365d.xlsx');
  const wbOlder = readWorkbookFile('synthetic-older-365d.xlsx');

  const parsedNewer = LACore.parseWorkbook(wbNewer, XLSX);
  const parsedOlder = LACore.parseWorkbook(wbOlder, XLSX);

  const compOrder1 = LACore.compareExports(parsedOlder, parsedNewer);
  const compOrder2 = LACore.compareExports(parsedNewer, parsedOlder);

  assert.equal(compOrder1.valid, true);
  assert.equal(compOrder2.valid, true);
  assert.equal(compOrder1.beforeOrderIndex, 0);
  assert.equal(compOrder2.beforeOrderIndex, 1);

  assert.equal(compOrder1.metrics.followersBefore, 3950);
  assert.equal(compOrder1.metrics.followersAfter, 4850);
  assert.equal(compOrder1.metrics.followersDelta, 900);
  assert.equal(compOrder2.metrics.followersDelta, 900);
  assert.equal(compOrder1.isOverlapping, true);
  assert.equal(compOrder1.totalNewTopPosts, 3);
});

test('Non-LinkedIn .xlsx and broken files are rejected gracefully without crashing', () => {
  const wbNonLi = readWorkbookFile('synthetic-non-linkedin.xlsx');
  const parsedNonLi = LACore.parseWorkbook(wbNonLi, XLSX);
  assert.equal(parsedNonLi.isValidLinkedInExport, false);
  assert.match(parsedNonLi.error, /does not look like a LinkedIn Creator Analytics export/i);

  const brokenBuf = fs.readFileSync(path.join(TEST_DATA_DIR, 'synthetic-broken.xlsx'));
  let parsedBroken;
  try {
    const wbBroken = XLSX.read(brokenBuf, { type: 'buffer' });
    parsedBroken = LACore.parseWorkbook(wbBroken, XLSX);
  } catch (_err) {
    parsedBroken = { isValidLinkedInExport: false, error: 'Corrupted file' };
  }
  assert.equal(parsedBroken.isValidLinkedInExport, false);
});

test('Copy style check: zero em dashes in takeaways, recommendations, or AI Markdown output', () => {
  const wb = readWorkbookFile('synthetic-365d.xlsx');
  const wbOlder = readWorkbookFile('synthetic-older-365d.xlsx');
  const analysis = LACore.analyseExport(LACore.parseWorkbook(wb, XLSX));
  const comp = LACore.compareExports(LACore.parseWorkbook(wbOlder, XLSX), analysis);
  const md = LACore.generateAiMarkdown(analysis, comp, analysis.defaultGoalPlan);

  assert.ok(!md.includes('\u2014'), 'Generated Markdown must not contain em dashes');
  for (const t of analysis.top5Takeaways) {
    assert.ok(!t.includes('\u2014'), 'Takeaways must not contain em dashes');
  }
  for (const r of analysis.recommendations.items) {
    assert.ok(!r.evidence.includes('\u2014'), 'Recommendation evidence must not contain em dashes');
  }
});
