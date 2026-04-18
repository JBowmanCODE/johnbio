const WORKER_URL = 'https://eu-ai-act-worker.ukjbowman.workers.dev';

const form = document.getElementById('eaa-form');
const formSection = document.getElementById('eaa-form-section');
const resultsSection = document.getElementById('eaa-results-section');
const systemTypeSelect = document.getElementById('system-type');
const systemDescriptionGroup = document.getElementById('system-description-group');

systemTypeSelect.addEventListener('change', () => {
    if (systemTypeSelect.value === 'other') {
        systemDescriptionGroup.style.display = 'block';
        document.getElementById('system-description').required = true;
    } else {
        systemDescriptionGroup.style.display = 'none';
        document.getElementById('system-description').required = false;
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        systemType: document.getElementById('system-type').value,
        systemDescription: document.getElementById('system-description').value,
        targetCountry: document.getElementById('target-country').value,
        yourRole: document.getElementById('your-role').value,
    };

    formSection.innerHTML = '<div class="eaa-loading"><div class="eaa-spinner"></div><p>Analyzing your AI system...</p></div>';

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            if (data.code === 'USAGE_LIMIT_EXCEEDED') {
                showUsageLimitExceeded(data);
            } else {
                showError(data.error || 'Assessment failed. Please try again.');
            }
            return;
        }

        showResults(data.classification, data.fullReport, data.isPaid);
    } catch (error) {
        showError(`Error: ${error.message}`);
    }
});

function showResults(classification, fullReport, isPaid) {
    formSection.innerHTML = '';
    resultsSection.style.display = 'block';

    const riskLevelClass = {
        prohibited: 'eaa-risk-prohibited',
        high: 'eaa-risk-high',
        limited: 'eaa-risk-limited',
        minimal: 'eaa-risk-minimal',
    }[classification.level];

    const riskLevelLabel = {
        prohibited: 'PROHIBITED',
        high: 'HIGH-RISK',
        limited: 'LIMITED-RISK',
        minimal: 'MINIMAL-RISK',
    }[classification.level];

    let explanationText = '';
    let flagsHtml = '';

    if (classification.level === 'prohibited') {
        explanationText = `Your AI system appears to fall under the EU AI Act's prohibited categories. These systems cannot be deployed in the EU under any circumstances. You must not proceed with this system in the EU market.`;
        flagsHtml = classification.flags.map(flag => `<li><strong>${flag.title}:</strong> ${flag.description}</li>`).join('');
    } else if (classification.level === 'high') {
        explanationText = `Your AI system is classified as HIGH-RISK under the EU AI Act. This means it requires comprehensive compliance measures including risk management systems, data governance, transparency obligations, human oversight, and technical documentation. Enforcement begins August 2027 but best practice is to start now.`;
        flagsHtml = classification.flags.map(flag => `<li><strong>${flag.title}:</strong> ${flag.description}</li>`).join('');
    } else if (classification.level === 'limited') {
        explanationText = `Your AI system is classified as LIMITED-RISK under the EU AI Act. Primary requirement is transparency: you must disclose to end users that they are interacting with AI and provide clear information about the system's capabilities and limitations.`;
        flagsHtml = classification.flags.map(flag => `<li><strong>${flag.title}:</strong> ${flag.description}</li>`).join('');
    } else {
        explanationText = `Your AI system is classified as MINIMAL-RISK under the EU AI Act. No specific legal compliance requirements apply, though following best practices for AI governance is recommended.`;
        flagsHtml = '<li>No specific legal requirements apply.</li>';
    }

    const resultHtml = `
        <h2>Assessment Results</h2>
        <div class="eaa-risk-badge ${riskLevelClass}">${riskLevelLabel}</div>
        <div class="eaa-result-explanation">
            <h3>What this means</h3>
            <p>${explanationText}</p>
        </div>
        ${flagsHtml ? `<div class="eaa-flags"><h3>Key Compliance Flags</h3><ul>${flagsHtml}</ul></div>` : ''}
        ${!isPaid && fullReport ? `<div style="background: #edf2f7; border-left: 4px solid #4299e1; padding: 20px; border-radius: 4px; margin-bottom: 20px;"><h3 style="margin-top: 0;">Your Full Report (Upgrade to View)</h3><p>${fullReport.substring(0, 150)}...</p></div>` : ''}
    `;

    document.getElementById('eaa-result-content').innerHTML = resultHtml;

    const ctaText = document.getElementById('eaa-cta-text');
    const upgradeBtn = document.getElementById('eaa-upgrade-btn');

    if (!isPaid) {
        ctaText.textContent = 'Want the complete compliance checklist, documentation requirements, and enforcement timeline?';
        upgradeBtn.style.display = 'inline-block';
        upgradeBtn.onclick = () => {
            window.location.href = 'https://buy.stripe.com/YOUR_STRIPE_LINK';
        };
    } else {
        ctaText.innerHTML = `<strong>Full Report</strong><pre>${fullReport}</pre>`;
        upgradeBtn.style.display = 'none';
    }

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showUsageLimitExceeded(data) {
    formSection.innerHTML = `
        <div class="eaa-error">
            <h3>Free Assessment Limit Reached</h3>
            <p>You've used your free assessment for this month. Upgrade to a paid subscription for unlimited assessments, full compliance reports, and document generation.</p>
            <button onclick="window.location.href='https://buy.stripe.com/YOUR_STRIPE_LINK'" class="eaa-button eaa-button-primary">Upgrade Now</button>
        </div>
    `;
}

function showError(message) {
    formSection.innerHTML = `
        <form id="eaa-form">
            <div class="eaa-error">${message}</div>
        </form>
    `;
    form.innerHTML = '<button onclick="location.reload()" class="eaa-button eaa-button-secondary">Try Again</button>';
}

document.getElementById('eaa-new-assessment-btn').addEventListener('click', () => {
    resultsSection.style.display = 'none';
    formSection.innerHTML = '';
    form.reset();
    location.reload();
});
