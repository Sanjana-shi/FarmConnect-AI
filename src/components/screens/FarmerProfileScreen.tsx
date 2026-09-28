import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Phone, ShieldCheck, 
  CheckCircle2, Edit3, Save, RefreshCw, Sparkles, User, Camera, 
  Tractor, Wheat, KeyRound, LogOut, ChevronRight, BarChart3, AlertCircle
} from 'lucide-react';
import { LanguageCode, UserSession } from '../../types';

interface FarmerProfileScreenProps {
  session: UserSession | null;
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onUpdateProfile: (updated: Partial<UserSession>) => void;
  onLogout: () => void;
  onChangePin: () => void;
}

export const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  session,
  selectedLanguage,
  onBack,
  onUpdateProfile,
  onLogout,
  onChangePin
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(session?.fullName || 'Ramesh K. (Murugan Farms)');
  const [email, setEmail] = useState(session?.email || 'ramesh.farmer@farmconnect.in');
  const [mobileNumber, setMobileNumber] = useState(session?.mobileNumber || '+91 98401 23456');
  const [villageTown, setVillageTown] = useState(session?.villageOrTown || 'Thiruvaiyaru');
  const [district, setDistrict] = useState(session?.district || 'Thanjavur');
  const [state, setState] = useState(session?.state || 'Tamil Nadu');
  const [farmSizeAcres, setFarmSizeAcres] = useState<number>(session?.farmSizeAcres || 5.5);
  const [mainCrops, setMainCrops] = useState<string[]>(session?.mainCrops || ['Paddy', 'Sugarcane']);
  const [bio, setBio] = useState(session?.bio || 'Generational paddy and sugarcane farmer in Cauvery delta. Focus on sustainable cultivation and fair worker wages.');
  const [avatarUrl, setAvatarUrl] = useState(session?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const cropOptions = ['Paddy', 'Sugarcane', 'Cotton', 'Banana', 'Wheat', 'Maize', 'Vegetables', 'Groundnut'];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  ];

  const handleToggleCrop = (crop: string) => {
    if (mainCrops.includes(crop)) {
      if (mainCrops.length > 1) {
        setMainCrops(mainCrops.filter(c => c !== crop));
      }
    } else {
      setMainCrops([...mainCrops, crop]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      onUpdateProfile({
        fullName,
        email,
        mobileNumber,
        villageOrTown: villageTown,
        district,
        state,
        farmSizeAcres,
        mainCrops,
        bio,
        avatar: avatarUrl
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
            <h2 className="text-sm font-bold text-slate-900">Farmer Land & Profile</h2>
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

        {saveSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile and land details updated successfully!</span>
          </div>
        )}

        {/* Farmer Header Card */}
        <div className="p-3.5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={avatarUrl} 
                alt={fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-300/40 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 border border-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Verified Farmer
                </span>
                <span className="text-[10px] text-emerald-200 font-medium">ID #F-{session?.userId || 1}</span>
              </div>
              <h3 className="text-sm font-bold text-white truncate mt-0.5">{fullName}</h3>
              <p className="text-[11px] text-emerald-100/90 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
                <span>{villageTown}, {district}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-1.5 bg-white/10 rounded-xl">
              <span className="text-xs font-black block">{farmSizeAcres} ac</span>
              <span className="text-[9px] text-emerald-200">Land Area</span>
            </div>
            <div className="p-1.5 bg-white/10 rounded-xl">
              <span className="text-xs font-black block">{session?.completedJobsCount || 8}</span>
              <span className="text-[9px] text-emerald-200">Jobs Posted</span>
            </div>
            <div className="p-1.5 bg-white/10 rounded-xl">
              <span className="text-xs font-black block">₹{session?.totalEarnings ? (session.totalEarnings * 1.5).toLocaleString() : '18,500'}</span>
              <span className="text-[9px] text-emerald-200">Wages Paid</span>
            </div>
          </div>
        </div>

        {/* Edit Avatar Options (when editing) */}
        {isEditing && (
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">Choose Profile Picture</label>
            <div className="flex items-center gap-2">
              {avatarOptions.map((opt, i) => (
                <img
                  key={i}
                  src={opt}
                  alt="Avatar Option"
                  onClick={() => setAvatarUrl(opt)}
                  className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all ${
                    avatarUrl === opt ? 'border-emerald-700 scale-105 ring-2 ring-emerald-200' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Farm & Contact Form */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Tractor className="w-3.5 h-3.5 text-emerald-700" />
            <span>Farm & Personal Information</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Farmer / Enterprise Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              ) : (
                <p className="font-semibold text-slate-900">{fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Mobile Number</label>
                <p className="font-semibold text-slate-900">{mobileNumber}</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                ) : (
                  <p className="font-semibold text-slate-900 truncate">{email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Village / Town</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={villageTown}
                    onChange={(e) => setVillageTown(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                ) : (
                  <p className="font-semibold text-slate-900">{villageTown}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">District</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                ) : (
                  <p className="font-semibold text-slate-900">{district}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Cultivated Land (Acres)</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.5"
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(Number(e.target.value))}
                  className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              ) : (
                <p className="font-semibold text-slate-900">{farmSizeAcres} Acres</p>
              )}
            </div>

            {/* Crops Handled */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Crops Cultivated</label>
              <div className="flex flex-wrap gap-1">
                {isEditing ? (
                  cropOptions.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => handleToggleCrop(crop)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        mainCrops.includes(crop)
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mainCrops.includes(crop) ? '✓ ' : '+ '} {crop}
                    </button>
                  ))
                ) : (
                  mainCrops.map((crop) => (
                    <span key={crop} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-semibold">
                      🌾 {crop}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Farm Bio */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Farm Description & Requirements</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
                />
              ) : (
                <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security & Settings */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-slate-800">Security & Account</h4>
          <button
            onClick={onChangePin}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 text-left"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-slate-900">Change Security PIN</p>
                <p className="text-[10px] text-slate-500">Update your 4-digit transaction & sign-in PIN</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Farmer Account</span>
        </button>
      </div>
    </div>
  );
};
