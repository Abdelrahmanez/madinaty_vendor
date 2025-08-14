import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isFirstTimeUser: true,
  
  // Initialize auth state from AsyncStorage
  initializeAuth: async () => {
    try {
      const [token, userData, firstTimeFlag] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('userData'),
        AsyncStorage.getItem('isFirstTimeUser')
      ]);
      
      if (token) {
        set({ 
          isAuthenticated: true, 
          accessToken: token,
          user: userData ? JSON.parse(userData) : null
        });
      }
      
      if (firstTimeFlag !== null) {
        set({ isFirstTimeUser: firstTimeFlag === 'false' });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },
  
  // Login function
  login: async (token) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
      set({ isAuthenticated: true, accessToken: token });
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },
  
  // Set user data
  setUser: async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },
  
  // Complete first time flow
  completeFirstTimeFlow: async () => {
    try {
      await AsyncStorage.setItem('isFirstTimeUser', 'false');
      set({ isFirstTimeUser: false });
    } catch (error) {
      console.error('Error saving first time flag:', error);
    }
  },
  
  // Logout function
  logout: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('accessToken'),
        AsyncStorage.removeItem('userData')
      ]);
      set({ 
        isAuthenticated: false, 
        accessToken: null, 
        user: null 
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },
}));

export default useAuthStore;
