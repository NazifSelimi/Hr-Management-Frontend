export interface Department {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departments: Department[];
}
