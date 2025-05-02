
import { Malote } from "@/types/malote";
import { MaloteMainActions } from "./MaloteMainActions";
import { MaloteFileActions } from "./MaloteFileActions";

interface MaloteActionsProps {
  malotes: Malote[];
  onCreateMalote: () => void;
  onDeleteSelected?: (selectedItems: Malote[]) => void;
  selectedMalotes?: Malote[];
  tipoTabela?: string;
}

export const MaloteActions = ({ 
  malotes, 
  onCreateMalote, 
  onDeleteSelected,
  selectedMalotes = [],
  tipoTabela = "recepcao"
}: MaloteActionsProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
      <MaloteMainActions 
        onCreateMalote={onCreateMalote}
        onDeleteSelected={() => onDeleteSelected?.(selectedMalotes)}
        selectedCount={selectedMalotes.length}
      />
      <MaloteFileActions 
        malotes={malotes}
        tipoTabela={tipoTabela}
      />
    </div>
  );
};
