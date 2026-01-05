import { create } from 'zustand';

type MeasurementSystem = 'metric' | 'imperial';

interface SettingsState {
  // Navigation State
  isLandingPageOpen: boolean;
  setLandingPageOpen: (isOpen: boolean) => void;

  isPaywallOpen: boolean;
  setPaywallOpen: (isOpen: boolean) => void;
  
  isZoningModalOpen: boolean;
  setZoningModalOpen: (isOpen: boolean) => void;

  isRoadmapOpen: boolean;
  setRoadmapOpen: (isOpen: boolean) => void;

  urbanContext: string;
  setUrbanContext: (text: string) => void;

  measurementSystem: MeasurementSystem;
  setMeasurementSystem: (system: MeasurementSystem) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isLandingPageOpen: true, // App starts at Landing Page
  setLandingPageOpen: (isOpen) => set({ isLandingPageOpen: isOpen }),

  isPaywallOpen: false,
  setPaywallOpen: (isOpen) => set({ isPaywallOpen: isOpen }),

  isZoningModalOpen: false,
  setZoningModalOpen: (isOpen) => set({ isZoningModalOpen: isOpen }),

  isRoadmapOpen: false,
  setRoadmapOpen: (isOpen) => set({ isRoadmapOpen: isOpen }),

  urbanContext: '',
  setUrbanContext: (text) => set({ urbanContext: text }),

  measurementSystem: 'metric',
  setMeasurementSystem: (system) => set({ measurementSystem: system }),
}));