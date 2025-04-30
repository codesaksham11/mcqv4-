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

// Confirmation Modal Elements
const confirmationModalOverlay = document.getElementById('confirmation-modal-overlay');
const confirmationModalContent = document.getElementById('confirmation-modal-content');
const confirmProceedBtn = document.getElementById('confirm-proceed-btn');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');

// --- State ---
let isLoginPending = false; // Prevent double submissions
let pendingLoginDetails = null;

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

/**
 * Shows the confirmation modal.
 */
function showConfirmationModal() {
    confirmationModalOverlay.classList.add('visible');
    confirmationModalOverlay.setAttribute('aria-hidden', 'false');
    confirmProceedBtn.focus(); // Focus the 'Proceed' button by default
    
    // Make sure the confirmation modal is visible in the DOM
    console.log('Showing confirmation modal, visibility:', confirmationModalOverlay.classList.contains('visible'));
    
    // Reset button states to ensure they're clickable
    confirmProceedBtn.disabled = false;
    confirmProceedBtn.textContent = 'Proceed';
    confirmCancelBtn.disabled = false;
}

/**
 * Hides the confirmation modal.
 */
function hideConfirmationModal() {
    confirmationModalOverlay.classList.remove('visible');
    confirmationModalOverlay.setAttribute('aria-hidden', 'true');
    console.log('Confirmation modal hidden');
}

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
    
    console.log(`Sending login request with forceLogin=${forceLogin}`, body);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        
        console.log(`Login response status: ${response.status}`);
        return response;
    } catch (error) {
        console.error('Fetch error during login:', error);
        throw error; // Re-throw to be handled by the caller
    }
}

/**
 * Resets the login button and pending state, optionally sets error message.
 */
function resetLoginAttemptState(errorMessage = '') {
    console.log('Resetting login attempt state:', errorMessage);
    isLoginPending = false;
    
    // Only update UI if the login modal is visible
    if (loginModalOverlay.classList.contains('visible')) {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = 'Login'; // Restore base text
        
        // Check if icon element exists before trying to modify it
        const iconElement = loginSubmitBtn.querySelector('.icon');
        if (iconElement) {
            iconElement.textContent = '🚀'; // Restore icon
        }
        
        loginErrorMessage.textContent = errorMessage;
        loginErrorMessage.classList.remove('verifying');
    }
    
    // Always clear pending details
    pendingLoginDetails = null;
}

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    if (isLoginPending) {
        console.log('Login already in progress');
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const walletNumber = walletInput.value.trim();

    if (!name || !email || !walletNumber) {
        resetLoginAttemptState('Please fill in all fields.');
        return;
    }

    isLoginPending = true;
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = 'Verifying...';
    
    // Check if icon element exists before trying to modify it
    const iconElement = loginSubmitBtn.querySelector('.icon');
    if (iconElement) {
        iconElement.textContent = '⏳'; // Change icon
    }
    
    loginErrorMessage.textContent = 'Attempting login...';
    loginErrorMessage.classList.add('verifying');

    // Store details in case we need them for confirmation
    pendingLoginDetails = { name, email, walletNumber };
    console.log('Login attempt initiated for:', email);

    try {
        const response = await performLoginRequest(name, email, walletNumber, false);
        console.log('Login response received:', response.status);

        if (response.ok) {
            console.log('Login successful');
            hideLoginModal();
            await checkSession();
        } else if (response.status === 401) {
            console.log('Login unauthorized (401)');
            resetLoginAttemptState('Invalid Email or Wallet Number.');
        } else if (response.status === 409) {
            console.log('Login conflict detected (409)');
            
            // Get the error message from the response
            const responseData = await response.json();
            console.log('Conflict response data:', responseData);
            
            // Update the login error message but maintain the pending state
            loginErrorMessage.textContent = 'Session conflict detected. Please use the confirmation dialog.';
            
            // Show the confirmation modal
            showConfirmationModal();
            
            // We don't reset isLoginPending here because we're waiting for confirmation
        } else {
            console.error('Login failed with unexpected status:', response.status);
            resetLoginAttemptState(`Login failed with status ${response.status}. Please try again later.`);
        }
    } catch (error) {
        console.error('Error during login request:', error);
        resetLoginAttemptState('A network error occurred. Please check your connection.');
    }
}

/**
 * Handles the forced login attempt after confirmation.
 */
async function handleForcedLogin() {
    if (!pendingLoginDetails) {
        console.warn('Attempted forced login without pending details');
        hideConfirmationModal();
        resetLoginAttemptState('Login process interrupted. Please try again.');
        return;
    }

    console.log('Processing forced login for:', pendingLoginDetails.email);
    
    // Update UI to indicate override attempt
    confirmProceedBtn.disabled = true;
    confirmProceedBtn.textContent = 'Processing...';
    confirmCancelBtn.disabled = true;

    const { name, email, walletNumber } = pendingLoginDetails;

    try {
        const forceResponse = await performLoginRequest(name, email, walletNumber, true);
        console.log('Forced login response:', forceResponse.status);

        if (forceResponse.ok) {
            console.log('Forced login successful');
            hideConfirmationModal();
            hideLoginModal();
            await checkSession();
        } else {
            // Handle error during forced login
            console.error('Forced login failed with status:', forceResponse.status);
            hideConfirmationModal();
            
            let errorMsg = 'Login override failed. Please try again later.';
            if (forceResponse.status === 401) {
                errorMsg = 'Login failed during override (Invalid Credentials).';
            }
            
            resetLoginAttemptState(errorMsg);
        }
    } catch (forceError) {
        console.error('Error during forced login fetch:', forceError);
        hideConfirmationModal();
        resetLoginAttemptState('A network error occurred during override.');
    } finally {
        // Reset button states if the modal is still visible
        if (confirmationModalOverlay.classList.contains('visible')) {
            confirmProceedBtn.disabled = false;
            confirmProceedBtn.textContent = 'Proceed';
            confirmCancelBtn.disabled = false;
        }
        
        // Always clear the pending state
        isLoginPending = false;
    }
}

/**
 * Handles the logout process.
 */
async function handleLogout() {
    try {
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';
        const response = await fetch('/api/logout', { method: 'POST' });
        console.log('Logout response:', response.status);
    } catch (error) {
        console.error('Error during logout fetch:', error);
    } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Logout'; // Restore base text
        updateUI(false); // Update UI to logged-out state
    }
}

// --- Event Listeners ---

// Check that elements exist before adding event listeners
if (loginHeaderBtn) {
    loginHeaderBtn.addEventListener('click', showLoginModal);
} else {
    console.error('Login header button not found in DOM');
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', hideLoginModal);
} else {
    console.error('Modal close button not found in DOM');
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
} else {
    console.error('Login form not found in DOM');
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
} else {
    console.error('Logout button not found in DOM');
}

// Confirmation Modal Listeners
if (confirmProceedBtn) {
    confirmProceedBtn.addEventListener('click', (e) => {
        console.log('Proceed button clicked');
        handleForcedLogin();
    });
} else {
    console.error('Confirmation proceed button not found in DOM');
}

if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
        console.log('Cancel button clicked');
        hideConfirmationModal();
        resetLoginAttemptState('Login cancelled.');
    });
} else {
    console.error('Confirmation cancel button not found in DOM');
}

// Close modals on overlay click
if (loginModalOverlay) {
    loginModalOverlay.addEventListener('click', (event) => {
        if (event.target === loginModalOverlay) {
            hideLoginModal();
        }
    });
}

if (confirmationModalOverlay) {
    confirmationModalOverlay.addEventListener('click', (event) => {
        if (event.target === confirmationModalOverlay) {
            console.log('Confirmation overlay clicked');
            hideConfirmationModal();
            resetLoginAttemptState('Login cancelled.');
        }
    });
} else {
    console.error('Confirmation modal overlay not found in DOM');
}

// Close modals on Escape key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (confirmationModalOverlay && confirmationModalOverlay.classList.contains('visible')) {
            console.log('Escape pressed, hiding confirmation modal');
            hideConfirmationModal();
            resetLoginAttemptState('Login cancelled.');
        } else if (loginModalOverlay && loginModalOverlay.classList.contains('visible')) {
            console.log('Escape pressed, hiding login modal');
            hideLoginModal();
        }
    }
});

// --- DOM Check on Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Verify all critical elements exist
    const criticalElements = {
        'login-header-btn': loginHeaderBtn,
        'login-modal-overlay': loginModalOverlay,
        'login-form': loginForm,
        'login-submit-btn': loginSubmitBtn,
        'confirmation-modal-overlay': confirmationModalOverlay,
        'confirm-proceed-btn': confirmProceedBtn,
        'confirm-cancel-btn': confirmCancelBtn
    };
    
    let missingElements = false;
    for (const [id, element] of Object.entries(criticalElements)) {
        if (!element) {
            console.error(`Critical element missing: #${id}`);
            missingElements = true;
        }
    }
    
    if (missingElements) {
        console.error('Critical elements are missing. Check your HTML structure.');
    } else {
        console.log('All critical elements found in DOM');
    }
    
    // Initialization
    checkSession();
});
