// app.js - Modal Login Flow for index.html - WITH SESSION CHECK ON LOAD

// --- DOM Element References ---
const loginHeaderBtn = document.getElementById('login-header-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const headerSubtitle = document.getElementById('header-subtitle');
const loginModalOverlay = document.getElementById('login-modal-overlay');
const loginModalContent = document.getElementById('login-modal-content');
const loginModalCloseBtn = document.getElementById('modal-close-btn');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const walletInput = document.getElementById('wallet-input');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginStatusMessageDiv = document.getElementById('login-status-message');
const statusMessageDiv = document.getElementById('status-message');

// --- Global State ---
let isLoggedIn = false;
let userEmail = null;

// --- Functions ---

function openLoginModal() { /* ... (keep function as before) ... */
    if (!loginModalOverlay) return;
    emailInput.value = '';
    walletInput.value = '';
    clearLoginStatusMessage();
    loginSubmitBtn.disabled = false;
    loginModalOverlay.classList.add('visible');
}

function closeLoginModal() { /* ... (keep function as before) ... */
    if (!loginModalOverlay) return;
    loginModalOverlay.classList.remove('visible');
}

async function handleLoginSubmit(event) { /* ... (keep function as before) ... */
    event.preventDefault();

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, walletNumber: walletNumber })
        });
        const result = await response.json(); // Get JSON response

        if (response.ok && result.success) {
            userEmail = result.email || email; // Use email from response if available
            showLoggedInState(userEmail);
            closeLoginModal();
            setLoginStatusMessage("");
        } else {
            let errorMsg = result.error || "Login failed. Please check your email and wallet number.";
            if (response.status === 401) {
                errorMsg = result.error || "Login failed: Invalid email or wallet number.";
            }
            console.error(`Login error ${response.status}:`, result.error || 'Unknown error');
            setLoginStatusMessage(errorMsg, true);
            loginSubmitBtn.disabled = false;
        }
    } catch (error) {
        console.error("Network or fetch error during login:", error);
        setLoginStatusMessage("Login request failed. Check connection or try again.", true);
        loginSubmitBtn.disabled = false;
    }
}


function showLoggedInState(displayEmail) { /* ... (keep function as before) ... */
    isLoggedIn = true;
    if (headerSubtitle) headerSubtitle.textContent = "Select an exam type to configure.";
    if (userEmailSpan) userEmailSpan.textContent = displayEmail || 'N/A';
    if (userInfoDiv) userInfoDiv.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'flex';
    if (loginHeaderBtn) loginHeaderBtn.style.display = 'none';
}


function showLoggedOutState() { /* ... (keep function as before) ... */
    isLoggedIn = false;
    userEmail = null;
    if (headerSubtitle) headerSubtitle.textContent = "Select an exam type to configure, or log in.";
    if (userInfoDiv) userInfoDiv.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginHeaderBtn) loginHeaderBtn.style.display = 'flex';
    clearStatusMessage();
    clearLoginStatusMessage();
}

async function handleLogout() { // Make async if calling backend
    console.log("Logout button clicked.");
    // --- NEW: Call backend logout endpoint ---
    try {
        // Optional: Create a '/api/logout' function that deletes the session from KV
        // and sets an expired session_token cookie.
        // const response = await fetch('/api/logout', { method: 'POST' });
        // if (!response.ok) {
        //     console.warn("Logout API call failed, logging out UI anyway.");
        // }
        setStatusMessage("You have been logged out.", false);
    } catch (error) {
        console.error("Error during backend logout call:", error);
    }
    // Always update UI regardless of backend call success
    showLoggedOutState();
}

function setLoginStatusMessage(message, isError = false) { /* ... (keep function as before) ... */
     if (!loginStatusMessageDiv) return;
     loginStatusMessageDiv.textContent = message;
     loginStatusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
}
function clearLoginStatusMessage() { /* ... (keep function as before) ... */
     if (!loginStatusMessageDiv) return;
     loginStatusMessageDiv.textContent = '';
}
function setStatusMessage(message, isError = false) { /* ... (keep function as before) ... */
    if (!statusMessageDiv) return;
    statusMessageDiv.textContent = message;
    statusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
    if (!isError && message) {
        setTimeout(clearStatusMessage, 4000);
    }
}
function clearStatusMessage() { /* ... (keep function as before) ... */
    if (!statusMessageDiv) return;
    statusMessageDiv.textContent = '';
}

// --- NEW Function: Check session on page load ---
async function checkSession() {
    console.log("Checking session on page load...");
    try {
        // Browser sends cookies automatically
        const response = await fetch('/api/verify-session');
        const data = await response.json();

        if (response.ok && data.loggedIn) {
            console.log("User session is valid:", data.email);
            userEmail = data.email; // Store email from verified session
            showLoggedInState(userEmail);
        } else {
            console.log("User session is not valid or expired.");
            showLoggedOutState();
             if (data.error) {
                 console.warn("Session verification error:", data.error);
             }
        }
    } catch (error) {
        console.error("Error checking session:", error);
        // Assume logged out if check fails
        showLoggedOutState();
        setStatusMessage("Could not verify session status.", true);
    }
}


// --- Event Listeners Setup ---
if (loginHeaderBtn) loginHeaderBtn.addEventListener('click', openLoginModal);
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
if (loginModalCloseBtn) loginModalCloseBtn.addEventListener('click', closeLoginModal);
if (loginModalOverlay) {
    loginModalOverlay.addEventListener('click', (event) => {
        if (event.target === loginModalOverlay) closeLoginModal();
    });
}

// --- Initial Page Load ---
checkSession(); // <-- CALL THE NEW SESSION CHECK FUNCTION ON LOAD
console.log("App.js loaded for index.html. Session check initiated.");
