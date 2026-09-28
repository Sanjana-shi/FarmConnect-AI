import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Filter, MapPin, Calendar, Clock, 
  Users, IndianRupee, CheckCircle2, ChevronRight, SlidersHorizontal, Sparkles,
  AlertTriangle, Navigation, RefreshCw
} from 'lucide-react';
import { JobItem, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { LocationService, UserLocationData } from '../../services/locationService';

interface NearbyJobsScreenProps {
  jobs: JobItem[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onSelectJob: (job: JobItem) => void;
  onQuickApply: (job: JobItem) => void;
}

export const NearbyJobsScreen: React.FC<NearbyJobsScreenProps> = ({
  jobs,
  selectedLanguage,
  onBack,
  onSelectJob,
  onQuickApply
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'DISTANCE' | 'WAGE_HIGH' | 'DATE'>('WAGE_HIGH');
  const [showFilters, setShowFilters] = useState(false);
  const [locationData, setLocationData] = useState<UserLocationData>(LocationService.getLocation());

  useEffect(() => {
    return LocationService.subscribe((loc) => {
      setLocationData(loc);
      if (loc.status === 'granted') {
        setSortBy('DISTANCE');
      } else if (loc.status === 'denied') {
        setSortBy('WAGE_HIGH');
      }
    });
  }, []);

  const isLocationDenied = locationData.status === 'denied';

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const crops = ['ALL', 'Paddy', 'Sugarcane', 'Cotton', 'Wheat', 'Banana'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.villageTown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = selectedCrop === 'ALL' || job.cropType.toLowerCase() === selectedCrop.toLowerCase();
    const matchesDistance = isLocationDenied ? true : (job.distanceKm || 5) <= maxDistance;

    return matchesSearch && matchesCrop && matchesDistance;
  }).sort((a, b) => {
    if (sortBy === 'DISTANCE' && !isLocationDenied) return (a.distanceKm || 0) - (b.distanceKm || 0);
    if (sortBy === 'WAGE_HIGH') return b.wageAmount - a.wageAmount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
      <div className="space-y-3">
        {/* Header with Back button */}
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
              <h2 className="text-sm font-bold text-slate-900">{t.nearbyJobs || 'Nearby Farm Jobs'}</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-semibold transition-all ${
              showFilters ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Graceful Fallback Banner when Location Access is Denied */}
        {isLocationDenied && (
          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-xs text-amber-900 shadow-xs animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-950 block text-[11px]">
                Location access is required for this feature
              </span>
              <span className="text-[10px] text-amber-800 leading-tight block mt-0.5">
                Distance filtering is disabled. Showing all verified jobs in {locationData.district} sorted by wage.
              </span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, task, or village..."
            className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700"
          />
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 text-[11px]">Max Distance Radius:</span>
                <span className={`font-mono font-bold text-[11px] ${isLocationDenied ? 'text-slate-400 line-through' : 'text-emerald-800'}`}>
                  {isLocationDenied ? 'GPS Off' : `${maxDistance} km`}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                disabled={isLocationDenied}
                title={isLocationDenied ? "Location access is required for this feature" : "Adjust distance radius"}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className={`w-full accent-emerald-800 h-1.5 rounded-lg ${
                  isLocationDenied ? 'bg-slate-200 cursor-not-allowed opacity-50' : 'bg-slate-200 cursor-pointer'
                }`}
              />
              {isLocationDenied && (
                <span className="text-[9px] text-amber-700 font-semibold block mt-0.5">
                  Location access is required for this feature
                </span>
              )}
            </div>

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-1">Sort By:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  disabled={isLocationDenied}
                  title={isLocationDenied ? "Location access is required for this feature" : "Sort by nearest distance"}
                  onClick={() => setSortBy('DISTANCE')}
                  className={`py-1 rounded-md text-[10px] font-semibold border transition-all ${
                    isLocationDenied
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                      : sortBy === 'DISTANCE'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📍 Nearest
                </button>
                <button
                  onClick={() => setSortBy('WAGE_HIGH')}
                  className={`py-1 rounded-md text-[10px] font-semibold border ${
                    sortBy === 'WAGE_HIGH' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  💰 Highest Wage
                </button>
                <button
                  onClick={() => setSortBy('DATE')}
                  className={`py-1 rounded-md text-[10px] font-semibold border ${
                    sortBy === 'DATE' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  📅 Newest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crop Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {crops.map((crop) => {
            const active = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  active 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {crop === 'ALL' ? '🌾 All Crops' : crop}
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        <div className="space-y-2.5">
          {filteredJobs.length === 0 ? (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
              <span className="text-3xl">🌾</span>
              <h4 className="text-xs font-bold text-slate-800">No jobs found in this radius</h4>
              <p className="text-[11px] text-slate-500">Try expanding your distance slider or selecting All Crops.</p>
              <button
                onClick={() => { setSelectedCrop('ALL'); setMaxDistance(25); setSearchQuery(''); }}
                className="px-3 py-1.5 bg-emerald-800 text-white text-[11px] font-bold rounded-lg mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-emerald-700 transition-all cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9px] font-bold uppercase">
                        {job.cropType}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-medium">
                        {job.workType}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1">{job.title}</h3>
                    <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{job.farmerLocation}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-800">
                      ₹{job.wageAmount}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/ day</span>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-700" />
                    <span>Starts {job.startDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Users className="w-3 h-3 text-emerald-700" />
                    <span>Need {job.workersRequired - job.workersHired} more</span>
                  </div>
                </div>

                {/* Perks tags */}
                {job.perks && job.perks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.perks.slice(0, 2).map((perk, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[9px] font-medium">
                        ✨ {perk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectJob(job); }}
                    className="text-[11px] font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-0.5"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); onQuickApply(job); }}
                    className="px-3.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                  >
                    {t.applyNow || 'Apply Now'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
