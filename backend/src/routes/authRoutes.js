/**
 * Authentication Routes
 * 
 * This module defines the routes for user authentication including registration,
 * login, and retrieving the current user's information. Some routes require 
 * authentication via the auth middleware.
 */

const express = require('express');
const {register, login, getCurrentUser} = require('../controllers/authControllers');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * POST /api/auth/register
 * Registers a new user account
 */
router.post('/register', register);

/**
 * POST /api/auth/login 
 * Authenticates user credentials and returns a JWT token
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Retrieves the currently authenticated user's information.
 * Requires authentication.
 */
router.get('/me', auth, getCurrentUser);

module.exports = router;