import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Button,
  Modal,
} from "antd";
import { EllipsisOutlined, UserAddOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import { User } from "../../types";
import Spinner from "../../Spinner";
import AssignEntityModal from "./AsignDepartmentsModal";

const { Title, Text } = Typography;

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
        message.error("Failed to fetch user details.");
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

          return { ...prevUser, departments: updatedDepartments };
        } else {
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

          return { ...prevUser, projects: updatedProjects };
        }
      });
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
            : record.projectRole.role,
      };

      setAssignEntityType(entityType);
      setIsAssignModalVisible(true);
      setEditEntity(editEntity);
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
            message.error(`Failed to remove the user from ${entityType}.`);
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
              onClick={() => openAssignModal("department")}
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
      {/* Display for Departments */}
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
      {/* Display for Projects */}
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

      {/* Reusable Modal for assigning departments or projects */}
      <AssignEntityModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        userId={user.id}
        userEntities={
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
