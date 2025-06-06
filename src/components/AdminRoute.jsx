import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAILS } from '../constants/adminConfig';


const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = ADMIN_EMAILS.includes(currentUser.email);

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
