import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Clock, IndianRupee, Users, 
  CheckCircle2, ShieldCheck, Heart, Share2, Phone, 
  Send, Sparkles, AlertCircle, Wrench, Utensils, 
  Check, ArrowRight, Truck, Briefcase
} from 'lucide-react';
import { JobItem, UserSession, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { FarmConnectStore } from '../data/store';

interface FullJobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobItem | null;
  session: UserSession | null;
  selectedLanguage: LanguageCode;
  onApplySuccess?: () => void;
}

export const FullJobDetailsModal: React.FC<FullJobDetailsModalProps> = ({
  isOpen,
  onClose,
  job,
  session,
  selectedLanguage,
  onApplySuccess
}) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  if (!isOpen || !job) return null;

  const workerId = session?.role === 'WORKER' ? session.userId : 201;
  const isFarmer = session?.role === 'FARMER';
  const hasApplied = FarmConnectStore.hasWorkerApplied(workerId, job.id);
  const [isSaved, setIsSaved] = useState<boolean>(() => FarmConnectStore.isJobSaved(workerId, job.id));

  // Application form state
  const [proposedWage, setProposedWage] = useState<number>(job.wageAmount);
  const [message, setMessage] = useState<string>(
    session?.role === 'WORKER'
      ? `Hello ${job.farmerName}, I am experienced in ${job.cropType} cultivation and ${job.workType}. I have my own tools and can report on time.`
      : 'Experienced agricultural laborer ready for harvest operations.'
  );
  const [hasTools, setHasTools] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(hasApplied);

  const handleToggleSave = () => {
    if (isSaved) {
      FarmConnectStore.unsaveJob(workerId, job.id);
      setIsSaved(false);
    } else {
      FarmConnectStore.saveJobForWorker(workerId, job.id);
      setIsSaved(true);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionSuccess) return;

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        FarmConnectStore.applyForJob(
          job,
          session,
          proposedWage,
          message,
          hasTools,
          session?.experienceYears || 5,
          job.startDate,
          job.endDate
        );
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        if (onApplySuccess) onApplySuccess();
      } catch (err) {
        console.error('Error applying for job:', err);
        setIsSubmitting(false);
      }
    }, 600);
  };

  const remainingSpots = Math.max(0, job.workersRequired - job.workersHired);
  const fillPercent = Math.min(100, Math.round((job.workersHired / job.workersRequired) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 shrink-0">
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-emerald-700/80 text-emerald-100 text-[10px] font-bold rounded uppercase tracking-wider">
                  {job.cropType} • {job.workType}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  job.status === 'ACTIVE' 
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' 
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                }`}>
                  {remainingSpots > 0 ? `${remainingSpots} Spots Open` : 'Quota Filled'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">{job.title}</h2>
              <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>{job.farmerLocation}</span>
                {job.distanceKm && <span className="text-emerald-300 font-semibold">• {job.distanceKm} km away</span>}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleSave}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved 
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={isSaved ? 'Saved to Favorites' : 'Save Job'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Daily Wage</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-emerald-950">₹{job.wageAmount}</span>
                <span className="text-[10px] text-emerald-700">/day</span>
              </div>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Same-day payout</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shift Timing</span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{job.workingHours || '06:30 AM - 02:30 PM'}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">7.5 hrs/day</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Duration</span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{job.startDate}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">to {job.endDate}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Crew Quota</span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{job.workersHired} / {job.workersRequired} Hired</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${fillPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Farmer Contact & Farm Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Farm Owner & Contact</span>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">{job.farmerName}</h4>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Verified Farm
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Landmark: Near Thiruvaiyaru Cauvery Headworks Canal Road
              </p>
            </div>

            <a
              href={`tel:${job.farmerPhone}`}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Call Farm</span>
            </a>
          </div>

          {/* Field Amenities & Inclusions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Field Amenities & Inclusions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs">
                <Utensils className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Free Lunch & Tea</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs">
                <Wrench className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{job.toolsProvided ? 'Sickles & Tools Provided' : 'Bring Own Sickle'}</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Village Pickup Point</span>
              </div>
            </div>
          </div>

          {/* Detailed Job Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Full Operational Details</h4>
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-700 space-y-2">
              <p>
                {job.description || `Immediate seasonal requirement for ${job.cropType} operations in Cauvery delta fields. Work involves morning harvesting shifts, threshing, bundling, and loading.`}
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                <span className="text-[11px] font-bold text-slate-600">Required Skills:</span>
                {(job.requiredSkills || ['Harvesting', 'Field work', 'Paddy handling']).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* APPLICATION SECTION (For Workers or General Users) */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            {submissionSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-emerald-950">Application Active & Broadcasted!</h5>
                  <p className="text-xs text-emerald-800">
                    Your profile and wage proposal of ₹{proposedWage}/day have been submitted directly to {job.farmerName}. You can view the status under the "My Applications" tab.
                  </p>
                </div>
              </div>
            ) : isFarmer ? (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>You are viewing this job as a Farm Owner. You can manage applicants in the "My Jobs" tab.</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 text-xs"
                >
                  Manage Job
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-800" />
                  <span>Apply for this Farm Shift</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Expected Daily Wage (₹/day)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={300}
                        max={3000}
                        value={proposedWage}
                        onChange={(e) => setProposedWage(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Farmer offered: ₹{job.wageAmount}/day
                    </span>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={hasTools}
                        onChange={(e) => setHasTools(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span>I have required sickle & field safety boots</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Message / Note to Farm Owner
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe your agricultural experience, equipment, and punctuality..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application to {job.farmerName}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
