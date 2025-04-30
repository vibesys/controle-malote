
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Empresas from "./pages/Empresas";
import Departamentos from "./pages/Departamentos";
import Destinatarios from "./pages/Destinatarios";
import NovoMalote from "./pages/NovoMalote";
import Malotes from "./pages/Malotes";
import ComoChegou from "./pages/ComoChegou";
import SelecionarTipoVisualizacao from "./pages/SelecionarTipoVisualizacao";
import SelecionarTipoNovoMalote from "./pages/SelecionarTipoNovoMalote";
import { initializeCollections } from "./utils/localStorage";

const queryClient = new QueryClient();

const App = () => {
  // Initialize localStorage collections when app starts
  useEffect(() => {
    initializeCollections();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/change-password" element={<ChangePassword />} />
                
                {/* Admin only routes */}
                <Route element={<ProtectedRoute requiredRole="administrador" />}>
                  <Route path="/users" element={<Users />} />
                </Route>
                
                {/* Common routes for all authenticated users */}
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/departamentos" element={<Departamentos />} />
                <Route path="/destinatarios" element={<Destinatarios />} />
                <Route path="/como-chegou" element={<ComoChegou />} />
                
                {/* Role-specific routes for Malotes */}
                <Route path="/malotes/tipo" element={<SelecionarTipoVisualizacao />} />
                
                {/* Routes for Malotes based on tipo_tabela */}
                <Route 
                  path="/malotes" 
                  element={
                    <Malotes />
                  } 
                />
                
                {/* Role-specific routes for Novo Malote */}
                <Route path="/malotes/novo/tipo" element={<SelecionarTipoNovoMalote />} />
                
                <Route 
                  path="/malotes/novo" 
                  element={
                    <NovoMalote />
                  } 
                />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
