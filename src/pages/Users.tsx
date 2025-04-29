
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showSuccessToast, showErrorToast, useConfirmDialog } from "@/components/ui/toast-custom";
import { Trash2, Edit, UserCog, Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usersDB, logsDB } from "@/utils/supabase";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string().min(1, "Selecione um perfil"),
});

const editFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  role: z.string().min(1, "Selecione um perfil"),
  password: z.string().optional(),
});

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<any>(null);
  const { showDialog, Dialog: ConfirmDialog } = useConfirmDialog();
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Access control check
  useEffect(() => {
    if (!currentUser?.isAdmin) {
      window.location.href = "/";
    }
  }, [currentUser]);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersDB.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showErrorToast("Não foi possível carregar a lista de usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "",
    },
  });

  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      role: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setCreateError(null);
    
    try {
      console.log("Submitting user creation form:", values);
      
      const response = await usersDB.createUser(
        values.name, 
        values.username, 
        values.password, 
        values.role
      );
      
      console.log("User creation response:", response);
      
      if (response && response.error) {
        throw new Error(response.error);
      }
      
      await logsDB.create({
        acao: "Criou usuário",
        usuario_email: currentUser?.username || "admin",
        data_hora: new Date().toISOString(),
        detalhes: `Usuário: ${values.username}, Perfil: ${values.role}`
      });
      
      await fetchUsers();
      showSuccessToast("Usuário cadastrado com sucesso!");
      form.reset();
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      setCreateError(error.message || "Erro ao cadastrar usuário.");
      showErrorToast(error.message || "Não foi possível cadastrar o usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setCurrentEditUser(user);
    editForm.reset({
      name: user.name,
      role: user.role,
      password: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (!currentEditUser) return;
    
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
      await usersDB.updateUser(currentEditUser.id, updates);
      
      await logsDB.create({
        acao: "Editou usuário",
        usuario_email: currentUser?.username || "admin",
        data_hora: new Date().toISOString(),
        detalhes: `Usuário: ${currentEditUser.username}, Perfil: ${values.role}`
      });
      
      setIsEditDialogOpen(false);
      await fetchUsers();
      showSuccessToast("Usuário atualizado com sucesso!");
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      showErrorToast(error.message || "Não foi possível atualizar o usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (user: any) => {
    // Cannot delete yourself
    if (user.username === currentUser?.username) {
      showErrorToast("Você não pode excluir seu próprio usuário!");
      return;
    }
    
    showDialog(
      `Deseja excluir o usuário ${user.name}?`,
      async () => {
        try {
          await usersDB.deleteUser(user.id);
          
          await logsDB.create({
            acao: "Excluiu usuário",
            usuario_email: currentUser?.username || "admin",
            data_hora: new Date().toISOString(),
            detalhes: `Usuário: ${user.username}`
          });
          
          await fetchUsers();
          showSuccessToast("Usuário excluído com sucesso!");
        } catch (error: any) {
          console.error('Erro ao excluir usuário:', error);
          showErrorToast(error.message || "Não foi possível excluir o usuário.");
        }
      }
    );
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'administrador': return 'Administrador';
      case 'recepcao': return 'Recepção';
      case 'triagem': return 'Triagem';
      case 'dp-rh': return 'DP-RH';
      default: return role;
    }
  };

  const columns = [
    {
      key: "name",
      header: "Nome",
      cell: (row: any) => <span>{row.name}</span>,
    },
    {
      key: "username",
      header: "Usuário",
      cell: (row: any) => <span>{row.username}</span>,
    },
    {
      key: "role",
      header: "Perfil",
      cell: (row: any) => <span>{getRoleName(row.role)}</span>,
    },
  ];

  return (
    <PageContainer title="Gerenciar Usuários" backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Novo Usuário
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome de usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Senha do usuário" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
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
                {createError && (
                  <div className="text-red-500 text-sm mt-2">{createError}</div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-medium hover:bg-blue-dark mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Usuários Cadastrados</h2>
            <DataTable
              data={users}
              columns={columns}
              actions={(user) => (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(user)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={user.username === currentUser?.username}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                  onClick={() => setIsEditDialogOpen(false)}
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
      
      <ConfirmDialog />
    </PageContainer>
  );
}
