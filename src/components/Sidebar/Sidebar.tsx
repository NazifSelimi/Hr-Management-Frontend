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
      label: <Link to="/users">Users</Link>,
      children: [
        { key: "1", label: "Tom" },
        { key: "2", label: "Bill" },
        { key: "3", label: "Alex" },
      ],
    },
    {
      key: "sub2",
      icon: <LaptopOutlined />,
      label: "Team",
      children: [
        { key: "4", label: "Team 1" },
        { key: "5", label: "Team 2" },
      ],
    },
    {
      key: "sub3",
      icon: <NotificationOutlined />,
      label: "Files",
      children: [
        { key: "6", label: "File 1" },
        { key: "7", label: "File 2" },
      ],
    },
    {
      key: "sub4",
      icon: <NotificationOutlined />,
      label: "Projects",
      children: [
        { key: "8", label: <Link to="/projects">Projects</Link> },
        {
          key: "9",
          label: <Link to="/create-projects">Create a Project</Link>,
        },
      ],
    },
    {
      key: "sub5",
      icon: <NotificationOutlined />,
      label: "Employees",
      children: [
        { key: "8", label: <Link to="/employees">Employees</Link> },
        {
          key: "9",
          label: <Link to="/create-projects">Create a Project</Link>,
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
