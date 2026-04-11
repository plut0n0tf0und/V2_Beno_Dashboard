import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { ChevronDown, ChevronUp, Database, Plus, MoreVertical, Layout, Edit2, Share2 } from 'lucide-react';
import Lenis from 'lenis';
import { Project, ChartConfig } from '../types';
import BentoChart from '../components/BentoChart';

interface ProjectDetailsProps {
  project: Project;
  onPreviewData: (apiUrl: string) => void;
  isSourceSaved: boolean;
  onOpenDataSelection: (config: {chartType: string, label: string, value: string}) => void;
  charts: ChartConfig[];
  onEditName: (id: string) => void;
  onEditMapping: (id: string) => void;
  onReorder: (newOrder: ChartConfig[]) => void;
  editingChartId?: string;
}

const chartTypes = ["Bar Chart", "Line Chart", "Pie Chart", "Area Chart", "Histogram", "Scatter Plot", "Radar Chart"];
const labelFields = ["name", "slug", "description", "metadata.lastUpdated"];
const valueFields = ["id", "parent", "count", "metadata.popularityScore"];

const ChartReorderItem = ({ chart, onEditName, onEditMapping, editingChartId }: any) => {
  const controls = useDragControls();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startDrag = (event: React.PointerEvent) => {
    timerRef.current = setTimeout(() => {
      controls.start(event);
    }, 2000);
  };

  const cancelDrag = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Reorder.Item 
      value={chart}
      dragListener={false}
      dragControls={controls}
      onPointerDown={startDrag}
      onPointerUp={cancelDrag}
      onPointerLeave={cancelDrag}
      onPointerCancel={cancelDrag}
      className="relative group/reorder"
    >
      <div className="rounded-2xl transition-all duration-300 overflow-visible relative min-h-[300px] lg:min-h-[400px] hover:shadow-[0_0_20px_rgba(var(--color-tertiary),0.1)] cursor-auto focus-within:cursor-auto flex flex-col items-stretch justify-start">
        <BentoChart 
          config={chart} 
          onEditName={onEditName} 
          onEditMapping={onEditMapping}
          onMaximize={() => {}}
          isEditing={editingChartId === chart.id}
        />
      </div>
    </Reorder.Item>
  );
};

export default function ProjectDetails({ 
  project, 
  onPreviewData, 
  isSourceSaved, 
  onOpenDataSelection,
  charts,
  onEditName,
  onEditMapping,
  onReorder,
  editingChartId
}: ProjectDetailsProps) {
  const [apiUrl, setApiUrl] = useState('');
  const [isSourceOpen, setIsSourceOpen] = useState(!isSourceSaved);
  const [isMappingOpen, setIsMappingOpen] = useState(true);
  const [highlightMapping, setHighlightMapping] = useState(false);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // Initialize smooth inner scrolling via Lenis
  useEffect(() => {
    let lenisLeft: Lenis, lenisRight: Lenis;
    let rafId: number;

    if (window.innerWidth >= 1024) { // Only engage independent smooth scroll on desktop
      if (leftScrollRef.current) {
        lenisLeft = new Lenis({ wrapper: leftScrollRef.current, content: leftScrollRef.current.firstElementChild as HTMLElement, lerp: 0.1 });
      }
      if (rightScrollRef.current) {
        lenisRight = new Lenis({ wrapper: rightScrollRef.current, content: rightScrollRef.current.firstElementChild as HTMLElement, lerp: 0.1 });
      }
      const raf = (time: number) => {
        lenisLeft?.raf(time);
        lenisRight?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    return () => {
      lenisLeft?.destroy();
      lenisRight?.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Automatically collapse source section when saved
  useEffect(() => {
    if (isSourceSaved) {
      setIsSourceOpen(false);
    }
  }, [isSourceSaved]);

  // Sync mapping panel with editing chart
  useEffect(() => {
    if (editingChartId) {
      const chart = charts.find(c => c.id === editingChartId);
      if (chart) {
        setSelectedChart(chart.type);
        setSelectedLabel(chart.labelField);
        setSelectedValue(chart.valueField);
        setIsMappingOpen(true);
      }
    }
  }, [editingChartId, charts]);
  
  // Mapping State
  const [selectedChart, setSelectedChart] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const isUrlValid = apiUrl.trim().length > 0;
  const isMappingEnabled = isSourceSaved;
  const isSubFieldsEnabled = isMappingEnabled && selectedChart !== '';

  const handleEditMappingInternal = (id: string) => {
    setIsMappingOpen(true);
    setHighlightMapping(true);
    setTimeout(() => setHighlightMapping(false), 2000);
    onEditMapping(id);
  };

  return (
    <div className={`flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen lg:h-[calc(100vh-100px)] lg:overflow-hidden transition-all duration-500 pb-10 lg:pb-0 ${highlightMapping ? 'bg-black/20' : ''}`}>
      {/* Left Column: Manage Source & Mapping */}
      <div 
        ref={leftScrollRef}
        className={`w-full lg:w-[380px] shrink-0 flex flex-col gap-4 lg:gap-6 lg:h-full lg:overflow-y-auto lg:pr-2 no-scrollbar overscroll-contain transition-all duration-500 ${highlightMapping ? 'z-[60]' : ''}`}
      >
        <div className="flex flex-col gap-4 lg:gap-6 h-max">
          <h2 className={`font-headline text-xl lg:text-2xl font-bold text-on-surface tracking-tight lg:mt-4 transition-opacity duration-500 ${highlightMapping ? 'opacity-20 blur-[1px]' : 'opacity-100'}`}>
          Manage Data Source & Mapping
        </h2>

        {/* 1. Add Data Source */}
        <div className={`bg-surface-container rounded-2xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 shadow-sm transition-all duration-500 ${highlightMapping ? 'opacity-20 blur-[2px] scale-95' : 'opacity-100'}`}>
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsSourceOpen(!isSourceOpen)}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-sm text-on-surface">
                1
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">Add Data Source</h3>
                  {isSourceOpen && isSourceSaved && (
                    <button className="bg-on-surface-variant/10 hover:bg-on-surface-variant/20 text-on-surface px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all">
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  )}
                </div>
                {!isSourceOpen && isSourceSaved && (
                  <p className="text-[10px] font-medium text-on-surface-variant/40 uppercase tracking-wider">
                    Selected: WOOOYS Categories
                  </p>
                )}
              </div>
            </div>
            {isSourceOpen ? (
              <ChevronUp className="w-5 h-5 text-on-surface-variant" />
            ) : (
              <ChevronDown className="w-5 h-5 text-on-surface-variant" />
            )}
          </div>

          <AnimatePresence initial={false}>
            {isSourceOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-2">
                  {isSourceSaved ? (
                    <div className="space-y-4">
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Added Data Source</p>
                      <div className="flex items-center justify-between bg-surface-container-low border border-on-surface-variant/10 rounded-xl p-4 group/item hover:border-tertiary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
                            <Database className="w-4 h-4 text-tertiary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">WOOOYS Categories</span>
                            <span className="text-[10px] text-on-surface-variant font-mono truncate max-w-[180px]">{apiUrl || 'api.woooys.com/v1/categories'}</span>
                          </div>
                        </div>
                        <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-on-surface-variant/10 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-body text-sm font-semibold text-on-surface tracking-tight">Connect via API</p>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Enter API URL *
                        </label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            placeholder="https://api.yoursite.com/v1/users" 
                            className="w-full bg-surface-container-low border border-on-surface-variant/10 rounded-lg py-2.5 px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-tertiary/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => onPreviewData(apiUrl)}
                        disabled={!isUrlValid}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
                          isUrlValid 
                            ? 'bg-on-surface text-surface hover:opacity-90 active:scale-[0.98]' 
                            : 'bg-on-surface-variant/20 text-on-surface-variant cursor-not-allowed'
                        }`}
                      >
                        Preview Data
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Mapping */}
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
              <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-sm text-on-surface">
                2
              </div>
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
                          onClick={() => onOpenDataSelection({
                            chartType: selectedChart,
                            label: selectedLabel,
                            value: selectedValue
                          })}
                          className="w-full py-3 rounded-xl bg-on-surface text-surface font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                          {editingChartId ? 'Update Mapping' : 'Select Label & Value'}
                        </button>
                      )}
                      
                      {editingChartId && (
                        <button 
                          onClick={() => {
                            setSelectedChart('');
                            setSelectedLabel('');
                            setSelectedValue('');
                            // We need a way to clear editingChartId in App.tsx too, 
                            // but for now clearing local state is a start.
                            // In a real app, we'd call a prop like onCancelEdit().
                          }}
                          className="w-full py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest mt-2"
                        >
                          Cancel Editing
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Spacer for bottom of left scroll */}
        <div className="h-4 lg:h-8 flex-shrink-0" />
        </div>
      </div>

      {/* Right Column: Dashboard */}
      <div 
        ref={rightScrollRef}
        className={`flex-grow bg-surface-container rounded-2xl p-4 flex flex-col gap-4 shadow-sm lg:h-full lg:overflow-y-auto no-scrollbar overscroll-contain transition-all duration-500 ${highlightMapping ? 'opacity-20 blur-[4px] scale-98' : 'opacity-100'}`}
      >
        <div className="flex flex-col gap-4 w-full h-max">
          <div className="flex items-center justify-between">
          <h2 className="font-headline text-xl lg:text-2xl font-bold text-on-surface tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            {charts.length > 0 && (
              <>
                <button 
                  onClick={() => {
                    setSelectedChart('');
                    setSelectedLabel('');
                    setSelectedValue('');
                    setIsMappingOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 bg-on-surface text-surface px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  <div className="w-4 h-4 rounded-full border-[1.5px] border-surface flex items-center justify-center">
                    <Plus className="w-3 h-3 text-surface" strokeWidth={3} />
                  </div>
                  <span>Add New Chart</span>
                </button>
                <button className="flex items-center justify-center w-9 h-9 text-on-surface hover:text-on-surface border border-outline-variant/20 rounded-xl hover:bg-surface-container-high active:scale-95 transition-all outline-none">
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <Reorder.Group 
          axis="y" 
          values={charts} 
          onReorder={onReorder}
          className="flex flex-col gap-4"
        >
          {charts.map((chart) => (
            <ChartReorderItem 
              key={chart.id} 
              chart={chart}
              onEditName={onEditName}
              onEditMapping={handleEditMappingInternal}
              editingChartId={editingChartId}
            />
          ))}
        </Reorder.Group>
        
        {/* Spacer for bottom of right scroll */}
        <div className="h-4 lg:h-12 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
