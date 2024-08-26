import React from "react";
import { Form, Input, Button } from "antd";

interface CreateDepartmentFormProps {
  onSubmit: (values: { name: string; description: string }) => void;
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({ onSubmit }) => {
  return (
    <div>
      <h2>Create Department</h2>
      <Form
        name="create_department"
        onFinish={onSubmit}
        initialValues={{ name: "", description: "" }}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Department Name"
          rules={[{ required: true, message: "Please input the department name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Department
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateDepartmentForm;
