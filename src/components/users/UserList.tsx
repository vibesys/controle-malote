
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { User } from "@/types/user";

interface UserListProps {
  users: any[];
  currentUser: User | null;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

export function UserList({ users, currentUser, onEdit, onDelete }: UserListProps) {
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
    <>
      <h2 className="text-xl font-medium mb-4">Usuários Cadastrados</h2>
      <DataTable
        data={users}
        columns={columns}
        actions={(user) => (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(user)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(user)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              disabled={user.username === currentUser?.username}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      />
    </>
  );
}
