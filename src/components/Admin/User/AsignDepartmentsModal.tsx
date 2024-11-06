
import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message, Spin, Input, Tag } from "antd";
import axiosInstance from "../../../services/axiosInstance";
import { Department, Project, User } from "../../types";

interface AssignEntityModalProps {
  visible: boolean;
  onClose: () => void;
  entityId: string; // Can be userId, departmentId, or projectId based on usage
  existingEntities: {
    id: string;
    name: string;
    position?: string;
    role?: string;
  }[]; // Pre-assigned entities
  entityType: "user" | "department" | "project"; // Now supports "user"
  onSubmit: (values: { entities: { id: string; position: string }[] }) => void;
  editEntity?: { id: string; position: string }; // Optional for editing mode
}

const AssignEntityModal: React.FC<AssignEntityModalProps> = ({
  visible,
  onClose,
  entityId,
  existingEntities,
  entityType,
  onSubmit,
  editEntity,
}) => {
  const [entities, setEntities] = useState<Department[] | Project[] | User[]>(
    []
  );
  const [selectedEntities, setSelectedEntities] = useState<
    { id: string; position: string; isAssigned: boolean; hasEdited: boolean }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const entityTitle =
    entityType === "user"
      ? "Users"
      : entityType === "project"
      ? "Projects"
      : "Departments";

  // Fetch entities when modal becomes visible
  useEffect(() => {
    if (!visible) return;

    const fetchEntities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/${entityType}s`);
        setEntities(response.data);

        // If editing, pre-select the entity being edited
        if (editEntity) {
          setSelectedEntities([
            {
              id: editEntity.id,
              position: editEntity.position,
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

  // Reset modal state when it's closed
  useEffect(() => {
    if (!visible) {
      setSelectedEntities([]);
      setEntities([]);
    }
  }, [visible]);

  const handleEntitySelect = (selectedIds: string[]) => {
    const updatedSelection = selectedIds.map((id) => {
      // Check if the entity is already assigned (either user, department, or project)
      const assignedEntity = existingEntities.find(
        (entity) => entity.id === id
      );

      // Check if the entity is already selected
      const alreadySelected = selectedEntities.find(
        (entity) => entity.id === id
      );

      // Handle pre-filling the position for departments, role for projects, or position/role for users
      let positionOrRole = "";
      if (assignedEntity) {
        if (entityType === "department") {
          positionOrRole =
            (assignedEntity as Department)?.pivot?.position || ""; // Pre-fill position for users in departments
        } else if (entityType === "project") {
          positionOrRole = (assignedEntity as Project)?.projectRole?.role || ""; // Pre-fill role for users in projects
        } else if (entityType === "user") {
          // Cast the entity to `unknown` first, then check for pivot data
          const userEntity = assignedEntity as unknown as User;

          // Pre-fill position if user is part of a department, and role if part of a project
          positionOrRole =
            userEntity.pivot?.position || userEntity.pivot?.role || ""; // Pre-fill position from department's pivot or role from project's pivot
        }
      }

      return (
        alreadySelected || {
          id,
          position: positionOrRole, // Pre-fill the correct field (position for users/departments, role for projects)
          isAssigned: !!assignedEntity, // Mark as assigned if already in the department or project
          hasEdited: false,
        }
      );
    });

    setSelectedEntities(updatedSelection);
  };

  // Handle position/role change for a selected entity
  const handlePositionChange = (entityId: string, position: string) => {
    setSelectedEntities((prev) =>
      prev.map((entity) =>
        entity.id === entityId
          ? { ...entity, position, hasEdited: true }
          : entity
      )
    );
  };

  // Handle entity assignment (users, departments, or projects) submission
  const handleAssign = async () => {
    // Ensure all positions/roles are filled
    if (selectedEntities.some((entity) => !entity.position)) {
      message.error("Please fill all positions/roles.");
      return;
    }

    setLoading(true);
    try {
      const payloadKey =
        entityType === "user"
          ? "users"
          : entityType === "department"
          ? "departments"
          : "projects";
      const data = {
        [payloadKey]: selectedEntities.map(({ id, position }) => ({
          id,
          [entityType === "user" ? "position" : "role"]: position,
        })),
      };

      await axiosInstance.post(`/assign-${entityType}s/${entityId}`, data);
      message.success(`${entityTitle} assigned successfully!`);
      onSubmit({ entities: selectedEntities });
      onClose();
    } catch (error) {
      message.error(`Failed to assign ${entityTitle.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = editEntity
    ? `Edit ${
        entityType === "user"
          ? "User Position"
          : entityType === "department"
          ? "Department Position"
          : "Project Role"
      }`
    : `Assign ${entityTitle}`;

  return (
    <Modal
      title={modalTitle}
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
            selectedEntities.some((entity) => !entity.position) || loading
          }
        >
          {editEntity ? "Update" : "Assign"}
        </Button>,
      ]}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Select
            mode="multiple"
            placeholder={`Select ${entityTitle.toLowerCase()}`}
            style={{ width: "100%" }}
            onChange={handleEntitySelect}
            value={selectedEntities.map((entity) => entity.id)}
          >
            {entities.map((entity) => (
              <Select.Option key={entity.id} value={entity.id}>
                {entityType === "user"
                  ? `${(entity as User).first_name} ${
                      (entity as User).last_name
                    }`
                  : (entity as Department | Project).name}
                {existingEntities.some((e) => e.id === entity.id) && (
                  <Tag color="blue">Assigned</Tag>
                )}
              </Select.Option>
            ))}
          </Select>

          {selectedEntities.map((selectedEntity) => {
            let matchingEntity: User | Department | Project | undefined;

            if (entityType === "user") {
              matchingEntity = (entities as User[]).find(
                (e: User) => e.id === selectedEntity.id
              );
            } else if (entityType === "department") {
              matchingEntity = (entities as Department[]).find(
                (e: Department) => e.id === selectedEntity.id
              );
            } else if (entityType === "project") {
              matchingEntity = (entities as Project[]).find(
                (e: Project) => e.id === selectedEntity.id
              );
            }

            const entityName =
              entityType === "user"
                ? `${(matchingEntity as User)?.first_name} ${
                    (matchingEntity as User)?.last_name
                  }`
                : (matchingEntity as Department | Project)?.name;

            return (
              <div key={selectedEntity.id} style={{ marginTop: 10 }}>
                <span>{entityName}</span>
                <Input
                  placeholder="Enter position or role"
                  value={selectedEntity.position || ""} // Pre-fill position or role safely
                  onChange={(e) =>
                    handlePositionChange(selectedEntity.id, e.target.value)
                  }
                  style={{ marginLeft: 10, width: "60%" }}
                />
                {selectedEntity.isAssigned && selectedEntity.hasEdited && (
                  <p style={{ color: "orange" }}>
                    You are editing the position/role for an already assigned{" "}
                    {entityTitle.toLowerCase()}.
                  </p>
                )}
              </div>
            );
          })}
        </>
      )}
    </Modal>
  );
};

export default AssignEntityModal;
