document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user-pending-reservations');
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

                // Add more details here

                reservationDetailsContainer.appendChild(reservationDiv);
            }
        } else {
            reservationDetailsContainer.innerHTML = '<p>No pending reservations found.</p>';
        }
    } catch (error) {
        console.error('Error fetching pending reservations:', error);
    }
});
