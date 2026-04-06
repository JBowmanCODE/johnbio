// news-article.js — shared JS for course lesson pages and news articles
// Powers: lesson audio player, podcast player, TOC scroll spy, back-to-top

(function () {
  'use strict';

  // ── TOC scroll spy ──────────────────────────────────────────────
  const headings = document.querySelectorAll('.na-body h2[id]');
  const tocLinks = document.querySelectorAll('.na-toc-list a');
  if (headings.length && tocLinks.length) {
    const map = {};
    tocLinks.forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
    function onScroll() {
      let active = headings[0].id;
      headings.forEach(h => {
        if (h.getBoundingClientRect().top <= 120) active = h.id;
      });
      tocLinks.forEach(a => a.classList.remove('active'));
      if (map[active]) map[active].classList.add('active');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Back to top ─────────────────────────────────────────────────
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Lesson audio player ─────────────────────────────────────────
  const player = document.getElementById('na-player');
  if (player) {
    const playBtn      = document.getElementById('na-play-btn');
    const playIcon     = playBtn ? playBtn.querySelector('.material-symbols-outlined') : null;
    const skipBack     = document.getElementById('na-skip-back');
    const skipFwd      = document.getElementById('na-skip-fwd');
    const speedBtns    = document.querySelectorAll('.na-speed-btn');
    const progressBar  = document.getElementById('na-progress');
    const progressFill = document.getElementById('na-progress-fill');
    const progressThumb= document.getElementById('na-progress-thumb');
    const currentTime  = document.getElementById('na-current-time');
    const durationEl   = document.getElementById('na-duration');
    const waveCanvas   = document.getElementById('na-waveform');
    const muteBtn      = document.getElementById('na-mute-btn');
    const volSlider    = document.getElementById('na-volume-slider');

    let audioCtx, analyser, source, waveRaf;
    let lastVol = 1;

    function fmt(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + String(sec).padStart(2, '0');
    }

    if (muteBtn && volSlider) {
      const muteIcon = muteBtn.querySelector('.material-symbols-outlined');
      muteBtn.addEventListener('click', () => {
        if (player.volume > 0) {
          lastVol = player.volume;
          player.volume = 0;
          volSlider.value = 0;
          if (muteIcon) muteIcon.textContent = 'volume_off';
        } else {
          player.volume = lastVol || 1;
          volSlider.value = player.volume;
          if (muteIcon) muteIcon.textContent = player.volume < 0.5 ? 'volume_down' : 'volume_up';
        }
      });
      volSlider.addEventListener('input', () => {
        player.volume = parseFloat(volSlider.value);
        if (muteIcon) {
          muteIcon.textContent = player.volume === 0 ? 'volume_off'
            : player.volume < 0.5 ? 'volume_down' : 'volume_up';
        }
      });
    }

    function initAudio() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source = audioCtx.createMediaElementSource(player);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    function drawWave() {
      if (!waveCanvas) return;
      waveRaf = requestAnimationFrame(drawWave);
      const waveCtx = waveCanvas.getContext('2d');
      const w = waveCanvas.offsetWidth;
      if (waveCanvas.width !== w) waveCanvas.width = w;
      const h = waveCanvas.height;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(buf);
      waveCtx.clearRect(0, 0, w, h);
      const barW = 3, gap = 2, total = barW + gap;
      const bars = Math.floor(w / total);
      const usableBins = Math.floor(buf.length * 0.6);
      for (let i = 0; i < bars; i++) {
        const binIdx = Math.floor((i / bars) * usableBins);
        const val = buf[binIdx] / 255;
        const barH = Math.max(3, val * h);
        const x = i * total;
        const y = (h - barH) / 2;
        waveCtx.fillStyle = `rgba(251,191,36,${0.5 + val * 0.5})`;
        waveCtx.beginPath();
        waveCtx.roundRect(x, y, barW, barH, 1.5);
        waveCtx.fill();
      }
    }

    function stopWave() {
      if (waveRaf) cancelAnimationFrame(waveRaf);
      if (waveCanvas) {
        const waveCtx = waveCanvas.getContext('2d');
        waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
      }
    }

    function updateProgress() {
      if (!player.duration) return;
      const pct = (player.currentTime / player.duration) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      if (progressThumb) progressThumb.style.left = pct + '%';
      if (progressBar) progressBar.setAttribute('aria-valuenow', Math.round(pct));
      if (currentTime) currentTime.textContent = fmt(player.currentTime);
    }

    player.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = fmt(player.duration);
    });
    player.addEventListener('timeupdate', updateProgress);
    player.addEventListener('ended', () => {
      if (playIcon) playIcon.textContent = 'play_arrow';
      if (playBtn) playBtn.setAttribute('aria-label', 'Play audio');
      stopWave();
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (!player.src) return;
        if (player.paused) {
          initAudio();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          player.play();
          if (playIcon) playIcon.textContent = 'pause';
          playBtn.setAttribute('aria-label', 'Pause audio');
          drawWave();
        } else {
          player.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
          playBtn.setAttribute('aria-label', 'Play audio');
          stopWave();
        }
      });
    }

    if (skipBack) skipBack.addEventListener('click', () => { player.currentTime = Math.max(0, player.currentTime - 10); });
    if (skipFwd)  skipFwd.addEventListener('click',  () => { player.currentTime = Math.min(player.duration || 0, player.currentTime + 10); });

    if (progressBar) {
      progressBar.addEventListener('click', e => {
        if (!player.duration) return;
        const rect = progressBar.getBoundingClientRect();
        player.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * player.duration;
      });
      let dragging = false;
      progressBar.addEventListener('mousedown', () => { dragging = true; });
      document.addEventListener('mousemove', e => {
        if (!dragging || !player.duration) return;
        const rect = progressBar.getBoundingClientRect();
        player.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * player.duration;
      });
      document.addEventListener('mouseup', () => { dragging = false; });
      progressBar.addEventListener('touchmove', e => {
        if (!player.duration) return;
        const rect = progressBar.getBoundingClientRect();
        player.currentTime = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width)) * player.duration;
      }, { passive: true });
    }

    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        player.playbackRate = parseFloat(btn.dataset.speed);
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // ── Podcast player ──────────────────────────────────────────────
  const podAudio = document.getElementById('na-podcast-audio');
  if (podAudio) {
    const podSrc = podAudio.getAttribute('data-src');

    const playBtn  = document.getElementById('na-pod-play');
    const playIco  = document.getElementById('na-pod-play-icon');
    const progress = document.getElementById('na-pod-progress');
    const current  = document.getElementById('na-pod-current');
    const durEl    = document.getElementById('na-pod-duration');
    const backBtn  = document.getElementById('na-pod-back');
    const fwdBtn   = document.getElementById('na-pod-fwd');
    const muteBtn  = document.getElementById('na-pod-mute');
    const muteIco  = document.getElementById('na-pod-mute-icon');
    const volSldr  = document.getElementById('na-pod-vol');

    let podLoaded = false;

    function loadPodAudio() {
      if (!podLoaded && podSrc) {
        podAudio.src = podSrc;
        podAudio.load();
        podLoaded = true;
      }
    }

    function fmt(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    podAudio.addEventListener('loadedmetadata', () => {
      if (progress) progress.max = podAudio.duration;
      if (durEl) durEl.textContent = fmt(podAudio.duration);
    });
    podAudio.addEventListener('timeupdate', () => {
      if (progress) progress.value = podAudio.currentTime;
      if (current) current.textContent = fmt(podAudio.currentTime);
    });
    podAudio.addEventListener('ended', () => {
      if (playIco) playIco.textContent = 'play_arrow';
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (!podSrc) return;
        loadPodAudio();
        if (podAudio.paused) {
          podAudio.play().then(() => {
            if (playIco) playIco.textContent = 'pause';
          }).catch(() => {
            if (playIco) playIco.textContent = 'play_arrow';
          });
        } else {
          podAudio.pause();
          if (playIco) playIco.textContent = 'play_arrow';
        }
      });
    }

    if (progress) progress.addEventListener('input', () => { podAudio.currentTime = progress.value; });
    if (backBtn) backBtn.addEventListener('click', () => { podAudio.currentTime = Math.max(0, podAudio.currentTime - 15); });
    if (fwdBtn)  fwdBtn.addEventListener('click',  () => { podAudio.currentTime = Math.min(podAudio.duration || 0, podAudio.currentTime + 15); });

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        podAudio.muted = !podAudio.muted;
        if (muteIco) muteIco.textContent = podAudio.muted ? 'volume_off' : 'volume_up';
      });
    }
    if (volSldr) volSldr.addEventListener('input', () => { podAudio.volume = volSldr.value; });
  }

})();

// ── Course navigation sidebar ───────────────────────────────────
(function () {
  const nav = document.getElementById('lp-sidebar-nav');
  if (!nav || typeof COURSE_UNITS === 'undefined') return;

  const slug = document.body.getAttribute('data-slug');
  if (!slug) return;

  // Find which unit and lesson index this page is
  let currentUnit = null, currentLesson = null, currentLessonIdx = -1;
  for (const unit of COURSE_UNITS) {
    const idx = unit.lessons.findIndex(l => l.slug === slug);
    if (idx !== -1) {
      currentUnit = unit;
      currentLesson = unit.lessons[idx];
      currentLessonIdx = idx;
      break;
    }
  }
  if (!currentUnit) return;

  // Next unit (if this is the last lesson in the unit)
  const isLastInUnit = currentLessonIdx === currentUnit.lessons.length - 1;
  const unitIdx = COURSE_UNITS.indexOf(currentUnit);
  const nextUnit = isLastInUnit && unitIdx < COURSE_UNITS.length - 1
    ? COURSE_UNITS[unitIdx + 1] : null;

  // Build HTML
  let html = `
    <p class="lp-sidebar-nav-title">Course navigation</p>
    <a class="lp-sidebar-nav-link" href="/course">
      <span class="material-symbols-outlined" aria-hidden="true">dashboard</span>My dashboard
    </a>
    <hr class="lp-unit-sep">
    <p class="lp-sidebar-nav-title" style="margin-bottom:0.5rem">
      Unit ${currentUnit.id} &mdash; ${currentUnit.title}
    </p>
    <ul class="lp-unit-lessons">`;

  for (const lesson of currentUnit.lessons) {
    const isCurrent = lesson.slug === slug;
    html += `<li class="${isCurrent ? 'lp-lesson-current' : ''}">
      <a href="/course/${lesson.slug}">${lesson.title.replace(/ [—–] .*$/, '')}</a>
    </li>`;
  }

  html += `</ul>`;

  if (nextUnit) {
    const firstSlug = nextUnit.lessons[0].slug;
    html += `
    <hr class="lp-unit-sep">
    <a class="lp-next-unit" href="/course/${firstSlug}">
      <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      <div>
        <span class="lp-next-unit-label">Next unit</span>
        Unit ${nextUnit.id}: ${nextUnit.title}
      </div>
    </a>`;
  }

  html += `
    <hr class="lp-unit-sep">
    <a class="lp-sidebar-nav-link" href="/exam">
      <span class="material-symbols-outlined" aria-hidden="true">quiz</span>Final exam
    </a>`;

  nav.innerHTML = html;
})();

// ── Lesson prev/next navigation ────────────────────────────────
(function () {
  const nav = document.getElementById('lp-lesson-nav');
  if (!nav || typeof COURSE_UNITS === 'undefined') return;

  const slug = document.body.getAttribute('data-slug');
  if (!slug) return;

  // Build flat ordered lesson list from all units
  const allLessons = [];
  for (const unit of COURSE_UNITS) {
    for (const lesson of unit.lessons) {
      allLessons.push(lesson);
    }
  }

  const idx = allLessons.findIndex(l => l.slug === slug);
  if (idx === -1) return;

  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const isLast = idx === allLessons.length - 1;

  function shortTitle(t) {
    // Strip subtitle after em-dash or long dash
    return t.replace(/\s+[—–\-]{1,2}\s+.*$/, '').trim();
  }

  let html = '';

  // Left button: previous lesson or back to dashboard
  if (prev) {
    html += `<a class="lp-nav-btn" href="/course/${prev.slug}">
      <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      <div>
        <span class="lp-nav-label">Previous lesson</span>
        <span class="lp-nav-title">${shortTitle(prev.title)}</span>
      </div>
    </a>`;
  } else {
    html += `<a class="lp-nav-btn" href="/course">
      <span class="material-symbols-outlined" aria-hidden="true">dashboard</span>
      <div>
        <span class="lp-nav-label">Back to</span>
        <span class="lp-nav-title">Course dashboard</span>
      </div>
    </a>`;
  }

  // Right button: next lesson or final exam
  if (next) {
    html += `<a class="lp-nav-btn next" href="/course/${next.slug}">
      <div>
        <span class="lp-nav-label">Next lesson</span>
        <span class="lp-nav-title">${shortTitle(next.title)}</span>
      </div>
      <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
    </a>`;
  } else if (isLast) {
    html += `<a class="lp-nav-btn next lp-nav-exam" href="/exam">
      <div>
        <span class="lp-nav-label">You've finished the course</span>
        <span class="lp-nav-title">Take the final exam</span>
      </div>
      <span class="material-symbols-outlined" aria-hidden="true">quiz</span>
    </a>`;
  }

  nav.innerHTML = html;
})();

// ── Quiz interaction ────────────────────────────────────────────
document.querySelectorAll('.lp-quiz-option').forEach(btn => {
  btn.addEventListener('click', function() {
    const q = this.dataset.q;
    document.querySelectorAll(`.lp-quiz-option[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    const checkBtn = document.querySelector(`.lp-quiz-check[data-q="${q}"]`);
    if (checkBtn) checkBtn.disabled = false;
  });
});
document.querySelectorAll('.lp-quiz-check').forEach(btn => {
  btn.addEventListener('click', function() {
    const q = this.dataset.q;
    const answer = this.dataset.answer;
    const selected = document.querySelector(`.lp-quiz-option[data-q="${q}"].selected`);
    if (!selected) return;
    const fb = document.getElementById(`q${q}-fb`);
    document.querySelectorAll(`.lp-quiz-option[data-q="${q}"]`).forEach(b => {
      b.disabled = true;
      if (b.dataset.v === answer) b.classList.add('correct');
      else if (b.classList.contains('selected')) b.classList.add('wrong');
    });
    this.disabled = true;
    if (selected.dataset.v === answer) {
      fb.textContent = 'Correct!';
      fb.className = 'lp-quiz-feedback correct';
    } else {
      fb.textContent = `Not quite - the correct answer is ${answer}.`;
      fb.className = 'lp-quiz-feedback wrong';
    }
  });
});
