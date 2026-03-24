// michael-scott.js

const WORKER_URL = 'https://michael-scott-api.ukjbowman.workers.dev/';

document.addEventListener('DOMContentLoaded', () => {
    const input       = document.getElementById('ms-input');
    const searchBtn   = document.getElementById('ms-search-btn');
    const chips       = document.querySelectorAll('.ms-chip');
    const resultEl    = document.getElementById('ms-result');
    const emptyEl     = document.getElementById('ms-empty');
    const loadingEl   = document.getElementById('ms-loading');
    const errorEl     = document.getElementById('ms-error');
    const errorText   = document.getElementById('ms-error-text');
    const iframe      = document.getElementById('ms-iframe');
    const videoLabel  = document.getElementById('ms-video-label');
    const tryAnother  = document.getElementById('ms-try-another');

    let currentWord   = '';
    let currentOffset = 0;

    // ── Chip clicks ──
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            input.value = chip.dataset.word;
            currentWord = chip.dataset.word;
            currentOffset = 0;
            doSearch();
        });
    });

    // ── Search button click ──
    searchBtn.addEventListener('click', () => {
        const word = input.value.trim();
        if (!word) return;
        chips.forEach(c => c.classList.remove('active'));
        currentWord = word;
        currentOffset = 0;
        doSearch();
    });

    // ── Enter key ──
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') searchBtn.click();
    });

    // ── Try another ──
    tryAnother.addEventListener('click', () => {
        currentOffset++;
        doSearch();
    });

    async function doSearch() {
        if (!currentWord) return;

        setState('loading');

        try {
            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: currentWord, offset: currentOffset })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Request failed (${res.status})`);
            }

            const data = await res.json();

            if (!data.videoId) {
                throw new Error('No video found. Try a different word.');
            }

            iframe.src = `https://www.youtube-nocookie.com/embed/${data.videoId}?autoplay=1&rel=0`;
            videoLabel.textContent = data.title || `Michael Scott — ${currentWord}`;
            setState('result');

        } catch (err) {
            errorText.textContent = err.message || 'Something went wrong. Please try again.';
            setState('error');
        }
    }

    function setState(state) {
        emptyEl.hidden   = state !== 'empty';
        loadingEl.hidden = state !== 'loading';
        errorEl.hidden   = state !== 'error';
        resultEl.hidden  = state !== 'result';

        searchBtn.disabled = state === 'loading';

        if (state !== 'result') {
            iframe.src = '';
        }
    }
});
