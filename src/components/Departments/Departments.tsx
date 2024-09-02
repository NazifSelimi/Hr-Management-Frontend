import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Department, User } from "../types";
import AssignUsersModal from "./AssignUsersModal";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error: any) {
        console.error("Error fetching departments:", error);
        message.error("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users"); // Adjust endpoint if necessary
        setUsers(response.data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        message.error("Failed to load users.");
      }
    };

    fetchDepartments();
    fetchUsers();
  }, []);

  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    setDeleting(id);
    try {
      await axiosInstance.delete(`/departments/${id}`);
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.id !== id)
      );
      message.success("Department deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting department:", error);
      message.error("Failed to delete department.");
    } finally {
      setDeleting(null);
    }
  };

  const handleModalOpen = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDepartment(null);
  };

  const handleAssignUsers = (values: {
    departments: { id: string; position: string }[];
  }) => {
    // Handle any additional logic after successful assignment
    console.log("Users assigned:", values);
    handleModalClose();
  };

  if (loading) return <Spin />;

  return (
    <div>
      <Table
        dataSource={departments}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => handleModalOpen(record)}>
                  Assign Users
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteDepartment(record.id)}
                  disabled={deleting === record.id}
                >
                  {deleting === record.id ? <Spin size="small" /> : "Delete"}
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
      />
      {selectedDepartment && (
        <AssignUsersModal
          visible={isModalVisible}
          onCancel={handleModalClose}
          onSubmit={handleAssignUsers}
          users={users}
          department={selectedDepartment.id}
        />
      )}
    </div>
  );
};

export default DepartmentsList;
