# Live Poker Hand Replayer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build johnb.io/live-poker-hand-replayer — a NLHE hand replayer with a guided form builder, AI note parsing (Claude Haiku 4.5 via Cloudflare Worker), animated DOM/CSS table replay, showdown evaluation, share links, and iframe embeds. Soft launch: no home card, no nav entry, no sitemap/llms.txt.

**Spec:** `docs/superpowers/specs/2026-07-07-live-poker-hand-replayer-design.md` — all requirements live there; this plan implements it exactly.

**Architecture:** All game logic (validation, betting-state reducer, side pots, hand evaluator, share codec) lives in a pure, DOM-free module `live-poker-hand-replayer-core.js` that loads in both the browser and Node (guarded `module.exports`), so it is unit-tested with `node --test`. The UI file `live-poker-hand-replayer.js` only renders state and forwards events. The worker parses free-text notes to the same hand JSON the form produces.

**Tech Stack:** Vanilla JS/HTML/CSS (site has no framework/bundler/package manager). Node 20's built-in `node --test` for core-logic tests — no npm packages. Cloudflare Worker in Service Worker format.

**Branch:** `security-hardening-2026-07-02` (current). Merge to `main` deploys via FTP — done only at the end, with user approval.

---

## File structure

| File | Responsibility |
|---|---|
| `live-poker-hand-replayer-core.js` | Pure logic: `validateHand`, `buildTimeline` (state per action index), `legalActions`, side pots, `evaluateSeven` hand evaluator, `resolveWinners`, `encodeHand`/`decodeHand` (LZ-string, inlined, URL-safe). No DOM access anywhere. Ends with Node export guard. |
| `tests/live-poker-hand-replayer-core.test.js` | `node --test` suite for everything in core. |
| `live-poker-hand-replayer.html` | Page: full SEO head, embed-mode bootstrap, hero, input tabs (Form / Paste), builder UI, table UI, controls, share/embed panel, standard accordions. |
| `live-poker-hand-replayer.css` | All tool styles, prefix `lpr-`. Table/seat layout, cards, chips, controls, builder, responsive to 375px, embed mode. |
| `live-poker-hand-replayer.js` | UI wiring: tabs, form builder (setup + action builder), paste→worker client, replay renderer/controls, share/embed copy. Reads logic only from `LPRCore`. |
| `workers/live-poker-hand-replayer-worker.js` | POST endpoint: CORS whitelist, OPTIONS 204, 5/IP/day via `RATE_LIMIT_KV` (fail-open per spec), body validation (20–5,000 chars), Claude Haiku 4.5 call, `{success, result|error}`. |

Conventions from the codebase: element/class prefix `lpr-` (like `pdm-` on pdf-merger), `#header-placeholder`/`#footer-placeholder` divs, shared `styles.css?v=3`, `header.css?v=4`, `footer.css?v=2`, `scripts.js?v=…` loaded at body end, tool CSS/JS at `?v=1`. Accordion markup copied from `pdf-merger.html:225-232` structure.

---

## Core data shapes (used by every task — defined once here)

```js
// Hand object (spec §"Hand data model") — input to everything
// { gameType, currency, blinds: {sb,bb,ante,straddle}, players: [...], board: {flop,turn,river}, actions: [...], winnerOverride }
// Player: { seat, name, stack, position, cards: ["Kh","Kd"]|null, isHero }
// Action: { street: "preflop"|"flop"|"turn"|"river", player: <name>, type: "fold"|"check"|"call"|"bet"|"raise"|"allin", amount?: number }
// Card: uppercase rank + lowercase suit; ranks "23456789TJQKA", suits "shdc".

// buildTimeline(hand) -> { states: [state0, state1, ...], error: null|string }
// states[i] = table state AFTER blinds/antes/straddle post and actions 0..i-1 applied.
// state = {
//   street, pot, board: [cards revealed so far],
//   players: { [name]: { stack, committed, streetCommitted, folded, allIn } },
//   toAct: name|null, description: "Villain raises to 25",
//   pots: [{ amount, eligible: [names] }],    // main + side pots
//   complete: bool, result: null | { winners:[{name, amount, handName}], announcement }
// }

// legalActions(state, hand) -> { canFold, canCheck, callAmount, minRaiseTo, maxRaiseTo }
// evaluateSeven(sevenCards) -> { rank: 0..8, tiebreak: [..], name: "two pair, kings and eights" }
// resolveWinners(finalState, hand) -> { winners, announcement }
// encodeHand(hand) -> string (URL-safe); decodeHand(str) -> hand|null
```

---

### Task 1: Core module + hand validation (TDD)

**Files:**
- Create: `live-poker-hand-replayer-core.js`
- Create: `tests/live-poker-hand-replayer-core.test.js`

- [ ] **Step 1: Write failing tests** for `validateHand`: accepts a valid 3-player cash hand; rejects duplicate cards, duplicate names, <2 or >9 players, stack ≤ 0, unknown position for player count, action by folded player, action out of turn, amounts above stack. Use `node:test` + `assert`.
- [ ] **Step 2:** `node --test tests/` → all FAIL (module missing).
- [ ] **Step 3:** Implement card/position constants (`POSITIONS_BY_COUNT` for 2–9), `validateHand(hand)` returning `{ ok, errors: [] }`. Turn-order/legality checks delegate to the reducer built in Task 2 — in this task validate shape, uniqueness, ranges only; leave a documented `validateHand` second pass that Task 2 fills in.
- [ ] **Step 4:** `node --test tests/` → shape tests PASS (turn-order tests marked `todo` until Task 2).
- [ ] **Step 5:** Commit `feat: poker core module with hand validation`.

### Task 2: Betting engine — timeline reducer, legality, side pots (TDD)

**Files:** modify both Task 1 files.

- [ ] **Step 1: Failing tests:**
  - Initial state posts SB/BB/ante/straddle correctly (pot, stacks, first to act preflop = after BB/straddle; heads-up SB=BTN acts first preflop, BB first postflop).
  - `buildTimeline` on: raise/call → flop check/check → bet/fold ends hand; pot arithmetic exact at every index.
  - `legalActions`: no check facing a bet; call capped at stack (all-in); min-raise = last raise size; bet < BB rejected (except all-in short).
  - Side pots: A all-in 100, B all-in 250, C covers → pots [300 eligible ABC, 300 eligible BC] (with exact blind setup shown in test).
  - `complete` flags when everyone folds or river betting closes.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `initialState`, `applyAction` (pure), `buildTimeline`, `legalActions`, `computePots` (sorted contribution-level algorithm). Enable Task 1's turn-order validation via the reducer (validate = run timeline, collect first error).
- [ ] **Step 4:** Run → PASS, including un-`todo`'d Task 1 tests.
- [ ] **Step 5:** Commit `feat: betting engine with side pots and action legality`.

### Task 3: Hand evaluator (TDD)

- [ ] **Step 1: Failing tests** for `evaluateSeven`: royal flush > straight flush > quads > full house > flush > straight (incl. wheel A-5) > trips > two pair > pair > high card; kicker tiebreaks; board-plays split; English `name` strings ("two pair, kings and eights").
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement: enumerate 21 five-card combos, rank each (counts + flush + straight detection), return best with tiebreak array + name generator.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: 7-card hand evaluator`.

### Task 4: Winner resolution (TDD)

- [ ] **Step 1: Failing tests** for `resolveWinners`: showdown all-known → correct winner + announcement; tie → split (odd chip to first seat left of button); side pots each evaluated among eligible; winner unknown → last aggressor; `winnerOverride` respected; everyone-folds → last standing, no cards shown.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement on top of Tasks 2–3. **Step 4:** PASS. **Step 5:** Commit `feat: showdown resolution with side pots and overrides`.

### Task 5: Share codec (TDD)

- [ ] **Step 1: Failing tests:** `decodeHand(encodeHand(h))` deep-equals `h` for a 9-player hand with all fields; output matches `/^[A-Za-z0-9+-$]+$/` (LZ-string URI-safe alphabet); `decodeHand("garbage")` → null; encoded 9-player hand < 60% of `encodeURIComponent(JSON)` length.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Inline LZ-string `compressToEncodedURIComponent`/`decompressFromEncodedURIComponent` (MIT, attributed in comment) + JSON wrap with schema-version field `v:1`. **Step 4:** PASS. **Step 5:** Commit `feat: URL share codec`.

### Task 6: HTML page

**Files:** create `live-poker-hand-replayer.html`.

- [ ] **Step 1:** Build page from `pdf-merger.html` skeleton: GA snippet, favicons, fonts, shared CSS links, `live-poker-hand-replayer.css?v=1`. Head: title `Live Poker Hand Replayer - JohnB.io`; description ≤150 chars; keywords; robots index,follow; canonical `https://johnb.io/live-poker-hand-replayer`; full OG (og:image `https://johnb.io/images/live_poker_hand_replayer_og.webp`, 770×430 per OG spec used site-wide) + Twitter tags; `SoftwareApplication` JSON-LD (Organization author/publisher) + `FAQPage` JSON-LD matching on-page FAQ word-for-word.
- [ ] **Step 2:** Embed bootstrap — first script in `<head>`: `if (new URLSearchParams(location.search).get('embed')==='1') document.documentElement.classList.add('lpr-embed');` CSS hides header/footer placeholders + hero + accordions in embed mode and shows a "Made with JohnB.io" link.
- [ ] **Step 3:** Body: placeholders, hero, tabbed input card (Build the hand / Paste your notes), setup form section, action-builder section, replay section (table + seats + board + pot + controls + share/embed panel, all `lpr-` ids), accordions in required order (FAQ open / How It Works / Key Points / Sources) with 6 FAQs incl. "is it free", "can I share", "what happens if the AI can't read my notes". Scripts at body end: `scripts.js?v=5` (match current), core JS, UI JS, both `?v=1`.
- [ ] **Step 4:** Commit `feat: replayer page markup and SEO head`.

### Task 7: CSS

**Files:** create `live-poker-hand-replayer.css`.

- [ ] **Step 1:** Styles: oval felt table (radial gradient, rail ring), 9 seat position maps for counts 2–9 (`.lpr-seats[data-count="N"] .lpr-seat:nth-child(i)` absolute placements), seat chip: name/stack/two card slots; card faces (rank+suit glyph, red/black) and backs; dealer button; bet chips in front of seats; pot centre; board card flip-in (`transition` on transform/opacity); folded = 0.35 opacity; active seat glow. Controls row styled like the audio-player buttons. Builder forms use shared input styles. Media queries: ≤900px scale, ≤600px compact seats, verified at 375px. `.lpr-embed` hides chrome.
- [ ] **Step 2:** Commit `feat: replayer styles`.

### Task 8: UI — form builder

**Files:** create `live-poker-hand-replayer.js` (builder half).

- [ ] **Step 1:** Setup step: game type toggle (cash/tournament — tournament hides currency, zero-value chips label), SB/BB/ante/straddle inputs, player count select 2–9 → renders per-player rows (name w/ default "Player N", stack, position select auto-filled from `POSITIONS_BY_COUNT`, cards via picker). Card picker: modal rank×suit grid, greys used cards, writes to hidden inputs.
- [ ] **Step 2:** Action step: uses `LPRCore.legalActions` on the running timeline to render only legal buttons for `state.toAct`; amount input for bet/raise with min/max enforced; board-card prompts between streets; live pot/stack readout; Undo (pop last action); Done → replay. Any core error surfaces inline, never a dead end.
- [ ] **Step 3:** Manual verify with a local server (`python -m http.server`) against spec test hands 1, 5, 6.
- [ ] **Step 4:** Commit `feat: two-step hand builder`.

### Task 9: UI — replay renderer and controls

**Files:** modify `live-poker-hand-replayer.js`.

- [ ] **Step 1:** `renderState(state)` paints seats/stacks/bets/board/pot/description from a timeline index — full re-render per step (spec: state is computed truth; CSS transitions animate the diffs). Reveal rules: hero cards always; villains at showdown or if known+shown; backs otherwise.
- [ ] **Step 2:** Controls: prev/next, play-pause (2s interval, 1x/1.5x/2x speed group), progress text "Action 7 of 23 — Turn", keyboard (arrows/space), ARIA labels + `aria-live` on description. End state shows result announcement + pot ships (CSS transition).
- [ ] **Step 3:** Manual verify spec hands 2, 3, 4 (all-ins/side pots/split) built via form; check mobile 375px.
- [ ] **Step 4:** Commit `feat: table replay renderer and playback controls`.

### Task 10: Worker + paste path

**Files:** create `workers/live-poker-hand-replayer-worker.js`; modify UI JS.

- [ ] **Step 1:** Worker modelled on `workers/editor-worker.js` pattern: CORS whitelist johnb.io/www + 403 foreign origins, OPTIONS 204 w/ Max-Age, rate limit key `pokerreplay:{yyyy-mm-dd}:{ip}` limit 5, TTL 172800, fail-open if `RATE_LIMIT_KV` undefined (spec choice — cheap Haiku calls; note divergence from editor-worker's fail-closed in a comment), body `{notes}` 20–5,000 chars, model `claude-haiku-4-5-20251001`, `max_tokens: 2000`, system prompt: emit ONLY JSON matching the hand schema (schema inlined in prompt with card format + action rules) or `{"parseError":"...","partial":{...}}`. Strip markdown fences from response, `JSON.parse`, return `{success:true, result}`; upstream errors → generic message, never leaked.
- [ ] **Step 2:** UI paste tab: textarea + char counter + Parse button → POST `https://live-poker-hand-replayer-worker.ukjbowman.workers.dev`; on valid hand (passes `validateHand`) → replay; on `parseError`/invalid → switch to form tab pre-filled from `partial` + list what's missing; 429 → show message w/ reset time; network fail → suggest the form.
- [ ] **Step 3:** Deploy worker via Cloudflare dashboard (user action — Service Worker mode, add `ANTHROPIC_API_KEY` secret + `RATE_LIMIT_KV` binding). Test with curl: valid parse, 6th request → 429, foreign Origin → 403.
- [ ] **Step 4:** Commit `feat: AI paste parsing via Haiku worker`.

### Task 11: Share, embed, final verification

**Files:** modify UI JS + HTML.

- [ ] **Step 1:** On replay: Copy link button → `location.origin + '/live-poker-hand-replayer#h=' + encodeHand(hand)`; Embed button reveals textarea with iframe snippet (spec markup) + copy. On load: `#h=` present → decode → valid: straight to replay; invalid: "This replay link looks broken" + start-fresh button.
- [ ] **Step 2:** Run the spec's verification checklist: 7 test hands via form AND paste, share round-trip, embed in standalone HTML file, 375px layout, keyboard nav, worker 429 + CORS checks. Fix what fails.
- [ ] **Step 3:** Confirm soft-launch rules: no `TOOLS` entry, no `header.html` change, no sitemap/llms.txt change. `node --test tests/` green.
- [ ] **Step 4:** Commit `feat: share links and embed mode`, then final review pass.
