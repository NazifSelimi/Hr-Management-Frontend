import React, { useState } from "react";
import { message, Spin } from "antd";
import CreateDepartmentForm from "./CreateDepartmentform";

const CreateDepartmentView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDepartmentCreated = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      message.error("Failed to simulate API call."); // Error message for simulation
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Department</h2>
      {loading ? (
        <Spin tip="Creating departments...">
          <div style={{ minHeight: "100px" }} />
        </Spin>
      ) : (
        <CreateDepartmentForm onDepartmentCreated={handleDepartmentCreated} />
      )}
    </div>
  );
};

export default CreateDepartmentView;
