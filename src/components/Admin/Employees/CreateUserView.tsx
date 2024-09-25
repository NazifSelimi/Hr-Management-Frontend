import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import axiosInstance from "../../../api/axiosInstance";
import { Department } from "../../types";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";
import { createEmployee } from "../../../apiService";
import CreateUserForm from "./CreateUserForm";

const { Option } = Select;

const CreateUserView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await createEmployee(values); // Assuming createEmployee returns the response from the API

      // Access the message from the backend response
      message.success(response.data.message || "User created successfully.");
    } catch (error: any) {
      console.error("Error creating user:", error?.response || error);

      // Access error message from backend response, default to error.message if unavailable
      const errorMessage =
        error?.response?.data?.error ||
        error.message ||
        "Failed to create user.";
      message.error("Failed to create user: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Create User</h2>
      <CreateUserForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateUserView;
