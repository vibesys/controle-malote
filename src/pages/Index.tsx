
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { Building, Mail, Building2, Inbox, MailPlus, Bike, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo } from "react";

export default function Index() {
  const navigate = useNavigate();
  const { user, checkAccess } = useAuth();
  
  const allMenuItems = [
    {
      title: "Malotes Recebidos",
      icon: <Inbox className="h-12 w-12" />,
      path: "/malotes/tipo",
      color: "bg-blue-dark",
      roles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Empresa",
      icon: <Building className="h-12 w-12" />,
      path: "/empresas",
      color: "bg-blue-medium",
      roles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Departamento",
      icon: <Building2 className="h-12 w-12" />,
      path: "/departamentos",
      color: "bg-blue-light",
      roles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Destinatário",
      icon: <Mail className="h-12 w-12" />,
      path: "/destinatarios",
      color: "bg-blue-medium",
      roles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Como Chegou",
      icon: <Bike className="h-12 w-12" />,
      path: "/como-chegou",
      color: "bg-blue-light",
      roles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Novo Malote Recebido",
      icon: <MailPlus className="h-12 w-12" />,
      path: "/malotes/novo/tipo",
      color: "bg-blue-dark",
      roles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Gerenciar Usuários",
      icon: <UserCog className="h-12 w-12" />,
      path: "/usuarios",
      color: "bg-blue-medium",
      roles: ["administrador"]
    }
  ];
  
  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (!user) return [];
    
    return allMenuItems.filter(item => {
      if (user.role === 'administrador') return true;
      return item.roles.includes(user.role);
    });
  }, [user]);

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <PageContainer title="Painel de Controle">
      <div className="relative">
        {user && (
          <p className="text-sm text-gray-600 mb-4">
            Bem-vindo, <span className="font-medium">{user.name}</span> | 
            Perfil: <span className="font-medium">{user.role === 'administrador' ? 'Administrador' : 
                               user.role === 'recepcao' ? 'Recepção' : 
                               user.role === 'triagem' ? 'Triagem' : 
                               user.role === 'dp-rh' ? 'DP-RH' : user.role}</span>
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card 
              key={item.path} 
              className="overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div 
                className={`${item.color} text-white p-4 flex justify-center items-center`}
              >
                {item.icon}
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-center mb-4">{item.title}</h3>
                <Button 
                  className="w-full bg-blue-medium hover:bg-blue-dark"
                  onClick={() => handleNavigation(item.path)}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
