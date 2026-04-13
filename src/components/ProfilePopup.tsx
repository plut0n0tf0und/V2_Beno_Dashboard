import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, User, Settings, LogOut } from 'lucide-react';

interface ProfilePopupProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ProfilePopup({ isDarkMode, onToggleDarkMode }: ProfilePopupProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden border border-on-surface-variant/20 hover:border-tertiary transition-colors active:scale-95"
      >
        <img
          src="https://picsum.photos/seed/user/100/100"
          alt="User"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[90] sm:hidden" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
              className="absolute right-0 top-full mt-3 w-64 bg-surface-container border border-on-surface-variant/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] z-[100] overflow-hidden sm:hidden"
            >
              {/* Account info */}
              <div className="px-4 py-4 border-b border-on-surface-variant/8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-on-surface-variant/20 flex-shrink-0">
                  <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-on-surface truncate">WOOOYS</span>
                  <span className="text-xs text-on-surface-variant truncate">woooys@example.com</span>
                </div>
              </div>

              {/* Theme toggle row */}
              <div className="px-4 py-3 border-b border-on-surface-variant/8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isDarkMode ? <Moon className="w-4 h-4 text-on-surface-variant" /> : <Sun className="w-4 h-4 text-on-surface-variant" />}
                    <span className="text-sm font-bold text-on-surface">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-tertiary' : 'bg-on-surface-variant/30'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-surface shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  Account
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors">
                  <Settings className="w-4 h-4 text-on-surface-variant" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
