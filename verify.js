/* ================================================
   verify.js — Public certificate verification page
   URL format: /verify/JB-2026-000374
   No auth required — reads from public certificates collection
   ================================================ */

import { db } from '/firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Extract cert ID from URL path: /verify/JB-2026-000374
const parts = window.location.pathname.split('/').filter(Boolean);
const certId = parts[parts.length - 1];

async function init() {
  if (!certId || !certId.startsWith('JB-')) {
    showNotFound();
    return;
  }

  const snap = await getDoc(doc(db, 'certificates', certId));
  document.getElementById('certLoading').classList.add('hidden');

  if (!snap.exists()) {
    showNotFound();
    return;
  }

  const data = snap.data();
  const date = new Date(data.date);
  const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const scoreStr = Math.round(data.score / 30 * 100) + '%';
  const verifyUrl = `johnb.io/verify/${certId}`;

  // Update page title and OG tags with the student's name
  document.title = `${data.name} - AI Certificate - JohnB.io`;

  renderVerify(data.name, dateStr, scoreStr, certId, verifyUrl);
}

function renderVerify(name, dateStr, scoreStr, certId, verifyUrl) {
  const wrap = document.getElementById('certWrap');

  wrap.innerHTML = `
    <div class="cert-verified-badge">
      <span class="material-symbols-outlined">verified</span>
      Certificate verified - issued by JohnB.io
    </div>

    <div class="cert-actions">
      <div class="cert-actions-left">
        <a href="/course" class="cert-btn cert-btn-share">
          <span class="material-symbols-outlined">school</span>
          View course
        </a>
      </div>
    </div>

    <div class="cert-doc" id="certDoc">
      <div class="cert-glow"></div>
      <div class="cert-border-left"></div>
      <div class="cert-border-right"></div>

      <div class="cert-doc-inner">

        <div class="cert-top">
          <div class="cert-logo-mark">JOHNB.IO</div>
          <div class="cert-site-sub">AI &amp; Machine Learning Education</div>
        </div>

        <div class="cert-rule cert-top-rule"></div>

        <div class="cert-heading-row">
          <div class="cert-dash"></div>
          <div class="cert-heading-text">CERTIFICATE OF COMPLETION</div>
          <div class="cert-dash"></div>
        </div>

        <p class="cert-certifies">This certifies that</p>

        <div class="cert-name-wrap">
          <h1 class="cert-name">${escapeHtml(name)}</h1>
        </div>

        <p class="cert-completed-text">has successfully completed all 35 lessons and passed the final exam of</p>

        <h2 class="cert-course-title">AI &amp; MACHINE LEARNING COURSE</h2>

        <p class="cert-course-meta">35 lessons &middot; 9 units &middot; AI fundamentals through to deployment &amp; ethics &middot; 15+ Hours of AI</p>

        <div class="cert-rule-dot">
          <div class="cert-rule"></div>
          <div class="cert-dot"></div>
          <div class="cert-rule"></div>
        </div>

        <div class="cert-stats">
          <div class="cert-stat-box">
            <div class="cert-stat-label">Date of Completion</div>
            <div class="cert-stat-value">${dateStr}</div>
          </div>
          <div class="cert-stat-box">
            <div class="cert-stat-label">Hours Completed</div>
            <div class="cert-stat-value">15 Hours</div>
          </div>
          <div class="cert-stat-box">
            <div class="cert-stat-label">Exam Score</div>
            <div class="cert-stat-value">${scoreStr}</div>
          </div>
          <div class="cert-stat-box">
            <div class="cert-stat-label">Certificate ID</div>
            <div class="cert-stat-value">${certId}</div>
          </div>
        </div>

        <div class="cert-rule-dot">
          <div class="cert-rule"></div>
          <div class="cert-dot"></div>
          <div class="cert-rule"></div>
        </div>

        <div class="cert-footer">
          <div class="cert-sig-block">
            <div class="cert-signature">J Bowman</div>
            <div class="cert-sig-label">J Bowman &middot; <strong>Instructor, JohnB.io</strong></div>
          </div>
          <div class="cert-verify-block">
            <a class="cert-verify-btn" href="/verify/${certId}">${verifyUrl}</a>
            <div class="cert-verify-sub">Verify certificate at johnb.io</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function showNotFound() {
  document.getElementById('certLoading').classList.add('hidden');
  document.getElementById('certNotFound').classList.remove('hidden');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

init();
