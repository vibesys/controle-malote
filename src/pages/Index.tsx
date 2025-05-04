
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { Building, Mail, Building2, Inbox, MailPlus, Bike } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Define user profile for access control
  const isAdmin = user?.isAdmin || user?.perfil === "Administrador";
  const userProfile = user?.perfil?.toLowerCase();

  // Define menu items by profile type
  const menuItemsByProfile = {
    recepcao: [
      {
        title: "Malotes Recebidos",
        icon: <Inbox className="h-12 w-12" />,
        path: "/malotes/tipo",
        color: "bg-blue-dark",
        type: "recepcao"
      },
      {
        title: "Novo Malote Recebido",
        icon: <MailPlus className="h-12 w-12" />,
        path: "/malotes/novo/tipo",
        color: "bg-blue-dark",
        type: "recepcao"
      }
    ],
    triagem: [
      {
        title: "Malotes Recebidos",
        icon: <Inbox className="h-12 w-12" />,
        path: "/malotes/tipo",
        color: "bg-blue-dark",
        type: "triagem"
      },
      {
        title: "Novo Malote Recebido",
        icon: <MailPlus className="h-12 w-12" />,
        path: "/malotes/novo/tipo",
        color: "bg-blue-dark",
        type: "triagem"
      }
    ],
    "dp-rh": [
      {
        title: "Malotes Recebidos",
        icon: <Inbox className="h-12 w-12" />,
        path: "/malotes/tipo",
        color: "bg-blue-dark",
        type: "dp-rh"
      },
      {
        title: "Novo Malote Recebido",
        icon: <MailPlus className="h-12 w-12" />,
        path: "/malotes/novo/tipo",
        color: "bg-blue-dark",
        type: "dp-rh"
      }
    ],
    administrador: [
      {
        title: "Cadastrar Empresa",
        icon: <Building className="h-12 w-12" />,
        path: "/empresas",
        color: "bg-blue-medium",
        type: "admin"
      },
      {
        title: "Cadastrar Departamento",
        icon: <Building2 className="h-12 w-12" />,
        path: "/departamentos",
        color: "bg-blue-light",
        type: "admin"
      },
      {
        title: "Cadastrar Destinatário",
        icon: <Mail className="h-12 w-12" />,
        path: "/destinatarios",
        color: "bg-blue-medium",
        type: "admin"
      },
      {
        title: "Cadastrar Como Chegou",
        icon: <Bike className="h-12 w-12" />,
        path: "/como-chegou",
        color: "bg-blue-light",
        type: "admin"
      }
    ]
  };

  // Get menu items based on user profile
  let menuItems = [];
  
  if (isAdmin) {
    // Admins can access all menu items
    menuItems = [
      ...menuItemsByProfile.recepcao,
      ...menuItemsByProfile.triagem,
      ...menuItemsByProfile["dp-rh"],
      ...menuItemsByProfile.administrador
    ];
  } else if (userProfile) {
    // Regular users can only access their profile's menu items
    menuItems = menuItemsByProfile[userProfile as keyof typeof menuItemsByProfile] || [];
  }

  const handleNavigation = (path: string, type?: string) => {
    console.log("Navigating to:", path, "Type:", type);
    if (type) {
      navigate(`${path}?tipo=${type}`);
    } else {
      navigate(path);
    }
  };

  return (
    <PageContainer title="Painel de Controle">
      <div className="relative">
        <p className="text-xs text-gray-500 mb-4">Quantidade de licenças: 3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={`${item.path}-${index}`}
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
                  onClick={() => handleNavigation(item.path, item.type)}
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
