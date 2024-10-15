import React from "react";
import { Form, Input, Button } from "antd";
import { User } from "../../types";

interface VacationFormProps {
  onSubmit: (values: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    days_off: number;
    role: string;
  }) => void;
  user: User | null;
}

const UserProfileForm: React.FC<VacationFormProps> = ({ onSubmit, user }) => {
  // const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
    });
  };

  return (
    <Form
      initialValues={user || undefined}
      onFinish={handleFinish}
      layout="vertical"
    >
      <Form.Item label="First Name" name="first_name">
        <Input />
      </Form.Item>
      <Form.Item label="Last Name" name="last_name">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone">
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>
      <Form.Item label="City" name="city">
        <Input />
      </Form.Item>
      <Form.Item label="Days Off" name="days_off">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Role" name="role">
        <Input disabled />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserProfileForm;
