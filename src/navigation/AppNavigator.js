import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import RoleBasedNavigator from './RoleBasedNavigator';
import { navigationRef } from './NavigationService';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        {/* Role-based navigation */}
        <Stack.Screen name="MainTabs" component={RoleBasedNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


