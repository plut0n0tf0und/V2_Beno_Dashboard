import React, { useState } from 'react';
import { X, Edit3, Maximize2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PreviewDataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  apiUrl: string;
}

const mockJsonData = {
  "products": [
    {
      "id": 243,
      "name": "Action Figures & Collectibles",
      "slug": "action-figures-collectibles",
      "parent": 240,
      "description": "Welcome to Action Figures & Collectibles! We have the largest selection of action figures and collectibles for fans of all ages.",
      "count": 152,
      "image": {
        "src": "https://example.com/images/collectibles.jpg",
        "alt": "Action Figures Collection"
      },
      "metadata": {
        "lastUpdated": "2024-02-16T10:30:00Z",
        "popularityScore": 8.7,
        "tags": ["collectibles", "action-figures", "marvel", "dc", "star-wars"]
      }
    },
    {
      "id": 244,
      "name": "Vintage Toys & Games",
      "slug": "vintage-toys-games",
      "parent": 240,
      "description": "Discover rare and vintage toys from the 80s, 90s, and early 2000s. Perfect for collectors.",
      "count": 89,
      "image": null,
      "metadata": {
        "lastUpdated": "2024-02-15T14:20:00Z",
        "popularityScore": 9.2,
        "tags": ["vintage", "retro", "toys", "games", "nostalgia"]
      }
    },
    {
      "id": 245,
      "name": "Gaming Accessories",
      "slug": "gaming-accessories",
      "parent": 241,
      "description": "High-quality gaming accessories including controllers, headsets, keyboards, and more.",
      "count": 324,
      "image": {
        "src": "https://example.com/images/gaming.jpg",
        "alt": "Gaming Gear"
      },
      "metadata": {
        "lastUpdated": "2024-02-16T08:45:00Z",
        "popularityScore": 9.5,
        "tags": ["gaming", "accessories", "pc", "console", "esports"]
      }
    },
    {
      "id": 246,
      "name": "Board Games & Puzzles",
      "slug": "board-games-puzzles",
      "parent": 241,
      "description": "Family-friendly board games and challenging puzzles for all age groups.",
      "count": 156,
      "image": {
        "src": "https://example.com/images/boardgames.jpg",
        "alt": "Board Games"
      },
      "metadata": {
        "lastUpdated": "2024-02-14T16:10:00Z",
        "popularityScore": 7.8,
        "tags": ["board-games", "puzzles", "family", "strategy"]
      }
    }
  ],
  "pagination": {
    "total": 127,
    "per_page": 20,
    "current_page": 1,
    "total_pages": 7
  }
};

export default function PreviewDataSourceModal({ isOpen, onClose, onConfirm, apiUrl }: PreviewDataSourceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockJsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface-container w-full max-w-3xl rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-outline-variant/20"
        >
          <div className="flex justify-between items-center p-4 lg:p-6 border-b border-outline-variant/10 flex-shrink-0">
            <h2 className="text-xl font-headline font-bold text-on-surface leading-tight">Preview Data Source</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-[50vh] no-scrollbar">
            {/* Source Link */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Source link</label>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant/10">
                <span className="flex-grow text-sm text-on-surface font-mono break-all">{apiUrl || 'https://woooys.com/products/categories?-consumerkey-consumer-scret'}</span>
                <button className="p-1.5 text-on-surface-variant hover:text-tertiary transition-colors rounded-md hover:bg-surface-container-high flex-shrink-0">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Source Data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Preview source data</label>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 text-on-surface-variant hover:text-tertiary transition-colors rounded-md hover:bg-surface-container-high"
                    title="Copy JSON"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    className="p-1.5 text-on-surface-variant hover:text-tertiary transition-colors rounded-md hover:bg-surface-container-high"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
                <pre className="p-3 sm:p-4 text-xs font-mono text-on-surface-variant max-h-[180px] sm:max-h-[300px] overflow-y-auto whitespace-pre-wrap break-all no-scrollbar">
                  {JSON.stringify(mockJsonData, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox - Fixed below scrollable content */}
          <div className="px-4 lg:px-6 py-4 border-t border-outline-variant/10 bg-surface-container flex-shrink-0">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setIsConfirmed(!isConfirmed)}
                className={`w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
                  isConfirmed 
                    ? 'bg-tertiary border-tertiary' 
                    : 'border-on-surface-variant/30 hover:border-tertiary'
                }`}
              >
                {isConfirmed && (
                  <svg className="w-3 h-3 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <label 
                onClick={() => setIsConfirmed(!isConfirmed)}
                className="text-sm text-on-surface cursor-pointer select-none"
              >
                I am able to view the data from the Source.
              </label>
            </div>
          </div>

          <div className="p-4 lg:p-6 bg-surface-container-high/40 border-t border-outline-variant/10 flex justify-end gap-3 flex-shrink-0">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface hover:bg-surface-container transition-all border border-outline-variant/20"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={!isConfirmed}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isConfirmed 
                  ? 'bg-on-surface text-surface hover:opacity-90 active:scale-[0.98]' 
                  : 'bg-on-surface-variant/20 text-on-surface-variant cursor-not-allowed'
              }`}
            >
              Save url as resource
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
