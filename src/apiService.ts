import axiosInstance from "./api/axiosInstance";
import { Department, Project, User } from "./components/types";

// Employee APIs
export const fetchEmployees = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>("/employees");
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/user-delete/${id}`);
};

// Department APIs
export const fetchDepartmentsApi = async (): Promise<Department[]> => {
  const { data } = await axiosInstance.get<Department[]>("/departments");
  return data;
};

export const updateDepartmentApi = async (
  id: string,
  departmentData: { name: string }
): Promise<void> => {
  await axiosInstance.put(`/departments/${id}`, departmentData);
};

export const deleteDepartmentApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/departments/${id}`);
};

// Project APIs
export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await axiosInstance.get<Project[]>("/projects");
  return data;
};
//Update Project API
export const updateProject = async (
  id: string,
  projectData: { name: string; description: string; department_ids: string[] }
): Promise<void> => {
  await axiosInstance.put(`/projects/${id}`, projectData);
};

export const deleteProject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/projects/${id}`);
};

// User APIs
export const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await axiosInstance.get<User>(`/users/${id}`);
  return data;
};
