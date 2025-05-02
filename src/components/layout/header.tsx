import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path, { replace: false });
  };

  return (
    <header className="bg-blue-dark text-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => handleNavigation("/")}>
          Controle Malote Águia de Haia
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Botões de navegação fixos */}
        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-blue-medium"
            onClick={() => handleNavigation("/")}>
            <Home className="h-5 w-5 mr-2" />
            Início
          </Button>
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
                <Button 
                  variant="ghost" 
                  className="flex justify-start" 
                  onClick={() => handleNavigation("/")}>
                  <Home className="h-5 w-5 mr-2" />
                  Início
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
