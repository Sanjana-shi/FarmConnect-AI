import React, { useState, useEffect } from 'react';
import { 
  Globe, Phone, ShieldCheck, UserCheck, CheckCircle2, 
  ArrowRight, RefreshCw, Mic, Volume2, Plus, Users, 
  Briefcase, Calculator, MapPin, Star, Sparkles, ChevronRight, LogOut,
  Bell, ArrowLeft, SlidersHorizontal, User, Layers, Bookmark, Calendar as CalendarIcon
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';
import { 
  LanguageCode, UserRole, UserSession, JobItem, 
  JobApplication, WorkerCandidate, HiredWorkerRecord, NotificationItem 
} from '../types';
import { FarmConnectStore } from '../data/store';

// Interactive Screen Imports
import { NearbyJobsScreen } from './screens/NearbyJobsScreen';
import { JobDetailsScreen } from './screens/JobDetailsScreen';
import { ApplyJobModal } from './screens/ApplyJobModal';
import { MyApplicationsScreen } from './screens/MyApplicationsScreen';
import { WorkHistoryScreen } from './screens/WorkHistoryScreen';
import { WorkerProfileScreen } from './screens/WorkerProfileScreen';
import { PostJobScreen } from './screens/PostJobScreen';
import { FindWorkersScreen } from './screens/FindWorkersScreen';
import { FarmerJobsScreen } from './screens/FarmerJobsScreen';
import { JobApplicantsScreen } from './screens/JobApplicantsScreen';
import { HiredWorkersScreen } from './screens/HiredWorkersScreen';
import { WageCalculatorScreen } from './screens/WageCalculatorScreen';
import { AgriVoiceAssistantModal } from './screens/AgriVoiceAssistantModal';
import { NotificationsModal } from './screens/NotificationsModal';
import { EarningsScreen } from './screens/EarningsScreen';
import { MapScreen } from './screens/MapScreen';
import { SavedJobsScreen } from './screens/SavedJobsScreen';
import { WorkCalendarScreen } from './screens/WorkCalendarScreen';
import { FarmerProfileScreen } from './screens/FarmerProfileScreen';
import { ForgotPasswordModal } from './screens/ForgotPasswordModal';
import { BottomNavigation } from './BottomNavigation';

interface AndroidEmulatorProps {
  onApiLog?: (endpoint: string, method: string, status: number, payload: any, response: any) => void;
  selectedLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

type ScreenType = 
  | 'LANGUAGE' 
  | 'LOGIN' 
  | 'OTP' 
  | 'ROLE_SELECT' 
  | 'REGISTER' 
  | 'FARMER_DASHBOARD' 
  | 'WORKER_DASHBOARD'
  | 'NEARBY_JOBS'
  | 'JOB_DETAILS'
  | 'MY_APPLICATIONS'
  | 'WORK_HISTORY'
  | 'WORKER_PROFILE'
  | 'FARMER_PROFILE'
  | 'POST_JOB'
  | 'FIND_WORKERS'
  | 'FARMER_JOBS'
  | 'JOB_APPLICANTS'
  | 'HIRED_WORKERS'
  | 'WAGE_CALCULATOR'
  | 'EARNINGS'
  | 'MAP'
  | 'SAVED_JOBS'
  | 'WORK_CALENDAR';

export const AndroidEmulator: React.FC<AndroidEmulatorProps> = ({ 
  onApiLog,
  selectedLanguage: propLanguage,
  onLanguageChange: onPropLanguageChange,
}) => {
  // Navigation State inside the Android App
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LANGUAGE');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>([]);

  // Persistent Store State
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [candidates, setCandidates] = useState<WorkerCandidate[]>([]);
  const [hiredWorkers, setHiredWorkers] = useState<HiredWorkerRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Selected entities for detail screens
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<JobItem | null>(null);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [emulatorToast, setEmulatorToast] = useState<string | null>(null);

  // User input states
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => propLanguage || FarmConnectStore.getLanguage());

  useEffect(() => {
    if (propLanguage && propLanguage !== selectedLanguage) {
      setSelectedLanguage(propLanguage);
    }
  }, [propLanguage]);

  const handleLanguageSelect = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    FarmConnectStore.setLanguage(lang);
    if (onPropLanguageChange) {
      onPropLanguageChange(lang);
    }
  };
  const [mobileNumber, setMobileNumber] = useState<string>('9840123456');
  const [otpCode, setOtpCode] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);

  // Form registration state
  const [fullName, setFullName] = useState<string>('Murugan Farms (Ramesh K.)');
  const [villageTown, setVillageTown] = useState<string>('Thiruvaiyaru');
  const [district, setDistrict] = useState<string>('Thanjavur');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [farmSize, setFarmSize] = useState<number>(3.5);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy', 'Sugarcane']);
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Harvesting', 'Paddy work', 'Tractor operation']);
  const [availability, setAvailability] = useState<string>('AVAILABLE');

  // Dashboard filtering state
  const [workerSearchQuery, setWorkerSearchQuery] = useState<string>('');
  const [workerFilterChip, setWorkerFilterChip] = useState<string>('ALL');

  // Active user session
  const [session, setSession] = useState<UserSession | null>(null);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Initialize data from store on mount
  useEffect(() => {
    refreshStoreData();
    const storedSession = FarmConnectStore.getSession();
    if (storedSession) {
      setSession(storedSession);
      setSelectedLanguage(storedLanguage => storedSession.language || storedLanguage);
    }
  }, []);

  const refreshStoreData = () => {
    setJobs(FarmConnectStore.getJobs());
    setApplications(FarmConnectStore.getApplications());
    setCandidates(FarmConnectStore.getCandidates());
    setHiredWorkers(FarmConnectStore.getHiredWorkers());
    setNotifications(FarmConnectStore.getNotifications());
  };

  // Screen navigation helper with history tracking
  const navigateTo = (screen: ScreenType) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory(prevHist => prevHist.slice(0, prevHist.length - 1));
      setCurrentScreen(prev);
    } else {
      if (session?.role === 'FARMER') setCurrentScreen('FARMER_DASHBOARD');
      else if (session?.role === 'WORKER') setCurrentScreen('WORKER_DASHBOARD');
      else setCurrentScreen('LANGUAGE');
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (currentScreen === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentScreen, timer]);

  // REST API Handlers
  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onApiLog) {
        onApiLog('/api/v1/auth/send-otp', 'POST', 200, 
          { mobileNumber: `+91${mobileNumber}` }, 
          { success: true, message: 'OTP sent successfully', data: { devOtp: '123456', expiresAt: '5m' } }
        );
      }
      setTimer(30);
      setOtpCode('123456'); // Pre-fill dev code
      navigateTo('OTP');
    }, 600);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onApiLog) {
        onApiLog('/api/v1/auth/verify-otp', 'POST', 200,
          { mobileNumber: `+91${mobileNumber}`, otpCode },
          { 
            success: true, 
            message: 'OTP verified successfully',
            data: { isRegistered: session !== null, mobileNumber: `+91${mobileNumber}`, jwt: 'eyJhbGci...' }
          }
        );
      }

      if (session) {
        if (session.role === 'FARMER') navigateTo('FARMER_DASHBOARD');
        else navigateTo('WORKER_DASHBOARD');
      } else {
        navigateTo('ROLE_SELECT');
      }
    }, 700);
  };

  const handleCompleteRegistration = () => {
    setIsLoading(true);

    const payload = selectedRole === 'FARMER' ? {
      mobileNumber: `+91${mobileNumber}`,
      fullName,
      villageOrTown: villageTown,
      district,
      state,
      preferredLanguage: selectedLanguage,
      farmSizeAcres: farmSize,
      mainCrops: selectedCrops
    } : {
      mobileNumber: `+91${mobileNumber}`,
      fullName,
      villageOrTown: villageTown,
      district,
      state,
      preferredLanguage: selectedLanguage,
      experienceYears,
      skills: selectedSkills,
      availabilityStatus: availability
    };

    const endpoint = selectedRole === 'FARMER' ? '/api/v1/auth/register/farmer' : '/api/v1/auth/register/worker';

    setTimeout(() => {
      setIsLoading(false);
      const newSession: UserSession = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODQwMTIzNDU2Iiwicm9sZSI6InVzZXIifQ...',
        userId: Math.floor(Math.random() * 1000) + 1,
        mobileNumber: `+91${mobileNumber}`,
        fullName,
        role: selectedRole,
        language: selectedLanguage,
        villageOrTown: villageTown,
        district,
        state,
        farmSizeAcres: farmSize,
        mainCrops: selectedCrops,
        skills: selectedSkills,
        experienceYears,
        reliabilityScore: 96,
        dailyWageExpected: 750,
        availabilityStatus: 'AVAILABLE'
      };

      setSession(newSession);
      FarmConnectStore.saveSession(newSession);

      if (onApiLog) {
        onApiLog(endpoint, 'POST', 200, payload, {
          success: true,
          message: `${selectedRole} profile created successfully`,
          data: newSession
        });
      }

      if (selectedRole === 'FARMER') {
        navigateTo('FARMER_DASHBOARD');
      } else {
        navigateTo('WORKER_DASHBOARD');
      }
    }, 700);
  };

  const handleLogout = () => {
    FarmConnectStore.clearSession();
    setSession(null);
    setScreenHistory([]);
    setCurrentScreen('LANGUAGE');
    if (onApiLog) {
      onApiLog('/api/v1/auth/logout', 'POST', 200, {}, { success: true, message: 'Logged out' });
    }
  };

  // WORKER ACTIONS
  const handleSelectJob = (job: JobItem) => {
    setSelectedJob(job);
    navigateTo('JOB_DETAILS');
    if (onApiLog) {
      onApiLog(`/api/v1/jobs/${job.id}`, 'GET', 200, {}, { success: true, data: job });
    }
  };

  const handleOpenQuickApply = (job: JobItem) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleConfirmApply = (job: JobItem, message: string, proposedWage: number) => {
    setIsApplyModalOpen(false);
    const newApp = FarmConnectStore.applyForJob(
      job.id,
      session?.userId || 99,
      session?.fullName || 'Murugesan V.',
      session?.mobileNumber || '+91 98405 67890',
      message,
      proposedWage,
      session?.experienceYears || 7,
      session?.skills || ['Harvesting', 'Paddy work']
    );

    refreshStoreData();

    if (onApiLog) {
      onApiLog(`/api/v1/jobs/${job.id}/apply`, 'POST', 200, {
        jobId: job.id,
        workerId: session?.userId || 99,
        appliedWage: proposedWage,
        message
      }, {
        success: true,
        message: 'Application submitted successfully',
        data: newApp
      });
    }
  };

  const handleWithdrawApplication = (appId: string) => {
    FarmConnectStore.withdrawApplication(appId);
    refreshStoreData();
    if (onApiLog) {
      onApiLog(`/api/v1/applications/${appId}/withdraw`, 'PUT', 200, { appId }, { success: true, message: 'Application withdrawn' });
    }
  };

  // FARMER ACTIONS
  const handleJobCreated = (newJobData: any) => {
    const created = FarmConnectStore.createJob(newJobData);
    refreshStoreData();
    if (onApiLog) {
      onApiLog('/api/v1/jobs/create', 'POST', 201, newJobData, {
        success: true,
        message: 'Farm job posted and published to regional network',
        data: created
      });
    }
    navigateTo('FARMER_JOBS');
    setEmulatorToast(`🎉 Job "${created.title}" published! Workers notified.`);
    setTimeout(() => setEmulatorToast(null), 4000);
  };

  const handleViewJobApplicants = (job: JobItem) => {
    setSelectedJobForApplicants(job);
    navigateTo('JOB_APPLICANTS');
    if (onApiLog) {
      onApiLog(`/api/v1/jobs/${job.id}/applications`, 'GET', 200, {}, {
        success: true,
        data: applications.filter(a => a.jobId === job.id)
      });
    }
  };

  const handleHireApplicant = (appId: string) => {
    const hired = FarmConnectStore.hireApplicant(appId);
    refreshStoreData();
    if (hired && onApiLog) {
      onApiLog(`/api/v1/applications/${appId}/hire`, 'POST', 200, { appId }, {
        success: true,
        message: 'Worker hired and added to labor roster',
        data: hired
      });
    }
    setEmulatorToast("✅ Worker successfully hired! Added to Hired Workers & Attendance list.");
    setTimeout(() => setEmulatorToast(null), 4000);
  };

  const handleInviteWorker = (worker: WorkerCandidate, jobId: number) => {
    FarmConnectStore.inviteWorker(jobId, worker.id, worker.fullName, worker.mobileNumber);
    refreshStoreData();
    if (onApiLog) {
      onApiLog(`/api/v1/jobs/${jobId}/invite`, 'POST', 200, {
        jobId,
        workerId: worker.id,
        workerName: worker.fullName
      }, {
        success: true,
        message: `Invitation sent to ${worker.fullName}`
      });
    }
  };

  const handleMarkAttendance = (hiredId: string, status: 'PRESENT' | 'ABSENT' | 'HALF_DAY') => {
    const updated = FarmConnectStore.markAttendance(hiredId, status);
    refreshStoreData();
    if (updated && onApiLog) {
      onApiLog(`/api/v1/attendance/mark`, 'POST', 200, {
        hiredId,
        status,
        date: new Date().toISOString().split('T')[0]
      }, {
        success: true,
        message: `Attendance marked as ${status}`,
        data: updated
      });
    }
  };

  const handleRecordPayment = (hiredId: string, amount: number, mode: 'UPI' | 'CASH') => {
    const updated = FarmConnectStore.recordPayment(hiredId, amount, mode);
    refreshStoreData();
    if (updated && onApiLog) {
      onApiLog(`/api/v1/payments/settle`, 'POST', 200, {
        hiredId,
        amount,
        mode,
        currency: 'INR'
      }, {
        success: true,
        message: `₹${amount} recorded via ${mode}`,
        data: updated
      });
    }
  };

  const handleRateWorker = (hiredId: string, rating: number, comment: string) => {
    const updated = FarmConnectStore.rateWorker(hiredId, rating, comment);
    refreshStoreData();
    if (updated && onApiLog) {
      onApiLog(`/api/v1/workers/reviews/create`, 'POST', 200, {
        hiredId,
        rating,
        comment
      }, {
        success: true,
        message: 'Review and rating recorded',
        data: updated
      });
    }
  };

  const handleUpdateWorkerProfile = (updatedData: Partial<UserSession>) => {
    const newSess = FarmConnectStore.updateSession(updatedData);
    if (newSess) {
      setSession(newSess);
      setFullName(newSess.fullName);
      setVillageTown(newSess.villageOrTown || '');
      setDistrict(newSess.district || '');
      setExperienceYears(newSess.experienceYears || 6);
      if (onApiLog) {
        onApiLog(`/api/v1/users/${newSess.userId}/profile`, 'PUT', 200, updatedData, {
          success: true,
          message: 'Profile updated successfully',
          data: newSess
        });
      }
    }
  };

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative mx-auto w-[380px] h-[760px] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col justify-between select-none">
      {/* Top Speaker & Camera Notch */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2">
        <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-700"></div>
        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
      </div>

      {/* Screen Frame */}
      <div className="relative w-full h-full bg-[#F9FBF7] rounded-[36px] overflow-hidden flex flex-col font-sans">
        
        {/* Android Status Bar */}
        <div className="w-full h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-700 z-20 bg-transparent">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">4G</span>
            <span>📶</span>
            <span>🔋 92%</span>
          </div>
        </div>

        {/* Global In-App Quick Header for Authenticated Screens */}
        {session && currentScreen !== 'LANGUAGE' && currentScreen !== 'LOGIN' && currentScreen !== 'OTP' && currentScreen !== 'ROLE_SELECT' && currentScreen !== 'REGISTER' && (
          <div className="px-4 py-1.5 flex items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-xs z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const targetRole = session.role === 'FARMER' ? 'WORKER' : 'FARMER';
                  const updated = FarmConnectStore.updateSession({ role: targetRole });
                  if (updated) {
                    setSession(updated);
                    if (targetRole === 'FARMER') setCurrentScreen('FARMER_DASHBOARD');
                    else setCurrentScreen('WORKER_DASHBOARD');
                  }
                }}
                className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-bold flex items-center gap-1"
                title="Switch between Farmer and Worker role mode"
              >
                <Layers className="w-3 h-3 text-emerald-700" />
                <span>Mode: {session.role}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNotifOpen(true)}
                className="p-1 rounded-lg text-slate-600 hover:text-emerald-800 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-0.5 right-0.5"></span>
                )}
              </button>

              <button
                onClick={() => setIsVoiceOpen(true)}
                className="p-1 bg-amber-100 text-amber-900 rounded-lg font-bold text-[10px] flex items-center gap-0.5"
                title="AI Voice Assistant"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>AI</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic App Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1 flex flex-col relative">
          
          {/* In-app Toast Banner */}
          {emulatorToast && (
            <div className="my-1.5 p-2 bg-emerald-900 text-white rounded-xl text-xs font-bold text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
              <span>{emulatorToast}</span>
            </div>
          )}

          {/* ================= SCREEN 1: LANGUAGE SELECTION ================= */}
          {currentScreen === 'LANGUAGE' && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-2xl mt-3">
                  <span className="text-2xl">🌱</span>
                  <span>{t.appName}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{t.appTagline}</p>

                <div className="mt-6">
                  <h2 className="text-base font-bold text-slate-900">{t.selectLanguage}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{t.selectLanguageSub}</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        id={`btn_lang_${lang.code}`}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[72px] ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50 shadow-sm ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-sm font-bold text-slate-900">{lang.nativeName}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                        </div>
                        <span className="text-[11px] text-slate-500">{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="btn_language_continue"
                onClick={() => navigateTo('LOGIN')}
                className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-4"
              >
                <span>{t.continue}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= SCREEN 2: LOGIN (MOBILE NUMBER) ================= */}
          {currentScreen === 'LOGIN' && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div>
                <button
                  onClick={() => navigateTo('LANGUAGE')}
                  className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mb-2 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}</span>
                </button>

                <h1 className="text-xl font-bold text-emerald-900 mt-2">{t.welcomeBack}</h1>
                <p className="text-xs text-slate-600 mt-1">{t.enterMobileSub}</p>

                <div className="mt-8">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">{t.mobileNumber}</label>
                  <div className="flex items-center h-13 px-3 bg-white border border-slate-300 rounded-xl shadow-xs focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700">
                    <span className="text-sm font-bold text-slate-800 mr-2 flex items-center gap-1">
                      🇮🇳 +91
                    </span>
                    <div className="w-px h-6 bg-slate-200 mr-3"></div>
                    <input
                      id="input_mobile_number"
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-transparent text-slate-900 font-medium text-base outline-none tracking-wider"
                    />
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <p className="text-[11px] text-amber-800 font-medium leading-tight">
                    {t.devOtpNotice}
                  </p>
                </div>

                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] text-emerald-800 font-bold hover:underline"
                  >
                    Forgot Security PIN?
                  </button>
                </div>
              </div>

              <button
                id="btn_send_otp"
                disabled={isLoading || mobileNumber.length < 10}
                onClick={handleSendOtp}
                className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>{t.sendOtp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= SCREEN 3: OTP VERIFICATION ================= */}
          {currentScreen === 'OTP' && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div>
                <button
                  onClick={() => navigateTo('LOGIN')}
                  className="text-xs text-slate-500 hover:text-slate-800 mb-2"
                >
                  ← Edit mobile number
                </button>

                <h1 className="text-xl font-bold text-emerald-900 mt-2">{t.verifyMobile}</h1>
                <p className="text-xs text-slate-600 mt-1">
                  Sent to <span className="font-semibold text-slate-900">+91 {mobileNumber}</span>
                </p>

                <div className="mt-8">
                  <div className="flex justify-center">
                    <input
                      id="input_otp_code"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-48 h-14 bg-white border-2 border-emerald-700 rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-slate-900 shadow-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-xs text-slate-500">
                      {timer > 0 ? `Resend in ${timer}s` : 'Didn’t receive?'}
                    </span>
                    <button
                      disabled={timer > 0}
                      onClick={() => setTimer(30)}
                      className="text-xs font-bold text-emerald-800 disabled:text-slate-400 hover:underline"
                    >
                      {t.resendOtp}
                    </button>
                  </div>
                </div>
              </div>

              <button
                id="btn_verify_otp"
                disabled={isLoading || otpCode.length !== 6}
                onClick={handleVerifyOtp}
                className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>{t.verifyContinue}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= SCREEN 4: ROLE SELECT & REGISTRATION ================= */}
          {(currentScreen === 'ROLE_SELECT' || currentScreen === 'REGISTER') && (
            <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
              <div>
                <h1 className="text-lg font-bold text-emerald-900">{t.iAmA}</h1>
                <p className="text-xs text-slate-500 mt-0.5">{t.selectRoleSub}</p>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    id="btn_role_farmer"
                    onClick={() => {
                      setSelectedRole('FARMER');
                      setFullName('Murugan Farms (Ramesh K.)');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-[84px] transition-all ${
                      selectedRole === 'FARMER'
                        ? 'border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-2xl">🌾</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.farmer}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">Need labor</div>
                    </div>
                  </button>

                  <button
                    id="btn_role_worker"
                    onClick={() => {
                      setSelectedRole('WORKER');
                      setFullName('Murugesan V.');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-[84px] transition-all ${
                      selectedRole === 'WORKER'
                        ? 'border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-2xl">🛠️</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.worker}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">Seek work</div>
                    </div>
                  </button>
                </div>

                {/* Common Fields */}
                <div className="mt-4 space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.fullName}</label>
                    <input
                      id="input_full_name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.villageTown}</label>
                      <input
                        id="input_village"
                        type="text"
                        value={villageTown}
                        onChange={(e) => setVillageTown(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.district}</label>
                      <input
                        id="input_district"
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Role Specific Fields */}
                  {selectedRole === 'FARMER' ? (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.farmSize}</label>
                        <input
                          id="input_farm_size"
                          type="number"
                          step="0.5"
                          value={farmSize}
                          onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                          className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.mainCrops}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Paddy', 'Sugarcane', 'Cotton', 'Wheat', 'Banana'].map((crop) => {
                            const active = selectedCrops.includes(crop);
                            return (
                              <button
                                key={crop}
                                type="button"
                                onClick={() => {
                                  if (active) setSelectedCrops(selectedCrops.filter(c => c !== crop));
                                  else setSelectedCrops([...selectedCrops, crop]);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                                  active ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                {crop}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.experienceYears}</label>
                        <input
                          id="input_experience"
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(parseInt(e.target.value) || 1)}
                          className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">{t.skills}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Harvesting', 'Paddy work', 'Sowing', 'Weeding', 'Tractor operation'].map((skill) => {
                            const active = selectedSkills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                  if (active) setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                  else setSelectedSkills([...selectedSkills, skill]);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                                  active ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                id="btn_submit_registration"
                disabled={isLoading}
                onClick={handleCompleteRegistration}
                className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-4"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>{t.completeReg}</span>}
              </button>
            </div>
          )}

          {/* ================= SCREEN 5: FARMER DASHBOARD ================= */}
          {currentScreen === 'FARMER_DASHBOARD' && (
            <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
              <div className="space-y-3">
                {/* Farmer Profile Card */}
                <div className="p-3.5 bg-emerald-800 rounded-2xl text-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div 
                      onClick={() => navigateTo('FARMER_PROFILE')}
                      className="cursor-pointer group flex-1"
                    >
                      <div className="text-sm font-bold flex items-center gap-1.5 group-hover:text-emerald-100">
                        <span>{fullName || 'Murugan Farms (Ramesh K.)'}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-700 rounded text-emerald-200">Edit</span>
                      </div>
                      <div className="text-[11px] text-emerald-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{villageTown}, {district}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 bg-emerald-900/60 rounded-lg text-emerald-200 hover:text-white"
                      title="Logout"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-700/60 text-center">
                    <div onClick={() => navigateTo('FARMER_JOBS')} className="cursor-pointer hover:opacity-80">
                      <div className="text-base font-bold">{jobs.length}</div>
                      <div className="text-[10px] text-emerald-200">{t.activeJobs}</div>
                    </div>
                    <div onClick={() => navigateTo('HIRED_WORKERS')} className="cursor-pointer hover:opacity-80">
                      <div className="text-base font-bold">{hiredWorkers.length}</div>
                      <div className="text-[10px] text-emerald-200">{t.workersHired}</div>
                    </div>
                    <div onClick={() => navigateTo('WAGE_CALCULATOR')} className="cursor-pointer hover:opacity-80">
                      <div className="text-base font-bold">96%</div>
                      <div className="text-[10px] text-emerald-200">AI Trust</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions 3x2 Grid */}
                <div>
                  <div className="text-xs font-bold text-slate-900 mb-2">Farmer Quick Actions</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      id="action_post_job"
                      onClick={() => navigateTo('POST_JOB')}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                    >
                      <span className="text-xl mb-0.5">➕</span>
                      <span className="text-[10px] font-bold text-slate-800">{t.postJob}</span>
                    </button>

                    <button 
                      id="action_find_workers"
                      onClick={() => navigateTo('FIND_WORKERS')}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                    >
                      <span className="text-xl mb-0.5">🔍</span>
                      <span className="text-[10px] font-bold text-slate-800">{t.findWorkers}</span>
                    </button>

                    <button 
                      id="action_my_jobs"
                      onClick={() => navigateTo('FARMER_JOBS')}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                    >
                      <span className="text-xl mb-0.5">📋</span>
                      <span className="text-[10px] font-bold text-slate-800">{t.myJobs}</span>
                    </button>

                    <button 
                      id="action_hired_workers"
                      onClick={() => navigateTo('HIRED_WORKERS')}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                    >
                      <span className="text-xl mb-0.5">👥</span>
                      <span className="text-[10px] font-bold text-slate-800">Attendance</span>
                    </button>

                    <button 
                      id="action_work_calendar"
                      onClick={() => navigateTo('WORK_CALENDAR')}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                    >
                      <span className="text-xl mb-0.5">🗓️</span>
                      <span className="text-[10px] font-bold text-slate-800">Calendar</span>
                    </button>

                    <button 
                      id="action_wage_calc"
                      onClick={() => navigateTo('WAGE_CALCULATOR')}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                    >
                      <span className="text-xl mb-0.5">💰</span>
                      <span className="text-[10px] font-bold text-slate-800">{t.wageCalc}</span>
                    </button>
                  </div>
                </div>

                {/* Active Jobs Live Preview Card */}
                {jobs.length > 0 && (
                  <div 
                    onClick={() => handleViewJobApplicants(jobs[0])}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          Active Listing • Tap to manage
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{jobs[0].title}</h4>
                        <p className="text-[11px] text-slate-500">Starts {jobs[0].startDate} • ₹{jobs[0].wageAmount}/day</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        {jobs[0].workersHired}/{jobs[0].workersRequired} Hired
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Multilingual Voice Assistant Button */}
              <button
                id="btn_voice_assistant"
                onClick={() => setIsVoiceOpen(true)}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-3"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span className="text-xs">{t.voiceAssistant}</span>
              </button>
            </div>
          )}

          {/* ================= SCREEN 6: WORKER DASHBOARD ================= */}
          {currentScreen === 'WORKER_DASHBOARD' && (
            <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto space-y-3.5 animate-fadeIn">
              
              {/* 1. Header & Location & Profile Completion */}
              <div className="space-y-2">
                {/* Greeting & Location */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-500">
                        {selectedLanguage === 'ta' ? 'வணக்கம்,' : selectedLanguage === 'hi' ? 'नमस्ते,' : selectedLanguage === 'te' ? 'నమస్కారం,' : 'Hello,'}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{fullName || 'Murugesan V.'}</span>
                      <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                        ✓ {t.verified}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      <span>{villageTown}, {district}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[9px] text-emerald-700 font-medium">GPS Active</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('WORKER_PROFILE')}
                    className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:bg-emerald-800 transition-all ring-2 ring-emerald-100"
                    title="Profile"
                  >
                    {fullName.charAt(0) || 'M'}
                  </button>
                </div>

                {/* Profile Completion Bar Banner */}
                <div 
                  onClick={() => navigateTo('WORKER_PROFILE')}
                  className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all shadow-2xs"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-900 mb-1">
                    <span className="flex items-center gap-1">
                      <span>✨</span>
                      <span>Profile 85% Complete</span>
                    </span>
                    <span className="text-emerald-700 hover:underline flex items-center gap-0.5">
                      {t.completeProfile} →
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[85%]"></div>
                  </div>
                </div>
              </div>

              {/* 2. Availability Card */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${availability === 'AVAILABLE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      <span>{availability === 'AVAILABLE' ? t.availableForWork : 'Currently Busy'}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {availability === 'AVAILABLE' 
                        ? 'Farmers within 20km can see and invite you directly' 
                        : 'You will not appear in immediate job dispatch'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const next = availability === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
                      setAvailability(next);
                      FarmConnectStore.updateSession({ availabilityStatus: next });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all shadow-xs ${
                      availability === 'AVAILABLE'
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {availability === 'AVAILABLE' ? 'Active' : 'Set Active'}
                  </button>
                </div>
              </div>

              {/* 3. Four-Metric Statistics Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                <div 
                  onClick={() => navigateTo('WORKER_PROFILE')}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-slate-900">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>4.9</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{t.rating}</div>
                </div>

                <div 
                  onClick={() => navigateTo('WORKER_PROFILE')}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <div className="text-xs font-bold text-emerald-700">96/100</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{t.reliability}</div>
                </div>

                <div 
                  onClick={() => navigateTo('WORK_HISTORY')}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <div className="text-xs font-bold text-slate-900">24</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{t.completedShifts}</div>
                </div>

                <div 
                  onClick={() => navigateTo('EARNINGS')}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <div className="text-xs font-bold text-emerald-700">₹64.2k</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{t.totalEarned}</div>
                </div>
              </div>

              {/* 4. Quick Action Tabs Grid */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => navigateTo('NEARBY_JOBS')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                >
                  <span className="text-xl mb-0.5">📍</span>
                  <span className="text-[10px] font-bold text-slate-800">{t.nearbyJobs}</span>
                </button>

                <button
                  onClick={() => navigateTo('MAP')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                >
                  <span className="text-xl mb-0.5">🗺️</span>
                  <span className="text-[10px] font-bold text-slate-800">Map View</span>
                </button>

                <button
                  onClick={() => navigateTo('SAVED_JOBS')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all relative"
                >
                  <span className="text-xl mb-0.5">🔖</span>
                  <span className="text-[10px] font-bold text-slate-800">Saved Jobs</span>
                  {FarmConnectStore.getSavedJobs().length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[8px] font-black flex items-center justify-center">
                      {FarmConnectStore.getSavedJobs().length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigateTo('WORK_CALENDAR')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                >
                  <span className="text-xl mb-0.5">🗓️</span>
                  <span className="text-[10px] font-bold text-slate-800">Calendar</span>
                </button>

                <button
                  onClick={() => navigateTo('EARNINGS')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all"
                >
                  <span className="text-xl mb-0.5">💰</span>
                  <span className="text-[10px] font-bold text-slate-800">Passbook</span>
                </button>

                <button
                  onClick={() => navigateTo('MY_APPLICATIONS')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-700 active:scale-95 transition-all relative"
                >
                  <span className="text-xl mb-0.5">📝</span>
                  <span className="text-[10px] font-bold text-slate-800">Applied</span>
                  {applications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-700 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                      {applications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* 5. Search Bar & Quick Filter Chips */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={workerSearchQuery}
                    onChange={(e) => setWorkerSearchQuery(e.target.value)}
                    placeholder="Search by crop, work, or village..."
                    className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
                  {workerSearchQuery && (
                    <button
                      onClick={() => setWorkerSearchQuery('')}
                      className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                  {['ALL', 'Paddy', 'Sugarcane', 'Harvesting', 'Weeding', '<5km', '₹700+'].map((chip) => {
                    const isSelected = workerFilterChip === chip;
                    return (
                      <button
                        key={chip}
                        onClick={() => setWorkerFilterChip(chip)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. AI Recommended Jobs Banner */}
              {jobs.length > 0 && (
                <div className="p-3 bg-gradient-to-br from-emerald-850 to-emerald-950 text-white rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold text-emerald-100">{t.recommendedJobs}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-extrabold rounded-full">
                      94% Match
                    </span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-white">{jobs[0].title}</div>
                        <div className="text-[10px] text-emerald-200 mt-0.5">{jobs[0].farmerLocation} • 2.8 km away</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-300">₹{jobs[0].wageAmount}/day</div>
                        <div className="text-[9px] text-emerald-300">{jobs[0].durationDays} days</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[9px] text-emerald-200 mt-2 pt-2 border-t border-white/10">
                      <span>✓ Skill match: Paddy & Harvest</span>
                      <span>✓ Start: Tomorrow 7:00 AM</span>
                    </div>

                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => handleSelectJob(jobs[0])}
                        className="flex-1 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[10px] font-bold transition-all text-center"
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        onClick={() => handleOpenQuickApply(jobs[0])}
                        className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[10px] font-bold transition-all shadow-xs text-center"
                      >
                        {t.applyNow}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Upcoming Confirmed Work Card */}
              <div 
                onClick={() => {
                  if (jobs[1]) handleSelectJob(jobs[1]);
                }}
                className="p-3 bg-white border border-emerald-200 rounded-2xl shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🗓️</span>
                    <span className="text-[11px] font-bold text-slate-900">{t.upcomingShift}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                    {t.confirmed}
                  </span>
                </div>

                <div className="mt-2 text-xs font-bold text-slate-900">Murugan Farms (Ramesh K.)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Paddy Bundle Binding & Stacking</div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-600 font-medium">Tomorrow, 07:00 AM</span>
                  <span className="text-emerald-700 font-bold">₹750 / Day</span>
                </div>
              </div>

              {/* 8. Earnings Summary & Passbook Card */}
              <div 
                onClick={() => navigateTo('EARNINGS')}
                className="p-3 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl shadow-xs cursor-pointer hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">💰 {t.earningsSummary}</span>
                  <span className="text-[10px] text-emerald-700 font-bold hover:underline">
                    Passbook →
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-1 text-center">
                  <div>
                    <div className="text-xs font-bold text-emerald-800">₹18,750</div>
                    <div className="text-[9px] text-slate-500">{t.currentMonth}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">24</div>
                    <div className="text-[9px] text-slate-500">{t.completedShifts}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-800">₹765</div>
                    <div className="text-[9px] text-slate-500">{t.avgDailyRate}</div>
                  </div>
                </div>
              </div>

              {/* 9. Filtered Nearby Jobs Feed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t.allNearbyJobs}</span>
                  <button 
                    onClick={() => navigateTo('NEARBY_JOBS')}
                    className="text-[10px] text-emerald-800 font-bold hover:underline"
                  >
                    View on Map →
                  </button>
                </div>

                <div className="space-y-2">
                  {jobs
                    .filter(job => {
                      if (workerSearchQuery) {
                        const q = workerSearchQuery.toLowerCase();
                        return job.title.toLowerCase().includes(q) ||
                               job.cropType.toLowerCase().includes(q) ||
                               job.farmerLocation.toLowerCase().includes(q);
                      }
                      if (workerFilterChip === 'ALL') return true;
                      if (workerFilterChip === 'Paddy') return job.cropType.toLowerCase().includes('paddy');
                      if (workerFilterChip === 'Sugarcane') return job.cropType.toLowerCase().includes('sugarcane');
                      if (workerFilterChip === 'Harvesting') return job.workType.toLowerCase().includes('harvest') || job.title.toLowerCase().includes('harvest');
                      if (workerFilterChip === 'Weeding') return job.workType.toLowerCase().includes('weed') || job.title.toLowerCase().includes('weed');
                      if (workerFilterChip === '<5km') return (job.distanceKm || 3) <= 5;
                      if (workerFilterChip === '₹700+') return job.wageAmount >= 700;
                      return true;
                    })
                    .slice(0, 4)
                    .map((job) => (
                      <div 
                        key={job.id} 
                        className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-600 transition-all cursor-pointer"
                        onClick={() => handleSelectJob(job)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 text-[8px] font-bold rounded uppercase">
                              {job.cropType} • {job.workType}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">{job.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{job.farmerLocation} • {job.distanceKm || 3.2} km away</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-800">₹{job.wageAmount}/day</span>
                        </div>

                        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-500">Need {job.workersRequired - job.workersHired} workers</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSelectJob(job); }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-all"
                            >
                              {t.viewDetails}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenQuickApply(job); }}
                              className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[10px] font-bold active:scale-95 transition-all shadow-xs"
                            >
                              {t.applyNow}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 10. Floating Voice Assistant Trigger */}
              <button
                id="btn_worker_voice_assistant"
                onClick={() => setIsVoiceOpen(true)}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-2"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span className="text-xs">{t.voiceAssistant}</span>
              </button>
            </div>
          )}

          {/* ================= SCREEN 7: NEARBY JOBS ================= */}
          {currentScreen === 'NEARBY_JOBS' && (
            <NearbyJobsScreen
              jobs={jobs}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onSelectJob={handleSelectJob}
              onQuickApply={handleOpenQuickApply}
            />
          )}

          {/* ================= SCREEN 8: JOB DETAILS ================= */}
          {currentScreen === 'JOB_DETAILS' && selectedJob && (
            <JobDetailsScreen
              job={selectedJob}
              selectedLanguage={selectedLanguage}
              hasApplied={applications.some(a => a.jobId === selectedJob.id)}
              onBack={navigateBack}
              onApply={handleOpenQuickApply}
              onViewApplications={() => navigateTo('MY_APPLICATIONS')}
            />
          )}

          {/* ================= SCREEN 9: MY APPLICATIONS ================= */}
          {currentScreen === 'MY_APPLICATIONS' && (
            <MyApplicationsScreen
              applications={applications}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onSelectJobId={(jobId) => {
                const j = jobs.find(x => x.id === jobId);
                if (j) handleSelectJob(j);
              }}
              onWithdraw={handleWithdrawApplication}
            />
          )}

          {/* ================= SCREEN 10: WORK HISTORY ================= */}
          {currentScreen === 'WORK_HISTORY' && (
            <WorkHistoryScreen
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
            />
          )}

          {/* ================= SCREEN 11: WORKER PROFILE ================= */}
          {currentScreen === 'WORKER_PROFILE' && (
            <WorkerProfileScreen
              session={session}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onUpdateProfile={handleUpdateWorkerProfile}
            />
          )}

          {/* ================= SCREEN 11B: FARMER PROFILE ================= */}
          {currentScreen === 'FARMER_PROFILE' && (
            <FarmerProfileScreen
              session={session}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onUpdateProfile={handleUpdateWorkerProfile}
              onLogout={handleLogout}
              onChangePin={() => setIsForgotModalOpen(true)}
            />
          )}

          {/* ================= SCREEN 12: POST JOB (FARMER) ================= */}
          {currentScreen === 'POST_JOB' && (
            <PostJobScreen
              session={session}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onJobCreated={handleJobCreated}
            />
          )}

          {/* ================= SCREEN 13: FIND WORKERS (FARMER) ================= */}
          {currentScreen === 'FIND_WORKERS' && (
            <FindWorkersScreen
              candidates={candidates}
              activeJobs={jobs}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onInviteWorker={handleInviteWorker}
            />
          )}

          {/* ================= SCREEN 14: FARMER JOBS (FARMER) ================= */}
          {currentScreen === 'FARMER_JOBS' && (
            <FarmerJobsScreen
              jobs={jobs}
              applications={applications}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onPostJobClick={() => navigateTo('POST_JOB')}
              onViewJobApplicants={handleViewJobApplicants}
            />
          )}

          {/* ================= SCREEN 15: JOB APPLICANTS (FARMER) ================= */}
          {currentScreen === 'JOB_APPLICANTS' && selectedJobForApplicants && (
            <JobApplicantsScreen
              job={selectedJobForApplicants}
              applications={applications}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onHireApplicant={handleHireApplicant}
            />
          )}

          {/* ================= SCREEN 16: HIRED WORKERS & ATTENDANCE (FARMER) ================= */}
          {currentScreen === 'HIRED_WORKERS' && (
            <HiredWorkersScreen
              hiredWorkers={hiredWorkers}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onMarkAttendance={handleMarkAttendance}
              onRecordPayment={handleRecordPayment}
              onRateWorker={handleRateWorker}
            />
          )}

          {/* ================= SCREEN 17: WAGE CALCULATOR ================= */}
          {currentScreen === 'WAGE_CALCULATOR' && (
            <WageCalculatorScreen
              session={session}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
            />
          )}

          {/* ================= SCREEN 18: EARNINGS & PASSBOOK ================= */}
          {currentScreen === 'EARNINGS' && (
            <EarningsScreen
              workerId={session?.userId}
              hiredRecords={hiredWorkers}
              applications={applications}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
            />
          )}

          {/* ================= SCREEN 19: INTERACTIVE MAP ================= */}
          {currentScreen === 'MAP' && (
            <MapScreen
              role={session?.role || selectedRole}
              jobs={jobs}
              candidates={candidates}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onSelectJob={handleSelectJob}
              onQuickApply={handleOpenQuickApply}
              onSelectWorker={(w) => {
                handleInviteWorker(w, jobs[0]?.id || 101);
              }}
              onInviteWorker={(w) => {
                handleInviteWorker(w, jobs[0]?.id || 101);
              }}
            />
          )}

          {/* ================= SCREEN 20: SAVED / BOOKMARKED JOBS ================= */}
          {currentScreen === 'SAVED_JOBS' && (
            <SavedJobsScreen
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onSelectJob={handleSelectJob}
              onQuickApply={handleOpenQuickApply}
            />
          )}

          {/* ================= SCREEN 21: WORK CALENDAR & SHIFTS ================= */}
          {currentScreen === 'WORK_CALENDAR' && (
            <WorkCalendarScreen
              role={session?.role || selectedRole}
              userId={session?.userId}
              selectedLanguage={selectedLanguage}
              onBack={navigateBack}
              onSelectJob={handleSelectJob}
            />
          )}

        </div>

        {/* Global Bottom Navigation Bar for Authenticated App States */}
        {session && !['LANGUAGE', 'LOGIN', 'OTP', 'ROLE_SELECT', 'REGISTER'].includes(currentScreen) && (
          <BottomNavigation
            role={session.role}
            activeTab={currentScreen}
            onTabChange={(tab) => navigateTo(tab)}
            onVoiceAssistantClick={() => setIsVoiceOpen(true)}
            unreadCount={unreadCount}
          />
        )}

        {/* Global Modal: Apply Job */}
        {isApplyModalOpen && selectedJob && (
          <ApplyJobModal
            job={selectedJob}
            session={session}
            selectedLanguage={selectedLanguage}
            onClose={() => setIsApplyModalOpen(false)}
            onSubmit={handleConfirmApply}
          />
        )}

        {/* Global Modal: Gemini Agri Voice & Chat Assistant */}
        {isVoiceOpen && (
          <AgriVoiceAssistantModal
            selectedLanguage={selectedLanguage}
            userRole={session?.role || selectedRole}
            userLocation={`${villageTown}, ${district}`}
            onLanguageChange={handleLanguageSelect}
            onClose={() => setIsVoiceOpen(false)}
          />
        )}

        {/* Global Modal: Notifications */}
        {isNotifOpen && (
          <NotificationsModal
            notifications={notifications}
            onClose={() => setIsNotifOpen(false)}
            onMarkAllRead={() => {
              FarmConnectStore.markAllNotificationsRead();
              refreshStoreData();
            }}
            onMarkRead={(id) => {
              FarmConnectStore.markNotificationRead(id);
              refreshStoreData();
            }}
            onDelete={(id) => {
              FarmConnectStore.deleteNotification(id);
              refreshStoreData();
            }}
            onClearAll={() => {
              FarmConnectStore.clearAllNotifications();
              refreshStoreData();
            }}
            onSelectNotification={(notif) => {
              setIsNotifOpen(false);
              if (notif.relatedJobId) {
                const j = jobs.find(x => x.id === notif.relatedJobId);
                if (j) handleSelectJob(j);
              }
            }}
          />
        )}

        {/* Global Modal: Forgot / Reset PIN */}
        {isForgotModalOpen && (
          <ForgotPasswordModal
            onClose={() => setIsForgotModalOpen(false)}
            onSuccess={() => {
              setIsForgotModalOpen(false);
            }}
          />
        )}

      </div>
    </div>
  );
};
