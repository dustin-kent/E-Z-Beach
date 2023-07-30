const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const uuid = require('uuid');
const app = express();
const port = 3000;

// Middleware to prevent caching of pages
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// MongoDB connection details
const dbURI = 'mongodb://127.0.0.1:27017';
const dbName = 'apptest-db';

// Set the "views" folder to specify where to find the templates
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
      role: req.body.role, // role is coming from a checkbox (e.g., "user" or "employee")
    };

    console.log('userData:', userData); // Add this console.log to see the userData object  REMOVE LATER AFTER TESTING

    const existingUser = await db.collection('users').findOne({ email: userData.email });

    console.log('existingUser:', existingUser); // Add this console.log to see the existing user, if any   REMOVE LATER AFTER TESTING

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

    if (user.role === 'admin') {
      res.redirect('/admin-dashboard');
    } else {
      res.redirect(`/dashboard.html?firstName=${user.firstName}&role=${user.role}`);
    }

    client.close();
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

// POST route to handle admin login
app.post('/admin-login', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    const { email, password } = req.body;

    console.log('Email:', email);
    console.log('Password:', password);

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

    console.log('Admins:', admins);
    res.render('admin-dashboard', { users, employees, admins });

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
