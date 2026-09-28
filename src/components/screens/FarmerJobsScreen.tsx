import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Users, Calendar, Clock, 
  MapPin, CheckCircle2, ChevronRight, Sparkles, SlidersHorizontal 
} from 'lucide-react';
import { JobItem, LanguageCode, JobApplication } from '../../types';

interface FarmerJobsScreenProps {
  jobs: JobItem[];
  applications: JobApplication[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onPostJobClick: () => void;
  onViewJobApplicants: (job: JobItem) => void;
}

export const FarmerJobsScreen: React.FC<FarmerJobsScreenProps> = ({
  jobs,
  applications,
  selectedLanguage,
  onBack,
  onPostJobClick,
  onViewJobApplicants
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const filteredJobs = jobs.filter(job => {
    if (selectedStatusTab === 'ALL') return true;
    if (selectedStatusTab === 'ACTIVE') return job.status === 'ACTIVE' || !job.status;
    if (selectedStatusTab === 'PENDING') return job.workersHired === 0;
    if (selectedStatusTab === 'COMPLETED') return job.status === 'COMPLETED';
    if (selectedStatusTab === 'CANCELLED') return job.status === 'CANCELLED';
    return true;
  });

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
              <h2 className="text-sm font-bold text-slate-900">Farmer Job Management</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">{filteredJobs.length} Listings Shown</span>
            </div>
          </div>

          <button
            onClick={onPostJobClick}
            className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Job</span>
          </button>
        </div>

        {/* Status Filter Tabs (ACTIVE, PENDING, COMPLETED, CANCELLED) */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {(['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => {
            const isSelected = selectedStatusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatusTab(tab)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        <div className="space-y-2.5">
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-2xl">📋</span>
              <p className="text-xs font-bold text-slate-800">No jobs found in this category</p>
              <p className="text-[10px] text-slate-500">Post a new agricultural job to hire local workers</p>
              <button
                onClick={onPostJobClick}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                + Post Job Now
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const jobApps = applications.filter(a => a.jobId === job.id);
              const pendingCount = jobApps.filter(a => a.status === 'APPLIED').length;
              const hiredCount = jobApps.filter(a => a.status === 'HIRED').length;

              return (
                <div 
                  key={job.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-emerald-600 transition-all cursor-pointer"
                  onClick={() => onViewJobApplicants(job)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded uppercase">
                          {job.cropType} • {job.workType}
                        </span>
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[8px] font-bold rounded">
                          {job.status || 'ACTIVE'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{job.title}</h3>
                      <p className="text-[10px] text-slate-500">{job.farmerLocation}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-800">₹{job.wageAmount}</span>
                      <span className="text-[9px] text-slate-400 block">/ day</span>
                    </div>
                  </div>

                  {/* Progress Bar for Hiring */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-600">Workers Hired:</span>
                      <span className="font-bold text-slate-800">{hiredCount} / {job.workersRequired} Filled</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (hiredCount / job.workersRequired) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer and Applicant Pill */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {pendingCount > 0 ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-full text-[10px] animate-pulse">
                          {pendingCount} New Applicants
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          {jobApps.length} total applicants
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); onViewJobApplicants(job); }}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[10px] rounded-lg flex items-center gap-1"
                    >
                      <span>Manage Applicants</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
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

