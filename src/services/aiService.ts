import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

// In Bolt/Vite, we access env variables via import.meta.env
const DIRECT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- HELPER: SAFE FETCH ---
const fetchAI = async (messages: any[], max_tokens: number = 800) => {
  if (!DIRECT_API_KEY || DIRECT_API_KEY.includes('your-key')) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        model: "gpt-4-turbo-preview", 
        messages, 
        temperature: 0.7, 
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

// --- FULL ANALYSIS ---
export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();
  const curr = context.currency || 'USD';

  // Prepare technical data for the AI
  const projectData = `
    TECHNICAL DATA:
    - Land Area: ${context.land.area} m²
    - Max FAR (Coefficient): ${context.land.maxFar}
    - Max Occupancy: ${context.land.maxOccupancy}%
    - Total Built Area: ${context.metrics.totalBuiltArea} m²
    - Efficiency (NSA): ${context.metrics.nsa} m²
    - Estimated Revenue (GDV): ${curr} ${context.metrics.revenue}
    - Total Construction Cost: ${curr} ${context.metrics.totalCost}
    - Net Profit: ${curr} ${context.metrics.grossProfit}
    - Margin: ${context.metrics.margin}%
    - Zoning/Legal Context: ${urbanContext || "Not provided"}
    - Blocks: ${context.blocks.map(b => `${b.name} (${b.usage}, ${b.height}m)`).join(', ')}
  `;

  try {
    const systemPrompt = `You are an expert Real Estate Developer and Urban Planner. 
    Analyze the following project data and provide strategic insights in ${language}. 
    Be technical, objective, and focus on financial feasibility and zoning compliance.
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
      ? `⚠️ Erro de Conexão com IA: ${error.message}. Verifique se sua chave da OpenAI no arquivo .env é válida.`
      : `⚠️ AI Connection Error: ${error.message}. Please check if your OpenAI API Key in the .env file is valid.`;
  }
};

// --- LOCATION SCOUT (Triggers when polygon is drawn) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  try {
    const systemPrompt = `You are a professional Urban Planner. 
    Provide a brief zoning estimate for a site with ${area}m² at coordinates ${coordinates[1]}, ${coordinates[0]}. 
    Focus on potential FAR, Occupancy, and land use. 
    Language: ${language}. Keep it under 100 words.`;

    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 300);
    return data.choices?.[0]?.message?.content;
  } catch (error: any) {
    return language === 'pt'
      ? `Área detectada: ${area}m². (Erro ao conectar com ChatGPT: ${error.message})`
      : `Area detected: ${area}m². (ChatGPT Connection Error: ${error.message})`;
  }
};