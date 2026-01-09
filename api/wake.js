import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Configuração básica de CORS para não dar erro se testar pelo navegador
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Pega as chaves do ambiente (as mesmas que o front usa)
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Configuração de ambiente faltando (Env vars)' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // O PULO DO GATO:
    // Fazemos um 'count' simples na tabela de users ou projects. 
    // Isso força o Supabase a ligar a máquina.
    // Usamos 'head: true' para ser super rápido e não baixar dados reais.
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (error) {
      // Se der erro de tabela não existente, tentamos apenas um health check simples
      // Mas o fato de ter tentado já deve ter acordado o banco.
      return res.status(200).json({ status: 'waking_up', detail: error.message });
    }

    return res.status(200).json({ 
      status: 'awake', 
      time: new Date().toISOString(),
      db_response: 'ok'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}