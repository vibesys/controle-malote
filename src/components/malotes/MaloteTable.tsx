
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Malote } from "@/types/malote";
import { maloteColumns, formatDate } from "@/utils/maloteUtils";
import { useEffect, useRef } from "react";

interface MaloteTableProps {
  malotes: Malote[];
  onSelectionChange: (selectedItems: Malote[]) => void;
  onEdit?: (malote: Malote) => void;
  onDelete?: (malote: Malote) => void;
}

export function MaloteTable({ 
  malotes, 
  onSelectionChange,
  onEdit,
  onDelete 
}: MaloteTableProps) {
  const tableScrollRef = useRef<HTMLDivElement>(null);

  // Format dates for display
  const formattedMalotes = malotes.map(malote => ({
    ...malote,
    data_cadastro: formatDate(malote.data_cadastro),
    data_chegada: formatDate(malote.data_chegada),
    data_entrega: formatDate(malote.data_entrega)
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollContainer = tableScrollRef.current;
      if (!scrollContainer) return;

      // Check if the scroll container is focused or contains the focused element
      const activeElement = document.activeElement;
      const isTableAreaFocused = scrollContainer === activeElement || scrollContainer.contains(activeElement);
      
      if (!isTableAreaFocused) return;

      const scrollAmount = 200;
      let handled = false;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          event.stopPropagation();
          scrollContainer.scrollLeft -= scrollAmount;
          handled = true;
          break;
        case 'ArrowRight':
          event.preventDefault();
          event.stopPropagation();
          scrollContainer.scrollLeft += scrollAmount;
          handled = true;
          break;
        case 'Home':
          if (event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            scrollContainer.scrollLeft = 0;
            handled = true;
          }
          break;
        case 'End':
          if (event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            scrollContainer.scrollLeft = scrollContainer.scrollWidth;
            handled = true;
          }
          break;
      }

      if (handled) {
        console.log(`Scroll handled: ${event.key}, new scrollLeft: ${scrollContainer.scrollLeft}`);
      }
    };

    // Add event listener to the document but check focus within the handler
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  const handleTableClick = (event: React.MouseEvent) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.focus();
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div 
          ref={tableScrollRef}
          className="overflow-x-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
          tabIndex={0}
          onClick={handleTableClick}
          onKeyDown={(e) => {
            // Allow the useEffect handler to manage all keyboard events
            // This ensures proper event handling within the component
          }}
        >
          <DataTable
            data={formattedMalotes}
            columns={maloteColumns}
            onSelectionChange={onSelectionChange}
            enableSelection={true}
            onRowClick={undefined}
            actions={onDelete ? (row) => (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row);
                }}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            ) : undefined}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Clique na tabela e use: ← → para navegar horizontalmente | Ctrl+Home/End para ir ao início/fim
        </div>
      </CardContent>
    </Card>
  );
}
