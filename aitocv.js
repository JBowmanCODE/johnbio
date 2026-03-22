document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('cv-file-input');
    const cvTextArea = document.getElementById('cv-text-area');
    const jobDescriptionArea = document.getElementById('job-description-area');
    const enhanceCvBtn = document.getElementById('enhance-cv-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultsSection = document.getElementById('results-section');
    const downloadDocxBtn = document.getElementById('download-docx-button');
    const downloadPdfBtn = document.getElementById('download-pdf-button');
    const uploadPrompt = document.getElementById('upload-prompt');
    const fileNameDisplay = document.getElementById('file-name-display');
    const coverLetterSection = document.getElementById('cover-letter-section');
    const downloadCoverLetterDocxBtn = document.getElementById('download-cover-letter-docx-button');
    const analysisSection = document.getElementById('analysis-section');
    const suitabilityScoreContainer = document.getElementById('suitability-score-container');
    const missingSkillsContainer = document.getElementById('missing-skills-container');
    const interviewPrepContainer = document.getElementById('interview-prep-container');
    const resetSection = document.getElementById('reset-section');
    const tryAnotherRoleBtn = document.getElementById('try-another-role-button');
    const jobTipElement = document.getElementById('job-tip');
    const progressBar = document.getElementById('progress-bar');
    const errorMessage = document.getElementById('error-message');
    const infoIcon = document.getElementById('info-icon');
    const videoModal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('modal-close-button');

    // Defensive: only grab iframe if modal exists
    const videoIframe = videoModal ? videoModal.querySelector('iframe') : null;
    const originalVideoSrc = videoIframe ? videoIframe.src : '';

    console.log('aitocv.js: DOM loaded, elements found:', {
        fileUploadArea: !!fileUploadArea,
        fileInput: !!fileInput,
        enhanceCvBtn: !!enhanceCvBtn,
        videoModal: !!videoModal,
        videoIframe: !!videoIframe
    });

    // --- State ---
    let enhancedCvText = '';
    let coverLetterText = '';
    let analysisText = '';
    let interviewPrepText = '';
    let progressInterval;
    let tipInterval;

    const jobTips = [
        "Every application you send is a step forward. The right opportunity is out there waiting for you.",
        "You only need one yes. One conversation, one callback, one offer changes everything.",
        "The most successful people in any field faced rejection before they found their breakthrough.",
        "Your next employer is looking for someone exactly like you. Keep going until you find them.",
        "Each cover letter you write makes the next one sharper. You are improving with every attempt.",
        "Job searching is hard work. Be proud of the effort you are putting in every single day.",
        "Confidence is built through action. Every application, every interview makes you stronger.",
        "Setbacks are not the end of the story. They are the part that makes the success more meaningful.",
        "The right role will value everything you bring. Keep showing up and keep believing in yourself.",
        "Progress is not always visible, but it is always happening. Trust the process.",
        "Your experience and skills are genuinely valuable. The right team will recognise that.",
        "Rest when you need to. Taking care of yourself is part of the journey, not a distraction from it."
    ];

    const CV_WORKER_URL = 'https://aitocv.ukjbowman.workers.dev/';

    // --- Error Display ---
    function showError(message, isRateLimit = false) {
        if (!errorMessage) return;
        if (isRateLimit) {
            errorMessage.innerHTML = `
                <span style="font-size:1.3rem;">&#x23F3;</span>
                <strong>Daily limit reached</strong><br>${message}
            `;
            errorMessage.style.backgroundColor = '#fff3cd';
            errorMessage.style.borderColor = '#ffc107';
            errorMessage.style.color = '#856404';
        } else {
            errorMessage.textContent = message;
            errorMessage.style.backgroundColor = '';
            errorMessage.style.borderColor = '';
            errorMessage.style.color = '';
            setTimeout(() => errorMessage.classList.add('hidden'), 6000);
        }
        errorMessage.classList.remove('hidden');
    }

    // --- File Upload ---
    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', () => {
            console.log('Upload area clicked');
            if (fileInput) fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleFile(e.target.files[0]);
        });
    }

    async function handleFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (uploadPrompt) uploadPrompt.classList.add('hidden');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = `Selected: ${file.name}`;
            fileNameDisplay.classList.remove('hidden');
        }
        try {
            let text = '';
            if (fileExtension === 'txt') {
                text = await file.text();
            } else if (fileExtension === 'docx') {
                if (typeof mammoth === 'undefined') throw new Error('mammoth not loaded');
                text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
            } else if (fileExtension === 'pdf') {
                if (typeof pdfjsLib === 'undefined') throw new Error('pdfjsLib not loaded');
                const pdf = await pdfjsLib.getDocument({
                    data: await file.arrayBuffer(),
                    cMapUrl: 'https://unpkg.com/pdfjs-dist@2.11.338/cmaps/',
                    cMapPacked: true,
                }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(' ') + '\n';
                }
                text = fullText;
            } else {
                showError('Unsupported file type. Please use .docx, .pdf, or .txt.');
                resetUploadArea();
                return;
            }
            if (cvTextArea) cvTextArea.value = text;
        } catch (error) {
            console.error('Error reading file:', error);
            showError('There was an error reading your file. Please try again.');
            resetUploadArea();
        }
    }

    function resetUploadArea() {
        if (uploadPrompt) uploadPrompt.classList.remove('hidden');
        if (fileNameDisplay) fileNameDisplay.classList.add('hidden');
        if (fileInput) fileInput.value = '';
    }

    // --- Enhance Button ---
    if (enhanceCvBtn) {
        enhanceCvBtn.addEventListener('click', async () => {
            const cv = cvTextArea ? cvTextArea.value.trim() : '';
            const jobDesc = jobDescriptionArea ? jobDescriptionArea.value.trim() : '';

            if (!cv || !jobDesc) {
                showError('Please provide both your CV and the job description.');
                return;
            }

            if (errorMessage) errorMessage.classList.add('hidden');
            if (loadingIndicator) loadingIndicator.classList.remove('hidden');

            const toolContent = document.querySelector('.tool-content');
            const toolFooter = document.querySelector('.tool-footer');
            if (toolContent) toolContent.classList.add('hidden');
            if (toolFooter) toolFooter.classList.add('hidden');
            if (resultsSection) resultsSection.classList.add('hidden');
            if (coverLetterSection) coverLetterSection.classList.add('hidden');
            if (analysisSection) analysisSection.classList.add('hidden');
            if (resetSection) resetSection.classList.add('hidden');

            enhanceCvBtn.disabled = true;
            if (progressBar) progressBar.style.width = '0%';

            const showRandomTip = () => {
                if (jobTipElement) {
                    jobTipElement.textContent = jobTips[Math.floor(Math.random() * jobTips.length)];
                }
            };
            showRandomTip();
            tipInterval = setInterval(showRandomTip, 2500);

            let progress = 0;
            progressInterval = setInterval(() => {
                progress += Math.random() * 5;
                if (progress > 95) { progress = 95; clearInterval(progressInterval); }
                if (progressBar) progressBar.style.width = progress + '%';
            }, 400);

            try {
                const response = await fetch(CV_WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cv, jobDescription: jobDesc }),
                });

                if (response.status === 429) {
                    const data = await response.json().catch(() => ({}));
                    const msg = data?.error?.friendly ||
                        "You\u2019ve used all 20 free CV enhancements for today. The limit resets at midnight UTC \u2014 come back tomorrow!";
                    throw { isRateLimit: true, message: msg };
                }

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data?.error?.message || `Something went wrong (HTTP ${response.status}). Please try again.`);
                }

                const data = await response.json();

                clearInterval(progressInterval);
                clearInterval(tipInterval);
                if (progressBar) progressBar.style.width = '100%';

                const cleanText = (text) => (text || '').replace(/^\*\*ACTION.*?\*\*$/gm, '').trim();

                enhancedCvText = cleanText(data.enhancedCv);
                coverLetterText = cleanText(data.coverLetter);
                analysisText = cleanText(data.analysis);
                interviewPrepText = cleanText(data.interviewPrep);

                setTimeout(() => {
                    if (loadingIndicator) loadingIndicator.classList.add('hidden');
                    if (resultsSection) resultsSection.classList.remove('hidden');
                    if (coverLetterText && coverLetterText.length > 10 && coverLetterSection) {
                        coverLetterSection.classList.remove('hidden');
                    }
                    if (analysisText && interviewPrepText) {
                        displayAnalysisAndPrep();
                        if (analysisSection) analysisSection.classList.remove('hidden');
                    }
                    if (resetSection) resetSection.classList.remove('hidden');
                }, 500);

            } catch (error) {
                clearInterval(progressInterval);
                clearInterval(tipInterval);
                if (progressBar) progressBar.style.width = '0%';

                if (error.isRateLimit) {
                    showError(error.message, true);
                } else {
                    console.error('Error:', error);
                    showError(error.message || 'An unexpected error occurred. Please try again.');
                }

                setTimeout(() => {
                    if (loadingIndicator) loadingIndicator.classList.add('hidden');
                    const toolContent = document.querySelector('.tool-content');
                    const toolFooter = document.querySelector('.tool-footer');
                    if (toolContent) toolContent.classList.remove('hidden');
                    if (toolFooter) toolFooter.classList.remove('hidden');
                }, 500);

            } finally {
                enhanceCvBtn.disabled = false;
                clearInterval(progressInterval);
                clearInterval(tipInterval);
            }
        });
    }

    // --- Try Another Role ---
    if (tryAnotherRoleBtn) {
        tryAnotherRoleBtn.addEventListener('click', () => {
            if (resultsSection) resultsSection.classList.add('hidden');
            if (coverLetterSection) coverLetterSection.classList.add('hidden');
            if (analysisSection) analysisSection.classList.add('hidden');
            if (resetSection) resetSection.classList.add('hidden');
            if (errorMessage) errorMessage.classList.add('hidden');
            const toolContent = document.querySelector('.tool-content');
            const toolFooter = document.querySelector('.tool-footer');
            if (toolContent) toolContent.classList.remove('hidden');
            if (toolFooter) toolFooter.classList.remove('hidden');
            if (jobDescriptionArea) jobDescriptionArea.value = '';
            const toolHeader = document.querySelector('.tool-header');
            if (toolHeader) toolHeader.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Video Modal ---
    if (infoIcon && videoModal) {
        infoIcon.addEventListener('click', () => {
            videoModal.classList.remove('hidden');
            videoModal.classList.add('visible');
        });
    }

    const closeModal = () => {
        if (!videoModal) return;
        videoModal.classList.add('hidden');
        videoModal.classList.remove('visible');
        if (videoIframe) videoIframe.src = originalVideoSrc;
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
    }

    // --- Accordion ---
    const accordionToggle = document.querySelector('.accordion-toggle');
    if (accordionToggle) {
        accordionToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    }

    // --- Analysis Display ---
    function displayAnalysisAndPrep() {
        if (suitabilityScoreContainer) suitabilityScoreContainer.innerHTML = '';
        if (missingSkillsContainer) missingSkillsContainer.innerHTML = '';
        if (interviewPrepContainer) interviewPrepContainer.innerHTML = '';

        const scoreMatch = analysisText.match(/SCORE:\s*(.*?)(?:\n|$)/);
        const scoreAnalysisMatch = analysisText.match(/SCORE_ANALYSIS:\s*(.*?)(?:\n|$)/s);
        const missingSkillsMatch = analysisText.match(/MISSING_SKILLS:\s*([\s\S]*)/);

        const scoreRaw = scoreMatch ? scoreMatch[1].trim() : null;
        const score = scoreRaw ? scoreRaw.split('/')[0].trim() : null;
        const scoreNum = score ? parseFloat(score) : null;
        const scoreAnalysis = scoreAnalysisMatch ? scoreAnalysisMatch[1].trim() : '';
        const missingSkills = missingSkillsMatch ? missingSkillsMatch[1].trim() : '';

        // Score colour
        let scoreColor = '#e85d2f';
        if (scoreNum !== null) {
            if (scoreNum >= 8) scoreColor = '#16a34a';
            else if (scoreNum >= 5) scoreColor = '#d97706';
        }

        if (score && suitabilityScoreContainer) {
            suitabilityScoreContainer.innerHTML = `
                <div class="score-header">
                    <div class="score-badge" style="border-color:${scoreColor};background:${scoreColor}18">
                        <span class="score-num" style="color:${scoreColor}">${score}</span>
                        <span class="score-denom">out of 10</span>
                    </div>
                    <div class="score-text">
                        <h3>Suitability Score</h3>
                        <p>${scoreAnalysis}</p>
                    </div>
                </div>
            `;
        }
        if (missingSkills && missingSkillsContainer) {
            missingSkillsContainer.innerHTML = `
                <h3>Skills to Highlight</h3>
                <p>${missingSkills.replace(/\n/g, '<br>')}</p>
            `;
        }
        if (interviewPrepContainer) {
            const formatted = interviewPrepText
                .replace(/###\s*(.*)/g, '<h4 style="font-family:DM Serif Display,serif;font-size:1.05rem;color:#1c1917;margin:20px 0 10px;font-weight:400">$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^\* (.+)$/gm, '<li style="margin-bottom:6px">$1</li>')
                .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left:18px;margin:8px 0">$&</ul>')
                .replace(/\n/g, '<br>');
            interviewPrepContainer.innerHTML = `<h3>Interview Preparation</h3>${formatted}`;
        }
    }

    // --- CV Parser ---
    function parseCvForGeneration(text) {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        const sections = [];
        let currentSection = null;

        let firstSectionIndex = lines.findIndex(line => line.trim().startsWith('## '));
        if (firstSectionIndex === -1) firstSectionIndex = lines.length;

        const headerLines = lines.slice(0, firstSectionIndex).filter(l => l.trim() !== '');
        const name = headerLines[0] || '';
        const contact = headerLines[1] || '';
        const tagline = headerLines[2] || '';
        const bodyLines = lines.slice(firstSectionIndex);

        bodyLines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('## ')) {
                if (currentSection) {
                    currentSection.content = currentSection.content.trim();
                    sections.push(currentSection);
                }
                currentSection = { title: trimmedLine.replace(/^##\s*/, ''), content: '' };
            } else if (currentSection) {
                currentSection.content += line + '\n';
            }
        });

        if (currentSection) {
            currentSection.content = currentSection.content.trim();
            sections.push(currentSection);
        }

        return { name: name.trim(), contact: contact.trim(), tagline: tagline.trim(), sections };
    }

    // --- DOCX Generator ---
    function createDocxDocument(cvData) {
        const { Document, Paragraph, TextRun, AlignmentType, ExternalHyperlink, convertInchesToTwip } = window.docx;
        const elements = [];

        // Name
        elements.push(new Paragraph({
            children: [new TextRun({ text: cvData.name, bold: true, size: 52, font: "Calibri", color: "1a1a2e" })],
            alignment: AlignmentType.CENTER, spacing: { after: 80 }
        }));

        // Contact line with clickable LinkedIn
        const contactParts = cvData.contact.split('|').map(p => p.trim());
        const contactChildren = [];
        contactParts.forEach((part, i) => {
            const isLinkedIn = part.toLowerCase().includes('linkedin');
            const sep = i < contactParts.length - 1 ? '  |  ' : '';
            if (isLinkedIn) {
                const href = part.startsWith('http') ? part : 'https://' + part;
                contactChildren.push(new ExternalHyperlink({
                    link: href,
                    children: [new TextRun({ text: part, size: 20, font: "Calibri", color: "0d6efd", underline: { type: "single" } })]
                }));
                if (sep) contactChildren.push(new TextRun({ text: sep, size: 20, font: "Calibri", color: "595959" }));
            } else {
                contactChildren.push(new TextRun({ text: part + sep, size: 20, font: "Calibri", color: "595959" }));
            }
        });
        elements.push(new Paragraph({ children: contactChildren, alignment: AlignmentType.CENTER, spacing: { after: 60 } }));

        // Tagline
        if (cvData.tagline) {
            elements.push(new Paragraph({
                children: [new TextRun({ text: cvData.tagline, size: 20, font: "Calibri", color: "444444", italics: true })],
                alignment: AlignmentType.CENTER, spacing: { after: 300 }
            }));
        }

        // Sections
        cvData.sections.forEach(section => {
            elements.push(new Paragraph({
                children: [new TextRun({ text: section.title.toUpperCase(), bold: true, size: 22, color: "2F5496", font: "Calibri" })],
                spacing: { before: 300, after: 120 },
                border: { bottom: { color: "2F5496", space: 1, value: "single", size: 4 } }
            }));

            const contentLines = section.content.split('\n').filter(l => l.trim() !== '');
            const profileSections = ['PROFILE', 'SUMMARY', 'PROFESSIONAL SUMMARY'];

            if (profileSections.includes(section.title.toUpperCase())) {
                contentLines.forEach(line => elements.push(new Paragraph({
                    children: [new TextRun({ text: line.trim(), size: 20, font: "Calibri" })],
                    spacing: { after: 150 }
                })));
            } else {
                contentLines.forEach(line => {
                    line = line.trim();
                    if (line.startsWith('**')) {
                        // Company line: bold name | normal location & dates
                        const compRaw = fixDates(line.replace(/\*\*/g, '').trim());
                        const compParts = compRaw.split('|').map(p => p.trim());
                        const children = [];
                        compParts.forEach((part, i) => {
                            if (i === 0) {
                                children.push(new TextRun({ text: part, bold: true, size: 21, font: "Calibri", color: "1a1a2e" }));
                            } else {
                                children.push(new TextRun({ text: '  |  ' + part, size: 19, font: "Calibri", color: "595959" }));
                            }
                        });
                        elements.push(new Paragraph({ children, spacing: { before: 180, after: 40 } }));
                    } else if (line.startsWith('* ')) {
                        elements.push(new Paragraph({
                            children: [new TextRun({ text: line.substring(2), size: 20, font: "Calibri" })],
                            bullet: { level: 0 },
                            indent: { left: convertInchesToTwip(0.25) },
                            spacing: { after: 80 }
                        }));
                    } else if (line.startsWith('###')) {
                        // skip
                    } else if (line.includes(':') && !line.startsWith('http')) {
                        // Expertise line: bold label before colon, normal rest
                        const colonIdx = line.indexOf(':');
                        const label = line.substring(0, colonIdx + 1);
                        const rest = line.substring(colonIdx + 1);
                        elements.push(new Paragraph({
                            children: [
                                new TextRun({ text: label, bold: true, size: 20, font: "Calibri" }),
                                new TextRun({ text: rest, size: 20, font: "Calibri" })
                            ],
                            spacing: { after: 80 }
                        }));
                    } else {
                        const isDate = /\d{4}|present/i.test(line);
                        elements.push(new Paragraph({
                            children: [new TextRun({ text: line, size: 20, font: "Calibri", italics: isDate, color: isDate ? "595959" : "1a1a2e" })],
                            spacing: { after: 60 }
                        }));
                    }
                });
            }
        });

        return new Document({
            sections: [{
                properties: { page: { margins: { top: 900, right: 900, bottom: 900, left: 900 } } },
                children: elements
            }]
        });
    }

    function createCoverLetterDocx(text) {
        const { Document, Paragraph, TextRun } = window.docx;
        const paragraphs = text.split('\n\n').map(p => new Paragraph({ children: [new TextRun({ text: p, size: 22, font: "Calibri" })], spacing: { after: 200 } }));
        return new Document({ sections: [{ properties: { page: { margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } }, children: paragraphs }] });
    }

    function sanitizeForPdf(text) {
        if (!text) return '';
        return text.replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, '');
    }

    // Fix dates that got concatenated without a separator
    // e.g. "July 2022Present" -> "July 2022 - Present"
    //      "April 2017July 2022" -> "April 2017 - July 2022"
    //      "20042010" -> "2004 - 2010"
    function fixDates(text) {
        if (!text) return text;
        const months = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
        // "2022Present" or "2022present"
        text = text.replace(/(\d{4})(Present)/gi, '$1 - $2');
        // "July 2022Present"
        text = text.replace(/((?:' + months + ')\s+\d{4})(Present)/gi, '$1 - $2');
        // "April 2017July 2022" — month immediately follows a year
        text = text.replace(new RegExp('(\\d{4})(' + months + ')', 'g'), '$1 - $2');
        // "20042010" — four digits immediately followed by four digits
        text = text.replace(/(\d{4})(\d{4})/g, '$1 - $2');
        return text;
    }

    function nativeSaveAs(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    }

    // --- Download Handlers ---
    if (downloadDocxBtn) {
        downloadDocxBtn.addEventListener('click', () => {
            if (!enhancedCvText) return showError('No CV text available to download.');
            const cvData = parseCvForGeneration(enhancedCvText);
            const personName = cvData.name ? cvData.name.trim().replace(/\s+/g, '_') : 'Enhanced';
            const doc = createDocxDocument(cvData);
            window.docx.Packer.toBlob(doc).then(blob => nativeSaveAs(blob, `${personName}_CV.docx`));
        });
    }

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            if (!enhancedCvText) return showError('No CV text available to download.');
            const cvData = parseCvForGeneration(enhancedCvText);
            const personName = cvData.name ? cvData.name.trim().replace(/\s+/g, '_') : 'Enhanced';
            const fileName = `${personName}_CV.pdf`;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const margin = 14;
            const maxWidth = pageW - margin * 2;
            let y = 18;

            // ── FONTS & SIZES ──────────────────────────────────────────────
            const FS = { name: 22, tagline: 9.5, contact: 9, heading: 10, company: 9.5, jobtitle: 9, body: 9, bullet: 9 };
            const COL = {
                name: [26, 26, 46],
                heading: [47, 84, 150],
                company: [26, 26, 46],
                contact: [90, 90, 90],
                tagline: [80, 80, 80],
                body: [30, 30, 30],
                link: [13, 110, 253]
            };

            function checkBreak(h) {
                if (y + h > pageH - margin) { doc.addPage(); y = margin; }
            }

            // ── NAME ──────────────────────────────────────────────────────
            doc.setFont('helvetica', 'bold').setFontSize(FS.name).setTextColor(...COL.name);
            doc.text(sanitizeForPdf(cvData.name), pageW / 2, y, { align: 'center' });
            y += 7;

            // ── CONTACT with clickable LinkedIn ───────────────────────────
            doc.setFont('helvetica', 'normal').setFontSize(FS.contact).setTextColor(...COL.contact);
            const contactParts = cvData.contact.split('|').map(p => p.trim()).filter(Boolean);
            if (contactParts.length > 0) {
                // Build full contact string to measure total width for centering
                const fullContactText = contactParts.join('  |  ');
                const totalW = doc.getTextWidth(fullContactText);
                let cx = (pageW - totalW) / 2;
                contactParts.forEach((part, i) => {
                    const isLinkedIn = part.toLowerCase().includes('linkedin');
                    const sep = i < contactParts.length - 1 ? '  |  ' : '';
                    const partW = doc.getTextWidth(part);
                    const sepW = doc.getTextWidth(sep);
                    if (isLinkedIn) {
                        doc.setTextColor(...COL.link);
                        const href = part.startsWith('http') ? part : 'https://' + part;
                        doc.textWithLink(sanitizeForPdf(part), cx, y, { url: href });
                        doc.setTextColor(...COL.contact);
                    } else {
                        doc.text(sanitizeForPdf(part), cx, y);
                    }
                    if (sep) doc.text(sep, cx + partW, y);
                    cx += partW + sepW;
                });
                y += 5;
            }

            // ── TAGLINE ───────────────────────────────────────────────────
            if (cvData.tagline) {
                doc.setFont('helvetica', 'italic').setFontSize(FS.tagline).setTextColor(...COL.tagline);
                doc.text(sanitizeForPdf(cvData.tagline), pageW / 2, y, { align: 'center' });
                y += 5;
            }

            // ── DIVIDER ───────────────────────────────────────────────────
            doc.setLineWidth(0.5).setDrawColor(...COL.heading).line(margin, y, pageW - margin, y);
            y += 6;

            // ── SECTIONS ─────────────────────────────────────────────────
            const PROFILE_SECTIONS = ['PROFILE', 'SUMMARY', 'PROFESSIONAL SUMMARY'];

            cvData.sections.forEach(section => {
                checkBreak(14);

                // Section heading
                doc.setFont('helvetica', 'bold').setFontSize(FS.heading).setTextColor(...COL.heading);
                doc.text(sanitizeForPdf(section.title.toUpperCase()), margin, y);
                y += 1.5;
                doc.setLineWidth(0.3).setDrawColor(...COL.heading).line(margin, y, pageW - margin, y);
                y += 4;

                const contentLines = section.content.split('\n').filter(l => l.trim() !== '');

                if (PROFILE_SECTIONS.includes(section.title.toUpperCase())) {
                    doc.setFont('helvetica', 'normal').setFontSize(FS.body).setTextColor(...COL.body);
                    const wrapped = doc.splitTextToSize(sanitizeForPdf(contentLines.join(' ')), maxWidth);
                    checkBreak(wrapped.length * 4.5);
                    doc.text(wrapped, margin, y, { lineHeightFactor: 1.4 });
                    y += doc.getTextDimensions(wrapped, { fontSize: FS.body }).h * 1.4 + 2;
                } else {
                    contentLines.forEach(line => {
                        line = line.trim();
                        if (!line || line.startsWith('###')) return;

                        checkBreak(7);

                        if (line.startsWith('**')) {
                            // Company/employer line — bold name, normal dates
                            y += 2.5;
                            const compRaw = fixDates(line.replace(/\*\*/g, '').trim());
                            // Split into parts by |
                            const compParts = compRaw.split('|').map(p => p.trim());
                            // First part = company name (bold), rest = location + dates (normal smaller)
                            const compName = sanitizeForPdf(compParts[0]);
                            const compMeta = compParts.slice(1).map(p => sanitizeForPdf(p)).join('  |  ');
                            // Render company name bold
                            doc.setFont('helvetica', 'bold').setFontSize(FS.company).setTextColor(...COL.company);
                            const nameW = doc.getTextWidth(compName);
                            const nameLines = doc.splitTextToSize(compName, maxWidth);
                            doc.text(nameLines, margin, y);
                            // If everything fits on one line, render meta inline after name
                            if (compMeta && nameLines.length === 1 && nameW + doc.getTextWidth('  |  ' + compMeta) < maxWidth) {
                                doc.setFont('helvetica', 'normal').setFontSize(FS.body - 0.5).setTextColor(...COL.contact);
                                doc.text('  |  ' + compMeta, margin + nameW, y);
                                y += 5;
                            } else if (compMeta) {
                                y += 4.5;
                                doc.setFont('helvetica', 'normal').setFontSize(FS.body - 0.5).setTextColor(...COL.contact);
                                doc.text(compMeta, margin, y);
                                y += 4;
                            } else {
                                y += nameLines.length * 4.5 + 0.5;
                            }
                        } else if (line.startsWith('* ')) {
                            // Bullet point
                            const bulletText = sanitizeForPdf(line.substring(2));
                            const wrapped = doc.splitTextToSize(bulletText, maxWidth - 6);
                            doc.setFont('helvetica', 'normal').setFontSize(FS.bullet).setTextColor(...COL.body);
                            doc.text('\u2022', margin + 1.5, y + 0.5);
                            doc.text(wrapped, margin + 5, y, { lineHeightFactor: 1.35 });
                            y += doc.getTextDimensions(wrapped, { fontSize: FS.bullet }).h * 1.35 + 1.5;
                        } else {
                            // Job title or plain line — check if it's an expertise label (contains colon)
                            const isExpertiseLine = line.includes(':') && !line.startsWith('http');
                            const isDate = /\u2013|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}/i.test(line) && !line.includes(':');
                            if (isExpertiseLine) {
                                // Render "Label:" in bold, rest in normal
                                const colonIdx = line.indexOf(':');
                                const label = sanitizeForPdf(line.substring(0, colonIdx + 1));
                                const rest = sanitizeForPdf(line.substring(colonIdx + 1));
                                doc.setFont('helvetica', 'bold').setFontSize(FS.body).setTextColor(...COL.body);
                                const labelW = doc.getTextWidth(label);
                                // Wrap the full line but render in two passes
                                const fullWrapped = doc.splitTextToSize(label + rest, maxWidth);
                                if (fullWrapped.length === 1) {
                                    // Single line — render label bold then rest normal
                                    doc.text(label, margin, y);
                                    doc.setFont('helvetica', 'normal').setFontSize(FS.body).setTextColor(...COL.body);
                                    doc.text(rest, margin + labelW, y);
                                } else {
                                    // Multi-line — render first line with bold label, rest normal
                                    doc.text(label, margin, y);
                                    const firstLineRest = fullWrapped[0].substring(label.length);
                                    doc.setFont('helvetica', 'normal').setFontSize(FS.body).setTextColor(...COL.body);
                                    if (firstLineRest) doc.text(firstLineRest, margin + labelW, y);
                                    for (let li = 1; li < fullWrapped.length; li++) {
                                        y += 4.2;
                                        doc.text(fullWrapped[li], margin, y);
                                    }
                                }
                                y += doc.getTextDimensions(fullWrapped, { fontSize: FS.body }).h * 1.3 + 1;
                            } else if (isDate) {
                                doc.setFont('helvetica', 'italic').setFontSize(FS.body - 0.5).setTextColor(...COL.contact);
                                const wrapped = doc.splitTextToSize(sanitizeForPdf(line), maxWidth);
                                doc.text(wrapped, margin, y);
                                y += doc.getTextDimensions(wrapped, { fontSize: FS.body }).h + 1;
                            } else {
                                doc.setFont('helvetica', 'normal').setFontSize(FS.jobtitle).setTextColor(...COL.body);
                                const wrapped = doc.splitTextToSize(sanitizeForPdf(line), maxWidth);
                                doc.text(wrapped, margin, y);
                                y += doc.getTextDimensions(wrapped, { fontSize: FS.jobtitle }).h + 1.5;
                            }
                        }
                    });
                }
                y += 3;
            });

            doc.save(fileName);
        });
    }
    if (downloadCoverLetterDocxBtn) {
        downloadCoverLetterDocxBtn.addEventListener('click', () => {
            if (!coverLetterText) return showError('No cover letter text available.');
            const cvData = parseCvForGeneration(enhancedCvText);
            const personName = cvData.name ? cvData.name.trim().replace(/\s+/g, '_') : 'Cover_Letter';
            const doc = createCoverLetterDocx(coverLetterText);
            window.docx.Packer.toBlob(doc).then(blob => nativeSaveAs(blob, `${personName}_Cover_Letter.docx`));
        });
    }


    // ── SUITABLE ROLES FEATURE ────────────────────────────────────────────
    const findRolesBtn = document.getElementById('find-roles-btn');
    const rolesLoading = document.getElementById('roles-loading');
    const rolesResults = document.getElementById('roles-results');
    const rolesError = document.getElementById('roles-error');

    if (findRolesBtn) {
        findRolesBtn.addEventListener('click', async () => {
            // Use the CV text from the main textarea at the top of the page
            const cvText = cvTextArea ? cvTextArea.value.trim() : '';
            if (!cvText) {
                if (rolesError) rolesError.classList.remove('hidden');
                return;
            }
            if (rolesError) rolesError.classList.add('hidden');
            findRolesBtn.disabled = true;
            if (rolesLoading) rolesLoading.classList.remove('hidden');
            if (rolesResults) rolesResults.classList.add('hidden');

            try {
                const rolesPrompt = `You are a career adviser. Based on the CV below, identify the top 10 most suitable job roles this person should apply for.

For each role return ONLY valid JSON — an array of 10 objects with these exact keys:
- "rank": number 1-10
- "title": job title (concise, real job title e.g. "Head of AI Strategy")
- "reason": one sentence explaining why it fits their background (max 18 words)

Return ONLY the JSON array. No markdown, no explanation, no backticks.

CV:
${cvText}`;

                const response = await fetch(CV_WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rolesOnly: true, cv: cvText, rolesPrompt })
                });

                const data = await response.json();
                const text = data.rolesJson || data.enhancedCv || '';
                let roles = [];
                try {
                    roles = JSON.parse(text);
                } catch(e) {
                    const match = text.match(/\[.*\]/s);
                    if (match) roles = JSON.parse(match[0]);
                }

                if (!Array.isArray(roles) || roles.length === 0) throw new Error('No roles returned');

                if (rolesResults) {
                    rolesResults.innerHTML = roles.map(r => `
                        <div class="role-chip" data-role="${escapeAttr(r.title)}" title="Click to search this role on all job boards">
                            <div class="role-num">#${r.rank}</div>
                            <div class="role-title">${escapeHtml(r.title)}</div>
                            <div class="role-reason">${escapeHtml(r.reason)}</div>
                            <div class="role-search-hint">Click to search all boards &rarr;</div>
                        </div>
                    `).join('');
                    rolesResults.classList.remove('hidden');

                    // Clicking a role chip populates search and triggers search
                    rolesResults.querySelectorAll('.role-chip').forEach(chip => {
                        chip.addEventListener('click', () => {
                            const role = chip.getAttribute('data-role');
                            const searchInput = document.getElementById('job-search-input');
                            if (searchInput) {
                                searchInput.value = role;
                                searchInput.dispatchEvent(new Event('input'));
                                // Scroll to job boards
                                document.getElementById('job-boards-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                // Trigger search after scroll
                                setTimeout(() => {
                                    document.getElementById('job-search-btn')?.click();
                                }, 600);
                            }
                        });
                    });
                }

            } catch(err) {
                console.error('Roles error:', err);
                if (rolesResults) {
                    rolesResults.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;grid-column:1/-1">Sorry, something went wrong. Please try again.</p>';
                    rolesResults.classList.remove('hidden');
                }
            } finally {
                findRolesBtn.disabled = false;
                if (rolesLoading) rolesLoading.classList.add('hidden');
            }
        });
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function escapeAttr(str) {
        return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ── JOB BOARD SEARCH FEATURE ──────────────────────────────────────────
    const jobSearchInput = document.getElementById('job-search-input');
    const jobSearchBtn = document.getElementById('job-search-btn');
    const jobBoardsGrid = document.getElementById('job-boards-grid');

    function buildSearchUrl(template, query) {
        const q = encodeURIComponent(query);
        const qPlus = query.trim().replace(/\s+/g, '+');
        const qSlug = query.trim().toLowerCase().replace(/\s+/g, '-');
        return template
            .replace('{q}', q)
            .replace('{q+}', qPlus)
            .replace('{q%20}', encodeURIComponent(query))
            .replace('{slug}', qSlug);
    }

    function doJobSearch() {
        const query = jobSearchInput ? jobSearchInput.value.trim() : '';
        if (!query || !jobBoardsGrid) return;

        const links = jobBoardsGrid.querySelectorAll('a[data-search]');
        links.forEach(a => {
            const url = buildSearchUrl(a.getAttribute('data-search'), query);
            a.href = url;
            a.classList.add('searched');
        });
    }

    if (jobSearchBtn) {
        jobSearchBtn.addEventListener('click', () => {
            doJobSearch();
            const query = jobSearchInput ? jobSearchInput.value.trim() : '';
            if (!query) return;
            if (jobBoardsGrid) {
                const boards = jobBoardsGrid.querySelectorAll('a[data-search]');
                const overlay = document.getElementById('job-boards-confirm');
                const bodyEl  = document.getElementById('confirm-body');
                const okBtn   = document.getElementById('confirm-ok');
                const cancelBtn = document.getElementById('confirm-cancel');
                if (overlay && bodyEl && okBtn && cancelBtn) {
                    bodyEl.textContent = `This will open ${boards.length} job board tabs in your browser.`;
                    overlay.classList.remove('hidden');
                    const close = () => overlay.classList.add('hidden');
                    okBtn.onclick = () => {
                        close();
                        boards.forEach(a => window.open(a.href, '_blank', 'noopener,noreferrer'));
                    };
                    cancelBtn.onclick = close;
                    overlay.onclick = (e) => { if (e.target === overlay) close(); };
                }
            }
        });
    }

    if (jobSearchInput) {
        jobSearchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                doJobSearch();
                jobSearchBtn?.click();
            }
        });
        // Live-update hrefs as user types
        jobSearchInput.addEventListener('input', () => doJobSearch());
    }


    console.log('aitocv.js: all listeners attached successfully');
});