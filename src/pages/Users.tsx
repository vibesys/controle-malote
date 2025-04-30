
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usersDB, logsDB } from "@/utils/supabase";
import { showErrorToast, useConfirmDialog } from "@/components/ui/toast-custom";
import { UserForm } from "@/components/users/UserForm";
import { UserList } from "@/components/users/UserList";
import { UserEditDialog } from "@/components/users/UserEditDialog";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<any>(null);
  const { showDialog, Dialog: ConfirmDialog } = useConfirmDialog();
  
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

  const handleEdit = (user: any) => {
    setCurrentEditUser(user);
    setIsEditDialogOpen(true);
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
        } catch (error: any) {
          console.error('Erro ao excluir usuário:', error);
          showErrorToast(error.message || "Não foi possível excluir o usuário.");
        }
      }
    );
  };

  return (
    <PageContainer title="Gerenciar Usuários" backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="pt-6">
            <UserForm 
              currentUser={currentUser} 
              onSuccess={fetchUsers} 
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardContent className="pt-6">
            <UserList
              users={users}
              currentUser={currentUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
      
      {currentEditUser && (
        <UserEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          user={currentEditUser}
          currentUser={currentUser}
          onSuccess={fetchUsers}
        />
      )}
      
      <ConfirmDialog />
    </PageContainer>
  );
}
