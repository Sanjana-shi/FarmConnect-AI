import React from 'react';
import { ArrowLeft, Star, IndianRupee, Award, CheckCircle2, Calendar, Download, TrendingUp } from 'lucide-react';
import { LanguageCode } from '../../types';

interface WorkHistoryScreenProps {
  selectedLanguage: LanguageCode;
  onBack: () => void;
}

export const WorkHistoryScreen: React.FC<WorkHistoryScreenProps> = ({
  selectedLanguage,
  onBack
}) => {
  const completedJobs = [
    {
      id: 'h-1',
      title: 'Paddy Harvesting & Bundling',
      farmer: 'Murugan Farms (Ramesh K.)',
      location: 'Thiruvaiyaru',
      crop: 'Paddy',
      dates: 'Aug 24 - Aug 27, 2026',
      daysWorked: 4,
      dailyRate: 750,
      totalEarned: 3000,
      rating: 5.0,
      feedback: 'Very fast worker, bundled 1.5 acres neatly and punctual everyday.'
    },
    {
      id: 'h-2',
      title: 'Sugarcane Cane Cutting Shift',
      farmer: 'Kaveri Delta Agro',
      location: 'Kumbakonam',
      crop: 'Sugarcane',
      dates: 'Aug 14 - Aug 19, 2026',
      daysWorked: 6,
      dailyRate: 850,
      totalEarned: 5100,
      rating: 4.8,
      feedback: 'Great physical stamina and team coordination during loading.'
    },
    {
      id: 'h-3',
      title: 'Rotary Tiller Land Prep',
      farmer: 'Green Valley Organic',
      location: 'Papanasam',
      crop: 'Paddy',
      dates: 'Aug 05 - Aug 07, 2026',
      daysWorked: 3,
      dailyRate: 1100,
      totalEarned: 3300,
      rating: 5.0,
      feedback: 'Expert tractor operator, excellent bunding quality.'
    },
    {
      id: 'h-4',
      title: 'Cotton Weeding & Bed Maintenance',
      farmer: 'Velu Agro',
      location: 'Thanjavur',
      crop: 'Cotton',
      dates: 'Jul 28 - Jul 31, 2026',
      daysWorked: 4,
      dailyRate: 700,
      totalEarned: 2800,
      rating: 4.9,
      feedback: 'Clean weeding work without damaging cotton taproots.'
    }
  ];

  const totalEarnings = completedJobs.reduce((acc, j) => acc + j.totalEarned, 0);
  const totalDays = completedJobs.reduce((acc, j) => acc + j.daysWorked, 0);

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
            <h2 className="text-sm font-bold text-slate-900">Work & Earnings History</h2>
          </div>

          <button
            onClick={() => {
              const rows = [
                ['Date Range', 'Farm Job', 'Farmer', 'Location', 'Wage Rate', 'Total Earned', 'Rating'],
                ...completedJobs.map(h => [h.dates, h.title, h.farmer, h.location, `₹${h.dailyRate}/day`, `₹${h.totalEarned}`, `${h.rating} Stars`])
              ];
              const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `FarmConnect_Work_Passbook_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            title="Download Experience Certificate & Statement"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px]">Passbook</span>
          </button>
        </div>

        {/* Lifetime Stats Card */}
        <div className="p-4 bg-emerald-800 text-white rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wide">Total Platform Earnings</span>
              <div className="text-2xl font-black text-amber-400 mt-0.5">₹{totalEarnings.toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-emerald-200 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-300" />
                <span>100% On-Time Cash / UPI settlements</span>
              </span>
            </div>

            <div className="p-2 bg-emerald-950/60 rounded-xl border border-emerald-700 text-center">
              <div className="flex items-center gap-1 justify-center text-amber-300 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>4.9</span>
              </div>
              <span className="text-[9px] text-emerald-200 block">18 Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-700/60 text-center text-xs">
            <div>
              <span className="text-emerald-200 text-[10px] block">Jobs Completed</span>
              <span className="font-bold text-white text-[11px]">18 Shifts</span>
            </div>
            <div>
              <span className="text-emerald-200 text-[10px] block">Days Worked</span>
              <span className="font-bold text-white text-[11px]">{totalDays} Days</span>
            </div>
            <div>
              <span className="text-emerald-200 text-[10px] block">Reliability</span>
              <span className="font-bold text-emerald-300 text-[11px]">96% Score</span>
            </div>
          </div>
        </div>

        {/* Completed Jobs History List */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-900">Recent Completed Jobs</span>
            <span className="text-[10px] text-slate-500">Verified by Farmers</span>
          </div>

          {completedJobs.map((item) => (
            <div key={item.id} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded uppercase">
                    {item.crop}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-500">{item.farmer} • {item.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-800">₹{item.totalEarned}</span>
                  <span className="text-[9px] text-slate-400 block">{item.daysWorked} days @ ₹{item.dailyRate}/d</span>
                </div>
              </div>

              {/* Review Quote */}
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating} / 5.0</span>
                  </div>
                  <span className="text-slate-400">{item.dates}</span>
                </div>
                <p className="text-[10px] text-slate-600 italic">"{item.feedback}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
