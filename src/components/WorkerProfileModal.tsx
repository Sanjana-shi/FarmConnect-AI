import React, { useState } from 'react';
import { 
  X, Star, MapPin, Phone, ShieldCheck, CheckCircle2, 
  Award, Wrench, IndianRupee, MessageSquare, Briefcase, 
  Clock, Check, Send, AlertCircle, Building2, Smartphone
} from 'lucide-react';
import { WorkerCandidate, LanguageCode, JobItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { FarmConnectStore } from '../data/store';

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: WorkerCandidate | null;
  selectedLanguage: LanguageCode;
  activeJobs?: JobItem[];
  onInviteSuccess?: (candidateName: string) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  isOpen,
  onClose,
  candidate,
  selectedLanguage,
  activeJobs = [],
  onInviteSuccess
}) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  if (!isOpen || !candidate) return null;

  const [selectedJobId, setSelectedJobId] = useState<number>(activeJobs[0]?.id || 101);
  const [inviteNote, setInviteNote] = useState<string>('We have immediate farm shifts starting this week.');
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);

    setTimeout(() => {
      FarmConnectStore.inviteWorker(
        selectedJobId,
        candidate.id,
        candidate.fullName,
        candidate.mobileNumber
      );
      setIsInviting(false);
      setInviteSuccess(true);
      if (onInviteSuccess) onInviteSuccess(candidate.fullName);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Profile Hero Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 shrink-0">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={candidate.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-300/40 shadow-md"
                />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-emerald-900 ${
                  candidate.availabilityStatus === 'AVAILABLE' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{candidate.fullName}</h2>
                  <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold rounded flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    Aadhaar Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{candidate.villageTown}, {candidate.district}</span>
                  <span className="text-emerald-300 font-semibold">• {candidate.distanceKm} km away</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{candidate.rating.toFixed(1)}</span>
                    <span className="text-emerald-300 font-normal">({candidate.reviewCount} farmer reviews)</span>
                  </span>
                  <span className="text-emerald-300">•</span>
                  <span className="text-emerald-100 font-bold">
                    {candidate.experienceYears} Years Delta Exp.
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Details */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Expected Wage</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-emerald-950">₹{candidate.dailyRate}</span>
                <span className="text-[10px] text-emerald-700">/day</span>
              </div>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Fair regional rate</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Reliability Score</span>
              <div className="text-base font-black text-slate-900 mt-0.5">{candidate.reliabilityScore}%</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Punctuality: {candidate.punctualityScore || 96}%</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Status</span>
              <div className={`text-xs font-bold mt-0.5 ${
                candidate.availabilityStatus === 'AVAILABLE' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {candidate.availabilityStatus === 'AVAILABLE' ? 'Available to Start' : 'On Active Shift'}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Full & Half Shifts</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Direct Contact</span>
              <a 
                href={`tel:${candidate.mobileNumber}`} 
                className="text-xs font-bold text-emerald-800 hover:underline block mt-0.5 truncate"
              >
                {candidate.mobileNumber}
              </a>
              <span className="text-[10px] text-slate-500 block mt-0.5">WhatsApp enabled</span>
            </div>
          </div>

          {/* Bio statement */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Worker Bio & Specialty</h4>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{candidate.bio}"
            </p>
          </div>

          {/* Skills & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                <span>Agricultural Competencies</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Main Crops Handled: </span>
                <span className="text-[11px] font-bold text-slate-800">{candidate.mainCropsHandled.join(', ')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tools & Equipment Owned</span>
              </h4>
              <div className="space-y-1">
                {(candidate.toolsOwned || ['Heavy Sickle', 'Field Safety Boots', 'Harvest Haul Sacks']).map(tool => (
                  <div key={tool} className="text-xs text-slate-700 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
              {candidate.certifications && candidate.certifications.length > 0 && (
                <div className="pt-1 text-[11px] text-emerald-800 font-medium bg-emerald-50/70 p-1.5 rounded-md border border-emerald-200">
                  📜 {candidate.certifications.join(' • ')}
                </div>
              )}
            </div>
          </div>

          {/* Verified Wage Settlement Channels */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verified Wage Disbursal Ledger Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">UPI Beneficiary VPA</span>
                  <span className="font-mono font-bold text-slate-800">{candidate.upiId || 'murugesan.agri@oksbi'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">Bank Account (DBT Linked)</span>
                  <span className="font-mono font-bold text-slate-800">
                    {candidate.bankName || 'Canara Bank'} •••• {candidate.bankAccountLast4 || '4192'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Farmer Reviews */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Farmer Feedback ({candidate.reviews?.length || 0})</span>
            </h4>

            <div className="space-y-2">
              {candidate.reviews && candidate.reviews.length > 0 ? (
                candidate.reviews.map(rev => (
                  <div key={rev.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                      <span>Crop: {rev.cropType}</span>
                      <span>Date: {rev.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No written reviews yet. High reliability score based on completed shifts.
                </div>
              )}
            </div>
          </div>

          {/* Direct Job Invitation Form */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">Job Invitation Sent Successfully!</h5>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    An instant SMS & app alert has been sent to {candidate.fullName} ({candidate.mobileNumber}). They will be notified to confirm their availability.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInvitation} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-800" />
                  <span>Send Job Offer / Invitation to {candidate.fullName}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Select Farm Posting
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                      {activeJobs.length > 0 ? (
                        activeJobs.map(j => (
                          <option key={j.id} value={j.id}>
                            #{j.id}: {j.title} (₹{j.wageAmount}/day)
                          </option>
                        ))
                      ) : (
                        <option value={101}>#101: Paddy Harvesting & Threshing (₹750/day)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Invitation Note
                    </label>
                    <input
                      type="text"
                      value={inviteNote}
                      onChange={(e) => setInviteNote(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. Starting tomorrow 6:30 AM"
                    />
                  </div>
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
                    disabled={isInviting}
                    className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isInviting ? (
                      <span>Sending Invitation...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Job Invitation</span>
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
