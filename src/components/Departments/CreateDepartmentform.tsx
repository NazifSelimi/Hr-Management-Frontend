import React from "react";
import { Form, Input, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import FormItem from "antd/es/form/FormItem";

interface DepartmentFormValues {
  id: number;
  name: string;
}

interface CreateDepartmentFormProps {
  onClose: () => void;
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  

  const handleSubmit = async (values: DepartmentFormValues) => {
    try {
      await axiosInstance.post("/departments", values);
      message.success("Department created successfully.");
      form.resetFields(); // Reset form fields after successful submission
      onClose(); // Call onClose to hide the form
    } catch (error) {
      console.error("Error creating department:", error);
      message.error("Failed to create department.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the department name." }]}
      >
        <Input />
      </Form.Item>
      <FormItem
      label="Description"
      name="description"
      rules={[{ required: true, message: "Please enter the department description." }]}
      >
        <Input/>
      </FormItem>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button type="default" onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
  
};

export default CreateDepartmentForm;
