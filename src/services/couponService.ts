import { supabase } from '../lib/supabase';

export const couponService = {
  // --- ADMIN: Listar Cupons ---
  async getAll() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // --- ADMIN: Listar Quem Usou (Leads) ---
  async getLeads(couponCode: string) {
    const { data, error } = await supabase
      .from('coupon_usages')
      .select('*')
      .eq('coupon_code', couponCode)
      .order('used_at', { ascending: false });
    
    if (error) return [];
    return data;
  },

  // --- ADMIN: Criar com Duração Personalizada ---
  async create(code: string, minutes: number) {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{ code: code.toUpperCase(), duration_minutes: minutes, active: true }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // --- ADMIN: Deletar ---
  async delete(id: string) {
    const { error } = await supabase.from('coupons').delete().match({ id });
    if (error) throw error;
  },

  // --- USUÁRIO: Validar e Registrar Uso ---
  async validateAndTrack(code: string, userEmail: string | undefined) {
    if (!userEmail) throw new Error("Você precisa estar logado.");

    // 1. Busca o cupom
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();
    
    if (error || !coupon) throw new Error("Cupom inválido ou expirado.");

    // 2. Verifica se já usou (Opcional: Impede reuso do mesmo cupom pelo mesmo user)
    const { data: usage } = await supabase
      .from('coupon_usages')
      .select('id')
      .eq('coupon_code', coupon.code)
      .eq('user_email', userEmail)
      .single();
      
    if (usage) {
        // Se quiser bloquear reuso, descomente a linha abaixo:
        // throw new Error("Você já utilizou este cupom.");
    }

    // 3. Registra o uso (Rastreamento do Lead)
    await supabase
      .from('coupon_usages')
      .insert([{ coupon_code: coupon.code, user_email: userEmail }]);

    return coupon;
  }
};