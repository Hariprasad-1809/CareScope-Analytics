import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string | number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  glowColor?: 'blue' | 'teal' | 'red' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  description,
  glowColor = 'blue',
}) => {
  const borderStyles = {
    blue: 'hover:border-teal',
    teal: 'hover:border-teal',
    red: 'hover:border-coral',
    green: 'hover:border-teal',
  };

  const bgStyles = {
    blue: 'bg-teal/10 text-teal',
    teal: 'bg-teal/10 text-teal',
    red: 'bg-coral/10 text-coral',
    green: 'bg-teal/10 text-teal',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "bg-white border border-grid rounded-lg p-5 relative overflow-hidden transition-all duration-150",
        borderStyles[glowColor]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink/70 font-display">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-ink font-mono">{value}</h3>
        </div>
        <div className={cn("p-2.5 rounded-lg transition-colors duration-150", bgStyles[glowColor])}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {change && (
          <div className="flex items-center space-x-1">
            {changeType === 'increase' && (
              <span className="flex items-center text-xs font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded font-mono">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                {change}
              </span>
            )}
            {changeType === 'decrease' && (
              <span className="flex items-center text-xs font-semibold text-coral bg-coral/10 px-2 py-0.5 rounded font-mono">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                {change}
              </span>
            )}
            {changeType === 'neutral' && (
              <span className="text-xs font-semibold text-ink/60 bg-grid/35 px-2 py-0.5 rounded font-mono">
                {change}
              </span>
            )}
          </div>
        )}
        {description && (
          <span className="text-xs text-ink/60 ml-auto">{description}</span>
        )}
      </div>
    </motion.div>
  );
};
export default StatCard;
