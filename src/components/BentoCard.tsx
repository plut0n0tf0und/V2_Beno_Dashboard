import React from 'react';
import { MoreVertical, Layout, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface BentoCardProps {
  title: string;
  description: string;
  editedAt: string;
  dataCount?: number;
  dashboardCount?: number;
  isActive?: boolean;
  image?: string;
  className?: string;
  onClick?: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  editedAt,
  dataCount,
  dashboardCount,
  isActive,
  className = '',
  onClick
}) => {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`bg-surface-container rounded-2xl p-6 flex flex-col gap-4 group hover:bg-surface-container-high active:bg-surface-container-high transition-all duration-300 relative overflow-hidden cursor-pointer border border-on-surface-variant/5 shadow-sm hover:shadow-xl hover:shadow-tertiary/5 ${className}`}
    >
      {/* Top row: metadata + 3-dot */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-[0.15em] truncate">
          {editedAt}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label={`More options for ${title}`}
          className="text-on-surface-variant hover:text-on-surface p-1.5 -mr-1.5 transition-colors rounded-lg hover:bg-surface-container-highest flex-shrink-0"
        >
          <MoreVertical className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* Title */}
        <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight leading-tight line-clamp-1 group-hover:text-tertiary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Stats Footer */}
      {(dashboardCount !== undefined || dataCount !== undefined) && (
        <div className="mt-auto pt-4 flex items-center gap-4 border-t border-on-surface-variant/10">
          {dashboardCount !== undefined && (
            <div className="flex items-center gap-2 group/stat">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-on-surface-variant/10 text-on-surface-variant transition-transform group-hover/stat:scale-110">
                <Layout className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-on-surface tracking-tight leading-none">{dashboardCount}</span>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mt-0.5">Dashboards</span>
              </div>
            </div>
          )}
          {dataCount !== undefined && (
            <div className="flex items-center gap-2 group/stat">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-on-surface-variant/10 text-on-surface-variant transition-transform group-hover/stat:scale-110">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-on-surface tracking-tight leading-none">{dataCount}</span>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mt-0.5">Data</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active glow */}
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
      )}
    </motion.article>
  );
};

export default BentoCard;
