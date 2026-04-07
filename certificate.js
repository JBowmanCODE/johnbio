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

/* ----- Generate a random unguessable cert ID ----- */
function generateCertId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1 to avoid confusion
  let suffix = '';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  array.forEach(b => suffix += chars[b % chars.length]);
  return `JB-2026-${suffix}`;
}

/* ----- Assign a unique cert ID via Firestore transaction ----- */
async function assignCertId(uid, name, result) {
  const counterRef = doc(db, 'meta', 'certCounter');
  const userRef = doc(db, 'users', uid);
  let certId;

  await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const count = counterSnap.exists() ? counterSnap.data().count : 374;
    const next = count + 1;
    certId = generateCertId(); // random, unguessable

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

  renderLinkedInGuide(dateStr, certId);
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

/* ----- LinkedIn instructions ----- */
function renderLinkedInGuide(dateStr, certId) {
  const wrap = document.getElementById('certWrap');
  const verifyUrl = `https://johnb.io/verify/${certId}`;
  const [month, , year] = dateStr.split(' ');

  const guide = document.createElement('div');
  guide.className = 'cert-linkedin';
  guide.innerHTML = `
    <div class="cert-linkedin-inner">
      <div class="cert-linkedin-header">
        <svg class="cert-linkedin-icon" viewBox="0 0 24 24" fill="#0a66c2" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <h3 class="cert-linkedin-title">Add to LinkedIn</h3>
      </div>
      <p class="cert-linkedin-sub">Go to your <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener" class="cert-li-link">LinkedIn</a> profile, click <strong>Add profile section</strong> then <strong>Licenses &amp; certifications</strong>, and fill in:</p>

      <ol class="cert-li-steps">
        <li>
          <span class="cert-li-label">Name</span>
          <div class="cert-li-value-row">
            <span class="cert-li-value">AI &amp; Machine Learning Course</span>
            <button class="cert-li-copy" data-copy="AI & Machine Learning Course">Copy</button>
          </div>
        </li>
        <li>
          <span class="cert-li-label">Issuing organisation</span>
          <div class="cert-li-value-row">
            <span class="cert-li-value">JohnB.io</span>
            <button class="cert-li-copy" data-copy="JohnB.io">Copy</button>
          </div>
        </li>
        <li>
          <span class="cert-li-label">Issue date</span>
          <div class="cert-li-value-row">
            <span class="cert-li-value">${month} ${year}</span>
          </div>
        </li>
        <li>
          <span class="cert-li-label">Expiration date</span>
          <div class="cert-li-value-row">
            <span class="cert-li-value">No expiration date</span>
          </div>
        </li>
        <li>
          <span class="cert-li-label">Credential ID</span>
          <div class="cert-li-value-row">
            <span class="cert-li-value">${certId}</span>
            <button class="cert-li-copy" data-copy="${certId}">Copy</button>
          </div>
        </li>
        <li>
          <span class="cert-li-label">Credential URL</span>
          <div class="cert-li-value-row">
            <a class="cert-li-value cert-li-link" href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a>
            <button class="cert-li-copy" data-copy="${verifyUrl}">Copy</button>
          </div>
        </li>
        <li>
          <span class="cert-li-label">Media (optional)</span>
          <div class="cert-li-value-row">
            <span class="cert-li-value">Download your certificate image and upload to your LinkedIn Licenses &amp; certifications section</span>
            <button class="cert-li-copy cert-li-download-btn" id="certLiDownload">Download</button>
          </div>
        </li>
      </ol>

      <div class="cert-li-skills">
        <div class="cert-li-skills-label">Suggested skills to add</div>
        <div class="cert-li-skills-sub">Add these to the Skills section of the certification on LinkedIn</div>
        <div class="cert-li-skills-grid">
          ${[
            'Artificial Intelligence', 'Machine Learning', 'Deep Learning',
            'Natural Language Processing', 'Neural Networks', 'Python',
            'TensorFlow', 'PyTorch', 'Scikit-learn', 'NumPy',
            'Pandas', 'Prompt Engineering', 'MLOps', 'Generative AI',
            'AI Ethics', 'Model Deployment', 'Reinforcement Learning',
            'Computer Vision', 'Large Language Models', 'RAG'
          ].map(s => `<span class="cert-li-skill">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  wrap.appendChild(guide);

  // Copy buttons
  guide.querySelectorAll('.cert-li-copy[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    });
  });

  // Download button in LinkedIn guide
  document.getElementById('certLiDownload').addEventListener('click', downloadCert);
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
