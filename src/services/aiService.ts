import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

// In Bolt environment, this is usually undefined, triggering fallback
const DIRECT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- HELPER: SAFE FETCH ---
const fetchAI = async (messages: any[], max_tokens: number = 500) => {
  try {
    // 1. Try Direct Key (if in .env)
    if (DIRECT_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DIRECT_API_KEY}`
        },
        body: JSON.stringify({ model: "gpt-4-turbo-preview", messages, temperature: 0.7, max_tokens })
      });
      if (!response.ok) throw new Error("Direct API Error");
      return await response.json();
    } 
    
    // 2. Try Backend Route (Production)
    else {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4-turbo-preview", messages, temperature: 0.7, max_tokens })
      });
      if (!response.ok) throw new Error("Backend API unavailable (Preview Mode)");
      return await response.json();
    }
  } catch (error) {
    throw error; // Propagate to handle in specific functions
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

  // SIMULATION MOCK (Fallback)
  const mockResponse = language === 'pt'
    ? `Análise Preliminar (Modo Simulação):\n\nBaseado nos parâmetros atuais (Área: ${context.land.area}m², VGV: ${curr} ${context.metrics.revenue}), o projeto apresenta viabilidade financeira positiva. Recomendo verificar o C.A. máximo na prefeitura.`
    : `Preliminary Analysis (Simulation Mode):\n\nBased on current parameters (Area: ${context.land.area}m², GDV: ${curr} ${context.metrics.revenue}), the project shows positive financial feasibility. Please verify max FAR with local zoning authority.`;

  try {
    const messages = [{ role: "system", content: "You are an expert Urban Planner." }, ...history];
    const data = await fetchAI(messages, 800);
    return data.choices?.[0]?.message?.content || mockResponse;
  } catch (error) {
    console.warn("⚠️ AI Service: Using fallback simulation.");
    return mockResponse;
  }
};

// --- LOCATION SCOUT ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  const isPt = language === 'pt';
  
  // SIMULATION MOCK (Fallback)
  const mockResponse = isPt
    ? `Zona Urbana Central detectada (${area}m²). Densidade média-alta. Estimativa: C.A. 4.0, T.O. 70%. *(Dados simulados. Configure sua API Key para dados reais)*`
    : `Central Urban Zone detected (${area}m²). Medium-high density. Est: FAR 4.0, Occ 70%. *(Simulated data. Configure API Key for real insights)*`;

  try {
    const systemPrompt = `You are an Urban Planner. Analyze likely zoning for Lat ${coordinates[1]}, Long ${coordinates[0]}. Output in ${language}.`;
    const messages = [{ role: "system", content: systemPrompt }];
    const data = await fetchAI(messages, 200);
    return data.choices?.[0]?.message?.content || mockResponse;
  } catch (error) {
    // Return mock silently to avoid console spam
    return mockResponse;
  }
};