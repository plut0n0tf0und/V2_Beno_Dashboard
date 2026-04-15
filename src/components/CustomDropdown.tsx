import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listboxId = `dropdown-listbox-${uid}`;
  const labelId = `dropdown-label-${uid}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset focused index when opening
  useEffect(() => {
    if (isOpen) {
      const selectedIdx = options.indexOf(value);
      setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    }
  }, [isOpen, options, value]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.querySelectorAll('[role="option"]')[focusedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(options[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) { setIsOpen(true); break; }
        setFocusedIndex(i => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) { setIsOpen(true); break; }
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {headerLabel && (
        <label id={labelId} className="text-xs font-bold uppercase tracking-widest text-on-surface mb-1.5 block">
          {headerLabel}
        </label>
      )}
      
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={headerLabel ? labelId : undefined}
        aria-label={!headerLabel ? (value || placeholder) : undefined}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full flex items-center justify-between border border-on-surface-variant/10 rounded-xl py-2.5 px-4 text-sm font-medium transition-all duration-300 ${
          disabled 
            ? 'bg-disabled-bg text-disabled-text cursor-not-allowed border-on-surface-variant/10' 
            : 'bg-surface-container-highest text-on-surface hover:border-tertiary/50 group'
        } ${isOpen && !disabled ? 'border-tertiary ring-2 ring-tertiary/30' : ''}`}
      >
        <span className={!value ? 'text-placeholder' : ''}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-tertiary' : 'text-on-surface-variant'}`}
          aria-hidden="true"
        />
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
            <div
              id={listboxId}
              role="listbox"
              aria-label={headerLabel || placeholder}
              ref={listRef}
              className="max-h-[40vh] overflow-y-auto minimal-scrollbar py-2"
            >
              {options.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <span className="text-sm text-on-surface-variant">No options found</span>
                </div>
              ) : (
                options.map((option, idx) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={value === option}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-all duration-200 group ${
                      value === option
                        ? 'bg-tertiary/10 text-tertiary font-bold'
                        : focusedIndex === idx
                          ? 'bg-surface-container-high text-on-surface'
                          : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="text-sm truncate">{option}</span>
                    {value === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-tertiary rounded-full p-0.5"
                        aria-hidden="true"
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
