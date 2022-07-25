import React from "react";

import {  Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  return (user ? (user.emailVerified ? children : <Navigate to="/email-verification" />) : <Navigate to="/login" />);
}