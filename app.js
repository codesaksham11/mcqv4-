// app.js

// Import necessary functions from the Firebase SDK using CDN URLs
// Using version 10.7.1 as an example - you can update version numbers if needed,
// but ensure they are consistent across imports.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    getIdToken
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Optional: If you use Analytics elsewhere
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// --- Firebase Configuration ---
// Using the configuration object you provided
const firebaseConfig = {
    apiKey: "AIzaSyAgY6xEn6DLRzAhhRp1I5U4tbdwjBb388M", // This is your key
    authDomain: "mcq-gemini-editiom.firebaseapp.com",
    projectId: "mcq-gemini-editiom",
    storageBucket: "mcq-gemini-editiom.firebasestorage.app", // Using the value you provided
    messagingSenderId: "654579963522",
    appId: "1:654579963522:web:5eb1db4d4b3b3287b5069b",
    measurementId: "G-JN821548FH" // Optional
};
// --- --- --- --- --- --- --- ---

// --- Initialize Firebase ---
let app;
let auth;
let provider;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider(); // Provider for Google Sign-In
    console.log("Firebase Initialized Successfully.");
} catch (error) {
    console.error("!!! Firebase Initialization Failed !!!", error);
    // Display error to user if Firebase doesn't load
    const statusDiv = document.getElementById('status-message');
    if (statusDiv) {
         statusDiv.textContent = "Error: Could not connect to authentication service. Please check configuration or try again later.";
         statusDiv.style.color = 'var(--error-color)';
    }
    // Prevent rest of the script from running if init fails
    throw new Error("Firebase initialization failed, stopping script execution.");
}
// Optional: Initialize Analytics
// const analytics = getAnalytics(app);

// --- DOM Element References ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const optionButtons = document.querySelectorAll('.option-button');
const statusMessageDiv = document.getElementById('status-message');

// --- Global State ---
let currentUser = null;
let listenersAttached = false; // Flag to prevent attaching listeners multiple times

// --- Functions ---

function updateUI(user) {
    currentUser = user;

    if (user) {
        userInfoDiv.style.display = 'flex';
        userEmailSpan.textContent = user.email || 'No email available';
        logoutBtn.style.display = 'flex';
        loginBtn.style.display = 'none';

        optionButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
            // Ensure listener is attached only once
            if (!listenersAttached) {
                 button.addEventListener('click', handleAccessRequest);
            }
        });
        listenersAttached = true; // Mark listeners as attached
        clearStatusMessage();

    } else {
        userInfoDiv.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'flex';

        optionButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
            // We don't strictly need to remove listeners if we just disable,
            // but could be added here if needed: button.removeEventListener(...)
        });
        listenersAttached = false; // Reset flag when logged out
        clearStatusMessage();
    }
}

async function loginWithGoogle() {
    if (!auth || !provider) {
         setStatusMessage("Error: Authentication service not ready.", true);
         return;
    }
    setStatusMessage('Redirecting to Google Login...', false);
    try {
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will handle the UI update
        // setStatusMessage('Login successful!', false); // Often not seen due to state change
    } catch (error) {
        console.error("Login Error:", error);
        if (error.code === 'auth/popup-closed-by-user') {
            setStatusMessage('Login cancelled.', true);
        } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-blocked') {
             setStatusMessage('Login popup blocked or cancelled. Please enable popups for this site.', true);
        } else {
            setStatusMessage(`Login failed: ${error.message}`, true);
        }
        updateUI(null); // Reset UI on failure
    }
}

async function logoutUser() {
     if (!auth) {
         setStatusMessage("Error: Authentication service not ready.", true);
         return;
    }
    setStatusMessage('Logging out...', false);
    try {
        await signOut(auth);
        // onAuthStateChanged handles the UI update
        setStatusMessage('You have been logged out.', false);
        currentUser = null;
    } catch (error) {
        console.error("Logout Error:", error);
        setStatusMessage(`Logout failed: ${error.message}`, true);
    }
}

async function handleAccessRequest(event) {
    if (!currentUser) {
        setStatusMessage("Error: You must be logged in to access files.", true);
        return;
    }
    if (!auth) {
         setStatusMessage("Error: Authentication service not ready.", true);
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
    button.disabled = true;

    try {
        const idToken = await getIdToken(currentUser, /*forceRefresh*/ true); // Force refresh for latest token
        // console.log("Obtained ID Token:", idToken); // Debug only

        const response = await fetch('/api/generate-cookie', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestedFile: requestedFile })
        });

        if (response.ok) {
            setStatusMessage(`Access granted! Redirecting to ${requestedFile}...`, false);
            window.location.href = `/${requestedFile}`;
        } else {
            let errorMsg = `Access denied.`;
             try {
                 const errorData = await response.text(); // Try to get error text from backend
                 console.warn(`Server response (${response.status}): ${errorData}`);
                 errorMsg = `Access denied (${response.status}): ${errorData || 'No details provided.'}`;
             } catch (_) {
                 errorMsg = `Access denied with status ${response.status}.`;
             }

            if (response.status === 401) {
                errorMsg = `Access denied: Authentication issue (${response.status}). Please try logging out and back in.`;
            } else if (response.status === 403) {
                 errorMsg = `Access denied: Permission denied for ${requestedFile} (${response.status}).`;
            } else if (response.status === 404) {
                 errorMsg = `Error: Access check endpoint not found (${response.status}). Backend function may not be deployed.`;
            }
            setStatusMessage(errorMsg, true);
             button.disabled = false; // Re-enable button on failure
        }

    } catch (error) {
        console.error("Error requesting access token or fetching:", error);
        setStatusMessage(`An error occurred: ${error.message}. Check console for details.`, true);
        button.disabled = false;
    }
}

function setStatusMessage(message, isError = false) {
    if (!statusMessageDiv) return;
    statusMessageDiv.textContent = message;
    statusMessageDiv.style.color = isError ? 'var(--error-color)' : 'var(--accent-secondary)';
     if (!isError) {
         setTimeout(clearStatusMessage, 4000);
     }
}

function clearStatusMessage() {
     if (!statusMessageDiv) return;
    statusMessageDiv.textContent = '';
}

// --- Event Listeners ---
if (loginBtn && logoutBtn && auth) {
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User:", user ? user.email : 'Logged out');
        updateUI(user);
    });

    // Attach listeners to static login/logout buttons
    loginBtn.addEventListener('click', loginWithGoogle);
    logoutBtn.addEventListener('click', logoutUser);

    console.log("App.js listeners attached.");
} else {
     console.error("Could not attach essential event listeners. Check DOM elements and Firebase auth initialization.");
      setStatusMessage("Error: UI cannot be fully initialized.", true);
}

// --- Initial UI State ---
// Set initial disabled state for MCQ buttons, updateUI will enable them if logged in
optionButtons.forEach(button => {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
});
console.log("App.js loaded. Waiting for Firebase auth state...");
