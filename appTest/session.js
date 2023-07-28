const uuid = require('uuid');

// Generate a random UUID as the secret key
const secretKey = uuid.v4();

// Export the secret key to be used in other parts of the application
module.exports = secretKey;

