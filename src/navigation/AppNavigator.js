import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import RestaurantTabs from './RestaurantTabs';
import { navigationRef } from './NavigationService';
import useAuthStore from '../stores/authStore';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
            name="MainTabs" 
            component={RestaurantTabs} 
            options={{ gestureEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


