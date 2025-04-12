// app.js - KV Based Login Flow

// --- DOM Element References ---
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const walletInput = document.getElementById('wallet-input');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginStatusMessageDiv = document.getElementById('login-status-message');

const headerSubtitle = document.getElementById('header-subtitle');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

const mainContent = document.querySelector('main'); // Select the main element
const optionButtons = document.querySelectorAll('.option-button');
const statusMessageDiv = document.getElementById('status-message'); // General status message div

// --- Global State ---
let isLoggedIn = false; // Simple flag to track UI state
let userEmail = null; // Store email on successful login

// --- Functions ---

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
async function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent default browser form submission

    const email = emailInput.value.trim();
    const walletNumber = walletInput.value.trim();

    // Basic validation
    if (!email || !walletNumber) {
        setLoginStatusMessage("Please enter both email and wallet number.", true);
        return;
    }

    setLoginStatusMessage("Logging in...", false);
    loginSubmitBtn.disabled = true; // Disable button during request

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, walletNumber: walletNumber })
        });

        if (response.ok) {
            // Login successful! Backend should have set the HttpOnly session_token cookie.
            userEmail = email; // Store the email locally for display
            showLoggedInState(userEmail);
            setLoginStatusMessage(""); // Clear login message area
        } else {
            // Login failed
            let errorMsg = "Login failed. Please check your email and wallet number.";
            if (response.status === 401) {
                errorMsg = "Login failed: Invalid email or wallet number.";
            } else {
                // Try to get more specific error from backend if possible
                try {
                    const errorData = await response.text();
                    console.error(`Login error ${response.status}:`, errorData);
                    if (errorData) errorMsg += ` (Server says: ${errorData})`;
                } catch (_) { /* Ignore if reading body fails */ }
            }
            setLoginStatusMessage(errorMsg, true);
            loginSubmitBtn.disabled = false; // Re-enable button
        }
    } catch (error) {
        console.error("Network or fetch error during login:", error);
        setLoginStatusMessage("Login request failed. Please check your connection or try again later.", true);
        loginSubmitBtn.disabled = false; // Re-enable button
    }
}

/**
 * Updates the UI to show the logged-in state.
 * @param {string} displayEmail - The email to display.
 */
function showLoggedInState(displayEmail) {
    isLoggedIn = true;
    loginForm.style.display = 'none'; // Hide login form
    mainContent.style.display = 'block'; // Show main content (MCQ buttons)

    // Update header
    headerSubtitle.textContent = "Select the exam you wish to access.";
    userEmailSpan.textContent = displayEmail || 'N/A';
    userInfoDiv.style.display = 'flex';
    logoutBtn.style.display = 'flex';

    // Enable MCQ buttons and add listeners
    optionButtons.forEach(button => {
        button.disabled = false;
        // Remove potential old listener before adding a new one
        button.removeEventListener('click', handleAccessRequest);
        button.addEventListener('click', handleAccessRequest);
    });
}

/**
 * Updates the UI to show the logged-out state.
 */
function showLoggedOutState() {
    isLoggedIn = false;
    userEmail = null;
    loginForm.style.display = 'block'; // Show login form
    mainContent.style.display = 'none'; // Hide main content

    // Update header
    headerSubtitle.textContent = "Please log in to access your exams.";
    userInfoDiv.style.display = 'none';
    logoutBtn.style.display = 'none';

    // Disable MCQ buttons and clear general status
    optionButtons.forEach(button => {
        button.disabled = true;
    });
    setStatusMessage("");
    setLoginStatusMessage(""); // Also clear login status
    emailInput.value = ''; // Clear form fields
    walletInput.value = '';
    loginSubmitBtn.disabled = false; // Ensure login button is enabled
}

/**
 * Handles logout action. (Note: Can't delete HttpOnly cookie from JS)
 */
function handleLogout() {
    // Ideally, you'd also call a backend endpoint '/api/logout' here
    // which would clear the HttpOnly session_token cookie via Set-Cookie header.
    // fetch('/api/logout', { method: 'POST' });

    console.log("Logging out (UI change only).");
    showLoggedOutState();
    // Maybe redirect to login page or refresh, although showLoggedOutState handles UI.
}

/**
 * Handles the click event on the MCQ access buttons.
 * Requests an access token from the backend.
 * @param {Event} event - The click event object.
 */
async function handleAccessRequest(event) {
    if (!isLoggedIn) {
        setStatusMessage("Error: You seem to be logged out. Please log in again.", true);
        showLoggedOutState(); // Force back to login view
        return;
    }

    const button = event.currentTarget;
    const requestedFile = button.dataset.file;

    if (!requestedFile) {
        console.error("Error: Button missing data-file attribute.", button);
        setStatusMessage("Configuration error: Cannot determine which file to access.", true);
        return;
    }

    setStatusMessage(`Requesting access to ${requestedFile}...`, false);
    button.disabled = true; // Temporarily disable this button

    try {
        // Browser automatically sends the session_token cookie
        const response = await fetch('/api/generate-access-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestedFile: requestedFile })
        });

        if (response.ok) {
            // Success! Backend set the HttpOnly access_token cookie.
            setStatusMessage(`Access granted! Redirecting to ${requestedFile}...`, false);
            window.location.href = `/${requestedFile}`; // Redirect
        } else {
            // Handle specific errors
            let errorMsg = `Access denied.`;
            try {
                 const errorData = await response.text();
                 console.warn(`Server response (${response.status}): ${errorData}`);
                 errorMsg = `Access denied (${response.status}): ${errorData || 'No details provided.'}`;
             } catch (_) {
                 errorMsg = `Access denied with status ${response.status}.`;
             }

            if (response.status === 401) { // Session invalid or expired
                errorMsg = `Access denied: Your session may have expired (${response.status}). Please log in again.`;
                handleLogout(); // Force logout if session is bad
            } else if (response.status === 403) { // Permission denied for file
                 errorMsg = `Access denied: Permission denied for ${requestedFile} (${response.status}).`;
            } else if (response.status === 404) { // Endpoint not found
                 errorMsg = `Error: Access grant endpoint not found (${response.status}). Backend may not be deployed.`;
            }
            setStatusMessage(errorMsg, true);
            button.disabled = false; // Re-enable button on failure
        }
    } catch (error) {
        console.error("Error requesting access token:", error);
        setStatusMessage(`An error occurred while requesting access: ${error.message}`, true);
        button.disabled = false; // Re-enable button
    }
}

/** Helper to display login status messages */
function setLoginStatusMessage(message, isError = false) {
    if (!loginStatusMessageDiv) return;
    loginStatusMessageDiv.textContent = message;
    loginStatusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
     if (!isError && message) {
         // Optional: Auto-clear non-error messages
         // setTimeout(clearLoginStatusMessage, 4000);
     }
}
function clearLoginStatusMessage() {
     if (!loginStatusMessageDiv) return;
     loginStatusMessageDiv.textContent = '';
}

/** Helper to display general status messages */
function setStatusMessage(message, isError = false) {
    if (!statusMessageDiv) return;
    statusMessageDiv.textContent = message;
    statusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
     if (!isError && message) {
         setTimeout(clearStatusMessage, 4000);
     }
}
function clearStatusMessage() {
    if (!statusMessageDiv) return;
    statusMessageDiv.textContent = '';
}


// --- Event Listeners Setup ---
if (loginForm && logoutBtn) {
    loginForm.addEventListener('submit', handleLoginSubmit);
    logoutBtn.addEventListener('click', handleLogout);
    console.log("Login/Logout listeners attached.");
} else {
    console.error("Fatal Error: Login form or logout button not found in the DOM.");
    alert("Critical UI elements missing. Page cannot function correctly.");
}


// --- Initial Page State ---
// Start in the logged-out state by default when the page loads.
showLoggedOutState();
console.log("App.js loaded. Initial state set to logged out.");
