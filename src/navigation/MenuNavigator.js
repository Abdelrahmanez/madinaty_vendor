import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuScreen from '../features/menu/screens/menuScreen';
import MenuItemDetailsScreen from '../features/menu/screens/menuItemDetailsScreen';
import AddMenuItemScreen from '../features/menu/screens/addMenuItemScreen';
import EditMenuItemScreen from '../features/menu/screens/editMenuItemScreen';
import RestaurantAddonsScreen from '../features/menu/screens/restaurantAddonsScreen';

const Stack = createNativeStackNavigator();

const MenuNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="MenuItemDetails" component={MenuItemDetailsScreen} />
    <Stack.Screen name="AddMenuItem" component={AddMenuItemScreen} />
    <Stack.Screen name="EditMenuItem" component={EditMenuItemScreen} />
    <Stack.Screen name="RestaurantAddons" component={RestaurantAddonsScreen} />
  </Stack.Navigator>
);

export default MenuNavigator;

