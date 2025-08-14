import React from "react";
import { StatusBar, useColorScheme } from "react-native";
// react-native-gesture-handler
import { GestureHandlerRootView } from "react-native-gesture-handler";
// safe area context
import { SafeAreaProvider } from 'react-native-safe-area-context';
// navigation-layouts
import Navigation from "./src/navigators";
// i18n
import "./src/locales/i18n";
// expo app loading
import SplashScreen from "expo-splash-screen";
// custom fonts
import { useFonts } from "expo-font";
import {
  Inter_100Thin,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
// theme
import ThemedApp from "./src/theme";
// custom alert component
import Alert from "./src/components/Alert";
// notifications context
import NotificationsProvider from "./src/context/NotificationsContext";
// network context for monitoring internet connection
import NetworkProvider from "./src/context/NetworkContext";
// connection alert component
import ConnectionAlert from "./src/components/ConnectionAlert";

// إزالة تعديل المكونات الافتراضية لتجنب المشاكل

// ------------------------------------------------------------------

export default function App() {
  const scheme = useColorScheme(); // Detect system theme

  let [fontsLoaded] = useFonts({
    "Inter-Thin": Inter_100Thin,
    "Inter-Light": Inter_300Light,
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    
    // خطوط Almarai
    "Almarai-Light": require("./assets/fonts/Almarai/Almarai-Light.ttf"),
    "Almarai-Regular": require("./assets/fonts/Almarai/Almarai-Regular.ttf"),
    "Almarai-Bold": require("./assets/fonts/Almarai/Almarai-Bold.ttf"),
    "Almarai-ExtraBold": require("./assets/fonts/Almarai/Almarai-ExtraBold.ttf"),
    
    // خط SpaceMono السابق
    "SpaceMono-Regular": require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={scheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <ThemedApp>
          <NetworkProvider>
            <NotificationsProvider>
              <Navigation />
              <Alert />
              <ConnectionAlert />
            </NotificationsProvider>
          </NetworkProvider>
        </ThemedApp>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
