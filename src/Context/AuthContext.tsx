import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import axiosInstance from "../api/axiosInstance";

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  login: (userRole: string, authToken: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>("");

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUserRole = await localStorage.getItem("userRole");

      if (storedUserRole) {
        setIsLoggedIn(true);
        setUserRole(storedUserRole);
        console.log(userRole);
      } else {
        setIsLoggedIn(false);
        setUserRole("");
      }
    };

    initializeAuth();
  }, []);

  const login = (userRole: string, authToken: string) => {
    setIsLoggedIn(true);
    setUserRole(userRole);
    if (authToken) {
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
      setIsLoggedIn(false);
      setUserRole(null);
      localStorage.removeItem("userRole");
      localStorage.removeItem("authToken");
      Cookies.remove("jwt");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};