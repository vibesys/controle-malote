import { useState } from "react";
import { Malote } from "@/types/malote";
import { MaloteFormDialog } from "./MaloteFormDialog";
import { MaloteTable } from "./MaloteTable";
import { MaloteActions } from "./MaloteActions";
import { MalotesPagination } from "./MalotesPagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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

const ITEMS_PER_PAGE = 1000;

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
  const [maloteEmEdicao, setMaloteEmEdicao] = useState<Malote | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const totalPages = Math.ceil(malotes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMalotes = malotes.slice(startIndex, endIndex);

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
      />

      <MalotesPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
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
