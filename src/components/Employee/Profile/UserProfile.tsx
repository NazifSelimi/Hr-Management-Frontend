import React, { useState, useEffect } from "react";
import { Button, Input, Form, message } from "antd";
import Spinner from "../../Spinner";
import axiosInstance from "../../../api/axiosInstance";
import { User } from "../../types";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/profile`);
        setUser(response.data);
      } catch (error: any) {
        console.error("Error fetching profile details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async (values: any) => {
    try {
      if (user) {
        await axiosInstance.put(`/profile/update/${user.id}`, values);

        setUser((prevUser) => ({
          ...prevUser,
          ...values,
        }));

        setEditing(false);
        message.success("Your profile has been updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error("Something went wrong while updating your profile");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      className="profile-page"
      style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1>
        {user?.first_name} {user?.last_name}
      </h1>
      <p>
        <strong>Days Off Remaining:</strong> {user?.days_off}
      </p>

      {editing ? (
        <Form
          initialValues={user || undefined}
          onFinish={handleSave}
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
      ) : (
        <Button type="primary" onClick={() => setEditing(true)}>
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
