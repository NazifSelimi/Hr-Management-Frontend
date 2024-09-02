import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CreateProjectForm from "./CreateProjectForm";
import { Department } from "../types";
import { Spin, message } from "antd";

const CreateProjectView: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get<Department[]>("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (values: {
    name: string;
    description: string;
    department_ids: string[];
  }) => {
    try {
      const response = await axiosInstance.post("/projects", values);

      if (response.status === 201) {
        alert("Project created successfully!");
      } else {
        console.error("Unexpected response:", response);
        alert("Failed to create project.");
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred while creating the project.";
      alert(message);
    }
  };

  if (loading) return <Spin/>;

  if (error) return <p>{error}</p>;

  return (
    <CreateProjectForm departments={departments} onSubmit={handleSubmit} />
  );
};

export default CreateProjectView;