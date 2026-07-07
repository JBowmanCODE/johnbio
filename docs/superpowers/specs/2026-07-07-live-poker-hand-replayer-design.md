# Live Poker Hand Replayer — Design

**Date:** 2026-07-07
**Status:** Approved for planning
**URL:** https://johnb.io/live-poker-hand-replayer (soft launch — unlinked)

## What it is

A tool that turns a described live poker hand into an animated replay on a poker table. Users either fill in a guided two-step form or paste free-text hand notes (parsed by AI). The replay shows all players, names, chip stacks, positions, cards, and every action street by street, with step-through and auto-play controls. Replays are shareable via URL and embeddable via iframe.

**Scope:** No Limit Hold'em only. 2–9 players. Cash or tournament (antes and straddles supported). One hand per replay.

## Soft launch rules

- NOT added to the `TOOLS` array in `index.js` (no home page card)
- NOT added to `header.html` nav dropdowns (desktop or mobile drawer)
- NOT added to `sitemap.xml` or `llms.txt` until proper launch
- Page head is fully launch-ready (SEO meta, `index, follow` robots) — the page is simply unlinked, reachable only by direct URL

## Files

| File | Role |
|---|---|
| `live-poker-hand-replayer.html` | Tool page — full head checklist, accordions in standard order |
| `live-poker-hand-replayer.css` | Table, seats, cards, chips, controls, form builder styles |
| `live-poker-hand-replayer.js` | Form builder, replay engine, hand evaluator, share/embed, worker client |
| `workers/live-poker-hand-replayer-worker.js` | AI parse endpoint (Service Worker format) |

Page follows the standard tool page pattern: shared `styles.css`/`scripts.js` classes first, custom CSS only where needed. Head includes title ("Live Poker Hand Replayer - JohnB.io"), meta description, keywords, robots, canonical (`https://johnb.io/live-poker-hand-replayer` — no www, no trailing slash), full OG + Twitter tags, GA gtag, and `SoftwareApplication` JSON-LD with `Organization` publisher. Accordion order: FAQ (open), How It Works, Key Points, Sources. New CSS/JS loaded with `?v=1`.

## Hand data model

One JSON object drives everything. Both input paths produce it; the replay engine, evaluator, share link, and embed all consume it. Neither input path talks to the replay engine directly.

```json
{
  "gameType": "cash",
  "currency": "$",
  "blinds": { "sb": 2, "bb": 5, "ante": 0, "straddle": 0 },
  "players": [
    { "seat": 1, "name": "Hero", "stack": 500, "position": "BTN", "cards": ["Kh", "Kd"], "isHero": true },
    { "seat": 2, "name": "Villain", "stack": 620, "position": "BB", "cards": null, "isHero": false }
  ],
  "board": { "flop": ["7c", "8d", "2s"], "turn": "Qh", "river": "3c" },
  "actions": [
    { "street": "preflop", "player": "Villain", "type": "raise", "amount": 25 }
  ],
  "winnerOverride": null
}
```

- `gameType`: `"cash"` or `"tournament"`. Tournament shows stacks as chips (no currency symbol); cash uses `currency`.
- `cards`: two-card array or `null` (unknown). Card format: uppercase rank + lowercase suit (`"Kh"`, `"Tc"`; ten is `T`).
- `actions`: ordered list. `type` ∈ `fold | check | call | bet | raise | allin`. `amount` is the total committed on that action where relevant.
- Blinds/antes/straddles are posted automatically by the engine from `blinds` — they are not actions.
- `winnerOverride`: player name, used only when no showdown hands are known and the last-aggressor default is wrong.

Validation rules (shared by form and AI-parse paths): 2–9 players, unique names, unique positions valid for player count, no duplicate cards anywhere, stacks > 0, action sequence legal (turn order, no acting after folding, amounts within stacks).

## Input path 1: two-step form builder

**Step 1 — Table setup.** Game type, blinds (SB/BB), optional ante and straddle, player count 2–9, then per player: name, stack, position, cards if known. Hero's cards required; villains' optional. Card picker is a rank × suit grid that greys out cards already used anywhere in the hand.

**Step 2 — Action builder.** The engine tracks whose turn it is and offers only legal actions (Fold / Check / Call N / Bet–Raise with amount input / All-in). Between streets it prompts for board cards (flop 3, turn 1, river 1). Pot and stacks update live as actions are added. Undo removes the last action. When betting closes (everyone folded or showdown reached), a Replay button appears.

Invalid hands are impossible to build — the builder is the validation layer.

## Input path 2: AI-parsed paste

Textarea labelled to accept notes in any style ("UTG raises 25, I 3bet 85 with KK on the button..."). On submit, the client POSTs to the worker; the worker calls **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`, the cheapest current model) with a system prompt instructing it to return either the hand JSON exactly matching the schema above, or `{ "parseError": "...", "partial": { ...whatever was extractable... } }`.

Client behaviour on response:
- Valid JSON passing local validation → straight to replay.
- Partial or invalid → open the form builder pre-filled with everything that was parsed, with a message listing what's missing. Never a dead end.

### Worker (`live-poker-hand-replayer-worker.js`)

Service Worker format (`addEventListener('fetch', ...)`) — NOT ES modules. Deployed name `live-poker-hand-replayer-worker` → URL `https://live-poker-hand-replayer-worker.ukjbowman.workers.dev`, matching the `WORKER_URL` constant in the frontend JS.

Standard pattern, in order:
1. CORS — allow `https://johnb.io` and `https://www.johnb.io` only
2. OPTIONS preflight → 204
3. Rate limit: **5 parses per IP per day** via `RATE_LIMIT_KV` global binding. Key `pokerreplay:{ip}:{yyyy-mm-dd}`, incremented, 86,400s expiry. Over limit → 429 with a friendly message including when it resets. Fail-open if KV binding is undefined.
4. Validate body: JSON, `notes` string, 20–5,000 chars
5. Call Anthropic API with `ANTHROPIC_API_KEY` (global secret), model `claude-haiku-4-5-20251001`, max_tokens sized for a 9-player hand JSON (~2,000)
6. Return `{ success: true, result }` or `{ success: false, error }` — never leak upstream error bodies or stack traces

## Replay engine and table UI

**Rendering: DOM + CSS.** No canvas, no SVG, no libraries. Oval felt table div; up to 9 seat divs absolutely positioned around it (per-count seat maps); dealer button; pot display centre; five community card slots.

**State model:** table state at action index N is computed by folding actions 0..N over the initial state (post blinds/antes/straddle, deal). Stepping backward/forward just recomputes and re-renders — no reverse-animation logic, no state drift. Side pots computed correctly for multiple all-ins.

**Seat display:** name, live stack, two cards (face-down backs for unknown/unrevealed, faces for hero and at showdown), current-bet chips in front of the seat, action tag ("raises 85"). Folded players grey out. Active player highlighted.

**Controls (below table):** ⏮ previous action · ▶/⏸ play–pause (auto-advance ~2s per action) · next ⏭ · speed group 1x / 1.5x / 2x (same UI pattern as the article audio player) · progress text "Action 7 of 23 — Turn". Keyboard: arrow keys step, space toggles play. All controls have ARIA labels.

**Animation:** CSS transitions — chips slide from seat to pot area, board cards flip in, pot ships to winner at the end. Animations are cosmetic only; state is always the computed truth.

**Responsive:** table scales via relative units; below ~600px seats compress and font sizes drop via media queries. Tested at 375px.

## Showdown resolution

Local 7-card hand evaluator in plain JS (best 5 of 7, standard rankings). At showdown:
- All hands known among live players → evaluate, announce winner and hand name ("Sarah wins 450 with two pair, kings and eights"), handle ties (split pots) and side pots (each pot evaluated among its eligible players).
- Winner's hand unknown → pot ships to `winnerOverride` if set, else the last aggressor, with a neutral announcement.
- Everyone folds → pot ships to the last player standing.

## Share link and embed

**Share link:** hand JSON → LZ-string compression (small MIT-licensed routine inlined in the JS file, no CDN — CSP stays untouched) → URL-safe base64 → `https://johnb.io/live-poker-hand-replayer#h=...`. On load, if `#h=` is present and decodes to valid hand JSON, go straight to the replay. Copy-link button on the replay screen. No server, no storage.

**Embed:** copyable snippet:
```html
<iframe src="https://johnb.io/live-poker-hand-replayer?embed=1#h=..." width="100%" height="520" style="border:0;border-radius:12px" title="Poker hand replay"></iframe>
```
With `?embed=1` the page skips header/footer injection and page chrome, rendering only the table, controls, and a small "Made with JohnB.io" link back to the tool.

**Broken/malformed `#h=`:** show "This replay link looks broken" with a button to start a new hand.

## Error handling summary

| Failure | Behaviour |
|---|---|
| Rate limit (429) | Message with reset time; form path still available |
| AI parse failure/partial | Form builder opens pre-filled with parsed fields + missing list |
| Worker unreachable | Error on paste path; form path unaffected (fully client-side) |
| Malformed share URL | Friendly error + start-fresh button |
| Illegal action in builder | Impossible — only legal buttons shown |

## Verification checklist

Test hands, each entered via form AND via paste, then share-link round-tripped:
1. Heads-up, simple raise/call, showdown
2. 9-handed, multi-street, one player all-in (single side pot)
3. Two all-ins (two side pots), three-way showdown
4. Split pot (identical hands)
5. Everyone folds preflop to a raise
6. Straddled cash pot
7. Tournament hand with antes

Plus: embed iframe renders in a standalone HTML file; mobile layout correct at 375px; keyboard navigation works; rate limit returns 429 on the 6th request; CORS blocks a foreign origin.
