import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- FULL PROJECT ANALYSIS (Used by SmartPanel) ---
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
    
    >>> LOCAL LAWS (USER PROVIDED):
    "${urbanContext || "No specific laws provided."}"
    
    LAND: ${context.land.area} m² | Cost: ${money(context.land.cost, curr)}
    PERFORMANCE: Margin ${num(context.metrics.margin)}% | Profit ${money(context.metrics.grossProfit, curr)}
    VOLUMETRY:
    ${context.blocks.map((b, i) => `  ${i+1}. [${b.usage}] ${b.name}: ${b.height}m.`).join('\n')}
  `;

  // 3. System Prompt
  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner and Real Estate Developer.
    
    YOUR MISSION:
    Analyze the project with a "human eye", focusing on the specific micro-location and financial viability.

    CRITICAL RULES FOR OUTPUT:
    1. NO MARKDOWN: Do NOT use asterisks (**), hashtags (#), or bullet points (-). Write in clean, plain text paragraphs.
    2. BE CONCISE: Do not write long essays. Keep it punchy.
    3. LANGUAGE: Answer strictly in ${language === 'pt' ? 'Portuguese (Brazil)' : 'English'}.

    ANALYSIS STEPS:
    1. MICRO-LOCATION: Use the coordinates to identify the specific neighborhood. Comment on the surroundings.
    2. URBAN CONTEXT: Check if the project respects the local laws provided above.
    3. FINANCIALS: Is the ${num(context.metrics.margin)}% margin good for this specific location?
    
    Data:
    ${dataSummary}
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history
  ];

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          model: "gpt-4-turbo-preview", 
          messages: messages, 
          temperature: 0.7, 
          max_tokens: 800 
      })
    });

    const data = await response.json();
    if (data.error) return `⚠️ OpenAI Error: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "No insight generated.";

  } catch (error) {
    console.error(error);
    return "⚠️ Connection error. Please check your API setup.";
  }
};

// --- QUICK LOCATION SCOUT (Used by Map Click) ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'en'
): Promise<string> => {
  
  // DYNAMIC DISCLAIMER BASED ON LANGUAGE
  const isPt = language === 'pt';
  const disclaimerText = isPt 
    ? "*(Estimativa via satélite. Verifique a legislação local)*" 
    : "*(Satellite estimate. Check local zoning laws)*";

  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner.
    
    TASK: The user just finished drawing a lot on the map.
    Provide an IMMEDIATE, concise analysis (max 2 sentences) focusing strictly on likely ZONING parameters.
    
    INPUT DATA:
    - Center Coordinates: Lat ${coordinates[1]}, Long ${coordinates[0]}
    - Land Area: ${area} m²
    
    OUTPUT RULES:
    1. Identify the neighborhood/region based on coordinates.
    2. State the likely Density, FAR (CA) and Occupancy (TO) based on real-world knowledge of this specific location.
    3. MANDATORY DISCLAIMER: End the response strictly with: "${disclaimerText}"
    4. LANGUAGE: Answer strictly in ${isPt ? 'Portuguese (Brazil)' : 'English'}.

    EXAMPLE OUTPUT (If language is English):
    "Located in Downtown Miami, high density zone. Typical FAR is around 8.0 with 90% lot coverage. ${disclaimerText}"
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
          max_tokens: 200 
      })
    });

    const data = await response.json();
    
    if (data.error) return `⚠️ AI Error: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "Analysis unavailable for this location.";

  } catch (error) {
    console.error(error);
    return "⚠️ AI Connection Error. Please try again.";
  }
};

const money = (val: number, curr: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
const num = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);