import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message, Spin, Input } from "antd";
import axiosInstance from "../../../services/axiosInstance";
import { User } from "../../types";

interface AssignUsersModalProps {
  visible: boolean;
  onClose: () => void;
  department?: string;
  project?: string;
  // onSubmit: (values: { users: { id: string; position: string }[] }) => void;
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({
  visible,
  onClose,
  department,
  project,
  // onSubmit,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; position: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (visible) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get("/users");
          setUsers(response.data);
          // console.log(response.data)
        } catch (error: any) {
          console.error("Error fetching users:", error);
          message.error(error.response?.data?.message || "Failed to load users.");
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [visible]);

  const handleUserSelect = (selectedValues: string[]) => {
    const updatedSelectedUsers = selectedValues.map((value) => {
      const existingUser = selectedUsers.find((user) => user.id === value);
      return existingUser || { id: value, position: "" };
    });
    setSelectedUsers(updatedSelectedUsers);
  };

  const handlePositionChange = (userId: string, position: string) => {
    setSelectedUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, position } : user))
    );
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      if (department) {
        await axiosInstance.post(`/assign-users-departments/${department}`, {
          users: selectedUsers,
        });
      } else if (project) {
        await axiosInstance.post(`/assign-users-projects/${project}`, {
          users: selectedUsers.map((user) => ({
            id: user.id,
            role: user.position, 
          })),
        } 
      )
      }

      message.success("Users and positions assigned successfully!");
        onClose();
      } catch (error: any) {
        console.error("Error assigning users:", error);
        message.error(error.response?.data?.message || "Failed to assign users.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal
        title="Assign Users"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose} disabled={loading}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={handleAssign}
            disabled={selectedUsers.some((user) => !user.position) || loading}
          >
            Assign
          </Button>,
        ]}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Select
              mode="multiple"
              placeholder="Select users"
              style={{ width: "100%" }}
              showSearch
              onChange={handleUserSelect}
              filterOption={(input, option) =>
                option?.children
                  ?.toString()
                  .toLowerCase()
                  .includes(input.toLowerCase()) ?? false
              }
              value={selectedUsers.map((user) => user.id)}
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </Select.Option>
              ))}
            </Select>

            {selectedUsers.map((user) => (
              <div key={user.id} style={{ marginTop: 10 }}>
                <span>
                  {users.find((u) => u.id === user.id)?.first_name}{" "}
                  {users.find((u) => u.id === user.id)?.last_name}
                </span>
                <Input
                  placeholder="Enter position"
                  value={user.position}
                  onChange={(e) => handlePositionChange(user.id, e.target.value)}
                  style={{ marginLeft: 10, width: "60%" }}
                />
              </div>
            ))}
          </>
        )}
      </Modal>
    );
  };

  export default AssignUsersModal;
