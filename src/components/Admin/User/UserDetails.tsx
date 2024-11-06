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
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../../store/admin/userAdminSlice";
import { AppDispatch, RootState } from "../../../store/store"; 
import Spinner from "../../Spinner";
import UserInfo from "./UserInfo";
import AssignEditModal from "../AssignEditModal";

const { Title } = Typography;

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.userAdminStore);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assignEntityType, setAssignEntityType] = useState<
    "department" | "project"
  >("department");
  const [editEntity, setEditEntity] = useState<
    { id: string; position: string } | undefined
  >(undefined);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetails(id));
    }
  }, [dispatch, id]);

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
    (values: {
      entities: { id: string; role?: string; position?: string }[];
    }) => {
      if (user) {
        if (assignEntityType === "department") {
          const updatedDepartments = user.departments.map((dept) => {
            const updatedEntity = values.entities.find(
              (entity) => entity.id === dept.id
            );
            return updatedEntity && updatedEntity.position
              ? {
                  ...dept,
                  pivot: { ...dept.pivot, position: updatedEntity.position },
                }
              : dept;
          });
          // Dispatch update user action here if needed
        } else if (assignEntityType === "project") {
          const updatedProjects = user.projects.map((proj) => {
            const updatedEntity = values.entities.find(
              (entity) => entity.id === proj.id
            );
            return updatedEntity && updatedEntity.role
              ? {
                  ...proj,
                  projectRole: {
                    ...proj.projectRole,
                    role: updatedEntity.role,
                  },
                }
              : proj;
          });
          // Dispatch update user action here if needed
        }
      }
    },
    [assignEntityType, user]
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
            // Add API call to remove user from department or project
            // Dispatch an update user action here if needed
            message.success("User removed successfully.");
          } catch (error: any) {
            console.error(`Error removing user from ${entityType}:`, error);
            message.error(`Failed to remove the user from ${entityType}.`);
          }
        },
      });
    },
    []
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
      render: (_: string, record: any) => (
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
      {user && <UserInfo user={user} />}

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

      <AssignEditModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        parentId={user.id}
        currentAssignments={
          assignEntityType === "department" ? user.departments : user.projects
        }
        entityType={assignEntityType}
        operationType={editEntity ? "edit" : "assign"}
        scope="user"
        onSubmit={handleAssignSubmit}
        editEntity={editEntity}
      />
    </>
  );
};

export default UserDetails;
