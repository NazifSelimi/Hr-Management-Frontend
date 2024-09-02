import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ComponentType<any>;
  requiredRole: "admin" | "employee"; // You can expand this if you have more roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Element,
  requiredRole,
  ...rest
}) => {
  const userRole = localStorage.getItem("userRole"); // Assuming user role is stored in localStorage after login

  return userRole === requiredRole ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" replace /> // Redirect to an unauthorized page if the role does not match
  );
};

export default ProtectedRoute;
