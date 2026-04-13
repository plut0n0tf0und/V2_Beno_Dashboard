import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Lenis from 'lenis';
import { DataSource } from '../types';
import AddDataSourceSection from './AddDataSourceSection';
import MappingSection from './MappingSection';

interface DataSourceMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Props for AddDataSourceSection
  isSourceOpen: boolean;
  setIsSourceOpen: (open: boolean) => void;
  dataSources: DataSource[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
  onAddSource: (url: string, name: string) => void;
  onDeleteSource: (id: string) => void;
  // Props for MappingSection
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
  editingChartId?: string;
  highlightMapping: boolean;
  chartTypes: string[];
  labelFields: string[];
  valueFields: string[];
  onCancelEdit: () => void;
  isClosable?: boolean;
  // Props for DataSelectionSection
  isDataSelectionOpen: boolean;
  setIsDataSelectionOpen: (open: boolean) => void;
  initialName?: string;
  onCreateChart: (name: string, data: any[]) => void;
}

export default function DataSourceMappingModal({
  isOpen,
  onClose,
  isSourceOpen,
  setIsSourceOpen,
  dataSources,
  selectedSourceId,
  onSelectSource,
  onAddSource,
  onDeleteSource,
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
  editingChartId,
  highlightMapping,
  chartTypes,
  labelFields,
  valueFields,
  onCancelEdit,
  isClosable = true,
  isDataSelectionOpen,
  setIsDataSelectionOpen,
  initialName,
  onCreateChart
}: DataSourceMappingModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8 transition-all">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-surface-container-low w-[90vw] md:w-[85vw] lg:w-[80vw] h-[90vh] md:h-[85vh] max-w-6xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-outline-variant/20"
      >
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-on-surface-variant/10 bg-surface-container shrink-0">
          <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">Manage Data Source & Mapping</h2>
          {isClosable && (
            <button onClick={onClose} className="p-3 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-on-surface-variant/10 transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <div 
          ref={scrollRef}
          className="overflow-y-auto no-scrollbar flex-1 bg-surface-container-low overscroll-contain"
        >
          <div className="p-6 md:p-8 flex flex-col gap-6 md:gap-8 pb-32">
            <AddDataSourceSection 
              isSourceOpen={isSourceOpen}
              setIsSourceOpen={setIsSourceOpen}
              dataSources={dataSources}
              selectedSourceId={selectedSourceId}
              onSelectSource={onSelectSource}
              onAddSource={onAddSource}
              onDeleteSource={onDeleteSource}
            />
            <MappingSection 
              isMappingOpen={isMappingOpen}
              setIsMappingOpen={setIsMappingOpen}
              isMappingEnabled={isMappingEnabled}
              selectedChart={selectedChart}
              setSelectedChart={setSelectedChart}
              selectedLabel={selectedLabel}
              setSelectedLabel={setSelectedLabel}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              isSubFieldsEnabled={isSubFieldsEnabled}
              isDataSelectionOpen={isDataSelectionOpen}
              setIsDataSelectionOpen={setIsDataSelectionOpen}
              isSelectionEnabled={selectedChart !== '' && selectedLabel !== '' && selectedValue !== ''}
              initialName={initialName}
              onConfirm={onCreateChart}
              editingChartId={editingChartId}
              highlightMapping={highlightMapping}
              chartTypes={chartTypes}
              labelFields={labelFields}
              valueFields={valueFields}
              onCancelEdit={onCancelEdit}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
