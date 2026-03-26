document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const wordCountElement = document.getElementById('wordCount');
    const readTimeElement = document.getElementById('readTime');
    const listenTimeElement = document.getElementById('listenTime');
    const timeRemainingElement = document.getElementById('timeRemaining');
    const subtitleDisplay = document.getElementById('subtitleDisplay');
    const voiceSelection = document.getElementById('voiceSelection');
    const speedControl = document.getElementById('speedControl');
    const startSpeechButton = document.getElementById('startSpeech');
    const pauseSpeechButton = document.getElementById('pauseSpeech');
    const stopSpeechButton = document.getElementById('stopSpeech');

    let speed = parseFloat(speedControl.value);
    let voices = [];
    let isPaused = false;
    let isSpeaking = false;
    let currentUtterance = null;
    let pauseStartTime = 0;

    // Time tracking
    let totalEstimatedTime = 0;
    let startTime = 0;
    let remainingTimeInterval;

    // Sentence tracking
    let sentences = [];
    let currentSentenceIndex = 0;
    let currentWords = [];
    let currentWordIdx = 0;

    // Self-calibrating WPM — starts at 175, adjusts after each sentence
    let estimatedWPM = 175;
    let sentenceStartTime = 0;
    let trackInterval = null;

    function sentenceDurationMs(wordCount) {
        return (wordCount / (estimatedWPM * speed)) * 60 * 1000;
    }

    // ── VOICES ──────────────────────────────────────────────────────────────
    function loadVoices() {
        const raw = speechSynthesis.getVoices();
        if (raw.length === 0) { setTimeout(loadVoices, 100); return; }

        const google = raw.filter(v => v.name.startsWith('Google'));
        voices = google.length > 0 ? google : raw;

        let def = voices.findIndex(v => v.name === 'Google US English');
        if (def === -1) def = voices.findIndex(v => v.lang === 'en-US');
        if (def === -1) def = voices.findIndex(v => v.lang.startsWith('en'));
        if (def === -1) def = 0;

        voiceSelection.innerHTML = voices
            .map((v, i) => `<option value="${i}" ${i === def ? 'selected' : ''}>${v.name} (${v.lang})</option>`)
            .join('');
        startSpeechButton.disabled = false;
    }
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // Trigger word count / estimate for preloaded text
    textInput.dispatchEvent(new Event('input'));

    // ── WORD COUNT / ESTIMATE ────────────────────────────────────────────────
    textInput.addEventListener('input', function() {
        const words = textInput.value.trim().split(/\s+/).filter(w => w.length > 0);
        wordCountElement.textContent = `Words: ${words.length}`;
        updateEstimate(words.length);
    });

    function formatTime(secs) {
        const m = Math.floor(secs / 60), s = Math.round(secs % 60);
        return `${m > 0 ? m + 'm ' : ''}${s}s`;
    }

    function updateEstimate(wordCount) {
        const listenSecs = (wordCount / (estimatedWPM * speed)) * 60;
        totalEstimatedTime = listenSecs;
        const readSecs = (wordCount / 238) * 60; // avg adult reading speed
        readTimeElement.textContent = `Read: ${formatTime(readSecs)}`;
        listenTimeElement.textContent = `Listen: ${formatTime(listenSecs)}`;
    }

    speedControl.addEventListener('change', function() {
        speed = parseFloat(speedControl.value);
        const words = textInput.value.trim().split(/\s+/).filter(w => w.length > 0);
        updateEstimate(words.length);
    });

    // ── TRACKING LOOP ────────────────────────────────────────────────────────
    // Polls every 50ms and advances highlight based on elapsed time vs
    // estimated sentence duration. onboundary recalibrates the clock.
    function startTracking(durationMs) {
        stopTracking();
        trackInterval = setInterval(function() {
            if (!isSpeaking || isPaused) return;
            const elapsed = Date.now() - sentenceStartTime;
            const fraction = Math.min(elapsed / durationMs, 1);
            const idx = Math.min(Math.floor(fraction * currentWords.length), currentWords.length - 1);
            if (idx !== currentWordIdx) {
                currentWordIdx = idx;
                renderSubtitle(currentWords, idx);
            }
        }, 50);
    }

    function stopTracking() {
        clearInterval(trackInterval);
        trackInterval = null;
    }

    // ── START ────────────────────────────────────────────────────────────────
    startSpeechButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        if (!text) return;

        if (isSpeaking) {
            speechSynthesis.cancel();
            resetDisplay();
            return;
        }

        sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
        sentences = sentences.map(s => s.trim()).filter(s => s.length > 0);
        if (sentences.length === 0) return;

        isSpeaking = true;
        isPaused = false;
        currentSentenceIndex = 0;
        pauseSpeechButton.textContent = 'Pause';
        startTime = Date.now();

        speakNextSentence();
        remainingTimeInterval = setInterval(updateTimeRemaining, 500);
        updateTimeRemaining();
    });

    function speakNextSentence() {
        if (currentSentenceIndex >= sentences.length) {
            resetDisplay();
            return;
        }

        const sentence = sentences[currentSentenceIndex];
        currentWords = sentence.split(/\s+/).filter(w => w.length > 0);
        currentWordIdx = 0;

        currentUtterance = new SpeechSynthesisUtterance(sentence);
        currentUtterance.rate = speed;
        currentUtterance.voice = voices[parseInt(voiceSelection.value)];

        const durationMs = sentenceDurationMs(currentWords.length);

        currentUtterance.onstart = function() {
            sentenceStartTime = Date.now();
            renderSubtitle(currentWords, 0);
            startTracking(durationMs);
        };

        // onboundary recalibrates sentenceStartTime so elapsed-time tracking corrects drift
        currentUtterance.onboundary = function(event) {
            if (event.name !== 'word') return;
            let pos = 0;
            for (let i = 0; i < currentWords.length; i++) {
                if (pos + currentWords[i].length > event.charIndex) {
                    if (i > 0) {
                        // Recalculate sentenceStartTime based on actual position
                        const expectedElapsed = (i / currentWords.length) * durationMs;
                        sentenceStartTime = Date.now() - expectedElapsed;
                    }
                    currentWordIdx = i;
                    renderSubtitle(currentWords, i);
                    return;
                }
                pos += currentWords[i].length + 1;
            }
        };

        currentUtterance.onend = function() {
            stopTracking();
            if (!isPaused) {
                // Self-calibrate: measure actual sentence duration and update WPM estimate
                const actualMs = Date.now() - sentenceStartTime;
                if (actualMs > 200 && currentWords.length > 1) {
                    const actualWPM = (currentWords.length / actualMs) * 60 * 1000;
                    // Blend 40% old estimate, 60% new measurement
                    estimatedWPM = estimatedWPM * 0.4 + actualWPM * 0.6;
                }
                currentSentenceIndex++;
                speakNextSentence();
            }
        };

        currentUtterance.onerror = function(e) {
            if (e.error !== 'interrupted') console.error('Speech error:', e.error);
        };

        speechSynthesis.speak(currentUtterance);
    }

    // ── PAUSE / RESUME ───────────────────────────────────────────────────────
    pauseSpeechButton.addEventListener('click', function() {
        if (!isSpeaking) return;
        if (!isPaused) {
            speechSynthesis.pause();
            isPaused = true;
            pauseSpeechButton.textContent = 'Resume';
            clearInterval(remainingTimeInterval);
            stopTracking();
            pauseStartTime = Date.now();
        } else {
            speechSynthesis.resume();
            isPaused = false;
            pauseSpeechButton.textContent = 'Pause';
            // Shift sentenceStartTime forward by pause duration
            const pauseDuration = Date.now() - pauseStartTime;
            sentenceStartTime += pauseDuration;
            startTime += pauseDuration;
            const durationMs = sentenceDurationMs(currentWords.length);
            remainingTimeInterval = setInterval(updateTimeRemaining, 500);
            startTracking(durationMs);
        }
    });

    // ── STOP ─────────────────────────────────────────────────────────────────
    stopSpeechButton.addEventListener('click', function() {
        if (isSpeaking) { speechSynthesis.cancel(); resetDisplay(); }
    });

    // ── SUBTITLE RENDER ──────────────────────────────────────────────────────
    function renderSubtitle(words, idx) {
        const before = words.slice(0, idx).join(' ');
        const current = words[idx];
        const after = words.slice(idx + 1).join(' ');
        subtitleDisplay.innerHTML =
            (before ? before + ' ' : '') +
            `<span class="highlight">${current}</span>` +
            (after ? ' ' + after : '');
    }

    // ── RESET ────────────────────────────────────────────────────────────────
    function resetDisplay() {
        subtitleDisplay.innerHTML = '';
        isSpeaking = false;
        isPaused = false;
        pauseSpeechButton.textContent = 'Pause';
        clearInterval(remainingTimeInterval);
        stopTracking();
        timeRemainingElement.textContent = '';
    }

    // ── TIME REMAINING ───────────────────────────────────────────────────────
    function updateTimeRemaining() {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, totalEstimatedTime - elapsed);
        const m = Math.floor(remaining / 60), s = Math.round(remaining % 60);
        timeRemainingElement.textContent = `Time remaining: ${m > 0 ? m + 'm ' : ''}${s}s`;
    }
});
