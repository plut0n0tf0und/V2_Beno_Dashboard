import React, { useState, useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  initialName: string;
}

export default function EditNameModal({ isOpen, onClose, onConfirm, initialName }: EditNameModalProps) {
  const [name, setName] = useState(initialName);
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialName]);

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const focusable = [inputRef.current, firstFocusRef.current, lastFocusRef.current].filter(Boolean) as HTMLElement[];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface-container w-full max-w-md rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-outline-variant/20"
        >
          <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
            <h2 id={titleId} className="text-xl font-headline font-bold text-on-surface">Edit Chart Name</h2>
            <button
              ref={firstFocusRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor={`${titleId}-input`} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Chart Name
              </label>
              <input
                id={`${titleId}-input`}
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onConfirm(name); }}
                className="w-full bg-surface-container-low border border-on-surface-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary outline-none transition-all"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-on-surface-variant/10 transition-all"
              >
                Cancel
              </button>
              <button
                ref={lastFocusRef}
                onClick={() => onConfirm(name)}
                disabled={!name.trim()}
                aria-disabled={!name.trim()}
                className="px-6 py-2.5 rounded-xl bg-on-surface text-surface font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
