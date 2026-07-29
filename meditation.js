const WORKER_URL = 'https://meditation-worker.ukjbowman.workers.dev';
const WORDS_PER_SEC = 2.25; // matches the worker's estimate for tts-1 at speed 0.9

// ── DOM ──────────────────────────────────────────────────────────────────
const formCard    = document.getElementById('med-form-card');
const nameInput   = document.getElementById('med-name');
const goalChips   = Array.from(document.querySelectorAll('.med-chip'));
const customWrap  = document.getElementById('med-custom-wrap');
const customInput = document.getElementById('med-goal-custom');
const durBtns     = Array.from(document.querySelectorAll('#med-duration .med-seg-btn'));
const voiceBtns   = Array.from(document.querySelectorAll('#med-voice .med-seg-btn'));
const scapeBtns   = Array.from(document.querySelectorAll('#med-scape .med-seg-btn'));
const generateBtn = document.getElementById('med-generate');
const statusEl    = document.getElementById('med-status');

const playerCard  = document.getElementById('med-player');
const titleEl     = document.getElementById('med-session-title');
const playBtn     = document.getElementById('med-play');
const playIcon    = playBtn.querySelector('.material-symbols-outlined');
const stopBtn     = document.getElementById('med-stop');
const progressEl  = document.getElementById('med-progress');
const fillEl      = document.getElementById('med-progress-fill');
const elapsedEl   = document.getElementById('med-elapsed');
const totalEl     = document.getElementById('med-total');
const readyEl     = document.getElementById('med-ready');
const noteEl      = document.getElementById('med-note');
const volumeEl    = document.getElementById('med-volume');
const volumeRow   = document.getElementById('med-volume-row');

// ── STATE ────────────────────────────────────────────────────────────────
let state = 'idle'; // idle | generating | ready | playing | paused | done
let selectedGoal = 'relaxation';
let selectedDuration = 10;
let selectedVoice = 'shimmer';
let selectedScape = 'ocean';

let ctx = null;
let voiceGain = null, musicGain = null, duckGain = null;
let soundscape = null;
let segments = [];
let playIdx = 0, nextFetchIdx = 0, inFlight = 0;
let nextStartAt = 0, sessionStartCtx = 0, totalSec = 0;
let currentSource = null;
let tickTimer = null;
let ttsBlocked = false;
let soundscapeStarted = false;

// ── FORM CONTROLS ────────────────────────────────────────────────────────
function bindGroup(btns, onPick) {
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    onPick(btn);
  }));
}

bindGroup(goalChips, btn => {
  selectedGoal = btn.dataset.goal;
  customWrap.style.display = selectedGoal === 'custom' ? '' : 'none';
  if (selectedGoal === 'custom') customInput.focus();
});
bindGroup(durBtns,   btn => { selectedDuration = Number(btn.dataset.min); });
bindGroup(voiceBtns, btn => { selectedVoice = btn.dataset.voice; });
bindGroup(scapeBtns, btn => { selectedScape = btn.dataset.scape; });

// ── GENERATE ─────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  if (state === 'generating') return;

  const goalText = customInput.value.trim();
  if (selectedGoal === 'custom' && !goalText) {
    setStatus('Tell me what you want to work on first.', true);
    customInput.focus();
    return;
  }

  // Created inside the click (user gesture) so iOS lets audio play later
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    buildGraph();
  }

  state = 'generating';
  generateBtn.disabled = true;
  setStatus('Writing your meditation…');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'script',
        name: nameInput.value.trim(),
        goal: selectedGoal,
        goalText,
        duration: selectedDuration,
      }),
    });
    const data = await res.json();

    if (res.status === 429 || data.error === 'rate_limit') {
      setStatus(
        "That's your 3 free meditations used up for today. Want more? " +
        "<a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>.",
        true
      );
      state = 'idle';
      return;
    }
    if (!data.success) {
      setStatus(data.error || 'Something went wrong. Please try again.', true);
      state = 'idle';
      return;
    }

    startSession(data.result);
  } catch (e) {
    setStatus('Network error — please check your connection and try again.', true);
    state = 'idle';
  } finally {
    generateBtn.disabled = false;
  }
});

function setStatus(msg, isError = false) {
  statusEl.innerHTML = msg;
  statusEl.className = 'med-status' + (isError ? ' error' : '');
}

// ── SESSION SETUP ────────────────────────────────────────────────────────
function buildGraph() {
  voiceGain = ctx.createGain();
  voiceGain.gain.value = 1;
  voiceGain.connect(ctx.destination);

  duckGain = ctx.createGain();
  duckGain.gain.value = 1;
  duckGain.connect(ctx.destination);

  musicGain = ctx.createGain();
  musicGain.gain.value = Number(volumeEl.value);
  musicGain.connect(duckGain);
}

function startSession(script) {
  segments = script.segments.map(s => ({
    text: s.text,
    pauseAfter: s.pauseAfter,
    estSec: countWords(s.text) / WORDS_PER_SEC,
    mp3: null,
    audioBuffer: null,
    decoding: false,
    failed: false,
  }));

  playIdx = 0;
  nextFetchIdx = 0;
  inFlight = 0;
  ttsBlocked = false;
  soundscapeStarted = false;
  totalSec = segments.reduce((sum, s) => sum + s.estSec + s.pauseAfter, 0);

  titleEl.textContent = script.title;
  totalEl.textContent = fmt(totalSec);
  elapsedEl.textContent = '0:00';
  fillEl.style.width = '0%';
  noteEl.textContent = 'Preparing the voice…';
  volumeRow.style.display = selectedScape === 'none' ? 'none' : '';
  setPlayUI(false);
  stopBtn.textContent = 'End session';
  playBtn.style.display = '';

  formCard.style.display = 'none';
  setStatus('');
  playerCard.style.display = '';
  playerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  state = 'ready';
  updateReadyUI();
  pumpFetch();
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

// ── TTS FETCHING (2 concurrent, in order) ────────────────────────────────
function pumpFetch() {
  while (inFlight < 2 && nextFetchIdx < segments.length && !ttsBlocked) {
    fetchSegment(nextFetchIdx++);
  }
}

async function fetchSegment(i) {
  inFlight++;
  const seg = segments[i];
  for (let attempt = 0; attempt < 3; attempt++) {
    if (ttsBlocked) break;
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tts', text: seg.text, voice: selectedVoice }),
      });
      if (res.status === 429) {
        ttsBlocked = true;
        noteEl.innerHTML =
          "You've reached today's audio limit. Want more? " +
          "<a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>.";
        break;
      }
      if (!res.ok) throw new Error('tts ' + res.status);
      seg.mp3 = await res.arrayBuffer();
      break;
    } catch (e) {
      if (attempt === 2) seg.failed = true;
      else await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  inFlight--;
  updateReadyUI();
  pumpDecode();
  pumpFetch();
}

function updateReadyUI() {
  const ready = segments.filter(s => s.mp3 || s.failed).length;
  readyEl.textContent = ready >= segments.length
    ? 'All voice passages loaded'
    : `Loading voice… ${ready} of ${segments.length}`;
}

// ── DECODING (2 ahead of playhead; MP3 stays tiny, PCM is freed after play) ──
function decodeMp3(arrayBuffer) {
  return new Promise((resolve, reject) => {
    // decode detaches the buffer, so pass a copy in case we ever retry
    const p = ctx.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
    if (p && p.then) p.then(resolve, reject);
  });
}

function pumpDecode() {
  if (!ctx) return;
  for (let i = playIdx; i < Math.min(playIdx + 2, segments.length); i++) {
    const s = segments[i];
    if (s.mp3 && !s.audioBuffer && !s.decoding && !s.failed) {
      s.decoding = true;
      decodeMp3(s.mp3).then(buf => {
        s.audioBuffer = buf;
        s.decoding = false;
        if (state === 'playing') tick();
      }).catch(() => {
        s.decoding = false;
        s.failed = true;
      });
    }
  }
}

// ── PLAYBACK ─────────────────────────────────────────────────────────────
playBtn.addEventListener('click', () => {
  if (state === 'playing') { pauseSession(); return; }
  if (state !== 'ready' && state !== 'paused') return;

  ctx.resume();

  if (!soundscapeStarted) {
    soundscape = Soundscapes.create(ctx, selectedScape);
    if (soundscape) {
      soundscape.output.connect(musicGain);
      soundscape.start();
    }
    soundscapeStarted = true;
    sessionStartCtx = ctx.currentTime;
    nextStartAt = ctx.currentTime + 0.3;
  }

  state = 'playing';
  setPlayUI(true);
  if (!tickTimer) tickTimer = setInterval(tick, 250);
});

function pauseSession() {
  state = 'paused';
  ctx.suspend(); // freezes ctx.currentTime — voice timing and music pause for free
  setPlayUI(false);
}

function setPlayUI(playing) {
  playIcon.textContent = playing ? 'pause' : 'play_arrow';
  playBtn.setAttribute('aria-label', playing ? 'Pause meditation' : 'Play meditation');
}

function tick() {
  if (state !== 'playing') return;
  updateProgress();

  if (soundscape && soundscape.tick) soundscape.tick();

  if (playIdx >= segments.length) {
    if (ctx.currentTime >= nextStartAt) endSession();
    return;
  }
  if (ctx.currentTime < nextStartAt) return;

  const seg = segments[playIdx];
  if (seg.failed) {
    // Skip a segment we couldn't fetch — keep the pause so the session breathes
    playIdx++;
    nextStartAt = ctx.currentTime + seg.pauseAfter;
    pumpDecode();
    return;
  }
  if (!seg.audioBuffer) {
    if (!ttsBlocked) noteEl.textContent = 'Preparing the voice…';
    pumpDecode();
    return;
  }

  if (!ttsBlocked) noteEl.textContent = '';
  const src = ctx.createBufferSource();
  src.buffer = seg.audioBuffer;
  src.connect(voiceGain);
  duck(true);
  src.onended = () => {
    duck(false);
    seg.audioBuffer = null; // free the decoded PCM
    seg.mp3 = null;
  };
  src.start();
  currentSource = src;

  totalSec += src.buffer.duration - seg.estSec; // replace estimate with actual
  totalEl.textContent = fmt(totalSec);
  nextStartAt = ctx.currentTime + src.buffer.duration + seg.pauseAfter;
  playIdx++;
  pumpDecode();
}

function duck(down) {
  if (!soundscape) return;
  const t = ctx.currentTime;
  duckGain.gain.cancelScheduledValues(t);
  duckGain.gain.setValueAtTime(duckGain.gain.value, t);
  if (down) duckGain.gain.linearRampToValueAtTime(0.7, t + 0.6);
  else      duckGain.gain.linearRampToValueAtTime(1.0, t + 1.5);
}

function updateProgress() {
  const elapsed = Math.min(ctx.currentTime - sessionStartCtx, totalSec);
  elapsedEl.textContent = fmt(elapsed);
  const pct = totalSec > 0 ? (elapsed / totalSec) * 100 : 0;
  fillEl.style.width = Math.min(pct, 100) + '%';
  progressEl.setAttribute('aria-valuenow', String(Math.round(pct)));
}

function fmt(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function endSession() {
  state = 'done';
  updateProgress();
  if (soundscape) soundscape.stop(8); // long gentle fade
  setPlayUI(false);
  playBtn.style.display = 'none';
  noteEl.textContent = 'Session complete. Take a moment before you move.';
  stopBtn.textContent = 'New meditation';
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
}

// ── STOP / RESET ─────────────────────────────────────────────────────────
stopBtn.addEventListener('click', resetToForm);

function resetToForm() {
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  try { if (currentSource) currentSource.stop(); } catch (e) {}
  currentSource = null;
  if (soundscape) { soundscape.stop(0.4); soundscape = null; }
  if (ctx) { ctx.close().catch(() => {}); ctx = null; }
  segments = [];
  ttsBlocked = true; // abandon any in-flight fetch loops
  state = 'idle';
  playerCard.style.display = 'none';
  formCard.style.display = '';
  noteEl.textContent = '';
  formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── VOLUME ───────────────────────────────────────────────────────────────
volumeEl.addEventListener('input', () => {
  if (!ctx || !musicGain) return;
  musicGain.gain.setTargetAtTime(Number(volumeEl.value), ctx.currentTime, 0.05);
});

// ── PHONE LOCK / TAB SWITCH ──────────────────────────────────────────────
// iOS suspends Web Audio on screen lock; show Resume instead of pretending
// playback carried on.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && state === 'playing' && ctx && ctx.state !== 'running') {
    state = 'paused';
    setPlayUI(false);
    noteEl.textContent = 'Audio was paused by your device. Press play to resume.';
  }
});

// ── SOUNDSCAPES ──────────────────────────────────────────────────────────
// Uniform interface: create(ctx, type) → { output, start(), tick(), stop(fadeSec) } | null
const Soundscapes = {
  create(audioCtx, type) {
    if (type === 'ocean') return createOcean(audioCtx);
    if (type === 'drone') return createDrone(audioCtx);
    if (type === 'pads')  return createPads(audioCtx);
    return null;
  },
};

function createOcean(actx) {
  const output = actx.createGain();
  output.gain.value = 0.9;

  // 4-second looped white-noise buffer shared by both wave layers
  const len = 4 * actx.sampleRate;
  const buf = actx.createBuffer(1, len, actx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

  function waveLayer(lfoFreq, baseFreq) {
    const src = actx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = actx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = baseFreq;
    filter.Q.value = 0.7;
    const layerGain = actx.createGain();
    layerGain.gain.value = 0.25;
    // one slow LFO drives both the swell volume and the brightness
    const lfo = actx.createOscillator();
    lfo.frequency.value = lfoFreq;
    const lfoToGain = actx.createGain();
    lfoToGain.gain.value = 0.15;
    const lfoToFilt = actx.createGain();
    lfoToFilt.gain.value = 300;
    lfo.connect(lfoToGain); lfoToGain.connect(layerGain.gain);
    lfo.connect(lfoToFilt); lfoToFilt.connect(filter.frequency);
    src.connect(filter); filter.connect(layerGain); layerGain.connect(output);
    return { src, lfo };
  }

  const a = waveLayer(0.08, 600); // main swell
  const b = waveLayer(0.05, 400); // deeper counter-swell

  return {
    output,
    start() { a.src.start(); a.lfo.start(); b.src.start(); b.lfo.start(); },
    tick() {},
    stop(fade = 2) {
      output.gain.setTargetAtTime(0, actx.currentTime, fade / 3);
      setTimeout(() => {
        try { a.src.stop(); b.src.stop(); a.lfo.stop(); b.lfo.stop(); } catch (e) {}
      }, fade * 1000 + 300);
    },
  };
}

function createDrone(actx) {
  const output = actx.createGain();
  output.gain.value = 0.5;
  const filter = actx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 250;
  filter.connect(output);

  const o1 = actx.createOscillator(); o1.type = 'sine';     o1.frequency.value = 55;
  const o2 = actx.createOscillator(); o2.type = 'sine';     o2.frequency.value = 55; o2.detune.value = 8;
  const o3 = actx.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 110;
  const g1 = actx.createGain(); g1.gain.value = 0.4;
  const g2 = actx.createGain(); g2.gain.value = 0.4;
  const g3 = actx.createGain(); g3.gain.value = 0.08;
  o1.connect(g1); o2.connect(g2); o3.connect(g3);
  g1.connect(filter); g2.connect(filter); g3.connect(filter);

  // slow breathing effect on the master gain
  const lfo = actx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = actx.createGain();
  lfoGain.gain.value = 0.1;
  lfo.connect(lfoGain); lfoGain.connect(output.gain);

  const nodes = [o1, o2, o3, lfo];
  return {
    output,
    start() { nodes.forEach(n => n.start()); },
    tick() {},
    stop(fade = 2) {
      output.gain.setTargetAtTime(0, actx.currentTime, fade / 3);
      setTimeout(() => { try { nodes.forEach(n => n.stop()); } catch (e) {} }, fade * 1000 + 300);
    },
  };
}

function createPads(actx) {
  const output = actx.createGain();
  output.gain.value = 0.8;
  const filter = actx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  filter.Q.value = 0.5;
  filter.connect(output);

  // slow motion on the filter so held chords don't sound static
  const lfo = actx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = actx.createGain();
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain); lfoGain.connect(filter.frequency);

  // A maj, F maj, G maj, E min — mid-low register
  const CHORDS = [
    [220.00, 277.18, 329.63],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66],
    [164.81, 207.65, 246.94],
  ];
  const CHORD_HOLD = 25;
  let chordIdx = 0, nextChordAt = 0, current = [];

  function playChord(freqs) {
    const t = actx.currentTime;
    current.forEach(v => {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setValueAtTime(v.g.gain.value, t);
      v.g.gain.linearRampToValueAtTime(0, t + 7); // release overlaps next attack
      try { v.o.stop(t + 7.2); } catch (e) {}
    });
    current = freqs.map(f => {
      const o = actx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = actx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 5); // slow attack
      o.connect(g); g.connect(filter);
      o.start(t);
      return { o, g };
    });
  }

  return {
    output,
    start() {
      lfo.start();
      playChord(CHORDS[0]);
      nextChordAt = actx.currentTime + CHORD_HOLD;
    },
    // called from the player tick so chord changes pause with ctx.suspend()
    tick() {
      if (actx.currentTime >= nextChordAt) {
        chordIdx = (chordIdx + 1) % CHORDS.length;
        playChord(CHORDS[chordIdx]);
        nextChordAt = actx.currentTime + CHORD_HOLD;
      }
    },
    stop(fade = 2) {
      output.gain.setTargetAtTime(0, actx.currentTime, fade / 3);
      setTimeout(() => {
        try { lfo.stop(); current.forEach(v => v.o.stop()); } catch (e) {}
      }, fade * 1000 + 300);
    },
  };
}
