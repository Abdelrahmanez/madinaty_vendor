import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerPushToken } from '../api/notification';
import useAuthStore from '../../../stores/authStore';

/**
 * Hook to manage Expo push token registration
 * Automatically registers token when user is authenticated
 */
export const usePushToken = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuthStore();

  /**
   * Get Expo push token
   */
  const getPushToken = async () => {
    try {
      // Check if device supports push notifications
      if (!Device.isDevice) {
        console.log('📱 Push notifications require a physical device');
        return null;
      }

      // Check permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Push notification permission denied');
        return null;
      }

      // Get project ID
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId || projectId === 'your-project-id-here') {
        console.log('⚠️ EAS project ID not configured, skipping push token');
        return null;
      }

      // Get push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      const pushToken = tokenData.data;
      console.log('✅ Push token obtained:', pushToken);
      
      // Store token locally
      await AsyncStorage.setItem('expoPushToken', pushToken);
      
      return pushToken;
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      return null;
    }
  };

  /**
   * Register push token with backend
   */
  const registerToken = async (pushToken = null) => {
    setLoading(true);
    setError(null);

    try {
      const tokenToRegister = pushToken || token;
      
      if (!tokenToRegister) {
        setError('No push token available');
        return { success: false, error: 'No push token available' };
      }

      if (!isAuthenticated) {
        setError('User not authenticated');
        return { success: false, error: 'User not authenticated' };
      }

      console.log('📱 Registering push token with backend...');
      const result = await registerPushToken(tokenToRegister);
      
      if (result.success) {
        console.log('✅ Push token registered successfully');
        setToken(tokenToRegister);
        return { success: true };
      } else {
        console.error('❌ Failed to register push token:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error registering push token:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Initialize push token on mount
  useEffect(() => {
    const initializeToken = async () => {
      // Get stored token first
      const storedToken = await AsyncStorage.getItem('expoPushToken');
      
      if (storedToken) {
        setToken(storedToken);
        console.log('📱 Using stored push token:', storedToken);
      } else {
        // Get new token if none stored
        const newToken = await getPushToken();
        if (newToken) {
          setToken(newToken);
        }
      }
    };

    initializeToken();
  }, []);

  // Auto-register token when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      console.log('🔐 User authenticated, registering push token...');
      registerToken(token);
    }
  }, [isAuthenticated, token]);

  return {
    token,
    loading,
    error,
    registerToken,
    getPushToken,
  };
};
