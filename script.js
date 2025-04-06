document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('code-modal');
    const openModalBtn = document.getElementById('enter-code-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const submitCodeBtn = document.getElementById('submit-code-btn');
    const codeInput = document.getElementById('code-input');
    const levelRadios = document.querySelectorAll('input[name="codeLevel"]');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // --- Modal Handling ---
    const openModal = () => {
        modal.style.display = 'block';
        clearMessages();
        codeInput.value = '';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

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
        successMessage.style.display = 'none';
        successMessage.textContent = '';
    };

    // --- Code Submission & Validation ---
    submitCodeBtn.addEventListener('click', async () => {
        clearMessages();

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

        submitCodeBtn.disabled = true;
        submitCodeBtn.textContent = 'Verifying...';

        try {
            // *** CHANGE HERE: Use relative path for Pages Function ***
            const response = await fetch('/check-code', { // Points to /functions/check-code.js
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
                const cookieName = `code_${selectedLevel}`;
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
                document.cookie = `${cookieName}=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

                console.log(`Cookie set: ${cookieName}=true`);
                showMessage(successMessage, 'Code accepted successfully!');
                setTimeout(() => {
                    closeModal();
                }, 1500);

            } else {
                const errorText = result.message || 'Invalid code entered. Please try again.';
                showMessage(errorMessage, errorText, 2000);
            }

        } catch (error) {
            console.error("Error validating code:", error);
            showMessage(errorMessage, 'An error occurred. Please try again later.', 2000);
        } finally {
             submitCodeBtn.disabled = false;
             submitCodeBtn.textContent = 'Verify Code';
        }
    });
});
