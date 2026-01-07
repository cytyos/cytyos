import { createClient } from '@supabase/supabase-js';

// --- ATENÇÃO: SUBSTITUA ABAIXO PELAS SUAS CHAVES REAIS ---
// (Isso é apenas para teste, depois voltaremos para o .env)

const supabaseUrl = 'https://ucbckhkjeimgglncewfh.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_d788ZtMD0YpGP7rMYVxCEQ_KW1weffj'; 

// Verificação de segurança no Console
console.log("Tentando conectar no Supabase:", supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('sua-url-aqui')) {
  console.error("ERRO CRÍTICO: As chaves do Supabase não foram preenchidas no arquivo src/lib/supabase.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);