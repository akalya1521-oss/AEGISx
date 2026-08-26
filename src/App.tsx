import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IntelligenceProvider } from './context/IntelligenceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Investigations } from './pages/Investigations';
import { NetworkAnalysis } from './pages/NetworkAnalysis';
import { Entities } from './pages/Entities';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';

// Global Modals & Toasts
import { EntityDetailDrawer } from './components/EntityDetailDrawer';
import { AlertDetailModal } from './components/AlertDetailModal';
import { CaseDetailModal } from './components/CaseDetailModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { NewInvestigationModal } from './components/NewInvestigationModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationToast } from './components/NotificationToast';

import './styles/global.css';

const AppContent: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Layout */}
      <div className="app-main-layout">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              width: '100vw',
              height: 'calc(100vh - 64px)',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 850
            }}
          />
        )}

        {/* Left Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigations" element={<Investigations />} />
            <Route path="/network-analysis" element={<NetworkAnalysis />} />
            <Route path="/entities" element={<Entities />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <EntityDetailDrawer />
      <AlertDetailModal />
      <CaseDetailModal />
      <ReportDetailModal />
      <NewInvestigationModal />
      <GlobalSearchModal />
      <NotificationToast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <IntelligenceProvider>
      <Router>
        <AppContent />
      </Router>
    </IntelligenceProvider>
  );
};

export default App;
