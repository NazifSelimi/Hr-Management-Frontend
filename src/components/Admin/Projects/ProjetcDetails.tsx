import React, { useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
} from 'antd';
import { EllipsisOutlined, UserAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "../../../store/store";
import { fetchProject, clearProject } from '../../../store/admin/projectDetailsAdminSlice';
import Spinner from '../../Spinner';
import AssignEditModal from '../AssignEditModal';

const { Title, Text } = Typography;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { project, loading } = useSelector((state: RootState) => state.projectDetailsAdminStore);
  const [isAssignModalVisible, setIsAssignModalVisible] = React.useState(false);
  const [assignEntityType, setAssignEntityType] = React.useState<'user' | 'department'>('user');
  const [editEntity, setEditEntity] = React.useState<{ id: string; role?: string } | undefined>(undefined);

  useEffect(() => {
    if (id) dispatch(fetchProject(id));
    return () => {
      dispatch(clearProject());
    };
  }, [dispatch, id]);

  const openAssignModal = useCallback((entityType: 'user' | 'department') => {
    setAssignEntityType(entityType);
    setEditEntity(undefined);
    setIsAssignModalVisible(true);
  }, []);

  const closeAssignModal = useCallback(() => {
    setIsAssignModalVisible(false);
    setEditEntity(undefined);
  }, []);

  const handleAssignSubmit = async (values: { entities: { id: string; role?: string }[] }) => {
    // Add your Redux logic for handling assignments here
    message.success('Users assigned successfully!');
    closeAssignModal();
  };

  const handleEditRole = useCallback(
    (record: any, entityType: 'user' | 'department') => {
      const editEntity = {
        id: record.id,
        role: entityType === 'user' ? record.projectRole?.role : undefined,
      };
      setAssignEntityType(entityType);
      setIsAssignModalVisible(true);
      setEditEntity(editEntity);
    },
    []
  );

  const handleRemoveEntity = useCallback(
    async (record: any, entityType: 'user' | 'department') => {
      Modal.confirm({
        title: `Are you sure you want to remove this ${entityType} from the project?`,
        content: 'This action cannot be undone.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          // Add your Redux logic for removing entities here
          message.success(`${entityType} removed successfully.`);
        },
      });
    },
    []
  );

  const actionMenu = useMemo(
    () => (record: any, entityType: 'user' | 'department') => [
      {
        key: '1',
        label: (
          <div onClick={() => handleEditRole(record, entityType)}>
            Edit Role
          </div>
        ),
      },
      {
        key: '2',
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
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    { title: 'E-mail', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      key: 'role',
      render: (_: any, record: any) => record.pivot?.role,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown menu={{ items: actionMenu(record, 'user') }} trigger={['click']}>
          <Button type="link" icon={<EllipsisOutlined style={{ fontSize: '24px' }} />} style={{ padding: '0', height: 'auto' }} />
        </Dropdown>
      ),
    },
  ];

  const departmentColumns = [
    { title: 'Department Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown menu={{ items: actionMenu(record, 'department') }} trigger={['click']}>
          <Button type="link" icon={<EllipsisOutlined style={{ fontSize: '24px' }} />} style={{ padding: '0', height: 'auto' }} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ textAlign: 'center' }}>
        Project Details
      </Title>
      <Card style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: '18px' }}>Name:</Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: '18px' }}>{project.name}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={6}>
            <Text strong style={{ fontSize: '18px' }}>Description:</Text>
          </Col>
          <Col span={18}>
            <Text style={{ fontSize: '18px' }}>{project.description}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Departments in this Project</Title>
            <Row justify="end" style={{ marginBottom: '10px' }}>
              <Button type="primary" icon={<UserAddOutlined />} onClick={() => openAssignModal('department')}>Assign Department</Button>
            </Row>
            <Table dataSource={project.departments} columns={departmentColumns} rowKey="id" pagination={false} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4}>Users in this Project</Title>
            <Row justify="end" style={{ marginBottom: '10px' }}>
              <Button type="primary" icon={<UserAddOutlined />} onClick={() => openAssignModal('user')}>Assign User</Button>
            </Row>
            <Table dataSource={project.users} columns={userColumns} rowKey="id" />
          </Col>
        </Row>
      </Card>

      <AssignEditModal
        visible={isAssignModalVisible}
        onClose={closeAssignModal}
        parentId={id || ''}
        entityType={assignEntityType}
        operationType={editEntity ? 'edit' : 'assign'}
        scope="project"
        currentAssignments={assignEntityType === 'user' ? project.users : project.departments}
        editEntity={editEntity}
        onSubmit={handleAssignSubmit}
      />
    </>
  );
};

export default ProjectDetails;
