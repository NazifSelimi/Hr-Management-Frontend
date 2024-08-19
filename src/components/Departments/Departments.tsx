import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface Department {
  id: number;
  name: string;
  description: string; //added the description in this interface too
}

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading
  const [deleting, setDeleting] = useState<boolean>(false); // State to track deletion process

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<Department[]>("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        message.error("Failed to fetch departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/departments/${id}`);
      setDepartments(departments.filter((dept) => dept.id !== id));
      message.success("Department deleted successfully.");
    } catch (error) {
      console.error("Error deleting department:", error);
      message.error("Failed to delete department.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h2>Departments</h2>
      {loading ? (
        <Spin tip="Loading departments...">
          <div style={{ minHeight: '100px' }} />
        </Spin>
      ) : (
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
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                  loading={deleting} // Spinner on delete button
                >
                  Delete
                </Button>
              ),
            },
          ]}
          rowKey="id"
        />
      )}
    </div>
  );
  
};

export default DepartmentsList;
