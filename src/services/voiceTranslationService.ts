import { LanguageCode } from '../types';

export interface LanguageVoiceMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechLang: string;
  announcementText: string;
  subRecommendation: string;
  spokenEnglishDescription: string;
  spokenNativeDescription: string;
}

export const LANGUAGE_VOICE_MAP: Record<LanguageCode, LanguageVoiceMeta> = {
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechLang: 'ta-IN',
    announcementText: 'Language selected: Tamil. தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டுள்ளது. உங்கள் விவசாய மற்றும் கூலி கேள்விகளை குரல் மூலம் கேட்கலாம்.',
    subRecommendation: 'தமிழ் குரல் மொழிபெயர்ப்பு இயக்கப்பட்டது. மைக்கை அழுத்தி பேசலாம்.',
    spokenEnglishDescription: 'Language selected: Tamil. You have selected Tamil. Voice assistant and audio description are now active in Tamil.',
    spokenNativeDescription: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டுள்ளது. உங்கள் விவசாய கேள்விகளை குரல் மூலம் கேட்கலாம்.'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechLang: 'hi-IN',
    announcementText: 'Language selected: Hindi. भाषा बदलकर हिन्दी कर दी गई है। अब आप बोलकर अपने कृषि प्रश्न पूछ सकते हैं।',
    subRecommendation: 'हिन्दी आवाज़ अनुवाद सक्षम है। माइक दबाकर बोलें।',
    spokenEnglishDescription: 'Language selected: Hindi. You have selected Hindi. Voice assistant and audio description are now active in Hindi.',
    spokenNativeDescription: 'हिन्दी भाषा का चयन किया गया है। अब आप बोलकर अपने कृषि प्रश्न पूछ सकते हैं।'
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechLang: 'te-IN',
    announcementText: 'Language selected: Telugu. భాష తెలుగులోకి మార్చబడింది. మీ వ్యవసాయ ప్రశ్నలను వాయిస్ ద్వారా అడగవచ్చు.',
    subRecommendation: 'తెలుగు వాయిస్ అనువాదం సిద్ధంగా ఉంది. మైక్ నొక్కి మాట్లాడండి.',
    spokenEnglishDescription: 'Language selected: Telugu. You have selected Telugu. Voice assistant and audio description are now active in Telugu.',
    spokenNativeDescription: 'తెలుగు భాష ఎంపిక చేయబడింది. మీ వ్యవసాయ ప్రశ్నలను వాయిస్ ద్వారా అడగవచ్చు.'
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechLang: 'kn-IN',
    announcementText: 'Language selected: Kannada. ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಧ್ವನಿಯ ಮೂಲಕ ಕೇಳಬಹುದು.',
    subRecommendation: 'ಕನ್ನಡ ಧ್ವನಿ ಅನುವಾದ ಸಕ್ರಿಯವಾಗಿದೆ. ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ.',
    spokenEnglishDescription: 'Language selected: Kannada. You have selected Kannada. Voice assistant and audio description are now active in Kannada.',
    spokenNativeDescription: 'ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಧ್ವನಿಯ ಮೂಲಕ ಕೇಳಬಹುದು.'
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speechLang: 'ml-IN',
    announcementText: 'Language selected: Malayalam. ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി. നിങ്ങളുടെ കാർഷിക സംശയങ്ങൾ ശബ്ദത്തിലൂടെ ചോദിക്കാം.',
    subRecommendation: 'മലയാളം വോയ്സ് പരിഭാഷ സജീവമാണ്. മൈക്ക് അമർത്തി സംസാരിക്കുക.',
    spokenEnglishDescription: 'Language selected: Malayalam. You have selected Malayalam. Voice assistant and audio description are now active in Malayalam.',
    spokenNativeDescription: 'മലയാളം ഭാഷ തിരഞ്ഞെടുത്തിരിക്കുന്നു. നിങ്ങളുടെ കാർഷിക സംശയങ്ങൾ ശബ്ദത്തിലൂടെ ചോദിക്കാം.'
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    speechLang: 'mr-IN',
    announcementText: 'Language selected: Marathi. भाषा मराठीत बदलली आहे. आपण आवाजाद्वारे आपले शेती प्रश्न विचारू शकता.',
    subRecommendation: 'मराठी आवाज भाषांतर सक्रिय आहे. माइक दाबून बोला.',
    spokenEnglishDescription: 'Language selected: Marathi. You have selected Marathi. Voice assistant and audio description are now active in Marathi.',
    spokenNativeDescription: 'मराठी भाषा निवडली आहे. आपण आवाजाद्वारे आपले शेती प्रश्न विचारू शकता.'
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechLang: 'bn-IN',
    announcementText: 'Language selected: Bengali. ভাষা পরিবর্তন করে বাংলায় করা হয়েছে। আপনি ভয়েসের মাধ্যমে কৃষি প্রশ্ন জিজ্ঞাসা করতে পারেন।',
    subRecommendation: 'বাংলা ভয়েস অনুবাদ প্রস্তুত। মাইক চেপে বলুন।',
    spokenEnglishDescription: 'Language selected: Bengali. You have selected Bengali. Voice assistant and audio description are now active in Bengali.',
    spokenNativeDescription: 'বাংলা ভাষা নির্বাচন করা হয়েছে। আপনি ভয়েসের মাধ্যমে কৃষি প্রশ্ন জিজ্ঞাসা করতে পারেন।'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechLang: 'en-IN',
    announcementText: 'Language selected: English. You have selected English. Voice assistant and audio description are now active.',
    subRecommendation: 'Voice translation enabled. Tap the microphone to speak your question.',
    spokenEnglishDescription: 'Language selected: English. Voice assistant and audio description are now active in English.',
    spokenNativeDescription: 'Language selected: English. You can speak or ask any agricultural questions.'
  }
};

type VoiceListener = (meta: LanguageVoiceMeta) => void;

class VoiceTranslationManager {
  private listeners: Set<VoiceListener> = new Set();
  private audioCtx: AudioContext | null = null;
  private isVoiceMuted = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      } catch (e) {
        console.warn('AudioContext not available for chime', e);
      }
    }
  }

  // Soft pleasant acoustic notification chime before speaking
  public playChime() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  }

  public subscribe(listener: VoiceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setMute(muted: boolean) {
    this.isVoiceMuted = muted;
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isMuted(): boolean {
    return this.isVoiceMuted;
  }

  public recommendLanguageVoice(lang: LanguageCode, autoSpeak = true): LanguageVoiceMeta {
    const meta = LANGUAGE_VOICE_MAP[lang] || LANGUAGE_VOICE_MAP.en;

    // Notify UI listeners (to show recommendation banner/toast)
    this.listeners.forEach((listener) => {
      try {
        listener(meta);
      } catch (e) {
        console.error('Error notifying voice recommendation listener:', e);
      }
    });

    if (autoSpeak && !this.isVoiceMuted) {
      this.speakAnnouncement(meta);
    }

    return meta;
  }

  // Spoken announcement that explicitly says the selected language clearly
  public speakAnnouncement(meta: LanguageVoiceMeta) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || this.isVoiceMuted) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      this.playChime();

      setTimeout(() => {
        const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
        
        // Check for matching regional voice (e.g., ta-IN, hi-IN, etc.)
        const matchedNativeVoice = voices.find(
          (v) => v.lang.toLowerCase().replace('_', '-') === meta.speechLang.toLowerCase() ||
                 v.lang.toLowerCase().startsWith(meta.code.toLowerCase())
        );

        // Standard English/System voice for universal pronunciation
        const universalVoice = voices.find(
          (v) => v.lang.toLowerCase().includes('en-in') || 
                 v.lang.toLowerCase().includes('en-gb') || 
                 v.lang.toLowerCase().includes('en-us') ||
                 v.default
        ) || (voices.length > 0 ? voices[0] : null);

        // 1. Primary utterance: ALWAYS explicitly states the selected language in English
        // so every user and device audibly hears: "Language selected: [Language Name]"
        const languageIntroUtterance = new SpeechSynthesisUtterance(`Language selected: ${meta.name}.`);
        languageIntroUtterance.rate = 0.95;
        languageIntroUtterance.pitch = 1.05;
        languageIntroUtterance.lang = 'en-US';
        if (universalVoice) {
          languageIntroUtterance.voice = universalVoice;
        }

        // 2. Secondary description utterance:
        // If native voice is available, speaks the regional description with that native voice.
        // If native voice is not installed on this browser, speaks the clear English description so it never fails.
        const descriptionText = matchedNativeVoice 
          ? meta.spokenNativeDescription 
          : meta.spokenEnglishDescription;

        const descriptionUtterance = new SpeechSynthesisUtterance(descriptionText);
        descriptionUtterance.rate = 0.92;
        descriptionUtterance.pitch = 1.0;

        if (matchedNativeVoice) {
          descriptionUtterance.lang = meta.speechLang;
          descriptionUtterance.voice = matchedNativeVoice;
        } else {
          descriptionUtterance.lang = 'en-US';
          if (universalVoice) {
            descriptionUtterance.voice = universalVoice;
          }
        }

        // Speak the language statement first, followed by the description
        window.speechSynthesis.speak(languageIntroUtterance);

        // Queue description for comprehensive audio guidance
        if (meta.code !== 'en' || matchedNativeVoice) {
          window.speechSynthesis.speak(descriptionUtterance);
        }
      }, 160);
    } catch (err) {
      console.warn('Speech synthesis recommendation error:', err);
    }
  }

  public speakTextInLanguage(text: string, lang: LanguageCode) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || this.isVoiceMuted) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const meta = LANGUAGE_VOICE_MAP[lang] || LANGUAGE_VOICE_MAP.en;
      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();

      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase().replace('_', '-') === meta.speechLang.toLowerCase() ||
               v.lang.toLowerCase().startsWith(meta.code.toLowerCase())
      );

      const universalVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('en-in') || 
               v.lang.toLowerCase().includes('en-gb') || 
               v.lang.toLowerCase().includes('en-us') ||
               v.default
      ) || (voices.length > 0 ? voices[0] : null);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = meta.speechLang;
      } else {
        // Fallback to universal voice
        if (universalVoice) {
          utterance.voice = universalVoice;
        }
        utterance.lang = 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak error:', err);
    }
  }
}

export const VoiceTranslationService = new VoiceTranslationManager();
