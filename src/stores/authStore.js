import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  isFirstTimeUser: true,  // Flag to track first-time users
  user: null,
  
  // Initialize state from storage
  initializeAuth: async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        set({ 
          isAuthenticated: !!authData.isAuthenticated, 
          user: authData.user || null,
          isFirstTimeUser: false
        });
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
  },

  // Login action
  login: (accessToken) => {
    AsyncStorage.setItem('auth', JSON.stringify({ isAuthenticated: true }));
    set({ 
      isAuthenticated: true,
      isFirstTimeUser: false
    });
  },

  // Set user data
  setUser: (userData) => {
    const currentAuth = { 
      isAuthenticated: true,
      user: userData
    };
    AsyncStorage.setItem('auth', JSON.stringify(currentAuth));
    set({ user: userData });
  },

  // Logout action
  logout: () => {
    AsyncStorage.setItem('auth', JSON.stringify({ isAuthenticated: false, user: null }));
    set({ isAuthenticated: false, user: null });
  },

  // Mark that the user has completed the first-time flow
  completeFirstTimeFlow: () => {
    const { isAuthenticated, user } = get();
    AsyncStorage.setItem('auth', JSON.stringify({ 
      isAuthenticated, 
      user,
      isFirstTimeUser: false
    }));
    set({ isFirstTimeUser: false });
  },
}));

export default useAuthStore;
