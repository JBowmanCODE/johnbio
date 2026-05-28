// ── DOM REFERENCES ──
const fileInput = document.getElementById('pdm-file-input');
const fileLabel = document.querySelector('.pdm-file-label');
const previewContainer = document.getElementById('pdm-preview-container');
const previewList = document.getElementById('pdm-preview-list');
const totalSizeEl = document.getElementById('pdm-total-size');
const sizeWarning = document.getElementById('pdm-size-warning');
const statusEl = document.getElementById('pdm-status');
const mergeBtn = document.getElementById('pdm-merge-btn');
const mergeBtnText = document.getElementById('pdm-merge-btn-text');
const outputSection = document.getElementById('pdm-output-section');
const downloadBtn = document.getElementById('pdm-download-btn');
const printBtn = document.getElementById('pdm-print-btn');

// ── STATE ──
let selectedFiles = []; // Array of { file: File, name: string, size: string }
let mergedPdfBytes = null; // Stores the merged PDF bytes after merge
const SIZE_LIMIT_MB = 100;

// ── UTILITY FUNCTIONS ──
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getTotalSizeBytes() {
  return selectedFiles.reduce((sum, item) => sum + item.file.size, 0);
}

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `pdm-status ${type}`;
}

function clearStatus() {
  statusEl.textContent = '';
  statusEl.className = 'pdm-status';
}

// ── FILE INPUT CLICK ──
fileLabel.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  handleFilesSelected(files);
});

// ── DRAG & DROP ──
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileLabel.classList.add('drag-over');
});

document.addEventListener('dragleave', () => {
  fileLabel.classList.remove('drag-over');
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  fileLabel.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer?.files || []);
  handleFilesSelected(files);
});

// ── FILE SELECTION HANDLER ──
async function handleFilesSelected(files) {
  clearStatus();
  selectedFiles = [];

  for (const file of files) {
    const error = await validateFile(file);
    if (error) {
      showStatus(`Error: ${error}`, 'error');
      selectedFiles = [];
      previewList.innerHTML = '';
      previewContainer.style.display = 'none';
      mergeBtn.disabled = true;
      return;
    }
    selectedFiles.push({
      file,
      name: file.name,
      size: formatFileSize(file.size)
    });
  }

  renderPreview();
  updateMergeButtonState();
}

async function validateFile(file) {
  // Check MIME type
  if (file.type !== 'application/pdf') {
    return `${file.name} — invalid MIME type (expected application/pdf, got ${file.type})`;
  }

  // Check file size > 0
  if (file.size === 0) {
    return `${file.name} — file is empty`;
  }

  // Check PDF magic bytes (%PDF)
  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const magicBytes = String.fromCharCode(...header);
  if (!magicBytes.startsWith('%PDF')) {
    return `${file.name} — invalid PDF format (missing %PDF header)`;
  }

  return null;
}

// ── PREVIEW RENDERING ──
function renderPreview() {
  previewList.innerHTML = '';
  selectedFiles.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'pdm-preview-item';
    row.innerHTML = `
      <span class="pdm-preview-name">${item.name}</span>
      <span class="pdm-preview-size">${item.size}</span>
      <button class="pdm-preview-remove" aria-label="Remove ${item.name}" data-index="${index}">
        <span class="material-symbols-outlined">close</span>
      </button>
    `;
    previewList.appendChild(row);
  });

  updateSizeDisplay();
  previewContainer.style.display = selectedFiles.length > 0 ? 'block' : 'none';

  // Attach remove listeners
  document.querySelectorAll('.pdm-preview-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      selectedFiles.splice(index, 1);
      renderPreview();
      updateMergeButtonState();
      clearStatus();
    });
  });
}

// ── SIZE DISPLAY ──
function updateSizeDisplay() {
  const totalBytes = getTotalSizeBytes();
  const totalMB = totalBytes / (1024 * 1024);
  totalSizeEl.textContent = formatFileSize(totalBytes);

  // Show warning if >100MB
  if (totalMB > SIZE_LIMIT_MB) {
    sizeWarning.style.display = 'flex';
  } else {
    sizeWarning.style.display = 'none';
  }
}

// ── MERGE BUTTON STATE ──
function updateMergeButtonState() {
  // Require at least 1 PDF
  if (selectedFiles.length >= 1) {
    mergeBtn.disabled = false;
  } else {
    mergeBtn.disabled = true;
    outputSection.style.display = 'none';
  }
}

// ── MERGE BUTTON ──
mergeBtn.addEventListener('click', async () => {
  if (selectedFiles.length === 0) {
    showStatus('No PDFs selected', 'error');
    return;
  }

  await mergePdfs();
});

// ── PDF MERGE LOGIC ──
async function mergePdfs() {
  clearStatus();
  mergeBtn.disabled = true;
  mergeBtn.classList.add('merging');
  mergeBtnText.textContent = 'Merging...';
  outputSection.style.display = 'none';

  try {
    // Create output PDF document
    const outputPdf = await PDFLib.PDFDocument.create();

    // Load and merge each PDF
    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i];
      try {
        const pdfBytes = await item.file.arrayBuffer();
        const inputPdf = await PDFLib.PDFDocument.load(pdfBytes);

        // Copy all pages from input to output
        const pages = await outputPdf.copyPages(inputPdf, inputPdf.getPageIndices());
        pages.forEach(page => {
          outputPdf.addPage(page);
        });
      } catch (err) {
        throw new Error(`Failed to merge: ${item.name} — corrupted or unsupported format`);
      }
    }

    // Save merged PDF to bytes
    mergedPdfBytes = await outputPdf.save();

    // Show output section
    showMergeSuccess();
  } catch (err) {
    showStatus(err.message, 'error');
  } finally {
    mergeBtn.disabled = false;
    mergeBtn.classList.remove('merging');
    mergeBtnText.textContent = 'Merge PDFs';
  }
}

function showMergeSuccess() {
  outputSection.style.display = 'block';
  clearStatus();
  outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── DOWNLOAD BUTTON ──
downloadBtn.addEventListener('click', () => {
  if (!mergedPdfBytes) {
    showStatus('No merged PDF available', 'error');
    return;
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `merged-PDFs-${today}.pdf`;

  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── PRINT BUTTON ──
printBtn.addEventListener('click', () => {
  if (!mergedPdfBytes) {
    showStatus('No merged PDF available', 'error');
    return;
  }

  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
});

// ── RESET ON NEW SELECTION ──
fileInput.addEventListener('change', () => {
  mergedPdfBytes = null;
  outputSection.style.display = 'none';
});