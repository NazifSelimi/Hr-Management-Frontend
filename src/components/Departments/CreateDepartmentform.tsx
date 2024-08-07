// src/components/Departments/DepartmentForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface DepartmentFormProps {
  initialValues?: { id?: number; name: string };
  onSuccess: () => void;
}

const CreateDepartmentForm: React.FC<DepartmentFormProps> = ({
  initialValues,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    try {
      setLoading(true);
      if (initialValues?.id) {
        // Update department
        await axiosInstance.put(`/api/departments/${initialValues.id}`, values);
        message.success("Department updated successfully.");
      } else {
        // Create new department
        await axiosInstance.post("/api/departments", values);
        message.success("Department created successfully.");
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Error saving department:", error);
      message.error("Failed to save department.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={initialValues}>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: "Please enter the department name" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues?.id ? "Update" : "Create"} Department
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateDepartmentForm;
