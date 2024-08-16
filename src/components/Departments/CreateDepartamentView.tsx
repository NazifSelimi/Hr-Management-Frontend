import React, { useState } from "react";
import { Button, message, Spin } from "antd";
import CreateDepartmentForm from "./CreateDepartmentform";

const CreateDepartmentView: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleDepartmentCreated = () => {
    setShowForm(false);
    message.success("Department created successfully.");
  };

  return (
    <div>
      <h2>Create Department</h2>
      {loading ? (
        <Spin tip="Creating department..." />
      ) : (
        <div>
          {showForm ? (
            <CreateDepartmentForm onDepartmentCreated={handleDepartmentCreated} />
          ) : (
            <Button type="primary" onClick={handleCreateClick} style={{ backgroundColor: '#60993E', borderColor: '#60993E' }}>
              Create New Department
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateDepartmentView;
