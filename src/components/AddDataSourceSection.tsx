import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Database, Plus, MoreVertical, ExternalLink, Trash2, Search, Check, X } from 'lucide-react';
import { DataSource } from '../types';

const extractSourceName = (url: string) => {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    const lastPart = parts.pop();
    if (lastPart) {
      const base = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
      if (base.toLowerCase() === 'products') return 'WOOOYS Products';
      return base;
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
  canEdit: boolean;
  dataSources: DataSource[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
  onAddSource: (url: string, name: string) => void;
  onDeleteSource: (id: string) => void;
}

export default function AddDataSourceSection({
  isSourceOpen,
  setIsSourceOpen,
  canEdit,
  dataSources,
  selectedSourceId,
  onSelectSource,
  onAddSource,
  onDeleteSource
}: AddDataSourceSectionProps) {
  const [isAdding, setIsAdding] = useState(dataSources.length === 0);

  // Auto-show the form whenever all sources are deleted
  React.useEffect(() => {
    if (dataSources.length === 0) setIsAdding(true);
  }, [dataSources.length]);
  const [newUrl, setNewUrl] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const menuBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isUrlValid = newUrl.trim().length > 0;
  const selectedSource = dataSources.find(s => s.id === selectedSourceId);
  const canAddSource = isUrlValid && isConfirmed && previewData !== null && previewError === null;

  const handlePreviewData = async () => {
    if (!isUrlValid) return;
    setIsLoading(true);
    setPreviewError(null);
    setPreviewData(null);
    try {
      const response = await fetch(newUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-surface-container rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 lg:p-10 flex flex-col gap-3 sm:gap-4 lg:gap-8 shadow-sm transition-all duration-500">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsSourceOpen(!isSourceOpen)}
        role="button"
        aria-expanded={isSourceOpen}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsSourceOpen(!isSourceOpen); } }}
      >
        {/* Step badge */}
        <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-xs lg:text-sm text-on-surface shrink-0">
          1
        </div>

        {/* Title + subtitle — takes all remaining space */}
        <div className="flex-1 min-w-0">
          <h3 className="font-headline text-base lg:text-2xl font-extrabold text-on-surface group-hover:text-tertiary transition-colors leading-tight">
            Add Data Source
          </h3>
          <p className="text-xs lg:text-sm text-on-surface-variant font-medium mt-0.5 leading-tight">
            {!isSourceOpen && selectedSource
              ? <span className="inline-flex items-center gap-1 text-on-surface font-bold">
                  <svg className="w-3 h-3 text-on-surface shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {selectedSource.name}
                </span>
              : 'Get data to use in the chart'
            }
          </p>
        </div>

        {/* Chevron — right-aligned, never pushes title */}
        <div className="shrink-0">
          {isSourceOpen
            ? <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant" aria-hidden="true" />
          }
        </div>
      </div>

      {/* ── Expanded content ───────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isSourceOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-visible"
          >
            <div className="flex flex-col gap-4 pt-1">

              {/* ── Existing sources list ─────────────────────────────── */}
              {dataSources.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] lg:text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      Added Sources
                    </p>
                    {/* "Add another" toggle — lives here, not in the header */}
                    {canEdit && (
                      <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs lg:text-sm font-bold transition-all ${
                          isAdding
                            ? 'bg-surface-container-high text-on-surface-variant'
                            : 'bg-tertiary/10 text-tertiary hover:bg-tertiary/20'
                        }`}
                      >
                        {isAdding
                          ? <><X className="w-3 h-3" aria-hidden="true" /> Cancel</>
                          : <><Plus className="w-3 h-3" aria-hidden="true" /> Add</>
                        }
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {dataSources.map((source) => (
                      <div
                        key={source.id}
                        onClick={() => canEdit && onSelectSource(source.id)}
                        className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 transition-all ${
                          canEdit ? 'cursor-pointer' : 'cursor-default'
                        } ${
                          selectedSourceId === source.id
                            ? 'bg-tertiary/10 border-tertiary ring-1 ring-tertiary/20'
                            : 'bg-surface-container-low border-on-surface-variant/10 hover:border-tertiary/30'
                        }`}
                      >
                        {/* Custom radio */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            selectedSourceId === source.id
                              ? 'border-tertiary'
                              : 'border-on-surface-variant/40'
                          }`}
                          aria-hidden="true"
                        >
                          {selectedSourceId === source.id && (
                            <div className="w-2 h-2 rounded-full bg-tertiary" />
                          )}
                        </div>

                        {/* Icon */}
                        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                          <Database className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-tertiary" aria-hidden="true" />
                        </div>

                        {/* Name + URL — takes remaining space */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm lg:text-base font-bold text-on-surface truncate leading-tight">{source.name}</p>
                          <p className="text-xs lg:text-sm text-on-surface-variant font-mono truncate leading-tight mt-0.5">{source.url}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              const blob = new Blob([JSON.stringify(mockJsonData, null, 2)], { type: 'application/json' });
                              window.open(URL.createObjectURL(blob), '_blank');
                            }}
                            aria-label={`View data for ${source.name}`}
                            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 lg:w-4 lg:h-4" aria-hidden="true" />
                          </button>

                          <div className="relative">
                            <button
                              ref={(el) => { menuBtnRefs.current[source.id] = el; }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (openMenuId === source.id) {
                                  setOpenMenuId(null);
                                  setMenuPos(null);
                                } else {
                                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                  setMenuPos({
                                    top: rect.bottom + 6,
                                    right: window.innerWidth - rect.right,
                                  });
                                  setOpenMenuId(source.id);
                                }
                              }}
                              aria-label={`More options for ${source.name}`}
                              aria-expanded={openMenuId === source.id}
                              aria-haspopup="menu"
                              className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface-variant/10 transition-all"
                            >
                              <MoreVertical className="w-3.5 h-3.5 lg:w-4 lg:h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Add new source form ───────────────────────────────── */}
              <AnimatePresence initial={false}>
                {isAdding && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={`flex flex-col gap-3 pt-3 ${dataSources.length > 0 ? 'border-t border-on-surface-variant/8' : ''}`}>

                      <p className="text-sm lg:text-base font-bold text-on-surface">Fetch data from API</p>

                      {/* URL input */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="api-url-input" className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          API URL *
                        </label>
                        <input
                          id="api-url-input"
                          type="text"
                          value={newUrl}
                          onChange={(e) => canEdit && setNewUrl(e.target.value)}
                          placeholder="https://api.yoursite.com/v1/data"
                          disabled={!canEdit}
                          className="w-full bg-surface-container-low border border-on-surface-variant/15 rounded-xl py-2.5 px-3 text-sm lg:text-base text-on-surface placeholder:text-placeholder focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary outline-none transition-all disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Fetch button */}
                      <button
                        onClick={handlePreviewData}
                        disabled={!isUrlValid || isLoading || !canEdit}
                        className={`w-full sm:w-auto self-start flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm lg:text-base font-bold border transition-all ${
                          isUrlValid && !isLoading && canEdit
                            ? 'border-tertiary/50 text-tertiary bg-tertiary/5 hover:bg-tertiary/10 active:scale-[0.98]'
                            : 'border-on-surface-variant/15 text-disabled-text bg-surface-container-low cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin shrink-0" aria-hidden="true" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            Check if data is fetched
                          </>
                        )}
                      </button>

                      {/* JSON preview */}
                      {(previewData !== null || previewError !== null) && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                            Data Preview
                          </p>
                          <div className="bg-surface-container-highest border border-on-surface-variant/10 rounded-xl p-3 max-h-[140px] overflow-y-auto minimal-scrollbar">
                            {previewError ? (
                              <p className="text-red-400 text-xs font-mono">Error: {previewError}</p>
                            ) : (
                              <pre className="text-xs text-on-surface font-mono whitespace-pre-wrap leading-relaxed">
                                {JSON.stringify(previewData, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ── Custom checkbox ─────────────────────────────── */}
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isConfirmed}
                        disabled={!previewData || !canEdit}
                        onClick={() => canEdit && previewData && setIsConfirmed(!isConfirmed)}
                        className={`flex items-start gap-3 text-left w-full transition-all disabled:cursor-not-allowed ${
                          !previewData || !canEdit ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Box */}
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            isConfirmed
                              ? 'bg-tertiary border-tertiary'
                              : 'border-on-surface-variant/40 bg-surface-container-low'
                          }`}
                          aria-hidden="true"
                        >
                          {isConfirmed && <Check className="w-3 h-3 text-surface" strokeWidth={3} />}
                        </span>
                        <span className={`text-sm lg:text-base leading-snug select-none ${
                          previewData && canEdit ? 'text-on-surface' : 'text-disabled-text'
                        }`}>
                          I can view the data fetched from the source
                        </span>
                      </button>

                      {/* Submit button — full width on mobile, hug on desktop */}
                      <button
                        onClick={() => {
                          onAddSource(newUrl, extractSourceName(newUrl));
                          setNewUrl('');
                          setIsConfirmed(false);
                          setPreviewData(null);
                          setPreviewError(null);
                          setIsAdding(false);
                        }}
                        disabled={!canAddSource || !canEdit}
                        className={`w-full sm:w-auto self-end px-8 py-3 rounded-xl font-bold text-sm lg:text-base uppercase tracking-widest transition-all ${
                          canAddSource && canEdit
                            ? 'bg-on-surface text-surface hover:opacity-90 active:scale-[0.98] shadow-lg'
                            : 'bg-disabled-bg text-disabled-text cursor-not-allowed'
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

      {/* ── Fixed-position dropdown portal — escapes all overflow clipping ── */}
      <AnimatePresence>
        {openMenuId && menuPos && (
          <>
            <div
              className="fixed inset-0 z-[199]"
              onClick={() => { setOpenMenuId(null); setMenuPos(null); }}
              aria-hidden="true"
            />
            <motion.div
              role="menu"
              aria-label="Source options"
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              style={{ top: menuPos.top, right: menuPos.right }}
              className="fixed w-36 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-[200]"
              onKeyDown={(e) => { if (e.key === 'Escape') { setOpenMenuId(null); setMenuPos(null); } }}
            >
              <button
                role="menuitem"
                onClick={() => {
                  const id = openMenuId;
                  setOpenMenuId(null);
                  setMenuPos(null);
                  canEdit && onDeleteSource(id);
                }}
                disabled={!canEdit}
                className="w-full flex items-center gap-2 px-3 py-3 text-sm lg:text-base font-bold text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
