import { createClient } from '@supabase/supabase-js';

// Busca as chaves no arquivo .env (que vamos configurar no próximo passo)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as chaves existem para evitar erros silenciosos
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as chaves do Supabase no arquivo .env');
}

// Cria a conexão real (que tem todas as funções, incluindo Google Login)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);