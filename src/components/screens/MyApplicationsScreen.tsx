import React, { useState } from 'react';
import { 
  ArrowLeft, Phone, Calendar, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, XCircle, MapPin, Sparkles, Filter,
  Check, X, CircleDot, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import { JobApplication, LanguageCode, ApplicationStatus } from '../../types';

interface MyApplicationsScreenProps {
  applications: JobApplication[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onSelectJobId: (jobId: number) => void;
  onWithdraw: (appId: string) => void;
}

export const MyApplicationsScreen: React.FC<MyApplicationsScreenProps> = ({
  applications,
  selectedLanguage,
  onBack,
  onSelectJobId,
  onWithdraw
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  const getTimelineSteps = (status: ApplicationStatus) => {
    const isRejected = status === 'REJECTED';
    const isWithdrawn = status === 'WITHDRAWN';

    if (isWithdrawn) {
      return [
        { label: 'Applied', state: 'completed' },
        { label: 'Withdrawn', state: 'withdrawn' }
      ];
    }

    if (isRejected) {
      return [
        { label: 'Applied', state: 'completed' },
        { label: 'Under Review', state: 'completed' },
        { label: 'Not Selected', state: 'rejected' }
      ];
    }

    const steps = [
      { label: 'Applied', state: 'completed' },
      { 
        label: 'Review', 
        state: status === 'APPLIED' ? 'current' : 'completed' 
      },
      { 
        label: 'Accepted', 
        state: status === 'APPLIED' ? 'upcoming' : status === 'SHORTLISTED' ? 'current' : 'completed' 
      },
      { 
        label: 'Hired', 
        state: status === 'HIRED' || status === 'COMPLETED' ? 'completed' : 'upcoming' 
      },
      { 
        label: 'Completed', 
        state: status === 'COMPLETED' ? 'completed' : 'upcoming' 
      }
    ];

    return steps;
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'HIRED':
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Hired / Confirmed</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Accepted / Review</span>
          </span>
        );
      case 'APPLIED':
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px] rounded-full">
            Under Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-900 border border-red-300 font-bold text-[10px] rounded-full">
            Declined
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-full">
            Withdrawn
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-bold text-[10px] rounded-full">
            Completed
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Application Tracking</h2>
              <span className="text-[10px] text-slate-500">{applications.length} total applications submitted</span>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {['ALL', 'APPLIED', 'HIRED', 'WITHDRAWN'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg transition-all text-[11px] whitespace-nowrap ${
                filterStatus === st 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st === 'APPLIED' ? 'Pending' : st === 'HIRED' ? 'Hired' : 'Withdrawn'}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-2.5">
          {filteredApps.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
              <span className="text-3xl">📝</span>
              <h4 className="text-xs font-bold text-slate-800">No applications found</h4>
              <p className="text-[11px] text-slate-500">Apply to farm jobs in Nearby Jobs to see them tracked here.</p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const isExpanded = expandedAppId === app.id;
              const timeline = getTimelineSteps(app.status);

              return (
                <div 
                  key={app.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 hover:border-emerald-600 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded uppercase">
                        {app.cropType}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{app.jobTitle}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{app.farmerLocation}</span>
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  {/* Visual Application Timeline */}
                  <div className="pt-2 pb-1 border-t border-slate-100">
                    <div className="flex items-center justify-between relative px-2">
                      {timeline.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center z-10 relative">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step.state === 'completed'
                              ? 'bg-emerald-800 text-white ring-2 ring-emerald-100'
                              : step.state === 'current'
                                ? 'bg-amber-500 text-white ring-2 ring-amber-200 animate-pulse'
                                : step.state === 'rejected'
                                  ? 'bg-red-600 text-white'
                                  : step.state === 'withdrawn'
                                    ? 'bg-slate-400 text-white'
                                    : 'bg-slate-200 text-slate-500'
                          }`}>
                            {step.state === 'completed' ? (
                              <Check className="w-3 h-3" />
                            ) : step.state === 'rejected' ? (
                              <X className="w-3 h-3" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span className="text-[9px] font-semibold mt-1 text-slate-700">{step.label}</span>
                        </div>
                      ))}

                      {/* Connecting Line */}
                      <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-200 -z-0">
                        <div 
                          className="h-full bg-emerald-700 transition-all"
                          style={{
                            width: app.status === 'HIRED' || app.status === 'COMPLETED' ? '100%' : app.status === 'SHORTLISTED' ? '60%' : app.status === 'APPLIED' ? '25%' : '0%'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Your Applied Wage</span>
                      <span className="font-bold text-emerald-800 text-xs">₹{app.appliedWage} / day</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[9px]">Start Date</span>
                      <span className="font-semibold text-slate-800">{app.startDate}</span>
                    </div>
                  </div>

                  {app.message && (
                    <div className="p-2 bg-slate-50 rounded-lg text-[10px] text-slate-600 italic border border-slate-100">
                      "{app.message}"
                    </div>
                  )}

                  {/* Card Action Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <button
                      onClick={() => onSelectJobId(app.jobId)}
                      className="text-emerald-800 font-bold hover:underline text-[10px] flex items-center gap-0.5"
                    >
                      <span>View Job Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-2">
                      {app.status === 'HIRED' && (
                        <a
                          href={`tel:${app.farmerPhone}`}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          title={`Call Farmer ${app.farmerName}`}
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Farmer</span>
                        </a>
                      )}

                      {app.status === 'APPLIED' && (
                        <button
                          onClick={() => onWithdraw(app.id)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-[10px] font-medium transition-colors"
                          title="Withdraw Application"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

