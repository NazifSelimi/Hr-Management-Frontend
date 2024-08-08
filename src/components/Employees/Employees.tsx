// src/components/Departments/DepartmentsList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { getEmployees, deleteUser } from "../../api/axiosInstance"; // Assuming api.ts is in the same directory

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employees");
        setLoading(false);
      }
    };
    // useEffect(() => {
    //   const fetchEmployees = async () => {
    //     try {
    //       const response = await axiosInstance.get<Employees[]>("/api/users");
    //       setEmployees(response.data);
    //     } catch (error) {
    //       console.error("Error fetching projects:", error);
    //       message.error("Failed to fetch projects.");
    //     }
    //   };

    fetchEmployees();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axiosInstance.delete(`/user-delete/${id}`);
      setEmployees((prevEmp) =>
        prevEmp.filter((employee) => employee.id !== id)
      );
      message.success("Project deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting project:", error?.response || error);
      message.error("Failed to delete project: " + error.message);
    }
  };
  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteUser(id).then((response) => {
  //       console.log("Data successfully deleted");
  //     });
  //     setEmployees(employees.filter((emp) => emp.id !== id));

  //     message.success("Employee deleted successfully.");
  //   } catch (error) {
  //     console.error("Error deleting employee:", error);
  //     message.error("Failed to delete employee.");
  //   }
  // };
  // const handleDelete = async (id: string) => {
  //   try {
  //     //setLoading(id); // Set loading state to the ID of the user being deleted
  //     await deleteUser(id);
  //     message.success("User deleted successfully.");
  //     //onDelete(id); // Notify parent component about deletion
  //   } catch (error) {
  //     message.error("Failed to delete user.");
  //   } finally {
  //     //setLoading(null); // Reset loading state
  //   }
  // };

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
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "City",
            dataIndex: "city",
            key: "city",
          },
          {
            title: "Address",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "Days Off",
            dataIndex: "days_off",
            key: "address",
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

export default Employees;
