export type UserRole = 'admin' | 'nurse' | 'patient';

export type RequestStatus =
  | 'pending'
  | 'under_review'
  | 'nurse_assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type NurseVerificationStatus =
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'suspended';

export type ServiceType =
  | 'injection_medication'
  | 'wound_dressing'
  | 'post_surgery'
  | 'elderly_care'
  | 'iv_therapy'
  | 'basic_nursing'
  | 'recovery_assistance'
  | 'other';

export type Priority = 'routine' | 'urgent' | 'emergency_note';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface DocumentItem {
  id: string;
  name: string;
  type: string; // 'nursing_license' | 'degree_certificate' | 'id_proof' | 'prescription' | 'discharge_summary' | 'other'
  uploadedAt: string;
  fileSize: string;
  fileUrl?: string;
  verified?: boolean;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  address: string;
  city: string;
  districtZone: string;
  emergencyContact: {
    fullName: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: {
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: string[];
    mobilityNotes?: string;
  };
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface NurseProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  districtZone: string;
  qualification: string; // e.g. "B.Sc Nursing", "GNM", "Nurse Practitioner"
  qualificationDetails: string; // e.g. "King's College London / St. Jude Medical Institute"
  licenseNumber: string; // e.g. "RN-48912-NY"
  issuingCouncil: string; // e.g. "State Nursing & Midwifery Council"
  yearsOfExperience: number;
  areasOfExpertise: ServiceType[];
  preferredWorkingAreas: string[];
  availability: {
    shifts: ('morning' | 'afternoon' | 'evening' | 'night')[];
    daysOfWeek: string[];
    isActiveOnDuty: boolean;
  };
  verificationStatus: NurseVerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  emergencyContact: {
    fullName: string;
    phone: string;
    relationship: string;
  };
  documents: DocumentItem[];
  rating: number;
  completedVisitsCount: number;
  createdAt: string;
}

export interface VisitVitals {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  spo2?: string;
  bloodSugar?: string;
  clinicalNotes?: string;
  recordedAt?: string;
}

export interface PatientFeedback {
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface ServiceRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  priority: Priority;
  preferredDate: string;
  preferredTimeSlot: TimeSlot;
  specificTime?: string;
  duration?: string;
  locationAddress: string;
  locationDistrictZone: string;
  locationLandmark?: string;
  specialInstructions?: string;
  documents: DocumentItem[];
  status: RequestStatus;
  assignedNurseId?: string;
  assignedNurseName?: string;
  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  visitVitals?: VisitVitals;
  patientFeedback?: PatientFeedback;
  adminNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  linkRequestId?: string;
}

export interface NurseMatchScore {
  nurse: NurseProfile;
  score: number; // 0 to 100
  breakdown: {
    locationMatch: boolean;
    expertiseMatch: boolean;
    availabilityMatch: boolean;
    experienceScore: number;
  };
  reasons: string[];
}
