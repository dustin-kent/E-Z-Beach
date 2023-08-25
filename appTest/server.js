const dotenv = require('dotenv'); 
const express = require('express');
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const uuid = require('uuid');
const app = express();
const port = 3000;
const ejs = require('ejs');
const twilio = require('twilio');

// Load the environment variables from the .env file
dotenv.config();

// Middleware to prevent caching of pages
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// MongoDB connection details read from environment variables
const dbURI = process.env.DB_URI;
const dbName = process.env.DB_NAME;

// Set the "views" folder to specify where to find the templates
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Set the view engine to use for rendering the template files (EJS)
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Generate a random UUID as the secret key
const secretKey = uuid.v4();

// Use the session middleware
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Change to 'true' if using HTTPS
    httpOnly: true,
  },
}));

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function to format the phone number with dashes
function formatPhoneNumber(phone) {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? match[1] + '-' + match[2] + '-' + match[3] : phone;
}

//save reservation data into a collection called "pending reservations"
app.post('/submit-reservation', async (req, res) => {
  console.log('Received form data:', req.body); // Log received data

  // Extract the radio button selection
  const reservationType = req.body.reservationType;

  // Extract other form fields
  const fullName = req.body.fullName;
  const phoneNumber = req.body.phoneNumber;
  const reservationDate = req.body.reservationDate;
  const reservationTime = req.body.reservationTime;
  const pickupDropOffLocationType = req.body.pickupDropOffLocationType;
  const streetAddress = req.body.streetAddress;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;
  const vehicleMake = req.body.vehicleMake;
  const vehicleModel = req.body.vehicleModel;
  const vehicleColor = req.body.vehicleColor;
  const licensePlate = req.body.licensePlate;
  const beachAccess = req.body.BeachAccess; // Note Capital name for BeachAccess..... dont make that mistake again!!
  const cartItems = JSON.parse(req.body.cartItems); // Parse the JSON string to an array
  const cartTotal = req.body.cartTotal; // Retrieve the cartTotal value from the cartTotalInput field
  

  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    // Get the _id of the logged-in user from the session
    const loggedInUserId = req.session.user._id;

    const reservationData = {
      fullName,
      phoneNumber,
      reservationDate,
      reservationTime,
      reservationType,
      pickupDropOffLocationType,
      streetAddress,
      city,
      state,
      zip,
      vehicleMake,
      vehicleModel,
      vehicleColor,
      licensePlate,
      beachAccess,
      cartItems: req.body.cartItems,
      cartTotal: cartTotal,
      userId: loggedInUserId,// Include the user's _id in the reservation data
      timestamp: new Date(),
      status: 'pending', 
      // ... (other fields if needed)
    };

    // Save reservationData to the database
    await db.collection('pending_reservations').insertOne(reservationData);

    await client.close();

    res.send(`
      <script>
          alert('Reservation submitted successfully');
          window.location.href = '/dashboard'; // Replace with the actual URL of your dashboard page
      </script>
    `);
  } catch (error) {
    console.error('Error saving reservation data:', error);
    res.status(500).send('An error occurred while saving the reservation data.');
  }
});

// Function to submit user/employee to database
app.post('/submit-user', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      streetAddress: req.body.streetAddress,
      city: req.body.city, 
      state: req.body.state,
      zipCode: req.body.zipCode,
      role: req.body.role, 
    };

    console.log('userData:', userData); // console.log to see the userData object  

    const existingUser = await db.collection('users').findOne({ email: userData.email });

    console.log('existingUser:', existingUser); // console.log to see the existing user, if any   

    if (existingUser) {
      client.close();
      return res.send('An account with this email address already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    userData.password = hashedPassword;

    // Insert the user data into the "users" collection
    await db.collection('users').insertOne(userData);

    await client.close();

    res.redirect('/login-page.html?success=true');
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send('An error occurred while saving the user data.');
  }
});

// Function to submit admin data to the database
app.post('/submit-admin', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const adminData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      // Hash the password before saving it to the database
      password: await bcrypt.hash(req.body.password, 10),
      role: 'admin', // Add the "role" field with the value "admin"
    };

    const existingAdmin = await db.collection('admin').findOne({ email: adminData.email });

    if (existingAdmin) {
      client.close();
      return res.send('An admin account with this email address already exists.');
    }

    // Insert the admin data into the "admin" collection
    await db.collection('admin').insertOne(adminData);

    await client.close();

    // Redirect back to the admin dashboard after successfully creating the admin account
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Error saving admin data:', error);
    res.status(500).send('An error occurred while saving the admin data.');
  }
});

// POST route to handle user login
app.post('/login', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      client.close();
      return res.send('Invalid email or password. Please try again.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      client.close();
      return res.send('Invalid email or password. Please try again.');
    }

    // Set the user object in the session
    req.session.user = user;

    if (user.role === 'admin') {
      // Redirect to the admin dashboard if the user is an admin
      res.redirect('/admin-dashboard');
    } else {
      // Redirect to the regular dashboard for other roles
      res.redirect('/dashboard');
    }

    client.close();
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

// Route to render the dashboard for both user and employee
app.get('/dashboard', (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.redirect('/login-page.html'); // Redirect to login page if not logged in
  }

  // GET route to render the schedule-reservation-page.ejs
app.get('/schedule-reservation-page', (req, res) => {
  const timeIntervals = generateTimeIntervals(600, 1200, 5); // Generate 5-minute intervals from 6:00 AM to 8:00 PM
  res.render('schedule-reservation-page', { user: req.session.user, timeIntervals });
});

  // Render the dashboard.ejs template and pass the user object to it
  res.render('dashboard', { user: req.session.user });
});


// GET route to render the schedule-reservation-page.ejs
app.get('/schedule-reservation-page', (req, res) => {
  res.render('schedule-reservation-page', { user: req.session.user }); 
});

// Render the user-pending-reservation-page.ejs
app.get('/user-pending-reservation-page', (req, res) => {
  res.render('user-pending-reservation-page', { user: req.session.user });
});

app.get('/view-history-page', (req, res) => {
  res.render('view-history-page'); // Render the view history page using EJS
});

// POST route to handle admin login
app.post('/admin-login', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const { email, password } = req.body;

   
    const admin = await db.collection('admin').findOne({ email });

    console.log('Admin:', admin);

    if (!admin) {
      client.close();
      return res.send('Invalid email or password. Please try again.');
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      client.close();
      return res.send('Invalid email or password. Please try again.');
    }

    const users = await db.collection('users').find({}).toArray();
    const employees = await db.collection('employees').find({}).toArray();
    const admins = [admin]; // Convert the admin object into an array

    console.log('Admins:', admins);

    // Set a session variable to indicate that the user is logged in as an admin
    req.session.isAdmin = true;

    res.render('admin-dashboard', { users, employees, admins });

    client.close();
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

// GET route to handle admin dashboard
app.get('/admin-dashboard', async (req, res) => {
  try {
    // Check if the user is logged in as an admin
    if (!req.session.isAdmin) {
      return res.redirect('/admin-login-page.html'); // Redirect to the admin login page if not logged in as admin
    }

    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const users = await db.collection('users').find({}).toArray();
    const employees = await db.collection('employees').find({}).toArray();
    const admins = await db.collection('admin').find({}).toArray();

    // Fetch reservation history data from the database
    const reservationHistory = await db.collection('reservation_history').find({}).toArray();

    console.log('Admins:', admins);
    res.render('admin-dashboard', { users, employees, admins, reservationHistory });

    client.close();
  } catch (error) {
    console.error('Error during admin dashboard:', error);
    res.status(500).send('An error occurred while rendering the admin dashboard.');
  }
});


// POST route to handle user logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      console.log('User logged out successfully.');
    }
    res.redirect('/login-page.html');
  });
});

// Function to generate time intervals in AM/PM format from start to end time
function generateTimeIntervals(startTime, endTime, intervalMinutes) {
  const timeIntervals = [];
  let time = startTime;
  while (time <= endTime) {
    const hour = Math.floor(time / 100);
    const minute = time % 100;
    if (minute < 60) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      // Ensure minutes are within the range of 0 to 59
      minute = Math.min(Math.max(0, m), 59);
      const formattedMinute = minute.toString().padStart(2, '0');
      const timeString = `${formattedHour}:${formattedMinute} ${ampm}`;
      timeIntervals.push({ value: time, label: timeString });
    }
    // Increment time correctly for both hours and minutes
    time += formattedMinute === '55' ? (60 - minute) + (intervalMinutes - 5) : intervalMinutes;
  }
  return timeIntervals;
}

// Add a new item to the beach gear collection
app.post('/api/beach-gear/add', async (req, res) => {
  try {
    const newItem = req.body;
    await BeachGear.create(newItem);
    res.status(201).json({ message: 'Item added successfully.' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'An error occurred while adding the item.' });
  }
});

// Remove an item from the beach gear collection
app.post('/api/beach-gear/remove', async (req, res) => {
  try {
    const itemId = req.body.itemId;
    await BeachGear.findByIdAndRemove(itemId);
    res.json({ message: 'Item removed successfully.' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'An error occurred while removing the item.' });
  }
});

// Get all items from the beach gear collection
app.get('/api/beach-gear/all', async (req, res) => {
  try {
    const allItems = await BeachGear.find();
    res.json(allItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'An error occurred while fetching items.' });
  }
});

// Route to fetch all pending reservations for the user
app.get('/api/user-pending-reservations', async (req, res) => {
  try {
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      const loggedInUserId = req.session.user._id;

      // Retrieve all pending reservations for the user
      const pendingReservations = await db.collection('pending_reservations')
          .find({ userId: loggedInUserId })
          .toArray();

      await client.close();

      res.json(pendingReservations);
  } catch (error) {
      console.error('Error fetching pending reservations:', error);
      res.status(500).json({ error: 'An error occurred while fetching pending reservations.' });
  }
});


app.delete('/api/delete-reservation/:reservationId', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const reservationId = req.params.reservationId;

    // Find the reservation in the pending_reservations collection
    const reservation = await db.collection('pending_reservations').findOne({ _id: new mongodb.ObjectId(reservationId) });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // Move the reservation to the reservation_history collection
    reservation.status = 'canceled'; // Update the status
    await db.collection('reservation_history').insertOne(reservation);

    // Delete the reservation from the pending_reservations collection
    await db.collection('pending_reservations').deleteOne({ _id: new mongodb.ObjectId(reservationId) });

    client.close();

    res.json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    console.error('Error canceling reservation:', error);
    res.status(500).json({ error: 'An error occurred while canceling the reservation' });
  }
});

// Route to fetch user's reservation history
app.get('/api/user-reservation-history', async (req, res) => {
  try {
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      const loggedInUserId = req.session.user._id;

      // Retrieve reservation history for the user
      const reservationHistory = await db.collection('reservation_history')
          .find({ userId: loggedInUserId })
          .toArray();

      await client.close();

      res.json(reservationHistory);
  } catch (error) {
      console.error('Error fetching reservation history:', error);
      res.status(500).json({ error: 'An error occurred while fetching reservation history.' });
  }
});

// API route to fetch user type (user or employee)
app.get('/api/user-type', (req, res) => {
  // Determine the user type based on session data (user or employee)
  if (req.session.user.role === 'employee') {
      res.json('employee');
  } else {
      res.json('user');
  }
});

// API route to fetch all pending reservations for employees
app.get('/api/all-pending-reservations', async (req, res) => {
  try {
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      // Retrieve all pending reservations from the database for employees
      const pendingReservations = await db.collection('pending_reservations').find({}).toArray();

      await client.close();

      res.json(pendingReservations);
  } catch (error) {
      console.error('Error fetching pending reservations:', error);
      res.status(500).json({ error: 'An error occurred while fetching pending reservations.' });
  }
});

// For accepting reservations
app.post('/api/accept-reservation/:reservationId', async (req, res) => {
  const reservationId = req.params.reservationId;
  const employeeId = req.session.user._id; // Use req.session.user to get the employee ID

  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const reservation = await db.collection('pending_reservations').findOne({ _id: new mongodb.ObjectId(reservationId) });

    if (!reservation) {
      client.close();
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    // Update the status of the reservation to 'Accepted'
    await db.collection('pending_reservations').updateOne(
      { _id: new mongodb.ObjectId(reservationId) },
      { $set: { status: 'Accepted' } }
    );

    // Remove the reservation from the user's pending reservations
    await db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(reservation.userId) },
      { $pull: { pendingReservations: new mongodb.ObjectId(reservationId) } }
    );

    // Send SMS notification to the user
    const reservationPhoneNumber = reservation.phoneNumber;
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    const clientTwilio = twilio(twilioAccountSid, twilioAuthToken);

// Parse the cartTotal string to a number
const cartTotalNumber = parseFloat(reservation.cartTotal);

// Construct the SMS message with reservation details
const messageBody = `Congratulations ${reservation.fullName}, your reservation has been accepted and assigned. Details:\n` +
  `Reservation Date: ${reservation.reservationDate}\n` +
  `Reservation Time: ${reservation.reservationTime}\n` +
  `Total Price: $${cartTotalNumber.toFixed(2)}\n` +
  `Assigned Employee: ${req.session.user.firstName} ${req.session.user.lastName}\n`;

    await clientTwilio.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: reservationPhoneNumber,
    });

    // Move the reservation to the assigned_jobs collection with the employee ID
    const assignedJob = {
      ...reservation,
      assignedTo: employeeId,
    };
    await db.collection('assigned_jobs').insertOne(assignedJob);

    // Delete the reservation from the pending_reservations collection
    await db.collection('pending_reservations').deleteOne({ _id: new mongodb.ObjectId(reservationId) });

    client.close();

    res.json({ message: 'Reservation accepted and moved to assigned jobs.' });
  } catch (error) {
    console.error('Error accepting reservation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route to fetch assigned jobs for employees
app.get('/api/assigned-jobs', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    
    const loggedInUserId = req.session.user._id; // Use req.session.user to get the employee's ID

    // Retrieve assigned jobs that match the logged-in employee ID
    const assignedJobs = await db.collection('assigned_jobs').find({ assignedTo: loggedInUserId }).toArray();

    await client.close();

    res.json(assignedJobs);
  } catch (error) {
    console.error('Error fetching assigned jobs:', error);
    res.status(500).json({ error: 'An error occurred while fetching assigned jobs.' });
  }
});

app.put('/api/complete-reservation/:reservationId', async (req, res) => {
  try {
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      const reservationId = req.params.reservationId;

      // Find the reservation in the assigned_jobs collection
      const reservation = await db.collection('assigned_jobs').findOne({ _id: new mongodb.ObjectId(reservationId) });

      if (!reservation) {
          client.close();
          return res.status(404).json({ error: 'Reservation not found.' });
      }

      // Move the reservation to the reservation_history collection
      reservation.status = 'completed'; // Update the status
      await db.collection('reservation_history').insertOne(reservation);

      // Delete the reservation from the assigned_jobs collection
      await db.collection('assigned_jobs').deleteOne({ _id: new mongodb.ObjectId(reservationId) });

      // Send SMS notification for initially completed job
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      const clientTwilio = twilio(twilioAccountSid, twilioAuthToken);

      const reservationPhoneNumber = reservation.phoneNumber;
      const messageBody = `Hello ${reservation.fullName}, your reservation on ${reservation.reservationDate} at ${reservation.reservationTime} has been completed. Your card has now been charged. Thank you for using our services!`;

      await clientTwilio.messages.create({
          body: messageBody,
          from: twilioPhoneNumber,
          to: reservationPhoneNumber,
      });

      client.close();

      res.json({ message: 'Reservation completed and moved to history successfully' });
  } catch (error) {
      console.error('Error completing reservation:', error);
      res.status(500).json({ error: 'An error occurred while completing the reservation' });
  }
});


app.put('/api/cancel-reservation/:reservationId', async (req, res) => {
  try {
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      const reservationId = req.params.reservationId;

      // Find the reservation in the assigned_jobs collection
      const reservation = await db.collection('assigned_jobs').findOne({ _id: new mongodb.ObjectId(reservationId) });

      if (!reservation) {
          return res.status(404).json({ error: 'Reservation not found.' });
      }

      // Send SMS notification to the user
      const reservationPhoneNumber = reservation.phoneNumber;
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      const clientTwilio = twilio(twilioAccountSid, twilioAuthToken);

      // Parse the cartTotal string to a number
      const cartTotalNumber = parseFloat(reservation.cartTotal);

      // Construct the SMS message with reservation details
      const messageBody = `Important Notice! ${reservation.fullName}, your recently accepted/assigned reservation has been rejected, returned to you, and is currently in pending status. Please wait while we try to reassign your reservation. Details:\n` +
          `Reservation Date: ${reservation.reservationDate}\n` +
          `Reservation Time: ${reservation.reservationTime}\n` +
          `Total Price: $${cartTotalNumber.toFixed(2)}\n`;
          

      await clientTwilio.messages.create({
          body: messageBody,
          from: twilioPhoneNumber,
          to: reservationPhoneNumber,
      });

      // Update the reservation status to canceled
      reservation.status = 'returned/pending';

      // Move the reservation back to the pending_reservations collection
      await db.collection('pending_reservations').insertOne(reservation);

      // Delete the reservation from the assigned_jobs collection
      await db.collection('assigned_jobs').deleteOne({ _id: new mongodb.ObjectId(reservationId) });

      client.close();

      res.json({ message: 'Reservation canceled successfully' });
  } catch (error) {
      console.error('Error canceling reservation:', error);
      res.status(500).json({ error: 'An error occurred while canceling the reservation' });
  }
});



app.get('/api/completed-jobs', async (req, res) => {
  try {
      const userId = req.session.user._id; // Get the user's ID from the session
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      // Find reservation history for the logged-in user/employee
      const completedHistory = await db.collection('reservation_history').find({
          assignedTo: userId,
          status: 'completed'
      }).toArray();

      client.close();

      res.json(completedHistory);
  } catch (error) {
      console.error('Error fetching completed history:', error);
      res.status(500).json({ error: 'An error occurred while fetching completed history' });
  }
});

app.delete('/api/delete-account', async (req, res) => {
  try {
      const userId = req.session.user._id; // Get the user's ID from the session
      const client = await mongodb.MongoClient.connect(dbURI);
      const db = client.db(dbName);

      // Delete the user's account from the database
      await db.collection('users').deleteOne({ _id: new mongodb.ObjectId(userId) });



      client.close();

      // Clear the session and log the user out
      req.session.destroy();

      res.json({ message: 'Account deleted successfully' });
  } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ error: 'An error occurred while deleting the account' });
  }
});


app.get('/employee-history-page', (req, res) => {
  res.render('employee-history-page'); // Render the EJS template for the employee history page
});

// Route for the "view available reservations" page
app.get('/available-reservations-page', (req, res) => {
  res.render('available-reservations-page'); // Render the EJS template
});

app.get('/assigned-jobs', (req, res) => {
  res.render('assigned-jobs'); // Render the EJS template
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



