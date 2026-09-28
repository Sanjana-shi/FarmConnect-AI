import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Calendar, Clock, IndianRupee, 
  Users, Sparkles, RefreshCw, CheckCircle2, ShieldCheck, MapPin 
} from 'lucide-react';
import { JobItem, LanguageCode, UserSession } from '../../types';
import { AiAgriService } from '../../services/aiService';

interface PostJobScreenProps {
  session: UserSession | null;
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onJobCreated: (job: Partial<JobItem> & { title: string; cropType: string; wageAmount: number }) => void;
}

export const PostJobScreen: React.FC<PostJobScreenProps> = ({
  session,
  selectedLanguage,
  onBack,
  onJobCreated
}) => {
  const [title, setTitle] = useState('Paddy Harvesting & Threshing');
  const [cropType, setCropType] = useState('Paddy');
  const [workType, setWorkType] = useState('Harvesting');
  const [workersRequired, setWorkersRequired] = useState<number>(6);
  const [wageAmount, setWageAmount] = useState<number>(750);
  const [startDate, setStartDate] = useState('2026-09-06');
  const [endDate, setEndDate] = useState('2026-09-09');
  const [workingHours, setWorkingHours] = useState('07:00 AM - 02:30 PM (7.5 hrs)');
  const [toolsProvided, setToolsProvided] = useState<boolean>(true);
  const [description, setDescription] = useState(
    'Need 6 experienced workers for 3 days of paddy crop harvesting, bundling, and threshing. Lunch and morning tea provided.'
  );
  const [selectedPerks, setSelectedPerks] = useState<string[]>([
    'Free Lunch & Tea', 'Same Day Cash/UPI', 'Transport from Village Junction'
  ]);
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiWageNotice, setAiWageNotice] = useState<string | null>(null);

  const availableCrops = ['Paddy', 'Sugarcane', 'Cotton', 'Wheat', 'Banana', 'Vegetables', 'Maize'];
  const availableWorkTypes = ['Harvesting', 'Cutting', 'Paddy work', 'Sowing', 'Weeding', 'Spraying', 'Tractor operation'];
  const availablePerks = ['Free Lunch & Tea', 'Transport Provided', 'Same Day Cash/UPI', 'Overtime Bonus ₹120/hr', 'Drinking Water & Shade'];

  const handleAiSuggestWage = async () => {
    setIsAiEstimating(true);
    setAiWageNotice(null);
    try {
      const result = await AiAgriService.estimateWage(
        cropType, 
        workType, 
        session?.state || 'Tamil Nadu', 
        session?.district || 'Thanjavur', 
        session?.farmSizeAcres || 3.5
      );
      setWageAmount(result.recommendedDailyWage);
      setAiWageNotice(`AI Wage: ₹${result.recommendedDailyWage}/day (Range: ₹${result.wageRange.min} - ₹${result.wageRange.max})`);
    } catch {
      setWageAmount(750);
      setAiWageNotice('Standard Cauvery Delta Harvest Wage: ₹750/day');
    } finally {
      setIsAiEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || wageAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onJobCreated({
        farmerId: session?.userId || 1,
        farmerName: session?.fullName || 'Murugan Farms (Ramesh K.)',
        farmerPhone: session?.mobileNumber || '+91 98401 23456',
        farmerLocation: `${session?.villageOrTown || 'Thiruvaiyaru'}, ${session?.district || 'Thanjavur'}`,
        villageTown: session?.villageOrTown || 'Thiruvaiyaru',
        district: session?.district || 'Thanjavur',
        state: session?.state || 'Tamil Nadu',
        title,
        cropType,
        workType,
        description,
        workersRequired,
        wageAmount,
        wageType: 'PER_DAY',
        startDate,
        endDate,
        workingHours,
        perks: selectedPerks,
        toolsProvided,
        requiredSkills: [cropType, workType]
      });
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold text-slate-900">Post New Farm Job</h2>
          </div>

          <button
            type="button"
            onClick={handleAiSuggestWage}
            disabled={isAiEstimating}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded-lg flex items-center gap-1 shadow-xs"
          >
            {isAiEstimating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span>AI Wage Suggest</span>
          </button>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1">Job Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Paddy Harvesting & Threshing"
            className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700"
          />
        </div>

        {/* Crop & Work Type Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Crop Type</label>
            <select
              value={cropType}
              onChange={(e) => {
                setCropType(e.target.value);
                setTitle(`${e.target.value} ${workType}`);
              }}
              className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700"
            >
              {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Work Type</label>
            <select
              value={workType}
              onChange={(e) => {
                setWorkType(e.target.value);
                setTitle(`${cropType} ${e.target.value}`);
              }}
              className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700"
            >
              {availableWorkTypes.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        {/* AI Wage Notice */}
        {aiWageNotice && (
          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{aiWageNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setAiWageNotice(null)}
              className="text-[10px] text-amber-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Wage & Workers Needed */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Daily Wage (₹ / Day)</label>
            <div className="flex items-center h-9 px-2.5 bg-white border border-slate-300 rounded-lg focus-within:border-emerald-700">
              <span className="text-slate-500 font-bold text-xs mr-1">₹</span>
              <input
                type="number"
                required
                min="100"
                step="50"
                value={wageAmount}
                onChange={(e) => setWageAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-xs font-bold text-emerald-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Workers Needed</label>
            <div className="flex items-center justify-between h-9 px-2 bg-white border border-slate-300 rounded-lg">
              <button
                type="button"
                onClick={() => setWorkersRequired(Math.max(1, workersRequired - 1))}
                className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
              >
                -
              </button>
              <span className="text-xs font-bold text-slate-900">{workersRequired}</span>
              <button
                type="button"
                onClick={() => setWorkersRequired(workersRequired + 1)}
                className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Start & End Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Working Hours & Tools Provided */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Shift Timings</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-[11px] font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1">Tools Provided</label>
            <button
              type="button"
              onClick={() => setToolsProvided(!toolsProvided)}
              className={`w-full h-9 rounded-lg text-[11px] font-bold border transition-all ${
                toolsProvided ? 'bg-emerald-50 text-emerald-800 border-emerald-400' : 'bg-slate-50 text-slate-600 border-slate-300'
              }`}
            >
              {toolsProvided ? '✅ Tools Provided' : '❌ Worker Brings Tools'}
            </button>
          </div>
        </div>

        {/* Perks selection */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1">Perks & Amenities</label>
          <div className="flex flex-wrap gap-1.5">
            {availablePerks.map((p) => {
              const active = selectedPerks.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    if (active) setSelectedPerks(selectedPerks.filter(item => item !== p));
                    else setSelectedPerks([...selectedPerks, p]);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium border transition-all ${
                    active ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1">Work Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Publish Job Announcement</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
