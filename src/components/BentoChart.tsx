import React, { useState } from 'react';
import { MoreVertical, Maximize2, Edit2, Layout, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChartConfig } from '../types';

interface BentoChartProps {
  config: ChartConfig;
  onEditName: (id: string) => void;
  onEditMapping: (id: string) => void;
  onMaximize: (id: string) => void;
  onDeleteChart: (id: string) => void;
  isEditing?: boolean;
}

export default function BentoChart({ config, onEditName, onEditMapping, onMaximize, onDeleteChart, isEditing }: BentoChartProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const maxValue = Math.max(...config.data.map(d => Number(getValue(d, config.valueField)) || 0), 0) || 1;

  const renderChartContent = () => {
    switch (config.type) {
      case 'Bar Chart':
        const barCount = config.data.length;
        // Skip labels when too many bars to keep readable
        const showEveryNth = barCount > 20 ? 4 : barCount > 12 ? 2 : 1;
        return (
          <div className="absolute inset-0 flex items-end gap-1 w-full px-3 pb-7 pt-2">
            {config.data.map((d, i) => {
              const label = getValue(d, config.labelField)?.toString() ?? '';
              const showLabel = i % showEveryNth === 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar h-full justify-end min-w-0">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${((Number(getValue(d, config.valueField)) || 0) / maxValue) * 82}%` }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    className="w-full bg-gradient-to-t from-tertiary to-tertiary/60 rounded-t-md relative group-hover/bar:to-white/40 transition-colors shadow-[0_0_10px_rgba(var(--color-tertiary),0.15)] min-h-[3px]"
                  >
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all z-20 shadow-2xl whitespace-nowrap pointer-events-none">
                      {getValue(d, config.valueField)}
                    </div>
                  </motion.div>
                  {showLabel && (
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase truncate w-full text-center group-hover/bar:text-on-surface transition-colors leading-tight" title={label}>
                      {label.substring(0, barCount > 10 ? 5 : 8)}
                    </span>
                  )}
                  {!showLabel && <span className="h-3" />}
                </div>
              );
            })}
          </div>
        );
      case 'Line Chart':
      case 'Area Chart':
        const isArea = config.type === 'Area Chart';
        return (
          <div className="absolute inset-0 w-full px-4 pt-4 pb-8 flex items-center justify-center">
             <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="w-full h-full overflow-visible drop-shadow-[0_10px_15px_rgba(var(--color-tertiary),0.1)]">
               <defs>
                 <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="var(--color-tertiary)" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="var(--color-tertiary)" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <motion.path 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 d={`M ${config.data.map((d, i) => `${(i / (config.data.length - 1)) * 400},${200 - ((Number(getValue(d, config.valueField)) || 0) / maxValue) * 160}`).join(' L ')}`}
                 fill="none"
                 stroke="var(--color-tertiary)"
                 strokeWidth="4"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
               {isArea && (
                 <motion.path 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.8, duration: 0.5 }}
                   d={`M ${config.data.map((d, i) => `${(i / (config.data.length - 1)) * 400},${200 - ((Number(getValue(d, config.valueField)) || 0) / maxValue) * 160}`).join(' L ')} L 400,200 L 0,200 Z`}
                   fill="url(#lineGrad)"
                 />
               )}
               {config.data.map((d, i) => (
                 <motion.circle
                   key={i}
                   initial={{ r: 0 }}
                   animate={{ r: 4 }}
                   transition={{ delay: 1 + i * 0.1 }}
                   cx={(i / (config.data.length - 1)) * 400}
                   cy={200 - ((Number(getValue(d, config.valueField)) || 0) / maxValue) * 160}
                   fill="var(--color-surface)"
                   stroke="var(--color-tertiary)"
                   strokeWidth="2"
                 />
               ))}
             </svg>
          </div>
        );
      case 'Pie Chart':
        let currentAngle = 0;
        const total = config.data.reduce((sum, d) => sum + (Number(getValue(d, config.valueField)) || 0), 0);
        return (
          <div className="absolute inset-0 w-full flex items-center justify-center py-4">
            <svg viewBox="0 0 100 100" className="w-[140px] h-[140px] transform -rotate-90 overflow-visible">
              {config.data.map((d, i) => {
                const value = Number(getValue(d, config.valueField)) || 0;
                const percentage = total === 0 ? 0 : (value / total) * 100;
                const angle = (percentage / 100) * 360;
                
                // SVG Arc parameters
                const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                currentAngle += angle;
                const x2 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                
                const largeArcFlag = percentage > 50 ? 1 : 0;
                
                return (
                  <motion.path
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={[
                      '#679CFF', '#89B3FF', '#4A85FF', '#A6C9FF', '#3D72E5'
                    ][i % 5]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    stroke="var(--color-surface)"
                    strokeWidth="1"
                  >
                    <title>{`${getValue(d, config.labelField)}: ${value}`}</title>
                  </motion.path>
                );
              })}
            </svg>
            <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-1.5 max-h-full overflow-y-auto no-scrollbar pr-2">
              {config.data.slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ 
                    backgroundColor: ['#679CFF', '#89B3FF', '#4A85FF', '#A6C9FF', '#3D72E5'][i % 5] 
                  }} />
                  <span className="text-xs font-bold text-on-surface-variant truncate w-24">
                    {getValue(d, config.labelField)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Histogram':
        const histCount = config.data.length;
        const histEveryNth = histCount > 20 ? 4 : histCount > 12 ? 2 : 1;
        return (
          <div className="absolute inset-0 flex items-end w-full px-3 pb-7 pt-2">
            {config.data.map((d, i) => {
              const label = getValue(d, config.labelField)?.toString() ?? '';
              const showLabel = i % histEveryNth === 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group/bar h-full justify-end border-r border-surface last:border-r-0 min-w-0">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${((Number(getValue(d, config.valueField)) || 0) / maxValue) * 82}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8 }}
                    className="w-full bg-tertiary relative group-hover/bar:bg-tertiary/80 transition-colors min-h-[3px]"
                  >
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all z-20 shadow-2xl whitespace-nowrap pointer-events-none">
                      {getValue(d, config.valueField)}
                    </div>
                  </motion.div>
                  {showLabel && (
                    <div className="w-full text-[10px] font-bold text-on-surface-variant truncate text-center mt-1" title={label}>
                      {label.substring(0, histCount > 10 ? 4 : 6)}
                    </div>
                  )}
                  {!showLabel && <div className="h-3" />}
                </div>
              );
            })}
          </div>
        );
      
      case 'Scatter Plot':
        return (
          <div className="absolute inset-0 w-full px-8 pt-8 pb-12 flex items-center justify-center">
             {/* Axes */}
             <div className="absolute left-6 top-4 bottom-10 w-[1px] bg-outline-variant/30" />
             <div className="absolute left-6 right-6 bottom-10 h-[1px] bg-outline-variant/30" />
             
             {/* Data Points */}
             <div className="absolute inset-0 left-6 bottom-10 right-6 top-4">
               {config.data.map((d, i) => {
                 const xPercent = (i / Math.max(1, config.data.length - 1)) * 100;
                 const yPercent = 100 - (((Number(getValue(d, config.valueField)) || 0) / maxValue) * 100);
                 
                 return (
                   <motion.div
                     key={i}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: i * 0.05, type: "spring" }}
                     className="absolute w-3.5 h-3.5 -mt-1.5 -ml-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(var(--color-tertiary),0.6)] cursor-pointer group/dot flex items-center justify-center"
                     style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                   >
                     <div className="absolute w-[6px] h-[6px] bg-surface rounded-full pointer-events-none" />
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface text-sm font-bold px-2 py-1.5 rounded opacity-0 group-hover/dot:opacity-100 transition-all z-20 whitespace-nowrap pointer-events-none scale-95 group-hover/dot:scale-100 shadow-lg">
                       {getValue(d, config.labelField)}: {getValue(d, config.valueField)}
                     </div>
                   </motion.div>
                 );
               })}
             </div>
          </div>
        );

      case 'Radar Chart':
        const numPoints = config.data.length;
        const centerX = 200;
        const centerY = 200;
        const radius = 130;
        
        // Generate polygon points safely
        const points = config.data.map((d, i) => {
          const value = Number(getValue(d, config.valueField)) || 0;
          const r = maxValue === 0 ? 0 : (value / maxValue) * radius;
          const angle = (Math.PI * 2 * i) / (numPoints || 1) - Math.PI / 2;
          return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
        }).join(' ');

        // Generate background grid pentagon/hexagon etc
        const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

        return (
          <div className="absolute inset-0 w-full flex items-center justify-center py-4 px-2">
            <svg viewBox="0 0 400 400" className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] overflow-visible drop-shadow-[0_10px_15px_rgba(var(--color-tertiary),0.15)]">
              {/* Draw web grid */}
              {gridLevels.map(level => {
                const levelPoints = Array.from({length: numPoints}).map((_, i) => {
                  const angle = (Math.PI * 2 * i) / (numPoints || 1) - Math.PI / 2;
                  return `${centerX + radius * level * Math.cos(angle)},${centerY + radius * level * Math.sin(angle)}`;
                }).join(' ');
                return (
                  <polygon key={level} points={levelPoints} fill="none" stroke="var(--color-on-surface-variant)" strokeOpacity="0.1" strokeWidth="1.5" />
                );
              })}
              
              {/* Draw axis lines */}
              {Array.from({length: numPoints}).map((_, i) => {
                const angle = (Math.PI * 2 * i) / (numPoints || 1) - Math.PI / 2;
                return (
                  <line 
                    key={i}
                    x1={centerX} y1={centerY} 
                    x2={centerX + radius * Math.cos(angle)} 
                    y2={centerY + radius * Math.sin(angle)} 
                    stroke="var(--color-on-surface-variant)" strokeOpacity="0.1" strokeWidth="1.5" 
                  />
                );
              })}

              <motion.polygon 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                points={points}
                fill="var(--color-tertiary)"
                fillOpacity="0.25"
                stroke="var(--color-tertiary)"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ transformOrigin: 'center' }}
              />

              {/* Data points on Radar */}
              {config.data.map((d, i) => {
                const value = Number(getValue(d, config.valueField)) || 0;
                const r = maxValue === 0 ? 0 : (value / maxValue) * radius;
                const angle = (Math.PI * 2 * i) / (numPoints || 1) - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                
                // Label positioning
                const labelR = radius + 35;
                const labelX = centerX + labelR * Math.cos(angle);
                const labelY = centerY + labelR * Math.sin(angle);
                
                return (
                  <g key={i} className="group/radar cursor-pointer font-body">
                    <circle cx={x} cy={y} r="5" fill="var(--color-surface)" stroke="var(--color-tertiary)" strokeWidth="2.5" className="transition-all hover:r-[6px]" />
                    <text 
                      x={labelX} y={labelY} 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fill="var(--color-on-surface-variant)" 
                      className="text-[12px] font-bold tracking-wider group-hover/radar:fill-tertiary transition-colors"
                    >
                      {getValue(d, config.labelField).toString().substring(0,10)}
                    </text>
                    <text 
                      x={x} y={y - 12} 
                      textAnchor="middle" 
                      fill="var(--color-on-surface)" 
                      className="text-[14px] font-black opacity-0 group-hover/radar:opacity-100 transition-opacity"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 italic text-sm">
            {config.type} Preview
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative w-full h-full bg-surface-container-low rounded-2xl flex flex-col shadow-lg transition-all border ${isEditing ? 'border-tertiary ring-2 ring-tertiary/20' : 'border-tertiary/5'}`}
      role="region"
      aria-label={`Chart: ${config.name}`}
    >
      {isEditing && (
        <div className="absolute inset-0 bg-tertiary/5 rounded-2xl pointer-events-none animate-pulse" />
      )}
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:p-4 sm:pb-2 relative z-[65]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(103,156,255,0.6)] shrink-0" />
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wide truncate">
            {config.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={`Chart options for ${config.name}`}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isMenuOpen ? 'bg-tertiary/10 text-tertiary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
            >
              <MoreVertical className="w-4 h-4" aria-hidden="true" />
            </button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
                  <motion.div 
                    role="menu"
                    aria-label={`Options for ${config.name}`}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute right-0 top-11 w-48 bg-surface-container shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-xl border border-outline-variant/30 overflow-hidden z-[100] p-1.5"
                    onKeyDown={(e) => { if (e.key === 'Escape') setIsMenuOpen(false); }}
                  >
                    <button 
                      role="menuitem"
                      onClick={() => { onEditMapping(config.id); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-on-surface hover:bg-tertiary/10 hover:text-tertiary rounded-lg transition-all"
                    >
                      <Layout className="w-5 h-5" aria-hidden="true" />
                      Edit Mapping
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { onEditName(config.id); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-on-surface hover:bg-tertiary/10 hover:text-tertiary rounded-lg transition-all"
                    >
                      <Edit2 className="w-5 h-5" aria-hidden="true" />
                      Edit Name
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { onDeleteChart(config.id); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" aria-hidden="true" />
                      Delete Chart
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative z-0">
        {renderChartContent()}
      </div>
    </div>
  );
}
