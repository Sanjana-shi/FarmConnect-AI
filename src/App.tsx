import React, { useState, useEffect } from 'react';
import { 
  Smartphone, FileCode, Server, Layers, Sparkles, 
  ExternalLink, CheckCircle2, ShieldAlert, BookOpen, Monitor, ShieldCheck,
  LogIn, UserPlus, Compass, AlertTriangle, MessageSquare
} from 'lucide-react';
import { AndroidEmulator } from './components/AndroidEmulator';
import { CodeExplorer } from './components/CodeExplorer';
import { ApiTester } from './components/ApiTester';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { FullWebPortal } from './components/FullWebPortal';
import { AdminPortal } from './components/screens/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { FeedbackModal } from './components/FeedbackModal';
import { AgriculturalIntro3D } from './components/intro/AgriculturalIntro3D';
import { VoiceLanguageRecommendationToast } from './components/VoiceLanguageRecommendationToast';
import { AgriVoiceAssistantModal } from './components/screens/AgriVoiceAssistantModal';
import { VoiceTranslationService } from './services/voiceTranslationService';
import { FarmConnectStore } from './data/store';
import { LanguageCode, UserSession } from './types';

interface ApiLog {
  id: string;
  time: string;
  endpoint: string;
  method: string;
  status: number;
  payload: any;
  response: any;
}

export function App() {
  const [activeView, setActiveView] = useState<'PORTAL' | 'EMULATOR' | 'ADMIN' | 'CODE' | 'API' | 'DOCS'>('PORTAL');
  const [session, setSession] = useState<UserSession | null>(() => FarmConnectStore.getSession());
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => FarmConnectStore.getLanguage());

  // 3D Intro, Auth, Feedback, and Voice Assistant States
  const [showIntro, setShowIntro] = useState<boolean>(() => !FarmConnectStore.hasSeenIntro());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isGlobalVoiceAssistantOpen, setIsGlobalVoiceAssistantOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    FarmConnectStore.setLanguage(lang);
    VoiceTranslationService.recommendLanguageVoice(lang, true);
  };

  const handleOpenAuth = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (newSession: UserSession) => {
    setSession(newSession);
    FarmConnectStore.setUserSession(newSession);
    setIsAuthModalOpen(false);
    handleApiLog(
      '/api/v1/auth/login',
      'POST',
      200,
      { email: newSession.email, role: newSession.role },
      { success: true, message: 'Authentication successful', token: newSession.token }
    );
  };
  const [logs, setLogs] = useState<ApiLog[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      endpoint: '/api/v1/auth/send-otp',
      method: 'POST',
      status: 200,
      payload: { mobileNumber: '+919840123456' },
      response: { success: true, message: 'OTP sent successfully', data: 'DEV_MODE_OTP:123456' }
    }
  ]);

  useEffect(() => {
    const s = FarmConnectStore.getSession();
    if (s) setSession(s);
  }, []);

  const handleUpdateSession = (updated: Partial<UserSession>) => {
    const newSess = FarmConnectStore.updateSession(updated);
    if (newSess) setSession(newSess);
  };

  const handleLogout = () => {
    FarmConnectStore.clearSession();
    setSession(null);
  };

  const handleApiLog = (endpoint: string, method: string, status: number, payload: any, response: any) => {
    const newLog: ApiLog = {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString(),
      endpoint,
      method,
      status,
      payload,
      response
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-xl shadow-xs">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-white">FarmConnect AI</h1>
              <span className="px-2 py-0.5 bg-emerald-800 text-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wide border border-emerald-700">
                Production Release
              </span>
            </div>
            <p className="text-xs text-emerald-300 hidden md:block">
              India Agricultural Workforce Platform • Cauvery Delta (Spring Boot • Android Native • MySQL • Gemini AI)
            </p>
          </div>
        </div>

        {/* View Switcher Navigation & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick 3D Journey Button */}
          <button
            onClick={() => setShowIntro(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 rounded-xl text-xs font-semibold shadow-xs transition-all"
            title="Experience Interactive 3D Delta Farm Journey"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Intro</span>
          </button>

          {/* Quick Auth Trigger */}
          {session ? (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-emerald-900/60 rounded-xl border border-emerald-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-200 font-medium truncate max-w-[120px]">{session.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-[11px] text-emerald-400 hover:text-rose-300 font-bold ml-1 transition-colors"
                title="Sign out of current account"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleOpenAuth('REGISTER')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          )}

          <nav className="flex items-center bg-emerald-900/80 p-1 rounded-xl border border-emerald-800 text-xs">
            <button
              onClick={() => setActiveView('PORTAL')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'PORTAL'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Web Platform</span>
            </button>

            <button
              onClick={() => setActiveView('EMULATOR')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'EMULATOR'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android App</span>
            </button>

            <button
              onClick={() => setActiveView('ADMIN')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'ADMIN'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setActiveView('CODE')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'CODE'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Codebase</span>
            </button>

            <button
              onClick={() => setActiveView('API')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'API'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>REST API</span>
            </button>

            <button
              onClick={() => setActiveView('DOCS')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'DOCS'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>
          </nav>
        </div>
      </header>

      {/* System Disclaimer Banner (Requirement 2) */}
      <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 text-xs font-medium text-amber-950 flex items-center justify-between shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold text-amber-950">
              FarmConnect AI is in beta. Please verify information before use.
            </span>
          </div>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2 transition-colors shrink-0"
          >
            Send feedback to FarmConnect AI team
          </button>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 w-full flex flex-col">
        {/* VIEW 0: FULL WEB APPLICATION PORTAL */}
        {activeView === 'PORTAL' && (
          <FullWebPortal
            session={session}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onSwitchToEmulator={() => setActiveView('EMULATOR')}
            onUpdateSession={handleUpdateSession}
            onLogout={handleLogout}
            onOpenIntro={() => setShowIntro(true)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* VIEW 1: INTERACTIVE ANDROID EMULATOR & WORKSPACE */}
        {activeView === 'EMULATOR' && (
          <div className="max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Mobile Phone Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <AndroidEmulator
                onApiLog={handleApiLog}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Right: Real-Time Flow & Backend Sync Panel */}
            <div className="lg:col-span-7 space-y-4">
              {/* Foundation Status Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Production Agricultural Platform Ready</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  FarmConnect AI unites farmers and agricultural laborers across India. Test mobile flows in the Android emulator, or click <strong className="text-emerald-900 cursor-pointer" onClick={() => setActiveView('PORTAL')}>Web Platform</strong> in the header for the full desktop management dashboard.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Languages</span>
                    <span className="font-semibold text-slate-800">8 Indian Languages</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Auth & Security</span>
                    <span className="font-semibold text-slate-800">OTP + 4-Digit PIN Reset</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Backend Architecture</span>
                    <span className="font-semibold text-slate-800">Spring Boot & Express APIs</span>
                  </div>
                </div>
              </div>

              {/* REST API & Live Logs in Emulator View */}
              <div className="h-[380px]">
                <ApiTester logs={logs} onClearLogs={handleClearLogs} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ADMIN PORTAL */}
        {activeView === 'ADMIN' && (
          <AdminPortal />
        )}

        {/* VIEW 3: CODEBASE EXPLORER */}
        {activeView === 'CODE' && (
          <div className="max-w-7xl w-full mx-auto p-6 flex-1 h-[720px]">
            <CodeExplorer />
          </div>
        )}

        {/* VIEW 4: API & DATABASE STATE */}
        {activeView === 'API' && (
          <div className="max-w-7xl w-full mx-auto p-6 flex-1 h-[720px]">
            <ApiTester logs={logs} onClearLogs={handleClearLogs} />
          </div>
        )}

        {/* VIEW 5: SYSTEM ARCHITECTURE & DOCUMENTATION */}
        {activeView === 'DOCS' && (
          <div className="max-w-7xl w-full mx-auto p-6 flex-1">
            <ArchitectureDoc />
          </div>
        )}
      </main>

      {/* Footer with Component & Technology Indicators (Requirements 3 & 6) */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-700">Tech Stack:</span>
          <span>☕ Java 17 (Spring Boot 3.2.x)</span>
          <span>📱 Android Native (Java + XML)</span>
          <span>🐬 MySQL 8.0</span>
          <span>🐍 Python (FastAPI + scikit-learn)</span>
          <span>🤖 Gemini AI (Backend Proxy)</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Custom feedback button replacing any legal issue links */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span>Send feedback to FarmConnect AI team</span>
          </button>

          <div className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            FarmConnect AI v1.2.0 • Production Mode Active
          </div>
        </div>
      </footer>

      {/* Custom Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        session={session}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Interactive 3D Delta Farm Onboarding Experience */}
      {showIntro && (
        <AgriculturalIntro3D
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          onComplete={() => setShowIntro(false)}
          onOpenAuth={(mode) => {
            setShowIntro(false);
            handleOpenAuth(mode);
          }}
        />
      )}

      {/* Production User Registration & Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        selectedLanguage={selectedLanguage}
      />

      {/* Real-time Language Voice Translation Recommendation Toast */}
      <VoiceLanguageRecommendationToast
        onOpenVoiceAssistant={() => setIsGlobalVoiceAssistantOpen(true)}
      />

      {/* Global Agri Voice Assistant Modal */}
      {isGlobalVoiceAssistantOpen && (
        <AgriVoiceAssistantModal
          selectedLanguage={selectedLanguage}
          session={session}
          userRole={session?.role || 'FARMER'}
          userLocation={session?.district ? `${session.villageOrTown || 'Thanjavur'}, ${session.district}` : 'Thanjavur, Tamil Nadu'}
          onLanguageChange={handleLanguageChange}
          onClose={() => setIsGlobalVoiceAssistantOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

