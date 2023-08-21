document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user-reservation-history');
        const pendingReservations = await response.json();

        const reservationDetailsContainer = document.getElementById('reservationDetails');

        if (pendingReservations && pendingReservations.length > 0) {
            for (const pendingReservation of pendingReservations) {
                const reservationDiv = document.createElement('div');
                reservationDiv.className = 'reservation';
                
                const fullName = document.createElement('p');
                fullName.innerHTML = `<strong>Reservation Name:</strong> ${pendingReservation.fullName}`;
                reservationDiv.appendChild(fullName);

                const phoneNumber = document.createElement('p');
                phoneNumber.innerHTML = `<strong>Phone Number:</strong> ${pendingReservation.phoneNumber}`;
                reservationDiv.appendChild(phoneNumber);

                const reservationDate = document.createElement('p');
                reservationDate.innerHTML = `<strong>Reservation Date:</strong> ${pendingReservation.reservationDate}`;
                reservationDiv.appendChild(reservationDate);

                const reservationTime = document.createElement('p');
                reservationTime.innerHTML = `<strong>Reservation Time:</strong> ${pendingReservation.reservationTime}`;
                reservationDiv.appendChild(reservationTime);

                const reservationType = document.createElement('p');
                reservationType.innerHTML = `<strong>Reservation Type:</strong> ${pendingReservation.reservationType}`;
                reservationDiv.appendChild(reservationType);

                const pickupDropOffLocationType = document.createElement('p');
                pickupDropOffLocationType.innerHTML = `<strong>Pickup/Drop-off Location Type:</strong> ${pendingReservation.pickupDropOffLocationType}`;
                reservationDiv.appendChild(pickupDropOffLocationType);

                const streetAddress = document.createElement('p');
                streetAddress.innerHTML = `<strong>Street Address:</strong> ${pendingReservation.streetAddress}`;
                reservationDiv.appendChild(streetAddress);

                const city = document.createElement('p');
                city.innerHTML = `<strong>City:</strong> ${pendingReservation.city}`;
                reservationDiv.appendChild(city);

                const state = document.createElement('p');
                state.innerHTML = `<strong>State:</strong> ${pendingReservation.state}`;
                reservationDiv.appendChild(state);

                const zip = document.createElement('p');
                zip.innerHTML = `<strong>Zip:</strong> ${pendingReservation.zip}`;
                reservationDiv.appendChild(zip);

                const vehicleMake = document.createElement('p');
                vehicleMake.innerHTML = `<strong>Vehicle Make:</strong> ${pendingReservation.vehicleMake}`;
                reservationDiv.appendChild(vehicleMake);

                const vehicleModel = document.createElement('p');
                vehicleModel.innerHTML = `<strong>Vehicle Model:</strong> ${pendingReservation.vehicleModel}`;
                reservationDiv.appendChild(vehicleModel);

                const vehicleColor = document.createElement('p');
                vehicleColor.innerHTML = `<strong>Vehicle Color:</strong> ${pendingReservation.vehicleColor}`;
                reservationDiv.appendChild(vehicleColor);

                const licensePlate = document.createElement('p');
                licensePlate.innerHTML = `<strong>License Plate:</strong> ${pendingReservation.licensePlate}`;
                reservationDiv.appendChild(licensePlate);

                const beachAccess = document.createElement('p');
                beachAccess.innerHTML = `<strong>Beach Access Point:</strong> ${pendingReservation.beachAccess}`;
                reservationDiv.appendChild(beachAccess);

                // Create a container for displaying cart items
                const cartItemsContainer = document.createElement('div');
                cartItemsContainer.className = 'cart-items';

                const totalCost = document.createElement('p');
                totalCost.innerHTML = `<strong>Total Cost:</strong> $${pendingReservation.cartTotal}`;
                reservationDiv.appendChild(totalCost);

                // Loop through cartItems array and create elements for each item

            if (pendingReservation.cartItems && pendingReservation.cartItems.length > 0) {
                const cartItemsHeader = document.createElement('p');
                cartItemsHeader.innerHTML = '<strong>Cart Items:</strong>';
                reservationDiv.appendChild(cartItemsHeader);

                const cartItemsList = document.createElement('ul');
                for (const cartItem of JSON.parse(pendingReservation.cartItems)) {
                    const cartItemElement = document.createElement('li');
                    const itemName = cartItem.item_name;
                    const itemQuantity = cartItem.quantity;
                    cartItemElement.textContent = `${itemName} (Quantity: ${itemQuantity})`;
                    cartItemsList.appendChild(cartItemElement);
                }

                reservationDiv.appendChild(cartItemsList);
            }

                reservationDetailsContainer.appendChild(reservationDiv);

                const status = document.createElement('p');
        status.innerHTML = `<strong>Status:</strong> ${pendingReservation.status}`;
        reservationDiv.appendChild(status);4
            }
        } else {
            reservationDetailsContainer.innerHTML = '<p>No reservations history.</p>';
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
                console.log(data); // Display the logout message in the console
                window.location.href = '/login-page.html'; // Redirect to the login page
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });

    } catch (error) {
        console.error('Error fetching pending reservations:', error);
    }
});