
import { useState, useEffect } from "react";
import { Malote } from "@/types/malote";
import { MaloteFormDialog } from "./MaloteFormDialog";
import { MaloteTable } from "./MaloteTable";
import { MaloteActions } from "./MaloteActions";
import { MalotesPagination } from "./MalotesPagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface MalotesContentProps {
  malotes: Malote[];
  loading: boolean;
  tipoTabela: string;
  selectedMalotes: Malote[];
  onCreateMalote: () => void;
  onSelectionChange: (malotes: Malote[]) => void;
  onSaveEdit: (malote: Malote) => void;
  onDelete: (malote: Malote) => void;
  onDeleteSelected: (malotes: Malote[]) => void;
}

export const MalotesContent = ({
  malotes,
  loading,
  tipoTabela,
  selectedMalotes,
  onCreateMalote,
  onSelectionChange,
  onSaveEdit,
  onDelete,
  onDeleteSelected,
}: MalotesContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageKey] = useState(`itemsPerPage-${tipoTabela}`);
  const [itemsPerPage, setItemsPerPage] = useLocalStorage(itemsPerPageKey, 10);
  
  const [maloteEmEdicao, setMaloteEmEdicao] = useState<Malote | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  // Reset to page 1 when items per page changes or when malotes data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, malotes.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMalotes = malotes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(malotes.length / itemsPerPage);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to page 1 when changing items per page
  };

  const handleEditMalote = (malote: Malote) => {
    setMaloteEmEdicao(malote);
    setDialogAberto(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
        <p className="ml-2 text-gray-500">Carregando malotes...</p>
      </div>
    );
  }

  return (
    <>
      <MaloteActions 
        malotes={malotes}
        onCreateMalote={onCreateMalote}
        onDeleteSelected={() => onDeleteSelected(selectedMalotes)}
        selectedMalotes={selectedMalotes}
        tipoTabela={tipoTabela}
      />
      
      <MaloteTable
        malotes={currentMalotes}
        onDelete={onDelete}
        onSelectionChange={onSelectionChange}
        onEdit={handleEditMalote}
      />

      <MalotesPagination 
        currentPage={currentPage}
        totalItems={malotes.length}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <MaloteFormDialog
        open={dialogAberto}
        onClose={() => {
          setDialogAberto(false);
          setMaloteEmEdicao(null);
        }}
        malote={maloteEmEdicao}
        onSave={onSaveEdit}
        tipoTabela={tipoTabela}
      />
    </>
  );
};
