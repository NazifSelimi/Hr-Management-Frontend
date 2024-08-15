// src/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateProjectView from "./components/Projects/CreateProjectView";
import User from "./components/User/User";
import Projects from "./components/Projects/Projects";
import Employees from "./components/Employees/Employees";
import Departments from "./components/Departments/Departments";
import ProjectDetails from "./components/Projects/ProjectDetails";
import UserDetails from "./components/User/UserDetails";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<login />} /> */}
      <Route path="/create-proejct" element={<CreateProjectView />} />
      <Route path="projects" element={<Projects />} />
      <Route path="/create-projects" element={<CreateProjectView />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/employees" element={<Employees />} />
    </Routes>
  );
};

export default AppRoutes;
