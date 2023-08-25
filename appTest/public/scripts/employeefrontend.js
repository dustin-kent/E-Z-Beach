// Define the completeReservation function
async function completeReservation(reservationId) {
    try {
        const response = await fetch(`/api/complete-reservation/${reservationId}`, {
            method: 'PUT',
        });
        const data = await response.json();
        return data; 
    } catch (error) {
        throw new Error('Error completing reservation: ' + error.message);
    }
}
// Define the cancelReservation function
async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`/api/cancel-reservation/${reservationId}`, {
            method: 'PUT', 
        });
        const data = await response.json();
        return data; 
    } catch (error) {
        throw new Error('Error canceling reservation: ' + error.message);
    }
}



        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const userTypeResponse = await fetch('/api/user-type');
                const userType = await userTypeResponse.json();
    
                let assignedJobsResponse;
                if (userType === 'employee') {
                    assignedJobsResponse = await fetch('/api/assigned-jobs'); 
                } else {
                    assignedJobsResponse = await fetch('/api/assigned-jobs'); 
                }
                const assignedJobs = await assignedJobsResponse.json();
    
                // Sort assignedJobs based on date and then time
                assignedJobs.sort((a, b) => {
                    const aDate = new Date(a.jobDate);
                    const bDate = new Date(b.jobDate);
    
                    if (aDate < bDate) {
                        return -1;
                    } else if (aDate > bDate) {
                        return 1;
                    } else {
                        const aTime = parseInt(a.jobTime);
                        const bTime = parseInt(b.jobTime);
                        return aTime - bTime;
                    }
                });
    
                const jobDetailsContainer = document.getElementById('jobDetails'); 
    
                if (assignedJobs && assignedJobs.length > 0) {
                for (const assignedJob of assignedJobs) {
                    const jobDiv = document.createElement('div');
                    jobDiv.className = 'job';

                    // Add status indicator based on job status
                    const status = document.createElement('p');
                    status.className = 'job-status';
                    status.textContent = assignedJob.status === 'completed' ? 'Status: Completed' : 'Status: Pending';
                    jobDiv.appendChild(status);

                    // Job details
                    const fullName = document.createElement('p');
                    fullName.innerHTML = `<strong>Reservation Name:</strong> ${assignedJob.fullName}`;
                    jobDiv.appendChild(fullName);

                    const phoneNumber = document.createElement('p');
                    phoneNumber.innerHTML = `<strong>Phone Number:</strong> ${assignedJob.phoneNumber}`;
                    jobDiv.appendChild(phoneNumber);

                    const reservationDate = document.createElement('p');
                    reservationDate.innerHTML = `<strong>Reservation Date:</strong> ${assignedJob.reservationDate}`;
                    jobDiv.appendChild(reservationDate);

                    const reservationTime = document.createElement('p');
                    reservationTime.innerHTML = `<strong>Reservation Time:</strong> ${assignedJob.reservationTime}`;
                    jobDiv.appendChild(reservationTime);

                    const reservationType = document.createElement('p');
                    reservationType.innerHTML = `<strong>Reservation Type:</strong> ${assignedJob.reservationType}`;
                    jobDiv.appendChild(reservationType);

                    const pickupDropOffLocationType = document.createElement('p');
                    pickupDropOffLocationType.innerHTML = `<strong>Pickup/Drop-off Location Type:</strong> ${assignedJob.pickupDropOffLocationType}`;
                    jobDiv.appendChild(pickupDropOffLocationType);

                    const streetAddress = document.createElement('p');
                    streetAddress.innerHTML = `<strong>Street Address:</strong> ${assignedJob.streetAddress}`;
                    jobDiv.appendChild(streetAddress);

                    const city = document.createElement('p');
                    city.innerHTML = `<strong>City:</strong> ${assignedJob.city}`;
                    jobDiv.appendChild(city);

                    const state = document.createElement('p');
                    state.innerHTML = `<strong>State:</strong> ${assignedJob.state}`;
                    jobDiv.appendChild(state);

                    const zip = document.createElement('p');
                    zip.innerHTML = `<strong>Zip:</strong> ${assignedJob.zip}`;
                    jobDiv.appendChild(zip);

                    const vehicleMake = document.createElement('p');
                    vehicleMake.innerHTML = `<strong>Vehicle Make:</strong> ${assignedJob.vehicleMake}`;
                    jobDiv.appendChild(vehicleMake);

                    const vehicleModel = document.createElement('p');
                    vehicleModel.innerHTML = `<strong>Vehicle Model:</strong> ${assignedJob.vehicleModel}`;
                    jobDiv.appendChild(vehicleModel);

                    const vehicleColor = document.createElement('p');
                    vehicleColor.innerHTML = `<strong>Vehicle Color:</strong> ${assignedJob.vehicleColor}`;
                    jobDiv.appendChild(vehicleColor);

                    const licensePlate = document.createElement('p');
                    licensePlate.innerHTML = `<strong>License Plate:</strong> ${assignedJob.licensePlate}`;
                    jobDiv.appendChild(licensePlate);

                    const beachAccess = document.createElement('p');
                    beachAccess.innerHTML = `<strong>Beach Access Point:</strong> ${assignedJob.beachAccess}`;
                    jobDiv.appendChild(beachAccess);

                    // Create a container for displaying cart items
                    const cartItemsContainer = document.createElement('div');
                    cartItemsContainer.className = 'cart-items';

                    const totalCost = document.createElement('p');
                    totalCost.innerHTML = `<strong>Total Cost:</strong> $${assignedJob.cartTotal}`;
                    jobDiv.appendChild(totalCost);
                    

                    // Loop through cartItems array and create elements for each item
                    if (assignedJob.cartItems && assignedJob.cartItems.length > 0) {
                        const cartItemsHeader = document.createElement('p');
                        cartItemsHeader.innerHTML = '<strong>Cart Items:</strong>';
                        jobDiv.appendChild(cartItemsHeader);

                        const cartItemsList = document.createElement('ul');
                        for (const cartItem of JSON.parse(assignedJob.cartItems)) {
                            const cartItemElement = document.createElement('li');
                            const itemName = cartItem.item_name;
                            const itemQuantity = cartItem.quantity;
                            cartItemElement.textContent = `${itemName} (Quantity: ${itemQuantity})`;
                            cartItemsList.appendChild(cartItemElement);
                        }
                        cartItemsContainer.appendChild(cartItemsList);
                        jobDiv.appendChild(cartItemsContainer);
                    }

                    jobDetailsContainer.appendChild(jobDiv);

                        // Calculate employee payment
                        const cartTotal = assignedJob.cartTotal;
                        const employeePayment = calculateEmployeePayment(cartTotal);

                        // Display employee payment
                        const employeePaymentElement = document.createElement('p');
                        employeePaymentElement.innerHTML = `<strong>Employee Payment:</strong> $${employeePayment}`;
                        jobDiv.appendChild(employeePaymentElement);

                            // Create Complete and Reject/Cancel buttons
                            const completeButton = document.createElement('button');
                            completeButton.textContent = 'Complete';
                            completeButton.className = 'complete-button';
                            completeButton.addEventListener('click', async () => {
                                try {
                                    // Call the completeReservation function
                                    await completeReservation(assignedJob._id);
                                    
                                    // Remove the reservation from the DOM if needed
                                    jobDiv.remove();

                                } catch (error) {
                                    console.error('Error completing reservation:', error);
                                }
                            });

                            const rejectButton = document.createElement('button');
                            rejectButton.textContent = 'Reject/Cancel';
                            rejectButton.className = 'reject-button';
                            rejectButton.addEventListener('click', async () => {
                                try {
                                    // Call the cancelReservation function
                                    await cancelReservation(assignedJob._id);

                                    // Remove the reservation from the DOM if needed
                                    jobDiv.remove();

                                } catch (error) {
                                    console.error('Error canceling reservation:', error);
                                }
                            });

                            jobDiv.appendChild(completeButton);
                            jobDiv.appendChild(rejectButton);

                            //notifyUserReservationRejected();
                        }

                            const rejectButton = document.createElement('button');
                            rejectButton.textContent = 'Reject/Cancel';
                            rejectButton.className = 'reject-button';

                            
                            jobDiv.appendChild(completeButton);
                            jobDiv.appendChild(rejectButton);                   
                        }                      
                        else {
                jobDetailsContainer.innerHTML = '<p>No assigned jobs found.</p>';
            }
            
                 } catch (error) {
                     console.error('Error fetching assigned jobs:', error);
                        }
                    });
            

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


        function calculateEmployeePayment(cartTotal) {
            const employeePayment = cartTotal * 0.6;
            return employeePayment.toFixed(2); // Round to two decimal places
        }
   
                    