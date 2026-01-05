import { create } from 'zustand';

type MeasurementSystem = 'metric' | 'imperial';

interface SettingsState {
  isPaywallOpen: boolean;
  setPaywallOpen: (isOpen: boolean) => void;
  
  isZoningModalOpen: boolean;
  setZoningModalOpen: (isOpen: boolean) => void;

  // NEW: Roadmap Modal State
  isRoadmapOpen: boolean;
  setRoadmapOpen: (isOpen: boolean) => void;

  urbanContext: string;
  setUrbanContext: (text: string) => void;

  measurementSystem: MeasurementSystem;
  setMeasurementSystem: (system: MeasurementSystem) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isPaywallOpen: false,
  setPaywallOpen: (isOpen) => set({ isPaywallOpen: isOpen }),

  isZoningModalOpen: false,
  setZoningModalOpen: (isOpen) => set({ isZoningModalOpen: isOpen }),

  // NEW
  isRoadmapOpen: false,
  setRoadmapOpen: (isOpen) => set({ isRoadmapOpen: isOpen }),

  urbanContext: '',
  setUrbanContext: (text) => set({ urbanContext: text }),

  measurementSystem: 'metric',
  setMeasurementSystem: (system) => set({ measurementSystem: system }),
}));