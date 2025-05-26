import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
      const decoded = jwtDecode(token);


    // Check for correct role
    if (role && decoded.role !== role) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}
