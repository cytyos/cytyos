import { supabase } from '../lib/supabase';

// Defina aqui o limite para usuários TRIAL
const TRIAL_LIMIT = 3; 

export const aiUsageService = {
  /**
   * Tenta consumir 1 crédito de IA.
   * Retorna TRUE se permitido, ou lança ERRO se estourou o limite.
   */
  async checkAndSpendCredit() {
    const { data: allowed, error } = await supabase.rpc('check_and_increment_ai_usage', {
      p_limit: TRIAL_LIMIT
    });

    if (error) {
      console.error('Error checking AI limits:', error);
      // Por segurança, se der erro no banco, bloqueia para não gastar API
      throw new Error("Unable to verify usage limits. Please try again.");
    }

    if (allowed === false) {
      throw new Error("TRIAL LIMIT REACHED. Please upgrade to continue.");
    }

    return true; // Liberado
  },

  /**
   * Pega o uso atual para mostrar na tela (Ex: "Usou 3 de 10")
   */
  async getUsage() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { count: 0, isPremium: false };

    const { data, error } = await supabase
      .from('user_ai_usage')
      .select('request_count, is_premium')
      .eq('user_id', user.id)
      .single();

    if (error) return { count: 0, isPremium: false };
    
    return {
      count: data.request_count,
      isPremium: data.is_premium,
      limit: TRIAL_LIMIT
    };
  }
};