
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-custom";
import { meiosTransporteDB } from "@/utils/supabaseDB";
import { MeioTransporte } from "@/utils/localStorage";
import { DataTable } from "@/components/ui/data-table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ComoChegou() {
  const [novoMeioTransporte, setNovoMeioTransporte] = useState("");
  const [meiosTransporte, setMeiosTransporte] = useState<MeioTransporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MeioTransporte[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchMeiosTransporte();
  }, []);

  const fetchMeiosTransporte = async () => {
    try {
      setIsLoading(true);
      const data = await meiosTransporteDB.getAll();
      setMeiosTransporte(data);
    } catch (error) {
      console.error('Erro ao carregar meios de transporte:', error);
      showErrorToast("Erro ao carregar meios de transporte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (novoMeioTransporte.trim()) {
      try {
        await meiosTransporteDB.create({ nome: novoMeioTransporte.trim() });
        await fetchMeiosTransporte();
        setNovoMeioTransporte("");
        showSuccessToast("Meio de transporte adicionado com sucesso!");
      } catch (error) {
        console.error('Erro ao adicionar meio de transporte:', error);
        showErrorToast("Erro ao adicionar meio de transporte");
      }
    }
  };
  
  const handleDeleteSelected = async () => {
    try {
      setIsLoading(true);
      const deletePromises = selectedItems.map(item => meiosTransporteDB.remove(item.id));
      await Promise.all(deletePromises);
      showSuccessToast(`${selectedItems.length} item(s) excluído(s) com sucesso!`);
      setSelectedItems([]);
      await fetchMeiosTransporte();
    } catch (error) {
      console.error('Erro ao excluir itens:', error);
      showErrorToast("Erro ao excluir itens");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const columns = [
    {
      key: "nome",
      header: "Nome do Transporte"
    }
  ];
  
  return (
    <PageContainer title="Cadastro de Como Chegou">
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Digite um novo meio de transporte"
              value={novoMeioTransporte}
              onChange={(e) => setNovoMeioTransporte(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAdd} 
              className="bg-blue-medium hover:bg-blue-dark"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="mb-4 flex justify-end">
            {selectedItems.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Excluir Selecionados ({selectedItems.length})
              </Button>
            )}
          </div>

          <DataTable
            data={meiosTransporte}
            columns={columns}
            enableSelection={true}
            onSelectionChange={setSelectedItems}
          />

          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir {selectedItems.length} item(s) selecionado(s)?
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
