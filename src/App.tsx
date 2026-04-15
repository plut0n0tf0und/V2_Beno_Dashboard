import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Lenis from 'lenis';
import HomeNavbar from './components/HomeNavbar';
import ProjectNavbar from './components/ProjectNavbar';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import EditNameModal from './components/EditNameModal';
import { Page, Project, ChartConfig, DataSource, ProjectState } from './types';
import { mockStockData } from './data/mockData';

// ── Pre-built stock data for "Existing Sample Prjt" (id: '1') ──────────────
const STOCK_SOURCE: DataSource = {
  id: 'stock-src-1',
  name: 'Global Stock Market API',
  url: 'https://api.example.com/stocks/market-data',
  type: 'API',
};

const STOCK_CHARTS: ChartConfig[] = [
  {
    id: 'stock-1',
    name: 'Stock Price Overview',
    type: 'Bar Chart',
    data: mockStockData.stocks,
    labelField: 'ticker',
    valueField: 'price',
    layout: { x: 0, y: 0, w: 8, h: 4 },
  },
  {
    id: 'stock-2',
    name: 'Market Cap by Sector',
    type: 'Pie Chart',
    data: mockStockData.stocks,
    labelField: 'sector',
    valueField: 'marketCap',
    layout: { x: 8, y: 0, w: 4, h: 4 },
  },
  {
    id: 'stock-3',
    name: 'Daily Volume',
    type: 'Area Chart',
    data: mockStockData.stocks,
    labelField: 'ticker',
    valueField: 'volume',
    layout: { x: 0, y: 4, w: 6, h: 4 },
  },
  {
    id: 'stock-4',
    name: 'P/E Ratio Comparison',
    type: 'Bar Chart',
    data: mockStockData.stocks,
    labelField: 'ticker',
    valueField: 'peRatio',
    layout: { x: 6, y: 4, w: 6, h: 4 },
  },
];

const INITIAL_PROJECT_STATES: Record<string, ProjectState> = {
  '1': {
    charts: STOCK_CHARTS,
    dataSources: [STOCK_SOURCE],
    selectedSourceId: STOCK_SOURCE.id,
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);
  const [editingChartIdForMapping, setEditingChartIdForMapping] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Per-project state map
  const [projectStates, setProjectStates] = useState<Record<string, ProjectState>>(INITIAL_PROJECT_STATES);

  // Helpers to read/write current project state
  const getProjectState = (id: string): ProjectState =>
    projectStates[id] ?? { charts: [], dataSources: [], selectedSourceId: null };

  const setProjectState = (id: string, updater: (prev: ProjectState) => ProjectState) => {
    setProjectStates(prev => ({
      ...prev,
      [id]: updater(getProjectState(id)),
    }));
  };

  const pid = selectedProject?.id ?? '';
  const { charts, dataSources, selectedSourceId } = getProjectState(pid);

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
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'home') setSelectedProject(null);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    // Ensure new projects get an empty state entry
    if (!projectStates[project.id]) {
      setProjectStates(prev => ({
        ...prev,
        [project.id]: { charts: [], dataSources: [], selectedSourceId: null },
      }));
    }
    setCurrentPage('project-details');
  };

  const handleAddSource = (url: string, name: string) => {
    const newSource: DataSource = {
      id: Math.random().toString(36).substr(2, 9),
      name, url, type: 'API',
    };
    setProjectState(pid, prev => ({
      ...prev,
      dataSources: [...prev.dataSources, newSource],
      selectedSourceId: newSource.id,
    }));
  };

  const handleDeleteSource = (id: string) => {
    setProjectState(pid, prev => ({
      ...prev,
      dataSources: prev.dataSources.filter(s => s.id !== id),
      selectedSourceId: prev.selectedSourceId === id ? null : prev.selectedSourceId,
    }));
  };

  const handleSelectSource = (id: string) => {
    setProjectState(pid, prev => ({ ...prev, selectedSourceId: id }));
  };

  const handleCreateChart = (name: string, data: any[], config: { chartType: string; label: string; value: string }) => {
    setProjectState(pid, prev => {
      if (editingChartIdForMapping) {
        return {
          ...prev,
          charts: prev.charts.map(c =>
            c.id === editingChartIdForMapping
              ? { ...c, name, type: config.chartType || c.type, data, labelField: config.label, valueField: config.value }
              : c
          ),
        };
      }
      const newChart: ChartConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: config.chartType || 'Bar Chart',
        data,
        labelField: config.label,
        valueField: config.value,
        layout: { x: (prev.charts.length * 2) % 12, y: Infinity, w: 6, h: 4 },
      };
      return { ...prev, charts: [...prev.charts, newChart] };
    });
    if (editingChartIdForMapping) setEditingChartIdForMapping(null);
  };

  const handleEditName = (id: string) => {
    setEditingChartId(id);
    setIsEditNameOpen(true);
  };

  const handleConfirmRename = (newName: string) => {
    if (editingChartId) {
      setProjectState(pid, prev => ({
        ...prev,
        charts: prev.charts.map(c => c.id === editingChartId ? { ...c, name: newName } : c),
      }));
    }
    setIsEditNameOpen(false);
  };

  const handleEditMapping = (id: string) => {
    setEditingChartIdForMapping(id);
  };

  const handleCancelEditMapping = () => {
    setEditingChartIdForMapping(null);
  };

  const handleLayoutChange = (newLayout: any[]) => {
    setProjectState(pid, prev => ({
      ...prev,
      charts: prev.charts.map(chart => {
        const match = newLayout.find(l => l.i === chart.id);
        return match ? { ...chart, layout: { x: match.x, y: match.y, w: match.w, h: match.h } } : chart;
      }),
    }));
  };

  const handleDeleteChart = (id: string) => {
    setProjectState(pid, prev => ({
      ...prev,
      charts: prev.charts.filter(c => c.id !== id),
    }));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const showSidebar = currentPage === 'home';

  return (
    <div className="min-h-screen bg-surface-container-low transition-colors duration-300">
      {/* Skip to main content — keyboard accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {showSidebar && (
        <Sidebar
          activePage={currentPage}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

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
            projectName={selectedProject?.name}
            onToggleDarkMode={toggleDarkMode}
            onGoHome={() => handleNavigate('home')}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        <main id="main-content" className="flex-grow pt-16 pb-20 px-3 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
          {currentPage === 'home' && (
            <Home onProjectClick={handleProjectClick} />
          )}

          {currentPage === 'project-details' && selectedProject && (
            <ProjectDetails
              project={selectedProject}
              onAddSource={handleAddSource}
              dataSources={dataSources}
              selectedSourceId={selectedSourceId}
              onSelectSource={handleSelectSource}
              onCreateChart={handleCreateChart}
              charts={charts}
              onEditName={handleEditName}
              onEditMapping={handleEditMapping}
              onCancelEditMapping={handleCancelEditMapping}
              onLayoutChange={handleLayoutChange}
              editingChartId={editingChartIdForMapping || undefined}
              onDeleteSource={handleDeleteSource}
              onDeleteChart={handleDeleteChart}
            />
          )}
        </main>
      </div>

      <EditNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
        initialName={charts.find(c => c.id === editingChartId)?.name || ''}
        onConfirm={handleConfirmRename}
      />

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-surface-container-lowest">
        <div
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-tertiary/5 blur-[120px] rounded-full will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>
    </div>
  );
}
