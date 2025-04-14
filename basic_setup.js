// /basic_setup.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM References (Keep existing Basic ones) ---
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button'); // Make sure this exists in HTML

    // Error message elements
    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');
    // No topicsError or topicSelectionDiv needed for Basic

    // --- NEW: Reference for the status message area ---
    // Needs to exist in basic_setup.html: <div id="access-status-message" class="status-message" role="status"></div>
    const accessStatusMessageDiv = document.getElementById('access-status-message');

    // --- Constants for this specific setup (Basic) ---
    const QUIZ_TYPE = 'basic';
    const TARGET_MCQ_FILE = 'basic_mcq.html';
    const REQUIRED_PACKAGE = 'basic'; // The package name needed for Basic quiz
    const CONFIG_STORAGE_KEY = 'basicQuizConfig'; // Use the specific key for Basic config
    const FIXED_SUBJECTS = ["Physics", "Chemistry", "Biology", "English"]; // Keep fixed subjects

    // --- Navigation (Keep As Is) ---
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/'; // Go back to the main portal (index.html)
        });
    } else {
        console.warn("Back button element not found.");
    }

    // --- Form Submission Logic (Integrate Access Check) ---
    if (form) {
        form.addEventListener('submit', async (event) => { // Make the handler async
            event.preventDefault();
            clearAccessStatusMessage(); // Clear previous access messages

            if (validateForm()) { // Use existing Basic validation
                // --- Collect and Store Config Data (Keep Basic's fixed subject logic) ---
                const numQuestions = parseInt(numQuestionsInput.value, 10);
                const timeLimit = parseInt(timeLimitInput.value, 10);
                const selectedSubjects = FIXED_SUBJECTS; // Use fixed subjects

                const quizConfig = {
                    numQuestions: numQuestions,
                    timeLimit: timeLimit,
                    selectedSubjects: selectedSubjects, // Store fixed list
                    quizType: QUIZ_TYPE
                };
                // Save config BEFORE attempting redirect, using the correct key
                localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(quizConfig));
                console.log('Basic Quiz config saved to localStorage:', quizConfig);

                // --- NEW: Access Token Request Logic (Copied template) ---
                setAccessStatusMessage("Verifying access...", false, 'loading');
                startButton.disabled = true; // Disable button during check
                startButton.textContent = 'Checking...'; // Update button text

                try {
                    const response = await fetch('/api/generate-access-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                             requestedFile: TARGET_MCQ_FILE,    // Use Basic target file
                             requiredPackage: REQUIRED_PACKAGE // Use Basic required package
                        })
                    });

                    if (response.ok) {
                        // Access Granted!
                        setAccessStatusMessage("Access granted. Starting quiz...", false, 'success');
                        setTimeout(() => {
                             window.location.href = TARGET_MCQ_FILE; // Proceed to Basic MCQ page
                        }, 500);

                    } else {
                        // Access Denied or other error
                        let errorMsg = "Could not start quiz.";
                        let responseBody = null;
                         try {
                            responseBody = await response.json();
                            errorMsg = responseBody.error || responseBody.message || 'An unknown error occurred.';
                         } catch (e) { try { errorMsg = await response.text(); } catch(e2) {} }

                        if (response.status === 401) {
                            errorMsg = `Authentication Required: Please log in first to access this quiz.`;
                        } else if (response.status === 403) {
                             errorMsg = `Permission Denied: You do not have access to the '${REQUIRED_PACKAGE}' package. (${errorMsg})`;
                        } else {
                            errorMsg = `Error (${response.status}): ${errorMsg || 'An unknown server error occurred.'}`;
                        }

                        setAccessStatusMessage(errorMsg, true); // Display error
                        startButton.disabled = false; // Re-enable button on failure
                        startButton.textContent = 'Start Basic Quiz →'; // Restore button text
                    }

                } catch (error) {
                    console.error("Error requesting access token:", error);
                    setAccessStatusMessage(`Network Error: Could not contact verification server. Please check your connection.`, true);
                    startButton.disabled = false; // Re-enable button on network error
                    startButton.textContent = 'Start Basic Quiz →'; // Restore button text
                }
                // --- END: Access Token Request Logic ---

                // ** REMOVE the original direct redirect **
                // window.location.href = 'basic_mcq.html';
            }
        });
    } else {
        console.error("Basic Quiz setup form not found!");
        if (accessStatusMessageDiv) {
             setAccessStatusMessage("Error: Setup form is missing.", true);
        }
    }


    // --- Validation Functions (Keep Basic's logic) ---
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
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Make error visible
        if (inputElement) {
            inputElement.classList.add('input-error');
        }
    }

    function clearErrors() {
        if (numQuestionsError) numQuestionsError.textContent = ''; numQuestionsError.style.display = 'none';
        if (timeLimitError) timeLimitError.textContent = ''; timeLimitError.style.display = 'none';
        if (numQuestionsInput) numQuestionsInput.classList.remove('input-error');
        if (timeLimitInput) timeLimitInput.classList.remove('input-error');
    }

    // --- Dynamic Error Clearing (Keep Basic's logic) ---
    if (numQuestionsInput) {
        numQuestionsInput.addEventListener('input', () => {
            if (numQuestionsInput.classList.contains('input-error')) {
                 if(numQuestionsError) numQuestionsError.textContent = ''; numQuestionsError.style.display = 'none';
                 numQuestionsInput.classList.remove('input-error');
            }
        });
    }
    if (timeLimitInput) {
        timeLimitInput.addEventListener('input', () => {
            if (timeLimitInput.classList.contains('input-error')) {
                 if(timeLimitError) timeLimitError.textContent = ''; timeLimitError.style.display = 'none';
                 timeLimitInput.classList.remove('input-error');
            }
        });
    }

    // --- NEW: Helper Functions for Access Status Message ---
    function setAccessStatusMessage(message, isError = false, type = null) {
        if (!accessStatusMessageDiv) return;
        accessStatusMessageDiv.textContent = message;
        accessStatusMessageDiv.className = 'status-message'; // Reset classes
        if (isError) { accessStatusMessageDiv.classList.add('error'); }
        else if (type === 'success') { accessStatusMessageDiv.classList.add('success'); }
        else if (type === 'loading') { accessStatusMessageDiv.classList.add('loading'); }
        accessStatusMessageDiv.style.display = 'block'; // Make visible
    }

    function clearAccessStatusMessage() {
         if (!accessStatusMessageDiv) return;
         accessStatusMessageDiv.textContent = '';
         accessStatusMessageDiv.className = 'status-message'; // Reset classes
         accessStatusMessageDiv.style.display = 'none'; // Hide it
    }

    // --- NEW: Initial State ---
    clearErrors(); // Ensure validation errors are hidden on load
    clearAccessStatusMessage(); // Clear access message on load
    if (startButton) {
        startButton.disabled = false; // Ensure button is enabled on load
        startButton.textContent = 'Start Basic Quiz →'; // Ensure default text
    }

}); // End DOMContentLoaded
