const WORKER_URL = 'https://tts-worker.ukjbowman.workers.dev';

const input        = document.getElementById('tts-input');
const charNum      = document.getElementById('tts-char-num');
const charWrap     = charNum.parentElement;
const btn          = document.getElementById('tts-btn');
const outputWrap   = document.getElementById('tts-output-wrap');
const player       = document.getElementById('tts-player');
const playBtn      = document.getElementById('tts-play-btn');
const playIcon     = playBtn.querySelector('.material-symbols-outlined');
const progressWrap = document.getElementById('tts-progress-wrap');
const progressFill = document.getElementById('tts-progress-fill');
const progressThumb= document.getElementById('tts-progress-thumb');
const currentTimeEl= document.getElementById('tts-current-time');
const durationEl   = document.getElementById('tts-duration');
const dlLink       = document.getElementById('tts-download');
const shareBtn     = document.getElementById('tts-share-btn');
const errorEl      = document.getElementById('tts-error');

let audioBlob = null;

// ── Character counter ──────────────────────────────────────────────────────
input.addEventListener('input', () => {
  const len = input.value.length;
  charNum.textContent = len.toLocaleString();
  charWrap.classList.toggle('near-limit', len > 3500 && len <= 4000);
  charWrap.classList.toggle('at-limit', len >= 4000);
});

// ── Convert ────────────────────────────────────────────────────────────────
btn.addEventListener('click', async () => {
  const text  = input.value.trim();
  const voice = document.getElementById('tts-voice').value;
  const speed = parseFloat(document.getElementById('tts-speed').value);

  hideError();
  outputWrap.hidden = true;
  audioBlob = null;

  if (!text) {
    showError('Please enter some text to convert.');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed }),
    });

    if (!res.ok) {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      throw new Error(`Request failed (${res.status})`);
    }

    if (player.src && player.src.startsWith('blob:')) URL.revokeObjectURL(player.src);
    audioBlob = await res.blob();
    const url = URL.createObjectURL(audioBlob);

    player.src = url;
    dlLink.href = url;
    dlLink.download = `speech-${voice}-${Date.now()}.mp3`;
    outputWrap.hidden = false;

    // Reset player UI
    progressFill.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    playIcon.textContent = 'play_arrow';
    playBtn.setAttribute('aria-label', 'Play audio');

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

// ── Custom player ──────────────────────────────────────────────────────────
function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
}

player.addEventListener('loadedmetadata', () => {
  durationEl.textContent = fmt(player.duration);
});

player.addEventListener('timeupdate', () => {
  if (!player.duration) return;
  const pct = (player.currentTime / player.duration) * 100;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  progressWrap.setAttribute('aria-valuenow', Math.round(pct));
  currentTimeEl.textContent = fmt(player.currentTime);
});

player.addEventListener('ended', () => {
  playIcon.textContent = 'play_arrow';
  playBtn.setAttribute('aria-label', 'Play audio');
});

playBtn.addEventListener('click', () => {
  if (player.paused) {
    player.play();
    playIcon.textContent = 'pause';
    playBtn.setAttribute('aria-label', 'Pause audio');
  } else {
    player.pause();
    playIcon.textContent = 'play_arrow';
    playBtn.setAttribute('aria-label', 'Play audio');
  }
});

// Click to scrub
progressWrap.addEventListener('click', e => {
  if (!player.duration) return;
  const rect = progressWrap.getBoundingClientRect();
  player.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * player.duration;
});

// Drag to scrub
let dragging = false;
progressWrap.addEventListener('mousedown', () => { dragging = true; });
document.addEventListener('mousemove', e => {
  if (!dragging || !player.duration) return;
  const rect = progressWrap.getBoundingClientRect();
  player.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * player.duration;
});
document.addEventListener('mouseup', () => { dragging = false; });

progressWrap.addEventListener('touchmove', e => {
  if (!player.duration) return;
  const rect = progressWrap.getBoundingClientRect();
  player.currentTime = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width)) * player.duration;
}, { passive: true });

// ── WhatsApp share ─────────────────────────────────────────────────────────
shareBtn.addEventListener('click', async () => {
  if (!audioBlob) return;

  const file = new File([audioBlob], 'voice-message.mp3', { type: 'audio/mpeg' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Voice Message' });
    } catch (err) {
      if (err.name !== 'AbortError') showError('Share failed. Try downloading the MP3 instead.');
    }
  } else {
    showError('Direct sharing is not supported in this browser. Download the MP3 and attach it manually in WhatsApp.');
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────
function setLoading(on) {
  btn.disabled = on;
  btn.innerHTML = on
    ? '<span class="tts-spinner" aria-hidden="true"></span><span>Generating...</span>'
    : '<span class="material-symbols-outlined" aria-hidden="true">graphic_eq</span><span>Convert to Speech</span>';
}

function showError(msg) {
  const linkedIn = 'https://www.linkedin.com/in/john-bowman/';
  if (msg.includes(linkedIn)) {
    const parts = msg.split(linkedIn);
    errorEl.innerHTML = '';
    errorEl.appendChild(document.createTextNode(parts[0]));
    const a = document.createElement('a');
    a.href = linkedIn;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'LinkedIn';
    a.style.color = 'inherit';
    a.style.textDecoration = 'underline';
    errorEl.appendChild(a);
    if (parts[1]) errorEl.appendChild(document.createTextNode(parts[1]));
  } else {
    errorEl.textContent = msg;
  }
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = '';
}
