document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission
            
            // Here you would normally integrate with a payment gateway (Stripe, etc.)
            // For this simulation, we'll just redirect to the confirmation page.
            
            console.log('Payment form submitted. Redirecting to confirmation...');
            window.location.href = 'confirmation.html';
        });
    }
});
