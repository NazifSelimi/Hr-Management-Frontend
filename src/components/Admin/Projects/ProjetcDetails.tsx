import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Row,
  Col,
  Table,
  Button,
  Dropdown,
  message,
  Modal,
} from "antd";
import { EllipsisOutlined, UserAddOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import { Project, User } from "../../types";
import Spinner from "../../Spinner";
import AssignEditModal from "../AssignEditModal";

const { Title, Text } = Typography;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assignEntityType, setAssignEntityType] = useState<
    "user" | "department"
  >("user");
  const [editEntity, setEditEntity] = useState<
    { id: string; role?: string } | undefined
  >(undefined);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id}`);
        const projectData = response.data;

        const transformedDepartments = projectData.departments.map(
          (dept: any) => ({
            ...dept,
          })
        );

        setProject({ ...projectData, departments: transformedDepartments });
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching project details:", error);
        message.error("Failed to fetch project details.");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const openAssignModal = useCallback((entityType: "user" | "department") => {
    setAssignEntityType(entityType);
    setEditEntity(undefined);
    setIsAssignModalVisible(true);
  }, []);

  const closeAssignModal = useCallback(() => {
    setIsAssignModalVisible(false);
    setEditEntity(undefined);
  }, []);

  const handleAssignSubmit = async (values: {
    entities: { id: string; role?: string }[];
  }) => {
    if (!project) return;

    try {
      // Fetch actual user data for each entity being assigned
      const fetchedEntities = await Promise.all(
        values.entities.map(async (entity) => {
          const response = await axiosInstance.get(`/users/${entity.id}`);
          const userData = response.data;
          return {
            ...userData,
            pivot: {
              role: entity.role || "",
            },
          };
        })
      );

      // Update project state with fetched data
      setProject((prevProject: any) => {
        if (!prevProject) return prevProject;

        // Merge existing users and new users
        const updatedUsers = [
          ...prevProject.users.filter(
            (user: any) =>
              !fetchedEntities.some((entity) => entity.id === user.id)
          ),
          ...fetchedEntities,
        ];

        return {
          ...prevProject,
          users: updatedUsers,
        };
      });

      message.success("Users assigned successfully!");
      closeAssignModal(); // Close modal after submission
    } catch (error) {
      console.error("Error fetching data for assignment:", error);
      message.error("Failed to assign users. Please try again.");
    }
  };
  const handleEditRole = useCallback(
    (record: any, entityType: "user" | "department") => {
      const editEntity = {
        id: record.id,
        role: entityType === "user" ? record.projectRole?.role : undefined,
      };

      setAssignEntityType(entityType);
      setIsAssignModalVisible(true);
      setEditEntity(editEntity);
    },
    []
  );

  const handleRemoveEntity = useCallback(
    async (record: any, entityType: "user" | "department") => {
      Modal.confirm({
        title: `Are you sure you want to remove this ${entityType} from the project?`,
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            if (entityType === "user") {
              await axiosInstance.post(`/user/${record.id}/remove-projects`, {
                projects: [{ id }],
              });
              message.success("User removed successfully.");
            } else if (entityType === "department") {
              await axiosInstance.post(`/project/${id}/remove-department`, {
                department_id: record.id,
              });
              message.success("Department removed successfully.");
            }

            setProject((prevProject) => {
              if (!prevProject) return prevProject;

              if (entityType === "user") {
                const updatedUsers = prevProject.users.filter(
                  (user) => user.id !== record.id
                );
                return { ...prevProject, users: updatedUsers };
              } else {
                const updatedDepartments = prevProject.departments.filter(
                  (dept) => dept.id !== record.id
                );
                return { ...prevProject, departments: updatedDepartments };
              }
            });
          } catch (error: any) {
            console.error(`Error removing ${entityType}:`, error);
            message.error(`Failed to remove the ${entityType}.`);
          }
        },
      });
    },
    [id]
  );

  const actionMenu = useMemo(
    () => (record: any, entityType: "user" | "department") =>
      [
        {
          key: "1",
          label: (
            <div onClick={() => handleEditRole(record, entityType)}>
              Edit Role
            </div>
          ),
        },
        {
          key: "2",
          label: (
            <div onClick={() => handleRemoveEntity(record, entityType)}>
              Remove {entityType}
            </div>
          ),
        },
      ],
    [handleEditRole, handleRemoveEntity]
  );

  if (loading) return <Spinner />;
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
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "role",
      render: (_: any, record: User) => {
        return record.pivot?.role; // Display the role or fallback text
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{ items: actionMenu(record, "user") }}
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

  const departmentColumns = [
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{ items: actionMenu(record, "department") }}
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
          <Col span={24}>
            <Title level={4}>Departments in this Project</Title>
            <Row justify="end" style={{ marginBottom: "10px" }}>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => openAssignModal("department")}
              >
                Assign Department
              </Button>
            </Row>
            <Table
              virtual
              scroll={{ x: 1000, y: 300 }}
              dataSource={project.departments}
              columns={departmentColumns}
              rowKey="id"
              pagination={false}
            />
          </Col>
        </Row>

        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Users in this Project</Title>
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
              dataSource={project.users}
              columns={userColumns}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>

      {/* Assign Entity Modal */}
      <AssignEditModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        parentId={id || ""}
        entityType={assignEntityType}
        operationType={editEntity ? "edit" : "assign"}
        scope="project"
        currentAssignments={
          assignEntityType === "user" ? project.users : project.departments
        }
        editEntity={editEntity}
        onSubmit={handleAssignSubmit}
      />
    </>
  );
};

export default ProjectDetails;
