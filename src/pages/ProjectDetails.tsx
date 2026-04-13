import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Database, Plus, MoreVertical, Layout, Edit2, Share2 } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { Project, ChartConfig, DataSource } from '../types';
import BentoChart from '../components/BentoChart';
import AddDataSourceSection from '../components/AddDataSourceSection';
import MappingSection from '../components/MappingSection';
import ChartNameSection from '../components/ChartNameSection';
import HorizontalStepper from '../components/HorizontalStepper';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ProjectDetailsProps {
  project: Project;
  onAddSource: (url: string, name: string) => void;
  dataSources: DataSource[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
  onCreateChart: (name: string, data: any[], config: {chartType: string, label: string, value: string}) => void;
  charts: ChartConfig[];
  onEditName: (id: string) => void;
  onEditMapping: (id: string) => void;
  onCancelEditMapping: () => void;
  onLayoutChange: (newLayout: any[]) => void;
  editingChartId?: string;
  onDeleteSource: (id: string) => void;
  onDeleteChart: (id: string) => void;
}

const chartTypes = ["Bar Chart", "Line Chart", "Pie Chart", "Area Chart", "Histogram", "Scatter Plot", "Radar Chart"];

const defaultLabelFields = ["name", "slug", "description", "metadata.lastUpdated"];
const defaultValueFields = ["id", "parent", "count", "metadata.popularityScore"];

const stockLabelFields = ["ticker", "company", "sector"];
const stockValueFields = ["price", "change", "volume", "marketCap", "peRatio"];

export default function ProjectDetails({ 
  project, 
  onAddSource,
  dataSources,
  selectedSourceId,
  onSelectSource,
  onCreateChart,
  charts,
  onEditName,
  onEditMapping,
  onCancelEditMapping,
  onLayoutChange,
  editingChartId,
  onDeleteSource,
  onDeleteChart
}: ProjectDetailsProps) {
  const isStockProject = project.id === '1';
  const labelFields = isStockProject ? stockLabelFields : defaultLabelFields;
  const valueFields = isStockProject ? stockValueFields : defaultValueFields;

  const [activeStep, setActiveStep] = useState(charts.length > 0 ? 4 : 4);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = left-to-right, -1 = right-to-left
  const [isSourceOpen, setIsSourceOpen] = useState(dataSources.length === 0);
  const [isMappingOpen, setIsMappingOpen] = useState(dataSources.length > 0 && selectedSourceId !== null);
  const [isDataSelectionOpen, setIsDataSelectionOpen] = useState(false);
  const [highlightMapping, setHighlightMapping] = useState(false);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [isChartNameOpen, setIsChartNameOpen] = useState(false);
  const dataSelectionRef = React.useRef<HTMLDivElement>(null);
  const skipAutoScrollRef = React.useRef(false);

  // Layout conversion for react-grid-layout
  const layouts = useMemo(() => ({
    lg: charts.map(c => {
      const itemCount = c.data?.length ?? 0;
      // Smart minimums: more data items = wider/taller minimum
      const minW = Math.min(12, Math.max(3, Math.ceil(itemCount / 3)));
      const minH = Math.max(3, Math.ceil(itemCount / 8));
      return {
        i: c.id,
        x: c.layout?.x ?? 0,
        y: c.layout?.y ?? Infinity,
        w: c.layout?.w ?? Math.max(6, minW),
        h: c.layout?.h ?? 4,
        minW,
        minH,
      };
    })
  }), [charts]);

  const handleStartOnboarding = () => {
    setSelectedChart('');
    setSelectedLabel('');
    setSelectedValue('');
    setSelectedData([]);
    setIsChartNameOpen(false);
    setDirection(1);
    setActiveStep(1);
    setIsSourceOpen(true);
    setIsMappingOpen(false);
    setIsDataSelectionOpen(false);
    onCancelEditMapping();
  };

  // Automatically collapse source section and open mapping when a source is selected
  useEffect(() => {
    if (selectedSourceId) {
      setIsSourceOpen(false);
      setIsMappingOpen(true);
    }
  }, [selectedSourceId]);


  // Sync mapping panel with editing chart
  useEffect(() => {
    if (editingChartId) {
      const chart = charts.find(c => c.id === editingChartId);
      if (chart) {
        setSelectedChart(chart.type);
        setSelectedLabel(chart.labelField);
        setSelectedValue(chart.valueField);
        setActiveStep(2); // Step 2 is Mapping
        setIsSourceOpen(false);
        setIsMappingOpen(true);
        setIsDataSelectionOpen(false);
      }
    }
  }, [editingChartId, charts]);
  
  // Mapping State
  const [selectedChart, setSelectedChart] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const isMappingEnabled = selectedSourceId !== null;
  const isSubFieldsEnabled = isMappingEnabled && selectedChart !== '';

  const isEditingMode = !!editingChartId;

  // Stepper configuration
  const stepperSteps = [
    {
      id: 1,
      label: isEditingMode ? `Edit "${charts.find(c => c.id === editingChartId)?.name ?? 'Chart'}"` : 'Add New Chart',
      isActive: activeStep < 4,
      isCompleted: selectedSourceId !== null && selectedChart !== '' && selectedLabel !== '' && selectedValue !== '' && charts.length > 0
    },
    { id: 2, label: 'Dashboard', isActive: activeStep === 4, isCompleted: charts.length > 0 }
  ];

  const handleStepClick = (stepId: number) => {
    if (activeStep === 4 && stepId === 1) return;

    if (stepId === 1) {
      setDirection(-1);
      setActiveStep(1);
      setIsSourceOpen(true);
      setIsMappingOpen(false);
      setIsDataSelectionOpen(false);
    } else if (stepId === 2) {
      setDirection(1);
      setActiveStep(4);
      setIsSourceOpen(false);
      setIsMappingOpen(false);
      setIsDataSelectionOpen(false);
      setIsChartNameOpen(false);
      setSelectedData([]);
      handleCancelEdit();
      onCancelEditMapping();
    }
  };

  const handleEditMappingInternal = (id: string) => {
    setActiveStep(2); // Step 2 is the Mapping phase
    setIsSourceOpen(false);
    setIsMappingOpen(true);
    setIsDataSelectionOpen(false);
    setHighlightMapping(true);
    skipAutoScrollRef.current = true;
    setTimeout(() => setHighlightMapping(false), 2000);
    onEditMapping(id);
  };

  const handleCancelEdit = () => {
    setSelectedChart('');
    setSelectedLabel('');
    setSelectedValue('');
    setSelectedData([]);
    setIsChartNameOpen(false);
    setIsDataSelectionOpen(false);
  };

  useEffect(() => {
    // Only auto-advance to step 3 if we are currently in the config phase (steps 1, 2, or 3)
    // This prevents the UI from snapping back to step 3 when we try to move to step 4 (Dashboard)
    if (selectedLabel && selectedValue && activeStep < 4) {
      if (!isDataSelectionOpen) {
        setIsDataSelectionOpen(true);
        setActiveStep(3);
        
        // Skip scroll if we are just entering "Edit" mode
        if (skipAutoScrollRef.current) {
          skipAutoScrollRef.current = false;
          return;
        }

        // Small delay to allow the animation/layout to start before scrolling
        setTimeout(() => {
          dataSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);
      }
    } else {
      setIsDataSelectionOpen(false);
    }
  }, [selectedLabel, selectedValue, isDataSelectionOpen]);

  return (
    <div className={`min-h-[calc(100vh-80px)] transition-all duration-500 ${highlightMapping ? 'bg-black/20' : ''}`}>
      {/* Horizontal Stepper */}
      <div className="bg-surface-container-low border-b border-on-surface-variant/10">
        <HorizontalStepper 
          steps={stepperSteps} 
          onStepClick={handleStepClick}
        />
      </div>

      {/* Content Area with Slider Animation */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeStep < 4 ? (
            // Configuration Screen (Full Page)
            <motion.div
              key="configuration"
              initial={{ x: direction * -60, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: direction * 60, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full"
            >
              <div className="flex flex-col gap-3 lg:gap-8 px-0 lg:px-10 pt-3 lg:pt-10 max-w-4xl mx-auto pb-12">
                <AddDataSourceSection 
                  isSourceOpen={isSourceOpen}
                  setIsSourceOpen={(open) => {
                    setIsSourceOpen(open);
                    if (open) setActiveStep(1);
                  }}
                  dataSources={dataSources}
                  selectedSourceId={selectedSourceId}
                  onSelectSource={(id) => {
                    onSelectSource(id);
                    setActiveStep(2);
                    setIsSourceOpen(false);
                    setIsMappingOpen(true);
                  }}
                  onAddSource={(url, name) => {
                    onAddSource(url, name);
                    setActiveStep(2);
                    setIsSourceOpen(false);
                    setIsMappingOpen(true);
                  }}
                  onDeleteSource={onDeleteSource}
                />
                <MappingSection 
                  isMappingOpen={isMappingOpen && (activeStep === 2 || activeStep === 3)}
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
                  editingChartId={editingChartId}
                  highlightMapping={highlightMapping}
                  chartTypes={chartTypes}
                  labelFields={labelFields}
                  valueFields={valueFields}
                  dataSelectionRef={dataSelectionRef}
                  onCancelEdit={handleCancelEdit}
                  onContinue={(data) => {
                    setSelectedData(data);
                    setIsChartNameOpen(true);
                    setIsMappingOpen(false);
                    setActiveStep(3);
                  }}
                />
                <ChartNameSection
                  isOpen={isChartNameOpen}
                  setIsOpen={setIsChartNameOpen}
                  isEnabled={selectedData.length > 0}
                  chartType={selectedChart}
                  initialName={editingChartId ? charts.find(c => c.id === editingChartId)?.name : ''}
                  onConfirm={(name) => {
                    onCreateChart(name, selectedData, { chartType: selectedChart, label: selectedLabel, value: selectedValue });
                    setDirection(1);
                    setActiveStep(4);
                    setIsDataSelectionOpen(false);
                    setIsChartNameOpen(false);
                    setSelectedData([]);
                    if (editingChartId) handleCancelEdit();
                  }}
                />
              </div>
            </motion.div>
          ) : (
            // Dashboard Screen (Full Page)
            <motion.div
              key="dashboard"
              initial={{ x: direction * 60, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: direction * -60, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative w-full bg-surface-container ${highlightMapping ? 'opacity-20 blur-[4px] scale-98' : 'opacity-100'}`}
            >
              <div className="flex flex-col gap-3 lg:gap-8 px-0 lg:px-10 pt-3 lg:pt-10 max-w-7xl mx-auto pb-12">
                <div className={`${charts.length === 0 ? 'hidden lg:flex' : 'flex'} items-center justify-between mb-4`}>
                  <h2 className="font-headline text-xl lg:text-3xl font-bold text-on-surface tracking-tighter">Dashboard</h2>
                  <div className="flex items-center gap-2">
                    {charts.length > 0 && (
                      <>
                        <button 
                          onClick={handleStartOnboarding}
                          className="flex items-center gap-2 bg-on-surface text-surface px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all"
                        >
                          <Plus className="w-5 h-5 text-surface" strokeWidth={3} />
                          <span>Add New Chart</span>
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 text-on-surface hover:text-on-surface border border-outline-variant/20 rounded-xl hover:bg-surface-container-high active:scale-95 transition-all outline-none">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <ResponsiveGridLayout
                  className="layout"
                  layouts={layouts}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 2, xxs: 1 }}
                  rowHeight={100}
                  draggableHandle=".drag-handle"
                  onLayoutChange={(currentLayout) => onLayoutChange(currentLayout)}
                  margin={[10, 10]}
                >
                  {charts.map((chart) => (
                    <div key={chart.id} className="relative group/grid-item">
                      <div className="w-full h-full bg-surface-container-low rounded-2xl border border-tertiary/5 hover:border-tertiary/20 transition-all duration-300 shadow-xl overflow-hidden pointer-events-auto">
                        <div className="drag-handle absolute top-0 left-0 right-10 h-12 cursor-grab active:cursor-grabbing z-[55]" />
                        <BentoChart
                          config={chart}
                          onEditName={onEditName}
                          onEditMapping={handleEditMappingInternal}
                          onMaximize={() => {}}
                          onDeleteChart={onDeleteChart}
                          isEditing={editingChartId === chart.id}
                        />
                      </div>
                    </div>
                  ))}
                </ResponsiveGridLayout>
                
                {charts.length === 0 && (
                  <>
                    {/* Mobile empty state */}
                    <div className="flex lg:hidden flex-col items-center justify-center min-h-[60vh] gap-5 px-2">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center">
                        <Layout className="w-5 h-5 text-tertiary" />
                      </div>
                      <div className="flex flex-col items-center gap-2 text-center">
                        <h3 className="text-lg font-black text-on-surface tracking-tight">No charts to display</h3>
                      </div>
                      <button
                        onClick={handleStartOnboarding}
                        className="w-full max-w-xs h-[50px] bg-tertiary text-surface font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(103,156,255,0.35)] active:scale-95 transition-all"
                      >
                        <Plus className="w-5 h-5" strokeWidth={4} />
                        Create Chart
                      </button>
                    </div>

                    {/* Desktop empty state — unchanged */}
                    <div className="hidden lg:flex flex-col items-center justify-center py-20 gap-6 bg-surface-container-high/20 rounded-[2.5rem] border-2 border-dashed border-on-surface-variant/10 group/empty">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-1 shadow-inner group-hover/empty:scale-110 transition-transform duration-500">
                          <Layout className="w-8 h-8 text-tertiary" />
                        </div>
                        <h3 className="text-2xl font-black text-on-surface tracking-tight">No charts to display</h3>
                      </div>
                      <button
                        onClick={handleStartOnboarding}
                        className="group/btn flex items-center gap-4 bg-tertiary text-surface px-8 py-3.5 rounded-2xl text-lg font-black shadow-[0_20px_40px_-15px_rgba(var(--color-tertiary),0.4)] hover:shadow-[0_25px_50px_-12px_rgba(var(--color-tertiary),0.5)] active:scale-95 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        <Plus className="w-6 h-6 text-surface relative z-10" strokeWidth={4} />
                        <span className="relative z-10">Add New Chart</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Spacer for bottom of right scroll */}
                <div className="h-4 lg:h-12 flex-shrink-0" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
