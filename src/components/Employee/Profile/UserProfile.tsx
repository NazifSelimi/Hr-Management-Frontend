import React, { useState, useEffect } from "react";
import { Button, Input, Form, message } from "antd";
import Spinner from "../../Spinner";
import axiosInstance from "../../../api/axiosInstance";
import { User } from "../../types";
import UserProfileForm from "./UserProfileForm";
import { updateUserProfile, fetchUserProfile } from "../../../apiService";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setUser(response);
      } catch (error: any) {
        console.error("Error fetching profile details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (values: any) => {
    try {
      if (user) {
        const response = await updateUserProfile(user.id, values);
        setUser((prevUser) => ({
          ...prevUser,
          ...values,
        }));

        setEditing(false);
        message.success(
          response.data.message || "Your profile has been updated successfully."
        );
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error(
        error.data.message || "Something went wrong while updating your profile"
      );
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
