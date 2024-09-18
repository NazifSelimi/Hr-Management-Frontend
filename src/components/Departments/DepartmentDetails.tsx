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
  Button,
  message,
  Dropdown,
  Modal,
  Form,
  Select
} from "antd";
import { EllipsisOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { Department, User } from "../types";

const { Title, Text } = Typography;
const { Option } = Select;

const DepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the department ID from the URL
  const [department, setDepartment] = useState<Department | null>(null); // State for storing department data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false); // State to handle the role editing modal visibility
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State to store the user being edited
  const [roles, setRoles] = useState<string[]>([]); // State for storing role options

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/departments/${id}`); // Fetch department by ID
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/endpoint'); // Assuming you have an endpoint to fetch roles
        setRoles(response.data);
      } catch (error: any) {
        console.error("Error fetching roles:", error);
        message.error("Failed to fetch roles.");
      }
    };

    fetchRoles();
  }, []);

  const handleRemoveUser = async (userId: string) => {
    Modal.confirm({
      title: "Are you sure you want to remove this user from the department?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/user-delete/${userId}`);
          setDepartment(prevDepartment => {
            if (prevDepartment) {
              return {
                ...prevDepartment,
                users: prevDepartment.users.filter(user => user.id !== userId),
              };
            }
            return prevDepartment;
          });
          message.success("User removed from department successfully.");
        } catch (error: any) {
          console.error("Error removing user from department:", error);
          message.error("Failed to remove user from department.");
        }
      },
    });
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsEditingRole(true);
  };

  const handleRoleUpdate = async (values: { role: string }) => {
    if (selectedUser) {
      try {
        await axiosInstance.put(`/users/${selectedUser.id}`, { role: values.role });
        setDepartment(prevDepartment => {
          if (prevDepartment) {
            return {
              ...prevDepartment,
              users: prevDepartment.users.map(user =>
                user.id === selectedUser.id ? { ...user, role: values.role } : user
              ),
            };
          }
          return prevDepartment;
        });
        message.success("User role updated successfully.");
        setIsEditingRole(false);
      } catch (error: any) {
        console.error("Error updating user role:", error);
        message.error("Failed to update user role.");
      }
    }
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
              { key: 'edit-role', label: <><EditOutlined /> Edit Role</>, onClick: () => handleEditRole(record) },
              { key: 'delete', label: <><DeleteOutlined /> Delete</>, onClick: () => handleRemoveUser(record.id), danger: true },
            ],
          }}
          trigger={['click']}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: '35px' }} />}
            style={{ padding: '0', height: 'auto' }}
          />
        </Dropdown>
      ),
    },
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
        visible={isEditingRole}
        onCancel={() => setIsEditingRole(false)}
        footer={null}
      >
        <Form
          initialValues={{ role: selectedUser?.role }}
          onFinish={handleRoleUpdate}
        >
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select the role!" }]}
          >
            <Select>
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
