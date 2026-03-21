document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const videoUrlInput = document.getElementById('video-url');
    const summarizeButton = document.getElementById('summarize-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultsContainer = document.getElementById('results-container');
    const summaryContent = document.getElementById('summary-content');
    const questionInput = document.getElementById('question-input');
    const askButton = document.getElementById('ask-button');
    const answerContainer = document.getElementById('answer-container');
    const messageContainer = document.getElementById('message-container');

    // --- Configuration ---
    const WORKER_URL = 'https://youtube-summary.ukjbowman.workers.dev'; 
    let currentVideoId = null;

    // --- Event Listeners ---
    if (summarizeButton) {
        summarizeButton.addEventListener('click', handleSummarizeClick);
    }
    if (askButton) {
        askButton.addEventListener('click', handleAskQuestionClick);
    }

    /**
     * Shows a message to the user (error, success, info).
     * @param {string} text - The message to display.
     * @param {string} type - 'error', 'success', or 'info'.
     */
    function showMessage(text, type = 'error') {
        const typeClass = `message-${type}`;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${typeClass}`;
        messageDiv.textContent = text;
        
        messageContainer.innerHTML = '';
        messageContainer.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
    
    /**
     * Toggles the loading state of the UI.
     * @param {boolean} isLoading - True to show loading, false to hide.
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            loadingIndicator.style.display = 'block';
            summarizeButton.disabled = true;
            askButton.disabled = true;
        } else {
            loadingIndicator.style.display = 'none';
            summarizeButton.disabled = false;
            askButton.disabled = false;
        }
    }

    /**
     * Extracts YouTube video ID from various URL formats.
     * @param {string} url - The YouTube URL.
     * @returns {string|null} The video ID or null if not found.
     */
    function getVideoIdFromUrl(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Handles the click event for the Summarize button.
     */
    async function handleSummarizeClick() {
        const videoUrl = videoUrlInput.value.trim();
        if (!videoUrl) {
            showMessage('Please enter a YouTube video URL.');
            return;
        }

        const videoId = getVideoIdFromUrl(videoUrl);
        if (!videoId) {
            showMessage('Invalid YouTube video URL. Please check and try again.');
            return;
        }
        
        currentVideoId = videoId;
        setLoadingState(true);
        resultsContainer.style.display = 'none';
        answerContainer.innerHTML = '';
        messageContainer.innerHTML = '';

        try {
            const response = await fetch(`${WORKER_URL}/summarize?videoId=${videoId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server responded with status: ${response.status}`);
            }

            displaySummary(data.summary);
            resultsContainer.style.display = 'block';

        } catch (error) {
            console.error('Summarization Error:', error);
            showMessage(`An error occurred: ${error.message}`);
            resultsContainer.style.display = 'none';
        } finally {
            setLoadingState(false);
        }
    }

    /**
     * Handles the click event for the Ask Question button.
     */
    async function handleAskQuestionClick() {
        const question = questionInput.value.trim();
        if (!question) {
            showMessage('Please enter a question about the video.');
            return;
        }
        if (!currentVideoId) {
            showMessage('Please summarize a video first before asking a question.');
            return;
        }

        answerContainer.innerHTML = `<div class="loading-answer"><div class="spinner-small"></div><span>Getting your answer...</span></div>`;
        askButton.disabled = true;

        try {
            const response = await fetch(`${WORKER_URL}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, videoId: currentVideoId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `Server responded with status: ${response.status}`);
            }

            displayAnswer(data.answer);

        } catch (error) {
            console.error('Q&A Error:', error);
            showMessage(`An error occurred while asking the question: ${error.message}`);
            answerContainer.innerHTML = '';
        } finally {
            askButton.disabled = false;
            questionInput.value = '';
        }
    }
    
    /**
     * Displays the summary in the UI.
     * @param {string} summary - The summary text.
     */
    function displaySummary(summary) {
        summaryContent.innerHTML = summary.split('\n').map(p => `<p>${p.trim()}</p>`).filter(p => p.length > 7).join('');
    }

    /**
     * Displays the answer in the UI.
     * @param {string} answer - The answer text.
     */
    function displayAnswer(answer) {
        answerContainer.innerHTML = `
            <div class="answer-box">
                <p>${answer}</p>
            </div>
        `;
    }
});
