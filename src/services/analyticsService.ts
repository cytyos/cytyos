import { supabase } from '../lib/supabase';

export const trackEvent = async (eventName: string, metadata: object = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Log para você conferir no F12 se está saindo
    console.log(`📡 Enviando Evento: ${eventName}`, metadata);

    const { error } = await supabase.from('app_events').insert({
      user_id: user?.id || null,
      user_email: user?.email || 'Visitante',
      event_name: eventName,
      metadata: metadata
    });

    if (error) console.error('❌ Erro Supabase:', error.message);

  } catch (error) {
    console.warn('⚠️ Falha no Analytics:', error); 
  }
};