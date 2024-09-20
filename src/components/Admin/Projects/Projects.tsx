import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, message, Dropdown, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import axiosInstance from "../../../api/axiosInstance";
import AssignUsersModal from "../Departments/AssignUserModal";
import { Project } from "../../types";
import { useNavigate } from "react-router-dom";
import {
  EllipsisOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import Spinner from "../../Spinner";

interface ProjectsProps {
  data?: Project[];
  onClose?: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ data, }) => {
  const [projects, setProjects] = useState<Project[]>(data || []);
  const [loading, setLoading] = useState<boolean>(!data?.length);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAssignUsersModalVisible, setAssignUsersModalVisible] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!data?.length) {
      fetchProjects();
    }
  }, [fetchProjects, data]);

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

  const handleView = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleAssignUsers = (project: Project) => {
    setSelectedProject(project);
    setAssignUsersModalVisible(true);
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
          {record.departments?.map((dept) => dept.name).join(", ") || "No departments"}
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
                key: "assignUsers",
                label: (
                  <>
                    <UserAddOutlined /> Assign Users
                  </>
                ),
                onClick: () => handleAssignUsers(record),
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
        <Table dataSource={projects} columns={columns} rowKey="id" />
      )}
      {isAssignUsersModalVisible && (
        <AssignUsersModal
          visible={isAssignUsersModalVisible}
          project={selectedProject?.id}
          onClose={() => setAssignUsersModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Projects;
