
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Key } from "lucide-react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">{user.perfil}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => setIsChangePasswordOpen(true)}
          >
            <Key className="mr-2 h-4 w-4" />
            <span>Alterar Senha</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
    </>
  );
}
