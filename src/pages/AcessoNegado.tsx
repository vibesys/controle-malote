
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { AlertTriangle } from "lucide-react";

export default function AcessoNegado() {
  const navigate = useNavigate();
  
  return (
    <PageContainer title="Acesso Negado">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h2>
        <p className="text-lg mb-6">
          Você não tem permissão para acessar esta área.
        </p>
        <Button onClick={() => navigate("/")} className="bg-blue-medium hover:bg-blue-dark">
          Voltar para a Página Inicial
        </Button>
      </div>
    </PageContainer>
  );
}
