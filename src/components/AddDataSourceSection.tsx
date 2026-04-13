import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Database, Plus, MoreVertical, ExternalLink, Trash2, Search } from 'lucide-react';
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
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isUrlValid = newUrl.trim().length > 0;
  const selectedSource = dataSources.find(s => s.id === selectedSourceId);
  const sourceNameHint = selectedSource ? selectedSource.name : "None selected";
  const canAddSource = isUrlValid && isConfirmed && previewData !== null && previewError === null;

  const handlePreviewData = async () => {
    if (!isUrlValid) return;
    
    setIsLoading(true);
    setPreviewError(null);
    setPreviewData(null);
    
    try {
      const response = await fetch(newUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-surface-container rounded-[2rem] p-4 lg:p-10 flex flex-col gap-4 lg:gap-10 shadow-sm transition-all duration-500">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsSourceOpen(!isSourceOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-sm text-on-surface">1</div>
          <div className="flex flex-col">
            <h3 className="font-headline text-xl font-extrabold text-on-surface group-hover:text-tertiary transition-colors leading-tight">Add Data Source</h3>
            {!isSourceOpen && selectedSource && (
              <p className="text-sm font-medium text-on-surface-variant/40 uppercase tracking-wider">
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
              className={`${isAdding ? 'bg-tertiary text-surface' : 'bg-on-surface-variant/10 text-on-surface hover:bg-on-surface-variant/20'} px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all outline-none`}
            >
              <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
              {isAdding ? 'Cancel' : 'Add Source'}
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
            className="overflow-visible pb-4"
          >
            <div className="space-y-3 pt-3">
              {/* Added Data Source Container */}
              {dataSources.length > 0 && (
                <div className="space-y-4">
                  <p className="font-body text-sm font-bold text-on-surface-variant uppercase tracking-widest">Added Data Source</p>
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
                              <span className="text-base font-bold text-on-surface">{source.name}</span>
                              <span className="text-sm text-on-surface-variant font-mono truncate max-w-[150px]">
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
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 rounded-lg text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors outline-none"
                          >
                            <ExternalLink className="w-4 h-4" />
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
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors text-left"
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
                    className="space-y-3 pt-3 border-t border-on-surface-variant/5"
                  >
                    <p className="font-body text-sm font-bold text-on-surface tracking-tight">Connect New API</p>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Enter API URL *
                      </label>
                      <input 
                        type="text" 
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://api.yoursite.com/v1/users" 
                        className="w-full bg-surface-container-low border border-on-surface-variant/10 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-tertiary/20 transition-all outline-none leading-normal"
                      />
                      <button
                        onClick={handlePreviewData}
                        disabled={!isUrlValid || isLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all
                          ${(isUrlValid && !isLoading)
                            ? 'border-tertiary/40 text-tertiary hover:bg-tertiary/10 active:scale-95'
                            : 'border-on-surface-variant/10 text-on-surface-variant/30 cursor-not-allowed'
                          }`}
                      >
                        {isLoading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" />
                          Check if data is fetched
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* JSON Preview Container */}
                    {(previewData !== null || previewError !== null) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          Data Preview
                        </label>
                        <div className="bg-surface-container-highest border border-on-surface-variant/10 rounded-xl p-3 max-h-[160px] overflow-y-auto">
                          {previewError ? (
                            <div className="text-red-400 text-xs font-mono">Error: {previewError}</div>
                          ) : (
                            <pre className="text-xs text-on-surface font-mono whitespace-pre-wrap leading-normal">
                              {JSON.stringify(previewData, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Confirmation Checkbox */}
                    <div className="flex items-start gap-2.5">
                      <div 
                        onClick={() => previewData && setIsConfirmed(!isConfirmed)}
                        className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all flex-shrink-0 ${
                          !previewData
                            ? 'border-on-surface-variant/15 bg-on-surface-variant/5 cursor-not-allowed opacity-40'
                            : isConfirmed
                              ? 'bg-tertiary border-tertiary cursor-pointer'
                              : 'border-on-surface-variant/30 hover:border-tertiary cursor-pointer'
                        }`}
                      >
                        {isConfirmed && (
                          <svg className="w-3 h-3 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label 
                        onClick={() => previewData && setIsConfirmed(!isConfirmed)}
                        className={`text-sm select-none leading-normal transition-colors ${previewData ? 'text-on-surface cursor-pointer' : 'text-on-surface-variant/40 cursor-not-allowed'}`}
                      >
                        I can view the data fetched from the Source
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          onAddSource(newUrl, extractSourceName(newUrl));
                          setNewUrl('');
                          setIsConfirmed(false);
                          setPreviewData(null);
                          setPreviewError(null);
                          setIsAdding(false);
                        }}
                        disabled={!canAddSource}
                        className={`px-10 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg
                          ${canAddSource 
                            ? 'bg-on-surface text-surface hover:opacity-90 hover:shadow-xl active:scale-[0.97]' 
                            : 'bg-on-surface-variant/20 text-on-surface-variant/50 cursor-not-allowed shadow-none'
                          }`}
                      >
                        Add Data Source
                      </button>
                    </div>
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
