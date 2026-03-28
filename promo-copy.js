document.addEventListener('DOMContentLoaded', function () {
  const promoInput    = document.getElementById('pc-promo-input');
  const marketSelect  = document.getElementById('pc-market');
  const channelSelect = document.getElementById('pc-channel');
  const toneSelect    = document.getElementById('pc-tone');
  const generateBtn   = document.getElementById('pc-generate-btn');
  const outputWrap    = document.getElementById('pc-output-wrap');
  const statusEl      = document.getElementById('pc-status');

  generateBtn.addEventListener('click', generate);

  async function generate() {
    const promoDesc = promoInput.value.trim();
    if (!promoDesc) {
      alert('Please describe your promotion first.');
      return;
    }

    const market  = marketSelect.value;
    const channel = channelSelect.value;
    const tone    = toneSelect.value;

    generateBtn.disabled = true;
    outputWrap.innerHTML = '';
    statusEl.textContent = 'Generating your copy...';
    statusEl.style.display = 'block';

    try {
      const response = await fetch('https://promo-copy-worker.ukjbowman.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoDesc, market, channel, tone }),
      });

      if (response.status === 429) {
        statusEl.textContent = "You've hit the daily limit for generations. It resets at midnight UTC — come back tomorrow!";
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      statusEl.style.display = 'none';
      renderOutput(data.generatedCopy, data.disclaimer);

    } catch (error) {
      statusEl.textContent = 'Could not connect to the generation service. Please check your connection and try again.';
    } finally {
      generateBtn.disabled = false;
    }
  }

  function renderOutput(rawText, disclaimer) {
    outputWrap.innerHTML = '';

    // Check for a blocking compliance flag first
    const complianceFlagMatch = rawText.match(/COMPLIANCE FLAG\s*:\s*([\s\S]+)/i);
    if (complianceFlagMatch) {
      outputWrap.appendChild(buildComplianceFlagBlock(complianceFlagMatch[1].trim()));
      outputWrap.appendChild(buildToolLimitationNotice());
      return;
    }

    // Check for a compliance check / warning section (non-blocking)
    const complianceCheckMatch = rawText.match(/COMPLIANCE CHECK\s*:\s*([\s\S]*?)(?=HEADLINE\s*:|$)/i);
    if (complianceCheckMatch && complianceCheckMatch[1].trim()) {
      const checkText = complianceCheckMatch[1].trim();
      // Only show as a warning if it contains actual concerns (not just "no issues")
      if (!/no (red flags|issues|concerns|problems)/i.test(checkText) && checkText.length > 20) {
        outputWrap.appendChild(buildComplianceWarningBlock(checkText));
      }
    }

    // Parse copy sections
    const sections = [
      { key: 'HEADLINE',    label: 'Headline' },
      { key: 'BODY COPY',   label: 'Body Copy' },
      { key: 'CTA',         label: 'Call to Action' },
      { key: 'T&C SUMMARY', label: 'T&C Summary' },
    ];

    sections.forEach(function (section) {
      const regex = new RegExp(section.key + '\\s*:\\s*([\\s\\S]*?)(?=(?:COMPLIANCE CHECK|HEADLINE|BODY COPY|CTA|T&C SUMMARY|DISCLAIMER)\\s*:|$)', 'i');
      const match = rawText.match(regex);
      if (match && match[1].trim()) {
        const block = buildCopyBlock(section.label, match[1].trim(), true);
        outputWrap.appendChild(block);
        if (section.key === 'T&C SUMMARY') {
          outputWrap.appendChild(buildTCLinkReminder());
        }
      }
    });

    // Disclaimer
    if (disclaimer) {
      outputWrap.appendChild(buildDisclaimerBlock(disclaimer));
      outputWrap.appendChild(buildTCLinkReminder());
    }

    // Always append the tool limitation notice
    outputWrap.appendChild(buildToolLimitationNotice());
  }

  function buildComplianceFlagBlock(text) {
    const block = document.createElement('div');
    block.className = 'pc-compliance-flag';
    block.innerHTML = '<span class="pc-compliance-flag-label">Compliance Flag — Copy Not Generated</span><p class="pc-compliance-flag-text">' + escHtml(text) + '</p>';
    return block;
  }

  function buildComplianceWarningBlock(text) {
    const block = document.createElement('div');
    block.className = 'pc-compliance-warning';
    block.innerHTML = '<span class="pc-compliance-warning-label">Compliance Notes</span><p class="pc-compliance-warning-text">' + escHtml(text) + '</p>';
    return block;
  }

  function buildTCLinkReminder() {
    const el = document.createElement('p');
    el.className = 'pc-tc-link-reminder';
    el.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">link</span> Remember to hyperlink "T&Cs apply" to your full Terms and Conditions page wherever this text appears.';
    return el;
  }

  function buildToolLimitationNotice() {
    const block = document.createElement('p');
    block.className = 'pc-limitation-notice';
    block.textContent = 'This tool flags common structural issues but cannot verify current regulatory requirements — regulations change frequently. Always have promotions reviewed by a compliance officer before launch.';
    return block;
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildCopyBlock(label, text, copyable) {
    const block = document.createElement('div');
    block.className = 'pc-copy-block';

    const labelEl = document.createElement('span');
    labelEl.className = 'pc-copy-block-label';
    labelEl.textContent = label;

    const textEl = document.createElement('p');
    textEl.className = 'pc-copy-block-text';
    textEl.textContent = text;

    block.appendChild(labelEl);
    block.appendChild(textEl);

    if (copyable) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'pc-copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy ' + label + ' to clipboard');
      copyBtn.addEventListener('click', function () {
        copyToClipboard(text, copyBtn);
      });
      block.appendChild(copyBtn);
    }

    return block;
  }

  function buildDisclaimerBlock(disclaimer) {
    const block = document.createElement('div');
    block.className = 'pc-disclaimer-block';

    const labelEl = document.createElement('span');
    labelEl.className = 'pc-disclaimer-label';
    labelEl.textContent = 'Required Disclaimer';

    const textEl = document.createElement('p');
    textEl.className = 'pc-disclaimer-text';
    textEl.textContent = disclaimer;

    block.appendChild(labelEl);
    block.appendChild(textEl);

    return block;
  }

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(btn);
      }).catch(function () {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); showCopied(btn); } catch (e) {}
    document.body.removeChild(ta);
  }

  function showCopied(btn) {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  }
});
