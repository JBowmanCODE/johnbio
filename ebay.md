# eBay & Vinted Profit Calculator

> Calculate net profit and ROI from eBay, Vinted and auction saleroom sales after platform fees, buyer premiums, postage and purchase costs.

- **Canonical URL**: https://johnb.io/ebay
- **Markdown URL**: https://johnb.io/ebay.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: March 2026

The eBay & Vinted Profit Calculator helps resellers work out their actual profit after platform fees, postage costs and the original purchase price. It covers three selling channels: [Vinted](https://www.vinted.co.uk), [eBay](https://www.ebay.co.uk), and saleroom/auction sales. Enter your items, set your fee rates, and the tool calculates profit per item, total profit, return on investment and suggested minimum sale prices. Data is saved to your browser's localStorage so it persists between sessions.

This tool runs entirely in your browser using [React](https://react.dev). No data is sent to any external server. Your item lists and settings are stored locally in your browser and remain private to you. Default fee rates are based on standard platform rates as of March 2026 - always verify current rates directly with [eBay](https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees) and [Vinted](https://www.vinted.co.uk/help/selling) before making purchasing decisions.

## How It Works

1. **Choose a tab.** Select Vinted, eBay or Saleroom depending on where you bought or plan to sell your items. Each tab has fee settings specific to that platform.
2. **Add your items.** For Vinted and saleroom lots, you can paste listing HTML or enter items manually. For eBay, enter your sale price, purchase cost and postage. Set a default postage cost to apply it across multiple items at once.
3. **Adjust fee rates.** The tool pre-fills with current standard rates - eBay final value fee (default 13%), Vinted buyer protection, saleroom buyer's premium and online commission. Update these if your account has negotiated rates or if platform rates have changed.
4. **Review your profit summary.** The tool displays profit per item, total profit across all items, ROI percentage and a suggested minimum sale price to hit your target profit margin. Use the filter to show only profitable items or high-return items.
5. **Sort and export.** Sort columns by any field - sale price, profit, ROI. Your data is automatically saved to localStorage and reloads the next time you open the tool.

## Key Points

- **Three selling channels in one tool.** Vinted, eBay and saleroom lots - each with platform-specific fee structures and their own item lists, tracked in the same interface.
- **LocalStorage persistence.** Your items and settings save automatically to your browser. Close the tab, come back later and your data is still there - no account or login needed.
- **Adjustable fee rates.** eBay's final value fee varies by category. Saleroom buyer's premiums vary by auction house. Enter the actual rates for your specific sales rather than relying on defaults.
- **ROI and minimum price calculator.** Set a target profit percentage (e.g. 100% ROI / doubling your money) and the tool shows the minimum sale price needed to hit it after all fees and costs.
- **No AI, no server, no account.** Purely client-side. Your data stays in your browser. Nothing is uploaded anywhere.

## Frequently Asked Questions

### What is eBay's current final value fee?

eBay's standard final value fee for most private sellers in the UK is around 12.8–13.2% of the total sale amount including postage, as of March 2026. This varies by category - vehicles, property and business equipment have different rates. Always check [eBay's current fee schedule](https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees) before relying on this tool's default. eBay also charges a per-transaction fee of £0.30 for private sellers, which this tool accounts for separately.

### Does Vinted charge selling fees?

Vinted does not charge the seller a commission - instead it charges a buyer protection fee to the buyer. This means your sale price is what you receive (minus postage if you are covering it). However, [Vinted's fee structure](https://www.vinted.co.uk/help/selling) does include optional promoted listing fees and postage labels purchased through the platform.

### What is a buyer's premium in a saleroom context?

A buyer's premium is a percentage added to the hammer price at auction, paid by the buyer. For resellers who buy at auction and sell on eBay or Vinted, the total cost of an item is the hammer price plus the buyer's premium (typically 20–30%), plus any applicable VAT on the premium. The saleroom tab in this tool lets you enter the buyer's premium percentage and any online commission charged by the auction platform.

### Will my data be lost if I clear my browser cache?

Yes. The tool saves to localStorage, which is cleared when you clear site data or browser storage. If you have important item lists, export or note them down before clearing your cache.

### Does this tool use AI?

No. All profit calculations are straightforward arithmetic based on the values you enter. There is no AI model involved and no data is sent to any external service.

## Sources & Primary References

1. [eBay UK - Selling fees overview](https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees) - eBay.co.uk. Accessed March 2026.
2. [Vinted UK - Selling help and fee information](https://www.vinted.co.uk/help/selling) - Vinted.co.uk. Accessed March 2026.
3. [HMRC - VAT on auctioneers and art dealers](https://www.gov.uk/guidance/vat-on-auctioneers-and-art-dealers) - GOV.UK. Accessed March 2026.
4. [HMRC - Trading allowance for online sellers](https://www.gov.uk/income-tax/trading-and-property-allowances) - GOV.UK. Accessed March 2026.
5. [React - JavaScript library for building user interfaces](https://react.dev) - React.dev. Accessed March 2026.
