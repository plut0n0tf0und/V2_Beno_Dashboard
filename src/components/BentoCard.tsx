import React from 'react';
import { MoreVertical } from 'lucide-react';
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
  const meta = [
    dashboardCount !== undefined && `${dashboardCount} Dashboard${dashboardCount !== 1 ? 's' : ''}`,
    dataCount !== undefined && `${dataCount} Data`,
    editedAt,
  ].filter(Boolean).join(' · ');

  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`bg-surface-container rounded-2xl p-5 sm:p-6 flex flex-col gap-3 group hover:bg-surface-container-high active:bg-surface-container-high transition-all duration-200 relative overflow-hidden cursor-pointer border border-on-surface-variant/5 shadow-sm ${className}`}
    >
      {/* Top row: metadata + 3-dot */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-wider truncate">
          {meta}
        </span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-on-surface-variant hover:text-on-surface p-1 -mr-1 transition-colors rounded-md hover:bg-surface-container-highest flex-shrink-0"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-headline text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-tight line-clamp-1">
        {title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm sm:text-base text-on-surface-variant leading-normal line-clamp-2">
        {description}
      </p>

      {/* Active glow */}
      {isActive && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
      )}
    </motion.article>
  );
};

export default BentoCard;
