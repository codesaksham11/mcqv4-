// app.js - Non-module version using Firebase Compat SDK

// Wait for the DOM to be fully loaded before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing app...");
    
    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyAgY6xEn6DLRzAhhRp1I5U4tbdwjBb388M",
        authDomain: "mcq-gemini-editiom.firebaseapp.com",
        projectId: "mcq-gemini-editiom",
        storageBucket: "mcq-gemini-editiom.appspot.com", // Fixed storage bucket
        messagingSenderId: "654579963522",
        appId: "1:654579963522:web:5eb1db4d4b3b3287b5069b",
        measurementId: "G-JN821548FH"
    };

    // Initialize Firebase with compat version
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    // --- DOM Element References ---
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const optionButtons = document.querySelectorAll('.option-button');
    const statusMessageDiv = document.getElementById('status-message');

    // --- Global State ---
    let currentUser = null; // Keep track of the current logged-in user object

    // --- Functions ---
    /**
     * Updates the UI based on the user's authentication state.
     * @param {object|null} user - The Firebase user object or null if logged out.
     */
    function updateUI(user) {
        console.log("Updating UI for user:", user ? user.email : 'No user');
        currentUser = user; // Update global state

        if (user) {
            // User is logged in
            userInfoDiv.style.display = 'flex';
            userEmailSpan.textContent = user.email || 'No email available';
            logoutBtn.style.display = 'flex';
            loginBtn.style.display = 'none';

            // Enable MCQ buttons when logged in
            optionButtons.forEach(button => {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
            });
            clearStatusMessage();

        } else {
            // User is logged out
            userInfoDiv.style.display = 'none';
            logoutBtn.style.display = 'none';
            loginBtn.style.display = 'flex';

            // Disable MCQ buttons when logged out
            optionButtons.forEach(button => {
                button.disabled = true;
                button.style.opacity = '0.6';
                button.style.cursor = 'not-allowed';
            });
            clearStatusMessage();
        }
    }

    /**
     * Initiates the Google Sign-In popup flow.
     */
    async function loginWithGoogle() {
        setStatusMessage('Logging in...', false);
        try {
            console.log("Starting Google sign in popup...");
            const result = await auth.signInWithPopup(provider);
            console.log("Login successful:", result.user.email);
            setStatusMessage('Login successful!', false);
        } catch (error) {
            console.error("Login Error:", error.code, error.message);
            if (error.code === 'auth/popup-closed-by-user') {
                setStatusMessage('Login cancelled.', true);
            } else if (error.code === 'auth/cancelled-popup-request') {
                setStatusMessage('Login cancelled (multiple popups).', true);
            } else {
                setStatusMessage(`Login failed: ${error.message}`, true);
            }
            updateUI(null);
        }
    }

    /**
     * Logs the current user out.
     */
    async function logoutUser() {
        setStatusMessage('Logging out...', false);
        try {
            await auth.signOut();
            console.log("User signed out successfully");
            setStatusMessage('You have been logged out.', false);
            currentUser = null;
        } catch (error) {
            console.error("Logout Error:", error);
            setStatusMessage(`Logout failed: ${error.message}`, true);
        }
    }

    /**
     * Handles the click event on the MCQ access buttons.
     * Gets an ID token and requests access from the backend.
     * @param {Event} event - The click event object.
     */
    async function handleAccessRequest(event) {
        if (!currentUser) {
            setStatusMessage("Error: You must be logged in to access files.", true);
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
        button.disabled = true; // Temporarily disable button during request

        try {
            // 1. Get a fresh Firebase ID Token
            const idToken = await currentUser.getIdToken(true);
            console.log("ID Token obtained successfully");

            // 2. Make the POST request to our Cloudflare Function
            const response = await fetch('/api/generate-cookie', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestedFile: requestedFile })
            });

            // 3. Handle the response
            if (response.ok) {
                setStatusMessage(`Access granted! Redirecting to ${requestedFile}...`, false);
                window.location.href = `/${requestedFile}`;
            } else {
                let errorMsg = `Access denied.`;
                if (response.status === 401) {
                    errorMsg = `Access denied: Authentication failed. Please try logging out and back in.`;
                } else if (response.status === 403) {
                    const responseBody = await response.text();
                    errorMsg = `Access denied: You do not have permission to access ${requestedFile}. (${response.status})`;
                    console.warn("Permission denied details (if any):", responseBody);
                } else {
                    const responseBody = await response.text();
                    errorMsg = `Error requesting access: Server returned status ${response.status}.`;
                    console.error("Server Error Details:", responseBody);
                }
                setStatusMessage(errorMsg, true);
                button.disabled = false;
            }

        } catch (error) {
            console.error("Error requesting access token or fetching:", error);
            setStatusMessage(`An error occurred: ${error.message}. Check console for details.`, true);
            button.disabled = false;
        }
    }

    /** Helper to display status messages */
    function setStatusMessage(message, isError = false) {
        statusMessageDiv.textContent = message;
        statusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
        if (!isError) {
            setTimeout(clearStatusMessage, 4000);
        }
    }

    /** Helper to clear status messages */
    function clearStatusMessage() {
        statusMessageDiv.textContent = '';
    }

    // --- Event Listeners ---
    // Attach click handlers to the buttons
    loginBtn.addEventListener('click', function(e) {
        console.log("Login button clicked");
        loginWithGoogle();
    });
    
    logoutBtn.addEventListener('click', function(e) {
        console.log("Logout button clicked");
        logoutUser();
    });
    
    // Add click handlers to all option buttons
    optionButtons.forEach(button => {
        button.addEventListener('click', handleAccessRequest);
    });

    // Listen for authentication state changes
    auth.onAuthStateChanged(function(user) {
        console.log("Auth state changed. User:", user ? user.email : 'Logged out');
        updateUI(user);
    });

    // Initial UI setup - will be handled by onAuthStateChanged
    console.log("App.js initialized. Waiting for Firebase auth state...");
    optionButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
});
