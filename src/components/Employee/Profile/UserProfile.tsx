import React, { useState, useEffect } from "react";
import { Button, Input, Form, message } from "antd";
import Spinner from "../../Spinner";
import axiosInstance from "../../../api/axiosInstance";
import { User } from "../../types";
import UserProfileForm from "./UserProfileForm";

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
        <UserProfileForm onSubmit={handleSave} user={user} />
      ) : (
        <Button type="primary" onClick={() => setEditing(true)}>
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
