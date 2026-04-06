/* ================================================
   course.js — Lesson player logic
   ================================================ */

import { auth, db } from '/firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, getDoc, updateDoc, setDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const params = new URLSearchParams(location.search);
const unitId = parseInt(params.get('u')) || 1;
const lessonId = parseInt(params.get('l')) || 1;
const lessonKey = `${unitId}-${lessonId}`;

const allLessons = getAllLessons();
const currentUnit = COURSE_UNITS.find(u => u.id === unitId);
const currentLesson = currentUnit?.lessons.find(l => l.id === lessonKey);

let currentUser = null;
let userProgress = {};

if (!currentLesson) {
  document.getElementById('clArticle').innerHTML = '<p style="color:rgba(255,255,255,0.5);padding:2rem">Lesson not found.</p>';
} else {
  document.title = `${currentLesson.title} - JohnB.io`;
  renderSidebar();
  renderBreadcrumb();
  renderLesson();
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) {
    const snap = await getDoc(doc(db, 'users', user.uid));
    userProgress = snap.exists() ? (snap.data().courseProgress || {}) : {};
  }
  updateCompleteButton();
  updateSidebarDots();
});

/* ----- Sidebar ----- */
function renderSidebar() {
  const container = document.getElementById('clSidebarUnits');
  COURSE_UNITS.forEach(unit => {
    const el = document.createElement('div');
    el.className = `cl-sb-unit${unit.id === unitId ? ' open' : ''}`;
    el.innerHTML = `
      <div class="cl-sb-unit-title">
        Unit ${unit.id}
        <span class="material-symbols-outlined">expand_more</span>
      </div>
      <div class="cl-sb-lessons">
        ${unit.lessons.map(l => `
          <a class="cl-sb-lesson${l.id === lessonKey ? ' active' : ''}"
             href="/course?u=${l.id.split('-')[0]}&l=${l.id.split('-')[1]}">
            <span class="cl-sb-dot" data-lesson="${l.id}"></span>
            ${l.title.split(' — ')[0]}
          </a>
        `).join('')}
      </div>
    `;
    const titleEl = el.querySelector('.cl-sb-unit-title');
    titleEl.addEventListener('click', () => el.classList.toggle('open'));
    container.appendChild(el);
  });
}

function updateSidebarDots() {
  document.querySelectorAll('.cl-sb-dot[data-lesson]').forEach(dot => {
    const id = dot.dataset.lesson;
    dot.classList.toggle('done', !!userProgress[id]);
  });
}

/* ----- Mobile sidebar ----- */
const sidebar = document.getElementById('clSidebar');
const toggle = document.getElementById('clSidebarToggle');
toggle && toggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !toggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ----- Breadcrumb ----- */
function renderBreadcrumb() {
  const el = document.getElementById('clBreadcrumb');
  el.innerHTML = `
    <a href="/course">Dashboard</a>
    <span class="sep">/</span>
    <span>Unit ${unitId} — ${currentUnit.title}</span>
    <span class="sep">/</span>
    <span style="color:rgba(255,255,255,0.6)">${currentLesson.title.split(' — ')[0]}</span>
  `;
}

/* ----- Lesson content ----- */
function renderLesson() {
  const article = document.getElementById('clArticle');
  article.innerHTML = `
    <div class="cl-lesson-meta">
      <span class="cl-lesson-unit-badge">Unit ${unitId}</span>
      <span>${currentLesson.duration} read</span>
    </div>
    <h1 class="cl-lesson-title">${currentLesson.title}</h1>
    <div class="cl-body">${currentLesson.content}</div>
    <div class="cl-complete-wrap" id="clCompleteWrap"></div>
  `;
  renderBottomNav();
}

/* ----- Mark complete button ----- */
function updateCompleteButton() {
  const wrap = document.getElementById('clCompleteWrap');
  if (!wrap) return;

  const isDone = !!userProgress[lessonKey];

  if (!currentUser) {
    wrap.innerHTML = `
      <button class="cl-complete-btn" disabled style="opacity:0.4;cursor:not-allowed">
        <span class="material-symbols-outlined">check_circle</span>
        Mark as complete
      </button>
      <p class="cl-login-nudge"><a href="/login">Sign in</a> to track your progress</p>
    `;
    return;
  }

  wrap.innerHTML = `
    <button class="cl-complete-btn${isDone ? ' done' : ''}" id="clCompleteBtn">
      <span class="material-symbols-outlined">${isDone ? 'check_circle' : 'radio_button_unchecked'}</span>
      ${isDone ? 'Completed' : 'Mark as complete'}
    </button>
  `;

  if (!isDone) {
    document.getElementById('clCompleteBtn').addEventListener('click', markComplete);
  }
}

async function markComplete() {
  const btn = document.getElementById('clCompleteBtn');
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
        courseProgress: { [lessonKey]: true },
        certificateIssued: false
      });
    } else {
      await updateDoc(ref, { [`courseProgress.${lessonKey}`]: true });
    }
    userProgress[lessonKey] = true;
    updateCompleteButton();
    updateSidebarDots();

    // Auto-advance after short delay
    const nextLesson = getAdjacentLesson(1);
    if (nextLesson) {
      setTimeout(() => {
        window.location.href = `/course?u=${nextLesson.unitId}&l=${nextLesson.id.split('-')[1]}`;
      }, 1200);
    }
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined">error</span> Error - try again`;
  }
}

/* ----- Bottom navigation ----- */
function renderBottomNav() {
  const nav = document.getElementById('clNavRow');
  const prev = getAdjacentLesson(-1);
  const next = getAdjacentLesson(1);

  nav.innerHTML = `
    ${prev ? `<a class="cl-nav-btn" href="/course?u=${prev.unitId}&l=${prev.id.split('-')[1]}">
      <span class="material-symbols-outlined">arrow_back</span>
      <span class="cl-nav-label">${prev.title.split(' — ')[0]}</span>
    </a>` : '<div></div>'}
    ${next ? `<a class="cl-nav-btn next" href="/course?u=${next.unitId}&l=${next.id.split('-')[1]}">
      <span class="cl-nav-label">${next.title.split(' — ')[0]}</span>
      <span class="material-symbols-outlined">arrow_forward</span>
    </a>` : `<a class="cl-nav-btn next" href="/exam">
      <span class="cl-nav-label">Take the exam</span>
      <span class="material-symbols-outlined">quiz</span>
    </a>`}
  `;
}

function getAdjacentLesson(direction) {
  const idx = allLessons.findIndex(l => l.id === lessonKey);
  if (idx === -1) return null;
  const target = allLessons[idx + direction];
  return target || null;
}
