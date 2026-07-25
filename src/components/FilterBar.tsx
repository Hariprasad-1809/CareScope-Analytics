import React from 'react';
import { cn } from '../utils/cn';

interface FilterBarProps {
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDept,
  setSelectedDept,
  selectedStatus,
  setSelectedStatus
}) => {
  const departments = ['All', 'Cardiology', 'Oncology', 'ICU', 'Pediatrics', 'Neurology', 'Emergency', 'General'];
  const statuses = ['All', 'Stable', 'Critical', 'Recovering'];

  return (
    <div className="bg-white border border-grid rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      {/* Department Filter (Tabs style) */}
      <div className="flex flex-col space-y-1.5 text-left">
        <label className="text-[10px] font-bold text-ink/65 uppercase tracking-widest pl-1 font-display">
          Ward Department
        </label>
        <div className="flex flex-wrap gap-1.5">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer select-none font-display",
                selectedDept === dept
                  ? "bg-teal text-paper border-teal"
                  : "bg-paper text-ink/70 border-grid hover:border-teal hover:text-ink"
              )}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter (Pill style) */}
      <div className="flex flex-col space-y-1.5 text-left min-w-[150px]">
        <label className="text-[10px] font-bold text-ink/65 uppercase tracking-widest pl-1 font-display">
          Patient Status
        </label>
        <div className="flex gap-1.5">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer select-none font-display",
                selectedStatus === status
                  ? cn(
                      "text-paper border-transparent",
                      status === 'All' && 'bg-ink border-ink',
                      status === 'Stable' && 'bg-teal border-teal',
                      status === 'Critical' && 'bg-coral border-coral',
                      status === 'Recovering' && 'bg-teal border-teal'
                    )
                  : "bg-paper text-ink/70 border-grid hover:border-teal hover:text-ink"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FilterBar;
