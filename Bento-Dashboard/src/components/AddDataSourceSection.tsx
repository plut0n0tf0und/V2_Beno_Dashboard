import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Database, Plus, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import { DataSource } from '../types';

const extractSourceName = (url: string) => {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    const lastPart = parts.pop();
    if (lastPart) {
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
    return new URL(url).hostname;
  } catch (e) {
    return 'Data Source';
  }
};

const mockJsonData = {
  "products": [
    {
      "id": 243,
      "name": "Action Figures & Collectibles",
      "slug": "action-figures-collectibles",
      "parent": 240,
      "description": "Welcome to Action Figures & Collectibles!",
      "count": 152,
      "metadata": {
        "lastUpdated": "2024-02-16T10:30:00Z",
        "popularityScore": 8.7,
        "tags": ["collectibles", "action-figures"]
      }
    },
    {
      "id": 244,
      "name": "Vintage Toys & Games",
      "slug": "vintage-toys-games",
      "parent": 240,
      "count": 89,
      "metadata": {
        "popularityScore": 9.2
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

interface AddDataSourceSectionProps {
  isSourceOpen: boolean;
  setIsSourceOpen: (open: boolean) => void;
  dataSources: DataSource[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
  onAddSource: (url: string, name: string) => void;
  onDeleteSource: (id: string) => void;
}

export default function AddDataSourceSection({
  isSourceOpen,
  setIsSourceOpen,
  dataSources,
  selectedSourceId,
  onSelectSource,
  onAddSource,
  onDeleteSource
}: AddDataSourceSectionProps) {
  const [isAdding, setIsAdding] = useState(dataSources.length === 0);
  const [newUrl, setNewUrl] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isUrlValid = newUrl.trim().length > 0;
  const selectedSource = dataSources.find(s => s.id === selectedSourceId);
  const sourceNameHint = selectedSource ? selectedSource.name : "None selected";

  return (
    <div className="bg-surface-container rounded-2xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 shadow-sm transition-all duration-500">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsSourceOpen(!isSourceOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-sm text-on-surface">1</div>
          <div className="flex flex-col">
            <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">Add Data Source</h3>
            {!isSourceOpen && selectedSource && (
              <p className="text-[10px] font-medium text-on-surface-variant/40 uppercase tracking-wider">
                Selected: {selectedSource.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isSourceOpen && dataSources.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsAdding(!isAdding);
              }}
              className={`${isAdding ? 'bg-tertiary text-surface' : 'bg-on-surface-variant/10 text-on-surface hover:bg-on-surface-variant/20'} px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all outline-none`}
            >
              <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
              {isAdding ? 'Cancel' : 'Add'}
            </button>
          )}
          {isSourceOpen ? (
            <ChevronUp className="w-5 h-5 text-on-surface-variant" />
          ) : (
            <ChevronDown className="w-5 h-5 text-on-surface-variant" />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isSourceOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-2">
              {/* Added Data Source Container */}
              {dataSources.length > 0 && (
                <div className="space-y-4">
                  <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Added Data Source</p>
                  <div className="max-h-[300px] overflow-y-auto pr-1 no-scrollbar space-y-3">
                    {dataSources.map((source) => (
                      <div 
                        key={source.id}
                        onClick={() => onSelectSource(source.id)}
                        className={`flex items-center justify-between border rounded-xl p-4 group/item transition-all cursor-pointer ${
                          selectedSourceId === source.id 
                            ? 'bg-tertiary/10 border-tertiary ring-1 ring-tertiary/30' 
                            : 'bg-surface-container-low border-on-surface-variant/10 hover:border-tertiary/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Radio Button */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedSourceId === source.id ? 'border-tertiary' : 'border-on-surface-variant/30 group-hover/item:border-tertiary/50'
                          }`}>
                            {selectedSourceId === source.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
                              <Database className="w-4 h-4 text-tertiary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-on-surface">{source.name}</span>
                              <span className="text-[10px] text-on-surface-variant font-mono truncate max-w-[150px]">
                                {source.url}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              const blob = new Blob([JSON.stringify(mockJsonData, null, 2)], { type: 'application/json' });
                              const jsonUrl = URL.createObjectURL(blob);
                              window.open(jsonUrl, '_blank');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors outline-none"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View data
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === source.id ? null : source.id)}
                              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-on-surface-variant/10 rounded-lg transition-all outline-none"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            <AnimatePresence>
                              {openMenuId === source.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-full mt-2 w-36 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden z-[100]"
                                >
                                  <button 
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      onDeleteSource(source.id);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors text-left"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Source Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 pt-4 border-t border-on-surface-variant/5"
                  >
                    <p className="font-body text-sm font-semibold text-on-surface tracking-tight">Connect New API</p>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Enter API URL *
                      </label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          placeholder="https://api.yoursite.com/v1/users" 
                          className="w-full bg-surface-container-low border border-on-surface-variant/10 rounded-lg py-2.5 px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-tertiary/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    {/* Confirmation Checkbox */}
                    <div className="pt-2 flex items-start gap-3">
                      <div 
                        onClick={() => setIsConfirmed(!isConfirmed)}
                        className={`w-5 h-5 rounded border-2 mt-0.5 cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
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
                        className="text-[13px] text-on-surface cursor-pointer select-none leading-relaxed"
                      >
                        I am able to view the data from the Source.
                      </label>
                    </div>
                    
                    <button 
                      onClick={() => {
                        onAddSource(newUrl, extractSourceName(newUrl));
                        setNewUrl('');
                        setIsConfirmed(false);
                        setIsAdding(false);
                      }}
                      disabled={!isUrlValid || !isConfirmed}
                      className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
                        (isUrlValid && isConfirmed) 
                          ? 'bg-on-surface text-surface hover:opacity-90 active:scale-[0.98]' 
                          : 'bg-on-surface-variant/20 text-on-surface-variant cursor-not-allowed'
                      }`}
                    >
                      Add Data Source
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
