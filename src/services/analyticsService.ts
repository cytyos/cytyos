import { supabase } from '../lib/supabase';

export const trackEvent = async (eventName: string, metadata: object = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // We log even if anonymous (user_id will be null), 
    // but usually you want to know WHO did it.
    
    await supabase.from('app_events').insert({
      user_id: user?.id || null,
      user_email: user?.email || 'anonymous',
      event_name: eventName,
      metadata: metadata
    });
  } catch (error) {
    // Fire and forget - do not break the app if analytics fails
    console.warn('Analytics Error:', error); 
  }
};