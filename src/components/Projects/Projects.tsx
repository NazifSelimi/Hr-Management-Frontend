import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, message, Spin } from "antd";
import { ColumnsType } from "antd/es/table";
import axiosInstance from "../../api/axiosInstance";
import EditModal from "../Modal/EditModal";
import { Department, Project } from "../types";
import { useNavigate } from "react-router-dom";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<any>>
    ) => {
      try {
        const response = await axiosInstance.get(endpoint);
        setter(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error(`Error fetching ${endpoint}:`, error?.response || error);
        message.error(`Failed to fetch ${endpoint}: ${error.message}`);
      }
    },
    []
  );

  useEffect(() => {
    fetchData("/projects", setProjects);
    fetchData("/departments", setDepartments);
  }, [fetchData]);

  if (loading) return <Spin />;

  if (!projects) return <p>Projects could not be loaded</p>;

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

  const handleEditSubmit = async (values: Record<string, any>) => {
    if (!selectedProject) return;

    try {
      await axiosInstance.put(`/projects/${selectedProject.id}`, {
        name: values.name,
        description: values.description,
        department_ids: values.departments,
      });

      message.success("Project updated successfully.");
      handleCancel();
      await fetchData("/projects", setProjects);
    } catch (error: any) {
      console.error("Error updating project:", error?.response || error);
      message.error("Failed to update project: " + error.message);
    }
  };

  const showEditModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCancel = () => {
    setSelectedProject(null);
  };

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
          <Button onClick={() => navigate(`/project/${record.id}`)}>
            View
          </Button>
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
          open={!!selectedProject}
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