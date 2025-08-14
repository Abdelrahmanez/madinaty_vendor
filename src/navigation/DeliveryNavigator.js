import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// For delivery flow we will reuse orders tracking screens
import CurrentOrdersScreen from '../features/orders/screens/currentOrdersScreen';
import OrderDetailsScreen from '../features/orders/screens/orderDetailsScreen';
import OrderTrackingScreen from '../features/orders/screens/orderTrackingScreen';

const Stack = createNativeStackNavigator();

const DeliveryNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DeliveryCurrentOrders" component={CurrentOrdersScreen} />
    <Stack.Screen name="DeliveryOrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="DeliveryOrderTracking" component={OrderTrackingScreen} />
  </Stack.Navigator>
);

export default DeliveryNavigator;


