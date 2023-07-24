const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// MongoDB connection details
const dbURI = 'mongodb://127.0.0.1:27017';
const dbName = 'apptest-db';

// Set the "views" folder to specify where to find the templates
app.set('views', path.join(__dirname, 'views'));

// Set the view engine to use for rendering the template files (EJS)
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// POST route to handle user registration
app.post('/submit-user', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    // Get the form data from the request
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

    const existingUser = await db.collection('users').findOne({ email: userData.email });

    if (existingUser) {
      client.close();
      return res.send('An account with this email address already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    userData.password = hashedPassword;

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
      // Redirect the admin to the admin dashboard
      res.redirect('/admin-dashboard');
    } else {
      // Redirect the user/employee to their dashboard with first name and role / just for testing at the momment.  more code/expansion to come
      res.redirect(`/dashboard.html?firstName=${user.firstName}&role=${user.role}`);
    }

    // Close the MongoDB connection
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

    const admin = await db.collection('users').findOne({ email, role: 'admin' });

    if (!admin) {
      client.close();
      return res.send('Invalid email or password. Please try again.');
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      client.close();
      return res.send('Invalid email or password. Please try again.');
    }

    // Fetch all users and employees from the database
    const usersAndEmployees = await db.collection('users').find({}).toArray();

    // Render the admin-dashboard.ejs page and pass the users and employees data as variables
    res.render('admin-dashboard', { usersAndEmployees });

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

// GET route to handle admin dashboard
app.get('/admin-dashboard', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(dbURI);
    const db = client.db(dbName);

    // Fetch all users and employees from the database
    const usersAndEmployees = await db.collection('users').find({}).toArray();

    // Render the admin-dashboard.ejs page and pass the users and employees data as variables
    res.render('admin-dashboard', { usersAndEmployees });

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    console.error('Error during admin dashboard:', error);
    res.status(500).send('An error occurred while rendering the admin dashboard.');
  }
});

// POST route to handle user logout
app.post('/logout', (req, res) => {
 
  // Respond with a success status code (200) to indicate successful logout
  res.redirect('/login-page.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
