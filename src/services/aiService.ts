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

// --- HELPER: DIRECT FETCH (High Precision Mode) ---
const fetchAI = async (messages: any[], max_tokens: number = 3000) => {
  if (!DIRECT_API_KEY) {
    throw new Error("Missing OpenAI API Key. Check Vercel Environment Variables.");
  }

  try {
    // CORREÇÃO: Usando a URL completa da OpenAI para garantir conexão direta e evitar erros de proxy
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        // --- MODELO PREMIUM ---
        // Usamos o Turbo para garantir inteligência máxima na análise imobiliária
        model: "gpt-4-turbo-preview", 
        messages, 
        temperature: 0.3, // Temperatura baixa para ser factual e técnico
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
    
    CRITICAL INSTRUCTIONS:
    1. Act as if you are referencing local master plans and zoning codes.
    2. If the user provided a location, try to cite specific local laws (e.g., "According to NYC Zoning Resolution...").
    3. ALWAYS round Currency to 2 decimal places.
    4. Structure the response clearly with Markdown headers.
    
    MANDATORY ENDING (CALL TO ACTION):
    At the very end, strictly output a bold Call to Action asking the user to upload the official PDF to validate these assumptions.
    Example: "**Action Required:** To validate these zoning assumptions, please upload the City Master Plan PDF in the 'Context' tab."
    
    Output Language: **${targetLang}**.`;

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
    return `⚠️ Analysis Error: ${cleanError}`;
  }
};

// --- LOCATION SCOUT (O "Buscador" Simulado) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  const targetLang = getTargetLanguage(language);

  try {
    // AQUI ESTÁ A MÁGICA DO PROMPT
    const systemPrompt = `You are an expert Urban Planner and Land Scout. 
    The user is looking at a site at [Lat: ${coordinates[1]}, Lng: ${coordinates[0]}] with ${area.toFixed(0)}m².

    YOUR MISSION:
    1. **Identify the Location:** Determine the Neighborhood, City, and likely Zoning District (e.g., "Zone R-3", "Mixed Use").
    2. **Simulate Research:** Explicitly mention you are cross-referencing with local municipal databases and Master Plans known up to 2023.
    3. **Provide Data:** Estimate max FAR (Floor Area Ratio), Occupancy Rate, and Height Limits based on typical laws for this specific neighborhood.
    4. **Be Honest but Helpful:** If precise data is unavailable, provide the standard parameters for that city's density zone.

    MANDATORY CALL TO ACTION (CTA):
    End the message with a persuasive CTA.
    "To confirm if this specific lot has [Specific Exception/Incentive], upload the Zoning Law PDF now."

    Output format:
    - Markdown.
    - Professional and Insightful.
    - Language: **${targetLang}**.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 1000);
    return data.choices[0].message.content;

  } catch (error: any) {
    const cleanError = error.message || "Unknown Error";
    if (language === 'pt') return `Erro na Geolocalização: ${cleanError}`;
    return `Geospatial Error: ${cleanError}`;
  }
};