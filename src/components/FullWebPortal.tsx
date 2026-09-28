import React, { useState, useEffect } from 'react';
import { 
  Tractor, Users, Briefcase, IndianRupee, Bell, Search, 
  MapPin, Calendar, Clock, ShieldCheck, CheckCircle2, 
  Star, ChevronRight, SlidersHorizontal, Plus, Sparkles, 
  Bot, LogOut, Bookmark, BookmarkCheck, Phone, Check, 
  AlertCircle, Edit3, KeyRound, Award, RefreshCw, Layers, LayoutDashboard, Globe,
  Calculator, Compass, LogIn, UserPlus
} from 'lucide-react';
import { 
  JobItem, WorkerCandidate, JobApplication, HiredWorkerRecord, 
  UserSession, UserRole, LanguageCode, NotificationItem 
} from '../types';
import { FarmConnectStore } from '../data/store';
import { TRANSLATIONS, LANGUAGES, getTranslated, translateCrop, translateWorkType, translateJobTitle } from '../data/translations';
import { ApplyJobModal } from './screens/ApplyJobModal';
import { NotificationsModal } from './screens/NotificationsModal';
import { AgriVoiceAssistantModal } from './screens/AgriVoiceAssistantModal';
import { ForgotPasswordModal } from './screens/ForgotPasswordModal';
import { AdminPortal } from './screens/AdminPortal';
import { FullWagePaymentModal } from './FullWagePaymentModal';
import { FullJobDetailsModal } from './FullJobDetailsModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import { MapScreen } from './screens/MapScreen';
import { WorkCalendarScreen } from './screens/WorkCalendarScreen';
import { WageCalculatorScreen } from './screens/WageCalculatorScreen';

const PRESET_PROFILES: UserSession[] = [
  {
    token: 'token-farmer-1',
    userId: 1,
    fullName: 'Ramesh K. (Murugan Farms)',
    mobileNumber: '+91 98401 23456',
    role: 'FARMER',
    language: 'ta',
    villageOrTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    farmSizeAcres: 5.5,
    mainCrops: ['Paddy', 'Sugarcane', 'Banana'],
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    pattaSurveyNo: 'TR-892 / 14B',
    soilType: 'Cauvery Delta Alluvial Loam',
    irrigationSource: 'Cauvery River Canal & 7.5HP Solar Borewell',
    aadhaarNumberMasked: '•••• •••• 4192',
    upiId: 'ramesh.farms@okaxis',
    bankName: 'Canara Bank (Thiruvaiyaru Branch)',
    bankAccountLast4: '4192',
    toolsOwned: ['45HP Escorts Tractor', 'Disc Harrow & Rotavator', '3x Battery Knapsack Sprayers'],
    emergencyContact: '+91 94432 10987 (Ramesh Agri Center)',
    isVerified: true,
    joinedDate: 'Jan 2024'
  },
  {
    token: 'token-worker-201',
    userId: 201,
    fullName: 'Murugesan V.',
    mobileNumber: '+91 98405 67890',
    role: 'WORKER',
    language: 'ta',
    villageOrTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    skills: ['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation'],
    experienceYears: 7,
    dailyWageExpected: 750,
    reliabilityScore: 96,
    rating: 4.9,
    reviewCount: 22,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    aadhaarNumberMasked: '•••• •••• 7821',
    upiId: 'murugesan.agri@oksbi',
    bankName: 'Canara Bank (Thiruvaiyaru)',
    bankAccountLast4: '7821',
    toolsOwned: ['Heavy Paddy Sickle (Steel)', 'Field Rubber Boots', 'Thresher Safety Gloves'],
    completedJobsCount: 52,
    totalEarnings: 39000,
    emergencyContact: '+91 98405 11223 (Wife - Selvi M.)',
    isVerified: true,
    joinedDate: 'Mar 2024',
    bio: 'Punctual, hardworking agricultural specialist with 7 years of paddy harvesting and mechanized thresher experience.'
  },
  {
    token: 'token-worker-203',
    userId: 203,
    fullName: 'Lakshmi Devi',
    mobileNumber: '+91 94456 78901',
    role: 'WORKER',
    language: 'ta',
    villageOrTown: 'Papanasam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    skills: ['Cotton Picking', 'Weeding', 'Sowing', 'Paddy Transplanting'],
    experienceYears: 5,
    dailyWageExpected: 700,
    reliabilityScore: 98,
    rating: 5.0,
    reviewCount: 19,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    aadhaarNumberMasked: '•••• •••• 9302',
    upiId: 'lakshmi.delta@paytm',
    bankName: 'State Bank of India (Papanasam Branch)',
    bankAccountLast4: '9302',
    toolsOwned: ['Cotton Picking Sack Harness', 'Nursery Line Rope', 'Hand Weeding Sickle'],
    completedJobsCount: 41,
    totalEarnings: 28700,
    emergencyContact: '+91 94456 33445 (Son - Kumar)',
    isVerified: true,
    joinedDate: 'May 2024',
    bio: 'Fastest cotton picker in Papanasam block. Expert in nursery bed preparation and line transplanting.'
  },
  {
    token: 'token-worker-204',
    userId: 204,
    fullName: 'Karthik Raja',
    mobileNumber: '+91 93450 12345',
    role: 'WORKER',
    language: 'ta',
    villageOrTown: 'Budalur',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    skills: ['Tractor operation', 'Harvesting', 'Drip Irrigation Setup'],
    experienceYears: 4,
    dailyWageExpected: 850,
    reliabilityScore: 91,
    rating: 4.7,
    reviewCount: 14,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    aadhaarNumberMasked: '•••• •••• 5519',
    upiId: 'karthik.tractor@axl',
    bankName: 'HDFC Bank Agri (Budalur)',
    bankAccountLast4: '5519',
    toolsOwned: ['Commercial 45HP Tractor License', 'Laser Leveler Sensor Kit'],
    completedJobsCount: 36,
    totalEarnings: 30600,
    emergencyContact: '+91 93450 99887 (Brother - Suresh)',
    isVerified: true,
    joinedDate: 'Jun 2024',
    bio: 'Mechanized farmer helper, licensed 45HP tractor driver with laser leveler experience.'
  }
];

interface FullWebPortalProps {
  session: UserSession | null;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSwitchToEmulator: () => void;
  onUpdateSession: (updated: Partial<UserSession>) => void;
  onLogout: () => void;
  onOpenIntro?: () => void;
  onOpenAuth?: (mode?: 'LOGIN' | 'REGISTER') => void;
}

export const FullWebPortal: React.FC<FullWebPortalProps> = ({
  session,
  selectedLanguage,
  onLanguageChange,
  onSwitchToEmulator,
  onUpdateSession,
  onLogout,
  onOpenIntro,
  onOpenAuth
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');
  
  // Data state
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [candidates, setCandidates] = useState<WorkerCandidate[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [hiredRecords, setHiredRecords] = useState<HiredWorkerRecord[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Modals
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobItem | null>(null);
  const [selectedHiredForPayment, setSelectedHiredForPayment] = useState<HiredWorkerRecord | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobItem | null>(null);
  const [selectedCandidateForProfile, setSelectedCandidateForProfile] = useState<WorkerCandidate | null>(null);
  const [profileSwitchNotice, setProfileSwitchNotice] = useState<string>('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('ALL');
  const [maxDistance, setMaxDistance] = useState<number>(30);
  const [minWage, setMinWage] = useState<number>(500);

  // Post Job form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCrop, setNewJobCrop] = useState('Paddy');
  const [newJobWorkType, setNewJobWorkType] = useState('Harvesting');
  const [newJobWorkers, setNewJobWorkers] = useState(4);
  const [newJobWage, setNewJobWage] = useState(750);
  const [newJobStartDate, setNewJobStartDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [newJobEndDate, setNewJobEndDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [newJobDesc, setNewJobDesc] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [postSuccessMessage, setPostSuccessMessage] = useState('');

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const currentRole: UserRole = session?.role || 'FARMER';

  // Load all data
  const refreshData = () => {
    setJobs(FarmConnectStore.getJobs());
    setCandidates(FarmConnectStore.getCandidates());
    setApplications(FarmConnectStore.getApplications());
    setHiredRecords(FarmConnectStore.getHiredWorkers());
    setSavedJobIds(FarmConnectStore.getSavedJobIds(session?.userId || 201));
    setNotifications(FarmConnectStore.getNotifications());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Role switch handler
  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'FARMER') {
      onUpdateSession({
        userId: 1,
        fullName: 'Ramesh K. (Murugan Farms)',
        role: 'FARMER',
        villageOrTown: 'Thiruvaiyaru',
        district: 'Thanjavur',
        state: 'Tamil Nadu',
        farmSizeAcres: 5.5,
        mainCrops: ['Paddy', 'Sugarcane'],
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      });
    } else if (newRole === 'WORKER') {
      onUpdateSession({
        userId: 201,
        fullName: 'Murugesan V.',
        role: 'WORKER',
        villageOrTown: 'Thiruvaiyaru',
        district: 'Thanjavur',
        state: 'Tamil Nadu',
        skills: ['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation'],
        experienceYears: 7,
        dailyWageExpected: 750,
        reliabilityScore: 96,
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      });
    } else if (newRole === 'ADMIN') {
      onUpdateSession({
        userId: 999,
        fullName: 'Admin - Delta Agritech Office',
        role: 'ADMIN',
        villageOrTown: 'Thanjavur Collectorate',
        district: 'Thanjavur',
        state: 'Tamil Nadu',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      });
    }
    setActiveTab('DASHBOARD');
  };

  // Job Bookmark
  const handleToggleBookmark = (jobId: number) => {
    const updated = FarmConnectStore.toggleSaveJob(jobId, session?.userId || 201);
    setSavedJobIds(updated);
  };

  // Farmer Hire applicant
  const handleHireApplicant = (appId: string) => {
    try {
      FarmConnectStore.hireApplicant(appId);
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Attendance
  const handleMarkAttendance = (hiredId: string, status: 'PRESENT' | 'ABSENT' | 'HALF_DAY') => {
    FarmConnectStore.markAttendance(hiredId, status);
    refreshData();
  };

  // Payment
  const handlePayWorker = (hiredId: string, amount: number) => {
    FarmConnectStore.recordPayment(hiredId, amount, 'UPI');
    refreshData();
  };

  const handleOpenPaymentModal = (hired: HiredWorkerRecord) => {
    setSelectedHiredForPayment(hired);
    setIsPaymentModalOpen(true);
  };

  const handleSelectPresetProfile = (profile: UserSession) => {
    onUpdateSession(profile);
    FarmConnectStore.setUserSession(profile);
    setProfileSwitchNotice(`Switched active profile to ${profile.fullName} (${profile.role === 'FARMER' ? 'Landowner Farmer' : 'Agricultural Worker'})`);
    setTimeout(() => setProfileSwitchNotice(''), 4500);
  };

  // Post Job submit
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    setIsSubmittingJob(true);
    try {
      const created = FarmConnectStore.createJob({
        farmerId: session?.userId || 1,
        farmerName: session?.fullName || 'Murugan Farms (Ramesh K.)',
        farmerPhone: session?.mobileNumber || '+91 98401 23456',
        farmerLocation: `${session?.villageOrTown || 'Thiruvaiyaru'}, ${session?.district || 'Thanjavur'}`,
        villageTown: session?.villageOrTown || 'Thiruvaiyaru',
        district: session?.district || 'Thanjavur',
        state: session?.state || 'Tamil Nadu',
        title: newJobTitle,
        cropType: newJobCrop,
        workType: newJobWorkType,
        description: newJobDesc || 'Experienced agricultural workers needed for seasonal field operations.',
        workersRequired: Number(newJobWorkers),
        wageAmount: Number(newJobWage),
        startDate: newJobStartDate,
        endDate: newJobEndDate
      });

      // Also notify backend
      fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      }).catch(() => {});

      refreshData();
      setIsPostJobModalOpen(false);
      setNewJobTitle('');
      setNewJobDesc('');
      setPostSuccessMessage(`Job "${created.title}" successfully published and broadcasted to local workers!`);
      setTimeout(() => setPostSuccessMessage(''), 4000);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.villageTown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCrop === 'ALL' || j.cropType.toLowerCase() === selectedCrop.toLowerCase();
    const matchesWork = selectedWorkType === 'ALL' || j.workType.toLowerCase() === selectedWorkType.toLowerCase();
    const matchesDistance = (j.distanceKm || 5) <= maxDistance;
    const matchesWage = j.wageAmount >= minWage;
    return matchesSearch && matchesCrop && matchesWork && matchesDistance && matchesWage;
  });

  // Filtered candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.villageTown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Farmer's own jobs and applicants
  const myFarmerJobs = jobs.filter(j => j.farmerId === (session?.userId || 1));
  const myFarmerApplicants = applications.filter(a => a.farmerId === (session?.userId || 1));
  const myFarmerHired = hiredRecords.filter(h => h.farmerId === (session?.userId || 1));

  // Worker's applications and saved jobs
  const myWorkerApplications = applications.filter(a => a.workerId === (session?.userId || 201));
  const myWorkerHired = hiredRecords.filter(h => h.workerId === (session?.userId || 201));
  const savedJobsList = jobs.filter(j => savedJobIds.includes(j.id));

  // If Admin role, render Admin Portal
  if (currentRole === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-950 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center font-black text-white">
              🌾
            </div>
            <div>
              <span className="font-bold text-sm">FarmConnect AI Platform Administration</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Logged in as SuperAdmin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => handleSwitchRole('FARMER')}
                className="px-3 py-1 text-slate-300 hover:text-white"
              >
                Farmer View
              </button>
              <button
                onClick={() => handleSwitchRole('WORKER')}
                className="px-3 py-1 text-slate-300 hover:text-white"
              >
                Worker View
              </button>
              <button
                className="px-3 py-1 bg-emerald-800 text-white font-bold rounded-lg"
              >
                Admin View
              </button>
            </div>

            <button
              onClick={onSwitchToEmulator}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              📱 Phone Simulator
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AdminPortal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-inner">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">{t.appName || 'FarmConnect AI'}</span>
                <span className="px-2 py-0.5 bg-emerald-800/80 text-emerald-200 border border-emerald-700 rounded-full text-[10px] font-bold uppercase">
                  {currentRole === 'FARMER' ? (t.farmerPortal || 'FARMER PORTAL') : (t.workerPortal || 'WORKER PORTAL')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 hidden sm:block">
                {t.appTagline || 'Direct Agricultural Workforce Network • Cauvery Delta'}
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Multilingual Selector - Visible everywhere */}
            <div className="relative">
              <select
                id="select_portal_language"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                aria-label="Select Interface Language"
                className="h-9 px-2.5 sm:px-3 bg-emerald-900/80 border border-emerald-600/70 hover:border-emerald-400 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer shadow-xs"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-emerald-900/70 p-1 rounded-xl border border-emerald-800 text-xs font-semibold">
              <button
                onClick={() => handleSwitchRole('FARMER')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  currentRole === 'FARMER' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                🌾 {t.farmer || 'Farmer'}
              </button>
              <button
                onClick={() => handleSwitchRole('WORKER')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  currentRole === 'WORKER' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                🧑‍🌾 {t.worker || 'Worker'}
              </button>
              <button
                onClick={() => handleSwitchRole('ADMIN')}
                className="px-2 py-1.5 text-emerald-300 hover:text-white rounded-lg"
                title="Switch to Administrator Console"
              >
                ⚙️ {t.admin || 'Admin'}
              </button>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>{t.voiceAssistant || 'Agri AI Assistant'}</span>
            </button>

            {/* 3D Intro Tour Button */}
            {onOpenIntro && (
              <button
                onClick={onOpenIntro}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 rounded-xl text-xs font-semibold transition-all"
                title="Watch 3D Agricultural Journey"
              >
                <span>🌾</span>
                <span>3D Tour</span>
              </button>
            )}

            {/* Phone Emulator Switcher Button */}
            <button
              onClick={onSwitchToEmulator}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Switch to Mobile Emulator Preview"
            >
              <span>📱</span>
              <span className="hidden sm:inline">{t.phoneMode || 'Phone Mode'}</span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl bg-emerald-900/70 text-emerald-200 hover:text-white hover:bg-emerald-800 border border-emerald-800 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-emerald-950">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar / Sign In Button */}
            {session ? (
              <div 
                onClick={() => setActiveTab('PROFILE')}
                className="flex items-center gap-2 pl-2 border-l border-emerald-900 cursor-pointer group"
                title="Manage profile & settings"
              >
                <img
                  src={session?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400/50 group-hover:border-white transition-all"
                />
                <div className="hidden xl:block text-left text-xs">
                  <p className="font-bold text-white leading-tight">{session?.fullName || 'User'}</p>
                  <p className="text-[10px] text-emerald-300">{session?.district || 'Thanjavur'}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth?.('LOGIN')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2">
              {t.mainMenu || 'Main Menu'}
            </div>

            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'DASHBOARD' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.dashboardOverview || 'Dashboard Overview'}</span>
            </button>

            {currentRole === 'FARMER' ? (
              <>
                <button
                  onClick={() => setActiveTab('FIND_WORKERS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'FIND_WORKERS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>{t.findWorkers || 'Find Workers'}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {candidates.length}
                  </span>
                </button>

                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-200 mt-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.postAFarmJob || '+ Post a Farm Job'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('MY_JOBS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'MY_JOBS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{t.myFarmJobsNav || 'My Farm Jobs'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{myFarmerJobs.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('APPLICATIONS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'APPLICATIONS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    <span>{t.workerApplicants || 'Worker Applicants'}</span>
                  </div>
                  {myFarmerApplicants.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {myFarmerApplicants.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('ATTENDANCE')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ATTENDANCE' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IndianRupee className="w-4 h-4" />
                    <span>{t.attendancePayouts || 'Attendance & Payouts'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{myFarmerHired.length}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('SEARCH_JOBS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'SEARCH_JOBS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4" />
                    <span>{t.findFarmJobs || 'Find Farm Jobs'}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {jobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('MY_APPLICATIONS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'MY_APPLICATIONS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{t.myApplications || 'My Applications'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{myWorkerApplications.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('SAVED_JOBS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'SAVED_JOBS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4" />
                    <span>{t.savedJobs || 'Saved Jobs'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{savedJobIds.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('EARNINGS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'EARNINGS' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IndianRupee className="w-4 h-4" />
                    <span>{t.myEarningsLedger || 'My Earnings Ledger'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">₹{(session?.totalEarnings || 6750).toLocaleString()}</span>
                </button>
              </>
            )}

            {/* Shared Agri Utilities Navigation */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                Agri Utilities
              </div>

              <button
                onClick={() => setActiveTab('MAP')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'MAP' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>{t.fieldMap || 'Regional Field Map'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Live
                </span>
              </button>

              <button
                onClick={() => setActiveTab('CALENDAR')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'CALENDAR' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>{t.workCalendar || 'Work Calendar'}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('WAGE_CALCULATOR')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'WAGE_CALCULATOR' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4" />
                  <span>{t.wageCalculator || 'Fair Wage Estimator'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  AI
                </span>
              </button>

              <button
                onClick={() => setActiveTab('PROFILE')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'PROFILE' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>{t.myProfileSettings || 'My Profile & Settings'}</span>
              </button>
            </div>
          </div>

          {/* AI Helper Banner */}
          <div className="p-4 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">{t.cauveryDeltaWageIndex || 'Cauvery Delta Wage Index'}</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              {t.deltaWageBenchmark || 'Harvest labor benchmark: Paddy ₹750/day, Sugarcane cutting ₹850/day.'}
            </p>
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1 transition-all"
            >
              <span>{t.askAgriAi || 'Ask Agri AI'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </aside>

        {/* Center Main Workspace */}
        <main className="flex-1 space-y-6">
          {postSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{postSuccessMessage}</span>
            </div>
          )}

          {/* TAB: DASHBOARD */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome Card */}
              <div className="p-6 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-emerald-700/60 border border-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {currentRole === 'FARMER' ? `🚜 ${t.farmOwner || 'Farm Owner'}` : `🌾 ${t.agriSpecialist || 'Agricultural Specialist'}`}
                    </span>
                    <span className="text-emerald-300 text-xs font-semibold">
                      {session?.villageOrTown}, {session?.district}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {t.welcomeBack || 'Welcome back'}, {session?.fullName}!
                  </h2>
                  <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
                    {currentRole === 'FARMER'
                      ? (selectedLanguage === 'ta' ? 'தஞ்சாவூர் மாவட்டத்தில் உங்கள் விவசாயப் பணிகள் செயலில் உள்ளன. வேலைகளை அறிவிக்கவும், தொழிலாளர் விண்ணப்பங்களை மதிப்பாய்வு செய்யவும்.' : selectedLanguage === 'ml' ? 'നിങ്ങളുടെ സജീവ ഫീൽഡ് ജോലികൾ നടക്കുന്നു. ജോലികൾ പോസ്റ്റ് ചെയ്യുക, തൊഴിലാളി അപേക്ഷകൾ പരിശോധിച്ച് വേതനം നൽകുക.' : selectedLanguage === 'hi' ? 'आपके खेत के कार्य सक्रिय हैं। कार्य पोस्ट करें, श्रमिक आवेदनों की समीक्षा करें।' : 'You have active field tasks underway in Thanjavur district. Broadcast jobs, review worker applications, and settle daily wages directly.')
                      : (selectedLanguage === 'ta' ? 'அருகிலுள்ள அறுவடை மற்றும் சாகுபடி வேலைகளை ஆராயுங்கள், நேரடி பணப்பட்டுவாடா மற்றும் நியாயமான கூலி பெறுங்கள்.' : selectedLanguage === 'ml' ? 'നേരിട്ടുള്ള പ്രതിദിന പേയ്‌മെന്റുകളും മികച്ച വേതനവും ഉള്ള വിളവെടുപ്പ് ജോലികൾ കണ്ടെത്തുക.' : selectedLanguage === 'hi' ? 'समान दिन के भुगतान और उचित मजदूरी के साथ नजदीकी कटाई और खेती के काम खोजें।' : 'Explore verified nearby harvesting and cultivation jobs with direct same-day payments and fair regional wages.')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentRole === 'FARMER' ? (
                    <button
                      onClick={() => setIsPostJobModalOpen(true)}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.postAFarmJob || 'Post a Farm Job'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('SEARCH_JOBS')}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Search className="w-4 h-4" />
                      <span>{t.exploreFarmJobs || 'Explore Farm Jobs'} ({jobs.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {currentRole === 'FARMER' ? (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.activeJobs || 'Active Farm Jobs'}</span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">{myFarmerJobs.length}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">In {session?.district || 'Cauvery Delta'}</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.workersRequired || 'Workers Required'}</span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">
                        {myFarmerJobs.reduce((acc, j) => acc + (j.workersRequired - j.workersHired), 0)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{t.needMoreWorkers || 'Harvest quota remaining'}</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.activeContracts || 'Active Contracts'}</span>
                      <span className="text-2xl font-black text-emerald-800 mt-1 block">{myFarmerHired.length}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">{t.attendancePayouts || 'Daily attendance active'}</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.wagesDisbursed || 'Wages Disbursed'}</span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">
                        ₹{myFarmerHired.reduce((acc, h) => acc + h.paidAmount, 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Direct UPI verified</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.openNearbyJobs || 'Open Nearby Jobs'}</span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">{jobs.length}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Within 25 km radius</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.myApplications || 'My Applications'}</span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">{myWorkerApplications.length}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                        {myWorkerApplications.filter(a => a.status === 'HIRED').length} {t.hired || 'Hired'}
                      </span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.reliabilityScore || 'Reliability Score'}</span>
                      <span className="text-2xl font-black text-emerald-800 mt-1 block">{session?.reliabilityScore || 96}%</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1 block">⭐ 4.9 (22 reviews)</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-xs font-bold text-slate-500 block">{t.totalEarnings || 'Total Earnings'}</span>
                      <span className="text-2xl font-black text-emerald-800 mt-1 block">
                        ₹{(session?.totalEarnings || 6750).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{t.shiftsRecorded || 'This harvest month'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Feed: Recent Jobs / Applications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentRole === 'FARMER' ? (t.myJobs || 'Recent Job Postings') : (t.recommendedJobs || 'Recommended Farm Work')}
                  </h3>
                  <button
                    onClick={() => setActiveTab(currentRole === 'FARMER' ? 'MY_JOBS' : 'SEARCH_JOBS')}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>{t.viewAll || 'View All'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.slice(0, 4).map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobForDetails(job)}
                      className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-emerald-700 transition-all flex flex-col justify-between cursor-pointer hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                              {translateCrop(job.cropType, selectedLanguage)}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                              {translateWorkType(job.workType, selectedLanguage)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-emerald-800">₹{job.wageAmount}</span>
                            <span className="text-[10px] text-slate-500 block">/ {t.day || 'day'}</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mt-2">{translateJobTitle(job.title, selectedLanguage)}</h4>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.farmerLocation}</span>
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">
                          {job.workersRequired - job.workersHired} {t.needMoreWorkers || 'more workers required'}
                        </span>
                        {currentRole === 'WORKER' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJobForDetails(job);
                            }}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-xs"
                          >
                            {t.applyNow || 'View Details & Apply'}
                          </button>
                        ) : (
                          <span className="text-emerald-800 font-bold text-xs">
                            View Details ➔
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEARCH JOBS (FOR WORKER) */}
          {activeTab === 'SEARCH_JOBS' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Search & Filter Controls */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchJobsPlaceholder || "Search by crop, task (Harvesting, Cutting), village, or district..."}
                    className="w-full h-10 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="font-bold text-slate-700 text-[11px]">{t.crop || 'Crop'}:</span>
                    {['ALL', 'Paddy', 'Sugarcane', 'Cotton', 'Banana', 'Wheat'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCrop(c)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          selectedCrop === c 
                            ? 'bg-emerald-800 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {c === 'ALL' ? (t.all || 'All Crops') : translateCrop(c, selectedLanguage)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <span>{t.maxDistance || 'Max Radius'}:</span>
                      <span className="text-emerald-800 font-black">{maxDistance} km</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="w-24 accent-emerald-700"
                    />

                    {(selectedCrop !== 'ALL' || searchQuery || maxDistance < 30) && (
                      <button
                        onClick={() => {
                          setSelectedCrop('ALL');
                          setSearchQuery('');
                          setMaxDistance(30);
                        }}
                        className="text-[11px] text-emerald-800 hover:underline font-bold"
                      >
                        {t.clearFilters || 'Clear Filters'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-3">
                {filteredJobs.length === 0 ? (
                  <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
                    <span className="text-3xl">🌾</span>
                    <h4 className="text-sm font-bold text-slate-900">{t.noJobsMatch || 'No farm jobs match your criteria'}</h4>
                    <p className="text-xs text-slate-500">
                      Try adjusting the radius slider or clearing the crop filter.
                    </p>
                    <button
                      onClick={() => { setSelectedCrop('ALL'); setSearchQuery(''); setMaxDistance(50); }}
                      className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl mt-2"
                    >
                      {t.clearFilters || 'Reset All Filters'}
                    </button>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobForDetails(job)}
                      className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-emerald-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:shadow-md"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                            {translateCrop(job.cropType, selectedLanguage)}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            {translateWorkType(job.workType, selectedLanguage)}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {job.startDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{translateJobTitle(job.title, selectedLanguage)}</h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.farmerLocation}</span>
                          <span className="text-slate-400">• {t.farmer || 'Farmer'}: {job.farmerName}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{job.description}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-base font-black text-emerald-800">₹{job.wageAmount}</span>
                          <span className="text-[10px] text-slate-500 block">/ {t.day || 'day'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(job.id);
                            }}
                            className={`p-2 rounded-xl border transition-all ${
                              savedJobIds.includes(job.id)
                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200'
                            }`}
                            title={t.saveJob || "Save Job"}
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJobForDetails(job);
                            }}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                          >
                            {t.applyNow || 'View Details & Apply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: FIND WORKERS (FOR FARMER) */}
          {activeTab === 'FIND_WORKERS' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchWorkersPlaceholder || "Search verified workers by name, skill (Harvesting, Tractor), or village..."}
                    className="w-full h-10 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidateForProfile(candidate)}
                    className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-emerald-700 transition-all flex flex-col justify-between cursor-pointer hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                            alt={candidate.fullName}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 shadow-xs shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="text-xs font-bold text-slate-900">{candidate.fullName}</h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {candidate.villageTown}, {candidate.district} • <span className="text-emerald-700 font-semibold">{candidate.distanceKm} km</span>
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {candidate.experienceYears} Yrs Exp • Reliability {candidate.reliabilityScore}%
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-800">₹{candidate.dailyRate}</span>
                          <span className="text-[10px] text-slate-500 block">/ {t.day || 'day'}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {candidate.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[10px] font-semibold">
                            ✓ {s}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl italic line-clamp-2">
                        "{candidate.bio}"
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          ⭐ {candidate.rating}
                        </span>
                        <span className="text-slate-400 text-[10px]">({candidate.reviewCount} reviews)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidateForProfile(candidate);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          View Dossier
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidateForProfile(candidate);
                          }}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          {t.inviteWorker || 'Invite to Job'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MY JOBS (FOR FARMER) */}
          {activeTab === 'MY_JOBS' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{t.myFarmJobsNav || 'Farm Jobs Posted by You'}</h3>
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.postAFarmJob || 'Post New Job'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {myFarmerJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                            {translateCrop(job.cropType, selectedLanguage)}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{translateJobTitle(job.title, selectedLanguage)}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{job.workingHours} • ₹{job.wageAmount}/{t.day || 'day'}</p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        job.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span>{t.hiringProgress || 'Hiring Progress'}: <strong>{job.workersHired} of {job.workersRequired} {t.workersHired || 'workers filled'}</strong></span>
                      <button
                        onClick={() => setActiveTab('APPLICATIONS')}
                        className="text-emerald-800 font-bold hover:underline"
                      >
                        {t.viewApplicants || 'View Applicants'} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: APPLICATIONS / APPLICANTS */}
          {activeTab === 'APPLICATIONS' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900">Worker Applications Received</h3>

              <div className="space-y-3">
                {myFarmerApplicants.length === 0 ? (
                  <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
                    No active applications yet. Broadcast your jobs or invite nearby verified workers.
                  </div>
                ) : (
                  myFarmerApplicants.map((app) => (
                    <div key={app.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{app.workerName}</h4>
                          <p className="text-[11px] text-slate-500">Applied for: {app.jobTitle}</p>
                          <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
                            Proposed Wage: ₹{app.appliedWage}/day (Match: {app.matchScore}%)
                          </p>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'HIRED' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'APPLIED' ? 'bg-amber-100 text-amber-900' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{app.message}"
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-mono text-[11px]">Phone: {app.workerPhone}</span>

                        {app.status === 'APPLIED' && (
                          <button
                            onClick={() => handleHireApplicant(app.id)}
                            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs active:scale-95 transition-all"
                          >
                            Hire This Worker
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: ATTENDANCE & PAYOUTS (FOR FARMER) */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900">Active Field Labor Contracts & Attendance</h3>

              <div className="space-y-3">
                {myFarmerHired.map((hired) => {
                  const balance = Math.max(0, hired.totalEarnings - hired.paidAmount);
                  const isFullyPaid = balance === 0 && hired.totalEarnings > 0;
                  return (
                    <div key={hired.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={hired.workerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                            alt={hired.workerName}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-slate-900">{hired.workerName}</h4>
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
                                Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">{hired.jobTitle} • ₹{hired.dailyWage}/day</p>
                            <span className="text-[10px] text-slate-400 font-mono">{hired.workerPhone}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isFullyPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {isFullyPaid ? '✓ All Settled' : `₹${balance} Due`}
                          </span>
                          <p className="text-sm font-black text-slate-900 mt-1">Accrued: ₹{hired.totalEarnings}</p>
                          <span className="text-[10px] text-slate-500 block">{hired.totalDaysPresent} shifts completed</span>
                        </div>
                      </div>

                      {/* Today's Attendance Marking */}
                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-slate-700">Today's Field Status:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleMarkAttendance(hired.id, 'PRESENT')}
                            className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-800 active:scale-95 transition-transform"
                          >
                            ✓ Present (Full Shift)
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(hired.id, 'HALF_DAY')}
                            className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 active:scale-95 transition-transform"
                          >
                            Half-Day
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(hired.id, 'ABSENT')}
                            className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] hover:bg-slate-300 active:scale-95 transition-transform"
                          >
                            Absent
                          </button>
                        </div>
                      </div>

                      {/* Payout actions with Full Process Trigger */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs pt-2 border-t border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Paid to date: </span>
                            <strong className="text-emerald-800">₹{hired.paidAmount}</strong>
                            <span className="text-slate-400">• Balance:</span>
                            <strong className={balance > 0 ? 'text-amber-700' : 'text-slate-500'}>₹{balance}</strong>
                          </div>
                          {hired.transactionRef && (
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              Latest Ref: {hired.transactionRef}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {balance > 0 ? (
                            <button
                              onClick={() => handleOpenPaymentModal(hired)}
                              className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs"
                            >
                              <IndianRupee className="w-4 h-4" />
                              <span>Pay Balance (₹{balance}) — Full Payment Process</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenPaymentModal(hired)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1 text-xs"
                            >
                              <IndianRupee className="w-3.5 h-3.5" />
                              <span>Make Additional Payment / Advance</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: MY APPLICATIONS (FOR WORKER) */}
          {activeTab === 'MY_APPLICATIONS' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900">My Job Applications & Status</h3>

              <div className="space-y-3">
                {myWorkerApplications.length === 0 ? (
                  <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
                    You haven't submitted any job applications yet.
                  </div>
                ) : (
                  myWorkerApplications.map((app) => (
                    <div key={app.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                              {app.cropType}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{app.jobTitle}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Farmer: {app.farmerName} • {app.farmerLocation}</p>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'HIRED' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'APPLIED' ? 'bg-amber-100 text-amber-900' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                        <span>Proposed Daily Rate: <strong>₹{app.appliedWage}/day</strong></span>
                        <span className="text-emerald-800 font-bold">Match Score: {app.matchScore}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SAVED JOBS (FOR WORKER) */}
          {activeTab === 'SAVED_JOBS' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900">Saved / Bookmarked Jobs</h3>

              <div className="space-y-3">
                {savedJobsList.length === 0 ? (
                  <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
                    No saved jobs. Bookmark jobs from the search tab to view them here.
                  </div>
                ) : (
                  savedJobsList.map((job) => (
                    <div key={job.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                        <p className="text-[11px] text-slate-500">{job.cropType} • ₹{job.wageAmount}/day • {job.farmerLocation}</p>
                      </div>
                      <button
                        onClick={() => setSelectedJobToApply(job)}
                        className="px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: EARNINGS (FOR WORKER) */}
          {activeTab === 'EARNINGS' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-6 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl space-y-2">
                <span className="text-xs text-emerald-200">{t.verifiedDirectEarnings || 'Verified Direct Agricultural Earnings'}</span>
                <h3 className="text-3xl font-black">₹{(session?.totalEarnings || 6750).toLocaleString()}</h3>
                <p className="text-xs text-emerald-200">
                  9 {t.shiftsSettledNote || 'shifts recorded with certified farmers. All payments settled via UPI/Cash.'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800">{t.recentCompletedShifts || 'Recent Completed Shifts & Payouts'}</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-bold text-slate-900">{t.paddyHarvesting || 'Paddy Harvesting & Bundling'}</p>
                      <p className="text-[10px] text-slate-500">Ramesh K. (Murugan Farms) • 2 {t.days || 'days'}</p>
                    </div>
                    <span className="font-bold text-emerald-800">+ ₹1,500</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-bold text-slate-900">{t.sugarcaneCutting || 'Sugarcane Cutting'}</p>
                      <p className="text-[10px] text-slate-500">Kaveri Delta Agro • 3 {t.days || 'days'}</p>
                    </div>
                    <span className="font-bold text-emerald-800">+ ₹2,550</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILE & SETTINGS */}
          {activeTab === 'PROFILE' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-fadeIn">
              {profileSwitchNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{profileSwitchNotice}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={session?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                    alt={session?.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-700 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{session?.fullName}</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase">
                        {currentRole === 'FARMER' ? (t.farmer || 'LANDOWNER FARMER') : (t.worker || 'AGRICULTURAL WORKER')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{session?.villageOrTown}, {session?.district}, {session?.state}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Aadhaar Verified
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        UIDAI: •••• •••• {session?.mobileNumber?.slice(-4) || '8841'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsResetPinOpen(true)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.changePin || 'Change PIN'}</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.signOut || 'Sign Out'}</span>
                  </button>
                </div>
              </div>

              {/* Profile Switcher Selector: Seamlessly switch between different profiles */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>👥 Switch Profile / Test Different Role Profiles</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Click to immediately switch view & credentials</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {PRESET_PROFILES.map((prof) => {
                    const isCurrent = session?.userId === prof.userId;
                    return (
                      <button
                        key={prof.userId}
                        type="button"
                        onClick={() => handleSelectPresetProfile(prof)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isCurrent
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <img
                          src={prof.avatar}
                          alt={prof.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-white/40 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate">{prof.fullName}</p>
                          <p className={`text-[10px] truncate ${isCurrent ? 'text-emerald-200' : 'text-slate-500'}`}>
                            {prof.role === 'FARMER' ? '🌾 Landowner' : '🛠️ Labor Specialist'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comprehensive Required Profile Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Contact & Identity */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.contactInformation || 'Contact & Identity Information'}
                  </span>
                  <div className="space-y-1.5">
                    <p className="flex justify-between">
                      <strong className="text-slate-600">{t.mobileNumber || 'Mobile'}:</strong>
                      <span className="font-mono text-slate-900">{session?.mobileNumber || '+91 98401 23456'}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Email:</strong>
                      <span className="text-slate-900">{session?.email || 'registered@farmconnect.in'}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">{t.location || 'Village / Taluk'}:</strong>
                      <span className="text-slate-900">{session?.villageOrTown}, {session?.district}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">State & Pincode:</strong>
                      <span className="text-slate-900">{session?.state} • 613204</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Aadhaar e-KYC:</strong>
                      <span className="text-emerald-700 font-semibold">✓ Verified via UIDAI OTP</span>
                    </p>
                  </div>
                </div>

                {/* 2. Agriculture / Work Specifications */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {currentRole === 'FARMER' ? (t.farmer || 'Farm & Land Specifications') : (t.worker || 'Skills & Daily Rate')}
                  </span>
                  <div className="space-y-1.5">
                    {currentRole === 'FARMER' ? (
                      <>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">{t.farmSize || 'Cultivated Land'}:</strong>
                          <span className="font-bold text-emerald-800">{session?.farmSizeAcres || 8.5} {selectedLanguage === 'ta' ? 'ஏக்கர்' : 'Acres'}</span>
                        </p>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">{t.cropsGrown || 'Primary Crops'}:</strong>
                          <span className="font-medium text-slate-900">{(session?.mainCrops || ['Paddy', 'Sugarcane']).map(c => translateCrop(c, selectedLanguage)).join(', ')}</span>
                        </p>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">Irrigation Source:</strong>
                          <span className="text-slate-900">Canal (Cauvery Delta) & Borewell</span>
                        </p>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">Patta / Chitta Record:</strong>
                          <span className="text-emerald-700 font-mono">TNJ-THIR-2024-8841</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">{t.skills || 'Key Skills'}:</strong>
                          <span className="font-medium text-slate-900">{(session?.skills || ['Harvesting', 'Paddy work']).map(s => translateWorkType(s, selectedLanguage)).join(', ')}</span>
                        </p>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">{t.expectedWage || 'Daily Expected Wage'}:</strong>
                          <span className="font-bold text-emerald-800">₹{session?.dailyWageExpected || 750}/{t.day || 'day'}</span>
                        </p>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">{t.experience || 'Field Experience'}:</strong>
                          <span className="text-slate-900">{session?.experienceYears || 7} {selectedLanguage === 'ta' ? 'ஆண்டுகள்' : 'Years'}</span>
                        </p>
                        <p className="flex justify-between">
                          <strong className="text-slate-600">Reliability Score:</strong>
                          <span className="text-emerald-700 font-bold">{session?.reliabilityScore || 96}% (Top Rated)</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Bank & Wage Payment Details */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    💳 Bank Account & Direct Benefit Transfer (DBT)
                  </span>
                  <div className="space-y-1.5">
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Bank Name:</strong>
                      <span className="text-slate-900">State Bank of India (SBI)</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Account Number:</strong>
                      <span className="font-mono text-slate-900">•••• •••• •••• 8841</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">IFSC Code:</strong>
                      <span className="font-mono text-slate-900">SBIN0001248 (Thiruvaiyaru)</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Linked UPI VPA:</strong>
                      <span className="font-mono text-emerald-700">{session?.mobileNumber ? `${session.mobileNumber.replace(/\D/g, '')}@okaxis` : '9840123456@oksbi'}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Direct Benefit (DBT):</strong>
                      <span className="text-emerald-700 font-semibold">Active (Aadhaar Seeding Done)</span>
                    </p>
                  </div>
                </div>

                {/* 4. Equipment, Tools & Village Contacts */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    🛠️ Tools, Certifications & Village Administration
                  </span>
                  <div className="space-y-1.5">
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Tools / Equipment:</strong>
                      <span className="text-slate-900">
                        {currentRole === 'FARMER' ? 'Tractor, Rotavator, Solar Pump' : 'Sickles, Power Sprayer, Weeder'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Govt Agriculture Scheme:</strong>
                      <span className="text-slate-900">
                        {currentRole === 'FARMER' ? 'PM-Kisan Reg: TN/124/8892' : 'MGNREGA Job Card Active'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Local VAO Office:</strong>
                      <span className="text-slate-900">Thiruvaiyaru Revenue Circle</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-600">Emergency Contact:</strong>
                      <span className="text-slate-900">+91 94432 10987 (Village Officer)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REGIONAL FIELD & HARVEST MAP */}
          {activeTab === 'MAP' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs animate-fadeIn">
              <MapScreen
                role={currentRole}
                jobs={jobs}
                candidates={candidates}
                selectedLanguage={selectedLanguage}
                onBack={() => setActiveTab('DASHBOARD')}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onQuickApply={(job) => setSelectedJobToApply(job)}
                onSelectWorker={(worker) => setSelectedCandidateForProfile(worker)}
                onInviteWorker={(worker) => setSelectedCandidateForProfile(worker)}
              />
            </div>
          )}

          {/* TAB: WORK CALENDAR */}
          {activeTab === 'CALENDAR' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs animate-fadeIn">
              <WorkCalendarScreen
                userId={session?.userId || 1}
                role={currentRole}
                selectedLanguage={selectedLanguage}
                onBack={() => setActiveTab('DASHBOARD')}
                onSelectJob={(jobId) => {
                  const found = jobs.find(j => j.id === jobId);
                  if (found) setSelectedJobForDetails(found);
                }}
                onFindJobs={() => setActiveTab(currentRole === 'FARMER' ? 'FIND_WORKERS' : 'SEARCH_JOBS')}
                onManageJobs={() => setActiveTab('MY_JOBS')}
              />
            </div>
          )}

          {/* TAB: WAGE ESTIMATOR & CALCULATOR */}
          {activeTab === 'WAGE_CALCULATOR' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs animate-fadeIn">
              <WageCalculatorScreen
                session={session}
                selectedLanguage={selectedLanguage}
                onBack={() => setActiveTab('DASHBOARD')}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modal: Post Job (Farmer) */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Post a Farm Job</h3>
              <button onClick={() => setIsPostJobModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Paddy Harvesting & Threshing"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Crop Type</label>
                  <select
                    value={newJobCrop}
                    onChange={(e) => setNewJobCrop(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {['Paddy', 'Sugarcane', 'Cotton', 'Banana', 'Wheat', 'Vegetables'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Work Type</label>
                  <select
                    value={newJobWorkType}
                    onChange={(e) => setNewJobWorkType(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {['Harvesting', 'Cutting', 'Paddy work', 'Sowing', 'Weeding', 'Tractor operation'].map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Workers Needed</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={newJobWorkers}
                    onChange={(e) => setNewJobWorkers(Number(e.target.value))}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Daily Wage (₹/day)</label>
                  <input
                    type="number"
                    min={300}
                    max={2500}
                    required
                    value={newJobWage}
                    onChange={(e) => setNewJobWage(Number(e.target.value))}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newJobStartDate}
                    onChange={(e) => setNewJobStartDate(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newJobEndDate}
                    onChange={(e) => setNewJobEndDate(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Details / Perks</label>
                <textarea
                  rows={2}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="e.g. Free tea & afternoon lunch included. Tools provided on site."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingJob}
                className="w-full h-10 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSubmittingJob ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Publish & Broadcast Job'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apply for Job (Quick Mode) */}
      {selectedJobToApply && (
        <ApplyJobModal
          job={selectedJobToApply}
          workerSession={session}
          onClose={() => setSelectedJobToApply(null)}
          onApplySuccess={(newApp) => {
            refreshData();
            const farmer = selectedJobToApply.farmerName;
            setSelectedJobToApply(null);
            setPostSuccessMessage(`Application successfully submitted to ${farmer}!`);
            setTimeout(() => setPostSuccessMessage(''), 4500);
          }}
        />
      )}

      {/* Modal: Full Detailed Job Specs & Direct Application Flow */}
      {selectedJobForDetails && (
        <FullJobDetailsModal
          isOpen={Boolean(selectedJobForDetails)}
          onClose={() => setSelectedJobForDetails(null)}
          job={selectedJobForDetails}
          workerSession={session}
          selectedLanguage={selectedLanguage}
          onApplySuccess={(newApp) => {
            refreshData();
            setSelectedJobForDetails(null);
            setPostSuccessMessage('Application successfully submitted with your verified credentials!');
            setTimeout(() => setPostSuccessMessage(''), 4500);
          }}
        />
      )}

      {/* Modal: Full Multi-Step Wage Payment & Disbursal Process */}
      {isPaymentModalOpen && selectedHiredForPayment && (
        <FullWagePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedHiredForPayment(null);
          }}
          hiredRecord={selectedHiredForPayment}
          selectedLanguage={selectedLanguage}
          onPaymentSuccess={(hiredId, amount, mode, utr) => {
            refreshData();
            setPostSuccessMessage(`₹${amount.toLocaleString()} wage payment recorded via ${mode}!`);
            setTimeout(() => setPostSuccessMessage(''), 4500);
          }}
        />
      )}

      {/* Modal: Comprehensive Worker Profile & Verified Dossier */}
      {selectedCandidateForProfile && (
        <WorkerProfileModal
          isOpen={Boolean(selectedCandidateForProfile)}
          onClose={() => setSelectedCandidateForProfile(null)}
          candidate={selectedCandidateForProfile}
          selectedLanguage={selectedLanguage}
          activeJobs={jobs.filter(j => j.farmerId === session?.userId || currentRole === 'FARMER')}
          onInviteSuccess={(name) => {
            refreshData();
            setPostSuccessMessage(`Direct job invitation dispatched to ${name}!`);
            setTimeout(() => setPostSuccessMessage(''), 4500);
          }}
        />
      )}

      {/* Modal: Notifications */}
      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllRead={() => {
            FarmConnectStore.markAllNotificationsRead();
            refreshData();
          }}
          onMarkRead={(id) => {
            FarmConnectStore.markNotificationRead(id);
            refreshData();
          }}
          onDelete={(id) => {
            FarmConnectStore.deleteNotification(id);
            refreshData();
          }}
          onClearAll={() => {
            FarmConnectStore.clearAllNotifications();
            refreshData();
          }}
          onSelectNotification={(notif) => {
            setIsNotificationsOpen(false);
            if (notif.relatedJobId) setActiveTab('MY_JOBS');
          }}
        />
      )}

      {/* Modal: Agri Voice Assistant */}
      {isVoiceAssistantOpen && (
        <AgriVoiceAssistantModal
          selectedLanguage={selectedLanguage}
          session={session}
          userRole={session?.role || currentRole}
          userLocation={session?.district ? `${session.villageOrTown || 'Thanjavur'}, ${session.district}` : 'Thanjavur, Tamil Nadu'}
          onLanguageChange={onLanguageChange}
          onClose={() => setIsVoiceAssistantOpen(false)}
        />
      )}

      {/* Modal: Reset PIN */}
      {isResetPinOpen && (
        <ForgotPasswordModal
          onClose={() => setIsResetPinOpen(false)}
          onSuccess={() => {
            setIsResetPinOpen(false);
            setPostSuccessMessage('Security PIN updated successfully!');
            setTimeout(() => setPostSuccessMessage(''), 4500);
          }}
        />
      )}
    </div>
  );
};
