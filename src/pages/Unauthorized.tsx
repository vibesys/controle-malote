
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <PageContainer title="Acesso não autorizado">
      <div className="flex flex-col items-center justify-center py-12">
        <ShieldAlert className="h-24 w-24 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Acesso restrito</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          Você não tem permissão para acessar esta página. 
          Por favor, entre em contato com o administrador do sistema.
        </p>
        <Button onClick={() => navigate("/")} className="bg-blue-medium hover:bg-blue-dark">
          Voltar à página inicial
        </Button>
      </div>
    </PageContainer>
  );
}
