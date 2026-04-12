import { Search, Plus, Grid, List, Filter } from 'lucide-react';
import BentoCard from '../components/BentoCard';
import { Project } from '../types';

interface HomeProps {
  onProjectClick: (project: Project) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sales Analytics',
    description: 'Track product sales, revenue and demand trends across all global regions.',
    editedAt: 'Edited 1hr ago',
    dataCount: 3,
    dashboardCount: 4,
    isActive: true,
  }
];

export default function Home({ onProjectClick }: HomeProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6">
        <h2 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">Projects</h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow max-w-md w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search for a project" 
                className="w-full bg-surface-container-highest/50 border-none rounded-lg py-2 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-tertiary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container p-1 rounded-lg">
              <button className="p-2 bg-surface-container-highest rounded-md text-on-surface shadow-sm">
                <Grid className="w-4 h-4" />
              </button>
              <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="p-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors">
              <Filter className="w-4 h-4" />
            </button>

            <button 
              onClick={() => onProjectClick(mockProjects[0])}
              className="bg-on-surface text-surface font-bold py-2 px-5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg whitespace-nowrap text-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <BentoCard 
            key={project.id}
            title={project.name}
            description={project.description}
            editedAt={project.editedAt}
            dataCount={project.dataCount}
            dashboardCount={project.dashboardCount}
            isActive={project.isActive}
            image={project.image}
            onClick={() => {}}
          />
        ))}
      </main>
    </div>
  );
}
