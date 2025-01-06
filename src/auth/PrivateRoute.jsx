// src/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token || token.split(".").length !== 3) {
    // If token is invalid or missing, redirect to login
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
  return children;
}

export default PrivateRoute;
