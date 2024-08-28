import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Users",
      children: [
        { key: "1", label: <Link to="/employees">Employees</Link> },
        { key: "2", label: "Bill" },
        { key: "3", label: "Alex" },
      ],
    },
    {
      key: "sub2",
      icon: <NotificationOutlined />,
      label: "Projects",
      children: [
        { key: "4", label: <Link to="/projects">Projects</Link> },
        {
          key: "5",
          label: <Link to="/create-projects">Create Project</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <NotificationOutlined />,
      label: "Departments",
      children: [
        { key: "6", label: <Link to="/departments">View Departments</Link> },
        {
          key: "7",
          label: <Link to="/create-department">Create Department</Link>,
        },
      ],
    },
    {
      key: "sub4",
      icon: <NotificationOutlined />,
      label: "Vacations",
      children: [
        { key: "8", label: <Link to="/">Vacations</Link> },
        {
          key: "9",
          label: <Link to="/">Request Vacation</Link>,
        },
        {
          key: "10",
          label: <Link to="/login">Log In</Link>,
        },
      ],
    },
  ];

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
