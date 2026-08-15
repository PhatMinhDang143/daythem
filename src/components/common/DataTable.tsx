import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  filterFn: (item: any) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilterKeys?: (keyof T)[];
  filters?: {
    name: string;
    options: FilterOption[];
  }[];
  exportFilename?: string;
  actions?: React.ReactNode;
  itemsPerPageOptions?: number[];
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

function DataTableComponent<T>({
  data,
  columns,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  searchFilterKeys,
  filters,
  exportFilename = 'du_lieu_trung_tam',
  actions,
  itemsPerPageOptions = [10, 20, 50],
  emptyMessage = 'Không tìm thấy dữ liệu phù hợp',
  keyExtractor,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  // Handle Search & Filter
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        if (searchFilterKeys && searchFilterKeys.length > 0) {
          const matches = searchFilterKeys.some((key) => {
            const val = item[key];
            return val != null && String(val).toLowerCase().includes(query);
          });
          if (!matches) return false;
        } else {
          // General match on string values
          const matches = Object.values(item).some(
            (val) => val != null && String(val).toLowerCase().includes(query)
          );
          if (!matches) return false;
        }
      }

      // Filter dropdowns
      if (filters) {
        for (const f of filters) {
          const selectedVal = activeFilters[f.name];
          if (selectedVal && selectedVal !== 'ALL') {
            const opt = f.options.find((o) => o.value === selectedVal);
            if (opt && !opt.filterFn(item)) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, activeFilters, filters, searchFilterKeys]);

  // Pagination Math
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Export to Excel / CSV trigger
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((item: any) =>
      columns
        .map((c) => {
          if (c.accessorKey) {
            const val = item[c.accessorKey];
            return `"${String(val ?? '').replace(/"/g, '""')}"`;
          }
          return '""';
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFilename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151d30] border border-[#233047] p-3 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full bg-[#1e293b] border border-[#233047] text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters?.map((f) => (
            <div key={f.name} className="flex items-center gap-1.5 bg-[#1e293b] border border-[#233047] rounded-xl px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-300" />
              <select
                value={activeFilters[f.name] || 'ALL'}
                onChange={(e) => {
                  setActiveFilters((prev) => ({ ...prev, [f.name]: e.target.value }));
                  setCurrentPage(1);
                }}
                aria-label={`Bộ lọc: ${f.name}`}
                className="bg-transparent text-white border-none focus:outline-none text-xs cursor-pointer"
              >
                <option value="ALL" className="bg-[#151d30] text-slate-200">
                  {f.name}: Tất cả
                </option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#151d30] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            onClick={handleExportCSV}
            title="Xuất file CSV / Excel"
            aria-label="Xuất file CSV hoặc Excel"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#27354f] border border-[#233047] text-xs text-slate-200 hover:text-white transition-all cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-medium">Xuất Excel</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#151d30] border border-[#233047] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Bảng dữ liệu quản lý">
            <thead className="bg-[#1e293b]/90 border-b border-[#233047] text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10 text-center">#</th>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3 px-4 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233047]/60 text-slate-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={keyExtractor(item)} className="hover:bg-[#1e293b]/50 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-300 text-[11px] font-medium">{globalIdx}</td>
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className={`py-3 px-4 ${col.className || ''}`}>
                          {col.cell
                            ? col.cell(item, idx)
                            : col.accessorKey
                            ? String(item[col.accessorKey] ?? '')
                            : null}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 text-xs font-medium">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#151d30] border-t border-[#233047] text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Số dòng hiển thị trên mỗi trang"
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 focus:outline-none"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>/ {filteredData.length} kết quả</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="mr-2 text-[11px] text-slate-300">
              Trang <strong className="text-white font-bold">{currentPage}</strong> / {totalPages}
            </span>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Trang trước"
              className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Trang sau"
              className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DataTable = React.memo(DataTableComponent) as typeof DataTableComponent;
