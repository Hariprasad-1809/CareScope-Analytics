import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCareStore } from './store/useCareStore';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { PatientDirectory } from './pages/PatientDirectory';
import { PatientProfile } from './pages/PatientProfile';
import { AppointmentScheduler } from './pages/AppointmentScheduler';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { PredictiveInsights } from './pages/PredictiveInsights';
import { ReportsBuilder } from './pages/ReportsBuilder';
import { Settings } from './pages/Settings';
import { PulseLine } from './components/PulseLine';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile navigation sidebar automatically on route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper text-ink font-sans grid-bg select-none pt-[18px]">
      <PulseLine />
      {/* Sidebar - Desktop Layout */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop Blur screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer side sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 lg:hidden shadow-2xl"
            >
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        {/* Scrollable Viewport Wrapper */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full h-full max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export function App() {
  const { setTheme, theme } = useCareStore();

  // Sync stored dark/light theme setting on mounting
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientDirectory />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/scheduler" element={<AppointmentScheduler />} />
          <Route path="/monitoring" element={<LiveMonitoring />} />
          <Route path="/insights" element={<PredictiveInsights />} />
          <Route path="/reports" element={<ReportsBuilder />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
