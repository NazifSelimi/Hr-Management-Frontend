import React from "react";
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
  const [loading, setLoading] = React.useState<boolean>(false); // Track loading state

  const handleSubmit = async (values: DepartmentFormValues) => {
    setLoading(true);
    try {
      await axiosInstance.post("/departments", values);
      message.success("Department created successfully.");
      form.resetFields();
      onDepartmentCreated();
    } catch (error) {
      console.error("Error creating department:", error);
      message.error("Failed to create department.");
    } finally {
      setLoading(false);
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
