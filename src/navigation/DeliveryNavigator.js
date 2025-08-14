import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DeliveryDashboard from '../features/delivery/screens/deliveryDashboard';

const Stack = createNativeStackNavigator();

const DeliveryNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DeliveryDashboard" component={DeliveryDashboard} />
  </Stack.Navigator>
);

export default DeliveryNavigator;


