import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Syringe, Clipboard, UserPlus, LogOut, Activity } from 'lucide-react';
import type { MedicalHistoryItem } from '../types';
import { cn } from '../utils/cn';

interface TimelineProps {
  events: MedicalHistoryItem[];
  layout?: 'vertical' | 'horizontal';
}

export const Timeline: React.FC<TimelineProps> = ({ events, layout = 'vertical' }) => {
  const getEventIcon = (type: MedicalHistoryItem['eventType']) => {
    switch (type) {
      case 'Admission':
        return <UserPlus className="w-4 h-4" />;
      case 'Discharge':
        return <LogOut className="w-4 h-4" />;
      case 'Surgery':
        return <Activity className="w-4 h-4" />;
      case 'Diagnosis':
        return <Clipboard className="w-4 h-4" />;
      case 'Treatment':
        return <Syringe className="w-4 h-4" />;
      case 'Medication Change':
        return <FileText className="w-4 h-4" />;
      default:
        return <Clipboard className="w-4 h-4" />;
    }
  };

  const getEventStyles = (type: MedicalHistoryItem['eventType']) => {
    switch (type) {
      case 'Admission':
        return 'bg-teal/10 text-teal border border-teal/30';
      case 'Discharge':
        return 'bg-teal/10 text-teal border border-teal/30';
      case 'Surgery':
        return 'bg-coral/10 text-coral border border-coral/30';
      case 'Diagnosis':
        return 'bg-cyan/15 text-teal border border-cyan/40';
      case 'Treatment':
        return 'bg-teal/10 text-teal border border-teal/30';
      case 'Medication Change':
        return 'bg-cyan/15 text-teal border border-cyan/40';
      default:
        return 'bg-grid/20 text-ink/75 border border-grid';
    }
  };

  if (layout === 'horizontal') {
    return (
      <div className="relative flex items-start overflow-x-auto pb-6 pt-4 px-2 space-x-8 scrollbar-thin">
        {/* Horizontal Connector Line */}
        <div className="absolute top-[28px] left-0 right-0 h-0.5 bg-grid z-0" />
        
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className="flex-shrink-0 w-72 relative z-10"
          >
            <div className="flex flex-col items-center text-center">
              {/* Event Circle */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-150",
                getEventStyles(event.eventType)
              )}>
                {getEventIcon(event.eventType)}
              </div>
              
              {/* Content Panel */}
              <div className="bg-white border border-grid rounded-lg p-4 w-full text-left shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-ink/60 block mb-1 font-mono">
                  {event.date} • {event.eventType}
                </span>
                <h5 className="text-sm font-semibold text-ink truncate font-display">{event.title}</h5>
                <p className="text-xs text-ink/70 mt-1 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-grid">
                  <span className="text-[10px] text-ink/65">Dr. {event.doctor.split(' ').pop()}</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded font-bold font-mono",
                    event.status === 'Completed' && 'bg-teal/10 text-teal',
                    event.status === 'Ongoing' && 'bg-cyan/15 text-teal',
                    event.status === 'Scheduled' && 'bg-grid/40 text-ink/75'
                  )}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Vertical Layout (Default)
  return (
    <div className="relative pl-6 md:pl-8 space-y-6">
      {/* Vertical Connector Line */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.5 }}
        className="absolute left-[15px] md:left-[23px] top-3 w-0.5 bg-grid z-0"
      />

      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.25 }}
          className="relative z-10 flex items-start"
        >
          {/* Timeline Node Icon */}
          <div className={cn(
            "absolute left-[-22px] md:left-[-15px] translate-x-[-50%] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
            getEventStyles(event.eventType)
          )}>
            {getEventIcon(event.eventType)}
          </div>

          {/* Event Details Card */}
          <div className="bg-white border border-grid rounded-lg p-4 ml-6 flex-1 hover:border-teal transition-all duration-150 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <span className="text-[11px] font-bold text-ink/60 uppercase tracking-wide font-mono">
                {event.date} • {event.eventType}
              </span>
              <span className={cn(
                "self-start sm:self-auto text-[10px] px-2 py-0.5 rounded font-bold font-mono",
                event.status === 'Completed' && 'bg-teal/10 text-teal',
                event.status === 'Ongoing' && 'bg-cyan/15 text-teal',
                event.status === 'Scheduled' && 'bg-grid/40 text-ink/75'
              )}>
                {event.status}
              </span>
            </div>

            <h5 className="text-sm md:text-base font-semibold text-ink font-display">{event.title}</h5>
            <p className="text-xs md:text-sm text-ink/75 mt-2 leading-relaxed">{event.description}</p>

            <div className="flex items-center space-x-4 mt-4 pt-2 border-t border-grid text-xs text-ink/60">
              <span>Physician: <strong className="text-ink font-semibold">{event.doctor}</strong></span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
export default Timeline;
