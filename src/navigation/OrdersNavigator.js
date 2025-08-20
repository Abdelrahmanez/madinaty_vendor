import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrdersScreen from '../features/orders/screens/ordersScreen';
import OrderDetailsScreen from '../features/orders/screens/orderDetailsScreen';
import OrderHistoryScreen from '../features/orders/screens/orderHistoryScreen';
import CurrentOrdersScreen from '../features/orders/screens/currentOrdersScreen';
import OrderTrackingScreen from '../features/orders/screens/orderTrackingScreen';
import OrderAssignmentScreen from '../features/orders/screens/OrderAssignmentScreen';

const Stack = createNativeStackNavigator();

const OrdersNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    <Stack.Screen name="CurrentOrders" component={CurrentOrdersScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    <Stack.Screen name="OrderAssignment" component={OrderAssignmentScreen} />
  </Stack.Navigator>
);

export default OrdersNavigator;


