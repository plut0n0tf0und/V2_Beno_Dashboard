import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [chartName, setChartName] = useState(initialName);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedIndices([]);
      setChartName(initialName);
    }
  }, [isOpen, initialName]);

  const toggleIndex = (index: number) => {
    setSelectedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedIndices.length === mockJsonData.products.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(mockJsonData.products.map((_, i) => i));
    }
  };

  const isConfirmed = selectedIndices.length > 0 && chartName.trim().length > 0;

  const handleConfirm = () => {
    if (isConfirmed) {
      const selectedData = selectedIndices.map(i => mockJsonData.products[i]);
      onConfirm(chartName, selectedData);
    }
  };

  return (
    <div className="bg-surface-container rounded-2xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 shadow-sm transition-all duration-500 relative z-[60]">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => {
          if (isSelectionEnabled) setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isSelectionEnabled ? 'bg-on-surface-variant/20 text-on-surface' : 'bg-on-surface-variant/10 text-on-surface-variant/40'}`}>
            3
          </div>
          <h3 className={`font-headline text-lg font-bold transition-colors ${isSelectionEnabled ? 'text-on-surface group-hover:text-tertiary' : 'text-on-surface-variant/40'}`}>
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
            className="overflow-hidden"
          >
            <div className="pt-2 flex flex-col gap-6">
              {!isSelectionEnabled ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-on-surface-variant/10 rounded-xl">
                  <span className="text-xs text-on-surface-variant font-medium text-center px-4">Complete mapping first to select data</span>
                </div>
              ) : (
                <>
                  <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
                    {/* Table Header */}
                    <div className="flex items-center bg-surface-container-high/40 px-4 lg:px-6 py-3 border-b border-outline-variant/10">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center w-1/2 pr-4">
                          <div className="flex items-center gap-3">
                            {/* Check-All Box */}
                            <div 
                              onClick={toggleAll}
                              className={`w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
                                selectedIndices.length === mockJsonData.products.length 
                                  ? 'bg-tertiary border-tertiary' 
                                  : selectedIndices.length > 0
                                    ? 'bg-tertiary/20 border-tertiary'
                                    : 'border-on-surface-variant/30 hover:border-tertiary'
                              }`}
                            >
                              {selectedIndices.length > 0 && (
                                <svg className="w-3 h-3 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-bold text-on-surface uppercase tracking-wider">
                              {labelField || 'LABEL'}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-on-surface uppercase tracking-wider text-right">
                          {valueField || 'VALUES'}
                        </span>
                      </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="max-h-[250px] lg:max-h-[300px] overflow-y-auto min-[100px]:scrollbar-default divide-y divide-on-surface-variant/5">
                      {mockJsonData.products.map((item: any, index: number) => (
                        <div 
                          key={index}
                          onClick={() => toggleIndex(index)}
                          className="flex items-center px-4 lg:px-6 py-3 hover:bg-surface-container transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3 w-1/2 pr-4">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                selectedIndices.includes(index)
                                  ? 'bg-tertiary border-tertiary'
                                  : 'border-on-surface-variant/30 group-hover:border-tertiary'
                              }`}>
                                {selectedIndices.includes(index) && (
                                  <svg className="w-3 h-3 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-on-surface font-medium line-clamp-1">
                                {labelField ? String(item[labelField] || '') : ''}
                              </span>
                            </div>
                            <span className="text-sm font-mono text-on-surface-variant font-bold text-right">
                              {valueField ? String(item[valueField] || '') : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="bg-surface-container-low rounded-2xl p-4 lg:p-6 border border-outline-variant/10 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface">
                        {initialName ? 'UPDATE CHART NAME' : 'Enter chart name'}
                      </label>
                      <input 
                        type="text"
                        value={chartName}
                        onChange={(e) => setChartName(e.target.value)}
                        placeholder={`e.g. Dashboard ${chartType || 'Chart'}`}
                        className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-2.5 px-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-tertiary/20 outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button 
                        onClick={handleConfirm}
                        disabled={!isConfirmed}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          isConfirmed 
                            ? 'bg-on-surface text-surface hover:opacity-90 active:scale-[0.98]' 
                            : 'bg-on-surface-variant/20 text-on-surface-variant cursor-not-allowed opacity-50'
                        }`}
                      >
                        {initialName ? 'Update existing chart' : 'Show selected data in new chart'}
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
