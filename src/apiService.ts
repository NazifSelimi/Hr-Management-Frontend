import axiosInstance from "./api/axiosInstance";
import { Department, Project, User } from "./components/types";

// Employee APIs
export const fetchEmployees = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>("/employees");
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};

export const createEmployee = async (employeeData: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  role: string;
  days_off: number;
}): Promise<any> => {
  const response = await axiosInstance.post("/users", employeeData);
  return response;
};

export const updatePassword = async (
  password: string,
  password_confirmation: string
): Promise<any> => {
  const response = await axiosInstance.patch("/update-password", {
    password,
    password_confirmation,
  });
  return response;
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

export const assignUsersToDepartment = async (
  departmentId: string,
  userIds: string[]
): Promise<void> => {
  await axiosInstance.post(`/assign-users-departments/${departmentId}`, {
    userIds,
  });
};

// Project APIs
export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await axiosInstance.get<Project[]>("/projects");
  return data;
};

export const updateProject = async (
  id: string,
  projectData: { name: string; description: string; department_ids: string[] }
): Promise<void> => {
  await axiosInstance.put(`/projects/${id}`, projectData);
};

export const deleteProject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/projects/${id}`);
};

export const assignUsersToProject = async (
  projectId: string,
  userIds: string[]
): Promise<void> => {
  await axiosInstance.post(`/assign-users-projects/${projectId}`, { userIds });
};

// User APIs
export const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await axiosInstance.get<User>(`/users/${id}`);
  return data;
};

export const updateUserProfile = async (
  userId: string,
  profileData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
  }
): Promise<void> => {
  await axiosInstance.put(`/profile/update/${userId}`, profileData);
};

export const removeFromProject = async (userId: string): Promise<void> => {
  await axiosInstance.post(`/user/${userId}/remove-projects`);
};

export const removeFromDepartment = async (userId: string): Promise<void> => {
  await axiosInstance.post(`/user/${userId}/remove-departments`);
};

// Vacation (Days Off) APIs
export const fetchEmployeeVacation = async (): Promise<void> => {
  const { data } = await axiosInstance.get("/employee-vacation");
  return data;
};

export const requestVacation = async (vacationData: {
  days_off: number;
}): Promise<void> => {
  await axiosInstance.post("/request-vacation", vacationData);
};

export const updateVacation = async (
  daysOffId: string,
  daysOffData: { days_off: number }
): Promise<void> => {
  await axiosInstance.patch(`/vacation/${daysOffId}`, daysOffData);
};

// Search API
export const search = async (searchQuery: { term: string }): Promise<any> => {
  const { data } = await axiosInstance.post("/search", searchQuery);
  return data;
};
