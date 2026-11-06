# LinkedIn Analytics Analyser

> Free browser-based LinkedIn Creator Analytics .xlsx analyser with a 0-100 health score, creator type diagnosis, compound monthly growth rate (CMGR) projections, URL-slug post theme detection, audience vs content reach comparison, shareable summary cards, PDF report and AI-ready Markdown export.

- **Canonical URL**: https://johnb.io/linkedin-analyser
- **Markdown URL**: https://johnb.io/linkedin-analyser.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: November 2026

## Why Analyse Your LinkedIn Export in the Browser?

LinkedIn's native analytics screen shows one chart at a time and buries your best data inside a seven-sheet Excel workbook. By parsing your `.xlsx` file directly in your browser, this tool calculates your compound monthly follower growth, matches post slugs to content themes, compares your follower base against who actually views your posts, and builds a structured Markdown summary you can drop into ChatGPT or Claude.

## How It Works

1. **Export your LinkedIn analytics.** Visit linkedin.com/analytics/creator/audience/, choose Past 365 days, and click Export to download your .xlsx file.
2. **Drop the .xlsx file into the analyser.** Drag and drop your file or tap to select it, or click 'Try it with example data' to explore a synthetic demo first.
3. **Review your score, takeaways and post themes.** Inspect your 0-100 health score, Creator Type, follower projections, audience gaps and adjust any post themes with the inline dropdowns.
4. **Download your share card, PDF report or AI Markdown file.** Save a PNG summary card for LinkedIn, a multi-page A4 PDF report, or a structured .md file ready for ChatGPT and Claude.

## Key Points

- **100% client-side privacy.** Your file never leaves your browser and no account or API key is required.
- **Honest sample-size rules.** Themes and weekdays require at least 3 posts before being ranked, and partial calendar months are excluded from best/worst month averages.
- **Interactive theme overrides.** Fix any post's keyword-detected theme with one click and watch your Creator Type and recommendations recalculate live.
- **Before and after comparison.** Upload an older export alongside your latest file to track follower momentum, health score changes and demographic shifts.
- **AI-ready Markdown export.** Download a clean `.md` report designed to be uploaded straight into ChatGPT, Claude or Gemini for post drafting.
- **Independent tool.** Not affiliated with or endorsed by LinkedIn.

## Frequently Asked Questions

### Does my LinkedIn analytics file ever leave my browser?

No. Your .xlsx file is parsed entirely inside your browser using JavaScript. Nothing from your file is uploaded to a server, stored in localStorage, or sent to analytics.

### How do I export my LinkedIn Creator Analytics .xlsx file?

Open linkedin.com/analytics/creator/audience/ on desktop or mobile web, select Past 365 days for the most complete analysis, and click the Export button in the top right corner to download your .xlsx workbook.

### Why are starting follower totals and monthly follower totals marked as estimates?

LinkedIn exports your total followers on the export date and the number of new followers gained each day, but it does not export unfollows. Working backwards from today's total gives a close estimate rather than an exact historical count.

### Can I change the content theme assigned to my posts?

Yes. Initial themes are guessed from keywords in each post's URL slug, and you can use the dropdown next to any post to change its theme. Your theme stats, Creator Type, recommendations and downloads update immediately.

### Can I compare two LinkedIn exports over time?

Yes. After loading your first export, use the 'Add an older export to compare' box at the bottom of the results. The tool automatically detects which file is older and shows changes in followers, engagement rate, health score, audience shifts and new top posts.

## Sources & Primary References

1. [LinkedIn Help - Creator Analytics Overview and Export](https://www.linkedin.com/help/linkedin/answer/a547077)
2. [Search & Prompt Radar](https://johnb.io/search-radar) - discover what people search on Google, Reddit and LinkedIn.
3. [Content Repurposer](https://johnb.io/content-repurposer) - turn articles into LinkedIn posts and video scripts.
4. [AI CV Enhancer](https://johnb.io/aitocv) - tailor your CV and cover letter for roles in 10 countries.
