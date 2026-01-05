import { create } from 'zustand';

type MeasurementSystem = 'metric' | 'imperial';

interface SettingsState {
  isPaywallOpen: boolean;
  setPaywallOpen: (isOpen: boolean) => void;
  
  // NEW: Zoning Modal State
  isZoningModalOpen: boolean;
  setZoningModalOpen: (isOpen: boolean) => void;

  urbanContext: string;
  setUrbanContext: (text: string) => void;

  measurementSystem: MeasurementSystem;
  setMeasurementSystem: (system: MeasurementSystem) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isPaywallOpen: false,
  setPaywallOpen: (isOpen) => set({ isPaywallOpen: isOpen }),

  isZoningModalOpen: false, // New
  setZoningModalOpen: (isOpen) => set({ isZoningModalOpen: isOpen }), // New

  urbanContext: '',
  setUrbanContext: (text) => set({ urbanContext: text }),

  measurementSystem: 'metric',
  setMeasurementSystem: (system) => set({ measurementSystem: system }),
}));