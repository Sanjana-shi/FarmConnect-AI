import React, { useState } from 'react';
import { 
  ArrowLeft, Calculator, Sparkles, RefreshCw, 
  IndianRupee, TrendingUp, Info, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { LanguageCode, WageEstimationResult, UserSession } from '../../types';
import { AiAgriService } from '../../services/aiService';

interface WageCalculatorScreenProps {
  session: UserSession | null;
  selectedLanguage: LanguageCode;
  onBack: () => void;
}

export const WageCalculatorScreen: React.FC<WageCalculatorScreenProps> = ({
  session,
  selectedLanguage,
  onBack
}) => {
  const [cropType, setCropType] = useState('Paddy');
  const [workType, setWorkType] = useState('Harvesting');
  const [district, setDistrict] = useState(session?.district || 'Thanjavur');
  const [state, setState] = useState(session?.state || 'Tamil Nadu');
  const [acres, setAcres] = useState<number>(session?.farmSizeAcres || 3);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<WageEstimationResult | null>({
    cropType: 'Paddy',
    workType: 'Harvesting',
    location: 'Thanjavur, Tamil Nadu',
    recommendedDailyWage: 750,
    wageRange: { min: 700, max: 850 },
    estimatedWorkersNeeded: 6,
    estimatedDurationDays: 3,
    totalEstimatedBudget: 13500,
    currency: 'INR',
    marketTrend: 'PEAK_SEASON_FAIR_PRICE',
    factors: [
      'Cauvery Delta seasonal labor supply index',
      'Standard 7-hour manual harvesting shift with lunch',
      'Government minimum agri-wage benchmarks verified'
    ]
  });

  const crops = ['Paddy', 'Sugarcane', 'Cotton', 'Wheat', 'Banana', 'Vegetables', 'Maize'];
  const workTypes = ['Harvesting', 'Cutting', 'Paddy work', 'Sowing', 'Weeding', 'Spraying', 'Tractor operation'];

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await AiAgriService.estimateWage(cropType, workType, state, district, acres);
      setResult(res);
    } catch {
      // Handled inside service
    } finally {
      setIsCalculating(false);
    }
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
              <h2 className="text-sm font-bold text-slate-900">AI Agricultural Wage Calculator</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">Gemini ML Labor Market Intelligence</span>
            </div>
          </div>
        </div>

        {/* Input Parameters Form */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full h-9 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              >
                {crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">Operation</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full h-9 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              >
                {workTypes.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">Land Size (Acres)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={acres}
                onChange={(e) => setAcres(parseFloat(e.target.value) || 1)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">District / Region</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full h-10 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all text-xs mt-1"
          >
            {isCalculating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Calculate Fair Market Wage</span>
              </>
            )}
          </button>
        </div>

        {/* Results Card */}
        {result && (
          <div className="space-y-2.5">
            <div className="p-4 bg-emerald-800 text-white rounded-2xl shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-emerald-200 uppercase font-bold">Recommended Fair Daily Wage</span>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">
                    ₹{result.recommendedDailyWage} <span className="text-xs text-emerald-200 font-normal">/ day</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">
                    Range: ₹{result.wageRange.min} - ₹{result.wageRange.max} / worker / day
                  </span>
                </div>

                <div className="px-2.5 py-1 bg-emerald-950/60 rounded-xl border border-emerald-700 text-right">
                  <span className="text-[9px] text-emerald-300 block font-semibold">Demand Index</span>
                  <span className="text-[11px] font-bold text-amber-300">🔥 High Demand</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-emerald-700/60 text-center text-xs">
                <div>
                  <span className="text-emerald-200 text-[10px] block">Labor Needed</span>
                  <span className="font-bold text-white text-[11px]">{result.estimatedWorkersNeeded} Workers</span>
                </div>
                <div>
                  <span className="text-emerald-200 text-[10px] block">Duration</span>
                  <span className="font-bold text-white text-[11px]">{result.estimatedDurationDays} Days</span>
                </div>
                <div>
                  <span className="text-emerald-200 text-[10px] block">Total Budget</span>
                  <span className="font-bold text-amber-300 text-[11px]">₹{result.totalEstimatedBudget.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Factors & Market Explanation */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs text-xs">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px]">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>Market Factors Analyzed:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 pl-4 list-disc">
                {result.factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
