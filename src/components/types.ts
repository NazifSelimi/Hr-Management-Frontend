export interface Department {
  id: string;
  name: string;
  pivot: DepartmentsUsers;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departments: Department[];
  users: User[];
  projectRole: ProjectsUsers;
}
export interface ProjectsUsers {
  role: string;
}
export interface DepartmentsUsers {
  position: string;
}
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  role: string;
  days_off: number;
  departments: Department[];
  projects: Project[];
  pivot: DepartmentsUsers;
  projectRole: ProjectsUsers;
}

export interface Vacation {
  id: string;
  formatted_start_date: Date;
  formatted_end_date: Date;
  reason: string;
  type: string;
  status: string;
  user: User;
}
