import React from "react";
import { Spin } from "antd";

const Spinner: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="default" />
    </div>
  );
};

export default Spinner;
