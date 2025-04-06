document.addEventListener('DOMContentLoaded', () => {
    const termsLink = document.getElementById('terms-link');
    const termsModal = document.getElementById('terms-modal');
    const closeModalBtn = termsModal.querySelector('.close-btn');
    const backButton = document.getElementById('back-to-portal');


    // --- Modal Logic ---
    const openModal = () => {
        termsModal.style.display = 'flex'; // Use flex to center vertically
    };

    const closeModal = () => {
        termsModal.style.display = 'none';
    };

    // Open modal on link click
    if(termsLink) {
        termsLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            openModal();
        });
    }

    // Close modal on close button click
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal if clicked outside the content area
    window.addEventListener('click', (event) => {
        if (event.target === termsModal) {
            closeModal();
        }
    });

     // Close modal on Escape key press
     document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termsModal.style.display === 'flex') {
             closeModal();
        }
    });

    // --- Back Button Navigation ---
     if(backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // Go back to the main portal
        });
     }

});
