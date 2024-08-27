import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Department, User } from "../types";
import AssignUsersModal from "./AssignUsersModal";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null); // Add a state for tracking deletion

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

    fetchDepartments();
  }, []);

  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    setDeleting(id); // Set the id of the department being deleted
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
      setDeleting(null); // Reset the deleting state
    }
  };

  if (loading) return <Spin />;

  const handleAssignUsersClick = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setModalVisible(true);
  };

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
                <Button onClick={() => handleAssignUsersClick(record.id)}>
                  Assign Users
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteDepartment(record.id)}
                  disabled={deleting === record.id} // Disable the button if deleting
                >
                  {deleting === record.id ? <Spin size="small" /> : "Delete"}
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
      />
      {selectedDepartmentId && (
        <AssignUsersModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          departmentId={selectedDepartmentId}
        />
      )}
    </div>
  );
};

export default DepartmentsList;
