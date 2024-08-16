import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface DepartmentFormValues {
  name: string;
  description: string;
}

interface CreateDepartmentFormProps {
  onDepartmentCreated: () => void;
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({ onDepartmentCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleSubmit = async (values: DepartmentFormValues) => {
    setLoading(true); // Start loading spinner
    try {
      await axiosInstance.post("/departments", values);
      message.success("Department created successfully.");
      form.resetFields(); // Reset form fields after successful submission
      onDepartmentCreated(); // Notify the parent component that the department was created
    } catch (error) {
      console.error("Error creating department:", error);
      message.error("Failed to create department.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the department name." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the department description." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CreateDepartmentForm;
