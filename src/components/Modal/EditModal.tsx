// src/components/EditModal/EditModal.tsx
import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

interface EditModalProps {
  visible: boolean;
  title: string;
  initialValues: Record<string, any>;
  onCancel: () => void;
  onSubmit: (values: Record<string, any>) => void;
  fields: Array<{
    name: string;
    label: string;
    rules?: any[];
    options?: Array<{ value: string; label: string }>; // Add options for dropdowns
  }>;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  title,
  initialValues,
  onCancel,
  onSubmit,
  fields,
}) => {
  return (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
      <Form initialValues={initialValues} onFinish={onSubmit}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
          >
            {field.options ? (
              <Select options={field.options} /> // Use Select when options are provided
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
