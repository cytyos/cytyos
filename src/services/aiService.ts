import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

interface ProjectContext {
  metrics: Metrics;
  land: Land;
  blocks: Block[];
  currency?: string;
}

export const analyzeProject = async (
  history: { role: 'user' | 'assistant'; content: string }[],
  context: ProjectContext,
  language: string = 'en'
): Promise<string> => {
  
  const { urbanContext } = useSettingsStore.getState();

  // 1. Descobrir Coordenadas
  let locationContext = "Coordinates: Unknown";
  if (context.land.geometry?.coordinates) {
      const coord = context.land.geometry.coordinates[0][0]; 
      locationContext = `Lat: ${coord[1]}, Long: ${coord[0]}`;
  }

  const curr = context.currency || 'USD';

  // 2. Dados do Projeto
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

  // 3. Prompt Refinado
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
    // --- MUDANÇA CRÍTICA AQUI ---
    // Chamamos a nossa API interna (/api/chat) em vez da OpenAI diretamente.
    // Isso resolve o erro de CORS e protege a sua chave.
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
        // Nota: Não enviamos mais a senha aqui. O servidor Vercel injeta ela automaticamente.
      },
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
    return "⚠️ Connection error. Please checking your API setup.";
  }
};

const money = (val: number, curr: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
const num = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);