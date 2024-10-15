// import React, { useState, useEffect } from "react";
// import { Modal, Select, Button, message, Spin, Input, Tag } from "antd";
// import axiosInstance from "../../../api/axiosInstance";
// import { Department, Project } from "../../types"; // Import Project type similarly to Department

// interface AssignEntityModalProps {
//   visible: boolean;
//   onClose: () => void;
//   userId: string;
//   userEntities:
//     | { id: string; name: string; pivot: { position: string } }[]
//     | { id: string; name: string; projectRole: { role: string } }[];
//   entityType: "department" | "project";
//   onSubmit: (values: { entities: { id: string; position: string }[] }) => void;
//   editEntity?: { id: string; position: string }; // Optional prop for editing
// }

// const AssignEntityModal: React.FC<AssignEntityModalProps> = ({
//   visible,
//   onClose,
//   userId,
//   userEntities, // Get user's existing departments or projects
//   entityType, // "department" or "project"
//   onSubmit,
//   editEntity,
// }) => {
//   const [entities, setEntities] = useState<Department[] | Project[]>([]);
//   const [selectedEntities, setSelectedEntities] = useState<
//     { id: string; position: string; isAssigned: boolean; hasEdited: boolean }[]
//   >([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Dynamic title based on entityType
//   const entityTitle = entityType === "department" ? "Departments" : "Projects";

//   useEffect(() => {
//     if (!visible) return;

//     const fetchEntities = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/${entityType}s`); // Fetch departments or projects dynamically
//         setEntities(response.data);

//         // If editing, pre-populate the selected entity and its position/role
//         if (editEntity) {
//           const preSelectedEntity = {
//             id: editEntity.id,
//             position: editEntity.position,
//             isAssigned: true,
//             hasEdited: false,
//           };
//           setSelectedEntities([preSelectedEntity]); // Pre-populate with the entity being edited
//         }
//       } catch (error) {
//         message.error(`Failed to load ${entityTitle.toLowerCase()}.`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEntities();
//   }, [visible, entityType, editEntity]);

//   // Reset state when modal is closed
//   useEffect(() => {
//     if (!visible) {
//       setSelectedEntities([]); // Reset selected entities
//       setEntities([]); // Reset the entities list
//     }
//   }, [visible]);

//   const handleEntitySelect = (selectedValues: string[]) => {
//     const updatedSelectedEntities = selectedValues.map((id) => {
//       const isAssigned = userEntities.some(
//         (entity: { id: string }) => entity.id === id
//       ); // Explicit type for entity.id

//       const existingEntity = selectedEntities.find(
//         (entity) => entity.id === id
//       );

//       return (
//         existingEntity || {
//           id,
//           position: isAssigned
//             ? (entityType === "department"
//                 ? (
//                     userEntities as {
//                       id: string;
//                       pivot: { position: string };
//                     }[]
//                   ).find((entity) => entity.id === id)?.pivot.position
//                 : (
//                     userEntities as {
//                       id: string;
//                       projectRole: { role: string };
//                     }[]
//                   ).find((entity) => entity.id === id)?.projectRole.role) || ""
//             : "",
//           isAssigned,
//           hasEdited: false,
//         }
//       );
//     });
//     setSelectedEntities(updatedSelectedEntities);
//   };

//   const handlePositionChange = (entityId: string, position: string) => {
//     setSelectedEntities((prev) =>
//       prev.map((entity) =>
//         entity.id === entityId
//           ? { ...entity, position, hasEdited: true }
//           : entity
//       )
//     );
//   };

//   const handleAssign = async () => {
//     // Check for missing fields (position for departments, role for projects)
//     const missingFields = selectedEntities.some(
//       (entity) =>
//         entityType === "department" ? !entity.position : !entity.position // Change `position` to `role` for projects
//     );

//     if (missingFields) {
//       message.error(
//         `Please fill in all ${
//           entityType === "department" ? "positions" : "roles"
//         }.`
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       // Dynamically set either 'departments' or 'projects' as the payload key
//       const payloadKey =
//         entityType === "department" ? "departments" : "projects";

//       // Modify the payload based on entityType (position for departments, role for projects)
//       const data = {
//         [payloadKey]: selectedEntities.map(({ id, position }) => ({
//           id,
//           [entityType === "department" ? "position" : "role"]: position, // Use 'position' for departments and 'role' for projects
//         })),
//       };

//       await axiosInstance.post(`/assign-${entityType}s/${userId}`, data);
//       message.success(
//         `${entityTitle} and ${
//           entityType === "department" ? "positions" : "roles"
//         } assigned successfully!`
//       );
//       onSubmit({ entities: selectedEntities });
//       onClose();
//     } catch (error) {
//       message.error(`Failed to assign ${entityTitle.toLowerCase()}.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const modalTitle = editEntity
//     ? `Editing ${entityType === "department" ? "Department" : "Project"}` // Show "Editing Department" or "Editing Project"
//     : `Assign ${entityType === "department" ? "Department" : "Project"}`;
//   return (
//     <Modal
//       title={modalTitle}
//       open={visible}
//       onCancel={onClose}
//       footer={[
//         <Button key="cancel" onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>,
//         <Button
//           key="assign"
//           type="primary"
//           onClick={handleAssign}
//           disabled={
//             loading || selectedEntities.some((entity) => !entity.position)
//           }
//         >
//           Assign
//         </Button>,
//       ]}
//     >
//       {loading ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "200px",
//           }}
//         >
//           <Spin
//             size="large"
//             aria-label={`Loading ${entityTitle.toLowerCase()}`}
//           />
//         </div>
//       ) : (
//         <>
//           <Select
//             mode="multiple"
//             placeholder={`Select ${entityTitle.toLowerCase()}`}
//             style={{ width: "100%" }}
//             showSearch
//             onChange={handleEntitySelect}
//             value={selectedEntities.map((entity) => entity.id)}
//             aria-label={`${entityTitle} selection`}
//           >
//             {entities.map((entity) => (
//               <Select.Option key={entity.id} value={entity.id}>
//                 {entity.name}{" "}
//                 {userEntities.some(
//                   (userEntity) => userEntity.id === entity.id
//                 ) && <Tag color="blue">Assigned</Tag>}
//               </Select.Option>
//             ))}
//           </Select>

//           {selectedEntities.map((entity) => (
//             <div key={entity.id} style={{ marginTop: 10 }}>
//               <label
//                 htmlFor={`position-${entity.id}`}
//                 style={{ display: "block" }}
//               >
//                 {entityType === "department"
//                   ? (entities as Department[]).find((e) => e.id === entity.id)
//                       ?.name
//                   : (entities as Project[]).find((e) => e.id === entity.id)
//                       ?.name}
//               </label>
//               <Input
//                 id={`position-${entity.id}`}
//                 placeholder="Enter position"
//                 value={entity.position}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                   handlePositionChange(entity.id, e.target.value)
//                 }
//                 style={{ marginLeft: 10, width: "60%" }}
//                 aria-label={`Position for ${
//                   entityType === "department"
//                     ? (entities as Department[]).find((e) => e.id === entity.id)
//                         ?.name
//                     : (entities as Project[]).find((e) => e.id === entity.id)
//                         ?.name
//                 }`}
//               />
//               {entity.isAssigned && entity.hasEdited && (
//                 <p style={{ color: "orange" }}>
//                   You are updating the position for an already assigned{" "}
//                   {entityTitle.toLowerCase()}.
//                 </p>
//               )}
//             </div>
//           ))}
//         </>
//       )}
//     </Modal>
//   );
// };

// export default AssignEntityModal;
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

  // Handle entity selection (e.g., selecting users, departments, or projects)
  // const handleEntitySelect = (selectedIds: string[]) => {
  //   const updatedSelection = selectedIds.map((id) => {
  //     // Check if the entity is already assigned
  //     const assignedEntity = existingEntities.find(
  //       (entity) => entity.id === id
  //     );

  //     const alreadySelected = selectedEntities.find(
  //       (entity) => entity.id === id
  //     );

  //     return (
  //       alreadySelected || {
  //         id,
  //         position: assignedEntity?.position || "", // Pre-fill with position if already assigned
  //         isAssigned: !!assignedEntity, // Mark it as assigned if it's in existingEntities
  //         hasEdited: false,
  //       }
  //     );
  //   });
  //   setSelectedEntities(updatedSelection);
  // };
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
