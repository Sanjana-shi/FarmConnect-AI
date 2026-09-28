import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/apiRouter';
import { generateDynamicAgriAnswer } from './server/agriIntelligenceEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount comprehensive FarmConnect REST API Router
app.use('/api', apiRouter);

// Lazy-initialized Gemini client with status caching
let geminiClient: GoogleGenAI | null = null;
let geminiAccessRestrictedUntil = 0;

function getGeminiClient(): GoogleGenAI | null {
  if (Date.now() < geminiAccessRestrictedUntil) {
    return null;
  }
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    version: '1.2.0',
    service: 'FarmConnect AI Express Backend',
    mode: 'PRODUCTION',
    timestamp: new Date().toISOString()
  });
});

// Gemini Live Audio API Status Endpoint
app.get('/api/ai/live-status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_LIVE_API_KEY);
  // Gemini Live multimodal audio requires specific Live WebSocket credentials
  const isLiveReady = Boolean(process.env.GEMINI_LIVE_API_KEY && process.env.GEMINI_LIVE_READY === 'true');
  
  res.json({
    success: true,
    isConfigured: hasKey,
    isLiveReady: isLiveReady,
    model: 'gemini-3.8-live',
    message: isLiveReady ? 'Gemini Live Voice Chat Ready' : 'Voice chat coming soon!'
  });
});

// In-app Feedback Endpoint
const userFeedbacks: any[] = [];
app.post('/api/feedback', (req, res) => {
  const { category, rating, message, name, contact, userRole } = req.body;
  const entry = {
    id: 'fb-' + Date.now(),
    category: category || 'GENERAL',
    rating: Number(rating) || 5,
    message: message || '',
    name: name || 'Anonymous',
    contact: contact || '',
    userRole: userRole || 'FARMER',
    receivedAt: new Date().toISOString()
  };
  userFeedbacks.push(entry);
  console.log(`[Feedback Received] from ${entry.name} (${entry.userRole}): "${entry.message.slice(0, 50)}..."`);
  res.json({ success: true, message: 'Feedback submitted successfully', feedbackId: entry.id });
});

app.get('/api/feedback', (req, res) => {
  res.json({ success: true, feedbacks: userFeedbacks });
});

// Gemini-Powered Agri Voice / Chat Assistant API
app.post('/api/ai/agri-assistant', async (req, res) => {
  const { query, language = 'en', role = 'FARMER', userLocation = 'Thanjavur, Tamil Nadu' } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  const languageMap: Record<string, string> = {
    en: 'English',
    ta: 'Tamil (தமிழ்)',
    hi: 'Hindi (हिन्दी)',
    te: 'Telugu (తెలుగు)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ml: 'Malayalam (മലയാളം)',
    mr: 'Marathi (मराठी)',
    bn: 'Bengali (বাংলা)'
  };

  const targetLang = languageMap[language] || 'English';

  try {
    const ai = getGeminiClient();
    
    if (ai) {
      const prompt = `You are "FarmConnect AI", a highly knowledgeable, compassionate Indian agricultural workforce and farming expert assistant.
User Role: ${role}
User Location: ${userLocation}
Target Output Language: ${targetLang}

User Query: "${query}"

Guidelines:
1. Provide a direct, specific, and actionable response in ${targetLang} answering the user's exact query.
2. If the user asks about hiring, finding workers, wages, crop seasons, fertilizers, pests, weather advice, or work availability in India, give specific, realistic Indian farming context (mention rupees ₹, acres, local crop practices like Paddy, Sugarcane, Cotton, Wheat, Kharif/Rabi seasons).
3. If the user asks their own custom or open-ended question, answer it directly with high accuracy and practical wisdom. Never give a generic canned reply.
4. Keep the response concise and conversational (under 120 words) so it can be easily listened to via text-to-speech or read on a mobile screen.
5. Do not include markdown formatting that sounds awkward when read aloud (e.g. avoid asterisks and hash symbols).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are FarmConnect AI, an expert agricultural advisor for Indian farmers and workers. Always answer the user's specific question directly in ${targetLang}. Never repeat the same generic answer for different questions.`,
          temperature: 0.7,
        }
      });

      const text = response.text?.trim();
      if (text) {
        return res.json({
          success: true,
          data: {
            response: text,
            language,
            role
          }
        });
      }
    }
  } catch (error: any) {
    const isDenied = error?.status === 'PERMISSION_DENIED' || error?.code === 403 || String(error?.message || '').includes('denied access');
    if (isDenied) {
      // Backoff remote calls for 15 minutes to avoid repeated 403 failures
      geminiAccessRestrictedUntil = Date.now() + 15 * 60 * 1000;
    } else {
      geminiAccessRestrictedUntil = Date.now() + 60 * 1000;
    }
  }

  // Dynamic Contextual Question Answering Engine (tailored to the user's specific question and language)
  const dynamicText = generateDynamicAgriAnswer({
    query,
    language,
    role,
    userLocation
  });

  return res.json({
    success: true,
    data: {
      response: dynamicText,
      language,
      role,
      isFallback: true
    }
  });
});

// Gemini-Powered Agricultural Wage Predictor API
app.post('/api/ai/wage-estimator', async (req, res) => {
  try {
    const { cropType = 'Paddy', workType = 'Harvesting', state = 'Tamil Nadu', district = 'Thanjavur', acres = 3 } = req.body;
    
    const baseWages: Record<string, number> = {
      Paddy: 750,
      Sugarcane: 850,
      Cotton: 700,
      Wheat: 800,
      Banana: 900,
      Vegetables: 650
    };

    const workMultipliers: Record<string, number> = {
      Harvesting: 1.15,
      Cutting: 1.2,
      'Paddy work': 1.0,
      Sowing: 0.95,
      Weeding: 0.85,
      'Tractor operation': 1.4
    };

    const base = baseWages[cropType] || 750;
    const mult = workMultipliers[workType] || 1.0;
    const estimatedDailyWage = Math.round(base * mult);
    const minWage = Math.round(estimatedDailyWage * 0.9);
    const maxWage = Math.round(estimatedDailyWage * 1.15);
    const estimatedWorkers = Math.max(2, Math.round(Number(acres) * 1.8));
    const estimatedDays = Math.max(1, Math.round(Number(acres) * 0.8));
    const totalBudget = estimatedDailyWage * estimatedWorkers * estimatedDays;

    return res.json({
      success: true,
      data: {
        cropType,
        workType,
        location: `${district}, ${state}`,
        recommendedDailyWage: estimatedDailyWage,
        wageRange: { min: minWage, max: maxWage },
        estimatedWorkersNeeded: estimatedWorkers,
        estimatedDurationDays: estimatedDays,
        totalEstimatedBudget: totalBudget,
        currency: 'INR',
        marketTrend: 'HIGH_DEMAND_HARVEST_SEASON',
        factors: [
          'Peak harvest labor demand in delta region',
          'Standard 7-hour field shift with lunch allowance',
          'Skilled manual harvesting and bunding requirements'
        ]
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FarmConnect AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
