import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get accessToken from localStorage
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // No token? Redirect to login
    return <Navigate to="/login" replace />;
  }

  // Token exists → allow access
  return children;
};

export default ProtectedRoute;
