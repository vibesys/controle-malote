
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
import AcessoNegado from "./pages/AcessoNegado";
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
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/acesso-negado" element={<AcessoNegado />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              
              {/* Admin only routes */}
              <Route path="/empresas" element={<ProtectedRoute allowedProfiles={["Administrador"]}><Empresas /></ProtectedRoute>} />
              <Route path="/departamentos" element={<ProtectedRoute allowedProfiles={["Administrador"]}><Departamentos /></ProtectedRoute>} />
              <Route path="/destinatarios" element={<ProtectedRoute allowedProfiles={["Administrador"]}><Destinatarios /></ProtectedRoute>} />
              <Route path="/como-chegou" element={<ProtectedRoute allowedProfiles={["Administrador"]}><ComoChegou /></ProtectedRoute>} />
              
              {/* Profile specific routes */}
              <Route path="/malotes/tipo" element={<ProtectedRoute><SelecionarTipoVisualizacao /></ProtectedRoute>} />
              <Route path="/malotes/novo/tipo" element={<ProtectedRoute><SelecionarTipoNovoMalote /></ProtectedRoute>} />
              <Route path="/malotes/novo" element={<ProtectedRoute><NovoMalote /></ProtectedRoute>} />
              <Route path="/malotes" element={<ProtectedRoute><Malotes /></ProtectedRoute>} />
              
              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
