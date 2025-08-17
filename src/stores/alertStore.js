import { create } from "zustand";

const useAlertStore = create((set) => ({
  isTriggered: false,
  type: "error",
  message: "",
  duration: 3000, // Default duration in milliseconds
  showIcon: false, // Whether to show an icon
  autoClose: false, // Whether to auto-close the alert

  // Function to trigger an alert with enhanced options
  triggerAlert: (type, message, options = {}) => {
    const {
      duration = 3000,
      showIcon = false,
      autoClose = false
    } = options;

    set({ 
      isTriggered: true, 
      type, 
      message, 
      duration,
      showIcon,
      autoClose
    });

    // Auto-close the alert after the specified duration if autoClose is true
    if (autoClose && duration > 0) {
      setTimeout(() => {
        set({ isTriggered: false, type: "error", message: "", duration: 3000, showIcon: false, autoClose: false });
      }, duration);
    }
  },

  // Function to reset the alert
  resetAlert: () =>
    set({ 
      isTriggered: false, 
      type: "error", 
      message: "", 
      duration: 3000, 
      showIcon: false, 
      autoClose: false 
    }),
}));

export default useAlertStore;
