import { create } from 'zustand';

interface SettingsStore {
  // Paywall / UI
  isPaywallOpen: boolean;
  setPaywallOpen: (isOpen: boolean) => void;
  
  // Idioma
  language: 'en' | 'pt';
  setLanguage: (lang: 'en' | 'pt') => void;

  // NOVO: Sistema de Medidas
  measurementSystem: 'metric' | 'imperial';
  setMeasurementSystem: (system: 'metric' | 'imperial') => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  isPaywallOpen: false,
  setPaywallOpen: (isOpen) => set({ isPaywallOpen: isOpen }),
  
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  // Padrão: Métrico
  measurementSystem: 'metric',
  setMeasurementSystem: (system) => set({ measurementSystem: system }),
}));