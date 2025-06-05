
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

  // Format dates for display
  const formattedMalotes = malotes.map(malote => ({
    ...malote,
    data_cadastro: formatDate(malote.data_cadastro),
    data_chegada: formatDate(malote.data_chegada),
    data_entrega: formatDate(malote.data_entrega)
  }));

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!tableRef.current) return;

      const scrollAmount = 300; // Increased scroll amount for better navigation
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        tableRef.current.scrollLeft -= scrollAmount;
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        tableRef.current.scrollLeft += scrollAmount;
      } else if (event.key === 'Home') {
        event.preventDefault();
        tableRef.current.scrollLeft = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        tableRef.current.scrollLeft = tableRef.current.scrollWidth;
      }
    };

    // Add focus to the table container to ensure it can receive keyboard events
    const focusTable = () => {
      if (tableRef.current) {
        tableRef.current.focus();
      }
    };

    // Set up the event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Focus the table when component mounts
    focusTable();

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div 
          ref={tableRef} 
          className="overflow-x-auto focus:outline-none"
          tabIndex={0}
          style={{ scrollBehavior: 'smooth' }}
        >
          <DataTable
            data={formattedMalotes}
            columns={maloteColumns}
            onSelectionChange={onSelectionChange}
            enableSelection={true}
            onRowClick={undefined} // Disable edit functionality by removing the click handler
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
          Use as setas ← → do teclado para navegar horizontalmente | Home/End para ir ao início/fim
        </div>
      </CardContent>
    </Card>
  );
}
