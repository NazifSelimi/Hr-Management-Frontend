import { useState } from "react";
import CreateDepartmentForm from "./CreateDepartmentform";
import { Button } from "antd";

function CreateDepartamentView() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const handleCreateClick = () => {
    setShowForm(true); 
  };

  const handleFormClose = () => {
    setShowForm(false); 
  };
  return (
    <div>
      <Button type="primary" onClick={handleCreateClick}>
        Create Department
      </Button>
      {showForm && (
        <div style={{ marginTop: 20 }}>
          <CreateDepartmentForm onClose={handleFormClose} />
        </div>
      )}
    </div>
  )
}

export default CreateDepartamentView