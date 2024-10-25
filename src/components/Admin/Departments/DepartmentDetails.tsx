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
import axiosInstance from "../../../services/axiosInstance";
import Spinner from "../../Spinner";
import AssignEditModal from "../AssignEditModal";

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
  const openAssignModal = (
    entityType: "user" | "project",
    operation: "assign" | "edit" = "assign",
    record?: any
  ) => {
    setAssignEntityType(entityType);
    setEditEntity(
      operation === "edit"
        ? {
            id: record.id,
            position:
              entityType === "user"
                ? record.pivot?.position || ""
                : record.projectRole?.role || "",
          }
        : undefined
    );
    setIsAssignModalVisible(true);
  };

  // Close the assign modal
  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setEditEntity(undefined); // Reset edit mode
  };

  // Handle entity assignment (users or projects)
  const handleAssignSubmit = async (values: {
    entities: { id: string; position?: string; role?: string }[];
  }) => {
    if (!department) return;

    try {
      // Fetch actual data for assigned entities (users or projects)
      const fetchedEntities = await Promise.all(
        values.entities.map(async (entity) => {
          if (assignEntityType === "user") {
            const response = await axiosInstance.get(`/users/${entity.id}`);
            const userData = response.data;
            return {
              ...userData,
              pivot: { position: entity.position || "" },
            };
          } else if (assignEntityType === "project") {
            const response = await axiosInstance.get(`/projects/${entity.id}`);
            const projectData = response.data;
            return projectData; // Add or modify as needed if you need additional properties
          }
        })
      );

      // Update department state with the fetched data
      setDepartment((prevDepartment: any) => {
        if (!prevDepartment) return prevDepartment;

        if (assignEntityType === "user") {
          return {
            ...prevDepartment,
            users: [...prevDepartment.users, ...fetchedEntities],
          };
        } else {
          return {
            ...prevDepartment,
            projects: [...prevDepartment.projects, ...fetchedEntities],
          };
        }
      });

      message.success("Entities assigned successfully!");
      closeAssignModal(); // Close modal after submission
    } catch (error) {
      console.error("Error fetching data for assignment:", error);
      message.error("Failed to assign entities. Please try again.");
    }
  };

  // Handle editing an entity's position or role
  const handleEditEntity = (record: any, entityType: "user" | "project") => {
    openAssignModal(entityType, "edit", record);
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
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <Dropdown
          menu={{
            items: [
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
            style={{ marginRight: "10px" }}
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
      <AssignEditModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        parentId={id || ""}
        entityType={assignEntityType}
        operationType={editEntity ? "edit" : "assign"}
        scope="department"
        currentAssignments={
          assignEntityType === "user" ? department.users : department.projects
        }
        editEntity={editEntity}
        onSubmit={handleAssignSubmit}
      />
    </>
  );
};

export default DepartmentDetails;