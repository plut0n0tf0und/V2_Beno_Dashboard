import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { ChevronDown, ChevronUp, Database, Plus, MoreVertical, Layout, Edit2, Share2 } from 'lucide-react';
import { Project, ChartConfig, DataSource } from '../types';
import BentoChart from '../components/BentoChart';

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
  onReorder: (newOrder: ChartConfig[]) => void;
  editingChartId?: string;
  onDeleteSource: (id: string) => void;
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

import DataSourceMappingModal from '../components/DataSourceMappingModal';

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
  onReorder,
  editingChartId,
  onDeleteSource
}: ProjectDetailsProps) {
  const [isSourceOpen, setIsSourceOpen] = useState(dataSources.length === 0);
  const [isMappingOpen, setIsMappingOpen] = useState(dataSources.length > 0 && selectedSourceId !== null);
  const [isDataSelectionOpen, setIsDataSelectionOpen] = useState(false);
  const [highlightMapping, setHighlightMapping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(charts.length === 0);

  // Automatically collapse source section and open mapping when a source is selected
  useEffect(() => {
    if (selectedSourceId) {
      setIsSourceOpen(false);
      setIsMappingOpen(true);
    }
  }, [selectedSourceId]);

  // Force modal open if no charts exist
  useEffect(() => {
    if (charts.length === 0) {
      setIsModalOpen(true);
    }
  }, [charts.length]);

  // Sync mapping panel with editing chart
  useEffect(() => {
    if (editingChartId) {
      const chart = charts.find(c => c.id === editingChartId);
      if (chart) {
        setSelectedChart(chart.type);
        setSelectedLabel(chart.labelField);
        setSelectedValue(chart.valueField);
        setIsMappingOpen(true);
        setIsDataSelectionOpen(false);
        setIsModalOpen(true);
      }
    }
  }, [editingChartId, charts]);
  
  // Mapping State
  const [selectedChart, setSelectedChart] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const isMappingEnabled = selectedSourceId !== null;
  const isSubFieldsEnabled = isMappingEnabled && selectedChart !== '';

  const handleEditMappingInternal = (id: string) => {
    setIsMappingOpen(true);
    setIsDataSelectionOpen(false);
    setIsModalOpen(true);
    setHighlightMapping(true);
    setTimeout(() => setHighlightMapping(false), 2000);
    onEditMapping(id);
  };

  const handleCancelEdit = () => {
    setSelectedChart('');
    setSelectedLabel('');
    setSelectedValue('');
    setIsModalOpen(false);
    setIsDataSelectionOpen(false);
  };

  const handleOpenDataSelection = () => {
    setIsMappingOpen(false);
    setIsDataSelectionOpen(true);
  };

  return (
    <div className={`flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen transition-all duration-500 pb-10 lg:pb-0 ${highlightMapping ? 'bg-black/20' : ''}`}>
      <DataSourceMappingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // Props for AddDataSourceSection
        isSourceOpen={isSourceOpen}
        setIsSourceOpen={setIsSourceOpen}
        dataSources={dataSources}
        selectedSourceId={selectedSourceId}
        onSelectSource={(id) => {
          onSelectSource(id);
          setIsSourceOpen(false);
          setIsMappingOpen(true);
        }}
        onAddSource={onAddSource}
        onDeleteSource={onDeleteSource}
        // Props for MappingSection
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
        onOpenDataSelection={handleOpenDataSelection}
        editingChartId={editingChartId}
        highlightMapping={highlightMapping}
        chartTypes={chartTypes}
        labelFields={labelFields}
        valueFields={valueFields}
        onCancelEdit={handleCancelEdit}
        isClosable={charts.length > 0}
        // Section 3
        isDataSelectionOpen={isDataSelectionOpen}
        setIsDataSelectionOpen={setIsDataSelectionOpen}
        initialName={editingChartId ? charts.find(c => c.id === editingChartId)?.name : ''}
        onCreateChart={(name, data) => {
          onCreateChart(name, data, { chartType: selectedChart, label: selectedLabel, value: selectedValue });
          setIsDataSelectionOpen(false);
          setIsModalOpen(false);
          if (editingChartId) {
            handleCancelEdit(); // reset mapping state
          }
        }}
      />

      {/* Right Column: Dashboard */}
      <div 
        className={`flex-grow bg-surface-container rounded-2xl p-4 flex flex-col gap-4 shadow-sm transition-all duration-500 ${highlightMapping ? 'opacity-20 blur-[4px] scale-98' : 'opacity-100'}`}
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
                    setIsSourceOpen(true);
                    setIsMappingOpen(false);
                    setIsModalOpen(true);
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
