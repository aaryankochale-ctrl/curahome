import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest, NurseProfile } from '../../types';
import { calculateNurseMatchScores } from '../../utils/matchingEngine';
import { RequestStatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Star,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface AdminAssignNurseModalProps {
  request: ServiceRequest | null;
  onClose: () => void;
}

export const AdminAssignNurseModal: React.FC<AdminAssignNurseModalProps> = ({
  request,
  onClose,
}) => {
  const { nurses, assignNurseToRequest, unassignNurseFromRequest } = useApp();
  const [selectedNurseId, setSelectedNurseId] = useState<string>('');

  if (!request) return null;

  // Calculate intelligent matching scores for all verified nurses
  const matchResults = calculateNurseMatchScores(request, nurses);
  const unverifiedCount = nurses.filter((n) => n.verificationStatus !== 'verified').length;

  const handleAssign = (nurseId: string) => {
    assignNurseToRequest(request.id, nurseId);
    onClose();
  };

  const handleUnassign = () => {
    unassignNurseFromRequest(request.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                Clinical Assignment Engine
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-xs text-slate-500 font-semibold">{request.id}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Match & Assign Qualified Nurse
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Request Brief */}
        <div className="p-4 bg-teal-50/40 border-b border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-900">{request.title}</span>
              <PriorityBadge priority={request.priority} />
            </div>
            <div className="text-slate-600 flex items-center gap-3 flex-wrap">
              <span>Patient: <strong className="text-slate-800">{request.patientName}</strong> (Age {request.patientAge})</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-teal-700" />
                <strong>{request.locationDistrictZone}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-teal-700" />
                {request.preferredDate} ({request.preferredTimeSlot})
              </span>
            </div>
          </div>

          {request.assignedNurseId && (
            <div className="shrink-0 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-teal-200">
              <span className="text-slate-500">Currently:</span>
              <strong className="text-slate-900">{request.assignedNurseName}</strong>
              <button
                onClick={handleUnassign}
                className="text-rose-600 hover:text-rose-800 font-semibold ml-1 text-xs"
              >
                Unassign
              </button>
            </div>
          )}
        </div>

        {/* Matching Recommendation List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Sparkles size={14} className="text-teal-600" />
              <span>Ranked Qualified Clinicians ({matchResults.length})</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Filtered for Verified & active credentials
            </span>
          </div>

          {matchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <AlertTriangle size={32} className="mx-auto mb-2 text-amber-500" />
              <h4 className="text-sm font-semibold text-slate-800">No Verified Nurses Available</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {unverifiedCount > 0
                  ? `There are ${unverifiedCount} nurse registrations pending verification. Review and approve them in Nurse Management first!`
                  : 'Please onboard and verify nurses to enable matching.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchResults.map(({ nurse, score, breakdown, reasons }) => {
                const isCurrentlyAssigned = request.assignedNurseId === nurse.id;
                const isTopMatch = score >= 80;

                return (
                  <div
                    key={nurse.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrentlyAssigned
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                        : isTopMatch
                        ? 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/70'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                          {nurse.fullName.split(' ')[0][0]}
                          {nurse.fullName.split(' ')[1]?.[0] || ''}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{nurse.fullName}</h4>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                              <ShieldCheck size={12} className="text-teal-600" /> Verified RN
                            </span>
                            {nurse.availability.isActiveOnDuty ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                Active On-Duty
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                On-Call
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-600 mt-0.5">
                            {nurse.qualification} · {nurse.yearsOfExperience}y Clinical Exp · License:{' '}
                            <span className="font-mono text-slate-800">{nurse.licenseNumber}</span>
                          </div>

                          {/* Match Reasons Chips */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {reasons.map((r, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right match score & assignment action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <div className="text-right">
                            <div className="text-base font-extrabold text-teal-700 tabular-nums">
                              {score}%
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase">
                              Match Score
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-xs">
                            <Star size={14} className="fill-teal-700 text-teal-700" />
                          </div>
                        </div>

                        {isCurrentlyAssigned ? (
                          <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <CheckCircle2 size={13} /> Currently Assigned
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAssign(nurse.id)}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                          >
                            <UserCheck size={14} /> Assign Nurse
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500">
            Final assignment control remains strictly with Chief Clinical Admin.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
