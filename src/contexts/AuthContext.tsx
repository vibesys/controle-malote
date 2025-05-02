
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-custom";

export interface AuthUser {
  id: string;
  email: string;
  perfil: "Administrador" | "dp-rh" | "recepcao" | "triagem";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_email: email,
        p_senha: password
      });

      if (error) {
        showErrorToast(error.message || "Erro ao fazer login");
        return false;
      }

      if (!data.success) {
        showErrorToast(data.message || "Credenciais inválidas");
        return false;
      }

      const authUser: AuthUser = {
        id: data.id,
        email: data.email,
        perfil: data.perfil
      };

      setUser(authUser);
      localStorage.setItem("authUser", JSON.stringify(authUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      showErrorToast("Erro ao fazer login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      localStorage.removeItem("authUser");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('update_password', {
        p_user_email: user.email,
        p_current_password: currentPassword,
        p_new_password: newPassword
      });

      if (error) {
        showErrorToast(error.message || "Erro ao alterar senha");
        return false;
      }

      if (!data.success) {
        showErrorToast(data.message || "Erro ao alterar senha");
        return false;
      }

      showSuccessToast("Senha alterada com sucesso");
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      showErrorToast("Erro ao alterar senha");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
