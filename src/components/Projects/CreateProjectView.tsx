import React from "react";
import CreateProjectForm from "./CreateProjectForm";
import ButtonComponent from "../Button/Button";

const CreateProjectView: React.FC = () => {
  const departments = [
    { id: 1, name: "HR" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Sales" },
  ];

  const handleSubmit = async (values: {
    name: string;
    description: string;
    department_id: number;
  }) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert("Project created successfully!");
        // Optionally, reset the form or redirect
      } else {
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project.");
    }
  };

  return (
    <>
      <CreateProjectForm departments={departments} onSubmit={handleSubmit} />
    </>
  );
};

export default CreateProjectView;
