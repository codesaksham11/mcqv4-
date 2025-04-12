// app.js

// Import necessary functions from the Firebase SDK
// Make sure these paths match the versions you intend to use (like in index.html comments)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; // Example version
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    getIdToken // We need this later
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; // Example version
// Optional: If you use Analytics
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// --- Firebase Configuration ---
// Use the configuration object you provided
const firebaseConfig = {
    apiKey: "AIzaSyAgY6xEn6DLRzAhhRp1I5U4tbdwjBb388M", // Replace with your actual API key if different
    authDomain: "mcq-gemini-editiom.firebaseapp.com",
    projectId: "mcq-gemini-editiom",
    storageBucket: "mcq-gemini-editiom.firebasestorage.app", // Ensure this is correct as per your Firebase console
    messagingSenderId: "654579963522",
    appId: "1:654579963522:web:5eb1db4d4b3b3287b5069b",
    measurementId: "G-JN821548FH" // Optional
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Provider for Google Sign-In
// Optional: Initialize Analytics
// const analytics = getAnalytics(app);

// --- DOM Element References ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const optionButtons = document.querySelectorAll('.option-button'); // Get all MCQ access buttons
const statusMessageDiv = document.getElementById('status-message');

// --- Global State ---
let currentUser = null; // Keep track of the current logged-in user object

// --- Functions ---

/**
 * Updates the UI based on the user's authentication state.
 * @param {object|null} user - The Firebase user object or null if logged out.
 */
function updateUI(user) {
    currentUser = user; // Update global state

    if (user) {
        // User is logged in
        userInfoDiv.style.display = 'flex'; // Show user info (use flex as defined in CSS)
        userEmailSpan.textContent = user.email || 'No email available';
        logoutBtn.style.display = 'flex'; // Show logout button (use flex for icon alignment)
        loginBtn.style.display = 'none'; // Hide login button

        // Add event listeners to MCQ buttons ONLY when logged in
        optionButtons.forEach(button => {
            button.addEventListener('click', handleAccessRequest);
            button.disabled = false; // Ensure buttons are enabled
            button.style.opacity = '1'; // Make fully opaque
            button.style.cursor = 'pointer';
        });
        clearStatusMessage(); // Clear any previous messages

    } else {
        // User is logged out
        userInfoDiv.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'flex'; // Show login button (use flex for icon alignment)

        // Remove event listeners and disable MCQ buttons when logged out
        optionButtons.forEach(button => {
            button.removeEventListener('click', handleAccessRequest);
            button.disabled = true; // Disable buttons
            button.style.opacity = '0.6'; // Dim the buttons visually
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
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will handle the UI update automatically after successful login
        setStatusMessage('Login successful!', false); // You might not see this if redirect happens fast
    } catch (error) {
        console.error("Login Error:", error);
        // Handle specific errors (e.g., popup blocked, network error)
        if (error.code === 'auth/popup-closed-by-user') {
            setStatusMessage('Login cancelled.', true);
        } else if (error.code === 'auth/cancelled-popup-request') {
             setStatusMessage('Login cancelled (multiple popups).', true);
        } else {
            setStatusMessage(`Login failed: ${error.message}`, true);
        }
        updateUI(null); // Ensure UI reflects logged-out state on failure
    }
}

/**
 * Logs the current user out.
 */
async function logoutUser() {
    setStatusMessage('Logging out...', false);
    try {
        await signOut(auth);
        // onAuthStateChanged will handle the UI update automatically
        setStatusMessage('You have been logged out.', false);
        // Clear any specific user data if needed
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
    const requestedFile = button.dataset.file; // Get filename from data-file attribute

    if (!requestedFile) {
        console.error("Error: Button missing data-file attribute.", button);
        setStatusMessage("Configuration error: Cannot determine which file to access.", true);
        return;
    }

    setStatusMessage(`Requesting access to ${requestedFile}...`, false);
    button.disabled = true; // Temporarily disable button during request

    try {
        // 1. Get a fresh Firebase ID Token
        const idToken = await getIdToken(currentUser); // Pass the current user object
        // console.log("Obtained ID Token:", idToken); // For debugging only

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
            // Status 200-299 - Success! Backend should have set the HttpOnly cookie.
            setStatusMessage(`Access granted! Redirecting to ${requestedFile}...`, false);
            // Redirect the user to the requested HTML file
            window.location.href = `/${requestedFile}`; // Navigate to the page
        } else {
            // Handle specific errors based on status code
            let errorMsg = `Access denied.`;
            if (response.status === 401) {
                errorMsg = `Access denied: Authentication failed. Please try logging out and back in.`;
                // Optionally force logout here if token is consistently invalid
                // await logoutUser();
            } else if (response.status === 403) {
                const responseBody = await response.text(); // Try to get more info
                errorMsg = `Access denied: You do not have permission to access ${requestedFile}. (${response.status})`;
                console.warn("Permission denied details (if any):", responseBody);
            } else {
                 const responseBody = await response.text();
                 errorMsg = `Error requesting access: Server returned status ${response.status}.`;
                 console.error("Server Error Details:", responseBody);
            }
            setStatusMessage(errorMsg, true);
             button.disabled = false; // Re-enable button on failure
        }

    } catch (error) {
        console.error("Error requesting access token or fetching:", error);
        setStatusMessage(`An error occurred: ${error.message}. Check console for details.`, true);
        button.disabled = false; // Re-enable button on failure
    }
}

/** Helper to display status messages */
function setStatusMessage(message, isError = false) {
    statusMessageDiv.textContent = message;
    statusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)'; // Use CSS variables
     // Optional: Auto-clear non-error messages after a delay
     if (!isError) {
         setTimeout(clearStatusMessage, 4000); // Clear after 4 seconds
     }
}

/** Helper to clear status messages */
function clearStatusMessage() {
    statusMessageDiv.textContent = '';
}


// --- Event Listeners ---

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed. User:", user ? user.email : 'Logged out');
    updateUI(user); // Update the UI whenever auth state changes
});

// Attach listeners to login/logout buttons
loginBtn.addEventListener('click', loginWithGoogle);
logoutBtn.addEventListener('click', logoutUser);

// --- Initial Check ---
// The onAuthStateChanged listener above will handle the initial UI setup
// based on whether the user is already logged in when the page loads.
console.log("App.js loaded. Waiting for Firebase auth state...");
// Ensure buttons start in a sensible state (disabled until auth check)
optionButtons.forEach(button => {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
});
