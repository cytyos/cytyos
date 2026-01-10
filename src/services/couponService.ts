import { supabase } from '../lib/supabase';

export const couponService = {
  // --- ADMIN: List Coupons ---
  async getAll() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // --- ADMIN: List Usage (Leads) ---
  async getLeads(couponCode: string) {
    const { data, error } = await supabase
      .from('coupon_usages')
      .select('*')
      .eq('coupon_code', couponCode)
      .order('used_at', { ascending: false });
    
    if (error) return [];
    return data;
  },

  // --- ADMIN: Create Custom Coupon ---
  async create(code: string, minutes: number) {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{ code: code.toUpperCase(), duration_minutes: minutes, active: true }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // --- ADMIN: Delete Coupon ---
  async delete(id: string) {
    const { error } = await supabase.from('coupons').delete().match({ id });
    if (error) throw error;
  },

  // --- USER: Validate and Track Usage ---
  async validateAndTrack(code: string, userEmail: string | undefined) {
    if (!userEmail) throw new Error("You must be logged in.");

    // 1. Find coupon and check if active
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();
    
    if (error || !coupon) throw new Error("Invalid or expired coupon.");

    // 2. Check if user already used this specific coupon
    const { data: usage } = await supabase
      .from('coupon_usages')
      .select('id')
      .eq('coupon_code', coupon.code)
      .eq('user_email', userEmail)
      .single();
      
    // --- SECURITY FIX: Block reuse ---
    if (usage) {
        throw new Error("You have already used this coupon.");
    }

    // 3. Record usage (Tracking Lead)
    await supabase
      .from('coupon_usages')
      .insert([{ coupon_code: coupon.code, user_email: userEmail }]);

    return coupon;
  }
};