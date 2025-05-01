
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Empresas from "./pages/Empresas";
import Departamentos from "./pages/Departamentos";
import Destinatarios from "./pages/Destinatarios";
import NovoMalote from "./pages/NovoMalote";
import Malotes from "./pages/Malotes";
import ComoChegou from "./pages/ComoChegou";
import SelecionarTipoVisualizacao from "./pages/SelecionarTipoVisualizacao";
import SelecionarTipoNovoMalote from "./pages/SelecionarTipoNovoMalote";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserRole } from "./context/AuthContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Helper function to determine allowed roles for each route
const getRolesForType = (type: string | null): UserRole[] => {
  switch (type) {
    case 'recepcao':
      return ['recepcao'];
    case 'triagem':
      return ['triagem'];
    case 'dp-rh':
      return ['dp-rh'];
    default:
      return ['administrador', 'recepcao', 'triagem', 'dp-rh'];
  }
};

// Components for type-specific routes
const MalotesRouteWrapper: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tipo = params.get('tipo');
  const allowedRoles = getRolesForType(tipo);
  
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Malotes />
    </ProtectedRoute>
  );
};

const NovoMaloteRouteWrapper: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tipo = params.get('tipo');
  const allowedRoles = getRolesForType(tipo);
  
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <NovoMalote />
    </ProtectedRoute>
  );
};

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/empresas" element={<ProtectedRoute><Empresas /></ProtectedRoute>} />
                <Route path="/departamentos" element={<ProtectedRoute><Departamentos /></ProtectedRoute>} />
                <Route path="/destinatarios" element={<ProtectedRoute><Destinatarios /></ProtectedRoute>} />
                <Route path="/como-chegou" element={<ProtectedRoute><ComoChegou /></ProtectedRoute>} />
                
                {/* Type-specific protected routes */}
                <Route path="/malotes/tipo" element={<ProtectedRoute><SelecionarTipoVisualizacao /></ProtectedRoute>} />
                <Route path="/malotes/novo/tipo" element={<ProtectedRoute><SelecionarTipoNovoMalote /></ProtectedRoute>} />
                
                {/* Use wrapper components for the complex routes */}
                <Route path="/malotes/novo" element={<NovoMaloteRouteWrapper />} />
                <Route path="/malotes" element={<MalotesRouteWrapper />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
