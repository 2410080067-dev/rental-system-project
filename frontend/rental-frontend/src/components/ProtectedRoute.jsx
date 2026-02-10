import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/authService';

/**
 * Protected Route Component - Restricts access to authenticated users only
 */
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
