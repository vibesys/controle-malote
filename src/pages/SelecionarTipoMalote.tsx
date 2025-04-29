
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
  disabled?: boolean;
}

const OpcaoTipo = ({ titulo, tipo, destino, disabled = false }: OpcaoTipoProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg ${disabled ? 'opacity-60' : ''}`}>
      <div className="bg-blue-dark text-white p-4 flex justify-center items-center">
        <Inbox className="h-12 w-12" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-center mb-4">{titulo}</h3>
        <Button 
          className="w-full bg-blue-medium hover:bg-blue-dark"
          onClick={() => navigate(`${destino}?tipo=${tipo}`)}
          disabled={disabled}
        >
          {disabled ? "Acesso Negado" : "Acessar"}
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
  
  // Check user roles for access control
  const canAccessRecepcao = user?.role === 'administrador' || user?.role === 'recepcao';
  const canAccessTriagem = user?.role === 'administrador' || user?.role === 'triagem';
  const canAccessDPRH = user?.role === 'administrador' || user?.role === 'dp-rh';
  
  return (
    <PageContainer title={titulo} backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OpcaoTipo 
          titulo="Recepção" 
          tipo="recepcao" 
          destino={destino}
          disabled={!canAccessRecepcao}
        />
        <OpcaoTipo 
          titulo="Triagem" 
          tipo="triagem" 
          destino={destino}
          disabled={!canAccessTriagem}
        />
        <OpcaoTipo 
          titulo="DP-RH" 
          tipo="dp-rh" 
          destino={destino}
          disabled={!canAccessDPRH}
        />
      </div>
    </PageContainer>
  );
}
