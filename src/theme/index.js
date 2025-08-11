// react native paper
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";
// stores
import useThemeStore from "../stores/themeStore";
// palettes
import { DarkTheme, LightTheme } from "./palettes";
// font sizes
import { fontSize, DEFAULT_FONT_FAMILY } from "./fontSizes";

// --------------------------------------------------------------------

// تكوين الخطوط لـ React Native Paper
const fontConfig = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontWeight: '500', // تطبيق وزن خط أثقل
};

// تكوين الخطوط لجميع الأجهزة والأحجام
const fonts = configureFonts({
  config: {
    default: fontConfig,
  },
});

function ThemedApp({ children }) {
  const { mode } = useThemeStore();
  const activeTheme = mode === "dark" ? DarkTheme : LightTheme;

  return (
    <PaperProvider
      theme={{
        ...DefaultTheme,
        fonts: {
          ...fonts,
          regular: {
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: "400",
          },
          medium: {
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: "500",
          },
          light: {
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: "300",
          },
          thin: {
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: "100",
          },
          bold: {
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: "700",
          },
          semiBold: {
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: "600",
          },
        },
        // Default roundness for React Native Paper components
        roundness: 12,
        // Our custom roundness values
        roundnessValues: activeTheme.roundness,
        button: {
          height: 50, // Adjust button height
          fontSize: fontSize.lg, // Use our fontSize utility
          elevation: 2, // Minimal box shadow effect
        },
        // Font sizes
        fontSize,
        colors: activeTheme.colors,
      }}
    >
      {children}
    </PaperProvider>
  );
}

export default ThemedApp;
