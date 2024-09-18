import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CreateDepartmentForm from "./CreateDepartmentForm";
import { Spin, message } from "antd";

const CreateDepartmentView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/departments", values);
      if (response.status === 201) {
        message.success("Department created successfully!");
      } else {
        console.error("Unexpected response:", response);
        message.error("Failed to create department.");
      }
    } catch (error: any) {
      console.error("Error creating department:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while creating the department.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <CreateDepartmentForm onSubmit={handleSubmit} />
    </Spin>
  );
};

export default CreateDepartmentView;
