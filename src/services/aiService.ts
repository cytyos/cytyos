import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

const DIRECT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- HELPER: ROBUST PROXY FETCH ---
const fetchAI = async (messages: any[], max_tokens: number = 1000) => {
  if (!DIRECT_API_KEY || DIRECT_API_KEY.includes('your-key')) {
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
        temperature: 0.2, // Baixa temperatura para precisão técnica
        max_tokens 
      })
    });

    // Captura o texto primeiro para evitar erro de JSON vazio
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

  // Manifest técnico para injeção de contexto pro
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
    Analyze the following project manifest using high-complexity auditing standards:
    
    1. RESIDUAL LAND VALUE AUDIT: Does the land cost (${curr} ${context.land.cost}) align with a ${context.metrics.margin}% margin?
    2. ARCHITECTURAL RATIOS: Evaluate GFA vs NSA efficiency. Current NSA: ${context.metrics.nsa}m².
    3. ZONING COMPLIANCE: Contrast achieved FAR (${context.metrics.far}) vs Max FAR (${context.land.maxFar}).
    4. OPTIMIZATION: Suggest specific block adjustments to maximize IRR (Internal Rate of Return).
    
    Output must be a structured executive summary in ${language === 'pt' ? 'Portuguese' : 'English'}. 
    Use markdown tables for financial comparisons. Highlight risks in BOLD.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `PROJECT_MANIFEST: ${JSON.stringify(projectManifest)}` },
      ...history
    ];

    const data = await fetchAI(messages);
    return data.choices?.[0]?.message?.content || "Analysis could not be generated.";

  } catch (error: any) {
    return language === 'pt' 
      ? `⚠️ Erro Crítico [Análise]: ${error.message}.`
      : `⚠️ Critical Error [Analysis]: ${error.message}.`;
  }
};

// --- LOCATION SCOUT ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  try {
    const systemPrompt = `You are an Urban AI Scout. Analyze the location [Lat: ${coordinates[1]}, Lng: ${coordinates[0]}] for a site of ${area}m².
    Provide a professional estimation of:
    - Expected FAR (Floor Area Ratio) for this specific region.
    - Typical Land Use (Residential, Commercial, Industrial).
    - Market Potential.
    Language: ${language}. Be concise but technical. Max 150 words.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 400);
    return data.choices?.[0]?.message?.content || "Scout data unavailable.";
  } catch (error: any) {
    return language === 'pt'
      ? `Erro na Geocalização: ${error.message}`
      : `Geospatial Error: ${error.message}`;
  }
};