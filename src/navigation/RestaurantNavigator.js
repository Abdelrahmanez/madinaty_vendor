import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../features/home/screens/homeScreen';
import CategoryScreen from '../features/menu/screens/categoryScreen';
import RestaurantScreen from '../features/menu/screens/restaurantScreen';
import DishScreen from '../features/menu/screens/dishScreen';
import SearchScreen from '../features/menu/screens/searchScreen';

const Stack = createNativeStackNavigator();

const RestaurantNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
    <Stack.Screen name="Restaurant" component={RestaurantScreen} />
    <Stack.Screen name="Dish" component={DishScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
  </Stack.Navigator>
);

export default RestaurantNavigator;


