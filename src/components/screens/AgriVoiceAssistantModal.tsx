import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Send, Sparkles, Volume2, 
  RefreshCw, Bot, User, MessageSquareQuote, Trash2, ArrowRight, Radio, AlertCircle,
  Globe, Check, VolumeX
} from 'lucide-react';
import { LanguageCode, UserRole, UserSession } from '../../types';
import { AiAgriService } from '../../services/aiService';
import { GeminiLiveService, GeminiLiveStatus } from '../../services/geminiLiveService';
import { VoiceTranslationService, LANGUAGE_VOICE_MAP, LanguageVoiceMeta } from '../../services/voiceTranslationService';
import { LANGUAGES } from '../../data/translations';

interface AgriVoiceAssistantModalProps {
  selectedLanguage: LanguageCode;
  userRole?: UserRole;
  userLocation?: string;
  session?: UserSession | null;
  onLanguageChange?: (lang: LanguageCode) => void;
  onClose: () => void;
  onNavigateAction?: (action: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
  isVoiceRecommendation?: boolean;
}

export const AgriVoiceAssistantModal: React.FC<AgriVoiceAssistantModalProps> = ({
  selectedLanguage: initialLanguage,
  userRole = 'FARMER',
  userLocation = 'Thanjavur, Tamil Nadu',
  session,
  onLanguageChange,
  onClose,
  onNavigateAction
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(initialLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [voiceRecommendationNotice, setVoiceRecommendationNotice] = useState<LanguageVoiceMeta | null>(null);

  const [liveStatus, setLiveStatus] = useState<GeminiLiveStatus | null>(null);
  const [liveVoiceToast, setLiveVoiceToast] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync external language change if prop changes
  useEffect(() => {
    if (initialLanguage !== currentLanguage) {
      setCurrentLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  useEffect(() => {
    GeminiLiveService.checkLiveStatus().then(setLiveStatus).catch(() => {
      setLiveStatus({
        isConfigured: false,
        isAvailable: false,
        model: 'gemini-3.8-flash',
        message: 'Voice chat coming soon!'
      });
    });
  }, []);

  const handleStartLiveVoice = async () => {
    const status = await GeminiLiveService.checkLiveStatus();
    setLiveStatus(status);

    if (!status.isAvailable) {
      setLiveVoiceToast('Voice chat coming soon!');
      setTimeout(() => setLiveVoiceToast(null), 4000);
      return;
    }

    try {
      const res = await GeminiLiveService.startVoiceConversation();
      if (!res.success) {
        setLiveVoiceToast(res.message || 'Voice chat coming soon!');
        setTimeout(() => setLiveVoiceToast(null), 4000);
      } else {
        setIsListening(true);
      }
    } catch {
      setLiveVoiceToast('Voice chat coming soon!');
      setTimeout(() => setLiveVoiceToast(null), 4000);
    }
  };

  // Quick Action Shortcuts Bar
  const effectiveRole = session?.role || userRole;
  const actionShortcuts = effectiveRole === 'WORKER' ? [
    { label: '🔍 FIND JOBS', query: 'Find highest paying Paddy and Sugarcane jobs near Thiruvaiyaru', nav: 'NEARBY_JOBS' },
    { label: '💰 CHECK EARNINGS', query: 'What are my total earnings and upcoming shift payments?', nav: 'EARNINGS' },
    { label: '📝 MY APPLICATIONS', query: 'Check the status of my recent farm job applications', nav: 'MY_APPLICATIONS' },
    { label: '⭐ IMPROVE PROFILE', query: 'How can I increase my worker reliability score to 99%?', nav: 'WORKER_PROFILE' },
    { label: '🗺️ MAP VIEW', query: 'Show me all farm work available within 10 km on the map', nav: 'MAP' }
  ] : [
    { label: '➕ CREATE JOB', query: 'Help me post a Paddy harvesting job for 6 workers at ₹750/day', nav: 'POST_JOB' },
    { label: '🔍 FIND WORKERS', query: 'Find verified agricultural workers with sickle harvesting skills', nav: 'FIND_WORKERS' },
    { label: '💰 CALCULATE WAGE', query: 'Calculate fair market daily wage for 4 acres of Sugarcane harvest', nav: 'WAGE_CALCULATOR' },
    { label: '📋 CHECK APPLICATIONS', query: 'How many workers have applied to my active farm jobs?', nav: 'FARMER_JOBS' },
    { label: '🗺️ WORKERS MAP', query: 'Show available workers in Thanjavur district on the map', nav: 'MAP' }
  ];

  // Multilingual quick suggestions based on language & role
  const getQuickPrompts = () => {
    switch (currentLanguage) {
      case 'ta':
        return [
          'தஞ்சாவூர் நெல் அறுவடை கூலி என்ன?',
          'நாளைக்கு 5 வேலையாட்கள் தேவை',
          'அடுத்த 3 நாட்களுக்கு மழை வருமா?',
          'கரும்பு வெட்டுவதற்கு ஆட்கள் உள்ளார்களா?'
        ];
      case 'hi':
        return [
          'धान कटाई की आज की मजदूरी दर क्या है?',
          'कल के लिए 4 कुशल मजदूर चाहिए',
          'आगामी 3 दिनों का मौसम कैसा रहेगा?',
          'गन्ना कटाई के लिए रेट क्या चल रहा है?'
        ];
      case 'te':
        return [
          'వరి కోత కూలీ రేటు ఎంత?',
          'రేపటికి 4 మంది కూలీలు కావాలి',
          'వాతావరణ సమాచారం చెప్పండి'
        ];
      case 'kn':
        return [
          'ಭತ್ತದ ಕೊಯ್ಲು ದರ ಎಷ್ಟು?',
          'ನಾಳೆಗೆ 4 ಕೆಲಸಗಾರರು ಬೇಕು',
          'ಹವಾಮಾನ ವರದಿ ನೀಡಿ'
        ];
      case 'ml':
        return [
          'നെല്ല് കൊയ്ത്ത് കൂലി എത്രയാണ്?',
          'നാളെ 4 തൊഴിലാളികളെ വേണം',
          'കാലാവസ്ഥ വിവരം നൽകുക'
        ];
      case 'mr':
        return [
          'धान कापणीचा आजचा मजुरी दर काय आहे?',
          'उद्यासाठी ४ कुशल शेतमजूर हवे आहेत',
          'पुढील ३ दिवसांचा हवामान अंदाज काय?'
        ];
      case 'bn':
        return [
          'ধান কাটার আজকের মজুরি কত?',
          'আগামীকালের জন্য ৪ জন শ্রমিক প্রয়োজন',
          'আগামী ৩ দিনের আবহাওয়ার পূর্বাভাস কী?'
        ];
      default:
        return [
          'What is today\'s recommended Paddy harvest wage?',
          'I need 5 verified workers for tomorrow morning',
          'What is the 3-day weather forecast for harvest?',
          'How do I calculate labor cost for 4 acres?'
        ];
    }
  };

  // Initial welcome message
  const resetConversation = (lang = currentLanguage) => {
    const welcomeTexts: Record<LanguageCode, string> = {
      en: "Hello! I am your FarmConnect AI Agri Assistant. Ask me your questions about labor wages, weather forecasts, hiring workers, or crop planning.",
      ta: "வணக்கம்! நான் உங்கள் பார்ம்கனெக்ட் AI விவசாய உதவியாளர். கூலி விவரங்கள், வானிலை, வேலையாட்கள் அல்லது உங்கள் சொந்த கேள்விகளை தமிழில் கேட்கலாம்.",
      hi: "नमस्ते! मैं आपका फार्मकनेक्ट AI कृषि सहायक हूँ। मजदूरी दर, मौसम, मजदूरों की उपलब्धता या अपने किसी भी कृषि प्रश्न को पूछें।",
      te: "నమస్కారం! నేను మీ ఫార్మ్‌కనెక్ట్ AI వ్యవసాయ సహాయకుడిని. కూలీల రేట్లు లేదా మీ వ్యవసాయ ప్రశ్నల గురించి అడగండి.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಫಾರ್ಮ್‌ಕನೆಕ್ಟ್ AI ಕೃಷಿ ಸಹಾಯಕ. ಕೂಲಿ ದರ ಅಥವಾ ನಿಮ್ಮ ಸ್ವಂತ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.",
      ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഫാംകണക്ട് AI കാർഷിക സഹായിയാണ്. കൂലി നിരക്കുകളും നിങ്ങളുടെ സംശയങ്ങളും ചോദിക്കാം.",
      mr: "नमस्कार! मी तुमचा फार्मकनेक्ट AI कृषी सहाय्यक आहे. मजुरी दर किंवा आपले शेती प्रश्न मोकळेपणाने विचारा.",
      bn: "নমস্কার! আমি আপনার ফার্মকানেক্ট AI কৃষি সহায়ক। মজুরি বা আপনার যেকোনো কৃষি প্রশ্ন জিজ্ঞাসা করুন।"
    };

    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ASSISTANT',
        text: welcomeTexts[lang] || welcomeTexts.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  useEffect(() => {
    resetConversation(currentLanguage);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, interimTranscript]);

  // Handle changing language directly inside the AI Voice Assistant modal
  const handleSelectLanguage = (newLang: LanguageCode) => {
    setCurrentLanguage(newLang);
    setIsLangDropdownOpen(false);

    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    // Recommend the voice translating to the selected language
    const voiceMeta = VoiceTranslationService.recommendLanguageVoice(newLang, true);
    setVoiceRecommendationNotice(voiceMeta);

    // Add recommendation alert message into chat
    const recommendationMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ASSISTANT',
      text: `🔊 ${voiceMeta.announcementText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceRecommendation: true
    };
    setMessages(prev => [...prev, recommendationMessage]);

    // Clear recommendation badge after 8 seconds
    setTimeout(() => {
      setVoiceRecommendationNotice(null);
    }, 8000);
  };

  // Query AI Assistant with user's question (typed or spoken)
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setInterimTranscript('');
    setIsTyping(true);

    try {
      const result = await AiAgriService.queryAssistant(query, currentLanguage, effectiveRole, userLocation);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ASSISTANT',
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);

      // Automatically speak the answer if voice mode was active
      if (isListening) {
        VoiceTranslationService.speakTextInLanguage(result.response, currentLanguage);
      }
    } catch {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ASSISTANT',
        text: 'I have recorded your agricultural query and matched relevant farmers & verified workers in your district.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
      setIsListening(false);
    }
  };

  // Real Speech Recognition with selected language support
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your question.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      const meta = LANGUAGE_VOICE_MAP[currentLanguage] || LANGUAGE_VOICE_MAP.en;
      recognition.lang = meta.speechLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setSpeechError(null);
      setInterimTranscript('');

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInputText(final);
          setInterimTranscript('');
          recognition.stop();
          handleSendMessage(final);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access or type your question.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice input note: ${event.error}. You can also type your question.`);
        }
        setTimeout(() => setSpeechError(null), 4500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Could not start speech recognition:', err);
      setIsListening(false);
      setSpeechError('Could not access microphone. Please type your question.');
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  const handleSpeakText = (text: string) => {
    VoiceTranslationService.speakTextInLanguage(text, currentLanguage);
  };

  const currentLangMeta = LANGUAGE_VOICE_MAP[currentLanguage] || LANGUAGE_VOICE_MAP.en;

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs z-50 p-2 sm:p-3 flex flex-col justify-end animate-fadeIn">
      <div className="bg-white rounded-3xl h-[94%] flex flex-col shadow-2xl animate-slideUp overflow-hidden text-slate-900 border border-slate-200">
        
        {/* Header with Language Selector & Voice Status */}
        <div className="p-3 bg-emerald-850 text-white flex items-center justify-between shadow-xs relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs font-bold text-white">FarmConnect AI</h3>
                <span className="px-1.5 py-0.2 bg-emerald-600/90 text-emerald-100 text-[9px] font-bold rounded">
                  GEMINI 3.8
                </span>
              </div>
              <p className="text-[10px] text-emerald-200">Voice Assistant in {currentLangMeta.nativeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="px-2 py-1 bg-emerald-750 hover:bg-emerald-700 text-emerald-100 rounded-lg text-[11px] font-semibold flex items-center gap-1 border border-emerald-600 transition-colors"
                title="Change Voice Translation Language"
              >
                <Globe className="w-3 h-3 text-amber-300" />
                <span className="font-bold">{currentLangMeta.nativeName}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-1 z-50 max-h-64 overflow-y-auto">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Translate Voice To:
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full px-2.5 py-1.5 text-left text-xs rounded-lg flex items-center justify-between transition-colors ${
                        currentLanguage === lang.code 
                          ? 'bg-emerald-600 text-white font-bold' 
                          : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      {currentLanguage === lang.code && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => resetConversation()}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white bg-emerald-750 hover:bg-emerald-700 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white bg-emerald-750 hover:bg-emerald-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Voice Translation Recommendation Banner */}
        {voiceRecommendationNotice && (
          <div className="px-3 py-2 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between gap-2 shadow-xs border-b border-emerald-600 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs">
              <Volume2 className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
              <div>
                <span className="font-bold text-amber-200">Voice Translated: </span>
                <span className="text-[11px] text-emerald-100">{voiceRecommendationNotice.subRecommendation}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => VoiceTranslationService.speakAnnouncement(voiceRecommendationNotice)}
              className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 rounded text-[10px] font-bold text-white shrink-0"
            >
              Listen
            </button>
          </div>
        )}

        {/* Gemini Live Audio Toast or Bar */}
        {liveVoiceToast ? (
          <div className="mx-3 mt-2 p-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{liveVoiceToast}</span>
            </div>
            <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-bold">
              Gemini Live API
            </span>
          </div>
        ) : (
          <div className="px-3 py-1 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[10px] font-medium text-amber-900">
            <span>Live Audio Streaming:</span>
            <button
              onClick={handleStartLiveVoice}
              className="font-bold underline text-amber-950 hover:text-emerald-800"
            >
              Start Live Audio Stream
            </button>
          </div>
        )}

        {/* Quick Action Shortcuts Bar */}
        <div className="p-2 bg-emerald-50/70 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {actionShortcuts.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (onNavigateAction && action.nav) {
                  onClose();
                  onNavigateAction(action.nav);
                } else {
                  handleSendMessage(action.query);
                }
              }}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg text-[9px] font-bold shrink-0 shadow-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-emerald-850 text-white rounded-br-xs shadow-xs'
                    : msg.isVoiceRecommendation
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-bl-xs shadow-xs font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                }`}
              >
                <p>{msg.text}</p>

                {msg.sender === 'ASSISTANT' && (
                  <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="p-1 hover:text-emerald-800 text-slate-500 rounded flex items-center gap-1"
                      title="Read Aloud in Selected Language"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-semibold">{currentLangMeta.nativeName}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-2xl w-28 text-slate-500 text-xs shadow-xs">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[10px] ml-1 text-slate-400 font-medium">Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {getQuickPrompts().map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-full text-[10px] font-medium whitespace-nowrap transition-all border border-slate-200 shrink-0"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Voice & Input Footer */}
        <div className="p-2.5 bg-white border-t border-slate-200 space-y-2">
          {/* Active Listening / Speech-to-Text Banner */}
          {isListening && (
            <div className="p-2.5 bg-red-50 border border-red-300 rounded-xl flex items-center justify-between text-xs text-red-700 shadow-xs animate-pulse">
              <div className="flex items-center gap-2 font-bold truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
                <span className="truncate">
                  {interimTranscript ? `"${interimTranscript}"` : `Listening in ${currentLangMeta.nativeName}... Speak your question now`}
                </span>
              </div>
              <button 
                onClick={() => {
                  if (recognitionRef.current) recognitionRef.current.stop();
                  setIsListening(false);
                }}
                className="text-[10px] font-bold underline px-1 text-red-800 shrink-0"
              >
                Done
              </button>
            </div>
          )}

          {speechError && (
            <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{speechError}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartLiveVoice}
              className="p-2.5 rounded-xl border border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all flex items-center justify-center shrink-0"
              title="Gemini Live Conversation (Live Audio)"
            >
              <Radio className="w-4 h-4 text-amber-700 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                isListening 
                  ? 'bg-red-600 text-white border-red-600 shadow-md scale-105 animate-pulse' 
                  : 'bg-emerald-50 text-emerald-850 border-emerald-300 hover:bg-emerald-100'
              }`}
              title={`Voice Input in ${currentLangMeta.nativeName}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask any agricultural question in ${currentLangMeta.nativeName}...`}
              className="flex-1 h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-850 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
