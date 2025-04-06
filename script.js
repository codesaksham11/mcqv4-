document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('code-modal');
    const openModalBtn = document.getElementById('enter-code-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const submitCodeBtn = document.getElementById('submit-code-btn');
    const codeInput = document.getElementById('code-input');
    const levelRadios = document.querySelectorAll('input[name="codeLevel"]');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message'); // Get success message element

    // --- Modal Handling ---
    const openModal = () => {
        modal.style.display = 'block';
        clearMessages(); // Clear messages when opening
        codeInput.value = ''; // Clear input field
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal if clicked outside the content area
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- Message Handling ---
    const showMessage = (element, message, duration = null) => {
        element.textContent = message;
        element.style.display = 'block';
        if (duration) {
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }
    };

    const clearMessages = () => {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        successMessage.style.display = 'none'; // Hide success message too
        successMessage.textContent = '';
    };

    // --- Code Submission & Validation (Client-side part) ---
    submitCodeBtn.addEventListener('click', async () => {
        clearMessages(); // Clear previous messages

        let selectedLevel = '';
        levelRadios.forEach(radio => {
            if (radio.checked) {
                selectedLevel = radio.value;
            }
        });

        const enteredCode = codeInput.value.trim();

        if (!selectedLevel) {
            showMessage(errorMessage, 'Please select a level.', 2000);
            return;
        }
        if (!enteredCode) {
            showMessage(errorMessage, 'Please enter a code.', 2000);
            return;
        }

        // Disable button during check
        submitCodeBtn.disabled = true;
        submitCodeBtn.textContent = 'Verifying...';

        try {
            // **IMPORTANT**: Replace '/api/check-code' with your actual Cloudflare Function URL
            const response = await fetch('/api/check-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level: selectedLevel,
                    code: enteredCode
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // SUCCESS
                const cookieName = `code_${selectedLevel}`;
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30); // Cookie expires in 30 days
                document.cookie = `${cookieName}=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`; // Added SameSite

                console.log(`Cookie set: ${cookieName}=true`);
                showMessage(successMessage, 'Code accepted successfully!'); // Show success
                setTimeout(() => {
                    closeModal(); // Close modal after a short delay
                }, 1500); // Keep success message visible briefly

            } else {
                // FAILURE
                const errorText = result.message || 'Invalid code entered. Please try again.';
                showMessage(errorMessage, errorText, 2000); // Show error for 2 seconds
            }

        } catch (error) {
            // NETWORK OR SERVER ERROR
            console.error("Error validating code:", error);
            showMessage(errorMessage, 'An error occurred. Please try again later.', 2000);
        } finally {
            // Re-enable button
             submitCodeBtn.disabled = false;
             submitCodeBtn.textContent = 'Verify Code';
        }
    });
});
