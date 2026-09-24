import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest } from '../../types';
import { RequestStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { SERVICE_TYPE_CONFIG } from '../../data/mockData';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  UserCheck,
  ShieldCheck,
  Star,
  Activity,
  Heart,
  AlertCircle,
  MessageSquare,
  Ban,
} from 'lucide-react';

interface PatientRequestDetailModalProps {
  request: ServiceRequest | null;
  onClose: () => void;
}

export const PatientRequestDetailModal: React.FC<PatientRequestDetailModalProps> = ({
  request,
  onClose,
}) => {
  const { nurses, setPreviewDocument, submitFeedback, cancelRequest } = useApp();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  if (!request) return null;

  const assignedNurse = nurses.find((n) => n.id === request.assignedNurseId);
  const serviceConf = SERVICE_TYPE_CONFIG[request.serviceType];

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please provide a short review or note about your home visit experience.');
      return;
    }
    setIsSubmittingRating(true);
    submitFeedback(request.id, rating, comment.trim());
    setIsSubmittingRating(false);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this home healthcare request?')) {
      cancelRequest(request.id, cancelReason || 'Patient requested cancellation');
      onClose();
    }
  };

  // Timeline progress steps
  const steps = [
    { key: 'pending', label: 'Pending' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'nurse_assigned', label: 'Nurse Assigned' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === request.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {request.id}
                </span>
                <span className="text-slate-300">·</span>
                <PriorityBadge priority={request.priority} />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">{request.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Pipeline Visualizer */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {steps.map((s, idx) => {
              const isPast = currentStepIdx >= idx && request.status !== 'cancelled';
              const isCurrent = s.key === request.status;
              return (
                <div key={s.key} className="flex flex-col items-center relative flex-1">
                  <div className="flex items-center w-full">
                    {idx > 0 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          isPast ? 'bg-teal-600' : 'bg-slate-200'
                        }`}
                      />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                          : isPast
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          currentStepIdx > idx && request.status !== 'cancelled'
                            ? 'bg-teal-600'
                            : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] font-medium text-center truncate max-w-[80px] ${
                      isCurrent
                        ? 'text-teal-900 font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* 1. Assigned Nurse Card */}
          {request.assignedNurseId && assignedNurse ? (
            <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {assignedNurse.fullName.split(' ')[0][0]}
                    {assignedNurse.fullName.split(' ')[1]?.[0] || ''}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {assignedNurse.fullName}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                        <ShieldCheck size={12} /> Verified by Admin
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {assignedNurse.qualification} · {assignedNurse.yearsOfExperience} Years Clinical Experience
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      License: <span className="font-mono text-slate-700">{assignedNurse.licenseNumber}</span> ({assignedNurse.issuingCouncil})
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span>{assignedNurse.rating.toFixed(2)}</span>
                    <span className="text-slate-400 font-normal">
                      ({assignedNurse.completedVisitsCount} visits)
                    </span>
                  </div>
                  <div className="mt-2">
                    <a
                      href={`tel:${assignedNurse.phone}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 underline"
                    >
                      Contact Nurse
                    </a>
                  </div>
                </div>
              </div>

              {assignedNurse.verificationNotes && (
                <div className="mt-3 pt-2.5 border-t border-teal-100 text-[11px] text-teal-800">
                  <span className="font-semibold">Admin Credentials Review:</span> {assignedNurse.verificationNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <Clock size={24} className="mx-auto text-slate-400 mb-1" />
              <h4 className="text-xs font-bold text-slate-800">Nurse Matching in Progress</h4>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md mx-auto">
                Our Admin clinical team is currently reviewing your medical requirements and matching
                the best verified registered nurse specialized in {serviceConf?.category || 'home healthcare'}.
              </p>
            </div>
          )}

          {/* 2. Visit Timing & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Scheduled Visit
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-800">
                <Calendar size={15} className="text-teal-700" />
                <span className="font-medium">
                  {new Date(request.preferredDate).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-800">
                <Clock size={15} className="text-teal-700" />
                <span>
                  Slot: <strong className="capitalize">{request.preferredTimeSlot}</strong>
                  {request.specificTime ? ` (${request.specificTime})` : ''}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Est. Duration: {request.duration || serviceConf?.typicalDuration || '45 - 60 min'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Home Visit Location
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-800">
                <MapPin size={15} className="text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">{request.locationAddress}</div>
                  <div className="text-slate-500">{request.locationDistrictZone}</div>
                </div>
              </div>
              {request.locationLandmark && (
                <div className="text-[11px] text-slate-600 pl-6">
                  <strong>Access Landmark:</strong> {request.locationLandmark}
                </div>
              )}
            </div>
          </div>

          {/* 3. Clinical Requirements & Notes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Care Instructions & Medical Requirements
            </h4>
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              {request.description}
            </div>
            {request.specialInstructions && (
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Special Note:</span> {request.specialInstructions}
              </div>
            )}
          </div>

          {/* 4. Uploaded Medical Documents */}
          {request.documents && request.documents.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Attached Medical Documents ({request.documents.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {request.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setPreviewDocument(doc)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={16} className="text-teal-700 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-slate-800 truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.fileSize}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-teal-700 font-medium shrink-0">
                      View
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Completed Visit Vitals (If completed) */}
          {request.status === 'completed' && request.visitVitals && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-700" /> Recorded Clinical Vitals & Visit Notes
                </h4>
                <span className="text-[11px] text-emerald-700 font-mono">
                  Recorded {new Date(request.visitVitals.recordedAt || request.completedAt || '').toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {request.visitVitals.bloodPressure && (
                  <div className="p-2.5 bg-white rounded border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase">Blood Pressure</span>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {request.visitVitals.bloodPressure}
                    </div>
                  </div>
                )}
                {request.visitVitals.heartRate && (
                  <div className="p-2.5 bg-white rounded border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase">Heart Rate</span>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {request.visitVitals.heartRate}
                    </div>
                  </div>
                )}
                {request.visitVitals.spo2 && (
                  <div className="p-2.5 bg-white rounded border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase">SpO2 Oxygen</span>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {request.visitVitals.spo2}
                    </div>
                  </div>
                )}
                {request.visitVitals.bloodSugar && (
                  <div className="p-2.5 bg-white rounded border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase">Blood Sugar</span>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {request.visitVitals.bloodSugar}
                    </div>
                  </div>
                )}
              </div>

              {request.visitVitals.clinicalNotes && (
                <div className="text-xs text-slate-700 bg-white p-3 rounded border border-emerald-100">
                  <span className="font-semibold text-slate-900">Nurse Clinical Note: </span>
                  {request.visitVitals.clinicalNotes}
                </div>
              )}
            </div>
          )}

          {/* 6. Patient Feedback / Rating */}
          {request.status === 'completed' && (
            <div>
              {request.patientFeedback ? (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Your Submitted Review</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < request.patientFeedback!.rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{request.patientFeedback.comment}"
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleRatingSubmit}
                  className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Rate Your Nurse & Visit</h4>
                      <p className="text-[11px] text-slate-500">
                        Help maintain quality and reward exceptional clinical care.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            size={18}
                            className={
                              star <= rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-300 hover:text-amber-400'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share feedback on punctuality, clinical skill, and bedside comfort..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingRating}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 7. Cancellation Option if request is still early */}
          {['pending', 'under_review', 'nurse_assigned'].includes(request.status) && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {showCancelPrompt ? (
                <div className="w-full flex items-center gap-2">
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason for cancellation (optional)..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                  >
                    Confirm Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelPrompt(false)}
                    className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Keep Request
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 transition-colors"
                >
                  <Ban size={13} /> Cancel this request
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500">
            Request submitted {new Date(request.createdAt).toLocaleDateString()}
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
