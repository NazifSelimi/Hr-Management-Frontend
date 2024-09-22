import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, message, Dropdown, Modal } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AssignUsersModal from "./AssignUserModal";
import EditModal from "../../Modal/EditModal"; // Import EditModal
import { Department } from "../../types";
import Spinner from "../../Spinner";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../Table/CustomTable"; // Assuming this is your custom table component
import {
  fetchDepartmentsApi,
  deleteDepartmentApi,
  updateDepartmentApi,
} from "../../../apiService"; // Add updateDepartmentApi

const DepartmentsList: React.FC<{
  data?: Department[];
  onClose?: () => void;
}> = ({ data, onClose }) => {
  const [departments, setDepartments] = useState<Department[]>(data || []);
  const [loading, setLoading] = useState<boolean>(!data?.length);
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [isAssignUsersModalVisible, setAssignUsersModalVisible] =
    useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const navigate = useNavigate();

  // Fetch departments if not provided
  useEffect(() => {
    if (!data) {
      const loadData = async () => {
        try {
          const fetchedDepartments = await fetchDepartmentsApi();
          setDepartments(fetchedDepartments);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
          message.error("Failed to load departments.");
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
      title: "Are you sure you want to delete this department?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteDepartmentApi(id);
          setDepartments((prev) => prev.filter((dept) => dept.id !== id));
          message.success("Department deleted successfully.");
        } catch (error) {
          console.error("Error deleting department:", error);
          message.error("Failed to delete department.");
        }
      },
    });
  }, []);

  const handleView = useCallback(
    (id: string) => {
      navigate(`/departments/${id}`);
      if (onClose) onClose();
    },
    [navigate, onClose]
  );

  const handleEdit = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setEditModalVisible(true);
  }, []);

  const handleEditSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (!selectedDepartment) return;

      try {
        await updateDepartmentApi(selectedDepartment.id, {
          name: values.name,
        });

        message.success("Department updated successfully.");
        handleCancel();
        const updatedDepartments = await fetchDepartmentsApi();
        setDepartments(updatedDepartments);
      } catch (error: any) {
        console.error("Error updating department:", error);
        message.error("Failed to update department.");
      }
    },
    [selectedDepartment]
  );

  const handleCancel = useCallback(() => {
    setSelectedDepartment(null);
    setEditModalVisible(false);
  }, []);

  const handleAssignUsers = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setAssignUsersModalVisible(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Department) => (
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
            />
          </Dropdown>
        ),
      },
    ],
    [handleView, handleEdit, handleAssignUsers, handleDelete]
  );

  return (
    <div>
      <h2>Departments</h2>
      {loading ? (
        <Spinner />
      ) : (
        <CustomTable
          dataSource={departments}
          columns={columns}
          loading={!departments.length}
          rowKey="id"
        />
      )}
      {isEditModalVisible && selectedDepartment && (
        <EditModal
          open={isEditModalVisible}
          title="Edit Department"
          initialValues={{
            name: selectedDepartment.name,
          }}
          onCancel={handleCancel}
          onSubmit={handleEditSubmit}
          fields={[
            {
              name: "name",
              label: "Department Name",
              rules: [
                {
                  required: true,
                  message: "Please input the department name!",
                },
              ],
            },
          ]}
        />
      )}
      {isAssignUsersModalVisible && (
        <AssignUsersModal
          visible={isAssignUsersModalVisible}
          onClose={() => setAssignUsersModalVisible(false)}
          department={selectedDepartment?.id}
        />
      )}
    </div>
  );
};

export default DepartmentsList;
