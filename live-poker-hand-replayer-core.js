/* Live Poker Hand Replayer — core logic (no DOM).
   Loaded by the browser page and by Node for tests (node --test tests/).
   Everything the replay needs is derived from one hand object:
   { gameType, currency, blinds:{sb,bb,ante,straddle}, players:[], board:{flop,turn,river}, actions:[], winnerOverride } */

const LPRCore = (function () {
  'use strict';

  const RANKS = '23456789TJQKA';
  const SUITS = 'shdc';
  const STREETS = ['preflop', 'flop', 'turn', 'river'];

  // Seating order clockwise from the small blind. Heads-up the SB is the button.
  const POSITIONS_BY_COUNT = {
    2: ['SB', 'BB'],
    3: ['SB', 'BB', 'BTN'],
    4: ['SB', 'BB', 'UTG', 'BTN'],
    5: ['SB', 'BB', 'UTG', 'CO', 'BTN'],
    6: ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'],
    7: ['SB', 'BB', 'UTG', 'MP', 'HJ', 'CO', 'BTN'],
    8: ['SB', 'BB', 'UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN'],
    9: ['SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO', 'BTN'],
  };

  function isValidCard(c) {
    return typeof c === 'string' && c.length === 2 &&
      RANKS.includes(c[0]) && SUITS.includes(c[1]);
  }

  // ── Shape validation ────────────────────────────────────────────────────────

  function validateShape(hand) {
    const errors = [];
    if (!hand || typeof hand !== 'object') return ['Not a hand object'];

    const players = Array.isArray(hand.players) ? hand.players : [];
    if (players.length < 2 || players.length > 9) {
      errors.push('Needs between 2 and 9 players (got ' + players.length + ')');
      return errors;
    }

    const blinds = hand.blinds || {};
    if (!(blinds.sb > 0) || !(blinds.bb > 0)) errors.push('Blinds must be greater than zero');
    if (blinds.ante < 0 || blinds.straddle < 0) errors.push('Ante and straddle cannot be negative');
    if (blinds.straddle > 0 && blinds.straddle <= blinds.bb) errors.push('A straddle must be bigger than the big blind');
    if (blinds.straddle > 0 && players.length < 3) errors.push('A straddle needs at least 3 players');

    const positions = POSITIONS_BY_COUNT[players.length] || [];
    const seenNames = new Set();
    const seenPositions = new Set();
    const seenCards = new Set();

    function checkCard(card, where) {
      if (!isValidCard(card)) { errors.push('Invalid card "' + card + '" (' + where + ')'); return; }
      if (seenCards.has(card)) errors.push('Duplicate card ' + card + ' (' + where + ')');
      seenCards.add(card);
    }

    for (const p of players) {
      const name = (p.name || '').trim();
      if (!name) errors.push('Every player needs a name');
      if (seenNames.has(name)) errors.push('Player name used twice: ' + name);
      seenNames.add(name);
      if (!(p.stack > 0)) errors.push((name || 'A player') + ' needs a stack greater than zero');
      if (!positions.includes(p.position)) {
        errors.push('Position "' + p.position + '" is not valid for ' + players.length + ' players');
      }
      if (seenPositions.has(p.position)) errors.push('Position used twice: ' + p.position);
      seenPositions.add(p.position);
      if (p.cards != null) {
        if (!Array.isArray(p.cards) || p.cards.length !== 2) errors.push(name + ' needs exactly two cards or none');
        else p.cards.forEach(c => checkCard(c, name));
      }
    }

    const board = hand.board || {};
    if (board.flop != null) {
      if (!Array.isArray(board.flop) || board.flop.length !== 3) errors.push('The flop needs exactly three cards');
      else board.flop.forEach(c => checkCard(c, 'flop'));
    }
    if (board.turn != null) checkCard(board.turn, 'turn');
    if (board.river != null) checkCard(board.river, 'river');
    if (board.turn != null && board.flop == null) errors.push('Turn card without a flop');
    if (board.river != null && board.turn == null) errors.push('River card without a turn');

    if (!Array.isArray(hand.actions)) errors.push('Actions must be a list');
    else for (const a of hand.actions) {
      if (!a || !STREETS.includes(a.street)) { errors.push('Action with unknown street'); continue; }
      if (!seenNames.has((a.player || '').trim())) errors.push('Action by unknown player "' + a.player + '"');
      if (!['fold', 'check', 'call', 'bet', 'raise', 'allin'].includes(a.type)) errors.push('Unknown action type "' + a.type + '"');
      if ((a.type === 'bet' || a.type === 'raise') && !(a.amount > 0)) errors.push('A ' + a.type + ' needs an amount');
    }

    return errors;
  }

  // ── Betting engine ──────────────────────────────────────────────────────────

  function orderedNames(hand) {
    const order = POSITIONS_BY_COUNT[hand.players.length];
    return hand.players
      .slice()
      .sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position))
      .map(p => p.name);
  }

  function rotateAfter(names, afterName) {
    const i = names.indexOf(afterName);
    if (i === -1) return names.slice();
    return names.slice(i + 1).concat(names.slice(0, i + 1)).slice(0, names.length - 1)
      .concat([]); // everyone except afterName, starting just after them
  }

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function initialState(hand) {
    const order = orderedNames(hand);
    const b = hand.blinds;
    const players = {};
    for (const p of hand.players) {
      players[p.name] = { stack: p.stack, committed: 0, streetCommitted: 0, folded: false, allIn: false };
    }

    function post(name, amount, countsAsBet) {
      const p = players[name];
      const pay = Math.min(amount, p.stack);
      p.stack -= pay;
      p.committed += pay;
      if (countsAsBet) p.streetCommitted += pay;
      if (p.stack === 0) p.allIn = true;
    }

    for (const name of order) if (b.ante > 0) post(name, b.ante, false);
    post(order[0], b.sb, true);
    post(order[1], b.bb, true);
    const straddler = b.straddle > 0 ? order[2] : null;
    if (straddler) post(straddler, b.straddle, true);

    const currentBet = Math.max(...order.map(n => players[n].streetCommitted));
    // Preflop action starts after the last forced bet (BB or straddle), who acts
    // last with the option. Heads-up this makes the SB/button open — correct.
    const lastPoster = straddler || order[1];
    const needToAct = rotateAfter(order, lastPoster).filter(n => !players[n].allIn)
      .concat(players[lastPoster].allIn ? [] : [lastPoster]);

    return {
      bb: b.bb,
      street: 'preflop',
      board: [],
      players,
      order,
      currentBet,
      lastRaiseIncrement: currentBet,
      needToAct,
      toAct: needToAct[0] || null,
      complete: false,
      result: null,
    };
  }

  function activeNames(state) {
    return state.order.filter(n => !state.players[n].folded);
  }

  function legalActions(state) {
    const name = state.toAct;
    if (!name) return null;
    const p = state.players[name];
    const owed = state.currentBet - p.streetCommitted;
    const maxTo = p.streetCommitted + p.stack;
    const minRaiseTo = state.currentBet + state.lastRaiseIncrement;
    return {
      canFold: owed > 0,
      canCheck: owed === 0,
      callAmount: owed > 0 ? Math.min(owed, p.stack) : 0,
      canBet: state.currentBet === 0,
      canRaise: state.currentBet > 0 && maxTo > state.currentBet,
      minBet: Math.min(state.currentBet === 0 ? Math.max(1, stateBB(state)) : minRaiseTo, maxTo),
      maxTo,
    };
  }

  // The engine needs the big blind for min-bet rules; stash it on the state.
  function stateBB(state) { return state.bb || 1; }

  function advanceStreet(state, hand) {
    const idx = STREETS.indexOf(state.street);
    state.street = STREETS[idx + 1];
    state.currentBet = 0;
    state.lastRaiseIncrement = stateBB(state);
    for (const n of state.order) state.players[n].streetCommitted = 0;
    const canAct = activeNames(state).filter(n => !state.players[n].allIn);
    // Postflop action starts left of the button: seat order from the SB, except
    // heads-up where the SB *is* the button, so the BB acts first.
    const postflopOrder = state.order.length === 2
      ? [state.order[1], state.order[0]]
      : state.order;
    state.needToAct = canAct.length >= 2 ? postflopOrder.filter(n => canAct.includes(n)) : [];
    state.toAct = state.needToAct[0] || null;
  }

  function boardFor(hand, street) {
    const b = hand.board || {};
    if (street === 'flop') return b.flop;
    if (street === 'turn') return b.turn != null ? [b.turn] : null;
    if (street === 'river') return b.river != null ? [b.river] : null;
    return null;
  }

  // Applies one action to a cloned state. Returns { state, error }.
  function applyAction(state, action, hand) {
    const s = clone(state);
    s.bb = state.bb;
    const name = (action.player || '').trim();

    if (s.complete) return { error: 'Action after the hand ended' };
    if (action.street !== s.street) {
      return { error: name + ' acts on the ' + action.street + ' but the hand is on the ' + s.street };
    }
    if (s.toAct !== name) {
      return { error: 'Out of turn: it is ' + s.toAct + "'s turn, not " + name + "'s" };
    }

    const p = s.players[name];
    const owed = s.currentBet - p.streetCommitted;
    const maxTo = p.streetCommitted + p.stack;
    let description = '';
    let reopened = false;

    let type = action.type;
    let amountTo = action.amount;
    if (type === 'allin') {
      amountTo = maxTo;
      type = maxTo > s.currentBet ? (s.currentBet === 0 ? 'bet' : 'raise') : 'call';
    }

    switch (type) {
      case 'fold':
        p.folded = true;
        description = name + ' folds';
        break;
      case 'check':
        if (owed > 0) return { error: name + ' cannot check facing a bet' };
        description = name + ' checks';
        break;
      case 'call': {
        if (owed <= 0) return { error: name + ' has nothing to call' };
        const pay = Math.min(owed, p.stack);
        p.stack -= pay; p.committed += pay; p.streetCommitted += pay;
        if (p.stack === 0) { p.allIn = true; description = name + ' calls ' + pay + ' and is all-in'; }
        else description = name + ' calls ' + pay;
        break;
      }
      case 'bet': {
        if (s.currentBet !== 0) return { error: name + ' cannot bet — there is already a bet, raise instead' };
        if (!(amountTo > 0)) return { error: 'Bet needs an amount' };
        if (amountTo > maxTo) return { error: name + ' cannot bet ' + amountTo + ' with a stack of ' + p.stack };
        if (amountTo < stateBB(s) && amountTo < maxTo) return { error: 'Minimum bet is ' + stateBB(s) };
        const pay = amountTo - p.streetCommitted;
        p.stack -= pay; p.committed += pay; p.streetCommitted = amountTo;
        s.currentBet = amountTo;
        s.lastRaiseIncrement = amountTo;
        reopened = true;
        if (p.stack === 0) { p.allIn = true; description = name + ' bets ' + amountTo + ' and is all-in'; }
        else description = name + ' bets ' + amountTo;
        break;
      }
      case 'raise': {
        if (s.currentBet === 0) return { error: name + ' cannot raise — nothing to raise, bet instead' };
        if (!(amountTo > s.currentBet)) return { error: 'A raise must be above the current bet of ' + s.currentBet };
        if (amountTo > maxTo) return { error: name + ' cannot make it ' + amountTo + ' with a stack of ' + p.stack };
        const fullRaise = amountTo >= s.currentBet + s.lastRaiseIncrement;
        if (!fullRaise && amountTo < maxTo) {
          return { error: 'Minimum raise is to ' + (s.currentBet + s.lastRaiseIncrement) };
        }
        const pay = amountTo - p.streetCommitted;
        if (fullRaise) s.lastRaiseIncrement = amountTo - s.currentBet;
        p.stack -= pay; p.committed += pay; p.streetCommitted = amountTo;
        s.currentBet = amountTo;
        reopened = true;
        if (p.stack === 0) { p.allIn = true; description = name + ' raises to ' + amountTo + ' and is all-in'; }
        else description = name + ' raises to ' + amountTo;
        break;
      }
      default:
        return { error: 'Unknown action type "' + action.type + '"' };
    }

    // Who still needs to act?
    if (reopened) {
      s.needToAct = rotateAfter(s.order, name)
        .filter(n => !s.players[n].folded && !s.players[n].allIn && n !== name);
    } else {
      s.needToAct = s.needToAct.filter(n => n !== name && !s.players[n].folded && !s.players[n].allIn);
    }

    const actives = activeNames(s);
    if (actives.length === 1) {
      s.complete = true;
      s.needToAct = [];
      s.toAct = null;
    } else if (s.needToAct.length === 0) {
      if (s.street === 'river') {
        s.complete = true;
        s.toAct = null;
      } else {
        s.readyToAdvance = true; // buildTimeline turns this into a deal step
        s.toAct = null;
      }
    } else {
      s.toAct = s.needToAct[0];
    }

    return { state: s, description };
  }

  function computePots(players) {
    const entries = Object.keys(players)
      .map(n => ({ name: n, committed: players[n].committed, folded: players[n].folded }))
      .filter(e => e.committed > 0);
    const levels = [...new Set(entries.filter(e => !e.folded).map(e => e.committed))].sort((a, b) => a - b);
    const pots = [];
    let prev = 0;
    for (const level of levels) {
      let amount = 0;
      for (const e of entries) amount += Math.max(0, Math.min(e.committed, level) - prev);
      const eligible = entries.filter(e => !e.folded && e.committed >= level).map(e => e.name);
      if (amount > 0) pots.push({ amount, eligible });
      prev = level;
    }
    let excess = 0;
    for (const e of entries) excess += Math.max(0, e.committed - prev);
    if (excess > 0) {
      if (pots.length) pots[pots.length - 1].amount += excess;
      else pots.push({ amount: excess, eligible: entries.filter(e => !e.folded).map(e => e.name) });
    }
    // Merge neighbouring pots with the same eligible players
    const merged = [];
    for (const pot of pots) {
      const last = merged[merged.length - 1];
      if (last && last.eligible.join(',') === pot.eligible.join(',')) last.amount += pot.amount;
      else merged.push(pot);
    }
    return merged;
  }

  function potTotal(state) {
    return state.order.reduce((sum, n) => sum + state.players[n].committed, 0);
  }

  // ── Timeline ────────────────────────────────────────────────────────────────

  // Returns { steps, error }. Each step: { kind, description, state } where state
  // is a full snapshot for the replay to render. Kinds: post | action | deal | result.
  function buildTimeline(hand) {
    const shapeErrors = validateShape(hand);
    if (shapeErrors.length) return { steps: [], error: shapeErrors[0] };

    let state = initialState(hand);
    const order = state.order;
    const b = hand.blinds;
    const postParts = [];
    if (b.ante > 0) postParts.push('everyone posts an ante of ' + b.ante);
    postParts.push(order[0] + ' posts the small blind ' + b.sb);
    postParts.push(order[1] + ' posts the big blind ' + b.bb);
    if (b.straddle > 0) postParts.push(order[2] + ' straddles to ' + b.straddle);

    const steps = [snapshot('post', 'Blinds in: ' + postParts.join(', '), state)];

    for (const action of hand.actions) {
      // Deal the next street first if the last action closed the previous one
      while (state.readyToAdvance) {
        const err = dealNext();
        if (err) return { steps, error: err };
      }
      const res = applyAction(state, action, hand);
      if (res.error) return { steps, error: res.error };
      state = res.state;
      steps.push(snapshot('action', res.description, state, action));
    }

    // Run out any remaining board when betting is over (all-ins) or hand complete
    while (state.readyToAdvance) {
      const err = dealNext();
      if (err) return { steps, error: err };
      if (!state.toAct && state.street === 'river' && state.needToAct.length === 0) {
        state.complete = true;
      }
    }

    if (!state.complete) {
      const who = state.toAct ? ' — ' + state.toAct + ' still has to act' : '';
      return { steps, error: 'The hand ends before the betting finished' + who };
    }

    const resolution = resolveWinners(state, hand);
    for (const w of resolution.winners) state.players[w.name].stack += w.amount;
    for (const n of order) state.players[n].committed = 0;
    state.result = resolution;
    steps.push(snapshot('result', resolution.announcement, state));

    return { steps, error: null };

    function dealNext() {
      delete state.readyToAdvance;
      advanceStreet(state, hand);
      const cards = boardFor(hand, state.street);
      if (!cards) return 'The ' + state.street + ' cards are missing';
      state.board = state.board.concat(cards);
      const label = state.street[0].toUpperCase() + state.street.slice(1);
      steps.push(snapshot('deal', label + ': ' + state.board.join(' '), state));
      if (state.needToAct.length === 0 && state.street !== 'river') state.readyToAdvance = true;
      return null;
    }

    function snapshot(kind, description, st, action) {
      const snap = clone(st);
      delete snap.readyToAdvance;
      snap.pots = computePots(st.players);
      snap.pot = potTotal(st);
      return { kind, description, street: st.street, state: snap, action: action || null };
    }
  }

  // ── Hand evaluator ──────────────────────────────────────────────────────────

  const RANK_VALUE = {};
  RANKS.split('').forEach((r, i) => { RANK_VALUE[r] = i + 2; });
  const SINGULAR = { 2: 'deuce', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'jack', 12: 'queen', 13: 'king', 14: 'ace' };
  const PLURAL = { 2: 'deuces', 3: 'threes', 4: 'fours', 5: 'fives', 6: 'sixes', 7: 'sevens', 8: 'eights', 9: 'nines', 10: 'tens', 11: 'jacks', 12: 'queens', 13: 'kings', 14: 'aces' };

  function evaluateFive(cards) {
    const vals = cards.map(c => RANK_VALUE[c[0]]).sort((a, b) => b - a);
    const isFlush = cards.every(c => c[1] === cards[0][1]);

    let straightHigh = 0;
    const unique = [...new Set(vals)];
    if (unique.length === 5) {
      if (unique[0] - unique[4] === 4) straightHigh = unique[0];
      else if (unique[0] === 14 && unique[1] === 5 && unique[4] === 2) straightHigh = 5; // wheel
    }

    const counts = {};
    for (const v of vals) counts[v] = (counts[v] || 0) + 1;
    // Group ranks by count desc, then rank desc — this IS the tiebreak order.
    const groups = Object.keys(counts).map(Number)
      .sort((a, b) => counts[b] - counts[a] || b - a);
    const shape = groups.map(g => counts[g]).join('');

    if (isFlush && straightHigh) {
      return { rank: 8, tiebreak: [straightHigh], name: straightHigh === 14 ? 'a royal flush' : 'a straight flush, ' + SINGULAR[straightHigh] + ' high' };
    }
    if (shape === '41') return { rank: 7, tiebreak: groups, name: 'four of a kind, ' + PLURAL[groups[0]] };
    if (shape === '32') return { rank: 6, tiebreak: groups, name: 'a full house, ' + PLURAL[groups[0]] + ' full of ' + PLURAL[groups[1]] };
    if (isFlush) return { rank: 5, tiebreak: vals, name: 'a flush, ' + SINGULAR[vals[0]] + ' high' };
    if (straightHigh) return { rank: 4, tiebreak: [straightHigh], name: 'a straight, ' + SINGULAR[straightHigh] + ' high' };
    if (shape === '311') return { rank: 3, tiebreak: groups, name: 'three of a kind, ' + PLURAL[groups[0]] };
    if (shape === '221') return { rank: 2, tiebreak: groups, name: 'two pair, ' + PLURAL[groups[0]] + ' and ' + PLURAL[groups[1]] };
    if (shape === '2111') return { rank: 1, tiebreak: groups, name: 'a pair of ' + PLURAL[groups[0]] };
    return { rank: 0, tiebreak: vals, name: 'high card ' + SINGULAR[vals[0]] };
  }

  function compareEvals(a, b) {
    if (a.rank !== b.rank) return a.rank - b.rank;
    for (let i = 0; i < a.tiebreak.length; i++) {
      if (a.tiebreak[i] !== b.tiebreak[i]) return a.tiebreak[i] - b.tiebreak[i];
    }
    return 0;
  }

  function evaluateSeven(cards) {
    let best = null;
    for (let a = 0; a < 7; a++) {
      for (let b = a + 1; b < 7; b++) {
        const five = cards.filter((_, i) => i !== a && i !== b);
        const ev = evaluateFive(five);
        if (!best || compareEvals(ev, best) > 0) best = ev;
      }
    }
    return best;
  }

  // ── Public validation (shape + full legality via the engine) ───────────────

  function validateHand(hand) {
    const errors = validateShape(hand);
    if (errors.length === 0) {
      const { error } = buildTimeline(hand);
      if (error) errors.push(error);
    }
    return { ok: errors.length === 0, errors };
  }

  // ── Placeholder exports filled in by later tasks ────────────────────────────

  function resolveWinners(state, hand) {
    // Implemented in Task 4. Minimal fold-out handling so buildTimeline works.
    const actives = activeNames(state);
    const pots = computePots(state.players);
    const total = pots.reduce((s, p) => s + p.amount, 0);
    const winner = actives[0];
    return {
      winners: [{ name: winner, amount: total, handName: null }],
      announcement: winner + ' wins ' + total,
    };
  }

  return {
    RANKS, SUITS, STREETS, POSITIONS_BY_COUNT,
    isValidCard, validateHand, buildTimeline, legalActions, computePots,
    initialState, applyAction, evaluateSeven, compareEvals,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = LPRCore;
if (typeof window !== 'undefined') window.LPRCore = LPRCore;
