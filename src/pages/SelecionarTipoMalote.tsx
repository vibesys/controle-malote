
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
  
  // Standardize user profile name handling
  const isAdmin = user?.isAdmin || user?.perfil === "Administrador";
  const userProfile = user?.perfil?.toLowerCase();

  // Only show options based on user profile
  const showRecepcao = isAdmin || userProfile === 'recepcao';
  const showTriagem = isAdmin || userProfile === 'triagem';
  const showDpRh = isAdmin || userProfile === 'dp-rh' || userProfile === 'dp_rh';

  return (
    <PageContainer title={titulo} backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showRecepcao && (
          <OpcaoTipo 
            titulo="Recepção" 
            tipo="recepcao" 
            destino={destino}
          />
        )}
        {showTriagem && (
          <OpcaoTipo 
            titulo="Triagem" 
            tipo="triagem" 
            destino={destino}
          />
        )}
        {showDpRh && (
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
