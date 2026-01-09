import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

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

// --- HELPER: DIRECT FETCH (Fixed: No Proxy) ---
const fetchAI = async (messages: any[], max_tokens: number = 3000) => {
  if (!DIRECT_API_KEY) {
    throw new Error("Missing OpenAI API Key. Check Vercel Environment Variables.");
  }

  try {
    // CORREÇÃO: Usando a URL completa da OpenAI para garantir conexão direta
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        // Mantendo o modelo econômico e rápido
        model: "gpt-4o-mini", 
        messages, 
        temperature: 0.2, 
        max_tokens 
      })
    });

    // --- TRATAMENTO DE ERRO ---
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
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

// --- FULL ANALYSIS (Structural Intelligence) ---
export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();
  const curr = context.currency || 'USD';
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
    
    CRITICAL FORMATTING RULES (STRICT):
    1. NEVER output long floating-point numbers (e.g., do NOT write 2.6999566).
    2. ALWAYS round Currency to 2 decimal places (e.g., $1,250.00).
    3. ALWAYS round Areas and Ratios to 1 or 2 decimal places.
    4. Use thousands separators (e.g., 10,000).
    5. Structure the response clearly with Markdown headers.
    
    Tasks:
    1. RESIDUAL LAND VALUE AUDIT: Does the land cost (${curr} ${context.land.cost}) align with a ${context.metrics.margin.toFixed(2)}% margin?
    2. ARCHITECTURAL RATIOS: Evaluate GFA vs NSA efficiency. Current NSA: ${context.metrics.nsa.toFixed(0)}m².
    3. ZONING COMPLIANCE: Contrast achieved FAR (${context.metrics.far.toFixed(2)}) vs Max FAR (${context.land.maxFar}).
    4. OPTIMIZATION: Suggest specific block adjustments to maximize IRR.
    
    Output must be a structured executive summary in **${targetLang}**. 
    Use MARKDOWN syntax. Use bold for key numbers.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `PROJECT_MANIFEST: ${JSON.stringify(projectManifest)}` },
      ...history
    ];

    const data = await fetchAI(messages, 3000);
    return data.choices[0].message.content;

  } catch (error: any) {
    const cleanError = error.message || "Unknown Error";
    if (language === 'pt') return `⚠️ Erro na Análise: ${cleanError}`;
    if (language === 'es') return `⚠️ Error en Análisis: ${cleanError}`;
    if (language === 'fr') return `⚠️ Erreur d'analyse: ${cleanError}`;
    if (language === 'zh') return `⚠️ 分析错误: ${cleanError}`;
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
    const systemPrompt = `You are an Urban AI Scout and Town Planner. 
    The user has defined a site at [Lat: ${coordinates[1]}, Lng: ${coordinates[0]}] with an area of ${area.toFixed(0)}m².

    Your Task:
    1. Identify the Neighborhood/City.
    2. ESTIMATE the likely Zoning Parameters (FAR, Occupancy) based on location.
    3. Analyze Market Potential.
    
    CRITICAL DISCLAIMER:
    Explicitly state that parameters are estimates. Advise uploading official Zoning Law.

    Output format:
    - Markdown.
    - Concise (Max 300 words).
    - Language: **${targetLang}**.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 1000);
    return data.choices[0].message.content;

  } catch (error: any) {
    const cleanError = error.message || "Unknown Error";
    if (language === 'pt') return `Erro na Geolocalização: ${cleanError}`;
    if (language === 'zh') return `地理定位错误: ${cleanError}`;
    return `Geospatial Error: ${cleanError}`;
  }
};