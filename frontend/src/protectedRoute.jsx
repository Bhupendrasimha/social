/**
 * Protected Route Component
 * 
 * A wrapper component that protects routes from unauthorized access.
 * Redirects users to the login page if they are not authenticated.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component that checks for authentication
 * before rendering protected content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Protected route content or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  // Get authentication token from Redux store
  const { token } = useSelector((state) => state.auth);
  
  // Get current location for redirect after login
  const location = useLocation();

  // If no token exists, redirect to login with return path
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;