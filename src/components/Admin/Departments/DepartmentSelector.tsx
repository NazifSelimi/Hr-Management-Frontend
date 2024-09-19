import React from "react";
import { Select } from "antd";
import { Department } from "../../types";

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
      placeholder="Select departments"
      value={selectedDepartmentIds}
      onChange={handleChange}
      style={{ width: "100%" }}
    >
      {departments.map((dept) => (
        <Select.Option key={dept.id} value={dept.id}>
          {dept.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DepartmentSelector;
