document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('home-btn');

    if (homeButton) {
        homeButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Returning to home page...');
            window.location.href = 'index.html';
        });
    }
});
