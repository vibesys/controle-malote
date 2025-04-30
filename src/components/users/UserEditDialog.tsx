
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { usersDB, logsDB } from "@/utils/supabase";
import { User } from "@/types/user";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-custom";

const editFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  role: z.string().min(1, "Selecione um perfil"),
  password: z.string().optional(),
});

interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  currentUser: User | null;
  onSuccess: () => Promise<void>;
}

export function UserEditDialog({ 
  isOpen, 
  onClose, 
  user, 
  currentUser,
  onSuccess 
}: UserEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: user?.name || "",
      role: user?.role || "",
      password: "",
    },
  });

  // Reset form when modal opens or user changes
  if (isOpen && user && (
    user.name !== editForm.getValues().name || 
    user.role !== editForm.getValues().role
  )) {
    editForm.reset({
      name: user.name,
      role: user.role,
      password: "",
    });
  }

  const handleEditSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (!user) return;
    
    const updates: any = {
      name: values.name,
      role: values.role
    };
    
    // Only include password if provided
    if (values.password && values.password.trim()) {
      updates.password = values.password;
    }
    
    try {
      setIsLoading(true);
      await usersDB.updateUser(user.id, updates);
      
      await logsDB.create({
        acao: "Editou usuário",
        usuario_email: currentUser?.username || "admin",
        data_hora: new Date().toISOString(),
        detalhes: `Usuário: ${user.username}, Perfil: ${values.role}`
      });
      
      onClose();
      await onSuccess();
      showSuccessToast("Usuário atualizado com sucesso!");
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      showErrorToast(error.message || "Não foi possível atualizar o usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Usuário
          </DialogTitle>
        </DialogHeader>
        
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
            <FormField
              control={editForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="recepcao">Recepção</SelectItem>
                      <SelectItem value="triagem">Triagem</SelectItem>
                      <SelectItem value="dp-rh">DP-RH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha (deixe em branco para manter a atual)</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Nova senha" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-medium hover:bg-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
