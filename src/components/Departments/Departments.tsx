// src/components/Departments/DepartmentsList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface Department {
  id: number;
  name: string;
}

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get<Department[]>(
          "/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        message.error("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      <h2>Departments</h2>
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
              <Button
                type="link"
                danger
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </Button>
            ),
          },
        ]}
        rowKey="id"
      />
    </div>
  );

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/departments/${id}`);
      setDepartments(departments.filter((dept) => dept.id !== id));
      message.success("Department deleted successfully.");
    } catch (error) {
      console.error("Error deleting department:", error);
      message.error("Failed to delete department.");
    }
  };
};

export default Departments;
