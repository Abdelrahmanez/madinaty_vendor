import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Placeholder: add admin-specific screens here when available
import OrdersNavigator from './OrdersNavigator';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminOrders" component={OrdersNavigator} />
  </Stack.Navigator>
);

export default AdminNavigator;


