import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import axiosInstance from "../../../services/axiosInstance";
import { Department } from "../../types";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateProjectView: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error: any) {
        console.error("Error fetching departments:", error?.response || error);
        message.error(error.response?.data?.message || "Failed to fetch departments.");
      } finally {
        setLoading(false);
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
      message.error(error.response?.data?.message || "Failed to create project.");
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
          rules={[
            { required: true, message: "Please enter project description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="departments"
          label="Departments"
          rules={[
            {
              required: true,
              message: "Please select at least one department",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select departments"
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : "No data"}
          >
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Project
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProjectView;
