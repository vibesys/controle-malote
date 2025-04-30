
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, getCurrentUser, setCurrentUser, isAuthorized } from "@/types/user";
import { usersDB } from "@/utils/supabase/usersDB";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (requiredRole: string | string[] | null) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthorized: () => false,
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authenticatedUser = await usersDB.authenticate(username, password);
      
      if (authenticatedUser) {
        // Determine if user is admin based on role
        const isAdmin = authenticatedUser.role === 'administrador';
        
        const userWithRole: User = {
          id: authenticatedUser.id,
          username: authenticatedUser.username,
          name: authenticatedUser.name,
          isAdmin: isAdmin,
          role: authenticatedUser.role
        };
        
        setUser(userWithRole);
        setCurrentUser(userWithRole);
        localStorage.setItem("currentUser", JSON.stringify(userWithRole));
        
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo(a), ${userWithRole.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha inválidos",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthorized: (requiredRole) => isAuthorized(requiredRole),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withAuth = (requiredRole: string | string[] | null = null) => 
  (Component: React.FC<any>) => 
  (props: any) => {
    const { user, isAuthorized } = useAuth();
    
    if (!user) {
      return <div>Não autorizado. Faça login primeiro.</div>;
    }
    
    if (!isAuthorized(requiredRole)) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
