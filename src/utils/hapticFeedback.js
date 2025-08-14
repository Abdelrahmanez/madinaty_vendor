import { Vibration } from 'react-native';

/**
 * Haptic feedback utility using React Native's Vibration API
 * Provides different vibration patterns for different feedback types
 */
export const triggerHapticFeedback = (type = 'light') => {
  try {
    switch (type) {
      case 'light':
        Vibration.vibrate(50);
        break;
      case 'medium':
        Vibration.vibrate(100);
        break;
      case 'heavy':
        Vibration.vibrate(200);
        break;
      case 'success':
        // Success pattern: short-long-short
        Vibration.vibrate([0, 100, 50, 100]);
        break;
      case 'warning':
        // Warning pattern: medium-long-medium
        Vibration.vibrate([0, 200, 100, 200]);
        break;
      case 'error':
        // Error pattern: long-short-long-short-long
        Vibration.vibrate([0, 300, 100, 300, 100, 300]);
        break;
      default:
        Vibration.vibrate(50);
    }
  } catch (error) {
    console.error('Vibration not available:', error);
  }
};

/**
 * Stop any ongoing vibration
 */
export const stopHapticFeedback = () => {
  try {
    Vibration.cancel();
  } catch (error) {
    console.error('Failed to stop vibration:', error);
  }
}; 