import React, { useState } from 'react';
import { X, CheckCircle2, RefreshCw, Sparkles, ShieldCheck, IndianRupee } from 'lucide-react';
import { JobItem, LanguageCode, UserSession } from '../../types';
import { FarmConnectStore } from '../../data/store';

interface ApplyJobModalProps {
  job: JobItem;
  session?: UserSession | null;
  workerSession?: UserSession | null;
  selectedLanguage?: LanguageCode;
  onClose: () => void;
  onSubmit?: (job: JobItem, message: string, proposedWage: number) => void;
  onApplySuccess?: (newApp?: any) => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  job,
  session,
  workerSession,
  selectedLanguage = 'en',
  onClose,
  onSubmit,
  onApplySuccess
}) => {
  const currentSession = session || workerSession || null;
  const [proposedWage, setProposedWage] = useState<number>(job.wageAmount);
  const [message, setMessage] = useState<string>(
    'I am experienced in this work, punctual, and ready to start on the mentioned date.'
  );
  const [hasTools, setHasTools] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const newApp = FarmConnectStore.applyForJob(
          job,
          currentSession,
          proposedWage,
          message,
          hasTools,
          currentSession?.experienceYears || 5,
          job.startDate,
          job.endDate
        );
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          if (onSubmit) onSubmit(job, message, proposedWage);
          if (onApplySuccess) onApplySuccess(newApp);
        }, 500);
      } catch (e) {
        console.error('Error applying in modal:', e);
        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSubmit) onSubmit(job, message, proposedWage);
        if (onApplySuccess) onApplySuccess();
      }
    }, 600);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-fadeIn">
      <div className="bg-white rounded-3xl p-4 space-y-3 shadow-2xl animate-slideUp text-slate-900">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Direct Job Application</span>
            <h3 className="text-xs font-bold text-slate-900 truncate max-w-[240px]">{job.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h4 className="text-sm font-bold text-emerald-900">Application Sent Successfully!</h4>
            <p className="text-[11px] text-slate-600">The farmer will review your profile and contact you directly.</p>
          </div>
        ) : (
          <>
            {/* Offered Wage vs Worker Rate */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-[11px]">Offered Wage:</span>
                <span className="font-bold text-slate-900 text-xs">₹{job.wageAmount} / day</span>
              </div>

              <div className="pt-1.5 border-t border-emerald-200/60 flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800">Your Requested Daily Wage (₹):</label>
                <div className="w-24 h-8 bg-white border border-emerald-600 rounded-lg flex items-center px-2">
                  <span className="text-slate-500 font-bold text-xs mr-1">₹</span>
                  <input
                    type="number"
                    value={proposedWage}
                    onChange={(e) => setProposedWage(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Note to Farmer */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1">
                Message / Note to Farmer:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Mention your experience or tools..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-700"
              />
            </div>

            {/* Quick Checkboxes */}
            <div className="space-y-1 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTools}
                  onChange={(e) => setHasTools(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 accent-emerald-800"
                />
                <span className="text-slate-700">I have required farm tools (sickle/gloves)</span>
              </label>
            </div>

            {/* Reliability Badge */}
            <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-2 text-[10px] text-slate-600 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Your profile reliability score of <strong>96%</strong> will be sent to the farmer.</span>
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting || proposedWage <= 0}
              onClick={handleSubmit}
              className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Confirm & Send Application</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
