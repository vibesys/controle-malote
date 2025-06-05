
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Malote } from "@/types/malote";
import { useFileHandlers } from "@/hooks/useFileHandlers";

interface MaloteFileActionsProps {
  malotes: Malote[];
  tipoTabela?: string;
}

export const MaloteFileActions = ({ malotes, tipoTabela = "recepcao" }: MaloteFileActionsProps) => {
  const { exportToExcel } = useFileHandlers();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => exportToExcel(malotes)}
        className="bg-green-600 hover:bg-green-700"
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
};
