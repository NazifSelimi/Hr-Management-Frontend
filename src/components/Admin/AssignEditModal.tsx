import React, { useEffect, useState } from "react";
import { Modal, Select, Button, message, Spin, Input, Tag } from "antd";
import axiosInstance from "../../services/axiosInstance";
import { Department, Project, User } from "../types";

interface AssignEditModalProps {
  visible: boolean;
  onClose: () => void;
  parentId: string;
  entityType: "user" | "project" | "department";
  operationType: "assign" | "edit";
  scope: "department" | "project" | "user";
  currentAssignments: any[];
  editEntity?: { id: string; role?: string; position?: string };
  onSubmit: (values: {
    entities: { id: string; role?: string; position?: string }[];
  }) => void;
}

const AssignEditModal: React.FC<AssignEditModalProps> = ({
  visible,
  onClose,
  parentId,
  entityType,
  operationType,
  scope,
  currentAssignments,
  editEntity,
  onSubmit,
}) => {
  const [entities, setEntities] = useState<User[] | Department[] | Project[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEntities, setSelectedEntities] = useState<
    {
      id: string;
      role?: string;
      position?: string;
      isAssigned: boolean;
      hasEdited: boolean;
    }[]
  >([]);

  const entityTitle =
    entityType === "user"
      ? "Users"
      : entityType === "project"
      ? "Projects"
      : "Departments";

  // Determine if the current assignment requires a role or position
  const requiresRoleOrPosition = !(
    (entityType === "project" && scope === "department") ||
    (entityType === "department" && scope === "project")
  );

  const getEndpoint = () => {
    if (operationType === "edit") {
      // Dummy endpoint for editing role or position
      return "/edit-role-or-position";
    }

    // Determine the endpoint for assignments based on entityType and scope
    if (entityType === "department" && scope === "department") {
      console.log(entityType, scope, `assign-departments/${parentId}`);
      return `assign-departments/${parentId}`; // Assigning a department to a user
      console.log(entityType, scope, `assign-departments/${parentId}`);
    } else if (entityType === "project" && scope === "project") {
      return `assign-projects/${parentId}`; // Assigning a project to a user
      console.log(entityType, scope, `assign-projects/${parentId}`);
    } else if (entityType === "user" && scope === "department") {
      return `/assign-users-departments/${parentId}`; // Assigning a user to a department
      console.log(entityType, scope, `/assign-users-departments/${parentId}`);
    } else if (entityType === "user" && scope === "project") {
      return `/assign-users-projects/${parentId}`; // Assigning a user to a project
      console.log(entityType, scope, `/assign-users-projects/${parentId}`);
    } else if (entityType === "project" && scope === "department") {
      return `/assign-projects-departments/${parentId}`; // Assigning a project to a department
      console.log(
        entityType,
        scope,
        `/assign-projects-departments/${parentId}`
      );
    } else if (entityType === "department" && scope === "project") {
      return `/assign-departments-projects/${parentId}`; // Assigning a department to a project
      console.log(
        entityType,
        scope,
        `/assign-departments-projects/${parentId}`
      );
    }

    return ""; // If no match found, return empty string
  };

  useEffect(() => {
    if (!visible) return;

    const fetchEntities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          entityType === "user"
            ? "/users"
            : entityType === "project"
            ? "/projects"
            : "/departments"
        );
        setEntities(response.data);

        if (editEntity) {
          setSelectedEntities([
            {
              id: editEntity.id,
              role: editEntity.role || "",
              position: editEntity.position || "",
              isAssigned: true,
              hasEdited: false,
            },
          ]);
        }
      } catch (error) {
        message.error(`Failed to load ${entityTitle.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [visible, entityType, editEntity]);

  useEffect(() => {
    if (!visible) {
      setSelectedEntities([]);
      setEntities([]);
    }
  }, [visible]);

  const handleEntitySelect = (selectedValues: string[]) => {
    const updatedSelectedEntities = selectedValues.map((id) => {
      const isAssigned = currentAssignments.some(
        (entity: { id: string }) => entity.id === id
      );

      const existingEntity = selectedEntities.find(
        (entity) => entity.id === id
      );

      if (existingEntity) {
        return existingEntity;
      }

      const assignedEntity = currentAssignments.find(
        (assignment) => assignment.id === id
      );

      return {
        id,
        role: assignedEntity?.pivot?.role || "",
        position: assignedEntity?.pivot?.position || "",
        isAssigned,
        hasEdited: false,
      };
    });

    setSelectedEntities(updatedSelectedEntities);
  };

  const handlePositionOrRoleChange = (entityId: string, value: string) => {
    setSelectedEntities((prev) =>
      prev.map((entity) =>
        entity.id === entityId
          ? {
              ...entity,
              ...(scope === "project" ? { role: value } : { position: value }),
              hasEdited: true,
            }
          : entity
      )
    );
  };

  const handleAssign = async () => {
    // Skip validation if role or position is not required
    if (
      requiresRoleOrPosition &&
      selectedEntities.some(
        (entity) =>
          (scope === "project" && !entity.role) ||
          (scope !== "project" && !entity.position)
      )
    ) {
      message.error(`Please fill in all roles or positions.`);
      return;
    }

    try {
      setLoading(true);
      const data = {
        [entityType === "user"
          ? "users"
          : entityType === "project"
          ? "projects"
          : "departments"]: selectedEntities.map(({ id, role, position }) => ({
          id,
          ...(requiresRoleOrPosition
            ? scope === "project"
              ? { role }
              : { position }
            : {}),
        })),
      };

      const endpoint = getEndpoint();
      console.log(endpoint);
      if (endpoint) {
        await axiosInstance.post(endpoint, data);
        message.success(`${entityTitle} assigned successfully!`);
        onSubmit({ entities: selectedEntities });
        onClose();
      } else {
        message.error("Failed to determine the appropriate endpoint.");
      }
    } catch (error) {
      message.error(`Failed to assign ${entityTitle.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        operationType === "edit"
          ? `Edit ${entityTitle}`
          : `Assign ${entityTitle}`
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="assign"
          type="primary"
          onClick={handleAssign}
          disabled={
            loading ||
            (requiresRoleOrPosition &&
              selectedEntities.some(
                (entity) =>
                  (scope === "project" && !entity.role) ||
                  (scope !== "project" && !entity.position)
              ))
          }
        >
          {operationType === "edit" ? "Save Changes" : "Assign"}
        </Button>,
      ]}
    >
      {loading ? (
        <Spin size="large" style={{ display: "block", textAlign: "center" }} />
      ) : (
        <>
          <Select
            mode="multiple"
            placeholder={`Select ${entityTitle.toLowerCase()}`}
            style={{ width: "100%" }}
            showSearch
            onChange={handleEntitySelect}
            value={selectedEntities.map((entity) => entity.id)}
          >
            {entities.map((entity) => (
              <Select.Option key={entity.id} value={entity.id}>
                {"name" in entity
                  ? entity.name
                  : `${(entity as User).first_name} ${
                      (entity as User).last_name
                    }`}{" "}
                {currentAssignments.some(
                  (assignment) => assignment.id === entity.id
                ) && <Tag color="blue">Assigned</Tag>}
              </Select.Option>
            ))}
          </Select>

          {requiresRoleOrPosition &&
            selectedEntities.map((entity) => (
              <div key={entity.id} style={{ marginTop: 10 }}>
                <label
                  htmlFor={`position-${entity.id}`}
                  style={{ display: "block" }}
                >
                  {entityTitle === "Departments"
                    ? (entities as Department[]).find((e) => e.id === entity.id)
                        ?.name
                    : entityTitle === "Projects"
                    ? (entities as Project[]).find((e) => e.id === entity.id)
                        ?.name
                    : `${
                        (entities as User[]).find((e) => e.id === entity.id)
                          ?.first_name
                      } ${
                        (entities as User[]).find((e) => e.id === entity.id)
                          ?.last_name
                      }`}
                </label>
                <Input
                  id={`position-${entity.id}`}
                  placeholder={`Enter ${
                    scope === "project" ? "role" : "position"
                  }`}
                  value={scope === "project" ? entity.role : entity.position}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePositionOrRoleChange(entity.id, e.target.value)
                  }
                  style={{ marginLeft: 10, width: "60%" }}
                />
                {entity.isAssigned && entity.hasEdited && (
                  <p style={{ color: "orange" }}>
                    You are updating the {entityTitle} for an already assigned{" "}
                    {entityType}.
                  </p>
                )}
              </div>
            ))}
        </>
      )}
    </Modal>
  );
};

export default AssignEditModal;