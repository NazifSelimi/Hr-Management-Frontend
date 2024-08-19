export interface Department {
  id: string;
  name: string;
  description: string; //added a description interface
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departments: Department[];
  users: User[];
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
}
