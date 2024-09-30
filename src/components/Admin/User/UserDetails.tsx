import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Table,
  message,
  Dropdown,
  Button,
  Modal,
  Row,
  Col,
} from "antd";
import { EllipsisOutlined, UserAddOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import { User } from "../../types";
import Spinner from "../../Spinner";
import AssignEntityModal from "./AsignDepartmentsModal";
import UserInfo from "./UserInfo"; // Import the UserInfo component

const { Title } = Typography;

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assignEntityType, setAssignEntityType] = useState<
    "department" | "project"
  >("department");
  const [editEntity, setEditEntity] = useState<
    { id: string; position: string } | undefined
  >(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        const userData = response.data;

        const transformedProjects = userData.projects.map((project: any) => ({
          ...project,
          projectRole: { role: project.pivot.role },
        }));

        setUser({ ...userData, projects: transformedProjects });
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        message.error(error.response?.data?.message || "Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const openAssignModal = useCallback(
    (entityType: "department" | "project") => {
      setAssignEntityType(entityType);
      setEditEntity(undefined);
      setIsAssignModalVisible(true);
    },
    []
  );

  const closeAssignModal = useCallback(() => {
    setIsAssignModalVisible(false);
    setEditEntity(undefined);
  }, []);

  const handleAssignSubmit = useCallback(
    (values: { entities: { id: string; position: string }[] }) => {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        if (assignEntityType === "department") {
          // Update existing departments
          const updatedDepartments = prevUser.departments.map((dept) => {
            const updatedEntity = values.entities.find(
              (entity) => entity.id === dept.id
            );
            return updatedEntity
              ? {
                ...dept,
                pivot: { ...dept.pivot, position: updatedEntity.position },
              }
              : dept;
          });

          // Add new departments that are not in the current list
          const newDepartments = values.entities
            .filter(
              (entity) =>
                !prevUser.departments.some((dept) => dept.id === entity.id)
            )
            .map((entity) => ({
              id: entity.id,
              name: "New Department", // Replace this with actual name if needed
              pivot: { position: entity.position },
              users: prevUser ? [prevUser] : [], // Ensure new departments have users
            }));

          return {
            ...prevUser,
            departments: [...updatedDepartments, ...newDepartments],
          };
        } else {
          // Update existing projects
          const updatedProjects = prevUser.projects.map((proj) => {
            const updatedEntity = values.entities.find(
              (entity) => entity.id === proj.id
            );
            return updatedEntity
              ? {
                ...proj,
                projectRole: {
                  ...proj.projectRole,
                  role: updatedEntity.position,
                },
              }
              : proj;
          });

          // Add new projects that are not in the current list
          const newProjects = values.entities
            .filter(
              (entity) =>
                !prevUser.projects.some((proj) => proj.id === entity.id)
            )
            .map((entity) => ({
              id: entity.id,
              name: "New Project", // Replace this with actual name if needed
              description: "New Project Description", // Replace with actual description if needed
              projectRole: { role: entity.position },
              users: prevUser ? [prevUser] : [], // Ensure new projects have users
              departments: [], // Initialize with an empty departments array if needed
            }));

          return {
            ...prevUser,
            projects: [...updatedProjects, ...newProjects],
          };
        }
      });

      message.success(
        `${assignEntityType === "department" ? "Departments" : "Projects"
        } assigned successfully!`
      );
    },
    [assignEntityType]
  );

  const handleEditPosition = useCallback(
    (record: any, entityType: "department" | "project") => {
      const editEntity = {
        id: record.id,
        position:
          entityType === "department"
            ? record.pivot.position
            : record.pivot.role,
      };

      setAssignEntityType(entityType);
      setEditEntity(editEntity);
      setIsAssignModalVisible(true); // Open the modal with the entity pre-filled
    },
    []
  );

  const handleRemoveUser = useCallback(
    async (record: any, entityType: "department" | "project") => {
      Modal.confirm({
        title: `Are you sure you want to remove this user from the ${entityType}?`,
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            if (entityType === "department") {
              await axiosInstance.post(`/user/${user?.id}/remove-departments`, {
                departments: [{ id: record.id }],
              });
              message.success("Department removed successfully.");
            } else {
              await axiosInstance.post(`/user/${user?.id}/remove-projects`, {
                projects: [{ id: record.id }],
              });
              message.success("Project removed successfully.");
            }

            setUser((prevUser) => {
              if (!prevUser) return prevUser;

              if (entityType === "department") {
                const updatedDepartments = prevUser.departments.filter(
                  (dept) => dept.id !== record.id
                );
                return { ...prevUser, departments: updatedDepartments };
              } else {
                const updatedProjects = prevUser.projects.filter(
                  (proj) => proj.id !== record.id
                );
                return { ...prevUser, projects: updatedProjects };
              }
            });
          } catch (error: any) {
            console.error(`Error removing user from ${entityType}:`, error);
            message.error(error.response?.data?.message || `Failed to remove the user from ${entityType}.`);
          }
        },
      });
    },
    [user]
  );

  const actionMenu = useMemo(
    () => (record: any, entityType: "department" | "project") =>
      [
        {
          key: "1",
          label: (
            <div onClick={() => handleEditPosition(record, entityType)}>
              Edit position
            </div>
          ),
        },
        {
          key: "2",
          label: (
            <div onClick={() => handleRemoveUser(record, entityType)}>
              Remove user
            </div>
          ),
        },
      ],
    [handleEditPosition, handleRemoveUser]
  );

  if (loading) return <Spinner />;
  if (!user) return <p>User not found</p>;

  const departmentColumns = [
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
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
          menu={{ items: actionMenu(record, "project") }}
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
        User Details
      </Title>
      {/* Display User Info */}
      {user && <UserInfo user={user} />}

      {/* Display for Departments */}
      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Departments
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
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
          scroll={{ x: 600, y: 500 }}
          dataSource={user.departments}
          columns={departmentColumns}
          rowKey="id"
        />
      </Card>

      {/* Display for Projects */}
      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Projects
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Row justify="end" style={{ marginBottom: "10px" }}>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => openAssignModal("project")}
          >
            Assign Project
          </Button>
        </Row>
        <Table
          virtual
          scroll={{ x: 600, y: 500 }}
          dataSource={user.projects}
          columns={projectColumns}
          rowKey="id"
        />
      </Card>

      {/* Reusable Modal for assigning departments or projects */}
      <AssignEntityModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        entityId={user.id} // Changed to entityId for consistency
        existingEntities={
          assignEntityType === "department" ? user.departments : user.projects
        }
        entityType={assignEntityType}
        onSubmit={handleAssignSubmit}
        editEntity={editEntity}
      />
    </>
  );
};

export default UserDetails;
