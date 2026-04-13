import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) setName(initialName);
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface-container w-full max-w-md rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-outline-variant/20"
        >
          <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
            <h2 className="text-xl font-headline font-bold text-on-surface">Edit Chart Name</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Chart Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border border-on-surface-variant/10 rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-tertiary/20 outline-none transition-all"
                autoFocus
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
                onClick={() => onConfirm(name)}
                disabled={!name.trim()}
                className="px-6 py-2.5 rounded-xl bg-on-surface text-surface font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
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
