// Tests for live-poker-hand-replayer-core.js — run with: node --test tests/
const { test } = require('node:test');
const assert = require('node:assert');
const Core = require('../live-poker-hand-replayer-core.js');

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeHand(overrides = {}) {
  return Object.assign({
    gameType: 'cash',
    currency: '$',
    blinds: { sb: 1, bb: 2, ante: 0, straddle: 0 },
    players: [
      { seat: 1, name: 'Alice', stack: 200, position: 'SB', cards: null, isHero: false },
      { seat: 2, name: 'Bob', stack: 200, position: 'BB', cards: null, isHero: false },
      { seat: 3, name: 'Hero', stack: 200, position: 'BTN', cards: ['Kh', 'Kd'], isHero: true },
    ],
    board: { flop: null, turn: null, river: null },
    actions: [],
    winnerOverride: null,
  }, overrides);
}

// ── Task 1: validation ───────────────────────────────────────────────────────

test('validateHand accepts a valid 3-player cash hand', () => {
  const hand = makeHand({
    board: { flop: ['7c', '8d', '2s'], turn: null, river: null },
    actions: [
      { street: 'preflop', player: 'Hero', type: 'raise', amount: 6 },
      { street: 'preflop', player: 'Alice', type: 'fold' },
      { street: 'preflop', player: 'Bob', type: 'call' },
      { street: 'flop', player: 'Bob', type: 'check' },
      { street: 'flop', player: 'Hero', type: 'bet', amount: 8 },
      { street: 'flop', player: 'Bob', type: 'fold' },
    ],
  });
  const res = Core.validateHand(hand);
  assert.deepStrictEqual(res.errors, []);
  assert.strictEqual(res.ok, true);
});

test('validateHand rejects duplicate cards', () => {
  const hand = makeHand();
  hand.players[0].cards = ['Kh', '2c'];
  const res = Core.validateHand(hand);
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => /duplicate card/i.test(e)), res.errors.join('; '));
});

test('validateHand rejects duplicate player names', () => {
  const hand = makeHand();
  hand.players[1].name = 'Alice';
  const res = Core.validateHand(hand);
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => /name/i.test(e)));
});

test('validateHand rejects fewer than 2 or more than 9 players', () => {
  const one = makeHand();
  one.players = one.players.slice(0, 1);
  assert.strictEqual(Core.validateHand(one).ok, false);

  const ten = makeHand();
  ten.players = [];
  for (let i = 0; i < 10; i++) {
    ten.players.push({ seat: i + 1, name: 'P' + i, stack: 100, position: 'SB', cards: null, isHero: false });
  }
  assert.strictEqual(Core.validateHand(ten).ok, false);
});

test('validateHand rejects non-positive stacks', () => {
  const hand = makeHand();
  hand.players[2].stack = 0;
  assert.strictEqual(Core.validateHand(hand).ok, false);
});

test('validateHand rejects a position invalid for the player count', () => {
  const hand = makeHand();
  hand.players[2].position = 'UTG'; // 3-handed has SB/BB/BTN only
  assert.strictEqual(Core.validateHand(hand).ok, false);
});

test('validateHand rejects invalid card codes', () => {
  const hand = makeHand();
  hand.players[2].cards = ['Kh', '1x'];
  assert.strictEqual(Core.validateHand(hand).ok, false);
});

test('validateHand rejects action by a player who already folded', () => {
  const hand = makeHand({
    actions: [
      { street: 'preflop', player: 'Hero', type: 'fold' },
      { street: 'preflop', player: 'Alice', type: 'fold' },
      { street: 'preflop', player: 'Hero', type: 'raise', amount: 10 },
    ],
  });
  assert.strictEqual(Core.validateHand(hand).ok, false);
});

test('validateHand rejects action out of turn', () => {
  const hand = makeHand({
    actions: [
      // 3-handed preflop: BTN (Hero) acts first — SB acting first is out of turn
      { street: 'preflop', player: 'Alice', type: 'fold' },
    ],
  });
  assert.strictEqual(Core.validateHand(hand).ok, false);
});

test('validateHand rejects a raise beyond stack', () => {
  const hand = makeHand({
    actions: [{ street: 'preflop', player: 'Hero', type: 'raise', amount: 500 }],
  });
  assert.strictEqual(Core.validateHand(hand).ok, false);
});

// ── Task 2: betting engine ───────────────────────────────────────────────────

function finalState(hand) {
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, 'timeline error: ' + error);
  return steps[steps.length - 1].state;
}

test('initial state posts blinds, antes and straddle; straddler last to act', () => {
  const hand = makeHand({
    blinds: { sb: 1, bb: 2, ante: 1, straddle: 4 },
    players: [
      { seat: 1, name: 'A', stack: 100, position: 'SB', cards: null },
      { seat: 2, name: 'B', stack: 100, position: 'BB', cards: null },
      { seat: 3, name: 'C', stack: 100, position: 'UTG', cards: null },
      { seat: 4, name: 'D', stack: 100, position: 'BTN', cards: null },
    ],
  });
  const s = Core.initialState(hand);
  assert.strictEqual(s.players.A.committed, 2);  // ante 1 + sb 1
  assert.strictEqual(s.players.B.committed, 3);  // ante 1 + bb 2
  assert.strictEqual(s.players.C.committed, 5);  // ante 1 + straddle 4 (UTG straddles)
  assert.strictEqual(s.players.D.committed, 1);  // ante only
  assert.strictEqual(s.currentBet, 4);
  assert.strictEqual(s.toAct, 'D'); // first after the straddler
  assert.deepStrictEqual(s.needToAct, ['D', 'A', 'B', 'C']); // straddler gets the option
});

test('heads-up: SB acts first preflop, BB first postflop', () => {
  const hand = makeHand({
    players: [
      { seat: 1, name: 'A', stack: 100, position: 'SB', cards: null },
      { seat: 2, name: 'B', stack: 100, position: 'BB', cards: null },
    ],
    board: { flop: ['2c', '7d', 'Jh'], turn: null, river: null },
    actions: [
      { street: 'preflop', player: 'A', type: 'call' },
      { street: 'preflop', player: 'B', type: 'check' },
      { street: 'flop', player: 'B', type: 'check' },
      { street: 'flop', player: 'A', type: 'bet', amount: 4 },
      { street: 'flop', player: 'B', type: 'fold' },
    ],
  });
  const { error, steps } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const last = steps[steps.length - 1].state;
  assert.strictEqual(last.players.A.stack, 102); // won B's 2 blind... started 100, put in 6, won 8
});

test('pot arithmetic is exact at every step', () => {
  const hand = makeHand({
    board: { flop: ['7c', '8d', '2s'], turn: null, river: null },
    actions: [
      { street: 'preflop', player: 'Hero', type: 'raise', amount: 6 },
      { street: 'preflop', player: 'Alice', type: 'fold' },
      { street: 'preflop', player: 'Bob', type: 'call' },
      { street: 'flop', player: 'Bob', type: 'check' },
      { street: 'flop', player: 'Hero', type: 'bet', amount: 8 },
      { street: 'flop', player: 'Bob', type: 'fold' },
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const pots = steps.map(st => st.state.pot);
  // post: 1+2=3, raise to 6: 9, fold: 9, call (4 more): 13, deal: 13, check: 13, bet 8: 21, fold: 21, result: 0 (shipped)
  assert.deepStrictEqual(pots.slice(0, 8), [3, 9, 9, 13, 13, 13, 21, 21]);
  const final = steps[steps.length - 1].state;
  assert.strictEqual(final.players.Hero.stack, 200 - 6 - 8 + 21);
});

test('legalActions: no check facing a bet, call capped at stack, min raise enforced', () => {
  const hand = makeHand({
    actions: [{ street: 'preflop', player: 'Hero', type: 'raise', amount: 50 }],
  });
  const { steps } = Core.buildTimeline({ ...hand, actions: [] });
  let s = steps[0].state;
  // Hero to act first (BTN, 3-handed)
  assert.strictEqual(s.toAct, 'Hero');
  const la0 = Core.legalActions(s);
  assert.strictEqual(la0.canCheck, false);
  assert.strictEqual(la0.callAmount, 2);
  assert.strictEqual(la0.minBet, 4); // min raise to 2xBB
  const afterRaise = Core.applyAction(s, { street: 'preflop', player: 'Hero', type: 'raise', amount: 50 }, hand);
  assert.ok(!afterRaise.error);
  const la1 = Core.legalActions(afterRaise.state);
  assert.strictEqual(la1.canCheck, false);
  assert.strictEqual(la1.callAmount, 49); // Alice posted SB 1
  assert.strictEqual(la1.minBet, 98);     // raise of 48 on top
  // Bet below min rejected
  const flopHand = makeHand({
    board: { flop: ['7c', '8d', '2s'], turn: null, river: null },
    actions: [
      { street: 'preflop', player: 'Hero', type: 'call' },
      { street: 'preflop', player: 'Alice', type: 'fold' },
      { street: 'preflop', player: 'Bob', type: 'check' },
      { street: 'flop', player: 'Bob', type: 'bet', amount: 1 }, // below BB
    ],
  });
  assert.strictEqual(Core.validateHand(flopHand).ok, false);
});

test('side pots: two all-ins produce main and side pot with correct eligibility', () => {
  // Blinds 1/2. A (100) all-in, B (250) all-in over the top, C calls 250.
  const hand = makeHand({
    players: [
      { seat: 1, name: 'A', stack: 100, position: 'SB', cards: null },
      { seat: 2, name: 'B', stack: 250, position: 'BB', cards: null },
      { seat: 3, name: 'C', stack: 400, position: 'BTN', cards: ['Ah', 'Ad'] },
    ],
    board: { flop: ['7c', '8d', '2s'], turn: 'Qh', river: '3c' },
    actions: [
      { street: 'preflop', player: 'C', type: 'raise', amount: 10 },
      { street: 'preflop', player: 'A', type: 'allin' },   // to 100
      { street: 'preflop', player: 'B', type: 'allin' },   // to 250
      { street: 'preflop', player: 'C', type: 'call' },    // 250 total
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  // Find the state right after C's call (before pots are shipped)
  const callStep = steps.filter(st => st.kind === 'action').pop();
  assert.deepStrictEqual(callStep.state.pots, [
    { amount: 300, eligible: ['A', 'B', 'C'] },
    { amount: 300, eligible: ['B', 'C'] },
  ]);
});

test('board runs out automatically when everyone is all-in', () => {
  const hand = makeHand({
    players: [
      { seat: 1, name: 'A', stack: 50, position: 'SB', cards: ['Ah', 'Kh'] },
      { seat: 2, name: 'B', stack: 50, position: 'BB', cards: ['Qc', 'Qd'] },
    ],
    board: { flop: ['2c', '7d', 'Jh'], turn: '3s', river: '9s' },
    actions: [
      { street: 'preflop', player: 'A', type: 'allin' },
      { street: 'preflop', player: 'B', type: 'call' },
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const deals = steps.filter(st => st.kind === 'deal').map(st => st.street);
  assert.deepStrictEqual(deals, ['flop', 'turn', 'river']);
  assert.strictEqual(steps[steps.length - 1].kind, 'result');
});

// ── Task 3: hand evaluator ───────────────────────────────────────────────────

function beats(a, b) {
  const ra = Core.evaluateSeven(a), rb = Core.evaluateSeven(b);
  return Core.compareEvals(ra, rb) > 0;
}

test('evaluateSeven ranks categories in the right order', () => {
  const royal = ['Ah', 'Kh', 'Qh', 'Jh', 'Th', '2c', '3d'];
  const straightFlush = ['9h', '8h', '7h', '6h', '5h', '2c', '3d'];
  const quads = ['Ac', 'Ad', 'Ah', 'As', '5h', '2c', '3d'];
  const fullHouse = ['Kc', 'Kd', 'Kh', '8s', '8h', '2c', '3d'];
  const flush = ['Ah', 'Jh', '8h', '5h', '2h', 'Kc', '3d'];
  const straight = ['9h', '8c', '7d', '6s', '5h', 'Kc', '2d'];
  const trips = ['Qc', 'Qd', 'Qh', '8s', '5h', '2c', '3d'];
  const twoPair = ['Kc', 'Kd', '8h', '8s', '5h', '2c', '3d'];
  const pair = ['Kc', 'Kd', '9h', '8s', '5h', '2c', '3d'];
  const high = ['Ac', 'Kd', '9h', '8s', '5h', '2c', '3d'];
  const ladder = [royal, straightFlush, quads, fullHouse, flush, straight, trips, twoPair, pair, high];
  for (let i = 0; i < ladder.length - 1; i++) {
    assert.ok(beats(ladder[i], ladder[i + 1]), 'rung ' + i + ' should beat rung ' + (i + 1));
  }
});

test('evaluateSeven finds the wheel straight (A-5)', () => {
  const wheel = Core.evaluateSeven(['Ah', '2c', '3d', '4s', '5h', 'Kc', 'Kd']);
  assert.strictEqual(wheel.rank, 4); // straight
  assert.ok(/five high/.test(wheel.name), wheel.name);
});

test('kickers break ties', () => {
  assert.ok(beats(
    ['Ac', 'Ad', 'Kh', '8s', '5h', '2c', '3d'],   // aces, king kicker
    ['Ah', 'As', 'Qh', '8c', '5d', '2s', '3h']    // aces, queen kicker
  ));
});

test('board plays: identical best fives compare equal', () => {
  const board = ['Ah', 'Kh', 'Qh', 'Jh', 'Th'];
  const a = Core.evaluateSeven(board.concat(['2c', '3d']));
  const b = Core.evaluateSeven(board.concat(['7s', '8s']));
  assert.strictEqual(Core.compareEvals(a, b), 0);
});

test('evaluator names hands in plain English', () => {
  assert.strictEqual(
    Core.evaluateSeven(['Kc', 'Kd', '8h', '8s', '5h', '2c', '3d']).name,
    'two pair, kings and eights'
  );
  assert.strictEqual(
    Core.evaluateSeven(['Kc', 'Kd', 'Kh', '8s', '8h', '2c', '3d']).name,
    'a full house, kings full of eights'
  );
  assert.strictEqual(
    Core.evaluateSeven(['Ah', 'Kh', 'Qh', 'Jh', 'Th', '2c', '3d']).name,
    'a royal flush'
  );
});

// ── Task 4: winner resolution ────────────────────────────────────────────────

test('showdown with known cards names the winner and the hand', () => {
  const hand = makeHand({
    players: [
      { seat: 1, name: 'Sarah', stack: 200, position: 'SB', cards: ['Kh', '8h'] },
      { seat: 2, name: 'Tom', stack: 200, position: 'BB', cards: ['Ac', 'Qd'] },
    ],
    board: { flop: ['Kc', '8d', '2s'], turn: '5h', river: '3c' },
    actions: [
      { street: 'preflop', player: 'Sarah', type: 'raise', amount: 6 },
      { street: 'preflop', player: 'Tom', type: 'call' },
      { street: 'flop', player: 'Tom', type: 'check' },
      { street: 'flop', player: 'Sarah', type: 'bet', amount: 8 },
      { street: 'flop', player: 'Tom', type: 'call' },
      { street: 'turn', player: 'Tom', type: 'check' },
      { street: 'turn', player: 'Sarah', type: 'check' },
      { street: 'river', player: 'Tom', type: 'check' },
      { street: 'river', player: 'Sarah', type: 'check' },
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const result = steps[steps.length - 1];
  assert.strictEqual(result.kind, 'result');
  assert.match(result.description, /Sarah wins 28 with two pair, kings and eights/);
  assert.strictEqual(result.state.players.Sarah.stack, 200 + 14);
  assert.strictEqual(result.state.players.Tom.stack, 200 - 14);
});

test('tie splits the pot', () => {
  const hand = makeHand({
    players: [
      { seat: 1, name: 'A', stack: 100, position: 'SB', cards: ['Ah', 'Kd'] },
      { seat: 2, name: 'B', stack: 100, position: 'BB', cards: ['Ad', 'Kh'] },
    ],
    board: { flop: ['2c', '7d', 'Jh'], turn: '3s', river: '9s' },
    actions: [
      { street: 'preflop', player: 'A', type: 'allin' },
      { street: 'preflop', player: 'B', type: 'call' },
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const final = steps[steps.length - 1].state;
  assert.strictEqual(final.players.A.stack, 100);
  assert.strictEqual(final.players.B.stack, 100);
});

test('side pots pay the right players', () => {
  // A (short, best hand) wins main pot only; B (second) takes the side pot over C.
  const hand = makeHand({
    players: [
      { seat: 1, name: 'A', stack: 100, position: 'SB', cards: ['Ah', 'Ad'] },
      { seat: 2, name: 'B', stack: 250, position: 'BB', cards: ['Kh', 'Kd'] },
      { seat: 3, name: 'C', stack: 250, position: 'BTN', cards: ['Qh', 'Qd'] },
    ],
    board: { flop: ['2c', '7d', 'Jh'], turn: '3s', river: '9s' },
    actions: [
      { street: 'preflop', player: 'C', type: 'raise', amount: 10 },
      { street: 'preflop', player: 'A', type: 'allin' },
      { street: 'preflop', player: 'B', type: 'allin' },
      { street: 'preflop', player: 'C', type: 'call' },
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const final = steps[steps.length - 1].state;
  assert.strictEqual(final.players.A.stack, 300); // wins 300 main
  assert.strictEqual(final.players.B.stack, 300); // wins 300 side
  assert.strictEqual(final.players.C.stack, 0);
});

test('everyone folds: pot ships without showing cards', () => {
  const hand = makeHand({
    actions: [
      { street: 'preflop', player: 'Hero', type: 'raise', amount: 6 },
      { street: 'preflop', player: 'Alice', type: 'fold' },
      { street: 'preflop', player: 'Bob', type: 'fold' },
    ],
  });
  const { steps, error } = Core.buildTimeline(hand);
  assert.strictEqual(error, null, String(error));
  const result = steps[steps.length - 1];
  assert.match(result.description, /Hero wins 9/);
  assert.ok(!/with/.test(result.description)); // no hand name announced
});

test('unknown cards at showdown: last aggressor wins, winnerOverride beats that', () => {
  const base = {
    players: [
      { seat: 1, name: 'A', stack: 100, position: 'SB', cards: null },
      { seat: 2, name: 'B', stack: 100, position: 'BB', cards: null },
    ],
    board: { flop: ['2c', '7d', 'Jh'], turn: '3s', river: '9s' },
    actions: [
      { street: 'preflop', player: 'A', type: 'call' },
      { street: 'preflop', player: 'B', type: 'check' },
      { street: 'flop', player: 'B', type: 'check' },
      { street: 'flop', player: 'A', type: 'bet', amount: 4 },
      { street: 'flop', player: 'B', type: 'call' },
      { street: 'turn', player: 'B', type: 'check' },
      { street: 'turn', player: 'A', type: 'check' },
      { street: 'river', player: 'B', type: 'check' },
      { street: 'river', player: 'A', type: 'check' },
    ],
  };
  const h1 = makeHand(JSON.parse(JSON.stringify(base)));
  const r1 = Core.buildTimeline(h1);
  assert.strictEqual(r1.error, null, String(r1.error));
  assert.match(r1.steps[r1.steps.length - 1].description, /^A wins/); // last aggressor (flop bet)

  const h2 = makeHand(Object.assign(JSON.parse(JSON.stringify(base)), { winnerOverride: 'B' }));
  const r2 = Core.buildTimeline(h2);
  assert.match(r2.steps[r2.steps.length - 1].description, /^B wins/);
});

// ── Task 5: share codec ──────────────────────────────────────────────────────

test('encodeHand/decodeHand round-trips a full 9-player hand', () => {
  const positions = Core.POSITIONS_BY_COUNT[9];
  const hand = makeHand({
    gameType: 'tournament',
    blinds: { sb: 100, bb: 200, ante: 25, straddle: 0 },
    players: positions.map((pos, i) => ({
      seat: i + 1,
      name: 'Player ' + (i + 1),
      stack: 10000 + i * 500,
      position: pos,
      cards: i === 8 ? ['As', 'Kc'] : null,
      isHero: i === 8,
    })),
    board: { flop: ['7c', '8d', '2s'], turn: 'Qh', river: '3c' },
    actions: [
      { street: 'preflop', player: 'Player 3', type: 'raise', amount: 500 },
      { street: 'preflop', player: 'Player 4', type: 'fold' },
    ],
    winnerOverride: 'Player 3',
  });
  const encoded = Core.encodeHand(hand);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/, 'URL-safe alphabet, no escaping needed');
  assert.deepStrictEqual(Core.decodeHand(encoded), hand);
});

test('decodeHand returns null on garbage', () => {
  assert.strictEqual(Core.decodeHand('not!a$valid%hash'), null);
  assert.strictEqual(Core.decodeHand(''), null);
  assert.strictEqual(Core.decodeHand('AAAAAAAA'), null);
});

test('encoding compresses well below plain URI-encoded JSON', () => {
  const positions = Core.POSITIONS_BY_COUNT[9];
  const hand = makeHand({
    players: positions.map((pos, i) => ({
      seat: i + 1, name: 'Player ' + (i + 1), stack: 20000, position: pos, cards: null, isHero: false,
    })),
    actions: Array.from({ length: 20 }, (_, i) => ({
      street: 'preflop', player: 'Player ' + ((i % 9) + 1), type: 'fold',
    })),
  });
  const plain = encodeURIComponent(JSON.stringify(hand)).length;
  const encoded = Core.encodeHand(hand).length;
  assert.ok(encoded < plain * 0.6, encoded + ' should be < 60% of ' + plain);
});

// ── Builder support: allowIncomplete mode ───────────────────────────────────

test('allowIncomplete: mid-street partial hand returns who is to act', () => {
  const hand = makeHand({
    actions: [{ street: 'preflop', player: 'Hero', type: 'raise', amount: 6 }],
  });
  const res = Core.buildTimeline(hand, { allowIncomplete: true });
  assert.strictEqual(res.error, null);
  assert.strictEqual(res.incomplete, true);
  assert.strictEqual(res.state.toAct, 'Alice');
});

test('allowIncomplete: closed street without board cards asks for them', () => {
  const hand = makeHand({
    actions: [
      { street: 'preflop', player: 'Hero', type: 'call' },
      { street: 'preflop', player: 'Alice', type: 'fold' },
      { street: 'preflop', player: 'Bob', type: 'check' },
    ],
  });
  const res = Core.buildTimeline(hand, { allowIncomplete: true });
  assert.strictEqual(res.error, null);
  assert.strictEqual(res.needsBoard, 'flop');
});

test('incomplete hand reports an error naming who still has to act', () => {
  const hand = makeHand({
    actions: [{ street: 'preflop', player: 'Hero', type: 'raise', amount: 6 }],
  });
  const { error } = Core.buildTimeline(hand);
  assert.ok(/before the betting finished/.test(error), String(error));
});
