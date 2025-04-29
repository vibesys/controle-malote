
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Users from "./pages/Users";
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              <Route path="/empresas" element={
                <ProtectedRoute>
                  <Empresas />
                </ProtectedRoute>
              } />
              
              <Route path="/departamentos" element={
                <ProtectedRoute>
                  <Departamentos />
                </ProtectedRoute>
              } />
              
              <Route path="/destinatarios" element={
                <ProtectedRoute>
                  <Destinatarios />
                </ProtectedRoute>
              } />
              
              <Route path="/malotes/tipo" element={
                <ProtectedRoute>
                  <SelecionarTipoVisualizacao />
                </ProtectedRoute>
              } />
              
              <Route path="/malotes/novo/tipo" element={
                <ProtectedRoute>
                  <SelecionarTipoNovoMalote />
                </ProtectedRoute>
              } />
              
              <Route path="/malotes/novo" element={
                <ProtectedRoute requiredScreen={`malotes-${new URLSearchParams(window.location.search).get('tipo') || 'recepcao'}`}>
                  <NovoMalote />
                </ProtectedRoute>
              } />
              
              <Route path="/malotes" element={
                <ProtectedRoute requiredScreen={`malotes-${new URLSearchParams(window.location.search).get('tipo') || 'recepcao'}`}>
                  <Malotes />
                </ProtectedRoute>
              } />
              
              <Route path="/como-chegou" element={
                <ProtectedRoute>
                  <ComoChegou />
                </ProtectedRoute>
              } />
              
              <Route path="/usuarios" element={
                <ProtectedRoute requiredRole="administrador" requiredScreen="usuarios">
                  <Users />
                </ProtectedRoute>
              } />
              
              <Route path="/alterar-senha" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
