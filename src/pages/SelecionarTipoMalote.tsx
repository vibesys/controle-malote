
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface OpcaoTipoProps {
  titulo: string;
  tipo: string;
  destino: string;
}

const OpcaoTipo = ({ titulo, tipo, destino }: OpcaoTipoProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg">
      <div className="bg-blue-dark text-white p-4 flex justify-center items-center">
        <Inbox className="h-12 w-12" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-center mb-4">{titulo}</h3>
        <Button 
          className="w-full bg-blue-medium hover:bg-blue-dark"
          onClick={() => navigate(`${destino}?tipo=${tipo}`)}
        >
          Acessar
        </Button>
      </CardContent>
    </Card>
  );
};

interface SelecionarTipoMaloteProps {
  modo: "visualizar" | "novo";
}

export default function SelecionarTipoMalote({ modo }: SelecionarTipoMaloteProps) {
  const { user } = useAuth();
  const titulo = modo === "visualizar" 
    ? "Selecione o tipo de malote para visualizar" 
    : "Selecione o tipo de malote para cadastrar";
  
  const destino = modo === "visualizar" ? "/malotes" : "/malotes/novo";
  
  // Determine which options to show based on user profile
  // Admin can see all options
  const isAdmin = user?.isAdmin || user?.perfil === "Administrador";
  
  // Each profile can only see their respective option
  const shouldShowRecepcao = isAdmin || user?.perfil === "recepcao" || user?.perfil === "Recepcao";
  const shouldShowTriagem = isAdmin || user?.perfil === "triagem" || user?.perfil === "Triagem";
  const shouldShowDpRh = isAdmin || user?.perfil === "dp-rh" || user?.perfil === "DP-RH";

  return (
    <PageContainer title={titulo} backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shouldShowRecepcao && (
          <OpcaoTipo 
            titulo="Recepção" 
            tipo="recepcao" 
            destino={destino}
          />
        )}
        {shouldShowTriagem && (
          <OpcaoTipo 
            titulo="Triagem" 
            tipo="triagem" 
            destino={destino}
          />
        )}
        {shouldShowDpRh && (
          <OpcaoTipo 
            titulo="DP-RH" 
            tipo="dp-rh" 
            destino={destino}
          />
        )}
      </div>
    </PageContainer>
  );
}
