import React, { useState } from 'react';
import { useApp, ADMIN_EMAILS } from '../../context/AppContext';
import { NurseRegistrationModal } from '../nurse/NurseRegistrationModal';
import {
  HeartPulse,
  ShieldCheck,
  User,
  Stethoscope,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  UserPlus,
  ShieldAlert,
  Activity,
  ChevronRight,
  Building,
  Heart,
  Calendar,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    loginWithEmail,
    login,
    patients,
    nurses,
    createPatientAccount,
    setActivePatientId,
    setActiveNurseId,
    isAdminEmail,
  } = useApp();

  // Screen State: 'login' | 'role_choice' | 'patient_form'
  const [screen, setScreen] = useState<'login' | 'role_choice' | 'patient_form'>('login');

  // Login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Patient Sign Up fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [address, setAddress] = useState('');
  const [districtZone, setDistrictZone] = useState('North District');

  // Modal for nurse application
  const [isNurseModalOpen, setIsNurseModalOpen] = useState(false);

  // Selected quick demo account
  const [selectedDemoEmail, setSelectedDemoEmail] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetEmail = selectedDemoEmail || email;
    if (!targetEmail.trim()) {
      setErrorMsg('Please enter your Email Address or Phone Number.');
      return;
    }

    const res = loginWithEmail(targetEmail, password);

    if (res.isNewUser) {
      // New user -> ask "Are you a Nurse or a Patient?"
      setScreen('role_choice');
    }
  };

  const handlePatientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in all required fields to complete registration.');
      return;
    }

    const created = createPatientAccount({
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone.trim(),
      age: Number(age) || 45,
      gender,
      address: address.trim(),
      districtZone,
    });

    setActivePatientId(created.id);
    login('patient', created.id);
  };

  const isCurrentEmailAdmin = isAdminEmail(email || selectedDemoEmail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/40 text-slate-900 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      {/* Top White Header */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs">
            <HeartPulse size={22} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
              CuraHome
            </span>
            <span className="text-[10px] text-teal-700 font-semibold tracking-wide uppercase">
              Accredited Healthcare Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck size={14} className="text-teal-700" /> 100% Board-Verified Nurses
          </span>
          <a
            href="tel:+15550009999"
            className="text-teal-800 font-bold hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200"
          >
            <Phone size={13} /> 24/7 Clinical Support
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Showcase */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-900 text-xs font-bold">
              <Sparkles size={14} className="text-teal-700" /> Home Healthcare & Clinical Dispatch
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hospital-Grade Nursing <br />
              <span className="text-teal-700">Delivered At Your Home</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
              Connect with qualified registered nurses for wound care, post-surgery recovery,
              IV therapy, and elderly health monitoring under clinical administrator oversight.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Patient Requirements</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Submit healthcare requests & view assigned nurse details.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Nurse Assignments</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Accept admin assigned shifts & log patient vitals.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Admin Panel Access</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Authorized admin emails unlock full dispatch operations.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Verified Quality</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    100% medical license primary-source verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pure White Sign-In / Onboarding Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
              {/* SCREEN 1: SINGLE UNIVERSAL SIGN IN */}
              {screen === 'login' && (
                <div>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Sign In to CuraHome</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your email or phone number to sign in or create an account.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0 text-rose-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Single Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address or Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={selectedDemoEmail || email}
                          onChange={(e) => {
                            setSelectedDemoEmail('');
                            setEmail(e.target.value);
                          }}
                          placeholder="e.g. name@example.com or +1 555-000-0000"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                        <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                        <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Admin Email Highlight Callout */}
                    {isCurrentEmailAdmin && (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-teal-700 shrink-0" />
                        <div>
                          <strong>Admin Email Identified:</strong> Access to Admin Operations Panel.
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Sign In / Continue</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>

                  {/* Demo Quick Sign-In Buttons */}
                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                      Quick Demo Accounts:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDemoEmail('eleanor.vance@example.com');
                          setEmail('eleanor.vance@example.com');
                          loginWithEmail('eleanor.vance@example.com');
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 bg-slate-50/60 text-left flex items-center justify-between text-xs transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-teal-700" />
                          <span className="font-bold text-slate-900">Eleanor Vance</span>
                          <span className="text-[10px] text-slate-500">Patient</span>
                        </div>
                        <span className="text-[10px] text-teal-700 font-semibold">Sign In →</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDemoEmail('sarah.jenkins@curahome.health');
                          setEmail('sarah.jenkins@curahome.health');
                          loginWithEmail('sarah.jenkins@curahome.health');
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 bg-slate-50/60 text-left flex items-center justify-between text-xs transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Stethoscope size={14} className="text-teal-700" />
                          <span className="font-bold text-slate-900">Sarah Jenkins, RN</span>
                          <span className="text-[10px] text-slate-500">Nurse</span>
                        </div>
                        <span className="text-[10px] text-teal-700 font-semibold">Sign In →</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDemoEmail('kochaleaaryan@gmail.com');
                          setEmail('kochaleaaryan@gmail.com');
                          loginWithEmail('kochaleaaryan@gmail.com');
                        }}
                        className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left flex items-center justify-between text-xs transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={14} className="text-amber-700" />
                          <span className="font-bold text-slate-900">kochaleaaryan@gmail.com</span>
                          <span className="text-[10px] text-amber-800 font-semibold">Admin Panel</span>
                        </div>
                        <span className="text-[10px] text-amber-800 font-bold">Admin Login →</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setScreen('role_choice')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                    >
                      New user? Register as Patient or Nurse
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 2: ROLE CHOICE ("Are you a Nurse or a Patient?") */}
              {screen === 'role_choice' && (
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800 mb-1">
                      Account Setup
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Are you a Nurse or a Patient?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Please select your role to proceed with account profile creation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Option A: Patient Card */}
                    <div
                      onClick={() => setScreen('patient_form')}
                      className="p-4 rounded-xl border-2 border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 transition-all cursor-pointer group flex items-start gap-3.5"
                    >
                      <div className="p-3 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                        <Heart size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                            I am a Patient / Client
                          </h3>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-teal-700" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          I want to request home nursing, wound dressing, post-op care, or elderly care for myself or a family member.
                        </p>
                      </div>
                    </div>

                    {/* Option B: Nurse Card */}
                    <div
                      onClick={() => setIsNurseModalOpen(true)}
                      className="p-4 rounded-xl border-2 border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 transition-all cursor-pointer group flex items-start gap-3.5"
                    >
                      <div className="p-3 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                        <Stethoscope size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                            I am a Registered Nurse
                          </h3>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-teal-700" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          I am a qualified nurse looking to apply, submit credentials, and provide home healthcare shifts.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setScreen('login')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 3: PATIENT ONBOARDING FORM */}
              {screen === 'patient_form' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Complete Patient Profile</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your details will be saved to arrange home nursing services.
                    </p>
                  </div>

                  <form onSubmit={handlePatientFormSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Marcus Bell"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          required
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Home Visit Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, unit/apartment number"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setScreen('role_choice')}
                        className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
                      >
                        Save Profile & Enter Portal
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        CuraHome Healthcare Dispatch System · Board-Verified Home Nursing Operations
      </footer>

      {/* Embedded Nurse Application Modal */}
      <NurseRegistrationModal
        isOpen={isNurseModalOpen}
        onClose={() => setIsNurseModalOpen(false)}
        onRegistered={(newNurseId) => {
          setActiveNurseId(newNurseId);
          login('nurse', newNurseId);
        }}
      />
    </div>
  );
};
