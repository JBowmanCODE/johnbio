# Bill Calculator

> Split restaurant bills and calculate tips per person in the browser using Python running client-side via Pyodide.

- **Canonical URL**: https://johnb.io/calculator
- **Markdown URL**: https://johnb.io/calculator.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: March 2026

The Bill Calculator splits any restaurant or group bill instantly. Enter the total, choose a tip percentage, set the number of people, and it returns the tip amount, total with tip, and the share per person. It handles the arithmetic so nobody at the table has to argue over it. The calculation runs entirely in your browser - no data is sent anywhere and the tool works offline once the page has loaded.

This is a pure client-side tool with no AI, no external API and no data collection. It uses [Pyodide](https://pyodide.org) to run Python calculation logic directly in the browser via WebAssembly.

## How It Works

1. **Enter the total bill amount.** in pounds. This is the full amount before tip - what the restaurant is charging.
2. **Set a tip percentage.** Common amounts are 10% (standard), 12.5% (often added automatically in London restaurants) and 15% (generous). Enter 0 for no tip.
3. **Enter the number of people.** splitting the bill. For a solo diner, leave this at 1.
4. **Click Calculate.** The tool instantly returns the tip amount, the total bill with tip included, and the amount each person owes.

## Key Points

- **Runs entirely in your browser.** No data is sent anywhere. The calculation uses [Pyodide](https://pyodide.org) - a Python runtime compiled to WebAssembly - so the logic runs locally without any server request.
- **Works for any group size.** Whether it is a table of two or a party of twenty, the per-person split updates instantly.
- **Handles decimal inputs.** Bill amounts like £47.80 and fractional tip percentages like 12.5% are supported.
- **No account or internet connection required after load.** Once the page has loaded, the calculator works offline.

## Frequently Asked Questions

### Does this tool use AI?

No. This is a straightforward arithmetic calculator. There is no AI model involved - the calculations are simple maths run locally in your browser using Pyodide.

### What is Pyodide?

[Pyodide](https://pyodide.org) is a version of Python compiled to [WebAssembly](https://webassembly.org) that runs directly in web browsers. It allows Python code to execute client-side without a server, which is what powers the calculation logic here.

### What tip percentage should I leave in the UK?

In the UK, 10–15% is standard for sit-down restaurants where service is not already included. Many London restaurants add a 12.5% service charge automatically - check your bill before adding more. Tipping is discretionary; you are not obligated to pay a tip that has been added without your agreement. [Which? has clear guidance](https://www.which.co.uk/consumer-rights/advice/do-i-have-to-pay-a-service-charge-aIFKI0l1B9e3) on service charges and your rights.

### Does the split have to be equal?

This calculator assumes an equal split between all diners. For unequal splits - where each person pays for what they ordered - you would need to calculate each person's portion separately and enter it as a solo bill.

### Is my data stored?

No. The tool stores nothing. Your bill amount and settings exist only in the page for the duration of your visit and are not transmitted anywhere.

## Sources & Primary References

1. [Pyodide - Python in the browser via WebAssembly](https://pyodide.org/en/stable/) - Pyodide.org. Accessed March 2026.
2. [WebAssembly - Official overview](https://webassembly.org) - WebAssembly.org. Accessed March 2026.
3. [Which? - Do I have to pay a service charge?](https://www.which.co.uk/consumer-rights/advice/do-i-have-to-pay-a-service-charge-aIFKI0l1B9e3) - Which.co.uk. Accessed March 2026.
4. [UK Tipping - Guide to tipping in the UK](https://www.uktipping.co.uk) - UKTipping.co.uk. Accessed March 2026.
