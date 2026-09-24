import React from 'react';
import { RequestStatus, NurseVerificationStatus, Priority } from '../../types';
import {
  Clock,
  Search,
  UserCheck,
  CheckCircle2,
  Activity,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';

interface RequestStatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md';
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const iconSize = isSm ? 13 : 15;

  switch (status) {
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-amber-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <Clock size={iconSize} className="text-amber-600" />
          Pending Review
        </span>
      );
    case 'under_review':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-sky-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <Search size={iconSize} className="text-sky-600" />
          Under Review
        </span>
      );
    case 'nurse_assigned':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-indigo-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <UserCheck size={iconSize} className="text-indigo-600" />
          Nurse Assigned
        </span>
      );
    case 'accepted':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-teal-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <CheckCircle2 size={iconSize} className="text-teal-600" />
          Accepted / Confirmed
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-emerald-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          In Progress
        </span>
      );
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-emerald-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <ShieldCheck size={iconSize} className="text-emerald-600" />
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-slate-500 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <XCircle size={iconSize} className="text-slate-400" />
          Cancelled
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-rose-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <XCircle size={iconSize} className="text-rose-600" />
          Nurse Rejected
        </span>
      );
    default:
      return <span className="text-xs text-slate-600">{status}</span>;
  }
};

interface NurseStatusBadgeProps {
  status: NurseVerificationStatus;
  size?: 'sm' | 'md';
}

export const NurseStatusBadge: React.FC<NurseStatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const iconSize = isSm ? 13 : 15;

  switch (status) {
    case 'verified':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-teal-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <ShieldCheck size={iconSize} className="text-teal-600" />
          Verified Nurse
        </span>
      );
    case 'pending_verification':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-amber-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <AlertTriangle size={iconSize} className="text-amber-600" />
          Verification Pending
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-rose-800 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <XCircle size={iconSize} className="text-rose-600" />
          Rejected
        </span>
      );
    case 'suspended':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-slate-600 ${isSm ? 'text-xs' : 'text-sm'}`}>
          <ShieldAlert size={iconSize} className="text-slate-500" />
          Suspended
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
          <AlertCircle size={12} className="text-rose-600" />
          Urgent Visit
        </span>
      );
    case 'emergency_note':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700">
          <AlertTriangle size={12} className="text-red-600" />
          Immediate Care Needed
        </span>
      );
    case 'routine':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
          <Activity size={12} className="text-slate-400" />
          Routine Care
        </span>
      );
  }
};
