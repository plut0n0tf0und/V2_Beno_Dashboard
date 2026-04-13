import { Folder, Users, Settings, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Projects', icon: Folder },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'settings', label: 'Organization Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-surface p-6 gap-6 transition-colors duration-300">
      <div className="flex items-center justify-between lg:hidden mb-2">
        <span className="font-headline font-bold text-xl text-tertiary">Menu</span>
        <button onClick={onClose} className="p-2 text-on-surface-variant">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onNavigate(item.id); onClose(); }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              activePage === item.id 
                ? 'text-on-surface bg-surface-container font-bold shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="font-body text-base font-semibold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <Square className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 lg:top-16 h-full lg:h-[calc(100vh-64px)] w-64 z-[60] lg:z-40 transition-transform duration-300 ease-out transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
