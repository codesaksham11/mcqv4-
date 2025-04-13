// /see_setup.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM References (Keep existing ones) ---
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button'); // Make sure this exists in HTML

    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');
    const subjectsError = document.getElementById('subjects-error');
    const subjectSelectionDiv = document.querySelector('.subject-selection'); // Assuming this container exists for error display

    // Reference for the status message area (Needs to exist in see_setup.html)
    // Example: <div id="access-status-message" class="status-message" role="status"></div>
    const accessStatusMessageDiv = document.getElementById('access-status-message');

    // --- Constants for this specific setup ---
    const QUIZ_TYPE = 'see';
    const TARGET_MCQ_FILE = 'see_mcq.html';
    const REQUIRED_PACKAGE = 'see'; // The package name needed to access this quiz
    const CONFIG_STORAGE_KEY = 'seeQuizConfig'; // Key for localStorage

    // --- Navigation ---
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/'; // Go back to the main portal (index.html)
        });
    } else {
        console.warn("Back button element not found.");
    }


    // --- Form Submission Logic ---
    if (form) {
        form.addEventListener('submit', async (event) => { // Make the handler async
            event.preventDefault();
            clearAccessStatusMessage(); // Clear previous access messages

            if (validateForm()) {
                // --- Collect and Store Config Data (Keep this part) ---
                const numQuestions = parseInt(numQuestionsInput.value, 10);
                const timeLimit = parseInt(timeLimitInput.value, 10);
                const selectedSubjects = Array.from(subjectCheckboxes)
                                            .filter(checkbox => checkbox.checked)
                                            .map(checkbox => checkbox.value);

                const quizConfig = {
                    numQuestions: numQuestions,
                    timeLimit: timeLimit,
                    selectedSubjects: selectedSubjects,
                    quizType: QUIZ_TYPE // Add quiz type identifier
                };
                // Save config BEFORE attempting redirect, so mcq.js can find it
                localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(quizConfig));
                console.log('Quiz config saved to localStorage:', quizConfig);

                // --- NEW: Access Token Request Logic ---
                setAccessStatusMessage("Verifying access...", false, 'loading');
                startButton.disabled = true; // Disable button during check
                startButton.textContent = 'Checking...'; // Update button text

                try {
                    // Browser automatically sends session_token cookie if user logged in
                    const response = await fetch('/api/generate-access-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Send both the target file and the required package permission
                        body: JSON.stringify({
                             requestedFile: TARGET_MCQ_FILE,
                             requiredPackage: REQUIRED_PACKAGE // Added required package
                        })
                    });

                    if (response.ok) {
                        // Access Granted! Backend set the access_token cookie.
                        setAccessStatusMessage("Access granted. Starting quiz...", false, 'success');
                        // Add a small delay so user sees the success message
                        setTimeout(() => {
                             window.location.href = TARGET_MCQ_FILE; // Proceed to the MCQ page
                        }, 500); // 0.5 second delay


                    } else {
                        // Access Denied or other error
                        let errorMsg = "Could not start quiz.";
                        let responseBody = null;
                         try {
                            // Try to parse JSON error from backend, fallback to text
                            responseBody = await response.json();
                            errorMsg = responseBody.error || responseBody.message || 'An unknown error occurred.';
                         } catch (e) {
                            // If not JSON, try text
                            try {
                                errorMsg = await response.text();
                            } catch(e2) { /* ignore */ }
                         }


                        if (response.status === 401) {
                            errorMsg = `Authentication Required: Please log in first to access this quiz.`;
                            // Suggest login - maybe show a login link or redirect to index?
                        } else if (response.status === 403) {
                             errorMsg = `Permission Denied: You do not have access to the '${REQUIRED_PACKAGE}' package. (${errorMsg})`;
                        } else {
                            errorMsg = `Error (${response.status}): ${errorMsg || 'An unknown server error occurred.'}`;
                        }

                        setAccessStatusMessage(errorMsg, true); // Display error
                        startButton.disabled = false; // Re-enable button on failure
                        startButton.textContent = 'Start Quiz'; // Restore button text
                    }

                } catch (error) {
                    console.error("Error requesting access token:", error);
                    setAccessStatusMessage(`Network Error: Could not contact verification server. Please check your connection.`, true);
                    startButton.disabled = false; // Re-enable button on network error
                    startButton.textContent = 'Start Quiz'; // Restore button text
                }
                // --- END: Access Token Request Logic ---
            }
        });
    } else {
        console.error("Quiz setup form not found!");
        if (accessStatusMessageDiv) {
             setAccessStatusMessage("Error: Setup form is missing.", true);
        }
    }


    // --- Validation Functions (Keep As Is or Refine) ---
    function validateForm() {
        let isValid = true;
        clearErrors(); // Clear previous validation errors

        // Example validation - keep your existing logic
        const numQuestions = parseInt(numQuestionsInput.value, 10);
        if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 100) { // Example limits
            showError(numQuestionsError, 'Please enter a number between 1 and 100.', numQuestionsInput);
            isValid = false;
        }

        const timeLimit = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 180) { // Example limits
            showError(timeLimitError, 'Please enter a time between 1 and 180 minutes.', timeLimitInput);
            isValid = false;
        }

        const selectedCount = Array.from(subjectCheckboxes).filter(checkbox => checkbox.checked).length;
        if (selectedCount === 0) {
            // Check if subjectSelectionDiv exists before showing error
            if (subjectSelectionDiv) {
                showError(subjectsError, 'Please select at least one subject.', subjectSelectionDiv);
            } else {
                 console.warn("Subject selection div or error element not found for displaying subject errors.");
                 // Maybe display error in the main status message div as fallback?
                 // setAccessStatusMessage("Please select at least one subject.", true);
            }
            isValid = false;
        }

        return isValid;
    }

    function showError(errorElement, message, inputElement = null) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Ensure error message is visible
        if (inputElement) {
            inputElement.classList.add('input-error'); // Add class for styling the input
        } else if (errorElement === subjectsError && subjectSelectionDiv) {
             subjectSelectionDiv.classList.add('input-error'); // Style the container
        }
    }

    function clearErrors() {
         // Add checks to ensure elements exist before accessing properties
        if (numQuestionsError) numQuestionsError.textContent = ''; numQuestionsError.style.display = 'none';
        if (timeLimitError) timeLimitError.textContent = ''; timeLimitError.style.display = 'none';
        if (subjectsError) subjectsError.textContent = ''; subjectsError.style.display = 'none';
        if (numQuestionsInput) numQuestionsInput.classList.remove('input-error');
        if (timeLimitInput) timeLimitInput.classList.remove('input-error');
        if (subjectSelectionDiv) subjectSelectionDiv.classList.remove('input-error');
    }

    // --- Input Change Listeners to Clear Single Errors (Keep As Is or Refine) ---
    if (numQuestionsInput) numQuestionsInput.addEventListener('input', () => clearSingleError(numQuestionsInput, numQuestionsError));
    if (timeLimitInput) timeLimitInput.addEventListener('input', () => clearSingleError(timeLimitInput, timeLimitError));
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
             if (subjectSelectionDiv && subjectSelectionDiv.classList.contains('input-error')) {
                 const anyChecked = Array.from(subjectCheckboxes).some(cb => cb.checked);
                 if (anyChecked && subjectsError) {
                    subjectsError.textContent = '';
                    subjectsError.style.display = 'none';
                    subjectSelectionDiv.classList.remove('input-error');
                 }
             }
        });
    });

    function clearSingleError(inputEl, errorEl) {
         if (inputEl && errorEl && inputEl.classList.contains('input-error')) {
             errorEl.textContent = '';
             errorEl.style.display = 'none';
             inputEl.classList.remove('input-error');
        }
    }


    // --- Helper Functions for Access Status Message ---
    function setAccessStatusMessage(message, isError = false, type = null) {
        if (!accessStatusMessageDiv) return;
        accessStatusMessageDiv.textContent = message;
        // Use CSS classes for styling based on type
        accessStatusMessageDiv.className = 'status-message'; // Reset classes
        if (isError) {
            accessStatusMessageDiv.classList.add('error'); // Add 'error' class
        } else if (type === 'success') {
             accessStatusMessageDiv.classList.add('success'); // Add 'success' class
        } else if (type === 'loading') {
            accessStatusMessageDiv.classList.add('loading'); // Add 'loading' class
        }
        accessStatusMessageDiv.style.display = 'block'; // Make sure it's visible
    }

    function clearAccessStatusMessage() {
         if (!accessStatusMessageDiv) return;
         accessStatusMessageDiv.textContent = '';
         accessStatusMessageDiv.className = 'status-message'; // Reset classes
         accessStatusMessageDiv.style.display = 'none'; // Hide it
    }

    // --- Initial State ---
    clearErrors(); // Ensure validation errors are hidden on load
    clearAccessStatusMessage(); // Clear access message on load
    if (startButton) {
        startButton.disabled = false; // Ensure button is enabled on load
        startButton.textContent = 'Start Quiz'; // Ensure default text
    }


}); // End DOMContentLoaded
