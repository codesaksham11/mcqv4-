// /app.js

// --- DOM Elements ---
const loginHeaderBtn = document.getElementById('login-header-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');

const loginModalOverlay = document.getElementById('login-modal-overlay');
const loginModalContent = document.getElementById('login-modal-content');
const loginForm = document.getElementById('login-form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const walletInput = document.getElementById('wallet-input');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginErrorMessage = document.getElementById('login-error-message');
const modalCloseBtn = document.getElementById('modal-close-btn');

// --- State ---
let isLoginPending = false; // Prevent double submissions

// --- Functions ---

/**
 * Updates the header UI based on login status.
 * @param {boolean} isLoggedIn - Whether the user is logged in.
 * @param {string|null} userName - The user's name if logged in.
 */
function updateUI(isLoggedIn, userName = null) {
    if (isLoggedIn && userName) {
        loginHeaderBtn.style.display = 'none';
        logoutBtn.style.display = 'flex'; // Use flex as buttons use it
        userInfoDiv.style.display = 'flex'; // Use flex for alignment
        userNameSpan.textContent = userName;
    } else {
        loginHeaderBtn.style.display = 'flex'; // Use flex
        logoutBtn.style.display = 'none';
        userInfoDiv.style.display = 'none';
        userNameSpan.textContent = ''; // Clear name
    }
}

/**
 * Checks the current session status with the backend.
 */
async function checkSession() {
    try {
        const response = await fetch('/api/verify-session');
        if (!response.ok) {
            // Treat non-ok responses as logged out, but log error
            console.error('Session check failed:', response.status);
            updateUI(false);
            return;
        }
        const data = await response.json();
        updateUI(data.loggedIn, data.name); // Pass name if logged in
    } catch (error) {
        console.error('Error checking session:', error);
        updateUI(false); // Assume logged out on network error
    }
}

/**
 * Shows the login modal.
 */
function showLoginModal() {
    loginErrorMessage.textContent = ''; // Clear previous errors
    loginForm.reset(); // Reset form fields
    loginModalOverlay.classList.add('visible');
    loginModalOverlay.setAttribute('aria-hidden', 'false');
    nameInput.focus(); // Focus the first field
}

/**
 * Hides the login modal.
 */
function hideLoginModal() {
    loginModalOverlay.classList.remove('visible');
    loginModalOverlay.setAttribute('aria-hidden', 'true');
    // Re-enable button if it was disabled during a failed attempt
    loginSubmitBtn.disabled = false;
    loginSubmitBtn.textContent = 'Login'; // Restore original text
    isLoginPending = false;
}

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
async function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    if (isLoginPending) return; // Avoid double clicks

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const walletNumber = walletInput.value.trim();

    // Basic frontend validation
    if (!name || !email || !walletNumber) {
        loginErrorMessage.textContent = 'Please fill in all fields.';
        loginErrorMessage.classList.remove('verifying');
        return;
    }

    isLoginPending = true;
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = 'Verifying...';
    loginErrorMessage.textContent = 'Attempting login...'; // Indicate activity
    loginErrorMessage.classList.add('verifying'); // Style verifying message

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, walletNumber }),
        });

        if (response.ok) {
            // Login successful
            hideLoginModal();
            await checkSession(); // Refresh UI immediately
        } else if (response.status === 401) {
            loginErrorMessage.textContent = 'Invalid Email or Wallet Number.';
            loginErrorMessage.classList.remove('verifying');
        } else {
            // Generic error for other statuses (400, 500, etc.)
            loginErrorMessage.textContent = 'Login failed. Please try again later.';
            loginErrorMessage.classList.remove('verifying');
            console.error('Login failed with status:', response.status);
        }
    } catch (error) {
        console.error('Error during login fetch:', error);
        loginErrorMessage.textContent = 'An network error occurred. Please check your connection.';
        loginErrorMessage.classList.remove('verifying');
    } finally {
        // Re-enable button unless login was successful (modal is hidden then)
        if (!loginModalOverlay.classList.contains('visible')) {
             // If modal is hidden (success), no need to reset button state here
        } else {
             loginSubmitBtn.disabled = false;
             loginSubmitBtn.textContent = 'Login'; // Restore original text only on failure
        }
        isLoginPending = false; // Allow new submissions
    }
}

/**
 * Handles the logout process.
 */
async function handleLogout() {
    try {
        // Optional: Show a visual cue like disabling the button
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';

        await fetch('/api/logout', { method: 'POST' });
        // No need to check response status, always update UI to logged out
    } catch (error) {
        console.error('Error during logout fetch:', error);
        // Still update UI even if API call fails
    } finally {
        // Restore button state (it will be hidden by updateUI anyway)
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Logout';
        updateUI(false); // Update UI to logged-out state
    }
}


// --- Event Listeners ---

// Show login modal when header button is clicked
if (loginHeaderBtn) {
    loginHeaderBtn.addEventListener('click', showLoginModal);
}

// Hide login modal when close button is clicked
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', hideLoginModal);
}

// Hide login modal when clicking outside the content area
if (loginModalOverlay) {
    loginModalOverlay.addEventListener('click', (event) => {
        if (event.target === loginModalOverlay) { // Only if clicking the overlay itself
            hideLoginModal();
        }
    });
}

// Handle form submission
if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
}

// Handle logout button click
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Close modal on Escape key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && loginModalOverlay.classList.contains('visible')) {
        hideLoginModal();
    }
});


// --- Initialisation ---
// Check session status when the script loads
checkSession();
