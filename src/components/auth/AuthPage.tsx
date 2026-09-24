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
    signUpWithSupabase,
    signInWithSupabase,
    signInWithGoogle,
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Login & Sign Up form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Patient Sign Up fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [address, setAddress] = useState('');
  const [districtZone, setDistrictZone] = useState('North District');

  // Modal for nurse application & google auth modal
  const [isNurseModalOpen, setIsNurseModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Selected quick demo account
  const [selectedDemoEmail, setSelectedDemoEmail] = useState<string>('');

  const handleGoogleAccountSelect = async (selectedEmail: string) => {
    setIsGoogleModalOpen(false);
    setShowCustomGoogleInput(false);
    const res = await signInWithGoogle(selectedEmail);
    if (res?.isNewUser) {
      setScreen('role_choice');
    }
  };

  const handleGoogleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    await handleGoogleAccountSelect(googleEmailInput);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmail = selectedDemoEmail || email;
    if (!targetEmail.trim()) {
      setErrorMsg('Please enter your Email Address.');
      return;
    }

    if (authMode === 'signup') {
      if (password && password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      const res = await signUpWithSupabase(targetEmail, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Sign up failed.');
        return;
      }

      setSuccessMsg('Account created successfully in Supabase!');
      setScreen('role_choice');
      return;
    }

    // Sign In Mode
    setIsLoading(true);
    const res = await signInWithSupabase(targetEmail, password);
    setIsLoading(false);

    if (res.isNewUser) {
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
              {/* SCREEN 1: SIGN IN / SIGN UP TABS */}
              {screen === 'login' && (
                <div>
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        authMode === 'signin'
                          ? 'bg-white text-teal-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        authMode === 'signup'
                          ? 'bg-white text-teal-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Create Account (Sign Up)
                    </button>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {authMode === 'signin' ? 'Sign In to CuraHome' : 'Create New Account'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {authMode === 'signin'
                        ? 'Enter your email & password to access your healthcare portal.'
                        : 'Sign up to connect with healthcare services or register as a nurse.'}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0 text-rose-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(true)}
                    className="w-full mb-4 py-2.5 px-4 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                      <span className="bg-white px-3 text-slate-400 font-semibold">Or with Email</span>
                    </div>
                  </div>

                  {/* Auth Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={selectedDemoEmail || email}
                          onChange={(e) => {
                            setSelectedDemoEmail('');
                            setEmail(e.target.value);
                          }}
                          placeholder="name@example.com"
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

                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                          />
                          <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                        </div>
                      </div>
                    )}

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
                      disabled={isLoading}
                      className="w-full py-3 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span>Connecting to Supabase...</span>
                      ) : (
                        <>
                          <span>{authMode === 'signin' ? 'Sign In / Continue' : 'Sign Up Account'}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Demo Quick Sign-In Buttons */}
                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                      Quick Demo Sign-In:
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

      {/* Google Account Chooser Modal (Dark Theme Google OAuth UI) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] text-slate-100 border border-[#333333] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden font-sans">
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-[#2d2d2d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-sm font-semibold text-slate-200">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsGoogleModalOpen(false);
                  setShowCustomGoogleInput(false);
                }}
                className="text-slate-400 hover:text-white text-lg px-2 py-0.5 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Heading */}
              <div className="md:col-span-5 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Choose an account
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  to continue to <span className="text-blue-400 font-medium break-all">wyvxppmmkiibgrgqrczf.supabase.co</span>
                </p>
              </div>

              {/* Right Column: Account Items */}
              <div className="md:col-span-7 space-y-1 divide-y divide-[#2d2d2d]">
                {/* Account 1: Beastrom Gaming (Admin) */}
                <div
                  onClick={() => handleGoogleAccountSelect('kochaleaaryan@gmail.com')}
                  className="py-3 px-3 rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                    B
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                      Beastrom Gaming
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      kochaleaaryan@gmail.com
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    Admin
                  </span>
                </div>

                {/* Account 2: Aaryan Kochale (Patient) */}
                <div
                  onClick={() => handleGoogleAccountSelect('aaryankochale@gmail.com')}
                  className="py-3 px-3 rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                      Aaryan Kochale
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      aaryankochale@gmail.com
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    Patient
                  </span>
                </div>

                {/* Account 3: Aaryan Kochale (Nurse) */}
                <div
                  onClick={() => handleGoogleAccountSelect('aaryan.kochale25@ds.sce.edu.in')}
                  className="py-3 px-3 rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                      Aaryan Kochale
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      aaryan.kochale25@ds.sce.edu.in
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                    Nurse
                  </span>
                </div>

                {/* Custom Gmail Input option */}
                {!showCustomGoogleInput ? (
                  <div
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="py-3 px-3 rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer flex items-center gap-3.5 text-slate-300 hover:text-white pt-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2d2d2d] border border-[#444] flex items-center justify-center text-slate-400 shrink-0">
                      <User size={16} />
                    </div>
                    <span className="text-xs font-semibold">Use another account</span>
                  </div>
                ) : (
                  <form onSubmit={handleGoogleSignInSubmit} className="pt-3 space-y-2">
                    <label className="block text-xs text-slate-300">
                      Enter any Gmail address:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        autoFocus
                        value={googleEmailInput}
                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="flex-1 px-3 py-2 text-xs bg-[#121212] border border-[#444] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs"
                      >
                        Sign In →
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
