import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, message, Spin, Dropdown, Modal } from "antd";
import {
  EllipsisOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types";
import Spinner from "../../Spinner";
import CustomTable from "../../Table/CustomTable"; // CustomTable component
import { fetchEmployees } from "../../../apiService";

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
      const loadEmployees = async () => {
        try {
          const fetchedEmployees = await fetchEmployees();
          setEmployees(fetchedEmployees);
        } catch (error: any) {
          console.error("Error fetching employees:", error);
          message.error("Failed to load employees.");
        } finally {
          setLoading(false);
        }
      };

      loadEmployees();
    }
  }, [data]);

  const handleDelete = useCallback(async (id: string) => {
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
  }, []);

  const handleView = useCallback(
    (id: string) => {
      navigate(`/users/${id}`);
      if (onClose) onClose();
    },
    [navigate, onClose]
  );

  const toggleActionsVisibility = useCallback((id: string) => {
    setVisibleActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const menuItems = useMemo(
    () => (record: User) =>
      [
        {
          key: "view",
          label: (
            <span onClick={() => handleView(record.id)}>
              <EyeOutlined /> View
            </span>
          ),
        },
        {
          key: "delete",
          label: (
            <span onClick={() => handleDelete(record.id)}>
              {deleting === record.id ? (
                <Spin size="small" />
              ) : (
                <>
                  <DeleteOutlined /> Delete
                </>
              )}
            </span>
          ),
          danger: true,
          disabled: deleting === record.id,
        },
      ],
    [deleting, handleDelete, handleView]
  );

  // Define columns for the CustomTable
  const columns = useMemo(
    () => [
      { title: "First Name", dataIndex: "first_name", key: "first_name" },
      { title: "Last Name", dataIndex: "last_name", key: "last_name" },
      { title: "E-mail", dataIndex: "email", key: "email" },
      { title: "Days Left", dataIndex: "days_off", key: "days_off" },
      {
        title: "Actions",
        key: "actions",
        render: (record: User) => (
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
    ],
    [menuItems, visibleActions, toggleActionsVisibility]
  );

  return (
    <div>
      <h2>Employees</h2>
      {loading ? (
        <Spinner />
      ) : (
        <CustomTable
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default Employees;
