import React, { useState } from 'react';
import { useCareStore } from '../store/useCareStore';
import { Button } from '../components/ui/Button';
import { Sun, Moon, ShieldCheck, RefreshCw, User, Bell, HelpCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme, clearActivityLogs } = useCareStore();
  
  // Notification States
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyScheduler, setNotifyScheduler] = useState(true);

  // Storage wipe
  const [wipeSuccess, setWipeSuccess] = useState(false);

  const handleWipeStorage = () => {
    localStorage.removeItem('carescope-storage');
    setWipeSuccess(true);
    setTimeout(() => {
      setWipeSuccess(false);
      window.location.reload(); // Reload to restore original datasets
    }, 1500);
  };

  const handleClearTelemetryLogs = () => {
    clearActivityLogs();
    alert("Live activity alarms and logs cleared.");
  };

  return (
    <div className="space-y-6 pb-12 text-left max-w-4xl">
      {/* Page Header */}
      <div className="border-b border-grid pb-4">
        <h2 className="text-2xl font-bold text-ink tracking-wide font-display">System Settings</h2>
        <p className="text-xs text-ink/75 mt-1">
          Adjust theme preferences, customize alarm thresholds, and review clinical configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left column: User Credentials Card */}
        <section className="bg-white border border-grid rounded-lg p-5 shadow-sm space-y-4">
          <h5 className="text-sm font-semibold text-ink border-b border-grid pb-2 flex items-center font-display">
            <User className="w-4 h-4 mr-1.5 text-teal" /> User Profile
          </h5>
          
          <div className="text-center py-4 space-y-2">
            <div className="h-16 w-16 mx-auto rounded-lg bg-teal flex items-center justify-center text-paper font-bold text-2xl select-none font-display">
              JD
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-ink text-base font-display">Dr. John Doe</h4>
              <span className="text-xs text-ink/65 font-semibold font-display">Chief Surgeon • General Surgery</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-ink/70 pt-2 border-t border-grid">
            <div className="flex justify-between">
              <span>Access Level:</span>
              <strong className="text-ink font-semibold font-display">Administrator</strong>
            </div>
            <div className="flex justify-between">
              <span>Hospital Node:</span>
              <strong className="text-ink font-semibold font-display">CareScope Sector 4</strong>
            </div>
            <div className="flex justify-between">
              <span>Terminal ID:</span>
              <span className="font-mono text-ink font-bold">CS-7294-A</span>
            </div>
          </div>
        </section>

        {/* Right column: Config settings lists */}
        <section className="md:col-span-2 space-y-6">
          {/* Theme Option */}
          <div className="bg-white border border-grid rounded-lg p-5 shadow-sm space-y-4">
            <h5 className="text-sm font-semibold text-ink border-b border-grid pb-2 flex items-center font-display">
              <Sun className="w-4.5 h-4.5 mr-1.5 text-teal" /> Interface Theme
            </h5>
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-ink font-display">Default Aesthetic</span>
                <p className="text-ink/65 mt-1">CareScope is optimized for clean paper-ink styling. Toggle to switch styles.</p>
              </div>
              
              <button
                onClick={toggleTheme}
                className="px-4 py-2 border border-grid rounded-lg bg-paper hover:bg-grid/25 text-ink flex items-center space-x-1.5 cursor-pointer transition-all font-display font-bold"
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-teal" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-teal" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alarm limits / Alerts Options */}
          <div className="bg-white border border-grid rounded-lg p-5 shadow-sm space-y-4">
            <h5 className="text-sm font-semibold text-ink border-b border-grid pb-2 flex items-center font-display">
              <Bell className="w-4.5 h-4.5 mr-1.5 text-teal" /> Telemetry Warnings & Notifications
            </h5>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-grid pb-2">
                <div>
                  <span className="font-bold text-ink block font-display">Critical Vitals Alarms</span>
                  <p className="text-ink/65 mt-0.5">Trigger live sound tickers and panel alarms if patient oxygen saturation drops below 92%.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyCritical}
                  onChange={(e) => setNotifyCritical(e.target.checked)}
                  className="rounded bg-paper border-grid text-teal focus:ring-teal h-4 w-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-b border-grid pb-2">
                <div>
                  <span className="font-bold text-ink block font-display">Scheduler Confirmation Logs</span>
                  <p className="text-ink/65 mt-0.5">Create warning log traces in the top notification dropdown when bookings are scheduled or cancelled.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyScheduler}
                  onChange={(e) => setNotifyScheduler(e.target.checked)}
                  className="rounded bg-paper border-grid text-teal focus:ring-teal h-4 w-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-1">
                <div>
                  <span className="font-bold text-ink block font-display">Clear Active Notifications Feed</span>
                  <p className="text-ink/65 mt-0.5">Delete all recent activity log entries and alerts from the current dashboard workspace.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleClearTelemetryLogs} className="text-[10px] select-none">
                  Wipe Alarms
                </Button>
              </div>
            </div>
          </div>

          {/* Developer / Storage reset */}
          <div className="bg-white border border-grid rounded-lg p-5 shadow-sm space-y-4">
            <h5 className="text-sm font-semibold text-ink border-b border-grid pb-2 flex items-center font-display">
              <HelpCircle className="w-4.5 h-4.5 mr-1.5 text-coral" /> Developer Sandbox Settings
            </h5>
            
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-ink font-display">Wipe Local Database Cache</span>
                <p className="text-ink/65 mt-1">Clears all custom scheduler bookings, vitals records, and restore original mock datasets.</p>
              </div>
              
              <Button 
                onClick={handleWipeStorage} 
                disabled={wipeSuccess} 
                variant="danger" 
                size="sm"
                className="shrink-0 select-none"
              >
                {wipeSuccess ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Wiping cache...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Restore Mock Data
                  </>
                )}
              </Button>
            </div>
            {wipeSuccess && (
              <div className="p-3 bg-teal/10 border border-teal/20 text-teal rounded-lg text-xs flex items-center space-x-2 font-mono">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Cache cleared successfully. Reloading data modules...</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Settings;
