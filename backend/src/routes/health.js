/**
 * Health Check Route
 * 
 * This module provides a simple health check endpoint to verify the server is running
 * and responding to requests properly. It returns a 200 status code with a "healthy" 
 * message when the server is operating normally.
 */

const express=require('express')

const router = express.Router();

/**
 * Health check handler
 * Returns a 200 status with "Server is healthy" message if server is running properly
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating server health status
 */
const health = async (req, res) => {
    try {
      res.status(200).json({ message:"Server is healthy"});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Register health check endpoint
router.get('/', health);

module.exports = router;