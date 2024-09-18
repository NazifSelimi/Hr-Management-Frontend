import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateProjectView from "./components/Projects/CreateProjectView";
import Projects from "./components/Projects/Projects";
import Employees from "./components/Employees/Employees";
import DepartmentsList from "./components/Departments/DepartmentsList"
import ProjectDetails from "./components/Projects/ProjetcDetails";
import UserDetails from "./components/User/UserDetails";
import LogIn from "./components/Auth/LogIn";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import CreateDepartmentView from "./components/Departments/CreateDepartmentView";
import RequestVacationView from "./components/Vacation/RequestVacationView";
import VacationReview from "./components/Vacation/VacationReview";
import VacationView from "./components/Vacation/VacationView";
import DepartmentDetails from "./components/Departments/DepartmentDetails";

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
        element={
          <ProtectedRoute element={DepartmentsList} requiredRole="admin" />
        }
      />
      <Route
        path="/departments/:id"
        element={
          <ProtectedRoute element={DepartmentDetails} requiredRole="admin" />
        }
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
      {/* Protected Employee Routes */}
      <Route
        path="/request-vacation"
        element={
          <ProtectedRoute
            element={RequestVacationView}
            requiredRole="employee"
          />
        }
      />
      <Route
        path="/vacations"
        element={
          <ProtectedRoute element={VacationView} requiredRole="employee" />
        }
      />
      <Route
        path="/review-vacations"
        element={
          <ProtectedRoute element={VacationReview} requiredRole="admin" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
