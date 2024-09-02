import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom"; // Move navigation to the component level
import { SearchOutlined } from "@ant-design/icons";
import SearchModal from "../Search/SearchModal";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
        <Button
          icon={<SearchOutlined />}
          onClick={() => setIsSearchModalOpen(true)}
        >
          Search
        </Button>
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
      {/* <Menu mode="horizontal" style={{ lineHeight: "64px" }} /> */}
      <div style={{ paddingRight: "24px" }}>
        {isLoggedIn ? (
          <>
            <Button type="primary" onClick={handleLogout}>
              <UserOutlined />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" href="/login">
              <UserOutlined />
              Login
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
