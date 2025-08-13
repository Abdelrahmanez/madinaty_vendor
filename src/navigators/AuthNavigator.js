import React from "react";
// react-navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// screens
import WelcomeScreen from "../screens/welcomeScreen";
import LoginScreen from "../screens/loginScreen";

// -------------------------------------------------------------------------------------------------------------

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      options={{ headerShown: false }}
      component={WelcomeScreen}
    />
    <Stack.Screen
      name="Login"
      options={{ headerShown: false }}
      component={LoginScreen}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
