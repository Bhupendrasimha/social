/**
 * User Model
 * 
 * Defines the schema and model for users in the social media application.
 * Handles user account data including username, email, and password with
 * secure password hashing.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * 
 * @property {String} username - Unique username for the user
 * @property {String} email - Unique email address for the user
 * @property {String} password - Hashed password for authentication
 * @property {Date} createdAt - Timestamp of when the account was created
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compare a candidate password with user's hashed password
 * 
 * @param {String} candidatePassword - The password to check
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
