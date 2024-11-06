import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Typography,
  Button,
  Table,
  Modal,
  Form,
  Select,
  message,
  Row,
  Col,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDetails,
  fetchProjects,
  assignProjects,
} from "../../../store/admin/employeeDetailsAdminSlice";
import { RootState, AppDispatch } from "../../../store/store"

const { Title, Text } = Typography;
const { Option } = Select;

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const [assignModalVisible, setAssignModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { employee, projects, loading } = useSelector((state: RootState) => ({
    employee: state.employeeDetailsAdminStore.employee,
    projects: state.employeeDetailsAdminStore.projects,
    loading: state.employeeDetailsAdminStore.loading,
  }));

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeDetails(id));
      dispatch(fetchProjects());
    }
  }, [dispatch, id]);

  const handleAssignProjects = async (values: { project_ids: string[]; role: string }) => {
    if (id) {
      try {
        await dispatch(assignProjects({ id, values: { project_ids: values.project_ids, role: values.role } })).unwrap();
        message.success("Projects assigned successfully.");
        setAssignModalVisible(false);
        form.resetFields();
      } catch (error) {
        message.error("Failed to assign projects. Please check your inputs and try again.");
      }
    }
  };

  if (loading) return <Spin />;

  if (!employee) return <p>Employee not found</p>;

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
      title: "Actions",
      key: "actions",
      render: (_: any, record: { id: string }) => (
        <Button
          type="link"
          onClick={() =>
            handleAssignProjects({
              project_ids: [record.id],
              role: "Default Role",
            })
          }
        >
          Assign
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Employee Details</Title>
      <Card>
        <Typography>
          <Row>
            <Col span={6}><Text strong>First Name:</Text></Col>
            <Col span={18}><Text>{employee.first_name}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text strong>Last Name:</Text></Col>
            <Col span={18}><Text>{employee.last_name}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text strong>Email:</Text></Col>
            <Col span={18}><Text>{employee.email}</Text></Col>
          </Row>
          <Row>
            <Col span={6}><Text strong>Days Off:</Text></Col>
            <Col span={18}><Text>{employee.days_off}</Text></Col>
          </Row>
        </Typography>
        <Button type="primary" onClick={() => setAssignModalVisible(true)}>
          Assign Projects
        </Button>
      </Card>

      <Modal
        title="Assign Projects"
        open={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleAssignProjects} layout="vertical">
          <Form.Item
            name="project_ids"
            label="Projects"
            rules={[{ required: true, message: "Please select at least one project" }]}
          >
            <Select mode="multiple" placeholder="Select projects">
              {projects.map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please enter a role" }]}
          >
            <Input placeholder="Enter role" />
          </Form.Item>
        </Form>
      </Modal>

      <Title level={3}>Assigned Projects</Title>
      <Table
        virtual
        scroll={{ x: 1000, y: 300 }}
        dataSource={employee.projects}
        columns={projectColumns}
        rowKey="id"
      />
    </div>
  );
};

export default EmployeeDetails;
