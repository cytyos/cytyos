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
    3. LANGUAGE: Answer strictly in ${language === 'pt' ? 'Portuguese (Brazil)' : language}.

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
  language: string = 'pt'
): Promise<string> => {
  
  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner.
    
    TASK: The user just drew a polygon on a map. Give an IMMEDIATE, 2-sentence analysis of this specific location.
    
    INPUT DATA:
    - Coordinates: Lat ${coordinates[1]}, Long ${coordinates[0]}
    - Land Area: ${area} m²
    
    OUTPUT RULES:
    1. Identify the neighborhood/city based on coordinates.
    2. Estimate the density (High/Medium/Low).
    3. Suggest a probable FAR (CA) and Occupancy Rate (TO) based on typical zoning for that area.
    4. LANGUAGE: Answer strictly in ${language === 'pt' ? 'Portuguese (Brazil)' : language}.

    EXAMPLE OUTPUT FORMAT:
    "Região central de [Cidade], densidade alta. Pelas minhas pesquisas, o CA é de aproximadamente [X] e a TO de [Y]%. Sugiro verificar as leis de zoneamento e clicar em 'Context' para análise detalhada."
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
          max_tokens: 150 
      })
    });

    const data = await response.json();
    if (data.error) return `⚠️ Error: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "Analysis unavailable.";

  } catch (error) {
    console.error(error);
    return "⚠️ Connection error.";
  }
};

const money = (val: number, curr: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
const num = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);