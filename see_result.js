document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
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

    // --- Initialization ---
    function loadResults() {
        const resultsString = localStorage.getItem('seeQuizResults');
        if (!resultsString) {
            showErrorState();
            return;
        }

        try {
            quizResults = JSON.parse(resultsString);
            // Basic validation of loaded data
            if (!quizResults || !quizResults.questionsPresented || !quizResults.userAnswers || typeof quizResults.timeTaken === 'undefined') {
                 throw new Error("Incomplete results data found.");
            }
            processAndDisplayResults();
            // Optionally clear results from storage after loading to prevent accidental reuse
            // localStorage.removeItem('seeQuizResults');
        } catch (error) {
            console.error("Error parsing or validating quiz results:", error);
            showErrorState();
        }
    }

    function showErrorState() {
        loadingDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        summaryContentDiv.classList.add('hidden'); // Hide normal content area too
        detailedResultsDiv.classList.add('hidden');
    }

    // --- Processing and Display ---
    function processAndDisplayResults() {
        const score = calculateScore();
        const totalQuestions = quizResults.totalQuestions || quizResults.questionsPresented.length; // Use stored total if available
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        displaySummary(score, totalQuestions, percentage);
        renderDetailedResults(); // Prepare detailed view even if hidden initially

        // Show summary, hide loading
        loadingDiv.classList.add('hidden');
        summaryContentDiv.classList.remove('hidden');
    }

    function calculateScore() {
        let correctCount = 0;
        quizResults.questionsPresented.forEach(q => {
            const userAnswer = quizResults.userAnswers[q.id];
            if (userAnswer !== null && userAnswer === q.correctOptionId) {
                correctCount++;
            }
        });
        return correctCount;
    }

    function getEncouragement(percentage) {
        if (percentage === 100) return "Perfect! You've nailed it!";
        if (percentage >= 80) return "Excellent! You're among the top performers!";
        if (percentage >= 60) return "Great effort! You're almost there!";
        if (percentage >= 30) return "Good attempt! Keep practicing to improve.";
        return "Needs more effort. Don't give up, review and try again!";
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function displaySummary(score, totalQuestions, percentage) {
        encouragementP.textContent = getEncouragement(percentage);
        scoreSpan.textContent = `${score} / ${totalQuestions}`;
        percentageSpan.textContent = `${percentage}%`;

        let timeText = formatTime(quizResults.timeTaken);
        if (quizResults.wasTimeOut) {
            timeText += " (Timeout)";
            timeTakenSpan.classList.add('timeout'); // Add class for red color
        } else {
             timeTakenSpan.classList.remove('timeout');
        }
        timeTakenSpan.textContent = timeText;
    }

    function renderDetailedResults() {
        answersBreakdownDiv.innerHTML = ''; // Clear previous details
        let questionCounter = 0;

        quizResults.questionsPresented.forEach(q => {
            questionCounter++;
            const userAnswerId = quizResults.userAnswers[q.id];
            const isCorrect = userAnswerId === q.correctOptionId;
            const isSkipped = userAnswerId === null;

            // Create card container
            const card = document.createElement('div');
            card.className = 'detailed-question-card';
            if (isCorrect) {
                card.classList.add('result-correct');
            } else if (isSkipped) {
                card.classList.add('result-skipped');
            } else {
                card.classList.add('result-incorrect');
            }

            // Add question text
            const questionText = document.createElement('p');
            questionText.className = 'detailed-question-text';
            questionText.innerHTML = `<strong>${questionCounter}.</strong> ${q.questionText}`;
            card.appendChild(questionText);

            // Add options list
            const optionsList = document.createElement('ul');
            optionsList.className = 'detailed-options-list';

            q.options.forEach(opt => {
                const listItem = document.createElement('li');
                listItem.textContent = opt.text;

                let iconSpan = document.createElement('span');
                iconSpan.className = 'icon';

                // Mark correct answer
                if (opt.id === q.correctOptionId) {
                    listItem.classList.add('correct-option');
                    iconSpan.textContent = '✅';
                }

                // Mark user's incorrect answer
                if (!isCorrect && !isSkipped && opt.id === userAnswerId) {
                    listItem.classList.add('user-choice');
                     // Add X icon only if it was the user's wrong choice
                    if (iconSpan.textContent === '') { // Avoid overwriting correct tick if user chose correct
                       iconSpan.textContent = '❌';
                    } else { // User chose the correct one but something else was marked correct? (Error case) OR user chose the correct one (handled above)
                        // If user chose correct, ✅ is already there. If they chose wrong, we add ❌.
                        // Need to handle the case where they picked the wrong answer.
                         let wrongIconSpan = document.createElement('span');
                         wrongIconSpan.className = 'icon';
                         wrongIconSpan.textContent = '❌';
                         listItem.appendChild(wrongIconSpan); // Append separate span for X if ✅ already exists? Maybe simpler logic needed.

                         // Simpler: If the current option is the user's choice AND it's NOT the correct one
                         if (opt.id === userAnswerId && opt.id !== q.correctOptionId) {
                             iconSpan.textContent = '❌'; // Overwrite or set X
                         }

                    }
                }
                 // Simplified Icon Logic:
                 iconSpan.textContent = ''; // Reset icon
                 if (opt.id === q.correctOptionId) {
                     iconSpan.textContent += ' ✅'; // Mark correct
                 }
                 if (opt.id === userAnswerId && opt.id !== q.correctOptionId) {
                     iconSpan.textContent += ' ❌'; // Mark user's incorrect choice
                 }

                 // Append icon only if it has content
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
        if (detailsVisible) {
            detailedResultsDiv.classList.remove('hidden');
            toggleDetailsButton.textContent = 'Hide Details';
        } else {
            detailedResultsDiv.classList.add('hidden');
            toggleDetailsButton.textContent = 'Show Details';
        }
    });

    backToPortalButton.addEventListener('click', () => {
        // Optionally clear results when navigating completely away
        // localStorage.removeItem('seeQuizResults');
        window.location.href = 'index.html';
    });

    startNewQuizButton.addEventListener('click', () => {
        // Optionally clear results when starting fresh
        // localStorage.removeItem('seeQuizResults');
        window.location.href = 'see_setup.html';
    });

    // --- Initiate Loading ---
    loadResults();
});
