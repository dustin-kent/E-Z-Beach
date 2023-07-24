const form = document.querySelector('form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

form.addEventListener('submit', (event) => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        event.preventDefault();
        alert("Password and Confirm Password do not match. Please try again.");
    }
});
