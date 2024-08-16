import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateDepartmentForm from "./CreateDepartmentform";
const CreateDepartmentView: React.FC = () => {
  const [isDepartmentCreated, setIsDepartmentCreated] = useState(false);
  const navigate = useNavigate();

  const handleDepartmentCreated = () => {
    setIsDepartmentCreated(true);
  };

  const handleViewDepartments = () => {
    navigate("/departments");
  };

  return (
    <div>
      <h2>Create Department</h2>
      <CreateDepartmentForm onDepartmentCreated={handleDepartmentCreated} />

      {isDepartmentCreated && (
        <button
          style={{
            backgroundColor: "#60993E",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          onClick={handleViewDepartments}
        >
          View Departments
        </button>
      )}
    </div>
  );
};

export default CreateDepartmentView;
