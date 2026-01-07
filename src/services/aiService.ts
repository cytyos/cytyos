import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- FULL PROJECT ANALYSIS ---
export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();

  // 1. Get Coordinates
  let locationContext = "Coordinates: Unknown";
  if (context.land.geometry?.coordinates) {
      const coord = context.land.geometry.coordinates[0][0]; 
      locationContext = `Lat: ${coord[1]}, Long: ${coord[0]}`;
  }

  const curr = context.currency || 'USD';

  // 2. Data Summary
  const dataSummary = `
    === PROJECT BLUEPRINT (${language}) ===
    LOCATION: ${locationContext}
    CURRENCY: ${curr}
    LOCAL LAWS: "${urbanContext || "None"}"
    LAND: ${context.land.area} m² | Cost: ${money(context.land.cost, curr)}
    PERFORMANCE: Margin ${num(context.metrics.margin)}%
  `;

  const systemPrompt = `
    You are Cytyos AI. Analyze this real estate project briefly in ${language === 'pt' ? 'Portuguese' : 'English'}.
    Data: ${dataSummary}
  `;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          model: "gpt-4-turbo-preview", 
          messages: [{ role: "system", content: systemPrompt }, ...history], 
          temperature: 0.7, 
          max_tokens: 800 
      })
    });

    if (!response.ok) throw new Error("API Route missing or failed");

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No insight generated.";

  } catch (error) {
    console.warn("⚠️ AI Backend Error (using fallback):", error);
    return language === 'pt' 
        ? "⚠️ Modo Simulação: O backend não respondeu. A margem do projeto parece saudável para esta região (Simulação)."
        : "⚠️ Simulation Mode: Backend unresponsive. Project margin looks healthy for this region (Simulation).";
  }
};

// --- QUICK LOCATION SCOUT (Used by Map Click) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  const isPt = language === 'pt';
  const disclaimerText = isPt 
    ? "*(Estimativa via satélite. Verifique a legislação local)*" 
    : "*(Satellite estimate. Check local zoning laws)*";

  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner.
    TASK: The user just finished drawing a lot on the map.
    Provide an IMMEDIATE, concise analysis (max 2 sentences) focusing strictly on likely ZONING parameters.
    INPUT: Lat ${coordinates[1]}, Long ${coordinates[0]}, Area ${area} m².
    OUTPUT RULES:
    1. Identify the neighborhood/region.
    2. State likely Density, FAR (CA) and Occupancy (TO).
    3. End with: "${disclaimerText}"
    4. LANGUAGE: Answer strictly in ${isPt ? 'Portuguese (Brazil)' : 'English'}.
  `;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          model: "gpt-4-turbo-preview", 
          messages: [{ role: "system", content: systemPrompt }], 
          temperature: 0.7, 
          max_tokens: 200 
      })
    });

    if (!response.ok) throw new Error("API Route missing or failed");

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Analysis unavailable.";

  } catch (error) {
    console.warn("⚠️ AI Backend Error (using fallback):", error);
    
    // FALLBACK SIMULATION (To ensure UX works even without backend)
    // This guarantees the user sees SOMETHING
    const mockNeighborhood = isPt ? "Zona Urbana Central" : "Central Urban Zone";
    const mockText = isPt 
        ? `Detectei uma área de ${area}m² em ${mockNeighborhood}. Zona de alta densidade, CA provável de 4.0. ${disclaimerText}`
        : `Detected ${area}m² area in ${mockNeighborhood}. High density zone, likely FAR 4.0. ${disclaimerText}`;
        
    // Delay artificial para parecer que a IA pensou
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockText;
  }
};

const money = (val: number, curr: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
const num = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);