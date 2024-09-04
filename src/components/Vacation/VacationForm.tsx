import React from "react";
import { Form, Input, Button } from "antd";

interface VacationFormProps {
  onSubmit: (values: {
    user_id: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    type: string;
    status: boolean;
  }) => void;
}

const VacationForm: React.FC<VacationFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
    });
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        name="start_date"
        label="Start Date"
        rules={[{ required: true, message: "Please enter the start date" }]}
      >
        <Input type="date" />
      </Form.Item>
      <Form.Item
        name="end_date"
        label="End Date"
        rules={[{ required: true, message: "Please enter the end date" }]}
      >
        <Input type="date" />
      </Form.Item>
      <Form.Item
        name="reason"
        label="Reason"
        rules={[{ required: true, message: "Please enter your reason" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="type"
        label="Type"
        rules={[
          { required: true, message: "Please enter the type of vacation" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Request Vacation
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VacationForm;
