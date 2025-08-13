// react native paper
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
// stores
import useThemeStore from "../stores/themeStore";
// palettes
import { DarkTheme, LightTheme } from "./palettes";

// --------------------------------------------------------------------

function ThemedApp({ children }) {
  const { mode } = useThemeStore();

  return (
    <PaperProvider
      theme={{
        fonts: {
          ...DefaultTheme.fonts,
          regular: {
            fontFamily: "Inter-Regular",
            fontWeight: "400",
          },
          medium: {
            fontFamily: "Inter-Medium",
            fontWeight: "500",
          },
          light: {
            fontFamily: "Inter-Light",
            fontWeight: "300",
          },
          thin: {
            fontFamily: "Inter-Thin",
            fontWeight: "100",
          },
          bold: {
            fontFamily: "Inter-Bold",
            fontWeight: "700",
          },
          semiBold: {
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          },
        },
        roundness: 1.5, // Adjust border radius for buttons and cards
        button: {
          height: 50, // Adjust button height
          fontSize: 16, // Adjust button text size
          elevation: 2, // Minimal box shadow effect
        },
        colors: mode === "dark" ? DarkTheme.colors : LightTheme.colors,
      }}
    >
      {children}
    </PaperProvider>
  );
}

export default ThemedApp;
