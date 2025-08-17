import { create } from 'zustand';

const useFinanceStore = create((set, get) => ({
  isFinanceUnlocked: false,
  unlockFinance: () => set({ isFinanceUnlocked: true }),
  lockFinance: () => set({ isFinanceUnlocked: false }),
}));

export default useFinanceStore;


