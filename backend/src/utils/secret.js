/**
 * JWT Secret Generator
 * 
 * This utility script generates a secure random string to be used as the JWT secret.
 * It creates a 64-byte random value and converts it to a hexadecimal string.
 * The generated secret should be copied to the .env file for use in JWT signing/verification.
 */

const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log('Copy this JWT secret to your .env file:');
console.log(secret);