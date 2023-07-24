function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login-page.html';
        } else {
            alert('Logout failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
    });
}
