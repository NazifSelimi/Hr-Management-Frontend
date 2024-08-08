import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the type for a department
interface Department {
  id: number;
  name: string;
}

interface DepartmentContextType {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined
);

export const DepartmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments"); // Update with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        // Use type assertion to access message
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <DepartmentContext.Provider value={{ departments, loading, error }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartmentContext = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error(
      "useDepartmentContext must be used within a DepartmentProvider"
    );
  }
  return context;
};
