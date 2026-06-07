import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireApproved = true, requireRoles = [] }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!userData) {
    // Current user exists but profile is missing/still loading
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
      </div>
    );
  }

  if (requireApproved) {
    if (userData.status === 'pending') {
      return <Navigate to="/pending" replace />;
    }

    if (userData.status === 'rejected') {
      return <Navigate to="/auth" replace />;
    }
  }

  if (requireRoles && requireRoles.length > 0) {
    const userRoles = userData.role || [];
    const hasRequiredRole = requireRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
