import { Search, Plus, Grid, List, Filter, ArrowUpDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import BentoCard from '../components/BentoCard';
import { Project } from '../types';

interface HomeProps {
  onProjectClick: (project: Project) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Existing Sample Prjt',
    description: 'Track product sales, revenue and demand trends across all global regions.',
    editedAt: 'Edited 1hr ago',
    dataCount: 3,
    dashboardCount: 4,
    isActive: true,
  }
];

const newProjectPayload = (): Project => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'WOOOYS Block',
  description: 'Start managing your data and dashboard.',
  editedAt: 'Just now',
  dataCount: 0,
  dashboardCount: 0,
  isActive: true,
});

export default function Home({ onProjectClick }: HomeProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recent');
  const inputRef = useRef<HTMLInputElement>(null);

  const sortOptions = ['Recent', 'Name A–Z', 'Name Z–A', 'Most Data'];

  return (
    <div className="max-w-[1024px] mx-auto space-y-6 pb-24 sm:pb-6">
      <header className="flex flex-col gap-4 sm:gap-6">
        <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface leading-tight">Projects</h1>

        {/* Actions row */}
        <div className="flex items-center gap-3">

          {/* Mobile: search (flex-1) + sort icon, FAB handles New Project */}
          <div className="flex sm:hidden items-stretch gap-2 w-full">
            {/* Search — takes 3 parts */}
            <div className="relative flex-[3]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects..."
                aria-label="Search projects"
                className="w-full h-full bg-surface-container rounded-xl py-2.5 pl-10 pr-4 text-base text-on-surface placeholder:text-placeholder focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary outline-none transition-all"
              />
            </div>

            {/* Sort — takes 1 part, matches input height */}
            <div className="relative flex-[1] flex">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                aria-label="Sort projects"
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                className="w-full h-full bg-surface-container rounded-xl text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
              >
                <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setSortOpen(false)} aria-hidden="true" />
                    <motion.div
                      role="listbox"
                      aria-label="Sort options"
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-surface-container border border-on-surface-variant/10 rounded-2xl shadow-xl overflow-hidden z-[100] p-1"
                    >
                      {sortOptions.map(opt => (
                        <button
                          key={opt}
                          role="option"
                          aria-selected={sortBy === opt}
                          onClick={() => { setSortBy(opt); setSortOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${sortBy === opt ? 'text-tertiary bg-tertiary/10' : 'text-on-surface hover:bg-surface-container-high'}`}
                        >
                          {opt}
                          {sortBy === opt && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop: full search + controls */}
          <div className="hidden sm:flex items-center gap-3 flex-1">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search for a project"
                aria-label="Search for a project"
                className="w-full bg-surface-container-highest/50 border-none rounded-xl py-2.5 pl-12 pr-4 text-base text-on-surface placeholder:text-placeholder focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary transition-all outline-none"
              />
            </div>

            <div className="flex bg-surface-container p-1 rounded-lg" role="group" aria-label="View mode">
              <button aria-label="Grid view" aria-pressed={true} className="p-2 bg-surface-container-highest rounded-md text-on-surface shadow-sm">
                <Grid className="w-4 h-4" aria-hidden="true" />
              </button>
              <button aria-label="List view" aria-pressed={false} className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                <List className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button aria-label="Filter projects" className="p-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors">
              <Filter className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={() => onProjectClick(newProjectPayload())}
              className="bg-on-surface text-surface font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg whitespace-nowrap text-base"
            >
              <Plus className="w-5 h-5" strokeWidth={3} aria-hidden="true" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      <section aria-label="Projects list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            onClick={() => onProjectClick(project)}
          />
        ))}
      </section>

      {/* FAB — mobile only */}
      <motion.button
        onClick={() => onProjectClick(newProjectPayload())}
        whileTap={{ scale: 0.92 }}
        aria-label="Create new project"
        className="sm:hidden fixed bottom-6 right-6 z-[80] w-14 h-14 bg-tertiary text-surface rounded-full shadow-[0_8px_30px_rgba(103,156,255,0.4)] flex items-center justify-center transition-shadow"
      >
        <Plus className="w-6 h-6" strokeWidth={3} aria-hidden="true" />
      </motion.button>

    </div>
  );
}
