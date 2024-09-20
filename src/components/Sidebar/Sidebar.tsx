import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ApartmentOutlined,
  ProjectOutlined,
  CarOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { userRole } = useAuth(); // Get userRole from AuthContext

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Admin-specific menu items
  const adminMenuItems = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Users",
      children: [{ key: "1", label: <Link to="/employees">Employees</Link> }],
    },
    {
      key: "sub2",
      icon: <ProjectOutlined />,
      label: "Projects",
      children: [
        { key: "2", label: <Link to="/projects">View Projects</Link> },
        {
          key: "3",
          label: <Link to="/create-projects">Create Project</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <ApartmentOutlined />,
      label: "Departments",
      children: [
        { key: "4", label: <Link to="/departments">View Departments</Link> },
        {
          key: "5",
          label: <Link to="/create-department">Create Department</Link>,
        },
      ],
    },
    {
      key: "sub4",
      icon: <CarOutlined />,
      label: "Vacations",
      children: [
        { key: "6", label: <Link to="/review-vacations">Vacations</Link> },
        {
          key: "7",
          label: <Link to="/login">Log In</Link>,
        },
      ],
    },
  ];

  // Employee-specific menu items
  const employeeMenuItems = [
    {
      key: "sub1",
      icon: <ProjectOutlined />,
      label: "Projects",
      children: [
        {
          key: "1",
          label: <Link to="/my-projects">View my Projects</Link>,
        },
      ],
    },
    {
      key: "sub2",
      icon: <CarOutlined />,
      label: "Vacations",
      children: [
        { key: "2", label: <Link to="/vacations">My Vacations</Link> },
        {
          key: "3",
          label: <Link to="/request-vacation">Request Vacation</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <ApartmentOutlined />,
      label: "Departments",
      children: [
        {
          key: "4",
          label: <Link to="/my-departments">View my Departments</Link>,
        },
      ],
    },
    {
      key: "sub4",
      icon: <UserOutlined />,
      label: "Profile",
      children: [
        {
          key: "5",
          label: <Link to="/profile">My Profile</Link>,
        },
      ],
    },
  ];

  // Render different menu items based on user role
  const menuItems = userRole === "admin" ? adminMenuItems : employeeMenuItems;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      theme="light"
      style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0 }}
    >
      <div
        className="logo"
        style={{ padding: 24, fontSize: 24, height: "32px", color: "#1890ff" }}
      >
        Logo
      </div>
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        theme="light"
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
