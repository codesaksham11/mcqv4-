// /ktm_setup.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM References (Keep existing KTM ones) ---
    const form = document.getElementById('quiz-setup-form');
    const numQuestionsInput = document.getElementById('num-questions');
    const timeLimitInput = document.getElementById('time-limit');
    const topicCheckboxes = document.querySelectorAll('input[name="topic"]'); // Specific to KTM
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button'); // Make sure this exists in HTML

    // Error message elements
    const numQuestionsError = document.getElementById('num-questions-error');
    const timeLimitError = document.getElementById('time-limit-error');
    const topicsError = document.getElementById('topics-error'); // Specific to KTM
    const topicSelectionDiv = document.querySelector('.topic-selection'); // Specific to KTM

    // --- NEW: Reference for the status message area ---
    // Needs to exist in ktm_setup.html: <div id="access-status-message" class="status-message" role="status"></div>
    const accessStatusMessageDiv = document.getElementById('access-status-message');

    // --- Constants for this specific setup (KTM) ---
    const QUIZ_TYPE = 'ktm';
    const TARGET_MCQ_FILE = 'ktm_mcq.html';
    const REQUIRED_PACKAGE = 'ktm'; // The package name needed for KTM quiz
    const CONFIG_STORAGE_KEY = 'ktmQuizConfig'; // Use the specific key for KTM config

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

            if (validateForm()) { // Use existing KTM validation
                // --- Collect and Store Config Data (Keep KTM's topic logic) ---
                const numQuestions = parseInt(numQuestionsInput.value, 10);
                const timeLimit = parseInt(timeLimitInput.value, 10);
                const selectedTopics = Array.from(topicCheckboxes) // Use topics
                                            .filter(checkbox => checkbox.checked)
                                            .map(checkbox => checkbox.value);

                const quizConfig = {
                    numQuestions: numQuestions,
                    timeLimit: timeLimit,
                    selectedTopics: selectedTopics, // Store topics
                    quizType: QUIZ_TYPE
                };
                // Save config BEFORE attempting redirect, using the correct key
                localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(quizConfig));
                console.log('KTM Quiz config saved to localStorage:', quizConfig);

                // --- NEW: Access Token Request Logic (Copied from see_setup.js) ---
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
                             requestedFile: TARGET_MCQ_FILE,    // Use KTM target file
                             requiredPackage: REQUIRED_PACKAGE // Use KTM required package
                        })
                    });

                    if (response.ok) {
                        // Access Granted!
                        setAccessStatusMessage("Access granted. Starting quiz...", false, 'success');
                        setTimeout(() => {
                             window.location.href = TARGET_MCQ_FILE; // Proceed to KTM MCQ page
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
                        startButton.textContent = 'Start KTM Quiz →'; // Restore button text (Adjust if needed)
                    }

                } catch (error) {
                    console.error("Error requesting access token:", error);
                    setAccessStatusMessage(`Network Error: Could not contact verification server. Please check your connection.`, true);
                    startButton.disabled = false; // Re-enable button on network error
                    startButton.textContent = 'Start KTM Quiz →'; // Restore button text (Adjust if needed)
                }
                // --- END: Access Token Request Logic ---

                // ** REMOVE the original direct redirect **
                // window.location.href = 'ktm_mcq.html';
            }
        });
    } else {
        console.error("KTM Quiz setup form not found!");
        if (accessStatusMessageDiv) {
             setAccessStatusMessage("Error: Setup form is missing.", true);
        }
    }


    // --- Validation Functions (Keep KTM's logic) ---
    function validateForm() {
        let isValid = true;
        clearErrors();

        const numQuestions = parseInt(numQuestionsInput.value, 10);
        if (isNaN(numQuestions) || numQuestions < 10 || numQuestions > 100) {
            showError(numQuestionsError, 'Please enter a number between 10 and 100.', numQuestionsInput);
            isValid = false;
        }

        const timeLimit = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 180) {
            showError(timeLimitError, 'Please enter a time between 1 and 180 minutes.', timeLimitInput);
            isValid = false;
        }

        // Use KTM's topic validation
        const selectedCount = Array.from(topicCheckboxes).filter(checkbox => checkbox.checked).length;
        if (selectedCount === 0) {
             // Check if topicSelectionDiv exists before showing error
             if (topicSelectionDiv) {
                showError(topicsError, 'Please select at least one topic.', topicSelectionDiv);
             } else {
                 console.warn("Topic selection div or error element not found for displaying topic errors.");
             }
            isValid = false;
        }

        return isValid;
    }

    function showError(errorElement, message, inputOrContainerElement = null) {
         if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Make error visible
        if (inputOrContainerElement) {
            inputOrContainerElement.classList.add('input-error');
        }
    }

    function clearErrors() {
        // Add checks for element existence
        if(numQuestionsError) numQuestionsError.textContent = ''; numQuestionsError.style.display = 'none';
        if(timeLimitError) timeLimitError.textContent = ''; timeLimitError.style.display = 'none';
        if(topicsError) topicsError.textContent = ''; topicsError.style.display = 'none'; // Clear topic error
        if(numQuestionsInput) numQuestionsInput.classList.remove('input-error');
        if(timeLimitInput) timeLimitInput.classList.remove('input-error');
        if(topicSelectionDiv) topicSelectionDiv.classList.remove('input-error'); // Remove error class from topic container
    }

    // --- Dynamic Error Clearing (Keep KTM's logic) ---
    if (numQuestionsInput) numQuestionsInput.addEventListener('input', () => clearErrorOnChange(numQuestionsInput, numQuestionsError));
    if (timeLimitInput) timeLimitInput.addEventListener('input', () => clearErrorOnChange(timeLimitInput, timeLimitError));

    topicCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (topicSelectionDiv && topicSelectionDiv.classList.contains('input-error')) {
                const anyChecked = Array.from(topicCheckboxes).some(cb => cb.checked);
                if (anyChecked && topicsError) { // Check topicsError exists
                   topicsError.textContent = '';
                   topicsError.style.display = 'none'; // Hide error
                   topicSelectionDiv.classList.remove('input-error');
                }
            }
       });
    });

    function clearErrorOnChange(inputElement, errorElement) {
         if (inputElement && errorElement && inputElement.classList.contains('input-error')) {
             errorElement.textContent = '';
             errorElement.style.display = 'none'; // Hide error
             inputElement.classList.remove('input-error');
        }
    }

    // --- NEW: Helper Functions for Access Status Message (Copied from see_setup.js) ---
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
        startButton.textContent = 'Start KTM Quiz →'; // Ensure default text (Adjust if needed)
    }

}); // End DOMContentLoaded
