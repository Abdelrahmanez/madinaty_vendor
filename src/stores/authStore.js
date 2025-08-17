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
      console.error('Error initializing auth:', error);
    }
  },
  
  // Login function
  login: async (token) => {
    try {
      await AsyncStorage.setItem('access_token', token);
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
      // Get the stored push token before clearing auth data
      const expoPushToken = await AsyncStorage.getItem('expoPushToken');
      
      // Clear authentication data
      await Promise.all([
        AsyncStorage.removeItem('access_token'),
        AsyncStorage.removeItem('userData')
      ]);
      
      // Unregister push token from backend if it exists
      if (expoPushToken) {
        console.log('📱 Unregistering push token on logout:', expoPushToken);
        try {
          const result = await unregisterPushToken(expoPushToken);
          if (result.success) {
            console.log('✅ Push token unregistered successfully on logout');
            // Remove the token from local storage
            await AsyncStorage.removeItem('expoPushToken');
          } else {
            console.error('❌ Failed to unregister push token on logout:', result.error);
          }
        } catch (tokenError) {
          console.error('❌ Error unregistering push token on logout:', tokenError);
        }
      }
      
      // Update auth state
      set({ 
        isAuthenticated: false, 
        accessToken: null, 
        user: null 
      });
      
      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('Error during logout:', error);
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
}));

export default useAuthStore;
