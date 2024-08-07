import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Nav 1",
    },
    {
      key: "2",
      label: "Nav 2",
    },
    {
      key: "3",
      label: "Nav 3",
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", paddingLeft: "24px" }}
      >
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
      </div>
      <Menu
        mode="horizontal"
        style={{ lineHeight: "64px" }}
        items={menuItems}
      />
    </Header>
  );
};

export default HeaderComponent;
