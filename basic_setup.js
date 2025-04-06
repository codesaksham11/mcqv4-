document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button');

    // Error message elements
    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');

    // Fixed subjects for the Basic level
    const FIXED_SUBJECTS = ["Physics", "Chemistry", "Biology", "English"];
    // Unique localStorage key for this quiz type
    const LOCAL_STORAGE_KEY = 'basicQuizConfig';

    // --- Navigation ---
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Go back to the main portal
    });

    // --- Form Submission Logic ---
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        if (validateForm()) {
            // Collect data
            const numQuestions = parseInt(numQuestionsInput.value, 10);
            const timeLimit = parseInt(timeLimitInput.value, 10);
            // Use the fixed subjects
            const selectedSubjects = FIXED_SUBJECTS;

            // Store data in localStorage with the specific key
            const quizConfig = {
                numQuestions: numQuestions,
                timeLimit: timeLimit,
                selectedSubjects: selectedSubjects // Store the fixed list
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizConfig));

            // Redirect to the BASIC MCQ page
            window.location.href = 'basic_mcq.html';
        }
    });

    // --- Validation ---
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate Number of Questions (Min 10 for basic)
        const numQuestions = parseInt(numQuestionsInput.value, 10);
        if (isNaN(numQuestions) || numQuestions < 10 || numQuestions > 100) {
            showError(numQuestionsError, 'Please enter a number between 10 and 100.', numQuestionsInput);
            isValid = false;
        }

        // Validate Time Limit
        const timeLimit = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 180) {
            showError(timeLimitError, 'Please enter a time between 1 and 180 minutes.', timeLimitInput);
            isValid = false;
        }

        // No subject validation needed as they are fixed

        return isValid;
    }

    function showError(errorElement, message, inputElement = null) {
        errorElement.textContent = message;
        if (inputElement) {
            inputElement.classList.add('input-error');
        }
    }

    function clearErrors() {
        numQuestionsError.textContent = '';
        timeLimitError.textContent = '';
        numQuestionsInput.classList.remove('input-error');
        timeLimitInput.classList.remove('input-error');
    }

    // Clear errors on input change for better UX
    numQuestionsInput.addEventListener('input', () => {
        if (numQuestionsInput.classList.contains('input-error')) {
             numQuestionsError.textContent = '';
             numQuestionsInput.classList.remove('input-error');
        }
    });
     timeLimitInput.addEventListener('input', () => {
        if (timeLimitInput.classList.contains('input-error')) {
             timeLimitError.textContent = '';
             timeLimitInput.classList.remove('input-error');
        }
    });
    // No event listeners needed for subject checkboxes

});
