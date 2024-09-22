import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, message, Dropdown, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  fetchProjects,
  fetchDepartmentsApi,
  deleteProject,
  updateProject,
} from "../../../apiService";
import AssignUsersModal from "../Departments/AssignUserModal";
import EditModal from "../../Modal/EditModal";
import { Department, Project } from "../../types";
import { useNavigate } from "react-router-dom";
import {
  EllipsisOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Spinner from "../../Spinner";
import CustomTable from "../../Table/CustomTable"; // Import the custom table component

interface ProjectsProps {
  data?: Project[];
  onClose?: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ data, onClose }) => {
  const [projects, setProjects] = useState<Project[]>(data || []);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(!data?.length);
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [isAssignUsersModalVisible, setAssignUsersModalVisible] =
    useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch data using the API service
  useEffect(() => {
    if (!data) {
      const loadData = async () => {
        try {
          const fetchedProjects = await fetchProjects();
          setProjects(fetchedProjects);
          const fetchedDepartments = await fetchDepartmentsApi();
          setDepartments(fetchedDepartments);
        } catch (error) {
          console.error("Failed to fetch projects or departments:", error);
          message.error("Failed to load projects or departments.");
        } finally {
          setLoading(false);
        }
      };

      loadData();
    } else {
      setLoading(false);
    }
  }, [data]);

  const handleDelete = useCallback(async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteProject(id);
          setProjects((prev) => prev.filter((project) => project.id !== id));
          message.success("Project deleted successfully.");
        } catch (error) {
          console.error("Error deleting project:", error);
          message.error("Failed to delete project.");
        }
      },
    });
  }, []);

  const handleView = useCallback(
    (id: string) => {
      navigate(`/project/${id}`);
      if (onClose) onClose();
    },
    [navigate, onClose]
  );

  const handleEdit = useCallback((project: Project) => {
    setSelectedProject(project);
    setEditModalVisible(true);
  }, []);

  const handleEditSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (!selectedProject) return;

      try {
        // Use the new updateProject function
        await updateProject(selectedProject.id, {
          name: values.name,
          description: values.description,
          department_ids: values.departments,
        });

        message.success("Project updated successfully.");
        handleCancel();
        const updatedProjects = await fetchProjects();
        setProjects(updatedProjects);
      } catch (error: any) {
        console.error("Error updating project:", error);
        message.error("Failed to update project.");
      }
    },
    [selectedProject]
  );

  const handleCancel = useCallback(() => {
    setSelectedProject(null);
    setEditModalVisible(false);
  }, []);

  const handleAssignUsers = useCallback((project: Project) => {
    setSelectedProject(project);
    setAssignUsersModalVisible(true);
  }, []);

  const columns: ColumnsType<Project> = useMemo(
    () => [
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
                  onClick: () => handleEdit(record),
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
    ],
    [handleView, handleEdit, handleAssignUsers, handleDelete]
  );

  return (
    <div>
      <h2>Projects</h2>
      {loading ? (
        <Spinner />
      ) : (
        <CustomTable
          columns={columns}
          dataSource={projects}
          loading={loading}
          rowKey="id"
          scroll={{ x: 2000, y: 500 }} // You can pass custom scroll values here
        />
      )}
      {selectedProject && (
        <EditModal
          open={isEditModalVisible}
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
            },
          ]}
        />
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
