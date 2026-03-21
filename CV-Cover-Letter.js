// Progress tracking
let progress = 0;
const progressSteps = [
  'Analyzing inputs...',
  'Processing job description...',
  'Tailoring CV...',
  'Crafting cover letter...',
  'Finalizing documents...'
];

// ── CV BUILDER — constructs HTML directly from structured JSON ────────────────
// No text parsing, no regex, no asterisk detection needed.

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*+/g, ''); // strip any asterisks that sneak through
}

function buildCV(d) {
  let html = '';

  // Name
  html += `<h2 class="cv-name">${esc(d.name)}</h2>`;

  // Contact line with clickable links
  const contactParts = [
    d.location ? esc(d.location) : '',
    d.phone ? esc(d.phone) : '',
    d.email ? `<a href="mailto:${esc(d.email)}" class="cv-link">${esc(d.email)}</a>` : '',
    d.linkedin ? `<a href="https://${esc(d.linkedin)}" target="_blank" rel="noopener" class="cv-link">${esc(d.linkedin)}</a>` : '',
  ].filter(Boolean);
  html += `<div class="cv-contact">${contactParts.join(' <span class="cv-pipe">|</span> ')}</div>`;

  // Headline
  if (d.headline) {
    html += `<div class="cv-tagline">${esc(d.headline)}</div>`;
  }

  // Professional Summary
  html += section('PROFESSIONAL SUMMARY');
  html += `<div class="cv-summary">${esc(d.summary)}</div>`;

  // Areas of Expertise
  if (d.expertise && d.expertise.length) {
    html += section('AREAS OF EXPERTISE');
    d.expertise.forEach(e => {
      html += `<div class="cv-expertise-row"><span class="cv-expertise-cat">${esc(e.category)}:</span> <span class="cv-expertise-skills">${esc(e.skills)}</span></div>`;
    });
  }

  // Professional Experience
  if (d.experience && d.experience.length) {
    html += section('PROFESSIONAL EXPERIENCE');
    d.experience.forEach(job => {
      html += `<div class="cv-role-line"><strong>${esc(job.title)}</strong><span class="cv-pipe"> | </span><span class="cv-pipe-part">${esc(job.company)}</span><span class="cv-pipe"> | </span><span class="cv-pipe-part">${esc(job.dates)}</span></div>`;
      if (job.bullets && job.bullets.length) {
        job.bullets.forEach(b => {
          html += `<div class="cv-bullet"><span class="cv-bullet-dash">–</span><span class="cv-bullet-text">${esc(b)}</span></div>`;
        });
      }
      html += '<div class="cv-spacer"></div>';
    });
  }

  // Education & Certifications
  if (d.certifications && d.certifications.length) {
    html += section('EDUCATION & CERTIFICATIONS');
    d.certifications.forEach(c => {
      html += `<div class="cv-cert-row"><span class="cv-cert-name">${esc(c.name)}</span><span class="cv-pipe"> | </span><span class="cv-pipe-part">${esc(c.institution)}</span><span class="cv-pipe"> | </span><span class="cv-pipe-part">${esc(c.year)}</span></div>`;
    });
  }

  return html;
}

function buildCoverLetter(cl, name) {
  if (!cl) return '';
  let html = '';
  html += `<div class="cl-greeting">Dear Hiring Team,</div>`;
  if (cl.opening) html += `<p class="cl-para">${esc(cl.opening)}</p>`;
  if (cl.body)    html += `<p class="cl-para">${esc(cl.body)}</p>`;
  if (cl.closing) html += `<p class="cl-para">${esc(cl.closing)}</p>`;
  html += `<div class="cl-signoff">${esc(cl.sign_off || 'Yours sincerely')},<br>${esc(name || '')}</div>`;
  return html;
}

function section(title) {
  return `<h3 class="cv-section-header">${title}</h3><hr class="cv-rule">`;
}

function renderOutput(cvData) {
  const cvEl  = document.getElementById('generatedCV');
  const clEl  = document.getElementById('generatedCoverLetter');
  if (cvEl) cvEl.innerHTML  = buildCV(cvData);
  if (clEl) clEl.innerHTML  = buildCoverLetter(cvData.cover_letter, cvData.name);
}

// ── PLAIN TEXT EXPORT (for clipboard / TXT download) ─────────────────────────
function cvDataToPlainText(d) {
  const lines = [];
  lines.push(d.name || '');
  const contact = [d.location, d.phone, d.email, d.linkedin].filter(Boolean).join(' | ');
  lines.push(contact);
  if (d.headline) lines.push(d.headline);
  lines.push('');

  lines.push('PROFESSIONAL SUMMARY');
  lines.push('----------------------------------------');
  lines.push(d.summary || '');
  lines.push('');

  if (d.expertise && d.expertise.length) {
    lines.push('AREAS OF EXPERTISE');
    lines.push('----------------------------------------');
    d.expertise.forEach(e => lines.push(`${e.category}: ${e.skills}`));
    lines.push('');
  }

  if (d.experience && d.experience.length) {
    lines.push('PROFESSIONAL EXPERIENCE');
    lines.push('----------------------------------------');
    d.experience.forEach(job => {
      lines.push(`${job.title} | ${job.company} | ${job.dates}`);
      (job.bullets || []).forEach(b => lines.push(`- ${b}`));
      lines.push('');
    });
  }

  if (d.certifications && d.certifications.length) {
    lines.push('EDUCATION & CERTIFICATIONS');
    lines.push('----------------------------------------');
    d.certifications.forEach(c => lines.push(`${c.name} | ${c.institution} | ${c.year}`));
    lines.push('');
  }

  return lines.join('\n');
}

function coverLetterToPlainText(cl, name) {
  if (!cl) return '';
  const lines = ['Dear Hiring Team,', ''];
  if (cl.opening) lines.push(cl.opening, '');
  if (cl.body)    lines.push(cl.body, '');
  if (cl.closing) lines.push(cl.closing, '');
  lines.push(`${cl.sign_off || 'Yours sincerely'},`);
  lines.push(name || '');
  return lines.join('\n');
}

// ── STORE cvData globally for downloads ──────────────────────────────────────
let _cvData = null;

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function updateCharCount(textarea, counterId) {
  const counter = document.getElementById(counterId);
  const maxLength = parseInt(textarea.getAttribute('maxlength')) || 5000;
  const remaining = maxLength - textarea.value.length;
  counter.textContent = `${remaining.toLocaleString()} characters remaining`;
  counter.style.color = remaining < maxLength * 0.1 ? '#dc3545'
    : remaining < maxLength * 0.2 ? '#ffc107' : '#666';
}

function showError(message, duration = 5000) {
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');
  if (!errorContainer || !errorText) return;
  errorText.textContent = message;
  errorContainer.style.display = 'block';
  if (duration > 0) setTimeout(() => closeError(), duration);
}

function closeError() {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) setTimeout(() => { errorContainer.style.display = 'none'; }, 300);
}

function updateProgress(step) {
  const progressBar    = document.querySelector('.progress-bar');
  const progressText   = document.querySelector('.generating-text');
  const generatingState = document.querySelector('.generating-state');
  if (!progressBar || !progressText || !generatingState) return;
  progress = (step / (progressSteps.length - 1)) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = progressSteps[step];
  generatingState.style.display = 'flex';
}

// ── DOCX GENERATION ───────────────────────────────────────────────────────────
async function generateDOCX(type) {
  if (!_cvData) { showError('No data to export'); return null; }
  const { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip } = window.docx;
  const d = _cvData;
  const children = [];

  const addPara = (runs, spacingBefore = 0, spacingAfter = 60) => {
    children.push(new Paragraph({ children: runs.filter(Boolean), spacing: { before: spacingBefore, after: spacingAfter } }));
  };

  const t = (text, opts = {}) => new TextRun({ text: String(text || '').replace(/\*+/g,''), font: 'Calibri', size: opts.size || 20, bold: opts.bold || false, italics: opts.italics || false, color: opts.color || '000000' });

  const rule = () => children.push(new Paragraph({
    children: [t('')],
    border: { bottom: { style: 'single', size: 6, color: '333333' } },
    spacing: { after: 80 }
  }));

  const sectionHeader = (title) => {
    children.push(new Paragraph({ children: [t(title, { bold: true, size: 20 })], spacing: { before: 220, after: 40 } }));
    rule();
  };

  if (type === 'cv') {
    // Name
    addPara([t(d.name, { bold: true, size: 28 })], 0, 40);

    // Contact
    const contact = [d.location, d.phone, d.email, d.linkedin].filter(Boolean).join(' | ');
    addPara([t(contact, { size: 18, color: '444444' })], 0, 40);

    // Headline
    if (d.headline) addPara([t(d.headline, { size: 18, italics: true, color: '555555' })], 0, 80);

    // Summary
    sectionHeader('PROFESSIONAL SUMMARY');
    addPara([t(d.summary)], 0, 80);

    // Expertise
    if (d.expertise && d.expertise.length) {
      sectionHeader('AREAS OF EXPERTISE');
      d.expertise.forEach(e => {
        addPara([t(e.category + ': ', { bold: true }), t(e.skills)], 0, 40);
      });
    }

    // Experience
    if (d.experience && d.experience.length) {
      sectionHeader('PROFESSIONAL EXPERIENCE');
      d.experience.forEach(job => {
        addPara([
          t(job.title, { bold: true }),
          t('  |  ', { color: '999999' }),
          t(job.company),
          t('  |  ', { color: '999999' }),
          t(job.dates, { color: '555555' })
        ], 100, 40);
        (job.bullets || []).forEach(b => {
          children.push(new Paragraph({
            children: [t('\u2013  ' + b)],
            indent: { left: convertInchesToTwip(0.2) },
            spacing: { after: 40 }
          }));
        });
        children.push(new Paragraph({ spacing: { after: 60 } }));
      });
    }

    // Certifications
    if (d.certifications && d.certifications.length) {
      sectionHeader('EDUCATION & CERTIFICATIONS');
      d.certifications.forEach(c => {
        addPara([
          t(c.name, { bold: true }),
          t('  |  ', { color: '999999' }),
          t(c.institution),
          t('  |  ', { color: '999999' }),
          t(c.year, { color: '555555' })
        ], 0, 40);
      });
    }

  } else {
    // Cover letter
    const cl = d.cover_letter;
    if (!cl) return null;
    const paras = ['Dear Hiring Team,', '', cl.opening, '', cl.body, '', cl.closing, '', `${cl.sign_off || 'Yours sincerely'},`, d.name || ''];
    paras.forEach(p => {
      children.push(new Paragraph({
        children: [t(p || '', { size: 22 })],
        spacing: { after: p ? 160 : 80 },
        alignment: AlignmentType.LEFT
      }));
    });
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.75), bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(0.85), right: convertInchesToTwip(0.85)
          }
        }
      },
      children: children.filter(Boolean)
    }]
  });

  return docx.Packer.toBlob(doc);
}

// ── DOWNLOAD ──────────────────────────────────────────────────────────────────
async function downloadDocument(type, format) {
  if (!_cvData) { showError('Please generate a CV first'); return; }
  const button = event.target.closest('.action-button');
  if (!button) return;
  const originalContent = button.innerHTML;

  try {
    button.disabled = true;
    button.innerHTML = `<div class="spinner"></div> Preparing...`;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${type}_${timestamp}.${format}`;
    let blob;

    if (format === 'docx') {
      blob = await generateDOCX(type);
      if (!blob) throw new Error('Failed to generate document');
    } else if (format === 'txt') {
      const text = type === 'cv'
        ? cvDataToPlainText(_cvData)
        : coverLetterToPlainText(_cvData.cover_letter, _cvData.name);
      blob = new Blob([text], { type: 'text/plain' });
    } else {
      throw new Error('Unsupported format');
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none'; a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url); document.body.removeChild(a);

    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> Done!`;
    setTimeout(() => { button.innerHTML = originalContent; button.disabled = false; }, 2000);

  } catch (error) {
    showError(`Failed to download: ${error.message}`);
    button.innerHTML = originalContent;
    button.disabled = false;
  }
}

// ── CLIPBOARD ─────────────────────────────────────────────────────────────────
async function copyToClipboard(elementId) {
  if (!_cvData) { showError('Please generate a CV first'); return; }
  const button = event.target.closest('.action-button');
  if (!button) return;
  try {
    const text = elementId === 'generatedCV'
      ? cvDataToPlainText(_cvData)
      : coverLetterToPlainText(_cvData.cover_letter, _cvData.name);
    await navigator.clipboard.writeText(text);
    const originalContent = button.innerHTML;
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> Copied!`;
    button.style.backgroundColor = '#218838';
    setTimeout(() => { button.innerHTML = originalContent; button.style.backgroundColor = ''; }, 2000);
  } catch { showError('Failed to copy'); }
}

// ── FORM INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('generateForm');
  const jobInput = document.getElementById('jobDescription');
  const cvInput  = document.getElementById('cvText');
  if (!form || !jobInput || !cvInput) return;

  const save = () => {
    localStorage.setItem('jobDescription', jobInput.value);
    localStorage.setItem('cvText', cvInput.value);
  };

  const restore = () => {
    const j = localStorage.getItem('jobDescription');
    const c = localStorage.getItem('cvText');
    if (j) { jobInput.value = j; updateCharCount(jobInput, 'jobDescCounter'); }
    if (c) { cvInput.value  = c; updateCharCount(cvInput,  'cvTextCounter'); }
  };

  jobInput.addEventListener('input', () => { updateCharCount(jobInput, 'jobDescCounter'); save(); });
  cvInput.addEventListener('input',  () => { updateCharCount(cvInput,  'cvTextCounter');  save(); });
  restore();
  updateCharCount(jobInput, 'jobDescCounter');
  updateCharCount(cvInput,  'cvTextCounter');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const jobDescription = jobInput.value.trim();
    const cvText = cvInput.value.trim();
    if (!jobDescription) { showError('Please enter a job description'); jobInput.focus(); return; }
    if (!cvText)         { showError('Please enter your CV text');       cvInput.focus();  return; }

    const submitButton     = form.querySelector('.submit-button');
    const buttonText       = submitButton?.querySelector('.button-text');
    const spinner          = submitButton?.querySelector('.spinner');
    const progressContainer = document.querySelector('.progress-container');
    const outputSection    = document.querySelector('.output-section');
    if (!submitButton || !buttonText || !spinner || !progressContainer || !outputSection) return;

    buttonText.textContent = 'Generating...';
    submitButton.disabled = true;
    spinner.style.display = 'block';
    progressContainer.style.display = 'block';
    outputSection.style.display = 'none';
    _cvData = null;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length - 1) { updateProgress(currentStep); currentStep++; }
    }, 2000);

    try {
      const response = await fetch('https://cv-cover-letter.ukjbowman.workers.dev/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ job_description: jobDescription, cv_text: cvText })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      if (!result.cv_data) throw new Error('No CV data returned');

      _cvData = result.cv_data;

      clearInterval(progressInterval);
      updateProgress(progressSteps.length - 1);

      renderOutput(_cvData);

      outputSection.style.opacity = '0';
      outputSection.style.display = 'block';
      setTimeout(() => { outputSection.style.opacity = '1'; }, 50);
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
      console.error('Error:', error);
      showError(`Error generating content: ${error.message}`);
      outputSection.style.display = 'none';
    } finally {
      clearInterval(progressInterval);
      buttonText.textContent = 'Generate';
      submitButton.disabled = false;
      spinner.style.display = 'none';
      progressContainer.style.display = 'none';
      document.querySelector('.generating-state').style.display = 'none';
    }
  });
});