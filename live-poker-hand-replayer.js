/* Live Poker Hand Replayer — UI. All poker logic lives in LPRCore
   (live-poker-hand-replayer-core.js); this file only renders and wires events. */

(function () {
  'use strict';

  const WORKER_URL = 'https://live-poker-hand-replayer-worker.ukjbowman.workers.dev';
  const RANKS_DESC = 'AKQJT98765432';
  const SUITS = [
    { code: 's', glyph: '♠', red: false },
    { code: 'h', glyph: '♥', red: true },
    { code: 'd', glyph: '♦', red: true },
    { code: 'c', glyph: '♣', red: false },
  ];

  const $ = id => document.getElementById(id);

  // ── Working hand ────────────────────────────────────────────────────────────

  let draft = defaultDraft();
  let heroIndex = -1; // index into draft.players; -1 = not chosen
  let undoStack = []; // {kind:'action'} | {kind:'board', street}

  function defaultDraft() {
    return {
      gameType: 'cash',
      currency: '$',
      blinds: { sb: 1, bb: 2, ante: 0, straddle: 0 },
      players: [],
      board: { flop: null, turn: null, river: null },
      actions: [],
      winnerOverride: null,
    };
  }

  function fmt(n) {
    const num = Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });
    return draft.gameType === 'cash' ? draft.currency + num : num;
  }

  function usedCards(exceptPlayerIndex) {
    const used = [];
    draft.players.forEach((p, i) => {
      if (i !== exceptPlayerIndex && Array.isArray(p.cards)) used.push(...p.cards);
    });
    if (draft.board.flop) used.push(...draft.board.flop);
    if (draft.board.turn) used.push(draft.board.turn);
    if (draft.board.river) used.push(draft.board.river);
    return used;
  }

  function cardEl(card, mini) {
    const span = document.createElement('span');
    span.className = 'lpr-mini-card';
    if (!card) { span.classList.add('back'); return span; }
    const suit = SUITS.find(s => s.code === card[1]);
    if (suit && suit.red) span.classList.add('red');
    span.textContent = card[0] + (suit ? suit.glyph : card[1]);
    return span;
  }

  // ── Tabs ────────────────────────────────────────────────────────────────────

  function switchTab(which) {
    const build = which === 'build';
    $('lpr-tab-build').classList.toggle('active', build);
    $('lpr-tab-paste').classList.toggle('active', !build);
    $('lpr-tab-build').setAttribute('aria-selected', String(build));
    $('lpr-tab-paste').setAttribute('aria-selected', String(!build));
    $('lpr-panel-build').hidden = !build;
    $('lpr-panel-paste').hidden = build;
  }

  // ── Setup step ──────────────────────────────────────────────────────────────

  function positionsFor(count) { return LPRCore.POSITIONS_BY_COUNT[count]; }

  function renderPlayerRows() {
    const count = Number($('lpr-player-count').value);
    const positions = positionsFor(count);
    const container = $('lpr-players');
    const old = draft.players;
    container.innerHTML = '';
    draft.players = positions.map((pos, i) => {
      const prev = old[i];
      return {
        seat: i + 1,
        name: prev ? prev.name : '',
        stack: prev ? prev.stack : '',
        position: pos,
        cards: prev ? prev.cards : null,
        isHero: false,
      };
    });
    if (heroIndex >= count) heroIndex = -1;
    if (heroIndex === -1) heroIndex = count - 1; // default: the button

    draft.players.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'lpr-player-row';

      const pos = document.createElement('span');
      pos.className = 'lpr-pos-tag';
      pos.textContent = p.position;
      row.appendChild(pos);

      const nameWrap = document.createElement('div');
      nameWrap.style.display = 'flex';
      nameWrap.style.gap = '6px';
      nameWrap.style.alignItems = 'center';
      const name = document.createElement('input');
      name.type = 'text';
      name.maxLength = 20;
      name.placeholder = 'Player ' + (i + 1);
      name.value = p.name;
      name.setAttribute('aria-label', p.position + ' player name');
      name.addEventListener('input', () => { draft.players[i].name = name.value; });
      const hero = document.createElement('button');
      hero.type = 'button';
      hero.className = 'lpr-ghost-btn';
      hero.style.padding = '6px 9px';
      hero.title = 'This is you';
      hero.setAttribute('aria-label', 'Mark ' + p.position + ' as you');
      hero.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">' +
        (i === heroIndex ? 'star' : 'star_border') + '</span>';
      if (i === heroIndex) { hero.style.borderColor = 'var(--primary)'; hero.style.color = 'var(--primary)'; }
      hero.addEventListener('click', () => { heroIndex = i; renderPlayerRows(); });
      nameWrap.appendChild(name);
      nameWrap.appendChild(hero);
      row.appendChild(nameWrap);

      const stack = document.createElement('input');
      stack.type = 'number';
      stack.min = '0';
      stack.step = 'any';
      stack.inputMode = 'decimal';
      stack.placeholder = 'Stack';
      stack.value = p.stack;
      stack.setAttribute('aria-label', p.position + ' stack');
      stack.addEventListener('input', () => { draft.players[i].stack = stack.value; });
      row.appendChild(stack);

      const cardsBtn = document.createElement('button');
      cardsBtn.type = 'button';
      cardsBtn.className = 'lpr-cards-btn';
      renderCardsBtn(cardsBtn, p.cards, i === heroIndex);
      cardsBtn.addEventListener('click', () => {
        openPicker({
          title: 'Cards for ' + (draft.players[i].name || p.position),
          count: 2,
          current: draft.players[i].cards || [],
          used: usedCards(i),
          onDone: cards => {
            draft.players[i].cards = cards.length === 2 ? cards : null;
            renderCardsBtn(cardsBtn, draft.players[i].cards, i === heroIndex);
          },
        });
      });
      row.appendChild(cardsBtn);

      container.appendChild(row);
    });
  }

  function renderCardsBtn(btn, cards, isHero) {
    btn.innerHTML = '';
    btn.classList.toggle('has-cards', !!cards);
    if (cards) {
      cards.forEach(c => btn.appendChild(cardEl(c)));
    } else {
      btn.textContent = isHero ? 'Your cards' : 'Unknown';
    }
  }

  // ── Card picker ─────────────────────────────────────────────────────────────

  function openPicker(opts) {
    const overlay = document.createElement('div');
    overlay.className = 'lpr-picker-overlay';
    const box = document.createElement('div');
    box.className = 'lpr-picker';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', opts.title);

    const h = document.createElement('h4');
    h.textContent = opts.title;
    const sub = document.createElement('p');
    sub.className = 'lpr-picker-sub';
    box.appendChild(h);
    box.appendChild(sub);

    let chosen = opts.current.slice();

    const grid = document.createElement('div');
    grid.className = 'lpr-picker-grid';
    const buttons = {};
    for (const suit of SUITS) {
      for (const r of RANKS_DESC) {
        const card = r + suit.code;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'lpr-pick-card' + (suit.red ? ' red' : '');
        b.textContent = r + suit.glyph;
        b.setAttribute('aria-label', card);
        if (opts.used.includes(card)) b.classList.add('used');
        buttons[card] = b;
        b.addEventListener('click', () => {
          if (opts.used.includes(card)) return;
          if (chosen.includes(card)) chosen = chosen.filter(c => c !== card);
          else {
            if (chosen.length >= opts.count) chosen.shift();
            chosen.push(card);
          }
          paint();
        });
        grid.appendChild(b);
      }
    }
    box.appendChild(grid);

    const footer = document.createElement('div');
    footer.className = 'lpr-picker-footer';
    const clear = ghost('Clear', () => { chosen = []; paint(); });
    const cancel = ghost('Cancel', close);
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'lpr-primary-btn';
    ok.textContent = 'Done';
    ok.addEventListener('click', () => {
      if (chosen.length !== 0 && chosen.length !== opts.count) return;
      opts.onDone(chosen);
      close();
    });
    footer.appendChild(clear);
    footer.appendChild(cancel);
    footer.appendChild(ok);
    box.appendChild(footer);

    overlay.appendChild(box);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    paint();

    function ghost(label, fn) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lpr-ghost-btn';
      b.textContent = label;
      b.addEventListener('click', fn);
      return b;
    }
    function paint() {
      for (const card in buttons) buttons[card].classList.toggle('chosen', chosen.includes(card));
      sub.textContent = 'Pick ' + opts.count + (opts.count > 1 ? ' cards' : ' card') +
        ' — chosen: ' + (chosen.join(' ') || 'none');
      ok.disabled = chosen.length !== 0 && chosen.length !== opts.count;
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    function close() {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
    }
  }

  // ── Setup → actions ─────────────────────────────────────────────────────────

  function readSetup() {
    draft.gameType = $('lpr-game-type').value;
    draft.currency = $('lpr-currency').value;
    draft.blinds = {
      sb: Number($('lpr-sb').value),
      bb: Number($('lpr-bb').value),
      ante: Number($('lpr-ante').value) || 0,
      straddle: Number($('lpr-straddle').value) || 0,
    };
    const oldNames = draft.players.map(p => p.name || p.position);
    draft.players = draft.players.map((p, i) => ({
      seat: i + 1,
      name: (p.name || '').trim() || 'Player ' + (i + 1),
      stack: Number(p.stack),
      position: p.position,
      cards: p.cards,
      isHero: i === heroIndex,
    }));
    // Keep recorded actions valid if a player was renamed
    const renames = {};
    draft.players.forEach((p, i) => {
      const finalName = p.name;
      if (oldNames[i] && oldNames[i] !== finalName) renames[oldNames[i]] = finalName;
    });
    if (Object.keys(renames).length) {
      draft.actions.forEach(a => { if (renames[a.player]) a.player = renames[a.player]; });
      if (renames[draft.winnerOverride]) draft.winnerOverride = renames[draft.winnerOverride];
    }
  }

  function toActions() {
    readSetup();
    const err = $('lpr-setup-error');
    err.textContent = '';
    const hero = draft.players[heroIndex];
    if (hero && !hero.cards) {
      err.textContent = 'Pick your cards (the starred player) before continuing.';
      return;
    }
    const shapeErrors = LPRCore.validateShape(Object.assign({}, draft, { actions: [] }));
    if (shapeErrors.length) { err.textContent = shapeErrors[0]; return; }
    trimBrokenActions();
    $('lpr-setup').hidden = true;
    $('lpr-actions').hidden = false;
    refreshBuilder();
  }

  // Drop recorded actions from the end until the hand builds cleanly — used
  // when setup edits or an AI parse make the tail of the action list illegal.
  function trimBrokenActions() {
    let guard = draft.actions.length + 1;
    while (guard-- > 0) {
      const res = LPRCore.buildTimeline(draft, { allowIncomplete: true });
      if (!res.error || !draft.actions.length) return;
      draft.actions.pop();
    }
  }

  // ── Action builder ──────────────────────────────────────────────────────────

  function refreshBuilder() {
    const res = LPRCore.buildTimeline(draft, { allowIncomplete: true });
    const errEl = $('lpr-action-error');
    errEl.textContent = res.error || '';

    // History
    const hist = $('lpr-history');
    hist.innerHTML = '';
    (res.steps || []).forEach(step => {
      const li = document.createElement('li');
      li.textContent = step.description;
      if (step.kind === 'deal' || step.kind === 'post') li.classList.add('lpr-street-break');
      hist.appendChild(li);
    });

    const lastStep = res.steps && res.steps.length ? res.steps[res.steps.length - 1] : null;
    const potNow = lastStep ? lastStep.state.pot : 0;
    $('lpr-pot-readout').textContent = fmt(potNow);

    const state = res.state || (lastStep && lastStep.state);
    const street = state ? state.street : 'preflop';
    $('lpr-street-tag').textContent = street[0].toUpperCase() + street.slice(1);

    const boardEl = $('lpr-board-readout');
    boardEl.innerHTML = '';
    const boardCards = state ? state.board : [];
    (boardCards || []).forEach(c => {
      const el = cardEl(c);
      boardEl.appendChild(el);
    });

    const buttonsEl = $('lpr-action-buttons');
    const promptEl = $('lpr-board-prompt');
    const turnLine = $('lpr-turn-line');
    buttonsEl.innerHTML = '';
    promptEl.innerHTML = '';
    promptEl.hidden = true;
    $('lpr-watch').hidden = true;

    if (res.error) {
      turnLine.textContent = 'Something is off with the recorded actions — undo the last one.';
      return;
    }

    if (res.needsBoard) {
      turnLine.textContent = '';
      promptEl.hidden = false;
      const label = document.createElement('span');
      const n = res.needsBoard === 'flop' ? 3 : 1;
      label.textContent = 'Betting is done on this street. Enter the ' + res.needsBoard + ':';
      const pick = document.createElement('button');
      pick.type = 'button';
      pick.className = 'lpr-primary-btn';
      pick.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">playing_cards</span> Pick ' +
        (n === 3 ? 'the flop (3 cards)' : 'the ' + res.needsBoard + ' card');
      pick.addEventListener('click', () => {
        openPicker({
          title: res.needsBoard === 'flop' ? 'Flop cards' : (res.needsBoard[0].toUpperCase() + res.needsBoard.slice(1)) + ' card',
          count: n,
          current: [],
          used: usedCards(-1),
          onDone: cards => {
            if (cards.length !== n) return;
            if (res.needsBoard === 'flop') draft.board.flop = cards;
            else if (res.needsBoard === 'turn') draft.board.turn = cards[0];
            else draft.board.river = cards[0];
            undoStack.push({ kind: 'board', street: res.needsBoard });
            refreshBuilder();
          },
        });
      });
      promptEl.appendChild(label);
      promptEl.appendChild(pick);
      return;
    }

    if (!res.incomplete) {
      turnLine.textContent = 'Hand complete.';
      renderOverridePicker(buttonsEl, lastStep);
      $('lpr-watch').hidden = false;
      return;
    }

    // Someone is to act
    const toAct = state.toAct;
    const legal = LPRCore.legalActions(state);
    turnLine.textContent = toAct + ' to act (' + fmt(state.players[toAct].stack) + ' behind)';

    if (legal.canFold) buttonsEl.appendChild(actBtn('Fold', () => addAction({ type: 'fold' })));
    if (legal.canCheck) buttonsEl.appendChild(actBtn('Check', () => addAction({ type: 'check' })));
    if (legal.callAmount > 0) {
      buttonsEl.appendChild(actBtn('Call ' + fmt(legal.callAmount), () => addAction({ type: 'call' })));
    }
    const maxTo = legal.maxTo;
    if (legal.canBet || legal.canRaise) {
      const verb = legal.canBet ? 'Bet' : 'Raise to';
      const amount = document.createElement('input');
      amount.type = 'number';
      amount.className = 'lpr-amount-input';
      amount.min = String(legal.minBet);
      amount.max = String(maxTo);
      amount.step = 'any';
      amount.inputMode = 'decimal';
      amount.placeholder = String(legal.minBet);
      amount.setAttribute('aria-label', verb + ' amount');
      const go = actBtn(verb, () => {
        const val = Number(amount.value);
        if (!(val > 0)) return;
        addAction({ type: legal.canBet ? 'bet' : 'raise', amount: val });
      });
      buttonsEl.appendChild(amount);
      buttonsEl.appendChild(go);
    }
    if (maxTo > state.players[toAct].streetCommitted) {
      const allin = actBtn('All-in ' + fmt(maxTo), () => addAction({ type: 'allin' }));
      allin.classList.add('lpr-act-allin');
      buttonsEl.appendChild(allin);
    }

    function addAction(partial) {
      draft.actions.push(Object.assign({ street: state.street, player: toAct }, partial));
      undoStack.push({ kind: 'action' });
      refreshBuilder();
    }
    function actBtn(label, fn) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lpr-act-btn';
      b.textContent = label;
      b.addEventListener('click', fn);
      return b;
    }
  }

  function renderOverridePicker(container, lastStep) {
    if (!lastStep) return;
    const state = lastStep.state;
    const actives = state.order.filter(n => !state.players[n].folded);
    const cardsByName = {};
    draft.players.forEach(p => { cardsByName[p.name] = p.cards; });
    const unknown = actives.filter(n => !Array.isArray(cardsByName[n]));
    if (actives.length < 2 || unknown.length === 0) { draft.winnerOverride = null; return; }

    const wrap = document.createElement('div');
    wrap.className = 'lpr-field';
    const label = document.createElement('label');
    label.htmlFor = 'lpr-override';
    label.textContent = 'Not everyone showed their cards - who actually won?';
    const select = document.createElement('select');
    select.id = 'lpr-override';
    const auto = document.createElement('option');
    auto.value = '';
    auto.textContent = 'Not sure (give it to the last aggressor)';
    select.appendChild(auto);
    actives.forEach(n => {
      const o = document.createElement('option');
      o.value = n;
      o.textContent = n;
      select.appendChild(o);
    });
    select.value = draft.winnerOverride || '';
    select.addEventListener('change', () => { draft.winnerOverride = select.value || null; });
    wrap.appendChild(label);
    wrap.appendChild(select);
    container.appendChild(wrap);
  }

  function undo() {
    const last = undoStack.pop();
    if (!last) return;
    if (last.kind === 'action') draft.actions.pop();
    else if (last.kind === 'board') {
      if (last.street === 'flop') draft.board.flop = null;
      else if (last.street === 'turn') draft.board.turn = null;
      else draft.board.river = null;
    }
    refreshBuilder();
  }

  // ── Replay ──────────────────────────────────────────────────────────────────

  let timeline = null;
  let stepIndex = 0;
  let playTimer = null;
  let speed = 1;
  const seatEls = {}, betEls = {};

  function enterReplay(hand) {
    draft = hand;
    const res = LPRCore.buildTimeline(hand);
    if (res.error) {
      $('lpr-paste-error').textContent = res.error;
      return false;
    }
    timeline = res.steps;
    buildTable(hand);
    stepIndex = 0;
    stopPlay();
    renderStep();

    $('lpr-input-card').hidden = true;
    $('lpr-replay').hidden = false;

    const encoded = LPRCore.encodeHand(hand);
    const shareUrl = 'https://johnb.io/live-poker-hand-replayer#h=' + encoded;
    $('lpr-copy-link').dataset.url = shareUrl;
    $('lpr-embed-code').value =
      '<iframe src="https://johnb.io/live-poker-hand-replayer?embed=1#h=' + encoded +
      '" width="100%" height="560" style="border:0;border-radius:12px" title="Poker hand replay" loading="lazy"></iframe>';

    if (!document.documentElement.classList.contains('lpr-embed')) {
      $('lpr-replay').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return true;
  }

  // Small or short screens get compact seats pushed out onto the rail so the
  // boxes never sit over the board.
  function isCompact() {
    return window.innerWidth < 700 || window.innerHeight < 620;
  }

  function buildTable(hand) {
    const seatsWrap = $('lpr-seats');
    seatsWrap.innerHTML = '';
    for (const k in seatEls) delete seatEls[k];
    for (const k in betEls) delete betEls[k];

    const compact = isCompact();
    $('lpr-table').classList.toggle('lpr-compact', compact);
    const seatRX = compact ? 47 : 44, seatRY = compact ? 46 : 42;
    const betRX = compact ? 28 : 24, betRY = compact ? 27 : 22;
    const dealerR = compact ? [41, 38] : [33, 31];

    const order = timeline[0].state.order;
    const n = order.length;
    const heroName = (hand.players.find(p => p.isHero) || {}).name;
    const heroIdx = Math.max(0, order.indexOf(heroName));
    const posByName = {};
    hand.players.forEach(p => { posByName[p.name] = p.position; });

    order.forEach((name, i) => {
      const slot = (i - heroIdx + n) % n;
      const angle = (90 + slot * (360 / n)) * Math.PI / 180;
      const seatX = 50 + seatRX * Math.cos(angle);
      const seatY = 50 + seatRY * Math.sin(angle);
      const betX = 50 + betRX * Math.cos(angle);
      const betY = 50 + betRY * Math.sin(angle);

      const seat = document.createElement('div');
      seat.className = 'lpr-seat';
      // CSS reads these so the mobile media query can clamp seats inside the viewport
      seat.style.setProperty('--x', seatX + '%');
      seat.style.setProperty('--y', seatY + '%');
      seat.innerHTML =
        '<span class="lpr-seat-action"></span>' +
        '<div class="lpr-seat-pos">' + posByName[name] + '</div>' +
        '<div class="lpr-seat-name">' + escapeHtml(name) + '</div>' +
        '<div class="lpr-seat-stack"></div>' +
        '<div class="lpr-seat-cards"></div>';
      seatsWrap.appendChild(seat);
      seatEls[name] = seat;

      const bet = document.createElement('div');
      bet.className = 'lpr-bet';
      bet.style.left = betX + '%';
      bet.style.top = betY + '%';
      seatsWrap.appendChild(bet);
      betEls[name] = bet;

      const btnName = n === 2 ? order[0] : order[n - 1];
      if (name === btnName) {
        const dealer = document.createElement('div');
        dealer.className = 'lpr-dealer';
        dealer.textContent = 'D';
        dealer.style.left = (50 + dealerR[0] * Math.cos(angle + 0.35)) + '%';
        dealer.style.top = (50 + dealerR[1] * Math.sin(angle + 0.35)) + '%';
        dealer.title = 'Dealer button';
        seatsWrap.appendChild(dealer);
      }
    });
  }

  function renderStep() {
    const step = timeline[stepIndex];
    const state = step.state;
    const isResult = step.kind === 'result';
    const cardsByName = {};
    draft.players.forEach(p => { cardsByName[p.name] = p.cards; });
    const heroName = (draft.players.find(p => p.isHero) || {}).name;
    const winners = isResult && state.result ? state.result.winners.map(w => w.name) : [];

    state.order.forEach(name => {
      const p = state.players[name];
      const seat = seatEls[name];
      seat.classList.toggle('folded', p.folded);
      seat.classList.toggle('active', state.toAct === name);
      seat.classList.toggle('winner', winners.includes(name));

      const stackEl = seat.querySelector('.lpr-seat-stack');
      stackEl.textContent = p.allIn && p.stack === 0 && !isResult ? 'All-in' : fmt(p.stack);
      stackEl.classList.toggle('allin', p.allIn && p.stack === 0 && !isResult);

      const cardsWrap = seat.querySelector('.lpr-seat-cards');
      cardsWrap.innerHTML = '';
      const cards = cardsByName[name];
      const reveal = cards && (name === heroName || (isResult && state.result && state.result.showdown !== false && !p.folded));
      if (p.folded) {
        // fold leaves the slot empty
      } else if (reveal) {
        cards.forEach(c => cardsWrap.appendChild(cardEl(c)));
      } else {
        cardsWrap.appendChild(cardEl(null));
        cardsWrap.appendChild(cardEl(null));
      }

      const tag = seat.querySelector('.lpr-seat-action');
      tag.textContent = (step.kind === 'action' && step.action && step.action.player === name)
        ? shortAction(step) : '';

      betEls[name].textContent = p.streetCommitted > 0 ? fmt(p.streetCommitted) : '';
    });

    // Board
    const boardEl = $('lpr-board');
    boardEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const card = state.board[i];
      const el = cardEl(card || null);
      if (!card) { el.style.visibility = 'hidden'; }
      else el.classList.add('dealt');
      boardEl.appendChild(el);
    }

    $('lpr-pot').textContent = state.pot > 0 ? 'Pot: ' + fmt(state.pot) : '';
    $('lpr-announce').textContent = isResult ? describeResult(state) : '';
    $('lpr-step-desc').textContent = describeStep(step);
    const streetLabel = isResult ? 'Result' : step.street[0].toUpperCase() + step.street.slice(1);
    $('lpr-progress').textContent = 'Step ' + (stepIndex + 1) + ' of ' + timeline.length + ' — ' + streetLabel;

    $('lpr-prev').disabled = stepIndex === 0;
    $('lpr-next').disabled = stepIndex === timeline.length - 1;
  }

  function shortAction(step) {
    const a = step.action;
    if (a.type === 'fold') return 'folds';
    if (a.type === 'check') return 'checks';
    if (a.type === 'call') return 'calls';
    if (a.type === 'allin') return 'all-in';
    return (a.type === 'bet' ? 'bets ' : 'raises to ') + fmt(a.amount);
  }

  // Core descriptions use raw numbers; add thousands separators for
  // readability and the currency symbol for cash games.
  function describeStepText(text) {
    return text.replace(/\b(\d[\d,]*(?:\.\d+)?)\b/g, m => {
      const formatted = Number(m.replace(/,/g, '')).toLocaleString('en-GB', { maximumFractionDigits: 2 });
      return draft.gameType === 'cash' ? draft.currency + formatted : formatted;
    });
  }
  function describeStep(step) { return describeStepText(step.description); }
  function describeResult(state) { return describeStepText(state.result.announcement); }

  // ── Playback controls ───────────────────────────────────────────────────────

  function stopPlay() {
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    $('lpr-play-icon').textContent = 'play_arrow';
    $('lpr-play').setAttribute('aria-label', 'Play replay');
  }

  function togglePlay() {
    if (playTimer) { stopPlay(); return; }
    if (stepIndex >= timeline.length - 1) { stepIndex = 0; renderStep(); }
    $('lpr-play-icon').textContent = 'pause';
    $('lpr-play').setAttribute('aria-label', 'Pause replay');
    playTimer = setInterval(() => {
      if (stepIndex >= timeline.length - 1) { stopPlay(); return; }
      stepIndex++;
      renderStep();
    }, 2000 / speed);
  }

  function stepBy(delta) {
    stopPlay();
    stepIndex = Math.min(timeline.length - 1, Math.max(0, stepIndex + delta));
    renderStep();
  }

  // ── Paste path ──────────────────────────────────────────────────────────────

  async function parseNotes() {
    const notes = $('lpr-notes').value.trim();
    const errEl = $('lpr-paste-error');
    errEl.textContent = '';
    if (notes.length < 20) {
      errEl.textContent = 'Add a bit more detail — blinds, stacks and the action.';
      return;
    }
    const btn = $('lpr-parse');
    btn.disabled = true;
    $('lpr-parse-label').textContent = 'Reading your hand…';
    try {
      const resp = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        errEl.textContent = (data && data.error) || 'Something went wrong. Try the hand builder instead.';
        return;
      }
      const result = data.result;
      if (result && result.parseError) {
        prefillFromPartial(result.partial || {}, result.parseError);
        return;
      }
      const check = LPRCore.validateHand(result);
      if (check.ok) {
        heroFromHand(result);
        enterReplay(result);
      } else {
        prefillFromPartial(result, 'The AI got most of it, but: ' + check.errors[0]);
      }
    } catch (e) {
      errEl.textContent = 'Could not reach the parser. Check your connection, or build the hand with the form — it works offline.';
    } finally {
      btn.disabled = false;
      $('lpr-parse-label').textContent = 'Build my replay';
    }
  }

  function heroFromHand(hand) {
    heroIndex = hand.players.findIndex(p => p.isHero);
  }

  function prefillFromPartial(partial, message) {
    if (partial && typeof partial === 'object') {
      if (partial.gameType) draft.gameType = partial.gameType;
      if (partial.currency) draft.currency = partial.currency;
      if (partial.blinds) draft.blinds = Object.assign({ sb: 1, bb: 2, ante: 0, straddle: 0 }, partial.blinds);
      if (Array.isArray(partial.players) && partial.players.length >= 2 && partial.players.length <= 9) {
        draft.players = partial.players.map((p, i) => ({
          seat: i + 1,
          name: (p && p.name) || '',
          stack: (p && p.stack) || '',
          position: (positionsFor(partial.players.length) || [])[i],
          cards: p && Array.isArray(p.cards) && p.cards.length === 2 ? p.cards : null,
          isHero: !!(p && p.isHero),
        }));
        heroIndex = Math.max(0, partial.players.findIndex(p => p && p.isHero));
      }
      if (partial.board) draft.board = Object.assign({ flop: null, turn: null, river: null }, partial.board);
      if (Array.isArray(partial.actions)) draft.actions = partial.actions.filter(a => a && a.street && a.player && a.type);
      draft.winnerOverride = partial.winnerOverride || null;
    }

    // Fill the visible form
    $('lpr-game-type').value = draft.gameType;
    $('lpr-currency').value = draft.currency;
    $('lpr-sb').value = draft.blinds.sb;
    $('lpr-bb').value = draft.blinds.bb;
    $('lpr-ante').value = draft.blinds.ante;
    $('lpr-straddle').value = draft.blinds.straddle;
    if (draft.players.length >= 2) $('lpr-player-count').value = String(draft.players.length);
    renderPlayerRowsPreserving();

    switchTab('build');
    $('lpr-setup').hidden = false;
    $('lpr-actions').hidden = true;
    $('lpr-setup-error').textContent = message + ' Check the details below, then continue to the action.';
  }

  // renderPlayerRows rebuilds draft.players from positions; when prefilling we
  // want the parsed values kept, so stash and restore them around the rebuild.
  function renderPlayerRowsPreserving() {
    const keep = draft.players.map(p => ({ name: p.name, stack: p.stack, cards: p.cards }));
    renderPlayerRows();
    keep.forEach((k, i) => {
      if (!draft.players[i]) return;
      draft.players[i].name = k.name || draft.players[i].name;
      draft.players[i].stack = k.stack || draft.players[i].stack;
      draft.players[i].cards = k.cards || draft.players[i].cards;
    });
    // Repaint rows with restored values
    const container = $('lpr-players');
    Array.from(container.querySelectorAll('.lpr-player-row')).forEach((row, i) => {
      const p = draft.players[i];
      if (!p) return;
      const inputs = row.querySelectorAll('input');
      inputs[0].value = p.name || '';
      inputs[1].value = p.stack || '';
      const btn = row.querySelector('.lpr-cards-btn');
      renderCardsBtn(btn, p.cards, i === heroIndex);
    });
  }

  // ── Share / embed ───────────────────────────────────────────────────────────

  function copyText(text, btn, doneLabel) {
    const original = btn.innerHTML;
    function done() {
      btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check</span> ' + doneLabel;
      setTimeout(() => { btn.innerHTML = original; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* nothing more we can do */ }
      ta.remove();
      done();
    }
  }

  // ── View switching ──────────────────────────────────────────────────────────

  function backToBuilder() {
    stopPlay();
    $('lpr-replay').hidden = true;
    $('lpr-input-card').hidden = false;
    heroFromHand(draft);
    if (heroIndex === -1) heroIndex = draft.players.length - 1;
    prefillFromPartial(null, 'Edit the hand and rebuild the replay.');
    $('lpr-setup-error').textContent = '';
  }

  function newHand() {
    stopPlay();
    draft = defaultDraft();
    heroIndex = -1;
    undoStack = [];
    timeline = null;
    history.replaceState(null, '', location.pathname + location.search);
    $('lpr-replay').hidden = true;
    $('lpr-input-card').hidden = false;
    $('lpr-setup').hidden = false;
    $('lpr-actions').hidden = true;
    $('lpr-notes').value = '';
    $('lpr-setup-error').textContent = '';
    $('lpr-paste-error').textContent = '';
    renderPlayerRows();
    switchTab('build');
  }

  // ── Init ────────────────────────────────────────────────────────────────────

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function init() {
    renderPlayerRows();

    $('lpr-tab-build').addEventListener('click', () => switchTab('build'));
    $('lpr-tab-paste').addEventListener('click', () => switchTab('paste'));
    $('lpr-player-count').addEventListener('change', renderPlayerRows);
    $('lpr-game-type').addEventListener('change', () => {
      draft.gameType = $('lpr-game-type').value;
      $('lpr-currency-field').style.visibility = draft.gameType === 'cash' ? 'visible' : 'hidden';
    });
    $('lpr-to-actions').addEventListener('click', toActions);
    $('lpr-undo').addEventListener('click', undo);
    $('lpr-back-to-setup').addEventListener('click', () => {
      $('lpr-actions').hidden = true;
      $('lpr-setup').hidden = false;
    });
    $('lpr-watch').addEventListener('click', () => {
      readSetup();
      const check = LPRCore.validateHand(draft);
      if (!check.ok) { $('lpr-action-error').textContent = check.errors[0]; return; }
      enterReplay(draft);
    });

    $('lpr-notes').addEventListener('input', () => {
      $('lpr-char-count').textContent = $('lpr-notes').value.length.toLocaleString('en-GB') + ' / 5,000';
    });
    $('lpr-parse').addEventListener('click', parseNotes);

    $('lpr-prev').addEventListener('click', () => stepBy(-1));
    $('lpr-next').addEventListener('click', () => stepBy(1));
    $('lpr-play').addEventListener('click', togglePlay);
    document.querySelectorAll('.lpr-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        speed = Number(btn.dataset.speed);
        document.querySelectorAll('.lpr-speed-btn').forEach(b => b.classList.toggle('active', b === btn));
        if (playTimer) { stopPlay(); togglePlay(); }
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      if (!timeline || $('lpr-replay').hidden) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { buildTable(draft); renderStep(); }, 150);
    });

    document.addEventListener('keydown', e => {
      if (!timeline || $('lpr-replay').hidden) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepBy(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); stepBy(1); }
      else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    });

    $('lpr-copy-link').addEventListener('click', e => {
      copyText(e.currentTarget.dataset.url, e.currentTarget, 'Link copied');
    });
    $('lpr-show-embed').addEventListener('click', () => {
      $('lpr-embed-box').hidden = !$('lpr-embed-box').hidden;
    });
    $('lpr-copy-embed').addEventListener('click', e => {
      copyText($('lpr-embed-code').value, e.currentTarget, 'Copied');
    });
    $('lpr-edit-hand').addEventListener('click', backToBuilder);
    $('lpr-new-hand').addEventListener('click', newHand);

    // Shared replay in the URL?
    const m = location.hash.match(/^#h=(.+)$/);
    if (m) {
      const hand = LPRCore.decodeHand(m[1]);
      const check = hand ? LPRCore.validateHand(hand) : { ok: false };
      if (hand && check.ok) {
        heroFromHand(hand);
        enterReplay(hand);
      } else {
        $('lpr-setup-error').textContent = 'This replay link looks broken — the hand could not be read. Build it fresh below.';
        if (document.documentElement.classList.contains('lpr-embed')) {
          $('lpr-replay').hidden = false;
          $('lpr-step-desc').textContent = 'This replay link looks broken.';
        }
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
