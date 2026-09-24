import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest, NurseProfile, PatientProfile, RequestStatus } from '../../types';
import { RequestStatusBadge, NurseStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { SERVICE_TYPE_CONFIG } from '../../data/mockData';
import { AdminAssignNurseModal } from './AdminAssignNurseModal';
import { AdminNurseReviewModal } from './AdminNurseReviewModal';
import { AdminPatientDetailModal } from './AdminPatientDetailModal';
import { PatientRequestDetailModal } from '../patient/PatientRequestDetailModal';
import {
  Users,
  ShieldCheck,
  Clock,
  Activity,
  AlertTriangle,
  Search,
  UserCheck,
  FileCheck,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  PlusCircle,
  Phone,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    requests,
    nurses,
    patients,
    updateRequestStatus,
    cancelRequest,
    setPreviewDocument,
  } = useApp();

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'requests' | 'nurses' | 'patients'>('requests');

  // Request filters
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Nurse filters
  const [nurseStatusFilter, setNurseStatusFilter] = useState<string>('all');
  const [nurseSearchQuery, setNurseSearchQuery] = useState('');

  // Patient filters
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // Selected modals
  const [matchingRequest, setMatchingRequest] = useState<ServiceRequest | null>(null);
  const [reviewingNurse, setReviewingNurse] = useState<NurseProfile | null>(null);
  const [viewingPatient, setViewingPatient] = useState<PatientProfile | null>(null);
  const [viewingRequest, setViewingRequest] = useState<ServiceRequest | null>(null);

  // Stats calculations
  const totalRequestsCount = requests.length;
  const pendingRequestsCount = requests.filter(
    (r) => r.status === 'pending' || r.status === 'under_review'
  ).length;
  const assignedRequestsCount = requests.filter((r) => r.status === 'nurse_assigned').length;
  const activeAssignmentsCount = requests.filter(
    (r) => r.status === 'accepted' || r.status === 'in_progress'
  ).length;
  const completedRequestsCount = requests.filter((r) => r.status === 'completed').length;
  const pendingNursesCount = nurses.filter(
    (n) => n.verificationStatus === 'pending_verification'
  ).length;
  const verifiedNursesCount = nurses.filter(
    (n) => n.verificationStatus === 'verified'
  ).length;

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    if (requestStatusFilter !== 'all' && r.status !== requestStatusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    if (requestSearchQuery) {
      const q = requestSearchQuery.toLowerCase();
      const matchName = r.patientName.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      const matchZone = r.locationDistrictZone.toLowerCase().includes(q);
      const matchNurse = (r.assignedNurseName || '').toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchId && !matchZone && !matchNurse) return false;
    }
    return true;
  });

  // Filtered nurses
  const filteredNurses = nurses.filter((n) => {
    if (nurseStatusFilter !== 'all' && n.verificationStatus !== nurseStatusFilter) return false;
    if (nurseSearchQuery) {
      const q = nurseSearchQuery.toLowerCase();
      const matchName = n.fullName.toLowerCase().includes(q);
      const matchLic = n.licenseNumber.toLowerCase().includes(q);
      const matchQual = n.qualification.toLowerCase().includes(q);
      const matchZone = n.preferredWorkingAreas.some((z) => z.toLowerCase().includes(q));
      if (!matchName && !matchLic && !matchQual && !matchZone) return false;
    }
    return true;
  });

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    if (patientSearchQuery) {
      const q = patientSearchQuery.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      const matchZone = p.districtZone.toLowerCase().includes(q);
      const matchCond = p.medicalInfo.chronicConditions.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchZone && !matchCond) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Executive Health Ops Summary Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              System Administration Control Panel
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Healthcare Operations & Nurse Assignment Command
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review client service requests, verify nurse credentials, assign verified nurses, and monitor home visits.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
              Chief Admin: kochaleaaryan@gmail.com
            </span>
          </div>
        </div>

        {/* Pending Nurse Verification Alert Banner */}
        {pendingNursesCount > 0 && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={18} className="text-amber-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-900">
                  {pendingNursesCount} Nurse Application{pendingNursesCount > 1 ? 's' : ''} Awaiting Verification
                </span>
                <p className="text-xs text-amber-800">
                  Nurses cannot be assigned to client requests until you review and verify their regulatory license.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('nurses');
                setNurseStatusFilter('pending_verification');
              }}
              className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors shrink-0"
            >
              Review Applications
            </button>
          </div>
        )}
      </div>

      {/* KPI Metric Cards (7 Essential Controls) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Requests</span>
            <Clock size={14} className="text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1.5 tabular-nums">
            {totalRequestsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">All time submitted</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Pending Requests</span>
            <Clock size={14} className="text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1.5 tabular-nums">
            {pendingRequestsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Needs nurse assignment</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Assigned Requests</span>
            <UserCheck size={14} className="text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-indigo-700 mt-1.5 tabular-nums">
            {assignedRequestsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Awaiting nurse reply</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Active Assignments</span>
            <Activity size={14} className="text-teal-600" />
          </div>
          <div className="text-xl font-bold text-teal-700 mt-1.5 tabular-nums">
            {activeAssignmentsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Accepted & on-site</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1.5 tabular-nums">
            {completedRequestsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Finished home visits</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Nurse Applications</span>
            <FileCheck size={14} className="text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1.5 tabular-nums">
            {pendingNursesCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Awaiting verification</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Verified Nurses</span>
            <ShieldCheck size={14} className="text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1.5 tabular-nums">
            {verifiedNursesCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Available for assignment</div>
        </div>
      </div>

      {/* Main Administrative Views (3 Core Tabs) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Navigation Tab Bar */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 pt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'border-teal-700 text-teal-900 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={14} /> Service Requests Pipeline ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('nurses')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'nurses'
                  ? 'border-teal-700 text-teal-900 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={14} /> Nurse Management & Licensing ({nurses.length})
              {pendingNursesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'patients'
                  ? 'border-teal-700 text-teal-900 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} /> Patient Directory ({patients.length})
            </button>
          </div>
        </div>

        {/* TAB 1: SERVICE REQUESTS MANAGEMENT & MATCHING */}
        {activeTab === 'requests' && (
          <div className="p-4 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  placeholder="Search patient, ID, zone, nurse..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto text-xs">
                {['all', 'pending', 'under_review', 'nurse_assigned', 'in_progress', 'completed'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setRequestStatusFilter(st)}
                      className={`px-2.5 py-1 font-medium rounded-md whitespace-nowrap transition-colors capitalize ${
                        requestStatusFilter === st
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Request & Patient</th>
                    <th className="py-2.5 px-3">Service Required</th>
                    <th className="py-2.5 px-3">Location & Zone</th>
                    <th className="py-2.5 px-3">Scheduled Time</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned Nurse</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No service requests match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-400">{req.id}</span>
                            <PriorityBadge priority={req.priority} />
                          </div>
                          <div
                            onClick={() => {
                              const p = patients.find((item) => item.id === req.patientId);
                              if (p) setViewingPatient(p);
                            }}
                            className="font-bold text-slate-900 hover:text-teal-700 cursor-pointer mt-0.5"
                          >
                            {req.patientName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Age {req.patientAge} · {req.patientPhone}
                          </div>
                        </td>

                        <td className="py-3 px-3 max-w-[200px]">
                          <div className="font-semibold text-slate-900 truncate">
                            {req.title}
                          </div>
                          <div className="text-slate-500 line-clamp-1 text-[11px]">
                            {req.description}
                          </div>
                          {req.documents.length > 0 && (
                            <button
                              onClick={() => setPreviewDocument(req.documents[0])}
                              className="text-[10px] text-teal-700 underline flex items-center gap-0.5 mt-0.5"
                            >
                              <FileCheck size={11} /> {req.documents.length} doc attached
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{req.locationDistrictZone}</div>
                          <div className="text-slate-500 truncate max-w-[140px] text-[11px]">
                            {req.locationAddress}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{req.preferredDate}</div>
                          <div className="text-slate-500 capitalize text-[11px]">
                            {req.preferredTimeSlot} {req.specificTime ? `(${req.specificTime})` : ''}
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <RequestStatusBadge status={req.status} size="sm" />
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {req.assignedNurseName ? (
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck size={14} className="text-teal-600 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 block truncate max-w-[120px]">
                                  {req.assignedNurseName}
                                </span>
                                <span className="text-[10px] text-slate-500">Assigned</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-700 font-medium text-[11px]">
                              Unassigned
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Match & Assign Nurse Button */}
                            <button
                              onClick={() => setMatchingRequest(req)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-teal-700 rounded transition-colors flex items-center gap-1"
                              title="Intelligent Nurse Matching"
                            >
                              <Sparkles size={12} className="text-teal-400" />
                              <span>{req.assignedNurseId ? 'Change Nurse' : 'Match Nurse'}</span>
                            </button>

                            {/* View Full Request */}
                            <button
                              onClick={() => setViewingRequest(req)}
                              className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NURSE MANAGEMENT & VERIFICATION ROSTER */}
        {activeTab === 'nurses' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={nurseSearchQuery}
                  onChange={(e) => setNurseSearchQuery(e.target.value)}
                  placeholder="Search name, license number, council..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {['all', 'pending_verification', 'verified', 'suspended', 'rejected'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setNurseStatusFilter(st)}
                      className={`px-2.5 py-1 font-medium rounded-md whitespace-nowrap transition-colors capitalize ${
                        nurseStatusFilter === st
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Nurse Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Clinician Name</th>
                    <th className="py-2.5 px-3">License & Council</th>
                    <th className="py-2.5 px-3">Qualification & Exp</th>
                    <th className="py-2.5 px-3">Verification Status</th>
                    <th className="py-2.5 px-3">Working Zones</th>
                    <th className="py-2.5 px-3">Duty Status</th>
                    <th className="py-2.5 px-3">Uploaded Docs</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNurses.map((nurse) => (
                    <tr key={nurse.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {nurse.fullName.split(' ')[0][0]}
                            {nurse.fullName.split(' ')[1]?.[0] || ''}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{nurse.fullName}</div>
                            <div className="text-[11px] text-slate-500">{nurse.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900">{nurse.licenseNumber}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {nurse.issuingCouncil}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{nurse.qualification}</div>
                        <div className="text-[11px] text-slate-500">{nurse.yearsOfExperience}y practice</div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <NurseStatusBadge status={nurse.verificationStatus} size="sm" />
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-700 truncate max-w-[130px]">
                          {nurse.preferredWorkingAreas.join(', ')}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-medium ${
                            nurse.availability.isActiveOnDuty
                              ? 'text-emerald-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {nurse.availability.isActiveOnDuty ? '● Active On-Duty' : '○ Inactive'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-slate-600">
                          <FileCheck size={14} className="text-teal-700" />
                          <span>{nurse.documents.length} files</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setReviewingNurse(nurse)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shadow-2xs ${
                            nurse.verificationStatus === 'pending_verification'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {nurse.verificationStatus === 'pending_verification'
                            ? 'Review & Verify'
                            : 'View Credentials'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PATIENT DIRECTORY */}
        {activeTab === 'patients' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                  placeholder="Search patient name, phone, conditions..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Contact & Address</th>
                    <th className="py-2.5 px-3">Emergency Contact</th>
                    <th className="py-2.5 px-3">Chronic Conditions</th>
                    <th className="py-2.5 px-3">Active Requests</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => {
                    const activeCount = requests.filter(
                      (r) => r.patientId === patient.id && !['completed', 'cancelled'].includes(r.status)
                    ).length;

                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{patient.fullName}</div>
                          <div className="text-[11px] text-slate-500">{patient.email}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div>Age {patient.age}</div>
                          <div className="text-slate-500">{patient.gender}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{patient.phone}</div>
                          <div className="text-slate-500 truncate max-w-[140px] text-[11px]">
                            {patient.address}, {patient.districtZone}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div>{patient.emergencyContact.fullName}</div>
                          <div className="text-slate-500 text-[11px]">
                            {patient.emergencyContact.relationship} · {patient.emergencyContact.phone}
                          </div>
                        </td>

                        <td className="py-3 px-3 max-w-[180px]">
                          <div className="truncate text-slate-700">
                            {patient.medicalInfo.chronicConditions.join(', ') || 'None'}
                          </div>
                          {patient.medicalInfo.allergies.length > 0 && (
                            <span className="text-[10px] text-rose-700 block truncate">
                              Allergies: {patient.medicalInfo.allergies.join(', ')}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              activeCount > 0 ? 'bg-teal-50 text-teal-800' : 'text-slate-400'
                            }`}
                          >
                            {activeCount} active
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`text-[11px] font-semibold uppercase ${
                              patient.status === 'active' ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {patient.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setViewingPatient(patient)}
                            className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Modals */}
      <AdminAssignNurseModal
        request={matchingRequest}
        onClose={() => setMatchingRequest(null)}
      />

      <AdminNurseReviewModal
        nurse={reviewingNurse}
        onClose={() => setReviewingNurse(null)}
      />

      <AdminPatientDetailModal
        patient={viewingPatient}
        onClose={() => setViewingPatient(null)}
        onSelectRequest={(reqId) => {
          const r = requests.find((item) => item.id === reqId);
          if (r) {
            setViewingPatient(null);
            setViewingRequest(r);
          }
        }}
      />

      <PatientRequestDetailModal
        request={viewingRequest}
        onClose={() => setViewingRequest(null)}
      />
    </div>
  );
};
