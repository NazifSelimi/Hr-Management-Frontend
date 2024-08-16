import React from "react";
import "./App.css";
import { Layout } from "antd"; // Import only the necessary components
import Sidebar from "./components/Sidebar/Sidebar";
import HeaderComponent from "./components/Header/Header";
import AppRoutes from "./AppRoutes"; // Ensure AppRoutes is imported correctly
import { DepartmentProvider } from "./DepartmentContext";

const App: React.FC = () => {
  return (
    <DepartmentProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar /> {/* Sidebar is outside of the content layout */}
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <HeaderComponent />
          <Layout.Content
            style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <AppRoutes />{" "}
              {/* Place AppRoutes here to render routed components */}
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </DepartmentProvider>
  );
};

export default App;
