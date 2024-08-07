// src/components/Projects/Projects.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { ColumnsType } from "antd/es/table";
import axiosInstance from "../../api/axiosInstance";
import EditModal from "../Modal/EditModal";

interface Project {
  id: string;
  name: string;
  description: string;
  department: Department[];
}

interface Department {
  id: string;
  name: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get<Project[]>("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error("Failed to fetch projects.");
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get<Department[]>(
          "/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        message.error("Failed to fetch departments.");
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
      key: "department",
      render: (_, record) => (
        <span>{record.department.map((dept) => dept.name).join(", ")}</span>
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
    try {
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;

      await axiosInstance.delete(`/api/projects/${id}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
      message.success("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      message.error("Failed to delete project.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleEditSubmit = async (values: Record<string, any>) => {
    if (!selectedProject) return;

    try {
      await axiosInstance.put(`/api/projects/${selectedProject.id}`, values);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, ...values }
            : project
        )
      );
      message.success("Project updated successfully.");
      handleCancel();
    } catch (error) {
      console.error("Error updating project:", error);
      message.error("Failed to update project.");
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
      name: "department",
      label: "Department",
      rules: [{ required: true, message: "Please select a department!" }],
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

      <EditModal
        visible={isModalVisible}
        title="Edit Project"
        initialValues={
          selectedProject || { name: "", description: "", department: "" }
        }
        onCancel={handleCancel}
        onSubmit={handleEditSubmit}
        fields={editFields}
      />
    </div>
  );
};

export default Projects;
