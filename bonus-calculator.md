# iGaming Bonus Cost Calculator

> Model the true operator cost of casino bonus offers from bonus amount, wagering requirement, house edge and player completion rate, with breakeven analysis and scenario tables.

- **Canonical URL**: https://johnb.io/bonus-calculator
- **Markdown URL**: https://johnb.io/bonus-calculator.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: March 2026

The iGaming Bonus Cost Calculator models the true financial cost of a casino welcome bonus or promotional offer. Enter the bonus amount, wagering requirement multiplier, the house edge of the qualifying games, and your expected player completion rate - the tool returns the total wagering obligation, expected player loss, net cost to the operator per bonus issued, and the breakeven house edge. A scenario table shows how cost changes across five different completion rate assumptions.

This tool is built for iGaming operators, CRM managers, affiliates and compliance teams who need to quickly assess whether a promotion is commercially viable. All calculations run in the browser - no data is sent to any server. The model assumes a simplified linear completion rate; real-world outcomes will vary based on game mix, bonus mechanics, player segment and session length distribution.

## How It Works

1. **Enter the bonus amount.** This is the monetary value credited to the player - for example, a 100% match bonus on a £100 deposit gives a £100 bonus.
2. **Set the wagering requirement.** The multiplier applied to the bonus before it can be withdrawn. A 35× requirement on a £100 bonus means the player must wager £3,500 in total.
3. **Enter the house edge.** The percentage of each bet the operator retains on average over the long run. Slots typically range from 3% to 6%. Live blackjack can be under 1%. The game mix that qualifies for wagering significantly affects cost.
4. **Set the player completion rate.** The percentage of bonus recipients who complete the full wagering requirement and claim the bonus. Industry averages vary widely - typical ranges are 40% to 70% depending on the offer structure and player segment.
5. **Click Calculate.** The tool returns your four key metrics and a scenario table showing how cost shifts at different completion rates.

## Key Points

- **The breakeven house edge is the most important single figure.** If your qualifying games' house edge exceeds 1 ÷ wagering multiplier × 100%, the bonus is mathematically profitable for the operator from completers alone. At 35× wagering, the breakeven is 2.86%.
- **Completion rate drives actual cost more than wagering multiplier.** A low completion rate means most bonus funds are forfeited before payout. Raising wagering requirements beyond breakeven makes diminishing returns once completion rates fall below 50%.
- **Game contribution rules matter.** This calculator assumes 100% contribution from all qualifying bets. If your terms restrict wagering to high-margin slots only, your effective house edge is higher and cost lower. If table games count at 10%, the blended house edge may be much lower than you assume.
- **This is a simplified model.** It does not account for deposit amounts, play-through on real money, multi-bonus stacking, player lifetime value, or the revenue generated from re-depositing bonus players. It is a cost-per-offer tool, not a full CRM attribution model.
- **All calculations are client-side.** No data is sent to any server. The tool works entirely in the browser.

## Frequently Asked Questions

### What is a wagering requirement in iGaming?

A wagering requirement (also called a playthrough requirement) is the number of times a player must bet the bonus amount before it converts to withdrawable cash. A 35× requirement on a £100 bonus means the player must place £3,500 of bets. The higher the multiplier, the more the operator expects to recoup from the player's losses before the bonus is released.

### What is a typical house edge for slot games?

Most online slots operate between 94% and 97% RTP (Return to Player), which translates to a 3% to 6% house edge. Premium branded slots or progressive jackpot titles sometimes carry a higher house edge of 7–10%. Live dealer games like blackjack (with basic strategy) have edges below 1%, which is why many operators either restrict table game contributions or require higher wagering multipliers.

### What is a realistic player completion rate?

Completion rates depend heavily on the offer structure, player segment and wagering requirement level. Welcome bonuses with 30–40× requirements typically see completion rates between 40% and 65%. High wagering requirements (50×+) or restricted game selections can push completion below 30%. Free spin bonuses often have lower absolute completion rates since the bonus value is lower. The default of 60% in this tool is a reasonable mid-market estimate.

### How is the breakeven house edge calculated?

The breakeven occurs when expected player losses equal the bonus amount. If a player wagers B × W total, they lose B × W × HE on average. Setting this equal to the bonus B: B × W × HE = B, so HE = 1 ÷ W. At 35× wagering, the breakeven house edge is 1 ÷ 35 = 2.86%. Any game with a house edge above this is profitable for the operator from completing players.

### Does this tool comply with UK Gambling Commission bonus advertising rules?

This is a cost-modelling tool for operators and is not a consumer-facing bonus advertisement. It does not claim any specific bonus offer exists or is available. For guidance on compliant bonus advertising under UKGC rules, refer to the [UKGC Licence Conditions and Codes of Practice](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/licence-conditions-and-codes-of-practice) and the [ASA Non-Broadcast Advertising Code](https://www.asa.org.uk/codes-and-rulings/advertising-codes/non-broadcast-code.html).

## Sources & Primary References

1. [UK Gambling Commission - Licence Conditions and Codes of Practice (LCCP)](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/licence-conditions-and-codes-of-practice) - gamblingcommission.gov.uk. Accessed March 2026.
2. [Malta Gaming Authority - Player Hub and Responsible Gambling](https://www.mga.org.mt/player-hub/responsible-gambling/) - mga.org.mt. Accessed March 2026.
3. [Advertising Standards Authority - Non-Broadcast Advertising Code](https://www.asa.org.uk/codes-and-rulings/advertising-codes/non-broadcast-code.html) - asa.org.uk. Accessed March 2026.
4. [GambleAware - Safer gambling information and support](https://www.begambleaware.org) - begambleaware.org. Accessed March 2026.
5. [Expected Value - Mathematical foundation for casino probability calculations](https://en.wikipedia.org/wiki/Expected_value) - Wikipedia. Accessed March 2026.
