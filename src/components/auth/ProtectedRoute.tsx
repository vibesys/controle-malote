
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredScreen?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredScreen
}: ProtectedRouteProps) {
  const { user, loading, checkAccess } = useAuth();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);
  
  // Show loading state
  if (checking || loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <Card className="shadow-md">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-t-blue-medium border-r-blue-medium border-b-blue-light border-l-gray-200 rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Carregando...</p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check role-based access
  if (requiredRole || requiredScreen) {
    const hasAccess = checkAccess(requiredRole, requiredScreen);
    
    if (!hasAccess) {
      return (
        <PageContainer>
          <div className="flex items-center justify-center h-full">
            <Card className="shadow-md">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Acesso Negado</h2>
                <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      );
    }
  }
  
  // User is authenticated and has access
  return <>{children}</>;
}
