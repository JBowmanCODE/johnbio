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

    // Optional context table: who's still in the hand (used for board pickers)
    if (opts.players && opts.players.length) {
      const tbl = document.createElement('div');
      tbl.className = 'lpr-picker-players';
      const head = document.createElement('div');
      head.className = 'lpr-picker-player-row lpr-picker-player-head';
      ['Still in the hand', 'Cards', 'Position'].forEach(t => {
        const s = document.createElement('span');
        s.textContent = t;
        head.appendChild(s);
      });
      tbl.appendChild(head);
      for (const p of opts.players) {
        const row = document.createElement('div');
        row.className = 'lpr-picker-player-row';
        const nameEl = document.createElement('span');
        nameEl.textContent = p.name;
        const cardsEl = document.createElement('span');
        cardsEl.className = 'lpr-picker-player-cards';
        if (Array.isArray(p.cards)) p.cards.forEach(c => cardsEl.appendChild(cardEl(c)));
        else { cardsEl.textContent = 'Unknown'; cardsEl.classList.add('lpr-unknown'); }
        const posEl = document.createElement('span');
        posEl.className = 'lpr-pos-tag';
        posEl.textContent = p.position;
        row.appendChild(nameEl);
        row.appendChild(cardsEl);
        row.appendChild(posEl);
        tbl.appendChild(row);
      }
      box.appendChild(tbl);
    }

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
          players: draft.players.filter(p => state.players[p.name] && !state.players[p.name].folded),
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

    // Someone is to act — show who, where they sit, their cards if known
    const toAct = state.toAct;
    const legal = LPRCore.legalActions(state);
    const actor = draft.players.find(pl => pl.name === toAct);
    turnLine.textContent = '';
    turnLine.appendChild(document.createTextNode(
      toAct + (actor ? ' (' + actor.position + ')' : '') +
      ' to act (' + fmt(state.players[toAct].stack) + ' behind)'
    ));
    if (actor && Array.isArray(actor.cards)) {
      const cardsSpan = document.createElement('span');
      cardsSpan.className = 'lpr-turn-cards';
      actor.cards.forEach(c => cardsSpan.appendChild(cardEl(c)));
      turnLine.appendChild(cardsSpan);
    }

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
  let shortShareUrl = null; // set async by requestShortLink; copy falls back to the long URL
  const seatEls = {}, betEls = {};

  // Swap the long #h= link for a tiny ?s= one via the worker's KV store.
  // Fire-and-forget: if it fails, the copy button just uses the long link.
  async function requestShortLink(encoded) {
    shortShareUrl = null;
    try {
      const resp = await fetch(WORKER_URL + '/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ h: encoded }),
      });
      const data = await resp.json();
      if (resp.ok && data.success && data.id) {
        shortShareUrl = 'https://johnb.io/live-poker-hand-replayer?s=' + data.id;
      }
    } catch (e) { /* long link fallback */ }
  }

  function enterReplay(hand) {
    draft = hand;
    const res = LPRCore.buildTimeline(hand);
    if (res.error) {
      $('lpr-paste-error').textContent = res.error;
      return false;
    }
    timeline = res.steps;
    narrationClips = null;
    narrationFailed = false;
    stopNarration();
    buildTable(hand);
    stepIndex = 0;
    stopPlay();
    renderStep();

    $('lpr-input-card').hidden = true;
    $('lpr-replay').hidden = false;

    const encoded = LPRCore.encodeHand(hand);
    const shareUrl = 'https://johnb.io/live-poker-hand-replayer#h=' + encoded;
    $('lpr-copy-link').dataset.url = shareUrl;
    requestShortLink(encoded);
    // The embed keeps the full hash on purpose — it works standalone forever
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
        '<span class="lpr-seat-equity"></span>' +
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
      const reveal = cards && (name === heroName || (showOppOn && !p.folded) ||
        (isResult && state.result && state.result.showdown !== false && !p.folded));
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

      const equity = equityOn ? stepEquity(step) : null;
      seat.querySelector('.lpr-seat-equity').textContent =
        equity && name in equity && !p.folded ? equity[name] + '%' : '';

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
    if (playTimer) { clearTimeout(playTimer); playTimer = null; }
    stopNarration();
    $('lpr-play-icon').textContent = 'play_arrow';
    $('lpr-play').setAttribute('aria-label', 'Play replay');
  }

  async function togglePlay() {
    if (playTimer) { stopPlay(); return; }
    ensureAudio(); // user gesture — unlock audio for the session
    if (narrateOn && !narrationClips && !narrationFailed) {
      $('lpr-progress').textContent = 'Preparing the voice…';
      await ensureNarrationClips();
    }
    if (stepIndex >= timeline.length - 1) { stepIndex = 0; renderStep(); }
    $('lpr-play-icon').textContent = 'pause';
    $('lpr-play').setAttribute('aria-label', 'Pause replay');
    renderStep();
    if (stepIndex === 0) announceIndex(0); // voice the intro line from the top
    scheduleNextStep();
  }

  // Each step holds for the playback interval OR the narration clip's length,
  // whichever is longer — so the voice always finishes its line.
  function scheduleNextStep() {
    const base = 2000 / speed;
    let wait = base;
    if (narrateOn) {
      const clipMs = narrationDurationMs(stepIndex);
      if (clipMs) wait = Math.max(base, clipMs + 350);
    }
    playTimer = setTimeout(() => {
      if (stepIndex >= timeline.length - 1) { stopPlay(); return; }
      stepIndex++;
      renderStep();
      announceIndex(stepIndex);
      scheduleNextStep();
    }, wait);
  }

  function stepBy(delta) {
    stopPlay();
    const before = stepIndex;
    stepIndex = Math.min(timeline.length - 1, Math.max(0, stepIndex + delta));
    renderStep();
    if (delta > 0 && stepIndex !== before) announceIndex(stepIndex);
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

  // ── Equity (TV-style win percentages) ───────────────────────────────────────
  // Shown only when every player still in the hand has known cards.
  // Memoised on the step object — computed once per step, reused by the
  // on-screen replay and the video renderer.

  function stepEquity(step) {
    if (step.equityComputed) return step.equity;
    step.equityComputed = true;
    step.equity = null;
    const s = step.state;
    const actives = s.order.filter(n => !s.players[n].folded);
    const cardsByName = {};
    draft.players.forEach(p => { cardsByName[p.name] = p.cards; });
    if (actives.length >= 2 && actives.every(n => Array.isArray(cardsByName[n]))) {
      step.equity = LPRCore.computeEquity(
        actives.map(n => ({ name: n, cards: cardsByName[n] })),
        s.board
      );
    }
    return step.equity;
  }

  // ── Sound effects (WebAudio, synthesised — no audio files) ──────────────────

  let audioCtx = null;
  let sfxBus = null;
  let sfxOn = localStorage.getItem('lpr-sfx') !== 'off';
  let narrateOn = localStorage.getItem('lpr-narrate') === 'on';
  let equityOn = localStorage.getItem('lpr-equity') !== 'off';   // win % badges
  let showOppOn = localStorage.getItem('lpr-showopp') === 'on';  // opponents' cards face-up before showdown

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      sfxBus = audioCtx.createGain();
      sfxBus.gain.value = 0.45;
      sfxBus.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function noiseBuffer(ac, seconds) {
    const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function playSound(kind) {
    if (!sfxOn) return;
    const ac = ensureAudio();
    if (!ac) return;
    const t = ac.currentTime + 0.01;

    function click(at, freq, vol, dur) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, at);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, at + dur);
      g.gain.setValueAtTime(vol, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + dur);
      osc.connect(g).connect(sfxBus);
      osc.start(at);
      osc.stop(at + dur + 0.02);
    }
    function noise(at, filterFreq, vol, dur) {
      const src = ac.createBufferSource();
      src.buffer = noiseBuffer(ac, dur);
      const f = ac.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = filterFreq;
      const g = ac.createGain();
      g.gain.setValueAtTime(vol, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + dur);
      src.connect(f).connect(g).connect(sfxBus);
      src.start(at);
    }

    if (kind === 'chip') { click(t, 1300, 0.05, 0.05); click(t + 0.055, 1100, 0.04, 0.05); }
    else if (kind === 'card') noise(t, 1100, 0.07, 0.05);
    else if (kind === 'knock') click(t, 650, 0.05, 0.06);
    else if (kind === 'fold') noise(t, 450, 0.04, 0.14);
    else if (kind === 'win') { click(t, 660, 0.05, 0.14); click(t + 0.13, 880, 0.05, 0.2); }
  }

  function sfxForStep(step) {
    if (step.kind === 'deal') return 'card';
    if (step.kind === 'result') return 'win';
    if (step.kind === 'post') return 'chip';
    const t = step.action && step.action.type;
    if (t === 'fold') return 'fold';
    if (t === 'check') return 'knock';
    return 'chip';
  }

  // ── Narration ────────────────────────────────────────────────────────────────
  // Primary voice: OpenAI Shimmer clips fetched in one batch from the worker
  // and decoded to AudioBuffers (they route through sfxBus, so downloaded
  // videos include the voice). Fallback: the browser's built-in speech.

  let narrationClips = null;    // Array<AudioBuffer|null> aligned with timeline
  let narrationFailed = false;
  let narrationLoading = null;  // in-flight promise
  let narrationSource = null;

  // Card codes read badly aloud ("5 H") — deal steps get spoken card names.
  const RANK_WORDS = { A: 'ace', K: 'king', Q: 'queen', J: 'jack', T: 'ten', 9: 'nine', 8: 'eight', 7: 'seven', 6: 'six', 5: 'five', 4: 'four', 3: 'three', 2: 'two' };
  const SUIT_WORDS = { s: 'spades', h: 'hearts', d: 'diamonds', c: 'clubs' };

  function speakCard(c) { return RANK_WORDS[c[0]] + ' of ' + SUIT_WORDS[c[1]]; }

  // The TTS model cannot be trusted with numerals — verified by transcription:
  // it read "30002" as "3-thou-2" and "300000" as "$3,000". Spell amounts out.
  const NUM_ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const NUM_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function numberToWords(numStr) {
    const parts = numStr.split('.');
    let n = parseInt(parts[0], 10);
    if (isNaN(n) || n > 999999999) return numStr;

    function below1000(x) {
      let s = '';
      if (x >= 100) {
        s += NUM_ONES[Math.floor(x / 100)] + ' hundred';
        x %= 100;
        if (x) s += ' and ';
      }
      if (x >= 20) {
        s += NUM_TENS[Math.floor(x / 10)];
        if (x % 10) s += '-' + NUM_ONES[x % 10];
      } else if (x > 0) {
        s += NUM_ONES[x];
      }
      return s;
    }

    const chunks = [];
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const rest = n % 1000;
    if (millions) chunks.push(below1000(millions) + ' million');
    if (thousands) chunks.push(below1000(thousands) + ' thousand');
    if (rest) chunks.push((chunks.length && rest < 100 ? 'and ' : '') + below1000(rest));
    let words = chunks.join(' ') || 'zero';
    if (parts[1]) words += ' point ' + parts[1].split('').map(d => NUM_ONES[+d] || 'zero').join(' ');
    return words;
  }

  const CURRENCY_WORDS = { '$': ['dollar', 'dollars'], '£': ['pound', 'pounds'], '€': ['euro', 'euros'] };

  function speakableText(text) {
    return text
      .replace(/(\d),(?=\d)/g, '$1') // "1,775" → "1775" before word conversion
      .replace(/([$£€])?(\d+(?:\.\d+)?)/g, (m, cur, num) => {
        const words = numberToWords(num);
        if (!cur) return words;
        const forms = CURRENCY_WORDS[cur];
        return words + ' ' + (num === '1' ? forms[0] : forms[1]);
      });
  }

  function speakableStep(step) {
    let line;
    if (step.kind === 'deal') {
      // No "River:" prefixes — TTS treats a leading "Name:" as a dialogue
      // speaker label and skips it. Full sentences read reliably.
      const board = step.state.board;
      if (step.street === 'flop') line = 'The flop comes ' + board.slice(0, 3).map(speakCard).join(', ');
      else if (step.street === 'turn') line = 'The turn is ' + speakCard(board[3]);
      else line = 'The river is ' + speakCard(board[4]);
    } else {
      line = speakableText(describeStep(step));
    }
    // A closing full stop stops terse lines ("John B folds") being read like names
    return /[.!?]$/.test(line) ? line : line + '.';
  }

  async function ensureNarrationClips() {
    if (narrationClips || narrationFailed || !timeline) return;
    if (narrationLoading) return narrationLoading;
    const steps = timeline;
    narrationLoading = (async () => {
      try {
        const ac = ensureAudio();
        if (!ac) throw new Error('no audio');
        const lines = steps.map(st => speakableStep(st));
        const resp = await fetch(WORKER_URL + '/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines }),
        });
        const data = await resp.json();
        if (!resp.ok || !data.success || !Array.isArray(data.clips)) {
          throw new Error((data && data.error) || 'narration failed');
        }
        const decoded = await Promise.all(data.clips.map(b64 => {
          const bin = atob(b64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          return ac.decodeAudioData(bytes.buffer).catch(() => null);
        }));
        if (timeline === steps) narrationClips = decoded;
      } catch (e) {
        narrationFailed = true; // browser voice takes over silently
      } finally {
        narrationLoading = null;
      }
    })();
    return narrationLoading;
  }

  function narrationDurationMs(idx) {
    if (Array.isArray(narrationClips) && narrationClips[idx]) {
      return narrationClips[idx].duration * 1000;
    }
    return null;
  }

  function stopNarration() {
    if (narrationSource) { try { narrationSource.stop(); } catch (e) { /* done */ } narrationSource = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Plays the Shimmer clip through the sfx bus (captured by video recording).
  // Returns false when no clip exists so callers can fall back.
  function playNarrationClip(idx) {
    if (!(Array.isArray(narrationClips) && narrationClips[idx])) return false;
    stopNarration();
    const src = audioCtx.createBufferSource();
    src.buffer = narrationClips[idx];
    src.connect(sfxBus);
    src.start();
    narrationSource = src;
    return true;
  }

  function playNarration(idx) {
    if (!narrateOn) return;
    if (playNarrationClip(idx)) return;
    // Fallback: browser speech (playback only — can't be recorded)
    stopNarration();
    if ('speechSynthesis' in window && timeline) {
      const u = new SpeechSynthesisUtterance(speakableStep(timeline[idx]));
      u.lang = 'en-GB';
      u.rate = 1.06;
      speechSynthesis.speak(u);
    }
  }

  function announceIndex(idx) {
    playSound(sfxForStep(timeline[idx]));
    playNarration(idx);
  }

  // ── Video export ────────────────────────────────────────────────────────────
  // Redraws the replay onto a canvas at 2x speed (1s per step) and records it
  // with MediaRecorder. MP4 where the browser supports it, WebM otherwise.

  const VIDEO_LAYOUTS = {
    horizontal: {
      W: 1920, H: 1080, cx: 960, cy: 500, frx: 640, fry: 340,
      srx: 720, sry: 400, brx: 400, bry: 235, drx: 520, dry: 295,
      seatW: 220, boardCardW: 96, boardCardH: 134, seatCardW: 56, seatCardH: 78,
      captionY: 1030, titleY: null,
    },
    vertical: {
      W: 1080, H: 1920, cx: 540, cy: 1000, frx: 460, fry: 600,
      srx: 420, sry: 680, brx: 250, bry: 390, drx: 330, dry: 500,
      seatW: 200, boardCardW: 84, boardCardH: 118, seatCardW: 50, seatCardH: 70,
      captionY: 1820, titleY: 170,
    },
  };
  const STEP_MS = 1000;   // 2x the on-screen default of 2s per action
  const END_HOLD_MS = 3000;
  let videoBusy = false;

  function pickVideoMime() {
    if (typeof MediaRecorder === 'undefined') return null;
    const candidates = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp9',
      'video/webm',
    ];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) return c;
    }
    return null;
  }

  function rrPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawVideoCard(ctx, x, y, w, h, card) {
    rrPath(ctx, x, y, w, h, w * 0.12);
    if (!card) {
      ctx.fillStyle = '#2b2b36';
      ctx.fill();
      ctx.strokeStyle = '#48474d';
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }
    ctx.fillStyle = '#f8f5fd';
    ctx.fill();
    const suit = SUITS.find(s => s.code === card[1]);
    ctx.fillStyle = suit && suit.red ? '#d21f3c' : '#16161c';
    ctx.font = '700 ' + Math.round(h * 0.42) + 'px "Space Grotesk", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card[0] + (suit ? suit.glyph : card[1]), x + w / 2, y + h / 2 + h * 0.02);
  }

  function fitText(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 1 && ctx.measureText(text + '…').width > maxW) text = text.slice(0, -1);
    return text + '…';
  }

  function drawVideoFrame(ctx, L, step) {
    const s = step.state;
    const order = s.order;
    const n = order.length;
    const heroName = (draft.players.find(p => p.isHero) || {}).name;
    const heroIdx = Math.max(0, order.indexOf(heroName));
    const posByName = {}, cardsByName = {};
    draft.players.forEach(p => { posByName[p.name] = p.position; cardsByName[p.name] = p.cards; });
    const isResult = step.kind === 'result';
    const winners = isResult && s.result ? s.result.winners.map(w => w.name) : [];

    // Background
    ctx.fillStyle = '#0e0e13';
    ctx.fillRect(0, 0, L.W, L.H);

    // Rail + felt
    ctx.save();
    ctx.translate(L.cx, L.cy);
    ctx.scale(1, L.fry / L.frx);
    ctx.beginPath();
    ctx.arc(0, 0, L.frx + 26, 0, Math.PI * 2);
    ctx.fillStyle = '#46301f';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,215,106,0.25)';
    ctx.stroke();
    const grad = ctx.createRadialGradient(0, -L.frx * 0.2, L.frx * 0.1, 0, 0, L.frx);
    grad.addColorStop(0, '#2f7a54');
    grad.addColorStop(0.55, '#1f5c3d');
    grad.addColorStop(1, '#0e2f1e');
    ctx.beginPath();
    ctx.arc(0, 0, L.frx, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, L.frx * 0.86, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Felt watermark
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.font = '900 ' + Math.round(L.frx * 0.055) + 'px "Space Grotesk", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('J O H N B . I O', L.cx, L.cy - L.fry * 0.55);

    // Board
    const bw = L.boardCardW, bh = L.boardCardH, gap = Math.round(bw * 0.12);
    const boardW = 5 * bw + 4 * gap;
    const boardX = L.cx - boardW / 2;
    const boardY = L.cy - bh * 0.85;
    for (let i = 0; i < 5; i++) {
      if (s.board[i]) drawVideoCard(ctx, boardX + i * (bw + gap), boardY, bw, bh, s.board[i]);
    }

    // Pot
    if (s.pot > 0) {
      const potText = 'Pot: ' + fmt(s.pot);
      ctx.font = '700 ' + Math.round(bh * 0.26) + 'px "Space Grotesk", Arial, sans-serif';
      const tw = ctx.measureText(potText).width;
      const px = L.cx, py = boardY + bh + bh * 0.42;
      rrPath(ctx, px - tw / 2 - 26, py - bh * 0.21, tw + 52, bh * 0.42, bh * 0.21);
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,106,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#f8f5fd';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(potText, px, py);
    }

    // Result announcement on the felt
    if (isResult && s.result) {
      ctx.fillStyle = '#ffd76a';
      ctx.font = '700 ' + Math.round(bh * 0.3) + 'px "Space Grotesk", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(fitText(ctx, describeStepText(s.result.announcement), L.frx * 1.6), L.cx, boardY + bh + bh * 0.95);
    }

    // Seats
    const seatW = L.seatW;
    const cw = L.seatCardW, ch = L.seatCardH;
    const nameFont = Math.round(seatW * 0.115);
    const seatH = nameFont * 3.2 + ch + 18;
    order.forEach((name, i) => {
      const p = s.players[name];
      const slot = (i - heroIdx + n) % n;
      const angle = (90 + slot * (360 / n)) * Math.PI / 180;
      const sx = L.cx + L.srx * Math.cos(angle);
      const sy = L.cy + L.sry * Math.sin(angle);
      const x = sx - seatW / 2, y = sy - seatH / 2;

      ctx.globalAlpha = p.folded ? 0.35 : 1;
      rrPath(ctx, x, y, seatW, seatH, 16);
      ctx.fillStyle = 'rgba(26,26,34,0.97)';
      ctx.fill();
      ctx.lineWidth = 3;
      if (winners.includes(name)) {
        ctx.strokeStyle = '#ffd76a';
        ctx.shadowColor = 'rgba(255,215,106,0.8)';
        ctx.shadowBlur = 24;
      } else if (s.toAct === name) {
        ctx.strokeStyle = '#00eefc';
        ctx.shadowColor = 'rgba(0,238,252,0.6)';
        ctx.shadowBlur = 18;
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#00eefc';
      ctx.font = '800 ' + Math.round(nameFont * 0.72) + 'px "Space Grotesk", Arial, sans-serif';
      ctx.fillText(posByName[name] || '', sx, y + nameFont * 0.8);
      ctx.fillStyle = '#f8f5fd';
      ctx.font = '700 ' + nameFont + 'px "Space Grotesk", Arial, sans-serif';
      ctx.fillText(fitText(ctx, name, seatW - 20), sx, y + nameFont * 2);
      ctx.fillStyle = p.allIn && p.stack === 0 && !isResult ? '#FF007F' : '#acaab1';
      ctx.font = '600 ' + Math.round(nameFont * 0.9) + 'px "Space Grotesk", Arial, sans-serif';
      ctx.fillText(p.allIn && p.stack === 0 && !isResult ? 'All-in' : fmt(p.stack), sx, y + nameFont * 3.1);

      // Cards
      if (!p.folded) {
        const cards = cardsByName[name];
        const reveal = cards && (name === heroName || showOppOn ||
          (isResult && s.result && s.result.showdown !== false));
        const cy2 = y + nameFont * 3.2 + 10;
        drawVideoCard(ctx, sx - cw - 3, cy2, cw, ch, reveal ? cards[0] : null);
        drawVideoCard(ctx, sx + 3, cy2, cw, ch, reveal ? cards[1] : null);
      }
      ctx.globalAlpha = 1;

      // Equity badge (TV-style win %)
      const equity = equityOn ? stepEquity(step) : null;
      if (equity && name in equity && !p.folded) {
        const eqText = equity[name] + '%';
        ctx.font = '800 ' + Math.round(nameFont * 0.9) + 'px "Space Grotesk", Arial, sans-serif';
        const etw = ctx.measureText(eqText).width;
        rrPath(ctx, sx + seatW / 2 - etw - 18, y - nameFont * 1.05, etw + 24, nameFont * 1.5, nameFont * 0.75);
        ctx.fillStyle = '#ffd76a';
        ctx.fill();
        ctx.fillStyle = '#3a2a00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(eqText, sx + seatW / 2 - etw / 2 - 6, y - nameFont * 0.3);
      }

      // Bet chip
      if (p.streetCommitted > 0) {
        const bx = L.cx + L.brx * Math.cos(angle);
        const by = L.cy + L.bry * Math.sin(angle);
        const betText = fmt(p.streetCommitted);
        ctx.font = '700 ' + Math.round(nameFont * 0.85) + 'px "Space Grotesk", Arial, sans-serif';
        const btw = ctx.measureText(betText).width;
        rrPath(ctx, bx - btw / 2 - 14, by - nameFont * 0.85, btw + 28, nameFont * 1.7, nameFont * 0.85);
        ctx.fillStyle = '#0d0d12';
        ctx.fill();
        ctx.strokeStyle = '#00eefc';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#f8f5fd';
        ctx.textAlign = 'center';
        ctx.fillText(betText, bx, by + 1);
      }

      // Dealer button
      const btnName = n === 2 ? order[0] : order[n - 1];
      if (name === btnName) {
        const dx = L.cx + L.drx * Math.cos(angle + 0.35);
        const dy = L.cy + L.dry * Math.sin(angle + 0.35);
        ctx.beginPath();
        ctx.arc(dx, dy, nameFont * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#f8f5fd';
        ctx.fill();
        ctx.fillStyle = '#16161c';
        ctx.font = '800 ' + Math.round(nameFont * 0.8) + 'px "Space Grotesk", Arial, sans-serif';
        ctx.fillText('D', dx, dy + 1);
      }
    });

    // Title (vertical only) — branding lives in the footer URL, not up here,
    // so the top seat never gets overlapped
    if (L.titleY) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8f5fd';
      ctx.font = '800 44px "Space Grotesk", Arial, sans-serif';
      ctx.fillText('LIVE POKER HAND REPLAY', L.cx, L.titleY);
    }

    // Caption
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8f5fd';
    ctx.font = '600 ' + (L.titleY ? 34 : 32) + 'px "Space Grotesk", Arial, sans-serif';
    ctx.fillText(fitText(ctx, describeStep(step), L.W - 80), L.cx, L.captionY);

    // Footer watermark
    ctx.fillStyle = 'rgba(248,245,253,0.45)';
    ctx.font = '600 24px "Space Grotesk", Arial, sans-serif';
    ctx.textAlign = L.titleY ? 'center' : 'right';
    ctx.fillText('johnb.io/live-poker-hand-replayer', L.titleY ? L.cx : L.W - 30, L.H - 28);
  }

  async function downloadVideo(orientation) {
    if (!timeline || videoBusy) return;
    const statusEl = $('lpr-video-status');
    const previewWrap = $('lpr-video-preview-wrap');
    const mime = pickVideoMime();
    if (!mime) {
      statusEl.textContent = "Your browser can't record video — try Chrome, Edge or Safari.";
      return;
    }
    videoBusy = true;
    try {
      const steps = timeline; // snapshot: 'New hand' mid-recording must not break us
      const L = VIDEO_LAYOUTS[orientation];
      const canvas = document.createElement('canvas');
      canvas.width = L.W;
      canvas.height = L.H;
      const ctx = canvas.getContext('2d');
      previewWrap.innerHTML = '';
      previewWrap.appendChild(canvas);

      stopPlay();
      // With narration on, fetch the Shimmer clips first so the voice is in the video
      if (narrateOn && !narrationClips && !narrationFailed) {
        statusEl.textContent = 'Preparing the voice…';
        await ensureNarrationClips();
      }
      const stream = canvas.captureStream(30);
      // Mix the sound-effects bus (chips + narration) into the recording
      const ac = ensureAudio();
      let recStream = stream;
      let msd = null;
      if (ac && sfxBus && mime.indexOf(',') !== -1) {
        msd = ac.createMediaStreamDestination();
        sfxBus.connect(msd);
        recStream = new MediaStream(
          stream.getVideoTracks().concat(msd.stream.getAudioTracks())
        );
      }
      const rec = new MediaRecorder(recStream, { mimeType: mime, videoBitsPerSecond: 8000000 });
      const chunks = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      const stopped = new Promise(res => { rec.onstop = res; });

      // Steps with narration hold until their clip finishes
      const cumulative = [];
      let acc = 0;
      steps.forEach((st, i) => {
        let d = STEP_MS;
        if (narrateOn) {
          const clipMs = narrationDurationMs(i);
          if (clipMs) d = Math.max(STEP_MS, clipMs + 300);
        }
        acc += d;
        cumulative.push(acc);
      });
      const totalMs = acc + END_HOLD_MS;

      drawVideoFrame(ctx, L, steps[0]);
      rec.start(250);
      // Step 0 (the blinds intro) must be voiced too, or its hold time is dead air
      playSound(sfxForStep(steps[0]));
      if (narrateOn) playNarrationClip(0);
      const t0 = performance.now();
      let lastIdx = 0;

      await new Promise(resolve => {
        function tick(now) {
          // rAF timestamps can land a hair before t0 — clamp so elapsed is never negative
          const elapsed = Math.max(0, now - t0);
          let idx = 0;
          while (idx < steps.length - 1 && elapsed >= cumulative[idx]) idx++;
          if (idx !== lastIdx) {
            lastIdx = idx;
            playSound(sfxForStep(steps[idx]));
            if (narrateOn) playNarrationClip(idx);
          }
          drawVideoFrame(ctx, L, steps[idx]);
          statusEl.textContent = 'Recording… ' + Math.max(0, Math.ceil((totalMs - elapsed) / 1000)) + 's left';
          if (elapsed >= totalMs) { resolve(); return; }
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      stopNarration();
      if (msd) { try { sfxBus.disconnect(msd); } catch (e) { /* already gone */ } }

      rec.stop();
      await stopped;
      const blob = new Blob(chunks, { type: mime });
      const ext = mime.includes('mp4') ? 'mp4' : 'webm';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'poker-hand-replay-' + orientation + '.' + ext;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      statusEl.textContent = 'Done — ' + ext.toUpperCase() + ' saved to your downloads.';
    } catch (e) {
      statusEl.textContent = 'Recording failed — refresh the page and try again.';
    } finally {
      previewWrap.innerHTML = '';
      videoBusy = false;
    }
  }

  // ── Voice input (Web Speech API) ────────────────────────────────────────────

  let recogniser = null;
  let listening = false;

  function updateMicUI() {
    const btn = $('lpr-mic');
    btn.classList.toggle('lpr-mic-active', listening);
    btn.setAttribute('aria-pressed', String(listening));
    $('lpr-mic-icon').textContent = listening ? 'stop_circle' : 'mic';
    $('lpr-mic-label').textContent = listening ? 'Listening… tap to stop' : 'Speak your hand';
  }

  function toggleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      $('lpr-paste-error').textContent = 'Voice input needs Chrome, Edge or Safari.';
      return;
    }
    if (listening) {
      recogniser.stop();
      return;
    }
    const notes = $('lpr-notes');
    const base = notes.value ? notes.value.trim() + ' ' : '';
    recogniser = new SR();
    recogniser.lang = 'en-GB';
    recogniser.continuous = true;
    recogniser.interimResults = true;
    recogniser.onresult = e => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      notes.value = (base + text).slice(0, 5000);
      $('lpr-char-count').textContent = notes.value.length.toLocaleString('en-GB') + ' / 5,000';
    };
    recogniser.onerror = e => {
      if (e.error === 'not-allowed') {
        $('lpr-paste-error').textContent = 'Microphone access was blocked — allow it in your browser settings.';
      }
    };
    recogniser.onend = () => { listening = false; updateMicUI(); };
    $('lpr-paste-error').textContent = '';
    recogniser.start();
    listening = true;
    updateMicUI();
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
      copyText(shortShareUrl || e.currentTarget.dataset.url, e.currentTarget, 'Link copied');
    });
    $('lpr-show-embed').addEventListener('click', () => {
      $('lpr-embed-box').hidden = !$('lpr-embed-box').hidden;
    });
    function paintToggles() {
      $('lpr-sfx-btn').classList.toggle('active', sfxOn);
      $('lpr-sfx-btn').setAttribute('aria-pressed', String(sfxOn));
      $('lpr-sfx-icon').textContent = sfxOn ? 'volume_up' : 'volume_off';
      $('lpr-narrate-btn').classList.toggle('active', narrateOn);
      $('lpr-narrate-btn').setAttribute('aria-pressed', String(narrateOn));
      $('lpr-eq-btn').classList.toggle('active', equityOn);
      $('lpr-eq-btn').setAttribute('aria-pressed', String(equityOn));
      $('lpr-opp-btn').classList.toggle('active', showOppOn);
      $('lpr-opp-btn').setAttribute('aria-pressed', String(showOppOn));
      $('lpr-opp-icon').textContent = showOppOn ? 'visibility' : 'visibility_off';
    }
    paintToggles();
    $('lpr-eq-btn').addEventListener('click', () => {
      equityOn = !equityOn;
      localStorage.setItem('lpr-equity', equityOn ? 'on' : 'off');
      paintToggles();
      if (timeline) renderStep();
    });
    $('lpr-opp-btn').addEventListener('click', () => {
      showOppOn = !showOppOn;
      localStorage.setItem('lpr-showopp', showOppOn ? 'on' : 'off');
      paintToggles();
      if (timeline) renderStep();
    });
    $('lpr-sfx-btn').addEventListener('click', () => {
      sfxOn = !sfxOn;
      localStorage.setItem('lpr-sfx', sfxOn ? 'on' : 'off');
      if (sfxOn) { ensureAudio(); playSound('chip'); }
      paintToggles();
    });
    $('lpr-narrate-btn').addEventListener('click', () => {
      narrateOn = !narrateOn;
      localStorage.setItem('lpr-narrate', narrateOn ? 'on' : 'off');
      if (!narrateOn) stopNarration();
      else if (timeline) {
        ensureAudio();
        Promise.resolve(ensureNarrationClips()).then(() => {
          if (narrateOn) playNarration(stepIndex);
        });
      }
      paintToggles();
    });

    $('lpr-video-btn').addEventListener('click', () => {
      $('lpr-video-box').hidden = !$('lpr-video-box').hidden;
    });
    $('lpr-video-h').addEventListener('click', () => downloadVideo('horizontal'));
    $('lpr-video-v').addEventListener('click', () => downloadVideo('vertical'));
    $('lpr-mic').addEventListener('click', toggleMic);
    $('lpr-copy-embed').addEventListener('click', e => {
      copyText($('lpr-embed-code').value, e.currentTarget, 'Copied');
    });
    $('lpr-edit-hand').addEventListener('click', backToBuilder);
    $('lpr-new-hand').addEventListener('click', newHand);

    // Short share link (?s=id) — fetch the hand from the worker
    const shortId = new URLSearchParams(location.search).get('s');
    if (shortId) {
      fetch(WORKER_URL + '/r/' + encodeURIComponent(shortId))
        .then(r => r.json())
        .then(data => {
          const hand = data && data.success && data.h ? LPRCore.decodeHand(data.h) : null;
          const check = hand ? LPRCore.validateHand(hand) : { ok: false };
          if (hand && check.ok) {
            heroFromHand(hand);
            enterReplay(hand);
          } else {
            showBrokenLink();
          }
        })
        .catch(showBrokenLink);
      return;
    }

    // Shared replay in the URL?
    const m = location.hash.match(/^#h=(.+)$/);
    if (m) {
      const hand = LPRCore.decodeHand(m[1]);
      const check = hand ? LPRCore.validateHand(hand) : { ok: false };
      if (hand && check.ok) {
        heroFromHand(hand);
        enterReplay(hand);
      } else {
        showBrokenLink();
      }
    }
  }

  function showBrokenLink() {
    $('lpr-setup-error').textContent = 'This replay link looks broken — the hand could not be read. Build it fresh below.';
    if (document.documentElement.classList.contains('lpr-embed')) {
      $('lpr-replay').hidden = false;
      $('lpr-step-desc').textContent = 'This replay link looks broken.';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
