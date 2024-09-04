import React from "react";
import { Form, Input, Button } from "antd";
import DepartmentSelector from "../Departments/DepartmentSelector";
import { Department } from "../types";

interface CreateProjectFormProps {
  departments: Department[];
  onSubmit: (values: {
    name: string;
    description: string;
    department_ids: string[];
  }) => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  departments,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      department_ids: values.department_ids.map((id: string) => id),
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={{ department_ids: [] }}
      layout="vertical"
    >
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
        name="department_ids"
        label="Departments"
        rules={[
          { required: true, message: "Please select at least one department" },
        ]}
      >
        <DepartmentSelector
          departments={departments}
          selectedDepartmentIds={form.getFieldValue("department_ids") || []}
          onChange={(selectedIds: string[]) =>
            form.setFieldsValue({ department_ids: selectedIds })
          }
        />
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
