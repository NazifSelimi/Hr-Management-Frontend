import axiosInstance from "./api/axiosInstance";
import { Department, Project, User, Vacation } from "./components/types";

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

// Department APIs
export const fetchDepartmentsApi = async (): Promise<Department[]> => {
  const { data } = await axiosInstance.get<Department[]>("/departments");
  return data;
};

export const fetchDepartment = async (id?: string): Promise<Department> => {
  const { data } = await axiosInstance.get<Department>(`/departments/${id}`);
  return data;
};

export const updateDepartmentApi = async (
  id: string,
  departmentData: { name: string }
): Promise<void> => {
  await axiosInstance.put(`/departments/${id}`, departmentData);
};

export const removeUserDepartment = async (id?: string): Promise<void> => {
  await axiosInstance.put(`/departments/${id}/remove-user`);
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

export const fetchUserProfile = async (): Promise<User> => {
  const { data } = await axiosInstance.get(`/profile`);
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
    days_off: number;
    role: string;
  }
): Promise<any> => {
  const response = await axiosInstance.patch(
    `/profile/update/${userId}`,
    profileData
  );
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

export const removeFromProject = async (userId: string): Promise<void> => {
  await axiosInstance.post(`/user/${userId}/remove-projects`);
};

export const removeFromDepartment = async (userId: string): Promise<void> => {
  await axiosInstance.post(`/user/${userId}/remove-departments`);
};

// Vacation (Days Off) APIs
export const fetchEmployeeVacation = async (): Promise<Vacation[]> => {
  const { data } = await axiosInstance.get("/employee-vacation");
  return data;
};

export const requestVacation = async (vacationData: {
  user_id: string;
  start_date: Date;
  end_date: Date;
  reason: string;
  type: string;
  status: boolean;
}): Promise<any> => {
  const response = await axiosInstance.post("/request-vacation", vacationData);
  return response;
};

export const fetchVacations = async (): Promise<Vacation[]> => {
  const { data } = await axiosInstance.get("/vacation");
  return data;
};

export const updateVacation = async (
  daysOffId: string,
  data: {
    status: string;
  }
): Promise<any> => {
  const response = await axiosInstance.patch(`/vacation/${daysOffId}`, data);
  return response;
};

// Search API
export const search = async (searchQuery: { term: string }): Promise<any> => {
  const { data } = await axiosInstance.post("/search", searchQuery);
  return data;
};
