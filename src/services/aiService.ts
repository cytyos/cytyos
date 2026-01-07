import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// ... (Mantenha a função analyzeProject igual, vamos focar na scoutLocation abaixo) ...
export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
    // ... (Código da analyzeProject mantém igual ao anterior) ...
    // Vou resumir aqui para poupar espaço, mas mantenha o que você já tem nessa função.
    // O foco da correção é a função abaixo:
    const { urbanContext } = useSettingsStore.getState();
    let locationContext = "Coordinates: Unknown";
    if (context.land.geometry?.coordinates) {
        const coord = context.land.geometry.coordinates[0][0]; 
        locationContext = `Lat: ${coord[1]}, Long: ${coord[0]}`;
    }
    const curr = context.currency || 'USD';
    const dataSummary = `=== PROJECT BLUEPRINT (${language}) ===\nLOCATION: ${locationContext}\nCURRENCY: ${curr}\n>>> LOCAL LAWS: "${urbanContext || "None"}"\nLAND: ${context.land.area} m²\nPERFORMANCE: Margin ${num(context.metrics.margin)}%`;

    const systemPrompt = `You are Cytyos AI. Analyze this real estate project briefly in ${language === 'pt' ? 'Portuguese' : language}. Data: ${dataSummary}`;
    
    // ... fetch logic ...
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "gpt-4-turbo-preview", messages: [{ role: "system", content: systemPrompt }, ...history], temperature: 0.7, max_tokens: 800 })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "Error.";
    } catch (error) { return "Connection Error."; }
};


// --- CORREÇÃO AQUI: FUNÇÃO PARA O PRIMEIRO CLIQUE (Sondagem) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'pt'
): Promise<string> => {
  
  // Prompt ajustado para dar insights de zoneamento COM DISCLAIMER
  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner.
    
    TASK: The user just finished drawing a lot on the map.
    Provide an IMMEDIATE, concise analysis (max 2 sentences) focusing strictly on likely ZONING parameters.
    
    INPUT DATA:
    - Center Coordinates: Lat ${coordinates[1]}, Long ${coordinates[0]}
    - Land Area: ${area} m²
    
    OUTPUT RULES:
    1. Identify the neighborhood/region.
    2. State the likely Density, FAR (CA - Coeficiente de Aproveitamento) and Occupancy (TO - Taxa de Ocupação) based on real-world knowledge of this specific location.
    3. MANDATORY DISCLAIMER: End with "*(Estimativa via satélite. Verifique a legislação local)*".
    4. LANGUAGE: Answer strictly in ${language === 'pt' ? 'Portuguese (Brazil)' : language}.

    EXAMPLE OUTPUT:
    "Localizado em Moema, zona de alta densidade. O CA médio é 4.0 com TO de 70%, ideal para residencial vertical. *(Estimativa via satélite. Verifique a legislação local)*"
  `;

  const messages = [
    { role: "system", content: systemPrompt }
  ];

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          model: "gpt-4-turbo-preview", 
          messages: messages, 
          temperature: 0.7, 
          max_tokens: 200 // Resposta rápida
      })
    });

    const data = await response.json();
    
    if (data.error) return `⚠️ Erro na IA: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "Não consegui analisar esta região.";

  } catch (error) {
    console.error(error);
    return "⚠️ Erro de conexão com a IA.";
  }
};

const money = (val: number, curr: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
const num = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);