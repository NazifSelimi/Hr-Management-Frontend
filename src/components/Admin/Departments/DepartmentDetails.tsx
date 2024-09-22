import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Table,
  Button,
  Dropdown,
  message,
} from "antd";
import { EllipsisOutlined, UserAddOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import Spinner from "../../Spinner";
import AssignEntityModal from "../User/AsignDepartmentsModal"; // Use the refactored modal

const { Title, Text } = Typography;

const DepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false); // Modal visibility
  const [assignEntityType, setAssignEntityType] = useState<"user" | "project">(
    "user"
  ); // Tracks if we are assigning users or projects
  const [editEntity, setEditEntity] = useState<
    { id: string; position: string } | undefined
  >(undefined); // To handle editing an entity

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/departments/${id}`);
        setDepartment(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching department details:", error);
        message.error("Failed to fetch department details.");
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  // Open the assign modal for either user or project
  const openAssignModal = (entityType: "user" | "project") => {
    setAssignEntityType(entityType);
    setIsAssignModalVisible(true);
  };

  // Close the assign modal
  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setEditEntity(undefined); // Reset edit mode
  };

  // Handle entity assignment (users or projects)
  const handleAssignSubmit = (values: {
    entities: { id: string; position: string }[];
  }) => {
    if (!department) return;

    if (assignEntityType === "user") {
      const updatedUsers = values.entities.map((entity) => ({
        id: entity.id,
        first_name: "User FirstName", // Replace with actual user data
        last_name: "User LastName", // Replace with actual user data
        pivot: { position: entity.position },
      }));

      setDepartment((prevDepartment: any) => ({
        ...prevDepartment,
        users: [...prevDepartment.users, ...updatedUsers],
      }));
    } else {
      const updatedProjects = values.entities.map((entity) => ({
        id: entity.id,
        name: "Project Name", // Replace with actual project data
        projectRole: { role: entity.position },
      }));

      setDepartment((prevDepartment: any) => ({
        ...prevDepartment,
        projects: [...prevDepartment.projects, ...updatedProjects],
      }));
    }

    message.success("Entities assigned successfully!");
    closeAssignModal(); // Close modal after submission
  };

  // Handle editing an entity's position or role
  const handleEditEntity = (record: any, entityType: "user" | "project") => {
    setEditEntity({
      id: record.id,
      position:
        entityType === "user" ? record.pivot.position : record.projectRole.role,
    });
    openAssignModal(entityType);
  };

  // Handle removing an entity (either user or project)
  const handleRemoveEntity = async (
    entityId: string,
    entityType: "user" | "project"
  ) => {
    try {
      if (entityType === "user") {
        await axiosInstance.post(`/departments/${id}/remove-user`, {
          user_id: entityId,
        });
        setDepartment((prevDepartment: any) => ({
          ...prevDepartment,
          users: prevDepartment.users.filter(
            (user: any) => user.id !== entityId
          ),
        }));
        message.success("User removed successfully.");
      } else {
        await axiosInstance.post(`/departments/${id}/remove-project`, {
          project_id: entityId,
        });
        setDepartment((prevDepartment: any) => ({
          ...prevDepartment,
          projects: prevDepartment.projects.filter(
            (project: any) => project.id !== entityId
          ),
        }));
        message.success("Project removed successfully.");
      }
    } catch (error) {
      console.error(`Error removing ${entityType}:`, error);
      message.error(`Failed to remove the ${entityType}.`);
    }
  };

  if (loading) return <Spinner />;
  if (!department) return <p>Department not found</p>;

  // User columns
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
      title: "Position",
      dataIndex: ["pivot", "position"],
      key: "position",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit-position",
                label: (
                  <span onClick={() => handleEditEntity(record, "user")}>
                    Edit Position
                  </span>
                ),
              },
              {
                key: "remove-user",
                label: (
                  <span onClick={() => handleRemoveEntity(record.id, "user")}>
                    Remove User
                  </span>
                ),
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: "24px" }} />}
            style={{ padding: "0", height: "auto" }}
          />
        </Dropdown>
      ),
    },
  ];

  // Project columns
  const projectColumns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: ["projectRole", "role"],
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit-role",
                label: (
                  <span onClick={() => handleEditEntity(record, "project")}>
                    Edit Role
                  </span>
                ),
              },
              {
                key: "remove-project",
                label: (
                  <span
                    onClick={() => handleRemoveEntity(record.id, "project")}
                  >
                    Remove Project
                  </span>
                ),
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: "24px" }} />}
            style={{ padding: "0", height: "auto" }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Title style={{ textAlign: "center", marginBottom: 0 }}>
        Department Details
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Row>
          <Col span={6}>
            <Text strong>Department Name:</Text>
          </Col>
          <Col span={18}>
            <Text>{department.name}</Text>
          </Col>
        </Row>
      </Card>

      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Users
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Row justify="end" style={{ marginBottom: "10px" }}>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => openAssignModal("user")}
          >
            Assign User
          </Button>
        </Row>
        <Table
          virtual
          scroll={{ x: 600, y: 500 }}
          dataSource={department.users}
          columns={userColumns}
          rowKey="id"
        />
      </Card>

      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Projects
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Row justify="end" style={{ marginBottom: "10px" }}>
          <Button type="primary" onClick={() => openAssignModal("project")}>
            Assign Project
          </Button>
        </Row>
        <Table
          virtual
          scroll={{ x: 600, y: 500 }}
          dataSource={department.projects}
          columns={projectColumns}
          rowKey="id"
        />
      </Card>

      {/* Reusable Assign Entity Modal */}
      <AssignEntityModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        entityId={id || ""} // Provide a fallback if id is undefined
        existingEntities={
          assignEntityType === "user" ? department.users : department.projects
        }
        entityType={assignEntityType}
        onSubmit={handleAssignSubmit}
        editEntity={editEntity}
      />
    </>
  );
};

export default DepartmentDetails;
