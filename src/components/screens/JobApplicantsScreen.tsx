import React from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Phone, Star, 
  ShieldCheck, Sparkles, MapPin, Calendar 
} from 'lucide-react';
import { JobItem, JobApplication, LanguageCode } from '../../types';

interface JobApplicantsScreenProps {
  job: JobItem;
  applications: JobApplication[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onHireApplicant: (appId: string) => void;
}

export const JobApplicantsScreen: React.FC<JobApplicantsScreenProps> = ({
  job,
  applications,
  selectedLanguage,
  onBack,
  onHireApplicant
}) => {
  const jobApps = applications.filter(a => a.jobId === job.id);

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
              <h2 className="text-sm font-bold text-slate-900">Applicants Review</h2>
              <span className="text-[10px] text-slate-500 truncate max-w-[200px] block">{job.title}</span>
            </div>
          </div>
        </div>

        {/* Job Summary Banner */}
        <div className="p-3 bg-emerald-800 text-white rounded-2xl shadow-xs">
          <div className="flex justify-between items-start text-xs">
            <div>
              <span className="text-[10px] text-emerald-200 uppercase font-bold">{job.cropType}</span>
              <h3 className="font-bold text-white mt-0.5">{job.title}</h3>
              <p className="text-[10px] text-emerald-200 mt-0.5">Starts {job.startDate} • ₹{job.wageAmount}/day</p>
            </div>
            <div className="bg-emerald-950/60 px-2.5 py-1.5 rounded-lg text-right text-[10px]">
              <span className="text-emerald-200 block">Positions Filled</span>
              <span className="font-bold text-white text-xs">{job.workersHired}/{job.workersRequired}</span>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-2.5">
          {jobApps.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
              <span className="text-3xl">👥</span>
              <h4 className="text-xs font-bold text-slate-800">No applicants yet for this job</h4>
              <p className="text-[11px] text-slate-500">
                You can invite verified nearby workers directly from the "Find Workers" screen.
              </p>
            </div>
          ) : (
            jobApps.map((app) => (
              <div 
                key={app.id}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                      👷
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900">{app.workerName}</h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {app.workerExperienceYears} years experience • {app.workerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[9px] font-bold">
                      {app.matchScore}% Match
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-1">₹{app.appliedWage}/day</span>
                  </div>
                </div>

                {/* Score row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{app.workerRating} / 5.0</span>
                  </div>

                  <span className="font-semibold text-emerald-700">
                    ⭐ Reliability: {app.workerReliabilityScore}%
                  </span>

                  <span className="text-slate-400">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Message */}
                {app.message && (
                  <div className="p-2 bg-slate-50 rounded-lg text-[10px] text-slate-700 italic border border-slate-100">
                    "{app.message}"
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${app.workerPhone}`}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Worker</span>
                  </a>

                  {app.status === 'HIRED' ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Worker Hired</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onHireApplicant(app.id)}
                      className="px-3.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-[10px] shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Accept & Hire</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
