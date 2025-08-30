import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useManagementStore from '../../stores/financeStore';

// Import management components
import {
  ManagementUnlockScreen,
  ManagementDashboard,
  PromoCodeManagementScreen,
  DeliveryManagementScreen,
  PlaceholderScreen,
  FinancialReportsScreen
} from '../../features/management';

// Import existing screens
import DeliveryZonesManagementScreen from '../../features/deliveryZones/screens/DeliveryZonesManagementScreen';
import { 
  PromocodesScreen,
  CreatePromocodeScreen,
  EditPromocodeScreen,
  PromocodeDetailsScreen 
} from '../../features/promocodes';
import { DriversManagementScreen } from '../../features/delivery';
import OrderAssignmentScreen from '../../features/orders/screens/OrderAssignmentScreen';
import RestaurantManagementScreen from '../../features/restaurant/screens/RestaurantManagementScreen';

const Stack = createNativeStackNavigator();

// Placeholder screens for features under development
const AccountsManagementScreen = () => (
  <PlaceholderScreen 
    title="إدارة الحسابات" 
    message="إدارة الحسابات - قيد التطوير" 
  />
);

// FinancialReportsScreen is now imported from the management feature

const SystemSettingsScreen = () => (
  <PlaceholderScreen 
    title="إعدادات النظام" 
    message="إعدادات النظام - قيد التطوير" 
  />
);

const ManagementNavigator = () => {
  const { isManagementUnlocked } = useManagementStore();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isManagementUnlocked ? (
        <Stack.Screen name="ManagementUnlock" component={ManagementUnlockScreen} />
      ) : (
        <>
          <Stack.Screen name="ManagementDashboard" component={ManagementDashboard} />
          <Stack.Screen name="AccountsManagement" component={AccountsManagementScreen} />
          <Stack.Screen name="PromoCodeManagement" component={PromoCodeManagementScreen} />
          <Stack.Screen name="AddPromoCode" component={CreatePromocodeScreen} />
          <Stack.Screen name="PromoCodeList" component={PromocodesScreen} />
          <Stack.Screen name="EditPromocode" component={EditPromocodeScreen} />
          <Stack.Screen name="PromocodeDetails" component={PromocodeDetailsScreen} />
          <Stack.Screen name="RestaurantManagement" component={RestaurantManagementScreen} />
          <Stack.Screen name="DeliveryZonesManagement" component={DeliveryZonesManagementScreen} />
          <Stack.Screen name="DeliveryManagement" component={DeliveryManagementScreen} />
          <Stack.Screen name="DriversManagement" component={DriversManagementScreen} />
          <Stack.Screen name="OrderAssignment" component={OrderAssignmentScreen} />
          <Stack.Screen name="FinancialReports" component={FinancialReportsScreen} />
          <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ManagementNavigator;


