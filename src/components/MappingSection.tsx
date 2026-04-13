import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DataSelectionSection from './DataSelectionSection';
import CustomDropdown from './CustomDropdown';

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
  isDataSelectionOpen: boolean;
  setIsDataSelectionOpen: (open: boolean) => void;
  isSelectionEnabled: boolean;
  editingChartId?: string;
  highlightMapping: boolean;
  chartTypes: string[];
  labelFields: string[];
  valueFields: string[];
  dataSelectionRef?: React.RefObject<HTMLDivElement | null>;
  onCancelEdit: () => void;
  onContinue: (selectedData: any[]) => void;
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
  isDataSelectionOpen,
  setIsDataSelectionOpen,
  isSelectionEnabled,
  editingChartId,
  highlightMapping,
  chartTypes,
  labelFields,
  valueFields,
  dataSelectionRef,
  onCancelEdit,
  onContinue,
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
      className={`w-full bg-surface-container rounded-[2rem] p-4 lg:p-8 flex flex-col gap-4 lg:gap-8 shadow-sm transition-all duration-500 relative z-[70] ${highlightMapping ? 'ring-4 ring-tertiary shadow-[0_0_50px_-12px_rgba(var(--color-tertiary),0.5)] bg-surface-container-high' : ''}`}
    >
      {highlightMapping && (
        <div className="absolute -inset-2 bg-tertiary/5 rounded-[22px] -z-10 animate-pulse" />
      )}
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsMappingOpen(!isMappingOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-sm text-on-surface leading-normal">2</div>
          <h3 className="font-headline text-xl font-extrabold text-on-surface group-hover:text-tertiary transition-colors leading-tight">Mapping</h3>
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
            className="overflow-visible pb-4"
          >
            <div className="pt-2">
              {!isMappingEnabled ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-on-surface-variant/10 rounded-xl">
                  <span className="text-sm text-on-surface-variant font-medium text-center px-4 leading-normal">Add data source first to start mapping</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4 border border-on-surface-variant/10 rounded-2xl p-4 lg:p-8 bg-surface-container-low">
                  {/* Chart Type */}
                  <CustomDropdown
                    headerLabel="1. REQUIRED CHART"
                    options={chartTypes}
                    value={selectedChart}
                    onChange={setSelectedChart}
                    placeholder="Select a type of chart"
                  />

                  <div className="h-px bg-on-surface-variant/10" />

                  {/* Data Mapping */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">2. DATA MAPPING</label>
                      <p className="text-xs text-on-surface-variant/60 leading-normal mt-0.5">
                        Match the required data for the chart with the data fetched
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-10">
                      <CustomDropdown
                        headerLabel="Select type of label"
                        options={labelFields}
                        value={selectedLabel}
                        onChange={setSelectedLabel}
                        disabled={!isSubFieldsEnabled}
                        placeholder="Select field"
                      />

                      <CustomDropdown
                        headerLabel="Select type of value"
                        options={valueFields}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        disabled={!isSubFieldsEnabled}
                        placeholder="Select field"
                      />
                    </div>
                  </div>

                  {selectedLabel && selectedValue && (
                    <>
                      <div className="h-px bg-on-surface-variant/10" />
                      <div ref={dataSelectionRef}>
                        <DataSelectionSection
                          isOpen={isDataSelectionOpen}
                          setIsOpen={setIsDataSelectionOpen}
                          isSelectionEnabled={isSelectionEnabled}
                          chartType={selectedChart}
                          labelField={selectedLabel}
                          valueField={selectedValue}
                          onContinue={onContinue}
                        />
                      </div>
                    </>
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
