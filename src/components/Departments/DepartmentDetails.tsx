import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Typography, Divider, Row, Col, Table, Button, message, Dropdown, Modal, Form, Select } from "antd";
import { EllipsisOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { Department, User } from "../types";

const { Title, Text } = Typography;
const { Option } = Select;

const DepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]); // State to store roles
  const [updatedUsers, setUpdatedUsers] = useState<{ id: string; position: string }[]>([]);

  useEffect(() => {
    // Fetch the department details
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

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get(`/roles`); // Adjust endpoint based on your API
        setRoles(response.data); // Assuming the API response returns a list of roles
      } catch (error) {
        console.error("Error fetching roles:", error);
        message.error("Failed to fetch roles.");
      }
    };

    fetchRoles();
  }, []); // Fetch roles once on component mount

  const handleRemoveUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/departments/${id}/remove-user`, {
        data: { userId }
      });
      message.success("User removed successfully.");
      setDepartment(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.filter(user => user.id !== userId)
        };
      });
    } catch (error: any) {
      console.error("Error removing user:", error);
      message.error("Failed to remove user.");
    }
  };

  const handleRoleUpdate = async () => {
    try {
      const response = await axiosInstance.put(`/departments/${id}/update-user-position`, {
        users: updatedUsers
      });
      setDepartment(response.data);
      message.success("User positions updated successfully.");
      setIsEditingRole(false);
    } catch (error: any) {
      console.error("Error updating user positions:", error);
      message.error("Failed to update user positions.");
    }
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsEditingRole(true);
  };

  const onRoleChange = (userId: string, newRole: string) => {
    setUpdatedUsers(prevState => {
      const updated = prevState.filter(user => user.id !== userId);
      return [...updated, { id: userId, position: newRole }];
    });
  };

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
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit-role',
                label: <><EditOutlined /> Edit Role</>,
                onClick: () => handleEditRole(record)
              },
              {
                key: 'delete',
                label: <><DeleteOutlined /> Delete</>,
                onClick: () => handleRemoveUser(record.id),
                danger: true
              }
            ]
          }}
          trigger={['click']}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: '35px' }} />}
            style={{ padding: '0', height: 'auto' }}
          />
        </Dropdown>
      )
    }
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <Text style={{ fontSize: "18px" }}>{department?.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Users in this Department</Title>
            <Table
              dataSource={department?.users}
              columns={userColumns}
              rowKey="id"
              pagination={false}
            />
          </Col>
        </Row>
      </Card>

      {/* Modal for Editing User Role */}
      <Modal
        title="Edit User Role"
        open={isEditingRole}
        onCancel={() => setIsEditingRole(false)}
        footer={null}
      >
        <Form onFinish={handleRoleUpdate}>
          <Form.Item label="Role">
            <Select
              defaultValue={selectedUser?.role}
              onChange={(value) => onRoleChange(selectedUser?.id as string, value)}
            >
              {roles.map(role => (
                <Option key={role} value={role}>{role}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DepartmentDetails;
