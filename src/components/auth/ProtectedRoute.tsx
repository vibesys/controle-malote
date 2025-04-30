
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ProtectedRouteProps {
  requiredRole?: string | string[] | null;
  redirectTo?: string;
}

export default function ProtectedRoute({
  requiredRole = null,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isAuthorized, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to={redirectTo} />;
  }
  
  // Check authorization for specific roles
  if (requiredRole && !isAuthorized(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }
  
  // If all checks pass, render the protected content
  return <Outlet />;
}
