// see_setup.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Existing DOM References ---
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button');

    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');
    const subjectsError = document.getElementById('subjects-error');
    const subjectSelectionDiv = document.querySelector('.subject-selection');

    // --- NEW DOM Reference ---
    const accessStatusMessageDiv = document.getElementById('access-status-message');

    // --- Navigation ---
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Go back to the main portal
    });

    // --- Form Submission Logic ---
    form.addEventListener('submit', async (event) => { // Make the handler async
        event.preventDefault();
        clearAccessStatusMessage(); // Clear previous access messages

        if (validateForm()) {
            // --- Collect and Store Config Data (as before) ---
            const numQuestions = parseInt(numQuestionsInput.value, 10);
            const timeLimit = parseInt(timeLimitInput.value, 10);
            const selectedSubjects = Array.from(subjectCheckboxes)
                                        .filter(checkbox => checkbox.checked)
                                        .map(checkbox => checkbox.value);

            const quizConfig = {
                numQuestions: numQuestions,
                timeLimit: timeLimit,
                selectedSubjects: selectedSubjects,
                quizType: 'see' // Add quiz type identifier
            };
            localStorage.setItem('quizConfig', JSON.stringify(quizConfig)); // Use generic key
            console.log('Quiz config saved to localStorage:', quizConfig);

            // --- NEW: Access Token Request Logic ---
            setAccessStatusMessage("Verifying access...", false, 'loading');
            startButton.disabled = true; // Disable button during check

            const requestedFile = 'see_mcq.html'; // The target file for this setup page

            try {
                // Browser automatically sends session_token cookie if user logged in
                const response = await fetch('/api/generate-access-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ requestedFile: requestedFile })
                });

                if (response.ok) {
                    // Access Granted! Backend set the access_token cookie.
                    setAccessStatusMessage("Access granted. Starting quiz...", false, 'success');
                    // Proceed to the MCQ page
                    window.location.href = requestedFile; // Redirect uses the variable

                } else {
                    // Access Denied or other error
                    let errorMsg = "Could not start quiz.";
                    const responseText = await response.text(); // Get error details from backend

                    if (response.status === 401) {
                        errorMsg = `Authentication error: Please log in to access exams. (${responseText || 'Invalid session'})`;
                        // Suggest login - maybe redirect to index or show message asking to log in
                        // For now, just show error here.
                    } else if (response.status === 403) {
                        errorMsg = `Permission Denied: You do not have access to the SEE package. (${responseText || 'Contact support'})`;
                    } else {
                        errorMsg = `Error (${response.status}): ${responseText || 'An unknown server error occurred.'}`;
                    }
                    setAccessStatusMessage(errorMsg, true); // Display error
                    startButton.disabled = false; // Re-enable button on failure
                }

            } catch (error) {
                console.error("Error requesting access token:", error);
                setAccessStatusMessage(`Network error: Could not reach verification server. ${error.message}`, true);
                startButton.disabled = false; // Re-enable button on network error
            }
            // --- END: Access Token Request Logic ---
        }
    });

    // --- Validation Functions (Keep As Is) ---
    function validateForm() {
        let isValid = true;
        clearErrors();

        const numQuestions = parseInt(numQuestionsInput.value, 10);
        if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 100) {
            showError(numQuestionsError, 'Please enter a number between 1 and 100.', numQuestionsInput);
            isValid = false;
        }

        const timeLimit = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 180) {
            showError(timeLimitError, 'Please enter a time between 1 and 180 minutes.', timeLimitInput);
            isValid = false;
        }

        const selectedCount = Array.from(subjectCheckboxes).filter(checkbox => checkbox.checked).length;
        if (selectedCount === 0) {
            showError(subjectsError, 'Please select at least one subject.', subjectSelectionDiv);
            isValid = false;
        }

        return isValid;
    }

    function showError(errorElement, message, inputElement = null) {
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Ensure error message is visible
        if (inputElement) {
            inputElement.classList.add('input-error');
        }
    }

    function clearErrors() {
        numQuestionsError.textContent = '';
        timeLimitError.textContent = '';
        subjectsError.textContent = '';
        numQuestionsInput.classList.remove('input-error');
        timeLimitInput.classList.remove('input-error');
        subjectSelectionDiv.classList.remove('input-error');
        numQuestionsError.style.display = 'none'; // Hide errors
        timeLimitError.style.display = 'none';
        subjectsError.style.display = 'none';
    }

    // Clear errors on input change (Keep As Is)
    numQuestionsInput.addEventListener('input', () => clearSingleError(numQuestionsInput, numQuestionsError));
    timeLimitInput.addEventListener('input', () => clearSingleError(timeLimitInput, timeLimitError));
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
             if (subjectSelectionDiv.classList.contains('input-error')) {
                 const anyChecked = Array.from(subjectCheckboxes).some(cb => cb.checked);
                 if (anyChecked) {
                    subjectsError.textContent = '';
                    subjectsError.style.display = 'none';
                    subjectSelectionDiv.classList.remove('input-error');
                 }
             }
        });
    });
    function clearSingleError(inputEl, errorEl) {
         if (inputEl.classList.contains('input-error')) {
             errorEl.textContent = '';
             errorEl.style.display = 'none';
             inputEl.classList.remove('input-error');
        }
    }


    // --- NEW: Helper Functions for Access Status Message ---
    function setAccessStatusMessage(message, isError = false, type = null) {
        if (!accessStatusMessageDiv) return;
        accessStatusMessageDiv.textContent = message;
        accessStatusMessageDiv.className = 'status-message'; // Reset class
        if (isError) {
            accessStatusMessageDiv.classList.add('error');
        } else if (type === 'success') {
             accessStatusMessageDiv.classList.add('success');
        } else if (type === 'loading') {
            accessStatusMessageDiv.classList.add('loading');
        }
        // Auto-clear non-error messages? Maybe not for this status.
    }
    function clearAccessStatusMessage() {
         if (!accessStatusMessageDiv) return;
         accessStatusMessageDiv.textContent = '';
         accessStatusMessageDiv.className = 'status-message';
    }

    // --- Initial State ---
    clearErrors(); // Ensure errors are hidden on load
    clearAccessStatusMessage(); // Clear access message on load
    startButton.disabled = false; // Ensure button is enabled on load


}); // End DOMContentLoaded
