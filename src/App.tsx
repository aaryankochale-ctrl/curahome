import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthPage } from './components/auth/AuthPage';
import { Navbar } from './components/layout/Navbar';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { NurseDashboard } from './components/nurse/NurseDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { NewServiceRequestModal } from './components/patient/NewServiceRequestModal';
import { NurseRegistrationModal } from './components/nurse/NurseRegistrationModal';
import {
  ShieldCheck,
  HeartPulse,
  Heart,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeRole, setActiveRole } = useApp();

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isNewNurseModalOpen, setIsNewNurseModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenNewRequestModal={() => setIsNewRequestModalOpen(true)}
        onOpenNewNurseModal={() => setIsNewNurseModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'admin' && <AdminDashboard />}
        {activeRole === 'patient' && <PatientDashboard />}
        {activeRole === 'nurse' && <NurseDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              <HeartPulse size={14} />
            </div>
            <span className="font-bold text-slate-900 text-sm">CuraHome Healthcare</span>
            <span className="text-slate-300">·</span>
            <span>Accredited Home Nursing Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>100% Board-Verified Registered Nurses</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <PhoneCall size={14} className="text-teal-600" />
              <span>24/7 Clinical Emergency Support</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Overlays */}
      <RoleSwitcherModal onOpenNewNurseModal={() => setIsNewNurseModalOpen(true)} />
      <NotificationsDrawer />
      <DocumentViewerModal />
      <NewServiceRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
      />
      <NurseRegistrationModal
        isOpen={isNewNurseModalOpen}
        onClose={() => setIsNewNurseModalOpen(false)}
      />
    </div>
  );
};

const AppShell: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <MainContent />;
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
