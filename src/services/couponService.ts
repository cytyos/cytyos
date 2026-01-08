import { supabase } from '../lib/supabase'; // Certifique-se que o supabase está configurado aqui

export const couponService = {
  // Listar todos (Admin)
  async getAll() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Criar cupom (Admin)
  async create(code: string, minutes: number = 60) {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{ code: code.toUpperCase(), duration_minutes: minutes, active: true }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Apagar cupom (Admin)
  async delete(id: string) {
    const { error } = await supabase.from('coupons').delete().match({ id });
    if (error) throw error;
  },

  // Validar cupom (Usuário Final)
  async validate(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();
    
    if (error || !data) throw new Error("Cupom inválido ou expirado.");
    return data; // Retorna { duration_minutes: 60, ... }
  }
};