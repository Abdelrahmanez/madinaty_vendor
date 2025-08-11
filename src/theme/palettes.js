export const LightTheme = {
  dark: false,
  mode: "adaptive",
  roundness: {
    xs: 10,    // Extra small (inputs, chips)
    sm: 12,    // Small (buttons, cards)
    md: 16,   // Medium (modals, dialogs)
    lg: 20,   // Large (bottom sheets)
    xl: 24,   // Extra large (floating components)
    full: 9999, // Fully rounded (badges, avatars)
  },
  colors: {
    primary: "#E01105",
    onPrimary: "#FFFFFF",
    primaryContainer: "#FFCDD2",
    onPrimaryContainer: "#8B0000",
    secondary: "#404040",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E0E0E0",
    onSecondaryContainer: "#262626",
    tertiary: "#00796B",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#B2DFDB",
    onTertiaryContainer: "#004D44",
    error: "#C62828",
    onError: "#FFFFFF",
    errorContainer: "#FFCDD2",
    onErrorContainer: "#870000",
    background: "#FFFFFF",
    onBackground: "#262626",
    surface: "#FFFFFF",
    onSurface: "#262626",
    surfaceVariant: "#F0F0F0",
    onSurfaceVariant: "#404040",
    outline: "#808080",
    outlineVariant: "#CCCCCC",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#262626",
    inverseOnSurface: "#F0F0F0",
    inversePrimary: "#FF6B61",
    elevation: {
      level0: "transparent",
      level1: "#F8F8F8", // تغيير من #FCF8E3 (الأصفر) إلى رمادي فاتح محايد
      level2: "#F5F5F5",
      level3: "#F0F0F0",
      level4: "#EDEDED",
      level5: "#EBEBEB",
    },
    surfaceDisabled: "rgba(38, 38, 38, 0.12)",
    onSurfaceDisabled: "rgba(38, 38, 38, 0.38)",
    backdrop: "rgba(38, 38, 38, 0.4)",
    success: "#4CD137",
  },
};

export const DarkTheme = {
  dark: true,
  mode: "adaptive",
  roundness: {
    xs: 10,    // Extra small (inputs, chips)
    sm: 12,    // Small (buttons, cards)
    md: 16,   // Medium (modals, dialogs)
    lg: 20,   // Large (bottom sheets)
    xl: 24,   // Extra large (floating components)
    full: 9999, // Fully rounded (badges, avatars)
  },
  colors: {
    primary: "#E01105",
    onPrimary: "#FFFFFF",
    primaryContainer: "#7D0000",
    onPrimaryContainer: "#FFCDD2",
    secondary: "#E0E0E0",
    onSecondary: "#262626",
    secondaryContainer: "#404040",
    onSecondaryContainer: "#E0E0E0",
    tertiary: "#00796B",
    onTertiary: "#004D44",
    tertiaryContainer: "#00695C",
    onTertiaryContainer: "#B2DFDB",
    error: "#C62828",
    onError: "#FFFFFF",
    errorContainer: "#870000",
    onErrorContainer: "#FFCDD2",
    background: "#262626",
    onBackground: "#E0E0E0",
    surface: "#262626",
    onSurface: "#E0E0E0",
    surfaceVariant: "#404040",
    onSurfaceVariant: "#CCCCCC",
    outline: "#808080",
    outlineVariant: "#646464",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#E0E0E0",
    inverseOnSurface: "#262626",
    inversePrimary: "#FF6B61",
    elevation: {
      level0: "transparent",
      level1: "#404040",
      level2: "#2E2E2E",
      level3: "#1C1C1C",
      level4: "#141414",
      level5: "#0A0A0A",
    },
    surfaceDisabled: "rgba(224, 224, 224, 0.12)",
    onSurfaceDisabled: "rgba(224, 224, 224, 0.38)",
    backdrop: "rgba(224, 224, 224, 0.4)",
    success: "#4CD137",
  },
};
