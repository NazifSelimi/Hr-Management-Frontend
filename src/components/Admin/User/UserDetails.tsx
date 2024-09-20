import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Row,
  Col,
  Table,
  message,
  Dropdown,
  Menu,
  Button,
  Modal,
} from "antd";
import { EllipsisOutlined, UserAddOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import { User } from "../../types";
import Spinner from "../../Spinner";
import AssignEntityModal from "./AsignDepartmentsModal"; // Reuse AssignEntityModal

const { Title, Text } = Typography;

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the user ID from the URL
  const [user, setUser] = useState<User | null>(null); // State for storing the user data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
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

        // Transform the project pivot to projectRole
        const transformedProjects = userData.projects.map((project: any) => ({
          ...project,
          projectRole: { role: project.pivot.role }, // Move pivot.role into projectRole
        }));

        // Update the user object with transformed projects
        setUser({ ...userData, projects: transformedProjects });
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        message.error("Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Spinner />;

  if (!user) return <p>User not found</p>;

  // Open modal for assigning entity (department or project)
  const openAssignModal = (entityType: "department" | "project") => {
    setAssignEntityType(entityType);
    setEditEntity(undefined);
    setIsAssignModalVisible(true);
  };

  // Function to close the modal
  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setEditEntity(undefined); // Reset editEntity when modal is closed
  };
  // Handle the modal submission (after assigning departments or projects)
  const handleAssignSubmit = (values: {
    entities: { id: string; position: string }[];
  }) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      if (assignEntityType === "department") {
        // Update departments
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

        return {
          ...prevUser,
          departments: updatedDepartments,
        };
      } else {
        // Update projects
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

        return {
          ...prevUser,
          projects: updatedProjects,
        };
      }
    });
  };

  // Menu for action dropdown
  const actionMenu = (record: any, entityType: "department" | "project") => [
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
  ];

  // Event handlers for actions
  const handleEditPosition = (
    record: any,
    entityType: "department" | "project"
  ) => {
    // Prepare the selected entity for editing
    const editEntity = {
      id: record.id,
      position:
        entityType === "department"
          ? record.pivot.position
          : record.projectRole.role,
    };

    // Open the modal with the editEntity prop passed
    setAssignEntityType(entityType); // Set the modal's context to "department" or "project"
    setIsAssignModalVisible(true); // Show the modal
    setEditEntity(editEntity); // Pass the entity to the modal for editing
  };

  const handleRemoveUser = async (
    record: any,
    entityType: "department" | "project"
  ) => {
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

          // Update the UI after removing
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
          message.error(`Failed to remove the user from ${entityType}.`);
        }
      },
    });
  };

  // Table columns for the user's departments
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
          menu={{ items: actionMenu(record, "department") }} // Use 'menu' instead of 'overlay'
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

  // Table columns for the user's projects
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
          menu={{ items: actionMenu(record, "project") }} // Use 'menu' instead of 'overlay'
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
      <Card style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title style={{ textAlign: "center", marginBottom: 0 }}>
              User Details
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => openAssignModal("project")}
            >
              Assign Project
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => openAssignModal("department")} // Open the modal for departments
            >
              Assign Department
            </Button>
          </Col>
        </Row>
        <Divider />
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
        {/* ... Add user detail display code here ... */}
      </Card>

      {/* Table for user's departments */}
      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Departments
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Table
          virtual
          scroll={{ x: 600, y: 500 }}
          dataSource={user.departments}
          columns={departmentColumns}
          rowKey="id"
        />
      </Card>

      {/* Table for user's projects */}
      <Title level={3} style={{ marginTop: "20px", textAlign: "center" }}>
        Associated Projects
      </Title>
      <Card style={{ maxWidth: 900, margin: "20px auto", padding: "20px" }}>
        <Table
          virtual
          scroll={{ x: 600, y: 500 }}
          dataSource={user.projects}
          columns={projectColumns}
          rowKey="id"
        />
      </Card>

      {/* Reusable modal for assigning departments or projects */}
      <AssignEntityModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        userId={user.id}
        userEntities={
          assignEntityType === "department" ? user.departments : user.projects
        } // Pass assigned entities
        entityType={assignEntityType} // Set based on whether it's department or project
        onSubmit={handleAssignSubmit} // Submit the edited or newly assigned entities
        editEntity={editEntity} // Pass editEntity only if editing
      />
    </>
  );
};

export default UserDetails;
