import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
