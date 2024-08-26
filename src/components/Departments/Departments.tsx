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
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button onClick={() => handleAssignUsersClick(record.id)}>
                  Assign Users
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
