import { create } from 'zustand';

const useManagementStore = create((set, get) => ({
  isManagementUnlocked: false,
  unlockManagement: () => set({ isManagementUnlocked: true }),
  lockManagement: () => set({ isManagementUnlocked: false }),
}));

export default useManagementStore;


