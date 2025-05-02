
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface TipoProps {
  title: string;
  tipo: string;
  profiles: string[];
}

interface SelecionarTipoMaloteProps {
  modo: "visualizar" | "novo";
}

export default function SelecionarTipoMalote({ modo }: SelecionarTipoMaloteProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const tipos: TipoProps[] = [
    { title: "Recepção", tipo: "recepcao", profiles: ["Administrador", "recepcao"] },
    { title: "Triagem", tipo: "triagem", profiles: ["Administrador", "triagem"] },
    { title: "DP-RH", tipo: "dp-rh", profiles: ["Administrador", "dp-rh"] }
  ];

  const handleSelect = (tipo: string) => {
    if (modo === "visualizar") {
      navigate(`/malotes?tipo=${tipo}`);
    } else {
      navigate(`/malotes/novo?tipo=${tipo}`);
    }
  };

  // Filter tipos based on user profile
  const filteredTipos = tipos.filter(tipo => {
    if (!user) return false;
    return tipo.profiles.includes(user.perfil);
  });

  const pageTitle = modo === "visualizar" 
    ? "Selecione o tipo de malote para visualizar" 
    : "Selecione o tipo de malote para cadastrar";

  return (
    <PageContainer title={pageTitle} backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {filteredTipos.map((tipo) => (
          <Card key={tipo.tipo} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium mb-4">{tipo.title}</h3>
              <Button 
                onClick={() => handleSelect(tipo.tipo)}
                className="w-full bg-blue-medium hover:bg-blue-dark"
              >
                Selecionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
