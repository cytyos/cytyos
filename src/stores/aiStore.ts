import { create } from 'zustand';

interface AIState {
  message: string | null;
  isThinking: boolean;
  isVisible: boolean;
  setMessage: (msg: string) => void;
  setThinking: (status: boolean) => void;
  hideMessage: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  message: null,
  isThinking: false,
  isVisible: false,
  setMessage: (msg) => set({ message: msg, isVisible: true, isThinking: false }),
  setThinking: (status) => set({ isThinking: status, isVisible: true }),
  hideMessage: () => set({ isVisible: false, message: null }),
}));