import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// المكونات
import TabNavigator from './TabNavigator';
import ChangePasswordScreen from '../screens/changePasswordScreen';
import AddressScreen from '../screens/addressScreen';
import PaymentMethodsScreen from '../screens/paymentMethodsScreen';
import OrderHistoryScreen from '../screens/orderHistoryScreen';
import CurrentOrdersScreen from '../screens/currentOrdersScreen';
import OrderTrackingScreen from '../screens/orderTrackingScreen';
import OrderDetailsScreen from '../screens/orderDetailsScreen';
import SearchScreen from '../screens/searchScreen';
import RestaurantScreen from '../screens/restaurantScreen';
import CategoryScreen from '../screens/categoryScreen';
import DishScreen from '../screens/dishScreen';

const Stack = createNativeStackNavigator();

// المسار الرئيسي للتطبيق بعد تسجيل الدخول
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="CurrentOrders" component={CurrentOrdersScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="RestaurantScreen" component={RestaurantScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="DishScreen" component={DishScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
