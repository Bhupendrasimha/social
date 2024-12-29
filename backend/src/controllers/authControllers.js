/**
 * Authentication Controller
 * 
 * This module provides controller functions for handling user authentication
 * including registration, login, and retrieving the current user's information.
 */

const jwt = require('jsonwebtoken');
const User = require('../model/user');

/**
 * Register a new user
 * 
 * @param {Object} req - Express request object containing username, email and password
 * @param {Object} res - Express response object
 * @returns {Object} New user object and JWT token
 * @throws {400} If registration fails due to validation or duplicate user
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login an existing user
 * 
 * @param {Object} req - Express request object containing email and password
 * @param {Object} res - Express response object
 * @returns {Object} User object and JWT token
 * @throws {400} If login fails due to invalid credentials
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get the currently authenticated user's information
 * 
 * @param {Object} req - Express request object containing authenticated user ID
 * @param {Object} res - Express response object
 * @returns {Object} User object without password
 * @throws {404} If user not found
 * @throws {500} If server error occurs
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { register, login, getCurrentUser };