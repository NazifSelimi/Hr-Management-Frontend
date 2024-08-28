import React from "react";
import { Button } from "antd";
import { useAuth } from "../../Context/AuthContext";

const HeaderComponent: React.FC = () => {
  const { isLoggedIn, logout } = useAuth(); // Get the logout function

  return (
    <header>
      <h1>App Name</h1>
      {isLoggedIn && (
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      )}
    </header>
  );
};

export default HeaderComponent;
