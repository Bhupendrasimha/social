
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log('Copy this JWT secret to your .env file:');
console.log(secret);