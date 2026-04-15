import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChartNameSectionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEnabled: boolean;
  canEdit: boolean;
  chartType: string;
  initialName?: string;
  onConfirm: (chartName: string) => void;
}

export default function ChartNameSection({
  isOpen,
  setIsOpen,
  isEnabled,
  canEdit,
  chartType,
  initialName = '',
  onConfirm,
}: ChartNameSectionProps) {
  const [chartName, setChartName] = useState(initialName);

  useEffect(() => {
    if (isOpen) setChartName(initialName);
  }, [isOpen, initialName]);

  const canConfirm = chartName.trim().length > 0;

  return (
    <div className="w-full bg-surface-container rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 lg:p-8 flex flex-col gap-3 sm:gap-4 shadow-sm transition-all duration-500 relative z-[60]">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm leading-normal transition-colors shrink-0 ${isEnabled ? 'bg-on-surface-variant/20 text-on-surface' : 'bg-on-surface-variant/10 text-disabled-text'}`}>4</div>
          <h3 className={`font-headline text-base lg:text-2xl font-extrabold transition-colors leading-tight ${isEnabled ? 'text-on-surface group-hover:text-tertiary' : 'text-disabled-text'}`}>
            Chart Name
          </h3>
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
            <div className={`flex flex-col gap-3 sm:gap-4 border border-on-surface-variant/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 bg-surface-container-low ${!canEdit ? 'opacity-70' : ''}`}>
              <div className="space-y-1.5">
                <label className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-on-surface">
                  {initialName ? 'Update chart name' : 'Enter chart name'}
                </label>
                <input
                  type="text"
                  value={chartName}
                  onChange={(e) => canEdit && setChartName(e.target.value)}
                  placeholder="e.g. Top Products Bought"
                  disabled={!canEdit}
                  className="w-full bg-transparent border-b-2 border-tertiary/40 hover:border-tertiary/70 focus:border-tertiary px-1 py-2.5 text-base lg:text-xl font-bold text-on-surface placeholder:text-placeholder outline-none transition-all leading-normal disabled:text-disabled-text disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => canConfirm && canEdit && onConfirm(chartName)}
                  disabled={!canConfirm || !canEdit}
                  className={`px-6 lg:px-10 py-2.5 lg:py-3 rounded-full font-bold text-sm lg:text-base uppercase tracking-widest transition-all shadow-lg ${
                    canConfirm && canEdit
                      ? 'bg-tertiary text-surface hover:opacity-95 active:scale-[0.97]'
                      : 'bg-disabled-bg text-disabled-text cursor-not-allowed'
                  }`}
                >
                  {initialName ? 'Update mapping' : 'Publish chart'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
