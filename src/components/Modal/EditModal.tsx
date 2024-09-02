import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";

interface EditModalProps {
  open: boolean; // Updated from visible to open bacause of new antd update!
  title: string;
  initialValues: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  fields: {
    name: string;
    label: string;
    rules: { required: boolean; message: string }[];
    options?: { value: string; label: string }[];
  }[];
}

const EditModal: React.FC<EditModalProps> = ({
  open,
  title,
  initialValues,
  onCancel,
  onSubmit,
  fields,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const hasChanges = fields.some((field) => {
          if (field.name === "departments") {
            return (
              values[field.name].sort().toString() !==
              initialValues[field.name].sort().toString()
            );
          }
          return values[field.name] !== initialValues[field.name];
        });

        if (hasChanges) {
          onSubmit(values);
        } else {
          onCancel();
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal open={open} title={title} onCancel={onCancel} onOk={handleOk}>
      {" "}
      {/* Updated prop */}
      <Form form={form} layout="vertical">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
          >
            {field.name === "description" ? (
              <Input.TextArea rows={6} />
            ) : field.options ? (
              <Select mode="multiple">
                {field.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditModal;
