import { BarChart3, PieChart, Activity } from 'lucide-react';

interface ChartPlaceholderProps {
  type: 'main' | 'distribution' | 'comparative';
  title?: string;
  className?: string;
}

export default function ChartPlaceholder({ type, title, className = '' }: ChartPlaceholderProps) {
  const icons = {
    main: Activity,
    distribution: PieChart,
    comparative: BarChart3,
  };
  
  const Icon = icons[type];
  
  return (
    <div className={`bg-surface-container/30 border-2 border-dashed border-outline-variant/30 rounded-xl relative overflow-hidden group flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Icon className="w-10 h-10 text-neutral-700 group-hover:text-tertiary/40 transition-colors mx-auto" />
        <p className="text-xs text-neutral-600 mt-2 font-medium">{title || type.charAt(0).toUpperCase() + type.slice(1)}</p>
      </div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    </div>
  );
}
