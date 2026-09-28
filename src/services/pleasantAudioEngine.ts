// Pleasant Agricultural Soundscape Engine using Web Audio API and Speech Synthesis
// Zero external file dependencies - 100% reliable, harmonious, and offline-ready.

import { LanguageCode } from '../types';
import { LANGUAGE_VOICE_MAP } from './voiceTranslationService';

export class PleasantAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private natureGain: GainNode | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.65;

  private voiceEnabled: boolean = true;
  private natureEnabled: boolean = true;
  private musicEnabled: boolean = true;

  // Interval timers
  private chordIntervalId: number | null = null;
  private birdIntervalId: number | null = null;
  private windNode: AudioNode | null = null;

  // Pentatonic notes (frequencies in Hz) inspired by Indian morning ragas (Bhupali / Mohanam)
  // D major pentatonic: D, E, F#, A, B
  private chordProgressions: number[][] = [
    [146.83, 220.00, 293.66, 369.99, 440.00], // D3, A3, D4, F#4, A4
    [196.00, 246.94, 293.66, 392.00, 493.88], // G3, B3, D4, G4, B4
    [164.81, 246.94, 329.63, 369.99, 493.88], // E3, B3, E4, F#4, B4
    [220.00, 277.18, 329.63, 440.00, 554.37], // A3, C#4, E4, A4, C#5
    [146.83, 220.00, 369.99, 440.00, 587.33], // D3, A3, F#4, A4, D5 (Ascendant finale)
  ];
  private currentChordIndex: number = 0;
  private currentLanguage: LanguageCode = 'en';

  // Multilingual Stage Narration scripts for Cauvery Delta 3D intro
  private stageScriptsByLang: Record<LanguageCode, string[]> = {
    en: [
      "Welcome to FarmConnect AI. Awakening the fertile fields of India, uniting farm owners and harvest specialists.",
      "Frictionless onboarding in eight Indian languages, connecting verified agricultural labor with dignity.",
      "Intelligent Gemini AI matching aligns seasonal crop cycles with experienced field crews in minutes.",
      "Transparent digital attendance and instant zero-fee UPI settlement direct to bank accounts.",
      "Welcome to a new era of agricultural prosperity. FarmConnect AI is ready."
    ],
    ta: [
      "பார்ம்கனெக்ட் AI-க்கு நல்வரவு. காவேரி டெல்டா விவசாயிகளையும் அறுவடை வல்லுநர்களையும் ஒன்றிணைக்கிறது.",
      "தமிழ் உட்பட எட்டு இந்திய மொழிகளில் எளிய பதிவு, விவசாய தொழிலாளர்களுக்கு உரிய கூலி மற்றும் கண்ணியம்.",
      "ஜெமினி AI மூலம் பயிர் சுழற்சிகளுக்கு ஏற்ப அனுபவமிக்க வேலையாட்கள் விரைவாக இணைக்கப்படுகிறார்கள்.",
      "வெளிப்படையான டிஜிட்டல் வருகைப்பதிவு மற்றும் நேரடியாக வங்கிக் கணக்கிற்கு உடனடி UPI கட்டணம்.",
      "விவசாய செழிப்பின் புதிய சகாப்தத்திற்கு நல்வரவு. பார்ம்கனெக்ட் AI தயார்."
    ],
    hi: [
      "फार्मकनेक्ट AI में आपका स्वागत है। भारतीय खेतों को सशक्त बनाते हुए किसानों और कुशल मजदूरों को जोड़ना।",
      "आठ भारतीय भाषाओं में आसान पंजीकरण, सत्यापित कृषि श्रमिकों को उचित मजदूरी और सम्मान।",
      "जेमिनी AI द्वारा फसल चक्र के अनुसार अनुभवी कार्यदलों का त्वरित मिलान।",
      "पारदर्शी डिजिटल उपस्थिति और सीधे बैंक खाते में तत्काल शून्य-शुल्क UPI भुगतान।",
      "कृषि समृद्धि के नए युग में आपका स्वागत है। फार्मकनेक्ट AI तैयार है।"
    ],
    te: [
      "ఫార్మ్‌కనెక్ట్ AI కి స్వాగతం. భారతీయ వ్యవసాయాన్ని శక్తివంతం చేస్తూ రైతులను మరియు శ్రామికులను కలుపుతోంది.",
      "ఎనిమిది భారతీయ భాషలలో సులభమైన నమోదు, శ్రామికులకు సరసమైన వేతనం మరియు గౌరవం.",
      "జెమినీ AI ద్వారా పంట కాలానికి అనుగుణంగా అనుభవజ్ఞులైన శ్రామికుల శీఘ్ర ఎంపిక.",
      "పారదర్శక డిజిటల్ హాజరు మరియు బ్యాంకు ఖాతాకు తక్షణ జీరో-ఫీజు UPI చెల్లింపు.",
      "వ్యవసాయ శ్రేయస్సు యొక్క కొత్త శకానికి స్వాగతం. ఫార్మ్‌కనెక్ట్ AI సిద్ధంగా ఉంది."
    ],
    kn: [
      "ಫಾರ್ಮ್‌ಕನೆಕ್ಟ್ AI ಗೆ ಸುಸ್ವಾಗತ. ಭಾರತೀಯ ಕೃಷಿ ಕ್ಷೇತ್ರಗಳನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುತ್ತಾ ರೈತರು ಮತ್ತು ಕಾರ್ಮಿಕರನ್ನು ಬೆಸೆಯುವುದು.",
      "ಎಂಟು ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಸರಳ ನೋಂದಣಿ, ಪರಿಶೀಲಿಸಿದ ಕೃಷಿ ಕಾರ್ಮಿಕರಿಗೆ ನ್ಯಾಯಯುತ ಕೂಲಿ.",
      "ಜೆಮಿನಿ AI ಮೂಲಕ ಬೆಳೆ ಚಕ್ರಕ್ಕೆ ತಕ್ಕಂತೆ ಅನುಭವಿ ಕಾರ್ಮಿಕರ ತ್ವರಿತ ಹೊಂದಾಣಿಕೆ.",
      "ಪಾರದರ್ಶಕ ಡಿಜಿಟಲ್ ಹಾಜರಾತಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ತಕ್ಷಣದ ಶೂನ್ಯ-ಶುಲ್ಕ UPI ಪಾವತಿ.",
      "ಕೃಷಿ ಸಮೃದ್ಧಿಯ ಹೊಸ ಯುಗಕ್ಕೆ ಸುಸ್ವಾಗತ. ಫಾರ್ಮ್‌ಕನೆಕ್ಟ್ AI ಸಿದ್ಧವಾಗಿದೆ."
    ],
    ml: [
      "ഫാംകണക്ട് AI-ലേക്ക് സ്വാഗതം. കർഷകരെയും വിദഗ്ദ്ധ തൊഴിലാളികളെയും പരസ്പരം ബന്ധിപ്പിക്കുന്നു.",
      "എട്ട് ഇന്ത്യൻ ഭാഷകളിൽ ലളിതമായ രജിസ്ട്രേഷൻ, കാർഷിക തൊഴിലാളികൾക്ക് മാന്യമായ വേതനം.",
      "ജെമിനി AI വഴി വിള ചക്രങ്ങൾക്കനുസരിച്ച് പരിചയസമ്പന്നരായ തൊഴിലാളികളെ കണ്ടെത്തുന്നു.",
      "സുതാര്യമായ ഡിജിറ്റൽ ഹാജരും ബാങ്ക് അക്കൗണ്ടിലേക്ക് തൽക്ഷണ സൗജന്യ UPI ഇടപാടും.",
      "കാർഷിക സമൃദ്ധിയുടെ പുതിയ യുഗത്തിലേക്ക് സ്വാഗതം. ഫാംകണക്ട് AI സജ്ജമാണ്."
    ],
    mr: [
      "फार्मकनेक्ट AI मध्ये आपले स्वागत आहे. शेतकरी आणि कुशल शेतमजुरांना एका डिजिटल व्यासपीठावर जोडणे.",
      "आठ भारतीय भाषांमध्ये सुलभ नोंदणी, शेतमजुरांना योग्य मजुरी आणि सन्मान.",
      "जेमिनी AI द्वारे हंगामी पिकांनुसार अनुभवी मजुरांची जलद निवड.",
      "पारदर्शक डिजिटल हजेरी आणि थेट बँक खात्यात त्वरित शून्य-शुल्क UPI जमा.",
      "कृषी समृद्धीच्या नव्या युगात आपले स्वागत आहे. फार्मकनेक्ट AI सज्ज आहे."
    ],
    bn: [
      "ফার্মকানেক্ট AI-তে স্বাগতম। কৃষক এবং দক্ষ কৃষি শ্রমিকদের এক প্ল্যাটফর্মে সংযুক্ত করা।",
      "আটটি ভারতীয় ভাষায় সহজ নিবন্ধন, যাচাইকৃত শ্রমিকদের ন্যায্য মজুরি ও সম্মান।",
      "জেমিনি AI-এর মাধ্যমে ফসলের চক্র অনুযায়ী অভিজ্ঞ শ্রমিকদের দ্রুত সংযোগ।",
      "স্বচ্ছ ডিজিটাল উপস্থিতি এবং সরাসরি ব্যাঙ্ক অ্যাকাউন্টে তাৎক্ষণিক শূন্য-ফি UPI পেমেন্ট।",
      "কৃষি সমৃদ্ধির নতুন যুগে স্বাগতম। ফার্মকানেক্ট AI প্রস্তুত।"
    ]
  };

  public setLanguage(lang: LanguageCode): void {
    this.currentLanguage = lang;
  }

  public getLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  public init(): boolean {
    if (this.ctx) return true;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Sub-buses
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.natureGain = this.ctx.createGain();
      this.natureGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.natureGain.connect(this.masterGain);

      return true;
    } catch (e) {
      console.warn('Web Audio initialization failed:', e);
      return false;
    }
  }

  public async start(): Promise<void> {
    if (!this.init()) return;
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isRunning) return;
    this.isRunning = true;

    // Gentle fade-in of master volume
    const targetGain = this.isMuted ? 0 : this.volume;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetGain), this.ctx.currentTime + 1.8);

    // Start Nature soundscape (Breeze & Birds)
    if (this.natureEnabled) {
      this.startBreeze();
      this.startBirdsong();
    }

    // Start Harmonious Musical Pad
    if (this.musicEnabled) {
      this.playNextChord();
      this.chordIntervalId = window.setInterval(() => {
        if (this.isRunning && this.musicEnabled) {
          this.playNextChord();
        }
      }, 5500);
    }
  }

  public stop(): void {
    if (!this.ctx || !this.masterGain) return;
    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
    } catch {}

    if (this.chordIntervalId) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
    if (this.birdIntervalId) {
      clearInterval(this.birdIntervalId);
      this.birdIntervalId = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    this.isRunning = false;
  }

  // Plays a lush, soothing chord using warm filtered harmonic oscillators
  private playNextChord(): void {
    if (!this.ctx || !this.musicGain || !this.isRunning) return;

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;

    const now = this.ctx.currentTime;
    const chordDuration = 5.2;

    // Lowpass filter for warm acoustic character
    const chordFilter = this.ctx.createBiquadFilter();
    chordFilter.type = 'lowpass';
    chordFilter.frequency.setValueAtTime(650, now);
    chordFilter.frequency.exponentialRampToValueAtTime(1100, now + 2.0);
    chordFilter.frequency.exponentialRampToValueAtTime(600, now + chordDuration);
    chordFilter.Q.setValueAtTime(1.5, now);
    chordFilter.connect(this.musicGain);

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Alternate between triangle and sine for organic richness
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Subtle detune for lush chorus warmth
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((idx - 2) * 4, now);

      // Individual note ADSR envelope
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.12 / Math.sqrt(chord.length), now + 1.2 + idx * 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc.connect(noteGain);
      noteGain.connect(chordFilter);

      osc.start(now + idx * 0.08);
      osc.stop(now + chordDuration + 0.5);
    });

    // Gentle kalimba bell chime on root note
    this.playBellChime(chord[2] * 2, now + 0.3);
  }

  // Gentle acoustic bell/kalimba chime
  public playBellChime(frequency: number = 587.33, triggerTime?: number): void {
    if (!this.ctx || !this.musicGain) return;
    const now = triggerTime || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    bellGain.gain.setValueAtTime(0.001, now);
    bellGain.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(bellGain);
    bellGain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 2.5);
  }

  // Generates organic rural morning breeze using filtered noise & LFO
  private startBreeze(): void {
    if (!this.ctx || !this.natureGain) return;

    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.04;
        b2 = 0.90 * b2 + white * 0.03;
        output[i] = (b0 + b1 + b2) * 0.4;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      // Subtle LFO modulation for wind gusting
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // slow wave
      lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const breezeGain = this.ctx.createGain();
      breezeGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(breezeGain);
      breezeGain.connect(this.natureGain);

      lfo.start();
      whiteNoise.start();
      this.windNode = whiteNoise;
    } catch (e) {
      console.warn('Breeze synthesis skipped:', e);
    }
  }

  // Generates procedurally pleasant morning birdsong chirps
  private startBirdsong(): void {
    if (this.birdIntervalId) return;

    const scheduleBird = () => {
      if (!this.isRunning || !this.natureEnabled || !this.ctx || !this.natureGain) return;

      const now = this.ctx.currentTime;
      const baseFreq = 2400 + Math.random() * 800; // Bright sparrow range

      // 2 or 3 rapid sweet chirps
      const chirpCount = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < chirpCount; i++) {
        const chirpStart = now + i * 0.12;
        const osc = this.ctx.createOscillator();
        const chirpGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq + (i % 2 === 0 ? 300 : -200), chirpStart);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, chirpStart + 0.08);

        chirpGain.gain.setValueAtTime(0.001, chirpStart);
        chirpGain.gain.exponentialRampToValueAtTime(0.04, chirpStart + 0.02);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.09);

        osc.connect(chirpGain);
        chirpGain.connect(this.natureGain);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.1);
      }

      // Schedule next random birdsong in 4 to 8 seconds
      const nextDelay = (4 + Math.random() * 4) * 1000;
      this.birdIntervalId = window.setTimeout(scheduleBird, nextDelay);
    };

    // First chirp after 2 seconds
    this.birdIntervalId = window.setTimeout(scheduleBird, 2200);
  }

  // Spoken introductory narration for each stage in the user's selected language
  public speakStage(stageIndex: number, forcedLanguage?: LanguageCode, announceLanguage = false): void {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const lang = forcedLanguage || this.currentLanguage || 'en';
    const langMeta = LANGUAGE_VOICE_MAP[lang] || LANGUAGE_VOICE_MAP.en;
    const scripts = this.stageScriptsByLang[lang] || this.stageScriptsByLang.en;
    const stageScript = scripts[stageIndex] || this.stageScriptsByLang.en[stageIndex];
    if (!stageScript) return;

    try {
      window.speechSynthesis.cancel(); // cancel pending speech

      const voices = window.speechSynthesis.getVoices();
      const matchedNativeVoice = voices.find(
        (v) => v.lang.toLowerCase().replace('_', '-') === langMeta.speechLang.toLowerCase() ||
               v.lang.toLowerCase().startsWith(langMeta.code.toLowerCase())
      );
      const universalVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('en-in') || 
               v.lang.toLowerCase().includes('en-gb') || 
               v.lang.toLowerCase().includes('en-us') ||
               v.default
      ) || (voices.length > 0 ? voices[0] : null);

      // Duck music slightly while speaking for pristine clarity
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      }

      // If stage 0 or language was just selected, explicitly announce the selected language!
      if (announceLanguage || stageIndex === 0) {
        const langIntro = new SpeechSynthesisUtterance(`Language selected: ${langMeta.name}.`);
        langIntro.rate = 0.95;
        langIntro.pitch = 1.05;
        langIntro.lang = 'en-US';
        if (universalVoice) langIntro.voice = universalVoice;
        window.speechSynthesis.speak(langIntro);
      }

      // Speak stage narration
      const narrationText = matchedNativeVoice ? stageScript : (this.stageScriptsByLang.en[stageIndex] || stageScript);
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = 0.94; // Calm, respectful pacing
      utterance.pitch = 1.02;
      utterance.volume = this.isMuted ? 0 : 0.85;

      if (matchedNativeVoice) {
        utterance.lang = langMeta.speechLang;
        utterance.voice = matchedNativeVoice;
      } else {
        utterance.lang = 'en-US';
        if (universalVoice) utterance.voice = universalVoice;
      }

      utterance.onend = () => {
        if (this.musicGain && this.ctx) {
          this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        }
      };

      utterance.onerror = () => {
        if (this.musicGain && this.ctx) {
          this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis skipped:', e);
    }
  }

  // Control APIs
  public setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    if (this.isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  public toggleVoice(enabled?: boolean): boolean {
    this.voiceEnabled = enabled !== undefined ? enabled : !this.voiceEnabled;
    if (!this.voiceEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.voiceEnabled;
  }

  public toggleNature(enabled?: boolean): boolean {
    this.natureEnabled = enabled !== undefined ? enabled : !this.natureEnabled;
    if (this.natureGain && this.ctx) {
      this.natureGain.gain.setValueAtTime(this.natureEnabled ? 0.35 : 0, this.ctx.currentTime);
    }
    return this.natureEnabled;
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      isMuted: this.isMuted,
      volume: this.volume,
      voiceEnabled: this.voiceEnabled,
      natureEnabled: this.natureEnabled,
      musicEnabled: this.musicEnabled
    };
  }
}

// Global Singleton for easy cross-component access
export const pleasantAudio = new PleasantAudioEngine();
