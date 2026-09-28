import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Phone, 
  Users, CheckCircle2, ShieldCheck, Star, Sparkles, 
  IndianRupee, Wrench, Utensils, Share2, Heart, Shield,
  Navigation, AlertTriangle
} from 'lucide-react';
import { JobItem, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { FarmConnectStore } from '../../data/store';
import { LocationService, UserLocationData } from '../../services/locationService';

interface JobDetailsScreenProps {
  job: JobItem;
  workerId?: number;
  selectedLanguage: LanguageCode;
  hasApplied: boolean;
  onBack: () => void;
  onApply: (job: JobItem) => void;
  onViewApplications?: () => void;
}

export const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({
  job,
  workerId = 201,
  selectedLanguage,
  hasApplied,
  onBack,
  onApply,
  onViewApplications
}) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const [isSaved, setIsSaved] = useState<boolean>(() => FarmConnectStore.isJobSaved(workerId, job.id));
  const [copiedToast, setCopiedToast] = useState(false);
  const [locationData, setLocationData] = useState<UserLocationData>(LocationService.getLocation());

  useEffect(() => {
    return LocationService.subscribe(setLocationData);
  }, []);

  const isLocationDenied = locationData.status === 'denied';

  const handleShare = async () => {
    const text = `🌾 Farm Job: ${job.title} in ${job.villageTown}, ${job.district} - ₹${job.wageAmount}/day. Open on FarmConnect AI!`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // fallback
      }
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleDirections = () => {
    if (isLocationDenied) return;
    const dest = encodeURIComponent(`${job.villageTown}, ${job.district}, Tamil Nadu`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  const handleToggleSave = () => {
    if (isSaved) {
      FarmConnectStore.unsaveJob(workerId, job.id);
      setIsSaved(false);
    } else {
      FarmConnectStore.saveJobForWorker(workerId, job.id);
      setIsSaved(true);
    }
  };

  // Smart Recommendation calculation
  const recommendationReasons = [
    `Skill match: ${job.cropType} cultivation & ${job.workType}`,
    `Proximity: approx. ${job.distanceKm || 3.2} km from your village`,
    `Schedule fits your current open availability`,
    `Competitive rate at ₹${job.wageAmount}/day (Fair Market Value)`
  ];

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
            <h2 className="text-sm font-bold text-slate-900">Job Specification</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border transition-all ${
                isSaved 
                  ? 'bg-rose-50 border-rose-300 text-rose-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            
            <button 
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-800 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedToast && (
          <div className="p-2 bg-emerald-800 text-white text-[11px] font-bold rounded-xl text-center shadow-md animate-fadeIn">
            ✓ Job link copied to clipboard!
          </div>
        )}

        {/* Hero Wage Card */}
        <div className="p-4 bg-emerald-800 text-white rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2 py-0.5 bg-emerald-700 text-emerald-100 text-[10px] font-bold rounded uppercase">
                {job.cropType} • {job.workType}
              </span>
              <h1 className="text-base font-bold mt-1 text-white">{job.title}</h1>
              <p className="text-[11px] text-emerald-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{job.farmerLocation}</span>
              </p>
            </div>

            <div className="bg-emerald-950/60 px-3 py-2 rounded-xl text-right border border-emerald-700/50">
              <span className="text-lg font-black text-amber-400">₹{job.wageAmount}</span>
              <span className="text-[10px] text-emerald-200 block">/ day</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-700/60 text-center text-xs">
            <div>
              <span className="text-slate-300 text-[10px] block">Start Date</span>
              <span className="font-bold text-white text-[11px]">{job.startDate}</span>
            </div>
            <div>
              <span className="text-slate-300 text-[10px] block">Needed</span>
              <span className="font-bold text-white text-[11px]">{job.workersRequired} Workers</span>
            </div>
            <div>
              <span className="text-slate-300 text-[10px] block">Hired</span>
              <span className="font-bold text-emerald-300 text-[11px]">{job.workersHired}/{job.workersRequired}</span>
            </div>
          </div>
        </div>

        {/* Smart Job Recommendation Card */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-950">94% AI Recommended Match</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 text-[9px] font-black rounded-full uppercase tracking-wider">
              High Match
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold text-emerald-900 block">Why this job matches your profile:</span>
            {recommendationReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-emerald-950">
                <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Info & Trust Card */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{job.farmerName}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-slate-700">4.9</span>
                  <span>(34 previous workers verified)</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${job.farmerPhone}`}
              className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
              title="Call Farmer"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-[10px] text-center">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Mobile</span>
              <span className="font-bold text-emerald-800">✓ Verified OTP</span>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Payments</span>
              <span className="font-bold text-emerald-800">100% On-Time</span>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block text-[9px]">Jobs Filled</span>
              <span className="font-bold text-emerald-800">18 Harvests</span>
            </div>
          </div>
        </div>

        {/* Description & Work Specs */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs text-xs">
          <div>
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-1">Work Description</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Daily Timings</span>
              <span className="font-semibold text-slate-800">{job.workingHours || '07:00 AM - 02:30 PM'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Tools Provided</span>
              <span className="font-semibold text-emerald-800">
                {job.toolsProvided ? '✅ Yes (Sickle & Gear)' : '⚠️ Bring Own Tools'}
              </span>
            </div>
          </div>

          {/* Perks & Benefits */}
          {job.perks && job.perks.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 block text-[10px] mb-1">Perks & Amenities Included:</span>
              <div className="flex flex-wrap gap-1.5">
                {job.perks.map((perk, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{perk}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Required */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 block text-[10px] mb-1">Required Skills:</span>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location & Distance Summary */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <div>
              <div className="font-bold text-slate-900 text-[11px]">{job.villageTown}, {job.district}</div>
              <div className="text-[10px] text-slate-600">Approx. {job.distanceKm || 3.2} km from your registered village</div>
              {isLocationDenied && (
                <span className="text-[9px] text-amber-700 font-bold block mt-0.5">
                  Location access is required for this feature
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleDirections}
            disabled={isLocationDenied}
            title={isLocationDenied ? "Location access is required for this feature" : `Open directions to ${job.villageTown}`}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              isLocationDenied
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {isLocationDenied ? 'GPS Disabled' : 'Directions'}
          </button>
        </div>
      </div>

      {/* Fixed Bottom Apply Bar */}
      <div className="pt-3 mt-2 border-t border-slate-200">
        {hasApplied ? (
          <div className="flex gap-2">
            <div className="flex-1 h-11 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Application Submitted</span>
            </div>
            {onViewApplications && (
              <button
                onClick={onViewApplications}
                className="px-3.5 h-11 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Track Status
              </button>
            )}
          </div>
        ) : (
          <button
            id="btn_job_apply_now"
            onClick={() => onApply(job)}
            className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Apply Now for ₹{job.wageAmount}/day</span>
          </button>
        )}
      </div>
    </div>
  );
};

