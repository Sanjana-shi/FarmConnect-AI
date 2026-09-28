import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Star, MapPin, Phone, 
  ShieldCheck, CheckCircle2, ChevronRight, Filter, UserCheck, Sparkles 
} from 'lucide-react';
import { WorkerCandidate, LanguageCode, JobItem } from '../../types';

interface FindWorkersScreenProps {
  candidates: WorkerCandidate[];
  activeJobs: JobItem[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onInviteWorker: (worker: WorkerCandidate, jobId: number) => void;
}

export const FindWorkersScreen: React.FC<FindWorkersScreenProps> = ({
  candidates,
  activeJobs,
  selectedLanguage,
  onBack,
  onInviteWorker
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<WorkerCandidate | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number>(activeJobs[0]?.id || 101);
  const [inviteToast, setInviteToast] = useState<string | null>(null);

  const skillsList = ['ALL', 'Harvesting', 'Paddy work', 'Tractor operation', 'Sugarcane Cutting', 'Cotton Picking'];

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.villageTown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = selectedSkill === 'ALL' || c.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const handleOpenInvite = (candidate: WorkerCandidate) => {
    setSelectedCandidate(candidate);
    setIsInviteModalOpen(true);
  };

  const handleConfirmInvite = () => {
    if (selectedCandidate) {
      onInviteWorker(selectedCandidate, selectedJobId);
      setIsInviteModalOpen(false);
      setInviteToast(`Job invitation sent to ${selectedCandidate.fullName}! They will receive an instant notification.`);
      setTimeout(() => setInviteToast(null), 3500);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn relative">
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
              <h2 className="text-sm font-bold text-slate-900">Nearby Verified Workers</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">{filteredCandidates.length} Workers in your district</span>
            </div>
          </div>
        </div>

        {/* Invite Toast Notification */}
        {inviteToast && (
          <div className="p-2 bg-emerald-800 text-white text-[11px] font-bold rounded-xl text-center shadow-xs animate-fadeIn flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{inviteToast}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by worker name, skill, or village..."
            className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700"
          />
        </div>

        {/* Skill Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedSkill === skill 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {skill === 'ALL' ? '⭐ All Skills' : skill}
            </button>
          ))}
        </div>

        {/* Worker Candidates List */}
        <div className="space-y-2.5">
          {filteredCandidates.map((candidate) => (
            <div 
              key={candidate.id}
              className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 hover:border-emerald-600 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    👷
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900">{candidate.fullName}</h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{candidate.villageTown}, {candidate.district} ({candidate.distanceKm} km away)</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800">₹{candidate.dailyRate}</span>
                  <span className="text-[9px] text-slate-400 block">/ day expected</span>
                </div>
              </div>

              {/* Badges & Metrics */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{candidate.rating}</span>
                  <span className="text-slate-400 font-normal">({candidate.reviewCount} jobs)</span>
                </div>

                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
                  ⭐ Reliability: {candidate.reliabilityScore}%
                </div>

                <span className={`font-bold ${candidate.availabilityStatus === 'AVAILABLE' ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {candidate.availabilityStatus === 'AVAILABLE' ? '🟢 Available' : '🔴 Busy'}
                </span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1">
                {candidate.skills.map((sk, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium">
                    {sk}
                  </span>
                ))}
              </div>

              {/* Bio quote */}
              <p className="text-[10px] text-slate-600 italic line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                "{candidate.bio}"
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <a
                  href={`tel:${candidate.mobileNumber}`}
                  className="text-[11px] text-slate-600 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
                  title={`Call ${candidate.fullName}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Direct</span>
                </a>

                <button
                  onClick={() => handleOpenInvite(candidate)}
                  className="px-3.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs active:scale-95 transition-all"
                >
                  Invite / Hire Worker
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && selectedCandidate && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-3xl p-4 space-y-3 shadow-2xl animate-slideUp text-slate-900">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Send Work Invitation</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-900">{selectedCandidate.fullName}</div>
              <div className="text-[11px] text-slate-600">Expected Rate: ₹{selectedCandidate.dailyRate}/day • Reliability: {selectedCandidate.reliabilityScore}%</div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">Select Job to Invite for:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              >
                {activeJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} (₹{j.wageAmount}/day • {j.startDate})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleConfirmInvite}
              className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Send Instant Hire Request</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
