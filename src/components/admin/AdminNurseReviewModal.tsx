import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NurseProfile } from '../../types';
import { NurseStatusBadge } from '../common/StatusBadge';
import { SERVICE_TYPE_CONFIG } from '../../data/mockData';
import {
  X,
  ShieldCheck,
  FileCheck,
  Calendar,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Unlock,
} from 'lucide-react';

interface AdminNurseReviewModalProps {
  nurse: NurseProfile | null;
  onClose: () => void;
}

export const AdminNurseReviewModal: React.FC<AdminNurseReviewModalProps> = ({
  nurse,
  onClose,
}) => {
  const {
    verifyNurse,
    rejectNurse,
    suspendNurse,
    reactivateNurse,
    setPreviewDocument,
  } = useApp();

  const [verifyNotes, setVerifyNotes] = useState('Primary source credentials verified against State License Registry.');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendInput, setShowSuspendInput] = useState(false);

  if (!nurse) return null;

  const handleVerify = () => {
    verifyNurse(nurse.id, verifyNotes);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please state a reason for rejecting the registration.');
      return;
    }
    rejectNurse(nurse.id, rejectReason.trim());
    onClose();
  };

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      alert('Please state a reason for suspending the account.');
      return;
    }
    suspendNurse(nurse.id, suspendReason.trim());
    onClose();
  };

  const handleReactivate = () => {
    reactivateNurse(nurse.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              {nurse.fullName.split(' ')[0][0]}
              {nurse.fullName.split(' ')[1]?.[0] || ''}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{nurse.fullName}</h2>
                <NurseStatusBadge status={nurse.verificationStatus} />
              </div>
              <div className="text-xs text-slate-500">
                Registered {new Date(nurse.createdAt).toLocaleDateString()} · ID: {nurse.id}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Credentials Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              License & Institutional Credentials
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">License Number:</span>{' '}
                <strong className="font-mono text-slate-900">{nurse.licenseNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500">Issuing Authority:</span>{' '}
                <strong className="text-slate-800">{nurse.issuingCouncil}</strong>
              </div>
              <div>
                <span className="text-slate-500">Degree / Qualification:</span>{' '}
                <strong className="text-slate-800">{nurse.qualification}</strong>
              </div>
              <div>
                <span className="text-slate-500">Experience:</span>{' '}
                <strong className="text-slate-800">{nurse.yearsOfExperience} Years</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Graduating Institution:</span>{' '}
                <span className="text-slate-800">{nurse.qualificationDetails}</span>
              </div>
            </div>
          </div>

          {/* Contact & Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <div className="font-semibold text-slate-400 uppercase tracking-wider">
                Clinician Contact Info
              </div>
              <div>Email: <a href={`mailto:${nurse.email}`} className="text-teal-700 font-medium">{nurse.email}</a></div>
              <div>Phone: <strong className="text-slate-800">{nurse.phone}</strong></div>
              <div>Address: <span className="text-slate-600">{nurse.address}, {nurse.city}</span></div>
              <div className="pt-1 text-[11px] text-slate-500">
                Emergency: {nurse.emergencyContact.fullName} ({nurse.emergencyContact.relationship}) - {nurse.emergencyContact.phone}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <div className="font-semibold text-slate-400 uppercase tracking-wider">
                Availability & Coverage
              </div>
              <div>
                <span className="text-slate-500">Preferred Zones:</span>{' '}
                <strong className="text-slate-800">{nurse.preferredWorkingAreas.join(', ')}</strong>
              </div>
              <div>
                <span className="text-slate-500">Shift Availability:</span>{' '}
                <span className="capitalize">{nurse.availability.shifts.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-500">Working Days:</span>{' '}
                <span>{nurse.availability.daysOfWeek.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-500">Duty Status:</span>{' '}
                <span className={nurse.availability.isActiveOnDuty ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {nurse.availability.isActiveOnDuty ? 'Active On-Duty' : 'Off-Duty / Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Expertise */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Clinical Areas of Expertise ({nurse.areasOfExpertise.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {nurse.areasOfExpertise.map((st) => (
                <span
                  key={st}
                  className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-medium border border-teal-100"
                >
                  {SERVICE_TYPE_CONFIG[st]?.label || st}
                </span>
              ))}
            </div>
          </div>

          {/* Uploaded Verification Documents (Crucial Review Feature) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Submitted Verification Documents ({nurse.documents.length})
              </div>
              <span className="text-[11px] text-teal-700">Click to preview document</span>
            </div>

            {nurse.documents.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No documents uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {nurse.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setPreviewDocument(doc)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck size={16} className="text-teal-700 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {doc.type.replace(/_/g, ' ')} · {doc.fileSize}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-teal-700 shrink-0">
                      Inspect
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Verification Decision Actions */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verification Decision & Actions
            </div>

            {nurse.verificationStatus === 'pending_verification' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    This nurse cannot receive patient assignments until verified. Cross-reference
                    license <strong className="font-mono">{nurse.licenseNumber}</strong> with the
                    state board before approving.
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Verification Audit Notes
                  </label>
                  <input
                    type="text"
                    value={verifyNotes}
                    onChange={(e) => setVerifyNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                {showRejectInput ? (
                  <div className="space-y-2 pt-2 border-t border-amber-200">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (e.g. invalid license number)..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleReject}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setShowRejectInput(false)}
                        className="px-2 py-1.5 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="text-xs text-rose-700 hover:text-rose-900 font-semibold"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={handleVerify}
                      className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={15} /> Approve & Verify Nurse
                    </button>
                  </div>
                )}
              </div>
            )}

            {nurse.verificationStatus === 'verified' && (
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <ShieldCheck size={14} /> Nurse Verified & In Good Standing
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Verified on {nurse.verifiedAt ? new Date(nurse.verifiedAt).toLocaleDateString() : 'Active'} · {nurse.verificationNotes}
                  </div>
                </div>

                {showSuspendInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="Reason for suspension..."
                      className="px-3 py-1 text-xs rounded border border-slate-300"
                    />
                    <button
                      onClick={handleSuspend}
                      className="px-3 py-1 text-xs font-bold text-white bg-rose-600 rounded"
                    >
                      Confirm Suspend
                    </button>
                    <button
                      onClick={() => setShowSuspendInput(false)}
                      className="px-2 py-1 text-xs text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSuspendInput(true)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-300 rounded-lg transition-colors"
                  >
                    Suspend Nurse
                  </button>
                )}
              </div>
            )}

            {nurse.verificationStatus === 'suspended' && (
              <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Account Currently Suspended</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Reason: {nurse.verificationNotes || 'Administrative review'}
                  </div>
                </div>
                <button
                  onClick={handleReactivate}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
                >
                  Reactivate Nurse
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 bg-slate-50">
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
