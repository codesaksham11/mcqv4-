document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button');

    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');
    const subjectsError = document.getElementById('subjects-error');
    const subjectSelectionDiv = document.querySelector('.subject-selection'); // For error border

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
            const selectedSubjects = Array.from(subjectCheckboxes)
                                        .filter(checkbox => checkbox.checked)
                                        .map(checkbox => checkbox.value);

            // Store data in localStorage
            const quizConfig = {
                numQuestions: numQuestions,
                timeLimit: timeLimit,
                selectedSubjects: selectedSubjects
            };
            localStorage.setItem('seeQuizConfig', JSON.stringify(quizConfig));

            // Redirect to the MCQ page
            window.location.href = 'see_mcq.html';
        }
    });

    // --- Validation ---
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate Number of Questions
        const numQuestions = parseInt(numQuestionsInput.value, 10);
        if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 100) {
            showError(numQuestionsError, 'Please enter a number between 1 and 100.', numQuestionsInput);
            isValid = false;
        }

        // Validate Time Limit
        const timeLimit = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 180) {
            showError(timeLimitError, 'Please enter a time between 1 and 180 minutes.', timeLimitInput);
            isValid = false;
        }

        // Validate Subject Selection
        const selectedCount = Array.from(subjectCheckboxes).filter(checkbox => checkbox.checked).length;
        if (selectedCount === 0) {
            showError(subjectsError, 'Please select at least one subject.', subjectSelectionDiv); // Add error class to div
            isValid = false;
        }

        return isValid;
    }

    function showError(errorElement, message, inputElement = null) {
        errorElement.textContent = message;
        if (inputElement) {
            inputElement.classList.add('input-error'); // Add error class to input/container
        }
    }

    function clearErrors() {
        numQuestionsError.textContent = '';
        timeLimitError.textContent = '';
        subjectsError.textContent = '';
        numQuestionsInput.classList.remove('input-error');
        timeLimitInput.classList.remove('input-error');
        subjectSelectionDiv.classList.remove('input-error'); // Remove error class from div
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
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
             if (subjectSelectionDiv.classList.contains('input-error')) {
                 const anyChecked = Array.from(subjectCheckboxes).some(cb => cb.checked);
                 if (anyChecked) {
                    subjectsError.textContent = '';
                    subjectSelectionDiv.classList.remove('input-error');
                 }
             }
        });
    });

});
