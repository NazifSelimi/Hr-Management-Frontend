import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

interface Department {
  id: number;
  name: string;
}

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get<Department[]>("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        message.error("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, []);
  // if (loading) return <Spin />; 

  // if (!departments) return <p>Projects could not be loaded</p>;

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/departments/${id}`);
      setDepartments(departments.filter((dept) => dept.id !== id));
      message.success("Department deleted successfully.");
    } catch (error) {
      console.error("Error deleting department:", error);
      message.error("Failed to delete department.");
    }
  };


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
};

export default DepartmentsList;
