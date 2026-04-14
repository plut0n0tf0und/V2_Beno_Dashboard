import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

interface ChartConfigSectionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEnabled: boolean;
  chartName: string;
  setChartName: (name: string) => void;
  selectedChart: string;
  setSelectedChart: (chart: string) => void;
  chartTypes: string[];
}

export default function ChartConfigSection({
  isOpen,
  setIsOpen,
  isEnabled,
  chartName,
  setChartName,
  selectedChart,
  setSelectedChart,
  chartTypes,
}: ChartConfigSectionProps) {
  return (
    <div className="w-full bg-surface-container rounded-[2rem] p-4 lg:p-8 flex flex-col gap-4 shadow-sm transition-all duration-500 relative z-[65]">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => { if (isEnabled) setIsOpen(!isOpen); }}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm leading-normal transition-colors ${isEnabled ? 'bg-on-surface-variant/20 text-on-surface' : 'bg-on-surface-variant/10 text-on-surface-variant/40'}`}>2</div>
          <div className="flex flex-col">
            <h3 className={`font-headline text-xl font-extrabold transition-colors leading-tight ${isEnabled ? 'text-on-surface group-hover:text-tertiary' : 'text-on-surface-variant/40'}`}>
              Chart Configuration
            </h3>
            <p className="text-xs text-on-surface-variant/60 font-medium mt-0.5">Name and type of chart</p>
          </div>
        </div>
        {isEnabled && (
          isOpen
            ? <ChevronUp className="w-5 h-5 text-on-surface-variant" />
            : <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && isEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border border-on-surface-variant/10 rounded-2xl p-4 lg:p-8 bg-surface-container-low">
              {/* Chart Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface">
                  1. CHART NAME
                </label>
                <input
                  type="text"
                  value={chartName}
                  onChange={(e) => setChartName(e.target.value)}
                  placeholder={`e.g. Dashboard ${selectedChart || 'Chart'}`}
                  className="w-full bg-transparent border-b-2 border-tertiary/40 hover:border-tertiary/70 focus:border-tertiary px-1 py-2.5 text-base font-bold text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all leading-normal"
                />
              </div>

              <div className="h-px bg-on-surface-variant/10" />

              {/* Required Chart */}
              <CustomDropdown
                headerLabel="2. REQUIRED CHART"
                options={chartTypes}
                value={selectedChart}
                onChange={setSelectedChart}
                placeholder="Select a type of chart"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
