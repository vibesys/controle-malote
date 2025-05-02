
import { Button } from "@/components/ui/button";
import { Malote } from "@/types/malote";

interface MaloteMainActionsProps {
  onCreateMalote: () => void;
  onDeleteSelected?: () => void;
  selectedCount: number;
}

export const MaloteMainActions = ({ 
  onCreateMalote, 
  onDeleteSelected,
  selectedCount
}: MaloteMainActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onCreateMalote}
        className="bg-blue-medium hover:bg-blue-dark"
      >
        Novo Malote
      </Button>
      {selectedCount > 0 && (
        <Button 
          onClick={onDeleteSelected}
          variant="destructive"
        >
          Excluir Selecionados ({selectedCount})
        </Button>
      )}
    </div>
  );
};
