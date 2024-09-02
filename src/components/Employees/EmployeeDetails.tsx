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
import axiosInstance from "../../api/axiosInstance";
import { User, Project } from "../types";

const { Title, Text } = Typography;
const { Option } = Select;

//NOT FINISHED COMPONENT AND NOT USING THIS COMPONENT CURRENTLY EXPERIMENTING... !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [assignModalVisible, setAssignModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axiosInstance.get<User>(`/users/${id}`);
        setEmployee(response.data);
        console.log(response.data);
      } catch (error: any) {
        console.error("Error fetching employee details:", error);
        message.error("Failed to fetch employee details.");
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get<Project[]>("/projects");
        setProjects(response.data);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        message.error("Failed to fetch projects.");
      }
    };

    fetchEmployee();
    fetchProjects();
  }, [id]);

  const handleAssignProjects = async (values: {
    project_ids: string[];
    role: string;
  }) => {
    setLoading(true);
    try {
      await axiosInstance.post(`/employees/${id}/assign-projects`, values);
      message.success("Projects assigned successfully.");
      setAssignModalVisible(false);
      setEmployee((prev) => ({
        ...prev!,
        projects: [
          ...(prev?.projects || []),
          ...projects.filter((project) =>
            values.project_ids.includes(project.id)
          ),
        ],
      }));
    } catch (error: any) {
      console.error("Error assigning projects:", error);
      message.error("Failed to assign projects.");
    } finally {
      setLoading(false);
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
            <Col span={6}>
              <Text strong>First Name:</Text>
            </Col>
            <Col span={18}>
              <Text>{employee.first_name}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Text strong>Last Name:</Text>
            </Col>
            <Col span={18}>
              <Text>{employee.last_name}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Text strong>Email:</Text>
            </Col>
            <Col span={18}>
              <Text>{employee.email}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Text strong>Days Off:</Text>
            </Col>
            <Col span={18}>
              <Text>{employee.days_off}</Text>
            </Col>
          </Row>
        </Typography>
        <Button type="primary" onClick={() => setAssignModalVisible(true)}>
          Assign Projects
        </Button>
      </Card>

      <Modal
        title="Assign Projects"
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleAssignProjects} layout="vertical">
          <Form.Item
            name="project_ids"
            label="Projects"
            rules={[
              { required: true, message: "Please select at least one project" },
            ]}
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
        dataSource={employee.projects}
        columns={projectColumns}
        rowKey="id"
      />
    </div>
  );
};

export default EmployeeDetails;
