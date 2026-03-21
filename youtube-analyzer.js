// File: youtube-analyzer.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Modal Logic ---
    const infoButton = document.getElementById('info-button');
    const infoModal = document.getElementById('info-modal');
    const closeButton = infoModal.querySelector('.close-button');

    if (infoButton && infoModal && closeButton) {
        // When the user clicks the info button, show the modal
        infoButton.addEventListener('click', () => {
            infoModal.classList.add('visible');
        });

        // When the user clicks on <span> (x), close the modal
        closeButton.addEventListener('click', () => {
            infoModal.classList.remove('visible');
        });

        // When the user clicks on the dark background of the modal, close it
        infoModal.addEventListener('click', (event) => {
            if (event.target === infoModal) {
                infoModal.classList.remove('visible');
            }
        });
    }

    // --- Form Analyzer Logic ---
    const form = document.getElementById('analyzer-form');
    const resultsDiv = document.getElementById('results');
    const resultsIntro = document.getElementById('results-intro');
    const submitButton = form.querySelector('button[type="submit"]');

    // Reference to the statistic display elements
    const videoCountEl = document.getElementById('video-count');
    const viewCountEl = document.getElementById('view-count');
    const commentCountEl = document.getElementById('comment-count');
    const likeCountEl = document.getElementById('like-count');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the form from reloading the page

        const channelUrl = document.getElementById('channel-url').value;
        const keyword = document.getElementById('keyword').value;

        // --- Set Loading State ---
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
        resultsDiv.classList.remove('visible'); // Hide old results

        try {
            // --- Call the Cloudflare Worker ---
            const workerUrl = 'https://youtube-analyzer-api.ukjbowman.workers.dev/';
            
            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ channelUrl, keyword }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle errors returned from the worker
                throw new Error(data.error || 'An unknown server error occurred.');
            }

            // --- Display Results ---
            updateResultsUI(data, keyword);

        } catch (error) {
            // Handle network errors or exceptions
            console.error('Submission Error:', error);
            displayError(error.message);
        } finally {
            // --- Reset Loading State ---
            submitButton.disabled = false;
            submitButton.textContent = 'Analyze';
        }
    });

    /**
     * Updates the UI with the fetched statistics.
     * @param {object} data - The data from the worker.
     * @param {string} keyword - The keyword that was searched.
     */
    function updateResultsUI(data, keyword) {
        const formatNumber = (num) => num.toLocaleString('en-US');

        if (data.videoCount === 0) {
            resultsIntro.textContent = `No videos found on this channel matching the keyword "${keyword}".`;
        } else {
            const videoText = data.videoCount === 1 ? 'video' : 'videos';
            resultsIntro.textContent = `Found ${data.videoCount} ${videoText} matching the keyword "${keyword}":`;
        }

        videoCountEl.textContent = formatNumber(data.videoCount);
        viewCountEl.textContent = formatNumber(data.totalViews);
        commentCountEl.textContent = formatNumber(data.totalComments);
        likeCountEl.textContent = formatNumber(data.totalLikes);

        resultsDiv.classList.add('visible');
    }

    /**
     * Displays an error message in the results area.
     * @param {string} message - The error message to display.
     */
    function displayError(message) {
        resultsIntro.textContent = `Error: ${message}`;
        videoCountEl.textContent = '0';
        viewCountEl.textContent = '0';
        commentCountEl.textContent = '0';
        likeCountEl.textContent = '0';
        resultsDiv.classList.add('visible');
    }
});