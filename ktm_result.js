document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements (IDs are consistent) ---
    const loadingDiv = document.getElementById('loading-results');
    const errorDiv = document.getElementById('error-loading');
    const summaryContentDiv = document.getElementById('summary-content');
    const encouragementP = document.getElementById('encouragement-message');
    const scoreSpan = document.getElementById('score');
    const percentageSpan = document.getElementById('percentage');
    const timeTakenSpan = document.getElementById('time-taken');
    const toggleDetailsButton = document.getElementById('toggle-details-button');
    const detailedResultsDiv = document.getElementById('detailed-results');
    const answersBreakdownDiv = document.getElementById('answers-breakdown');
    const backToPortalButton = document.getElementById('back-to-portal');
    const startNewQuizButton = document.getElementById('start-new-quiz');

    // --- State ---
    let quizResults = null;
    let detailsVisible = false;
    // ** UPDATED ** LocalStorage Key
    const LOCAL_STORAGE_KEY_RESULTS = 'ktmQuizResults';
    // ** UPDATED ** Setup page URL
    const SETUP_PAGE_URL = 'ktm_setup.html';


    // --- Initialization ---
    function loadResults() {
        // ** UPDATED ** Use the correct key
        const resultsString = localStorage.getItem(LOCAL_STORAGE_KEY_RESULTS);
        if (!resultsString) {
            showErrorState();
            return;
        }

        try {
            quizResults = JSON.parse(resultsString);
            // More robust validation if needed
            if (!quizResults || !quizResults.questionsPresented || !quizResults.userAnswers || typeof quizResults.timeTaken === 'undefined' || !quizResults.totalQuestions) {
                 throw new Error("Incomplete or invalid KTM results data found.");
            }
            processAndDisplayResults();
            // Optional: localStorage.removeItem(LOCAL_STORAGE_KEY_RESULTS);
        } catch (error) {
            console.error("Error parsing or validating KTM quiz results:", error);
            showErrorState();
        }
    }

    function showErrorState() {
        loadingDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        summaryContentDiv.classList.add('hidden');
        detailedResultsDiv.classList.add('hidden');
    }

    // --- Processing and Display (Core logic unchanged) ---
    function processAndDisplayResults() {
        const score = calculateScore();
        // Use totalQuestions from stored results, which reflects actual questions shown
        const totalQuestions = quizResults.totalQuestions;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        displaySummary(score, totalQuestions, percentage);
        renderDetailedResults(); // Prepare detailed view

        loadingDiv.classList.add('hidden');
        summaryContentDiv.classList.remove('hidden');
    }

    function calculateScore() { /* ... Same as basic_result.js ... */ let correctCount = 0; quizResults.questionsPresented.forEach(q => { const userAnswer = quizResults.userAnswers[q.id]; if (userAnswer !== null && userAnswer === q.correctOptionId) { correctCount++; } }); return correctCount; }
    function getEncouragement(percentage) { /* ... Same as basic_result.js ... */ if (percentage === 100) return "Perfect Score! You've mastered it!"; if (percentage >= 80) return "Outstanding Performance! Truly impressive work."; if (percentage >= 60) return "Excellent effort! You're well prepared."; if (percentage >= 30) return "Solid attempt! Focus on reviewing weaker areas."; return "Keep Practicing! Review the details below and try again."; }
    function formatTime(totalSeconds) { /* ... Same as basic_result.js ... */ const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; }

    function displaySummary(score, totalQuestions, percentage) {
        encouragementP.textContent = getEncouragement(percentage);
        scoreSpan.textContent = `${score} / ${totalQuestions}`;
        percentageSpan.textContent = `${percentage}%`;

        let timeText = formatTime(quizResults.timeTaken);
        if (quizResults.wasTimeOut) {
            timeText += " (Timeout)";
            timeTakenSpan.classList.add('timeout');
        } else {
             timeTakenSpan.classList.remove('timeout');
        }
        timeTakenSpan.textContent = timeText;
    }

    // --- Render Detailed Results (Logic identical to basic_result.js) ---
    function renderDetailedResults() {
        answersBreakdownDiv.innerHTML = '';
        let questionCounter = 0;

        quizResults.questionsPresented.forEach(q => {
            questionCounter++;
            const userAnswerId = quizResults.userAnswers[q.id];
            const isCorrect = userAnswerId === q.correctOptionId;
            const isSkipped = userAnswerId === null;

            const card = document.createElement('div');
            card.className = 'detailed-question-card';
            if (isCorrect) card.classList.add('result-correct');
            else if (isSkipped) card.classList.add('result-skipped');
            else card.classList.add('result-incorrect');

            const questionText = document.createElement('p');
            questionText.className = 'detailed-question-text';
            questionText.innerHTML = `<strong>${questionCounter}.</strong> ${q.questionText}`;
            card.appendChild(questionText);

            const optionsList = document.createElement('ul');
            optionsList.className = 'detailed-options-list';

            q.options.forEach(opt => {
                const listItem = document.createElement('li');
                listItem.textContent = opt.text;

                let iconSpan = document.createElement('span');
                iconSpan.className = 'icon';
                iconSpan.textContent = ''; // Reset

                if (opt.id === q.correctOptionId) {
                    iconSpan.textContent += ' ✅'; // Mark correct
                    // Apply specific style to correct option text directly maybe?
                     listItem.classList.add('correct-option');
                }
                if (opt.id === userAnswerId && opt.id !== q.correctOptionId) {
                    iconSpan.textContent += ' ❌'; // Mark user's incorrect choice
                }

                if (iconSpan.textContent.trim() !== '') {
                    listItem.appendChild(iconSpan);
                }

                optionsList.appendChild(listItem);
            });

            card.appendChild(optionsList);
            answersBreakdownDiv.appendChild(card);
        });
    }


    // --- Event Listeners ---
    toggleDetailsButton.addEventListener('click', () => {
        detailsVisible = !detailsVisible;
        const icon = toggleDetailsButton.querySelector('i');
        if (detailsVisible) {
            detailedResultsDiv.classList.remove('hidden');
            toggleDetailsButton.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Details'; // Update text and icon
        } else {
            detailedResultsDiv.classList.add('hidden');
            toggleDetailsButton.innerHTML = '<i class="fas fa-list-ul"></i> Show Details'; // Restore text and icon
        }
    });

    backToPortalButton.addEventListener('click', () => { /* ... Same ... */ window.location.href = 'index.html'; });
    startNewQuizButton.addEventListener('click', () => { /* ... Same ... */ window.location.href = SETUP_PAGE_URL; });

    // --- Initiate Loading ---
    loadResults();
});
