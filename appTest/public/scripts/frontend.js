document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userTypeResponse = await fetch('/api/user-type');
        const userType = await userTypeResponse.json();

        let pendingReservationsResponse;
        if (userType === 'employee') {
            pendingReservationsResponse = await fetch('/api/all-pending-reservations');
        } else {
            pendingReservationsResponse = await fetch('/api/user-pending-reservations');
        }
        const pendingReservations = await pendingReservationsResponse.json();

        // Sort pendingReservations based on date and then time
        pendingReservations.sort((a, b) => {
            const aDate = new Date(a.reservationDate);
            const bDate = new Date(b.reservationDate);

            if (aDate < bDate) {
                return -1;
            } else if (aDate > bDate) {
                return 1;
            } else {
                const aTime = parseInt(a.reservationTime);
                const bTime = parseInt(b.reservationTime);
                return aTime - bTime;
            }
        });


        const reservationDetailsContainer = document.getElementById('reservationDetails');

        if (pendingReservations && pendingReservations.length > 0) {
            for (const pendingReservation of pendingReservations) {
                const reservationDiv = document.createElement('div');
                reservationDiv.className = 'reservation';

                // Add status indicator based on reservation status
                const status = document.createElement('p');
                status.className = 'reservation-status';
                status.textContent = pendingReservation.status === 'accepted' ? 'Status: Accepted' : 'Status: Pending';
                reservationDiv.appendChild(status);
                
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

             // Extract cart total and calculate the employee payment
        if (userType === 'employee') {
             const cartTotal = pendingReservation.cartTotal;
             const employeePayment = calculateEmployeePayment(cartTotal);

            // Add employee payment element
             const employeePaymentElement = document.createElement('p');
             employeePaymentElement.innerHTML = `<strong>Employee Payment:</strong> $${employeePayment}`;
             reservationDiv.appendChild(employeePaymentElement);
        }

            // Add accept button conditionally based on user type
            if (userType === 'employee') {
                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Accept Job/Reservation';
                acceptButton.className = 'accept-button';
                acceptButton.addEventListener('click', async () => {
                    try {
                        
                        const acceptResponse = await fetch(`/api/accept-reservation/${pendingReservation._id}`, {
                            method: 'POST',
                        });
                        const acceptData = await acceptResponse.json();
                        console.log(acceptData.message);

                        // Remove the accepted reservation from the DOM
                        reservationDiv.remove();
                      
                        // Notify the user that their reservation has been accepted
                        notifyUserReservationAccepted();
                        
                    } catch (acceptError) {
                        console.error('Error accepting reservation:', acceptError);
                    }

                    
                });
                reservationDiv.appendChild(acceptButton);
            }

                // Create the delete button for each reservation
            if (userType === 'user') {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'; // Set the class name for the delete button
                deleteButton.addEventListener('click', async () => {
                    const reservationId = pendingReservation._id; 
                    try {
                        const deleteResponse = await fetch(`/api/delete-reservation/${reservationId}`, {
                            method: 'DELETE',
                        });
                        const deleteData = await deleteResponse.json();
                        console.log(deleteData.message);

                        // Remove the deleted reservation from the DOM
                        reservationDiv.remove();
                    } catch (deleteError) {
                        console.error('Error deleting reservation:', deleteError);
                    }
                });
                reservationDiv.appendChild(deleteButton);
            }

                reservationDetailsContainer.appendChild(reservationDiv);
            }
        } else {
            reservationDetailsContainer.innerHTML = '<p>No pending reservations found.</p>';
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
                window.location.href = '/login-page.html'; // Redirect to the login page
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });

    } catch (error) {
        console.error('Error fetching pending reservations:', error);
    }
});

// Function to calculate employee payment (60% of cart total)
function calculateEmployeePayment(cartTotal) {
    const employeePayment = cartTotal * 0.6;
    return employeePayment.toFixed(2); // Round to two decimal places
}