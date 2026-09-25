import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  HeartPulse,
  LogOut,
  Menu,
  X,
  Stethoscope,
  PlusCircle,
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          {/* Zone 1: Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveRole('admin')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-800 transition-colors">
                <HeartPulse size={18} />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors leading-none block">
                  CuraHome
                </span>
                <span className="text-[9px] text-teal-700 font-semibold tracking-wide uppercase sm:hidden block mt-0.5">
                  Healthcare
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links / Role View */}
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
          <div className="flex items-center gap-2 sm:gap-3">
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

            {/* User Profile / Role Switcher trigger */}
            <button
              onClick={() => setIsRoleSwitcherOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:pl-2.5 sm:pr-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-left"
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

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Sign Out Button */}
            <button
              onClick={logout}
              className="hidden sm:block p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Header Role Bar (Always visible on mobile for 1-tap switching) */}
        <div className="md:hidden py-2 border-t border-slate-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full">
            {(activeRole === 'admin' || isAdminEmail(currentUserEmail)) && (
              <button
                onClick={() => setActiveRole('admin')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-md transition-all text-center whitespace-nowrap ${
                  activeRole === 'admin'
                    ? 'bg-white text-teal-900 shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Admin
              </button>
            )}
            <button
              onClick={() => setActiveRole('patient')}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-md transition-all text-center whitespace-nowrap ${
                activeRole === 'patient'
                  ? 'bg-white text-teal-900 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Patient Portal
            </button>
            <button
              onClick={() => setActiveRole('nurse')}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-md transition-all text-center whitespace-nowrap ${
                activeRole === 'nurse'
                  ? 'bg-white text-teal-900 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Nurse Workspace
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Expanded view) */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-slate-200 space-y-2.5 bg-white animate-in slide-in-from-top duration-150">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">{getRoleDisplayName()}</div>
                <div className="text-[11px] text-slate-500">{getRoleSubtitle()}</div>
              </div>
              <button
                onClick={() => {
                  setIsRoleSwitcherOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-teal-700 font-bold underline"
              >
                Switch Role
              </button>
            </div>

            {/* Quick Action Mobile Button */}
            {activeRole === 'patient' && onOpenNewRequestModal && (
              <button
                onClick={() => {
                  onOpenNewRequestModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <PlusCircle size={15} /> Request Home Healthcare Nurse
              </button>
            )}

            {activeRole === 'nurse' && onOpenNewNurseModal && (
              <button
                onClick={() => {
                  onOpenNewNurseModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Stethoscope size={15} /> Apply for Nurse Verification
              </button>
            )}

            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-4 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-100"
            >
              <LogOut size={15} /> Sign Out / Change Account
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
