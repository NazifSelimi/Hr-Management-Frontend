import React, { useState, useEffect } from "react";
import { Modal, Select, Input, Button, Form } from "antd";
import axiosInstance from "../../../services/axiosInstance";

interface Department {
  id: number;
  name: string;
}

interface SelectedDepartment {
  departmentId: number;
  position: string;
}

interface AssignDepartmentsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (departments: SelectedDepartment[]) => void;
}

const AssignDepartmentsModal: React.FC<AssignDepartmentsModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<
    SelectedDepartment[]
  >([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axiosInstance.get("/departments"); // Fetch departments from backend
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    if (visible) {
      fetchDepartments(); // Fetch departments when the modal becomes visible
    }
  }, [visible]);

  const handleSelectDepartment = (departmentId: number) => {
    if (!selectedDepartments.find((dep) => dep.departmentId === departmentId)) {
      setSelectedDepartments([
        ...selectedDepartments,
        { departmentId, position: "" },
      ]);
    }
  };

  const handlePositionChange = (departmentId: number, value: string) => {
    setSelectedDepartments(
      selectedDepartments.map((dep) =>
        dep.departmentId === departmentId ? { ...dep, position: value } : dep
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedDepartments);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title="Assign Departments"
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Select Department">
          <Select
            placeholder="Select a department"
            onSelect={(value) => handleSelectDepartment(value as number)}
          >
            {departments.map((department) => (
              <Select.Option key={department.id} value={department.id}>
                {department.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedDepartments.map((dep, index) => (
          <Form.Item
            key={index}
            label={`Position for ${
              departments.find((d) => d.id === dep.departmentId)?.name
            }`}
          >
            <Input
              value={dep.position}
              onChange={(e) =>
                handlePositionChange(dep.departmentId, e.target.value)
              }
              placeholder="Enter position"
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AssignDepartmentsModal;
