import { supabase } from '../lib/supabase';

export const subscriptionService = {
  
  // Verifica se o usuário tem acesso ativo
  async checkAccess(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Busca a assinatura no banco
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .single();

      if (error || !data) return false;

      // REGRA DE OURO:
      // 1. Status deve ser 'active'
      // 2. A data de hoje deve ser MENOR que a data de expiração
      const now = new Date();
      const expirationDate = new Date(data.current_period_end);

      const isActive = data.status === 'active' && expirationDate > now;
      
      return isActive;

    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      return false;
    }
  }
};