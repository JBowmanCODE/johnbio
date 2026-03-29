const WORKER_URL = 'https://tts-worker.ukjbowman.workers.dev';

const input    = document.getElementById('tts-input');
const charNum  = document.getElementById('tts-char-num');
const charWrap = charNum.parentElement;
const btn      = document.getElementById('tts-btn');
const btnLabel = document.getElementById('tts-btn-label');
const outputWrap = document.getElementById('tts-output-wrap');
const player   = document.getElementById('tts-player');
const dlLink   = document.getElementById('tts-download');
const errorEl  = document.getElementById('tts-error');

// Character counter
input.addEventListener('input', () => {
  const len = input.value.length;
  charNum.textContent = len.toLocaleString();
  charWrap.classList.toggle('near-limit', len > 3500 && len <= 4000);
  charWrap.classList.toggle('at-limit', len >= 4000);
});

// Convert
btn.addEventListener('click', async () => {
  const text  = input.value.trim();
  const voice = document.getElementById('tts-voice').value;
  const speed = parseFloat(document.getElementById('tts-speed').value);

  hideError();
  outputWrap.hidden = true;

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
      // Try to parse JSON error from worker
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      throw new Error(`Request failed (${res.status})`);
    }

    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);

    player.src = url;
    dlLink.href = url;
    dlLink.download = `speech-${voice}-${Date.now()}.mp3`;
    outputWrap.hidden = false;
    player.focus();

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

function setLoading(on) {
  btn.disabled = on;
  if (on) {
    btn.innerHTML = '<span class="tts-spinner" aria-hidden="true"></span><span>Generating...</span>';
  } else {
    btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">graphic_eq</span><span>Convert to Speech</span>';
  }
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = '';
}
