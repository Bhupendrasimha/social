/**
 * Authentication Slice Configuration
 * 
 * This file configures the Redux slice for handling authentication state.
 * It manages user credentials and token storage in both Redux state and localStorage.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state loads user and token from localStorage if they exist
 */
const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
};

/**
 * Auth slice configuration using Redux Toolkit
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets user credentials in state and localStorage
     * @param {Object} state - Current Redux state
     * @param {Object} payload - Contains user object and auth token
     */
    setCredentials: (state, { payload: { user, token } }) => {
      state.user = user;
      state.token = token;
      localStorage.setItem('token',token);
      localStorage.setItem('user',  JSON.stringify(user));
    },

    /**
     * Clears user credentials from state and localStorage
     * @param {Object} state - Current Redux state
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
