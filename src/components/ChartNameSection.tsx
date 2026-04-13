import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChartNameSectionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEnabled: boolean;
  chartType: string;
  initialName?: string;
  onConfirm: (chartName: string) => void;
}

export default function ChartNameSection({
  isOpen,
  setIsOpen,
  isEnabled,
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
    <div className="w-full bg-surface-container rounded-[2rem] p-4 lg:p-8 flex flex-col gap-4 shadow-sm transition-all duration-500 relative z-[60]">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => { if (isEnabled) setIsOpen(!isOpen); }}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm leading-normal transition-colors ${isEnabled ? 'bg-on-surface-variant/20 text-on-surface' : 'bg-on-surface-variant/10 text-on-surface-variant/40'}`}>3</div>
          <h3 className={`font-headline text-xl font-extrabold transition-colors leading-tight ${isEnabled ? 'text-on-surface group-hover:text-tertiary' : 'text-on-surface-variant/40'}`}>
            Chart Name
          </h3>
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
            <div className="pt-2 space-y-4 border border-on-surface-variant/10 rounded-[2rem] p-4 lg:p-8 bg-surface-container-low">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">
                  {initialName ? 'Update chart name' : 'Enter chart name'}
                </label>
                <input
                  type="text"
                  value={chartName}
                  onChange={(e) => setChartName(e.target.value)}
                  placeholder={`e.g. Dashboard ${chartType || 'Chart'}`}
                  className="w-full bg-transparent border-b border-on-surface-variant/10 hover:border-tertiary/50 focus:border-tertiary px-0 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all leading-normal"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => canConfirm && onConfirm(chartName)}
                  disabled={!canConfirm}
                  className={`px-12 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-tertiary/20 ${
                    canConfirm
                      ? 'bg-tertiary text-surface hover:opacity-95 active:scale-[0.97]'
                      : 'bg-on-surface-variant/20 text-on-surface-variant cursor-not-allowed opacity-50'
                  }`}
                >
                  {initialName ? 'Update mapping' : 'Create chart'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
