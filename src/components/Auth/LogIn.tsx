import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import axiosInstance from "../../api/axiosInstance"; // Pre-configured axios instance
import axios from "axios"; // For CSRF token fetching
import "./SignIn.css";

const { Title } = Typography;

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      // Fetch the CSRF token before attempting to log in
      await axios.get("http://localhost/sanctum/csrf-cookie", {
        withCredentials: true, // Ensure the CSRF token is set in the cookies
      });

      // Now perform the login request with the CSRF token included automatically
      const response = await axiosInstance.post(
        "/login",
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true, // Ensure credentials are sent with the login request
        }
      );

      // Check for a successful response
      if (response.status === 200) {
        message.success("Login successful!");

        // Fetch user data (optional)
        const userResponse = await axiosInstance.get("/user", {
          withCredentials: true, // Ensure cookies are sent with this request too
        });

        const userRole = userResponse.data.role;
        localStorage.setItem("userRole", userRole);
        console.log(userRole);

        // Navigate to the desired page
        navigate("/projects");
      } else {
        message.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please check the form and try again.");
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <Title level={2} className="signin-title">
          Sign In
        </Title>
        <Form
          name="signin"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              loading={loading}
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
