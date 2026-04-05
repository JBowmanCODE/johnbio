/* ================================================
   certificate.js — Certificate page logic
   ================================================ */

import { auth, db } from '/firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/test-login?redirect=/certificate';
    return;
  }

  const snap = await getDoc(doc(db, 'users', user.uid));
  const data = snap.exists() ? snap.data() : {};
  const examResults = data.examResults || [];
  const passed = examResults.filter(r => r.passed);

  document.getElementById('certLoading').classList.add('hidden');

  if (!passed.length) {
    document.getElementById('certLocked').classList.remove('hidden');
    return;
  }

  // Best result
  const best = passed.reduce((b, r) => r.score > b.score ? r : b, passed[0]);
  const name = data.name || user.displayName || user.email.split('@')[0];
  const date = new Date(best.date);
  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  renderCertificate(name, best, dateStr);
});

function gradeStyle(grade) {
  const map = {
    'A': { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.3)', color: '#4ade80', label: 'Grade A — Distinction' },
    'B': { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', color: '#60a5fa', label: 'Grade B — Merit' },
    'C': { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)', color: '#ca8a04', label: 'Grade C — Pass' }
  };
  return map[grade] || map['C'];
}

function renderCertificate(name, result, dateStr) {
  const gs = gradeStyle(result.grade);
  const wrap = document.getElementById('certWrap');

  const certHTML = `
    <div class="cert-actions">
      <div class="cert-actions-left">
        <button class="cert-btn cert-btn-print" onclick="window.print()">
          <span class="material-symbols-outlined">print</span>
          Print / Save as PDF
        </button>
        <a href="/course" class="cert-btn cert-btn-dash">
          <span class="material-symbols-outlined">arrow_back</span>
          Dashboard
        </a>
      </div>
    </div>

    <div class="cert-doc" id="certDoc">
      <div class="cert-corner tl"></div>
      <div class="cert-corner tr"></div>
      <div class="cert-corner bl"></div>
      <div class="cert-corner br"></div>

      <div class="cert-doc-inner">
        <div class="cert-logo">
          <span class="cert-logo-dot"></span>
          JohnB.io
        </div>

        <p class="cert-heading">Certificate of Completion</p>
        <div class="cert-divider"></div>

        <p class="cert-presents">This certifies that</p>

        <h1 class="cert-name">${escapeHtml(name)}</h1>

        <p class="cert-has-completed">has successfully completed</p>

        <h2 class="cert-course-title">Introduction to Artificial Intelligence</h2>

        <div class="cert-grade-badge" style="background:${gs.bg};border:1px solid ${gs.border};color:${gs.color}">
          <span class="material-symbols-outlined" style="font-size:1rem">workspace_premium</span>
          ${gs.label}
        </div>

        <div class="cert-meta">
          <div class="cert-meta-item">
            <span class="cert-meta-label">Score</span>
            <span class="cert-meta-value">${result.score}/30 (${Math.round(result.score/30*100)}%)</span>
          </div>
          <div class="cert-meta-item">
            <span class="cert-meta-label">Date issued</span>
            <span class="cert-meta-value">${dateStr}</span>
          </div>
          <div class="cert-meta-item">
            <span class="cert-meta-label">Issued by</span>
            <span class="cert-meta-value">JohnB.io</span>
          </div>
        </div>

        <div class="cert-seal">
          <span class="material-symbols-outlined">verified</span>
        </div>

        <p class="cert-footer-text">johnb.io — AI Course</p>
      </div>
    </div>
  `;

  wrap.innerHTML = certHTML;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
