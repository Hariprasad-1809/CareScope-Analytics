import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface ChartWidgetProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'teal';
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  description,
  children,
  actions,
  className,
  glowColor: _glowColor = 'blue',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "bg-white border border-grid rounded-lg p-5 relative flex flex-col min-h-[300px] transition-colors duration-150 hover:border-teal",
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-base font-semibold text-ink tracking-wide font-display">{title}</h4>
          {description && (
            <p className="text-xs text-ink/70 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative min-h-[220px] select-none">
        {children}
      </div>
    </motion.div>
  );
};
export default ChartWidget;
