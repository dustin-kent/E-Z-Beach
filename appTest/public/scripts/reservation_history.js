// Define a function to fetch and populate reservation history
async function populateReservationHistory() {
  try {
      const response = await fetch('/api/completed-jobs'); 
      const reservationHistory = await response.json();

      const reservationDetailsContainer = document.getElementById('reservationDetails');

      if (reservationHistory && reservationHistory.length > 0) {
          for (const reservation of reservationHistory) {
              const reservationDiv = document.createElement('div');
              reservationDiv.className = 'reservation';

              // Populate reservation details
              const status = document.createElement('p');
                status.className = 'reservation-status';
                status.textContent = reservation.status === 'completed' ? 'Status: Completed' : 'Status: Pending';
                reservationDiv.appendChild(status);

              const cartTotal = parseFloat(reservation.cartTotal); // Convert cartTotal to a number
              const employeePayment = calculateEmployeePayment(cartTotal);

              // Display employee payment
              const employeePaymentElement = document.createElement('p');
              employeePaymentElement.innerHTML = `<strong>Employee Payment:</strong> $${employeePayment}`;
              reservationDiv.appendChild(employeePaymentElement);  

              const fullName = document.createElement('p');
              fullName.innerHTML = `<strong>Reservation Name:</strong> ${reservation.fullName}`;
              reservationDiv.appendChild(fullName);

              const phoneNumber = document.createElement('p');
              phoneNumber.innerHTML = `<strong>Phone Number:</strong> ${reservation.phoneNumber}`;
              reservationDiv.appendChild(phoneNumber);

              const reservationDate = document.createElement('p');
              reservationDate.innerHTML = `<strong>Reservation Date:</strong> ${reservation.reservationDate}`;
              reservationDiv.appendChild(reservationDate);

              const reservationTime = document.createElement('p');
              reservationTime.innerHTML = `<strong>Reservation Time:</strong> ${reservation.reservationTime}`;
              reservationDiv.appendChild(reservationTime);

              const reservationType = document.createElement('p');
              reservationType.innerHTML = `<strong>Reservation Type:</strong> ${reservation.reservationType}`;
              reservationDiv.appendChild(reservationType);

              const pickupDropOffLocationType = document.createElement('p');
              pickupDropOffLocationType.innerHTML = `<strong>Pickup/Drop-off Location Type:</strong> ${reservation.pickupDropOffLocationType}`;
              reservationDiv.appendChild(pickupDropOffLocationType);

              const streetAddress = document.createElement('p');
              streetAddress.innerHTML = `<strong>Street Address:</strong> ${reservation.streetAddress}`;
              reservationDiv.appendChild(streetAddress);

              const city = document.createElement('p');
              city.innerHTML = `<strong>City:</strong> ${reservation.city}`;
              reservationDiv.appendChild(city);

              const state = document.createElement('p');
              state.innerHTML = `<strong>State:</strong> ${reservation.state}`;
              reservationDiv.appendChild(state);

              const zip = document.createElement('p');
              zip.innerHTML = `<strong>Zip:</strong> ${reservation.zip}`;
              reservationDiv.appendChild(zip);

              const vehicleMake = document.createElement('p');
              vehicleMake.innerHTML = `<strong>Vehicle Make:</strong> ${reservation.vehicleMake}`;
              reservationDiv.appendChild(vehicleMake);

              const vehicleModel = document.createElement('p');
              vehicleModel.innerHTML = `<strong>Vehicle Model:</strong> ${reservation.vehicleModel}`;
              reservationDiv.appendChild(vehicleModel);

              const vehicleColor = document.createElement('p');
              vehicleColor.innerHTML = `<strong>Vehicle Color:</strong> ${reservation.vehicleColor}`;
              reservationDiv.appendChild(vehicleColor);

              const licensePlate = document.createElement('p');
              licensePlate.innerHTML = `<strong>License Plate:</strong> ${reservation.licensePlate}`;
              reservationDiv.appendChild(licensePlate);

              const beachAccess = document.createElement('p');
              beachAccess.innerHTML = `<strong>Beach Access Point:</strong> ${reservation.beachAccess}`;
              reservationDiv.appendChild(beachAccess);

              // Create a container for displaying cart items
              const cartItemsContainer = document.createElement('div');
              cartItemsContainer.className = 'cart-items';

              const totalCost = document.createElement('p');
              totalCost.innerHTML = `<strong>Total Cost:</strong> $${reservation.cartTotal}`;
              reservationDiv.appendChild(totalCost);

              // Check if cart items exist 
              if (reservation.cartItems && reservation.cartItems.length > 0) {
                  const cartItemsHeader = document.createElement('p');
                  cartItemsHeader.innerHTML = '<strong>Cart Items:</strong>';
                  cartItemsContainer.appendChild(cartItemsHeader);

                  const cartItemsList = document.createElement('ul');
                  for (const cartItem of JSON.parse(reservation.cartItems)) {
                      const cartItemElement = document.createElement('li');
                      const itemName = cartItem.item_name;
                      const itemQuantity = cartItem.quantity;
                      cartItemElement.textContent = `${itemName} (Quantity: ${itemQuantity})`;
                      cartItemsList.appendChild(cartItemElement);
                  }

                  cartItemsContainer.appendChild(cartItemsList);
              } else {
                  const noCartItemsMessage = document.createElement('p');
                  noCartItemsMessage.textContent = 'No cart items for this reservation.';
                  cartItemsContainer.appendChild(noCartItemsMessage);
              }

              reservationDiv.appendChild(cartItemsContainer);
              

              reservationDetailsContainer.appendChild(reservationDiv);
              
          }
      } else {
          reservationDetailsContainer.innerHTML = '<p>No reservation history found.</p>';
      }
  } catch (error) {
      console.error('Error fetching reservation history:', error);
  }
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  populateReservationHistory();
});

function calculateEmployeePayment(cartTotal) {
  const employeePayment = cartTotal * 0.6;
  return employeePayment.toFixed(2); // Round to two decimal places
}

// Home button event listener
const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', () => {
    window.location.href = '/dashboard';
});

// Logout button event listener
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
        });
        const data = await response.text();
        console.log(data);
        window.location.href = '/login-page.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
});