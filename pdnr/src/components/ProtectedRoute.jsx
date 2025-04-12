import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { useLocation, Navigate } from "react-router-dom";
import { useMemo } from 'react';
import LoadingSpinner from "./LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const memoizedChildren = useMemo(() => children, [children]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/belepes" state={{ from: location }} replace />;
  }

  return memoizedChildren;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};