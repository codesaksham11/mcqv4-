document.addEventListener('DOMContentLoaded', () => {
    const levelCards = document.querySelectorAll('.level-card:not(.disabled)');
    const toggleCodeBtn = document.getElementById('toggle-code-entry');
    const codeEntryArea = document.getElementById('code-entry-area');
    const validateCodeBtn = document.getElementById('validate-code-btn');
    const codeLevelSelect = document.getElementById('code-level');
    const accessCodeInput = document.getElementById('access-code');
    const codeStatus = document.getElementById('code-status');

    // --- Level Selection ---
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
        // Add hover effect via JS if needed, e.g., for sound
        card.addEventListener('mouseenter', () => { /* Play hover sound? */ });
    });

    // --- Optional Code Entry ---
    toggleCodeBtn.addEventListener('click', () => {
        codeEntryArea.classList.toggle('hidden');
         // Change button text based on visibility
         if (codeEntryArea.classList.contains('hidden')) {
             toggleCodeBtn.textContent = 'Have an Access Code?';
         } else {
             toggleCodeBtn.textContent = 'Hide Code Entry';
             checkCodeActivationStatus(); // Update disabled status when shown
         }
    });

    validateCodeBtn.addEventListener('click', () => {
        const level = codeLevelSelect.value;
        const code = accessCodeInput.value.trim();
        const activationKey = `code_${level}_activated`;

        codeStatus.textContent = ''; // Clear previous messages
        codeStatus.className = 'code-status-message'; // Reset class


        // 1. Basic Client-Side Check (Placeholder)
        if (!code) {
            codeStatus.textContent = 'Please enter a code.';
            codeStatus.classList.add('error');
            showPopup('Please enter a code.', 2000, true);
            return;
        }

        // 2. Future API Call Placeholder
        // console.log(`Simulating validation for level: ${level}, code: ${code}`);
        // In future:
        // fetch('/api/validate-code', { method: 'POST', body: JSON.stringify({ level, code }) })
        //   .then(res => res.json())
        //   .then(data => {
        //      if (data.valid) { ... } else { ... }
        //   })
        //   .catch(error => { showPopup('Validation server error', 3000, true); });

        // 3. Current Placeholder Logic (Assume success for demonstration)
        // **IMPORTANT**: Do NOT put real codes (`ILSSMTICDAFH`, etc.) here.
        // This placeholder just simulates a successful response.
        const simulateApiSuccess = true; // Change to false to test failure path

        if (simulateApiSuccess) {
            codeStatus.textContent = 'Token Accepted!';
            codeStatus.classList.add('success');
            showPopup('Token Accepted!', 2000, false);

            // 4. Save flag to localStorage
            storageHelper.set(activationKey, true); // Store as boolean true

            // 5. Optionally disable entry for this level
             checkCodeActivationStatus(); // Update UI
             accessCodeInput.value = ''; // Clear input

        } else {
             codeStatus.textContent = 'Invalid Code.';
             codeStatus.classList.add('error');
            showPopup('Invalid Code', 2000, true);
        }
    });

     // Function to check activation status and update UI
     function checkCodeActivationStatus() {
         const selectedLevel = codeLevelSelect.value;
         const activationKey = `code_${selectedLevel}_activated`;
         const isActivated = storageHelper.get(activationKey) === true; // Check for boolean true

         if (isActivated) {
             accessCodeInput.disabled = true;
             validateCodeBtn.disabled = true;
             accessCodeInput.placeholder = 'Already activated for this level';
             codeStatus.textContent = `Access for ${selectedLevel.toUpperCase()} already validated.`;
             codeStatus.className = 'code-status-message success';
         } else {
             accessCodeInput.disabled = false;
             validateCodeBtn.disabled = false;
             accessCodeInput.placeholder = 'Enter your code';
             // Keep status message as is or clear it
             // codeStatus.textContent = ''; // Optional: clear status on level change if not activated
         }
     }

    // Update disabled status when the selected level changes
     codeLevelSelect.addEventListener('change', checkCodeActivationStatus);

     // Initial check in case the area is opened later
     // checkCodeActivationStatus(); // Called when area is toggled visible instead
});
