const bcrypt = require('bcrypt');

async function generateAdminHashedPassword() {
  const adminPassword = 'xxxxxxx'; // Replace 'your_admin_password' with the desired password for the admin user
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error generating hashed password:', error);
  }
}

generateAdminHashedPassword();
