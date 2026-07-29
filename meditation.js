const WORKER_URL = 'https://meditation-worker.ukjbowman.workers.dev';
const WORDS_PER_SEC = 2.25; // matches the worker's estimate for tts-1 at speed 0.9
// 44.1kHz MPEG-1 CBR — the most compatible MP3 profile there is. Lower rates
// (24kHz MPEG-2) confused WhatsApp's player: the file played once then
// wouldn't replay.
const RENDER_RATE = 44100;
const RENDER_KBPS = 96;

// ── DOM ──────────────────────────────────────────────────────────────────
const formCard    = document.getElementById('med-form-card');
const nameInput   = document.getElementById('med-name');
const goalChips   = Array.from(document.querySelectorAll('.med-chip'));
const customWrap  = document.getElementById('med-custom-wrap');
const customInput = document.getElementById('med-goal-custom');
const durBtns     = Array.from(document.querySelectorAll('#med-duration .med-seg-btn'));
const voiceBtns   = Array.from(document.querySelectorAll('#med-voice .med-seg-btn'));
const scapeBtns   = Array.from(document.querySelectorAll('#med-scape .med-seg-btn'));
const langSel     = document.getElementById('med-language');
const generateBtn = document.getElementById('med-generate');
const statusEl    = document.getElementById('med-status');
const genBar      = document.getElementById('med-gen-progress');
const genFill     = document.getElementById('med-gen-fill');

const playerCard  = document.getElementById('med-player');
const titleEl     = document.getElementById('med-session-title');
const playBtn     = document.getElementById('med-play');
const playIcon    = playBtn.querySelector('.material-symbols-outlined');
const skipBtn     = document.getElementById('med-skip');
const stopBtn     = document.getElementById('med-stop');
const progressEl  = document.getElementById('med-progress');
const fillEl      = document.getElementById('med-progress-fill');
const elapsedEl   = document.getElementById('med-elapsed');
const totalEl     = document.getElementById('med-total');
const readyEl     = document.getElementById('med-ready');
const noteEl      = document.getElementById('med-note');
const volumeEl    = document.getElementById('med-volume');
const volumeRow   = document.getElementById('med-volume-row');
const muteBtn     = document.getElementById('med-mute');
const muteIcon    = muteBtn.querySelector('.material-symbols-outlined');
const volCaption  = document.getElementById('med-volume-caption');
const downloadBtn = document.getElementById('med-download');
const shareBtn    = document.getElementById('med-share');

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
let musicMuted = false;
let seeking = false;
let renderedBlob = null, renderedKey = '', renderBusy = false;

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
bindGroup(scapeBtns, btn => {
  selectedScape = btn.dataset.scape;
  // switch the preview live if one is playing
  if (previewScape) {
    stopPreview();
    if (selectedScape !== 'none') previewBtn.click();
  }
});

// ── SOUNDSCAPE PREVIEW ───────────────────────────────────────────────────
const previewBtn = document.getElementById('med-scape-preview');
let previewCtx = null, previewScape = null, previewTimer = null;

function stopPreview() {
  if (previewTimer) { clearInterval(previewTimer); previewTimer = null; }
  if (previewScape) { previewScape.stop(0.4); previewScape = null; }
  previewBtn.classList.remove('active');
  previewBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">volume_up</span> Preview soundscape';
}

previewBtn.addEventListener('click', () => {
  if (previewScape) { stopPreview(); return; }
  if (selectedScape === 'none') return;
  if (!previewCtx) previewCtx = new (window.AudioContext || window.webkitAudioContext)();
  previewCtx.resume();
  previewScape = Soundscapes.create(previewCtx, selectedScape);
  if (!previewScape) return;
  const g = previewCtx.createGain();
  g.gain.value = 0.6;
  previewScape.output.connect(g);
  g.connect(previewCtx.destination);
  previewScape.start();
  // chimes/bowl/pads schedule their events from tick()
  previewTimer = setInterval(() => { if (previewScape && previewScape.tick) previewScape.tick(); }, 250);
  previewBtn.classList.add('active');
  previewBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">stop</span> Stop preview';
});

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

  stopPreview();
  state = 'generating';
  generateBtn.disabled = true;
  setStatus('Writing your meditation…');
  startGenProgress();

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
        language: langSel.value,
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

    await finishGenProgress();
    startSession(data.result);
  } catch (e) {
    setStatus('Network error — please check your connection and try again.', true);
    state = 'idle';
  } finally {
    stopGenProgress();
    generateBtn.disabled = false;
  }
});

// Simulated progress for the script call — a single AI request reports no real
// progress, so ease towards 95% over ~12s and snap to 100% when it lands.
let genTimer = null, genStart = 0;

function startGenProgress() {
  genStart = performance.now();
  genFill.style.width = '0%';
  genBar.style.display = '';
  genBar.setAttribute('aria-valuenow', '0');
  genTimer = setInterval(() => {
    const t = performance.now() - genStart;
    const pct = Math.min(95, 100 * (1 - Math.exp(-t / 5000)));
    genFill.style.width = pct.toFixed(1) + '%';
    genBar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }, 150);
}

async function finishGenProgress() {
  if (genTimer) { clearInterval(genTimer); genTimer = null; }
  genFill.style.width = '100%';
  genBar.setAttribute('aria-valuenow', '100');
  await new Promise(r => setTimeout(r, 300)); // let the bar visibly complete
}

function stopGenProgress() {
  if (genTimer) { clearInterval(genTimer); genTimer = null; }
  genBar.style.display = 'none';
  genFill.style.width = '0%';
}

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
  musicGain.gain.value = musicVolume();
  musicGain.connect(duckGain);
}

function musicVolume() {
  return musicMuted ? 0 : Number(volumeEl.value);
}

function startSession(script) {
  segments = script.segments.map(s => ({
    text: s.text,
    pauseAfter: s.pauseAfter,
    estSec: countWords(s.text) / WORDS_PER_SEC,
    durSec: null,   // actual decoded duration once known
    mp3: null,      // kept for the whole session — needed for download and re-seek
    audioBuffer: null,
    decoding: false,
    failed: false,
  }));

  playIdx = 0;
  nextFetchIdx = 0;
  inFlight = 0;
  ttsBlocked = false;
  soundscapeStarted = false;
  renderedBlob = null;
  renderedKey = '';
  totalSec = segments.reduce((sum, s) => sum + s.estSec + s.pauseAfter, 0);

  titleEl.textContent = script.title;
  totalEl.textContent = fmt(totalSec);
  elapsedEl.textContent = '0:00';
  fillEl.style.width = '0%';
  noteEl.textContent = 'Preparing the voice…';
  const hasMusic = selectedScape !== 'none';
  volumeRow.style.display = hasMusic ? '' : 'none';
  volCaption.style.display = hasMusic ? '' : 'none';
  downloadBtn.disabled = true;
  shareBtn.disabled = true;
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
        // nothing else will arrive today — mark the rest so the session can still run and download
        segments.forEach(s => { if (!s.mp3) s.failed = true; });
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
  if (!segments.length) return;
  const done = segments.filter(s => s.mp3 || s.failed).length;
  readyEl.textContent = done >= segments.length
    ? 'All voice passages loaded'
    : `Loading voice… ${done} of ${segments.length}`;
  const complete = done >= segments.length && segments.some(s => s.mp3);
  downloadBtn.disabled = !complete || renderBusy;
  shareBtn.disabled = !complete || renderBusy;
}

// ── DECODING (2 ahead of playhead; PCM is freed after play, MP3s are kept) ──
function decodeMp3(audioCtx, arrayBuffer) {
  return new Promise((resolve, reject) => {
    // decode detaches the buffer, so pass a copy — we reuse the MP3 for download/seek
    const p = audioCtx.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
    if (p && p.then) p.then(resolve, reject);
  });
}

function pumpDecode() {
  if (!ctx) return;
  for (let i = playIdx; i < Math.min(playIdx + 2, segments.length); i++) {
    const s = segments[i];
    if (s.mp3 && !s.audioBuffer && !s.decoding && !s.failed) {
      s.decoding = true;
      decodeMp3(ctx, s.mp3).then(buf => {
        s.audioBuffer = buf;
        s.decoding = false;
        if (s.durSec == null) {
          totalSec += buf.duration - s.estSec;
          s.durSec = buf.duration;
          totalEl.textContent = fmt(totalSec);
        }
        if (state === 'playing') tick();
      }).catch(() => {
        s.decoding = false;
        s.failed = true;
      });
    }
  }
}

function segDur(i) {
  const s = segments[i];
  return s.durSec != null ? s.durSec : s.estSec;
}

function startOf(i) {
  let t = 0;
  for (let j = 0; j < i; j++) t += segDur(j) + segments[j].pauseAfter;
  return t;
}

// ── PLAYBACK ─────────────────────────────────────────────────────────────
playBtn.addEventListener('click', () => {
  if (state === 'playing') { pauseSession(); return; }
  if (state === 'done') prepareReplay();
  else if (state !== 'ready' && state !== 'paused') return;

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

function playVoice(i, offset = 0) {
  const seg = segments[i];
  const src = ctx.createBufferSource();
  src.buffer = seg.audioBuffer;
  src.connect(voiceGain);
  duck(true);
  src.onended = () => {
    if (currentSource === src) { duck(false); currentSource = null; }
    seg.audioBuffer = null; // free the decoded PCM; the MP3 stays for download/seek
  };
  src.start(0, offset);
  currentSource = src;
  nextStartAt = ctx.currentTime + (src.buffer.duration - offset) + seg.pauseAfter;
  playIdx = i + 1;
  pumpDecode();
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
  playVoice(playIdx);
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
  if (seeking) return; // don't fight the user's finger
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
  soundscape = null;
  soundscapeStarted = false;
  playIcon.textContent = 'replay';
  playBtn.setAttribute('aria-label', 'Replay meditation');
  noteEl.textContent = 'Session complete. Take a moment before you move.';
  stopBtn.textContent = 'New meditation';
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
}

// The segment MP3s are kept for the whole session, so replaying costs nothing
function prepareReplay() {
  playIdx = 0;
  fillEl.style.width = '0%';
  progressEl.setAttribute('aria-valuenow', '0');
  elapsedEl.textContent = '0:00';
  noteEl.textContent = '';
  stopBtn.textContent = 'End session';
  state = 'ready';
  pumpDecode();
}

// ── SEEKING ──────────────────────────────────────────────────────────────
function seekTo(T) {
  if (!soundscapeStarted || state === 'done' || !ctx || !segments.length) return;
  T = Math.max(0, Math.min(T, Math.max(0, totalSec - 0.05)));

  if (currentSource) {
    const old = currentSource;
    currentSource = null;
    try { old.stop(); } catch (e) {}
  }
  duck(false);

  // walk the timeline to find where T lands
  let t = 0, target = null;
  for (let i = 0; i < segments.length; i++) {
    const d = segDur(i), p = segments[i].pauseAfter;
    if (T < t + d) { target = { i, offset: T - t, speech: true, segStart: t }; break; }
    if (T < t + d + p) { target = { i: i + 1, speech: false, segStart: t + d + p }; break; }
    t += d + p;
  }

  const now = ctx.currentTime;
  if (!target) {
    // past the last passage — let the remaining tail run out
    playIdx = segments.length;
    sessionStartCtx = now - T;
    nextStartAt = now + Math.max(0, totalSec - T);
  } else if (target.speech) {
    const seg = segments[target.i];
    if (state === 'playing' && seg.audioBuffer && target.offset < segDur(target.i) - 0.2) {
      sessionStartCtx = now - (target.segStart + target.offset);
      playVoice(target.i, target.offset);
    } else {
      // not decoded yet (or paused) — snap to the start of that passage
      playIdx = target.i;
      nextStartAt = now;
      sessionStartCtx = now - target.segStart;
      pumpDecode();
    }
  } else {
    // landed in a pause — jump straight to the next passage
    playIdx = target.i;
    nextStartAt = now;
    sessionStartCtx = now - target.segStart;
    pumpDecode();
  }
  updateProgress();
}

// clickable / draggable progress bar
function fracFromEvent(e) {
  const rect = progressEl.getBoundingClientRect();
  return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
}

progressEl.addEventListener('pointerdown', e => {
  if (!soundscapeStarted || state === 'done') return;
  seeking = true;
  progressEl.setPointerCapture(e.pointerId);
  previewSeek(e);
});
progressEl.addEventListener('pointermove', e => { if (seeking) previewSeek(e); });
progressEl.addEventListener('pointerup', e => {
  if (!seeking) return;
  seeking = false;
  seekTo(fracFromEvent(e) * totalSec);
});
progressEl.addEventListener('pointercancel', () => { seeking = false; });

function previewSeek(e) {
  const frac = fracFromEvent(e);
  fillEl.style.width = (frac * 100) + '%';
  elapsedEl.textContent = fmt(frac * totalSec);
}

// keyboard seeking on the focused bar
progressEl.addEventListener('keydown', e => {
  if (!soundscapeStarted || state === 'done') return;
  const elapsed = ctx.currentTime - sessionStartCtx;
  if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(elapsed + 15); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); seekTo(elapsed - 15); }
});

// skip to the next spoken passage
skipBtn.addEventListener('click', () => {
  if (!soundscapeStarted || state === 'done') return;
  if (playIdx >= segments.length) return;
  seekTo(startOf(playIdx));
});

// ── STOP / RESET ─────────────────────────────────────────────────────────
stopBtn.addEventListener('click', resetToForm);

function resetToForm() {
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  try { if (currentSource) currentSource.stop(); } catch (e) {}
  currentSource = null;
  if (soundscape) { soundscape.stop(0.4); soundscape = null; }
  if (ctx) { ctx.close().catch(() => {}); ctx = null; }
  segments = [];
  renderedBlob = null;
  ttsBlocked = true; // abandon any in-flight fetch loops
  state = 'idle';
  playerCard.style.display = 'none';
  formCard.style.display = '';
  noteEl.textContent = '';
  formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── VOLUME + MUTE ────────────────────────────────────────────────────────
volumeEl.addEventListener('input', () => {
  if (musicMuted) setMuted(false); // moving the slider unmutes
  applyMusicVolume();
});

muteBtn.addEventListener('click', () => setMuted(!musicMuted));

function setMuted(muted) {
  musicMuted = muted;
  muteIcon.textContent = muted ? 'volume_off' : 'volume_up';
  muteBtn.setAttribute('aria-label', muted ? 'Unmute background sound' : 'Mute background sound');
  applyMusicVolume();
}

function applyMusicVolume() {
  if (ctx && musicGain) musicGain.gain.setTargetAtTime(musicVolume(), ctx.currentTime, 0.05);
}

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

// ── DOWNLOAD + SHARE ─────────────────────────────────────────────────────
function mixKey() {
  return selectedScape + '|' + musicVolume().toFixed(2);
}

function fileName() {
  const slug = (titleEl.textContent || 'meditation')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
  return (slug || 'meditation') + '.mp3';
}

async function getSessionBlob() {
  if (!segments.length || !segments.every(s => s.mp3 || s.failed) || !segments.some(s => s.mp3)) {
    throw new Error('not_ready');
  }
  const key = mixKey();
  if (renderedBlob && renderedKey === key) return renderedBlob;
  if (renderBusy) throw new Error('busy');
  renderBusy = true;
  updateReadyUI();
  try {
    const buffer = await renderSession();
    const blob = await encodeMp3Blob(buffer, p => {
      noteEl.textContent = `Creating your MP3… ${Math.round(p * 100)}%`;
    });
    renderedBlob = blob;
    renderedKey = key;
    noteEl.textContent = '';
    return blob;
  } finally {
    renderBusy = false;
    updateReadyUI();
  }
}

// Render the whole session (voice + soundscape at the chosen mix) offline.
async function renderSession() {
  noteEl.textContent = 'Creating your MP3… mixing';
  const decodeCtx = new OfflineAudioContext(1, 1, RENDER_RATE);
  const buffers = [];
  for (const seg of segments) {
    buffers.push(seg.mp3 ? await decodeMp3(decodeCtx, seg.mp3) : null);
  }

  const FADE = 4;
  let t = 0.5;
  const starts = segments.map((seg, i) => {
    const s = t;
    t += (buffers[i] ? buffers[i].duration : 0) + seg.pauseAfter;
    return s;
  });
  const total = t + FADE;

  // binaural only exists in stereo — everything else renders mono
  const channels = selectedScape === 'binaural' ? 2 : 1;
  const off = new OfflineAudioContext(channels, Math.ceil(total * RENDER_RATE), RENDER_RATE);
  const vGain = off.createGain();
  vGain.connect(off.destination);
  const dGain = off.createGain();
  dGain.gain.setValueAtTime(1, 0);
  dGain.connect(off.destination);
  const mGain = off.createGain();
  const vol = musicVolume();
  mGain.gain.setValueAtTime(vol, 0);
  mGain.gain.setValueAtTime(vol, Math.max(0, total - FADE));
  mGain.gain.linearRampToValueAtTime(0, total - 0.3);
  mGain.connect(dGain);

  const scape = Soundscapes.create(off, selectedScape, total);
  if (scape) { scape.output.connect(mGain); scape.start(); }

  segments.forEach((seg, i) => {
    if (!buffers[i]) return;
    const src = off.createBufferSource();
    src.buffer = buffers[i];
    src.connect(vGain);
    const s = starts[i], e = s + buffers[i].duration;
    src.start(s);
    if (scape && vol > 0) {
      dGain.gain.setValueAtTime(1, Math.max(0, s - 0.05));
      dGain.gain.linearRampToValueAtTime(0.7, s + 0.6);
      dGain.gain.setValueAtTime(0.7, e);
      dGain.gain.linearRampToValueAtTime(1.0, e + 1.5);
    }
  });

  return off.startRendering();
}

// Encode an AudioBuffer to MP3 with the self-hosted lamejs build, yielding to the UI.
async function encodeMp3Blob(buffer, onProgress) {
  if (typeof lamejs === 'undefined' || !lamejs.Mp3Encoder) {
    throw new Error('Encoder failed to load. Refresh the page and try again.');
  }
  const stereo = buffer.numberOfChannels === 2;
  const left = buffer.getChannelData(0);
  const right = stereo ? buffer.getChannelData(1) : null;
  const enc = new lamejs.Mp3Encoder(stereo ? 2 : 1, buffer.sampleRate, stereo ? 128 : RENDER_KBPS);
  const CHUNK = 1152 * 120; // ~3.1s of audio per slice at 44.1kHz
  const parts = [];
  const l16 = new Int16Array(CHUNK);
  const r16 = stereo ? new Int16Array(CHUNK) : null;
  const toInt16 = (v) => {
    v = Math.max(-1, Math.min(1, v));
    return v < 0 ? v * 0x8000 : v * 0x7FFF;
  };
  for (let i = 0; i < left.length; i += CHUNK) {
    const n = Math.min(CHUNK, left.length - i);
    for (let j = 0; j < n; j++) {
      l16[j] = toInt16(left[i + j]);
      if (stereo) r16[j] = toInt16(right[i + j]);
    }
    const lc = n === CHUNK ? l16 : l16.subarray(0, n);
    const d = stereo
      ? enc.encodeBuffer(lc, n === CHUNK ? r16 : r16.subarray(0, n))
      : enc.encodeBuffer(lc);
    if (d.length) parts.push(new Uint8Array(d));
    if (onProgress) onProgress(i / left.length);
    await new Promise(r => setTimeout(r, 0)); // keep the page responsive
  }
  const tail = enc.flush();
  if (tail.length) parts.push(new Uint8Array(tail));
  return new Blob(parts, { type: 'audio/mpeg' });
}

function triggerDownload(blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}

downloadBtn.addEventListener('click', async () => {
  try {
    triggerDownload(await getSessionBlob());
  } catch (e) {
    showActionError(e);
  }
});

// The share sheet only delivers files reliably on phones. Desktop WhatsApp
// silently drops files handed over by the Windows share sheet, so on desktop
// we download instead and tell the user to drag the file into a chat.
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

shareBtn.addEventListener('click', async () => {
  try {
    const blob = await getSessionBlob();
    const file = new File([blob], fileName(), { type: 'audio/mpeg' });
    if (IS_MOBILE && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: titleEl.textContent });
    } else {
      triggerDownload(blob);
      noteEl.textContent = "WhatsApp on desktop can't receive shared files, so the MP3 has been downloaded instead - drag it into any WhatsApp chat to send it.";
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return; // user closed the share sheet
    showActionError(e);
  }
});

function showActionError(e) {
  if (e && e.message === 'not_ready') {
    noteEl.textContent = 'Still loading voice passages — try again in a moment.';
  } else if (e && e.message === 'busy') {
    noteEl.textContent = 'Already creating your MP3 — one moment.';
  } else {
    noteEl.textContent = (e && e.message) || 'Could not create the MP3. Please try again.';
  }
}

// ── SOUNDSCAPES ──────────────────────────────────────────────────────────
// Uniform interface: create(ctx, type, offlineDuration?) →
//   { output, start(), tick(), stop(fadeSec) } | null
// offlineDuration is passed for OfflineAudioContext renders, where anything
// time-driven (pad chord changes) must be scheduled up front.
const Soundscapes = {
  create(audioCtx, type, offlineDuration) {
    const factories = {
      ocean:     createOcean,
      rain:      createRain,
      wind:      createWind,
      fire:      createFire,
      brown:     createBrownNoise,
      heartbeat: createHeartbeat,
      chimes:    createChimes,
      bowl:      createBowl,
      drone:     createDrone,
      pads:      createPads,
      binaural:  createBinaural,
    };
    const f = factories[type];
    return f ? f(audioCtx, offlineDuration) : null;
  },
};

// ── shared soundscape helpers ────────────────────────────────────────────

function makeNoiseBuffer(actx, seconds, type) {
  const len = Math.floor(seconds * actx.sampleRate);
  const buf = actx.createBuffer(1, len, actx.sampleRate);
  const d = buf.getChannelData(0);
  if (type === 'brown') {
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.5;
    }
  } else {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return buf;
}

// Random recurring events (droplets, chimes, bowl strikes): live mode fires
// them from tick(); offline mode schedules the whole session up front.
function makeScheduler(actx, offlineDuration, spawn, delayFn, firstDelay) {
  if (offlineDuration != null) {
    return {
      arm() {
        let t = firstDelay != null ? firstDelay : delayFn();
        while (t < offlineDuration) { spawn(t); t += delayFn(); }
      },
      tick() {},
    };
  }
  let nextAt = null;
  return {
    arm() { nextAt = actx.currentTime + (firstDelay != null ? firstDelay : delayFn()); },
    tick() {
      if (nextAt != null && actx.currentTime >= nextAt) {
        spawn(actx.currentTime + 0.02);
        nextAt = actx.currentTime + delayFn();
      }
    },
  };
}

function fadeStop(actx, output, nodes, fade) {
  output.gain.setTargetAtTime(0, actx.currentTime, fade / 3);
  setTimeout(() => { try { nodes.forEach(n => n.stop()); } catch (e) {} }, fade * 1000 + 300);
}

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

function createRain(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.9;
  const noiseBuf = makeNoiseBuffer(actx, 4, 'white');

  // steady rain hiss — brighter band than the ocean
  const hissSrc = actx.createBufferSource();
  hissSrc.buffer = noiseBuf;
  hissSrc.loop = true;
  const hp = actx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 900;
  const lp = actx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 5500;
  const hissGain = actx.createGain();
  hissGain.gain.value = 0.20;
  const lfo = actx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = actx.createGain();
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain); lfoGain.connect(hissGain.gain);
  hissSrc.connect(hp); hp.connect(lp); lp.connect(hissGain); hissGain.connect(output);

  // random soft droplet ticks through a shared resonant filter
  const dropFilter = actx.createBiquadFilter();
  dropFilter.type = 'bandpass';
  dropFilter.frequency.value = 3000;
  dropFilter.Q.value = 3;
  const dropBus = actx.createGain();
  dropBus.gain.value = 0.5;
  dropFilter.connect(dropBus); dropBus.connect(output);

  function droplet(at) {
    const src = actx.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = 0.8 + Math.random() * 0.9;
    const env = actx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.3, at + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
    src.connect(env); env.connect(dropFilter);
    src.start(at, Math.random() * 3.5, 0.09);
  }
  const sched = makeScheduler(actx, offlineDuration, droplet, () => 0.25 + Math.random() * 1.1);

  return {
    output,
    start() { hissSrc.start(); lfo.start(); sched.arm(); },
    tick() { sched.tick(); },
    stop(fade = 2) { fadeStop(actx, output, [hissSrc, lfo], fade); },
  };
}

function createWind(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.85;
  const src = actx.createBufferSource();
  src.buffer = makeNoiseBuffer(actx, 4, 'white');
  src.loop = true;
  const bp = actx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 500;
  bp.Q.value = 1.2;
  const g = actx.createGain();
  g.gain.value = 0.5;
  // two slow LFOs at unrelated rates make the wander feel irregular
  const lfo1 = actx.createOscillator(); lfo1.frequency.value = 0.05;
  const lg1 = actx.createGain(); lg1.gain.value = 250;
  const lfo2 = actx.createOscillator(); lfo2.frequency.value = 0.013;
  const lg2 = actx.createGain(); lg2.gain.value = 180;
  lfo1.connect(lg1); lg1.connect(bp.frequency);
  lfo2.connect(lg2); lg2.connect(bp.frequency);
  // gusts
  const lfoG = actx.createOscillator(); lfoG.frequency.value = 0.06;
  const lgG = actx.createGain(); lgG.gain.value = 0.18;
  lfoG.connect(lgG); lgG.connect(g.gain);
  src.connect(bp); bp.connect(g); g.connect(output);
  const nodes = [src, lfo1, lfo2, lfoG];
  return {
    output,
    start() { nodes.forEach(n => n.start()); },
    tick() {},
    stop(fade = 2) { fadeStop(actx, output, nodes, fade); },
  };
}

function createFire(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.9;

  // deep base rumble
  const base = actx.createBufferSource();
  base.buffer = makeNoiseBuffer(actx, 4, 'brown');
  base.loop = true;
  const lp = actx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;
  const baseGain = actx.createGain();
  baseGain.gain.value = 0.5;
  base.connect(lp); lp.connect(baseGain); baseGain.connect(output);

  // crackle: a sparse pre-generated pop buffer, looped twice at different
  // rates so the repetition is never audible
  const rate = actx.sampleRate;
  const cLen = Math.floor(8 * rate);
  const cBuf = actx.createBuffer(1, cLen, rate);
  const cd = cBuf.getChannelData(0);
  for (let p = 0; p < 48; p++) {
    const start = Math.floor(Math.random() * (cLen - rate * 0.05));
    const dur = Math.floor(rate * (0.003 + Math.random() * 0.02));
    for (let i = 0; i < dur; i++) {
      cd[start + i] += (Math.random() * 2 - 1) * Math.exp(-i / (dur / 5)) * 0.8;
    }
  }
  const hpC = actx.createBiquadFilter();
  hpC.type = 'highpass';
  hpC.frequency.value = 1400;
  const crackleGain = actx.createGain();
  crackleGain.gain.value = 0.35;
  hpC.connect(crackleGain); crackleGain.connect(output);
  const c1 = actx.createBufferSource(); c1.buffer = cBuf; c1.loop = true; c1.connect(hpC);
  const c2 = actx.createBufferSource(); c2.buffer = cBuf; c2.loop = true; c2.playbackRate.value = 0.73; c2.connect(hpC);

  const nodes = [base, c1, c2];
  return {
    output,
    start() { base.start(); c1.start(); c2.start(2.7); },
    tick() {},
    stop(fade = 2) { fadeStop(actx, output, nodes, fade); },
  };
}

function createBrownNoise(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.7;
  const src = actx.createBufferSource();
  src.buffer = makeNoiseBuffer(actx, 6, 'brown');
  src.loop = true;
  const lp = actx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 800;
  const lfo = actx.createOscillator();
  lfo.frequency.value = 0.03;
  const lfoGain = actx.createGain();
  lfoGain.gain.value = 0.07;
  lfo.connect(lfoGain); lfoGain.connect(output.gain);
  src.connect(lp); lp.connect(output);
  return {
    output,
    start() { src.start(); lfo.start(); },
    tick() {},
    stop(fade = 2) { fadeStop(actx, output, [src, lfo], fade); },
  };
}

function createHeartbeat(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.9;
  // one lub-dub cycle at 55bpm, written into a looped buffer
  const rate = actx.sampleRate;
  const cycle = 60 / 55;
  const buf = actx.createBuffer(1, Math.floor(cycle * rate), rate);
  const d = buf.getChannelData(0);
  function thump(atSec, amp) {
    const start = Math.floor(atSec * rate);
    const dur = Math.floor(0.15 * rate);
    for (let i = 0; i < dur && start + i < d.length; i++) {
      const t = i / rate;
      d[start + i] += Math.sin(2 * Math.PI * 52 * t) * Math.exp(-t / 0.045) * amp;
    }
  }
  thump(0, 0.9);
  thump(0.32, 0.6);
  const src = actx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = actx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 160;
  src.connect(lp); lp.connect(output);
  return {
    output,
    start() { src.start(); },
    tick() {},
    stop(fade = 2) { fadeStop(actx, output, [src], fade); },
  };
}

function createChimes(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.8;
  // A major pentatonic, mid register
  const NOTES = [220.00, 246.94, 277.18, 329.63, 369.99, 440.00];

  function strike(at) {
    const f = NOTES[Math.floor(Math.random() * NOTES.length)];
    const decay = 5 + Math.random() * 3;
    [[f, 0.10], [f * 1.003, 0.08], [f * 2.76, 0.02]].forEach(([freq, amp], i) => {
      const o = actx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      const g = actx.createGain();
      const dec = i === 2 ? decay * 0.4 : decay;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(amp, at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dec);
      o.connect(g); g.connect(output);
      o.start(at);
      o.stop(at + dec + 0.5);
    });
  }
  const sched = makeScheduler(actx, offlineDuration, strike, () => 3.5 + Math.random() * 8, 2);

  return {
    output,
    start() { sched.arm(); },
    tick() { sched.tick(); },
    stop(fade = 2) { output.gain.setTargetAtTime(0, actx.currentTime, fade / 3); },
  };
}

function createBowl(actx, offlineDuration) {
  const output = actx.createGain();
  output.gain.value = 0.85;

  // very quiet drone cushion under the strikes
  const lp = actx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 300;
  lp.connect(output);
  const d1 = actx.createOscillator(); d1.type = 'sine'; d1.frequency.value = 82.41;
  const d2 = actx.createOscillator(); d2.type = 'sine'; d2.frequency.value = 82.41; d2.detune.value = 7;
  const dg = actx.createGain(); dg.gain.value = 0.05;
  d1.connect(dg); d2.connect(dg); dg.connect(lp);

  const FUNDAMENTALS = [174.61, 196.00, 220.00];

  function strike(at) {
    const f = FUNDAMENTALS[Math.floor(Math.random() * FUNDAMENTALS.length)];
    // real bowls ring at inharmonic partials with slow beating
    [[1, 0.12, 16], [2.77, 0.045, 10], [5.18, 0.02, 6]].forEach(([ratio, amp, decay]) => {
      [-1.2, 1.2].forEach(det => {
        const o = actx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f * ratio + det;
        const g = actx.createGain();
        g.gain.setValueAtTime(0.0001, at);
        g.gain.linearRampToValueAtTime(amp / 2, at + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
        o.connect(g); g.connect(output);
        o.start(at);
        o.stop(at + decay + 0.5);
      });
    });
  }
  const sched = makeScheduler(actx, offlineDuration, strike, () => 28 + Math.random() * 25, 2);

  return {
    output,
    start() { d1.start(); d2.start(); sched.arm(); },
    tick() { sched.tick(); },
    stop(fade = 2) { fadeStop(actx, output, [d1, d2], fade); },
  };
}

function createBinaural(actx, offlineDuration) {
  // 200Hz left / 204Hz right — a 4Hz offset, kept quiet. Needs headphones;
  // in mono the two tones collapse into a gentle 4Hz pulse instead.
  const output = actx.createGain();
  output.gain.value = 0.5;
  const merger = actx.createChannelMerger(2);
  merger.connect(output);
  const l = actx.createOscillator(); l.type = 'sine'; l.frequency.value = 200;
  const r = actx.createOscillator(); r.type = 'sine'; r.frequency.value = 204;
  const gl = actx.createGain(); gl.gain.value = 0.16;
  const gr = actx.createGain(); gr.gain.value = 0.16;
  l.connect(gl); gl.connect(merger, 0, 0);
  r.connect(gr); gr.connect(merger, 0, 1);
  // slow breathing so the tone doesn't feel clinical
  const lfo = actx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = actx.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain); lfoGain.connect(output.gain);
  const nodes = [l, r, lfo];
  return {
    output,
    start() { nodes.forEach(n => n.start()); },
    tick() {},
    stop(fade = 2) { fadeStop(actx, output, nodes, fade); },
  };
}

function createPads(actx, offlineDuration) {
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

  function chordVoices(freqs, at, holdEnd) {
    return freqs.map(f => {
      const o = actx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = actx.createGain();
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.12, at + 5); // slow attack
      if (holdEnd != null) {
        g.gain.setValueAtTime(0.12, holdEnd);
        g.gain.linearRampToValueAtTime(0, holdEnd + 7);
      }
      o.connect(g); g.connect(filter);
      o.start(at);
      if (holdEnd != null) o.stop(holdEnd + 7.2);
      return { o, g };
    });
  }

  if (offlineDuration != null) {
    // offline render: schedule every chord change up front
    return {
      output,
      start() {
        lfo.start();
        for (let tm = 0, c = 0; tm < offlineDuration; tm += CHORD_HOLD, c++) {
          chordVoices(CHORDS[c % CHORDS.length], tm, Math.min(tm + CHORD_HOLD, offlineDuration));
        }
      },
      tick() {},
      stop() {},
    };
  }

  let chordIdx = 0, nextChordAt = 0, current = [];

  function playChord(freqs) {
    const t = actx.currentTime;
    current.forEach(v => {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setValueAtTime(v.g.gain.value, t);
      v.g.gain.linearRampToValueAtTime(0, t + 7); // release overlaps next attack
      try { v.o.stop(t + 7.2); } catch (e) {}
    });
    current = chordVoices(freqs, t, null);
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
