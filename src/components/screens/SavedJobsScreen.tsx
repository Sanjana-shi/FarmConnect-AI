import React, { useState } from 'react';
import { 
  ArrowLeft, Bookmark, Heart, MapPin, Calendar, 
  IndianRupee, Sparkles, Trash2, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { JobItem, LanguageCode, SavedJobItem } from '../../types';
import { FarmConnectStore } from '../../data/store';

interface SavedJobsScreenProps {
  workerId: number;
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onSelectJob: (job: JobItem) => void;
  onApplyJob: (job: JobItem) => void;
  onExploreJobs: () => void;
}

export const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({
  workerId,
  selectedLanguage,
  onBack,
  onSelectJob,
  onApplyJob,
  onExploreJobs
}) => {
  const [savedList, setSavedList] = useState<SavedJobItem[]>(() => FarmConnectStore.getSavedJobs(workerId));
  const applications = FarmConnectStore.getApplications();

  const handleUnsave = (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    FarmConnectStore.unsaveJob(workerId, jobId);
    setSavedList(FarmConnectStore.getSavedJobs(workerId));
  };

  const hasApplied = (jobId: number) => {
    return applications.some(a => a.jobId === jobId && (a.workerId === workerId || workerId === 10 || workerId === 201));
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
              <h2 className="text-sm font-bold text-slate-900">Saved Jobs & Bookmarks</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {savedList.length} {savedList.length === 1 ? 'job bookmarked' : 'jobs bookmarked'}
              </span>
            </div>
          </div>
        </div>

        {/* Saved Jobs List */}
        {savedList.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">No Saved Jobs Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto leading-relaxed">
                Bookmark farm jobs you are interested in by tapping the heart icon on job cards to easily apply later.
              </p>
            </div>
            <button
              onClick={onExploreJobs}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-900 transition-all inline-flex items-center gap-1.5"
            >
              <span>Explore Nearby Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedList.map((item) => {
              const job = item.job;
              const applied = hasApplied(job.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectJob(job)}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 hover:border-emerald-600 cursor-pointer transition-all relative group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold rounded uppercase">
                        {job.cropType} • {job.workType}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{job.title}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{job.farmerName}</p>
                    </div>

                    <button
                      onClick={(e) => handleUnsave(job.id, e)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                      title="Remove Bookmark"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.villageTown} ({job.distanceKm || 3.2} km)</span>
                    </div>
                    <div className="font-bold text-emerald-800 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>₹{job.wageAmount}</span>
                      <span className="text-[9px] text-slate-500 font-normal ml-0.5">/day</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Starts: {job.startDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {applied ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApplyJob(job);
                          }}
                          className="px-3 py-1 bg-emerald-800 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-900 shadow-xs flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Apply</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
