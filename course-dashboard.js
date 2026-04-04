/* ================================================
   course-dashboard.js — User dashboard logic
   ================================================ */

import { auth, db } from '/firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const TOTAL_LESSONS = getTotalLessons(); // from course-data.js

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/test-login';
    return;
  }
  await loadDashboard(user);
});

async function loadDashboard(user) {
  // Fetch user doc from Firestore
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};

  const progress = data.courseProgress || {};
  const examResults = data.examResults || [];
  const bestExam = examResults.length
    ? examResults.reduce((best, r) => r.score > best.score ? r : best, examResults[0])
    : null;

  // Name
  const name = data.name || user.displayName || user.email.split('@')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('cdGreeting').textContent = greeting;
  document.getElementById('cdName').textContent = name;

  // Lesson count
  const doneLessons = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((doneLessons / TOTAL_LESSONS) * 100);

  // Ring
  const ring = document.getElementById('cdRingFill');
  const circumference = 213.6;
  ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
  document.getElementById('cdRingPct').textContent = pct + '%';

  // Stats
  document.getElementById('statLessons').textContent = `${doneLessons} / ${TOTAL_LESSONS}`;

  const completeUnits = COURSE_UNITS.filter(u =>
    u.lessons.every(l => progress[l.id])
  ).length;
  document.getElementById('statUnits').textContent = `${completeUnits} / ${COURSE_UNITS.length}`;

  if (bestExam) {
    document.getElementById('statExam').textContent = `${bestExam.score}/30 — ${bestExam.grade}`;
  }

  const hasCert = data.certificateIssued || (bestExam && bestExam.passed);
  document.getElementById('statCert').textContent = hasCert ? 'Available' : 'Locked';

  // CTA row
  renderCta(progress, bestExam, hasCert);

  // Units
  renderUnits(progress);

  // Show content
  document.getElementById('cdLoading').classList.add('hidden');
  document.getElementById('cdContent').classList.remove('hidden');
}

function renderCta(progress, bestExam, hasCert) {
  const row = document.getElementById('cdCtaRow');
  const allDone = Object.values(progress).filter(Boolean).length >= TOTAL_LESSONS;

  // Find next incomplete lesson
  let nextLesson = null;
  outer: for (const unit of COURSE_UNITS) {
    for (const lesson of unit.lessons) {
      if (!progress[lesson.id]) { nextLesson = lesson; break outer; }
    }
  }

  if (nextLesson) {
    const btn = document.createElement('a');
    btn.href = `/course?u=${nextLesson.id.split('-')[0]}&l=${nextLesson.id.split('-')[1]}`;
    btn.className = 'cd-btn cd-btn-primary';
    btn.innerHTML = `<span class="material-symbols-outlined">play_arrow</span> ${nextLesson.id === '1-1' ? 'Start course' : 'Continue'}`;
    row.appendChild(btn);
  }

  if (allDone || Object.keys(progress).length > 0) {
    const examBtn = document.createElement('a');
    examBtn.href = '/exam';
    examBtn.className = `cd-btn ${bestExam && bestExam.passed ? 'cd-btn-secondary' : 'cd-btn-secondary'}`;
    examBtn.innerHTML = `<span class="material-symbols-outlined">quiz</span> ${bestExam ? 'Retake exam' : 'Take exam'}`;
    row.appendChild(examBtn);
  }

  if (hasCert) {
    const certBtn = document.createElement('a');
    certBtn.href = '/certificate';
    certBtn.className = 'cd-btn cd-btn-success';
    certBtn.innerHTML = `<span class="material-symbols-outlined">workspace_premium</span> View certificate`;
    row.appendChild(certBtn);
  }
}

function renderUnits(progress) {
  const container = document.getElementById('cdUnits');
  const title = container.querySelector('.cd-section-title');

  COURSE_UNITS.forEach((unit, idx) => {
    const unitDone = unit.lessons.filter(l => progress[l.id]).length;
    const unitPct = Math.round((unitDone / unit.lessons.length) * 100);
    const isComplete = unitDone === unit.lessons.length;

    const el = document.createElement('div');
    el.className = `cd-unit${isComplete ? ' complete' : ''}`;

    el.innerHTML = `
      <div class="cd-unit-header" role="button" aria-expanded="false" tabindex="0">
        <div class="cd-unit-num">${isComplete ? '<span class="material-symbols-outlined" style="font-size:0.9rem">check</span>' : unit.id}</div>
        <div class="cd-unit-info">
          <div class="cd-unit-title">Unit ${unit.id} — ${unit.title}</div>
          <div class="cd-unit-meta">${unitDone}/${unit.lessons.length} lessons complete</div>
        </div>
        <div class="cd-unit-bar-wrap">
          <div class="cd-unit-bar-bg">
            <div class="cd-unit-bar-fill" style="width:${unitPct}%"></div>
          </div>
        </div>
        <span class="material-symbols-outlined cd-unit-chevron">expand_more</span>
      </div>
      <div class="cd-unit-lessons">
        ${unit.lessons.map(l => `
          <a class="cd-lesson-row" href="/course?u=${l.id.split('-')[0]}&l=${l.id.split('-')[1]}">
            <div class="cd-lesson-check${progress[l.id] ? ' done' : ''}">
              <span class="material-symbols-outlined">check</span>
            </div>
            <span class="cd-lesson-title">${l.title}</span>
            <span class="cd-lesson-duration">${l.duration}</span>
          </a>
        `).join('')}
      </div>
    `;

    const header = el.querySelector('.cd-unit-header');
    const toggle = () => {
      el.classList.toggle('open');
      header.setAttribute('aria-expanded', el.classList.contains('open'));
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });

    // Auto-open first incomplete unit
    if (idx === 0 || (unitDone > 0 && !isComplete)) {
      if (!el.classList.contains('open')) el.classList.add('open');
    }

    container.appendChild(el);
  });
}
