document.addEventListener('DOMContentLoaded', function() {
    const inputEl = document.getElementById('igaming-input');
    const translateBtn = document.getElementById('igaming-translate-btn');
    const outputEl = document.getElementById('igaming-output');
    const btnLabel = document.getElementById('igaming-btn-label');
    const modeBtns = document.querySelectorAll('.igaming-mode-btn');

    let mode = 'to-plain';

    modeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            mode = btn.dataset.mode;
            modeBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            if (mode === 'to-plain') {
                inputEl.placeholder = 'Paste iGaming jargon here — e.g. "Our NGR is down due to bonus abuse and high RTP on the slots vertical."';
                btnLabel.textContent = 'Translate to Plain English';
            } else {
                inputEl.placeholder = 'Describe something in plain terms — e.g. "Players are spending less money after we gave them too many bonuses."';
                btnLabel.textContent = 'Translate to Jargon';
            }

            outputEl.textContent = '';
        });
    });

    translateBtn.addEventListener('click', translate);

    async function translate() {
        const text = inputEl.value.trim();
        if (!text) {
            alert('Please enter some text to translate.');
            return;
        }

        try {
            outputEl.textContent = 'Translating...';

            const response = await fetch('https://igaming-jargon-worker.ukjbowman.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, mode })
            });

            if (response.status === 429) {
                outputEl.innerHTML = "That's your 3 free translations used up for today. Want unlimited access? <a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>";
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            outputEl.textContent = data.translatedText;
        } catch (error) {
            outputEl.textContent = 'Could not connect to the translation service. Please check your connection and try again.';
        }
    }
});
