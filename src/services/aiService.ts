// ... (imports e interfaces mantidos)

// --- HELPER: ROBUST PROXY FETCH ---
const fetchAI = async (messages: any[], max_tokens: number = 2500) => { // <--- AUMENTADO PARA 2500
  if (!DIRECT_API_KEY) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    const response = await fetch("/api-openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIRECT_API_KEY}`
      },
      body: JSON.stringify({ 
        model: "gpt-4-turbo-preview", 
        messages, 
        temperature: 0.2, 
        max_tokens // Usa o valor novo
      })
    });
// ... (resto do código igual)