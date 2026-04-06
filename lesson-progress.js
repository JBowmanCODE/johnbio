/* ================================================
   lesson-progress.js — Mark as complete for lesson pages
   ES module, loaded on all course/slug pages
   ================================================ */

import { auth, db } from '/firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, getDoc, updateDoc, setDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Only run on lesson pages
const slug = document.body.getAttribute('data-slug');
if (!slug || typeof COURSE_UNITS === 'undefined') {
  throw new Error('lesson-progress: not a lesson page');
}

// Find lesson ID from slug
let lessonId = null;
for (const unit of COURSE_UNITS) {
  const lesson = unit.lessons.find(l => l.slug === slug);
  if (lesson) { lessonId = lesson.id; break; }
}
if (!lessonId) {
  throw new Error('lesson-progress: slug not found in COURSE_UNITS: ' + slug);
}

// Inject the complete wrap before #lp-lesson-nav
const nav = document.getElementById('lp-lesson-nav');
const wrap = document.createElement('div');
wrap.id = 'lp-complete-wrap';
wrap.className = 'lp-complete-wrap';
if (nav && nav.parentNode) {
  nav.parentNode.insertBefore(wrap, nav);
}

let currentUser = null;
let userProgress = {};

function render() {
  const isDone = !!userProgress[lessonId];

  if (!currentUser) {
    wrap.innerHTML = `
      <button class="lp-complete-btn" disabled>
        <span class="material-symbols-outlined">radio_button_unchecked</span>
        Mark as complete
      </button>
      <p class="lp-complete-nudge"><a href="/login">Sign in</a> to track your progress</p>
    `;
    return;
  }

  if (isDone) {
    wrap.innerHTML = `
      <button class="lp-complete-btn lp-complete-btn--done" disabled>
        <span class="material-symbols-outlined">check_circle</span>
        Completed
      </button>
    `;
    return;
  }

  wrap.innerHTML = `
    <button class="lp-complete-btn" id="lpCompleteBtn">
      <span class="material-symbols-outlined">radio_button_unchecked</span>
      Mark as complete
    </button>
  `;
  document.getElementById('lpCompleteBtn').addEventListener('click', markComplete);
}

async function markComplete() {
  const btn = document.getElementById('lpCompleteBtn');
  if (!btn || !currentUser) return;
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined">hourglass_empty</span> Saving...`;

  try {
    const ref = doc(db, 'users', currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: currentUser.email,
        name: currentUser.displayName || '',
        createdAt: serverTimestamp(),
        courseProgress: { [lessonId]: true },
        certificateIssued: false
      });
    } else {
      await updateDoc(ref, { [`courseProgress.${lessonId}`]: true });
    }
    userProgress[lessonId] = true;
    render();
  } catch (err) {
    console.error('lesson-progress markComplete error:', err);
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined">error</span> Error — try again`;
  }
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) {
    const snap = await getDoc(doc(db, 'users', user.uid));
    userProgress = snap.exists() ? (snap.data().courseProgress || {}) : {};
  } else {
    userProgress = {};
  }
  render();
});
