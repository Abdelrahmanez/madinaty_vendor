import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../features/profile/screens/profileScreen';
import AddressScreen from '../features/profile/screens/addressScreen';
import PaymentMethodsScreen from '../features/profile/screens/paymentMethodsScreen';
import NotificationSettingsScreen from '../features/profile/screens/notificationSettingsScreen';
import LanguageSettingsScreen from '../features/profile/screens/languageSettingsScreen';
import SupportScreen from '../features/profile/screens/supportScreen';
import SettingsScreen from '../features/profile/screens/settingsScreen';
import AboutScreen from '../features/profile/screens/aboutScreen';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
