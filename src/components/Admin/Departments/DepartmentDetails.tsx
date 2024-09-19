import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Typography,
  Divider,
  Row,
  Col,
  Table,
  Tag,
  message,
  Button,
  Modal,
  Select,
  Dropdown,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import { Department, User } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;

const DepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/departments/${id}`);
        setDepartment(response.data);
      } catch (error: any) {
        console.error("Error fetching department details:", error);
        message.error("Failed to fetch department details.");
        setError("Failed to fetch department details");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleRoleChange = async () => {
    if (!editingUser) return;
    setRoleUpdateLoading(true);
    try {
      await axiosInstance.post(`/departments/${id}/update-user-position`, {
        users: [
          {
            id: editingUser.id,
            position: newRole,
          },
        ],
      });
      message.success("Role updated successfully.");
      setEditingUser(null);
      setNewRole("");
      const response = await axiosInstance.get(`/departments/${id}`);
      setDepartment(response.data);
    } catch (error: any) {
      console.error("Error updating role:", error);
      message.error("Failed to update role.");
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await axiosInstance.post(`/departments/${id}/remove-user`, {
        user_id: userId,
      });
      message.success("User removed successfully.");
      // Refresh department data
      const response = await axiosInstance.get(`/departments/${id}`);
      setDepartment(response.data);
    } catch (error: any) {
      console.error("Error removing user:", error);
      message.error("Failed to remove user.");
    }
  };

  const handleEditRole = (user: User) => {
    setEditingUser(user);
    setNewRole(user.pivot?.position || user.role);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!department) return <p>Department not found</p>;

  const userColumns = [
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
      title: "Role",
      dataIndex: "pivot",
      key: "role",
      render: (_: any, user: User) => (
        <span>{user.pivot?.position || user.role}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit-role",
                label: (
                  <>
                    <EditOutlined /> Edit Role
                  </>
                ),
                onClick: () => handleEditRole(record),
              },
              {
                key: "delete",
                label: (
                  <>
                    <DeleteOutlined /> Delete
                  </>
                ),
                onClick: () => handleRemoveUser(record.id),
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: "35px" }} />}
            style={{ padding: "0", height: "auto" }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ textAlign: "center" }}>
        Department Details
      </Title>
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "18px" }}>
              Department Name:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "18px" }}>{department.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Users in this Department</Title>
            <Table
              virtual
              scroll={{ x: 1000, y: 300 }}
              dataSource={department.users}
              columns={userColumns}
              rowKey="id"
              pagination={false}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        open={!!editingUser}
        title="Edit User Role"
        onCancel={() => setEditingUser(null)}
        onOk={handleRoleChange}
        footer={[
          <Button key="cancel" onClick={() => setEditingUser(null)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={roleUpdateLoading}
            onClick={handleRoleChange}
          >
            {roleUpdateLoading ? "Updating Role..." : "Update Role"}
          </Button>,
        ]}
      >
        <p>
          Editing role for: {editingUser?.first_name} {editingUser?.last_name}
        </p>
        <Select
          value={newRole}
          onChange={(value) => setNewRole(value)}
          style={{ width: "100%" }}
        >
          <Option value="Manager">Manager</Option>
          <Option value="Team Lead">Team Lead</Option>
          <Option value="Developer">Developer</Option>
          <Option value="Designer">Designer</Option>
          {/* Add other roles as necessary */}
        </Select>
      </Modal>
    </>
  );
};

export default DepartmentDetails;
