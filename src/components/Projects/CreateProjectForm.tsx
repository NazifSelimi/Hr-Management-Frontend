import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";

interface Department {
  id: number;
  name: string;
}

interface CreateProjectFormProps {
  departments: Department[];
  onSubmit: (values: {
    name: string;
    description: string;
    department_id: number;
  }) => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  departments,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSubmit}>
      <Form.Item
        name="name"
        label="Project Name"
        rules={[{ required: true, message: "Please enter the project name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: "Please enter the project description" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="department_id"
        label="Department"
        rules={[{ required: true, message: "Please select a department" }]}
      >
        <Select placeholder="Select a department">
          {departments.map((dept) => (
            <Select.Option key={dept.id} value={dept.id}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Project
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProjectForm;
