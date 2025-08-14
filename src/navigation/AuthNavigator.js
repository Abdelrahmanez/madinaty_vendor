import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../features/auth/screens/loginScreen';
import SignupScreen from '../features/auth/screens/signupScreen';
import ChangePasswordScreen from '../features/auth/screens/changePasswordScreen';
import WelcomeScreen from '../features/auth/screens/welcomeScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;


