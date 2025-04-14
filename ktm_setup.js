document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    // Get all checkboxes with name="topic"
    const topicCheckboxes = document.querySelectorAll('input[name="topic"]');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button');

    // Error message elements
    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');
    const topicsError = document.getElementById('topics-error');
    const topicSelectionDiv = document.querySelector('.topic-selection'); // For error border

    // Unique localStorage key for KTM quiz
    const LOCAL_STORAGE_KEY = 'ktmQuizConfig';

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
            // Get the values of the checked topic checkboxes
            const selectedTopics = Array.from(topicCheckboxes)
                                        .filter(checkbox => checkbox.checked)
                                        .map(checkbox => checkbox.value);

            // Store data in localStorage with the specific key
            const quizConfig = {
                numQuestions: numQuestions,
                timeLimit: timeLimit,
                selectedTopics: selectedTopics // Store the array of selected topic strings
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizConfig));

            // Redirect to the KTM MCQ page
            window.location.href = 'ktm_mcq.html';
        }
    });

    // --- Validation ---
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate Number of Questions (Min 10)
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

        // Validate Topic Selection
        const selectedCount = Array.from(topicCheckboxes).filter(checkbox => checkbox.checked).length;
        if (selectedCount === 0) {
            showError(topicsError, 'Please select at least one topic.', topicSelectionDiv);
            isValid = false;
        }

        return isValid;
    }

    function showError(errorElement, message, inputOrContainerElement = null) {
        errorElement.textContent = message;
        if (inputOrContainerElement) {
            inputOrContainerElement.classList.add('input-error');
        }
    }

    function clearErrors() {
        numQuestionsError.textContent = '';
        timeLimitError.textContent = '';
        topicsError.textContent = ''; // Clear topic error
        numQuestionsInput.classList.remove('input-error');
        timeLimitInput.classList.remove('input-error');
        topicSelectionDiv.classList.remove('input-error'); // Remove error class from topic container
    }

    // --- Dynamic Error Clearing ---
    numQuestionsInput.addEventListener('input', () => clearErrorOnChange(numQuestionsInput, numQuestionsError));
    timeLimitInput.addEventListener('input', () => clearErrorOnChange(timeLimitInput, timeLimitError));

    topicCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (topicSelectionDiv.classList.contains('input-error')) {
                const anyChecked = Array.from(topicCheckboxes).some(cb => cb.checked);
                if (anyChecked) {
                   topicsError.textContent = '';
                   topicSelectionDiv.classList.remove('input-error');
                }
            }
       });
    });

    // Helper for clearing individual input errors
    function clearErrorOnChange(inputElement, errorElement) {
         if (inputElement.classList.contains('input-error')) {
             errorElement.textContent = '';
             inputElement.classList.remove('input-error');
        }
    }

});
