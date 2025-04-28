
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { usersDB } from "@/utils/supabase";
import { User } from "@/types/user";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast-custom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAccess: (requiredRole?: string, requiredScreen?: string) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const loadUser = () => {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse stored user data", error);
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      const userData = await usersDB.authenticate(username, password);
      
      if (!userData) {
        throw new Error("Usuário ou senha inválidos");
      }
      
      const user: User = {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        isAdmin: userData.role === 'administrador',
        role: userData.role
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      showSuccessToast(`Bem-vindo, ${user.name}!`);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      showErrorToast(error.message || "Falha ao fazer login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate("/login");
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    
    try {
      // First verify the current password is correct
      await usersDB.authenticate(user.username, currentPassword);
      
      // Update the password
      await usersDB.updateUser(user.id, { password: newPassword });
      
      showSuccessToast("Senha alterada com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Change password error:", error);
      showErrorToast(error.message || "Falha ao alterar senha");
      return false;
    }
  };

  const checkAccess = (requiredRole?: string, requiredScreen?: string) => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'administrador') return true;
    
    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) return false;
    
    // If a specific screen is required, check user's role-based permissions
    if (requiredScreen) {
      switch (user.role) {
        case 'recepcao':
          if (requiredScreen.includes('triagem') || 
              requiredScreen.includes('dp-rh') ||
              requiredScreen === 'usuarios') {
            return false;
          }
          break;
        case 'triagem':
          if (requiredScreen.includes('recepcao') || 
              requiredScreen.includes('dp-rh') ||
              requiredScreen === 'usuarios') {
            return false;
          }
          break;
        case 'dp-rh':
          if (requiredScreen.includes('recepcao') || 
              requiredScreen.includes('triagem') ||
              requiredScreen === 'usuarios') {
            return false;
          }
          break;
        default:
          return false;
      }
    }
    
    return true;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAccess,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
