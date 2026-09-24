import React from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import { RequestStatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  X,
  User,
  Phone,
  MapPin,
  Heart,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Ban,
  Activity,
} from 'lucide-react';

interface AdminPatientDetailModalProps {
  patient: PatientProfile | null;
  onClose: () => void;
  onSelectRequest?: (requestId: string) => void;
}

export const AdminPatientDetailModal: React.FC<AdminPatientDetailModalProps> = ({
  patient,
  onClose,
  onSelectRequest,
}) => {
  const { requests, togglePatientStatus } = useApp();

  if (!patient) return null;

  const patientRequests = requests.filter((r) => r.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
              {patient.fullName.split(' ')[0][0]}
              {patient.fullName.split(' ')[1]?.[0] || ''}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{patient.fullName}</h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                    patient.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-rose-50 text-rose-800'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Age {patient.age} · {patient.gender} · ID: {patient.id}
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
          {/* Coordinates & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-400 uppercase tracking-wider">
                Home Contact Info
              </div>
              <div>Phone: <strong className="text-slate-900">{patient.phone}</strong></div>
              <div>Email: <span className="text-slate-700">{patient.email}</span></div>
              <div>Address: <span className="text-slate-700">{patient.address}</span></div>
              <div>Zone: <span className="text-teal-700 font-semibold">{patient.districtZone}</span></div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-400 uppercase tracking-wider">
                Emergency Next of Kin
              </div>
              <div>Name: <strong className="text-slate-900">{patient.emergencyContact.fullName}</strong></div>
              <div>Relation: <span className="text-slate-700">{patient.emergencyContact.relationship}</span></div>
              <div>Phone: <strong className="text-slate-900">{patient.emergencyContact.phone}</strong></div>
            </div>
          </div>

          {/* Medical Context */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 text-xs">
            <div className="font-semibold text-slate-400 uppercase tracking-wider">
              Health & Clinical Context
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">Blood Group:</span>{' '}
                <strong className="text-slate-900">{patient.medicalInfo.bloodGroup}</strong>
              </div>
              <div>
                <span className="text-slate-500">Mobility:</span>{' '}
                <span className="text-slate-800">{patient.medicalInfo.mobilityNotes || 'Normal'}</span>
              </div>
            </div>

            {patient.medicalInfo.allergies.length > 0 && (
              <div className="text-rose-800 bg-rose-50/70 p-2 rounded border border-rose-100 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-600 shrink-0" />
                <span>
                  <strong>Allergies:</strong> {patient.medicalInfo.allergies.join(', ')}
                </span>
              </div>
            )}

            <div>
              <span className="text-slate-500">Chronic Conditions:</span>{' '}
              <span className="text-slate-800 font-medium">
                {patient.medicalInfo.chronicConditions.join(', ') || 'None noted'}
              </span>
            </div>

            <div>
              <span className="text-slate-500">Current Medications:</span>{' '}
              <span className="text-slate-700">
                {patient.medicalInfo.currentMedications.join(', ') || 'None reported'}
              </span>
            </div>
          </div>

          {/* Service Requests History */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Care Requests History ({patientRequests.length})
            </div>
            {patientRequests.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No care requests placed yet.</p>
            ) : (
              <div className="space-y-2">
                {patientRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onSelectRequest && onSelectRequest(req.id)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500">{req.id}</span>
                        <span className="font-bold text-slate-900">{req.title}</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {req.preferredDate} ({req.preferredTimeSlot}) · Assigned:{' '}
                        {req.assignedNurseName || 'None'}
                      </div>
                    </div>
                    <RequestStatusBadge status={req.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => togglePatientStatus(patient.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              patient.status === 'active'
                ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            {patient.status === 'active' ? 'Suspend Patient Account' : 'Reactivate Patient Account'}
          </button>

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
