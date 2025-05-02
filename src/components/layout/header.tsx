
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/context/auth';
import { ChangePassword } from '@/components/ChangePassword';

export function Header() {
  const navigate = useNavigate();
  const { userData, signOut, isLoading } = useAuth();
  
  return (
    <header className="border-b bg-white">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center">
          <h1 
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-blue-dark cursor-pointer"
          >
            Controle de Malotes
          </h1>
        </div>
        
        {userData && (
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-sm font-medium">{userData.name}</p>
              <p className="text-xs text-muted-foreground">
                {userData.role === 'administrador' ? 'Administrador' : 
                 userData.role === 'dp-rh' ? 'DP-RH' : 
                 userData.role === 'recepcao' ? 'Recepção' : 
                 userData.role === 'triagem' ? 'Triagem' : ''}
              </p>
            </div>
            <ChangePassword />
            <Button 
              variant="outline" 
              onClick={() => signOut()}
              disabled={isLoading}
            >
              Sair
            </Button>
          </div>
        )}
      </div>
      <Separator />
    </header>
  )
}
