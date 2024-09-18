import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin, Dropdown, Modal } from "antd";
import {
  EllipsisOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import Spinner from "../Spinner";

interface EmployeesProps {
  data?: User[];
  onClose?: () => void;
}

const Employees: React.FC<EmployeesProps> = ({ data, onClose }) => {
  const [employees, setEmployees] = useState<User[]>(data || []);
  const [loading, setLoading] = useState<boolean>(!data);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [visibleActions, setVisibleActions] = useState<{
    [key: string]: boolean;
  }>({});
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
    Modal.confirm({
      title: "Are you sure you want to delete this employee?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setDeleting(id);
        try {
          await axiosInstance.delete(`/user-delete/${id}`);
          setEmployees((prev) => prev.filter((employee) => employee.id !== id));
          message.success("Employee deleted successfully.");
        } catch (error: any) {
          console.error("Error deleting employee:", error);
          message.error("Failed to delete employee.");
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const handleView = (id: string) => {
    navigate(`/users/${id}`);
    if (onClose) onClose();
  };

  const toggleActionsVisibility = (id: string) => {
    setVisibleActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const menuItems = (record: User) => [
    {
      key: "1",
      label: (
        <span onClick={() => handleView(record.id)}>
          <>
            <EyeOutlined /> View{" "}
          </>
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={() => handleDelete(record.id)}>
          <>
            <DeleteOutlined />
            Delete{" "}
          </>
        </span>
      ),
      danger: true,
      disabled: deleting === record.id,
    },
  ];

  return (
    <div>
      <h2>Employees</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          virtual
          scroll={{ x: 1000, y: 500 }}
          dataSource={employees}
          columns={[
            { title: "First Name", dataIndex: "first_name", key: "first_name" },
            { title: "Last Name", dataIndex: "last_name", key: "last_name" },
            { title: "E-mail", dataIndex: "email", key: "email" },
            { title: "Days Left", dataIndex: "days_off", key: "days_off" },
            {
              title: "Actions",
              key: "actions",
              render: (_, record: User) => (
                <Dropdown
                  menu={{ items: menuItems(record) }}
                  trigger={["click"]}
                  open={visibleActions[record.id]}
                  onOpenChange={() => toggleActionsVisibility(record.id)}
                >
                  <Button
                    type="link"
                    icon={<EllipsisOutlined style={{ fontSize: "35px" }} />}
                    style={{ padding: "0", height: "auto" }}
                  />
                </Dropdown>
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
