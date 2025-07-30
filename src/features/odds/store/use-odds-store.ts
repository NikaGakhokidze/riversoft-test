;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OddsState {
  selectedOdds: Set<string>;
  toggleOdd: (oddId: string) => void;
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
}

export const useOddsStore = create<OddsState>()(
  persist(
    (set) => ({
      selectedOdds: new Set(),
      isInitialized: false,
      setInitialized: (isInitialized: boolean) => set({ isInitialized }),
      toggleOdd: (oddId) =>
        set((state) => {
          const newSelectedOdds = new Set(state.selectedOdds);
          if (newSelectedOdds.has(oddId)) {
            newSelectedOdds.delete(oddId);
          } else {
            newSelectedOdds.add(oddId);
          }
          return { selectedOdds: newSelectedOdds };
        }),
    }),
    {
      name: 'odds-selection-storage',
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === 'selectedOdds') {
            return new Set(value as string[]);
          }
          return value;
        },
        replacer: (key, value) => {
          if (key === 'selectedOdds') {
            return Array.from(value as Set<string>);
          }
          return value;
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.setInitialized(true);
        }
      },
    }
  )
);