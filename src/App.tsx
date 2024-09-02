import React from "react";
import "./App.css";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar/Sidebar";
import HeaderComponent from "./components/Header/Header";
import AppRoutes from "./AppRoutes";
import { useAuth } from "./Context/AuthContext"; // Remove AuthProvider import
import { SearchProvider } from "./Context/SearchContext";

const App: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Get the isLoggedIn status from AuthContext

  return (
    <SearchProvider>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Conditionally render the Sidebar if the user is logged in */}
        {isLoggedIn && <Sidebar />}

        <Layout
          className="site-layout"
          style={{ marginLeft: isLoggedIn ? 200 : 0 }}
        >
          <HeaderComponent />
          <Layout.Content
            style={{ margin: "24px 16px 0", overflow: "initial" }}
          >
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <AppRoutes />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </SearchProvider>
  );
};

export default App;
