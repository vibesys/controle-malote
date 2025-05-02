
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { MailPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SelecionarTipoNovoMalote() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  const allOptions = [
    {
      title: "Recepção",
      value: "recepcao",
      roles: ['administrador', 'recepcao']
    },
    {
      title: "Triagem",
      value: "triagem",
      roles: ['administrador', 'triagem']
    },
    {
      title: "DP-RH",
      value: "dp-rh",
      roles: ['administrador', 'dp-rh']
    }
  ];
  
  // Filter options based on user role
  const options = userData?.role === 'administrador' 
    ? allOptions 
    : allOptions.filter(option => option.roles.includes(userData?.role || ''));

  const handleSelect = (value: string) => {
    navigate(`/malotes/novo?tipo=${value}`);
  };

  return (
    <PageContainer title="Selecionar Tipo de Malote" backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <Card key={option.value} className="transition-all duration-300 shadow-md hover:shadow-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <MailPlus className="h-12 w-12 mb-4 text-blue-dark" />
              <h3 className="text-lg font-medium text-center mb-6">{option.title}</h3>
              <Button 
                className="w-full bg-blue-medium hover:bg-blue-dark"
                onClick={() => handleSelect(option.value)}
              >
                Cadastrar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
