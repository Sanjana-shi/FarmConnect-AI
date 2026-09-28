import React from 'react';
import { 
  Home, Briefcase, Users, Map, Wallet, 
  User, Calculator, Sparkles, Bell, FileText
} from 'lucide-react';
import { UserRole } from '../types';

interface BottomNavigationProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onVoiceAssistantClick: () => void;
  unreadCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  role,
  activeTab,
  onTabChange,
  onVoiceAssistantClick,
  unreadCount = 0
}) => {
  return (
    <div className="relative w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-between z-20">
      {role === 'WORKER' ? (
        <>
          {/* Worker Tab 1: Home */}
          <button
            onClick={() => onTabChange('WORKER_DASHBOARD')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'WORKER_DASHBOARD' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'WORKER_DASHBOARD' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Home</span>
          </button>

          {/* Worker Tab 2: Jobs */}
          <button
            onClick={() => onTabChange('NEARBY_JOBS')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'NEARBY_JOBS' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeTab === 'NEARBY_JOBS' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Jobs</span>
          </button>

          {/* Center Floating AI Mic Button */}
          <div className="flex items-center justify-center px-1">
            <button
              onClick={onVoiceAssistantClick}
              className="w-10 h-10 -mt-5 bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 rounded-full shadow-lg border-2 border-white flex items-center justify-center active:scale-90 transition-transform ring-2 ring-amber-300/50"
              title="Voice Assistant"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
            </button>
          </div>

          {/* Worker Tab 3: Earnings */}
          <button
            onClick={() => onTabChange('EARNINGS')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'EARNINGS' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wallet className={`w-4 h-4 ${activeTab === 'EARNINGS' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Earnings</span>
          </button>

          {/* Worker Tab 4: Map */}
          <button
            onClick={() => onTabChange('MAP')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'MAP' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className={`w-4 h-4 ${activeTab === 'MAP' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Map</span>
          </button>
        </>
      ) : (
        <>
          {/* Farmer Tab 1: Home */}
          <button
            onClick={() => onTabChange('FARMER_DASHBOARD')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'FARMER_DASHBOARD' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'FARMER_DASHBOARD' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Home</span>
          </button>

          {/* Farmer Tab 2: My Jobs */}
          <button
            onClick={() => onTabChange('FARMER_JOBS')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'FARMER_JOBS' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeTab === 'FARMER_JOBS' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">My Jobs</span>
          </button>

          {/* Center Floating AI Mic Button */}
          <div className="flex items-center justify-center px-1">
            <button
              onClick={onVoiceAssistantClick}
              className="w-10 h-10 -mt-5 bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 rounded-full shadow-lg border-2 border-white flex items-center justify-center active:scale-90 transition-transform ring-2 ring-amber-300/50"
              title="Voice Assistant"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
            </button>
          </div>

          {/* Farmer Tab 3: Find Workers */}
          <button
            onClick={() => onTabChange('FIND_WORKERS')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'FIND_WORKERS' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'FIND_WORKERS' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Workers</span>
          </button>

          {/* Farmer Tab 4: Map */}
          <button
            onClick={() => onTabChange('MAP')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'MAP' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className={`w-4 h-4 ${activeTab === 'MAP' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] font-bold mt-0.5">Map</span>
          </button>
        </>
      )}
    </div>
  );
};
