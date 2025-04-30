// /app.js

// --- DOM Elements ---
const loginHeaderBtn = document.getElementById('login-header-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');

// Login Modal Elements
const loginModalOverlay = document.getElementById('login-modal-overlay');
const loginModalContent = document.getElementById('login-modal-content');
const loginForm = document.getElementById('login-form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const walletInput = document.getElementById('wallet-input');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginErrorMessage = document.getElementById('login-error-message');
const modalCloseBtn = document.getElementById('modal-close-btn');

// <<< NEW: Confirmation Modal Elements >>>
const confirmationModalOverlay = document.getElementById('confirmation-modal-overlay');
const confirmationModalContent = document.getElementById('confirmation-modal-content'); // Optional, for complex interactions
const confirmProceedBtn = document.getElementById('confirm-proceed-btn');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
// <<< END NEW >>>

// --- State ---
let isLoginPending = false; // Prevent double submissions
// <<< NEW: Store login details temporarily for confirmation >>>
let pendingLoginDetails = null;
// <<< END NEW >>>

// --- Functions ---

/**
 * Updates the header UI based on login status.
 * @param {boolean} isLoggedIn - Whether the user is logged in.
 * @param {string|null} userName - The user's name if logged in.
 */
function updateUI(isLoggedIn, userName = null) {
    if (isLoggedIn && userName) {
        loginHeaderBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';
        userInfoDiv.style.display = 'flex';
        userNameSpan.textContent = userName;
    } else {
        loginHeaderBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        userInfoDiv.style.display = 'none';
        userNameSpan.textContent = '';
    }
}

/**
 * Checks the current session status with the backend.
 */
async function checkSession() {
    try {
        const response = await fetch('/api/verify-session');
        if (!response.ok) {
            console.error('Session check failed:', response.status);
            updateUI(false);
            return;
        }
        const data = await response.json();
        updateUI(data.loggedIn, data.name);
    } catch (error) {
        console.error('Error checking session:', error);
        updateUI(false);
    }
}

/**
 * Shows the login modal.
 */
function showLoginModal() {
    loginErrorMessage.textContent = '';
    loginForm.reset();
    loginModalOverlay.classList.add('visible');
    loginModalOverlay.setAttribute('aria-hidden', 'false');
    nameInput.focus();
}

/**
 * Hides the login modal.
 */
function hideLoginModal() {
    loginModalOverlay.classList.remove('visible');
    loginModalOverlay.setAttribute('aria-hidden', 'true');
    resetLoginAttemptState(); // Reset state when hiding
    pendingLoginDetails = null; // Clear pending details
}

// <<< NEW: Functions to control the Confirmation Modal >>>
/**
 * Shows the confirmation modal.
 */
function showConfirmationModal() {
    confirmationModalOverlay.classList.add('visible');
    confirmationModalOverlay.setAttribute('aria-hidden', 'false');
    confirmProceedBtn.focus(); // Focus the 'Proceed' button by default
}

/**
 * Hides the confirmation modal.
 */
function hideConfirmationModal() {
    confirmationModalOverlay.classList.remove('visible');
    confirmationModalOverlay.setAttribute('aria-hidden', 'true');
}
// <<< END NEW >>>


/**
 * Performs the actual login API call.
 * @param {string} name
 * @param {string} email
 * @param {string} walletNumber
 * @param {boolean} forceLogin - Flag to indicate if overriding an existing session.
 * @returns {Promise<Response>} The fetch response promise.
 */
async function performLoginRequest(name, email, walletNumber, forceLogin = false) {
    const body = { name, email, walletNumber };
    if (forceLogin) {
        body.forceLogin = true;
    }

    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}

/**
 * Resets the login button and pending state, optionally sets error message.
 */
function resetLoginAttemptState(errorMessage = '') {
    // Only reset if the login modal is actually visible
    if (loginModalOverlay.classList.contains('visible')) {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = 'Login'; // Restore base text
        loginSubmitBtn.querySelector('.icon').textContent = '🚀'; // Restore icon
        loginErrorMessage.textContent = errorMessage;
        loginErrorMessage.classList.remove('verifying');
    }
     // Always reset pending state regardless of modal visibility
    isLoginPending = false;
    pendingLoginDetails = null; // Clear pending details on any reset
}

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    if (isLoginPending) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const walletNumber = walletInput.value.trim();

    if (!name || !email || !walletNumber) {
        resetLoginAttemptState('Please fill in all fields.'); // Use helper
        return;
    }

    isLoginPending = true;
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = 'Verifying...';
    loginSubmitBtn.querySelector('.icon').textContent = '⏳'; // Change icon
    loginErrorMessage.textContent = 'Attempting login...';
    loginErrorMessage.classList.add('verifying');

    // Store details in case we need them for confirmation
    pendingLoginDetails = { name, email, walletNumber };

    try {
        const response = await performLoginRequest(name, email, walletNumber, false);

        if (response.ok) {
            hideLoginModal(); // Also calls resetLoginAttemptState
            await checkSession();
        } else if (response.status === 401) {
            resetLoginAttemptState('Invalid Email or Wallet Number.');
        } else if (response.status === 409) {
            // <<< CHANGE START: Use Custom Confirmation Modal >>>
            console.log('Login conflict detected (409)');
            // Reset the main login button state before showing confirmation
            resetLoginAttemptState('Confirmation required: Session conflict.');
            // Show the custom modal instead of window.confirm
            showConfirmationModal();
            // IMPORTANT: Don't proceed further here; wait for confirmation modal interaction
            // <<< CHANGE END >>>
        } else {
            console.error('Login failed with status:', response.status);
            resetLoginAttemptState('Login failed. Please try again later.');
        }
    } catch (error) {
        console.error('Error during initial login fetch:', error);
        resetLoginAttemptState('A network error occurred. Please check connection.');
    }
    // NOTE: No 'finally' block needed to reset state here if it depends on modal interaction
}

// <<< NEW: Function to handle the forced login attempt after confirmation >>>
async function handleForcedLogin() {
    if (!pendingLoginDetails || isLoginPending) {
        console.warn('Attempted forced login without pending details or while already pending.');
        return; // Should not happen in normal flow
    }

    // Prevent double clicks on 'Proceed'
    if (isLoginPending) return;
    isLoginPending = true;

    // Optionally update UI to indicate override attempt
    // (Could update main login modal message if desired, but it might be hidden)
    console.log('Proceeding with forced login...');
    confirmProceedBtn.disabled = true; // Disable proceed button temporarily
    confirmProceedBtn.textContent = 'Processing...';
    confirmCancelBtn.disabled = true; // Disable cancel too

    const { name, email, walletNumber } = pendingLoginDetails;

    try {
        const forceResponse = await performLoginRequest(name, email, walletNumber, true);

        if (forceResponse.ok) {
            hideConfirmationModal(); // Hide confirmation modal
            hideLoginModal();       // Hide login modal
            await checkSession();   // Update UI
            // State is reset by hideLoginModal/resetLoginAttemptState
        } else {
            // Handle error during forced login - display error in the *login* modal
            hideConfirmationModal(); // Still hide confirmation modal on failure
            let errorMsg = 'Login override failed. Please try again later.';
            if (forceResponse.status === 401) {
                 errorMsg = 'Login failed during override (Invalid Credentials).';
            }
            console.error('Forced login failed with status:', forceResponse.status);
             // Reset state *and* show error in login modal
            resetLoginAttemptState(errorMsg);
        }
    } catch (forceError) {
        hideConfirmationModal(); // Still hide confirmation modal on network error
        console.error('Error during forced login fetch:', forceError);
         // Reset state *and* show error in login modal
        resetLoginAttemptState('A network error occurred during override.');
    } finally {
         // Re-enable confirmation buttons if modal is still somehow visible
         // and reset pending state *if* login didn't succeed
        if (confirmationModalOverlay.classList.contains('visible')) {
             confirmProceedBtn.disabled = false;
             confirmProceedBtn.innerHTML = '<span class="icon">✔️</span> Proceed'; // Restore text + icon
             confirmCancelBtn.disabled = false;
        }
        // Reset isLoginPending only if we didn't successfully login/hide modals
        if (!loginModalOverlay.classList.contains('visible') && !confirmationModalOverlay.classList.contains('visible')) {
             // Successful login path handles reset via hideLoginModal/resetLoginAttemptState
        } else {
             isLoginPending = false; // Ensure pending state is cleared on failure/modal still visible
        }
    }
}
// <<< END NEW >>>

/**
 * Handles the logout process.
 */
async function handleLogout() {
    // ... (keep existing logout logic) ...
     try {
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error('Error during logout fetch:', error);
    } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Logout'; // Restore base text
        updateUI(false); // Update UI to logged-out state
    }
}

// --- Event Listeners ---

if (loginHeaderBtn) {
    loginHeaderBtn.addEventListener('click', showLoginModal);
}
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', hideLoginModal);
}
if (loginModalOverlay) {
    loginModalOverlay.addEventListener('click', (event) => {
        if (event.target === loginModalOverlay) {
            hideLoginModal();
        }
    });
}
if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// <<< NEW: Confirmation Modal Listeners >>>
if (confirmProceedBtn) {
    confirmProceedBtn.addEventListener('click', handleForcedLogin);
}
if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
        hideConfirmationModal();
        resetLoginAttemptState('Login cancelled.'); // Update login modal status
    });
}
if (confirmationModalOverlay) {
    confirmationModalOverlay.addEventListener('click', (event) => {
        if (event.target === confirmationModalOverlay) {
            hideConfirmationModal();
            resetLoginAttemptState('Login cancelled.'); // Treat overlay click as cancel
        }
    });
}
// <<< END NEW >>>

// Close modals on Escape key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (confirmationModalOverlay.classList.contains('visible')) {
            hideConfirmationModal();
            resetLoginAttemptState('Login cancelled.');
        } else if (loginModalOverlay.classList.contains('visible')) {
            hideLoginModal();
        }
    }
});

// --- Initialisation ---
checkSession();
