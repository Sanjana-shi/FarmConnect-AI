import React, { useState, useId } from 'react';
import { 
  X, Lock, Mail, Phone, User, Eye, EyeOff, CheckCircle2, 
  AlertCircle, ShieldCheck, ArrowRight, Sparkles, Tractor, Users, RefreshCw
} from 'lucide-react';
import { UserRole, LanguageCode, UserSession } from '../../types';
import { FarmConnectStore } from '../../data/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: UserSession) => void;
  initialMode?: 'LOGIN' | 'REGISTER';
  selectedLanguage?: LanguageCode;
  onOpenForgotPassword?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'REGISTER',
  onOpenForgotPassword
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  
  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('FARMER');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  
  // Additional Farm/Worker specific details
  const [regVillage, setRegVillage] = useState('Thiruvaiyaru');
  const [regDistrict, setRegDistrict] = useState('Thanjavur');
  const [regFarmSize, setRegFarmSize] = useState<number>(3.5);
  const [regSelectedSkills, setRegSelectedSkills] = useState<string[]>(['Harvesting', 'Paddy work']);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Unique IDs for form controls
  const fullNameId = useId();
  const emailId = useId();
  const mobileId = useId();
  const regPasswordId = useId();
  const regConfirmPasswordId = useId();
  const termsCheckboxId = useId();
  const villageId = useId();
  const districtId = useId();
  const farmSizeId = useId();
  const loginIdentifierId = useId();
  const loginPasswordId = useId();

  if (!isOpen) return null;

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200', textClass: 'text-slate-400', message: 'Enter at least 8 characters' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', textClass: 'text-rose-600', message: 'Use 8+ characters with uppercase and numbers' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-600', message: 'Add numbers or special symbols' };
    if (score === 3 || score === 4) return { score: 3, label: 'Good', color: 'bg-blue-500', textClass: 'text-blue-600', message: 'Strong password for agri account protection' };
    return { score: 4, label: 'Excellent', color: 'bg-emerald-600', textClass: 'text-emerald-700', message: 'Maximum security' };
  };

  const strength = calculatePasswordStrength(regPassword);

  // Validate Indian mobile number
  const isValidIndianMobile = (phone: string) => {
    const clean = phone.replace(/[\s\-()+]/g, '');
    const num = clean.startsWith('91') && clean.length === 12 ? clean.slice(2) : clean;
    return /^[6-9]\d{9}$/.test(num);
  };

  // Validate RFC email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Quick fill demo accounts
  const handleQuickFillDemo = (type: 'FARMER' | 'WORKER' | 'ADMIN') => {
    setMode('LOGIN');
    setErrorMessage('');
    setSuccessMessage('');
    if (type === 'FARMER') {
      setLoginIdentifier('ramesh.farmer@farmconnect.in');
      setLoginPassword('Password@123');
    } else if (type === 'WORKER') {
      setLoginIdentifier('murugesan.worker@farmconnect.in');
      setLoginPassword('Password@123');
    } else {
      setLoginIdentifier('admin@farmconnect.in');
      setLoginPassword('Admin@1234');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!regFullName.trim() || regFullName.trim().length < 2) {
      setErrorMessage('Please enter your full official name (minimum 2 characters).');
      return;
    }

    if (!isValidEmail(regEmail)) {
      setErrorMessage('Please enter a valid email address (e.g., yourname@example.com).');
      return;
    }

    if (!isValidIndianMobile(regMobile)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g., 98401 23456).');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match. Please check and retype.');
      return;
    }

    if (!regTermsAccepted) {
      setErrorMessage('You must read and agree to the FarmConnect AI Terms & Conditions to create an account.');
      return;
    }

    setIsLoading(true);
    try {
      // Normalize mobile with +91
      const cleanDigits = regMobile.replace(/[\s\-()+]/g, '');
      const mobileWithPrefix = cleanDigits.startsWith('91') && cleanDigits.length === 12
        ? `+${cleanDigits}`
        : `+91 ${cleanDigits.slice(-10)}`;

      const res = await FarmConnectStore.registerUser({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        mobileNumber: mobileWithPrefix,
        password: regPassword,
        role: regRole,
        villageOrTown: regVillage,
        district: regDistrict,
        state: 'Tamil Nadu',
        farmSizeAcres: regRole === 'FARMER' ? regFarmSize : undefined,
        mainCrops: regRole === 'FARMER' ? ['Paddy', 'Sugarcane'] : undefined,
        skills: regRole === 'WORKER' ? regSelectedSkills : undefined,
        termsAccepted: true
      });

      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }

      setSuccessMessage('Account registered successfully! Welcome to FarmConnect AI.');

      // Automatically authenticate session for newly registered user
      if (res.user && res.token) {
        const session = FarmConnectStore.userAccountToSession(res.user, res.token);
        setTimeout(() => {
          onAuthSuccess(session);
          onClose();
        }, 800);
      } else {
        // Switch to login tab
        setTimeout(() => {
          setMode('LOGIN');
          setLoginIdentifier(regEmail.trim());
          setLoginPassword('');
          setSuccessMessage('Account created! Please sign in with your password.');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }

    if (!loginPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await FarmConnectStore.authenticateUser(loginIdentifier.trim(), loginPassword);
      if (!res.success || !res.session) {
        setErrorMessage(res.message || 'Authentication failed. Please verify your credentials.');
        return;
      }

      setSuccessMessage(`Signed in as ${res.user?.fullName}!`);
      setTimeout(() => {
        onAuthSuccess(res.session!);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 p-4 flex items-center justify-center overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 my-8 animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div className="bg-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 flex items-center justify-center text-2xl shadow-sm border border-emerald-600">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">FarmConnect AI</h2>
                <span className="px-2 py-0.5 bg-emerald-800 text-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Secure Access
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                {mode === 'REGISTER' 
                  ? 'Join India\'s premier digital agricultural workforce platform' 
                  : 'Welcome back! Sign in to access your farm operations dashboard'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex mt-6 bg-emerald-900/90 p-1 rounded-xl border border-emerald-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'REGISTER'
                  ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create New Account</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'LOGIN'
                  ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Status Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-medium">{successMessage}</div>
            </div>
          )}

          {/* Quick Demo Pre-fill helper banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Instant Demo Quick-Fill:
              </span>
              <span className="text-[10px] text-slate-500">Click to fill test credentials</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFillDemo('FARMER')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-emerald-800">🌾 Ramesh (Farmer)</div>
                <div className="text-[10px] text-slate-400 font-mono">Password@123</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFillDemo('WORKER')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-emerald-800">🚜 Murugesan (Worker)</div>
                <div className="text-[10px] text-slate-400 font-mono">Password@123</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFillDemo('ADMIN')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all group"
              >
                <div className="font-bold text-slate-800 text-[11px]">🛡️ Admin Office</div>
                <div className="text-[10px] text-slate-400 font-mono">Admin@1234</div>
              </button>
            </div>
          </div>

          {/* TAB 1: REGISTRATION FORM */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Primary Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRegRole('FARMER')}
                    className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                      regRole === 'FARMER'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5">
                      <Tractor className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Farmer / Landowner</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Post jobs, hire labor teams & disburse wages</span>
                  </div>

                  <div
                    onClick={() => setRegRole('WORKER')}
                    className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                      regRole === 'WORKER'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Agricultural Worker</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Discover seasonal field jobs & daily UPI earnings</span>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor={fullNameId} className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id={fullNameId}
                    type="text"
                    required
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    placeholder="e.g. Anandha Murugan"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor={emailId} className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id={emailId}
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Indian Mobile Number */}
              <div>
                <label htmlFor={mobileId} className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (India) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-bold">
                    🇮🇳 +91
                  </span>
                  <input
                    id={mobileId}
                    type="tel"
                    required
                    value={regMobile}
                    onChange={e => setRegMobile(e.target.value)}
                    placeholder="98401 23456"
                    className="flex-1 pl-3 pr-3 py-2.5 bg-white border border-slate-300 rounded-r-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">10-digit mobile number for OTP alerts & UPI receipts</span>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={villageId} className="block text-xs font-bold text-slate-700 mb-1">Village / Town</label>
                  <input
                    id={villageId}
                    type="text"
                    value={regVillage}
                    onChange={e => setRegVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor={districtId} className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <select
                    id={districtId}
                    value={regDistrict}
                    onChange={e => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Tiruvarur">Tiruvarur</option>
                    <option value="Nagapattinam">Nagapattinam</option>
                    <option value="Mayiladuthurai">Mayiladuthurai</option>
                    <option value="Tiruchirappalli">Tiruchirappalli</option>
                    <option value="Pudukkottai">Pudukkottai</option>
                    <option value="Cuddalore">Cuddalore</option>
                  </select>
                </div>
              </div>

              {/* Role specific info */}
              {regRole === 'FARMER' ? (
                <div>
                  <label htmlFor={farmSizeId} className="block text-xs font-bold text-slate-700 mb-1">Farm Land Size (Acres)</label>
                  <input
                    id={farmSizeId}
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="500"
                    value={regFarmSize}
                    onChange={e => setRegFarmSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Agricultural Skills</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation', 'Cotton Picking', 'Weeding', 'Spraying'].map(skill => {
                      const isSel = regSelectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            setRegSelectedSkills(prev => 
                              isSel ? prev.filter(s => s !== skill) : [...prev, skill]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                            isSel 
                              ? 'bg-emerald-800 text-white border-emerald-800' 
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}{skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor={regPasswordId} className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-rose-500">* (minimum 8 characters)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id={regPasswordId}
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {regPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-500">Strength: <strong className={strength.textClass}>{strength.label}</strong></span>
                      <span className="text-slate-400">{strength.message}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-200'} flex-1`} />
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-200'} flex-1`} />
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-200'} flex-1`} />
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-slate-200'} flex-1`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor={regConfirmPasswordId} className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id={regConfirmPasswordId}
                    type={showRegConfirm ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 ${
                      regConfirmPassword && regConfirmPassword !== regPassword 
                        ? 'border-rose-400 focus:ring-rose-500' 
                        : regConfirmPassword && regConfirmPassword === regPassword
                        ? 'border-emerald-500 focus:ring-emerald-500'
                        : 'border-slate-300 focus:ring-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirm(!showRegConfirm)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    aria-label={showRegConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regConfirmPassword && (
                  <p className={`text-[10px] mt-1 font-semibold ${
                    regConfirmPassword === regPassword ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {regConfirmPassword === regPassword ? '✓ Passwords match perfectly' : '✕ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="pt-1">
                <label htmlFor={termsCheckboxId} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id={termsCheckboxId}
                    type="checkbox"
                    required
                    checked={regTermsAccepted}
                    onChange={e => setRegTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-emerald-800 border-slate-300 focus:ring-emerald-600 mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 leading-snug">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                      className="text-emerald-800 font-bold underline hover:text-emerald-950"
                    >
                      FarmConnect AI Terms of Service
                    </button>
                    , Fair Agricultural Wage Policy, and Privacy Agreement.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !regTermsAccepted}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Your Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create FarmConnect AI Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Already registered on FarmConnect AI? </span>
                <button
                  type="button"
                  onClick={() => { setMode('LOGIN'); setErrorMessage(''); }}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Log In Here
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LOGIN FORM */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Identifier (Email or Mobile) */}
              <div>
                <label htmlFor={loginIdentifierId} className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address or Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id={loginIdentifierId}
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. ramesh.farmer@farmconnect.in or +91 98401 23456"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={loginPasswordId} className="text-xs font-bold text-slate-700">
                    Account Password <span className="text-rose-500">*</span>
                  </label>
                  {onOpenForgotPassword && (
                    <button
                      type="button"
                      onClick={onOpenForgotPassword}
                      className="text-[11px] font-bold text-emerald-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id={loginPasswordId}
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    aria-label={showLoginPassword ? 'Hide login password' : 'Show login password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Need a new account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('REGISTER'); setErrorMessage(''); }}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Register as Farmer or Worker
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Trust Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>256-Bit Encrypted Agricultural Credentials</span>
          </div>
          <span className="font-semibold text-slate-600">Cauvery Delta Agri Network</span>
        </div>
      </div>

      {/* Terms & Conditions Sub-Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-60 p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-emerald-950">FarmConnect AI Platform Terms</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-700 space-y-2.5 max-h-60 overflow-y-auto leading-relaxed">
              <p><strong>1. Fair Agricultural Wages:</strong> All farmers commit to timely wage settlement according to regional prevailing crop rates (minimum ₹600-₹850/day).</p>
              <p><strong>2. Direct Settlement:</strong> Payments made via UPI or cash are recorded with zero middleman deductions.</p>
              <p><strong>3. Transparent Attendance:</strong> Daily field attendance and hours worked are logged transparently on the digital registry.</p>
              <p><strong>4. Verification & Reliability:</strong> Worker reliability and farmer ratings reflect genuine completed harvest seasons.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
