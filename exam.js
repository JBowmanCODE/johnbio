/* ================================================
   exam.js — Final exam logic
   30 random questions from 60, shuffled order
   Pass: 26/30 (85%) | Grade A: 30/30 | B: 27-29 | C: 26
   ================================================ */

import { auth, db } from '/firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, getDoc, updateDoc, setDoc, arrayUnion, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const inner = document.getElementById('exInner');

let currentUser = null;
let examQuestions = [];  // 30 selected + shuffled
let currentIndex = 0;
let answers = {};        // { questionIndex: selectedOptionIndex }

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/login?redirect=/exam';
    return;
  }
  currentUser = user;
  showIntro();
});

/* ----- Shuffle helper ----- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ----- Grade calculator ----- */
function calcGrade(score) {
  if (score === 30) return { grade: 'A', label: 'Distinction', passed: true, colour: '#4ade80' };
  if (score >= 27) return { grade: 'B', label: 'Pass with Merit', passed: true, colour: '#60a5fa' };
  if (score >= 26) return { grade: 'C', label: 'Pass', passed: true, colour: '#facc15' };
  return { grade: 'F', label: 'Not passed', passed: false, colour: '#f87171' };
}

/* ----- Intro screen ----- */
function showIntro() {
  inner.innerHTML = `
    <div class="ex-intro">
      <img src="/images/course/ai-exam.webp" alt="AI &amp; Machine Learning Course Final Exam" class="ex-intro-img" loading="lazy">
      <div class="ex-intro-icon"><span class="material-symbols-outlined">quiz</span></div>
      <h1 class="ex-title">Final Exam</h1>
      <p class="ex-sub">30 randomly selected questions from a bank of 60. Every attempt is different. You need 26/30 (85%) to pass.</p>
      <div class="ex-rules">
        <div class="ex-rule"><span class="material-symbols-outlined">help_outline</span> 30 questions, multiple choice</div>
        <div class="ex-rule"><span class="material-symbols-outlined">shuffle</span> Questions and order are randomised each attempt</div>
        <div class="ex-rule"><span class="material-symbols-outlined">target</span> Pass mark: 26/30 (85%)</div>
        <div class="ex-rule"><span class="material-symbols-outlined">workspace_premium</span> Score 30/30 for Grade A — shown on your certificate</div>
        <div class="ex-rule"><span class="material-symbols-outlined">replay</span> You can retake as many times as you like</div>
      </div>
      <button class="ex-start-btn" id="exStartBtn">
        <span class="material-symbols-outlined">play_arrow</span>
        Start exam
      </button>
    </div>
  `;
  document.getElementById('exStartBtn').addEventListener('click', startExam);
}

/* ----- Start exam ----- */
function startExam() {
  // Pick 30 random questions from 60, shuffle their order
  examQuestions = shuffle(EXAM_QUESTIONS).slice(0, 30);
  currentIndex = 0;
  answers = {};
  renderQuestion();
}

/* ----- Render question ----- */
function renderQuestion() {
  const q = examQuestions[currentIndex];
  const total = examQuestions.length;
  const pct = Math.round((currentIndex / total) * 100);
  const letters = ['A', 'B', 'C', 'D'];

  // Shuffle options (keep track of original answer)
  const optionIndices = shuffle([0, 1, 2, 3]);
  const shuffledOptions = optionIndices.map(i => ({ text: q.options[i], originalIndex: i }));
  const selected = answers[currentIndex]; // stored as index in shuffledOptions

  inner.innerHTML = `
    <div class="ex-progress-wrap">
      <div class="ex-progress-top">
        <span>Question ${currentIndex + 1} of ${total}</span>
        <span>${Object.keys(answers).length} answered</span>
      </div>
      <div class="ex-progress-bar-bg">
        <div class="ex-progress-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="ex-question-card">
      <div class="ex-q-num">Question ${currentIndex + 1}</div>
      <div class="ex-q-text">${q.question}</div>
      <div class="ex-options" id="exOptions">
        ${shuffledOptions.map((opt, i) => `
          <div class="ex-option${selected === i ? ' selected' : ''}"
               data-index="${i}" data-original="${opt.originalIndex}">
            <span class="ex-option-letter">${letters[i]}</span>
            <span class="ex-option-text">${opt.text}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="ex-nav">
      ${currentIndex > 0 ? `<button class="ex-nav-btn ex-btn-back" id="exBack">
        <span class="material-symbols-outlined">arrow_back</span> Back
      </button>` : '<div></div>'}
      ${currentIndex < total - 1
        ? `<button class="ex-nav-btn ex-btn-next" id="exNext" ${selected === undefined ? 'disabled' : ''}>
            Next <span class="material-symbols-outlined">arrow_forward</span>
           </button>`
        : `<button class="ex-nav-btn ex-btn-submit" id="exSubmit" ${selected === undefined ? 'disabled' : ''}>
            Submit exam <span class="material-symbols-outlined">send</span>
           </button>`
      }
    </div>
  `;

  // Store shuffled options mapping for scoring
  examQuestions[currentIndex]._shuffled = shuffledOptions;

  // Option click
  document.querySelectorAll('.ex-option').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.index);
      answers[currentIndex] = idx;
      document.querySelectorAll('.ex-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      const nextBtn = document.getElementById('exNext') || document.getElementById('exSubmit');
      if (nextBtn) nextBtn.disabled = false;
    });
  });

  document.getElementById('exBack')?.addEventListener('click', () => { currentIndex--; renderQuestion(); });
  document.getElementById('exNext')?.addEventListener('click', () => { currentIndex++; renderQuestion(); });
  document.getElementById('exSubmit')?.addEventListener('click', submitExam);
}

/* ----- Submit & score ----- */
async function submitExam() {
  let score = 0;
  examQuestions.forEach((q, i) => {
    const selectedShuffleIdx = answers[i];
    if (selectedShuffleIdx === undefined) return;
    const selectedOriginal = q._shuffled[selectedShuffleIdx].originalIndex;
    if (selectedOriginal === q.answer) score++;
  });

  const result = calcGrade(score);
  const date = new Date().toISOString();

  // Save to Firestore
  try {
    const ref = doc(db, 'users', currentUser.uid);
    const snap = await getDoc(ref);
    const examEntry = { score, grade: result.grade, passed: result.passed, date };

    if (!snap.exists()) {
      await setDoc(ref, {
        email: currentUser.email, name: currentUser.displayName || '',
        createdAt: serverTimestamp(), courseProgress: {},
        certificateIssued: result.passed,
        examResults: [examEntry]
      });
    } else {
      const updates = {
        examResults: arrayUnion(examEntry)
      };
      if (result.passed) updates.certificateIssued = true;
      await updateDoc(ref, updates);
    }
  } catch (err) {
    console.error('Error saving exam result:', err);
  }

  showResults(score, result);
}

/* ----- Results screen ----- */
function showResults(score, result) {
  const pct = Math.round((score / 30) * 100);
  const circumference = 314;
  const offset = circumference - (circumference * pct / 100);

  inner.innerHTML = `
    <div class="ex-results">
      <div class="ex-result-ring-wrap">
        <svg class="ex-result-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="ex-ring-bg" cx="50" cy="50" r="44"/>
          <circle class="ex-ring-fill" id="exRingFill" cx="50" cy="50" r="44" style="stroke:${result.colour}"/>
        </svg>
        <div class="ex-ring-label">
          <span class="ex-ring-score">${score}/30</span>
          <span class="ex-ring-sub">${pct}%</span>
        </div>
      </div>

      <div class="ex-result-grade" style="color:${result.colour}">Grade ${result.grade}</div>
      <div class="ex-result-label" style="color:${result.colour}">${result.label}</div>
      <div class="ex-result-sub">
        ${result.passed
          ? `You passed! ${score === 30 ? 'Perfect score - outstanding.' : 'Your certificate is now available.'}`
          : `You need 26/30 to pass. You scored ${score}/30. Try again - questions are different each time.`}
      </div>

      <div class="ex-result-actions">
        ${result.passed ? `<a href="/certificate" class="ex-result-btn ex-btn-cert">
          <span class="material-symbols-outlined">workspace_premium</span>
          View certificate
        </a>` : ''}
        <a href="/course" class="ex-result-btn ex-btn-dash">
          <span class="material-symbols-outlined">dashboard</span>
          Dashboard
        </a>
        <button class="ex-result-btn ex-btn-retry" id="exRetry">
          <span class="material-symbols-outlined">replay</span>
          Retake exam
        </button>
      </div>
    </div>
  `;

  // Animate ring
  setTimeout(() => {
    const fill = document.getElementById('exRingFill');
    if (fill) fill.style.strokeDashoffset = offset;
  }, 100);

  // Confetti on pass
  if (result.passed && typeof confetti === 'function') {
    if (score === 30) {
      // Perfect score — big sustained burst
      const end = Date.now() + 3500;
      const colors = ['#ff007f', '#ffffff', '#7c3aed', '#4ade80'];
      (function burst() {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(burst);
      })();
      setTimeout(() => {
        confetti({ particleCount: 180, spread: 100, origin: { y: 0.55 }, colors, scalar: 1.2 });
      }, 400);
    } else {
      // Regular pass — single burst
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#ff007f', '#ffffff', '#7c3aed'] });
    }
  }

  document.getElementById('exRetry')?.addEventListener('click', startExam);
}
