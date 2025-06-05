
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
  const tableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format dates for display
  const formattedMalotes = malotes.map(malote => ({
    ...malote,
    data_cadastro: formatDate(malote.data_cadastro),
    data_chegada: formatDate(malote.data_chegada),
    data_entrega: formatDate(malote.data_entrega)
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if no input is focused
      if (document.activeElement?.tagName === 'INPUT') return;
      
      const container = tableRef.current;
      if (!container) return;

      const scrollAmount = 200;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          break;
        case 'ArrowRight':
          event.preventDefault();
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          break;
        case 'Home':
          if (event.ctrlKey) {
            event.preventDefault();
            container.scrollTo({ left: 0, behavior: 'smooth' });
          }
          break;
        case 'End':
          if (event.ctrlKey) {
            event.preventDefault();
            container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
          }
          break;
      }
    };

    const handleClick = () => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    if (containerRef.current) {
      containerRef.current.addEventListener('click', handleClick);
    }

    // Auto focus on mount
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div 
          ref={containerRef}
          className="focus:outline-none cursor-pointer"
          tabIndex={0}
          onClick={() => containerRef.current?.focus()}
        >
          <div 
            ref={tableRef} 
            className="overflow-x-auto border rounded-md"
            style={{ scrollBehavior: 'smooth' }}
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
            Clique na tabela e use: ← → para navegar | Ctrl+Home/End para ir ao início/fim
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
