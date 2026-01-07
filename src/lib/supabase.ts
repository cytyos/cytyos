// --- MODO DE SEGURANÇA ---
// O import abaixo foi comentado pois o pacote não foi instalado corretamente ainda.
// import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Mock (Simulação) do Cliente para o site não quebrar (Tela Branca)
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Retorna uma função de unsubscribe vazia
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async ({ email, password }: any) => {
      console.log("Simulação de Login:", email);
      // Simula um erro por enquanto para evitar confusão
      return { data: null, error: { message: "Biblioteca Supabase pendente de instalação." } };
    },
    signUp: async ({ email, password }: any) => {
      return { data: null, error: { message: "Biblioteca Supabase pendente de instalação." } };
    },
    signOut: async () => {
      console.log("Simulação de Logout");
    }
  },
  // Simulação de banco de dados
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
  })
};