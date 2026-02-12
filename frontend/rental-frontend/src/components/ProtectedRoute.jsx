import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, isAdmin } from '../services/authService';

/**
 * Protected Route Component — supports role-based access
 * @param {boolean} adminOnly — if true, only admins can access
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
