import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { User, Department } from "../types";

interface AssignUsersModalProps {
  visible: boolean;
  onClose: () => void;
  departmentId: string;
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({ visible, onClose, departmentId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        message.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssign = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/departments/${departmentId}/assign-users`, { userIds: selectedUsers });
      message.success("Users assigned successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error assigning users:", error);
      message.error("Failed to assign users.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Modal
      title="Assign Users"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="assign" type="primary" onClick={handleAssign}>
          Assign
        </Button>,
      ]}
    >
      <Select
        mode="multiple"
        placeholder="Select users"
        style={{ width: "100%" }}
        onChange={(value) => setSelectedUsers(value as string[])}
      >
        {users.map((user) => (
          <Select.Option key={user.id} value={user.id}>
            {user.first_name} {user.last_name}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AssignUsersModal;
