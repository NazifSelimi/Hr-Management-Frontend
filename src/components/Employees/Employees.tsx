import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { getEmployees } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import AssignDepartmentsModal from "./AssignDepartmentModal";

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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
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
  }, []);

  if (loading) return <Spin />;

  if (!employees) return <p>Employees could not be loaded</p>;

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

  const handleAssignDepartments = (employee: Employee) => {
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
            title: "Days Off",
            dataIndex: "days_off",
            key: "days_off",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record: Employee) => (
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
                <Button
                  type="primary"
                  onClick={() => handleAssignDepartments(record)}
                >
                  Assign Departments
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
        />
      )}
    </div>
  );
};

export default Employees;
