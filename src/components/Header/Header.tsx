import React from "react";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom"; // Move navigation to the component level

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Ensure logout is completed
    navigate("/login"); // Redirect to login after logging out
  };

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
      <Menu mode="horizontal" style={{ lineHeight: "64px" }} />
      <div style={{ paddingRight: "24px" }}>
        {isLoggedIn ? (
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button type="primary" href="/login">
            Login
          </Button>
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
