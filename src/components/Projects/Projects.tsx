import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { ColumnsType } from "antd/es/table";
import axiosInstance from "../../api/axiosInstance";
import EditModal from "../Modal/EditModal";

interface Department {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  departments: Department[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get<Project[]>("/projects");
        setProjects(response.data);
      } catch (error: any) {
        console.error("Error fetching projects:", error?.response || error);
        message.error("Failed to fetch projects: " + error.message);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get<Department[]>("/departments");
        setDepartments(response.data);
      } catch (error: any) {
        console.error("Error fetching departments:", error?.response || error);
        message.error("Failed to fetch departments: " + error.message);
      }
    };

    fetchProjects();
    fetchDepartments();
  }, []);

  const columns: ColumnsType<Project> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Departments",
      key: "departments",
      render: (_, record) => (
        <span>{record.departments.map((dept) => dept.name).join(", ")}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const showEditModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axiosInstance.delete(`/projects/${id}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
      message.success("Project deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting project:", error?.response || error);
      message.error("Failed to delete project: " + error.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEditSubmit = async (values: Record<string, any>) => {
    if (!selectedProject) return;

    try {
      await axiosInstance.put(`/projects/${selectedProject.id}`, values);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, ...values }
            : project
        )
      );
      message.success("Project updated successfully.");
      handleCancel();
    } catch (error: any) {
      console.error("Error updating project:", error?.response || error);
      message.error("Failed to update project: " + error.message);
    }
  };

  const editFields = [
    {
      name: "name",
      label: "Name",
      rules: [{ required: true, message: "Please input the project name!" }],
    },
    {
      name: "description",
      label: "Description",
      rules: [
        { required: true, message: "Please input the project description!" },
      ],
    },
    {
      name: "departments",
      label: "Departments",
      rules: [{ required: true, message: "Please select departments!" }],
      options: departments.map((dept) => ({
        value: dept.id,
        label: dept.name,
      })),
    },
  ];

  return (
    <div>
      <h2>Projects</h2>
      <Table dataSource={projects} columns={columns} rowKey="id" />

      {selectedProject && (
        <EditModal
          visible={isModalVisible}
          title="Edit Project"
          initialValues={{
            name: selectedProject.name,
            description: selectedProject.description,
            departments: selectedProject.departments.map((dept) => dept.id),
          }}
          onCancel={handleCancel}
          onSubmit={handleEditSubmit}
          fields={editFields}
        />
      )}
    </div>
  );
};

export default Projects;
