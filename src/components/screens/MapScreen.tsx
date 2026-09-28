import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Navigation, SlidersHorizontal, 
  Layers, Users, Briefcase, Star, IndianRupee, Sparkles, CheckCircle2,
  AlertTriangle, MapPinOff, RefreshCw
} from 'lucide-react';
import { JobItem, WorkerCandidate, LanguageCode, UserRole } from '../../types';
import { LocationService, UserLocationData, TAMIL_NADU_DISTRICTS } from '../../services/locationService';

interface MapScreenProps {
  role: UserRole;
  jobs: JobItem[];
  candidates: WorkerCandidate[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onSelectJob: (job: JobItem) => void;
  onQuickApply: (job: JobItem) => void;
  onSelectWorker: (worker: WorkerCandidate) => void;
  onInviteWorker: (worker: WorkerCandidate) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  role,
  jobs,
  candidates,
  selectedLanguage,
  onBack,
  onSelectJob,
  onQuickApply,
  onSelectWorker,
  onInviteWorker
}) => {
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [selectedJobPin, setSelectedJobPin] = useState<JobItem | null>(jobs[0] || null);
  const [selectedWorkerPin, setSelectedWorkerPin] = useState<WorkerCandidate | null>(candidates[0] || null);
  const [locationData, setLocationData] = useState<UserLocationData>(LocationService.getLocation());

  useEffect(() => {
    return LocationService.subscribe(setLocationData);
  }, []);

  const isLocationDenied = locationData.status === 'denied';

  // Filter jobs/workers by district if GPS denied
  const activeDistrict = locationData.district || 'Thanjavur';

  // Mock geo-coordinates clustered around Thanjavur / Thiruvaiyaru regional delta
  const jobMapPoints = jobs.map((job, idx) => ({
    ...job,
    x: 48 + (idx % 3 === 0 ? -20 : idx % 3 === 1 ? 15 : -5) + (idx * 6),
    y: 40 + (idx % 2 === 0 ? -15 : 20) + (idx * 5)
  }));

  const workerMapPoints = candidates.map((cand, idx) => ({
    ...cand,
    x: 50 + (idx % 3 === 0 ? 18 : idx % 3 === 1 ? -22 : 8) - (idx * 4),
    y: 45 + (idx % 2 === 0 ? 18 : -18) + (idx * 4)
  }));

  return (
    <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
      <div className="space-y-2.5">
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
              <h2 className="text-sm font-bold text-slate-900">
                {role === 'WORKER' ? 'Nearby Farm Jobs Map' : 'Nearby Workers Map'}
              </h2>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span>{activeDistrict} Delta Region</span>
                <span>•</span>
                <span className={isLocationDenied ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
                  {isLocationDenied ? 'Manual District Fallback' : 'GPS Active'}
                </span>
              </span>
            </div>
          </div>

          {/* Recenter / Geolocation Action Button */}
          <div className="flex items-center gap-1.5">
            <button
              disabled={isLocationDenied}
              title={isLocationDenied ? "Location access is required for this feature" : "Recenter GPS Location"}
              onClick={() => LocationService.requestPosition()}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-semibold transition-all ${
                isLocationDenied
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-800'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">
                {isLocationDenied ? 'GPS Disabled' : 'Recenter GPS'}
              </span>
            </button>
          </div>
        </div>

        {/* Graceful Fallback Banner when Location Access is Denied */}
        {isLocationDenied && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-900 animate-fadeIn shadow-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 text-xs">
                    Location access is required for this feature
                  </h4>
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Automatic GPS positioning is blocked or denied. Related distance and live tracking buttons have been disabled. Select your district below to view regional farm work.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/80">
              <button
                type="button"
                onClick={() => LocationService.requestPosition()}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-xs transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Location Access</span>
              </button>

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[10px] font-bold text-amber-950">Select District:</span>
                <select
                  value={activeDistrict}
                  onChange={(e) => LocationService.setManualDistrict(e.target.value)}
                  className="h-7 px-2 bg-white border border-amber-300 rounded-lg text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {TAMIL_NADU_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Radius Filter Pills (Disabled when GPS is denied, with tooltip) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-600 shrink-0">Radius:</span>
          {[5, 10, 20, 35].map((km) => (
            <button
              key={km}
              disabled={isLocationDenied}
              title={isLocationDenied ? "Location access is required for this feature" : `Filter within ${km} km`}
              onClick={() => setRadiusKm(km)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                isLocationDenied
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  : radiusKm === km 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Within {km} km
            </button>
          ))}
          {isLocationDenied && (
            <span className="text-[9px] text-amber-700 font-semibold italic ml-1">
              (Location access required for radius filter)
            </span>
          )}
        </div>

        {/* Interactive Simulated Map Canvas */}
        <div className="relative w-full h-64 bg-[#E8F2E6] border-2 border-emerald-600/30 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle Map Grid and Agro Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* River Delta Line Graphic */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <path d="M0,80 Q90,120 180,90 T360,140" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray="6,4" />
            <path d="M40,0 Q120,90 200,160 T320,240" fill="none" stroke="#0ea5e9" strokeWidth="3" />
          </svg>

          {/* User Location Center Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="relative flex items-center justify-center">
              <span className={`absolute w-8 h-8 rounded-full ${isLocationDenied ? 'bg-amber-500 opacity-25' : 'bg-emerald-500 animate-ping opacity-40'}`}></span>
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white ${
                isLocationDenied ? 'bg-amber-700' : 'bg-emerald-800'
              }`}>
                {isLocationDenied ? '📌' : '📍'}
              </div>
            </div>
            <span className="text-[8px] font-bold bg-white/90 px-1.5 py-0.2 rounded shadow-xs text-slate-800 mt-1">
              {isLocationDenied ? `${activeDistrict} Hub` : 'Your Village'}
            </span>
          </div>

          {/* Map Pins for Worker View (Jobs) */}
          {role === 'WORKER' && jobMapPoints.map((job) => {
            const isSelected = selectedJobPin?.id === job.id;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobPin(job)}
                style={{ top: `${Math.min(Math.max(job.y, 10), 80)}%`, left: `${Math.min(Math.max(job.x, 10), 85)}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full shadow-md flex items-center gap-1 transition-transform hover:scale-110 active:scale-95 ${
                  isSelected ? 'bg-emerald-900 text-white ring-2 ring-amber-400 z-20 scale-105' : 'bg-emerald-700 text-white'
                }`}
              >
                <span className="text-xs">🌾</span>
                <span className="text-[9px] font-bold pr-1">₹{job.wageAmount}</span>
              </button>
            );
          })}

          {/* Map Pins for Farmer View (Workers) */}
          {role === 'FARMER' && workerMapPoints.map((cand) => {
            const isSelected = selectedWorkerPin?.id === cand.id;
            return (
              <button
                key={cand.id}
                onClick={() => setSelectedWorkerPin(cand)}
                style={{ top: `${Math.min(Math.max(cand.y, 10), 80)}%`, left: `${Math.min(Math.max(cand.x, 10), 85)}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full shadow-md flex items-center gap-1 transition-transform hover:scale-110 active:scale-95 ${
                  isSelected ? 'bg-amber-700 text-white ring-2 ring-emerald-400 z-20 scale-105' : 'bg-emerald-800 text-white'
                }`}
              >
                <span className="text-xs">🛠️</span>
                <span className="text-[9px] font-bold pr-1">{cand.reliabilityScore}%</span>
              </button>
            );
          })}

          {/* Map Controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
            <div className="p-1 bg-white/90 backdrop-blur-xs rounded shadow-xs text-[9px] font-bold text-slate-700 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-700" />
              <span>{activeDistrict} Regional Delta</span>
            </div>
          </div>
        </div>

        {/* Demo Location Simulation Toggle for Testing */}
        <div className="flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600">
          <span>Permission Test:</span>
          {isLocationDenied ? (
            <button
              onClick={() => LocationService.requestPosition()}
              className="text-emerald-800 hover:text-emerald-950 font-bold underline"
            >
              Grant GPS Permission
            </button>
          ) : (
            <button
              onClick={() => LocationService.setDenied()}
              className="text-amber-800 hover:text-amber-950 font-bold underline"
            >
              Simulate Deny Location
            </button>
          )}
        </div>

        {/* Selected Entity Bottom Sheet Card */}
        {role === 'WORKER' && selectedJobPin && (
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded uppercase">
                  {selectedJobPin.cropType} • {selectedJobPin.distanceKm} km away
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{selectedJobPin.title}</h4>
                <p className="text-[10px] text-slate-500">{selectedJobPin.farmerLocation}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-800">₹{selectedJobPin.wageAmount}</span>
                <span className="text-[8px] text-slate-400 block">/ day</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => onSelectJob(selectedJobPin)}
                className="flex-1 h-8 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg"
              >
                View Details
              </button>
              <button
                onClick={() => onQuickApply(selectedJobPin)}
                className="flex-1 h-8 bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold rounded-lg shadow-xs"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}

        {role === 'FARMER' && selectedWorkerPin && (
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{selectedWorkerPin.fullName}</h4>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 text-[9px] font-bold rounded-full">
                    ⭐ {selectedWorkerPin.rating}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{selectedWorkerPin.villageTown}, {selectedWorkerPin.district} • {selectedWorkerPin.distanceKm} km</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedWorkerPin.skills.slice(0, 2).map((sk, i) => (
                    <span key={i} className="text-[8px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-800">{selectedWorkerPin.reliabilityScore}%</span>
                <span className="text-[8px] text-slate-400 block">Reliability</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => onSelectWorker(selectedWorkerPin)}
                className="flex-1 h-8 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg"
              >
                View Profile
              </button>
              <button
                onClick={() => onInviteWorker(selectedWorkerPin)}
                className="flex-1 h-8 bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold rounded-lg shadow-xs"
              >
                Invite to Work
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
