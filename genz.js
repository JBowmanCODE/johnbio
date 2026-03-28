document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const translateBtn = document.getElementById('translate-btn');
    const outputText = document.getElementById('output-text');
    const swapBtn = document.getElementById('swap-btn');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');

    let direction = 'to-genz';

    swapBtn.addEventListener('click', function() {
        direction = direction === 'to-genz' ? 'to-english' : 'to-genz';
        if (direction === 'to-english') {
            inputLabel.textContent = 'Gen Z Text';
            outputLabel.textContent = 'Plain English';
            inputText.placeholder = 'Paste Gen Z slang here...';
            swapBtn.title = 'Switch to English → Gen Z';
        } else {
            inputLabel.textContent = 'Your Text';
            outputLabel.textContent = 'Gen Z Translation';
            inputText.placeholder = 'Paste your text here...';
            swapBtn.title = 'Switch to Gen Z → English';
        }
        swapBtn.classList.toggle('swapped', direction === 'to-english');
        outputText.textContent = '';
    });

    translateBtn.addEventListener('click', translateText);

    async function translateText() {
        const text = inputText.value;
        if (text) {
            try {
                outputText.textContent = 'Translating...';
                const response = await fetch('https://genz-1.ukjbowman.workers.dev', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text, direction })
                });

                if (response.status === 429) {
                    outputText.innerHTML = "That's your 3 free translations used up for today. Want unlimited access? <a href='https://www.linkedin.com/in/john-bowman/' target='_blank' rel='noopener'>Get in touch on LinkedIn</a>";
                    return;
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                outputText.textContent = data.translatedText;
            } catch (error) {
                outputText.textContent = 'Could not connect to the translation service. Please check your connection and try again.';
            }
        } else {
            alert('Please enter some text to translate.');
        }
    }
});
