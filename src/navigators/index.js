import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// navigators
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

// navigation service
import NavigationService from './NavigationService';

// stores
import useAuthStore from '../stores/authStore';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isAuthenticated, isFirstTimeUser, initializeAuth } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // تهيئة خدمة التوجيه
  const handleNavigationRef = (ref) => {
    NavigationService.setNavigator(ref);
  };

  return (
    <NavigationContainer ref={handleNavigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // إذا لم يكن المستخدم مسجلاً، اعرض مسار المصادقة
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{ gestureEnabled: false }}
          />
        ) : (
          // إذا كان المستخدم مسجلاً، اعرض مسار التطبيق الرئيسي
          <Stack.Screen 
            name="App" 
            component={AppNavigator} 
            options={{ gestureEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
