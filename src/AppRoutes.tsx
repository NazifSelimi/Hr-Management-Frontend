// src/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateProjectView from "./components/Projects/CreateProjectView";
import User from "./components/User/User";
import Projects from "./components/Projects/Projects";
import Employees from "./components/Employees/Employees";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateProjectView />} />
      <Route path="projects" element={<Projects />} />
      <Route path="/create-projects" element={<CreateProjectView />} />
      <Route path="/users" element={<User />} />
      <Route path="/employees" element={<Employees />} />
    </Routes>
  );
};

export default AppRoutes;
