import React from 'react';
import { MoreVertical, Database, Layout, Calendar } from 'lucide-react';
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
  image,
  className = '',
  onClick
}) => {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={`bg-surface-container rounded-xl p-6 flex flex-col group hover:bg-surface-container-high transition-all duration-300 relative overflow-hidden ${className}`}
    >
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Calendar className="w-4 h-4" />
          <span className="font-body text-[10px] font-medium tracking-tight uppercase">{editedAt}</span>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface p-1 transition-colors rounded-md hover:bg-surface-container-highest">
          <MoreVertical className="w-4 h-4" />
        </button>
      </header>

      <div className="mb-8">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-1 tracking-tight">{title}</h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-on-surface-variant/5 flex items-center gap-3">
        {dataCount !== undefined && (
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-on-surface-variant/10 px-3 py-1.5 rounded-md">
            <Database className="w-3.5 h-3.5 text-on-surface" />
            <span className="text-xs font-bold text-on-surface">{dataCount} Data</span>
          </div>
        )}
        {dashboardCount !== undefined && (
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-on-surface-variant/10 px-3 py-1.5 rounded-md">
            <Layout className="w-3.5 h-3.5 text-on-surface" />
            <span className="text-xs font-bold text-on-surface">{dashboardCount} Dashboard</span>
          </div>
        )}
      </div>

      {isActive && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none"></div>
      )}
    </motion.article>
  );
};

export default BentoCard;
