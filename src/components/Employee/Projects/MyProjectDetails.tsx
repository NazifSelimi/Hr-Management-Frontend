// src/components/MyProjectDetails.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Typography, Divider, Row, Col, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store"; // Ensure the path is correct
import { fetchProjects } from "../../../redux/projectsSlice"; // Import the fetchProjects thunk
import { Project, User } from "../../types";

const { Title, Text } = Typography;

const MyProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projectStore
  );

  const project = projects.find((proj) => proj.id === id);

  useEffect(() => {
    if (!project) {
      dispatch(fetchProjects());
    }
  }, [dispatch, project]);

  if (loading) return <Spin />;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!project) return <p>Project not found</p>;

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
        Project Details
      </Title>
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "14px" }}>
              Name:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "14px" }}>{project.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: "14px" }}>
              Description:
            </Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: "14px" }}>{project.description}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Project Colleagues</Title>
            <Table
              virtual
              scroll={{ x: 500, y: 500 }}
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

export default MyProjectDetails;
