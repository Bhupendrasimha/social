/**
 * App Component
 * 
 * The root component of the application that sets up routing and Redux store.
 * Handles authentication flow and protected routes.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './views/login';
import Register from './views/register';
import PostList from './views/post';
import ProtectedRoute from './protectedRoute';
import './App.css'

/**
 * Main App component that wraps the entire application
 * Sets up Redux Provider and React Router
 * Defines all available routes and their components
 * @returns {JSX.Element} The main application component
 */
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes that require authentication */}
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostList />
              </ProtectedRoute>
            }
          />
           <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/posts" replace />
          </ProtectedRoute>
        }
      />
    {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;