// src/components/Departments/DepartmentsList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { getEmployees } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  role: string;
  days_off: number;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
        setLoading(false);
      } catch (err) {}
    };

    fetchEmployees();
  }, []); // Empty dependency array ensures this runs once on mount
  if (loading) return <Spin />; // Show loading spinner while fetching

  if (!employees) return <p>Employes could not be loaded</p>; // Display message if project is not found
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/user-delete/${id}`).then((response) => {
        console.log("Data successfully deleted");
      });
      setEmployees(employees.filter((emp) => emp.id !== id));

      message.success("Employee deleted successfully.");
    } catch (error) {
      console.error("Error deleting employee:", error);
      message.error("Failed to delete employee.");
    }
  };

  return (
    <div>
      <h2>Employees</h2>
      <Table
        dataSource={employees}
        columns={[
          {
            title: "Name",
            dataIndex: "first_name",
            key: "first_name",
          },
          {
            title: "Name",
            dataIndex: "last_name",
            key: "first_name",
          },
          {
            title: "E-mail",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Days Left",
            dataIndex: "days_off",
            key: "address",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button onClick={() => navigate(`/users/${record.id}`)}>
                  View
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
      />
    </div>
  );
};

export default Employees;
