import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, HeartPulse, BrainCircuit, FileSpreadsheet, Settings, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onCloseMobile }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Patient Directory', path: '/patients', icon: <Users className="w-5 h-5" /> },
    { name: 'Scheduler', path: '/scheduler', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Live Telemetry', path: '/monitoring', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Predictive Insights', path: '/insights', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Reports Builder', path: '/reports', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className={cn(
      "w-64 border-r border-grid bg-paper flex flex-col h-full",
      className
    )}>
      {/* Branding Header */}
      <div className="h-16 flex items-center px-6 border-b border-grid">
        <NavLink 
          to="/" 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onCloseMobile}
        >
          <div className="p-1.5 rounded-lg bg-teal text-paper shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-ink tracking-wide font-display">
            CareScope<span className="text-teal">.</span>
          </span>
        </NavLink>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) => cn(
                "relative group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer select-none",
                isActive 
                  ? "text-paper" 
                  : "text-ink/75 hover:text-ink hover:bg-grid/30"
              )}
            >
              {/* Active Item Background Highlight Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-teal border-l-[3px] border-ink rounded-lg z-0"
                  transition={{ duration: 0.15 }}
                />
              )}

              {/* Icon */}
              <span className={cn(
                "relative z-10 transition-colors duration-150",
                isActive ? "text-paper" : "text-teal group-hover:text-ink"
              )}>
                {item.icon}
              </span>

              {/* Name */}
              <span className="relative z-10 font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Hackathon Badge */}
      <div className="p-4 border-t border-grid">
        <div className="bg-white rounded-lg p-3 text-center border border-grid">
          <span className="text-[10px] uppercase font-bold text-teal block tracking-widest font-display">
            Hackathon Submission
          </span>
          <span className="text-[11px] text-ink/65 mt-1 block font-mono">
            CareScope Frontend v1.0
          </span>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
