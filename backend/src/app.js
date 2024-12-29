/**
 * Main Application Entry Point
 * 
 * This file configures and initializes the Express server and MongoDB connection.
 * It sets up middleware, routes, and starts the server once the database connection is established.
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const health = require('./routes/health')

// Initialize Express app
const app = express();
const connectDB = require('./config/db')

// Configure middleware
app.use(cors());                    // Enable CORS for all routes
app.use(express.json());           // Parse JSON request bodies

// Register route handlers
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/posts', postRoutes); // Post management routes
app.use('/api/health',health)      // Health check endpoint

// Set port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI 

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected! 📦');
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT} 🚀`);
  });
})
.catch((err) => {
  console.log('MongoDB connection error:', err);
});
