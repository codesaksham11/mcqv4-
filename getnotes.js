document.addEventListener('DOMContentLoaded', () => {

    // --- Get Modal Elements ---
    const termsLink = document.getElementById('terms-link');
    const termsModal = document.getElementById('terms-modal');
    const closeTermsModalBtn = document.getElementById('close-terms-modal');
    const qrCodeModal = document.getElementById('qr-code-modal');
    const closeQrModalBtn = document.getElementById('close-qr-modal');

    // --- Get Button Elements ---
    const backButton = document.getElementById('back-to-portal');
    const thankYouButton = document.getElementById('thank-you-btn');

    // --- Modal Helper Functions ---
    const openModal = (modalElement) => {
        if (modalElement) {
            modalElement.style.display = 'flex'; // Use flex for vertical centering
            // Optional: Prevent body scroll when modal is open
            // document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modalElement) => {
        if (modalElement) {
            modalElement.style.display = 'none';
            // Optional: Restore body scroll
            // document.body.style.overflow = '';
        }
    };

    // --- Terms Modal Logic ---
    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor link behavior
            openModal(termsModal);
        });
    }

    if (closeTermsModalBtn && termsModal) {
        closeTermsModalBtn.addEventListener('click', () => closeModal(termsModal));
    }

    // --- Back Button Navigation ---
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Assuming your main portal is index.html in the same directory
            window.location.href = 'index.html';
        });
    }

    // --- Easter Egg Logic ---
    let thankYouClickCount = 0;
    const clicksNeededForEasterEgg = 6;

    if (thankYouButton && qrCodeModal) {
        thankYouButton.addEventListener('click', () => {
            thankYouClickCount++;
            // console.log(`Thank you clicks: ${thankYouClickCount}`); // For debugging

            if (thankYouClickCount === clicksNeededForEasterEgg) {
                openModal(qrCodeModal);
                thankYouClickCount = 0; // Reset count immediately after showing
            } else if (thankYouClickCount > clicksNeededForEasterEgg) {
                // Reset if somehow clicked more than needed before reset (edge case)
                thankYouClickCount = 0;
            }
            // Optional visual feedback per click could go here
            // E.g., thankYouButton.style.transform = `scale(${1 + thankYouClickCount * 0.01})`;
            // setTimeout(() => { thankYouButton.style.transform = 'scale(1)'; }, 100);
        });
    }

    // Close QR modal on its close button click
    if (closeQrModalBtn && qrCodeModal) {
        closeQrModalBtn.addEventListener('click', () => closeModal(qrCodeModal));
    }

    // --- General Modal Closing Logic (Click Outside & Escape Key) ---
    window.addEventListener('click', (event) => {
        // Close Terms Modal if clicked outside its content
        if (termsModal && event.target === termsModal) {
            closeModal(termsModal);
        }
        // Close QR Modal if clicked outside its content
        if (qrCodeModal && event.target === qrCodeModal) {
            closeModal(qrCodeModal);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close Terms Modal if it's open and Escape is pressed
             if (termsModal && termsModal.style.display === 'flex') {
                 closeModal(termsModal);
             }
             // Close QR Modal if it's open and Escape is pressed
             if (qrCodeModal && qrCodeModal.style.display === 'flex') {
                 closeModal(qrCodeModal);
             }
        }
    });

    // --- Optional: FAQ Accordion Enhancement (if needed, pure CSS handles basic toggle) ---
    // Example: Add smooth animation (requires CSS adjustments too)
    /*
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        summary.addEventListener('click', (e) => {
            // Prevent default if using details[open] CSS for animation
            // e.preventDefault();
            if (item.open) {
                 // Optional: Actions when closing
            } else {
                // Optional: Actions when opening
                // Close other open items for accordion effect (optional)
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item && otherItem.open) {
                //         otherItem.removeAttribute('open');
                //     }
                // });
            }
        });
    });
    */

}); // End of DOMContentLoaded
