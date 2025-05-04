
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { Building, Mail, Building2, Inbox, MailPlus, Bike } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Filter menu items based on user profile
  const isAdmin = user?.isAdmin || user?.perfil === "Administrador";
  const userProfile = user?.perfil?.toLowerCase();
  
  // Check if user has access to cadastro screens
  const hasCadastroAccess = isAdmin || 
    ["recepcao", "triagem", "dp-rh"].includes(userProfile || "");

  // Define base menu items
  const baseMenuItems = [
    {
      title: "Malotes Recebidos",
      icon: <Inbox className="h-12 w-12" />,
      path: "/malotes/tipo",
      color: "bg-blue-dark",
      profiles: ["recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Novo Malote Recebido",
      icon: <MailPlus className="h-12 w-12" />,
      path: "/malotes/novo/tipo",
      color: "bg-blue-dark",
      profiles: ["recepcao", "triagem", "dp-rh"]
    }
  ];

  // Define cadastro menu items - now available to more profiles
  const cadastroMenuItems = [
    {
      title: "Cadastrar Empresa",
      icon: <Building className="h-12 w-12" />,
      path: "/empresas",
      color: "bg-blue-medium",
      profiles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Departamento",
      icon: <Building2 className="h-12 w-12" />,
      path: "/departamentos",
      color: "bg-blue-light",
      profiles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Destinatário",
      icon: <Mail className="h-12 w-12" />,
      path: "/destinatarios",
      color: "bg-blue-medium",
      profiles: ["administrador", "recepcao", "triagem", "dp-rh"]
    },
    {
      title: "Cadastrar Como Chegou",
      icon: <Bike className="h-12 w-12" />,
      path: "/como-chegou",
      color: "bg-blue-light",
      profiles: ["administrador", "recepcao", "triagem", "dp-rh"]
    }
  ];

  // Combine menu items based on user role
  let menuItems = [...baseMenuItems];
  
  if (hasCadastroAccess) {
    menuItems = [...menuItems, ...cadastroMenuItems];
  } else if (userProfile) {
    // Filter menu items that match the user's profile
    menuItems = menuItems.filter(item => 
      item.profiles.includes(userProfile) || item.profiles.includes("all")
    );
  }

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <PageContainer title="Painel de Controle">
      <div className="relative">
        <p className="text-xs text-gray-500 mb-4">Quantidade de licenças: 3</p>
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
