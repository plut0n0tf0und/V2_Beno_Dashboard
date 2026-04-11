import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeNavbar from './components/HomeNavbar';
import ProjectNavbar from './components/ProjectNavbar';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import PreviewDataSourceModal from './components/PreviewDataSourceModal';
import DataSelectionModal from './components/DataSelectionModal';
import EditNameModal from './components/EditNameModal';
import { Page, Project, ChartConfig } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataSelectionOpen, setIsDataSelectionOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);
  const [editingChartIdForMapping, setEditingChartIdForMapping] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSourceSaved, setIsSourceSaved] = useState(false);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [mappingConfig, setMappingConfig] = useState<{label: string, value: string, chartType?: string} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'home') setSelectedProject(null);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage('project-details');
  };

  const handlePreviewData = (url: string) => {
    setApiUrl(url);
    setIsModalOpen(true);
  };

  const handleConfirmMapping = () => {
    setIsModalOpen(false);
    setIsSourceSaved(true);
  };

  const handleOpenDataSelection = (config: {chartType: string, label: string, value: string}) => {
    setMappingConfig(config);
    setIsDataSelectionOpen(true);
  };

  const handleCreateChart = (name: string, data: any[]) => {
    setIsDataSelectionOpen(false);
    if (!mappingConfig) return;
    
    if (editingChartIdForMapping) {
      setCharts(prev => prev.map(c => c.id === editingChartIdForMapping ? {
        ...c,
        name,
        type: mappingConfig.chartType || c.type,
        data,
        labelField: mappingConfig.label,
        valueField: mappingConfig.value
      } : c));
      setEditingChartIdForMapping(null);
    } else {
      const newChart: ChartConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: mappingConfig.chartType || 'Bar Chart',
        data,
        labelField: mappingConfig.label,
        valueField: mappingConfig.value
      };
      setCharts(prev => [...prev, newChart]);
    }
  };

  const handleEditName = (id: string) => {
    setEditingChartId(id);
    setIsEditNameOpen(true);
  };

  const handleConfirmRename = (newName: string) => {
    if (editingChartId) {
      setCharts(prev => prev.map(c => c.id === editingChartId ? { ...c, name: newName } : c));
    }
    setIsEditNameOpen(false);
  };

  const handleEditMapping = (id: string) => {
    setEditingChartIdForMapping(id);
  };

  const handleReorderCharts = (newOrder: ChartConfig[]) => {
    setCharts(newOrder);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const showSidebar = currentPage === 'home';

  return (
    <div className="min-h-screen bg-surface-container-low transition-colors duration-300">
      {showSidebar && <Sidebar activePage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
      <div className={`${showSidebar ? 'lg:pl-64' : ''} flex flex-col min-h-screen`}>
        {currentPage === 'home' ? (
          <HomeNavbar 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={toggleDarkMode} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <ProjectNavbar 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={toggleDarkMode} 
            onGoHome={() => handleNavigate('home')} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
        
        <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
          {currentPage === 'home' && (
            <Home onProjectClick={handleProjectClick} />
          )}
          
          {currentPage === 'project-details' && selectedProject && (
            <ProjectDetails 
              project={selectedProject} 
              onPreviewData={handlePreviewData}
              isSourceSaved={isSourceSaved}
              onOpenDataSelection={handleOpenDataSelection}
              charts={charts}
              onEditName={handleEditName}
              onEditMapping={handleEditMapping}
              onReorder={handleReorderCharts}
              editingChartId={editingChartIdForMapping || undefined}
            />
          )}

        </main>
      </div>

      <PreviewDataSourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmMapping}
        apiUrl={apiUrl}
      />

      <DataSelectionModal 
        isOpen={isDataSelectionOpen}
        onClose={() => { setIsDataSelectionOpen(false); setEditingChartIdForMapping(null); }}
        onConfirm={handleCreateChart}
        labelField={mappingConfig?.label || ''}
        valueField={mappingConfig?.value || ''}
        initialName={editingChartIdForMapping ? charts.find(c => c.id === editingChartIdForMapping)?.name : ''}
      />

      <EditNameModal 
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
        initialName={charts.find(c => c.id === editingChartId)?.name || ''}
        onConfirm={handleConfirmRename}
      />

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-tertiary/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
