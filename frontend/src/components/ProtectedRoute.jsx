import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container py-5 text-center my-5" id="auth-loading-spinner">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-secondary small fw-medium">Verifying authorization with Vinay Agri Inputs...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    return (
      <div className="container py-5 text-center my-5">
        <div className="alert alert-warning d-inline-block py-3 px-4 rounded-4 shadow-sm">
          <i className="bi bi-shield-lock-fill text-warning fs-1 d-block mb-2"></i>
          <h4 className="fw-bold text-dark">Access Restricted</h4>
          <p className="text-secondary small mb-3">
            Your account ({user?.email}) does not have administrative permissions to view this section.
          </p>
          <a href="/" className="btn btn-emerald btn-sm px-4">
            Return to Agri Catalog
          </a>
        </div>
      </div>
    );
  }

  return children;
}
