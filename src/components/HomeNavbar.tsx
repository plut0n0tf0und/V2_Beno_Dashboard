import { Search, Bell, Globe, Sun, Moon, HelpCircle, ChevronDown, Menu } from 'lucide-react';

interface HomeNavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
}

export default function HomeNavbar({ isDarkMode, onToggleDarkMode, onToggleSidebar }: HomeNavbarProps) {
  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-surface/80 backdrop-blur-xl z-[80] px-3 sm:px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-3 sm:gap-8 shrink-0">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="text-on-surface">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
          </svg>
        </div>

        {/* Org Switcher */}
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-lg cursor-pointer group hover:bg-surface-container-highest transition-colors">
          <div className="text-on-surface">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3v12"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 12h3"/>
            </svg>
          </div>
          <span className="hidden sm:inline-block font-headline text-base font-bold text-on-surface whitespace-nowrap leading-tight">WOOOYS's Org</span>
          <div className="flex flex-col ml-1">
            <ChevronDown className="w-3 h-3 text-on-surface-variant group-hover:text-on-surface" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">


        {/* English Toggle */}
        <div className="hidden sm:flex items-center gap-2 px-2 py-1.5 cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors group">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-bold">English</span>
          <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="hidden sm:flex p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container group">
            <Search className="w-5 h-5" />
          </button>

          <button className="hidden sm:flex p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container group">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container relative">
            <Bell className="w-5 h-5" />
          </button>

          {/* Modern Theme Toggle */}
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
