import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unregisterPushToken } from '../features/notifications/api/notification';

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isFirstTimeUser: true,
  
  // Initialize auth state from AsyncStorage
  initializeAuth: async () => {
    try {
      const [token, userData, firstTimeFlag] = await Promise.all([
        AsyncStorage.getItem('access_token'),
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
    }
  },
  
  // Login function
  login: async (token) => {
    try {
      await AsyncStorage.setItem('access_token', token);
      set({ isAuthenticated: true, accessToken: token });
    } catch (error) {
    }
  },
  
  // Set user data
  setUser: async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      set({ user });
    } catch (error) {
    }
  },
  
  // Complete first time flow
  completeFirstTimeFlow: async () => {
    try {
      await AsyncStorage.setItem('isFirstTimeUser', 'false');
      set({ isFirstTimeUser: false });
    } catch (error) {
    }
  },
  
  // Logout function
  logout: async () => {
    try {
      // Get the stored push token before clearing auth data
      const expoPushToken = await AsyncStorage.getItem('expoPushToken');
      
      // Clear authentication data
      await Promise.all([
        AsyncStorage.removeItem('access_token'),
        AsyncStorage.removeItem('userData')
      ]);
      
      // Unregister push token from backend if it exists
      if (expoPushToken) {
        try {
          const result = await unregisterPushToken(expoPushToken);
          if (result.success) {
            // Remove the token from local storage
            await AsyncStorage.removeItem('expoPushToken');
          } else {
          }
        } catch (tokenError) {
        }
      }
      
      // Update auth state
      set({ 
        isAuthenticated: false, 
        accessToken: null, 
        user: null 
      });
      
    } catch (error) {
    }
  },
  
  // Immediately mark user as unauthenticated in store (used on 401 interceptors)
  setUnauthenticated: () => {
    set({ 
      isAuthenticated: false,
      accessToken: null,
      user: null
    });
  },

  // Update tokens after refresh
  updateTokens: async (accessToken, refreshToken = null) => {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refresh_token', refreshToken);
      }
      
      set({ 
        isAuthenticated: true,
        accessToken: accessToken
      });
      
    } catch (error) {
    }
  },

  // Clear all auth data and navigate to home (used when refresh fails)
  clearAuthData: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('access_token'),
        AsyncStorage.removeItem('refresh_token'),
        AsyncStorage.removeItem('userData')
      ]);
      
      set({ 
        isAuthenticated: false,
        accessToken: null,
        user: null
      });
      
    } catch (error) {
    }
  },
}));

export default useAuthStore;
