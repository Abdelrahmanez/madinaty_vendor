import React from "react";
// react-navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// screens
import HomeScreen from "../screens/homeScreen";

// Create navigators
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
