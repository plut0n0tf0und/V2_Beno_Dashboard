import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from '@tanstack/react-table';
import { mockJsonData } from '../data/mockData';

interface DataSelectionSectionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isSelectionEnabled: boolean;
  chartType: string;
  labelField: string;
  valueField: string;
  initialName?: string;
  onConfirm: (chartName: string, selectedData: any[]) => void;
}

export default function DataSelectionSection({
  isOpen,
  setIsOpen,
  isSelectionEnabled,
  chartType,
  labelField,
  valueField,
  initialName = '',
  onConfirm
}: DataSelectionSectionProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [chartName, setChartName] = useState(initialName);
  const [filterText, setFilterText] = useState("");

  const columnHelper = createColumnHelper<any>();

  const getNestedValue = (obj: any, path: string) => {
    if (!path) return "";
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || "";
  };

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <div 
          onClick={table.getToggleAllRowsSelectedHandler()}
          className={`w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
            table.getIsAllRowsSelected() 
              ? 'bg-tertiary border-tertiary' 
              : table.getIsSomeRowsSelected()
                ? 'bg-tertiary/20 border-tertiary'
                : 'border-on-surface-variant/30 hover:border-tertiary'
          }`}
        >
          {(table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()) && (
            <svg className="w-3 h-3 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div 
          onClick={row.getToggleSelectedHandler()}
          className={`w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
            row.getIsSelected()
              ? 'bg-tertiary border-tertiary'
              : 'border-on-surface-variant/30 group-hover:border-tertiary'
          }`}
        >
          {row.getIsSelected() && (
            <svg className="w-3 h-3 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      ),
    }),
    columnHelper.accessor(labelField || 'label', {
      id: 'label',
      header: () => <span className="text-sm font-bold text-on-surface uppercase tracking-wider">{labelField || 'LABEL'}</span>,
      cell: info => (
        <span className="text-base text-on-surface font-medium line-clamp-1 leading-normal">
          {String(info.getValue() || '')}
        </span>
      ),
    }),
    columnHelper.accessor(valueField || 'value', {
      id: 'value',
      header: () => <span className="text-sm font-bold text-on-surface uppercase tracking-wider text-right block w-full">{valueField || 'VALUES'}</span>,
      cell: info => (
        <span className="text-sm font-mono text-on-surface-variant font-bold text-right leading-normal block w-full">
          {String(info.getValue() || '')}
        </span>
      ),
    }),
  ];

  const filteredData = useMemo(() => {
    return mockJsonData.products.filter(item => {
      const labelVal = String(getNestedValue(item, labelField));
      const valueVal = String(getNestedValue(item, valueField));
      return labelVal.toLowerCase().includes(filterText.toLowerCase()) ||
             valueVal.toLowerCase().includes(filterText.toLowerCase());
    });
  }, [filterText, labelField, valueField]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setRowSelection({});
      setChartName(initialName);
    }
  }, [isOpen, initialName]);

  const isConfirmed = Object.keys(rowSelection).length > 0 && chartName.trim().length > 0;

  const handleConfirm = () => {
    if (isConfirmed) {
      const selectedData = table.getSelectedRowModel().rows.map(row => row.original);
      onConfirm(chartName, selectedData);
    }
  };

  return (
    <div className="flex flex-col gap-6 transition-all duration-500 relative z-[60]">
      <div 
        className="flex items-center justify-between cursor-pointer group px-1"
        onClick={() => {
          if (isSelectionEnabled) setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-4">
          <h3 className={`font-headline text-lg font-bold tracking-tight transition-colors leading-tight ${isSelectionEnabled ? 'text-on-surface group-hover:text-tertiary' : 'text-on-surface-variant/40'}`}>
            Select Data
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-on-surface-variant" />
        ) : (
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-visible pb-4"
          >
            <div className="pt-4 flex flex-col gap-8">
              {!isSelectionEnabled ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-on-surface-variant/10 rounded-xl">
                  <span className="text-sm text-on-surface-variant font-medium text-center px-4 leading-normal">Complete mapping first to select data</span>
                </div>
              ) : (
                <>
                  {/* Table Search */}
                  <div className="relative group px-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-tertiary transition-colors" />
                    <input 
                      type="text"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      placeholder="Search and filter data rows..."
                      className="w-full bg-surface-container-highest/30 border border-on-surface-variant/10 rounded-2xl py-3 pl-12 pr-10 text-base text-on-surface placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-tertiary/10 focus:border-tertiary/50 outline-none transition-all"
                    />
                    {filterText && (
                      <button 
                        onClick={() => setFilterText("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-on-surface-variant/10 text-on-surface-variant transition-all outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="overflow-hidden border border-on-surface-variant/10 rounded-[1.5rem] bg-surface-container-highest/10">
                    <div className="max-h-[800px] lg:max-h-[80vh] overflow-y-auto minimal-scrollbar">
                      <table className="w-full border-collapse table-fixed">
                        {table.getHeaderGroups().map(headerGroup => (
                          <thead key={headerGroup.id} className="sticky top-0 z-20 bg-surface-container/90 backdrop-blur-md border-b border-outline-variant/10">
                            <tr>
                              {headerGroup.headers.map((header, index) => (
                                <th 
                                  key={header.id}
                                  className={`px-4 lg:px-6 py-4 text-left ${index === 0 ? 'w-16' : index === 1 ? 'w-auto' : 'w-32'}`}
                                >
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        ))}
                        
                        <tbody className="divide-y divide-on-surface-variant/5">
                          {table.getRowModel().rows.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="py-20 text-center">
                                <span className="text-sm text-on-surface-variant/50">No matching data found</span>
                              </td>
                            </tr>
                          ) : (
                            table.getRowModel().rows.map(row => (
                              <tr 
                                key={row.id}
                                className={`hover:bg-surface-container transition-all cursor-pointer group ${row.getIsSelected() ? 'bg-tertiary/10' : ''}`}
                                onClick={row.getToggleSelectedHandler()}
                              >
                                {row.getVisibleCells().map((cell, index) => (
                                  <td 
                                    key={cell.id}
                                    className={`px-4 lg:px-6 py-5 uppercase ${index === 0 ? 'w-16' : index === 1 ? 'w-auto' : 'w-32'}`}
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </td>
                                ))}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Form Section - Flattened */}
                  <div className="pt-2 space-y-5">
                    <div className="space-y-2 px-1">
                      <label className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">
                        {initialName ? 'UPDATE CHART NAME' : 'Enter chart name'}
                      </label>
                      <input 
                        type="text"
                        value={chartName}
                        onChange={(e) => setChartName(e.target.value)}
                        placeholder={`e.g. Dashboard ${chartType || 'Chart'}`}
                        className="w-full bg-surface-container border-b border-on-surface-variant/10 hover:border-tertiary/50 focus:border-tertiary px-0 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all leading-normal bg-transparent"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={handleConfirm}
                        disabled={!isConfirmed}
                        className={`px-12 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-tertiary/20 ${
                          isConfirmed 
                            ? 'bg-tertiary text-surface hover:opacity-95 active:scale-[0.97]' 
                            : 'bg-on-surface-variant/20 text-on-surface-variant cursor-not-allowed opacity-50'
                        }`}
                      >
                        {initialName ? 'Update mapping' : 'Show selected data in new chart'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
