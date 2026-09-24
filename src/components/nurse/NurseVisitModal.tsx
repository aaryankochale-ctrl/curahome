import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest, VisitVitals } from '../../types';
import { RequestStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { SERVICE_TYPE_CONFIG } from '../../data/mockData';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Phone,
  AlertTriangle,
  Activity,
  Heart,
  FileText,
  ShieldCheck,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';

interface NurseVisitModalProps {
  request: ServiceRequest | null;
  onClose: () => void;
}

export const NurseVisitModal: React.FC<NurseVisitModalProps> = ({ request, onClose }) => {
  const { startVisit, completeVisit, setPreviewDocument, patients } = useApp();

  const [bp, setBp] = useState('124/80 mmHg');
  const [hr, setHr] = useState('72 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [spo2, setSpo2] = useState('99%');
  const [sugar, setSugar] = useState('110 mg/dL');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const patient = patients.find((p) => p.id === request.patientId);
  const conf = SERVICE_TYPE_CONFIG[request.serviceType];

  const handleStartVisit = () => {
    startVisit(request.id);
  };

  const handleCompleteVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert('Please enter clinical observations and summary of care performed.');
      return;
    }

    setIsSubmitting(true);
    const vitalsData: VisitVitals = {
      bloodPressure: bp.trim(),
      heartRate: hr.trim(),
      temperature: temp.trim(),
      spo2: spo2.trim(),
      bloodSugar: sugar.trim(),
      clinicalNotes: notes.trim(),
    };

    completeVisit(request.id, vitalsData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500 font-semibold">{request.id}</span>
              <span className="text-slate-300">·</span>
              <RequestStatusBadge status={request.status} />
              <span className="text-slate-300">·</span>
              <PriorityBadge priority={request.priority} />
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{request.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Safe Patient Care Context (Zero Unnecessary Sensitive Info) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Patient & Visit Coordinates
              </div>
              <span className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-medium">
                Authorized Clinical Assignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Patient:</span>{' '}
                <strong className="text-slate-900">{request.patientName}</strong> (Age {request.patientAge}, {request.patientGender})
              </div>
              <div>
                <span className="text-slate-500">Phone:</span>{' '}
                <a href={`tel:${request.patientPhone}`} className="text-teal-700 font-medium hover:underline">
                  {request.patientPhone}
                </a>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Home Address:</span>{' '}
                <strong className="text-slate-900">{request.locationAddress}</strong>, {request.locationDistrictZone}
              </div>
              {request.locationLandmark && (
                <div className="sm:col-span-2 text-slate-600">
                  <span className="text-slate-500">Access Instructions:</span> {request.locationLandmark}
                </div>
              )}
            </div>

            {/* Critical Allergy Alert */}
            {patient?.medicalInfo.allergies && patient.medicalInfo.allergies.length > 0 && (
              <div className="pt-2 border-t border-slate-200/70 flex items-center gap-1.5 text-xs text-rose-800">
                <AlertTriangle size={14} className="text-rose-600 shrink-0" />
                <span>
                  <strong>Allergy Warning:</strong> {patient.medicalInfo.allergies.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Care Requirements */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Service Requirements & Protocol
            </h4>
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              {request.description}
            </div>
            {request.specialInstructions && (
              <p className="mt-1.5 text-xs text-slate-500 italic">
                Note: {request.specialInstructions}
              </p>
            )}
          </div>

          {/* Uploaded Documents */}
          {request.documents && request.documents.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Attached Medical Orders ({request.documents.length})
              </h4>
              <div className="space-y-1.5">
                {request.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setPreviewDocument(doc)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={15} className="text-teal-700 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">({doc.fileSize})</span>
                    </div>
                    <span className="text-teal-700 font-medium text-xs">Inspect</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions based on visit status */}
          {request.status === 'accepted' && (
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 text-center space-y-2">
              <h4 className="text-xs font-bold text-teal-900">Arrived at Patient Home?</h4>
              <p className="text-xs text-teal-700 max-w-sm mx-auto">
                Click below to start the visit timer and notify the patient and admin that you are
                beginning clinical care.
              </p>
              <button
                type="button"
                onClick={handleStartVisit}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
              >
                <PlayCircle size={16} /> Start Home Healthcare Visit
              </button>
            </div>
          )}

          {request.status === 'in_progress' && (
            <form onSubmit={handleCompleteVisit} className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} className="text-teal-700" /> Record Patient Vitals & Clinical Notes
                </h4>
                <span className="text-xs text-emerald-700 font-medium">Session Active</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80 mmHg"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Heart Rate
                  </label>
                  <input
                    type="text"
                    value={hr}
                    onChange={(e) => setHr(e.target.value)}
                    placeholder="72 bpm"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Temperature
                  </label>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="98.6 °F"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    SpO2 Pulse Oximetry
                  </label>
                  <input
                    type="text"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="98%"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Blood Glucose
                  </label>
                  <input
                    type="text"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    placeholder="110 mg/dL"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nurse Clinical Care Summary & Observations
                </label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail wound condition, dressing technique, medication tolerance, patient comfort, and instructions given to family..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Complete Home Visit & Log Record
                </button>
              </div>
            </form>
          )}

          {request.status === 'completed' && request.visitVitals && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="text-xs font-bold text-emerald-900 mb-2">Logged Clinical Summary</div>
              <div className="text-xs text-slate-700 bg-white p-3 rounded border border-emerald-100 mb-2">
                {request.visitVitals.clinicalNotes}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>BP: <strong>{request.visitVitals.bloodPressure}</strong></div>
                <div>Pulse: <strong>{request.visitVitals.heartRate}</strong></div>
                <div>SpO2: <strong>{request.visitVitals.spo2}</strong></div>
                <div>Temp: <strong>{request.visitVitals.temperature}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500">
            Assigned visit for {request.preferredDate}
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
