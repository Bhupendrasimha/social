/**
 * Redux Store Configuration
 * 
 * This file configures the main Redux store using Redux Toolkit's configureStore.
 * It combines the API slice reducer for handling API state and the auth reducer
 * for managing authentication state. It also adds the RTK Query middleware to
 * enable caching, invalidation, polling and other features.
 */

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../slice/apiSlice';
import authReducer from '../slice/authSlice';

/**
 * Configure and export the Redux store
 * @param {Object} reducer - Combined reducers including API and auth state
 * @param {Function} middleware - Default middleware plus RTK Query middleware
 */
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // API slice reducer
    auth: authReducer, // Authentication reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});
