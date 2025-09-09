import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MoreScreen from '../features/more/screens/moreScreen';

const Stack = createNativeStackNavigator();

const MoreNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
    </Stack.Navigator>
  );
};

export default MoreNavigator;
