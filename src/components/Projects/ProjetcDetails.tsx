import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Card, Spin, Typography, Divider, Row, Col, Tag, Table, Button, message, Dropdown, Modal} from "antd";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { Project, User } from "../types";

const { Title, Text } = Typography;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error: any) {
        console.error("Error fetching project details:", error);
        message.error("Failed to fetch project details.");
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Spin />;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!project) return <p>Project not found</p>;

  const handleRemoveUser = async (userId: string) => {
    Modal.confirm({
      title: "Are you sure you want to remove this user from the project?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/projects/${id}/users/${userId}`);
          setProject(prevProject => ({
            ...prevProject!,
            users: prevProject!.users.filter(user => user.id !== userId),
          }));
          message.success("User removed from project successfully.");
        } catch (error: any) {
          console.error("Error removing user from project:", error?.response || error);
          message.error("Failed to remove user from project.");
        }
      },
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
      title: "Departments",
      key: "departments",
      render: (_: any, record: User) => (
        <span>
          {record.departments.map(dept => (
            <Tag key={dept.id} color="blue" style={{ marginBottom: "5px" }}>
              {dept.name}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Dropdown
          menu={{
            items: [
              { key: 'delete', label: <><DeleteOutlined/> Delete </>, onClick: () => handleRemoveUser(record.id), danger: true },
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

  return (
    <>
      <Title level={2} style={{ textAlign: "center" }}>
        Project Details
      </Title>
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "18px" }}>
              Name:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "18px" }}>{project.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "18px" }}>
              Description:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "18px" }}>{project.description}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "18px" }}>
              Departments:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "18px" }}>
              {project.departments.map(dept => dept.name).join(", ")}
            </Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Users in this Project</Title>
            <Table virtual scroll={{ x: 1000, y: 300 }}
              dataSource={project.users}
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

export default ProjectDetails;
