import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

// Accessing environment variables
const DIRECT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- HELPER: SECURE PROXY FETCH ---
const fetchAI = async (messages: any[], max_tokens: number = 1000) => {
  if (!DIRECT_API_KEY || DIRECT_API_KEY.includes('your-key')) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    // Using the proxy endpoint we configured in vite.config.ts
    const response = await fetch("/api-openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        model: "gpt-4-turbo-preview", 
        messages, 
        temperature: 0.3, // Lower temperature for higher technical precision
        max_tokens 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API Error");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Fetch Error:", error);
    throw error;
  }
};

// --- FULL ANALYSIS (High Complexity) ---
export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();
  const curr = context.currency || 'USD';

  // Technical data block for context injection
  const projectData = `
    PROJECT MANIFEST FOR ARCHITECTURAL & FINANCIAL REVIEW:
    - Land Metrics: Area ${context.land.area}m², Cost ${curr} ${context.land.cost}.
    - Zoning Constraints: Max FAR ${context.land.maxFar}, Max Occupancy ${context.land.maxOccupancy}%.
    - Current Design: FAR achieved ${context.metrics.far}, Occupancy ${context.metrics.occupancy}%.
    - Financials: GDV ${curr} ${context.metrics.revenue}, Build Cost ${curr} ${context.metrics.totalCost}.
    - Profitability: Net Profit ${curr} ${context.metrics.grossProfit}, Margin ${context.metrics.margin}%.
    - Components: ${context.blocks.map(b => `${b.name} (${b.usage}, H:${b.height}m)`).join('; ')}.
    - Legal Context: ${urbanContext || "No specific zoning text provided."}
  `;

  try {
    const systemPrompt = `You are a Senior Urban Strategist and Real Estate Investment Expert. 
    Analyze the project using these complex criteria:
    1. RESIDUAL LAND VALUE: Evaluate if the land cost is justified by the profit margin.
    2. RISK ASSESSMENT: If the margin is < 15% or FAR exceeds limit, flag it as a HIGH-RISK investment.
    3. PRODUCT MIX: Suggest if changing block usage (e.g., more Residential vs Retail) would improve IRR.
    4. EFFICIENCY: Compare GFA (Gross Floor Area) vs NSA (Net Sellable Area) metrics provided.
    
    Format the output with clear headers and a summary table in ${language}.
    Current Language: ${language === 'pt' ? 'Portuguese' : 'English'}.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: projectData },
      ...history
    ];

    const data = await fetchAI(messages);
    return data.choices?.[0]?.message?.content;

  } catch (error: any) {
    return language === 'pt' 
      ? `⚠️ Falha Crítica no Motor de IA: ${error.message}.`
      : `⚠️ Critical AI Engine Fault: ${error.message}.`;
  }
};

// --- LOCATION SCOUT (Geospatial Estimate) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  try {
    const systemPrompt = `You are a professional Geospatial Planner. 
    Analyze the site at [Lat: ${coordinates[1]}, Long: ${coordinates[0]}] with ${area}m².
    Estimate Zoning parameters (FAR, Occupancy, Permitted Uses) based on general urban patterns for this global location.
    Include a disclaimer that this is a parametric estimate.
    Language: ${language}. Max 150 words.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 400);
    return data.choices?.[0]?.message?.content;
  } catch (error: any) {
    return language === 'pt'
      ? `Localização: [${coordinates}] | Erro: ${error.message}`
      : `Location: [${coordinates}] | Error: ${error.message}`;
  }
};