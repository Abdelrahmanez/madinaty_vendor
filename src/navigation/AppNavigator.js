import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import AdminNavigator from './AdminNavigator';
import DeliveryNavigator from './DeliveryNavigator';
import { navigationRef } from './NavigationService';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        {/* Restaurant vendor flow */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Admin and Delivery flows if needed */}
        <Stack.Screen name="Admin" component={AdminNavigator} />
        <Stack.Screen name="Delivery" component={DeliveryNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


