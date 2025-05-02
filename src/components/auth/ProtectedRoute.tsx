
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles?: ("Administrador" | "dp-rh" | "recepcao" | "triagem")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedProfiles = ["Administrador", "dp-rh", "recepcao", "triagem"] 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has permission for this route
  if (!allowedProfiles.includes(user.perfil)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  // User is authenticated and has permission
  return <>{children}</>;
};
