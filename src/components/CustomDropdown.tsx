import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface CustomDropdownProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  headerLabel?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  headerLabel
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {headerLabel && (
        <label className="text-sm font-bold uppercase tracking-widest text-on-surface mb-3 block">
          {headerLabel}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between border border-on-surface-variant/10 rounded-2xl py-4 px-5 text-base font-medium transition-all duration-300 outline-none ${
          disabled 
            ? 'bg-on-surface-variant/5 text-on-surface-variant/40 cursor-not-allowed' 
            : 'bg-surface-container-highest text-on-surface hover:border-tertiary/50 focus:ring-4 focus:ring-tertiary/10 group'
        } ${isOpen ? 'border-tertiary ring-4 ring-tertiary/10' : ''}`}
      >
        <span className={!value ? 'text-on-surface-variant/50' : ''}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-tertiary' : 'text-on-surface-variant'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="mt-3 bg-surface-container-low border border-on-surface-variant/10 rounded-2xl shadow-xl overflow-hidden"
          >
            {options.length > 5 && (
              <div className="p-3 border-b border-on-surface-variant/5 bg-surface-container">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full bg-surface-container-highest/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-tertiary/20 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-[40vh] overflow-y-auto no-scrollbar py-2">
              {filteredOptions.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <span className="text-sm text-on-surface-variant">No options found</span>
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-200 group ${
                      value === option 
                        ? 'bg-tertiary/10 text-tertiary font-bold' 
                        : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="text-base truncate">{option}</span>
                    {value === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-tertiary rounded-full p-0.5"
                      >
                        <Check className="w-3 h-3 text-surface" strokeWidth={4} />
                      </motion.div>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
