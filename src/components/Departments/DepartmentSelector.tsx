import React from "react";
import { Select } from "antd";
import { Department } from "../types";

interface DepartmentSelectorProps {
  departments: Department[];
  selectedDepartmentIds: string[];
  onChange: (selectedIds: string[]) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartmentIds,
  onChange,
}) => {
  const handleChange = (value: string[]) => {
    onChange(value);
  };

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select departments"
      onChange={handleChange}
    >
      {departments.map((department) => (
        <Select.Option key={department.id} value={department.id}>
          {department.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DepartmentSelector;
