import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Phone, Award, ShieldCheck, 
  CheckCircle2, Edit3, Save, RefreshCw, Sparkles, User, Camera, TrendingUp 
} from 'lucide-react';
import { LanguageCode, UserSession, AvailabilityStatus } from '../../types';

interface WorkerProfileScreenProps {
  session: UserSession | null;
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onUpdateProfile: (updated: Partial<UserSession>) => void;
}

export const WorkerProfileScreen: React.FC<WorkerProfileScreenProps> = ({
  session,
  selectedLanguage,
  onBack,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(session?.fullName || 'Murugesan V.');
  const [villageTown, setVillageTown] = useState(session?.villageOrTown || 'Thiruvaiyaru');
  const [district, setDistrict] = useState(session?.district || 'Thanjavur');
  const [experienceYears, setExperienceYears] = useState(session?.experienceYears || 7);
  const [dailyRate, setDailyRate] = useState(session?.dailyWageExpected || 750);
  const [skills, setSkills] = useState<string[]>(session?.skills || ['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation']);
  const [availability, setAvailability] = useState<AvailabilityStatus>(session?.availabilityStatus || 'AVAILABLE');
  const [bio, setBio] = useState(session?.bio || 'Skilled paddy harvester and tractor operator available for Thanjavur delta district.');
  const [isSaving, setIsSaving] = useState(false);

  const availableSkillOptions = [
    'Harvesting', 'Paddy work', 'Bundling', 'Tractor operation',
    'Sugarcane Cutting', 'Cotton Picking', 'Sowing', 'Weeding', 'Spraying', 'Drip Setup'
  ];

  // Calculate profile completion percentage
  const profileCompletionPercent = Math.min(100, 
    (fullName ? 25 : 0) + 
    (villageTown ? 20 : 0) + 
    (skills.length >= 2 ? 25 : 10) + 
    (experienceYears > 0 ? 15 : 0) + 
    (bio ? 15 : 0)
  );

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      onUpdateProfile({
        fullName,
        villageOrTown: villageTown,
        district,
        experienceYears,
        dailyWageExpected: dailyRate,
        skills,
        availabilityStatus: availability,
        bio
      });
    }, 500);
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
            <h2 className="text-sm font-bold text-slate-900">Worker Profile & Bio</h2>
          </div>

          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isEditing ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isEditing ? (
              isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />
            ) : (
              <Edit3 className="w-3.5 h-3.5" />
            )}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Completion Progress Card */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Profile {profileCompletionPercent}% complete
            </span>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-emerald-800 font-bold hover:underline"
              >
                Complete Profile →
              </button>
            )}
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full transition-all"
              style={{ width: `${profileCompletionPercent}%` }}
            />
          </div>
        </div>

        {/* Profile Identity Card */}
        <div className="p-4 bg-emerald-800 text-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-13 h-13 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-xs">
                👨‍🌾
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center shadow-xs text-[8px]"
                title="Change Photo"
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">{fullName}</h3>
                <span className="px-1.5 py-0.2 bg-emerald-600 text-emerald-100 text-[9px] font-bold rounded">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{villageTown}, {district}</span>
              </p>
              <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                {session?.mobileNumber || '+91 98405 67890'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-700/60 text-center text-xs">
            <div>
              <span className="text-[10px] text-emerald-200 block">Rating</span>
              <span className="font-bold text-amber-300 text-[11px] flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-300" />
                4.9
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block">Reliability</span>
              <span className="font-bold text-emerald-200 text-[11px]">96%</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block">Experience</span>
              <span className="font-bold text-white text-[11px]">{experienceYears} Years</span>
            </div>
          </div>
        </div>

        {/* Reliability Score Detailed Breakdown */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Reliability Score Breakdown
            </span>
            <span className="text-xs font-black text-emerald-800">96 / 100</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between items-center text-slate-600">
              <span>✓ On-Time Arrival:</span>
              <span className="font-bold text-slate-800">98% (23/24 shifts)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>✓ Shift Completion:</span>
              <span className="font-bold text-slate-800">100% (No no-shows)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>✓ Farmer Repeat Hires:</span>
              <span className="font-bold text-slate-800">92% Positive</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Current Work Availability</span>
            <span className="text-[10px] text-slate-500">Farmers can see you in nearby worker searches</span>
          </div>

          <button
            onClick={() => {
              const newStatus = availability === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
              setAvailability(newStatus);
              onUpdateProfile({ availabilityStatus: newStatus });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              availability === 'AVAILABLE'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                : 'bg-red-100 text-red-900 border border-red-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${availability === 'AVAILABLE' ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`}></span>
            <span>{availability === 'AVAILABLE' ? '🟢 Available Now' : '🔴 Busy / Booked'}</span>
          </button>
        </div>

        {/* Form Fields for Edit / View */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs text-xs">
          {isEditing ? (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={villageTown}
                    onChange={(e) => setVillageTown(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 1)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">Expected Wage (₹/day)</label>
                  <input
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(parseInt(e.target.value) || 500)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Skills Selection</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkillOptions.map((sk) => {
                    const active = skills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => {
                          if (active) setSkills(skills.filter(s => s !== sk));
                          else setSkills([...skills, sk]);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-medium border ${
                          active ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Worker Bio / Notes</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Skills & Proficiencies</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {skills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-medium">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Expected Daily Rate</span>
                <span className="text-sm font-bold text-emerald-800 mt-0.5 block">₹{dailyRate} / day</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">About Me</span>
                <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">{bio}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
