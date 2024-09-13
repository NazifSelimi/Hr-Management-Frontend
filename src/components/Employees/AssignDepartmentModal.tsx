import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message, Spin, Input } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Department } from "../types";

interface AssignDepartmentModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onSubmit: (values: {
    departments: { id: string; position: string }[];
  }) => void;
}

const AssignDepartmentModal: React.FC<AssignDepartmentModalProps> = ({
  visible,
  onClose,
  userId,
  onSubmit,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<
    { id: string; name: string; position: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error: any) {
        message.error("Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    if (visible) {
      fetchDepartments();
    }
  }, [visible]);

  const handleDepartmentSelect = (selectedValues: string[]) => {
    const updatedSelectedDepartments = selectedValues.map((value) => {
      const existingDepartment = selectedDepartments.find(
        (department) => department.id === value
      );
      return existingDepartment || { id: value, name: "", position: "" };
    });
    setSelectedDepartments(updatedSelectedDepartments);
  };

  const handlePositionChange = (id: string, position: string) => {
    setSelectedDepartments((prev) =>
      prev.map((dep) => (dep.id === id ? { ...dep, position } : dep))
    );
  };

  const handleAssign = async () => {
    if (selectedDepartments.some((dep) => !dep.position)) {
      message.error("Please provide a position for all selected departments");
      return;
    }

    try {
      await axiosInstance.post(`/assign-departments/${userId}`, {
        departments: selectedDepartments.map(({ id, position }) => ({
          id,
          position,
        })),
      });
      message.success("Departments assigned successfully");
      onSubmit({
        departments: selectedDepartments.map(({ id, position }) => ({
          id,
          position,
        })),
      });
      onClose();
    } catch (error) {
      message.error("Failed to assign departments");
    }
  };

  return (
    <Modal
      title="Assign Departments"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleAssign}
          disabled={loading}
        >
          Assign
        </Button>,
      ]}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <Select
            mode="multiple"
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Select Departments"
            onChange={handleDepartmentSelect}
            value={selectedDepartments.map((dep) => dep.id)}
          >
            {departments.map((department) => (
              <Select.Option key={department.id} value={department.id}>
                {department.name}
              </Select.Option>
            ))}
          </Select>
          {selectedDepartments.map((dep) => (
            <div key={dep.id} style={{ marginBottom: 8 }}>
              <span>
                {dep.name || departments.find((d) => d.id === dep.id)?.name}:
              </span>
              <Input
                placeholder="Position"
                value={dep.position}
                onChange={(e) => handlePositionChange(dep.id, e.target.value)}
                style={{ width: "100%", marginTop: 8 }}
              />
            </div>
          ))}
        </>
      )}
    </Modal>
  );
};

export default AssignDepartmentModal;
