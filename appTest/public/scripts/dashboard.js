// Displays the user's first name and role in the dashboard
const urlParams = new URLSearchParams(window.location.search);
const firstName = urlParams.get('firstName');
const role = urlParams.get('role');

if (role === 'admin') {
  // Display admin's first name and role in the admin dashboard
  document.getElementById('welcomeMessage').innerHTML = `<p>Welcome ${firstName}, Admin.</p>`;
} else {
  // Display user/employee's first name and role in the user/employee dashboard
  document.getElementById('firstName').textContent = firstName;
  document.getElementById('role').textContent = role;
}

// function to logout
function logout() {
  fetch('/logout', {
    method: 'POST',
    credentials: 'same-origin'
  })
  .then(response => {
    if (response.ok) {
      // Redirect to the login page after successful logout
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

// Functions to redirect to the "different pages"
function redirectToScheduleReservationPage() {
  window.location.href = '/schedule-reservation-page';
}

function redirectToDashboard() {
  window.location.href = "/dashboard"; 
}

function redirectToUserPendingReservations() {
  window.location.href = '/user-pending-reservation-page';
}

function redirectToViewHistoryPage() {
  window.location.href = '/view-history-page'; 
}
