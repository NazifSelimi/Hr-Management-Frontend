import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Department, Project } from "../types";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateProjectView: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error: any) {
        console.error("Error fetching departments:", error?.response || error);
        message.error("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await axiosInstance.post("/projects", {
        name: values.name,
        description: values.description,
        department_ids: values.departments,
      });
      message.success("Project created successfully.");
      navigate("/projects");
    } catch (error: any) {
      console.error("Error creating project:", error?.response || error);
      message.error("Failed to create project: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Create Project</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: "Please enter project name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter project description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="departments"
          label="Departments"
          rules={[{ required: true, message: "Please select at least one department" }]}
        >
          <Select mode="multiple" placeholder="Select departments">
            {departments.map(dept => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Project
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProjectView;
