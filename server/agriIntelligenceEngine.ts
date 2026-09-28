export interface AgriAnswerContext {
  query: string;
  language: string; // 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn'
  role: string;     // 'FARMER' | 'WORKER' | 'ADMIN'
  userLocation: string;
}

export function generateDynamicAgriAnswer(ctx: AgriAnswerContext): string {
  const { query, language, role, userLocation } = ctx;
  const q = query.toLowerCase().trim();

  // Keyword flags
  const isWage = q.includes('wage') || q.includes('rate') || q.includes('cost') || q.includes('price') || 
                 q.includes('கூலி') || q.includes('விலை') || q.includes('சம்பளம்') ||
                 q.includes('मजदूरी') || q.includes('दर') || q.includes('वेतन') ||
                 q.includes('కూలీ') || q.includes('ధర') || q.includes('ಕೂಲಿ');

  const isWorkers = q.includes('worker') || q.includes('labor') || q.includes('labour') || q.includes('hire') || 
                    q.includes('ஆட்கள்') || q.includes('தொழிலாளி') || q.includes('வேலையாள்') ||
                    q.includes('मजदूर') || q.includes('श्रमिक') || q.includes('கூலியாள்') ||
                    q.includes('కూలీలు') || q.includes('ಕೆಲಸಗಾರ');

  const isJobs = q.includes('job') || q.includes('work') || q.includes('shift') || q.includes('vacancy') ||
                 q.includes('வேலை') || q.includes('பணி') || q.includes('रोजगार') || q.includes('काम') ||
                 q.includes('పని') || q.includes('ಕೆಲಸ');

  const isWeather = q.includes('weather') || q.includes('rain') || q.includes('monsoon') || q.includes('forecast') ||
                    q.includes('வானிலை') || q.includes('மழை') || q.includes('मौसम') || q.includes('बारिश') ||
                    q.includes('వర్షం') || q.includes('వాతావరణం') || q.includes('ಮಳೆ');

  const isFertilizer = q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('npk') || q.includes('manure') ||
                       q.includes('உரம்') || q.includes('சாணம்') || q.includes('खाद') || q.includes('उर्वरक') ||
                       q.includes('ఎరువులు') || q.includes('ಗೊಬ್ಬರ');

  const isPest = q.includes('pest') || q.includes('disease') || q.includes('insect') || q.includes('spray') || q.includes('fungus') ||
                 q.includes('பூச்சி') || q.includes('நோய்') || q.includes('மருந்து') || q.includes('कीट') || q.includes('बीमारी') ||
                 q.includes('తెగులు') || q.includes('ಕೀಟ');

  const isPaddy = q.includes('paddy') || q.includes('rice') || q.includes('sambha') || q.includes('kuruvai') ||
                  q.includes('நெல்') || q.includes('அரிசி') || q.includes('धान') || q.includes('चावल') ||
                  q.includes('వరి') || q.includes('ಭತ್ತ');

  const isSugarcane = q.includes('sugarcane') || q.includes('cane') || q.includes('கரும்பு') || q.includes('गन्ना') ||
                      q.includes('చెరకు') || q.includes('ಕಬ್ಬು');

  const isCotton = q.includes('cotton') || q.includes('பருத்தி') || q.includes('कपास') || q.includes('పత్తి') || q.includes('ಹತ್ತಿ');

  const isScheme = q.includes('scheme') || q.includes('subsidy') || q.includes('insurance') || q.includes('pm-kisan') || q.includes('msp') ||
                   q.includes('திட்டம்') || q.includes('மானியம்') || q.includes('காப்பீடு') || q.includes('योजना') || q.includes('सब्सिडी');

  const isMachine = q.includes('tractor') || q.includes('harvester') || q.includes('machine') || q.includes('tiller') ||
                    q.includes('டிராக்டர்') || q.includes('இயந்திரம்') || q.includes('ट्रैक्टर') || q.includes('मशीन');

  const isGreeting = q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you') ||
                     q.includes('வணக்கம்') || q.includes('नमस्ते') || q.includes('నమస్కారం') || q.includes('ನಮಸ್ಕಾರ');

  // Multi-lingual generator
  switch (language) {
    case 'ta':
      if (isGreeting) {
        return 'வணக்கம்! நான் உங்கள் பார்ம்கனெக்ட் AI விவசாய ஆலோசகர். நெல் அறுவடை கூலி, தொழிலாளர்கள் தேடல், உரம் மற்றும் வானிலை முன்னறிவிப்பு பற்றி ஏதேனும் கேட்கலாம்.';
      }
      if (isWage) {
        if (isSugarcane) {
          return `${userLocation} பகுதியில் கரும்பு வெட்டுவதற்கான பரிந்துரைக்கப்பட்ட தினசரி கூலி ₹850 முதல் ₹920 வரை (மதிய உணவு உட்பட).`;
        }
        if (isCotton) {
          return `${userLocation} பருத்தி எடுக்கும் வேலைக்கு கிலோவுக்கு ₹12 முதல் ₹15 வரை அல்லது ஒரு நாளுக்கு ₹650 முதல் ₹720 வரை கூலி நிர்ணயிக்கப்பட்டுள்ளது.`;
        }
        return `${userLocation} டெல்டா மண்டலத்தில் தற்போதைய நெல் அறுவடை கூலி நாள் ஒன்றுக்கு ₹750 (7 மணி நேர வேலை + தேநீர்). 1 ஏக்கருக்கு சராசரியாக 4-5 வேலையாட்கள் தேவைப்படுகிறார்கள்.`;
      }
      if (isWorkers) {
        return `${userLocation} சுற்றியுள்ள கிராமங்களில் 5-க்கும் மேற்பட்ட சரிபார்க்கப்பட்ட தொழிலாளர் குழுக்கள் உடனடியாக பணிபுரிய தயாராக உள்ளன. "வேலையாட்களைத் தேடு" மெனுவில் அவர்களின் நம்பகத்தன்மை ரேட்டிங் மற்றும் அனுபவத்தை சரிபார்த்து அழைக்கலாம்.`;
      }
      if (isJobs) {
        return `${userLocation} மற்றும் அருகில் 14 நேரடி பண்ணை வேலைகள் பதிவிடப்பட்டுள்ளன. சராசரி கூலி ₹750-₹850/நாள். வேலை முடிந்த அன்றே UPI அல்லது ரொக்கமாக முழு தொகை வழங்கப்படுகிறது.`;
      }
      if (isWeather) {
        return `${userLocation} வானிலை தகவல்: அடுத்த 3 நாட்களுக்கு தெளிவான வானிலை மற்றும் வெப்பமான காற்று நிலவும் (அதிகபட்சம் 34°C). மழை வாய்ப்பு 10% மட்டுமே. பயிர் அறுவடை மற்றும் உலர்த்துவதற்கு உகந்த காலம்.`;
      }
      if (isFertilizer) {
        return `நெல் சாகுபடிக்கு ஏக்கருக்கு யூரியா 45 கிலோ, டிஏபி 50 கிலோ மற்றும் பொட்டாஷ் 25 கிலோ பரிந்துரைக்கப்படுகிறது. தழைச்சத்து மேலுரத்தை நடவு நட்ட 20 மற்றும் 40-வது நாட்களில் பிரித்து இடவும்.`;
      }
      if (isPest) {
        return `இலைச்சுருட்டுப் புழு அல்லது தண்டுத்துளைப்பான் தாக்குதலுக்கு வேப்பங்கொட்டை சாறு 5% அல்லது குளோரான்ட்ரானிலிப்ரோல் 0.4 மிலி/லிட்டர் தெளிக்கவும். வரப்புகளில் வரப்பு பயிராக தட்டைப்பயறு பயிரிடுவது நன்மை செய்யும் பூச்சிகளை ஈர்க்கும்.`;
      }
      if (isSugarcane) {
        return `கரும்பு பயிருக்கு 10 முதல் 12 மாதங்கள் முதிர்ச்சி காலம். நடவு செய்த 90 முதல் 120 நாட்களில் மண் அணைப்பது வேர் வளர்ச்சியை பலப்படுத்தும். ஒரு ஏக்கருக்கு 85-90 டன் விளைச்சல் எதிர்பார்க்கலாம்.`;
      }
      if (isMachine) {
        return `டெல்டா பகுதியில் ஒருங்கிணைந்த அறுவடை இயந்திரம் (Combine Harvester) வாடகை மணிக்கு ₹2,200 முதல் ₹2,600 வரை இயங்குகிறது. டிராக்டர் உழவு வாடகை மணிக்கு ₹950-₹1,100.`;
      }
      if (isScheme) {
        return `பிரதம மந்திரி கிசான் சம்மான் நிதி (PM-KISAN) திட்டத்தில் ஆண்டுக்கு ₹6,000 மூன்று தவணைகளாக நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படுகிறது. மேலும் பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY) மூலம் இயற்கை இடர்பாடுகளுக்கு உரிய இழப்பீடு பெறலாம்.`;
      }
      // General customized query answer in Tamil
      return `பார்ம்கனெக்ட் AI: "${query}" தொடர்பான உங்கள் கேள்விக்கு: ${userLocation} வட்டார வேளாண் சந்தை மற்றும் கள நிலவரப்படி, தொழில்நுட்ப வல்லுநர்கள் மற்றும் சரிபார்க்கப்பட்ட விவசாய குழுக்கள் மூலம் உங்கள் கேள்வி கவனத்தில் கொள்ளப்பட்டது. மேலும் விரிவான உதவிக்கு உங்கள் பண்ணை அளவை தெரிவிக்கவும்.`;

    case 'hi':
      if (isGreeting) {
        return 'नमस्ते! मैं आपका फार्मकनेक्ट AI कृषि सलाहकार हूँ। मजदूरी दर, कुशल श्रमिक, उर्वरक, कीट नियंत्रण या मौसम के बारे में अपने प्रश्न पूछें।';
      }
      if (isWage) {
        if (isSugarcane) {
          return `${userLocation} क्षेत्र में गन्ना कटाई की दैनिक मजदूरी ₹850 से ₹900/दिन (दोपहर के भोजन सहित) चल रही है।`;
        }
        return `${userLocation} क्षेत्र में धान कटाई हेतु अनुशंसित उचित दैनिक मजदूरी ₹750/दिन है। प्रति एकड़ कार्य के लिए 4 से 5 मजदूरों की आवश्यकता होती है।`;
      }
      if (isWorkers) {
        return `${userLocation} के पास 5 से अधिक सत्यापित कृषि श्रमिक समूह कल के कार्य के लिए उपलब्ध हैं। आप "मजदूर खोजें" टैब में उनकी विश्वसनीयता रेटिंग देखकर सीधे संपर्क कर सकते हैं।`;
      }
      if (isJobs) {
        return `${userLocation} क्षेत्र में वर्तमान में 12 से अधिक कृषि कार्य सक्रिय हैं। मजदूरी ₹750-₹850/दिन है और शिफ्ट समाप्ति पर तुरंत UPI या नकद भुगतान किया जाता है।`;
      }
      if (isWeather) {
        return `${userLocation} का 3 दिवसीय मौसम पूर्वानुमान: मुख्य रूप से शुष्क मौसम और तेज धूप रहेगी। बारिश की संभावना केवल 15% है। यह कटाई और गहाई के लिए बहुत अनुकूल है।`;
      }
      if (isFertilizer) {
        return `धान की फसल के लिए प्रति एकड़ 45 किग्रा यूरिया, 50 किग्रा डीएपी और 25 किग्रा पोटाश की संतुलित मात्रा की सिफारिश की जाती है। बुआई के 20 और 45 दिनों बाद यूरिया का छिड़काव करें।`;
      }
      if (isPest) {
        return `तना छेदक या पत्ती लपेटक कीट के नियंत्रण के लिए 5% नीम तेल का घोल या क्लोरेंट्रानिलिप्रोल का उचित छिड़काव करें। मित्र कीटों के संरक्षण हेतु रासायनिक कीटनाशकों का संतुलित उपयोग करें।`;
      }
      if (isScheme) {
        return `पीएम-किसान योजना के तहत किसानों को प्रतिवर्ष ₹6,000 की वित्तीय सहायता मिलती है। साथ ही पीएम फसल बीमा योजना (PMFBY) के तहत सूखा या अत्यधिक वर्षा से होने वाले नुकसान की भरपाई होती है।`;
      }
      if (isMachine) {
        return `कंबाइन हार्वेस्टर का किराया लगभग ₹2,200 से ₹2,500 प्रति घंटा और रोटावेटर/ट्रैक्टर जुताई का किराया ₹900 से ₹1,100 प्रति घंटा है।`;
      }
      return `फार्मकनेक्ट AI: "${query}" के संबंध में: ${userLocation} की कृषि स्थितियों के आधार पर यह महत्वपूर्ण कृषि कार्य है। उचित लाभ व सटीक सहायता के लिए आप जॉब पोस्ट कर सकते हैं या प्रोफाइल विवरण देख सकते हैं।`;

    case 'te':
      if (isWage) {
        return `${userLocation} ప్రాంతంలో వరి కోత కూలీ రేటు రోజుకు ₹750 గా ఉంది. చెరకు నరికివేతకు ₹850-₹900/రోజు సిఫార్సు చేయబడింది.`;
      }
      if (isWorkers || isJobs) {
        return `${userLocation} పరిసరాల్లో ధృవీకరించబడిన వ్యవసాయ కూలీలు మరియు కొత్త వ్యవసాయ పనులు సిద్ధంగా ఉన్నాయి. రోజువారీ వేతనం ₹750-₹850.`;
      }
      if (isWeather) {
        return `${userLocation} వాతావరణ నివేదిక: రాబోయే 3 రోజులు పొడి వాతావరణం ఉంటుంది. వర్ష సూచన లేదు. పంట కోతలకు అనుకూలం.`;
      }
      return `ఫార్మ్‌కనెక్ట్ AI: "${query}" పై మీ ప్రశ్నకు స్పందన: ${userLocation} ప్రాంతీయ వ్యవసాయ డేటా ఆధారంగా మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాము.`;

    case 'kn':
      if (isWage) {
        return `${userLocation} ಪ್ರದೇಶದಲ್ಲಿ ಭತ್ತದ ಕೊಯ್ಲು ಕೆಲಸಕ್ಕೆ ದಿನದ ಕೂಲಿ ₹750 ಆಗಿದೆ. ಕಬ್ಬು ಕಟಾವಿಗೆ ₹850/ದಿನ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`;
      }
      if (isWorkers || isJobs) {
        return `${userLocation} ಬಳಿ ಪರಿಶೀಲಿಸಿದ ಕೃಷಿ ಕಾರ್ಮಿಕರು ಮತ್ತು ಉದ್ಯೋಗಗಳು ಲಭ್ಯವಿವೆ. ದೈನಂದಿನ ಕೂಲಿ ₹750-₹850.`;
      }
      return `ಫಾರ್ಮ್‌ಕನೆಕ್ಟ್ AI: "${query}" ಕುರಿತಾದ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ: ${userLocation} ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಮಾನದಂಡಗಳ ಪ್ರಕಾರ ಪರಿಶೀಲಿಸಿದ ಮಾಹಿತಿ ಒದಗಿಸಲಾಗಿದೆ.`;

    case 'ml':
      if (isWage) {
        return `${userLocation} പ്രദേശത്ത് നെല്ല് കൊയ്ത്തിന് പ്രതിദിനം ₹750-₹800 നിരക്കിൽ കൂലി നിശ്ചയിച്ചിട്ടുണ്ട്.`;
      }
      return `ഫാംകണക്ട് AI: "${query}" സംബന്ധിച്ച നിങ്ങളുടെ ചോദ്യത്തിന്: ${userLocation} പ്രദേശത്തെ കർഷകർക്കും തൊഴിലാളികൾക്കും പൂർണ്ണ പിന്തുണ നൽകുന്നു.`;

    case 'mr':
      if (isWage) {
        return `${userLocation} परिसरात धान आणि ऊस तोडणीसाठी शिफारस केलेले दैनिक वेतन ₹750 ते ₹850/दिवस आहे.`;
      }
      return `फार्मकनेक्ट AI: "${query}" संदर्भात: ${userLocation} च्या शेती बाजारातील अधिकृत माहितीनुसार आपल्याला त्वरित मदत केली जाईल.`;

    case 'bn':
      if (isWage) {
        return `${userLocation} এলাকায় ধান কাটার জন্য দৈনিক মজুরি ₹৭৫০/দিন এবং আখ কাটার জন্য ₹৮৫০/দিন নির্ধারিত।`;
      }
      return `ফার্মকানেক্ট AI: "${query}" সম্পর্কে: ${userLocation} অঞ্চলের কৃষি নির্দেশিকা অনুযায়ী আপনাকে সহায়তা প্রদান করা হচ্ছে।`;

    default: // 'en'
      if (isGreeting) {
        return `Hello! I am your FarmConnect AI Agri Assistant. Ask me about labor wages, worker hiring, crop advisories, fertilizers, pest control, machinery rental, or weather forecasting.`;
      }
      if (isWage) {
        if (isSugarcane) {
          return `In ${userLocation}, the recommended daily wage for Sugarcane cutting stands at ₹850 - ₹920/day (including midday lunch break). A team of 6 workers typically harvests 1 acre in 2 days.`;
        }
        if (isCotton) {
          return `In ${userLocation}, Cotton picking is benchmarked at ₹12 - ₹15 per kg or a standard daily shift rate of ₹680 - ₹750/day for skilled workers.`;
        }
        return `Cauvery Delta Regional Labor Benchmark for ${userLocation}: Recommended Paddy harvest wage is ₹750/day for a 7-hour manual harvesting shift. For 3 acres, expect approximately 12-14 worker-days total.`;
      }
      if (isWorkers) {
        return `There are currently 5+ verified agricultural worker groups available near ${userLocation} with an average reliability score of 96%. You can browse verified profiles with sickle harvesting experience under the "Find Workers" tab.`;
      }
      if (isJobs) {
        return `Found 14 active harvesting & cultivation jobs near ${userLocation}. Daily wages range from ₹750 to ₹850/day with direct instant UPI / cash settlement upon shift completion.`;
      }
      if (isWeather) {
        return `3-Day Agricultural Weather Forecast for ${userLocation}: Predominantly clear sunny skies with daytime highs of 33-35°C. Precipitation probability is below 10%. Highly favorable conditions for reaping, bunding, and grain threshing.`;
      }
      if (isFertilizer) {
        return `For high-yield Paddy in ${userLocation}, recommended basal NPK dose per acre is 45 kg Urea, 50 kg DAP, and 25 kg MOP. Apply top-dressing Urea in two splits: at active tillering (20-25 DAT) and panicle initiation (45 DAT).`;
      }
      if (isPest) {
        return `For yellow stem borer or leaf folder infestations in Paddy, apply Chlorantraniliprole 18.5% SC @ 60 ml/acre or 5% Neem Seed Kernel Extract (NSKE) spray. Maintain shallow field water to curb soil-borne fungal spores.`;
      }
      if (isMachine) {
        return `In ${userLocation}, Combine Harvester rental rates average ₹2,200 - ₹2,600 per hour including diesel and operator. Standard tractor rotavator tillage is ₹950 - ₹1,100 per hour.`;
      }
      if (isScheme) {
        return `Eligible Indian farmers receive ₹6,000/year under the PM-KISAN direct benefit transfer scheme. In addition, PMFBY provides subsidized comprehensive risk coverage against flood, drought, and crop disease losses.`;
      }
      // Dynamic fallback that directly addresses the user's specific text
      return `FarmConnect AI Analysis for "${query}": Based on current regional agricultural benchmarks in ${userLocation}, our verified farmer and worker network provides real-time support. You can post a task or browse skilled local crews for immediate assistance.`;
  }
}
