import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateProjectView from "./components/Projects/CreateProjectView";
import Projects from "./components/Projects/Projects";
import Employees from "./components/Employees/Employees";
import Departments from "./components/Departments/Departments";
import ProjectDetails from "./components/Projects/ProjectDetails";
import UserDetails from "./components/User/UserDetails";
import LogIn from "./components/Auth/LogIn";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import CreateDepartmentView from "./components/Departments/CreateDepartamentView";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LogIn />} />

      {/* Protected Admin Routes */}
      <Route
        path="/projects"
        element={<ProtectedRoute element={Projects} requiredRole="admin" />}
      />
      <Route
        path="/create-projects"
        element={
          <ProtectedRoute element={CreateProjectView} requiredRole="admin" />
        }
      />
      <Route
        path="/departments"
        element={<ProtectedRoute element={Departments} requiredRole="admin" />}
      />
      <Route
        path="/create-department"
        element={
          <ProtectedRoute element={CreateDepartmentView} requiredRole="admin" />
        }
      />
      <Route
        path="/project/:id"
        element={
          <ProtectedRoute element={ProjectDetails} requiredRole="admin" />
        }
      />
      <Route
        path="/users/:id"
        element={<ProtectedRoute element={UserDetails} requiredRole="admin" />}
      />

      <Route
        path="/employees"
        element={<ProtectedRoute element={Employees} requiredRole="admin" />}
      />
    </Routes>
    /* Protected Employee Routes */
  );
};

export default AppRoutes;
