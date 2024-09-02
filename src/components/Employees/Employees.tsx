import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

interface EmployeesProps {
  data?: User[];
  onClose?: () => void;
}

const Employees: React.FC<EmployeesProps> = ({ data, onClose }) => {
  const [employees, setEmployees] = useState<User[]>(data || []);
  const [loading, setLoading] = useState<boolean>(!data);
  const navigate = useNavigate();

  useEffect(() => {
    if (!data) {
      const fetchEmployees = async () => {
        try {
          const { data } = await axiosInstance.get<User[]>("/employees");
          setEmployees(data);
        } catch (error: any) {
          console.error("Error fetching employees:", error);
          message.error("Failed to load employees.");
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axiosInstance.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
      message.success("Employee deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      message.error("Failed to delete employee.");
    }
  };

  const handleView = (id: string) => {
    navigate(`/users/${id}`);
    if (onClose) onClose();
  };

  return (
    <div>
      <h2>Employees</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={employees}
          columns={[
            { title: "First Name", dataIndex: "first_name", key: "first_name" },
            { title: "Last Name", dataIndex: "last_name", key: "last_name" },
            { title: "E-mail", dataIndex: "email", key: "email" },
            { title: "Days Left", dataIndex: "days_off", key: "days_off" },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => (
                <>
                  <Button onClick={() => handleView(record.id)}>View</Button>
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
      )}
    </div>
  );
};

export default Employees;
