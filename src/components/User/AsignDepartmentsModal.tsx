import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message, Spin, Input, Tag } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Department, Project } from "../types"; // Import Project type similarly to Department

interface AssignEntityModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userEntities:
    | { id: string; name: string; pivot: { position: string } }[]
    | { id: string; name: string; projectRole: { role: string } }[];
  entityType: "department" | "project";
  onSubmit: (values: { entities: { id: string; position: string }[] }) => void;
  editEntity?: { id: string; position: string }; // Optional prop for editing
}

const AssignEntityModal: React.FC<AssignEntityModalProps> = ({
  visible,
  onClose,
  userId,
  userEntities, // Get user's existing departments or projects
  entityType, // "department" or "project"
  onSubmit,
  editEntity,
}) => {
  const [entities, setEntities] = useState<Department[] | Project[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<
    { id: string; position: string; isAssigned: boolean; hasEdited: boolean }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Dynamic title based on entityType
  const entityTitle = entityType === "department" ? "Departments" : "Projects";

  useEffect(() => {
    if (!visible) return;

    const fetchEntities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/${entityType}s`); // Fetch departments or projects dynamically
        setEntities(response.data);

        // If editing, pre-populate the selected entity and its position/role
        if (editEntity) {
          const preSelectedEntity = {
            id: editEntity.id,
            position: editEntity.position,
            isAssigned: true,
            hasEdited: false,
          };
          setSelectedEntities([preSelectedEntity]); // Pre-populate with the entity being edited
        }
      } catch (error) {
        message.error(`Failed to load ${entityTitle.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [visible, entityType, editEntity]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!visible) {
      setSelectedEntities([]); // Reset selected entities
      setEntities([]); // Reset the entities list
    }
  }, [visible]);

  const handleEntitySelect = (selectedValues: string[]) => {
    const updatedSelectedEntities = selectedValues.map((id) => {
      const isAssigned = userEntities.some(
        (entity: { id: string }) => entity.id === id
      ); // Explicit type for entity.id

      const existingEntity = selectedEntities.find(
        (entity) => entity.id === id
      );

      return (
        existingEntity || {
          id,
          position: isAssigned
            ? (entityType === "department"
                ? (
                    userEntities as {
                      id: string;
                      pivot: { position: string };
                    }[]
                  ).find((entity) => entity.id === id)?.pivot.position
                : (
                    userEntities as {
                      id: string;
                      projectRole: { role: string };
                    }[]
                  ).find((entity) => entity.id === id)?.projectRole.role) || ""
            : "",
          isAssigned,
          hasEdited: false,
        }
      );
    });
    setSelectedEntities(updatedSelectedEntities);
  };

  const handlePositionChange = (entityId: string, position: string) => {
    setSelectedEntities((prev) =>
      prev.map((entity) =>
        entity.id === entityId
          ? { ...entity, position, hasEdited: true }
          : entity
      )
    );
  };

  const handleAssign = async () => {
    // Check for missing fields (position for departments, role for projects)
    const missingFields = selectedEntities.some(
      (entity) =>
        entityType === "department" ? !entity.position : !entity.position // Change `position` to `role` for projects
    );

    if (missingFields) {
      message.error(
        `Please fill in all ${
          entityType === "department" ? "positions" : "roles"
        }.`
      );
      return;
    }

    setLoading(true);
    try {
      // Dynamically set either 'departments' or 'projects' as the payload key
      const payloadKey =
        entityType === "department" ? "departments" : "projects";

      // Modify the payload based on entityType (position for departments, role for projects)
      const data = {
        [payloadKey]: selectedEntities.map(({ id, position }) => ({
          id,
          [entityType === "department" ? "position" : "role"]: position, // Use 'position' for departments and 'role' for projects
        })),
      };

      await axiosInstance.post(`/assign-${entityType}s/${userId}`, data);
      message.success(
        `${entityTitle} and ${
          entityType === "department" ? "positions" : "roles"
        } assigned successfully!`
      );
      onSubmit({ entities: selectedEntities });
      onClose();
    } catch (error) {
      message.error(`Failed to assign ${entityTitle.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = editEntity
    ? `Editing ${entityType === "department" ? "Department" : "Project"}` // Show "Editing Department" or "Editing Project"
    : `Assign ${entityType === "department" ? "Department" : "Project"}`;
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
            loading || selectedEntities.some((entity) => !entity.position)
          }
        >
          Assign
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
          <Spin
            size="large"
            aria-label={`Loading ${entityTitle.toLowerCase()}`}
          />
        </div>
      ) : (
        <>
          <Select
            mode="multiple"
            placeholder={`Select ${entityTitle.toLowerCase()}`}
            style={{ width: "100%" }}
            showSearch
            onChange={handleEntitySelect}
            value={selectedEntities.map((entity) => entity.id)}
            aria-label={`${entityTitle} selection`}
          >
            {entities.map((entity) => (
              <Select.Option key={entity.id} value={entity.id}>
                {entity.name}{" "}
                {userEntities.some(
                  (userEntity) => userEntity.id === entity.id
                ) && <Tag color="blue">Assigned</Tag>}
              </Select.Option>
            ))}
          </Select>

          {selectedEntities.map((entity) => (
            <div key={entity.id} style={{ marginTop: 10 }}>
              <label
                htmlFor={`position-${entity.id}`}
                style={{ display: "block" }}
              >
                {entityType === "department"
                  ? (entities as Department[]).find((e) => e.id === entity.id)
                      ?.name
                  : (entities as Project[]).find((e) => e.id === entity.id)
                      ?.name}
              </label>
              <Input
                id={`position-${entity.id}`}
                placeholder="Enter position"
                value={entity.position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePositionChange(entity.id, e.target.value)
                }
                style={{ marginLeft: 10, width: "60%" }}
                aria-label={`Position for ${
                  entityType === "department"
                    ? (entities as Department[]).find((e) => e.id === entity.id)
                        ?.name
                    : (entities as Project[]).find((e) => e.id === entity.id)
                        ?.name
                }`}
              />
              {entity.isAssigned && entity.hasEdited && (
                <p style={{ color: "orange" }}>
                  You are updating the position for an already assigned{" "}
                  {entityTitle.toLowerCase()}.
                </p>
              )}
            </div>
          ))}
        </>
      )}
    </Modal>
  );
};

export default AssignEntityModal;
