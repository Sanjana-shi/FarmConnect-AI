import React, { useState, useEffect } from 'react';
import { Volume2, Mic, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { VoiceTranslationService, LanguageVoiceMeta } from '../services/voiceTranslationService';

interface VoiceLanguageRecommendationToastProps {
  onOpenVoiceAssistant?: () => void;
}

export const VoiceLanguageRecommendationToast: React.FC<VoiceLanguageRecommendationToastProps> = ({
  onOpenVoiceAssistant
}) => {
  const [activeMeta, setActiveMeta] = useState<LanguageVoiceMeta | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = VoiceTranslationService.subscribe((meta) => {
      setActiveMeta(meta);
      setIsVisible(true);

      // Auto dismiss after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!isVisible || !activeMeta) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[92vw] sm:w-[380px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/40 p-3.5 animate-slideUp backdrop-blur-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center text-amber-300 shrink-0">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-300">
                Language Selected: {activeMeta.name}
              </span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-[10px] font-bold rounded">
                {activeMeta.nativeName}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Audio description & voice translation in {activeMeta.name}</p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5 p-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-medium">
        <p className="line-clamp-2">{activeMeta.announcementText}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => VoiceTranslationService.speakAnnouncement(activeMeta)}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          title="Replay spoken announcement"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Listen Voice</span>
        </button>

        {onOpenVoiceAssistant && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              onOpenVoiceAssistant();
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            title="Open AI Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>Speak in {activeMeta.nativeName}</span>
          </button>
        )}
      </div>
    </div>
  );
};
