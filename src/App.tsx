
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";
import Empresas from "./pages/Empresas";
import Departamentos from "./pages/Departamentos";
import Destinatarios from "./pages/Destinatarios";
import NovoMalote from "./pages/NovoMalote";
import Malotes from "./pages/Malotes";
import ComoChegou from "./pages/ComoChegou";
import SelecionarTipoVisualizacao from "./pages/SelecionarTipoVisualizacao";
import SelecionarTipoNovoMalote from "./pages/SelecionarTipoNovoMalote";
import { AuthProvider } from "./contexts/AuthContext";
import { RequireAuth } from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected routes */}
              <Route path="/" element={
                <RequireAuth>
                  <Index />
                </RequireAuth>
              } />
              
              <Route path="/empresas" element={
                <RequireAuth allowedRoles={["Administrador", "recepcao", "triagem", "dp-rh"]}>
                  <Empresas />
                </RequireAuth>
              } />
              
              <Route path="/departamentos" element={
                <RequireAuth allowedRoles={["Administrador", "recepcao", "triagem", "dp-rh"]}>
                  <Departamentos />
                </RequireAuth>
              } />
              
              <Route path="/destinatarios" element={
                <RequireAuth allowedRoles={["Administrador", "recepcao", "triagem", "dp-rh"]}>
                  <Destinatarios />
                </RequireAuth>
              } />
              
              <Route path="/malotes/tipo" element={
                <RequireAuth>
                  <SelecionarTipoVisualizacao />
                </RequireAuth>
              } />
              
              <Route path="/malotes/novo/tipo" element={
                <RequireAuth>
                  <SelecionarTipoNovoMalote />
                </RequireAuth>
              } />
              
              <Route path="/malotes/novo" element={
                <RequireAuth>
                  <NovoMalote />
                </RequireAuth>
              } />
              
              <Route path="/malotes" element={
                <RequireAuth>
                  <Malotes />
                </RequireAuth>
              } />
              
              <Route path="/como-chegou" element={
                <RequireAuth allowedRoles={["Administrador", "recepcao", "triagem", "dp-rh"]}>
                  <ComoChegou />
                </RequireAuth>
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
