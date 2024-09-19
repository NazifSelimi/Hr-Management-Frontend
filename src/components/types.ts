export interface Department {
  id: string;
  name: string;
  pivot: DepartmentsUsers;
  users: User[];
  projects?: Project[]
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departments: Department[];
  users: User[];
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
  pivot?: {
    role?: string; // Assuming this comes from the ProjectUsers pivot
    position?: string; // Assuming this comes from the DepartmentsUsers pivot
  };
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
