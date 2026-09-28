import React, { useState } from 'react';
import { X, Send, MessageSquare, Star, CheckCircle2, HeartHandshake } from 'lucide-react';
import { UserSession } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  session?: UserSession | null;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  session,
  onClose
}) => {
  const [category, setCategory] = useState<string>('GENERAL');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState<string>(session?.fullName || '');
  const [contact, setContact] = useState<string>(session?.phone || session?.email || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    const feedbackPayload = {
      category,
      rating,
      message: message.trim(),
      name: name.trim() || 'Anonymous Farmer / Worker',
      contact: contact.trim() || 'Not provided',
      userRole: session?.role || 'FARMER',
      submittedAt: new Date().toISOString()
    };

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      }).catch(() => {});

      // Also persist locally in case backend is offline
      const stored = localStorage.getItem('farmconnect_user_feedbacks_v1') || '[]';
      try {
        const list = JSON.parse(stored);
        list.push(feedbackPayload);
        localStorage.setItem('farmconnect_user_feedbacks_v1', JSON.stringify(list));
      } catch {
        // ignore
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        onClose();
      }, 2000);
    } catch {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Send Feedback</h3>
              <p className="text-[11px] text-emerald-200">Share your thoughts with the FarmConnect AI team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Thank You!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Your feedback has been sent to the FarmConnect AI team. We review every note to improve our agricultural platform for Indian farmers and laborers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Feedback Category</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'GENERAL', label: '💬 General Feedback' },
                  { id: 'BUG', label: '🐛 Report Bug / Issue' },
                  { id: 'FEATURE', label: '💡 Feature Idea' },
                  { id: 'WAGE_DATA', label: '🌾 Crop & Wage Rates' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`py-2 px-2.5 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                      category === item.id
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-xl transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Comments or Suggestions <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What can we improve? Tell us about your farm work or hiring experience..."
                rows={4}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:bg-white resize-none"
              />
            </div>

            {/* Name & Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone or Email</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Optional"
                  className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
