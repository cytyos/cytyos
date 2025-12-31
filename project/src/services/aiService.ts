import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

// --- CONFIGURAÇÃO DA CHAVE ---
const API_KEY_INTERNAL = "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";

export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();
  const finalToken = API_KEY_INTERNAL || useSettingsStore.getState().apiKey;

  // 2. Descobrir Coordenadas
  let locationContext = "Coordinates: Unknown";
  if (context.land.geometry?.coordinates) {
      const coord = context.land.geometry.coordinates[0][0]; 
      locationContext = `Lat: ${coord[1]}, Long: ${coord[0]}`;
  }

  const curr = context.currency || 'USD';

  // 3. Dados do Projeto
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

  // 4. Prompt Refinado (Sem Markdown, Foco no Micro)
  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner and Real Estate Developer.
    
    YOUR MISSION:
    Analyze the project with a "human eye", focusing on the specific micro-location and financial viability.

    CRITICAL RULES FOR OUTPUT:
    1. NO MARKDOWN: Do NOT use asterisks (**), hashtags (#), or bullet points (-). Write in clean, plain text paragraphs.
    2. BE CONCISE: Do not write long essays. Keep it punchy so the text is not cut off.
    3. LANGUAGE: Answer strictly in ${language === 'pt' ? 'Portuguese (Brazil)' : language}.

    ANALYSIS STEPS:
    1. MICRO-LOCATION: Use the coordinates to identify the specific neighborhood, street, or nearby landmarks (parks, beach, subway). Comment on how the project interacts with this *immediate* surrounding (e.g., "Given the proximity to [Place X], the retail ground floor is excellent").
    2. URBAN CONTEXT: If the user provided laws above, check if the project respects them. If not, give general advice on density and use.
    3. FINANCIALS: Is the ${num(context.metrics.margin)}% margin good for this specific location?
    
    Data:
    ${dataSummary}
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history
  ];

  try {
    if (!finalToken) return "⚠️ Configuration Error: No API Key found in system.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${finalToken}` },
      body: JSON.stringify({ 
          model: "gpt-4-turbo-preview", 
          messages: messages, 
          temperature: 0.7, 
          max_tokens: 800 // Aumentado para evitar corte, mas com instrução de ser conciso
      })
    });

    const data = await response.json();
    if (data.error) return `⚠️ OpenAI Error: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "No insight generated.";

  } catch (error) {
    return "⚠️ Connection error.";
  }
};

const money = (val: number, curr: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
const num = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);