import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  Layers,
  HeartPulse,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onOpenNewRequestModal?: () => void;
  onOpenNewNurseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewRequestModal,
  onOpenNewNurseModal,
}) => {
  const {
    activeRole,
    setActiveRole,
    currentPatient,
    currentNurse,
    notifications,
    setIsNotificationsDrawerOpen,
    setIsRoleSwitcherOpen,
    activePatientId,
    activeNurseId,
    currentUserEmail,
    isAdminEmail,
    logout,
  } = useApp();

  // Filter unread notifications count
  const unreadCount = notifications.filter((n) => {
    if (n.read) return false;
    if (activeRole === 'admin') return n.targetRole === 'admin' || n.targetRole === 'all';
    if (activeRole === 'patient') {
      return (n.targetRole === 'patient' && (!n.targetUserId || n.targetUserId === activePatientId)) || n.targetRole === 'all';
    }
    if (activeRole === 'nurse') {
      return (n.targetRole === 'nurse' && (!n.targetUserId || n.targetUserId === activeNurseId)) || n.targetRole === 'all';
    }
    return false;
  }).length;

  const getRoleDisplayName = () => {
    if (activeRole === 'admin') return 'Admin Console';
    if (activeRole === 'nurse') return currentNurse ? currentNurse.fullName : 'Nurse';
    return currentPatient ? currentPatient.fullName : 'Patient';
  };

  const getRoleSubtitle = () => {
    if (activeRole === 'admin') return 'Chief Healthcare Ops';
    if (activeRole === 'nurse') {
      return currentNurse?.verificationStatus === 'verified'
        ? `Verified ${currentNurse.qualification}`
        : 'Verification Pending';
    }
    return `Patient · ${currentPatient?.districtZone || 'Home Care'}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveRole('admin')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
                <HeartPulse size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors">
                CuraHome
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links / Role View */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(activeRole === 'admin' || isAdminEmail(currentUserEmail)) && (
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeRole === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={() => setActiveRole('patient')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeRole === 'patient'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient Portal
            </button>
            <button
              onClick={() => setActiveRole('nurse')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeRole === 'nurse'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nurse Workspace
            </button>
          </nav>

          {/* Zone 3: Primary Actions & User Identity */}
          <div className="flex items-center gap-3">
            {/* Quick Action based on role */}
            {activeRole === 'patient' && onOpenNewRequestModal && (
              <button
                onClick={onOpenNewRequestModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
              >
                + Request Home Care
              </button>
            )}

            {activeRole === 'nurse' && onOpenNewNurseModal && (
              <button
                onClick={onOpenNewNurseModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
              >
                + Nurse Registration
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Role Switcher dropdown trigger */}
            <button
              onClick={() => setIsRoleSwitcherOpen(true)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                {activeRole === 'admin' ? (
                  <ShieldCheck size={14} className="text-teal-700" />
                ) : (
                  <User size={14} className="text-slate-600" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                  {getRoleDisplayName()}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {getRoleSubtitle()}
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out / Change Account"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
