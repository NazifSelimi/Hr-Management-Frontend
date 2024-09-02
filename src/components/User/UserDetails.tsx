import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  Table,
  message,
} from "antd";
import axiosInstance from "../../api/axiosInstance";
import { User } from "../types";

const { Title, Text } = Typography;

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the user ID from the URL
  const [user, setUser] = useState<User | null>(null); // State for storing the user data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`); // Fetch user by ID
        setUser(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        message.error("Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Dependency array to refetch if the ID changes

  if (loading) return <Spin />; // Show loading spinner while fetching

  if (!user) return <p>User not found</p>; // Display message if user is not found

  const projectColumns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <>
      <Title level={2} style={{ textAlign: "center" }}>
        User Details
      </Title>
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Name:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>
              {user.first_name} {user.last_name}
            </Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              E-mail:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>{user.email}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Phone:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>{user.phone}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              City:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>{user.city}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Address:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>{user.address}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Role:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>{user.role}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Days Off:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "16px" }}>{user.days_off}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Departments:
            </Text>
          </Col>
          <Col span={18}>
            {user.departments && user.departments.length > 0 ? (
              user.departments.map((dept) => (
                <Tag
                  key={dept.id}
                  color="blue"
                  style={{ marginBottom: "5px", fontSize: "16px" }}
                >
                  {dept.name}
                </Tag>
              ))
            ) : (
              <Text style={{ fontSize: "16px" }}>No departments assigned</Text>
            )}
          </Col>
        </Row>
      </Card>
      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Projects
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Table
          dataSource={user.projects}
          columns={projectColumns}
          rowKey="id"
        />
      </Card>
    </>
  );
};

export default UserDetails;