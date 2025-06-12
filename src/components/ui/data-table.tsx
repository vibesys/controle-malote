
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpDown } from "lucide-react";

interface Column {
  key: string;
  header: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  onSelectionChange?: (selectedItems: T[]) => void;
  enableSelection?: boolean;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  onSelectionChange,
  enableSelection = false,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    
    return sortedData.filter((item: any) => {
      return columns.some(column => {
        const value = item[column.key];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [sortedData, searchTerm, columns]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData);
    } else {
      setSelectedItems([]);
    }
    
    if (onSelectionChange) {
      onSelectionChange(checked ? filteredData : []);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    let newSelectedItems: T[];
    
    if (checked) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter(
        selectedItem => JSON.stringify(selectedItem) !== JSON.stringify(item)
      );
    }
    
    setSelectedItems(newSelectedItems);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedItems);
    }
  };

  const isItemSelected = (item: T) => {
    return selectedItems.some(
      selectedItem => JSON.stringify(selectedItem) === JSON.stringify(item)
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-dark">
              {enableSelection && (
                <TableHead className="w-[50px] text-white">
                  <Checkbox
                    checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="border-white"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className="text-white">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center text-white hover:text-white hover:bg-transparent"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
              {actions && <TableHead className="w-[100px] text-white">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={enableSelection ? columns.length + 2 : columns.length + 1}
                  className="text-center h-24 text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {enableSelection && (
                    <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isItemSelected(item)}
                        onCheckedChange={(checked) => handleSelectItem(item, !!checked)}
                        aria-label={`Select row ${index}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>{item[column.key] || '-'}</TableCell>
                  ))}
                  {actions && (
                    <TableCell className="w-[100px]" onClick={(e) => e.stopPropagation()}>
                      {actions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
