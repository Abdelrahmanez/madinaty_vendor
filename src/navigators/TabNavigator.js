import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nManager, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// الشاشات
import HomeScreen from '../screens/homeScreen';
import RestaurantsScreen from '../screens/restaurantsScreen';
import OffersScreen from '../screens/offersScreen';
import OrdersScreen from '../screens/ordersScreen';
import CartScreen from '../screens/cartScreen';
import ProfileScreen from '../screens/profileScreen';

const isRTL = I18nManager.isRTL;
const Tab = createBottomTabNavigator();

// مكون لشريط التبويبات السفلي
const TabNavigator = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Restaurants') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Offers') {
            iconName = focused ? 'tag' : 'tag-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }
          
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 60,
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 8,
          paddingTop: 5,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
        },
        tabBarItemStyle: {
          paddingBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Regular',
          paddingBottom: Platform.OS === 'ios' ? 8 : 0,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: t('common.home') }}
      />
      <Tab.Screen 
        name="Restaurants" 
        component={RestaurantsScreen} 
        options={{ tabBarLabel: t('common.restaurants') }}
      />
      <Tab.Screen 
        name="Offers" 
        component={OffersScreen} 
        options={{ tabBarLabel: t('common.offers') }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ tabBarLabel: t('common.orders') }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ tabBarLabel: t('common.cart') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: t('common.profile') }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 