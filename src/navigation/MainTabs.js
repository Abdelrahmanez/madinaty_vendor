import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import RestaurantNavigator from './RestaurantNavigator';
import OrdersNavigator from './OrdersNavigator';
import ProfileScreen from '../features/profile/screens/profileScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'OrdersTab') iconName = 'clipboard-list-outline';
          if (route.name === 'ProfileTab') iconName = 'account-circle';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={RestaurantNavigator} options={{ title: 'الرئيسية' }} />
      <Tab.Screen name="OrdersTab" component={OrdersNavigator} options={{ title: 'الطلبات' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'حسابي' }} />
    </Tab.Navigator>
  );
};

export default MainTabs;


