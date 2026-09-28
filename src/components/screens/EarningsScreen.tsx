import React, { useState } from 'react';
import { 
  ArrowLeft, IndianRupee, TrendingUp, Calendar, 
  CheckCircle2, Clock, MapPin, Download, ShieldCheck, Wallet, ArrowUpRight, Filter
} from 'lucide-react';
import { HiredWorkerRecord, JobApplication, LanguageCode, EarningsSummary } from '../../types';
import { FarmConnectStore } from '../../data/store';

interface EarningsScreenProps {
  workerId?: number;
  hiredRecords: HiredWorkerRecord[];
  applications: JobApplication[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({
  workerId = 201,
  hiredRecords,
  applications,
  selectedLanguage,
  onBack
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'ALL' | 'SEPT' | 'AUG'>('SEPT');
  const earningsSummary: EarningsSummary = FarmConnectStore.getWorkerEarnings(workerId);

  const filteredRecords = earningsSummary.records.filter(r => {
    if (selectedPeriod === 'ALL') return true;
    if (selectedPeriod === 'SEPT') return r.date.startsWith('2026-09') || r.date.includes('Today') || r.date.includes('Yesterday');
    if (selectedPeriod === 'AUG') return r.date.startsWith('2026-08');
    return true;
  });

  const handleDownloadStatement = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Job Title,Crop,Farmer,Daily Wage,Days,Total (INR),Payment Mode,Status\n"
      + earningsSummary.records.map(r => 
          `"${r.date}","${r.jobTitle}","${r.cropType}","${r.farmerName}",${r.wageAmount},${r.durationDays},${r.totalEarned},"${r.paymentMode}","${r.paymentStatus}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FarmConnect_Earnings_Passbook_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <h2 className="text-sm font-bold text-slate-900">Worker Earnings & Passbook</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Direct to Worker • Zero Commission</span>
            </div>
          </div>

          <button
            onClick={handleDownloadStatement}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-800 hover:bg-slate-50 flex items-center gap-1 text-[10px] font-bold"
            title="Download CSV Statement"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Passbook</span>
          </button>
        </div>

        {/* Primary Earnings Summary Card */}
        <div className="p-3.5 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] top-[-10px] opacity-10 text-7xl font-bold">₹</div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">September 2026 Earnings</span>
              <div className="text-2xl font-black mt-0.5 flex items-center">
                <span>₹{earningsSummary.currentMonthEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-700/80 border border-emerald-500/40 rounded-full text-[10px] font-bold text-emerald-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-300" />
              +14% vs Last Month
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-700/60 text-center">
            <div>
              <div className="text-xs font-bold">₹{earningsSummary.totalEarnings.toLocaleString('en-IN')}</div>
              <div className="text-[9px] text-emerald-200">Total Lifetime</div>
            </div>
            <div>
              <div className="text-xs font-bold">{earningsSummary.completedJobsCount} Shifts</div>
              <div className="text-[9px] text-emerald-200">Completed</div>
            </div>
            <div>
              <div className="text-xs font-bold">₹{earningsSummary.averageDailyWage}</div>
              <div className="text-[9px] text-emerald-200">Avg. Daily Wage</div>
            </div>
          </div>
        </div>

        {/* Payout Security Notice */}
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <p className="text-[10px] text-emerald-900 font-medium leading-tight">
            All wages are paid directly by farmers into your linked UPI account or cash with digital attendance verification.
          </p>
        </div>

        {/* Month Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setSelectedPeriod('SEPT')}
            className={`px-3 py-1 rounded-xl text-[10px] transition-all font-bold ${
              selectedPeriod === 'SEPT' 
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            September 2026
          </button>
          <button
            onClick={() => setSelectedPeriod('AUG')}
            className={`px-3 py-1 rounded-xl text-[10px] transition-all font-bold ${
              selectedPeriod === 'AUG' 
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            August 2026
          </button>
          <button
            onClick={() => setSelectedPeriod('ALL')}
            className={`px-3 py-1 rounded-xl text-[10px] transition-all font-bold ${
              selectedPeriod === 'ALL' 
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All History
          </button>
        </div>

        {/* Shift History & Transaction Logs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Completed Shifts & Wage Credits</span>
            <span className="text-[10px] text-slate-500">{filteredRecords.length} records</span>
          </div>

          <div className="space-y-2">
            {filteredRecords.map((r) => (
              <div 
                key={r.id}
                className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-600 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 text-[8px] font-bold rounded uppercase">
                      {r.cropType}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{r.jobTitle}</h4>
                    <p className="text-[10px] text-slate-600 mt-0.5">{r.farmerName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {r.date} • {r.durationDays} {r.durationDays === 1 ? 'day' : 'days'}
                      </span>
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[8px] font-bold rounded">
                        {r.paymentMode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-800 flex items-center justify-end">
                      <span>+₹{r.totalEarned}</span>
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {r.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

