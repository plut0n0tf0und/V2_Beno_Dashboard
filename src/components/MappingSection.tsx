import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DataSelectionSection from './DataSelectionSection';
import CustomDropdown from './CustomDropdown';

interface MappingSectionProps {
  isMappingOpen: boolean;
  setIsMappingOpen: (open: boolean) => void;
  isMappingEnabled: boolean;
  canEdit: boolean;
  selectedChart: string;
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
  canEdit,
  selectedChart,
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
      className={`w-full bg-surface-container rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 lg:p-8 flex flex-col gap-3 sm:gap-4 lg:gap-8 shadow-sm transition-all duration-500 relative z-[70] ${highlightMapping ? 'ring-4 ring-tertiary shadow-[0_0_50px_-12px_rgba(var(--color-tertiary),0.5)] bg-surface-container-high' : ''}`}
    >
      {highlightMapping && (
        <div className="absolute -inset-2 bg-tertiary/5 rounded-[22px] -z-10 animate-pulse" />
      )}
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsMappingOpen(!isMappingOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm leading-normal transition-colors shrink-0 ${canEdit ? 'bg-on-surface-variant/20 text-on-surface' : 'bg-on-surface-variant/10 text-disabled-text'}`}>3</div>
          <div className="flex flex-col">
            <h3 className={`font-headline text-base lg:text-2xl font-extrabold transition-colors leading-tight ${canEdit ? 'text-on-surface group-hover:text-tertiary' : 'text-disabled-text'}`}>Mapping</h3>
            <p className="text-xs lg:text-sm text-on-surface-variant font-medium mt-0.5">Select data for chart from the fetched data</p>
          </div>
        </div>
        {isMappingOpen ? (
          <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant" />
        ) : (
          <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant" />
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
              <div className={`flex flex-col gap-3 sm:gap-4 border border-on-surface-variant/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 bg-surface-container-low ${!isMappingEnabled ? 'opacity-50' : ''}`}>
                {/* Data Mapping */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-on-surface-variant">1. DATA MAPPING</label>
                    <p className="text-xs lg:text-sm text-on-surface-variant leading-normal mt-0.5">
                      {!isMappingEnabled ? 'Select a data source first to enable mapping' : 'Select data for chart from the fetched data'}
                    </p>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-10 ${!canEdit ? 'opacity-70' : ''}`}>
                    <CustomDropdown
                      headerLabel="Select type of label"
                      options={isMappingEnabled ? labelFields : []}
                      value={selectedLabel}
                      onChange={canEdit ? setSelectedLabel : () => {}}
                      disabled={!isSubFieldsEnabled || !canEdit || !isMappingEnabled}
                      placeholder={isMappingEnabled ? "Select field" : "No data source selected"}
                    />

                    <CustomDropdown
                      headerLabel="Select type of value"
                      options={isMappingEnabled ? valueFields : []}
                      value={selectedValue}
                      onChange={canEdit ? setSelectedValue : () => {}}
                      disabled={!isSubFieldsEnabled || !canEdit || !isMappingEnabled}
                      placeholder={isMappingEnabled ? "Select field" : "No data source selected"}
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
                          canEdit={canEdit}
                          chartType={selectedChart}
                          labelField={selectedLabel}
                          valueField={selectedValue}
                          onContinue={onContinue}
                          isEditMode={!!editingChartId}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
