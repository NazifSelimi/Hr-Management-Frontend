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
  message,
} from "antd";
import axiosInstance from "../../../api/axiosInstance";
import { Department, User } from "../../types";

const { Title, Text } = Typography;

const MyProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/view-department/${id}`);
        setDepartment(response.data);
      } catch (error: any) {
        console.error("Error fetching department details:", error);
        message.error("Failed to fetch department details.");
        setError("Failed to fetch department details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Spin />;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
      title: "Role",
      render: (_: any, record: User) => record.pivot?.role,
      key: "role",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
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
            <Text strong style={{ fontSize: "14px" }}>
              Name:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "14px" }}>{department.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Project Colleagues</Title>
            <Table
              virtual
              scroll={{ x: 500, y: 500 }}
              dataSource={department.users}
              columns={userColumns}
              rowKey="id"
              pagination={false}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default MyProjectDetails;
