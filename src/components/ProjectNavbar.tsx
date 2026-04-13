import { Search, Bell, Globe, Sun, Moon, HelpCircle, ChevronDown, Menu, Layout, Folder, Briefcase, Package, Layers, FolderKanban } from 'lucide-react';

interface ProjectNavbarProps {
  isDarkMode: boolean;
  projectName?: string;
  onToggleDarkMode: () => void;
  onGoHome: () => void;
  onToggleSidebar: () => void;
}

export default function ProjectNavbar({ isDarkMode, projectName, onToggleDarkMode, onGoHome, onToggleSidebar }: ProjectNavbarProps) {
  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-surface/80 backdrop-blur-xl z-[80] px-3 sm:px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Logo */}
          <div 
            onClick={onGoHome}
            className="text-tertiary cursor-pointer hover:opacity-80 transition-all active:scale-95"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
            </svg>
          </div>
        </div>

        {projectName && (
          <div className="flex items-center gap-2.5 bg-surface-container-high/50 px-3.5 py-1.5 rounded-xl border border-on-surface-variant/5 shadow-sm">
            <Folder className="w-3.5 h-3.5 text-on-surface/50" strokeWidth={2.5} />
            <span className="text-sm font-bold text-on-surface uppercase tracking-wider">
              {projectName}
            </span>
          </div>
        )}
      </div>



      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
        {/* Metadata Date Tag */}
        <div className="hidden lg:flex items-center bg-surface-container-high px-4 py-1.5 rounded-full text-sm font-bold text-on-surface-variant shadow-sm border border-on-surface-variant/5 leading-tight">
          Friday, 16 Feb 2026
        </div>

        {/* English Toggle */}
        <div className="hidden sm:flex items-center gap-2 px-2 py-1.5 cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors group">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-bold">English</span>
          <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container group">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container relative">
            <Bell className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={onToggleDarkMode}
            className="flex items-center bg-surface-container p-1 rounded-full hover:bg-surface-container-high transition-all"
          >
            <div className={`p-1 rounded-full transition-all ${!isDarkMode ? 'bg-tertiary text-surface' : 'text-on-surface-variant'}`}>
              <Sun className="w-3 h-3" />
            </div>
            <div className={`p-1 rounded-full transition-all ${isDarkMode ? 'bg-tertiary text-surface' : 'text-on-surface-variant'}`}>
              <Moon className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* Profile */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-on-surface-variant/20 cursor-pointer hover:border-tertiary transition-colors">
          <img 
            src="https://picsum.photos/seed/user/100/100" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </nav>
  );
}
