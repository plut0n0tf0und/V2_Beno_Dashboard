import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MappingSectionProps {
  isMappingOpen: boolean;
  setIsMappingOpen: (open: boolean) => void;
  isMappingEnabled: boolean;
  selectedChart: string;
  setSelectedChart: (chart: string) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  selectedValue: string;
  setSelectedValue: (val: string) => void;
  isSubFieldsEnabled: boolean;
  onOpenDataSelection: () => void;
  editingChartId?: string;
  highlightMapping: boolean;
  chartTypes: string[];
  labelFields: string[];
  valueFields: string[];
  onCancelEdit: () => void;
}

export default function MappingSection({
  isMappingOpen,
  setIsMappingOpen,
  isMappingEnabled,
  selectedChart,
  setSelectedChart,
  selectedLabel,
  setSelectedLabel,
  selectedValue,
  setSelectedValue,
  isSubFieldsEnabled,
  onOpenDataSelection,
  editingChartId,
  highlightMapping,
  chartTypes,
  labelFields,
  valueFields,
  onCancelEdit
}: MappingSectionProps) {
  return (
    <motion.div 
      animate={highlightMapping ? { 
        scale: [1, 1.05, 1], 
        boxShadow: [
          "0 0 0px rgba(var(--color-tertiary), 0)", 
          "0 0 40px rgba(var(--color-tertiary), 0.4)", 
          "0 0 0px rgba(var(--color-tertiary), 0)"
        ] 
      } : {}}
      transition={{ duration: 1, repeat: highlightMapping ? Infinity : 0 }}
      className={`bg-surface-container rounded-2xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 shadow-sm transition-all duration-500 relative z-[70] ${highlightMapping ? 'ring-4 ring-tertiary shadow-[0_0_50px_-12px_rgba(var(--color-tertiary),0.5)] bg-surface-container-high' : ''}`}
    >
      {highlightMapping && (
        <div className="absolute -inset-2 bg-tertiary/5 rounded-[22px] -z-10 animate-pulse" />
      )}
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsMappingOpen(!isMappingOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-sm text-on-surface">2</div>
          <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">Mapping</h3>
        </div>
        {isMappingOpen ? (
          <ChevronUp className="w-5 h-5 text-on-surface-variant" />
        ) : (
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        )}
      </div>
      
      <AnimatePresence initial={false}>
        {isMappingOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              {!isMappingEnabled ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-on-surface-variant/10 rounded-xl">
                  <span className="text-xs text-on-surface-variant font-medium text-center px-4">Add data source first to start mapping</span>
                </div>
              ) : (
                <div className="space-y-6 border border-on-surface-variant/10 rounded-2xl p-5 bg-surface-container-low">
                  {/* Chart Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface">1. CHART TYPE</label>
                    <div className="relative">
                      <select 
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                        className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 px-4 text-sm text-on-surface appearance-none outline-none focus:ring-2 focus:ring-tertiary/20 font-medium"
                      >
                        <option value="" disabled>Select a type of chart</option>
                        {chartTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>

                  <div className="h-[1px] bg-on-surface-variant/10" />

                  {/* Data Mapping */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface">2. DATA MAPPING</label>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        TIP: Select type of label and value to see and select data that needs to come in the chart
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Select type of label</label>
                        <div className="relative">
                          <select 
                            value={selectedLabel}
                            onChange={(e) => setSelectedLabel(e.target.value)}
                            disabled={!isSubFieldsEnabled}
                            className={`w-full border border-on-surface-variant/10 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:ring-2 focus:ring-tertiary/20 font-medium transition-all ${
                              isSubFieldsEnabled ? 'bg-surface-container-highest text-on-surface' : 'bg-on-surface-variant/5 text-on-surface-variant/40 cursor-not-allowed'
                            }`}
                          >
                            <option value="" disabled>Select field</option>
                            {labelFields.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown className={`absolute right-4 top-3.5 w-4 h-4 pointer-events-none ${isSubFieldsEnabled ? 'text-on-surface-variant' : 'text-on-surface-variant/20'}`} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Select type of value</label>
                        <div className="relative">
                          <select 
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            disabled={!isSubFieldsEnabled}
                            className={`w-full border border-on-surface-variant/10 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:ring-2 focus:ring-tertiary/20 font-medium transition-all ${
                              isSubFieldsEnabled ? 'bg-surface-container-highest text-on-surface' : 'bg-on-surface-variant/5 text-on-surface-variant/40 cursor-not-allowed'
                            }`}
                          >
                            <option value="" disabled>Select field</option>
                            {valueFields.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown className={`absolute right-4 top-3.5 w-4 h-4 pointer-events-none ${isSubFieldsEnabled ? 'text-on-surface-variant' : 'text-on-surface-variant/20'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedLabel && selectedValue && (
                    <button 
                      onClick={onOpenDataSelection}
                      className="w-full py-3 rounded-xl bg-on-surface text-surface font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      {editingChartId ? 'Update Mapping' : 'Select Label & Value'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
