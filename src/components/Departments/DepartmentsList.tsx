import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin, Dropdown, Modal } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Department } from "../types";
import AssignUsersModal from "./AssignUserModal";
import {
  EllipsisOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [visibleActions, setVisibleActions] = useState<{
    [key: string]: boolean;
  }>({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error: any) {
        console.error("Error fetching departments:", error);
        message.error("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDeleteDepartment = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this department?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setDeleting(id);
        try {
          await axiosInstance.delete(`/departments/${id}`);
          setDepartments((prevDepartments) =>
            prevDepartments.filter((department) => department.id !== id)
          );
          message.success("Department deleted successfully.");
        } catch (error: any) {
          console.error("Error deleting department:", error);
          message.error("Failed to delete department.");
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const handleModalOpen = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDepartment(null);
  };

  const handleAssignUsers = (values: {
    users: { id: string; position: string }[];
  }) => {
    console.log("Users assigned:", values);
    handleModalClose();
  };

  const toggleActionsVisibility = (id: string) => {
    setVisibleActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewDepartment = (id: string) => {
    navigate(`/departments/${id}`); 
  };

  const menuItems = (record: Department) => [
    {
      key: "1",
      label: (
        <span onClick={() => handleModalOpen(record)}>
          <>
            <UserAddOutlined /> Assign Users
          </>
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={() => handleDeleteDepartment(record.id)}>
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
  ];

  if (loading) return <Spinner />;
  return (
    <div>
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
            render: (_, record: Department) => (
              <>
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
              </>
            ),
          },
        ]}
        rowKey="id"
      />
      {selectedDepartment && (
        <AssignUsersModal
          visible={isModalVisible}
          onClose={handleModalClose}
          departmentId={selectedDepartment.id}
          onSubmit={handleAssignUsers}
        />
      )}
    </div>
  );
};

export default DepartmentsList;
