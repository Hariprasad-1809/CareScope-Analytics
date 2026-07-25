import React from 'react';
import { cn } from '../utils/cn';

interface AlertBadgeProps {
  status: 'Stable' | 'Critical' | 'Recovering' | 'low' | 'medium' | 'high' | 'critical' | string;
  className?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ status, className }) => {
  const normalizedStatus = status.toLowerCase();

  const config: Record<string, { bg: string; text: string; label: string; animate?: boolean }> = {
    stable: { bg: 'bg-teal border border-teal', text: 'text-paper', label: 'Stable' },
    recovering: { bg: 'bg-teal/70 border border-teal/70', text: 'text-paper', label: 'Recovering' },
    critical: { bg: 'bg-coral border border-coral', text: 'text-paper', label: 'Critical', animate: true },
    low: { bg: 'bg-grid border border-grid', text: 'text-ink/80', label: 'Low' },
    medium: { bg: 'bg-grid border border-grid', text: 'text-ink/85', label: 'Medium' },
    high: { bg: 'bg-coral border border-coral', text: 'text-paper', label: 'High', animate: true },
  };

  const current = config[normalizedStatus] || { 
    bg: 'bg-grid border border-grid', 
    text: 'text-ink/80', 
    label: status 
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide select-none font-display",
        current.bg,
        current.text,
        className
      )}
    >
      {current.animate && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
        </span>
      )}
      {current.label}
    </span>
  );
};
export default AlertBadge;
