import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    // You should return a loading indicator here
    return <div>Loading...</div>; // Or any loading component you prefer
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;