import { supabase } from '../lib/supabase';

export const trackEvent = async (eventName: string, metadata: object = {}) => {
  try {
    // 1. Tenta pegar o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log(`📡 Enviando Evento: ${eventName}`, metadata); // Log para debug no F12

    // 2. Envia para o Supabase
    const { error } = await supabase.from('app_events').insert({
      user_id: user?.id || null, // Se não tiver logado, manda null
      user_email: user?.email || 'Visitante', // Se não tiver email, manda 'Visitante'
      event_name: eventName,
      metadata: metadata
    });

    if (error) console.error('❌ Erro Supabase:', error.message);

  } catch (error) {
    console.warn('⚠️ Falha no Analytics:', error); 
  }
};