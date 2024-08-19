import React, { useState } from "react";
import { message, Spin } from "antd";
import CreateDepartmentForm from "./CreateDepartmentform";
const CreateDepartmentView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDepartmentCreated = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      message.success("Department created successfully.");
    } catch (error) {
      message.error("Failed to create department.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Department</h2>
      {loading ? (
        <Spin tip="Creating departments...">
          <div style={{ minHeight: '100px' }} />
        </Spin>
      ) : (
        <CreateDepartmentForm onDepartmentCreated={handleDepartmentCreated} />
      )}
    </div>
  );
};

export default CreateDepartmentView;
