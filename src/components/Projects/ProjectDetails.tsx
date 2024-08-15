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
  Button,
  message,
} from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Project, User } from "../types";

const { Title, Text } = Typography;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the project ID from the URL
  const [project, setProject] = useState<Project | null>(null); // State for storing the project data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id}`); // Fetch project by ID
        setProject(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching project details:", error);
        message.error("Failed to fetch project details.");
        setLoading(false);
        setError("Failed to fetch project details");
      }
    };

    fetchProject();
  }, [id]); // Dependency array to refetch if the ID changes

  if (loading) return <Spin />; // Show loading spinner while fetching

  if (!project) return <p>Project not found</p>; // Display message if project is not found

  const handleRemoveUser = async (id: string) => {
    //
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
          {record.departments.map((dept) => (
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
        <Button type="link" danger onClick={() => handleRemoveUser(record.id)}>
          Remove From Project
        </Button>
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
            {project.departments && project.departments.length > 0 ? (
              project.departments.map((dept) => (
                <Tag
                  key={dept.id}
                  color="blue"
                  style={{ marginBottom: "5px", fontSize: "16px" }}
                >
                  {dept.name}
                </Tag>
              ))
            ) : (
              <Text style={{ fontSize: "18px" }}>No departments assigned</Text>
            )}
          </Col>
        </Row>
      </Card>
      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Users
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Table dataSource={project.users} columns={userColumns} rowKey="id" />
      </Card>
    </>
  );
};

export default ProjectDetails;
