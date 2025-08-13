import { StatusBar, useColorScheme } from "react-native";
// react-native-gesture-handler
import { GestureHandlerRootView } from "react-native-gesture-handler";
// react-native-reanimated
import Reanimated from "react-native-reanimated";
// navigation-layouts
import Navigation from "./src/navigators";
// i18n
/* import "./src/locales/i18n"; */
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
} from "@expo-google-fonts/inter"; // Import Inter fonts
// theme
import ThemedApp from "./src/theme";
// custom alert component
import Alert from "./src/components/Alert";

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
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={scheme === "dark" ? "#000000" : "#ffffff"}
      />
      <ThemedApp>
        <Navigation />
        <Alert />
      </ThemedApp>
    </GestureHandlerRootView>
  );
}
