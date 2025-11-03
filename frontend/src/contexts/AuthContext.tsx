import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authApi, User } from "../services/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUserLocal: (updatedUser: User) => void;
}

interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const redirectByRole = (role: string) => {
    switch (role) {
      case "ADMIN":
      case "STAFF":
        navigate("/admin", { replace: true });
        break;
      default:
        navigate("/dashboard", { replace: true });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem("accessToken", response.tokens.access);
      localStorage.setItem("refreshToken", response.tokens.refresh);
      setUser(response.user);

      // Redirect after login
      redirectByRole(response.user.role);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authApi.register(userData);
      localStorage.setItem("accessToken", response.tokens.access);
      localStorage.setItem("refreshToken", response.tokens.refresh);
      setUser(response.user);

      // Redirect after registration
      redirectByRole(response.user.role);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        const errorMessages: string[] = [];
        for (const [messages] of Object.entries(errorData)) {
          if (Array.isArray(messages)) errorMessages.push(...messages);
          else if (typeof messages === "string") errorMessages.push(messages);
        }
        throw new Error(errorMessages.join(", "));
      }
      throw new Error("Registration failed");
    }
  };

  const updateUserLocal = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login", { replace: true }); // redirect to login
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, updateUserLocal }}
    >
      {children}
    </AuthContext.Provider>
  );
};
