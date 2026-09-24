import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest } from '../../types';
import { RequestStatusBadge, NurseStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { NurseVisitModal } from './NurseVisitModal';
import { NurseRegistrationModal } from './NurseRegistrationModal';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Activity,
  Star,
  FileCheck,
  Phone,
  Power,
  PlayCircle,
  PlusCircle,
  Eye,
} from 'lucide-react';

export const NurseDashboard: React.FC = () => {
  const {
    currentNurse,
    requests,
    toggleNurseDuty,
    acceptRequest,
    declineRequest,
    setPreviewDocument,
  } = useApp();

  const [selectedVisitRequest, setSelectedVisitRequest] = useState<ServiceRequest | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [declinePromptReqId, setDeclinePromptReqId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  if (!currentNurse) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500">No nurse profile selected.</p>
      </div>
    );
  }

  const isVerified = currentNurse.verificationStatus === 'verified';
  const isPending = currentNurse.verificationStatus === 'pending_verification';
  const isSuspended = currentNurse.verificationStatus === 'suspended';

  // Requests assigned to this nurse
  const nurseRequests = requests.filter((r) => r.assignedNurseId === currentNurse.id);

  // New pending assignments waiting for nurse acceptance
  const pendingAssignments = nurseRequests.filter((r) => r.status === 'nurse_assigned');

  // Upcoming scheduled / accepted visits
  const upcomingVisits = nurseRequests.filter(
    (r) => r.status === 'accepted' || r.status === 'in_progress'
  );

  // Completed visits
  const completedVisits = nurseRequests.filter((r) => r.status === 'completed');

  const handleAccept = (reqId: string) => {
    acceptRequest(reqId, currentNurse.id);
  };

  const handleDecline = (reqId: string) => {
    declineRequest(reqId, currentNurse.id, declineReason || 'Schedule conflict');
    setDeclinePromptReqId(null);
    setDeclineReason('');
  };

  return (
    <div className="space-y-6">
      {/* Nurse Header Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {currentNurse.fullName.split(' ')[0][0]}
              {currentNurse.fullName.split(' ')[1]?.[0] || ''}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{currentNurse.fullName}</h1>
                <NurseStatusBadge status={currentNurse.verificationStatus} />
              </div>

              <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">{currentNurse.qualification}</span>
                <span>·</span>
                <span>{currentNurse.yearsOfExperience} Years Clinical Exp</span>
                <span>·</span>
                <span>License: <strong className="font-mono text-slate-800">{currentNurse.licenseNumber}</strong></span>
              </div>

              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>Working Areas: {currentNurse.preferredWorkingAreas.join(', ')}</span>
                <span>·</span>
                <span>Council: {currentNurse.issuingCouncil}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* On-Duty Availability Toggle (Only if verified) */}
            {isVerified && (
              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-semibold text-slate-700">
                  {currentNurse.availability.isActiveOnDuty ? 'On-Duty' : 'Off-Duty'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    toggleNurseDuty(currentNurse.id, !currentNurse.availability.isActiveOnDuty)
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    currentNurse.availability.isActiveOnDuty ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      currentNurse.availability.isActiveOnDuty ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> New Nurse Registration
            </button>
          </div>
        </div>

        {/* Verification Status Special Callout Banner */}
        {isPending && (
          <div className="mt-5 p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Registration Documents Under Review by Admin
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Your credentials, nursing license (<strong className="font-mono">{currentNurse.licenseNumber}</strong>),
                  and qualification documents are being audited against the State Nursing Board registry.
                  In accordance with clinical safety regulations, your account will become active for patient
                  assignment once verified by the platform Administrator.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-amber-900 font-medium">Submitted Documents:</span>
                  <div className="flex items-center gap-2">
                    {currentNurse.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setPreviewDocument(doc)}
                        className="text-xs text-amber-900 underline hover:text-amber-950 flex items-center gap-1 bg-amber-100/70 px-2 py-0.5 rounded"
                      >
                        <FileCheck size={12} /> {doc.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSuspended && (
          <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <strong>Account Temporarily Suspended:</strong> {currentNurse.verificationNotes || 'Please contact platform administration.'}
          </div>
        )}
      </div>

      {/* Verified Clinician Performance Stats */}
      {isVerified && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {pendingAssignments.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Awaiting your confirmation</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Visits
            </div>
            <div className="text-2xl font-bold text-teal-700 mt-1 tabular-nums">
              {upcomingVisits.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Scheduled home visits</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Visits
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {currentNurse.completedVisitsCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">Logged healthcare visits</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clinical Rating
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-1.5 tabular-nums">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <span>{currentNurse.rating > 0 ? currentNurse.rating.toFixed(2) : '5.00'}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Patient satisfaction score</div>
          </div>
        </div>
      )}

      {/* 1. Pending Assignment Requests (Accept / Decline) */}
      {isVerified && pendingAssignments.length > 0 && (
        <div className="bg-teal-50/50 border border-teal-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <h3 className="text-sm font-bold text-teal-950">
                New Home Healthcare Assignments ({pendingAssignments.length})
              </h3>
            </div>
            <span className="text-xs text-teal-800">Assigned by Admin Clinical Team</span>
          </div>

          <div className="space-y-3">
            {pendingAssignments.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg border border-teal-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">{req.id}</span>
                    <span className="text-slate-300">·</span>
                    <PriorityBadge priority={req.priority} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                  <p className="text-xs text-slate-600 max-w-xl">{req.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-800">
                      Patient: {req.patientName} (Age {req.patientAge})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-teal-700" />
                      {req.preferredDate} ({req.preferredTimeSlot})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-teal-700" />
                      {req.locationDistrictZone}
                    </span>
                  </div>
                </div>

                {declinePromptReqId === req.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Reason for declining..."
                      className="px-2.5 py-1.5 text-xs rounded border border-slate-300"
                    />
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeclinePromptReqId(null)}
                      className="px-2 py-1.5 text-xs text-slate-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setDeclinePromptReqId(req.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Accept Assignment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Upcoming Scheduled Visits */}
      {isVerified && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upcoming Scheduled Home Visits</h3>
              <p className="text-xs text-slate-500">
                Confirmed visits. Launch to start visit and record patient vitals.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {upcomingVisits.length} scheduled
            </span>
          </div>

          {upcomingVisits.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Calendar size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm text-slate-600 font-medium">No active appointments scheduled</p>
              <p className="text-xs text-slate-400 mt-0.5">
                New assignments from Admin matching will appear above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcomingVisits.map((req) => (
                <div
                  key={req.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {req.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <RequestStatusBadge status={req.status} />
                      <span className="text-slate-300">·</span>
                      <PriorityBadge priority={req.priority} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      <span className="font-medium">Patient: {req.patientName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        {req.preferredDate} ({req.preferredTimeSlot}
                        {req.specificTime ? ` · ${req.specificTime}` : ''})
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-slate-400" />
                        {req.locationAddress}, {req.locationDistrictZone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedVisitRequest(req)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs ${
                        req.status === 'in_progress'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-teal-700 hover:bg-teal-800 text-white'
                      }`}
                    >
                      {req.status === 'in_progress' ? (
                        <>
                          <Activity size={15} /> Continue In-Progress Visit
                        </>
                      ) : (
                        <>
                          <PlayCircle size={15} /> Launch Visit / Vitals
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Completed Services History */}
      {completedVisits.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Completed Service Records</h3>
            <span className="text-xs text-slate-500 font-mono">
              {completedVisits.length} visits
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {completedVisits.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedVisitRequest(req)}
                className="p-4 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-400">{req.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-bold text-slate-800">{req.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Patient: {req.patientName} · Completed on {req.completedAt ? new Date(req.completedAt).toLocaleDateString() : req.preferredDate}
                  </div>
                  {req.visitVitals?.clinicalNotes && (
                    <div className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                      "{req.visitVitals.clinicalNotes}"
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {req.patientFeedback ? (
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold justify-end">
                      <Star size={13} className="fill-amber-500" />
                      <span>{req.patientFeedback.rating} ★</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">Completed</span>
                  )}
                  <span className="text-xs text-teal-700 font-medium mt-1 inline-block">
                    View Record
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <NurseVisitModal
        request={selectedVisitRequest}
        onClose={() => setSelectedVisitRequest(null)}
      />

      <NurseRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
