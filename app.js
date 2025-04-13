// app.js - Modal Login Flow for index.html

// --- DOM Element References ---
// Header elements
const loginHeaderBtn = document.getElementById('login-header-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const headerSubtitle = document.getElementById('header-subtitle');

// Login Modal elements
const loginModalOverlay = document.getElementById('login-modal-overlay');
const loginModalContent = document.getElementById('login-modal-content');
const loginModalCloseBtn = document.getElementById('modal-close-btn');
const loginForm = document.getElementById('login-form'); // Form inside the modal
const emailInput = document.getElementById('email-input');
const walletInput = document.getElementById('wallet-input');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginStatusMessageDiv = document.getElementById('login-status-message');

// General Status Message Div (might be used less now)
const statusMessageDiv = document.getElementById('status-message');

// --- Global State ---
let isLoggedIn = false; // Track if user is considered logged in based on session existence
let userEmail = null; // Store email locally just for display after successful login

// --- Functions ---

/** Opens the login modal */
function openLoginModal() {
    if (!loginModalOverlay) return;
    emailInput.value = ''; // Clear fields on open
    walletInput.value = '';
    clearLoginStatusMessage();
    loginSubmitBtn.disabled = false; // Ensure button is enabled
    loginModalOverlay.classList.add('visible');
}

/** Closes the login modal */
function closeLoginModal() {
    if (!loginModalOverlay) return;
    loginModalOverlay.classList.remove('visible');
}

/**
 * Handles the login form submission from the modal.
 * @param {Event} event - The form submission event.
 */
async function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent default browser form submission

    const email = emailInput.value.trim();
    const walletNumber = walletInput.value.trim();

    if (!email || !walletNumber) {
        setLoginStatusMessage("Please enter both email and wallet number.", true);
        return;
    }

    setLoginStatusMessage("Logging in...", false);
    loginSubmitBtn.disabled = true;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, walletNumber: walletNumber })
        });

        if (response.ok) {
            // Login successful! Backend set the session_token cookie.
            userEmail = email; // Store for display
            showLoggedInState(userEmail); // Update UI
            closeLoginModal(); // Close the modal on success
            setLoginStatusMessage(""); // Clear message
        } else {
            let errorMsg = "Login failed. Please check your email and wallet number.";
            if (response.status === 401) {
                errorMsg = "Login failed: Invalid email or wallet number.";
            } else {
                try {
                    const errorData = await response.text();
                    console.error(`Login error ${response.status}:`, errorData);
                    if (errorData) errorMsg += ` (Server says: ${errorData})`;
                } catch (_) { /* Ignore */ }
            }
            setLoginStatusMessage(errorMsg, true);
            loginSubmitBtn.disabled = false; // Re-enable button
        }
    } catch (error) {
        console.error("Network or fetch error during login:", error);
        setLoginStatusMessage("Login request failed. Check connection or try again.", true);
        loginSubmitBtn.disabled = false;
    }
}

/**
 * Updates the UI to show the logged-in state (updates header).
 * @param {string} displayEmail - The email to display.
 */
function showLoggedInState(displayEmail) {
    isLoggedIn = true;

    // Update header elements
    if (headerSubtitle) headerSubtitle.textContent = "Select an exam type to configure.";
    if (userEmailSpan) userEmailSpan.textContent = displayEmail || 'N/A';
    if (userInfoDiv) userInfoDiv.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'flex';
    if (loginHeaderBtn) loginHeaderBtn.style.display = 'none';
}

/**
 * Updates the UI to show the logged-out state (updates header).
 */
function showLoggedOutState() {
    isLoggedIn = false;
    userEmail = null;

    // Update header elements
    if (headerSubtitle) headerSubtitle.textContent = "Select an exam type to configure, or log in.";
    if (userInfoDiv) userInfoDiv.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginHeaderBtn) loginHeaderBtn.style.display = 'flex';

    clearStatusMessage();
    clearLoginStatusMessage();
}

/**
 * Handles logout action. Updates UI, logs message.
 * Note: Ideally calls a backend endpoint to invalidate session/cookie.
 */
function handleLogout() {
    console.log("Logout button clicked. Updating UI to logged-out state.");
    // TODO: Implement fetch POST to '/api/logout' endpoint later if needed.
    // This backend endpoint would clear the session_token cookie.
    // fetch('/api/logout', { method: 'POST' });

    showLoggedOutState();
    // Optional: Display a confirmation message
    setStatusMessage("You have been logged out.", false);
}

/** Helper to display login status messages within the modal */
function setLoginStatusMessage(message, isError = false) {
    if (!loginStatusMessageDiv) return;
    loginStatusMessageDiv.textContent = message;
    loginStatusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
    // Keep error messages until next action
}
function clearLoginStatusMessage() {
    if (!loginStatusMessageDiv) return;
    loginStatusMessageDiv.textContent = '';
}

/** Helper to display general status messages outside the modal */
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

// Listener for header login button to open modal
if (loginHeaderBtn) {
    loginHeaderBtn.addEventListener('click', openLoginModal);
} else {
    console.error("Header Login Button not found.");
}

// Listener for logout button
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
} else {
    console.error("Logout Button not found.");
}

// Listener for login form submission (inside modal)
if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
} else {
    console.error("Login Form not found in modal.");
}

// Listeners to close the modal
if (loginModalCloseBtn) {
    loginModalCloseBtn.addEventListener('click', closeLoginModal);
} else {
    console.error("Modal Close Button not found.");
}
if (loginModalOverlay) {
    // Close modal if user clicks on the dark overlay area
    loginModalOverlay.addEventListener('click', (event) => {
        // Important: Only close if the click is directly on the overlay,
        // not on the modal content itself (event bubbling).
        if (event.target === loginModalOverlay) {
            closeLoginModal();
        }
    });
} else {
    console.error("Login Modal Overlay not found.");
}


// --- Initial Page State ---
// Check if user might already be logged in? (Advanced: Could check session cookie validity here)
// For now, always start assuming logged out visually.
showLoggedOutState();
console.log("App.js loaded for index.html. Initial state set to logged out.");

// Remove any previously attached access request listeners if they existed
// (This logic is now moved to the setup pages)
// optionButtons.forEach(button => {
//     button.removeEventListener('click', handleAccessRequest);
// });
