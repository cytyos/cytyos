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
        temperature: 0.2, // Low temperature for technical precision
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

  // Technical manifest for pro context injection
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
    Use MARKDOWN syntax. Use bold for key numbers and tables for financial comparisons.`;

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

// --- LOCATION SCOUT (New Personality) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  try {
    // This prompt ensures the AI estimates data but provides the legal disclaimer
    const systemPrompt = `You are an Urban AI Scout and Town Planner. 
    The user has just defined a site at [Lat: ${coordinates[1]}, Lng: ${coordinates[0]}] with an area of ${area}m².

    Your Task:
    1. Identify the Neighborhood/City.
    2. ESTIMATE the likely Zoning Parameters (FAR/CA, Occupancy/TO) based on your knowledge of the area.
    3. Analyze the Market Potential (Residential/Commercial).
    
    CRITICAL DISCLAIMER:
    You must explicitly state that these parameters are *estimates based on location* and may not be accurate. 
    Strongly advise the user to upload the official Zoning Law (PDF) or use the "Upload Regulation" button to validate these assumptions.

    Output format:
    - Use Markdown.
    - Use Bold for values.
    - Be concise (Max 200 words).
    - Language: ${language === 'pt' ? 'Portuguese' : 'English'}.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 500);
    return data.choices?.[0]?.message?.content || "Scout data unavailable.";
  } catch (error: any) {
    return language === 'pt'
      ? `Erro na Geolocalização: ${error.message}`
      : `Geospatial Error: ${error.message}`;
  }
};