import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

interface ChartConfigSectionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEnabled: boolean;
  canEdit: boolean;
  selectedChart: string;
  setSelectedChart: (chart: string) => void;
  chartTypes: string[];
  onChartSelected?: () => void;
}

export default function ChartConfigSection({
  isOpen,
  setIsOpen,
  isEnabled,
  canEdit,
  selectedChart,
  setSelectedChart,
  chartTypes,
  onChartSelected,
}: ChartConfigSectionProps) {
  return (
    <div className="w-full bg-surface-container rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 lg:p-8 flex flex-col gap-3 sm:gap-4 shadow-sm transition-all duration-500 relative z-[65]">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm leading-normal transition-colors shrink-0 ${isEnabled ? 'bg-on-surface-variant/20 text-on-surface' : 'bg-on-surface-variant/10 text-disabled-text'}`}>2</div>
          <div className="flex flex-col">
            <h3 className={`font-headline text-base lg:text-2xl font-extrabold transition-colors leading-tight ${isEnabled ? 'text-on-surface group-hover:text-tertiary' : 'text-disabled-text'}`}>
              Chart Type
            </h3>
            <p className="text-xs lg:text-sm text-on-surface-variant font-medium mt-0.5">Select the type of chart</p>
          </div>
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant" />
          : <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant" />
        }
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className={`border border-on-surface-variant/10 rounded-xl p-3 sm:p-4 lg:p-8 bg-surface-container-low ${!canEdit ? 'opacity-70' : ''}`}>
              <CustomDropdown
                headerLabel="REQUIRED CHART"
                options={chartTypes}
                value={selectedChart}
                onChange={canEdit ? (val) => { setSelectedChart(val); onChartSelected?.(); } : () => {}}
                placeholder="Select a type of chart"
                disabled={!canEdit}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
