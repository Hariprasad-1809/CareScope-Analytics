import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  sortable?: boolean;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  initialSort?: {
    key: keyof T | string;
    direction: 'asc' | 'desc';
  };
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  onRowClick,
  pageSize = 10,
  initialSort
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(initialSort || null);

  // Sorting Handler
  const handleSort = (key: keyof T | string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    
    return data.filter((item) => {
      const value = item[searchKey];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 3. Paginate Data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Page index helper
  const pageRange = useMemo(() => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getSortIcon = (column: ColumnDef<T>) => {
    if (!column.sortable) return null;
    if (!sortConfig || sortConfig.key !== column.accessorKey) {
      return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 opacity-45 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-teal" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1 text-teal" />;
  };

  return (
    <div className="flex flex-col h-full w-full justify-between">
      {/* Search Header */}
      {searchKey && (
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-ink/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm bg-paper border border-grid rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:ring-1 focus:ring-teal focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto w-full rounded-lg border border-grid bg-white">
        <table className="w-full border-collapse text-left text-sm text-ink">
          <thead className="bg-paper text-ink/75 border-b border-grid font-semibold">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  onClick={() => column.sortable && handleSort(column.accessorKey)}
                  className={cn(
                    "px-4 py-3.5 select-none",
                    column.sortable && "cursor-pointer group hover:text-teal"
                  )}
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    {getSortIcon(column)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-grid">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "hover:bg-paper/40 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 text-ink">
                      {column.cell ? (
                        column.cell(row)
                      ) : (
                        row[column.accessorKey as string]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-ink/60">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-grid pt-4 mt-4 text-sm text-ink/70">
          <span className="text-xs">
            Showing <strong className="text-ink font-mono">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-ink font-mono">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </strong>{" "}
            of <strong className="text-ink font-mono">{sortedData.length}</strong> records
          </span>
          
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-grid rounded bg-paper hover:bg-grid/25 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-teal" />
            </button>
            
            {pageRange.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "px-3 py-1 border rounded text-xs transition-all cursor-pointer font-mono",
                  currentPage === page
                    ? "bg-teal text-paper border-teal font-semibold"
                    : "border-grid bg-paper text-ink/80 hover:bg-grid/25 hover:text-ink"
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-grid rounded bg-paper hover:bg-grid/25 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-teal" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
