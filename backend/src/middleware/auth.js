/**
 * Authentication Middleware
 * 
 * This module provides middleware for authenticating requests using JSON Web Tokens (JWT).
 * It verifies the presence and validity of a JWT in the Authorization header and
 * attaches the decoded user information to the request object.
 */

const jwt = require('jsonwebtoken');

/**
 * Authentication middleware function
 * Verifies JWT token from Authorization header and adds decoded user to request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {401} If no token provided or token is invalid
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;