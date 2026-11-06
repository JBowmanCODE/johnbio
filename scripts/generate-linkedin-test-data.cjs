/* Generates synthetic LinkedIn Creator Analytics .xlsx test files into test-data/
   and prints key numbers from test-data/sample.xlsx if present.
   Run with: node scripts/generate-linkedin-test-data.cjs */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
require('../linkedin-analyser-core.js');
const LACore = globalThis.LACore;

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

function writeWorkbookFromSheetsMap(XLSX, sheetsMap, outFile) {
  const wb = XLSX.utils.book_new();
  for (const [sheetName, rows] of Object.entries(sheetsMap)) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  fs.writeFileSync(outFile, buf);
}

function main() {
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  const XLSX = loadXLSX();

  const variants = [
    { name: 'synthetic-365d.xlsx', variant: 'normal-365d' },
    { name: 'synthetic-28d.xlsx', variant: 'short-28d' },
    { name: 'synthetic-empty-sheets.xlsx', variant: 'empty-sheets' },
    { name: 'synthetic-excel-types.xlsx', variant: 'excel-types' },
    { name: 'synthetic-few-posts.xlsx', variant: 'few-posts' },
    { name: 'synthetic-older-365d.xlsx', variant: 'older-365d' },
  ];

  for (const item of variants) {
    const sheetsMap = LACore.generateSyntheticSheetsMap(item.variant);
    const outPath = path.join(TEST_DATA_DIR, item.name);
    writeWorkbookFromSheetsMap(XLSX, sheetsMap, outPath);
    console.log(`Generated ${item.name} (${fs.statSync(outPath).size} bytes)`);
  }

  // Generate a non-LinkedIn .xlsx (e.g. a budget spreadsheet)
  const nonLinkedInMap = {
    Budget2026: [
      ['Category', 'Planned', 'Actual'],
      ['Hosting', 120, 115],
      ['Domains', 45, 45],
    ],
  };
  writeWorkbookFromSheetsMap(XLSX, nonLinkedInMap, path.join(TEST_DATA_DIR, 'synthetic-non-linkedin.xlsx'));
  console.log('Generated synthetic-non-linkedin.xlsx');

  // Generate a broken/corrupted .xlsx file
  fs.writeFileSync(path.join(TEST_DATA_DIR, 'synthetic-broken.xlsx'), Buffer.from('NOT_A_VALID_ZIP_OR_XLSX_FILE'));
  console.log('Generated synthetic-broken.xlsx');

  // If test-data/sample.xlsx exists, run parser + analysis and print key numbers for hand-checking
  const samplePath = path.join(TEST_DATA_DIR, 'sample.xlsx');
  if (fs.existsSync(samplePath)) {
    console.log('\n=== REAL EXPORT CHECK (test-data/sample.xlsx) ===');
    const wb = XLSX.read(fs.readFileSync(samplePath), { type: 'buffer' });
    const parsed = LACore.parseWorkbook(wb, XLSX);
    const analysis = LACore.analyseExport(parsed);

    console.log('Date range:', analysis.dateRange.startDateDisplay, 'to', analysis.dateRange.endDateDisplay, `(${analysis.dateRange.totalDays} days)`);
    console.log('Followers now:', LACore.formatInt(analysis.headline.followersNow));
    console.log('Est. starting followers:', LACore.formatInt(analysis.headline.estimatedStartFollowers));
    console.log('Net new followers gained:', '+' + LACore.formatInt(analysis.headline.netGained), `(${LACore.formatPct(analysis.headline.periodGrowthPct, 1)})`);
    console.log('Total impressions:', LACore.formatInt(analysis.headline.totalImpressions));
    console.log('Members reached:', LACore.formatInt(analysis.headline.membersReached));
    console.log('Total engagements:', LACore.formatInt(analysis.headline.totalEngagements));
    console.log('Overall engagement rate:', LACore.formatPct(analysis.headline.overallEngagementRate, 2));
    console.log('CMGR (all full months):', LACore.formatPct(analysis.followerGrowth.cmgrAllFullMonths, 2), `(${analysis.followerGrowth.fullMonths.length} full months)`);
    console.log('CMGR (last 3 full months):', LACore.formatPct(analysis.followerGrowth.cmgrLast3FullMonths, 2));
    console.log('Best full month:', analysis.followerGrowth.bestFullMonth.label, '(+' + LACore.formatInt(analysis.followerGrowth.bestFullMonth.newFollowers) + ')');
    console.log('Worst full month:', analysis.followerGrowth.worstFullMonth.label, '(+' + LACore.formatInt(analysis.followerGrowth.worstFullMonth.newFollowers) + ')');
    console.log('Health Score:', `${analysis.healthScore.score}/100 (${analysis.healthScore.label})`);
    analysis.healthScore.components.forEach((c) => {
      console.log(`  - ${c.name}: ${c.score}/${c.scaledMaxPoints} (${c.metricDisplay})`);
    });
    console.log('Primary Creator Type:', analysis.creatorType.primaryType.name, `(${analysis.creatorType.primaryThemeStats.theme}, ${analysis.creatorType.primaryThemeStats.postCount} posts)`);
    console.log('Hidden Strength:', analysis.creatorType.hiddenStrengthType.name, `(${analysis.creatorType.hiddenStrengthStats.theme}, median ${analysis.creatorType.hiddenStrengthStats.medianEngagements} engagements)`);
    console.log('Callout:', analysis.creatorType.hiddenStrengthCallout);
    console.log('Top 5 Takeaways:');
    analysis.top5Takeaways.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  }
}

main();
