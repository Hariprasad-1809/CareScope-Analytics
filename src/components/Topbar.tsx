import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useCareStore } from '../store/useCareStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme, activityLogs, searchQuery, setSearchQuery } = useCareStore();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter alerts for notification panel
  const alerts = activityLogs
    .filter(log => log.type === 'alert' || log.severity === 'critical' || log.severity === 'high')
    .slice(0, 5);

  const handleNotificationClick = (patientId?: string) => {
    setShowNotifications(false);
    if (patientId) {
      navigate(`/patients/${patientId}`);
    }
  };

  return (
    <header className="h-16 border-b border-grid bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Bar / Left Block */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <button 
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg border border-grid bg-paper text-teal hover:text-ink cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-ink/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, alerts, resources..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-paper border border-grid rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:ring-1 focus:ring-teal focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 border border-grid rounded-lg bg-paper hover:bg-grid/35 text-teal hover:text-ink cursor-pointer transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 border border-grid rounded-lg bg-paper hover:bg-grid/35 text-teal hover:text-ink cursor-pointer transition-colors relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-coral text-[9px] font-bold text-paper items-center justify-center font-mono">
                  {alerts.length}
                </span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop Click Dismiss */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-80 rounded-lg border border-grid bg-white shadow-md z-50 overflow-hidden"
                >
                  <div className="p-3.5 border-b border-grid flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink font-display">Critical Alerts Feed</span>
                    {alerts.length > 0 && (
                      <span className="text-[10px] bg-coral/15 text-coral font-bold px-2 py-0.5 rounded font-mono">
                        {alerts.length} Active
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-grid">
                    {alerts.length > 0 ? (
                      alerts.map((log) => (
                        <div
                          key={log.id}
                          onClick={() => handleNotificationClick(log.patientId)}
                          className={cn(
                            "p-3.5 hover:bg-paper/50 transition-colors cursor-pointer text-left text-xs",
                            log.severity === 'critical' ? 'bg-coral/5' : 'bg-transparent'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn(
                              "font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded font-mono",
                              log.severity === 'critical' ? 'bg-coral/15 text-coral' : 'bg-warning-amber/15 text-warning-amber'
                            )}>
                              {log.severity}
                            </span>
                            <span className="text-[9px] text-ink/60 font-mono">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-ink font-medium leading-normal">{log.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-ink/65 text-xs">
                        No critical alerts currently triggered.
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-2.5 border-l border-grid pl-4 h-8 select-none">
          <div className="h-8 w-8 rounded-full bg-teal flex items-center justify-center text-paper font-bold text-sm shadow-sm font-display">
            JD
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-ink leading-tight font-display">Dr. John Doe</span>
            <span className="text-[10px] text-ink/75 leading-none">General Surgery</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Topbar;
