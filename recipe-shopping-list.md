# Recipe to Shopping List

> Paste a recipe or weekly meal plan to get one consolidated UK supermarket shopping list powered by Claude Haiku 5.5, grouped by aisle with US-to-UK ingredient translation and search links for Tesco, Sainsbury's, Asda, Morrisons, Ocado, Waitrose, Iceland and Co-op.

- **Canonical URL**: https://johnb.io/recipe-shopping-list
- **Markdown URL**: https://johnb.io/recipe-shopping-list.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: August 2026

## Why Writing a Shopping List From Recipes Is Such a Chore

The tedious part of cooking from recipes isn't the cooking. It's sitting with four browser tabs open, working out that three of the recipes want onions, that two of them want a tin of chopped tomatoes, and that you already have paprika. Then typing all of it into a supermarket search box one item at a time, in a slightly different form than the recipe wrote it, because "2 tbsp finely chopped flat-leaf parsley" returns nothing useful.

That last bit is the interesting problem. Supermarket site search is a keyword matcher, not a semantic one. It wants "flat leaf parsley", not the recipe's phrasing. It wants "beef mince", not "ground beef" - which is why American recipes are so annoying to shop for in Britain. The translation step is doing more work here than the list-building step, and it's the part I'd have got wrong if I'd built this by hand.

What this page can't do is put anything in your trolley. I looked hard for a way. There isn't one that doesn't involve asking you for your Tesco password, and I'm not building that. So it stops at the search box and hands over to you.

## How It Works

1. **Paste your recipes.** One recipe or a week of them. An ingredients list is enough, but a full recipe with the method works too. If you want it scaled, write "double all of these" at the top and it will be handled.
2. **Get one consolidated list.** Ingredients are merged across recipes, quantities are added up, and everything is grouped into supermarket aisles in roughly the order you walk them.
3. **Pick a shopping mode.** Balanced, Premium pick or Best value. This rewrites the search term for every item instantly, with no waiting and no extra usage against your daily limit.
4. **Choose your supermarket.** The whole list re-links to whichever of the eight you select. Your choice is remembered for next time.
5. **Work through the list.** Each item opens that supermarket's search in a new tab, so your list stays put. Tick things off as you go; the ticks survive a page reload.
6. **Or open them in bulk.** The "Open all" button fires up a tab per remaining ingredient, ten at a time so your browser survives it. Ticked and hidden items are skipped. You will need to allow pop-ups for johnb.io the first time, and the button will tell you if your browser blocked them.

## Key Points

- **No UK supermarket has a public basket API.** Tesco publishes product data but explicitly excludes ordering. Every tool that claims to fill a basket across retailers is either a browser extension driving your own logged-in session, or a paid scraping service. A web page cannot do it.
- **Search terms are not recipe wording.** Supermarket search matches keywords. Strip the quantity, the prep and the adjectives, and you get results; leave them in and you get an empty page.
- **American recipes need translating.** Cilantro, zucchini, scallions, heavy cream and all-purpose flour all return nothing on a UK grocery site. This is the single most common reason a search comes back empty.
- **Merging across recipes is where the time goes.** Cooking four meals in a week usually means the same six or seven base ingredients appear repeatedly. Summing them properly is the difference between one onion and five.
- **Store-cupboard staples are worth separating.** Salt, oil, flour and dried spices are usually already in the house. They stay on the list by default, dimmed, with a toggle to hide them, because silently dropping something you actually needed is the worse mistake.
- **Ocado carries M&S Food.** Since the 2020 partnership replaced Waitrose as Ocado's supermarket partner, M&S products appear in Ocado search results. Worth knowing if you are hunting for a specific M&S item.

## Frequently Asked Questions

### Can it add everything to my basket automatically?

No, and be sceptical of anything that says it can. No UK supermarket offers a public add-to-basket API, so no website can fill your trolley without holding your login details. What this does is take you straight to the right search on your supermarket's own site, one ingredient at a time. You tap add, and they keep your basket.

### Which supermarkets does it work with?

Eight: Tesco, Sainsbury's, Asda, Morrisons, Ocado, Waitrose, Iceland and Co-op. Ocado results include M&S Food. You pick one supermarket at a time and the whole list re-links to it. Co-op is the weakest of the eight because its online shop is store-scoped, so it may ask for a postcode before running the search.

### What is the difference between the three shopping modes?

They change the words typed into the supermarket's search box, and nothing else. Balanced uses the plain product name. Premium pick adds qualifiers like free range or organic. Best value strips the term back so own-brand basics rank first. None of them changes what you pay, because you still choose the product yourself.

### Can I paste a whole week's meal plan?

Yes, and that is what it is built for. Ingredients appearing in more than one recipe are merged and their quantities added up, so three recipes needing onions produce one line telling you how many to buy. Each item shows which recipes it came from, so you can check nothing was missed.

### Does it work with American recipes?

Yes. US ingredient names are translated into UK supermarket vocabulary before the search links are built, so cilantro becomes coriander, zucchini becomes courgette and all-purpose flour becomes plain flour. Searching a UK supermarket for cilantro returns nothing at all, so this matters more than it sounds.

### Is it free, and is my recipe stored anywhere?

It is free, with a limit of three lists per day. There is no sign-up and nothing is kept on a server: your text goes to the AI, the list comes back, and that is the end of it. Ticked-off items are saved in your own browser only, so you can close the page mid-shop and pick up where you left off.

## Sources & Primary References

1. [Tesco Groceries](https://www.tesco.com/groceries/) - Product search used for the Tesco links.
2. [Ocado](https://www.ocado.com/) - Online-only retailer whose catalogue includes M&S Food.
3. [Co-op home delivery](https://www.coop.co.uk/ways-to-shop/home-delivery) - Explains the store-scoped model and minimum order that make Co-op links less reliable than the rest.
4. [Which? supermarket price comparison](https://www.which.co.uk/reviews/supermarkets/article/supermarket-price-comparison-aPpYp9j1MFin) - Independent monthly comparison of UK supermarket basket prices.
5. [Content Repurposer](https://johnb.io/content-repurposer) - Another JohnB.io tool that restructures one input into several usable outputs.
