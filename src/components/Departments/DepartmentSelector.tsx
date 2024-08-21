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
  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select departments"
      value={selectedDepartmentIds}
      onChange={onChange}
    >
      {departments.map((department) => (
        <Select.Option key={department.id} value={department.id}>
          <div>
            <strong>{department.name}</strong>
            <br />
            <small>{department.description}</small>
          </div>
        </Select.Option>
      ))}
    </Select> 
  );
};

export default DepartmentSelector;
