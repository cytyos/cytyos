import { Metrics, Land, Block } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';

// ... (Mantenha as interfaces e a função analyzeProject existentes como estão) ...

// --- NOVA FUNÇÃO PARA O PRIMEIRO CLIQUE ---
export const scoutLocation = async (
  coordinates: number[], 
  area: number, 
  language: string = 'pt'
): Promise<string> => {
  
  // Prompt super focado em "Primeiras Impressões" e Zoneamento
  const systemPrompt = `
    You are Cytyos AI, an expert Urban Planner.
    
    TASK: The user just drew a polygon on a map. Give an IMMEDIATE, 2-sentence analysis of this specific location.
    
    INPUT DATA:
    - Coordinates: Lat ${coordinates[1]}, Long ${coordinates[0]}
    - Land Area: ${area} m²
    
    OUTPUT RULES:
    1. Identify the neighborhood/city based on coordinates.
    2. Estimate the density (High/Medium/Low) based on real-world knowledge of that spot.
    3. Suggest a probable FAR (Floor Area Ratio / CA) and Occupancy Rate (TO) based on typical zoning for that specific area.
    4. Keep it conversational but professional.
    5. LANGUAGE: Answer strictly in ${language === 'pt' ? 'Portuguese (Brazil)' : language}.

    EXAMPLE OUTPUT FORMAT:
    "Região central de [Cidade], densidade alta. Pelas minhas pesquisas, o CA é de aproximadamente [X] e a TO de [Y]%. Sugiro verificar as leis de zoneamento e clicar em 'Context' para análise detalhada."
  `;

  const messages = [
    { role: "system", content: systemPrompt }
  ];

  try {
    // Reutilizando sua rota segura existente
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
    
    if (data.error) return `⚠️ Erro na IA: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "Não foi possível analisar a região.";

  } catch (error) {
    console.error(error);
    return "⚠️ Erro de conexão com a IA.";
  }
};

// ... (Mantenha os helpers money e num no final) ...