import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  PatientProfile,
  NurseProfile,
  ServiceRequest,
  NotificationItem,
  RequestStatus,
  VisitVitals,
  DocumentItem,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_NURSES,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ADMIN_EMAILS = [
  'aaryankochale@gmail.com',
  'kochaleaaryan@gmail.com',
  'admin@curahome.health',
  'admin@gmail.com',
];

export function checkIsAdminEmail(email: string): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(e) ||
    e.startsWith('admin') ||
    e.includes('admin@') ||
    e.endsWith('@admin.com')
  );
}

interface AppContextType {
  // Active identity & view
  isAuthenticated: boolean;
  currentUserEmail: string;
  setCurrentUserEmail: (email: string) => void;
  adminEmails: string[];
  isAdminEmail: (email: string) => boolean;
  loginWithEmail: (email: string, password?: string) => { isNewUser: boolean; role?: UserRole };
  login: (role: UserRole, id?: string) => void;
  logout: () => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  activeNurseId: string;
  setActiveNurseId: (id: string) => void;

  // Active records
  currentPatient: PatientProfile | undefined;
  currentNurse: NurseProfile | undefined;

  // Global collections
  patients: PatientProfile[];
  nurses: NurseProfile[];
  requests: ServiceRequest[];
  notifications: NotificationItem[];

  // Modals & UI triggers
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  previewDocument: DocumentItem | null;
  setPreviewDocument: (doc: DocumentItem | null) => void;

  // Patient Actions
  createPatientAccount: (data: Partial<PatientProfile>) => PatientProfile;
  createServiceRequest: (
    data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>
  ) => ServiceRequest;
  updatePatientProfile: (patientId: string, data: Partial<PatientProfile>) => void;
  cancelRequest: (requestId: string, reason?: string) => void;
  submitFeedback: (requestId: string, rating: number, comment: string) => void;

  // Nurse Actions
  registerNurse: (
    data: Omit<
      NurseProfile,
      'id' | 'verificationStatus' | 'rating' | 'completedVisitsCount' | 'createdAt'
    >
  ) => NurseProfile;
  updateNurseProfile: (nurseId: string, data: Partial<NurseProfile>) => void;
  toggleNurseDuty: (nurseId: string, onDuty: boolean) => void;
  acceptRequest: (requestId: string, nurseId: string) => void;
  declineRequest: (requestId: string, nurseId: string, reason?: string) => void;
  startVisit: (requestId: string) => void;
  completeVisit: (requestId: string, vitals: VisitVitals) => void;

  // Admin Actions
  verifyNurse: (nurseId: string, notes?: string) => void;
  rejectNurse: (nurseId: string, reason: string) => void;
  suspendNurse: (nurseId: string, reason: string) => void;
  reactivateNurse: (nurseId: string) => void;
  assignNurseToRequest: (requestId: string, nurseId: string) => void;
  unassignNurseFromRequest: (requestId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string) => void;
  togglePatientStatus: (patientId: string) => void;
  addAdminNote: (requestId: string, note: string) => void;

  // Authentication Actions
  signUpWithSupabase: (
    email: string,
    password?: string,
    fullName?: string
  ) => Promise<{ success: boolean; isNewUser?: boolean; role?: UserRole; needsVerification?: boolean; error?: string }>;
  signInWithSupabase: (
    email: string,
    password?: string
  ) => Promise<{
    success: boolean;
    isNewUser?: boolean;
    role?: UserRole;
    needsVerification?: boolean;
    error?: string;
  }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmailOtp: (
    email: string,
    token: string
  ) => Promise<{ success: boolean; isNewUser?: boolean; role?: UserRole; error?: string }>;
  verificationNotice: string | null;
  setVerificationNotice: (notice: string | null) => void;
  signInWithGoogle: (email?: string, name?: string) => Promise<void>;
  loginWithGoogleUser: (email: string, fullName?: string) => { isNewUser: boolean; role?: UserRole };


  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetAllData: () => void;
}

const STORAGE_KEY_PREFIX = 'curahome_app_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}isAuthenticated`) === 'true';
  });

  const [currentUserEmail, setCurrentUserEmailState] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUserEmail`) || '';
  });

  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const setCurrentUserEmail = (email: string) => {
    setCurrentUserEmailState(email);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUserEmail`, email);
  };

  // Load or fallback to initial seed data
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}activeRole`) as UserRole) || 'admin';
  });

  const [activePatientId, setActivePatientIdState] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}activePatientId`) || 'pat-1';
  });

  const [activeNurseId, setActiveNurseIdState] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}activeNurseId`) || 'nurse-1';
  });

  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}patients`);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [nurses, setNurses] = useState<NurseProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}nurses`);
    return saved ? JSON.parse(saved) : INITIAL_NURSES;
  });

  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI modal states
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}isAuthenticated`, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}activeRole`, activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}activePatientId`, activePatientId);
  }, [activePatientId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}activeNurseId`, activeNurseId);
  }, [activeNurseId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}patients`, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}nurses`, JSON.stringify(nurses));
  }, [nurses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}requests`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  const setActiveRole = (role: UserRole) => setActiveRoleState(role);
  const setActivePatientId = (id: string) => setActivePatientIdState(id);
  const setActiveNurseId = (id: string) => setActiveNurseIdState(id);

  const loginWithEmail = (email: string, password?: string): { isNewUser: boolean; role?: UserRole } => {
    const cleanEmail = email.trim().toLowerCase();
    setCurrentUserEmail(cleanEmail);

    // 1. Check if Admin Email
    if (checkIsAdminEmail(cleanEmail)) {
      setActiveRoleState('admin');
      setIsAuthenticated(true);
      return { isNewUser: false, role: 'admin' };
    }

    // 2. Check if Patient Email
    const patientMatch = patients.find((p) => p.email.toLowerCase() === cleanEmail);
    if (patientMatch) {
      setActiveRoleState('patient');
      setActivePatientIdState(patientMatch.id);
      setIsAuthenticated(true);
      return { isNewUser: false, role: 'patient' };
    }

    // 3. Check if Nurse Email
    const nurseMatch = nurses.find((n) => n.email.toLowerCase() === cleanEmail);
    if (nurseMatch) {
      setActiveRoleState('nurse');
      setActiveNurseIdState(nurseMatch.id);
      setIsAuthenticated(true);
      return { isNewUser: false, role: 'nurse' };
    }

    // 4. New Unregistered User -> Needs Onboarding Choice ("Are you a Nurse or a Patient?")
    return { isNewUser: true };
  };

  const signUpWithSupabase = async (
    email: string,
    password?: string,
    fullName?: string
  ): Promise<{ success: boolean; isNewUser?: boolean; role?: UserRole; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    setCurrentUserEmail(cleanEmail);

    if (isSupabaseConfigured && password) {
      const redirectUrl = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in instead.',
        };
      }
    }

    const res = loginWithEmail(cleanEmail, password);
    return { success: true, isNewUser: res.isNewUser, role: res.role };
  };

  const signInWithSupabase = async (
    email: string,
    password?: string
  ): Promise<{
    success: boolean;
    isNewUser?: boolean;
    role?: UserRole;
    error?: string;
  }> => {
    const cleanEmail = email.trim().toLowerCase();
    setCurrentUserEmail(cleanEmail);

    if (!password || !password.trim()) {
      return { success: false, error: 'Please enter your password.' };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        return {
          success: false,
          error:
            error.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please check your credentials or click "Create Account".'
              : error.message,
        };
      }
    } else {
      if (
        !checkIsAdminEmail(cleanEmail) &&
        !patients.some((p) => p.email.toLowerCase() === cleanEmail) &&
        !nurses.some((n) => n.email.toLowerCase() === cleanEmail)
      ) {
        return {
          success: false,
          error: 'Account not found. Please create an account to sign up.',
        };
      }
    }

    const res = loginWithEmail(cleanEmail, password);
    return { success: true, isNewUser: res.isNewUser, role: res.role };
  };

  const resendVerificationEmail = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your Email Address.' };
    }

    if (isSupabaseConfigured) {
      const redirectUrl = window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  };

  const sendEmailOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your Email Address.' };
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  };

  const verifyEmailOtp = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; isNewUser?: boolean; role?: UserRole; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (!cleanToken || cleanToken.length < 6) {
      return { success: false, error: 'Please enter the complete 6-digit OTP code.' };
    }

    if (isSupabaseConfigured) {
      let { error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'signup',
      });

      if (error) {
        const resEmail = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'email',
        });
        error = resEmail.error;
      }

      if (error) {
        return {
          success: false,
          error: 'Invalid or expired 6-digit verification code. Please check your email inbox.',
        };
      }
    }

    setVerificationNotice('Email verified successfully via OTP! Welcome to CuraHome.');
    const res = loginWithEmail(cleanEmail);
    return { success: true, isNewUser: res.isNewUser, role: res.role };
  };

  const loginWithGoogleUser = (email: string, fullName?: string): { isNewUser: boolean; role?: UserRole } => {
    const cleanEmail = email.trim().toLowerCase();
    setCurrentUserEmail(cleanEmail);

    // 1. Check if Admin Email
    if (checkIsAdminEmail(cleanEmail)) {
      setActiveRoleState('admin');
      setIsAuthenticated(true);
      return { isNewUser: false, role: 'admin' };
    }

    // 2. Check if Patient Email
    const patientMatch = patients.find((p) => p.email.toLowerCase() === cleanEmail);
    if (patientMatch) {
      setActiveRoleState('patient');
      setActivePatientIdState(patientMatch.id);
      setIsAuthenticated(true);
      return { isNewUser: false, role: 'patient' };
    }

    // 3. Check if Nurse Email
    const nurseMatch = nurses.find((n) => n.email.toLowerCase() === cleanEmail);
    if (nurseMatch) {
      setActiveRoleState('nurse');
      setActiveNurseIdState(nurseMatch.id);
      setIsAuthenticated(true);
      return { isNewUser: false, role: 'nurse' };
    }

    // 4. New Google User -> Create profile automatically as Patient and log in immediately!
    const rawName = fullName || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const newPatient: PatientProfile = {
      id: `pat-g-${Date.now()}`,
      fullName: formattedName,
      email: cleanEmail,
      phone: '+91 98765 43210',
      age: 35,
      gender: 'Female',
      address: '101 Healthcare Marg, Bandra West',
      city: 'Mumbai',
      districtZone: 'Bandra & Suburbs (Mumbai)',
      emergencyContact: {
        fullName: 'Emergency Contact',
        phone: '+91 98765 99999',
        relationship: 'Family',
      },
      medicalInfo: {
        bloodGroup: 'O+',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
      },
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setPatients((prev) => [newPatient, ...prev]);
    setActivePatientIdState(newPatient.id);
    setActiveRoleState('patient');
    setIsAuthenticated(true);

    if (isSupabaseConfigured) {
      supabase.from('patients').insert([
        {
          id: newPatient.id,
          full_name: newPatient.fullName,
          email: newPatient.email,
          phone: newPatient.phone,
          age: newPatient.age,
          gender: newPatient.gender,
          address: newPatient.address,
          city: newPatient.city,
          district_zone: newPatient.districtZone,
          emergency_contact: newPatient.emergencyContact,
          medical_info: newPatient.medicalInfo,
          status: newPatient.status,
          created_at: newPatient.createdAt,
        },
      ]).then(({ error }) => {
        if (error) console.error('Supabase error saving Google patient:', error.message);
      });
    }

    return { isNewUser: true, role: 'patient' };
  };

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        console.error('Supabase Google OAuth Error:', error.message);
      }
    } else {
      loginWithGoogleUser('kochaleaaryan@gmail.com');
    }
  };

  const login = (role: UserRole, id?: string) => {
    setActiveRoleState(role);
    if (role === 'patient' && id) setActivePatientIdState(id);
    if (role === 'nurse' && id) setActiveNurseIdState(id);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setIsAuthenticated(false);
  };

  // Initial fetch and OAuth / Email verification listener from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Listen for auth state changes (OAuth Redirects & Email Verification Callback)
      const { data: authSubscription } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user?.email) {
          const isConfirmed = Boolean(
            session.user.email_confirmed_at ||
              session.user.confirmed_at ||
              session.user.app_metadata?.provider === 'google'
          );

          if (isConfirmed) {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
              setVerificationNotice('Email verified successfully! You can now continue.');
            }
            loginWithGoogleUser(
              session.user.email,
              session.user.user_metadata?.full_name || session.user.user_metadata?.name
            );
            if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            await supabase.auth.signOut().catch(() => {});
          }
        }
      });

      // Fetch Patients
      supabase
        .from('patients')
        .select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped: PatientProfile[] = data.map((d: any) => ({
              id: d.id,
              fullName: d.full_name || d.fullName,
              email: d.email,
              phone: d.phone,
              age: d.age,
              gender: d.gender,
              address: d.address,
              city: d.city,
              districtZone: d.district_zone || d.districtZone,
              emergencyContact: d.emergency_contact || d.emergencyContact || { fullName: '', phone: '', relationship: '' },
              medicalInfo: d.medical_info || d.medicalInfo || { bloodGroup: 'O+', allergies: [], chronicConditions: [], currentMedications: [] },
              status: d.status || 'active',
              createdAt: d.created_at || d.createdAt || new Date().toISOString(),
            }));
            setPatients(mapped);
          }
        });

      // Fetch Nurses
      supabase
        .from('nurses')
        .select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped: NurseProfile[] = data.map((d: any) => ({
              id: d.id,
              fullName: d.full_name || d.fullName,
              email: d.email,
              phone: d.phone,
              dob: d.dob || '1995-01-01',
              address: d.address || '123 Care Street',
              city: d.city || 'Metro City',
              districtZone: d.district_zone || d.districtZone || 'North District',
              qualification: d.qualification || 'B.Sc Nursing',
              qualificationDetails: d.qualification_details || d.qualificationDetails || '',
              licenseNumber: d.license_number || d.licenseNumber || 'RN-00000',
              issuingCouncil: d.issuing_council || d.issuingCouncil || 'State Medical Council',
              yearsOfExperience: d.years_of_experience || d.yearsOfExperience || 1,
              areasOfExpertise: d.areas_of_expertise || d.areasOfExpertise || [],
              preferredWorkingAreas: d.preferred_working_areas || d.preferredWorkingAreas || [],
              verificationStatus: d.verification_status || d.verificationStatus || 'pending_verification',
              rating: d.rating || 0,
              completedVisitsCount: d.completed_visits_count || d.completedVisitsCount || 0,
              emergencyContact: d.emergency_contact || d.emergencyContact || { fullName: 'Emergency Contact', phone: d.phone, relationship: 'Family' },
              createdAt: d.created_at || d.createdAt || new Date().toISOString(),
              documents: d.documents || [],
              availability: d.availability || { isActiveOnDuty: true, workingDays: [], shiftPreference: 'flexible' },
            }));
            setNurses(mapped);
          }
        });

      // Fetch Requests
      supabase
        .from('service_requests')
        .select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped: ServiceRequest[] = data.map((d: any) => ({
              id: d.id,
              patientId: d.patient_id || d.patientId,
              patientName: d.patient_name || d.patientName,
              patientPhone: d.patient_phone || d.patientPhone,
              patientAge: d.patient_age || d.patientAge,
              patientGender: d.patient_gender || d.patientGender,
              serviceType: d.service_type || d.serviceType,
              title: d.title,
              description: d.description,
              priority: d.priority,
              preferredDate: d.preferred_date || d.preferredDate,
              preferredTimeSlot: d.preferred_time_slot || d.preferredTimeSlot,
              specificTime: d.specific_time || d.specificTime,
              duration: d.duration,
              locationAddress: d.location_address || d.locationAddress,
              locationDistrictZone: d.location_district_zone || d.locationDistrictZone,
              documents: d.documents || [],
              status: d.status,
              assignedNurseId: d.assigned_nurse_id || d.assignedNurseId,
              assignedNurseName: d.assigned_nurse_name || d.assignedNurseName,
              createdAt: d.created_at || d.createdAt,
              adminNotes: d.admin_notes || d.adminNotes,
            }));
            setRequests(mapped);
          }
        });
    }
  }, []);

  const createPatientAccount = (data: Partial<PatientProfile>): PatientProfile => {
    const newPatient: PatientProfile = {
      id: `pat-${Date.now()}`,
      fullName: data.fullName || 'New Patient',
      email: data.email || 'patient@example.com',
      phone: data.phone || '+91 98765 43210',
      age: data.age || 45,
      gender: data.gender || 'Female',
      address: data.address || '123 Care Road, Bandra West',
      city: data.city || 'Mumbai',
      districtZone: data.districtZone || 'Bandra & Suburbs (Mumbai)',
      emergencyContact: data.emergencyContact || {
        fullName: 'Emergency Contact',
        phone: '+91 98765 99999',
        relationship: 'Family',
      },
      medicalInfo: data.medicalInfo || {
        bloodGroup: 'O+',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
      },
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setPatients((prev) => [newPatient, ...prev]);

    if (isSupabaseConfigured) {
      supabase
        .from('patients')
        .insert([
          {
            id: newPatient.id,
            full_name: newPatient.fullName,
            email: newPatient.email,
            phone: newPatient.phone,
            age: newPatient.age,
            gender: newPatient.gender,
            address: newPatient.address,
            city: newPatient.city,
            district_zone: newPatient.districtZone,
            emergency_contact: newPatient.emergencyContact,
            medical_info: newPatient.medicalInfo,
            status: newPatient.status,
            created_at: newPatient.createdAt,
          },
        ])
        .then(({ error }) => {
          if (error) console.error('Supabase error saving patient:', error.message);
        });
    }

    return newPatient;
  };

  const currentPatient = patients.find((p) => p.id === activePatientId) || patients[0];
  const currentNurse = nurses.find((n) => n.id === activeNurseId) || nurses[0];

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // --- PATIENT ACTIONS ---
  const createServiceRequest = (
    data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>
  ): ServiceRequest => {
    const newRequest: ServiceRequest = {
      ...data,
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);

    if (isSupabaseConfigured) {
      supabase
        .from('service_requests')
        .insert([
          {
            id: newRequest.id,
            patient_id: newRequest.patientId,
            patient_name: newRequest.patientName,
            patient_phone: newRequest.patientPhone,
            patient_age: newRequest.patientAge,
            patient_gender: newRequest.patientGender,
            service_type: newRequest.serviceType,
            title: newRequest.title,
            description: newRequest.description,
            priority: newRequest.priority,
            preferred_date: newRequest.preferredDate,
            preferred_time_slot: newRequest.preferredTimeSlot,
            specific_time: newRequest.specificTime,
            duration: newRequest.duration,
            location_address: newRequest.locationAddress,
            location_district_zone: newRequest.locationDistrictZone,
            status: newRequest.status,
            created_at: newRequest.createdAt,
          },
        ])
        .then(({ error }) => {
          if (error) console.error('Supabase error saving service request:', error.message);
        });
    }

    // Notify Admin
    addNotification({
      targetRole: 'admin',
      title: 'New Service Request Submitted',
      message: `${newRequest.patientName} requested ${newRequest.title} (${newRequest.priority.toUpperCase()}) in ${newRequest.locationDistrictZone}.`,
      type: newRequest.priority === 'urgent' ? 'alert' : 'info',
      linkRequestId: newRequest.id,
    });

    // Notify Patient
    addNotification({
      targetRole: 'patient',
      targetUserId: newRequest.patientId,
      title: 'Service Request Submitted Successfully',
      message: `Your request (${newRequest.id}) has been submitted and is pending clinical review by Admin.`,
      type: 'success',
      linkRequestId: newRequest.id,
    });

    return newRequest;
  };

  const updatePatientProfile = (patientId: string, data: Partial<PatientProfile>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...data } : p))
    );
  };

  const cancelRequest = (requestId: string, reason?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'cancelled',
              adminNotes: reason ? `${r.adminNotes || ''} [Cancelled: ${reason}]` : r.adminNotes,
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      addNotification({
        targetRole: 'admin',
        title: `Request ${req.id} Cancelled`,
        message: `Request for ${req.patientName} was cancelled.`,
        type: 'warning',
        linkRequestId: req.id,
      });

      if (req.assignedNurseId) {
        addNotification({
          targetRole: 'nurse',
          targetUserId: req.assignedNurseId,
          title: `Assignment Cancelled: ${req.id}`,
          message: `The home visit for ${req.patientName} scheduled for ${req.preferredDate} was cancelled.`,
          type: 'warning',
          linkRequestId: req.id,
        });
      }
    }
  };

  const submitFeedback = (requestId: string, rating: number, comment: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              patientFeedback: {
                rating,
                comment,
                submittedAt: new Date().toISOString(),
              },
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req?.assignedNurseId) {
      // Update nurse rating
      setNurses((prev) =>
        prev.map((n) => {
          if (n.id === req.assignedNurseId) {
            const currentTotal = n.rating * (n.completedVisitsCount || 1);
            const newCount = n.completedVisitsCount + 1;
            const newRating = Number(((currentTotal + rating) / newCount).toFixed(2));
            return {
              ...n,
              rating: newRating,
              completedVisitsCount: newCount,
            };
          }
          return n;
        })
      );

      addNotification({
        targetRole: 'nurse',
        targetUserId: req.assignedNurseId,
        title: 'New Patient Feedback Received',
        message: `Rated ${rating} ★ by ${req.patientName}: "${comment.substring(0, 60)}${comment.length > 60 ? '...' : ''}"`,
        type: 'success',
        linkRequestId: req.id,
      });
    }
  };

  // --- NURSE ACTIONS ---
  const registerNurse = (
    data: Omit<
      NurseProfile,
      'id' | 'verificationStatus' | 'rating' | 'completedVisitsCount' | 'createdAt'
    >
  ): NurseProfile => {
    const newNurse: NurseProfile = {
      ...data,
      id: `nurse-${Date.now()}`,
      verificationStatus: 'pending_verification',
      rating: 0,
      completedVisitsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setNurses((prev) => [newNurse, ...prev]);
    setActiveNurseId(newNurse.id);

    if (isSupabaseConfigured) {
      supabase
        .from('nurses')
        .insert([
          {
            id: newNurse.id,
            full_name: newNurse.fullName,
            email: newNurse.email,
            phone: newNurse.phone,
            dob: newNurse.dob,
            address: newNurse.address,
            qualification: newNurse.qualification,
            qualification_details: newNurse.qualificationDetails,
            license_number: newNurse.licenseNumber,
            issuing_council: newNurse.issuingCouncil,
            years_of_experience: newNurse.yearsOfExperience,
            areas_of_expertise: newNurse.areasOfExpertise,
            preferred_working_areas: newNurse.preferredWorkingAreas,
            verification_status: newNurse.verificationStatus,
            rating: newNurse.rating,
            completed_visits_count: newNurse.completedVisitsCount,
            created_at: newNurse.createdAt,
            documents: newNurse.documents,
            availability: newNurse.availability,
          },
        ])
        .then(({ error }) => {
          if (error) console.error('Supabase error saving nurse:', error.message);
        });
    }

    // Notify Admin
    addNotification({
      targetRole: 'admin',
      title: 'New Nurse Registration Awaiting Verification',
      message: `${newNurse.fullName} (${newNurse.qualification}, ${newNurse.yearsOfExperience} yrs exp) registered. License: ${newNurse.licenseNumber}. Review required.`,
      type: 'warning',
    });

    return newNurse;
  };

  const updateNurseProfile = (nurseId: string, data: Partial<NurseProfile>) => {
    setNurses((prev) =>
      prev.map((n) => (n.id === nurseId ? { ...n, ...data } : n))
    );
  };

  const toggleNurseDuty = (nurseId: string, onDuty: boolean) => {
    setNurses((prev) =>
      prev.map((n) =>
        n.id === nurseId
          ? {
              ...n,
              availability: { ...n.availability, isActiveOnDuty: onDuty },
            }
          : n
      )
    );
  };

  const acceptRequest = (requestId: string, nurseId: string) => {
    const nurse = nurses.find((n) => n.id === nurseId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'accepted',
              acceptedAt: new Date().toISOString(),
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      // Notify Patient
      addNotification({
        targetRole: 'patient',
        targetUserId: req.patientId,
        title: 'Nurse Confirmed Your Appointment',
        message: `${nurse?.fullName || 'Assigned Nurse'} accepted your request for ${req.preferredDate}.`,
        type: 'success',
        linkRequestId: req.id,
      });

      // Notify Admin
      addNotification({
        targetRole: 'admin',
        title: 'Nurse Accepted Request',
        message: `${nurse?.fullName} confirmed home visit for ${req.patientName} (${req.id}).`,
        type: 'info',
        linkRequestId: req.id,
      });
    }
  };

  const declineRequest = (requestId: string, nurseId: string, reason?: string) => {
    const nurse = nurses.find((n) => n.id === nurseId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              assignedNurseId: undefined,
              assignedNurseName: undefined,
              assignedAt: undefined,
              adminNotes: `${r.adminNotes || ''} [Rejected by ${nurse?.fullName || 'Nurse'}: ${reason || 'Schedule conflict'}]`,
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      addNotification({
        targetRole: 'admin',
        title: 'Nurse Rejected Assignment - Reassignment Required',
        message: `${nurse?.fullName || 'Nurse'} rejected assignment for request ${req.id} (${req.patientName}). Reason: ${reason || 'Schedule conflict'}. Please assign another verified nurse.`,
        type: 'alert',
        linkRequestId: req.id,
      });

      addNotification({
        targetRole: 'patient',
        targetUserId: req.patientId,
        title: 'Request Update: Reassigning Nurse',
        message: `Your assigned nurse had a schedule conflict. Our Admin team is assigning another verified nurse for your request (${req.id}).`,
        type: 'warning',
        linkRequestId: req.id,
      });
    }
  };

  const startVisit = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'in_progress',
              startedAt: new Date().toISOString(),
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      addNotification({
        targetRole: 'patient',
        targetUserId: req.patientId,
        title: 'Nurse Has Arrived & Started Visit',
        message: `Your home visit for "${req.title}" has started.`,
        type: 'info',
        linkRequestId: req.id,
      });
    }
  };

  const completeVisit = (requestId: string, vitals: VisitVitals) => {
    const now = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'completed',
              completedAt: now,
              visitVitals: {
                ...vitals,
                recordedAt: now,
              },
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      // Increment nurse completed count
      if (req.assignedNurseId) {
        setNurses((prev) =>
          prev.map((n) =>
            n.id === req.assignedNurseId
              ? { ...n, completedVisitsCount: n.completedVisitsCount + 1 }
              : n
          )
        );
      }

      // Notify Patient to review
      addNotification({
        targetRole: 'patient',
        targetUserId: req.patientId,
        title: 'Home Visit Completed',
        message: `Your home healthcare session has concluded. Clinical vitals recorded. Please leave a rating!`,
        type: 'success',
        linkRequestId: req.id,
      });

      // Notify Admin
      addNotification({
        targetRole: 'admin',
        title: 'Service Completed Successfully',
        message: `Home visit ${req.id} for ${req.patientName} marked completed by ${req.assignedNurseName}.`,
        type: 'success',
        linkRequestId: req.id,
      });
    }
  };

  // --- ADMIN ACTIONS ---
  const verifyNurse = (nurseId: string, notes?: string) => {
    const now = new Date().toISOString();
    setNurses((prev) =>
      prev.map((n) =>
        n.id === nurseId
          ? {
              ...n,
              verificationStatus: 'verified',
              verifiedAt: now,
              verificationNotes: notes || 'Verified credentials against primary state medical registry.',
              documents: n.documents.map((d) => ({ ...d, verified: true })),
              availability: { ...n.availability, isActiveOnDuty: true },
            }
          : n
      )
    );

    const nurse = nurses.find((n) => n.id === nurseId);
    if (nurse) {
      addNotification({
        targetRole: 'nurse',
        targetUserId: nurseId,
        title: 'Verification Approved! Your Profile is Active',
        message: `Congratulations ${nurse.fullName}! Admin has verified your credentials and license. You are now eligible to receive patient assignments.`,
        type: 'success',
      });
    }
  };

  const rejectNurse = (nurseId: string, reason: string) => {
    setNurses((prev) =>
      prev.map((n) =>
        n.id === nurseId
          ? {
              ...n,
              verificationStatus: 'rejected',
              verificationNotes: reason,
              availability: { ...n.availability, isActiveOnDuty: false },
            }
          : n
      )
    );

    addNotification({
      targetRole: 'nurse',
      targetUserId: nurseId,
      title: 'Verification Review Status Update',
      message: `Your registration was not approved: ${reason}`,
      type: 'alert',
    });
  };

  const suspendNurse = (nurseId: string, reason: string) => {
    setNurses((prev) =>
      prev.map((n) =>
        n.id === nurseId
          ? {
              ...n,
              verificationStatus: 'suspended',
              verificationNotes: reason,
              availability: { ...n.availability, isActiveOnDuty: false },
            }
          : n
      )
    );

    addNotification({
      targetRole: 'nurse',
      targetUserId: nurseId,
      title: 'Account Temporarily Suspended',
      message: `Your nurse account has been placed on hold: ${reason}`,
      type: 'warning',
    });
  };

  const reactivateNurse = (nurseId: string) => {
    setNurses((prev) =>
      prev.map((n) =>
        n.id === nurseId
          ? {
              ...n,
              verificationStatus: 'verified',
              verificationNotes: 'Account reactivated by Admin',
              availability: { ...n.availability, isActiveOnDuty: true },
            }
          : n
      )
    );
  };

  const assignNurseToRequest = (requestId: string, nurseId: string) => {
    const nurse = nurses.find((n) => n.id === nurseId);
    if (!nurse) return;

    // Safety guard: only verified nurses can be assigned
    if (nurse.verificationStatus !== 'verified') {
      alert('Only Verified nurses can be assigned to patients!');
      return;
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'nurse_assigned',
              assignedNurseId: nurse.id,
              assignedNurseName: nurse.fullName,
              assignedAt: new Date().toISOString(),
            }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      // Notify Nurse
      addNotification({
        targetRole: 'nurse',
        targetUserId: nurse.id,
        title: 'New Patient Visit Assigned',
        message: `You have been assigned to ${req.patientName} for "${req.title}" on ${req.preferredDate}. Please review and accept.`,
        type: 'info',
        linkRequestId: req.id,
      });

      // Notify Patient
      addNotification({
        targetRole: 'patient',
        targetUserId: req.patientId,
        title: 'Qualified Nurse Assigned',
        message: `Admin has assigned ${nurse.fullName} (${nurse.qualification}) to your request. Waiting for appointment confirmation.`,
        type: 'success',
        linkRequestId: req.id,
      });
    }
  };

  const unassignNurseFromRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'under_review',
              assignedNurseId: undefined,
              assignedNurseName: undefined,
              assignedAt: undefined,
            }
          : r
      )
    );

    if (req?.assignedNurseId) {
      addNotification({
        targetRole: 'nurse',
        targetUserId: req.assignedNurseId,
        title: 'Assignment Reassigned',
        message: `Request ${req.id} for ${req.patientName} was reassigned by platform admin.`,
        type: 'info',
        linkRequestId: req.id,
      });
    }
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus, note?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              adminNotes: note ? `${r.adminNotes || ''}\n[Status Change to ${status}: ${note}]` : r.adminNotes,
            }
          : r
      )
    );
  };

  const togglePatientStatus = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' }
          : p
      )
    );
  };

  const addAdminNote = (requestId: string, note: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              adminNotes: r.adminNotes ? `${r.adminNotes}\n${note}` : note,
            }
          : r
      )
    );
  };

  // --- NOTIFICATIONS ---
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setNurses(INITIAL_NURSES);
    setRequests(INITIAL_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveRoleState('admin');
    setActivePatientIdState('pat-1');
    setActiveNurseIdState('nurse-1');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUserEmail,
        setCurrentUserEmail,
        adminEmails: ADMIN_EMAILS,
        isAdminEmail: checkIsAdminEmail,
        loginWithEmail,
        signUpWithSupabase,
        signInWithSupabase,
        resendVerificationEmail,
        sendEmailOtp,
        verifyEmailOtp,
        verificationNotice,
        setVerificationNotice,
        signInWithGoogle,
        loginWithGoogleUser,
        login,
        logout,
        createPatientAccount,
        activeRole,
        setActiveRole,
        activePatientId,
        setActivePatientId,
        activeNurseId,
        setActiveNurseId,
        currentPatient,
        currentNurse,
        patients,
        nurses,
        requests,
        notifications,
        isRoleSwitcherOpen,
        setIsRoleSwitcherOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        previewDocument,
        setPreviewDocument,
        createServiceRequest,
        updatePatientProfile,
        cancelRequest,
        submitFeedback,
        registerNurse,
        updateNurseProfile,
        toggleNurseDuty,
        acceptRequest,
        declineRequest,
        startVisit,
        completeVisit,
        verifyNurse,
        rejectNurse,
        suspendNurse,
        reactivateNurse,
        assignNurseToRequest,
        unassignNurseFromRequest,
        updateRequestStatus,
        togglePatientStatus,
        addAdminNote,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
