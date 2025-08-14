import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../stores/authStore';

import CustomerNavigator from './CustomerNavigator';
import RestaurantVendorNavigator from './RestaurantVendorNavigator';
import AdminNavigator from './AdminNavigator';
import DeliveryNavigator from './DeliveryNavigator';

const Stack = createNativeStackNavigator();

const RoleBasedNavigator = () => {
  const { user } = useAuthStore();
  
  // تحديد نوع المستخدم
  const userRole = user?.role || 'customer';
  
  console.log('👤 نوع المستخدم:', userRole);
  
  // تحديد Navigator المناسب حسب نوع المستخدم
  const getNavigatorForRole = () => {
    switch (userRole) {
      case 'admin':
        console.log('🔧 توجيه المدير إلى AdminNavigator');
        return AdminNavigator;
      case 'delivery_partner':
      case 'driver':
        console.log('🚚 توجيه شريك التوصيل/السائق إلى DeliveryNavigator');
        return DeliveryNavigator;
      case 'restaurant':
        console.log('🏪 توجيه صاحب المطعم إلى RestaurantVendorNavigator');
        return RestaurantVendorNavigator;
      case 'customer':
      default:
        console.log('🛒 توجيه العميل إلى CustomerNavigator');
        return CustomerNavigator;
    }
  };
  
  const NavigatorComponent = getNavigatorForRole();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="RoleBasedMain" 
        component={NavigatorComponent}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RoleBasedNavigator;
