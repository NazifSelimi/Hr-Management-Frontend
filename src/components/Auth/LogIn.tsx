import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import axiosInstance from "../../services/axiosInstance"; // Pre-configured axios instance
import axios from "axios"; // For CSRF token fetching
import { useAuth } from "../../Context/AuthContext"; // Import useAuth hook
import "./LogIn.css";

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth(); // Access login function from AuthContext
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      // Fetch the CSRF token before attempting to log in
      await axios.get("http://localhost/sanctum/csrf-cookie", {
        withCredentials: true, // CSRF token is set in the cookies
      });

      // Perform the login request with the CSRF token included automatically
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

      const authToken = response.data.token;
      localStorage.setItem("authToken", authToken);

      if (response.status === 200) {
        const userResponse = await axiosInstance.get("/user", {
          withCredentials: true, // Ensure cookies are sent with this request too
        });

        const userRole = userResponse.data.role;
        const mustChangePassword = userResponse.data.must_change_password;

        localStorage.setItem("userRole", userRole);
        login(userRole, authToken); // Set auth context with role and token

        // Check if user needs to change password on first login
        if (mustChangePassword) {
          message.warning("You need to change your password before proceeding.");
          navigate("/update-password"); // Redirect to the password change page
        } else {
          // Navigate based on user role
          if (userRole === "admin") {
            navigate("/projects");
          } else if (userRole === "employee") {
            navigate("/employee");
          }
        }
      } else {
        message.error("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        message.error(`Error: ${error.response.data.message || "Login failed"}`);
      } else if (error.request) {
        message.error("No response from server. Please try again later.");
      } else {
        message.error("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false); // Ensure loading is disabled after the request is done
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
            <Input
              placeholder="Enter your email"
              disabled={loading} // Disable input when loading is true
            />
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
            <Input.Password
              placeholder="Enter your password"
              disabled={loading} // Disable password input when loading is true
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              loading={loading} // Button shows loading state
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

export default Login;
