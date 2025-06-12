import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Menu, User, LogOut, Key } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChangePasswordDialog } from "@/components/auth/ChangePasswordDialog";
export function Header() {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const handleNavigation = (path: string) => {
    navigate(path, {
      replace: false
    });
  };
  return <header className="bg-blue-dark text-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => handleNavigation("/")}>VibeSys - Controle Malote </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {user && <>
            {/* Botões de navegação fixos */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="text-white hover:bg-blue-medium" onClick={() => handleNavigation("/")}>
                <Home className="h-5 w-5 mr-2" />
                Início
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-blue-medium">
                    <User className="h-5 w-5 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
                    <Key className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Menu mobile */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    <Button variant="ghost" className="flex justify-start" onClick={() => handleNavigation("/")}>
                      <Home className="h-5 w-5 mr-2" />
                      Início
                    </Button>
                    <Button variant="ghost" className="flex justify-start" onClick={() => setShowPasswordDialog(true)}>
                      <Key className="h-5 w-5 mr-2" />
                      Alterar Senha
                    </Button>
                    <Button variant="ghost" className="flex justify-start" onClick={logout}>
                      <LogOut className="h-5 w-5 mr-2" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>}
      </div>
      
      <ChangePasswordDialog isOpen={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />
    </header>;
}