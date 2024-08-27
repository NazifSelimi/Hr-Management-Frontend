import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get<User[]>("/employees");
        setEmployees(response.data);
      } catch (error: any) {
        console.error("Error fetching employees:", error?.response || error);
        message.error("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <Spin />;

  if (employees.length === 0) return <p>No employees found.</p>;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axiosInstance.delete(`/employees/${id}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );
      message.success("Employee deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting employee:", error?.response || error);
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
            title: "First Name",
            dataIndex: "first_name",
            key: "first_name",
          },
          {
            title: "Last Name",
            dataIndex: "last_name",
            key: "last_name",
          },
          {
            title: "E-mail",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Days Left",
            dataIndex: "days_off",
            key: "days_off",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button onClick={() => navigate(`/users/${record.id}`)}>
                  View
                </Button>
                <Button type="link" danger onClick={() => handleDelete(record.id)}>
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
