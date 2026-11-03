# FAQ Schema Generator

> Turns question and answer pairs into valid FAQPage JSON-LD structured data with a manual builder and an AI draft mode powered by Claude Haiku 5.5.

- **Canonical URL**: https://johnb.io/faq-schema
- **Markdown URL**: https://johnb.io/faq-schema.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: April 2026

## Why FAQ Schema Still Matters in 2026

Google pulled FAQ rich results for most sites in August 2023. The schema itself did not go anywhere. It still helps AI assistants like ChatGPT, Claude and Perplexity parse your page, it still feeds knowledge graphs, and Bing still renders FAQ rich results in a way that Google no longer does. Adding it costs nothing.

The rule that trips most people up is simple: the questions and answers in the schema must match the visible text on the page. If they do not, you get a manual action warning in Search Console. This tool pairs a manual builder with an AI draft mode, but both produce schema you can paste directly into the page head.

## How It Works

1. **Pick your mode.** Write Manually if you already have the questions. Draft with AI if you want a first pass from a topic.
2. **Fill in Q&As.** Add as many question and answer pairs as you need. You can remove any row.
3. **Click Generate.** The tool outputs a complete FAQPage JSON-LD block following Schema.org guidelines.
4. **Copy the output.** Use the Copy button to grab the full script tag, ready to paste.
5. **Paste into your head.** Drop it inside the `<head>` of your page. Make sure the visible page content has the same questions and answers.
6. **Validate.** Run the page through Google Rich Results Test to confirm the schema parses cleanly.

## Key Points

- **Schema must match visible content.** If the answers in your JSON-LD differ from what a user sees on the page, Google considers it misleading.
- **Plain text answers.** Answer fields can contain HTML but most sites keep them as plain text to avoid character escaping issues.
- **One FAQPage per page.** Do not add multiple FAQPage blocks to the same URL. If you need more questions, extend the existing block.
- **Still useful for AI search.** Perplexity, ChatGPT and Claude all parse structured data when they cite pages. FAQ schema gives them a clean structure to extract.
- **Use on pages with real Q&As.** FAQPage is not for product pages or category pages. It is for pages where the content is genuinely a list of questions and answers.

## Frequently Asked Questions

### What is FAQPage schema?

FAQPage is a Schema.org type that marks up a page containing a list of questions and answers. Search engines use it to understand the content structure, and in some cases display rich results that show the questions directly in search listings.

### Does Google still show FAQ rich results?

Since August 2023 Google has limited FAQ rich results to a small set of well-known government and health sites. The schema is still worth adding because it helps AI assistants and other search engines understand the page, and it costs nothing to include.

### Where do I paste the generated code?

Paste it inside a script tag with type application/ld+json in the head section of the page. The questions and answers in the schema must match the visible content on the page, otherwise Google treats it as a violation of its structured data guidelines.

### Can I generate FAQs from a topic?

Yes. The Draft with AI tab takes a topic or a URL and returns five to eight relevant questions and answers. Review the output before publishing to make sure it is accurate and matches the page content.

### Is the output valid JSON-LD?

The tool outputs FAQPage JSON-LD that follows Schema.org and Google structured data guidelines. You can validate the result in Google Rich Results Test or Schema.org Validator before publishing.

## Sources & Primary References

1. [Schema.org - FAQPage type definition](https://schema.org/FAQPage)
2. [Google Search Central - FAQ Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
3. [Google Rich Results Test](https://search.google.com/test/rich-results)
4. [Schema.org Validator](https://validator.schema.org)
5. [Google - Changes to HowTo and FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) - August 2023.
