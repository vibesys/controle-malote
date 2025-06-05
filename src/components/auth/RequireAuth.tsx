
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function RequireAuth({ children, allowedRoles = [] }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && allowedRoles.length > 0) {
      // Check if the user has one of the allowed roles
      const userRole = user.perfil || (user.isAdmin ? 'Administrador' : '');
      const userRoleLowerCase = userRole.toLowerCase();
      const allowedRolesLowerCase = allowedRoles.map(role => role.toLowerCase());
      
      // Allow access if the user's role (case insensitive) is in the allowed roles list
      // or if they are an admin
      if (!allowedRolesLowerCase.includes(userRoleLowerCase) && !user.isAdmin) {
        navigate("/unauthorized");
      }
    }
  }, [user, loading, navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
        <p className="ml-2">Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
