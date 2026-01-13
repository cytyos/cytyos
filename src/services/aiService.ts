import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';
import { aiUsageService } from './aiUsageService'; // Certifique-se que este arquivo existe

// Access environment variable safely
const DIRECT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- LANGUAGE MAPPER ---
const getTargetLanguage = (code: string): string => {
  const map: Record<string, string> = {
    'pt': 'Portuguese',
    'es': 'Spanish',
    'fr': 'French',
    'zh': 'Chinese (Mandarin)',
    'en': 'English'
  };
  return map[code] || 'English';
};

// --- HELPER: DIRECT FETCH (With Security Check) ---
const fetchAI = async (messages: any[], max_tokens: number = 3000) => {
  if (!DIRECT_API_KEY) {
    throw new Error("Missing OpenAI API Key. Check Vercel Environment Variables.");
  }

  // 1. SECURITY CHECK (The "Doorman")
  try {
    // Tenta consumir 1 crédito. Se falhar, lança erro e para tudo.
    await aiUsageService.checkAndSpendCredit();
  } catch (limitError: any) {
    console.warn("AI Limit Reached:", limitError);
    
    // FORÇA A ABERTURA DO PAYWALL NO APP.TSX
    useSettingsStore.getState().setPaywallOpen(true);
    
    throw new Error("TRIAL_LIMIT_REACHED");
  }

  // 2. API CALL (Only happens if Security Check passes)
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        model: "gpt-4-turbo-preview", // Modelo Inteligente
        messages, 
        temperature: 0.3,
        max_tokens 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) errorMessage = errorJson.error.message;
      } catch (e) {
        console.error("Non-JSON error response:", errorText);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Empty response from AI Provider");
    }

    return data;
  } catch (error) {
    console.error("AI Service Failure:", error);
    throw error;
  }
};

// --- FULL ANALYSIS ---
export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();
  const targetLang = getTargetLanguage(language);

  const projectManifest = {
    financials: {
      gdv: context.metrics.revenue,
      land_cost: context.land.cost,
      construction_budget: context.metrics.totalCost,
      margin: context.metrics.margin,
      potential_profit: context.metrics.grossProfit
    },
    site_constraints: {
      total_area: context.land.area,
      efficiency_nsa: context.metrics.nsa,
      current_far: context.metrics.far,
      allowed_far: context.land.maxFar,
      current_occ: context.metrics.occupancy,
      allowed_occ: context.land.maxOccupancy
    },
    law_context: urbanContext || "No legal text provided."
  };

  try {
    const systemPrompt = `You are a Chief Investment Officer (CIO) for a Global Real Estate Fund. 
    Analyze the following project manifest using high-complexity auditing standards.
    
    CRITICAL INSTRUCTIONS:
    1. Act as if you are referencing local master plans and zoning codes.
    2. If the user provided a location, try to cite specific local laws.
    3. ALWAYS round Currency to 2 decimal places.
    4. Structure the response clearly with Markdown headers.
    
    MANDATORY ENDING:
    End with a bold Call to Action asking to upload the Master Plan PDF.
    
    Output Language: **${targetLang}**.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `PROJECT_MANIFEST: ${JSON.stringify(projectManifest)}` },
      ...history
    ];

    const data = await fetchAI(messages, 3000);
    return data.choices[0].message.content;

  } catch (error: any) {
    // Se o erro for de limite, repassa a mensagem limpa
    if (error.message === "TRIAL_LIMIT_REACHED") {
      if (language === 'pt') return "🔒 Limite Gratuito Atingido. Assine para continuar.";
      return "🔒 Free Limit Reached. Please upgrade to continue.";
    }

    const cleanError = error.message || "Unknown Error";
    if (language === 'pt') return `⚠️ Erro na Análise: ${cleanError}`;
    return `⚠️ Analysis Error: ${cleanError}`;
  }
};

// --- LOCATION SCOUT ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  const targetLang = getTargetLanguage(language);

  try {
    const systemPrompt = `You are an expert Urban Planner and Land Scout. 
    The user is looking at a site at [Lat: ${coordinates[1]}, Lng: ${coordinates[0]}] with ${area.toFixed(0)}m².

    YOUR MISSION:
    1. Identify the Location (City/Neighborhood).
    2. Simulate Research in local databases.
    3. Estimate max FAR and Height Limits.
    4. Be Honest but Helpful.

    Output Language: **${targetLang}**.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 1000);
    return data.choices[0].message.content;

  } catch (limitError: any) {
    console.warn("AI Limit Reached:", limitError);
    
    // --- ADICIONE ESTA LINHA ---
    // Marca no navegador que o limite foi atingido
    localStorage.setItem('cytyos_limit_reached', 'true'); 
    
    useSettingsStore.getState().setPaywallOpen(true);
    throw new Error("TRIAL_LIMIT_REACHED");
  }
};