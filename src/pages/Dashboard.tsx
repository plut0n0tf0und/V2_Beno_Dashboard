import { MoreVertical, Filter, Share2, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  chartName: string;
}

export default function Dashboard({ chartName }: DashboardProps) {
  const data = [
    { label: 'Air Fresheners', value: 45, color: 'bg-tertiary/20' },
    { label: 'Home Fragrance', value: 70, color: 'bg-tertiary/40' },
    { label: 'Decoratives', value: 30, color: 'bg-tertiary/10' },
    { label: 'Candles', value: 85, color: 'bg-tertiary/60' },
    { label: 'Personal Care', value: 55, color: 'bg-tertiary/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold font-headline text-primary">Dashboard</h1>
        <div className="flex gap-3">
          <button className="bg-surface-container text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container-high transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filter
          </button>
          <button className="bg-surface-container text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container-high transition-all flex items-center gap-2">
            <Share2 className="w-4 h-4" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-8 flex-1 flex flex-col relative min-h-[500px]">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary tracking-tight">{chartName}</h2>
            <p className="text-sm text-on-surface-variant mt-1">Volume by Category Distribution</p>
          </div>
          <button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant">
            <MoreVertical className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 flex items-end justify-between gap-4 pb-12">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${item.value}%` }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                className={`w-full bg-surface-container-highest rounded-t-lg relative group-hover:brightness-110 transition-all`}
              >
                <div className={`absolute inset-0 ${item.color} rounded-t-lg`}></div>
                <div className="absolute bottom-0 inset-x-0 bg-tertiary h-1 rounded-full"></div>
              </motion.div>
              <span className="text-xs text-on-surface-variant text-center rotate-[-45deg] origin-top-right translate-y-4 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-32">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface-container rounded-xl border border-dashed border-white/5 flex flex-col items-center justify-center text-on-surface-variant hover:border-white/10 transition-all cursor-pointer group">
            <PlusCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add Metric Slot</span>
          </div>
        ))}
      </div>
    </div>
  );
}
