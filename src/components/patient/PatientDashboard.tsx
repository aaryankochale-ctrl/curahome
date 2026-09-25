import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest, RequestStatus } from '../../types';
import { RequestStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { SERVICE_TYPE_CONFIG } from '../../data/mockData';
import { NewServiceRequestModal } from './NewServiceRequestModal';
import { PatientProfileModal } from './PatientProfileModal';
import { PatientRequestDetailModal } from './PatientRequestDetailModal';
import {
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  HeartPulse,
  UserCheck,
  FileText,
  User,
  Activity,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { currentPatient, requests, patients, setActivePatientId } = useApp();

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'urgent'>('all');

  if (!currentPatient) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500">No patient profile selected.</p>
      </div>
    );
  }

  // Filter requests for current patient
  const patientRequests = requests.filter((r) => r.patientId === currentPatient.id);

  // Active requests (not completed or cancelled)
  const activeRequests = patientRequests.filter(
    (r) => !['completed', 'cancelled'].includes(r.status)
  );
  const completedRequests = patientRequests.filter((r) => r.status === 'completed');

  // Filter by status filter tabs
  const filteredRequests = patientRequests.filter((r) => {
    if (statusFilter === 'active') return !['completed', 'cancelled'].includes(r.status);
    if (statusFilter === 'completed') return r.status === 'completed';
    if (statusFilter === 'urgent') return r.priority === 'urgent' || r.priority === 'emergency_note';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-lg shrink-0">
              {currentPatient.fullName.split(' ')[0][0]}
              {currentPatient.fullName.split(' ')[1]?.[0] || ''}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">
                  {currentPatient.fullName}
                </h1>
                <span className="text-xs text-slate-500">
                  Age {currentPatient.age} · {currentPatient.gender} · Blood {currentPatient.medicalInfo.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                <MapPin size={13} className="text-teal-700" />
                <span>{currentPatient.address} ({currentPatient.districtZone})</span>
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>
                  Emergency: <strong className="text-slate-700">{currentPatient.emergencyContact.fullName}</strong> ({currentPatient.emergencyContact.relationship}) - {currentPatient.emergencyContact.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <User size={14} /> Edit Health Profile
            </button>
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle size={15} /> Request Home Care
            </button>
          </div>
        </div>

        {/* Quick Allergy & Medical Alert Bar */}
        {(currentPatient.medicalInfo.allergies.length > 0 || currentPatient.medicalInfo.chronicConditions.length > 0) && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {currentPatient.medicalInfo.allergies.length > 0 && (
              <div className="flex items-center gap-1.5 text-amber-800">
                <AlertCircle size={14} className="text-amber-600" />
                <span>
                  <strong>Allergies:</strong> {currentPatient.medicalInfo.allergies.join(', ')}
                </span>
              </div>
            )}
            {currentPatient.medicalInfo.chronicConditions.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Activity size={14} className="text-slate-400" />
                <span>
                  <strong>Conditions:</strong> {currentPatient.medicalInfo.chronicConditions.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Care Requests
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {activeRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeRequests.filter((r) => r.status === 'nurse_assigned' || r.status === 'accepted').length} confirmed / assigned
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Scheduled Home Visits
          </div>
          <div className="text-2xl font-bold text-teal-700 mt-1 tabular-nums">
            {activeRequests.filter((r) => r.status === 'accepted' || r.status === 'in_progress').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Nurses confirmed on schedule</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed Services
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {completedRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Past home visits with vitals</div>
        </div>
      </div>

      {/* Active Attention Item Banner (if any in progress or newly assigned) */}
      {activeRequests.some((r) => r.status === 'in_progress') && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <div>
              <h4 className="text-xs font-bold text-emerald-900">
                Home Healthcare Visit In Progress Right Now
              </h4>
              <p className="text-xs text-emerald-700">
                Your assigned nurse is currently at your home performing care.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const active = activeRequests.find((r) => r.status === 'in_progress');
              if (active) setSelectedRequest(active);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            View Live Details
          </button>
        </div>
      )}

      {/* Main Service Requests List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Header & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Home Healthcare Requests</h3>
            <p className="text-xs text-slate-500">
              Track status from request submission to nurse arrival and completion.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg overflow-x-auto no-scrollbar w-full sm:w-auto whitespace-nowrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({patientRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('urgent')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'urgent'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Urgent
            </button>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <HeartPulse size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No requests found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Need assistance with wound dressing, medication, or post-surgery recovery?
            </p>
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Request a Home Healthcare Nurse
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => {
              const conf = SERVICE_TYPE_CONFIG[req.serviceType];
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="p-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          {req.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <RequestStatusBadge status={req.status} />
                        <span className="text-slate-300">·</span>
                        <PriorityBadge priority={req.priority} />
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                        {req.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {req.description}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{req.preferredDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          <span className="capitalize">{req.preferredTimeSlot}</span>
                          {req.specificTime ? ` (${req.specificTime})` : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          <span>{req.locationDistrictZone}</span>
                        </span>
                        {req.documents.length > 0 && (
                          <span className="flex items-center gap-1 text-teal-700 font-medium">
                            <FileText size={13} />
                            <span>{req.documents.length} doc{req.documents.length > 1 ? 's' : ''}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {req.assignedNurseName ? (
                        <div className="text-left md:text-right">
                          <div className="text-[11px] text-slate-400">Assigned Clinician</div>
                          <div className="text-xs font-bold text-slate-900 flex items-center md:justify-end gap-1">
                            <ShieldCheck size={13} className="text-teal-600" />
                            <span>{req.assignedNurseName}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-left md:text-right">
                          <div className="text-[11px] text-slate-400">Nurse Assignment</div>
                          <div className="text-xs font-medium text-amber-700">Admin Matching</div>
                        </div>
                      )}

                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-700 flex items-center justify-center text-slate-400 transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <NewServiceRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSuccess={(id) => {
          const created = requests.find((r) => r.id === id);
          if (created) setSelectedRequest(created);
        }}
      />

      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <PatientRequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
