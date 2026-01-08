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
// Garante que a IA saiba exatamente em qual idioma escrever
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

// --- HELPER: ROBUST PROXY FETCH ---
const fetchAI = async (messages: any[], max_tokens: number = 1000) => {
  if (!DIRECT_API_KEY) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    const response = await fetch("/api-openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        model: "gpt-4-turbo-preview", 
        messages, 
        temperature: 0.2,
        max_tokens 
      })
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      const errorDetail = responseText ? JSON.parse(responseText).error?.message : "Unknown API Error";
      throw new Error(errorDetail);
    }

    if (!responseText) throw new Error("Empty response from server");

    return JSON.parse(responseText);
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
  const targetLang = getTargetLanguage(language); // <--- IDIOMA CORRETO

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
    
    CRITICAL FORMATTING RULES:
    1. NEVER output long floating-point numbers.
    2. ALWAYS round Currency to 2 decimal places.
    3. ALWAYS round Areas and Ratios to 2 decimal places.
    4. Use thousands separators.
    
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

    const data = await fetchAI(messages);
    return data.choices?.[0]?.message?.content || "Analysis could not be generated.";

  } catch (error: any) {
    // Tratamento de erro multilíngue básico
    if (language === 'pt') return `⚠️ Erro Crítico: ${error.message}`;
    if (language === 'es') return `⚠️ Error Crítico: ${error.message}`;
    if (language === 'fr') return `⚠️ Erreur Critique: ${error.message}`;
    if (language === 'zh') return `⚠️ 严重错误: ${error.message}`;
    return `⚠️ Critical Error: ${error.message}`;
  }
};

// --- LOCATION SCOUT ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  const targetLang = getTargetLanguage(language); // <--- IDIOMA CORRETO

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
    - Concise (Max 200 words).
    - Language: **${targetLang}**.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 500);
    return data.choices?.[0]?.message?.content || "Scout data unavailable.";
  } catch (error: any) {
    if (language === 'pt') return `Erro na Geolocalização: ${error.message}`;
    if (language === 'zh') return `地理定位错误: ${error.message}`;
    return `Geospatial Error: ${error.message}`;
  }
};