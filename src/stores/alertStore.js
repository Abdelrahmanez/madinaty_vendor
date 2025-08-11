import { create } from "zustand";

const useAlertStore = create((set) => ({
  isTriggered: false,
  type: "error",
  message: "",

  // Function to trigger an alert
  triggerAlert: (type, message) =>
    set({ isTriggered: true, type, message }),

  // Function to reset the alert
  resetAlert: () =>
    set({ isTriggered: false, type: "error", message: "" }),
}));

export default useAlertStore;
