import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Lenis from 'lenis';
import HomeNavbar from './components/HomeNavbar';
import ProjectNavbar from './components/ProjectNavbar';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import PreviewDataSourceModal from './components/PreviewDataSourceModal';
import EditNameModal from './components/EditNameModal';
import { Page, Project, ChartConfig, DataSource } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);
  const [editingChartIdForMapping, setEditingChartIdForMapping] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'home') setSelectedProject(null);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage('project-details');
  };

  const handleAddSource = (url: string, name: string) => {
    const newSource: DataSource = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      url,
      type: 'API'
    };
    setDataSources(prev => [...prev, newSource]);
    setSelectedSourceId(newSource.id);
  };

  const handleConfirmMapping = () => {
    setIsModalOpen(false);
  };

  const handleDeleteSource = (id: string) => {
    setDataSources(prev => prev.filter(s => s.id !== id));
    if (selectedSourceId === id) {
      setSelectedSourceId(null);
    }
  };

  const handleCreateChart = (name: string, data: any[], config: {chartType: string, label: string, value: string}) => {
    if (editingChartIdForMapping) {
      setCharts(prev => prev.map(c => c.id === editingChartIdForMapping ? {
        ...c,
        name,
        type: config.chartType || c.type,
        data,
        labelField: config.label,
        valueField: config.value
      } : c));
      setEditingChartIdForMapping(null);
    } else {
      const newChart: ChartConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: config.chartType || 'Bar Chart',
        data,
        labelField: config.label,
        valueField: config.value
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
              onAddSource={handleAddSource}
              dataSources={dataSources}
              selectedSourceId={selectedSourceId}
              onSelectSource={setSelectedSourceId}
              onCreateChart={handleCreateChart}
              charts={charts}
              onEditName={handleEditName}
              onEditMapping={handleEditMapping}
              onReorder={handleReorderCharts}
              editingChartId={editingChartIdForMapping || undefined}
              onDeleteSource={handleDeleteSource}
            />
          )}

        </main>
      </div>

      <PreviewDataSourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmMapping}
        apiUrl={dataSources.find(s => s.id === selectedSourceId)?.url || ''}
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
