import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, message, Dropdown, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import axiosInstance from "../../api/axiosInstance";
import EditModal from "../Modal/EditModal";
import { Department, Project } from "../types";
import { useNavigate } from "react-router-dom";
import {
  EllipsisOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Spinner from "../Spinner";

interface ProjectsProps {
  data?: Project[];
  onClose?: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ data, onClose }) => {
  const [projects, setProjects] = useState<Project[]>(data || []);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(!data);
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<any>>
    ) => {
      try {
        const { data } = await axiosInstance.get(endpoint);
        setter(data);
      } catch (error: any) {
        console.error(`Error fetching ${endpoint}:`, error);
        message.error(`Failed to fetch ${endpoint}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!data) {
      fetchData("/projects", setProjects);
      fetchData("/departments", setDepartments);
    } else {
      setLoading(false);
    }
  }, [data, fetchData]);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/projects/${id}`);
          setProjects((prev) => prev.filter((project) => project.id !== id));
          message.success("Project deleted successfully.");
        } catch (error: any) {
          console.error("Error deleting project:", error);
          message.error("Failed to delete project.");
        }
      },
    });
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
      fetchData("/projects", setProjects);
    } catch (error: any) {
      console.error("Error updating project:", error);
      message.error("Failed to update project.");
    }
  };

  const handleCancel = () => setSelectedProject(null);

  const handleView = (id: string) => {
    navigate(`/project/${id}`);
    if (onClose) onClose();
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
        <span>
          {record.departments?.map((dept) => dept.name).join(", ") ||
            "No departments"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: (
                  <>
                    <EyeOutlined /> View
                  </>
                ),
                onClick: () => handleView(record.id),
              },
              {
                key: "edit",
                label: (
                  <>
                    <EditOutlined /> Edit
                  </>
                ),
                onClick: () => setSelectedProject(record),
              },
              {
                key: "delete",
                label: (
                  <>
                    <DeleteOutlined /> Delete
                  </>
                ),
                onClick: () => handleDelete(record.id),
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="link"
            icon={<EllipsisOutlined style={{ fontSize: "35px" }} />}
            style={{ padding: "0", height: "auto" }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <h2>Projects</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          virtual
          scroll={{ x: 2000, y: 500 }}
          dataSource={projects}
          columns={columns}
          rowKey="id"
        />
      )}
      {selectedProject && (
        <EditModal
          open={!!selectedProject}
          title="Edit Project"
          initialValues={{
            name: selectedProject.name,
            description: selectedProject.description,
            departments:
              selectedProject.departments?.map((dept) => dept.id) || [],
          }}
          onCancel={handleCancel}
          onSubmit={handleEditSubmit}
          fields={[
            {
              name: "name",
              label: "Name",
              rules: [
                { required: true, message: "Please input the project name!" },
              ],
            },
            {
              name: "description",
              label: "Description",
              rules: [
                { required: true, message: "Please edit the description!" },
              ],
            },
            {
              name: "departments",
              label: "Departments",
              rules: [
                { required: true, message: "Please select the departments!" },
              ],
              options: departments.map((dept) => ({
                value: dept.id,
                label: dept.name,
              })),
            }
          ]}
        />
      )}
    </div>
  );
};

export default Projects;
