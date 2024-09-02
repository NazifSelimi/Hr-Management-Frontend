import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import AssignDepartmentsModal from "./AssignDepartmentModal";

<<<<<<< HEAD
interface EmployeesProps {
  data?: User[];
  onClose?: () => void;
}

const Employees: React.FC<EmployeesProps> = ({ data, onClose }) => {
  const [employees, setEmployees] = useState<User[]>(data || []);
  const [loading, setLoading] = useState<boolean>(!data);
=======
const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
>>>>>>> 8b62c6ab812bf242b987061d00bb2f7bac057daf
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

<<<<<<< HEAD
  const handleView = (id: string) => {
    navigate(`/users/${id}`);
    if (onClose) onClose();
=======
  const handleAssignDepartments = (employee: User) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true); // Show the modal
  };

  const handleModalSubmit = async (
    assignedDepartments: { departmentId: number; position: string }[]
  ) => {
    try {
      // Make a POST request to the Laravel endpoint to assign departments
      await axiosInstance.post(`/assign-departments/${selectedEmployee?.id}`, {
        departments: assignedDepartments,
      });
      message.success("Departments assigned successfully.");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error assigning departments:", error);
      message.error("Failed to assign departments.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null); // Reset selected employee
>>>>>>> 8b62c6ab812bf242b987061d00bb2f7bac057daf
  };

  return (
    <div>
      <h2>Employees</h2>
<<<<<<< HEAD
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
=======
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
            title: "Days Off",
            dataIndex: "days_off",
            key: "days_off",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record: User) => (
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

      {selectedEmployee && (
        <AssignDepartmentsModal
          visible={isModalVisible}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
>>>>>>> 8b62c6ab812bf242b987061d00bb2f7bac057daf
        />
      )}
    </div>
  );
};

export default Employees;
