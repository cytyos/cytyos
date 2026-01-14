import { supabase } from '../lib/supabase';

export const trackEvent = async (eventName: string, metadata: object = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('app_events').insert({
      user_id: user?.id || null,
      user_email: user?.email || 'anonymous',
      event_name: eventName,
      metadata: metadata
    });
  } catch (error) {
    console.warn('Analytics Error:', error); 
  }
};