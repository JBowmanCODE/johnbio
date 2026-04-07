/* ================================================
   certificate.js — Certificate page logic
   Assigns unique cert IDs (JB-2026-XXXXXX) via Firestore transaction
   Renders dark certificate matching PDF template
   ================================================ */

import { auth, db } from '/firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, getDoc, runTransaction, setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/login?redirect=/certificate';
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

  // Use best passing score
  const best = passed.reduce((b, r) => r.score > b.score ? r : b, passed[0]);
  const name = data.name || user.displayName || user.email.split('@')[0];

  // Get or assign cert ID
  let certId = data.certId;
  if (!certId) {
    try {
      certId = await assignCertId(user.uid, name, best);
    } catch (err) {
      console.error('Cert ID generation failed:', err);
      document.getElementById('certWrap').innerHTML = `
        <div class="cert-locked" style="display:block">
          <span class="material-symbols-outlined">error</span>
          <h2>Something went wrong</h2>
          <p>Could not generate your certificate. Please try refreshing the page.<br>
          If this keeps happening, the Firestore rules may need updating.</p>
          <a href="/certificate" class="cert-action-btn">Try again</a>
        </div>`;
      return;
    }
  }

  const date = new Date(best.date);
  const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const scoreStr = Math.round(best.score / 30 * 100) + '%';

  renderCertificate(name, dateStr, scoreStr, certId);
});

/* ----- Assign a unique cert ID via Firestore transaction ----- */
async function assignCertId(uid, name, result) {
  const counterRef = doc(db, 'meta', 'certCounter');
  const userRef = doc(db, 'users', uid);
  let certId;

  await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);
    // Default to 373 so first cert issued is JB-2026-000374
    const count = counterSnap.exists() ? counterSnap.data().count : 373;
    const next = count + 1;
    certId = `JB-2026-${String(next).padStart(6, '0')}`;

    tx.set(counterRef, { count: next }, { merge: true });
    tx.set(userRef, { certId }, { merge: true });
    // Public certificate document (readable without auth)
    tx.set(doc(db, 'certificates', certId), {
      name,
      score: result.score,
      grade: result.grade,
      date: result.date,
      certId,
      issuedAt: new Date().toISOString()
    });
  });

  return certId;
}

/* ----- Render the certificate ----- */
function renderCertificate(name, dateStr, scoreStr, certId) {
  const wrap = document.getElementById('certWrap');
  const verifyUrl = `johnb.io/verify/${certId}`;

  wrap.innerHTML = `
    <div class="cert-actions">
      <div class="cert-actions-left">
        <button class="cert-btn cert-btn-download" id="certDownload">
          <span class="material-symbols-outlined">download</span>
          Download image
        </button>
        <a href="/course" class="cert-btn cert-btn-dash">
          <span class="material-symbols-outlined">arrow_back</span>
          Dashboard
        </a>
      </div>
      <div>
        <button class="cert-btn cert-btn-share" id="certShare">
          <span class="material-symbols-outlined">share</span>
          Share
        </button>
      </div>
    </div>

    ${buildCertDoc(name, dateStr, scoreStr, certId, verifyUrl)}
  `;

  document.getElementById('certDownload').addEventListener('click', downloadCert);
  document.getElementById('certShare').addEventListener('click', () => shareCert(certId));
}

/* ----- Certificate HTML (shared with verify page) ----- */
function buildCertDoc(name, dateStr, scoreStr, certId, verifyUrl) {
  return `
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
            <a class="cert-verify-btn" href="/verify/${certId}" target="_blank">${verifyUrl}</a>
            <div class="cert-verify-sub">Verify certificate at johnb.io</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/* ----- Download as PNG ----- */
async function downloadCert() {
  const btn = document.getElementById('certDownload');
  btn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Generating...';
  btn.disabled = true;

  try {
    const el = document.getElementById('certDoc');
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0c0c14',
      logging: false
    });
    const link = document.createElement('a');
    link.download = 'johnb-io-certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    console.error('Certificate download failed:', e);
    alert('Download failed - try using Print / Save as PDF instead.');
  }

  btn.innerHTML = '<span class="material-symbols-outlined">download</span> Download image';
  btn.disabled = false;
}

/* ----- Share / copy link ----- */
function shareCert(certId) {
  const url = `https://johnb.io/verify/${certId}`;
  if (navigator.share) {
    navigator.share({
      title: 'My AI & Machine Learning Certificate - JohnB.io',
      text: 'I completed the AI & Machine Learning Course at JohnB.io.',
      url
    });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('certShare');
      btn.innerHTML = '<span class="material-symbols-outlined">check</span> Link copied!';
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">share</span> Share';
      }, 2500);
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
