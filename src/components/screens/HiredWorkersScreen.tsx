import React, { useState } from 'react';
import { 
  ArrowLeft, Users, Calendar, Phone, CheckCircle2, 
  IndianRupee, Star, ShieldCheck, Clock, RefreshCw, Sparkles 
} from 'lucide-react';
import { HiredWorkerRecord, LanguageCode } from '../../types';
import { FullWagePaymentModal } from '../FullWagePaymentModal';

interface HiredWorkersScreenProps {
  hiredWorkers: HiredWorkerRecord[];
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onMarkAttendance: (hiredId: string, status: 'PRESENT' | 'ABSENT' | 'HALF_DAY') => void;
  onRecordPayment: (hiredId: string, amount: number, mode: 'UPI' | 'CASH') => void;
  onRateWorker: (hiredId: string, rating: number, comment: string) => void;
}

export const HiredWorkersScreen: React.FC<HiredWorkersScreenProps> = ({
  hiredWorkers,
  selectedLanguage,
  onBack,
  onMarkAttendance,
  onRecordPayment,
  onRateWorker
}) => {
  const [selectedHired, setSelectedHired] = useState<HiredWorkerRecord | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(750);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH'>('UPI');
  const [starRating, setStarRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('Punctual and very fast work!');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleOpenPayment = (hired: HiredWorkerRecord) => {
    setSelectedHired(hired);
    const balance = Math.max(0, hired.totalEarnings - hired.paidAmount);
    setPaymentAmount(balance || hired.dailyWage);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (selectedHired && paymentAmount > 0) {
      onRecordPayment(selectedHired.id, paymentAmount, paymentMode);
      setPaymentModalOpen(false);
      setSuccessToast(`₹${paymentAmount} payment marked as completed via ${paymentMode}!`);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const handleOpenRating = (hired: HiredWorkerRecord) => {
    setSelectedHired(hired);
    setStarRating(5);
    setReviewComment('Excellent work in paddy harvest. Punctual and hardworking.');
    setRatingModalOpen(true);
  };

  const handleConfirmRating = () => {
    if (selectedHired) {
      onRateWorker(selectedHired.id, starRating, reviewComment);
      setRatingModalOpen(false);
      setSuccessToast(`Rating of ${starRating} ⭐ submitted for ${selectedHired.workerName}!`);
      setTimeout(() => setSuccessToast(null), 3500);
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
              <h2 className="text-sm font-bold text-slate-900">Hired Workers & Attendance</h2>
              <span className="text-[10px] text-emerald-700 font-semibold">{hiredWorkers.length} Active Farm Laborers</span>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-2 bg-emerald-800 text-white text-[11px] font-bold rounded-xl text-center shadow-xs animate-fadeIn flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Workers List */}
        <div className="space-y-2.5">
          {hiredWorkers.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
              <span className="text-3xl">🤝</span>
              <h4 className="text-xs font-bold text-slate-800">No hired workers currently active</h4>
              <p className="text-[11px] text-slate-500">
                Accept applicants from "My Jobs" or invite workers from "Find Workers".
              </p>
            </div>
          ) : (
            hiredWorkers.map((hired) => {
              const todayAtt = hired.attendance.find(a => a.date === todayStr);
              const balanceDue = Math.max(0, hired.totalEarnings - hired.paidAmount);

              return (
                <div 
                  key={hired.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded uppercase">
                        {hired.jobTitle}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{hired.workerName}</h3>
                      <p className="text-[10px] text-slate-500">{hired.workerLocation} • {hired.workerPhone}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-800">₹{hired.dailyWage}</span>
                      <span className="text-[9px] text-slate-400 block">/ day agreement</span>
                    </div>
                  </div>

                  {/* Attendance Controls */}
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-700">Today's Attendance ({todayStr}):</span>
                      <span className="font-semibold text-emerald-800">
                        {todayAtt ? todayAtt.status : 'Not marked yet'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => onMarkAttendance(hired.id, 'PRESENT')}
                        className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                          todayAtt?.status === 'PRESENT'
                            ? 'bg-emerald-800 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ✓ Present (Full)
                      </button>

                      <button
                        onClick={() => onMarkAttendance(hired.id, 'HALF_DAY')}
                        className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                          todayAtt?.status === 'HALF_DAY'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ½ Half Day
                      </button>

                      <button
                        onClick={() => onMarkAttendance(hired.id, 'ABSENT')}
                        className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                          todayAtt?.status === 'ABSENT'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ✕ Absent
                      </button>
                    </div>
                  </div>

                  {/* Earnings & Payment Status */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Days</span>
                      <span className="font-bold text-slate-800 text-[11px]">{hired.totalDaysPresent} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Earned</span>
                      <span className="font-bold text-slate-800 text-[11px]">₹{hired.totalEarnings}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Balance Due</span>
                      <span className={`font-bold text-[11px] ${balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        ₹{balanceDue}
                      </span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <a
                      href={`tel:${hired.workerPhone}`}
                      className="text-[11px] text-slate-600 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
                      title={`Call ${hired.workerName}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Worker</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenRating(hired)}
                        className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-bold rounded-lg text-[10px]"
                      >
                        ⭐ Rate
                      </button>

                      <button
                        onClick={() => handleOpenPayment(hired)}
                        className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-[10px] shadow-xs active:scale-95 transition-all"
                      >
                        Pay Wage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Full Process Payment Modal */}
      {paymentModalOpen && selectedHired && (
        <FullWagePaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          hiredRecord={selectedHired}
          selectedLanguage={selectedLanguage}
          onPaymentSuccess={(hiredId, amount, mode, utr) => {
            onRecordPayment(hiredId, amount, mode as 'UPI' | 'CASH');
            setPaymentModalOpen(false);
          }}
        />
      )}

      {/* Rate & Review Modal */}
      {ratingModalOpen && selectedHired && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-3xl p-4 space-y-3 shadow-2xl animate-slideUp text-slate-900">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Rate Worker Performance</h3>
              <button onClick={() => setRatingModalOpen(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div className="text-center py-2">
              <div className="text-xs font-bold text-slate-900 mb-1.5">{selectedHired.workerName}</div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setStarRating(star)}
                    className="p-1 hover:scale-110 transition-all text-xl"
                  >
                    <Star className={`w-6 h-6 ${star <= starRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">Feedback / Notes:</label>
              <textarea
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={handleConfirmRating}
              className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Submit Star Rating & Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
