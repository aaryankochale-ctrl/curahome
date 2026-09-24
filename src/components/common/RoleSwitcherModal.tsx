import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  User,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  X,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';

interface RoleSwitcherModalProps {
  onOpenNewNurseModal?: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ onOpenNewNurseModal }) => {
  const {
    isRoleSwitcherOpen,
    setIsRoleSwitcherOpen,
    activeRole,
    setActiveRole,
    activePatientId,
    setActivePatientId,
    activeNurseId,
    setActiveNurseId,
    patients,
    nurses,
    resetAllData,
  } = useApp();

  if (!isRoleSwitcherOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    setIsRoleSwitcherOpen(false);
  };

  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
    setActiveRole('patient');
    setIsRoleSwitcherOpen(false);
  };

  const handleSelectNurse = (id: string) => {
    setActiveNurseId(id);
    setActiveRole('nurse');
    setIsRoleSwitcherOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Switch Role & User Persona</h3>
            <p className="text-xs text-slate-500">
              Test and manage the application from any role perspective in real-time.
            </p>
          </div>
          <button
            onClick={() => setIsRoleSwitcherOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* 1. Admin Role */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Platform Administration
            </div>
            <div
              onClick={() => handleSelectRole('admin')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                activeRole === 'admin'
                  ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShieldAlert size={20} className="text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Platform Admin</span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      Full Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify nurses, review medical requests, run intelligent matching, and manage users.
                  </p>
                </div>
              </div>
              {activeRole === 'admin' && (
                <div className="text-teal-700">
                  <CheckCircle2 size={20} />
                </div>
              )}
            </div>
          </div>

          {/* 2. Patient Personas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Patient Personas
              </span>
              <span className="text-xs text-slate-500">Select to browse as patient</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {patients.map((patient) => {
                const isCurrent = activeRole === 'patient' && activePatientId === patient.id;
                return (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {patient.fullName}
                      </span>
                      {isCurrent && <CheckCircle2 size={14} className="text-teal-700 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      Age {patient.age} · {patient.districtZone}
                    </div>
                    <div className="mt-1.5 text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block truncate max-w-full">
                      {patient.medicalInfo.chronicConditions[0] || 'Care needed'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Nurse Personas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nurse Profiles & Credentials
              </span>
              <span className="text-xs text-slate-500">Verified & Pending profiles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {nurses.map((nurse) => {
                const isCurrent = activeRole === 'nurse' && activeNurseId === nurse.id;
                const isVerified = nurse.verificationStatus === 'verified';
                return (
                  <div
                    key={nurse.id}
                    onClick={() => handleSelectNurse(nurse.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {nurse.fullName.split(' ')[0][0]}
                          {nurse.fullName.split(' ')[1]?.[0] || ''}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{nurse.fullName}</div>
                          <div className="text-[11px] text-slate-500">
                            {nurse.qualification} · {nurse.yearsOfExperience}y exp
                          </div>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 size={16} className="text-teal-700" />}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          isVerified ? 'text-teal-700' : 'text-amber-700'
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle2 size={12} /> Verified RN
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={12} /> Pending Verification
                          </>
                        )}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {nurse.licenseNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => {
              if (confirm('Reset all requests, nurses, and patients to initial seed state?')) {
                resetAllData();
                setIsRoleSwitcherOpen(false);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw size={13} /> Reset Demo Data
          </button>

          <div className="flex items-center gap-2">
            {onOpenNewNurseModal && (
              <button
                onClick={() => {
                  setIsRoleSwitcherOpen(false);
                  onOpenNewNurseModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <PlusCircle size={14} /> Register New Nurse
              </button>
            )}
            <button
              onClick={() => setIsRoleSwitcherOpen(false)}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
