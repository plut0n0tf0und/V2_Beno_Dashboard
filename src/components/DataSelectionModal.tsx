import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockJsonData } from '../data/mockData';

interface DataSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (chartName: string, selectedData: any[]) => void;
  labelField: string;
  valueField: string;
  initialName?: string;
}

export default function DataSelectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  labelField, 
  valueField,
  initialName = ''
}: DataSelectionModalProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [chartName, setChartName] = useState(initialName);

  // Reset state when modal opens
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface-container w-full max-w-2xl rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-outline-variant/20"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 lg:p-6 border-b border-outline-variant/10">
            <h2 className="text-lg lg:text-xl font-headline font-bold text-on-surface line-clamp-1">Select Labels & Values</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Content */}
          <div className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-hidden flex flex-col">
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
                        {labelField}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-on-surface uppercase tracking-wider text-right">
                    Values
                  </span>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-on-surface-variant/5">
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
                          {item[labelField] as string}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-on-surface-variant font-bold text-right">
                        {item[valueField] as number}
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
                  {initialName ? 'UPDATE CHART NAME' : 'SHOW SELECTED DATA IN NEW CHART'}
                </label>
                <input 
                  type="text"
                  value={chartName}
                  onChange={(e) => setChartName(e.target.value)}
                  placeholder="name your chart"
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
