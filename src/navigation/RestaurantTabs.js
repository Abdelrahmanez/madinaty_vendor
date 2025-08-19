import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import OrdersNavigator from './OrdersNavigator';
import MenuNavigator from './MenuNavigator';
import { View, Text } from 'react-native';
import ManagementNavigator from './management/ManagementNavigator';

const Tab = createBottomTabNavigator();

const Placeholder = ({ label }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{label}</Text>
  </View>
);

const RestaurantTabs = () => {
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
          if (route.name === 'MenuTab') iconName = 'silverware';
          if (route.name === 'ManagementTab') iconName = 'shield-account';
          if (route.name === 'MoreTab') iconName = 'dots-horizontal-circle-outline';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName="OrdersTab"
    >
      <Tab.Screen name="OrdersTab" component={OrdersNavigator} options={{ title: 'الطلبات' }} />
      <Tab.Screen name="MenuTab" component={MenuNavigator} options={{ title: 'المنيو' }} />
      <Tab.Screen name="ManagementTab" component={ManagementNavigator} options={{ title: 'الإدارة' }} />
      <Tab.Screen name="MoreTab" children={() => <Placeholder label="المزيد" />} options={{ title: 'المزيد' }} />
    </Tab.Navigator>
  );
};

export default RestaurantTabs;


