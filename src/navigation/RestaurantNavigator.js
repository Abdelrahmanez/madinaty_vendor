import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../features/home/screens/homeScreen';
import CategoryScreen from '../features/menu/screens/categoryScreen';
import RestaurantScreen from '../features/menu/screens/restaurantScreen';
import RestaurantsScreen from '../features/menu/screens/restaurantsScreen';
import DishScreen from '../features/menu/screens/dishScreen';
import SearchScreen from '../features/menu/screens/searchScreen';

const Stack = createNativeStackNavigator();

const RestaurantNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
    <Stack.Screen name="RestaurantScreen" component={RestaurantScreen} />
    <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
    <Stack.Screen name="DishScreen" component={DishScreen} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
  </Stack.Navigator>
);

export default RestaurantNavigator;


