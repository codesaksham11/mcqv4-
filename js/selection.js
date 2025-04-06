document.addEventListener('DOMContentLoaded', () => {
    const feedbackMessageEl = document.getElementById('feedback-message');
    const timeTakenEl = document.getElementById('time-taken');
    const finalScoreEl = document.getElementById('final-score');
    const percentageEl = document.getElementById('percentage');
    const showDetailsBtn = document.getElementById('show-details-btn');
    const detailedResultsEl = document.getElementById('detailed-results');

    // --- 1. Retrieve Data from sessionStorage ---
    const resultDataString = sessionStorage.getItem('quizResultData');
    // Clean up sessionStorage immediately after retrieving
    // sessionStorage.removeItem('quizResultData'); // Uncomment if you want one-time view only

    if (!resultDataString) {
        detailedResultsEl.innerHTML = '<p class="error">Could not load quiz results. Session data missing. Please take the quiz again.</p>';
         detailedResultsEl.classList.remove('hidden');
        // Hide summary elements if needed
        document.getElementById('results-summary').classList.add('hidden');
        return;
    }

    try {
        const results = JSON.parse(resultDataString);
        const { questionsAsked, userAnswers, timeLimit, timeTaken, timedOut, level } = results;

        if (!questionsAsked || !userAnswers || typeof timeLimit === 'undefined' || typeof timeTaken === 'undefined') {
            throw new Error("Incomplete result data found.");
        }

        // --- 2. Calculate Score ---
        let correctCount = 0;
        let incorrectCount = 0;
        let skippedCount = 0;
        const totalQuestions = questionsAsked.length;

        questionsAsked.forEach((q, index) => {
            const questionIndex = q.index; // Use the index assigned during the quiz
            const userAnswer = userAnswers[questionIndex];
            const correctAnswer = q.correctAnswer;

            if (userAnswer) {
                if (userAnswer === correctAnswer) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            } else {
                skippedCount++;
            }
        });

        const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        // --- 3. Display Summary ---
        finalScoreEl.textContent = `${correctCount} / ${totalQuestions}`;
        percentageEl.textContent = percentage;

        if (timedOut) {
            timeTakenEl.textContent = `Time Out! (${formatTime(timeLimit)})`;
            timeTakenEl.classList.add('timeout');
        } else {
            timeTakenEl.textContent = formatTime(timeTaken);
        }

        // Determine feedback message and class
        let feedbackText = '';
        let feedbackClass = '';
        if (percentage === 100) {
             feedbackText = "Perfect Score! Excellent work! 🏆"; feedbackClass = 'feedback-perfect';
        } else if (percentage >= 80) {
             feedbackText = "Appreciable Effort! Keep it up! 👍"; feedbackClass = 'feedback-appreciable';
        } else if (percentage >= 50) {
             feedbackText = "Good Try! A little more effort needed."; feedbackClass = 'feedback-little-effort';
        } else if (percentage >= 25) {
             feedbackText = "Needs More Practice. Review the details."; feedbackClass = 'feedback-needs-practice';
        } else {
             feedbackText = "Try Harder Next Time. Don't give up!"; feedbackClass = 'feedback-try-harder';
        }
        feedbackMessageEl.textContent = feedbackText;
        feedbackMessageEl.className = `feedback-message ${feedbackClass}`; // Apply class

        // --- 4. Prepare Detailed Results (Hidden Initially) ---
        let detailsHtml = '';
        questionsAsked.forEach((q, displayIndex) => {
            const questionIndex = q.index;
            const userAnswer = userAnswers[questionIndex];
            const correctAnswer = q.correctAnswer;
            const isCorrect = userAnswer === correctAnswer;
            const isSkipped = !userAnswer;

            detailsHtml += `
                <div class="result-question-block ${isSkipped ? 'skipped' : (isCorrect ? 'correct-answered' : 'incorrect-answered')}">
                    <p class="question-text">${displayIndex + 1}. ${q.question}</p>
                    <ul class="result-options-list">
            `;

            for (const optionKey in q.options) {
                let liClass = 'default'; // Base class
                let isUserChoice = userAnswer === optionKey;
                let isActualCorrect = correctAnswer === optionKey;

                if (isActualCorrect) {
                    liClass = 'actual-correct'; // Mark the correct answer regardless
                }
                 if (isUserChoice) {
                     liClass += isCorrect ? ' correct' : ' incorrect'; // Style user's choice based on correctness
                 }


                detailsHtml += `
                    <li class="${liClass}">
                       ${optionKey.toUpperCase()}. ${q.options[optionKey]}
                    </li>
                `;
            }

            detailsHtml += `
                    </ul>
                </div>
            `;
        });
        detailedResultsEl.innerHTML = detailsHtml;


        // --- 5. Event Listener for "Show Details" ---
        showDetailsBtn.addEventListener('click', () => {
             detailedResultsEl.classList.toggle('hidden');
             showDetailsBtn.textContent = detailedResultsEl.classList.contains('hidden')
                ? 'Show Full Details'
                : 'Hide Full Details';
        });


    } catch (error) {
        console.error("Error processing results:", error);
        detailedResultsEl.innerHTML = `<p class="error">Error displaying results: ${error.message}.</p>`;
         detailedResultsEl.classList.remove('hidden');
         document.getElementById('results-summary').classList.add('hidden');
    }

    // --- Helper Function ---
    function formatTime(totalSeconds) {
        if (typeof totalSeconds !== 'number' || totalSeconds < 0) return 'N/A';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
});
