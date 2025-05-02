
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/departamentos" element={<Departamentos />} />
            <Route path="/destinatarios" element={<Destinatarios />} />
            <Route path="/malotes/tipo" element={<SelecionarTipoVisualizacao />} />
            <Route path="/malotes/novo/tipo" element={<SelecionarTipoNovoMalote />} />
            <Route path="/malotes/novo" element={<NovoMalote />} />
            <Route path="/malotes" element={<Malotes />} />
            <Route path="/como-chegou" element={<ComoChegou />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
