import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../apiService";

const ChangePassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Make the request to update the password
      const response = await updatePassword(
        values.password,
        values.password_confirmation
      );

      message.success(response.data.message);
      navigate("/dashboard"); // Redirect to dashboard after successful password update
    } catch (error: any) {
      message.error("Failed to update password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h2>Change Password</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            { required: true, message: "Please enter your new password" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label="Confirm Password"
          rules={[{ required: true, message: "Please confirm your password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
