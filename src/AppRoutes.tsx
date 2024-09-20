import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateProjectView from "./components/Admin/Projects/CreateProjectView";
import Projects from "./components/Admin/Projects/Projects";
import Employees from "./components/Admin/Employees/Employees";
import DepartmentsList from "./components/Admin/Departments/DepartmentsList";
import ProjectDetails from "./components/Admin/Projects/ProjetcDetails";
import UserDetails from "./components/Admin/User/UserDetails";
import LogIn from "./components/Auth/LogIn";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import CreateDepartmentView from "./components/Admin/Departments/CreateDepartmentView";
import RequestVacationView from "./components/Employee/Vacations/RequestVacationView";
import VacationReview from "./components/Admin/Vacation/VacationReview";
import VacationView from "./components/Admin/Vacation/VacationView";
import DepartmentDetails from "./components/Admin/Departments/DepartmentDetails";
import MyProjects from "./components/Employee/Projects/MyProjects";
import MyProjectDetails from "./components/Employee/Projects/MyProjectDetails";
import MyDepartments from "./components/Employee/Departments/MyDepartments";
import MyDepartmentDetails from "./components/Employee/Departments/MyDepartmentDetails";
import UserProfile from "./components/Employee/Profile/UserProfile";

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
        path="/my-projects"
        element={
          <ProtectedRoute element={MyProjects} requiredRole="employee" />
        }
      />
      <Route
        path="/my-departments"
        element={
          <ProtectedRoute element={MyDepartments} requiredRole="employee" />
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
      <Route
        path="/my-project/:id"
        element={
          <ProtectedRoute element={MyProjectDetails} requiredRole="employee" />
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute element={UserProfile} requiredRole="employee" />
        }
      />
      <Route
        path="/my-department/:id"
        element={
          <ProtectedRoute
            element={MyDepartmentDetails}
            requiredRole="employee"
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
