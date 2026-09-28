import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, IndianRupee, ArrowRight, 
  Smartphone, Building2, Banknote, QrCode, Lock, 
  Receipt, Download, AlertCircle, RefreshCw, Send, Check
} from 'lucide-react';
import { HiredWorkerRecord, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FullWagePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiredWorker: HiredWorkerRecord | null;
  selectedLanguage: LanguageCode;
  onPaymentSuccess: (hiredId: string, amount: number, mode: 'UPI' | 'CASH' | 'BANK_TRANSFER', utr: string) => void;
}

type PaymentStep = 'AMOUNT_AND_MODE' | 'PIN_AUTH' | 'PROCESSING' | 'RECEIPT';

export const FullWagePaymentModal: React.FC<FullWagePaymentModalProps> = ({
  isOpen,
  onClose,
  hiredWorker,
  selectedLanguage,
  onPaymentSuccess
}) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  if (!isOpen || !hiredWorker) return null;

  const outstandingBalance = Math.max(0, hiredWorker.totalEarnings - hiredWorker.paidAmount);
  const defaultPayAmount = outstandingBalance > 0 ? outstandingBalance : hiredWorker.dailyWage;

  const [step, setStep] = useState<PaymentStep>('AMOUNT_AND_MODE');
  const [payAmount, setPayAmount] = useState<number>(defaultPayAmount);
  const [customAmountInput, setCustomAmountInput] = useState<string>(String(defaultPayAmount));
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'BANK_TRANSFER' | 'CASH'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM'>('PHONEPE');
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [cashOtp, setCashOtp] = useState<string>('4819');
  const [cashOtpEntered, setCashOtpEntered] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');

  const workerUpi = hiredWorker.upiId || `${hiredWorker.workerName.toLowerCase().replace(/\s+/g, '')}@oksbi`;
  const workerBank = hiredWorker.bankName || 'Canara Bank (Thiruvaiyaru Branch)';
  const workerAccountMasked = `•••• •••• ${hiredWorker.bankAccountLast4 || '4192'}`;

  const handleSetAmountOption = (type: 'FULL' | 'ONE_DAY' | 'BONUS') => {
    if (type === 'FULL') {
      const amt = outstandingBalance > 0 ? outstandingBalance : hiredWorker.dailyWage;
      setPayAmount(amt);
      setCustomAmountInput(String(amt));
    } else if (type === 'ONE_DAY') {
      setPayAmount(hiredWorker.dailyWage);
      setCustomAmountInput(String(hiredWorker.dailyWage));
    } else if (type === 'BONUS') {
      const base = outstandingBalance > 0 ? outstandingBalance : hiredWorker.dailyWage;
      const amt = base + 100;
      setPayAmount(amt);
      setCustomAmountInput(String(amt));
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountInput(val);
    const num = Number(val);
    if (num > 0) {
      setPayAmount(num);
    }
  };

  const handleProceedToAuth = () => {
    if (payAmount <= 0) return;
    setPin('');
    setPinError('');
    setCashOtpEntered('');
    setStep('PIN_AUTH');
  };

  const handleConfirmAuth = () => {
    if (paymentMode === 'CASH') {
      if (cashOtpEntered.trim() !== cashOtp) {
        setPinError('Invalid worker verification code. Ask the worker for the 4-digit code.');
        return;
      }
    } else {
      if (pin.length < 4) {
        setPinError('Please enter your 4-digit agricultural transaction PIN');
        return;
      }
    }

    setStep('PROCESSING');
    const generatedUtr = `${paymentMode === 'UPI' ? 'UPI' : paymentMode === 'BANK_TRANSFER' ? 'IMPS' : 'CSH'}/${new Date().getFullYear()}/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    setTimeout(() => {
      setUtrNumber(generatedUtr);
      setTimestamp(nowStr);
      setStep('RECEIPT');
      onPaymentSuccess(hiredWorker.id, payAmount, paymentMode, generatedUtr);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-700/50 border-2 border-emerald-300/40 shrink-0">
                <img 
                  src={hiredWorker.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'} 
                  alt={hiredWorker.workerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white">{hiredWorker.workerName}</h3>
                  <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold rounded">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-200">{hiredWorker.jobTitle}</p>
                <p className="text-[11px] text-emerald-300/90">{hiredWorker.workerLocation} • {hiredWorker.workerPhone}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper tracker */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-emerald-700/60 text-[11px]">
            <div className={`flex items-center gap-1.5 ${step === 'AMOUNT_AND_MODE' ? 'text-white font-bold' : 'text-emerald-300'}`}>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Amount & Mode</span>
            </div>
            <span className="text-emerald-500">→</span>
            <div className={`flex items-center gap-1.5 ${step === 'PIN_AUTH' || step === 'PROCESSING' ? 'text-white font-bold' : 'text-emerald-300'}`}>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Authorization</span>
            </div>
            <span className="text-emerald-500">→</span>
            <div className={`flex items-center gap-1.5 ${step === 'RECEIPT' ? 'text-white font-bold' : 'text-emerald-300'}`}>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
              <span>Official Receipt</span>
            </div>
          </div>
        </div>

        {/* STEP 1: AMOUNT AND MODE */}
        {step === 'AMOUNT_AND_MODE' && (
          <div className="p-5 space-y-5">
            {/* Wage Summary Ledger */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Gross Earned</span>
                <span className="text-sm font-bold text-slate-800">₹{hiredWorker.totalEarnings.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">{hiredWorker.totalDaysPresent} shifts</span>
              </div>
              <div className="border-x border-slate-200 px-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Paid So Far</span>
                <span className="text-sm font-bold text-emerald-700">₹{hiredWorker.paidAmount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">Cleared</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Balance Due</span>
                <span className={`text-sm font-black ${outstandingBalance > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                  ₹{outstandingBalance.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">{outstandingBalance > 0 ? 'Pending' : 'Settled'}</span>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Disbursal Amount (₹)
              </label>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSetAmountOption('FULL')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    payAmount === (outstandingBalance > 0 ? outstandingBalance : hiredWorker.dailyWage)
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {outstandingBalance > 0 ? `Full Balance (₹${outstandingBalance})` : `1 Shift (₹${hiredWorker.dailyWage})`}
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAmountOption('ONE_DAY')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    payAmount === hiredWorker.dailyWage
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Daily Wage (₹{hiredWorker.dailyWage})
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAmountOption('BONUS')}
                  className="py-2 px-3 rounded-lg text-xs font-bold border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all"
                >
                  + ₹100 Bonus
                </button>
              </div>

              {/* Custom Input */}
              <div className="relative mt-2">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                <input
                  type="text"
                  value={customAmountInput}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter custom payment amount"
                />
              </div>
            </div>

            {/* Payment Channel Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Choose Payment Channel
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMode === 'UPI'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className={`w-5 h-5 ${paymentMode === 'UPI' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <div className="mt-2">
                    <span className="text-xs font-bold block">UPI Direct</span>
                    <span className="text-[10px] text-slate-500 block">Instant 0% Fee</span>
                  </div>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('BANK_TRANSFER')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMode === 'BANK_TRANSFER'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className={`w-5 h-5 ${paymentMode === 'BANK_TRANSFER' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <div className="mt-2">
                    <span className="text-xs font-bold block">Bank IMPS</span>
                    <span className="text-[10px] text-slate-500 block">DBT Jan Dhan</span>
                  </div>
                </button>

                {/* Cash on Field */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('CASH')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMode === 'CASH'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className={`w-5 h-5 ${paymentMode === 'CASH' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <div className="mt-2">
                    <span className="text-xs font-bold block">Field Cash</span>
                    <span className="text-[10px] text-slate-500 block">With OTP Voucher</span>
                  </div>
                </button>
              </div>

              {/* Mode Details Display */}
              {paymentMode === 'UPI' && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Beneficiary UPI ID:</span>
                    <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {workerUpi}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {(['PHONEPE', 'GPAY', 'PAYTM', 'BHIM'] as const).map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-lg border text-center transition-all ${
                          upiApp === app 
                            ? 'bg-emerald-700 text-white border-emerald-800' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {app === 'PHONEPE' ? 'PhonePe' : app === 'GPAY' ? 'GPay' : app === 'PAYTM' ? 'Paytm' : 'BHIM'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMode === 'BANK_TRANSFER' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-bold text-slate-800">{workerBank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-mono font-bold text-slate-800">{workerAccountMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono text-slate-700">CNRB0001048 (Verified)</span>
                  </div>
                </div>
              )}

              {paymentMode === 'CASH' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Receipt className="w-4 h-4 text-amber-700" />
                    <span>In-Field Cash Handover Procedure</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    You will hand over ₹{payAmount.toLocaleString()} in cash directly to {hiredWorker.workerName}. Worker will share 4-digit code <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-300">4819</span> to digitally seal the contract passbook.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={payAmount <= 0}
                onClick={handleProceedToAuth}
                className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>Proceed to Pay ₹{payAmount.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PIN / AUTHORIZATION */}
        {step === 'PIN_AUTH' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {paymentMode === 'CASH' ? 'Worker Confirmation Code' : 'Enter 4-Digit Security PIN'}
              </h4>
              <p className="text-xs text-slate-500">
                {paymentMode === 'CASH' 
                  ? `Ask ${hiredWorker.workerName} for their verification code to confirm cash handover`
                  : `Authorizing ₹${payAmount.toLocaleString()} via ${paymentMode === 'UPI' ? upiApp : 'Cauvery Grameena IMPS'}`}
              </p>
            </div>

            {paymentMode === 'CASH' ? (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={4}
                    value={cashOtpEntered}
                    onChange={(e) => {
                      setCashOtpEntered(e.target.value);
                      setPinError('');
                    }}
                    placeholder="e.g. 4819"
                    className="w-40 text-center tracking-widest text-2xl font-mono font-bold py-2 border-2 border-emerald-600 rounded-xl focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-center text-slate-400">
                  Hint for demo: Enter worker code <span className="font-bold text-slate-600">4819</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold font-mono transition-all ${
                        pin.length > index 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900' 
                          : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {pin.length > index ? '•' : ''}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/[^0-9]/g, ''));
                      setPinError('');
                    }}
                    placeholder="Type PIN (e.g. 1234)"
                    className="text-center font-mono py-1.5 px-3 border border-slate-300 rounded-lg text-xs w-48 text-slate-700"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-center text-slate-400">
                  Secure 256-bit encrypted NPCI / RBI agricultural wage transfer
                </p>
              </div>
            )}

            {pinError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('AMOUNT_AND_MODE')}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmAuth}
                className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize Disbursal</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING SPINNER */}
        {step === 'PROCESSING' && (
          <div className="p-10 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <RefreshCw className="w-12 h-12 text-emerald-700 animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Processing Agricultural Disbursal...</h4>
              <p className="text-xs text-slate-500 mt-1">
                Handshaking with Cauvery Grameena Bank & NPCI Settlement Switch
              </p>
              <p className="text-[11px] text-emerald-700 font-bold mt-2 font-mono">
                Disbursing ₹{payAmount.toLocaleString()} to {hiredWorker.workerName}
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: OFFICIAL RECEIPT */}
        {step === 'RECEIPT' && (
          <div className="p-6 space-y-5 animate-fadeIn">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 border-2 border-emerald-300">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full uppercase tracking-wider">
                Payment Settled & Cleared
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">
                ₹{payAmount.toLocaleString()} Successfully Paid
              </h4>
              <p className="text-xs text-slate-500">
                Official wage voucher generated & ledger updated
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-800">{hiredWorker.workerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Crop / Contract:</span>
                <span className="font-semibold text-slate-800">{hiredWorker.jobTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold text-emerald-800">{paymentMode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Transaction Reference (UTR):</span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">{utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-700">{timestamp}</span>
              </div>
            </div>

            {/* SMS Alert banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
              <Send className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>
                Confirmation SMS & digital voucher dispatched to <b>{hiredWorker.workerPhone}</b>.
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done & Close</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
