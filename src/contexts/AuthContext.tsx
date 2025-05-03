
import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@/types/user";
import { authAPI } from "@/utils/supabaseDB";
import { LoginCredentials, PasswordChangeData } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-custom";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  changePassword: (passwordData: PasswordChangeData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.id && response.email && response.perfil) {
        const loggedUser: User = {
          id: response.id,
          username: response.email,
          name: response.email.split('@')[0], // Simple name extraction
          isAdmin: response.perfil === 'Administrador',
          perfil: response.perfil
        };
        
        setUser(loggedUser);
        sessionStorage.setItem('currentUser', JSON.stringify(loggedUser));
        return true;
      } else {
        setError(response.message || 'Credenciais inválidas');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  const changePassword = async (passwordData: PasswordChangeData): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await authAPI.changePassword(user.username, passwordData);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Falha ao alterar a senha');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha';
      setError(errorMessage);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      changePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
